import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Callback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get('code');
    const codeVerifier = window.localStorage.getItem('code_verifier');

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
          throw new Error('Falha ao trocar o código pelo token');
        }
        return res.json();
      })
      .then(data => {
        if (data.access_token) {
          window.localStorage.removeItem('code_verifier');
          window.localStorage.setItem('spotify_access_token', data.access_token);
          navigate('/');
        }
      })
      .catch(err => {
        console.error('Erro na troca do token:', err);
        navigate('/login');
      });
    } else {
        navigate('/login');
    }
  }, [searchParams, navigate]);

  return <div>Autenticando...</div>;
};

export default Callback;
