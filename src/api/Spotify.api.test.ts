import {
  fetchWebApi,
  getUserProfile,
  getTopArtists,
  getArtistAlbums,
  getUserPlaylists,
  createPlaylist,
} from './Spotify.api';
import fetchMock from 'jest-fetch-mock';

const BASE_API_URL = 'https://api.spotify.com/v1';
const mockToken = 'mock-token';

/* eslint-disable @typescript-eslint/no-non-null-assertion */
describe('API Utility Functions', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  describe('fetchWebApi', () => {
    it('should make a GET request correctly', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: 'success' }));
      const endpoint = 'test-endpoint';
      await fetchWebApi(endpoint, 'GET', mockToken);

      expect(fetchMock.mock.calls.length).toEqual(1);
      expect(fetchMock.mock.calls[0][0]).toBe(
        `${BASE_API_URL}/${endpoint}`,
      );
      expect(fetchMock.mock.calls[0][1]!.method).toBe('GET');
      expect(fetchMock.mock.calls[0][1]!.headers).toEqual({
        Authorization: `Bearer ${mockToken}`,
        'Content-Type': 'application/json',
      });
    });

    it('should make a POST request with a body', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({ data: 'success' }));
      const endpoint = 'test-endpoint';
      const body = { key: 'value' };
      await fetchWebApi(endpoint, 'POST', mockToken, body);

      expect(fetchMock.mock.calls[0][1]!.method).toBe('POST');
      expect(fetchMock.mock.calls[0][1]!.body).toBe(JSON.stringify(body));
    });
  });

  describe('Specific Endpoint Functions', () => {
    it('getUserProfile should call fetchWebApi with the correct parameters', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({}));
      await getUserProfile(mockToken);
      expect(fetchMock.mock.calls[0][0]!).toBe(`${BASE_API_URL}/me`);
      expect(fetchMock.mock.calls[0][1]!.method).toBe('GET');
    });

    it('getTopArtists should call fetchWebApi with the correct limit', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({}));
      const limit = 10;
      await getTopArtists(mockToken, limit);
      expect(fetchMock.mock.calls[0][0]).toBe(
        `${BASE_API_URL}/me/top/artists?limit=${limit}`,
      );
    });

    it('getArtistAlbums should call fetchWebApi with the artist ID and limit', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({}));
      const artistId = 'artist-123';
      const limit = 5;
      await getArtistAlbums(mockToken, artistId, limit);
      expect(fetchMock.mock.calls[0][0]).toBe(
        `${BASE_API_URL}/artists/${artistId}/albums?include_groups=album,single&limit=${limit}`,
      );
    });

    it('getUserPlaylists should call fetchWebApi with the limit', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({}));
      const limit = 20;
      await getUserPlaylists(mockToken, limit);
      expect(fetchMock.mock.calls[0][0]).toBe(
        `${BASE_API_URL}/me/playlists?limit=${limit}`,
      );
    });

    it('createPlaylist should call fetchWebApi with the correct playlist details', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({}));
      const userId = 'user-123';
      const playlistName = 'My Test Playlist';
      await createPlaylist(mockToken, userId, playlistName);

      const expectedBody = {
        name: playlistName,
        description: `Playlist criada via spotify-luizalabs em ${new Date().toLocaleDateString()}`,
        public: false,
      };

      expect(fetchMock.mock.calls[0][0]!).toBe(
        `${BASE_API_URL}/users/${userId}/playlists`,
      );
      expect(fetchMock.mock.calls[0][1]!.method).toBe('POST');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(JSON.parse(fetchMock.mock.calls[0][1]!.body as any)).toEqual(
        expectedBody,
      );
    });
  });
});
