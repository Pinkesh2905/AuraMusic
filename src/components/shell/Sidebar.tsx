"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Search, Library, Plus, ListMusic } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Home", href: "/", icon: Home },
  { name: "Discover", href: "/discover", icon: Compass },
  { name: "Search", href: "/search", icon: Search },
  { name: "Library", href: "/library", icon: Library },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-full flex flex-col glass border-r border-y-0 border-l-0">
      <div className="p-6 flex items-center gap-3">
        {/* Aura Logo (Animated Glow) */}
        <div className="w-8 h-8 rounded-full bg-accent animate-glow" />
        <span className="text-xl font-display font-bold tracking-tight text-text-primary">Aura</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        <div className="mb-6 space-y-1">
          <p className="px-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">Menu</p>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-bg-tertiary text-text-primary border-l-2 border-accent" 
                    : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/50"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-accent" : "text-text-tertiary")} />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">Playlists</p>
            <button className="text-text-tertiary hover:text-text-primary transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          {/* Placeholder playlists */}
          {["Late Night Drive", "Focus Flow", "Indie Mix"].map((playlist) => (
            <Link
              key={playlist}
              href={`/playlist/${playlist.toLowerCase().replace(/ /g, "-")}`}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/50 transition-all duration-200"
            >
              <ListMusic className="w-4 h-4 text-text-tertiary" />
              <span className="truncate">{playlist}</span>
            </Link>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-bg-tertiary/50 cursor-pointer transition-colors">
          <div className="w-8 h-8 rounded-full bg-bg-tertiary border border-white/10 flex items-center justify-center overflow-hidden">
            <span className="text-xs font-medium text-text-secondary">U</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">User Name</p>
            <p className="text-xs text-text-tertiary truncate">Free Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
