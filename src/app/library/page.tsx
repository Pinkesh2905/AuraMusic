import Link from "next/link";

const MOCK_PLAYLISTS = [
  { id: "1", name: "Deep Focus Flow", trackCount: 42, cover: "https://images.unsplash.com/photo-1518773553398-650c184e0bb3?w=500&q=80" },
  { id: "2", name: "Late Night Drive", trackCount: 18, cover: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=500&q=80" },
  { id: "3", name: "Gym Energy", trackCount: 55, cover: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&q=80" },
  { id: "4", name: "Acoustic Morning", trackCount: 20, cover: "https://images.unsplash.com/photo-1483821838626-950c455850e0?w=500&q=80" },
];

export default function LibraryPage() {
  return (
    <main className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-36 flex flex-col min-h-screen relative z-10 gap-8">
      <div className="mb-2">
        <h4 className="text-[10px] font-mono font-black tracking-[0.3em] text-[#b6ff00] mb-2 uppercase flex items-center gap-2">Jewel Case Library</h4>
        <h1 className="text-4xl font-display font-black uppercase tracking-normal text-white neon-text">Curated Collections</h1>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {MOCK_PLAYLISTS.map(playlist => (
          <Link key={playlist.id} href={`/playlist/${playlist.id}`} className="group cursor-pointer y2k-panel rounded-[1.6rem] p-3 transition-all hover:scale-[1.01]">
            <div className="w-full aspect-square rounded-2xl overflow-hidden relative mb-3 border border-cyan-300/20">
              <img src={playlist.cover} alt={playlist.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
            <h4 className="text-sm font-display font-black uppercase text-white truncate px-1">{playlist.name}</h4>
            <p className="text-[10px] font-mono uppercase tracking-widest text-cyan-100/50 px-1">{playlist.trackCount} tracks</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
