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

jest.mock('../context/AuthContext');
jest.mock('../api/Spotify.api');

const mockUseAuth = useAuth as jest.Mock;
const mockGetUserProfile = getUserProfile as jest.Mock;

const mockUserData = {
  display_name: 'John Doe',
  images: [{ url: 'profile.jpg' }],
};

describe('Profile', () => {
  it('should render loading state initially', () => {
    mockUseAuth.mockReturnValue({ token: 'fake-token' });
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    mockGetUserProfile.mockReturnValue(new Promise(() => {}));

    render(<Profile />, { wrapper: MemoryRouter });
    expect(screen.getByText('Carregando perfil...')).toBeInTheDocument();
  });

  it('should fetch and display user profile', async () => {
    mockUseAuth.mockReturnValue({ token: 'fake-token' });
    mockGetUserProfile.mockResolvedValue({
      status: 200,
      json: () => Promise.resolve(mockUserData),
    });

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
    mockGetUserProfile.mockResolvedValue({
      status: 200,
      json: () => Promise.resolve(mockUserData),
    });

    render(<Profile />, { wrapper: MemoryRouter });

    await waitFor(() =>
      expect(
        screen.getByRole('button', { name: /Sair/i }),
      ).toBeInTheDocument(),
    );

    const logoutButton = screen.getByRole('button', { name: /Sair/i });
    fireEvent.click(logoutButton);

    expect(logoutMock).toHaveBeenCalledTimes(1);
  });

  it('should render a placeholder if user has no image', async () => {
    mockUseAuth.mockReturnValue({ token: 'fake-token' });
    const userWithoutImage = { ...mockUserData, images: [] };
    mockGetUserProfile.mockResolvedValue({
      status: 200,
      json: () => Promise.resolve(userWithoutImage),
    });

    render(<Profile />, { wrapper: MemoryRouter });

    await waitFor(() => {
      expect(screen.getByText('J')).toBeInTheDocument();
    });
  });
});
