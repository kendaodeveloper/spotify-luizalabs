import SpotifyImage from './../assets/spotify.png';
import { generateRandomString, generateCodeChallenge } from './../utils/Pkce';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { cleanStorageAndToken } = useAuth();

  const handleLogin = async () => {
    cleanStorageAndToken();

    // Make sure your URI is correctly set in your .env file and Spotify Developer Dashboard

    const clientId = process.env.REACT_APP_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_URI + '/callback';

    // Using OAuth 2.0 with PKCE

    const codeVerifier = generateRandomString(128);
    window.sessionStorage.setItem('code_verifier', codeVerifier);

    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // Setting permissions
    const scope = 'user-read-private user-read-email user-top-read playlist-read-private playlist-modify-public playlist-modify-private';
    
    const authUrl = new URL("https://accounts.spotify.com/authorize"); 

    const params = {
      response_type: 'code',
      client_id: clientId,
      scope: scope,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: redirectUri,
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();
  };

  return (
    <div className="login-container">
      <img src={SpotifyImage} alt="Spotify" className="spotify-icon" />
      <h4>Entre com sua conta Spotify clicando no botão abaixo</h4>
      <button onClick={handleLogin} className="login-button">
        Entrar
      </button>
    </div>
  );
};

export default Login;
