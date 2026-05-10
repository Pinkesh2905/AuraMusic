"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { TrackList } from "@/components/player/TrackList";
import { Loader2, TrendingUp, Clock, User2, LogIn } from "lucide-react";
import Link from "next/link";

interface Artist {
  id: string;
  name: string;
  image: string | null;
  genres: string[];
}

interface Track {
  id: string;
  name: string;
  artist: string;
  artists: any[];
  duration: number;
  albumArt: string | null;
  uri: string;
  previewUrl: string | null;
}

interface HomeFeed {
  recentlyPlayed: Track[];
  topTracks: Track[];
  topArtists: Artist[];
}

// Static fallback for logged-out users
const TRENDING_TRACKS = [
  { id: "1", name: "Starboy (feat. Daft Punk)", artist: "The Weeknd", duration: 230000, albumArt: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80" },
  { id: "2", name: "The Child In Us", artist: "Enigma", duration: 250000, albumArt: "https://images.unsplash.com/photo-1493225457124-a1a2a5f5f92e?w=500&q=80" },
  { id: "3", name: "Alakh Niranjan", artist: "Aditya", duration: 210000, albumArt: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80" },
  { id: "4", name: "Humsafar", artist: "Akhil Sachdeva", duration: 265000, albumArt: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&q=80" },
];

export default function Home() {
  const { data: session, status } = useSession();
  const [feed, setFeed] = useState<HomeFeed | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      setIsLoading(true);
      fetch("/api/home")
        .then(r => r.json())
        .then(data => {
          if (!data.error) setFeed(data);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [status]);

  // Not logged in
  if (status === "unauthenticated") {
    return (
      <main className="w-full h-full flex flex-col">
        {/* Hero banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden mb-8 p-8 bg-gradient-to-br from-purple-900/60 to-indigo-900/40 border border-white/10"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-purple-500/20 blur-3xl animate-pulse" />
          <div className="relative z-10">
            <h1 className="text-5xl font-display font-bold text-white mb-3 leading-tight">
              Your Music.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                Understood.
              </span>
            </h1>
            <p className="text-white/60 text-lg mb-6 max-w-md">
              Connect Spotify and let Aura's AI decode your sonic identity — moods, lore, DNA and more.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-white text-black font-bold px-6 py-3 rounded-full hover:scale-105 transition-transform"
            >
              <LogIn className="w-4 h-4" />
              Connect Spotify to Begin
            </Link>
          </div>
        </motion.div>

        <TrackList title="Trending on Aura" tracks={TRENDING_TRACKS} />
      </main>
    );
  }

  // Loading state
  if (isLoading || status === "loading") {
    return (
      <main className="w-full h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-white/50">
          <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
          <p className="text-sm animate-pulse">Loading your Spotify feed...</p>
        </div>
      </main>
    );
  }

  // Logged in — show real data
  return (
    <main className="w-full h-full flex flex-col gap-10 overflow-y-auto scrollbar-hide pb-32">

      {/* Top Artists Row */}
      {feed?.topArtists && feed.topArtists.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-4">
            <User2 className="w-4 h-4 text-white/40" />
            <h2 className="text-xs font-bold tracking-widest uppercase text-white/50">Your Top Artists</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {feed.topArtists.map((artist, i) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
                className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden bg-white/10 border-2 border-transparent group-hover:border-purple-400/60 transition-colors">
                  {artist.image
                    ? <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-white/20"><User2 className="w-6 h-6" /></div>
                  }
                </div>
                <span className="text-xs text-white/60 text-center max-w-[64px] truncate">{artist.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Recently Played */}
      {feed?.recentlyPlayed && feed.recentlyPlayed.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-white/40" />
            <h2 className="text-xs font-bold tracking-widest uppercase text-white/50">Recently Played</h2>
          </div>
          <TrackList title="" tracks={feed.recentlyPlayed} />
        </motion.section>
      )}

      {/* Top Tracks */}
      {feed?.topTracks && feed.topTracks.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-white/40" />
            <h2 className="text-xs font-bold tracking-widest uppercase text-white/50">Your Top Tracks This Month</h2>
          </div>
          <TrackList title="" tracks={feed.topTracks} />
        </motion.section>
      )}

    </main>
  );
}
