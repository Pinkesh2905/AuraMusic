import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    const playlist = await prisma.playlist.findUnique({ where: { id } });

    if (!playlist) return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    if (playlist.userId !== user?.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { spotifyId } = await req.json();
    if (!spotifyId) return NextResponse.json({ error: "spotifyId is required" }, { status: 400 });

    // Get current track count to determine position
    const trackCount = await prisma.playlistTrack.count({
      where: { playlistId: id }
    });

    const track = await prisma.playlistTrack.create({
      data: {
        spotifyId,
        position: trackCount,
        playlistId: id
      }
    });

    // Update the playlist's updatedAt timestamp
    await prisma.playlist.update({
      where: { id },
      data: { updatedAt: new Date() }
    });

    return NextResponse.json(track, { status: 201 });
  } catch (error) {
    console.error("POST /api/playlists/[id]/tracks error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
