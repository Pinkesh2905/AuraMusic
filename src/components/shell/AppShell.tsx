"use client";

import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { NowPlayingBar } from "./NowPlayingBar";
import { FullScreenPlayer } from "./FullScreenPlayer";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-bg-primary text-text-primary relative">
      {/* Ambient background glow (simulating dominant color extraction) */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent-glow blur-[120px] rounded-full opacity-30 pointer-events-none" />
      
      <div className="flex flex-1 overflow-hidden relative z-10">
        <Sidebar />
        
        <main className="flex-1 flex flex-col min-w-0 bg-bg-primary/40 relative">
          <TopBar />
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-6">
            {children}
          </div>
        </main>
      </div>
      
      <NowPlayingBar />
      <FullScreenPlayer />
    </div>
  );
}
