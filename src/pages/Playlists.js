import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, getUserPlaylists, createPlaylist } from '../api/Spotify';

const Playlists = () => {
  const { token, logout } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [user, setUser] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  useEffect(() => {
    if (!token) return;
    getUserProfile(token)
      .then(res => { if (res.status === 401) { logout(); return null; } return res.json(); })
      .then(data => setUser(data))
      .catch(err => console.error("Error fetching user:", err));
  }, [token, logout]);

  const fetchPlaylists = useCallback(() => {
    if (!token) return;

    // TODO: Add pagination
    getUserPlaylists(token, 10)
      .then(res => { if (res.status === 401) { logout(); return null; } return res.json(); })
      .then(data => setPlaylists(data?.items || []))
      .catch(err => console.error("Error fetching playlists:", err));
  }, [token, logout]);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const handleCreatePlaylist = () => {
    if (!user?.id || !newPlaylistName.trim()) return;
    createPlaylist(token, user.id, newPlaylistName)
      .then(res => {
        if (!res.ok) throw new Error('Failed creating playlist');
        return res.json();
      })
      .then(() => {
        fetchPlaylists();
        setShowDialog(false);
        setNewPlaylistName('');
      })
      .catch(err => console.error("Error creating playlist:", err));
  };

  if (!user || !playlists || !playlists.length) {
    return <div>Carregando playlists...</div>;
  }

  return (
    <section>
      <div className="artist-header">
        <div>
          <h2 className="section-title">Minhas Playlists</h2>
          <p className="section-subtitle">Sua coleção pessoal de playlists</p>
        </div>
        <button className="login-button" onClick={() => setShowDialog(true)}>
          Criar Playlist
        </button>
      </div>

      <div className="single-column">
        {playlists.map(playlist => (
          <div className="artist-card" key={playlist.id}>
            {playlist.images?.[0]?.url ? (
              <img src={playlist.images[0].url} alt={playlist.name} className="artist-round-image" />
            ) : (
              <div className="artist-round-image" style={{ backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🎵</div>
            )}
            <div>
              <h4 className="artist-name">{playlist.name}</h4>
              <p>{playlist.tracks.total} músicas</p>
            </div>
          </div>
        ))}
      </div>

      {showDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <button className="dialog-close" onClick={() => setShowDialog(false)}>×</button>
            <label className="dialog-label">Dê um nome à sua playlist</label>
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="dialog-input"
              placeholder="Nome da playlist"
            />
            <button onClick={handleCreatePlaylist} className="login-button">Criar</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Playlists;
