import {
  Album,
  Artist,
  AuthError,
  PaginatedResponse,
  Playlist,
  TokenResponse,
  User,
} from './Spotify.dto';

const WEB_API_URL = 'https://api.spotify.com/v1';
const TOKEN_API_URL = 'https://accounts.spotify.com/api/token';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export async function getAccessToken(
  clientId: string,
  code: string,
  codeVerifier: string,
): Promise<TokenResponse> {
  const redirectUri = `${process.env.REACT_APP_URI}/callback`;

  const params = new URLSearchParams();
  params.append('client_id', clientId);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', redirectUri);
  params.append('code_verifier', codeVerifier);

  const response = await fetch(TOKEN_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));

    let errorMessage = 'Failed getting token';

    if (errorData?.error) {
      errorMessage = String(errorData.error);

      if (errorData.error_description) {
        errorMessage += `: ${errorData.error_description}`;
      }
    }

    throw new Error(errorMessage);
  }

  return response.json() as Promise<TokenResponse>;
}

export async function fetchWebApi<T>(
  endpoint: string,
  method: HttpMethod,
  token: string,
  body?: Record<string, unknown>,
): Promise<T> {
  const response = await fetch(`${WEB_API_URL}/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    method,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new AuthError('Unable to authenticate');
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || response.statusText);
  }

  return response.json() as T;
}

export async function getUserProfile(token: string): Promise<User> {
  return fetchWebApi('me', 'GET', token);
}

export async function getTopArtists(
  token: string,
  limit: number,
  offset: number,
): Promise<PaginatedResponse<Artist>> {
  return fetchWebApi(
    `me/top/artists?limit=${limit}&offset=${offset}`,
    'GET',
    token,
  );
}

export async function getArtistAlbums(
  token: string,
  artistId: string,
  limit: number,
  offset: number,
): Promise<PaginatedResponse<Album>> {
  return fetchWebApi(
    `artists/${artistId}/albums?include_groups=album,single&limit=${limit}&offset=${offset}`,
    'GET',
    token,
  );
}

export async function getUserPlaylists(
  token: string,
  limit: number,
  offset: number,
): Promise<PaginatedResponse<Playlist>> {
  return fetchWebApi(
    `me/playlists?limit=${limit}&offset=${offset}`,
    'GET',
    token,
  );
}

export async function createPlaylist(
  token: string,
  userId: string,
  playlistName: string,
): Promise<void> {
  const body = {
    name: playlistName,
    description: `Playlist criada via spotify-luizalabs em ${new Date().toLocaleDateString()}`,
    public: false,
  };
  return fetchWebApi(`users/${userId}/playlists`, 'POST', token, body);
}
