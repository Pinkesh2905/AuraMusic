"use client";

import { motion } from "framer-motion";

interface SmoothLoaderProps {
  fullScreen?: boolean;
  label?: string;
}

export function SmoothLoader({ fullScreen = false, label = "Tuning Your Aura" }: SmoothLoaderProps) {
  return (
    <div 
      className={`flex flex-col items-center justify-center relative overflow-hidden ${
        fullScreen 
          ? "fixed inset-0 z-[9999] w-screen h-screen bg-background" 
          : "w-full h-full min-h-[300px] rounded-3xl bg-surface/20"
      }`}
    >
      {/* Background ambient light pulses */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[100px] rounded-full animate-pulse pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-48 h-48 bg-secondary/10 blur-[80px] rounded-full animate-pulse pointer-events-none" style={{ animationDelay: "1s" }} />

      <div className="relative flex flex-col items-center gap-8 z-10">
        {/* Kinetic Orbital Ring Container */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Outer revolving orbit */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-dashed border-primary/40 blur-[0.5px]"
          />
          
          {/* Inner contrary orbit */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border border-white/5 shadow-[0_0_15px_rgba(255,45,120,0.1)]"
          />

          {/* Core Soundwave / Equalizer Bars */}
          <div className="flex items-center gap-1.5 h-10 select-none">
            <span className="w-1.5 h-full bg-gradient-to-t from-primary to-tertiary rounded-full origin-bottom scale-y-[0.3] animate-eq-1" />
            <span className="w-1.5 h-full bg-gradient-to-t from-tertiary to-secondary rounded-full origin-bottom scale-y-[0.4] animate-eq-2" />
            <span className="w-1.5 h-full bg-gradient-to-t from-secondary to-primary rounded-full origin-bottom scale-y-[0.2] animate-eq-3" />
            <span className="w-1.5 h-full bg-gradient-to-t from-primary to-secondary rounded-full origin-bottom scale-y-[0.5] animate-eq-4" />
            <span className="w-1.5 h-full bg-gradient-to-t from-secondary to-tertiary rounded-full origin-bottom scale-y-[0.3] animate-eq-2" />
          </div>
        </div>

        {/* Typing Pulse Text */}
        <div className="flex flex-col items-center gap-2">
          <motion.p 
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="text-[11px] font-mono uppercase tracking-[0.4em] text-primary text-center font-black"
          >
            {label}
          </motion.p>
          <motion.span
            initial={{ width: 0 }}
            animate={{ width: 60 }}
            transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            className="h-[1px] bg-gradient-to-r from-transparent via-secondary to-transparent"
          />
        </div>
      </div>
    </div>
  );
}
