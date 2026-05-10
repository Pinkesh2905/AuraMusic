"use client";

import { usePlayerStore } from "@/stores/playerStore";
import { useEffect, useState } from "react";
import { VinylRecord } from "../player/VinylRecord";
import { FloatingControls } from "../player/FloatingControls";
import { LeftNav } from "../navigation/LeftNav";
import { extractDominantColor } from "@/lib/colorExtractor";
import Image from "next/image";
import { LorePanel } from "../player/LorePanel";

export function SplitDashboard({ children }: { children: React.ReactNode }) {
  const { currentTrack } = usePlayerStore();
  const [leftColor, setLeftColor] = useState("#2E3A59");
  const [rightColor, setRightColor] = useState("#F2EFE9");

  useEffect(() => {
    const albumArt = currentTrack?.album?.images?.[0]?.url;
    if (albumArt) {
      extractDominantColor(albumArt).then(color => {
        setLeftColor(color);
      });
    }
  }, [currentTrack]);

  return (
    <div 
      className="w-screen h-screen overflow-hidden relative flex transition-colors duration-1000 ease-in-out"
      style={{
        background: `linear-gradient(105deg, ${leftColor} 50%, ${rightColor} 50.2%)`
      }}
    >
      {/* Left Panel: Content / Queue */}
      <div className="w-1/2 h-full flex flex-col p-10 pt-16 overflow-y-auto relative z-10 text-white">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-white" />
          </div>
          <span className="font-display font-semibold tracking-wide text-xl">Aura Music</span>
        </div>

        <LeftNav />

        {/* Main Content Area (e.g. Trending List, Discover, Library) */}
        <div className="flex-1 w-full max-w-md pb-32">
          {children}
        </div>
      </div>

      {/* Center Absolute: The Vinyl */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <VinylRecord />
      </div>

      {/* Right Panel: Track Info */}
      <div className="w-1/2 h-full flex items-center justify-end p-20 z-10 text-black">
        <div className="flex flex-col items-center gap-6 w-80">
          {/* Album Cover */}
          <div className="w-64 h-64 rounded-3xl overflow-hidden shadow-2xl relative border-4 border-white/40">
            <Image 
              src={currentTrack?.album?.images?.[0]?.url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=500&auto=format&fit=crop"}
              alt="Album cover"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="object-cover"
            />
          </div>
          
          {/* Track Name & Artist */}
          <div className="text-center">
            <h2 className="text-2xl font-display font-bold tracking-tight text-zinc-900 mb-1">
              {currentTrack?.name || "Starboy (feat. Daft Punk)"}
            </h2>
            <p className="text-zinc-500 font-medium tracking-wider text-sm uppercase">
              {currentTrack?.artists?.map(a => a.name).join(", ") || "The Weeknd"}
            </p>
          </div>
        </div>
      </div>

      {/* Floating Bottom Player */}
      <FloatingControls />

      {/* Lore Side Drawer */}
      <LorePanel />
    </div>
  );
}
