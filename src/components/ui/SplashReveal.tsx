"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
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

interface SplashRevealProps {
  onComplete: () => void;
}

export function SplashReveal({ onComplete }: SplashRevealProps) {
  const [audioError, setAudioError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Dolby Sound Web Audio API Synthesizer
  const playDolbyWhisper = async () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      
      const ctx = new AudioContextClass();
      
      // Resume context if suspended (browser autoplay restrictions)
      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      // 1. CINEMATIC SUB-BASS RUMBLE (Dolby Style)
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = "sine";
      // Sweep from a deep sub-audible 28Hz up to 70Hz
      subOsc.frequency.setValueAtTime(28, ctx.currentTime);
      subOsc.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 3.2);
      
      subGain.gain.setValueAtTime(0.001, ctx.currentTime);
      subGain.gain.linearRampToValueAtTime(0.85, ctx.currentTime + 0.8);
      subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.5);
      
      subOsc.connect(subGain);
      subGain.connect(ctx.destination);

      // 2. BREATHY SPATIAL WHISPER SWELL (White Noise Formant Synthesis)
      const bufferSize = ctx.sampleRate * 4; // 4 seconds buffer
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      // Fill buffer with white noise
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;

      // Resonant bandpass filter to shape the white noise into a "breath/whisper" formant
      const resonantFilter = ctx.createBiquadFilter();
      resonantFilter.type = "bandpass";
      resonantFilter.Q.setValueAtTime(9, ctx.currentTime);
      
      // Sweep the filter frequency to create the vocal vowel "Auuuraaaah"
      resonantFilter.frequency.setValueAtTime(950, ctx.currentTime);
      resonantFilter.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + 1.2);
      resonantFilter.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 2.5);
      resonantFilter.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + 3.8);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, ctx.currentTime);
      noiseGain.gain.linearRampToValueAtTime(0.38, ctx.currentTime + 0.6);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.8);

      // Dolby Spatial Stereo Pan (Sweep from extreme Left to extreme Right)
      const spatialPanner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      
      if (spatialPanner) {
        spatialPanner.pan.setValueAtTime(-1, ctx.currentTime);
        spatialPanner.pan.linearRampToValueAtTime(1, ctx.currentTime + 3.0);
        
        noiseSource.connect(resonantFilter);
        resonantFilter.connect(noiseGain);
        noiseGain.connect(spatialPanner);
        spatialPanner.connect(ctx.destination);
      } else {
        noiseSource.connect(resonantFilter);
        resonantFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
      }

      // Start Synthesizer Nodes
      subOsc.start();
      noiseSource.start();

      // 3. SYNTHETIC TEXT-TO-SPEECH WHISPER OVERLAY ("Aura")
      setTimeout(() => {
        if (typeof window !== "undefined" && window.speechSynthesis) {
          window.speechSynthesis.cancel(); // Reset active queue
          
          const textToSpeak = "Aura";
          const utterance = new SpeechSynthesisUtterance(textToSpeak);
          utterance.volume = 0.8;
          utterance.rate = 0.55;  // Slow, atmospheric speech
          utterance.pitch = 0.40; // Deep, mysterious breathy tone

          // Try to select a high-fidelity natural English voice if available
          const voices = window.speechSynthesis.getVoices();
          const premiumVoice = voices.find(
            v => v.lang.startsWith("en") && 
            (v.name.toLowerCase().includes("natural") || 
             v.name.toLowerCase().includes("google") || 
             v.name.toLowerCase().includes("microsoft"))
          );
          if (premiumVoice) {
            utterance.voice = premiumVoice;
          }
          
          window.speechSynthesis.speak(utterance);
        }
      }, 550); // Aligns precisely with the peak sweep of the white noise formant filter

    } catch (e) {
      console.warn("Audio synthesis initialization failed ( autoplay restricted):", e);
      setAudioError(true);
    }
  };

  // Launch automatic flow on mount
  useEffect(() => {
    // 1. Play Dolby whisper audio (handling browser blocks gracefully)
    const audioTimer = setTimeout(() => {
      playDolbyWhisper();
    }, 400);

    // 2. Trigger automatic screen completion reveal after 4 seconds
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4000);

    // 3. Setup canvas particle background animation
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    // Elegant glowing dust particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;
      fadeSpeed: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 3 + 1.2;
        this.speedX = (Math.random() - 0.5) * 0.45;
        this.speedY = (Math.random() - 0.5) * 0.45;
        
        // Neo-glow colors matching Aura's dynamic themes
        const colors = [
          "rgba(255, 45, 120,",   // Primary pink/magenta
          "rgba(139, 92, 246,",  // Violet
          "rgba(6, 182, 212,",   // Cyan
          "rgba(185, 217, 255,"  // Ice blue
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.5 + 0.1;
        this.fadeSpeed = Math.random() * 0.003 + 0.001;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap particles at boundaries
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Subtle alpha breathing
        this.alpha += this.fadeSpeed;
        if (this.alpha > 0.65 || this.alpha < 0.08) {
          this.fadeSpeed = -this.fadeSpeed;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.save();
        c.shadowBlur = this.size * 5;
        c.shadowColor = this.color + "0.8)";
        c.fillStyle = this.color + this.alpha + ")";
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    const particles: Particle[] = [];
    const numParticles = 65;
    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw dynamic dark grid background
      ctx.strokeStyle = "rgba(255, 255, 255, 0.015)";
      ctx.lineWidth = 1;
      const gridSize = 80;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw ambient particle clouds
      particles.forEach((p) => {
        p.update();
        p.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(audioTimer);
      clearTimeout(completeTimer);
    };
  }, []);

  const content = (
    <AnimatePresence>
      <motion.div
        key="splash-reveal"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, filter: "blur(20px)" }}
        transition={{ duration: 2, ease: "easeInOut" }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#05030f",
          overflow: "hidden",
        }}
      >
        {/* Deep starry background with retro grid mask */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_30%_30%,#ff2bd6_0%,transparent_60%),radial-gradient(circle_at_70%_70%,#00f5ff_0%,transparent_60%)] z-0" />
        <div className="absolute inset-0 pixel-grid opacity-[0.03] z-0 pointer-events-none" />

        {/* Dynamic Canvas Particles */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-[5]"
        />

        {/* Floating assets */}
        <Y2KBadge />
        <DiscoBall />
        <TwinklingStars />

        {/* Decorative chrome assets (headphones, speakers) */}
        <FloatingHeadphones />
        <FloatingSpeaker />

        {/* Turntable spinner deck */}
        <TurntableDeck />

        {/* Centered Grand Reveal Typography Container */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl select-none animate-float-gentle">
          {/* Ambient indicator */}
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex items-center gap-2.5 mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75 bloom-cyan" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary" />
            </span>
            <span className="text-[10px] font-mono tracking-widest text-[#00f5ff] leading-none font-bold uppercase select-none">
              Tuning to your vibe
            </span>
          </motion.div>

          {/* AURA Chrome 3D Title Reveal */}
          <h1 className="flex items-center justify-center gap-1 sm:gap-3 md:gap-6 relative">
            {/* Background pink glow behind title */}
            <div className="absolute text-[5rem] sm:text-[11rem] md:text-[15rem] font-black tracking-widest text-[#ff2bd6] opacity-35 blur-[35px] font-brush leading-none select-none">
              AURA
            </div>
            
            {"AURA".split("").map((letter, index) => (
              <motion.span
                key={index}
                initial={{ 
                  opacity: 0, 
                  y: 70,
                  scale: 1.5,
                  filter: "blur(20px)"
                }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  scale: 1,
                  filter: "blur(0px)"
                }}
                transition={{
                  type: "spring",
                  stiffness: 70,
                  damping: 14,
                  delay: 0.2 + index * 0.14,
                  filter: { duration: 1.6 }
                }}
                className="font-brush text-white text-[5rem] sm:text-[11rem] md:text-[15rem] font-bold leading-none select-none tracking-wide sm:tracking-widest y2k-chrome-giant-text"
              >
                {letter}
              </motion.span>
            ))}
          </h1>

          {/* Subtext Reveal: "Cooked by Pinkesh" */}
          <div className="overflow-hidden py-2">
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 80, 
                damping: 18, 
                delay: 1.2
              }}
              className="signature-pink text-2.5rem md:text-5.5xl mt-2 select-none leading-none"
            >
              Cooked By Pinkesh
            </motion.p>
          </div>

          {/* Glowing neon alignment beam */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "240px", opacity: 0.55 }}
            transition={{ delay: 1.5, duration: 1.2, ease: "easeOut" }}
            className="h-[1px] bg-gradient-to-r from-transparent via-[#00f5ff] to-transparent mt-5"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}
