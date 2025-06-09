import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getUserProfile,
  getUserPlaylists,
  createPlaylist,
} from '../api/Spotify.api';
import Loading from '../components/Loading';
import Button from '../components/Button';
import Modal from '../components/Modal';
import SectionHeader from '../components/SectionHeader';
import Card from '../components/Card';
import { Playlist, SpotifyUser } from '../api/Spotify.dto';

const Playlists: React.FC = () => {
  const { token, logout } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[] | null>(null);
  const [user, setUser] = useState<SpotifyUser | null>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [newPlaylistName, setNewPlaylistName] = useState<string>('');

  useEffect(() => {
    if (!token) return;
    getUserProfile(token)
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          logout();
          return null;
        }
        return res.json();
      })
      .then((data) => setUser(data))
      .catch((err) => console.error('Error fetching user:', err));
  }, [token, logout]);

  const fetchPlaylists = useCallback(() => {
    if (!token) return;

    getUserPlaylists(token, 10)
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          logout();
          return null;
        }
        return res.json();
      })
      .then((data) => setPlaylists(data?.items || []))
      .catch((err) => console.error('Error fetching playlists:', err));
  }, [token, logout]);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const handleCreatePlaylist = () => {
    if (!token || !user?.id || !newPlaylistName.trim()) return;
    createPlaylist(token, user.id, newPlaylistName)
      .then((res) => {
        if (!res.ok) throw new Error('Failed creating playlist');
        return res.json();
      })
      .then(() => {
        fetchPlaylists();
        setShowDialog(false);
        setNewPlaylistName('');
      })
      .catch((err) => console.error('Error creating playlist:', err));
  };

  if (!user || !playlists) {
    return <Loading message="Carregando playlists..." />;
  }

  return (
    <section>
      <div className="artist-header">
        <SectionHeader
          title="Minhas Playlists"
          subtitle="Sua coleção pessoal de playlists"
        />
        <Button onClick={() => setShowDialog(true)}>Criar Playlist</Button>
      </div>
      <div className="card-container">
        {playlists.map((playlist) => (
          <Card
            key={playlist.id}
            shape="square"
            image={playlist.images?.[0]?.url}
            title={playlist.name}
            subtitle={`${playlist.tracks.total} músicas`}
          />
        ))}
      </div>
      <Modal isOpen={showDialog} onClose={() => setShowDialog(false)}>
        <label className="dialog-label">Dê um nome à sua playlist:</label>
        <input
          type="text"
          value={newPlaylistName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewPlaylistName(e.target.value)
          }
          className="dialog-input"
          placeholder="Nome da playlist"
        />
        <Button onClick={handleCreatePlaylist}>Criar</Button>
      </Modal>
    </section>
  );
};

export default Playlists;
