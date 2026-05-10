import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { SpotifyClient } from "@/lib/spotify/client";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const accessToken = session?.accessToken;

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = new SpotifyClient(accessToken);

    // Fetch all data in parallel for speed
    const [topArtistsShort, topArtistsMed, topTracksShort, topTracksMed] = await Promise.all([
      client.getTopArtists("short_term", 10).catch(() => ({ items: [] })),
      client.getTopArtists("long_term", 20).catch(() => ({ items: [] })),
      client.getTopTracks("short_term", 10).catch(() => ({ items: [] })),
      client.getTopTracks("long_term", 20).catch(() => ({ items: [] })),
    ]);

    // Aggregate genres from all top artists
    const genreCounts: Record<string, number> = {};
    [...topArtistsShort.items, ...topArtistsMed.items].forEach((artist: any) => {
      (artist.genres || []).forEach((genre: string) => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    });

    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));

    // Build a rich summary string for Gemini
    const artistNames = topArtistsMed.items.slice(0, 8).map((a: any) => a.name).join(", ");
    const trackNames = topTracksMed.items.slice(0, 5).map((t: any) => `"${t.name}" by ${t.artists[0]?.name}`).join(", ");
    const genreList = topGenres.slice(0, 5).map(g => g.name).join(", ");

    const prompt = `
      You are the intelligence core of 'AURA', a deeply personal music platform.
      Based on this user's listening history, craft their unique "Sonic DNA" personality profile.

      Their top artists: ${artistNames || "N/A"}
      Their top tracks: ${trackNames || "N/A"}
      Their top genres: ${genreList || "N/A"}

      Return ONLY a JSON object with exactly these string keys:
      - "headline": A punchy 4-6 word title for their music personality (e.g., "The Melancholic Night Drifter" or "Champion of Hyperpop Chaos").
      - "description": A rich, personal 3-4 sentence paragraph describing their unique taste, emotional landscape, and the story their music tells about them.
      - "dominantMood": A single word for their dominant emotional vibe (e.g., "Introspective", "Energetic", "Romantic", "Rebellious").
      - "funInsight": One short, surprising, and witty observation about their taste (e.g., "You listen to 3x more music after midnight than any other time.").

      Output ONLY valid JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let personality;
    try {
      const text = response.text || "{}";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      personality = JSON.parse(jsonMatch ? jsonMatch[0] : "{}");
    } catch {
      personality = {
        headline: "A Truly Eclectic Listener",
        description: "Your music taste defies simple categorization. You move through genres like you move through moods — freely and without apology.",
        dominantMood: "Eclectic",
        funInsight: "Your playlist is a journey, not a destination.",
      };
    }

    return NextResponse.json({
      personality,
      topArtists: topArtistsShort.items.slice(0, 6).map((a: any) => ({
        id: a.id,
        name: a.name,
        image: a.images?.[0]?.url,
        genres: a.genres?.slice(0, 2) || [],
      })),
      topTracks: topTracksShort.items.slice(0, 5).map((t: any) => ({
        id: t.id,
        name: t.name,
        artist: t.artists?.[0]?.name,
        albumArt: t.album?.images?.[0]?.url,
      })),
      topGenres,
    });

  } catch (error) {
    console.error("GET /api/dna error:", error);
    return NextResponse.json({ error: "Failed to generate Sonic DNA" }, { status: 500 });
  }
}
