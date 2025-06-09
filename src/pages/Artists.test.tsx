import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { getTopArtists } from '../api/Spotify.api';
import Artists from './Artists';

jest.mock('../context/AuthContext');
jest.mock('../api/Spotify.api');

const mockUseAuth = useAuth as jest.Mock;
const mockGetTopArtists = getTopArtists as jest.Mock;

const mockArtistsData = {
  items: [
    { id: '1', name: 'Artist One', images: [{ url: 'image1.jpg' }] },
    { id: '2', name: 'Artist Two', images: [{ url: 'image2.jpg' }] },
  ],
};

describe('Artists', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    mockUseAuth.mockReturnValue({
      token: 'fake-token',
      logout: jest.fn(),
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    mockGetTopArtists.mockReturnValue(new Promise(() => {}));

    render(<Artists />, { wrapper: MemoryRouter });
    expect(screen.getByText('Carregando artistas...')).toBeInTheDocument();
  });

  it('should fetch and display top artists', async () => {
    mockUseAuth.mockReturnValue({
      token: 'fake-token',
      logout: jest.fn(),
    });
    mockGetTopArtists.mockResolvedValue({
      status: 200,
      json: () => Promise.resolve(mockArtistsData),
    });

    render(<Artists />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(screen.getByText('Artist One')).toBeInTheDocument();
      expect(screen.getByText('Artist Two')).toBeInTheDocument();
    });

    expect(getTopArtists).toHaveBeenCalledWith('fake-token', 10);
  });

  it('should render a message when no artists are found', async () => {
    mockUseAuth.mockReturnValue({
      token: 'fake-token',
      logout: jest.fn(),
    });
    mockGetTopArtists.mockResolvedValue({
      status: 200,
      json: () => Promise.resolve({ items: [] }),
    });

    render(<Artists />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(
        screen.getByText('Nenhum artista encontrado.'),
      ).toBeInTheDocument();
    });
  });

  it('should call logout on 401 API response', async () => {
    const logoutMock = jest.fn();
    mockUseAuth.mockReturnValue({
      token: 'fake-token',
      logout: logoutMock,
    });
    mockGetTopArtists.mockResolvedValue({ status: 401 });

    render(<Artists />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalledTimes(1);
    });
  });
});
