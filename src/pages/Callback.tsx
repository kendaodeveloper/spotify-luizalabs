import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import { SpotifyTokenResponse } from '../api/Spotify.dto';

const Callback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { token, login, logout, cleanStorageAndToken } = useAuth();

  useEffect(() => {
    if (token) {
      return; // already logged in
    }

    const code = searchParams.get('code');
    const codeVerifier = window.sessionStorage.getItem('code_verifier');
    const error = searchParams.get('error');

    cleanStorageAndToken();

    if (code && codeVerifier) {
      const clientId =
        searchParams.get('client_id') || process.env.REACT_APP_CLIENT_ID;
      const redirectUri = `${process.env.REACT_APP_URI}/callback`;

      const params = new URLSearchParams();
      if (clientId) {
        params.append('client_id', clientId);
      }
      params.append('grant_type', 'authorization_code');
      params.append('code', code);
      params.append('redirect_uri', redirectUri);
      params.append('code_verifier', codeVerifier);

      fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed getting token');
          }
          return res.json() as Promise<SpotifyTokenResponse>;
        })
        .then((data) => {
          if (data.access_token) {
            login(data.access_token);
          } else {
            logout();
          }
        })
        .catch(() => {
          logout();
        });
    } else {
      if (error) {
        console.warn(`Unable to log in: ${error}`);
      }
      logout();
    }
  }, [searchParams, token, login, logout, cleanStorageAndToken]);

  return <Loading message="Autenticando e redirecionando..." />;
};

export default Callback;
