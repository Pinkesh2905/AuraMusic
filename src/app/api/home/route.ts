import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { SpotifyClient } from "@/lib/spotify/client";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const accessToken = session?.accessToken;

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = new SpotifyClient(accessToken);

    const [recentlyPlayed, topTracks, topArtists] = await Promise.all([
      client.getRecentlyPlayed(10).catch(() => ({ items: [] })),
      client.getTopTracks("short_term", 10).catch(() => ({ items: [] })),
      client.getTopArtists("short_term", 6).catch(() => ({ items: [] })),
    ]);

    const formatTrack = (t: any) => ({
      id: t.id,
      name: t.name,
      artist: t.artists?.[0]?.name || "Unknown Artist",
      artists: t.artists || [],
      duration: t.duration_ms,
      albumArt: t.album?.images?.[0]?.url || null,
      uri: t.uri,
      previewUrl: t.preview_url || null,
    });

    return NextResponse.json({
      recentlyPlayed: recentlyPlayed.items.map((i: any) => formatTrack(i.track)),
      topTracks: topTracks.items.map(formatTrack),
      topArtists: topArtists.items.map((a: any) => ({
        id: a.id,
        name: a.name,
        image: a.images?.[0]?.url || null,
        genres: a.genres?.slice(0, 2) || [],
      })),
    });
  } catch (error) {
    console.error("GET /api/home error:", error);
    return NextResponse.json({ error: "Failed to fetch home feed" }, { status: 500 });
  }
}
