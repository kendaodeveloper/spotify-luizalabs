import { useAuth } from './../context/AuthContext';
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Profile from '../components/Profile';
import TopArtists from '../components/TopArtists';
import ArtistAlbums from '../components/ArtistAlbums';
import UserPlaylists from '../components/UserPlaylists';

const Home = () => {
  const { token, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [selectedArtist, setSelectedArtist] = useState(null);

  useEffect(() => {
    if (!token) {
      console.warn('Unable to access home page: empty token!')
      return;
    }

    fetch('https://api.spotify.com/v1/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setUser(data))
    .catch(err => console.error("Error fetching user profile:", err));
  }, [token]);

  const handleArtistClick = (artist) => {
    setSelectedArtist(artist);
  };

  const handleBackToMain = () => {
    setSelectedArtist(null);
  };

  return (
    <div className="home-layout">
      <Sidebar />
      <main className="main-content">
        <Profile user={user} onLogout={logout} />

        {selectedArtist ? (
          <div>
            <button onClick={handleBackToMain} className="logout-button" style={{marginBottom: '20px'}}>
              &larr; Voltar
            </button>
            <ArtistAlbums token={token} artist={selectedArtist} />
          </div>
        ) : (
          <>
            <TopArtists token={token} onArtistClick={handleArtistClick} />
            <UserPlaylists token={token} userId={user?.id} />
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
