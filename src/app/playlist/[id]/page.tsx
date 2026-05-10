import { TrackList } from "@/components/player/TrackList";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const PLAYLIST_TRACKS = [
  { id: "p1", name: "Deep Focus 1", artist: "Artist A", duration: 200000, albumArt: "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=500&q=80" },
  { id: "p2", name: "Deep Focus 2", artist: "Artist B", duration: 215000, albumArt: "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=500&q=80" },
  { id: "p3", name: "Deep Focus 3", artist: "Artist C", duration: 180000, albumArt: "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=500&q=80" },
];

export default async function PlaylistPage({ params }: { params: { id: string } }) {
  // In a real implementation, we would fetch the playlist data using params.id
  // const playlist = await getPlaylist(params.id);

  return (
    <main className="w-full h-full flex flex-col">
      <Link href="/library" className="flex items-center gap-2 text-white/50 hover:text-white mb-6 w-fit transition-colors">
        <ChevronLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Library</span>
      </Link>

      <div className="flex items-end gap-6 mb-8">
        <div className="w-32 h-32 rounded-xl overflow-hidden shadow-lg shrink-0">
          <img src={PLAYLIST_TRACKS[0].albumArt} alt="Cover" className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="text-xs font-bold tracking-[0.2em] text-white/60 mb-1 uppercase">Playlist</h4>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Deep Focus Flow</h1>
          <p className="text-sm text-white/50">{PLAYLIST_TRACKS.length} tracks</p>
        </div>
      </div>

      <TrackList tracks={PLAYLIST_TRACKS} />
    </main>
  );
}
