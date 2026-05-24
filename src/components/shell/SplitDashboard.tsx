"use client";

import { usePlayerStore } from "@/stores/playerStore";
import { useEffect, useState } from "react";
import { FloatingControls } from "../player/FloatingControls";
import { extractDominantColor } from "@/lib/colorExtractor";
import { LorePanel } from "../player/LorePanel";

import { useSession, signOut } from "next-auth/react";
import { useSpotifyPlayer } from "@/hooks/useSpotifyPlayer";
import { MobileBottomNav } from "../navigation/MobileBottomNav";
import { TopNav } from "../navigation/TopNav";
import { SplashReveal } from "../ui/SplashReveal";
import { usePathname } from "next/navigation";

import { FullScreenPlayer } from "../player/FullScreenPlayer";

// Mood mapping function to return beautiful custom aura highlights based on tracks
function getMoodColor(trackName: string = "", artistName: string = "", baseColor: string = ""): string {
  const text = `${trackName} ${artistName}`.toLowerCase();
  
  // High energy / Warmer tones (Punjabi hits, Bollywood club bangers, high tempo)
  if (
    text.includes("aujla") ||
    text.includes("dhillon") ||
    text.includes("diljit") ||
    text.includes("starboy") ||
    text.includes("punjabi") ||
    text.includes("badshah") ||
    text.includes("singh") ||
    text.includes("alakh")
  ) {
    return "#FF6B35"; // Electric Coral / Sunlight Gold
  }
  
  // Serene / Calm / Chill lo-fi tones (Enigma, Amit Trivedi acoustic, soothing ambient)
  if (
    text.includes("enigma") ||
    text.includes("trivedi") ||
    text.includes("lofi") ||
    text.includes("chill") ||
    text.includes("arijit") ||
    text.includes("kuhad") ||
    text.includes("humsafar") ||
    text.includes("dream") ||
    text.includes("silence")
  ) {
    return "#8B5CF6"; // Serene Chill Purple/Indigo
  }
  
  // Fallback contrasting tone (cool cyan/teal by default)
  return "#00F5FF";
}

export function SplitDashboard({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const { currentTrack } = usePlayerStore();
  useSpotifyPlayer(session?.accessToken as string);
  const [dominantColor, setDominantColor] = useState("#FF2D78");
  const [moodColor, setMoodColor] = useState("#00F5FF");
  const [showSplash, setShowSplash] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signOut({ callbackUrl: "/login" });
    }
  }, [session]);

  useEffect(() => {
    setIsMounted(true);
    const played = sessionStorage.getItem("aura-splash-played");
    if (played === "true") {
      setShowSplash(false);
    }
  }, []);

  useEffect(() => {
    const albumArt = currentTrack?.album?.images?.[0]?.url;
    const name = currentTrack?.name || "";
    const artist = currentTrack?.artists?.[0]?.name || "";

    if (albumArt) {
      extractDominantColor(albumArt).then(color => {
        setDominantColor(color);
        setMoodColor(getMoodColor(name, artist, color));
        usePlayerStore.setState({ dominantColor: color });
      });
    } else {
      // Direct mood styling for default/local playlist fallback
      const color = getMoodColor(name, artist, "#FF2D78");
      setMoodColor(color);
      usePlayerStore.setState({ dominantColor: color });
    }
  }, [currentTrack]);

  if (!isMounted) {
    return <div className="fixed inset-0 bg-black z-[9999]" />;
  }

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  if (isAuthPage) {
    return <div className="w-full min-h-screen bg-background relative overflow-hidden crt-scanlines">{children}</div>;
  }

  return (
    <>
      {showSplash && (
        <SplashReveal
          onComplete={() => {
            sessionStorage.setItem("aura-splash-played", "true");
            setShowSplash(false);
          }}
        />
      )}
      <div className="w-full h-screen overflow-hidden bg-background relative flex flex-col transition-all duration-1000 crt-scanlines">
        <div className="fixed inset-0 pointer-events-none opacity-35 pixel-grid" />
        <div className="fixed inset-x-0 top-0 h-32 pointer-events-none bg-gradient-to-b from-cyan-400/10 via-pink-500/5 to-transparent" />

        {/* Dynamic retro neon wash */}
        <div 
          className="fixed inset-0 pointer-events-none opacity-40 transition-all duration-1000 ease-in-out"
          style={{
            background: `radial-gradient(circle at 20% 8%, ${dominantColor} 0%, transparent 26%),
                         radial-gradient(circle at 84% 22%, ${moodColor} 0%, transparent 24%),
                         linear-gradient(135deg, rgba(255,43,214,0.08), rgba(0,245,255,0.05))`
          }}
        />

        <TopNav />

        {/* Main Container */}
        <main className="flex-1 w-full flex flex-col relative z-10 overflow-y-auto no-scrollbar scroll-smooth">
          {/* Content Area */}
          <div className="w-full h-full">
            {children}
          </div>
        </main>

        {/* Floating Player - Centered at bottom */}
        <div className="fixed bottom-28 md:bottom-10 left-1/2 -translate-x-1/2 z-40 w-full max-w-5xl px-6">
          <FloatingControls />
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <MobileBottomNav />
        </div>

        {/* Lore Side Drawer */}
        <LorePanel />

        {/* Full Screen Player */}
        <FullScreenPlayer />
      </div>
    </>
  );
}

