"use client";

import { Home, Search, Zap, Library, BarChart3, Clock } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Mood Hub", href: "/search", icon: Search },
  { label: "Vibe Check", href: "/discover", icon: Zap },
  { label: "Sonic Library", href: "/library", icon: Library },
  { label: "Sonic DNA", href: "/dna", icon: BarChart3 },
  { label: "Time Capsules", href: "/capsules", icon: Clock },
];

export function LeftNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2 y2k-panel rounded-[1.6rem] p-2">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className={cn(
              "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group border border-transparent",
              isActive 
                ? "bg-cyan-300/10 text-white border-cyan-300/25 glow-cyan" 
                : "text-text-secondary hover:text-text-primary hover:bg-white/5 hover:border-white/10"
            )}
          >
            <Icon className={cn(
              "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
              isActive ? "text-[#b6ff00]" : "text-text-tertiary group-hover:text-cyan-200"
            )} />
            <span className={cn(
              "text-[10px] font-mono font-black uppercase tracking-[0.2em]",
              isActive ? "text-white" : ""
            )}>
              {item.label}
            </span>
            
            {isActive && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#ff2bd6] bloom-pink" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
