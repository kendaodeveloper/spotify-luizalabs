import { useCallback } from 'react';
import { useParams, useLocation, Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { getArtistAlbums } from '../api/Spotify.api';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import Loading from '../components/Loading';
import Card from '../components/Card';
import { Album } from '../api/Spotify.dto';

interface ArtistLocationState {
  artistName: string;
  artistImage: string;
}

const ArtistAlbums: React.FC = () => {
  const { artistId } = useParams<{ artistId: string }>();
  const location = useLocation();
  const state = location.state as ArtistLocationState;

  const artistName = state?.artistName || 'Artista';
  const artistImage = state?.artistImage;

  const fetchAlbumsFn = useCallback(
    (token: string, limit: number, offset: number) => {
      if (!artistId) {
        return Promise.resolve(
          new Response(JSON.stringify({ items: [], next: null })),
        );
      }
      return getArtistAlbums(token, artistId, limit, offset);
    },
    [artistId],
  );

  const {
    items: albums,
    loading,
    hasMore,
    loaderRef,
  } = useInfiniteScroll<Album>(fetchAlbumsFn);

  if (loading && albums.length === 0) {
    return <Loading message="Carregando álbuns..." />;
  }

  if (!loading && albums.length === 0) {
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
      <div ref={loaderRef} style={{ height: '100px', margin: '20px 0' }}>
        {loading && hasMore && <Loading message="Carregando mais..." />}
      </div>
    </section>
  );
};

export default ArtistAlbums;
