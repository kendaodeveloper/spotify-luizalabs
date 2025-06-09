import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import Playlists from '../pages/Playlists';
import { useAuth } from '../context/AuthContext';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import * as api from '../api/Spotify.api';

jest.mock('../context/AuthContext');
jest.mock('../hooks/useInfiniteScroll');
jest.mock('../api/Spotify.api');

const mockUseAuth = useAuth as jest.Mock;
const mockUseInfiniteScroll = useInfiniteScroll as jest.Mock;
const mockApi = api as jest.Mocked<typeof api>;

describe('Playlists Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      token: 'fake-token',
      logout: jest.fn(),
    });
    mockUseInfiniteScroll.mockReturnValue({
      items: [],
      loading: false,
      hasMore: false,
      loaderRef: jest.fn(),
    });
    mockApi.getUserProfile.mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({ id: 'user-1', display_name: 'Test User' }),
    } as Response);
  });

  test('fetches user and renders playlists', async () => {
    const mockPlaylists = [
      {
        id: 'p1',
        name: 'My Favs',
        images: [{ url: 'url1' }],
        tracks: { total: 10 },
      },
    ];
    mockUseInfiniteScroll.mockReturnValue({
      items: mockPlaylists,
      loading: false,
      hasMore: false,
      loaderRef: jest.fn(),
    });

    render(<Playlists />);

    await waitFor(() => {
      expect(screen.getByText('My Favs')).toBeInTheDocument();
      expect(screen.getByText('10 músicas')).toBeInTheDocument();
    });
    expect(mockApi.getUserProfile).toHaveBeenCalledWith('fake-token');
  });

  test('opens, fills, and submits the create playlist modal', async () => {
    mockApi.createPlaylist.mockResolvedValue({
      ok: true,
      status: 201,
      json: () => Promise.resolve({ id: 'new-playlist' }),
    } as Response);

    render(<Playlists />);

    await waitFor(() => {
      expect(screen.getByText('Criar Playlist')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Criar Playlist'));

    expect(
      screen.getByText('Dê um nome à sua playlist:'),
    ).toBeInTheDocument();

    const input = screen.getByPlaceholderText('Nome da playlist');
    const createButton = screen.getByRole('button', { name: 'Criar' });

    fireEvent.change(input, { target: { value: 'New Awesome Playlist' } });
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(mockApi.createPlaylist).toHaveBeenCalledWith(
        'fake-token',
        'user-1',
        'New Awesome Playlist',
      );
    });
  });

  test('shows loading state when user and playlists are loading', () => {
    mockUseInfiniteScroll.mockReturnValue({
      items: [],
      loading: true,
      hasMore: true,
      loaderRef: jest.fn(),
    });

    render(<Playlists />);
    expect(
      screen.getByText('Carregando playlists...'),
    ).toBeInTheDocument();
  });
});
