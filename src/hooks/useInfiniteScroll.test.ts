import { renderHook, act, waitFor } from '@testing-library/react';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useAuth } from '../context/AuthContext';
import { AuthError } from '../api/Spotify.dto';

jest.mock('../context/AuthContext');
const mockUseAuth = useAuth as jest.Mock;
const mockLogout = jest.fn();

const mockFetchFunction = jest.fn();

const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
});
window.IntersectionObserver = mockIntersectionObserver;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createMockData = (items: any[], next: string | null) => {
  return Promise.resolve({
    items,
    next,
    total: 50,
    limit: 20,
    offset: items.length,
    href: 'https://mock.url',
  });
};

beforeEach(() => {
  jest.clearAllMocks();
  mockUseAuth.mockReturnValue({
    token: 'fake-token',
    logout: mockLogout,
  });
  mockIntersectionObserver.mockClear();
  mockIntersectionObserver.mockReturnValue({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  });
});

describe('useInfiniteScroll Hook', () => {
  test('should set initial state correctly and fetch initial items', async () => {
    const initialItems = [{ id: 1 }];
    mockFetchFunction.mockReturnValue(
      createMockData(initialItems, 'next-url'),
    );

    const { result } = renderHook(() =>
      useInfiniteScroll(mockFetchFunction),
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.items).toEqual(initialItems);
    expect(result.current.hasMore).toBe(true);
    expect(mockFetchFunction).toHaveBeenCalledWith('fake-token', 20, 0);
  });

  test('should load more items when loader is visible', async () => {
    const initialItems = Array.from({ length: 20 }, (_, i) => ({ id: i }));
    const moreItems = Array.from({ length: 20 }, (_, i) => ({
      id: i + 20,
    }));

    mockFetchFunction
      .mockReturnValueOnce(createMockData(initialItems, 'next-url'))
      .mockReturnValueOnce(createMockData(moreItems, 'last-url'));

    const { result } = renderHook(() =>
      useInfiniteScroll(mockFetchFunction),
    );

    await waitFor(() => expect(result.current.items.length).toBe(20));
    expect(result.current.hasMore).toBe(true);

    act(() => {
      result.current.loaderRef(document.createElement('div'));
    });

    const observerCallback = mockIntersectionObserver.mock.calls[0][0];
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    await waitFor(() => expect(result.current.items.length).toBe(40));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((result.current.items[39] as any).id).toBe(39);
    expect(mockFetchFunction).toHaveBeenCalledTimes(2);
    expect(mockFetchFunction).toHaveBeenCalledWith('fake-token', 20, 20);
  });

  test('should set hasMore to false when there are no more items', async () => {
    mockFetchFunction.mockReturnValue(createMockData([{ id: 1 }], null));

    const { result } = renderHook(() =>
      useInfiniteScroll(mockFetchFunction),
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.hasMore).toBe(false);
  });

  test('should call logout on AuthError', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .mockImplementation(() => {});

    mockFetchFunction.mockRejectedValue(new AuthError('Session expired'));

    renderHook(() => useInfiniteScroll(mockFetchFunction));

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  test('should reset state when fetchFunction changes', async () => {
    const firstFetch = jest
      .fn()
      .mockReturnValue(createMockData([{ id: 1 }], 'next'));
    const secondFetch = jest
      .fn()
      .mockReturnValue(createMockData([{ id: 2 }], null));

    const { result, rerender } = renderHook(
      ({ fetchFn }) => useInfiniteScroll(fetchFn),
      { initialProps: { fetchFn: firstFetch } },
    );

    await waitFor(() => expect(result.current.items.length).toBe(1));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((result.current.items[0] as any).id).toBe(1);

    rerender({ fetchFn: secondFetch });

    await waitFor(() => expect(result.current.items.length).toBe(1));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((result.current.items[0] as any).id).toBe(2);
    expect(result.current.hasMore).toBe(false);
    expect(firstFetch).toHaveBeenCalledTimes(1);
    expect(secondFetch).toHaveBeenCalledTimes(1);
  });
});
