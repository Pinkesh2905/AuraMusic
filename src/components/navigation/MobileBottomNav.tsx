"use client";

import { Home, Search, Library, User, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Search, label: "Mood", href: "/search" },
  { icon: Zap, label: "Vibe", href: "/discover" },
  { icon: Library, label: "Library", href: "/library" },
  { icon: User, label: "DNA", href: "/dna" },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[400px]">
      <div className="glass-premium crt-scanlines rounded-full px-5 py-3.5 flex items-center justify-between shadow-2xl border-cyan-300/20">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative group p-2.5 rounded-full border transition-all duration-300",
                isActive ? "border-cyan-300/30 bg-cyan-300/10" : "border-transparent"
              )}
            >
              <Icon
                className={cn(
                  "w-6 h-6 transition-all duration-300",
                  isActive 
                    ? "text-[#b6ff00] scale-110 drop-shadow-[0_0_10px_rgba(182,255,0,0.55)]" 
                    : "text-text-secondary group-hover:text-cyan-100"
                )}
              />
              {isActive && (
                <motion.div
                  layoutId="nav-glow"
                  className="absolute inset-0 bg-cyan-300/25 blur-xl rounded-full -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {isActive && (
                <motion.div
                  layoutId="nav-dot"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#ff2bd6] rounded-full bloom-pink"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
