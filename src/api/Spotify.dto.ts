export interface PaginatedResponse<T> {
  items: T[];
  limit: number;
  offset: number;
  total: number;
  next: string | null;
}

interface ImageObject {
  url: string;
  height: number;
  width: number;
}

export interface User {
  id: string;
  display_name: string;
  images?: ImageObject[];
}

export interface Artist {
  id: string;
  name: string;
  images: ImageObject[];
  genres: string[];
}

export interface Album {
  id: string;
  name: string;
  images: ImageObject[];
  release_date: string;
}

export interface Playlist {
  id: string;
  name: string;
  images: ImageObject[];
  tracks: {
    total: number;
  };
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}
