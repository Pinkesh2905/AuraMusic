"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { 
  TrendingUp, 
  Sparkles, 
  Dna, 
  Clock, 
  ArrowUpRight, 
  Zap, 
  Globe, 
  Play, 
  Pause, 
  Music, 
  Flame, 
  Heart,
  Compass,
  Headphones
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NeuralStreamCard } from "@/components/home/NeuralStreamCard";
import { usePlayerStore } from "@/stores/playerStore";
import { SmoothLoader } from "@/components/ui/SmoothLoader";
import { VinylRecord } from "@/components/player/VinylRecord";
import { getGreeting, getActiveFestival } from "@/lib/festival";

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
  rank?: number;
  streams?: string;
  badge?: string;
  reelsCount?: string;
  hashtag?: string;
}

interface HomeFeed {
  recentlyPlayed: Track[];
  topTracks: Track[];
  topArtists: Artist[];
  recommendations: Track[];
  regionalTrending: Track[];
  instagramTrending: Track[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
} as const;

const itemVariants = {
  hidden: { y: 30, opacity: 0, filter: "blur(5px)" },
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 90,
      damping: 18
    }
  }
} as const;

const cardRevealVariants = {
  hidden: { y: 25, opacity: 0, scale: 0.96 },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: { type: "spring", stiffness: 95, damping: 16 } 
  }
} as const;

const EMOTIONAL_TAGS = [
  "Most replayed at 2AM",
  "Night drive energy",
  "Comfort zone playlist",
  "Acoustic sanctuary",
  "Euphoric high",
  "Chilled nostalgia",
];

const INSTAGRAM_GRADIENT = "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)";

const SparkleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("w-6 h-6 fill-[#ff55df] specular-sparkle", className)}>
    <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z" />
  </svg>
);

const Y2KBadge = () => (
  <div className="y2k-oval-badge px-4 py-1.5 rounded-full flex items-center justify-center border border-[#00f5ff]/45 absolute top-10 right-10 z-20 pointer-events-none select-none">
    <span className="text-[11px] font-display font-black uppercase text-black tracking-widest italic select-none">Y2K</span>
  </div>
);

const DiscoBall = () => (
  <div className="absolute top-8 left-8 z-20 w-24 h-24 md:w-36 md:h-36 pointer-events-none select-none">
    <div className="absolute inset-0 bg-[#ff2bd6]/15 rounded-full blur-[20px]" />
    <motion.svg 
      animate={{ rotate: 360 }}
      transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      viewBox="0 0 100 100" 
      className="w-full h-full drop-shadow-[0_0_15px_rgba(255,43,214,0.45)]"
    >
      <circle cx="50" cy="50" r="45" fill="url(#disco-chrome)" stroke="#ff2bd6" strokeWidth="1" />
      <path d="M50 5 A45 45 0 0 0 50 95" fill="none" stroke="rgba(255, 43, 214, 0.45)" strokeWidth="0.5" />
      <path d="M50 5 A25 45 0 0 0 50 95" fill="none" stroke="rgba(255, 43, 214, 0.35)" strokeWidth="0.5" />
      <path d="M50 5 A10 45 0 0 0 50 95" fill="none" stroke="rgba(255, 43, 214, 0.25)" strokeWidth="0.5" />
      <path d="M50 5 A10 45 0 0 1 50 95" fill="none" stroke="rgba(255, 43, 214, 0.25)" strokeWidth="0.5" />
      <path d="M50 5 A25 45 0 0 1 50 95" fill="none" stroke="rgba(255, 43, 214, 0.35)" strokeWidth="0.5" />
      <path d="M50 5 A45 45 0 0 1 50 95" fill="none" stroke="rgba(255, 43, 214, 0.45)" strokeWidth="0.5" />
      <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(255, 43, 214, 0.45)" strokeWidth="0.5" />
      <line x1="8" y1="35" x2="92" y2="35" stroke="rgba(255, 43, 214, 0.35)" strokeWidth="0.5" />
      <line x1="16" y1="20" x2="84" y2="20" stroke="rgba(255, 43, 214, 0.25)" strokeWidth="0.5" />
      <line x1="8" y1="65" x2="92" y2="65" stroke="rgba(255, 43, 214, 0.35)" strokeWidth="0.5" />
      <line x1="16" y1="80" x2="84" y2="80" stroke="rgba(255, 43, 214, 0.25)" strokeWidth="0.5" />
      <circle cx="35" cy="35" r="12" fill="white" opacity="0.35" filter="blur(2px)" />
      <defs>
        <radialGradient id="disco-chrome" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#b7b8ff" />
          <stop offset="70%" stopColor="#25124b" />
          <stop offset="100%" stopColor="#ff2bd6" />
        </radialGradient>
      </defs>
    </motion.svg>
  </div>
);

const FloatingHeadphones = () => (
  <div className="absolute bottom-16 left-6 md:bottom-28 md:left-24 z-10 w-24 h-24 md:w-44 md:h-44 pointer-events-none select-none animate-float-headphones hidden sm:block">
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.7)]">
      <defs>
        <linearGradient id="headphone-chrome" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#94a3b8" />
          <stop offset="50%" stopColor="#1e293b" />
          <stop offset="60%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#090624" />
        </linearGradient>
      </defs>
      <path d="M15 55A35 35 0 0 1 85 55" fill="none" stroke="url(#headphone-chrome)" strokeWidth="9" strokeLinecap="round" />
      <path d="M15 55A35 35 0 0 1 85 55" fill="none" stroke="#ff2bd6" strokeWidth="1" strokeLinecap="round" strokeDasharray="3,3" opacity="0.8" />
      <rect x="8" y="46" width="14" height="26" rx="7" fill="url(#headphone-chrome)" stroke="#ff2bd6" strokeWidth="1" />
      <circle cx="15" cy="59" r="4" fill="#ff2bd6" />
      <rect x="78" y="46" width="14" height="26" rx="7" fill="url(#headphone-chrome)" stroke="#ff2bd6" strokeWidth="1" />
      <circle cx="85" cy="59" r="4" fill="#ff2bd6" />
      <path d="M15 50L16.2 53.6L20 54.5L16.2 55.4L15 59L13.8 55.4L10 54.5L13.8 53.6Z" fill="#ff55df" />
      <path d="M85 50L86.2 53.6L90 54.5L86.2 55.4L85 59L83.8 55.4L80 54.5L83.8 53.6Z" fill="#ff55df" />
    </svg>
  </div>
);

