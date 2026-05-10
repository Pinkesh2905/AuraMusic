"use client";

import { TrackList } from "@/components/player/TrackList";
import { Search } from "lucide-react";

const RECENT_SEARCHES = [
  { id: "s1", name: "Blinding Lights", artist: "The Weeknd", duration: 200000, albumArt: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80" },
  { id: "s2", name: "Save Your Tears", artist: "The Weeknd", duration: 215000, albumArt: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80" },
];

export default function SearchPage() {
  return (
    <main className="w-full h-full flex flex-col gap-8">
      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 group-focus-within:text-white transition-colors" />
        <input 
          suppressHydrationWarning
          type="text" 
          placeholder="What do you want to listen to?" 
          className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-white/40 outline-none transition-all duration-300 backdrop-blur-md shadow-lg"
          autoFocus
        />
      </div>

      <TrackList title="Recent Searches" tracks={RECENT_SEARCHES} />
    </main>
  );
}
