"use client";

import { usePlayerStore } from "@/stores/playerStore";
import { Play, Pause, SkipForward, SkipBack, Volume2, Music2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

export function FloatingControls() {
  const { data: session } = useSession();
  const { 
    isPlaying, 
    pause, 
    resume, 
    next, 
    previous, 
    currentTrack, 
    sdk, 
    toggleLorePanel, 
    isLorePanelOpen,
    volume,
    setVolume,
    setFullScreenPlayerOpen
  } = usePlayerStore();

  if (!currentTrack) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="neural-card crt-scanlines p-3 md:p-4 flex items-center justify-between gap-4 md:gap-8 w-full backdrop-blur-3xl border border-cyan-300/20 shadow-[0_40px_100px_rgba(0,0,0,0.6)]"
    >
      {/* Left: Track Info */}
      <div 
        onClick={() => setFullScreenPlayerOpen(true)}
        className="flex items-center gap-4 min-w-0 flex-1 md:flex-none md:w-[300px] cursor-pointer hover:opacity-90 transition-all active:scale-[0.98]"
      >
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl overflow-hidden shadow-2xl relative shrink-0 border border-cyan-300/25 bg-black y2k-chrome p-1">
          {currentTrack?.album?.images?.[0]?.url ? (
            <img src={currentTrack.album.images[0].url} alt="" className="w-full h-full rounded-xl object-cover" />
          ) : (
            <div className="w-full h-full rounded-xl bg-surface-container flex items-center justify-center">
              <Music2 className="w-6 h-6 text-text-tertiary" />
            </div>
          )}
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-[9px] font-mono font-black tracking-[0.26em] text-[#b6ff00] uppercase mb-0.5">
            Now Spinning
          </span>
          <h4 className="text-sm font-display font-black uppercase tracking-normal truncate text-white">
            {currentTrack?.name || "Aura Silence"}
          </h4>
          <p className="text-[10px] font-mono uppercase tracking-widest text-cyan-100/50 truncate">
            {currentTrack?.artists?.[0]?.name || "Aura // Sound Stream"}
          </p>
        </div>
      </div>

      {/* Center: Visualizer & Controls */}
      <div className="hidden md:flex items-center gap-10 flex-1 justify-center">
        {/* Simple Audio Visualizer Bars - 5 bars as per design */}
        <div className="flex items-end gap-1 h-7 w-16 justify-center y2k-screen rounded-xl px-3 py-1.5">
          {[0.4, 0.8, 0.5, 0.9, 0.6].map((h, i) => (
            <motion.div
              key={i}
              animate={isPlaying ? { height: [`${h * 100}%`, `${(h + 0.3) * 100}%`, `${h * 100}%`] } : { height: "20%" }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
              className={cn(
                "w-[3px] rounded-full",
                i % 3 === 0 ? "bg-[#b6ff00]" : i % 3 === 1 ? "bg-[#00f5ff]" : "bg-[#ff2bd6]"
              )}
              style={{ height: `${h * 100}%` }}
            />
          ))}
        </div>

        <div className="flex items-center gap-4 y2k-screen rounded-full px-4 py-2">
          <button 
            onClick={async () => { 
              if (sdk) {
                await sdk.previous();
              } else {
                previous();
              }
            }} 
            className="text-cyan-100/55 hover:text-[#b6ff00] transition-colors active:scale-90"
          >
            <SkipBack className="w-4 h-4 fill-current" />
          </button>
          
          <button
            onClick={async () => {
              if (isPlaying) { 
                pause(); 
                if (sdk) await sdk.pause(); 
              } else { 
                resume(); 
                if (sdk) await sdk.resume(); 
              }
            }}
            className="w-12 h-12 rounded-full y2k-chrome text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current translate-x-0.5" />
            )}
          </button>

          <button 
            onClick={async () => { 
              if (sdk) {
                await sdk.next();
              } else {
                next();
              }
            }} 
            className="text-cyan-100/55 hover:text-[#b6ff00] transition-colors active:scale-90"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>

      {/* Right: HQ Audio Button & Volume */}
      <div className="flex items-center gap-4 md:gap-6 flex-none pr-2 md:pr-4">
        <button 
          onClick={toggleLorePanel}
          className={cn(
            "hidden md:flex px-5 py-2.5 rounded-full border transition-all gap-1.5 items-center text-[9px] font-mono font-bold tracking-[0.2em] uppercase cursor-pointer",
            isLorePanelOpen 
              ? "bg-pink-500/20 border-pink-300/50 text-pink-100 shadow-[0_0_20px_rgba(255,43,214,0.3)] animate-pulse" 
              : "y2k-button text-white/70 hover:text-white hover:border-cyan-300/40"
          )}
        >
          <Sparkles className={cn("w-3.5 h-3.5", isLorePanelOpen ? "text-pink-200 animate-spin" : "text-[#b6ff00]")} style={{ animationDuration: isLorePanelOpen ? "4s" : "3s" }} />
          Lore File
        </button>

        <button className="hidden lg:flex px-5 py-2.5 rounded-full y2k-screen text-[9px] font-mono font-bold tracking-[0.2em] text-cyan-100/70 hover:text-white transition-all uppercase">
          CD Quality
        </button>
        
        <div className="hidden md:flex items-center gap-3">
          <Volume2 className="w-4 h-4 text-cyan-100/50 shrink-0" />
          <input 
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setVolume(val);
              if (sdk && session?.accessToken) {
                fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${Math.round(val * 100)}`, {
                  method: "PUT",
                  headers: { Authorization: `Bearer ${session.accessToken}` }
                }).catch(err => console.warn("[Aura] Spotify volume set failed:", err));
              }
            }}
            className="premium-slider w-20 h-1 rounded-full cursor-pointer focus:outline-none"
          />
        </div>
      </div>
    </motion.div>
  );
}
