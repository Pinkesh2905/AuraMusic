import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Archive, BarChart3, ChevronDown, LogOut, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { usePlayerStore } from "@/stores/playerStore";
import { cn } from "@/lib/utils";

export function TopNav() {
  const { data: session, status } = useSession();
  const { setMoodPromptOpen, isPlaying } = usePlayerStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const navItems = [
    { name: "Discover", href: "/discover" },
    { name: "Your Profile", href: "/dna" },
    { name: "Time Capsules", href: "/capsules" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full h-24 px-4 md:px-8 grid grid-cols-[auto_1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center z-[100] transition-all duration-500",
        scrolled
          ? "bg-[#07031a]/85 backdrop-blur-xl border-b border-cyan-300/20 shadow-[0_18px_44px_rgba(0,0,0,0.42),0_0_28px_rgba(0,245,255,0.08)]"
          : "bg-gradient-to-b from-[#07031a]/85 via-[#07031a]/42 to-transparent backdrop-blur-[3px] border-b border-transparent"
      )}
    >
      <div className="flex items-center gap-2 md:gap-3.5 justify-self-start z-10">
        <div className="relative group shrink-0">
          <div className="w-11 h-11 rounded-2xl y2k-chrome p-1.5 rotate-[-3deg] group-hover:rotate-0 transition-transform">
            <img src="/images/aura_logo.png" className="w-full h-full object-contain" alt="AURA" />
          </div>
          <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b6ff00] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#b6ff00]" />
          </span>
        </div>

        <Link href="/" className="font-brush text-lg md:text-xl text-white hover:opacity-90 transition-opacity font-black tracking-normal flex items-center gap-2 neon-text">
          <span>AURA</span>
          <div className="flex items-end gap-[1.5px] h-3.5 w-6 pt-1.5 overflow-hidden shrink-0" title={isPlaying ? "Music Playing" : "Synced"}>
            <span className={cn("w-[2px] rounded-full bg-[#b6ff00] origin-bottom transition-all duration-300", isPlaying ? "animate-eq-1 h-3" : "h-1.5")} />
            <span className={cn("w-[2px] rounded-full bg-[#00f5ff] origin-bottom transition-all duration-300", isPlaying ? "animate-eq-2 h-3.5" : "h-2.5")} />
            <span className={cn("w-[2px] rounded-full bg-[#ff2bd6] origin-bottom transition-all duration-300", isPlaying ? "animate-eq-3 h-2.5" : "h-1")} />
            <span className={cn("w-[2px] rounded-full bg-[#b6ff00] origin-bottom transition-all duration-300", isPlaying ? "animate-eq-4 h-3" : "h-2")} />
          </div>
        </Link>

        <span className="hidden sm:inline-flex px-2 py-1 rounded-md y2k-screen text-[9px] font-mono font-black tracking-[0.22em] text-cyan-200">
          AURA.EXE
        </span>
      </div>

      <div className="hidden lg:flex items-center gap-3 justify-self-center y2k-panel rounded-full px-3 py-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="px-4 py-2 rounded-full text-[10px] font-mono font-black tracking-[0.2em] uppercase text-white/58 hover:text-[#b6ff00] hover:bg-white/8 hover:scale-[1.02] transition-all duration-300"
          >
            {item.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3 md:gap-6 justify-self-end">
        <div
          onClick={() => setMoodPromptOpen(true)}
          className="cursor-pointer px-4 py-2.5 rounded-full y2k-screen flex items-center gap-3 hover:border-pink-400/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group w-52 sm:w-72"
        >
          <span className="text-[10px] font-mono font-black tracking-[0.18em] uppercase text-cyan-100/65 group-hover:text-white transition-colors truncate flex-1 text-left select-none">
            {status === "authenticated" ? "VIBE SCANNER READY" : "CONNECT SPOTIFY"}
          </span>
          <div className="w-6 h-6 rounded-full y2k-chrome flex items-center justify-center text-violet-950 transition-all shrink-0">
            <Sparkles className="w-3 h-3 text-current" />
          </div>
        </div>

        {status === "authenticated" && (
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-full y2k-panel hover:border-cyan-300/45 active:scale-[0.98] transition-all duration-300 cursor-pointer group shrink-0"
              title={`${session.user?.name || "Profile"} Menu`}
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold text-white overflow-hidden border border-cyan-300/30">
                {session.user?.image ? (
                  <img src={session.user.image} alt={session.user.name || "Profile"} className="w-full h-full object-cover" />
                ) : (
                  session.user?.name?.charAt(0) || "A"
                )}
              </div>
              <span className="hidden md:inline text-[10px] font-mono font-black tracking-[0.18em] text-white/70 group-hover:text-white transition-colors max-w-[100px] truncate uppercase">
                {session.user?.name || "Profile"}
              </span>
              <ChevronDown className={cn("w-3.5 h-3.5 text-white/40 group-hover:text-white/70 transition-transform duration-300 shrink-0", dropdownOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 mt-3 w-72 rounded-[1.6rem] y2k-panel crt-scanlines p-2.5 z-50 overflow-hidden flex flex-col gap-1"
                >
                  <div className="px-3.5 py-3 mb-1 border-b border-cyan-300/10 flex flex-col">
                    <span className="text-[10px] font-black text-[#b6ff00] leading-none font-mono tracking-[0.18em] uppercase">
                      {session.user?.name || "Aura Member"}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 truncate mt-1">
                      {session.user?.email || "aura.listener@spotify.com"}
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
  );
}
