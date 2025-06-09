import {
  render,
  screen,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import { useAuth } from '../context/AuthContext';
import {
  getUserProfile,
  getUserPlaylists,
  createPlaylist,
} from '../api/Spotify.api';
import Playlists from './Playlists';

jest.mock('../context/AuthContext');
jest.mock('../api/Spotify.api');

const mockUseAuth = useAuth as jest.Mock;
const mockGetUserProfile = getUserProfile as jest.Mock;
const mockGetUserPlaylists = getUserPlaylists as jest.Mock;
const mockCreatePlaylist = createPlaylist as jest.Mock;

const mockUserData = { id: 'user1', display_name: 'Test User' };
const mockPlaylistsData = {
  items: [
    {
      id: 'p1',
      name: 'My Favs',
      images: [{ url: 'p1.jpg' }],
      tracks: { total: 10 },
    },
    {
      id: 'p2',
      name: 'Road Trip',
      images: [{ url: 'p2.jpg' }],
      tracks: { total: 50 },
    },
  ],
};

describe('Playlists', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      token: 'fake-token',
      logout: jest.fn(),
    });

    mockGetUserProfile.mockResolvedValue({
      status: 200,
      json: () => Promise.resolve(mockUserData),
    });
    mockGetUserPlaylists.mockResolvedValue({
      status: 200,
      json: () => Promise.resolve(mockPlaylistsData),
    });
  });

  it('should render loading state initially', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    mockGetUserPlaylists.mockReturnValue(new Promise(() => {}));

    render(<Playlists />);
    expect(
      screen.getByText('Carregando playlists...'),
    ).toBeInTheDocument();
  });

  it('should fetch user and playlists and display them', async () => {
    render(<Playlists />);

    await waitFor(() => {
      expect(screen.getByText('My Favs')).toBeInTheDocument();
      expect(screen.getByText('10 músicas')).toBeInTheDocument();
      expect(screen.getByText('Road Trip')).toBeInTheDocument();
      expect(screen.getByText('50 músicas')).toBeInTheDocument();
    });

    expect(mockGetUserProfile).toHaveBeenCalledWith('fake-token');
    expect(mockGetUserPlaylists).toHaveBeenCalledWith('fake-token', 10);
  });

  it('should open modal on "Criar Playlist" button click', async () => {
    render(<Playlists />);
    await waitFor(() =>
      expect(screen.getByText('My Favs')).toBeInTheDocument(),
    );

    const createButton = screen.getByRole('button', {
      name: /Criar Playlist/i,
    });
    fireEvent.click(createButton);

    expect(
      screen.getByText('Dê um nome à sua playlist:'),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Nome da playlist'),
    ).toBeInTheDocument();
  });

  it('should create a new playlist and refresh the list', async () => {
    mockCreatePlaylist.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: 'new-p' }),
    });
    render(<Playlists />);
    await waitFor(() =>
      expect(screen.getByText('My Favs')).toBeInTheDocument(),
    );

    fireEvent.click(
      screen.getByRole('button', { name: /Criar Playlist/i }),
    );

    const input = screen.getByPlaceholderText('Nome da playlist');
    fireEvent.change(input, { target: { value: 'New Awesome Playlist' } });

    const createInModalButton = screen.getByRole('button', {
      name: 'Criar',
    });
    fireEvent.click(createInModalButton);

    await waitFor(() => {
      expect(mockCreatePlaylist).toHaveBeenCalledWith(
        'fake-token',
        'user1',
        'New Awesome Playlist',
      );
      expect(mockGetUserPlaylists).toHaveBeenCalledTimes(2);
    });
  });
});
