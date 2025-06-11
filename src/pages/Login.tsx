import './Login.css';

import SpotifyImage from './../assets/spotify.png';
import {
  generateRandomString,
  generateCodeChallenge,
} from '../utils/PKCE';
import { useSearchParams } from 'react-router';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const Login: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { cleanStorageAndToken } = useAuth();

  const handleLogin = async () => {
    cleanStorageAndToken();

    const clientId =
      searchParams.get('client_id') || process.env.REACT_APP_CLIENT_ID;
    const redirectUri = `${process.env.REACT_APP_URI}/callback`;

    if (!clientId || !redirectUri) {
      console.error('Client ID or Redirect URI not configured!');
      return;
    }

    const codeVerifier = generateRandomString(128);
    window.sessionStorage.setItem('code_verifier', codeVerifier);

    const codeChallenge = await generateCodeChallenge(codeVerifier);

    const scope =
      'user-read-private user-read-email user-top-read playlist-read-private playlist-modify-public playlist-modify-private';
    const authUrl = new URL('https://accounts.spotify.com/authorize');

    const params = {
      response_type: 'code',
      client_id: clientId,
      scope,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: redirectUri,
      state: clientId,
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
  };

  return (
    <div className="login-container">
      <img src={SpotifyImage} alt="Spotify" className="spotify-icon" />
      <h4>Entre com sua conta Spotify clicando no botão abaixo</h4>
      <Button onClick={handleLogin}>Entrar</Button>
    </div>
  );
};

export default Login;
