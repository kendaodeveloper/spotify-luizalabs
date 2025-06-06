import { ReactComponent as SpotifyIcon } from './../assets/spotify.svg';
import { generateRandomString, generateCodeChallenge } from './../utils/Pkce';

const Login = () => {
  const handleLogin = async () => {
    const clientId = process.env.REACT_APP_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_URI + '/callback';

    const codeVerifier = generateRandomString(128);
    window.localStorage.setItem('code_verifier', codeVerifier);

    const codeChallenge = await generateCodeChallenge(codeVerifier);

    const scope = 'user-read-private user-read-email user-top-read playlist-read-private';
    
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
      <h1>spotify-luizalabs</h1>
      <SpotifyIcon className="spotify-icon" />
      <button onClick={handleLogin} className="login-button">
        Login com Spotify
      </button>
    </div>
  );
};

export default Login;