import './Playlists.css';

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
import { AuthError, Playlist, User } from '../api/Spotify.dto';

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
    reset,
    error,
  } = useInfiniteScroll<Playlist>(fetchPlaylistsFn);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;

      try {
        const userData = await getUserProfile(token);
        setUser(userData);
      } catch (e) {
        console.error('Error fetching user:', e);

        if (e instanceof AuthError) {
          logout();
        }
      }
    };

    fetchUserData();
  }, [token, logout]);

  const handleCreatePlaylist = async () => {
    if (!token || !user?.id || !newPlaylistName.trim()) return;

    try {
      await createPlaylist(token, user.id, newPlaylistName);

      setShowDialog(false);
      setNewPlaylistName('');
      reset();
    } catch (e) {
      console.error('Error creating playlist:', e);
    }
  };

  if (error) {
    return <div>Ocorreu um erro, tente novamente mais tarde.</div>;
  }

  if (!user || (loading && playlists.length === 0)) {
    return <Loading message="Carregando playlists..." />;
  }

  return (
    <section>
      <div className="playlist-header">
        <SectionHeader
          title="Minhas Playlists"
          subtitle="Sua coleção pessoal de playlists"
        />
        <Button onClick={() => setShowDialog(true)}>Criar Playlist</Button>
      </div>

      {!loading && playlists.length === 0 && (
        <div>Nenhuma playlist encontrada.</div>
      )}

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
      {hasMore && (
        <div ref={loaderRef} className="loader-container">
          {loading && <Loading message="Carregando mais..." />}
        </div>
      )}
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
