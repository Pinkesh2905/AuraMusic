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

    // 1. Get user's recently played tracks
    const recentlyPlayed = await client.getRecentlyPlayed();
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

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const accessToken = session?.accessToken;

    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized - No Spotify token" }, { status: 401 });
    }

    const { prompt: userPrompt } = await req.json();
    if (!userPrompt || typeof userPrompt !== "string") {
      return NextResponse.json({ error: "Missing or invalid prompt parameter" }, { status: 400 });
    }

    const client = new SpotifyClient(accessToken);

    // 1. Get user's recently played tracks to understand context
    let tracksToAnalyze = [];
    try {
      const recentlyPlayed = await client.getRecentlyPlayed(15);
      tracksToAnalyze = recentlyPlayed.items ? recentlyPlayed.items.map((item: any) => item.track) : [];
    } catch (err) {
      console.warn("[Aura] Failed to fetch recently played tracks:", err);
    }
    
    // 2. Prepare tracks list for Gemini
    const trackListString = tracksToAnalyze.length > 0
      ? tracksToAnalyze
          .slice(0, 10)
          .map((t: any) => `"${t.name}" by ${t.artists[0].name}`)
          .join(", ")
      : "No recent tracks found in Spotify history.";

    // 3. Instruct Gemini to analyze prompt and output structured recommendations guidelines
    const aiPrompt = `
      You are the core intelligence of 'AURA', an emotionally-aware high-fidelity music platform.
      The user describes their current emotional state, request, or environment: "${userPrompt}"
      
      Their recent Spotify listening history includes:
      ${trackListString}

      Based on their listening profile (tempo, style, genres) and their current vibe request, please synthesize a personalized, unified aura state.
      
      Respond strictly with a JSON object containing exactly the following fields:
      1. "moodName": A creative, premium 2-to-3 word vibe name (e.g., "Neon Rain Reflection", "Solitude Sanctuary", "Hyperpop Velocity").
      2. "reasoning": A high-fidelity, aesthetic 1-to-2 sentence paragraph explaining the emotional connection between their listening history and their current feeling. Keep it poetic, sleek, and highly engaging.
      3. "genres": An array of up to 2 standard Spotify genres that perfectly match their request (choose only from: "pop", "hip-hop", "indie", "electronic", "r-n-b", "ambient", "acoustic", "lo-fi", "chill", "workout", "party", "dance", "rock", "heavy-metal", "jazz", "classical", "singer-songwriter").
      4. "seedArtists": An array of 2 to 3 extremely well-known, real-world, highly famous artist names that represent this requested style/vibe (e.g., for Punjabi: ["Diljit Dosanjh", "Karan Aujla"]; for Lofi: ["Lofi Girl", "Idealism"]; for English pop: ["Billie Eilish", "The Weeknd"]).
      5. "targetEnergy": A float between 0.0 and 1.0 representing target energy level.
      6. "targetValence": A float between 0.0 and 1.0 representing happiness/mood valence (lower is sad/dark, higher is happy/bright).
      7. "targetDanceability": A float between 0.0 and 1.0 representing danceability.
      
      Output ONLY valid JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: aiPrompt,
    });

    let aiResult;
    try {
      const responseText = response.text || "{}";
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      aiResult = JSON.parse(jsonMatch ? jsonMatch[0] : "{}");
    } catch (e) {
      console.error("Failed to parse Gemini output:", response.text);
      aiResult = {
        moodName: "Liquid Midnight",
        reasoning: "Blending your prompt with your recent listening patterns to construct a deep soundscape.",
        genres: ["chill", "ambient"],
        seedArtists: ["Lofi Girl", "The xx"],
        targetEnergy: 0.35,
        targetValence: 0.4,
        targetDanceability: 0.4
      };
    }

    // 4. Resolve suggestions by searching Spotify for artist IDs
    const seedArtistIds = [];
    const seedArtists = aiResult.seedArtists || [];
    
    for (const artistName of seedArtists) {
      try {
        const searchData = await client.search(`artist:${artistName}`, ["artist"]);
        if (searchData.artists?.items?.length > 0) {
          seedArtistIds.push(searchData.artists.items[0].id);
        }
      } catch (err) {
        console.error(`[Aura] Error searching artist ID for ${artistName}:`, err);
      }
    }

    // Fallback seed track if no artists found
    let seedTrackId = "";
    if (seedArtistIds.length === 0 && tracksToAnalyze.length > 0) {
      seedTrackId = tracksToAnalyze[0].id;
    }

    // 5. Query Spotify Recommendations Engine using seeds
    const recParams = new URLSearchParams();
    if (seedArtistIds.length > 0) {
      recParams.append("seed_artists", seedArtistIds.slice(0, 3).join(","));
    }
    
    const genres = aiResult.genres || [];
    if (genres.length > 0) {
      recParams.append("seed_genres", genres.slice(0, 2).join(","));
    }

    if (seedTrackId) {
      recParams.append("seed_tracks", seedTrackId);
    }

    // Append target audio features
    recParams.append("target_energy", (aiResult.targetEnergy ?? 0.5).toFixed(2));
    recParams.append("target_valence", (aiResult.targetValence ?? 0.5).toFixed(2));
    recParams.append("target_danceability", (aiResult.targetDanceability ?? 0.5).toFixed(2));
    recParams.append("limit", "12");

    let resolvedTracks = [];
    try {
      const recUrl = `https://api.spotify.com/v1/recommendations?${recParams.toString()}`;
      const recRes = await fetch(recUrl, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (recRes.ok) {
        const recData = await recRes.json();
        resolvedTracks = recData.tracks || [];
      } else {
        const errorText = await recRes.text();
        console.warn("[Aura] Spotify Recommendations API failed:", recRes.status, errorText);
      }
    } catch (err) {
      console.error("[Aura] Error fetching from recommendations endpoint:", err);
    }

    // Fallback if recommendations returned nothing
    if (resolvedTracks.length === 0 && tracksToAnalyze.length > 0) {
      resolvedTracks = tracksToAnalyze.slice(0, 6);
    }

    return NextResponse.json({
      mood: aiResult.moodName,
      vibe: aiResult.moodName,
      reasoning: aiResult.reasoning,
      explanation: aiResult.reasoning,
      tracks: resolvedTracks
    });

  } catch (error) {
    console.error("POST /api/mood error:", error);
    return NextResponse.json({ error: "Failed to analyze custom mood" }, { status: 500 });
  }
}
