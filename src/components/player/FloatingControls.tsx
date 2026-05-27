"use client";

import { usePlayerStore } from "@/stores/playerStore";
import { Play, Pause, SkipForward, SkipBack, Volume2, Music2, Sparkles, Heart, Shuffle, Repeat, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useState } from "react";

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
    volume,
    setVolume,
    shuffle,
    toggleShuffle,
    repeat,
    cycleRepeat,
    setFullScreenPlayerOpen
  } = usePlayerStore();

  const [isLiked, setIsLiked] = useState(false);

  if (!currentTrack) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="rounded-full bg-[#0a0520]/80 backdrop-blur-2xl border border-pink-500/20 shadow-[0_15px_45px_rgba(0,0,0,0.85),0_0_30px_rgba(255,43,214,0.15)] px-6 py-3 flex items-center justify-between gap-4 md:gap-8 w-full"
    >
      {/* Left: Track Info & Liked Heart Toggle */}
      <div className="flex items-center gap-3.5 min-w-0 flex-1 md:flex-none md:w-[280px]">
        <div 
          onClick={() => setFullScreenPlayerOpen(true)}
          className="w-11 h-11 rounded-xl overflow-hidden shadow-lg relative shrink-0 border border-pink-500/30 bg-black cursor-pointer hover:scale-105 active:scale-95 transition-all"
        >
          {currentTrack?.album?.images?.[0]?.url ? (
            <img src={currentTrack.album.images[0].url} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-surface-container flex items-center justify-center">
              <Music2 className="w-5 h-5 text-text-tertiary" />
            </div>
          )}
        </div>

        <div className="flex flex-col min-w-0 mr-1">
          <h4 
            onClick={() => setFullScreenPlayerOpen(true)}
            className="text-xs font-mono font-black uppercase tracking-wider truncate text-white hover:text-pink-300 transition-colors cursor-pointer"
          >
            {currentTrack?.name || "Aura Silence"}
          </h4>
          <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 truncate">
            {currentTrack?.artists?.[0]?.name || "Aura // Sound Stream"}
          </p>
        </div>

        {/* Liked Heart Icon */}
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className="shrink-0 p-1.5 rounded-full hover:bg-white/5 active:scale-90 transition-all cursor-pointer"
        >
          <Heart 
            className={cn(
              "w-4.5 h-4.5 transition-all duration-300", 
              isLiked ? "text-pink-500 fill-pink-500 filter drop-shadow-[0_0_6px_rgba(236,72,153,0.7)] scale-110" : "text-zinc-500 hover:text-zinc-300"
            )} 
          />
        </button>
      </div>

      {/* Center: Shuffle, Back, Play/Pause, Next, Repeat & soundwave indicator */}
      <div className="flex items-center gap-6 md:gap-8 flex-1 justify-center">
        {/* Playback Controls Row */}
        <div className="flex items-center gap-4.5 bg-[#120b2d]/60 border border-white/5 px-5 py-2.5 rounded-full shadow-inner">
          {/* Shuffle button */}
          <button 
            onClick={toggleShuffle} 
            className={cn(
              "transition-colors cursor-pointer active:scale-90 p-1 rounded-full",
              shuffle ? "text-pink-300 filter drop-shadow-[0_0_4px_#ff2bd6]" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>

          {/* Prev button */}
          <button 
            onClick={async () => { 
              if (sdk) {
                await sdk.previous();
              } else {
                previous();
              }
            }} 
            className="text-zinc-400 hover:text-white transition-colors active:scale-90 p-1 rounded-full"
          >
            <SkipBack className="w-3.5 h-3.5 fill-current" />
          </button>
          
          {/* Play/Pause circular button */}
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
            className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 via-pink-500 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(236,72,153,0.4)]"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current translate-x-0.5" />
            )}
          </button>

          {/* Next button */}
          <button 
            onClick={async () => { 
              if (sdk) {
                await sdk.next();
              } else {
                next();
              }
            }} 
            className="text-zinc-400 hover:text-white transition-colors active:scale-90 p-1 rounded-full"
          >
            <SkipForward className="w-3.5 h-3.5 fill-current" />
          </button>

          {/* Repeat button */}
          <button 
            onClick={cycleRepeat} 
            className={cn(
              "transition-colors cursor-pointer active:scale-90 p-1 rounded-full relative",
              repeat !== "off" ? "text-pink-300 filter drop-shadow-[0_0_4px_#ff2bd6]" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <Repeat className="w-3.5 h-3.5" />
            {repeat === "track" && (
              <span className="absolute -top-1 -right-1 text-[7px] font-sans font-black text-[#b6ff00] bg-black rounded-full px-0.5">1</span>
            )}
          </button>
        </div>

        {/* Real-time reactive Audio Waveform Visualizer Indicator */}
        <div className="hidden lg:flex items-end gap-[3px] h-6 w-20 justify-center bg-black/40 border border-white/5 rounded-full px-4.5 py-1.5 shrink-0">
          {[0.4, 0.75, 0.5, 0.9, 0.6, 0.8, 0.45].map((h, i) => (
            <motion.div
              key={i}
              animate={isPlaying ? { height: [`${h * 100}%`, `${Math.min((h + 0.3), 1.0) * 100}%`, `${h * 100}%`] } : { height: "20%" }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.08 }}
              className={cn(
                "w-[2px] rounded-full",
                i % 3 === 0 ? "bg-[#b6ff00]" : i % 3 === 1 ? "bg-[#00f5ff]" : "bg-[#ff2bd6]"
              )}
              style={{ height: `${h * 100}%` }}
            />
          ))}
        </div>
      </div>

      {/* Right: Volume & Expand Player */}
      <div className="flex items-center gap-4.5 flex-none pr-1">
        {/* Volume controls */}
        <div className="hidden md:flex items-center gap-2.5 bg-[#120b2d]/60 border border-white/5 px-3 py-1.5 rounded-full">
          <Volume2 className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
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
            className="premium-slider w-16 h-1 rounded-full cursor-pointer focus:outline-none"
          />
        </div>

        {/* Expand full screen player button */}
        <button 
          onClick={() => setFullScreenPlayerOpen(true)}
          className="p-2 rounded-full bg-[#120b2d]/60 border border-white/5 hover:border-pink-500/30 text-zinc-400 hover:text-white transition-all active:scale-90 cursor-pointer"
          title="Expand Player"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
