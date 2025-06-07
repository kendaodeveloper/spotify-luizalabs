import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getArtistAlbums } from '../api/Spotify';
import { FaArrowLeft } from 'react-icons/fa';

const ArtistAlbums = () => {
  const { token, logout } = useAuth();
  const { artistId } = useParams();
  const location = useLocation();
  const artistName = location.state?.artistName || 'Artista';
  const artistImage = location.state?.artistImage;

  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    if (!token || !artistId) return;

    // TODO: Add pagination
    getArtistAlbums(token, artistId, 20)
      .then(res => { if (res.status === 401) { logout(); return null; } return res.json(); })
      .then(data => setAlbums(data?.items || []))
      .catch(err => console.error(`Error fetching albums for ${artistName}:`, err));
  }, [token, logout, artistId, artistName]);

  if (!albums || !albums.length) {
    return <div>Carregando álbuns...</div>;
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

      <div className="single-column">
        {albums.map(album => (
          <div key={album.id} className="album-card">
            <img src={album.images[0]?.url} alt={album.name} className="album-image" />
            <div className="album-info">
              <h4>{album.name}</h4>
              <p>{album.release_date}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ArtistAlbums;
