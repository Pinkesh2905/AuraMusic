"use client";

import { usePlayerStore } from "@/stores/playerStore";
import { Play, Pause, SkipForward, SkipBack, Volume2, Repeat, Shuffle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function FloatingControls() {
  const { isPlaying, play, pause, next, previous, progress, duration, currentTrack, toggleLorePanel, isLorePanelOpen } = usePlayerStore();

  const handlePlayPause = () => {
    if (!currentTrack) return;
    if (isPlaying) pause();
    else play(currentTrack, [currentTrack]);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-pill px-8 py-4 rounded-full flex items-center gap-8 w-[600px] max-w-[90vw]"
      >
        {/* Track time & Progress */}
        <div className="flex-1 flex items-center gap-3">
          <span className="text-xs text-white/60 font-medium w-10 text-right">
            {formatTime(progress)}
          </span>
          <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden relative cursor-pointer">
            <div 
              className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="text-xs text-white/60 font-medium w-10">
            {formatTime(duration)}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6 shrink-0">
          <button suppressHydrationWarning className="text-white/50 hover:text-white transition-colors">
            <Shuffle className="w-4 h-4" />
          </button>
          
          <button suppressHydrationWarning onClick={previous} className="text-white/80 hover:text-white transition-colors">
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          
          <button 
            suppressHydrationWarning
            onClick={handlePlayPause}
            className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-1" />
            )}
          </button>
          
          <button suppressHydrationWarning onClick={next} className="text-white/80 hover:text-white transition-colors">
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          <button suppressHydrationWarning className="text-white/50 hover:text-white transition-colors">
            <Repeat className="w-4 h-4" />
          </button>
          
          <div className="w-[1px] h-4 bg-white/20 mx-2" />
          
          <button 
            suppressHydrationWarning
            onClick={toggleLorePanel}
            className={`transition-colors ${isLorePanelOpen ? 'text-purple-400' : 'text-white/50 hover:text-white'}`}
            title="Artist Lore"
          >
            <Sparkles className="w-4 h-4" />
          </button>
        </div>

        {/* Volume */}
        <div className="w-24 flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-white/60" />
          <div className="flex-1 h-1 bg-black/40 rounded-full overflow-hidden relative cursor-pointer">
            <div className="absolute top-0 left-0 h-full w-4/5 bg-white/80 rounded-full" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
