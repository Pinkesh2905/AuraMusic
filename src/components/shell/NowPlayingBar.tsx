"use client";

import { Play, SkipBack, SkipForward, Volume2, Mic2, MonitorSpeaker, ListMusic, Maximize2, Shuffle, Repeat } from "lucide-react";

export function NowPlayingBar() {
  return (
    <div className="h-24 w-full flex items-center justify-between px-6 glass border-t border-x-0 border-b-0 relative z-20">
      {/* Progress Bar (absolute top) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-bg-tertiary group cursor-pointer">
        <div className="h-full bg-accent w-1/3 relative group-hover:bg-accent-glow transition-colors">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-1/2 shadow-lg" />
        </div>
      </div>

      {/* Track Info */}
      <div className="flex items-center gap-4 w-[30%] min-w-[180px]">
        <div className="w-14 h-14 rounded-md bg-bg-tertiary relative overflow-hidden group">
          {/* Placeholder for album art */}
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-bg-tertiary" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-text-primary hover:underline cursor-pointer">Placeholder Track</span>
          <span className="text-xs text-text-tertiary hover:underline cursor-pointer">Placeholder Artist</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex flex-col items-center max-w-[40%] w-full">
        <div className="flex items-center gap-6">
          <button className="text-text-tertiary hover:text-text-primary transition-colors">
            <Shuffle className="w-4 h-4" />
          </button>
          <button className="text-text-secondary hover:text-text-primary transition-colors">
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button className="w-8 h-8 rounded-full bg-text-primary text-bg-primary flex items-center justify-center hover:scale-105 transition-transform">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </button>
          <button className="text-text-secondary hover:text-text-primary transition-colors">
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
          <button className="text-text-tertiary hover:text-text-primary transition-colors">
            <Repeat className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 mt-2 w-full max-w-md text-[11px] text-text-tertiary font-medium">
          <span>1:23</span>
          <div className="flex-1" /> {/* Takes up space since progress bar is up top */}
          <span>3:45</span>
        </div>
      </div>

      {/* Extra Controls */}
      <div className="flex items-center justify-end gap-4 w-[30%] min-w-[180px]">
        <button className="text-text-tertiary hover:text-text-primary transition-colors">
          <Mic2 className="w-4 h-4" />
        </button>
        <button className="text-text-tertiary hover:text-text-primary transition-colors">
          <ListMusic className="w-4 h-4" />
        </button>
        <button className="text-text-tertiary hover:text-text-primary transition-colors">
          <MonitorSpeaker className="w-4 h-4" />
        </button>
        
        <div className="flex items-center gap-2 w-24 group cursor-pointer">
          <button className="text-text-tertiary hover:text-text-primary transition-colors">
            <Volume2 className="w-4 h-4" />
          </button>
          <div className="h-1 flex-1 bg-bg-tertiary rounded-full overflow-hidden">
            <div className="h-full bg-text-secondary group-hover:bg-accent transition-colors w-2/3" />
          </div>
        </div>

        <button className="text-text-tertiary hover:text-text-primary transition-colors ml-2">
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
