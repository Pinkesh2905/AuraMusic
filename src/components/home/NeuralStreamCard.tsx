"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface NeuralStreamCardProps {
  title: string;
  artist: string;
  image: string;
  uri: string;
  label?: string;
  className?: string;
  onPlay?: (uri: string) => void;
}

export function NeuralStreamCard({ 
  title, 
  artist, 
  image, 
  uri,
  label = "MOOD-LOCKED", 
  className,
  onPlay
}: NeuralStreamCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values for tilt coordinates
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Buttery-smooth spring translations for 3D perspective tilt
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), { stiffness: 120, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), { stiffness: 120, damping: 20 });

  // 3D Parallax offset springs for internal layers
  const bgTranslateX = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { stiffness: 120, damping: 20 });
  const bgTranslateY = useSpring(useTransform(y, [-0.5, 0.5], [-12, 12]), { stiffness: 120, damping: 20 });
  
  const contentTranslateX = useSpring(useTransform(x, [-0.5, 0.5], [10, -10]), { stiffness: 120, damping: 20 });
  const contentTranslateY = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 120, damping: 20 });

  // Handle tracking mouse moves for interactive Spotlight Glow and Border Beams
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Exact pixel offsets for spotlight overlays
    const mouseXpx = e.clientX - rect.left;
    const mouseYpx = e.clientY - rect.top;
    
    cardRef.current.style.setProperty("--mouse-x", `${mouseXpx}px`);
    cardRef.current.style.setProperty("--mouse-y", `${mouseYpx}px`);

    // Normalized bounds (-0.5 to 0.5) for 3D spring tilt values
    const normalizedX = (e.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (e.clientY - rect.top) / rect.height - 0.5;
    
    x.set(normalizedX);
    y.set(normalizedY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onPlay?.(uri)}
      className={cn(
        "neural-card group spotlight-card border-beam relative aspect-[3/4] overflow-hidden cursor-pointer",
        className
      )}
      style={{
        perspective: 1000
      }}
    >
      {/* 3D Parallax Tilt Canvas Container */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        className="w-full h-full relative"
      >
        {/* Layer 1: Background Image with opposing shifting parallax */}
        <motion.div 
          style={{ 
            x: bgTranslateX, 
            y: bgTranslateY,
            scale: 1.1, // slightly scaled up to handle border displacement
            transformStyle: "preserve-3d"
          }}
          className="absolute inset-0"
        >
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
        </motion.div>

        {/* Layer 2: Foreground Content with forward-shifting parallax */}
        <motion.div 
          style={{ 
            x: contentTranslateX, 
            y: contentTranslateY,
            z: 40, // lifts layer in 3D perspective
            transformStyle: "preserve-3d"
          }}
          className="absolute inset-0 p-8 flex flex-col justify-between z-10"
        >
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-white/50 mb-2 block">
              {label}
            </span>
            <h3 className="text-3xl md:text-4xl font-display font-black text-white leading-tight uppercase italic tracking-tighter drop-shadow-md">
              {title}
            </h3>
            <p className="text-xs text-text-secondary font-mono tracking-wider mt-1 opacity-70">
              {artist}
            </p>
          </div>

          <div className="flex items-center gap-4 group/play self-start">
            <motion.div 
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-full neural-glass flex items-center justify-center text-white transition-all duration-300 group-hover/play:bg-white group-hover/play:text-black group-hover/play:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
            >
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </motion.div>
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-white/60 group-hover/play:text-white transition-colors">
              Start Stream
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Dynamic Ambient Color Mesh Overlay on Card Hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-700 bg-gradient-to-br from-primary via-transparent to-secondary pointer-events-none z-20" />
    </div>
  );
}

