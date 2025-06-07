import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, getUserPlaylists, createPlaylist } from '../api/Spotify';

const Playlists = () => {
  const { token, logout } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!token) return;

    getUserProfile(token)
    .then(res => { if (res.status === 401) { logout(); return null; } return res.json(); })
    .then(data => setUser(data))
    .catch(err => console.error("Error fetching user:", err));
  }, [token, logout]);

  const fetchPlaylists = useCallback(() => {
    if (!token) return;

    getUserPlaylists(token, 10)
    .then(res => { if (res.status === 401) { logout(); return null; } return res.json(); })
    .then(data => setPlaylists(data?.items || []))
    .catch(err => console.error("Error fetching playlists:", err));
  }, [token, logout]);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const createNewPlaylist = () => {
    if (!user?.id) {
        console.error("Unable to create playlist: Invalid user id.");
        return;
    }

    const playlistName = prompt("Qual será o nome da sua playlist?");
    if (!playlistName) return;

    createPlaylist(token, user.id, playlistName)
    .then(res => {
        if (!res.ok) throw new Error('Failed creating playlist');
        return res.json();
    })
    .then(() => {
        alert('Playlist criada com sucesso!');
        fetchPlaylists();
    })
    .catch(err => console.error("Error creating playlist:", err));
  };

  if (!user || !playlists || !playlists.length) {
    return <div>Carregando playlists...</div>;
  }

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Suas Playlists</h2>
        <button onClick={createNewPlaylist} className="login-button">
          + Criar Playlist
        </button>
      </div>
      <div className="grid-container" style={{marginTop: '20px'}}>
        {playlists.map(playlist => (
          <div className="card" key={playlist.id}>
            {(playlist.images && playlist.images[0]) ?
              <img src={playlist.images[0].url} alt={playlist.name} /> :
              <div style={{height: 180, backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px'}}>🎵</div>
            }
            <div className="card-content">
              <h4>{playlist.name}</h4>
              <p>{playlist.tracks.total} músicas</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Playlists;
