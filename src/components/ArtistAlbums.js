import { useState, useEffect } from 'react';
import Card from './Card';

const ArtistAlbums = ({ token, artist }) => {
    const [albums, setAlbums] = useState([]);

    useEffect(() => {
        if (!token || !artist) return;

        fetch(`https://api.spotify.com/v1/artists/${artist.id}/albums?include_groups=album,single&limit=20`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            setAlbums(data.items || []);
        })
        .catch(err => console.error(`Error fetching albums for ${artist.name}:`, err));
    }, [token, artist]);

    if (!artist) return null;

    return (
        <section>
            <h2>Álbuns de {artist.name}</h2>
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

export default ArtistAlbums;