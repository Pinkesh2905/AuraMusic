"use client";

import { motion } from "framer-motion";
import { Flame, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakHUDProps {
  streak: number;
  energy: number;
  className?: string;
}

export function StreakHUD({ streak, energy, className }: StreakHUDProps) {
  return (
    <motion.div 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        "glass-premium rounded-2xl px-6 py-3 flex items-center gap-8 shadow-2xl border-white/10",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Flame className="w-4 h-4 text-primary" />
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-text-tertiary leading-none">Streak</span>
          <span className="text-sm font-black tracking-wider text-text-primary">{streak} Days</span>
        </div>
      </div>

      <div className="w-[1px] h-6 bg-white/10" />

      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-secondary" />
        <div className="flex flex-col">
          <span className="text-[10px] font-mono text-text-tertiary leading-none">Energy</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black tracking-wider text-text-primary">{energy}%</span>
            <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-secondary shadow-[0_0_10px_rgba(0,245,255,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${energy}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
