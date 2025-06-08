import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../api/Spotify';
import Loading from '../components/Loading';

const Profile = () => {
  const { token, logout } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!token) return;

    getUserProfile(token)
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          logout();
          return null;
        }
        return res.json();
      })
      .then(data => setUser(data))
      .catch(err => console.error("Error fetching user profile:", err));
  }, [token, logout]);

  if (!user) {
    return <Loading message="Carregando perfil..." />;
  }

  return (
    <section className="profile-section">
      {user.images?.[0]?.url ? (
        <img
          src={user.images[0].url}
          alt={user.display_name}
          className="profile-image"
        />
      ) : (
        <div className="profile-placeholder">
          {user.display_name?.[0]?.toUpperCase() ?? "?"}
        </div>
      )}
      <h2 className="profile-name">{user.display_name}</h2>
      <button onClick={logout} className="logout-button">
        Sair
      </button>
    </section>
  );
};

export default Profile;
