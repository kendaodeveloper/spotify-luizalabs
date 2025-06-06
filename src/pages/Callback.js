import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from './../context/AuthContext';

const Callback = () => {
  const [searchParams] = useSearchParams();
  const { token, login, logout } = useAuth();

  useEffect(() => {
    if (token) {
      return; // already logged in
    }

    const code = searchParams.get('code');
    const codeVerifier = window.sessionStorage.getItem('code_verifier');
    const error = searchParams.get('error');

    if (code && codeVerifier) {
      const clientId = process.env.REACT_APP_CLIENT_ID;
      const redirectUri = process.env.REACT_APP_URI + '/callback';

      const params = new URLSearchParams();
      params.append('client_id', clientId);
      params.append('grant_type', 'authorization_code');
      params.append('code', code);
      params.append('redirect_uri', redirectUri);
      params.append('code_verifier', codeVerifier);

      fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
      })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to get token');
        }
        return res.json();
      })
      .then(data => {
        if (data.access_token) {
          console.log('Login with success!');
          login(data.access_token);
        } else {
          console.warn('Error fetching access_token!');
          logout();
        }
      })
      .catch(err => {
        console.error('Error fetching token:', err);
        logout();
      });
    } else {
      if (error) {
        console.warn('Unable to log in: ' + error);
      } else {
        console.warn('Error getting token parameters!');
      }
      logout();
    }
  }, [searchParams, token, login, logout]);

  return <div>Autenticando e redirecionando...</div>;
};

export default Callback;
