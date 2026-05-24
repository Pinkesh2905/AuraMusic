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
    <main className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-36 flex flex-col min-h-screen relative z-10 gap-8">
      <Link href="/library" className="flex items-center gap-2 text-cyan-100/55 hover:text-[#b6ff00] mb-2 w-fit transition-colors font-mono uppercase tracking-wider text-xs">
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Library</span>
      </Link>

      <div className="flex items-end gap-6 mb-4 y2k-panel rounded-[2rem] p-5">
        <div className="w-32 h-32 rounded-xl overflow-hidden shadow-lg shrink-0 border border-cyan-300/20">
          <img src={PLAYLIST_TRACKS[0].albumArt} alt="Cover" className="w-full h-full object-cover" />
        </div>
        <div>
          <h4 className="text-[10px] font-mono font-black tracking-[0.3em] text-[#b6ff00] mb-1 uppercase">Playlist</h4>
          <h1 className="text-4xl font-display font-black uppercase tracking-normal text-white mb-2 neon-text">Deep Focus Flow</h1>
          <p className="text-sm font-mono uppercase tracking-wider text-cyan-100/50">{PLAYLIST_TRACKS.length} tracks</p>
        </div>
      </div>

      <TrackList tracks={PLAYLIST_TRACKS} />
    </main>
  );
}
