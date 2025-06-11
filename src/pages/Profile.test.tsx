import {
  render,
  screen,
  waitFor,
  fireEvent,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Profile from './Profile';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../api/Spotify.api';
import { AuthError } from '../api/Spotify.dto';

jest.mock('../context/AuthContext');
jest.mock('../api/Spotify.api');

const mockUseAuth = useAuth as jest.Mock;
const mockGetUserProfile = getUserProfile as jest.Mock;

const mockUserData = {
  display_name: 'John Doe',
  images: [{ url: 'profile.jpg' }],
};

describe('Profile Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render loading state initially', () => {
    mockUseAuth.mockReturnValue({
      token: 'fake-token',
      logout: jest.fn(),
    });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    mockGetUserProfile.mockReturnValue(new Promise(() => {}));

    render(<Profile />, { wrapper: MemoryRouter });
    expect(screen.getByText('Carregando perfil...')).toBeInTheDocument();
  });

  it('should fetch and display user profile', async () => {
    mockUseAuth.mockReturnValue({
      token: 'fake-token',
      logout: jest.fn(),
    });
    mockGetUserProfile.mockResolvedValue(mockUserData);

    render(<Profile />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'John Doe' }),
      ).toBeInTheDocument();
      expect(screen.getByAltText('John Doe')).toHaveAttribute(
        'src',
        'profile.jpg',
      );
    });
  });

  it('should call logout when the logout button is clicked', async () => {
    const logoutMock = jest.fn();
    mockUseAuth.mockReturnValue({
      token: 'fake-token',
      logout: logoutMock,
    });
    mockGetUserProfile.mockResolvedValue(mockUserData);

    render(<Profile />, { wrapper: MemoryRouter });

    const logoutButton = await screen.findByRole('button', {
      name: /Sair/i,
    });
    fireEvent.click(logoutButton);

    expect(logoutMock).toHaveBeenCalledTimes(1);
  });

  it('should render a placeholder if user has no image', async () => {
    mockUseAuth.mockReturnValue({
      token: 'fake-token',
      logout: jest.fn(),
    });
    const userWithoutImage = { ...mockUserData, images: [] };
    mockGetUserProfile.mockResolvedValue(userWithoutImage);

    render(<Profile />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(screen.getByText('J')).toBeInTheDocument();
    });
  });

  it('should call logout if fetching profile fails with AuthError', async () => {
    const logoutMock = jest.fn();
    mockUseAuth.mockReturnValue({
      token: 'fake-token',
      logout: logoutMock,
    });
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .mockImplementation(() => {});

    mockGetUserProfile.mockRejectedValue(new AuthError('Token expirado'));

    render(<Profile />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalledTimes(1);
    });

    consoleErrorSpy.mockRestore();
  });

  it('should display a generic error message if fetching fails with a non-auth error', async () => {
    mockUseAuth.mockReturnValue({
      token: 'fake-token',
      logout: jest.fn(),
    });
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .mockImplementation(() => {});

    mockGetUserProfile.mockRejectedValue(new Error('Network Error'));

    render(<Profile />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(
        screen.getByText('Ocorreu um erro, tente novamente mais tarde.'),
      ).toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });
});
