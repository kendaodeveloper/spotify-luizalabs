import { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(window.localStorage.getItem('spotify_access_token'));
  const navigate = useNavigate();

  const cleanStorageAndToken = () => {
    window.localStorage.removeItem('spotify_access_token');
    window.sessionStorage.removeItem('code_verifier');
    setToken(null);
  };

  const login = (newToken) => {
    cleanStorageAndToken();

    window.localStorage.setItem('spotify_access_token', newToken);
    setToken(newToken);

    navigate('/');
  };

  const logout = () => {
    cleanStorageAndToken();

    navigate('/login');
  };

  const value = { token, login, logout, cleanStorageAndToken };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
