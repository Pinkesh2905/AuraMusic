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
      return NextResponse.json({ error: "Unauthorized - No Spotify token" }, { status: 401 });
    }

    const client = new SpotifyClient(accessToken);

    // 1. Get user's recently played tracks (or top tracks as fallback)
    const recentlyPlayed = await client.getRecentlyPlayed();
    
    // Fallback if recent is empty
    const tracksToAnalyze = recentlyPlayed.items ? recentlyPlayed.items.map((item: any) => item.track) : [];
    
    if (tracksToAnalyze.length === 0) {
      return NextResponse.json({ message: "Not enough listening history" }, { status: 400 });
    }

    // 2. Prepare data for Gemini
    const trackListString = tracksToAnalyze
      .slice(0, 15)
      .map((t: any) => `"${t.name}" by ${t.artists[0].name}`)
      .join(", ");

    // 3. Ask Gemini to deduce the mood
    const prompt = `
      You are the core intelligence of 'AURA', an emotionally-aware music platform.
      A user has recently been listening to the following tracks:
      ${trackListString}

      Based entirely on the vibe, tempo, and lyrical themes typically associated with these tracks, 
      deduce the user's current emotional state or "vibe".

      Respond strictly with a JSON object containing two fields:
      1. "moodName": A creative, 2-to-3 word name for this vibe (e.g., "Late-Night Melancholy", "Hyper Focus", "Sunday Morning Acoustic").
      2. "searchQuery": A 1-to-2 word query that we can use to search Spotify for matching tracks (e.g., "chill lofi", "upbeat pop", "ambient").
      
      Output ONLY valid JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let aiResult;
    try {
      const responseText = response.text || "{}";
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      aiResult = JSON.parse(jsonMatch ? jsonMatch[0] : "{}");
    } catch (e) {
      console.error("Failed to parse Gemini output:", response.text);
      aiResult = { moodName: "Eclectic Mix", searchQuery: "mixed" };
    }

    // 4. Fetch recommended tracks based on Gemini's search query
    // In a full implementation, we'd use Spotify's Recommendations API with seed tracks, 
    // but a targeted search is very reliable for mood adjectives.
    const searchResults = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(aiResult.searchQuery)}%20playlist&type=playlist&limit=1`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    const searchData = await searchResults.json();
    let generatedTracks = [];
    
    if (searchData.playlists?.items?.length > 0) {
      const moodPlaylistId = searchData.playlists.items[0].id;
      const playlistTracks = await client.getPlaylistTracks(moodPlaylistId);
      generatedTracks = playlistTracks.items?.slice(0, 20).map((item: any) => item.track) || [];
    }

    return NextResponse.json({
      mood: aiResult.moodName,
      queryUsed: aiResult.searchQuery,
      tracks: generatedTracks
    });

  } catch (error) {
    console.error("GET /api/mood error:", error);
    return NextResponse.json({ error: "Failed to generate mood" }, { status: 500 });
  }
}
