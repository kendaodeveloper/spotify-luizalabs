import { useCallback } from 'react';
import { Link } from 'react-router';
import { getTopArtists } from '../api/Spotify.api';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import Loading from '../components/Loading';
import SectionHeader from '../components/SectionHeader';
import Card from '../components/Card';
import { Artist } from '../api/Spotify.dto';

const Artists: React.FC = () => {
  const fetchArtistsFn = useCallback(
    (authToken: string, limit: number, offset: number) => {
      return getTopArtists(authToken, limit, offset);
    },
    [],
  );

  const {
    items: artists,
    loading,
    hasMore,
    loaderRef,
  } = useInfiniteScroll<Artist>(fetchArtistsFn);

  if (loading && artists.length === 0) {
    return <Loading message="Carregando artistas..." />;
  }

  if (!loading && artists.length === 0) {
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
      <div ref={loaderRef} style={{ height: '100px', margin: '20px 0' }}>
        {loading && hasMore && <Loading message="Carregando mais..." />}
      </div>
    </section>
  );
};

export default Artists;
