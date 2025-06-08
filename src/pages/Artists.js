import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTopArtists } from '../api/Spotify';
import Loading from '../components/Loading';

const Artists = () => {
  const { token, logout } = useAuth();
  const [artists, setArtists] = useState(null);

  useEffect(() => {
    if (!token) return;

    // TODO: Add pagination
    getTopArtists(token, 10)
      .then(res => { if (res.status === 401 || res.status === 403) { logout(); return null; } return res.json(); })
      .then(data => setArtists(data?.items || []))
      .catch(err => console.error("Error fetching top artists:", err));
  }, [token, logout]);

  if (!artists) {
    return <Loading message="Carregando artistas..." />;
  }

  if (artists.length === 0) {
    return <div>Nenhum artista encontrado.</div>;
  }

  return (
    <section>
      <h1 className="section-title">Top Artistas</h1>
      <p className="section-subtitle">Aqui você encontra seus artistas preferidos</p>
      <div className="single-column">
        {artists.map(artist => (
          <Link key={artist.id} to={`/artists/${artist.id}`} state={{ artistName: artist.name, artistImage: artist.images[0]?.url }}>
            <div className="artist-card">
              <img src={artist.images[0]?.url} alt={artist.name} className="artist-round-image" />
              <span className="artist-name">{artist.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Artists;
