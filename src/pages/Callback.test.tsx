import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { useAuth } from '../context/AuthContext';
import Callback from './Callback';
import { getAccessToken } from '../api/Spotify.api';

jest.mock('../context/AuthContext');
jest.mock('../api/Spotify.api');

const mockUseAuth = useAuth as jest.Mock;
const mockGetAccessToken = getAccessToken as jest.Mock;

describe('Callback Page', () => {
  let loginMock: jest.Mock;
  let logoutMock: jest.Mock;
  let cleanStorageAndTokenMock: jest.Mock;
  let sessionStorageMock: Storage;

  beforeEach(() => {
    loginMock = jest.fn();
    logoutMock = jest.fn();
    cleanStorageAndTokenMock = jest.fn();

    sessionStorageMock = (() => {
      let store: { [key: string]: string } = {};
      return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
          store[key] = value;
        },
        removeItem: (key: string) => {
          delete store[key];
        },
        clear: () => {
          store = {};
        },
        length: 0,
        key: () => null,
      };
    })();
    Object.defineProperty(window, 'sessionStorage', {
      value: sessionStorageMock,
      writable: true,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should do nothing if the user is already logged in', () => {
    mockUseAuth.mockReturnValue({
      token: 'existing-token',
      login: loginMock,
      logout: logoutMock,
      cleanStorageAndToken: cleanStorageAndTokenMock,
    });

    render(<Callback />, { wrapper: MemoryRouter });

    expect(loginMock).not.toHaveBeenCalled();
    expect(logoutMock).not.toHaveBeenCalled();
    expect(mockGetAccessToken).not.toHaveBeenCalled();
    expect(cleanStorageAndTokenMock).not.toHaveBeenCalled();
  });

  it('should exchange the code for a token and log in', async () => {
    mockUseAuth.mockReturnValue({
      token: null,
      login: loginMock,
      logout: logoutMock,
      cleanStorageAndToken: cleanStorageAndTokenMock,
    });
    window.sessionStorage.setItem('code_verifier', 'test_verifier');
    mockGetAccessToken.mockResolvedValue({
      access_token: 'new-spotify-token',
    });

    render(
      <MemoryRouter
        initialEntries={['/callback?code=test_code&state=mock-client-id']}
      >
        <Callback />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(cleanStorageAndTokenMock).toHaveBeenCalledTimes(1);
      expect(mockGetAccessToken).toHaveBeenCalledWith(
        'mock-client-id',
        'test_code',
        'test_verifier',
      );
      expect(loginMock).toHaveBeenCalledWith('new-spotify-token');
      expect(logoutMock).not.toHaveBeenCalled();
    });
  });

  it('should call logout if the token exchange fails', async () => {
    mockUseAuth.mockReturnValue({
      token: null,
      login: loginMock,
      logout: logoutMock,
      cleanStorageAndToken: cleanStorageAndTokenMock,
    });
    window.sessionStorage.setItem('code_verifier', 'test_verifier');
    mockGetAccessToken.mockRejectedValue(new Error('API request failed'));

    render(
      <MemoryRouter initialEntries={['/callback?code=test_code']}>
        <Callback />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(cleanStorageAndTokenMock).toHaveBeenCalledTimes(1);
      expect(mockGetAccessToken).toHaveBeenCalledTimes(1);
      expect(loginMock).not.toHaveBeenCalled();
      expect(logoutMock).toHaveBeenCalledTimes(1);
    });
  });

  it('should call logout if there is an error in the URL parameters', async () => {
    mockUseAuth.mockReturnValue({
      token: null,
      login: loginMock,
      logout: logoutMock,
      cleanStorageAndToken: cleanStorageAndTokenMock,
    });

    render(
      <MemoryRouter initialEntries={['/callback?error=access_denied']}>
        <Callback />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(cleanStorageAndTokenMock).toHaveBeenCalledTimes(1);
      expect(mockGetAccessToken).not.toHaveBeenCalled();
      expect(logoutMock).toHaveBeenCalledTimes(1);
    });
  });

  it('should call logout if the code or verifier is missing', async () => {
    mockUseAuth.mockReturnValue({
      token: null,
      login: loginMock,
      logout: logoutMock,
      cleanStorageAndToken: cleanStorageAndTokenMock,
    });
    window.sessionStorage.removeItem('code_verifier');

    render(
      <MemoryRouter initialEntries={['/callback?code=test_code']}>
        <Callback />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(cleanStorageAndTokenMock).toHaveBeenCalledTimes(1);
      expect(logoutMock).toHaveBeenCalledTimes(1);
      expect(mockGetAccessToken).not.toHaveBeenCalled();
    });
  });
});
