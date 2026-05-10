import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { SpotifyClient } from "@/lib/spotify/client";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // @ts-ignore
    const capsules = await prisma.playlist.findMany({
      where: {
        // @ts-ignore
        userId: session.user.id,
        lockedUntil: { not: null },
      },
      orderBy: { createdAt: "desc" },
      include: {
        tracks: {
          take: 5,
        }
      }
    });

    return NextResponse.json({ capsules });
  } catch (error) {
    console.error("GET /api/capsules error:", error);
    return NextResponse.json({ error: "Failed to fetch capsules" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const accessToken = session?.accessToken;
    // @ts-ignore
    const userId = session?.user?.id;

    if (!userId || !accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, lockedUntilDays, seedType } = await req.json();

    if (!name || !lockedUntilDays) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const lockedUntil = new Date();
    lockedUntil.setDate(lockedUntil.getDate() + parseInt(lockedUntilDays));

    const client = new SpotifyClient(accessToken);
    let tracksToAdd: any[] = [];

    // Automatically generate the capsule contents based on seed type
    if (seedType === "top_recent") {
      const topTracks = await client.getTopTracks("short_term", 20).catch(() => ({ items: [] }));
      tracksToAdd = topTracks.items;
    } else if (seedType === "recently_played") {
      const recent = await client.getRecentlyPlayed(20).catch(() => ({ items: [] }));
      tracksToAdd = recent.items.map((i: any) => i.track);
    } else {
      // fallback to top overall if unknown seed
      const topTracks = await client.getTopTracks("medium_term", 20).catch(() => ({ items: [] }));
      tracksToAdd = topTracks.items;
    }

    // Create the playlist in Prisma
    const newCapsule = await prisma.playlist.create({
      data: {
        name,
        description: "A time capsule created with Aura.",
        isPublic: false,
        lockedUntil,
        user: { connect: { id: userId } },
        tracks: {
          create: tracksToAdd.slice(0, 20).map((t, index) => ({
            spotifyId: t.id,
            position: index,
          }))
        }
      }
    });

    return NextResponse.json({ capsule: newCapsule }, { status: 201 });
  } catch (error) {
    console.error("POST /api/capsules error:", error);
    return NextResponse.json({ error: "Failed to create capsule" }, { status: 500 });
  }
}
