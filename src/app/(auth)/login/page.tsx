"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { Mail, LogIn } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const SparkleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={cn("w-6 h-6 fill-[#ff55df] specular-sparkle", className)}>
    <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z" />
  </svg>
);

const Y2KBadge = () => (
  <div className="y2k-oval-badge px-4 py-1.5 rounded-full flex items-center justify-center border border-[#00f5ff]/45 absolute top-10 right-10 z-20 pointer-events-none select-none">
    <span className="text-[11px] font-display font-black uppercase text-black tracking-widest italic select-none">Y2K</span>
  </div>
);

const DiscoBall = () => (
  <div className="absolute top-8 left-8 z-20 w-24 h-24 md:w-36 md:h-36 pointer-events-none select-none">
    <div className="absolute inset-0 bg-[#ff2bd6]/15 rounded-full blur-[20px]" />
    <motion.svg 
      animate={{ rotate: 360 }}
      transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      viewBox="0 0 100 100" 
      className="w-full h-full drop-shadow-[0_0_15px_rgba(255,43,214,0.45)]"
    >
      <circle cx="50" cy="50" r="45" fill="url(#disco-chrome)" stroke="#ff2bd6" strokeWidth="1" />
      <path d="M50 5 A45 45 0 0 0 50 95" fill="none" stroke="rgba(255, 43, 214, 0.45)" strokeWidth="0.5" />
      <path d="M50 5 A25 45 0 0 0 50 95" fill="none" stroke="rgba(255, 43, 214, 0.35)" strokeWidth="0.5" />
      <path d="M50 5 A10 45 0 0 0 50 95" fill="none" stroke="rgba(255, 43, 214, 0.25)" strokeWidth="0.5" />
      <path d="M50 5 A10 45 0 0 1 50 95" fill="none" stroke="rgba(255, 43, 214, 0.25)" strokeWidth="0.5" />
      <path d="M50 5 A25 45 0 0 1 50 95" fill="none" stroke="rgba(255, 43, 214, 0.35)" strokeWidth="0.5" />
      <path d="M50 5 A45 45 0 0 1 50 95" fill="none" stroke="rgba(255, 43, 214, 0.45)" strokeWidth="0.5" />
      <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(255, 43, 214, 0.45)" strokeWidth="0.5" />
      <line x1="8" y1="35" x2="92" y2="35" stroke="rgba(255, 43, 214, 0.35)" strokeWidth="0.5" />
      <line x1="16" y1="20" x2="84" y2="20" stroke="rgba(255, 43, 214, 0.25)" strokeWidth="0.5" />
      <line x1="8" y1="65" x2="92" y2="65" stroke="rgba(255, 43, 214, 0.35)" strokeWidth="0.5" />
      <line x1="16" y1="80" x2="84" y2="80" stroke="rgba(255, 43, 214, 0.25)" strokeWidth="0.5" />
      <circle cx="35" cy="35" r="12" fill="white" opacity="0.35" filter="blur(2px)" />
      <defs>
        <radialGradient id="disco-chrome" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#b7b8ff" />
          <stop offset="70%" stopColor="#25124b" />
          <stop offset="100%" stopColor="#ff2bd6" />
        </radialGradient>
      </defs>
    </motion.svg>
  </div>
);

const FloatingHeadphones = () => (
  <div className="absolute bottom-16 left-6 md:bottom-28 md:left-24 z-10 w-24 h-24 md:w-44 md:h-44 pointer-events-none select-none animate-float-headphones hidden sm:block">
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.7)]">
      <defs>
        <linearGradient id="headphone-chrome" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#94a3b8" />
          <stop offset="50%" stopColor="#1e293b" />
          <stop offset="60%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#090624" />
        </linearGradient>
      </defs>
      <path d="M15 55A35 35 0 0 1 85 55" fill="none" stroke="url(#headphone-chrome)" strokeWidth="9" strokeLinecap="round" />
      <path d="M15 55A35 35 0 0 1 85 55" fill="none" stroke="#ff2bd6" strokeWidth="1" strokeLinecap="round" strokeDasharray="3,3" opacity="0.8" />
      <rect x="8" y="46" width="14" height="26" rx="7" fill="url(#headphone-chrome)" stroke="#ff2bd6" strokeWidth="1" />
      <circle cx="15" cy="59" r="4" fill="#ff2bd6" />
      <rect x="78" y="46" width="14" height="26" rx="7" fill="url(#headphone-chrome)" stroke="#ff2bd6" strokeWidth="1" />
      <circle cx="85" cy="59" r="4" fill="#ff2bd6" />
      <path d="M15 50L16.2 53.6L20 54.5L16.2 55.4L15 59L13.8 55.4L10 54.5L13.8 53.6Z" fill="#ff55df" />
      <path d="M85 50L86.2 53.6L90 54.5L86.2 55.4L85 59L83.8 55.4L80 54.5L83.8 53.6Z" fill="#ff55df" />
    </svg>
  </div>
);

