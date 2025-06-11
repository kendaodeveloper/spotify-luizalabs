import './ArtistAlbums.css';

import { useCallback } from 'react';
import { useParams, useLocation, Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { getArtistAlbums } from '../api/Spotify.api';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import Loading from '../components/Loading';
import Card from '../components/Card';
import { Album, PaginatedResponse } from '../api/Spotify.dto';

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
    (
      token: string,
      limit: number,
      offset: number,
    ): Promise<PaginatedResponse<Album>> => {
      if (!artistId) {
        return Promise.resolve({
          items: [],
          limit,
          offset,
          total: 0,
          next: null,
        });
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
    error,
  } = useInfiniteScroll<Album>(fetchAlbumsFn);

  if (error) {
    return <div>Ocorreu um erro, tente novamente mais tarde.</div>;
  }

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
      {hasMore && (
        <div ref={loaderRef} className="loader-container">
          {loading && <Loading message="Carregando mais..." />}
        </div>
      )}
    </section>
  );
};

export default ArtistAlbums;
