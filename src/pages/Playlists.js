import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, getUserPlaylists, createPlaylist } from '../api/Spotify';

const Playlists = () => {
  const { token } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!token) return;

    getUserProfile(token)
    .then(res => res.json())
    .then(data => setUser(data))
    .catch(err => console.error("Error fetching user:", err));
  }, [token]);

  const fetchPlaylists = useCallback(() => {
    if (!token) return;

    getUserPlaylists(token, 10)
    .then(res => res.json())
    .then(data => setPlaylists(data.items || []))
    .catch(err => console.error("Error fetching playlists:", err));
  }, [token]);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const createNewPlaylist = () => {
    if (!user?.id) {
        alert("ID do usuário não encontrado. Não é possível criar a playlist.");
        return;
    }

    const playlistName = prompt("Qual será o nome da sua nova playlist?");
    if (!playlistName) return;

    createPlaylist(token, user.id, playlistName)
    .then(res => {
        if (!res.ok) throw new Error('Falha ao criar a playlist');
        return res.json();
    })
    .then(() => {
        alert('Playlist criada com sucesso!');
        fetchPlaylists();
    })
    .catch(err => console.error("Error creating playlist:", err));
  };

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
