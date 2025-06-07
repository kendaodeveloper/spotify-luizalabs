import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../api/Spotify';

const Profile = () => {
  const { token, logout } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!token) return;

    getUserProfile(token)
    .then(res => { if (res.status === 401) { logout(); return null; } return res.json(); })
    .then(data => setUser(data))
    .catch(err => console.error("Error fetching user profile:", err));
  }, [token, logout]);

  if (!user) {
    return <div>Carregando perfil...</div>;
  }

  return (
    <section>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
        {user.images?.[0]?.url && (
          <img src={user.images[0].url} alt={user.display_name} style={{ width: 150, height: 150, borderRadius: '50%' }} />
        )}
        <div>
          <h2 style={{ margin: 0 }}>{user.display_name}</h2>
          <p style={{ color: '#b3b3b3' }}>{user.email}</p>
          <p style={{ color: '#b3b3b3' }}>{user.followers.total} seguidores</p>
        </div>
      </div>

      <button onClick={logout} className="logout-button">
        Logout
      </button>
    </section>
  );
};

export default Profile;
