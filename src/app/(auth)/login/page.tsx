"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { Mail, LogIn } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const handleSpotifyLogin = async () => {
    await signIn("spotify", {
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-[#05030f] overflow-hidden crt-scanlines">
      
      {/* Left Side: The Vibe (Premium Blurred Overlay with Quote) */}
      <div className="relative hidden lg:flex items-center justify-center p-16 overflow-hidden border-r border-cyan-300/15 pixel-grid">
        
        {/* Massive, heavily blurred artist concert photo for moody, atmospheric texture */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000&q=80" 
            alt="Atmospheric music background" 
            className="w-full h-full object-cover opacity-25 blur-[100px] scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#05030f]/95 via-transparent to-[#05030f]/95" />
        </div>

        {/* Soft, glowing atmospheric blurred mesh gradient background */}
        <div className="absolute top-[-20%] left-[-20%] w-[90%] h-[90%] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none" />
        
        {/* Branding Logo inside the Vibe block (Anchor top-left) */}
        <div className="absolute top-14 left-16 z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl y2k-chrome p-1.5">
            <img src="/images/aura_logo.png" className="w-full h-full object-contain" alt="AURA" />
          </div>
          <span className="text-xl font-brush tracking-normal text-white neon-text">AURA</span>
        </div>

        {/* Big Premium Quote Container (Centered perfectly in vertical middle) */}
        <div className="relative z-10 max-w-lg text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            <h1 className="text-5xl font-brush font-black leading-[1.15] text-white tracking-normal neon-text">
              &quot;Music is the shorthand of emotion.&quot;
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <div className="h-[1px] w-8 bg-zinc-600" />
              <p className="text-sm font-mono text-zinc-400">Leo Tolstoy</p>
            </div>
          </motion.div>
        </div>

        {/* Subtle footer (Anchor bottom-left) */}
        <div className="absolute bottom-16 left-16 z-10 text-[10px] font-mono text-zinc-500">
          AUR.26.05 © ALL RIGHTS RESERVED
        </div>
      </div>

      {/* Right Side: The Action (Modern Clean Login Form) */}
      <div className="relative flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12">
        {/* Mobile branding header */}
        <div className="absolute top-8 left-8 lg:hidden flex items-center gap-2.5">
          <img src="/images/aura_logo.png" className="w-8 h-8 object-contain" alt="AURA" />
          <span className="text-lg font-brush tracking-widest text-white">AURA</span>
        </div>

        <div className="w-full max-w-md mx-auto flex flex-col gap-9">
          
          {/* Header Description */}
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl sm:text-4xl font-display font-black tracking-normal text-white leading-none neon-text">
              Step into your Aura
            </h2>
            <p className="text-sm text-zinc-500 font-medium">
              Align your listening identity with real-time AI vibe analysis.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {/* Spotify integration button in flat Spotify Brand Green */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleSpotifyLogin}
              className="w-full flex items-center justify-center gap-3 bg-[#1DB954] hover:bg-[#1ed760] text-black font-extrabold tracking-wide py-4 px-6 rounded-2xl transition-all duration-300 shadow-[0_10px_30px_rgba(29,185,84,0.15)]"
            >
              <svg viewBox="0 0 24 24" className="w-5.5 h-5.5 fill-black">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.84.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              <span>Connect Spotify Account</span>
            </motion.button>

            {/* Premium minimal divider line */}
            <div className="flex items-center gap-4 py-2">
              <div className="flex-grow h-[1px] bg-white/5" />
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Or continue with email</span>
              <div className="flex-grow h-[1px] bg-white/5" />
            </div>

            {/* Borderless charcoal Credentials Form */}
            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500 group-focus-within:text-violet-400 transition-colors" />
                <input 
                  type="email" 
                  placeholder="name@example.com"
                className="w-full y2k-screen text-white rounded-2xl pl-12 pr-4 py-4 text-xs font-mono placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 transition-all"
                />
              </div>
              
              {/* Secondary Button: Premium dark fill with light grey 1px border */}
              <motion.button 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                className="w-full y2k-button text-white font-semibold tracking-wide text-xs py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <LogIn className="w-4 h-4" />
                <span>Continue with Email</span>
              </motion.button>
            </form>
          </div>

          {/* Simple sign up referral */}
          <div className="text-center text-xs text-zinc-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-violet-400 hover:text-white transition-all underline decoration-violet-400/30 underline-offset-4">
              Join Aura
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
