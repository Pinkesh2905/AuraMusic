"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Archive, BarChart3, ChevronDown, LogOut, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { usePlayerStore } from "@/stores/playerStore";
import { cn } from "@/lib/utils";

// ─── Mobile Bottom Sheet Menu (Portal) ───────────────────────────────────────
function MobileProfileSheet({
  open,
  onClose,
  session,
  onScanVibe,
}: {
  open: boolean;
  onClose: () => void;
  session: any;
  onScanVibe: () => void;
}) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[99990]"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            key="sheet-panel"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            style={{ zIndex: 99991 }}
            className="fixed bottom-0 left-0 right-0 rounded-t-[2rem] bg-[#0a0520]/95 backdrop-blur-2xl border-t border-cyan-300/20 shadow-[0_-20px_60px_rgba(0,0,0,0.7)] overflow-hidden"
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* User info */}
            <div className="px-6 py-4 flex items-center gap-3 border-b border-cyan-300/10">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold text-white overflow-hidden border-2 border-cyan-300/30 shrink-0">
                {session?.user?.image ? (
                  <img src={session.user.image} alt={session.user.name || "Profile"} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg">{session?.user?.name?.charAt(0) || "A"}</span>
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-black text-[#b6ff00] font-mono tracking-widest uppercase truncate">
                  {session?.user?.name || "Aura Member"}
                </span>
                <span className="text-xs font-mono text-zinc-400 truncate">
                  {session?.user?.email || ""}
                </span>
              </div>
              <button onClick={onClose} className="ml-auto p-2 rounded-full hover:bg-white/10 transition-colors">
                <X className="w-4 h-4 text-white/50" />
              </button>
            </div>

            {/* Menu items */}
            <div className="px-4 py-3 flex flex-col gap-1 pb-8">
              <button
                onClick={() => { onClose(); onScanVibe(); }}
                className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-left hover:bg-pink-500/15 active:bg-pink-500/25 text-white/80 hover:text-white transition-all"
              >
                <div className="w-9 h-9 rounded-xl y2k-screen flex items-center justify-center text-pink-300 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold font-display">Scan my Vibe</p>
                  <p className="text-xs font-mono text-zinc-400">Run AI mood reading</p>
                </div>
              </button>

              <Link
                href="/dna"
                onClick={onClose}
                className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-left hover:bg-cyan-500/15 active:bg-cyan-500/25 text-white/80 hover:text-white transition-all"
              >
                <div className="w-9 h-9 rounded-xl y2k-screen flex items-center justify-center text-cyan-300 shrink-0">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold font-display">Listening DNA</p>
                  <p className="text-xs font-mono text-zinc-400">Your visual acoustics</p>
                </div>
              </Link>

              <Link
                href="/capsules"
                onClick={onClose}
                className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-left hover:bg-[#b6ff00]/10 active:bg-[#b6ff00]/15 text-white/80 hover:text-white transition-all"
              >
                <div className="w-9 h-9 rounded-xl y2k-screen flex items-center justify-center text-[#b6ff00] shrink-0">
                  <Archive className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold font-display">Vibe Capsules</p>
                  <p className="text-xs font-mono text-zinc-400">Past mood records</p>
                </div>
              </Link>

              <div className="h-[1px] bg-cyan-300/10 my-1 mx-2" />

              <button
                onClick={() => { onClose(); signOut(); }}
                className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-left text-rose-400/80 hover:bg-rose-500/10 active:bg-rose-500/15 hover:text-rose-300 transition-all"
              >
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 shrink-0">
                  <LogOut className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold font-display">Sign Out</p>
                  <p className="text-xs font-mono text-rose-500/50">End current session</p>
                </div>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

// ─── TopNav Component ────────────────────────────────────────────────────────
export function TopNav() {
  const { data: session, status } = useSession();
  const { setMoodPromptOpen, isPlaying } = usePlayerStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAvatarClick = () => {
    if (isMobile) {
      setMobileSheetOpen(true);
    } else {
      setDropdownOpen(!dropdownOpen);
    }
  };

  return (
    <>
      {/* Mobile Bottom Sheet (portal) */}
      {status === "authenticated" && (
        <MobileProfileSheet
          open={mobileSheetOpen}
          onClose={() => setMobileSheetOpen(false)}
          session={session}
          onScanVibe={() => setMoodPromptOpen(true)}
        />
      )}

      <nav
        className={cn(
          "fixed top-0 left-0 w-full h-24 px-4 md:px-8 grid grid-cols-[auto_1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center z-[100] transition-all duration-500",
          scrolled
            ? "bg-[#07031a]/95 backdrop-blur-xl border-b border-pink-500/20 shadow-[0_18px_44px_rgba(0,0,0,0.6),0_0_28px_rgba(255,43,214,0.08)]"
            : "bg-gradient-to-b from-[#07031a]/90 via-[#07031a]/40 to-transparent backdrop-blur-[2px] border-b border-transparent"
        )}
      >
        <div className="flex items-center gap-2 md:gap-3.5 justify-self-start z-10">
          <div className="relative flex items-center group cursor-pointer select-none">
            {/* Spinning orbit ring going around AURA brand */}
            <div className="absolute inset-x-[-15px] inset-y-[-8px] rounded-full border border-pink-500/80 animate-spin-slow opacity-85 shadow-[0_0_15px_rgba(255,43,214,0.6)]" style={{ transform: "rotateX(72deg) rotate(15deg)", animationDuration: "12s" }} />
            <div className="absolute top-[-6px] left-[-6px] text-pink-400 text-xs animate-pulse">✦</div>
            <div className="absolute bottom-[-6px] right-[-6px] text-pink-400 text-xs animate-pulse" style={{ animationDelay: "1s" }}>✦</div>
            <Link href="/" className="font-brush text-2xl md:text-3xl text-white font-black tracking-[0.1em] italic select-none filter drop-shadow-[0_0_10px_rgba(255,43,214,0.85)] hover:scale-103 transition-transform">
              AURA
            </Link>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 justify-self-center bg-[#130d2a]/60 border border-white/5 rounded-full px-2 py-1.5 backdrop-blur-md">
          {[
            { name: "HOME", href: "/", active: true },
            { name: "DISCOVER", href: "/discover", active: false },
            { name: "FOR YOU", href: "/discover", active: false },
            { name: "TIME CAPSULE", href: "/capsules", active: false },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "px-5 py-2 rounded-full text-[10px] font-mono font-black tracking-[0.2em] transition-all duration-300",
                item.active
                  ? "bg-gradient-to-r from-purple-950/60 to-pink-950/60 border border-pink-500/30 text-pink-300 shadow-[0_0_15px_rgba(255,43,214,0.25)]"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3 md:gap-4 justify-self-end">
          {/* Feeling good heartbeat waveform status */}
          <div
            onClick={() => setMoodPromptOpen(true)}
            className="cursor-pointer px-4.5 py-2.5 rounded-full bg-[#181135]/50 border border-pink-500/20 hover:border-pink-500/40 flex items-center gap-3 transition-all duration-300 group shrink-0"
          >
            <div className="flex items-end gap-[2px] h-3 w-7 pt-1 overflow-hidden" title="Feeling Good">
              <span className="w-[1.5px] h-2 rounded-full bg-pink-500 animate-eq-1" />
              <span className="w-[1.5px] h-3 rounded-full bg-pink-400 animate-eq-2" />
              <span className="w-[1.5px] h-1.5 rounded-full bg-pink-500 animate-eq-3" />
              <span className="w-[1.5px] h-2.5 rounded-full bg-pink-400 animate-eq-4" />
            </div>
            <span className="text-[9px] font-mono font-black tracking-[0.16em] uppercase text-pink-300 select-none flex items-center gap-1.5">
              FEELING GOOD <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block shadow-[0_0_8px_#4ade80]" />
            </span>
          </div>

          {status === "authenticated" && (
            <div className="relative shrink-0" ref={dropdownRef}>
              <button
                onClick={handleAvatarClick}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#181135]/50 border border-white/5 hover:border-cyan-300/30 active:scale-[0.98] transition-all duration-300 cursor-pointer group shrink-0"
                title={`${session.user?.name || "Profile"} Menu`}
              >
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold text-white overflow-hidden border border-white/10 shrink-0">
                  {session.user?.image ? (
                    <img src={session.user.image} alt={session.user.name || "Profile"} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs uppercase">{session.user?.name?.charAt(0) || "P"}</span>
                  )}
                </div>
                <span className="hidden md:inline text-[9px] font-mono font-black tracking-[0.16em] text-zinc-300 group-hover:text-white transition-colors max-w-[100px] truncate uppercase">
                  {session.user?.name ? session.user.name.toUpperCase() : "PINKESH"}
                </span>
                <ChevronDown className={cn("w-3 h-3 text-zinc-400 group-hover:text-white transition-transform duration-300 shrink-0", dropdownOpen && "rotate-180")} />
              </button>

              {/* Desktop-only dropdown */}
              <AnimatePresence>
                {dropdownOpen && !isMobile && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-72 rounded-[1.6rem] y2k-panel crt-scanlines p-2.5 z-50 overflow-hidden flex flex-col gap-1"
                  >
                    <div className="px-3.5 py-3 mb-1 border-b border-cyan-300/10 flex flex-col">
                      <span className="text-[10px] font-black text-[#b6ff00] leading-none font-mono tracking-[0.18em] uppercase">
                        {session.user?.name ? session.user.name.toUpperCase() : "PINKESH"}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 truncate mt-1">
                        {session.user?.email || "pinkesh.aura@spotify.com"}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        setMoodPromptOpen(true);
                      }}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-left hover:bg-pink-500/15 hover:text-white text-white/70 transition-all group/item"
                    >
                      <div className="w-7 h-7 rounded-xl y2k-screen flex items-center justify-center text-pink-300 transition-colors shrink-0">
                        <Sparkles className="w-3.5 h-3.5 text-current" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold font-display">Scan my Vibe</span>
                        <span className="text-[9px] font-mono text-zinc-400 group-hover/item:text-zinc-300">Run AI mood reading</span>
                      </div>
                    </button>

                    <Link
                      href="/dna"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-left hover:bg-cyan-500/15 hover:text-white text-white/70 transition-all group/item"
                    >
                      <div className="w-7 h-7 rounded-xl y2k-screen flex items-center justify-center text-cyan-300 transition-colors shrink-0">
                        <BarChart3 className="w-3.5 h-3.5 text-current" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold font-display">Listening DNA</span>
                        <span className="text-[9px] font-mono text-zinc-400 group-hover/item:text-zinc-300">Your visual acoustics</span>
                      </div>
                    </Link>

                    <Link
                      href="/capsules"
                      onClick={() => setDropdownOpen(false)}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-left hover:bg-[#b6ff00]/10 hover:text-white text-white/70 transition-all group/item"
                    >
                      <div className="w-7 h-7 rounded-xl y2k-screen flex items-center justify-center text-[#b6ff00] transition-colors shrink-0">
                        <Archive className="w-3.5 h-3.5 text-current" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold font-display">Vibe Capsules</span>
                        <span className="text-[9px] font-mono text-zinc-400 group-hover/item:text-zinc-300">Past mood records</span>
                      </div>
                    </Link>

                    <div className="h-[1px] bg-cyan-300/10 my-1" />

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-left text-rose-400/80 hover:bg-rose-500/10 hover:text-rose-300 transition-all group/item"
                    >
                      <div className="w-7 h-7 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 group-hover/item:bg-rose-500/20 transition-colors shrink-0">
                        <LogOut className="w-3.5 h-3.5 text-current" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold font-display">Sign Out</span>
                        <span className="text-[9px] font-mono text-rose-500/50 group-hover/item:text-rose-400/70">End current session</span>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
