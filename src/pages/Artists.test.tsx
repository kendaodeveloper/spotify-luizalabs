import React from 'react';
import { render, screen } from '@testing-library/react';
import Artists from '../pages/Artists';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

jest.mock('../hooks/useInfiniteScroll');
// eslint-disable-next-line @typescript-eslint/no-explicit-any, react/display-name
jest.mock('../components/Card', () => (props: any) => (
  <div data-testid="card">{props.title}</div>
));
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

const mockUseInfiniteScroll = useInfiniteScroll as jest.Mock;

describe('Artists Component', () => {
  test('displays loading state initially', () => {
    mockUseInfiniteScroll.mockReturnValue({
      items: [],
      loading: true,
      hasMore: true,
      loaderRef: jest.fn(),
    });

    render(<Artists />);
    expect(screen.getByText('Carregando artistas...')).toBeInTheDocument();
  });

  test('displays message when no artists are found', () => {
    mockUseInfiniteScroll.mockReturnValue({
      items: [],
      loading: false,
      hasMore: false,
      loaderRef: jest.fn(),
    });

    render(<Artists />);
    expect(
      screen.getByText('Nenhum artista encontrado.'),
    ).toBeInTheDocument();
  });

  test('renders a list of artists', () => {
    const mockArtists = [
      { id: '1', name: 'Artist One', images: [{ url: 'url1' }] },
      { id: '2', name: 'Artist Two', images: [{ url: 'url2' }] },
    ];

    mockUseInfiniteScroll.mockReturnValue({
      items: mockArtists,
      loading: false,
      hasMore: true,
      loaderRef: jest.fn(),
    });

    render(<Artists />);
    expect(screen.getByText('Artist One')).toBeInTheDocument();
    expect(screen.getByText('Artist Two')).toBeInTheDocument();
    expect(screen.getAllByTestId('card')).toHaveLength(2);
  });

  test('displays loading more indicator during pagination', () => {
    const mockArtists = [
      { id: '1', name: 'Artist One', images: [{ url: 'url1' }] },
    ];
    mockUseInfiniteScroll.mockReturnValue({
      items: mockArtists,
      loading: true,
      hasMore: true,
      loaderRef: jest.fn(),
    });

    render(<Artists />);
    expect(screen.getByText('Artist One')).toBeInTheDocument();
    expect(screen.getByText('Carregando mais...')).toBeInTheDocument();
  });
});