const FloatingSpeaker = () => (
  <div className="absolute bottom-16 right-6 md:bottom-28 md:right-24 z-10 w-24 h-28 md:w-40 md:h-48 pointer-events-none select-none animate-pulse-speaker hidden sm:block">
    <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.7)]">
      <defs>
        <linearGradient id="speaker-chrome" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#64748b" />
          <stop offset="55%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#ff2bd6" />
        </linearGradient>
      </defs>
      <rect x="10" y="10" width="80" height="100" rx="10" fill="#0c0721" stroke="url(#speaker-chrome)" strokeWidth="3" />
      <rect x="10" y="10" width="80" height="100" rx="10" fill="none" stroke="#ff2bd6" strokeWidth="1" opacity="0.6" />
      <circle cx="50" cy="38" r="15" fill="#090624" stroke="url(#speaker-chrome)" strokeWidth="1.5" />
      <circle cx="50" cy="38" r="6" fill="#ff2bd6" />
      <circle cx="50" cy="78" r="24" fill="#090624" stroke="url(#speaker-chrome)" strokeWidth="2" />
      <motion.circle 
        animate={{ scale: [1, 1.06, 0.98, 1.03, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        cx="50" cy="78" r="16" fill="url(#speaker-chrome)" 
      />
      <circle cx="50" cy="78" r="6" fill="#ff55df" />
    </svg>
  </div>
);

const TurntableDeck = () => (
  <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] absolute -bottom-24 md:-bottom-48 left-1/2 -translate-x-1/2 z-0 opacity-45 pointer-events-none select-none">
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="w-full h-full rounded-full bg-[#05030f] border border-pink-500/35 relative vinyl-grooves overflow-hidden flex items-center justify-center"
    >
      <div className="w-[85px] h-[85px] md:w-[140px] md:h-[140px] rounded-full border border-pink-500/25 bg-gradient-to-tr from-pink-500 via-[#101033] to-[#00f5ff] flex items-center justify-center">
        <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-[#05030f] flex items-center justify-center border border-white/5">
          <div className="w-2.5 h-2.5 md:w-4.5 md:h-4.5 rounded-full bg-white/20" />
        </div>
      </div>
      <div className="absolute inset-0 vinyl-lighting rounded-full" />
    </motion.div>
  </div>
);

const TwinklingStars = () => (
  <div className="absolute inset-0 pointer-events-none z-0">
    <div className="absolute top-[20%] right-[25%] animate-twinkle">
      <SparkleIcon className="w-5 h-5" />
    </div>
    <div className="absolute top-[45%] left-[20%] animate-twinkle" style={{ animationDelay: "500ms" }}>
      <SparkleIcon className="w-4 h-4 text-cyan-300" />
    </div>
    <div className="absolute bottom-[40%] right-[15%] animate-twinkle" style={{ animationDelay: "1000ms" }}>
      <SparkleIcon className="w-5 h-5 text-pink-400" />
    </div>
    <div className="absolute top-[12%] right-[10%] animate-twinkle" style={{ animationDelay: "1500ms" }}>
      <SparkleIcon className="w-6 h-6 text-white" />
    </div>
    <div className="absolute bottom-[30%] left-[10%] animate-twinkle" style={{ animationDelay: "2000ms" }}>
      <SparkleIcon className="w-4 h-4" />
    </div>
  </div>
);

const mapTrackToSpotifyTrack = (t: Track): any => {
  return {
    id: t.id,
    name: t.name,
    uri: t.uri,
    duration_ms: t.duration,
    preview_url: t.previewUrl || null,
    album: {
      id: "",
      name: "",
      uri: "",
      images: t.albumArt ? [{ url: t.albumArt, width: 300, height: 300 }] : [],
      artists: t.artists || [],
      release_date: "",
    },
    artists: t.artists || [{ id: "", name: t.artist, uri: "" }],
  };
};

export default function Home() {
  const { data: session, status } = useSession();
  const { currentTrack, isPlaying, sdk, isMoodPromptOpen, setMoodPromptOpen, deviceId, play, pause, resume, dominantColor } = usePlayerStore();
  const [feed, setFeed] = useState<HomeFeed | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const festival = getActiveFestival();
  const colorA = festival ? festival.color1 : (dominantColor || "#FF2D78");
  const colorB = festival ? festival.color2 : "#8B5CF6";
  const colorC = festival ? "#10B981" : "#00F5FF";

  // Vibe tuner states
  const [promptText, setPromptText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Analyzing music...");
  const [activeVibe, setActiveVibe] = useState<{
    name: string;
    explanation: string;
    tracks: any[];
  } | null>(null);

  // Reactive Centerpiece Orb & AI Insights states
  const [currentVibeMood, setCurrentVibeMood] = useState<"default" | "sad" | "gym" | "indie">("default");
  const [insightIdx, setInsightIdx] = useState(0);

  const DYNAMIC_INSIGHTS = [
    "Your music taste mixes focus and night vibes.",
    "Most listeners enjoy these acoustic vibes.",
    "You're listening to more indie acoustic this week.",
    "Your vibe feels like warm ambient coral waves."
  ];

  const VIBE_THEMES = {
    default: {
      gradient: "from-violet-600 via-pink-500 to-cyan-400",
      morphDuration: 22,
      scale: [1, 1.03, 0.97, 1.03, 1],
      glow: "shadow-[0_0_80px_rgba(139,92,246,0.3)] border-white/20",
      title: "Intelligent Aura",
      pillBg: "bg-violet-400/10 border-violet-400/20 text-violet-300"
    },
    sad: {
      gradient: "from-blue-600 via-indigo-500 to-cyan-400",
      morphDuration: 28,
      scale: [1, 1.01, 0.99, 1.01, 1],
      glow: "shadow-[0_0_80px_rgba(59,130,246,0.25)] border-blue-500/20",
      title: "Rainy Melancholy",
      pillBg: "bg-blue-400/10 border-blue-400/20 text-blue-300"
    },
    gym: {
      gradient: "from-rose-600 via-red-500 to-amber-500",
      morphDuration: 10,
      scale: [1, 1.08, 0.94, 1.08, 1],
      glow: "shadow-[0_0_80px_rgba(239,68,68,0.35)] border-rose-500/30",
      title: "Chaos Hype Pulse",
      pillBg: "bg-rose-400/10 border-rose-400/20 text-rose-300"
    },
    indie: {
      gradient: "from-violet-600 via-fuchsia-500 to-purple-400",
      morphDuration: 18,
      scale: [1, 1.04, 0.96, 1.04, 1],
      glow: "shadow-[0_0_80px_rgba(168,85,247,0.3)] border-purple-500/20",
      title: "Late Night Indie Haze",
      pillBg: "bg-purple-400/10 border-purple-400/20 text-purple-300"
    }
  } as const;

  useEffect(() => {
    const interval = setInterval(() => {
      setInsightIdx((prev) => (prev + 1) % DYNAMIC_INSIGHTS.length);
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  const handlePlay = (track: Track, contextList?: Track[]) => {
    let finalContext = contextList ? [...contextList] : [];
    
    if (finalContext.length <= 1) {
      const allTracks: Track[] = [];
      if (feed?.recentlyPlayed) allTracks.push(...feed.recentlyPlayed);
      if (feed?.topTracks) allTracks.push(...feed.topTracks);
      if (feed?.recommendations) allTracks.push(...feed.recommendations);
      if (feed?.regionalTrending) allTracks.push(...feed.regionalTrending);
      if (activeVibe?.tracks) allTracks.push(...activeVibe.tracks);

      const uniqueTracksMap = new Map<string, Track>();
      allTracks.forEach(t => {
        if (t && t.id && !uniqueTracksMap.has(t.id)) {
          uniqueTracksMap.set(t.id, t);
        }
      });
      
      const uniqueTracks = Array.from(uniqueTracksMap.values());
      if (uniqueTracks.length > 0) {
        const filtered = uniqueTracks.filter(t => t.id !== track.id);
        finalContext = [track, ...filtered];
      } else {
        finalContext = [track];
      }
    }

    const spotifyTrack = mapTrackToSpotifyTrack(track);
    const spotifyContext = finalContext.map(mapTrackToSpotifyTrack);
    
    usePlayerStore.setState({ queue: spotifyContext });

    if (sdk) {
      const trackIndex = finalContext.findIndex(t => t.id === track.id);
      const uris = trackIndex >= 0 
        ? finalContext.slice(trackIndex).map(t => t.uri)
        : [track.uri];
      sdk.playTrack(uris);
    } else {
      play(spotifyTrack, spotifyContext);
    }
  };

  const handleVibeSubmit = async () => {
    if (!promptText.trim()) return;
    
    if (status === "unauthenticated") {
      window.location.href = "/api/auth/signin";
      return;
    }

    setIsSubmitting(true);
    setMoodPromptOpen(false);

    const messages = [
      "Analyzing music...",
      "Finding the right vibe...",
      "Preparing playlist...",
      "Loading...",
      "Almost done..."
    ];
    let msgIdx = 0;
    const msgInterval = setInterval(() => {
      msgIdx = (msgIdx + 1) % messages.length;
      setLoadingMessage(messages[msgIdx]);
    }, 2500);

    try {
      const response = await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText })
      });

      if (!response.ok) {
        throw new Error("Failed to align vibe frequency");
      }

      const data = await response.json();
      console.log("[Aura] Vibe Response:", data);

      if (data.vibe && data.tracks && data.tracks.length > 0) {
        setActiveVibe({
          name: data.vibe,
          explanation: data.explanation,
          tracks: data.tracks
        });

        const vName = data.vibe.toLowerCase();
        if (vName.includes("gym") || vName.includes("hype") || vName.includes("energy") || vName.includes("work")) {
          setCurrentVibeMood("gym");
        } else if (vName.includes("sad") || vName.includes("rain") || vName.includes("melanchol") || vName.includes("cinem")) {
          setCurrentVibeMood("sad");
        } else if (vName.includes("indie") || vName.includes("night") || vName.includes("cozy") || vName.includes("dream")) {
          setCurrentVibeMood("indie");
        } else {
          setCurrentVibeMood("default");
        }

        const firstTrack = data.tracks[0];
        if (sdk && deviceId) {
          try {
            await fetch(
              `https://api.spotify.com/v1/me/player/volume?volume_percent=25&device_id=${deviceId}`,
              {
                method: "PUT",
                headers: { Authorization: `Bearer ${session?.accessToken}` }
              }
            );
          } catch (volErr) {
            console.error("[Aura] Failed to set volume percent:", volErr);
          }
          await sdk.playTrack(firstTrack.uri);
        } else {
          // Store playback fallback
          play(mapTrackToSpotifyTrack(firstTrack));
        }
      }
    } catch (error) {
      console.error("[Aura] Mood check error:", error);
    } finally {
      clearInterval(msgInterval);
      setIsSubmitting(false);
      setPromptText("");
    }
  };

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

  const handleCategoryClick = (vkey: "default" | "sad" | "gym" | "indie", e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentVibeMood(vkey);

    const categoryData = {
      default: {
        name: "Intelligent Aura",
        explanation: "A custom blended energy profile designed for everyday focus, evening wind-downs, and general acoustic synchronization.",
        tracks: [
          { id: "def-1", name: "Starboy", artist: "The Weeknd", albumArt: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80", uri: "spotify:track:7fBv71oPve6YvSTHqfQvXn", duration: 230000 },
          { id: "def-2", name: "Blinding Lights", artist: "The Weeknd", albumArt: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80", uri: "spotify:track:0VjIjjsmD5jfv6SPfgm75T", duration: 200000 },
          { id: "def-3", name: "Espresso", artist: "Sabrina Carpenter", albumArt: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&q=80", uri: "spotify:track:24CDJZvR4g5Xw481rQ77g7", duration: 175000 },
          { id: "def-4", name: "Sunset Lover", artist: "Petit Biscuit", albumArt: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80", uri: "spotify:track:0FM4qS5e378vX7LySnd4fX", duration: 237000 },
          { id: "def-5", name: "Intro", artist: "The xx", albumArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80", uri: "spotify:track:2XGDlYV8e2V0hZc1uI216e", duration: 128000 }
        ]
      },
      sad: {
        name: "Rainy Melancholy",
        explanation: "Deep blue ambient layers, acoustic solaces, and emotional slow-tempo tracks designed for rainy introspection.",
        tracks: [
          { id: "sad-1", name: "Lovely", artist: "Billie Eilish, Khalid", albumArt: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500&q=80", uri: "spotify:track:0u2P5u6lvoXTlpivHQ5U9G", duration: 200000 },
          { id: "sad-2", name: "Night Changes", artist: "One Direction", albumArt: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80", uri: "spotify:track:514vkBhYmquf22Flo8m2Rz", duration: 226000 },
          { id: "sad-3", name: "Perfect", artist: "Ed Sheeran", albumArt: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&q=80", uri: "spotify:track:0tgV536IT5w75HTnkdU60b", duration: 263000 },
          { id: "sad-4", name: "Selfless", artist: "The Strokes", albumArt: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80", uri: "spotify:track:2SlwzPZ75Z58x5uX0zR0mG", duration: 222000 },
          { id: "sad-5", name: "Sweater Weather", artist: "The Neighbourhood", albumArt: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80", uri: "spotify:track:2TpxZ7JUBn3uw46aR7qd6V", duration: 240000 }
        ]
      },
      gym: {
        name: "Chaos Hype Pulse",
        explanation: "High-octane synth lines, heavy bass impacts, and maximum rhythmic drive to power up your workout cycles.",
        tracks: [
          { id: "gym-1", name: "Big Dawgs", artist: "Hanumankind, Kalmi", albumArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80", uri: "spotify:track:2852w8nBT1e9J481rQ43u9", duration: 237000 },
          { id: "gym-2", name: "Millionaire", artist: "Yo Yo Honey Singh", albumArt: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80", uri: "spotify:track:1vYmR6Zqf9W8eS7Q6uWvXg", duration: 218000 },
          { id: "gym-3", name: "Winning Speech", artist: "Karan Aujla", albumArt: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80", uri: "spotify:track:5oO9Oq3pQO8L8u9eW0vXg9", duration: 194000 },
          { id: "gym-4", name: "Till I Collapse", artist: "Eminem", albumArt: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&q=80", uri: "spotify:track:4xkOaSrkexm3LIJm2t8m6O", duration: 297000 },
          { id: "gym-5", name: "Industry Baby", artist: "Lil Nas X, Jack Harlow", albumArt: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80", uri: "spotify:track:27CF4R77N2o1l8gNfF40m6", duration: 212000 }
        ]
      },
      indie: {
        name: "Late Night Indie Haze",
        explanation: "Cozy bedroom pop, nostalgic dream-pop, and warm cassette aesthetics designed for introspective midnights.",
        tracks: [
          { id: "ind-1", name: "Softly", artist: "Karan Aujla, Ikky", albumArt: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=500&q=80", uri: "spotify:track:4Cee76vInzK7n70vH3Yj7D", duration: 157000 },
          { id: "ind-2", name: "Sweater Weather", artist: "The Neighbourhood", albumArt: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80", uri: "spotify:track:2TpxZ7JUBn3uw46aR7qd6V", duration: 240000 },
          { id: "ind-3", name: "Yellow", artist: "Coldplay", albumArt: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80", uri: "spotify:track:3ee8Jmje8o58OI3wF7OAae", duration: 266000 },
          { id: "ind-4", name: "Reflections", artist: "The Neighbourhood", albumArt: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=500&q=80", uri: "spotify:track:2RsW2j45a6vVjP81640m6B", duration: 198000 },
          { id: "ind-5", name: "Riptide", artist: "Vance Joy", albumArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&q=80", uri: "spotify:track:7yq4Qj7cq0UpHe71R47t4G", duration: 204000 }
        ]
      }
    };

    const target = categoryData[vkey];
    setActiveVibe({
      name: target.name,
      explanation: target.explanation,
      tracks: target.tracks.map(t => ({
        id: t.id,
        name: t.name,
        artist: t.artist,
        artists: [{ id: t.id + "-art", name: t.artist, uri: "" }],
        albumArt: t.albumArt,
        duration: t.duration,
        uri: t.uri,
        previewUrl: null
      }))
    });
  };

  // Centerpiece rotating vibe orb
  const renderCenterpiece = () => {
    if (currentTrack) {
      return (
        <div className="flex flex-col items-center select-none w-full max-w-sm mx-auto relative z-10" onClick={(e) => e.stopPropagation()}>
          <VinylRecord 
            isPlaying={isPlaying}
            image={currentTrack.album?.images?.[0]?.url} 
            size={300}
            className="w-64 h-64 md:w-80 md:h-80"
          />
        </div>
      );
    }

    const config = VIBE_THEMES[currentVibeMood];
    return (
      <div className="flex flex-col items-center select-none w-full max-w-sm mx-auto">
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center group cursor-pointer">
          {/* Layer 1: Ambient background aura glow */}
          <div className={cn(
            "absolute inset-0 rounded-full blur-[70px] bg-gradient-to-tr transition-all duration-1000",
            config.gradient
          )} style={{ opacity: 0.3 }} />
          
          {/* Layer 2: Orbit ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 rounded-full border border-white/5 border-dashed"
          />

          {/* Layer 3: Dynamic Particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-violet-300/40 filter blur-[0.5px]"
                animate={{
                  x: [0, Math.cos(i * 72 * Math.PI / 180) * 110, 0],
                  y: [0, Math.sin(i * 72 * Math.PI / 180) * 110, 0],
                  opacity: [0.1, 0.7, 0.1],
                }}
                transition={{
                  duration: 8 + i * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  left: "50%",
                  top: "50%",
                  marginLeft: "-2px",
                  marginTop: "-2px",
                }}
              />
            ))}
          </div>

          {/* Shifting Glowing Mesh Blob */}
          <motion.div
            animate={{
              borderRadius: [
                "45% 55% 70% 30% / 45% 45% 55% 55%",
                "70% 30% 52% 48% / 60% 40% 60% 40%",
                "40% 60% 70% 30% / 50% 60% 40% 50%",
                "45% 55% 70% 30% / 45% 45% 55% 55%"
              ],
              rotate: 360,
              scale: isPlaying ? [1, 1.05, 0.95, 1.05, 1] : 1
            }}
            transition={{
              duration: isPlaying ? 3 : 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={cn(
              "absolute w-48 h-48 md:w-56 md:h-56 bg-gradient-to-tr opacity-25 blur-xl transition-all duration-1000",
              config.gradient
            )}
          />

          {/* Morphing active core */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            animate={{
              borderRadius: [
                "50% 50% 30% 70% / 50% 60% 40% 50%",
                "30% 70% 70% 30% / 50% 30% 70% 50%",
                "70% 30% 52% 48% / 60% 40% 60% 40%",
                "50% 50% 30% 70% / 50% 60% 40% 50%"
              ],
              rotate: -360,
              scale: isPlaying ? [1, 1.04, 0.96, 1.04, 1] : 1
            }}
            transition={{
              borderRadius: {
                duration: config.morphDuration,
                repeat: Infinity,
                ease: "easeInOut"
              },
              rotate: {
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              },
              scale: {
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className={cn(
              "relative w-44 h-44 md:w-52 md:h-52 bg-gradient-to-br backdrop-blur-3xl flex items-center justify-center border overflow-hidden transition-all duration-1000 centerpiece-disc",
              config.gradient,
              config.glow
            )}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.4)_0%,transparent_50%)] mix-blend-overlay" />
            <motion.div
              animate={{ 
                scale: isPlaying ? [1, 1.15, 1] : [1, 1.05, 1]
              }}
              transition={{ 
                duration: isPlaying ? 1.5 : 3.5, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <img src="/images/aura_logo.png" className="w-12 h-12 object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]" alt="AURA" />
            </motion.div>
          </motion.div>
        </div>

        {/* Tactical interactive vibe mood pills */}
        <div className="flex gap-1.5 justify-center flex-wrap max-w-sm mt-4 z-20 px-4">
          {(Object.keys(VIBE_THEMES) as Array<keyof typeof VIBE_THEMES>).map((vkey) => (
            <button
              key={vkey}
              onClick={(e) => handleCategoryClick(vkey, e)}
              className={cn(
                "px-3 py-1 rounded-full text-[9px] font-mono border transition-all cursor-pointer active:scale-95",
                currentVibeMood === vkey
                  ? VIBE_THEMES[vkey].pillBg + " font-black scale-105 border-white/20 shadow-md shadow-black/30"
                  : "bg-white/5 border-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
              )}
            >
              {vkey.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderDefaultStatsCard = () => {
    return (
      <div className="rounded-[2.5rem] border border-white/5 bg-[#121215]/60 backdrop-blur-3xl p-6.5 flex flex-col gap-5 shadow-[0_30px_70px_rgba(0,0,0,0.65)] w-full max-w-sm relative overflow-hidden group">
        <div className="absolute -right-20 -bottom-20 w-40 h-40 rounded-full bg-violet-400/5 blur-[50px] group-hover:bg-violet-400/10 transition-all duration-500" />
        <div className="flex justify-between items-center border-b border-white/10 pb-3.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-zinc-400 tracking-wider">AURA HARMONY</span>
          </div>
          <span className="text-[9px] font-mono text-violet-300 font-black tracking-wide bg-violet-300/10 px-2 py-0.5 rounded uppercase border border-violet-400/10">
            Locked
          </span>
        </div>

        <div className="flex flex-col gap-3.5">
          <div className="flex justify-between items-end">
            <span className="text-xs font-mono text-zinc-400 tracking-wide">Acoustic Sync</span>
            <span className="text-xl font-mono text-white font-black">95.4%</span>
          </div>
          <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 rounded-full" style={{ width: "95.4%" }} />
          </div>

          <div className="grid grid-cols-3 gap-2.5 mt-1.5">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 flex flex-col gap-0.5">
              <span className="text-[8px] font-mono text-zinc-500 uppercase">Streak</span>
              <span className="text-xs font-mono text-white font-black">7 Days</span>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 flex flex-col gap-0.5">
              <span className="text-[8px] font-mono text-zinc-500 uppercase">Intensity</span>
              <span className="text-xs font-mono text-violet-300 font-black">82%</span>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 flex flex-col gap-0.5">
              <span className="text-[8px] font-mono text-zinc-500 uppercase">Vibe Code</span>
              <span className="text-xs font-mono text-cyan-300 font-black">Luminous</span>
            </div>
          </div>
        </div>

        <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 flex flex-col gap-1.5 mt-1">
          <span className="text-[9px] font-mono text-violet-300 font-bold uppercase tracking-wider">Aura Insight</span>
          <p className="text-xs font-mono text-zinc-300 italic leading-relaxed">
            "Your weekend acoustic profile has evolved into a calm, ethereal state with deep ambient highlights."
          </p>
        </div>
      </div>
    );
  };

  const renderActiveVibeCard = () => {
    if (!activeVibe) return null;
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-[2.5rem] border border-white/5 bg-[#121215]/70 backdrop-blur-3xl p-7 flex flex-col gap-5 shadow-[0_30px_70px_rgba(0,0,0,0.65)] w-full max-w-sm relative overflow-hidden"
      >
        <div className="absolute -right-20 -bottom-20 w-40 h-40 rounded-full bg-violet-400/10 blur-[50px]" />

        <div className="flex justify-between items-center border-b border-white/10 pb-3.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-ping" />
            <span className="text-[11px] font-mono font-bold text-zinc-300 tracking-wider">MOOD</span>
          </div>
          <button 
            onClick={() => setActiveVibe(null)}
            className="text-[9px] font-mono text-zinc-400 hover:text-white tracking-wide uppercase hover:underline"
          >
            Reset
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-fuchsia-300 to-sky-300 uppercase italic tracking-tight leading-none">
            {activeVibe.name}
          </h3>
          <p className="text-xs font-mono text-zinc-400 leading-relaxed max-h-[75px] overflow-y-auto pr-1">
            {activeVibe.explanation}
          </p>
        </div>

        <div className="flex flex-col gap-2 mt-1">
          <span className="text-[9px] font-mono text-violet-300 font-bold uppercase tracking-wider">Acoustic Matches</span>
          <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
            {activeVibe.tracks.map((track, idx) => (
              <div 
                key={`${track.id}-${idx}`}
                onClick={() => handlePlay(track, activeVibe.tracks)}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-xl border transition-all cursor-pointer group",
                  currentTrack?.id === track.id
                    ? "bg-violet-400/15 border-violet-400/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                    : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                )}
              >
                <div className="w-8.5 h-8.5 rounded-lg overflow-hidden shrink-0 bg-surface border border-white/5 relative flex items-center justify-center">
                  {track.albumArt ? (
                    <img src={track.albumArt} alt={track.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[8px] text-zinc-400 font-mono">#{idx+1}</span>
                  )}
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Play className="w-3 h-3 text-white fill-current" />
                  </div>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-bold text-white truncate leading-tight group-hover:text-violet-300 transition-colors">{track.name}</span>
                  <span className="text-[9px] font-mono text-zinc-400 truncate mt-0.5">{track.artist}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  if (isLoading || status === "loading") {
    return <SmoothLoader fullScreen />;
  }

  // Unauthenticated landing page flow
  if (status === "unauthenticated") {
    return (
      <main className="w-full min-h-screen flex flex-col items-center justify-center p-6 md:p-8 relative overflow-hidden bg-[#05030f] crt-scanlines">
        {/* Deep starry background with retro grid mask */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_30%_30%,#ff2bd6_0%,transparent_60%),radial-gradient(circle_at_70%_70%,#00f5ff_0%,transparent_60%)] z-0" />
        <div className="absolute inset-0 pixel-grid opacity-[0.03] z-0 pointer-events-none" />

        {/* Floating elements */}
        <Y2KBadge />
        <DiscoBall />
        <TwinklingStars />

        {/* Centerpiece title & signature */}
        <motion.div 
          className="relative z-10 flex flex-col items-center justify-center select-none text-center pointer-events-none mt-10 md:mt-16 animate-float-gentle"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Specular glows */}
          <div className="absolute text-[5.5rem] md:text-[11.5rem] font-black tracking-widest text-[#ff2bd6] opacity-35 blur-[35px] font-brush leading-none select-none">
            AURA
          </div>
          <div className="absolute text-[5.5rem] md:text-[11.5rem] font-black tracking-widest text-[#00f5ff] opacity-15 blur-[60px] font-brush leading-none select-none" style={{ transform: "translate(10px, 10px)" }} />
          
          {/* Metallic 3D Chrome Text */}
          <h1 className="text-[5.5rem] md:text-[11.5rem] font-black tracking-widest y2k-chrome-giant-text font-brush leading-none z-10 select-none">
            AURA
          </h1>
          
          {/* Cursive Signature */}
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="signature-pink text-2.5rem md:text-5.5xl mt-2 select-none"
          >
            Cooked By Pinkesh
          </motion.span>
        </motion.div>

        {/* Decorative chrome assets (headphones, speakers) */}
        <FloatingHeadphones />
        <FloatingSpeaker />

        {/* Turntable spinner deck */}
        <TurntableDeck />

        {/* Action button container */}
        <div className="relative z-20 w-full max-w-sm mx-auto flex flex-col gap-5 mt-16 px-4">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = "/api/auth/signin"}
            className="w-full flex items-center justify-center gap-3 bg-[#ff2bd6] hover:bg-[#ff55df] text-black font-extrabold tracking-widest text-xs py-4.5 px-6 rounded-2xl transition-all duration-300 shadow-[0_0_35px_rgba(255,43,214,0.45)] uppercase font-mono border border-white/10 select-none cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-5.5 h-5.5 fill-black">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.84.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <span>Connect Spotify Account</span>
          </motion.button>

          <div className="flex items-center gap-4 py-1 select-none">
            <div className="flex-grow h-[1px] bg-white/5" />
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Or enter with credentials</span>
            <div className="flex-grow h-[1px] bg-white/5" />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = "/login"}
            className="w-full y2k-button text-white font-bold tracking-widest text-xs py-4 rounded-2xl flex items-center justify-center gap-2 border border-white/10 select-none cursor-pointer"
          >
            <span>Sign In with Email</span>
          </motion.button>
        </div>

        {/* Bottom space wrapper */}
        <div className="h-10 w-full" />

        {/* Vibe Prompt Tuner Modal Overlay */}
        <AnimatePresence>
          {isMoodPromptOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/75 backdrop-blur-xl">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="glass-premium rounded-[3rem] border border-white/10 bg-black/60 backdrop-blur-2xl p-8 md:p-12 w-full max-w-xl relative overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.8)]"
              >
                <div className="absolute -left-20 -top-20 w-60 h-60 rounded-full bg-violet-400/10 blur-[80px]" />
                <div className="absolute -right-20 -bottom-20 w-60 h-60 rounded-full bg-purple-500/10 blur-[80px]" />

                <button 
                  onClick={() => setMoodPromptOpen(false)}
                  className="absolute top-8 right-8 text-white/40 hover:text-white font-mono text-xs tracking-wide hover:underline"
                >
                  CLOSE [ESC]
                </button>

                <div className="flex flex-col gap-6 relative z-10">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-violet-300" />
                    <span className="text-xs font-mono font-bold text-violet-300">
                      Mood Sync
                    </span>
                  </div>

                  <input
                      type="text"
                      value={promptText}
                      onChange={(e) => setPromptText(e.target.value)}
                      placeholder="What mood do you want?"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-violet-400/40 focus:ring-1 focus:ring-violet-300/20 transition-all" />

                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-mono text-white/30 tracking-wide">
                      Ready
                    </span>
                    <button
                      onClick={handleVibeSubmit}
                      disabled={isSubmitting || !promptText.trim()}
                      className="px-8 py-4 rounded-full bg-gradient-to-r from-violet-300 via-fuchsia-300 to-sky-300 hover:from-violet-200 hover:to-sky-200 disabled:opacity-40 text-black font-bold tracking-wide text-xs hover:scale-103 active:scale-97 transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(6,182,212,0.25)]"
                    >
                      {isSubmitting ? "Working..." : "Start"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Vibe tuner loading overlay */}
        {isSubmitting && (
          <div className="fixed inset-0 z-[250] flex flex-col items-center justify-center p-6 bg-black/85 backdrop-blur-2xl">
            <div className="relative flex flex-col items-center gap-8">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <div className="absolute inset-0 bg-violet-400/20 rounded-full blur-[30px]" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-t-cyan-400 border-r-transparent border-b-indigo-500 border-l-transparent"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-4 rounded-full border border-t-transparent border-r-fuchsia-500 border-b-transparent border-l-cyan-400 border-dashed"
                />
                <Sparkles className="w-10 h-10 text-violet-300" />
              </div>
              
              <div className="flex flex-col items-center gap-2 text-center">
                <span className="text-xs font-mono text-violet-300 font-bold">
                  Mood
                </span>
                <h3 className="text-2xl font-brush text-white font-semibold leading-tight">
                  {loadingMessage}
                </h3>
                <p className="text-white/40 text-xs font-mono max-w-sm leading-relaxed">
                  Please wait while we analyze your Spotify data and prepare a playlist.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    );
  }

  // Authenticated Dashboard Flow
  return (
    <motion.main 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-36 flex flex-col min-h-screen relative z-10"
    >
      {/* Dynamic Background Colored Blooms */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25 transition-all duration-1000 -z-10"
        style={{
          background: `radial-gradient(circle at 25% 20%, ${colorA} 0%, transparent 40%),
                       radial-gradient(circle at 75% 50%, ${colorB} 0%, transparent 45%),
                       radial-gradient(circle at 50% 80%, ${colorC} 0%, transparent 40%)`
        }}
      />

      {/* Main Grid Hero Layout (Split columns) */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-10 items-center z-10 mt-6 relative">
        {/* Left Column: Description & Premium CTAs */}
        <div className="flex flex-col gap-4.5 max-w-md text-left z-10">
          <span className="text-[10px] font-mono font-black text-[#b6ff00] tracking-[0.3em] uppercase leading-none">
            {festival ? `✦ Celebrating ${festival.name} ✦` : "Aura Sound Intelligence"}
          </span>
          <h2 className="text-4xl md:text-5xl font-brush text-white font-black leading-none uppercase tracking-normal neon-text">
            {getGreeting(new Date(), session?.user?.name || undefined)}
          </h2>
          
          <div className="h-16 flex items-center">
            <AnimatePresence mode="wait">
              <motion.p 
                key={insightIdx}
                initial={{ opacity: 0, y: 8, filter: "blur(3px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(3px)" }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="text-cyan-100/70 text-sm font-mono leading-relaxed"
              >
                {DYNAMIC_INSIGHTS[insightIdx]}
              </motion.p>
            </AnimatePresence>
          </div>
          
          <button
            onClick={() => setMoodPromptOpen(true)}
            className="group relative mt-3 self-start overflow-hidden rounded-full p-[1.5px] focus:outline-none hover:scale-102 active:scale-98 transition-all duration-300 shrink-0 cursor-pointer y2k-button"
          >
            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400 opacity-60 group-hover:opacity-100 transition-opacity animate-pulse duration-3000" />
            <div className="relative flex items-center gap-2 rounded-full px-6 py-3 text-xs font-mono font-bold tracking-widest text-white/90 uppercase backdrop-blur-3xl transition-all">
              <Sparkles className="w-3.5 h-3.5 text-[#b6ff00] group-hover:text-white transition-colors" />
              <span>Decode Vibe ✦</span>
            </div>
          </button>
        </div>

        {/* Center Column: Rotating glowing centerpiece logo */}
        <div className="flex justify-center items-center relative" onClick={() => setMoodPromptOpen(true)}>
          {renderCenterpiece()}
          
          {isPlaying && currentTrack && (
            <div className="absolute -bottom-6 px-4 py-1.5 rounded-full y2k-screen flex items-center gap-2.5 z-30">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b6ff00] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#b6ff00]"></span>
              </span>
              <span className="text-[9px] font-mono text-white font-bold uppercase tracking-wider truncate max-w-[140px]">
                {currentTrack.name}
              </span>
            </div>
          )}
        </div>

        {/* Right Column: Morphing Stats / Active Vibe playlist card */}
        <div className="flex justify-center lg:justify-end lg:pr-4 z-10">
          {activeVibe ? renderActiveVibeCard() : renderDefaultStatsCard()}
        </div>
      </div>

      {/* Redesigned Premium Spotify Shelves */}

      {/* 1. Recently Played Shelf (Latest Heard Songs) */}
      <motion.section 
        variants={itemVariants}
        className="w-full mt-24 flex flex-col gap-6 z-10"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl y2k-screen text-white/80">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-brush tracking-normal text-white uppercase font-bold neon-text">Latest Heard Songs</h2>
            <p className="text-[9px] font-mono text-cyan-100/45 uppercase tracking-wider">Your recently active acoustic stream</p>
          </div>
        </div>

        <div className="flex gap-4.5 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 snap-x snap-mandatory">
          {feed?.recentlyPlayed && feed.recentlyPlayed.length > 0 ? (
            feed.recentlyPlayed.map((track, idx) => (
              <div 
                key={`${track.id}-${idx}`}
                onClick={() => handlePlay(track, feed?.recentlyPlayed)}
                className="flex-shrink-0 w-36 sm:w-40 snap-start cursor-pointer group y2k-panel rounded-[1.35rem] p-2"
              >
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-lg border border-cyan-300/20 transition-all duration-300 group-hover:border-pink-300/30 group-hover:scale-103 bg-[#16161a]">
                  <img
                    src={track.albumArt || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80"}
                    alt={track.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-9 h-9 rounded-full y2k-chrome text-black flex items-center justify-center shadow-lg transition-transform duration-300 scale-90 group-hover:scale-100">
                      <Play className="w-4 h-4 fill-current translate-x-0.5" />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col mt-2.5">
                  <h4 className="text-xs font-display font-black uppercase text-white truncate leading-tight group-hover:text-[#b6ff00] transition-colors">
                    {track.name}
                  </h4>
                  <p className="text-[9px] font-mono text-cyan-100/50 truncate mt-0.5 uppercase tracking-wider">
                    {track.artist}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs font-mono text-zinc-500 pl-4 py-8">No recently played songs logged</p>
          )}
        </div>
      </motion.section>

      {/* 2. Top Tracks Shelf (Heard the Most) */}
      <motion.section 
        variants={itemVariants}
        className="w-full mt-16 flex flex-col gap-6 z-10"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-white/5 border border-white/10 text-white/80">
            <Flame className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h2 className="text-xl font-brush tracking-wide text-white uppercase font-bold">Heard The Most</h2>
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Your personal heavy-rotation audio history</p>
          </div>
        </div>

        <div className="flex gap-4.5 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 snap-x snap-mandatory">
          {feed?.topTracks && feed.topTracks.length > 0 ? (
            feed.topTracks.map((track, i) => (
              <div 
                key={`${track.id}-${i}`}
                onClick={() => handlePlay(track, feed?.topTracks)}
                className="flex-shrink-0 w-36 sm:w-40 snap-start cursor-pointer group"
              >
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-lg border border-white/5 transition-all duration-300 group-hover:border-violet-500/20 group-hover:scale-103 bg-[#16161a]">
                  <img
                    src={track.albumArt || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&q=80"}
                    alt={track.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-9 h-9 rounded-full bg-white/95 text-black flex items-center justify-center shadow-lg transition-transform duration-300 scale-90 group-hover:scale-100">
                      <Play className="w-4 h-4 fill-current translate-x-0.5" />
                    </div>
                  </div>
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[8px] font-mono text-white/90 font-bold border border-white/10 shadow-sm uppercase">
                    Rank #{i + 1}
                  </span>
                </div>
                <div className="flex flex-col mt-2.5">
                  <h4 className="text-xs font-bold text-white truncate leading-tight group-hover:text-violet-300 transition-colors">
                    {track.name}
                  </h4>
                  <span className="text-[9px] font-mono text-zinc-500 mt-1 italic font-medium">
                    ✦ {EMOTIONAL_TAGS[i % EMOTIONAL_TAGS.length]}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs font-mono text-zinc-500 pl-4 py-8">No high rotation records found</p>
          )}
        </div>
      </motion.section>

      {/* 3. Best Recommendations Shelf (Real Spotify recommendation seed engine) */}
      <motion.section 
        variants={itemVariants}
        className="w-full mt-16 flex flex-col gap-6 z-10"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-brush tracking-wide text-white uppercase font-bold">Best Recommendations For You</h2>
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">AI recommendation model computed from your actual listening</p>
          </div>
        </div>

        <div className="flex gap-4.5 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 snap-x snap-mandatory">
          {feed?.recommendations && feed.recommendations.length > 0 ? (
            feed.recommendations.map((track, idx) => (
              <div 
                key={`${track.id}-${idx}`}
                onClick={() => handlePlay(track, feed?.recommendations)}
                className="flex-shrink-0 w-36 sm:w-40 snap-start cursor-pointer group"
              >
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-lg border border-white/5 transition-all duration-300 group-hover:border-cyan-500/20 group-hover:scale-103 bg-[#16161a]">
                  <img
                    src={track.albumArt || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80"}
                    alt={track.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-9 h-9 rounded-full bg-white/95 text-black flex items-center justify-center shadow-lg transition-transform duration-300 scale-90 group-hover:scale-100">
                      <Play className="w-4 h-4 fill-current translate-x-0.5" />
                    </div>
                  </div>
                  <span className="absolute top-2 right-2 p-1 rounded-full bg-black/75 border border-white/10 flex items-center justify-center">
                    <Sparkles className="w-2.5 h-2.5 text-cyan-300 animate-pulse" />
                  </span>
                </div>
                <div className="flex flex-col mt-2.5">
                  <h4 className="text-xs font-bold text-white truncate leading-tight group-hover:text-cyan-300 transition-colors">
                    {track.name}
                  </h4>
                  <p className="text-[9px] font-mono text-zinc-400 truncate mt-0.5">
                    {track.artist}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs font-mono text-zinc-500 pl-4 py-8">Analyzing dynamic seed profiles...</p>
          )}
        </div>
      </motion.section>

      {/* 4. Trending in Region Shelf */}
      <motion.section 
        variants={itemVariants}
        className="w-full mt-16 flex flex-col gap-6 z-10"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-white/5 border border-white/10 text-white/80">
            <Globe className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-brush tracking-wide text-white uppercase font-bold">Trending in Your Region</h2>
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Top hits currently ruling the local airwaves</p>
          </div>
        </div>

        <div className="flex gap-4.5 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 snap-x snap-mandatory">
          {feed?.regionalTrending && feed.regionalTrending.length > 0 ? (
            feed.regionalTrending.map((track, idx) => (
              <div 
                key={`${track.id}-${idx}`}
                onClick={() => handlePlay(track, feed?.regionalTrending)}
                className="flex-shrink-0 w-44 sm:w-48 snap-start cursor-pointer group"
              >
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-white/5 transition-all duration-300 group-hover:border-cyan-500/20 group-hover:scale-103 bg-[#16161a]">
                  <img
                    src={track.albumArt || ""}
                    alt={track.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-between p-3.5">
                    <span className="self-start px-2 py-0.5 rounded-full bg-cyan-500/25 border border-cyan-400/20 text-[7.5px] font-mono font-bold tracking-widest text-cyan-200 uppercase">
                      {track.badge}
                    </span>
                    <div className="w-9 h-9 rounded-full bg-white/95 text-black flex items-center justify-center shadow-lg transition-transform duration-300 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 self-center">
                      <Play className="w-4 h-4 fill-current translate-x-0.5" />
                    </div>
                    <span className="text-[8px] font-mono text-zinc-300 self-start">
                      Rank #{track.rank} • {track.streams}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col mt-2.5">
                  <h4 className="text-xs font-bold text-white truncate leading-tight group-hover:text-cyan-300 transition-colors">
                    {track.name}
                  </h4>
                  <p className="text-[9px] font-mono text-zinc-400 truncate mt-0.5">
                    {track.artist}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs font-mono text-zinc-500 pl-4 py-8">Fetching regional airplay maps...</p>
          )}
        </div>
      </motion.section>

      {/* 5. Instagram Reels Trending Shelf */}
      <motion.section 
        variants={itemVariants}
        className="w-full mt-16 flex flex-col gap-6 z-10"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#bc1888] to-[#f09433] text-white">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-brush tracking-wide text-white uppercase font-bold">Trending From Instagram Currently</h2>
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Viral sound bites currently exploding across social Reels feeds</p>
          </div>
        </div>

        <div className="flex gap-4.5 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 snap-x snap-mandatory">
          {feed?.instagramTrending && feed.instagramTrending.length > 0 ? (
            feed.instagramTrending.map((track, idx) => (
              <div 
                key={`${track.id}-${idx}`}
                onClick={() => handlePlay(track, feed?.instagramTrending)}
                className="flex-shrink-0 w-36 sm:w-40 snap-start cursor-pointer group"
              >
                <div 
                  className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-lg transition-all duration-300 group-hover:scale-103 bg-[#16161a] p-[1.5px]"
                  style={{ backgroundImage: INSTAGRAM_GRADIENT }}
                >
                  <div className="relative w-full h-full bg-[#121214] rounded-[14px] overflow-hidden">
                    <img
                      src={track.albumArt || ""}
                      alt={track.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-black/45 flex flex-col justify-between p-3.5 z-10">
                      <span className="self-start px-2 py-0.5 rounded-full bg-black/60 border border-white/10 text-[7px] font-mono font-bold tracking-widest text-[#f56040] uppercase">
                        {track.badge}
                      </span>
                      <div className="w-8.5 h-8.5 rounded-full bg-white/95 text-black flex items-center justify-center shadow-lg transition-transform duration-300 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 self-center">
                        <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-bold text-white leading-none truncate">{track.hashtag}</span>
                        <span className="text-[8px] font-mono text-zinc-400 mt-0.5 shrink-0">{track.reelsCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col mt-2.5">
                  <h4 className="text-xs font-bold text-white truncate leading-tight group-hover:text-fuchsia-300 transition-colors">
                    {track.name}
                  </h4>
                  <p className="text-[9px] font-mono text-zinc-400 truncate mt-0.5">
                    {track.artist}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs font-mono text-zinc-500 pl-4 py-8">Fetching social media tags...</p>
          )}
        </div>
      </motion.section>

      {/* Dynamic Vibe DNA & Social Matching Asymmetric Section */}
      <motion.section 
        variants={itemVariants}
        className="w-full mt-24 grid grid-cols-1 lg:grid-cols-5 gap-8 z-10"
      >
        {/* Vibe DNA Card (occupies 3 columns) */}
        <div className="lg:col-span-3 glass-premium rounded-[2.5rem] border border-white/5 bg-white/[0.01] backdrop-blur-2xl p-8 flex flex-col gap-6 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-violet-500/5 blur-[80px]" />
          
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
              <Dna className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <h3 className="text-lg font-brush tracking-wide text-white uppercase font-bold">Your Acoustic DNA</h3>
              <p className="text-[10px] font-mono text-zinc-500 uppercase">Live dynamic acoustic profile mapping</p>
            </div>
          </div>

          <div className="flex flex-col gap-5 mt-2">
            {[
              { label: "Dreamy Cinematic", val: 78, color: "from-violet-500 to-indigo-500" },
              { label: "Chaos Beat Hype", val: 56, color: "from-rose-500 to-red-500" },
              { label: "Late Night Indie", val: 42, color: "from-purple-500 to-fuchsia-500" },
              { label: "Balanced Harmony", val: 29, color: "from-cyan-500 to-teal-500" },
            ].map((dna) => (
              <div key={dna.label} className="flex flex-col gap-2 group">
                <div className="flex justify-between items-end text-xs font-mono">
                  <span className="text-zinc-400 group-hover:text-white transition-colors">{dna.label}</span>
                  <span className="font-black text-white">{dna.val}%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden p-[1px]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${dna.val}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={cn("h-full rounded-full bg-gradient-to-r", dna.color)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vibe Compatibility Card (occupies 2 columns) */}
        <div className="lg:col-span-2 glass-premium rounded-[2.5rem] border border-white/5 bg-white/[0.01] backdrop-blur-2xl p-8 flex flex-col justify-between gap-6 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
          <div className="absolute -left-20 -bottom-20 w-60 h-60 rounded-full bg-cyan-500/5 blur-[80px]" />
          
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Globe className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-brush tracking-wide text-white uppercase font-bold">Social Sync</h3>
                <p className="text-[10px] font-mono text-zinc-500 uppercase">Aesthetic matching frequency</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-2">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3 overflow-hidden">
                  {[
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
                  ].map((url, i) => (
                    <img
                      key={i}
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-black object-cover"
                      src={url}
                      alt="Friend Profile"
                    />
                  ))}
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-zinc-800 ring-2 ring-black text-[9px] font-mono font-bold text-zinc-400">
                    +4
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-mono font-bold text-white leading-none">
                    92% Aura Sync
                  </span>
                  <span className="text-[9px] font-mono text-zinc-500 mt-1">
                    With Rhea, Sid & Kabir
                  </span>
                </div>
              </div>

              <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 flex flex-col gap-1.5 mt-1.5">
                <div className="flex items-center gap-1.5 text-[8px] font-mono text-cyan-300 font-bold uppercase tracking-wider">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400"></span>
                  </span>
                  Listening Party Match
                </div>
                <p className="text-[10px] font-mono text-zinc-400 leading-relaxed italic">
                  "Your friends are syncing to the same indie vibe late at night."
                </p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setMoodPromptOpen(true)}
            className="w-full py-3 rounded-2xl border border-cyan-400/20 hover:border-cyan-400/40 bg-cyan-400/5 hover:bg-cyan-400/10 text-cyan-300 text-[10px] font-mono font-black tracking-widest uppercase hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            Match Mood Circle ✦
          </button>
        </div>
      </motion.section>

      {/* Dynamic Music Memory Capsules Section */}
      <motion.section 
        variants={itemVariants}
        className="w-full mt-24 flex flex-col gap-6 mb-24 z-10"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400">
            <Clock className="w-5 h-5 text-fuchsia-400" />
          </div>
          <div>
            <h2 className="text-xl font-brush tracking-wide text-white uppercase font-bold">Music Memory Capsules</h2>
            <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Historical acoustic checkpoints frozen in time</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Monsoon Sessions",
              tracks: "24 tracks mapped",
              desc: "Cinematic, slow-build rain tracks saved during August cloudbursts.",
              mood: "Dreamy Melancholy",
              glow: "group-hover:border-blue-500/20 shadow-blue-500/5",
              pillBg: "bg-blue-400/10 text-blue-300 border-blue-400/20"
            },
            {
              title: "Heartbreak Solace",
              tracks: "18 tracks mapped",
              desc: "Late-night acoustic ballads from when feelings hit their chaotic peak.",
              mood: "Cozy Solitary",
              glow: "group-hover:border-purple-500/20 shadow-purple-500/5",
              pillBg: "bg-purple-400/10 text-purple-300 border-purple-400/20"
            },
            {
              title: "Pre-Exam Focus Sync",
              tracks: "32 tracks mapped",
              desc: "Industrial lo-fi beats driving hyper-focused deep work states.",
              mood: "Chaos Hype",
              glow: "group-hover:border-rose-500/20 shadow-rose-500/5",
              pillBg: "bg-rose-400/10 text-rose-300 border-rose-400/20"
            }
          ].map((cap) => (
            <div 
              key={cap.title}
              className={cn(
                "group glass-premium border border-white/5 rounded-[2.2rem] p-6.5 bg-white/[0.01] backdrop-blur-2xl hover:bg-white/[0.03] transition-all duration-500 flex flex-col justify-between gap-5 cursor-pointer shadow-lg active:scale-[0.99]",
                cap.glow
              )}
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-mono text-zinc-500 uppercase font-semibold">{cap.tracks}</span>
                  <span className={cn("px-2.5 py-0.5 rounded-full text-[8px] font-mono border uppercase font-bold", cap.pillBg)}>
                    {cap.mood}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-fuchsia-300 transition-colors font-display leading-tight mt-1.5 uppercase tracking-wide">
                  {cap.title}
                </h3>
                <p className="text-zinc-400 text-xs font-mono leading-relaxed mt-1">
                  {cap.desc}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-4.5">
                <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest group-hover:text-white transition-colors">
                  Relive Capsule
                </span>
                <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-fuchsia-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Vibe Prompt Tuner Modal Overlay */}
      <AnimatePresence>
        {isMoodPromptOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/75 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-premium rounded-[3rem] border border-white/10 bg-black/60 backdrop-blur-2xl p-8 md:p-12 w-full max-w-xl relative overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.8)]"
            >
              <div className="absolute -left-20 -top-20 w-60 h-60 rounded-full bg-violet-400/10 blur-[80px]" />
              <div className="absolute -right-20 -bottom-20 w-60 h-60 rounded-full bg-purple-500/10 blur-[80px]" />

              <button 
                onClick={() => setMoodPromptOpen(false)}
                className="absolute top-8 right-8 text-white/40 hover:text-white font-mono text-xs tracking-wide hover:underline"
              >
                CLOSE [ESC]
              </button>

              <div className="flex flex-col gap-6 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-violet-300" />
                  <span className="text-xs font-mono font-bold text-violet-300 animate-pulse">
                    Aura Mood Synapse
                  </span>
                </div>



                <input
                  type="text"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Enter vibe description..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-violet-400/40 focus:ring-1 focus:ring-violet-300/20 transition-all"
                />

                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-mono text-white/30 tracking-wide">
                    Aura Protocol Activated
                  </span>
                  <button
                    onClick={handleVibeSubmit}
                    disabled={isSubmitting || !promptText.trim()}
                    className="px-8 py-4 rounded-full bg-gradient-to-r from-violet-300 via-fuchsia-300 to-sky-300 hover:from-violet-200 hover:to-sky-200 disabled:opacity-40 text-black font-bold tracking-wide text-xs hover:scale-103 active:scale-97 transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(6,182,212,0.25)]"
                  >
                    {isSubmitting ? "Blending wave..." : "Align Vibe ✦"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Vibe tuner loading overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 z-[250] flex flex-col items-center justify-center p-6 bg-black/85 backdrop-blur-2xl">
          <div className="relative flex flex-col items-center gap-8">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <div className="absolute inset-0 bg-violet-400/20 rounded-full blur-[30px]" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-t-cyan-400 border-r-transparent border-b-indigo-500 border-l-transparent"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 rounded-full border border-t-transparent border-r-fuchsia-500 border-b-transparent border-l-cyan-400 border-dashed"
              />
              <Sparkles className="w-10 h-10 text-violet-300" />
            </div>
            
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-xs font-mono text-violet-300 font-bold">
                                 Loading...
              </span>
              <h3 className="text-2xl font-brush text-white font-semibold leading-tight">
                {loadingMessage}
              </h3>
              <p className="text-white/40 text-xs font-mono max-w-sm leading-relaxed">
                                Preparing your songs...
              </p>
            </div>
          </div>
        </div>
      )}
    </motion.main>
  );
}
