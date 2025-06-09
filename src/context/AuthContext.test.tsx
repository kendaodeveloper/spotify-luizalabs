import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { AuthProvider, useAuth } from './AuthContext';

const mockedNavigate = jest.fn();
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: () => mockedNavigate,
}));

const AuthTestConsumer = () => {
  const { token, login, logout } = useAuth();
  return (
    <div>
      <div data-testid="token-display">{token || 'No Token'}</div>
      <button onClick={() => login('new-test-token')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

const ComponentOutsideProvider = () => {
  useAuth();
  return <div>This should not render</div>;
};

const renderWithRouter = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="*" element={ui} />
      </Routes>
    </MemoryRouter>,
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const localStorageMock = (() => {
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

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
    Object.defineProperty(window, 'sessionStorage', {
      value: localStorageMock,
      writable: true,
    });

    window.localStorage.clear();
  });

  it('should provide initial token from localStorage', () => {
    window.localStorage.setItem(
      'spotify_access_token',
      'initial-token-from-storage',
    );
    renderWithRouter(
      <AuthProvider>
        <AuthTestConsumer />
      </AuthProvider>,
    );
    expect(screen.getByTestId('token-display')).toHaveTextContent(
      'initial-token-from-storage',
    );
  });

  it('should update token and localStorage on login, then navigate', () => {
    renderWithRouter(
      <AuthProvider>
        <AuthTestConsumer />
      </AuthProvider>,
    );

    expect(screen.getByTestId('token-display')).toHaveTextContent(
      'No Token',
    );

    const loginButton = screen.getByRole('button', { name: /Login/i });
    fireEvent.click(loginButton);

    expect(screen.getByTestId('token-display')).toHaveTextContent(
      'new-test-token',
    );
    expect(window.localStorage.getItem('spotify_access_token')).toBe(
      'new-test-token',
    );

    expect(mockedNavigate).toHaveBeenCalledWith('/');
  });

  it('should clear token and localStorage on logout, then navigate', () => {
    window.localStorage.setItem(
      'spotify_access_token',
      'token-to-be-cleared',
    );
    renderWithRouter(
      <AuthProvider>
        <AuthTestConsumer />
      </AuthProvider>,
    );

    expect(screen.getByTestId('token-display')).toHaveTextContent(
      'token-to-be-cleared',
    );

    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    fireEvent.click(logoutButton);

    expect(screen.getByTestId('token-display')).toHaveTextContent(
      'No Token',
    );
    expect(window.localStorage.getItem('spotify_access_token')).toBeNull();

    expect(mockedNavigate).toHaveBeenCalledWith('/login');
  });

  it('should throw error when useAuth is used outside of AuthProvider', () => {
    const originalError = console.error;
    console.error = jest.fn();

    expect(() => render(<ComponentOutsideProvider />)).toThrow(
      'useAuth deve ser usado dentro de um AuthProvider',
    );

    console.error = originalError;
  });
});
