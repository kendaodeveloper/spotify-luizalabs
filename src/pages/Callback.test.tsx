import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { useAuth } from '../context/AuthContext';
import Callback from './Callback';

jest.mock('../context/AuthContext');
const mockUseAuth = useAuth as jest.Mock;

describe('Callback', () => {
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

    global.fetch = jest.fn();
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
    expect(fetch).not.toHaveBeenCalled();
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
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ access_token: 'new-spotify-token' }),
    });

    render(
      <MemoryRouter initialEntries={['/callback?code=test_code']}>
        <Callback />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(cleanStorageAndTokenMock).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        'https://accounts.spotify.com/api/token',
        expect.any(Object),
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
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false });

    render(
      <MemoryRouter initialEntries={['/callback?code=test_code']}>
        <Callback />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(cleanStorageAndTokenMock).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledTimes(1);
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
      expect(fetch).not.toHaveBeenCalled();
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
      expect(fetch).not.toHaveBeenCalled();
    });
  });
});
