import { useState, useEffect } from 'react';

const Profile = ({ token, onLogout }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!token) return;

    fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setProfile(data))
    .catch(err => console.error("Error fetching profile:", err));
  }, [token]);

  if (!profile) return <div className="profile-container">Carregando perfil...</div>;

  return (
    <header className="profile-container">
      <h2>Bem-vindo, {profile.display_name}</h2>
      <button onClick={onLogout} className="logout-button">Sair</button>
    </header>
  );
};

export default Profile;
