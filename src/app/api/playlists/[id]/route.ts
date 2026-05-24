import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const playlist = await prisma.playlist.findUnique({
      where: { id },
      include: {
        tracks: {
          orderBy: { position: 'asc' }
        }
      }
    });

    if (!playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    }

    // Verify ownership
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (playlist.userId !== user?.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(playlist);
  } catch (error) {
    console.error("GET /api/playlists/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    const playlist = await prisma.playlist.findUnique({ where: { id } });

    if (!playlist) return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    if (playlist.userId !== user?.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const updates = await req.json();

    const updatedPlaylist = await prisma.playlist.update({
      where: { id },
      data: {
        name: updates.name,
        description: updates.description,
        coverImage: updates.coverImage,
        isPublic: updates.isPublic,
      }
    });

    return NextResponse.json(updatedPlaylist);
  } catch (error) {
    console.error("PATCH /api/playlists/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    const playlist = await prisma.playlist.findUnique({ where: { id } });

    if (!playlist) return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
    if (playlist.userId !== user?.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await prisma.playlist.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/playlists/[id] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
