const BASE_API_URL = 'https://api.spotify.com/v1';

async function fetchWebApi(endpoint, method, token, body) {
  return await fetch(`${BASE_API_URL}/${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method,
    body: JSON.stringify(body)
  });
}

export async function getUserProfile(token) {
  return await fetchWebApi('me', 'GET', token);
}

export async function getTopArtists(token, limit) {
  return await fetchWebApi(`me/top/artists?limit=${limit}`, 'GET', token);
}

export async function getArtistAlbums(token, artistId, limit) {
  return await fetchWebApi(`artists/${artistId}/albums?include_groups=album,single&limit=${limit}`, 'GET', token);
}

export async function getUserPlaylists(token, limit) {
  return await fetchWebApi(`me/playlists?limit=${limit}`, 'GET', token);
}

export async function createPlaylist(token, userId, playlistName) {
  const body = {
    name: playlistName,
    description: `Playlist criada via spotify-luizalabs em ${new Date().toLocaleDateString()}`,
    public: false,
  };
  return await fetchWebApi(`users/${userId}/playlists`, 'POST', token, body);
}
