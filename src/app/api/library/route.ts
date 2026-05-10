import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const likedTracks = await prisma.likedTrack.findMany({
      where: { userId: user.id },
      orderBy: { likedAt: 'desc' }
    });

    return NextResponse.json(likedTracks);
  } catch (error) {
    console.error("GET /api/library error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { spotifyId } = await req.json();
    if (!spotifyId) return NextResponse.json({ error: "spotifyId is required" }, { status: 400 });

    const likedTrack = await prisma.likedTrack.create({
      data: {
        spotifyId,
        userId: user.id
      }
    });

    return NextResponse.json(likedTrack, { status: 201 });
  } catch (error: any) {
    // Handle Prisma unique constraint violation (P2002) if track is already liked
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Track already liked" }, { status: 409 });
    }
    console.error("POST /api/library error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { searchParams } = new URL(req.url);
    const spotifyId = searchParams.get("spotifyId");

    if (!spotifyId) return NextResponse.json({ error: "spotifyId query param is required" }, { status: 400 });

    await prisma.likedTrack.delete({
      where: {
        userId_spotifyId: {
          userId: user.id,
          spotifyId: spotifyId
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "Track not found in library" }, { status: 404 });
    }
    console.error("DELETE /api/library error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
