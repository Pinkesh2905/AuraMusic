"use client";

import { TrackList } from "@/components/player/TrackList";
import { Search, Play } from "lucide-react";
import { cn } from "@/lib/utils";


const RECENT_SEARCHES = [
  { id: "s1", name: "Blinding Lights", artist: "The Weeknd", duration: 200000, albumArt: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80" },
  { id: "s2", name: "Save Your Tears", artist: "The Weeknd", duration: 215000, albumArt: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80" },
];

const MOODS = [
  { label: "Brat", color: "bg-[#8ACE00]/10 border border-[#8ACE00]/20 hover:border-[#8ACE00]/40 text-[#8ACE00]", vibe: "High Energy" },
  { label: "Main Character", color: "bg-primary/10 border border-primary/20 hover:border-primary/40 text-primary", vibe: "Cinematic" },
  { label: "NPC Core", color: "bg-secondary/10 border border-secondary/20 hover:border-secondary/40 text-secondary", vibe: "Background" },
  { label: "Void", color: "bg-white/[0.02] border border-white/5 hover:border-white/20 text-white", vibe: "Existence" },
  { label: "Cozy", color: "bg-tertiary/10 border border-tertiary/20 hover:border-tertiary/40 text-tertiary", vibe: "Chill" },
  { label: "Hype", color: "bg-orange-500/10 border border-orange-500/20 hover:border-orange-500/40 text-orange-400", vibe: "Lit" },
];

export default function SearchPage() {
  return (
    <main className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-36 flex flex-col min-h-screen relative z-10 gap-10">
      {/* Brand Heading */}
      <div className="flex flex-col">
        <h1 className="text-4xl font-display font-black uppercase tracking-normal leading-none neon-text">
          Discovery Hub
        </h1>
        <p className="text-[#b6ff00] text-[10px] font-mono uppercase tracking-[0.3em] mt-2">
          Find your next anthem
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary group-focus-within:text-[#b6ff00] transition-colors z-10" />
        <input 
          suppressHydrationWarning
          type="text" 
          placeholder="Search songs, artists, moods..." 
          className="w-full glass-premium border-cyan-300/20 rounded-full py-5 pl-14 pr-6 text-sm text-white placeholder:text-text-tertiary outline-none transition-all duration-500 focus:bloom-pink focus:border-pink-300/40"
        />
      </div>

      {/* Mood Grid */}
      <section className="flex flex-col gap-6">
        <h2 className="text-[10px] font-mono font-black tracking-[0.3em] text-[#b6ff00] uppercase">
          Mood Discovery
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          {MOODS.map((mood) => (
            <div 
              key={mood.label}
              className={cn(
                "aura-card h-32 p-5 flex flex-col justify-between group cursor-pointer backdrop-blur-md transition-all duration-300 hover:scale-[1.02] rounded-3xl crt-scanlines",
                mood.color
              )}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono uppercase tracking-widest opacity-60">
                  {mood.vibe}
                </span>
                <div className="w-6 h-6 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-3 h-3 fill-current" />
                </div>
              </div>
              
              <h3 className="text-xl font-display font-black uppercase italic tracking-tighter leading-none">
                {mood.label}
              </h3>
            </div>
          ))}
        </div>
      </section>

      <div className="mb-20">
        <TrackList title="Recent Searches" tracks={RECENT_SEARCHES} />
      </div>
    </main>
  );
}
