"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePlayerStore } from "@/stores/playerStore";

interface VinylRecordProps {
  isPlaying?: boolean;
  image?: string | null;
  className?: string;
  size?: number;
}

export function VinylRecord({ 
  isPlaying: isPlayingProp, 
  image, 
  className,
  size = 400 
}: VinylRecordProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const armRef = useRef<HTMLDivElement>(null);

  // Read play state and controls from playerStore
  const { isPlaying, pause, resume, sdk } = usePlayerStore();

  // Mouse coordinate motion values for 3D Tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for 3D tilting (perspective rotation)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), { stiffness: 100, damping: 22 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { stiffness: 100, damping: 22 });

  // Tactile Drag States and Motion Values
  const [isDragging, setIsDragging] = useState(false);
  const PLAY_ANGLE = -12;
  const REST_ANGLE = -36;
  const SNAP_THRESHOLD = -24;

  const dragRotation = useMotionValue(isPlaying ? PLAY_ANGLE : REST_ANGLE);
  const armRotationSpring = useSpring(dragRotation, { stiffness: 90, damping: 18 });

  // Sync automatic rotation with external player state changes
  useEffect(() => {
    if (isDragging) return;
    dragRotation.set(isPlaying ? PLAY_ANGLE : REST_ANGLE);
  }, [isPlaying, isDragging, dragRotation]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isDragging) return;
    const rect = containerRef.current.getBoundingClientRect();
    // Normalized coordinates from -0.5 to 0.5
    const relativeX = (e.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(relativeX);
    y.set(relativeY);
  };

  const handleMouseLeave = () => {
    if (isDragging) return;
    x.set(0);
    y.set(0);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    
    // Pivot center coordinates mathematically calculated relative to percentage styling
    const pivotX = rect.right - (rect.width * 0.14 + 15.4);
    const pivotY = rect.top + (rect.height * 0.16 + 3);
    
    // Vector from pivot to cursor pointer
    const dx = e.clientX - pivotX;
    const dy = e.clientY - pivotY;
    
    // Arc tangent angle
    const angleRad = Math.atan2(dy, dx);
    let angleDeg = angleRad * (180 / Math.PI);
    
    // Normalize around horizontal left axis (180 degrees)
    let relativeAngle = angleDeg - 180;
    while (relativeAngle < -180) relativeAngle += 360;
    while (relativeAngle > 180) relativeAngle -= 360;
    
    // Clamp to realistic swing constraints (-45 rest boundary, 5 deep groove play boundary)
    const constrainedAngle = Math.max(-45, Math.min(5, relativeAngle));
    dragRotation.set(constrainedAngle);
  };

  const handlePointerUp = async (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);
    
    const currentAngle = dragRotation.get();
    
    if (currentAngle > SNAP_THRESHOLD) {
      // Snap onto vinyl and start playback
      dragRotation.set(PLAY_ANGLE);
      if (!isPlaying) {
        resume();
        if (sdk) await sdk.resume();
      }
    } else {
      // Snap onto rest post and pause playback
      dragRotation.set(REST_ANGLE);
      if (isPlaying) {
        pause();
        if (sdk) await sdk.pause();
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("relative flex items-center justify-center select-none", className)}
      style={{ 
        width: size, 
        height: size,
        perspective: 1200
      }}
    >
      {/* Platter and Grooved Disc wrapper - scaled to 82% and shifted down to create top space */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[82%] h-[82%] flex items-center justify-center z-10">
        
        {/* Dynamic Aura Ripple Ring (Equalizer progress effect) */}
        <motion.div 
          className="absolute inset-0 rounded-full border-2 border-primary/50 blur-md pointer-events-none"
          animate={{ 
            scale: isPlaying ? [1, 1.06, 1.01, 1.08, 1] : 1,
            opacity: isPlaying ? [0.3, 0.8, 0.5, 0.9, 0.3] : 0.3,
            borderColor: isPlaying 
              ? ["rgba(255, 45, 120, 0.5)", "rgba(0, 245, 255, 0.6)", "rgba(179, 71, 255, 0.5)", "rgba(255, 45, 120, 0.5)"] 
              : "rgba(255, 45, 120, 0.3)"
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />

        {/* Tertiary outer sound wave expansion */}
        {isPlaying && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0.8 }}
            animate={{ scale: 1.25, opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border border-secondary/30 blur-sm pointer-events-none"
          />
        )}
        
        {/* Outer ambient glow */}
        <div className="absolute inset-4 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        {/* 3D Tilted Interactive Vinyl Disc Wrapper */}
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d"
          }}
          transition={{ type: "spring", stiffness: 100, damping: 22 }}
          className="relative w-[96%] h-[96%] rounded-full shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] flex items-center justify-center"
        >
          {/* The Grooved Rotating Disc */}
          <motion.div
            className="absolute inset-0 rounded-full vinyl-grooves overflow-hidden flex items-center justify-center"
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ 
              duration: 3.5, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            {/* Grooves and Conic Specular Highlight Refraction */}
            <div className="absolute inset-0 vinyl-lighting opacity-60" />
            
            {/* Center Record Label */}
            <div className="relative w-[32%] h-[32%] rounded-full bg-surface-cream shadow-[inset_0_4px_12px_rgba(0,0,0,0.6)] flex items-center justify-center overflow-hidden border-[6px] vinyl-label-border">
              {image ? (
                <img 
                  src={image} 
                  alt="Album Art" 
                  className="w-full h-full object-cover opacity-85 mix-blend-multiply"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30" />
              )}
              
              {/* Center Spindle Hole */}
              <div className="absolute w-5 h-5 rounded-full bg-background shadow-[inset_0_3px_6px_rgba(0,0,0,0.8)] border border-white/20" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Silver Circular Pivot Joint Base (Fixed to Turntable Plinth, underneath originX: 0.92) */}
      <div 
        style={{
          right: "calc(14% + 15.4px)",
          top: "calc(16% + 3px)",
          transform: "translate(50%, -50%)"
        }}
        className="absolute w-9 h-9 rounded-full bg-gradient-to-b from-zinc-500 via-zinc-700 to-black border border-white/10 shadow-2xl flex items-center justify-center z-15 pointer-events-none"
      >
        <div className="w-[18px] h-[18px] rounded-full bg-gradient-to-r from-zinc-400 to-zinc-600 border border-white/20 shadow-inner flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
        </div>
      </div>

      {/* High-Fidelity Tactile Draggable Stylus/Needle Arm (Pivots around originX: 0.92) */}
      <motion.div 
        ref={armRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ 
          rotate: armRotationSpring,
          originX: 0.92, 
          originY: 0.5 
        }}
        className={cn(
          "absolute right-[14%] top-[16%] w-48 h-[6px] bg-gradient-to-r from-zinc-900 to-zinc-700 rounded-full shadow-2xl z-20 touch-none transition-shadow",
          isDragging ? "cursor-grabbing shadow-[0_15px_30px_rgba(0,0,0,0.6)]" : "cursor-grab shadow-[0_5px_15px_rgba(0,0,0,0.4)]"
        )}
      >
        {/* Counterweight cylinder (short end sticking past pivot base, moves with rotation) */}
        <div className="absolute -right-5 top-1/2 -translate-y-1/2 w-5 h-5 bg-gradient-to-b from-zinc-500 via-zinc-700 to-zinc-900 rounded-sm border border-zinc-600 shadow-md flex items-center justify-center">
          <div className="w-1 h-full bg-zinc-950 opacity-60" />
        </div>

        {/* Audio Cartridge Headshell & Stylus Needle (Located at left end, angles inwards) */}
        <div className="absolute -left-6 -top-[9px] w-7 h-[24px] bg-gradient-to-bl from-zinc-800 to-black rounded-sm border-r border-zinc-600 shadow-lg transform rotate-[-20deg] flex flex-col justify-between p-1 select-none pointer-events-none">
          {/* Active play indicator: glowing laser tracking LED */}
          <span 
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-all duration-300 self-end", 
              isPlaying 
                ? "bg-secondary shadow-[0_0_8px_var(--color-secondary)] animate-pulse" 
                : "bg-zinc-700"
            )} 
          />
          {/* Tiny metallic stylus needle tip */}
          <div className="w-1.5 h-2 bg-zinc-400 rounded-full transform rotate-[-45deg] translate-y-1" />
        </div>
      </motion.div>
    </div>
  );
}
