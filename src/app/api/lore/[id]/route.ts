import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { SpotifyClient } from "@/lib/spotify/client";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const accessToken = session?.accessToken;

    const searchParams = req.nextUrl.searchParams;
    let trackName = searchParams.get("name");
    let artistName = searchParams.get("artist");

    if (!trackName) {
      if (!accessToken) {
        return NextResponse.json({ error: "Unauthorized and no track name provided" }, { status: 401 });
      }

      const client = new SpotifyClient(accessToken);
      const trackInfo = await client.getTrack(id);
      
      if (!trackInfo || !trackInfo.name) {
        return NextResponse.json({ error: "Track not found" }, { status: 404 });
      }

      artistName = trackInfo.artists[0]?.name || "Unknown Artist";
      trackName = trackInfo.name;
    }

    artistName = artistName || "Unknown Artist";

    const prompt = `
      You are the intelligence engine for 'Aura', a premium music platform.
      Provide rich, engaging "lore" for the song "${trackName}" by ${artistName}.

      Return ONLY a JSON object with these exactly named string keys:
      - "funFact": A very brief, surprising trivia fact about the song.
      - "meaning": A deeply insightful 2-3 sentence paragraph about the song's lyrical or emotional meaning.
      - "productionNotes": A 2-3 sentence paragraph about the recording process, instruments used, or interesting behind-the-scenes creation details.

      If you do not know the song, provide a creative and convincing "vibe analysis" as if you were interpreting its sonic DNA based on the artist's general style.
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
      aiResult = { 
        funFact: "This track has a unique sonic signature.", 
        meaning: "It explores deep emotional resonance and atmospheric storytelling.", 
        productionNotes: "Crafted with intricate layers of sound design."
      };
    }

    return NextResponse.json({
      trackName,
      artistName,
      ...aiResult
    });

  } catch (error) {
    console.error("GET /api/lore/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch lore" }, { status: 500 });
  }
}
