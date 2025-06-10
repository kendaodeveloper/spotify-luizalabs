import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import { getAccessToken } from '../api/Spotify.api';

const Callback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { token, login, logout, cleanStorageAndToken } = useAuth();

  useEffect(() => {
    const handleAuth = async () => {
      if (token) {
        return; // already logged in
      }

      const code = searchParams.get('code');
      const error = searchParams.get('error');
      const stateAsClientId = searchParams.get('state');
      const codeVerifier = window.sessionStorage.getItem('code_verifier');

      cleanStorageAndToken();

      if (error) {
        console.warn(`Unable to log in: ${error}`);
        logout();
        return;
      }

      if (code && codeVerifier) {
        try {
          const clientId =
            stateAsClientId || process.env.REACT_APP_CLIENT_ID;
          if (!clientId) {
            throw new Error('Client ID is missing.');
          }

          const tokenData = await getAccessToken(
            clientId,
            code,
            codeVerifier,
          );

          if (tokenData.access_token) {
            login(tokenData.access_token);
          } else {
            logout();
          }
        } catch (e) {
          console.error('Authentication failed:', e);
          logout();
        }
      } else {
        logout();
      }
    };

    handleAuth();
  }, [searchParams, token, login, logout, cleanStorageAndToken]);

  return <Loading message="Autenticando e redirecionando..." />;
};

export default Callback;
