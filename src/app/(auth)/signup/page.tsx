"use client";

import Link from "next/link";
import { User, Mail, Lock, ArrowRight } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="glass-heavy p-8 rounded-2xl shadow-2xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold font-display mb-2">Join Aura</h1>
        <p className="text-sm text-text-secondary">Create an account to start your journey.</p>
      </div>

      <div className="space-y-4">
        {/* Credentials Form */}
        <form className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
            <input 
              type="text" 
              placeholder="Full Name"
              className="w-full bg-bg-tertiary/50 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:bg-bg-tertiary transition-all text-text-primary placeholder:text-text-tertiary"
            />
          </div>
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
              placeholder="Create Password"
              className="w-full bg-bg-tertiary/50 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:bg-bg-tertiary transition-all text-text-primary placeholder:text-text-tertiary"
            />
          </div>
          
          <button 
            type="button"
            className="w-full bg-accent hover:bg-accent-glow text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] mt-2"
          >
            Create Account
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
        
        <p className="text-xs text-center text-text-tertiary mt-4">
          By signing up, you agree to Aura's Terms of Service and Privacy Policy.
        </p>
      </div>

      <div className="mt-8 text-center text-sm text-text-secondary">
        Already have an account? <Link href="/login" className="text-accent hover:text-accent-glow hover:underline transition-all">Sign in</Link>
      </div>
    </div>
  );
}
