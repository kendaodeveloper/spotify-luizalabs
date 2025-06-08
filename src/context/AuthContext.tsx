import { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

interface IAuthContext {
  token: string | null;
  login: (_newToken: string) => void;
  logout: () => void;
  cleanStorageAndToken: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    window.localStorage.getItem('spotify_access_token'),
  );
  const navigate = useNavigate();

  const cleanStorageAndToken = () => {
    window.localStorage.removeItem('spotify_access_token');
    window.sessionStorage.removeItem('code_verifier');
    setToken(null);
  };

  const login = (newToken: string) => {
    cleanStorageAndToken();
    window.localStorage.setItem('spotify_access_token', newToken);
    setToken(newToken);
    navigate('/');
  };

  const logout = () => {
    cleanStorageAndToken();
    navigate('/login');
  };

  const value: IAuthContext = {
    token,
    login,
    logout,
    cleanStorageAndToken,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
