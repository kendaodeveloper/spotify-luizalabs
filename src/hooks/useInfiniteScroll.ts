import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthError, PaginatedResponse } from '../api/Spotify.dto';

export function useInfiniteScroll<T>(
  fetchFunction: (
    token: string,
    limit: number,
    offset: number,
  ) => Promise<PaginatedResponse<T>>,
) {
  const { token, logout } = useAuth();
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const offsetRef = useRef<number>(0);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<boolean>(false);

  const LIMIT = 20;

  const reset = useCallback(() => {
    setItems([]);
    offsetRef.current = 0;
    setHasMore(true);
  }, []);

  const loadMoreItems = useCallback(async () => {
    if (!token || loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const data = await fetchFunction(token, LIMIT, offsetRef.current);

      setItems((prevItems) => [...prevItems, ...data.items]);
      offsetRef.current += data.items.length;
      setHasMore(data.next !== null);
    } catch (e) {
      console.error('Error fetching data:', e);
      if (e instanceof AuthError) {
        logout();
      }
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [token, fetchFunction, logout]);

  useEffect(() => {
    reset();
  }, [fetchFunction, reset]);

  useEffect(() => {
    if (items.length === 0 && hasMore) {
      loadMoreItems();
    }
  }, [items, hasMore, loadMoreItems]);

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

  return { items, loading, hasMore, loaderRef, reset };
}
