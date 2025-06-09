const BASE_API_URL = 'https://api.spotify.com/v1';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export async function fetchWebApi(
  endpoint: string,
  method: HttpMethod,
  token: string,
  body?: Record<string, unknown>,
): Promise<Response> {
  return fetch(`${BASE_API_URL}/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method,
    body: body ? JSON.stringify(body) : undefined,
  });
}

export async function getUserProfile(token: string): Promise<Response> {
  return fetchWebApi('me', 'GET', token);
}

export async function getTopArtists(
  token: string,
  limit: number,
): Promise<Response> {
  return fetchWebApi(`me/top/artists?limit=${limit}`, 'GET', token);
}

export async function getArtistAlbums(
  token: string,
  artistId: string,
  limit: number,
): Promise<Response> {
  return fetchWebApi(
    `artists/${artistId}/albums?include_groups=album,single&limit=${limit}`,
    'GET',
    token,
  );
}

export async function getUserPlaylists(
  token: string,
  limit: number,
): Promise<Response> {
  return fetchWebApi(`me/playlists?limit=${limit}`, 'GET', token);
}

export async function createPlaylist(
  token: string,
  userId: string,
  playlistName: string,
): Promise<Response> {
  const body = {
    name: playlistName,
    description: `Playlist criada via spotify-luizalabs em ${new Date().toLocaleDateString()}`,
    public: false,
  };
  return fetchWebApi(`users/${userId}/playlists`, 'POST', token, body);
}
