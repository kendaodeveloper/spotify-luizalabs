import { useState, useEffect, useCallback } from 'react';

const UserPlaylists = ({ token, userId }) => {
  const [playlists, setPlaylists] = useState([]);

  const fetchPlaylists = useCallback(() => {
    if (!token) return;

    fetch('https://api.spotify.com/v1/me/playlists', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setPlaylists(data.items || []))
    .catch(err => console.error("Error fetching playlists:", err));
  }, [token]);
  
  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  const createNewPlaylist = () => {
    if (!userId) {
        alert("Não foi possível obter a ID do usuário para criar a playlist.");
        return;
    }
    
    const playlistName = prompt("Qual será o nome da sua nova playlist?");

    if (!playlistName) return;

    fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: playlistName,
            description: 'Playlist criada pelo App do Desafio LuizaLabs',
            public: false
        })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error('Failed to create playlist');
        }
        return res.json();
    })
    .then(() => {
        alert('Playlist criada com sucesso!');
        fetchPlaylists();
    })
    .catch(err => console.error("Error creating playlist:", err));
  };

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Suas Playlists</h2>
          <button onClick={createNewPlaylist} className="logout-button" style={{backgroundColor: '#1DB954'}}>
              + Criar Playlist
          </button>
      </div>
      <div className="grid-container">
        {playlists.map(playlist => (
          <div className="card" key={playlist.id}>
            {playlist.images[0] ? 
              <img src={playlist.images[0].url} alt={playlist.name} /> :
              <div style={{height: 180, width: 180, backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>?</div>
            }
            <div className="card-content">
              <h4>{playlist.name}</h4>
              <p>{playlist.tracks.total} músicas</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default UserPlaylists;
