import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getArtistAlbums } from '../api/Spotify.api';
import Loading from '../components/Loading';
import Card from '../components/Card';
import { Album } from '../api/Spotify.dto';

interface ArtistLocationState {
  artistName: string;
  artistImage: string;
}

const ArtistAlbums: React.FC = () => {
  const { token, logout } = useAuth();
  const { artistId } = useParams<{ artistId: string }>();
  const location = useLocation();
  const state = location.state as ArtistLocationState;

  const artistName = state?.artistName || 'Artista';
  const artistImage = state?.artistImage;

  const [albums, setAlbums] = useState<Album[] | null>(null);

  useEffect(() => {
    if (!token || !artistId) return;

    getArtistAlbums(token, artistId, 20)
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          logout();
          return null;
        }
        return res.json();
      })
      .then((data) => setAlbums(data?.items || []))
      .catch((err) =>
        console.error(`Error fetching albums for ${artistName}:`, err),
      );
  }, [token, logout, artistId, artistName]);

  if (!albums) {
    return <Loading message="Carregando álbuns..." />;
  }

  if (albums.length === 0) {
    return <div>Nenhum álbum encontrado para este artista.</div>;
  }

  return (
    <section>
      <div className="artist-header">
        <div className="artist-info">
          <Link to="/artists" className="artist-back-link">
            <ArrowLeft className="artist-back-icon" />
            <span className="artist-name">{artistName}</span>
          </Link>
        </div>
        {artistImage && (
          <img
            src={artistImage}
            className="artist-header-image"
            alt={artistName}
          />
        )}
      </div>
      <div className="card-container">
        {albums.map((album) => (
          <Card
            key={album.id}
            shape="square"
            image={album.images[0]?.url}
            title={album.name}
            subtitle={album.release_date}
          />
        ))}
      </div>
    </section>
  );
};

export default ArtistAlbums;