const FloatingSpeaker = () => (
  <div className="absolute bottom-16 right-6 md:bottom-28 md:right-24 z-10 w-24 h-28 md:w-40 md:h-48 pointer-events-none select-none animate-pulse-speaker hidden sm:block">
    <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.7)]">
      <defs>
        <linearGradient id="speaker-chrome" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="45%" stopColor="#64748b" />
          <stop offset="55%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#ff2bd6" />
        </linearGradient>
      </defs>
      <rect x="10" y="10" width="80" height="100" rx="10" fill="#0c0721" stroke="url(#speaker-chrome)" strokeWidth="3" />
      <rect x="10" y="10" width="80" height="100" rx="10" fill="none" stroke="#ff2bd6" strokeWidth="1" opacity="0.6" />
      <circle cx="50" cy="38" r="15" fill="#090624" stroke="url(#speaker-chrome)" strokeWidth="1.5" />
      <circle cx="50" cy="38" r="6" fill="#ff2bd6" />
      <circle cx="50" cy="78" r="24" fill="#090624" stroke="url(#speaker-chrome)" strokeWidth="2" />
      <motion.circle 
        animate={{ scale: [1, 1.06, 0.98, 1.03, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        cx="50" cy="78" r="16" fill="url(#speaker-chrome)" 
      />
      <circle cx="50" cy="78" r="6" fill="#ff55df" />
    </svg>
  </div>
);

const TurntableDeck = () => (
  <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] absolute -bottom-24 md:-bottom-48 left-1/2 -translate-x-1/2 z-0 opacity-45 pointer-events-none select-none">
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="w-full h-full rounded-full bg-[#05030f] border border-pink-500/35 relative vinyl-grooves overflow-hidden flex items-center justify-center"
    >
      <div className="w-[85px] h-[85px] md:w-[140px] md:h-[140px] rounded-full border border-pink-500/25 bg-gradient-to-tr from-pink-500 via-[#101033] to-[#00f5ff] flex items-center justify-center">
        <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-[#05030f] flex items-center justify-center border border-white/5">
          <div className="w-2.5 h-2.5 md:w-4.5 md:h-4.5 rounded-full bg-white/20" />
        </div>
      </div>
      <div className="absolute inset-0 vinyl-lighting rounded-full" />
    </motion.div>
  </div>
);

const TwinklingStars = () => (
  <div className="absolute inset-0 pointer-events-none z-0">
    <div className="absolute top-[20%] right-[25%] animate-twinkle">
      <SparkleIcon className="w-5 h-5" />
    </div>
    <div className="absolute top-[45%] left-[20%] animate-twinkle" style={{ animationDelay: "500ms" }}>
      <SparkleIcon className="w-4 h-4 text-cyan-300" />
    </div>
    <div className="absolute bottom-[40%] right-[15%] animate-twinkle" style={{ animationDelay: "1000ms" }}>
      <SparkleIcon className="w-5 h-5 text-pink-400" />
    </div>
    <div className="absolute top-[12%] right-[10%] animate-twinkle" style={{ animationDelay: "1500ms" }}>
      <SparkleIcon className="w-6 h-6 text-white" />
    </div>
    <div className="absolute bottom-[30%] left-[10%] animate-twinkle" style={{ animationDelay: "2000ms" }}>
      <SparkleIcon className="w-4 h-4" />
    </div>
  </div>
);

export default function LoginPage() {
  const handleSpotifyLogin = async () => {
    await signIn("spotify", {
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#05030f] relative overflow-hidden p-6 crt-scanlines">
      {/* Deep starry background with retro grid mask */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_30%_30%,#ff2bd6_0%,transparent_60%),radial-gradient(circle_at_70%_70%,#00f5ff_0%,transparent_60%)] z-0" />
      <div className="absolute inset-0 pixel-grid opacity-[0.03] z-0 pointer-events-none" />

      {/* Floating assets */}
      <Y2KBadge />
      <DiscoBall />
      <TwinklingStars />

      {/* Header Chrome Text */}
      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center select-none text-center pointer-events-none mt-4 md:mt-8 animate-float-gentle"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="absolute text-[3.5rem] md:text-[7rem] font-black tracking-widest text-[#ff2bd6] opacity-35 blur-[25px] font-brush leading-none select-none">
          AURA
        </div>
        <h1 className="text-[3.5rem] md:text-[7rem] font-black tracking-widest y2k-chrome-giant-text font-brush leading-none z-10 select-none">
          AURA
        </h1>
        <span className="signature-pink text-xl md:text-3xl mt-1 select-none">
          Cooked By Pinkesh
        </span>
      </motion.div>

      {/* Interactive Y2K Glass Login Console */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="relative z-20 w-full max-w-md mx-auto mt-8 rounded-[2.5rem] border border-white/10 bg-[#090624]/60 backdrop-blur-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-[0_30px_70px_rgba(0,0,0,0.85)] border-beam"
      >
        <div className="flex flex-col gap-1.5 text-center sm:text-left select-none">
          <h2 className="text-xl sm:text-2xl font-mono font-black text-white leading-none tracking-wider uppercase">
            Control Console
          </h2>
          <p className="text-[10px] sm:text-xs text-zinc-500 font-mono tracking-wide">
            ALIGN YOUR SONIC IDENTITY WITH AURA INTEL.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {/* Spotify Direct Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleSpotifyLogin}
            className="w-full flex items-center justify-center gap-3 bg-[#1DB954] hover:bg-[#1ed760] text-black font-extrabold tracking-widest text-[10px] sm:text-xs py-4 px-6 rounded-2xl transition-all duration-300 shadow-[0_10px_30px_rgba(29,185,84,0.2)] uppercase cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-black">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.84.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <span>Connect Spotify</span>
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-4 py-1 select-none">
            <div className="flex-grow h-[1px] bg-white/5" />
            <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">Or credentials</span>
            <div className="flex-grow h-[1px] bg-white/5" />
          </div>

          {/* Email credentials form */}
          <form className="flex flex-col gap-4.5" onSubmit={(e) => e.preventDefault()}>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-pink-400 transition-colors" />
              <input 
                type="email" 
                placeholder="NAME@EXAMPLE.COM"
                className="w-full y2k-screen text-white rounded-2xl pl-12 pr-4 py-4 text-[10px] font-mono placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-pink-400/35 transition-all uppercase"
              />
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="button"
              className="w-full y2k-button text-white font-black tracking-widest text-[10px] py-4 rounded-2xl flex items-center justify-center gap-2 border border-white/5 uppercase cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Continue with Email</span>
            </motion.button>
          </form>
        </div>

        {/* Link back and referral */}
        <div className="flex flex-col gap-2 items-center text-center mt-2 border-t border-white/5 pt-4 select-none">
          <div className="text-[10px] text-zinc-500 font-mono">
            DON&apos;T HAVE AN ACCOUNT?{" "}
            <Link href="/signup" className="text-[#ff55df] hover:underline tracking-wider">
              JOIN AURA
            </Link>
          </div>
          <Link href="/" className="text-[9px] text-zinc-600 hover:text-white font-mono uppercase tracking-widest transition-colors mt-1">
            ← BACK TO SPLASH
          </Link>
        </div>
      </motion.div>

      {/* Decorative headphones/speaker backgrounds */}
      <FloatingHeadphones />
      <FloatingSpeaker />
      <TurntableDeck />

      {/* Bottom spacer */}
      <div className="h-10 w-full" />
    </div>
  );
}
