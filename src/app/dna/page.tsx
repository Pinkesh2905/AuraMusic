"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Dna, Zap, Music2, User2, LogOut } from "lucide-react";
import { SmoothLoader } from "@/components/ui/SmoothLoader";
import { signOut } from "next-auth/react";

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
  Introspective: "from-blue-600/20 to-indigo-900/40 border-blue-500/25 shadow-[0_0_50px_rgba(59,130,246,0.1)]",
  Energetic: "from-orange-500/20 to-red-900/40 border-orange-500/25 shadow-[0_0_50px_rgba(249,115,22,0.1)]",
  Romantic: "from-pink-500/20 to-rose-900/40 border-pink-500/25 shadow-[0_0_50px_rgba(236,72,153,0.1)]",
  Rebellious: "from-purple-600/20 to-violet-900/40 border-purple-500/25 shadow-[0_0_50px_rgba(168,85,247,0.1)]",
  Melancholic: "from-slate-600/20 to-blue-900/40 border-slate-500/25 shadow-[0_0_50px_rgba(100,116,139,0.1)]",
  Euphoric: "from-yellow-500/20 to-orange-900/40 border-yellow-500/25 shadow-[0_0_50px_rgba(234,179,8,0.1)]",
  Eclectic: "from-teal-500/20 to-cyan-900/40 border-teal-500/25 shadow-[0_0_50px_rgba(20,184,166,0.1)]",
  Default: "from-purple-600/20 to-indigo-900/40 border-purple-500/25 shadow-[0_0_50px_rgba(168,85,247,0.1)]",
};

// Sequences
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05
    }
  }
} as const;

const itemVariants = {
  hidden: { y: 30, opacity: 0, filter: "blur(6px)" },
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 18
    }
  }
} as const;

const bubbleVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 } 
  }
} as const;

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

  // Spotlight coordinates tracker
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--mouse-x", `${x}px`);
    el.style.setProperty("--mouse-y", `${y}px`);
  };

  const gradientClass = data?.personality?.dominantMood
    ? MOOD_COLORS[data.personality.dominantMood] || MOOD_COLORS.Default
    : MOOD_COLORS.Default;

  const maxGenreCount = data?.topGenres?.[0]?.count || 1;

  if (isLoading) {
    return <SmoothLoader fullScreen label="Mapping your Sonic DNA..." />;
  }

  if (error || !data) {
    return (
      <main className="w-full h-full flex items-center justify-center text-text-secondary/50 text-sm">
        {error || "No data found. Connect your Spotify account and listen to some music first!"}
      </main>
    );
  }

  return (
    <motion.main 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-36 flex flex-col min-h-screen relative z-10 gap-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h4 className="text-[10px] font-black tracking-[0.3em] text-[#b6ff00] mb-2 uppercase flex items-center gap-2 font-mono">
          <Dna className="w-4 h-4 animate-pulse" />
          Sonic Genome
        </h4>
        <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-normal text-white mb-1 neon-text">Sonic DNA</h1>
        <p className="text-sm text-text-secondary font-medium">Your unique musical fingerprint, synthesized into a premium profile.</p>
      </motion.div>

      {/* Glassmorphic Personality Card */}
      <motion.div
        variants={itemVariants}
        onMouseMove={handleMouseMove}
        className={`spotlight-card glass-premium crt-scanlines rounded-[2rem] p-8 md:p-10 border overflow-hidden bg-gradient-to-br ${gradientClass}`}
      >
        {/* Dynamic decorative backdrop blurs */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-primary/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-secondary/15 blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="relative z-10">
          <span className="inline-block text-[10px] font-mono font-black tracking-widest uppercase y2k-screen text-[#b6ff00] px-4 py-1.5 rounded-full mb-6">
            {data.personality.dominantMood} Listener
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-black uppercase tracking-normal text-white mb-4 leading-none neon-text">
            {data.personality.headline}
          </h2>
          <p className="text-sm md:text-base text-white/80 leading-relaxed mb-6 font-medium">
            {data.personality.description}
          </p>
          <div className="flex items-start gap-4 y2k-screen rounded-2xl p-5">
            <Zap className="w-5 h-5 text-yellow-300 shrink-0 animate-bounce" style={{ animationDuration: "3s" }} />
            <p className="text-xs md:text-sm text-white/95 leading-relaxed font-medium">{data.personality.funInsight}</p>
          </div>
        </div>
      </motion.div>

      {/* Top Artists Grid */}
      {data.topArtists.length > 0 && (
        <motion.div variants={itemVariants} className="flex flex-col gap-5">
          <div className="flex items-center gap-2 mb-1">
            <User2 className="w-4 h-4 text-primary" />
            <h3 className="text-[10px] font-mono font-black tracking-[0.24em] uppercase text-[#b6ff00]">Dominant Artists</h3>
          </div>
          
          <motion.div 
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.06
                }
              }
            }}
            className="grid grid-cols-3 gap-4"
          >
            {data.topArtists.map((artist, i) => (
              <motion.div
                key={`${artist.id}-${i}`}
                variants={bubbleVariants}
                onMouseMove={handleMouseMove}
                className="spotlight-card flex flex-col items-center gap-3 p-4 rounded-3xl y2k-panel hover:border-cyan-300/30 hover:scale-[1.02] transition-all cursor-pointer group"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-white/5 shrink-0 border-2 border-white/10 group-hover:border-purple-400/80 transition-colors shadow-lg">
                  {artist.image ? (
                    <img src={artist.image} alt={artist.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/30">
                      <User2 className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center text-center gap-1 w-full z-10">
                  <p className="text-xs md:text-sm font-black text-white leading-tight truncate w-full">{artist.name}</p>
                  {artist.genres[0] && (
                    <span className="text-[9px] font-mono tracking-wider uppercase text-text-secondary truncate w-full">{artist.genres[0]}</span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* Genre Bars */}
      {data.topGenres.length > 0 && (
        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          <div className="flex items-center gap-2 mb-1">
            <Music2 className="w-4 h-4 text-primary" />
            <h3 className="text-[10px] font-mono font-black tracking-[0.24em] uppercase text-[#b6ff00]">Genre Profile</h3>
          </div>
          
          <div className="flex flex-col gap-4 y2k-screen rounded-[2rem] p-6 md:p-8">
            {data.topGenres.map((genre, i) => (
              <div key={genre.name} className="flex items-center gap-4">
                <span className="text-xs md:text-sm font-mono font-bold uppercase tracking-wider text-text-secondary w-28 md:w-32 capitalize truncate shrink-0">{genre.name}</span>
                <div className="flex-1 h-2.5 rounded-full bg-white/5 overflow-hidden border border-white/5">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary via-tertiary to-secondary"
                    initial={{ width: 0 }}
                    animate={{ width: `${(genre.count / maxGenreCount) * 100}%` }}
                    transition={{ delay: 0.25 + i * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
                <span className="text-[10px] font-mono text-white/50 w-8 text-right font-black">
                  {Math.round((genre.count / maxGenreCount) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Top Tracks */}
      {data.topTracks.length > 0 && (
        <motion.div variants={itemVariants} className="flex flex-col gap-5">
          <div className="flex items-center gap-2 mb-1">
            <Music2 className="w-4 h-4 text-primary" />
            <h3 className="text-[10px] font-mono font-black tracking-[0.24em] uppercase text-[#b6ff00]">Aura Anchors</h3>
          </div>
          
          <motion.div 
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.05
                }
              }
            }}
            className="flex flex-col gap-3"
          >
            {data.topTracks.map((track, i) => (
              <motion.div
                key={`${track.id}-${i}`}
                variants={itemVariants}
                onMouseMove={handleMouseMove}
                className="spotlight-card flex items-center gap-4 p-4 rounded-2xl y2k-panel hover:border-pink-300/25 hover:scale-[1.01] transition-all duration-300"
              >
                <span className="text-xs font-mono text-primary w-5 text-center font-black">{String(i + 1).padStart(2, '0')}</span>
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 shrink-0 border border-white/10 shadow-md">
                  {track.albumArt && <img src={track.albumArt} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0 z-10">
                  <p className="text-sm md:text-base font-black text-white truncate">{track.name}</p>
                  <p className="text-xs text-text-secondary truncate mt-0.5">{track.artist}</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono uppercase tracking-widest text-text-secondary shrink-0 hidden md:block z-10">
                  Aura Choice
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* Sign Out Button (especially for Mobile users) */}
      <motion.div variants={itemVariants} className="mt-8 flex justify-center w-full">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full max-w-sm flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-rose-300 font-bold border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 active:scale-[0.98] transition-all font-display tracking-wider cursor-pointer group"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span>SIGN OUT OF AURA</span>
        </button>
      </motion.div>
    </motion.main>
  );
}
