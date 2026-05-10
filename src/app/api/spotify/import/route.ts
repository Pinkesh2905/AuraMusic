import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { SpotifyClient } from "@/lib/spotify/client";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    // @ts-ignore - we added accessToken in the session callback
    const accessToken = session?.accessToken;

    if (!session?.user?.email || !accessToken) {
      return NextResponse.json({ error: "Unauthorized or missing Spotify connection" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const client = new SpotifyClient(accessToken);
    
    // Fetch the user's Spotify playlists
    const spotifyPlaylists = await client.getUserPlaylists();

    if (!spotifyPlaylists.items || spotifyPlaylists.items.length === 0) {
      return NextResponse.json({ message: "No playlists found on Spotify" }, { status: 200 });
    }

    let importedCount = 0;

    // Process each playlist
    for (const sp of spotifyPlaylists.items) {
      // Create a playlist in Aura
      const auraPlaylist = await prisma.playlist.create({
        data: {
          name: sp.name,
          description: sp.description || "",
          coverImage: sp.images && sp.images.length > 0 ? sp.images[0].url : null,
          isPublic: sp.public || false,
          userId: user.id
        }
      });

      // Fetch tracks for this playlist
      // For MVP, we only fetch the first 100 tracks of each playlist
      const tracksData = await client.getPlaylistTracks(sp.id);
      
      if (tracksData.items && tracksData.items.length > 0) {
        const trackCreates = tracksData.items
          .filter((item: any) => item.track && item.track.id) // Ensure track exists
          .map((item: any, index: number) => ({
            spotifyId: item.track.id,
            position: index,
            playlistId: auraPlaylist.id
          }));

        if (trackCreates.length > 0) {
          await prisma.playlistTrack.createMany({
            data: trackCreates
          });
        }
      }
      
      importedCount++;
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully imported ${importedCount} playlists` 
    }, { status: 201 });

  } catch (error) {
    console.error("POST /api/spotify/import error:", error);
    return NextResponse.json({ error: "Failed to import from Spotify" }, { status: 500 });
  }
}
