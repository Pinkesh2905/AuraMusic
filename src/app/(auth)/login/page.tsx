"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { Mail, Lock, LogIn } from "lucide-react";

export default function LoginPage() {
  const handleSpotifyLogin = async () => {
    await signIn("spotify", {
      callbackUrl: "/",
      redirect: true,
    });
  };
  return (
    <div className="glass-heavy p-8 rounded-2xl shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold font-display mb-2">Welcome Back</h1>
        <p className="text-sm text-text-secondary">Sign in to sync your mood and music.</p>
      </div>

      <div className="space-y-4">
        {/* Spotify Login Button */}
        <button 
          onClick={handleSpotifyLogin}
          className="w-full flex items-center justify-center gap-3 bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold py-3 px-4 rounded-full transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.84.24 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          Continue with Spotify
        </button>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink-0 mx-4 text-xs text-text-tertiary">or</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        {/* Credentials Form */}
        <form className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
            <input 
              type="email" 
              placeholder="Email address"
              className="w-full bg-bg-tertiary/50 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:bg-bg-tertiary transition-all text-text-primary placeholder:text-text-tertiary"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
            <input 
              type="password" 
              placeholder="Password"
              className="w-full bg-bg-tertiary/50 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:bg-bg-tertiary transition-all text-text-primary placeholder:text-text-tertiary"
            />
          </div>
          <button 
            type="button"
            className="w-full bg-bg-tertiary hover:bg-bg-secondary border border-white/10 text-text-primary font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Sign in with Email
          </button>
        </form>
      </div>

      <div className="mt-8 text-center text-sm text-text-secondary">
        New to Aura? <Link href="/signup" className="text-accent hover:text-accent-glow hover:underline transition-all">Create an account</Link>
      </div>
    </div>
  );
}
