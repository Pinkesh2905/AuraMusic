"use client";

import { ChevronLeft, ChevronRight, Search, Bell } from "lucide-react";
import { useRouter } from "next/navigation";

export function TopBar() {
  const router = useRouter();

  return (
    <header className="h-16 flex items-center justify-between px-6 sticky top-0 z-10 glass border-b border-x-0 border-t-0">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => router.back()} 
            className="w-8 h-8 flex items-center justify-center rounded-full bg-bg-primary/50 text-text-secondary hover:text-text-primary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => router.forward()} 
            className="w-8 h-8 flex items-center justify-center rounded-full bg-bg-primary/50 text-text-secondary hover:text-text-primary transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Placeholder search input */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input 
            type="text" 
            placeholder="Search for music..." 
            className="w-64 pl-9 pr-4 py-1.5 rounded-full bg-bg-tertiary/50 border border-white/5 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent/50 focus:bg-bg-tertiary transition-all"
          />
        </div>
        
        <button className="w-8 h-8 flex items-center justify-center rounded-full text-text-secondary hover:text-text-primary transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent"></span>
        </button>
      </div>
    </header>
  );
}
