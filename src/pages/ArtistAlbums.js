import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { getArtistAlbums } from '../api/Spotify';
import Loading from '../components/Loading';
import Card from '../components/Card';

const ArtistAlbums = () => {
  const { token, logout } = useAuth();
  const { artistId } = useParams();
  const location = useLocation();
  const artistName = location.state?.artistName || 'Artista';
  const artistImage = location.state?.artistImage;

  const [albums, setAlbums] = useState(null);

  useEffect(() => {
    if (!token || !artistId) return;

    // TODO: Add pagination
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
            <FaArrowLeft className="artist-back-icon" />
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
