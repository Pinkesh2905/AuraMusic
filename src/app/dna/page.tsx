"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Dna, Zap, Music2, User2 } from "lucide-react";

interface DnaData {
  personality: {
    headline: string;
    description: string;
    dominantMood: string;
    funInsight: string;
  };
  topArtists: { id: string; name: string; image?: string; genres: string[] }[];
  topTracks: { id: string; name: string; artist: string; albumArt?: string }[];
  topGenres: { name: string; count: number }[];
}

const MOOD_COLORS: Record<string, string> = {
  Introspective: "from-blue-600 to-indigo-800",
  Energetic: "from-orange-500 to-red-700",
  Romantic: "from-pink-500 to-rose-700",
  Rebellious: "from-purple-600 to-violet-900",
  Melancholic: "from-slate-600 to-blue-900",
  Euphoric: "from-yellow-500 to-orange-600",
  Eclectic: "from-teal-500 to-cyan-700",
  Default: "from-purple-600 to-indigo-800",
};

export default function DnaPage() {
  const [data, setData] = useState<DnaData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/dna")
      .then(res => res.json())
      .then(d => {
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch(() => setError("Could not load your Sonic DNA."))
      .finally(() => setIsLoading(false));
  }, []);

  const gradientClass = data?.personality?.dominantMood
    ? MOOD_COLORS[data.personality.dominantMood] || MOOD_COLORS.Default
    : MOOD_COLORS.Default;

  const maxGenreCount = data?.topGenres?.[0]?.count || 1;

  if (isLoading) {
    return (
      <main className="w-full h-full flex flex-col items-center justify-center gap-5 text-white/60">
        <div className="relative">
          <Dna className="w-12 h-12 text-purple-400 animate-spin" style={{ animationDuration: "3s" }} />
          <div className="absolute inset-0 rounded-full bg-purple-500/20 animate-ping" />
        </div>
        <p className="text-sm font-medium animate-pulse">Sequencing your Sonic DNA with Gemini...</p>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="w-full h-full flex items-center justify-center text-white/50 text-sm">
        {error || "No data found. Connect your Spotify account and listen to some music first!"}
      </main>
    );
  }

  return (
    <main className="w-full h-full flex flex-col pt-8 overflow-y-auto pr-4 scrollbar-hide pb-32 gap-8">
      {/* Header */}
      <div>
        <h4 className="text-xs font-bold tracking-[0.2em] text-white/60 mb-2 uppercase flex items-center gap-2">
          <Dna className="w-4 h-4 text-purple-400" />
          Intelligence Layer
        </h4>
        <h1 className="text-4xl font-display font-bold text-white mb-1">Sonic DNA</h1>
        <p className="text-sm text-white/50">Your unique musical fingerprint, decoded by AI.</p>
      </div>

      {/* Personality Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative rounded-3xl p-7 overflow-hidden bg-gradient-to-br ${gradientClass}`}
      >
        {/* Animated background orbs */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full bg-black/20 blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="relative z-10">
          <span className="inline-block text-xs font-bold tracking-widest uppercase bg-white/20 text-white px-3 py-1 rounded-full mb-4">
            {data.personality.dominantMood} Listener
          </span>
          <h2 className="text-2xl font-display font-bold text-white mb-3 leading-tight">
            {data.personality.headline}
          </h2>
          <p className="text-sm text-white/80 leading-relaxed mb-5">
            {data.personality.description}
          </p>
          <div className="flex items-start gap-3 bg-black/20 rounded-2xl p-4">
            <Zap className="w-4 h-4 text-yellow-300 mt-0.5 shrink-0" />
            <p className="text-xs text-white/90 leading-relaxed">{data.personality.funInsight}</p>
          </div>
        </div>
      </motion.div>

      {/* Top Artists */}
      {data.topArtists.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="flex items-center gap-2 mb-4">
            <User2 className="w-4 h-4 text-white/50" />
            <h3 className="text-xs font-bold tracking-widest uppercase text-white/60">Top Artists</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {data.topArtists.map((artist, i) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.06 }}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden bg-white/10 shrink-0 border-2 border-white/10 group-hover:border-purple-400/60 transition-colors">
                  {artist.image ? (
                    <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/30">
                      <User2 className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <p className="text-xs font-semibold text-white text-center leading-tight truncate w-full">{artist.name}</p>
                {artist.genres[0] && (
                  <span className="text-[10px] text-white/40 truncate w-full text-center">{artist.genres[0]}</span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Genre Bars */}
      {data.topGenres.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div className="flex items-center gap-2 mb-4">
            <Music2 className="w-4 h-4 text-white/50" />
            <h3 className="text-xs font-bold tracking-widest uppercase text-white/60">Genre Breakdown</h3>
          </div>
          <div className="flex flex-col gap-3">
            {data.topGenres.map((genre, i) => (
              <div key={genre.name} className="flex items-center gap-3">
                <span className="text-xs text-white/70 w-28 capitalize truncate shrink-0">{genre.name}</span>
                <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${(genre.count / maxGenreCount) * 100}%` }}
                    transition={{ delay: 0.3 + i * 0.05, duration: 0.6, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Top Tracks */}
      {data.topTracks.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <div className="flex items-center gap-2 mb-4">
            <Music2 className="w-4 h-4 text-white/50" />
            <h3 className="text-xs font-bold tracking-widest uppercase text-white/60">Top Tracks Right Now</h3>
          </div>
          <div className="flex flex-col gap-2">
            {data.topTracks.map((track, i) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.07 }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
              >
                <span className="text-xs text-white/30 w-5 text-center font-medium">{i + 1}</span>
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10 shrink-0">
                  {track.albumArt && <img src={track.albumArt} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{track.name}</p>
                  <p className="text-xs text-white/50 truncate">{track.artist}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </main>
  );
}
