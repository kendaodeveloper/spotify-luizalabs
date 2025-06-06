import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import { getArtistAlbums } from '../api/Spotify';

const ArtistaDetalhes = () => {
  const { token } = useAuth();
  const { artistId } = useParams();
  const location = useLocation();
  const artistName = location.state?.artistName || 'Artista';

  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    if (!token || !artistId) return;

    getArtistAlbums(token, artistId, 20)
    .then(res => res.json())
    .then(data => setAlbums(data.items || []))
    .catch(err => console.error(`Error fetching albums for ${artistName}:`, err));
  }, [token, artistId, artistName]);

  return (
    <section>
      <Link to="/artistas" className="logout-button" style={{marginBottom: '20px', textDecoration: 'none'}}>
        ← Voltar para Artistas
      </Link>
      <h2 style={{marginTop: '20px'}}>Álbuns de {artistName}</h2>
      <div className="grid-container">
        {albums.map(album => (
          <Card
            key={album.id}
            image={album.images[0]?.url}
            name={album.name}
          />
        ))}
      </div>
    </section>
  );
};

export default ArtistaDetalhes;
