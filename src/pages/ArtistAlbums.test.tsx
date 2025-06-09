import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { getArtistAlbums } from '../api/Spotify.api';
import ArtistAlbums from './ArtistAlbums';

jest.mock('../context/AuthContext');
jest.mock('../api/Spotify.api');

const mockUseAuth = useAuth as jest.Mock;
const mockGetArtistAlbums = getArtistAlbums as jest.Mock;

const mockAlbumsData = {
  items: [
    {
      id: 'album1',
      name: 'Album One',
      release_date: '2023-01-01',
      images: [{ url: 'album1.jpg' }],
    },
    {
      id: 'album2',
      name: 'Album Two',
      release_date: '2022-02-02',
      images: [{ url: 'album2.jpg' }],
    },
  ],
};

const artistLocationState = {
  artistName: 'Test Artist',
  artistImage: 'artist.jpg',
};

const renderComponent = () => {
  return render(
    <MemoryRouter
      initialEntries={[
        { pathname: '/artists/123', state: artistLocationState },
      ]}
    >
      <Routes>
        <Route path="/artists/:artistId" element={<ArtistAlbums />} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('ArtistAlbums', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    mockUseAuth.mockReturnValue({ token: 'fake-token' });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    mockGetArtistAlbums.mockReturnValue(new Promise(() => {}));

    renderComponent();
    expect(screen.getByText('Carregando álbuns...')).toBeInTheDocument();
  });

  it('should fetch and display albums for a given artist', async () => {
    mockUseAuth.mockReturnValue({ token: 'fake-token' });
    mockGetArtistAlbums.mockResolvedValue({
      status: 200,
      json: () => Promise.resolve(mockAlbumsData),
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Album One')).toBeInTheDocument();
      expect(screen.getByText('2023-01-01')).toBeInTheDocument();
      expect(screen.getByText('Album Two')).toBeInTheDocument();
    });

    expect(screen.getByText('Test Artist')).toBeInTheDocument();
    expect(screen.getByAltText('Test Artist')).toHaveAttribute(
      'src',
      'artist.jpg',
    );
    expect(mockGetArtistAlbums).toHaveBeenCalledWith(
      'fake-token',
      '123',
      20,
    );
  });

  it('should display a message if no albums are found', async () => {
    mockUseAuth.mockReturnValue({ token: 'fake-token' });
    mockGetArtistAlbums.mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ items: [] }),
    });

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText('Nenhum álbum encontrado para este artista.'),
      ).toBeInTheDocument();
    });
  });

  it('should call logout on 403 API response', async () => {
    const logoutMock = jest.fn();
    mockUseAuth.mockReturnValue({
      token: 'fake-token',
      logout: logoutMock,
    });
    mockGetArtistAlbums.mockResolvedValue({ status: 403 });

    renderComponent();

    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalledTimes(1);
    });
  });
});
