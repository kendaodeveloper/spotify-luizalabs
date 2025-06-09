import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

interface SpotifyPaginatedResponse<T> {
  items: T[];
  next: string | null;
  total: number;
}

export function useInfiniteScroll<T>(
  fetchFunction: (
    token: string,
    limit: number,
    offset: number,
  ) => Promise<Response>,
) {
  const { token, logout } = useAuth();
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const offsetRef = useRef<number>(0);
  const observer = useRef<IntersectionObserver>(null);

  const LIMIT = 20;

  const loadMoreItems = useCallback(() => {
    if (!token) return;
    setLoading(true);

    fetchFunction(token, LIMIT, offsetRef.current)
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          logout();
          return null;
        }
        return res.json() as Promise<SpotifyPaginatedResponse<T>>;
      })
      .then((data) => {
        if (data) {
          setItems((prevItems) => [...prevItems, ...data.items]);
          offsetRef.current += data.items.length;
          setHasMore(data.next !== null);
        }
      })
      .catch((err) => console.error('Error fetching data:', err))
      .finally(() => setLoading(false));
  }, [token, logout, fetchFunction]);

  useEffect(() => {
    setItems([]);
    offsetRef.current = 0;
    setHasMore(true);
    setLoading(true);
    loadMoreItems();
  }, [fetchFunction, loadMoreItems]);

  const loaderRef = useCallback(
    (node: HTMLElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreItems();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMoreItems],
  );

  return { items, loading, hasMore, loaderRef };
}
