import { useState, useEffect } from 'react';
import Card from './Card';

const TopArtists = ({ token, onArtistClick }) => {
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    if (!token) return;

    fetch('https://api.spotify.com/v1/me/top/artists?limit=10', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setArtists(data.items || []);
    })
    .catch(err => console.error("Error fetching top artists:", err));
  }, [token]);

  if (!artists.length) {
    return <div>Loading your favorite artists...</div>;
  }

  return (
    <section>
      <h2>Seus artistas mais ouvidos</h2>
      <div className="grid-container">
        {artists.map(artist => (
          <Card 
            key={artist.id}
            image={artist.images[0]?.url}
            name={artist.name}
            onClick={() => onArtistClick(artist)}
          />
        ))}
      </div>
    </section>
  );
};

export default TopArtists;
