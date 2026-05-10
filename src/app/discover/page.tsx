"use client";

import { useEffect, useState } from "react";
import { TrackList } from "@/components/player/TrackList";
import { Sparkles, Loader2 } from "lucide-react";

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
    <main className="w-full h-full flex flex-col pt-8">
      <div className="mb-8">
        <h4 className="text-xs font-bold tracking-[0.2em] text-white/60 mb-2 uppercase flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          Intelligence Layer
        </h4>
        <h1 className="text-4xl font-display font-bold text-white mb-2">Current Aura</h1>
        <p className="text-sm text-white/60 max-w-md">
          Aura continuously listens to your emotional state. This is a real-time reflection of your current vibe.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/50 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <p className="text-sm animate-pulse">Analyzing your listening patterns with Gemini...</p>
        </div>
      ) : moodData ? (
        <div className="flex flex-col flex-1">
          <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-white/5 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>
            <h3 className="text-2xl font-display font-medium text-white mb-1 relative z-10">
              {moodData.mood}
            </h3>
            <p className="text-xs text-white/50 relative z-10">AI-Generated for you right now</p>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide">
            <TrackList tracks={moodData.tracks.map(t => ({
              id: t.id,
              name: t.name,
              artist: t.artists[0]?.name || "Unknown Artist",
              duration: t.duration_ms,
              albumArt: t.album.images[0]?.url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80"
            }))} />
          </div>
        </div>
      ) : (
        <div className="text-white/50 py-10">
          Not enough listening history to generate an Aura. Play some tracks first!
        </div>
      )}
    </main>
  );
}
