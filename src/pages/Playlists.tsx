import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getUserProfile,
  getUserPlaylists,
  createPlaylist,
} from '../api/Spotify.api';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import Loading from '../components/Loading';
import Button from '../components/Button';
import Modal from '../components/Modal';
import SectionHeader from '../components/SectionHeader';
import Card from '../components/Card';
import { Playlist, User } from '../api/Spotify.dto';

const Playlists: React.FC = () => {
  const { token, logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [newPlaylistName, setNewPlaylistName] = useState<string>('');

  const fetchPlaylistsFn = useCallback(
    (authToken: string, limit: number, offset: number) => {
      return getUserPlaylists(authToken, limit, offset);
    },
    [],
  );

  const {
    items: playlists,
    loading,
    hasMore,
    loaderRef,
  } = useInfiniteScroll<Playlist>(fetchPlaylistsFn);

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

  const handleCreatePlaylist = () => {
    if (!token || !user?.id || !newPlaylistName.trim()) return;
    createPlaylist(token, user.id, newPlaylistName)
      .then((res) => {
        if (!res.ok) throw new Error('Failed creating playlist');
        return res.json();
      })
      .then(() => {
        setShowDialog(false);
        setNewPlaylistName('');
      })
      .catch((err) => console.error('Error creating playlist:', err));
  };

  if (!user || (loading && playlists.length === 0)) {
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
      <div ref={loaderRef} style={{ height: '100px', margin: '20px 0' }}>
        {loading && hasMore && <Loading message="Carregando mais..." />}
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
