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
import { AuthError } from '../api/Spotify.dto';

jest.mock('../context/AuthContext');
jest.mock('../hooks/useInfiniteScroll');
jest.mock('../api/Spotify.api');

const mockUseAuth = useAuth as jest.Mock;
const mockUseInfiniteScroll = useInfiniteScroll as jest.Mock;
const mockApi = api as jest.Mocked<typeof api>;

const mockReset = jest.fn();

describe('Playlists Page', () => {
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
      reset: mockReset,
      error: null,
    });

    mockApi.getUserProfile.mockResolvedValue({
      id: 'user-1',
      display_name: 'Test User',
      images: [],
    });
  });

  test('fetches user and renders playlists from the hook', async () => {
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
      reset: mockReset,
    });

    render(<Playlists />);

    await waitFor(() => {
      expect(screen.getByText('My Favs')).toBeInTheDocument();
      expect(screen.getByText('10 músicas')).toBeInTheDocument();
    });
    expect(mockApi.getUserProfile).toHaveBeenCalledWith('fake-token');
  });

  test('opens, fills, and submits the create playlist modal, then resets the list', async () => {
    mockApi.createPlaylist.mockResolvedValue();

    render(<Playlists />);

    await screen.findByText('Criar Playlist');
    fireEvent.click(screen.getByText('Criar Playlist'));

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

    expect(mockReset).toHaveBeenCalled();
  });

  test('shows loading state when hook indicates loading', () => {
    mockUseInfiniteScroll.mockReturnValue({
      items: [],
      loading: true,
      hasMore: true,
      loaderRef: jest.fn(),
      reset: mockReset,
    });

    render(<Playlists />);
    expect(
      screen.getByText('Carregando playlists...'),
    ).toBeInTheDocument();
  });

  test('calls logout if getUserProfile fails with AuthError', async () => {
    const mockLogoutFn = jest.fn();
    mockUseAuth.mockReturnValue({
      token: 'fake-token',
      logout: mockLogoutFn,
    });

    mockApi.getUserProfile.mockRejectedValue(
      new AuthError('Token Inválido'),
    );

    render(<Playlists />);

    await waitFor(() => {
      expect(mockLogoutFn).toHaveBeenCalled();
    });
  });

  test('shows an error message if useInfiniteScroll returns an error', async () => {
    mockUseInfiniteScroll.mockReturnValue({
      items: [],
      loading: false,
      hasMore: false,
      loaderRef: jest.fn(),
      reset: mockReset,
      error: new Error('Failed to load playlists'),
    });

    render(<Playlists />);

    await waitFor(() => {
      expect(mockApi.getUserProfile).toHaveBeenCalled();
    });

    expect(
      screen.getByText('Ocorreu um erro, tente novamente mais tarde.'),
    ).toBeInTheDocument();
  });
});
