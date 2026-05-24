"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function VibeHero() {
  return (
    <section className="relative w-full min-h-[80vh] flex flex-col items-center justify-center pt-20 px-6">
      {/* Background Blobs - Organic shapes from the preview */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] rounded-full bg-white/5 blur-[160px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-[#1A1A28] blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px]" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col gap-12">
        <div className="flex flex-col gap-2">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[12vw] md:text-[8rem] font-display font-black leading-[0.85] tracking-[-0.06em] text-white"
          >
            WHAT IS YOUR
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B0E0E6] via-[#E6E6FA] to-[#FFB6C1]">
              VIBE NOW?
            </span>
          </motion.h1>
        </div>

        {/* Input Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row items-center gap-4 w-full max-w-2xl"
        >
          <div className="relative flex-1 w-full group">
            <input 
              type="text"
              placeholder="'Slow morning in a foggy pine forest'"
              className="w-full bg-white/5 border-b border-white/10 py-4 px-2 text-xl md:text-2xl font-display text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 transition-all"
            />
            <div className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-primary to-secondary w-0 group-focus-within:w-full transition-all duration-700" />
          </div>
          
          <button className="px-8 py-4 rounded-full border border-white/20 text-white font-mono text-sm tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-500 whitespace-nowrap active:scale-95 shadow-2xl">
            GENERATE
          </button>
        </motion.div>
      </div>

      {/* Status Bar - Monospace tracking */}
      <div className="absolute top-8 right-12 hidden md:block">
        <p className="text-[10px] font-mono text-white/40 tracking-[0.4em] uppercase">
          SYNCING // <span className="text-white">98.4%</span>
        </p>
      </div>
    </section>
  );
}
