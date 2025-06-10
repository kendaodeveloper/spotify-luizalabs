import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Login from './Login';
import { useAuth } from '../context/AuthContext';
import * as PKCE from '../utils/PKCE';

jest.mock('../context/AuthContext');
jest.mock('../utils/PKCE', () => ({
  generateRandomString: jest.fn(),
  generateCodeChallenge: jest.fn(),
}));

const mockUseAuth = useAuth as jest.Mock;

describe('Login', () => {
  let cleanStorageMock: jest.Mock;
  let locationMock: Location;

  beforeEach(() => {
    cleanStorageMock = jest.fn();
    mockUseAuth.mockReturnValue({
      cleanStorageAndToken: cleanStorageMock,
    });

    locationMock = window.location;
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    delete window.location;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.location = { ...locationMock, href: '' } as Location as any;

    const sessionStorageMock = (() => {
      let store: { [key: string]: string } = {};
      return {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
          store[key] = value.toString();
        }),
        removeItem: jest.fn((key: string) => {
          delete store[key];
        }),
        clear: jest.fn(() => {
          store = {};
        }),
        length: 0,
        key: jest.fn((index: number) => Object.keys(store)[index] || null),
      };
    })();
    Object.defineProperty(window, 'sessionStorage', {
      value: sessionStorageMock,
      writable: true,
    });
  });

  afterEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    window.location = locationMock as any;
    jest.clearAllMocks();
  });

  it('should call clean storage, generate PKCE values, and redirect on login button click (env mode)', async () => {
    (PKCE.generateRandomString as jest.Mock).mockReturnValue(
      'mock_verifier',
    );
    (PKCE.generateCodeChallenge as jest.Mock).mockResolvedValue(
      'mock_challenge',
    );

    process.env.REACT_APP_CLIENT_ID = 'test-client-id';
    process.env.REACT_APP_URI = 'http://localhost:3000';

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
    );

    const loginButton = screen.getByRole('button', { name: /Entrar/i });
    fireEvent.click(loginButton);

    await screen.findByRole('button');

    expect(cleanStorageMock).toHaveBeenCalledTimes(1);

    expect(PKCE.generateRandomString).toHaveBeenCalledWith(128);
    expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
      'code_verifier',
      'mock_verifier',
    );
    expect(PKCE.generateCodeChallenge).toHaveBeenCalledWith(
      'mock_verifier',
    );

    const expectedUrl =
      'https://accounts.spotify.com/authorize?response_type=code&client_id=test-client-id&scope=user-read-private+user-read-email+user-top-read+playlist-read-private+playlist-modify-public+playlist-modify-private&code_challenge_method=S256&code_challenge=mock_challenge&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&state=test-client-id';
    expect(window.location.href).toBe(expectedUrl);
  });

  it('should call clean storage, generate PKCE values, and redirect on login button click (param mode)', async () => {
    (PKCE.generateRandomString as jest.Mock).mockReturnValue(
      'mock_verifier',
    );
    (PKCE.generateCodeChallenge as jest.Mock).mockResolvedValue(
      'mock_challenge',
    );

    process.env.REACT_APP_CLIENT_ID = 'test-client-id';
    process.env.REACT_APP_URI = 'http://localhost:3000';

    render(
      <MemoryRouter initialEntries={['/login?client_id=my-param-client']}>
        <Login />
      </MemoryRouter>,
    );

    const loginButton = screen.getByRole('button', { name: /Entrar/i });
    fireEvent.click(loginButton);

    await screen.findByRole('button');

    expect(cleanStorageMock).toHaveBeenCalledTimes(1);

    expect(PKCE.generateRandomString).toHaveBeenCalledWith(128);
    expect(window.sessionStorage.setItem).toHaveBeenCalledWith(
      'code_verifier',
      'mock_verifier',
    );
    expect(PKCE.generateCodeChallenge).toHaveBeenCalledWith(
      'mock_verifier',
    );

    const expectedUrl =
      'https://accounts.spotify.com/authorize?response_type=code&client_id=my-param-client&scope=user-read-private+user-read-email+user-top-read+playlist-read-private+playlist-modify-public+playlist-modify-private&code_challenge_method=S256&code_challenge=mock_challenge&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&state=my-param-client';
    expect(window.location.href).toBe(expectedUrl);
  });
});
