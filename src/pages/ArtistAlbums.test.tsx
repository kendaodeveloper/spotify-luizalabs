import React from 'react';
import { render, screen } from '@testing-library/react';
import ArtistAlbums from '../pages/ArtistAlbums';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useParams, useLocation } from 'react-router';

jest.mock('../hooks/useInfiniteScroll');
// eslint-disable-next-line @typescript-eslint/no-explicit-any, react/display-name
jest.mock('../components/Card', () => (props: any) => (
  <div data-testid="card">{props.title}</div>
));

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: jest.fn(),
  useLocation: jest.fn(),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

const mockUseInfiniteScroll = useInfiniteScroll as jest.Mock;
const mockUseParams = useParams as jest.Mock;
const mockUseLocation = useLocation as jest.Mock;

describe('ArtistAlbums Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ artistId: '123' });
    mockUseLocation.mockReturnValue({
      state: {
        artistName: 'Test Artist',
        artistImage: 'image-url.jpg',
      },
    });
    mockUseInfiniteScroll.mockReturnValue({
      items: [],
      loading: false,
      hasMore: false,
      loaderRef: jest.fn(),
      error: null,
    });
  });

  test('shows initial loading state', () => {
    mockUseInfiniteScroll.mockReturnValue({
      items: [],
      loading: true,
      hasMore: true,
      loaderRef: jest.fn(),
    });

    render(<ArtistAlbums />);
    expect(screen.getByText('Carregando álbuns...')).toBeInTheDocument();
  });

  test('shows message when no albums are found', () => {
    mockUseInfiniteScroll.mockReturnValue({
      items: [],
      loading: false,
      hasMore: false,
      loaderRef: jest.fn(),
    });

    render(<ArtistAlbums />);
    expect(
      screen.getByText('Nenhum álbum encontrado para este artista.'),
    ).toBeInTheDocument();
  });

  test('renders artist header and album list', () => {
    const mockAlbums = [
      {
        id: 'a1',
        name: 'Album One',
        images: [{ url: 'url1' }],
        release_date: '2023',
      },
      {
        id: 'a2',
        name: 'Album Two',
        images: [{ url: 'url2' }],
        release_date: '2024',
      },
    ];
    mockUseInfiniteScroll.mockReturnValue({
      items: mockAlbums,
      loading: false,
      hasMore: true,
      loaderRef: jest.fn(),
    });

    render(<ArtistAlbums />);

    expect(screen.getByText('Test Artist')).toBeInTheDocument();
    expect(screen.getByAltText('Test Artist')).toHaveAttribute(
      'src',
      'image-url.jpg',
    );
    expect(screen.getByText('Album One')).toBeInTheDocument();
    expect(screen.getByText('Album Two')).toBeInTheDocument();
    expect(screen.getAllByTestId('card')).toHaveLength(2);
  });

  test('uses default name when location state is missing', () => {
    mockUseLocation.mockReturnValue({ state: null });
    const mockAlbums = [
      {
        id: 'a1',
        name: 'Album One',
        images: [{ url: 'url1' }],
        release_date: '2023',
      },
    ];
    mockUseInfiniteScroll.mockReturnValue({
      items: mockAlbums,
      loading: false,
      hasMore: false,
      loaderRef: jest.fn(),
    });

    render(<ArtistAlbums />);
    expect(screen.getByText('Artista')).toBeInTheDocument();
  });

  test('shows error message when hook returns an error', () => {
    mockUseInfiniteScroll.mockReturnValue({
      items: [],
      loading: false,
      hasMore: false,
      loaderRef: jest.fn(),
      error: new Error('Failed to fetch'),
    });

    render(<ArtistAlbums />);
    expect(
      screen.getByText('Ocorreu um erro, tente novamente mais tarde.'),
    ).toBeInTheDocument();
  });
});
