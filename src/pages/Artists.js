import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import { getTopArtists } from '../api/Spotify';

const Artists = () => {
  const { token, logout } = useAuth();
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    if (!token) return;

    getTopArtists(token, 10)
    .then(res => { if (res.status === 401) { logout(); return null; } return res.json(); })
    .then(data => setArtists(data?.items || []))
    .catch(err => console.error("Error fetching top artists:", err));
  }, [token, logout]);

  if (!artists || !artists.length) {
    return <div>Carregando artistas...</div>;
  }

  return (
    <section>
      <h2>Seus Artistas</h2>
      <div className="grid-container">
        {artists.map(artist => (
          <Link key={artist.id} to={`/artists/${artist.id}`} state={{ artistName: artist.name }}>
            <Card
              image={artist.images[0]?.url}
              name={artist.name}
            />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Artists;
