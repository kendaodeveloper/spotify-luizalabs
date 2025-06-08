const BASE_API_URL = 'https://api.spotify.com/v1';

async function fetchWebApi(endpoint, method, token, body) {
  return fetch(`${BASE_API_URL}/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method,
    body: JSON.stringify(body),
  });
}

export async function getUserProfile(token) {
  return fetchWebApi('me', 'GET', token);
}

export async function getTopArtists(token, limit) {
  return fetchWebApi(`me/top/artists?limit=${limit}`, 'GET', token);
}

export async function getArtistAlbums(token, artistId, limit) {
  return fetchWebApi(
    `artists/${artistId}/albums?include_groups=album,single&limit=${limit}`,
    'GET',
    token,
  );
}

export async function getUserPlaylists(token, limit) {
  return fetchWebApi(`me/playlists?limit=${limit}`, 'GET', token);
}

export async function createPlaylist(token, userId, playlistName) {
  const body = {
    name: playlistName,
    description: `Playlist criada via spotify-luizalabs em ${new Date().toLocaleDateString()}`,
    public: false,
  };
  return fetchWebApi(`users/${userId}/playlists`, 'POST', token, body);
}
