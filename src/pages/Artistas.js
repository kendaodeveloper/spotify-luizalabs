import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import { getTopArtists } from '../api/Spotify';

const Artistas = () => {
  const { token } = useAuth();
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    if (!token) return;

    getTopArtists(token, 10)
    .then(res => res.json())
    .then(data => setArtists(data.items || []))
    .catch(err => console.error("Error fetching top artists:", err));
  }, [token]);

  if (!artists.length) {
    return <div>Carregando seus artistas favoritos...</div>;
  }

  return (
    <section>
      <h2>Seus artistas mais ouvidos</h2>
      <div className="grid-container">
        {artists.map(artist => (
          <Link key={artist.id} to={`/artistas/${artist.id}`} state={{ artistName: artist.name }}>
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

export default Artistas;
