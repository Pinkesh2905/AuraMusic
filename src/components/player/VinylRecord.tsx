"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { usePlayerStore } from "@/stores/playerStore";

export function VinylRecord() {
  const { currentTrack, isPlaying } = usePlayerStore();
  
  // Default fallback image
  const albumArt = currentTrack?.album?.images?.[0]?.url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=500&auto=format&fit=crop";

  return (
    <div className="relative w-[500px] h-[500px] flex items-center justify-center shrink-0">
      {/* Tonearm */}
      <motion.div 
        className="absolute -top-10 right-10 w-12 h-64 origin-top z-20 pointer-events-none"
        initial={{ rotate: -20 }}
        animate={{ rotate: isPlaying ? 25 : -20 }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      >
        <div className="relative w-full h-full">
          {/* Base joint */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-zinc-400 border-[3px] border-zinc-600 shadow-xl" />
          {/* Arm */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-3 h-48 bg-gradient-to-b from-zinc-300 to-zinc-400 rounded-full shadow-lg" />
          {/* Headshell */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-6 h-10 bg-zinc-800 rounded-sm shadow-xl" />
          {/* Stylus */}
          <div className="absolute bottom-4 left-[60%] w-1 h-3 bg-zinc-300 rounded-full" />
        </div>
      </motion.div>

      {/* The Vinyl Disc */}
      <motion.div 
        className="relative w-full h-full rounded-full vinyl-grooves overflow-hidden z-10"
        animate={{ rotate: isPlaying ? 360 : 0 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
      >
        {/* Lighting overlay for realistic shine */}
        <div className="absolute inset-0 rounded-full vinyl-lighting pointer-events-none" />
        
        {/* Center Label (Album Art) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-black flex items-center justify-center border-[4px] border-[#111]">
          <div className="relative w-full h-full rounded-full overflow-hidden">
             <Image
                src={albumArt}
                alt="Album Art"
                fill
                sizes="160px"
                priority
                className="object-cover"
             />
          </div>
          {/* Spindle hole */}
          <div className="absolute w-3 h-3 rounded-full bg-white/80 shadow-inner z-10" />
        </div>
      </motion.div>
    </div>
  );
}
