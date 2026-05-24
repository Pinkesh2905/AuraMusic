export interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  uri: string;
  images?: SpotifyImage[];
  genres?: string[];
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  uri: string;
  images: SpotifyImage[];
  artists: SpotifyArtist[];
  release_date: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  uri: string;
  duration_ms: number;
  preview_url: string | null;
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string | null;
  uri: string;
  images: SpotifyImage[];
  owner: {
    id: string;
    display_name: string;
  };
  public: boolean;
  tracks: {
    total: number;
    items?: { track: SpotifyTrack }[];
  };
}
