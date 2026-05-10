import { SpotifyTrack, SpotifyAlbum, SpotifyArtist, SpotifyPlaylist } from "@/types/spotify";

export class SpotifyClient {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async fetchAPI(endpoint: string, options: RequestInit = {}) {
    const res = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Spotify token expired or invalid");
      }
      throw new Error(`Spotify API error: ${res.statusText}`);
    }

    return res.json();
  }

  async getTrack(id: string): Promise<SpotifyTrack> {
    return this.fetchAPI(`/tracks/${id}`);
  }

  async getAlbum(id: string): Promise<SpotifyAlbum> {
    return this.fetchAPI(`/albums/${id}`);
  }

  async getArtist(id: string): Promise<SpotifyArtist> {
    return this.fetchAPI(`/artists/${id}`);
  }

  async search(query: string, types: string[] = ["track", "album", "artist", "playlist"]): Promise<any> {
    return this.fetchAPI(`/search?q=${encodeURIComponent(query)}&type=${types.join(",")}&limit=10`);
  }

  async getRecommendations(seedTracks: string[], seedArtists: string[]): Promise<{ tracks: SpotifyTrack[] }> {
    const params = new URLSearchParams();
    if (seedTracks.length) params.append("seed_tracks", seedTracks.join(","));
    if (seedArtists.length) params.append("seed_artists", seedArtists.join(","));
    params.append("limit", "20");
    
    return this.fetchAPI(`/recommendations?${params.toString()}`);
  }

  async getUserPlaylists(): Promise<{ items: SpotifyPlaylist[] }> {
    return this.fetchAPI("/me/playlists");
  }

  async getTopArtists(timeRange: "short_term" | "medium_term" | "long_term" = "medium_term", limit = 10): Promise<{ items: SpotifyArtist[] }> {
    return this.fetchAPI(`/me/top/artists?time_range=${timeRange}&limit=${limit}`);
  }

  async getTopTracks(timeRange: "short_term" | "medium_term" | "long_term" = "medium_term", limit = 10): Promise<{ items: SpotifyTrack[] }> {
    return this.fetchAPI(`/me/top/tracks?time_range=${timeRange}&limit=${limit}`);
  }

  async getRecentlyPlayed(limit = 20): Promise<{ items: { track: SpotifyTrack }[] }> {
    return this.fetchAPI(`/me/player/recently-played?limit=${limit}`);
  }

  async getPlaylistTracks(playlistId: string): Promise<{ items: { track: SpotifyTrack }[] }> {
    return this.fetchAPI(`/playlists/${playlistId}/tracks?limit=50`);
  }
}
