import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTopArtists } from '../api/Spotify';
import Loading from '../components/Loading';
import SectionHeader from '../components/SectionHeader';
import Card from '../components/Card';

const Artists = () => {
  const { token, logout } = useAuth();
  const [artists, setArtists] = useState(null);

  useEffect(() => {
    if (!token) return;

    // TODO: Add pagination
    getTopArtists(token, 10)
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          logout();
          return null;
        }
        return res.json();
      })
      .then((data) => setArtists(data?.items || []))
      .catch((err) => console.error('Error fetching top artists:', err));
  }, [token, logout]);

  if (!artists) {
    return <Loading message="Carregando artistas..." />;
  }

  if (artists.length === 0) {
    return <div>Nenhum artista encontrado.</div>;
  }

  return (
    <section>
      <SectionHeader
        title="Top Artistas"
        subtitle="Aqui você encontra seus artistas preferidos"
      />
      <div className="card-container">
        {artists.map((artist) => (
          <Link
            key={artist.id}
            to={`/artists/${artist.id}`}
            state={{
              artistName: artist.name,
              artistImage: artist.images[0]?.url,
            }}
          >
            <Card
              shape="round"
              image={artist.images?.[0]?.url}
              title={artist.name}
            />
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Artists;
