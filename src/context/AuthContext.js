import { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(window.localStorage.getItem('spotify_access_token'));
  const navigate = useNavigate();

  const login = (newToken) => {
    window.localStorage.setItem('spotify_access_token', newToken);
    window.sessionStorage.removeItem('code_verifier'); 
    setToken(newToken);
    navigate('/');
  };

  const logout = () => {
    window.localStorage.removeItem('spotify_access_token');
    window.sessionStorage.removeItem('code_verifier');
    setToken(null);
    navigate('/login');
  };

  const value = { token, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
