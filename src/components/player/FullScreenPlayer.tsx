"use client";

import { useState, useEffect } from "react";
import { usePlayerStore } from "@/stores/playerStore";
import { VinylRecord } from "./VinylRecord";
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  ChevronDown, 
  Heart, 
  Sparkles, 
  Shuffle, 
  Repeat, 
  VolumeX, 
  ListMusic,
  Music 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

function formatTime(ms: number): string {
  if (isNaN(ms) || ms < 0) return "0:00";
  const seconds = Math.floor(ms / 1000);
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export function FullScreenPlayer() {
  const { data: session } = useSession();
  const { 
    currentTrack, 
    isPlaying, 
    pause, 
    resume, 
    next, 
    previous, 
    progress, 
    duration, 
    volume, 
    setVolume, 
    isFullScreenPlayerOpen, 
    setFullScreenPlayerOpen,
    dominantColor,
    sdk,
    queue,
    play,
    toggleShuffle,
    shuffle,
    repeat,
    cycleRepeat,
    seek,
    appendToQueue,
    isLoadingQueue,
    isQueueRunningLow,
    setLoadingQueue
  } = usePlayerStore();

  const [isLiked, setIsLiked] = useState(false);
  const [localProgress, setLocalProgress] = useState(progress);
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [recordSize, setRecordSize] = useState(280);

  useEffect(() => {
    const handleResize = () => {
      setRecordSize(window.innerWidth < 768 ? 260 : 340);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isDraggingProgress) {
      setLocalProgress(progress);
    }
  }, [progress, isDraggingProgress]);

  // ── Auto-fetch ML recommendations when queue runs low ──
  const fetchSmartQueue = async () => {
    if (isLoadingQueue || !currentTrack) return;
    setLoadingQueue(true);
    try {
      const recentIds = queue.slice(0, 10).map(t => t.id);
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackId: currentTrack.id,
          recentTrackIds: recentIds,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.tracks && data.tracks.length > 0) {
          const formatted = data.tracks.map((t: any) => ({
            id: t.id,
            name: t.name,
            uri: t.uri,
            duration_ms: t.duration_ms,
            preview_url: t.preview_url || null,
            album: t.album,
            artists: t.artists,
          }));
          appendToQueue(formatted);
        }
      }
    } catch (err) {
      console.error("[Aura] Smart queue fetch failed:", err);
    } finally {
      setLoadingQueue(false);
    }
  };

  if (!isFullScreenPlayerOpen || !currentTrack) return null;

  const trackArt = currentTrack.album?.images?.[0]?.url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&q=80";
  const trackName = currentTrack.name || "Aura Silence";
  const trackArtist = currentTrack.artists?.[0]?.name || "Aura // Sound Stream";

  const color1 = dominantColor || "#FF2D78";
  const color2 = "#8B5CF6";

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setLocalProgress(val);
  };

  const handleProgressChangeEnd = () => {
    setIsDraggingProgress(false);
    seek(localProgress);
  };

  // Get upcoming 10 tracks from the current context queue
  const currentIdx = queue.findIndex(t => t.id === currentTrack.id);
  const upcomingTracks = currentIdx >= 0 ? queue.slice(currentIdx + 1, currentIdx + 11) : [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 180 }}
        className="fixed inset-0 z-[250] overflow-hidden flex flex-col justify-between text-white bg-[#05030f] crt-scanlines"
      >
        {/* Full-Screen Opaque Blur Backdrop - Blocks out all home elements */}
        <div className="absolute inset-0 overflow-hidden -z-20 pointer-events-none">
          <img 
            src={trackArt} 
            alt="" 
            className="w-full h-full object-cover scale-150 blur-[130px] opacity-[0.22] transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-[#05030f]/88" />
          <div className="absolute inset-0 pixel-grid opacity-25" />
          
          {/* Animated floating orbs */}
          <motion.div 
            animate={{ 
              x: [0, 40, -20, 0],
              y: [0, -30, 50, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-[90px] mix-blend-screen opacity-30"
            style={{ backgroundColor: color1 }}
          />
          <motion.div 
            animate={{ 
              x: [0, -50, 30, 0],
              y: [0, 40, -30, 0],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full blur-[120px] mix-blend-screen opacity-20"
            style={{ backgroundColor: color2 }}
          />
        </div>

        {/* Header bar */}
        <header className="w-full flex items-center justify-between px-6 md:px-12 py-5 border-b border-cyan-300/15 backdrop-blur-xl bg-[#07031a]/70 relative z-30">
          <button 
            onClick={() => setFullScreenPlayerOpen(false)}
            className="p-2.5 rounded-full y2k-screen hover:border-pink-300/40 active:scale-95 transition-all text-white/80 hover:text-white"
          >
            <ChevronDown className="w-5.5 h-5.5" />
          </button>
          
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-mono tracking-[0.3em] text-white/40 uppercase">AURA MEDIA OS</span>
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#b6ff00] uppercase mt-0.5">IMMERSIVE PLAYER</span>
          </div>

          <div className="w-11 h-11" /> {/* Spacer */}
        </header>

        {/* Content Workspace */}
        <main className="flex-1 flex items-center justify-center py-6 px-6 md:px-12 w-full overflow-y-auto no-scrollbar relative z-20">
          <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            
            {/* Left Column: Premium Floating Art Panel (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative w-full">
              <VinylRecord 
                image={trackArt} 
                size={recordSize}
                className="max-w-[280px] sm:max-w-[340px] aspect-square"
              />

              {/* Quick Info & Like button under Art */}
              <div className="w-full max-w-[280px] sm:max-w-[340px] flex justify-end items-center mt-6">
                <button 
                  onClick={() => setIsLiked(!isLiked)}
                  className="p-3 rounded-2xl y2k-screen hover:border-pink-300/40 active:scale-95 transition-all text-white/80"
                >
                  <Heart className={cn("w-4.5 h-4.5 transition-colors", isLiked ? "fill-rose-500 text-rose-500" : "text-white")} />
                </button>
              </div>
            </div>

            {/* Right Column: Title, seeking, volume and Up Next list (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6 w-full text-left">
              
              {/* Song Metadata Titles */}
              <div className="flex flex-col gap-1 min-w-0">
                <h1 className="text-3xl md:text-5xl font-brush font-black uppercase tracking-normal text-white leading-none neon-text">
                  {trackName}
                </h1>
                <p className="text-sm font-mono tracking-widest text-cyan-100/55 uppercase mt-1">
                  {trackArtist}
                </p>
              </div>

              {/* Live Audio Visualizer Equalizer Bars */}
              <div className="flex items-end gap-1.5 h-10 w-full justify-start mt-2">
                {[0.2, 0.6, 0.4, 0.8, 0.5, 0.9, 0.6, 0.3, 0.7, 0.5, 0.8, 0.4].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={isPlaying ? { height: [`${h * 100}%`, `${(h + 0.3) * 100}%`, `${h * 100}%`] } : { height: "15%" }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.08 }}
                    className={cn(
                      "w-1 rounded-full",
                      i % 3 === 0 ? "bg-[#b6ff00]" : i % 3 === 1 ? "bg-[#ff2bd6]" : "bg-[#00f5ff]"
                    )}
                    style={{ height: `${h * 100}%` }}
                  />
                ))}
              </div>

              {/* Slider Seek Bar */}
              <div className="flex flex-col gap-2 w-full mt-2">
                <input 
                  type="range"
                  min="0"
                  max={duration || 180000}
                  value={localProgress}
                  onMouseDown={() => setIsDraggingProgress(true)}
                  onTouchStart={() => setIsDraggingProgress(true)}
                  onChange={handleProgressChange}
                  onMouseUp={handleProgressChangeEnd}
                  onTouchEnd={handleProgressChangeEnd}
                  className="premium-slider w-full h-1 rounded-full cursor-pointer focus:outline-none"
                />
                <div className="flex justify-between text-[10px] font-mono text-cyan-100/50">
                  <span>{formatTime(localProgress)}</span>
                  <span>{formatTime(duration || 180000)}</span>
                </div>
              </div>

              {/* Player control cluster */}
              <div className="flex justify-between items-center gap-4 w-full mt-1">
                <button 
                  onClick={toggleShuffle}
                  className={cn(
                    "p-3 rounded-full transition-colors active:scale-90",
                    shuffle ? "text-[#b6ff00] shadow-[0_0_15px_rgba(182,255,0,0.3)] bg-[#b6ff00]/10 border border-[#b6ff00]/20" : "text-cyan-100/45 hover:text-white"
                  )}
                >
                  <Shuffle className="w-5 h-5" />
                </button>

                <button 
                  onClick={async () => {
                    if (sdk) {
                      await sdk.previous();
                    } else {
                      previous();
                    }
                  }}
                  className="p-3 text-cyan-100/45 hover:text-[#b6ff00] transition-colors active:scale-90"
                >
                  <SkipBack className="w-6.5 h-6.5 fill-current" />
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
                  className="w-18 h-18 rounded-full y2k-chrome text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_35px_rgba(0,245,255,0.22)]"
                >
                  {isPlaying ? (
                    <Pause className="w-7 h-7 fill-current" />
                  ) : (
                    <Play className="w-7 h-7 fill-current translate-x-0.5" />
                  )}
                </button>

                <button 
                  onClick={async () => {
                    if (sdk) {
                      await sdk.next();
                    } else {
                      next();
                    }
                    // Auto-extend queue when running low
                    if (isQueueRunningLow()) {
                      fetchSmartQueue();
                    }
                  }}
                  className="p-3 text-cyan-100/45 hover:text-[#b6ff00] transition-colors active:scale-90"
                >
                  <SkipForward className="w-6.5 h-6.5 fill-current" />
                </button>

                <button 
                  onClick={cycleRepeat}
                  className={cn(
                    "p-3 rounded-full transition-colors active:scale-90",
                    repeat !== "off" ? "text-[#b6ff00] shadow-[0_0_15px_rgba(182,255,0,0.3)] bg-[#b6ff00]/10 border border-[#b6ff00]/20" : "text-cyan-100/45 hover:text-white"
                  )}
                >
                  <Repeat className="w-5 h-5" />
                </button>
              </div>

              {/* Master Volume Controller & Queue list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                {/* Volume bar */}
                <div className="flex items-center gap-3 y2k-screen p-4.5 rounded-3xl">
                  <button 
                    onClick={() => setVolume(volume === 0 ? 0.5 : 0)}
                    className="text-cyan-100/55 hover:text-white transition-colors shrink-0"
                  >
                    {volume === 0 ? <VolumeX className="w-4.5 h-4.5" /> : <Volume2 className="w-4.5 h-4.5" />}
                  </button>
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
                    className="premium-slider flex-1 h-1 rounded-full cursor-pointer focus:outline-none"
                  />
                </div>

                {/* Mini Up Next list */}
                {upcomingTracks.length > 0 ? (
                  <div className="y2k-screen p-4.5 rounded-3xl flex flex-col gap-2 select-none">
                    <div className="flex items-center gap-1.5 text-cyan-100/55 border-b border-cyan-300/10 pb-1.5">
                      <ListMusic className="w-3.5 h-3.5 text-[#b6ff00]" />
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider">UP NEXT</span>
                      {isLoadingQueue && (
                        <span className="text-[8px] font-mono text-cyan-400 animate-pulse ml-auto">Loading AI picks...</span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                      {upcomingTracks.map((track, idx) => (
                        <div 
                          key={`${track.id}-${idx}`}
                          onClick={() => play(track, queue)}
                          className="flex items-center gap-2 hover:bg-cyan-300/8 p-1 rounded-xl cursor-pointer group transition-all"
                        >
                          <img 
                            src={track.album?.images?.[0]?.url || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=50&q=80"} 
                            alt="" 
                            className="w-6.5 h-6.5 rounded-md object-cover shrink-0" 
                          />
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-[10px] font-bold text-white group-hover:text-[#b6ff00] transition-colors truncate">
                              {track.name}
                            </span>
                            <span className="text-[8px] font-mono text-zinc-400 truncate">
                              {track.artists?.[0]?.name}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="y2k-screen p-4.5 rounded-3xl flex flex-col gap-2.5 items-center select-none">
                    <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">No upcoming tracks</span>
                    <button
                      onClick={fetchSmartQueue}
                      disabled={isLoadingQueue}
                      className="px-4 py-2 rounded-full y2k-button text-[9px] font-mono font-bold text-white uppercase tracking-wider active:scale-95 transition-all disabled:opacity-40"
                    >
                      {isLoadingQueue ? (
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 animate-spin" />
                          Generating AI Queue...
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3" />
                          Smart Queue ✦
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </motion.div>
    </AnimatePresence>
  );
}
