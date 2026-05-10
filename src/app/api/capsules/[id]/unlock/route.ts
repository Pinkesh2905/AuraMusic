import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";
import { SpotifyClient } from "@/lib/spotify/client";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userId = session?.user?.id;
    // @ts-ignore
    const accessToken = session?.accessToken;

    if (!userId || !accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const capsule = await prisma.playlist.findUnique({
      where: { id },
      include: { tracks: true }
    });

    if (!capsule) return NextResponse.json({ error: "Capsule not found" }, { status: 404 });
    if (capsule.userId !== userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (capsule.lockedUntil && new Date() < new Date(capsule.lockedUntil)) {
      return NextResponse.json({ error: "Capsule is not ready to be unlocked yet" }, { status: 400 });
    }

    // If letter already exists, just return it
    if (capsule.unlockLetter) {
      return NextResponse.json({ letter: capsule.unlockLetter });
    }

    // Otherwise generate the letter!
    const client = new SpotifyClient(accessToken);
    const trackNames = [];
    for (const pt of capsule.tracks.slice(0, 5)) {
      try {
        const track = await client.getTrack(pt.spotifyId);
        trackNames.push(`"${track.name}" by ${track.artists[0]?.name}`);
      } catch (e) { }
    }

    const prompt = `
      You are the AI behind 'AURA'. The user created a "Time Capsule" playlist in the past, and it has just unlocked today.
      Write a deeply nostalgic, warm, and personal "letter from the past" to the user.
      
      Here are the main songs they saved in this capsule back then:
      ${trackNames.join(", ") || "A mysterious selection of tracks."}

      Write 3 short paragraphs.
      Reflect on how music freezes time, the emotions attached to these specific songs, and welcome them back to this sonic memory.
      Be poetic but direct. Do not include a greeting or signature.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const unlockLetter = response.text || "Your memories await you in this playlist.";

    await prisma.playlist.update({
      where: { id },
      data: {
        unlockLetter,
        lockedUntil: null, // Fully unlocked
      }
    });

    return NextResponse.json({ letter: unlockLetter });
  } catch (error) {
    console.error("POST /api/capsules/[id]/unlock error:", error);
    return NextResponse.json({ error: "Failed to unlock capsule" }, { status: 500 });
  }
}
