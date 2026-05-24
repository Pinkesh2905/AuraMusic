"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { NowPlayingBar } from "./NowPlayingBar";
import { FullScreenPlayer } from "./FullScreenPlayer";
import { AuraCursor } from "@/components/ui/AuraCursor";

export function AppShell({ children }: { children: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: scrollRef });

  // Physics-based scroll parallax outputs for atmospheric blobs
  const blob1Y = useTransform(scrollY, [0, 1000], [0, 180]);
  const blob2Y = useTransform(scrollY, [0, 1000], [0, -120]);
  const blob3Scale = useTransform(scrollY, [0, 1000], [1, 1.2]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-bg-primary text-text-primary relative">
      {/* Fluid Interactive Custom Cursor */}
      <AuraCursor />

      {/* Multi-layered Scroll Parallax Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Ambient primary magenta glow (top-left) */}
        <motion.div 
          style={{ y: blob1Y }}
          className="absolute top-[-30%] left-[-15%] w-[70%] h-[70%] bg-primary/8 blur-[140px] rounded-full" 
        />
        
        {/* Ambient secondary cyan glow (mid-right) */}
        <motion.div 
          style={{ y: blob2Y }}
          className="absolute top-[30%] right-[-15%] w-[60%] h-[60%] bg-secondary/6 blur-[120px] rounded-full" 
        />
        
        {/* Ambient tertiary violet glow (bottom-left) */}
        <motion.div 
          style={{ scale: blob3Scale }}
          className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-tertiary/8 blur-[130px] rounded-full" 
        />
      </div>
      
      <div className="flex flex-1 overflow-hidden relative z-10">
        <Sidebar />
        
        <main className="flex-1 flex flex-col min-w-0 bg-bg-primary/40 relative">
          <TopBar />
          <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden p-6 relative z-10 scroll-smooth">
            {children}
          </div>
        </main>
      </div>
      
      <NowPlayingBar />
      <FullScreenPlayer />
    </div>
  );
}

