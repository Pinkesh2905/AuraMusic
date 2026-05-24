"use client";

import { useEffect, useState } from "react";
import { TrackList } from "@/components/player/TrackList";
import { Sparkles, Loader2, Disc, Play, Zap } from "lucide-react";

export default function DiscoverPage() {
  const [moodData, setMoodData] = useState<{ mood: string; tracks: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMood = async () => {
      try {
        const res = await fetch("/api/mood");
        if (res.ok) {
          const data = await res.json();
          setMoodData(data);
        }
      } catch (error) {
        console.error("Failed to fetch mood:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMood();
  }, []);

  return (
    <main className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-36 flex flex-col min-h-screen">
      {/* Page Header */}
      <div className="mb-10 max-w-xl">
        <h4 className="text-[10px] font-mono font-black tracking-[0.3em] text-[#b6ff00] mb-2.5 uppercase flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#b6ff00]" />
          Aura Scanner
        </h4>
        <h1 className="text-4xl md:text-5xl font-display font-black uppercase tracking-normal text-white mb-3 neon-text">
          Current Aura
        </h1>
        <p className="text-sm text-text-secondary leading-relaxed font-medium">
          Aura maps your musical identity in real-time, delivering a personalized reflection of your current sonic energy.
        </p>
      </div>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-24 text-white/50 gap-4 y2k-screen rounded-[2rem]">
          <Loader2 className="w-8 h-8 animate-spin text-[#b6ff00]" />
          <p className="text-sm font-mono tracking-wider uppercase animate-pulse">Tuning to your listening profile...</p>
        </div>
      ) : moodData && moodData.tracks.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start flex-1">
          {/* Left Column: Mood Resonance Badge */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="relative p-8 rounded-[2rem] y2k-panel crt-scanlines overflow-hidden group">
              {/* Dynamic Aura Glow behind card */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />
              
              <span className="text-[10px] font-mono text-[#b6ff00] uppercase tracking-[0.3em] font-black">
                Active Vibe
              </span>
              <h3 className="text-3xl md:text-4xl font-display font-black tracking-normal text-white mt-2 mb-1 relative z-10 uppercase neon-text">
                {moodData.mood}
              </h3>
              <p className="text-xs text-white/50 relative z-10 font-mono uppercase tracking-wider mt-2">
                Computed Aura Vibe
              </p>
            </div>

            {/* Diagnostics Stats */}
            <div className="p-6 rounded-2xl y2k-screen">
              <h4 className="text-[11px] font-mono font-bold tracking-widest text-cyan-100/50 uppercase mb-3">Vibe Profile</h4>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/40 font-mono uppercase">Analysis Mode</span>
                  <span className="text-cyan-400 font-mono font-bold uppercase">Real-time Scan</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/40 font-mono uppercase">Vibe Engine</span>
                  <span className="text-purple-400 font-mono font-bold uppercase">Aura Engine 2.5</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/40 font-mono uppercase">Vibe Affinity</span>
                  <span className="text-pink-400 font-mono font-bold uppercase">98.4% Match</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column: Track List in Glassmorphic Card (Ensuring flawless text contrast on cream background) */}
          <div className="lg:col-span-7 p-6 md:p-8 rounded-[2rem] y2k-panel">
            <h3 className="text-[10px] font-mono font-black tracking-[0.3em] text-[#b6ff00] mb-6 uppercase ml-2">
              Aura Selection
            </h3>
            <div className="max-h-[550px] overflow-y-auto pr-2 scrollbar-hide">
              <TrackList tracks={moodData.tracks.map(t => ({
                id: t.id,
                name: t.name,
                artist: t.artists[0]?.name || "Unknown Artist",
                duration: t.duration_ms,
                albumArt: t.album.images[0]?.url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80"
              }))} />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-16 text-center px-4 max-w-xl mx-auto">
          {/* Animated Pulsing Aura Ring */}
          <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
            {/* Pulsing glow backdrops */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 animate-pulse blur-xl" />
            <div className="absolute inset-4 rounded-full bg-gradient-to-bl from-pink-500/10 to-indigo-500/10 animate-ping opacity-60" style={{ animationDuration: "3s" }} />
            
            {/* Spinning faded vinyl */}
            <div className="relative w-36 h-36 rounded-full border border-cyan-300/25 bg-black/40 backdrop-blur-md flex items-center justify-center shadow-2xl animate-[spin_10s_linear_infinite] group vinyl-grooves">
              <Disc className="w-16 h-16 text-white/20 group-hover:text-purple-400 transition-colors" />
              <div className="absolute w-10 h-10 rounded-full border border-white/10 bg-black/60 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-purple-500/60" />
              </div>
            </div>
            
            {/* Orbiting particles/sparkles */}
            <div className="absolute top-4 left-4 p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 animate-bounce">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="absolute bottom-6 right-6 p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 animate-pulse">
              <Zap className="w-4 h-4" />
            </div>
          </div>

          <h3 className="text-2xl font-display font-black uppercase tracking-normal text-white mb-3 neon-text">
            Your Aura is Gathering Energy
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed mb-8 max-w-sm font-medium">
            Not enough listening history detected. Connect your Spotify, spin some tracks on the tactile platter, and let the platter map your signature vibe.
          </p>

          <button 
            onClick={() => window.location.href = "/"}
            className="px-8 py-3.5 rounded-full y2k-button text-xs font-mono font-bold tracking-widest text-white/80 hover:text-white hover:border-pink-300/40 transition-all uppercase flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current text-purple-400 animate-pulse" />
            Go to Platter
          </button>
        </div>
      )}
    </main>
  );
}
