"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

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

    // 2. Trigger automatic screen completion reveal after 4.2 seconds
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4200);

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

  return (
    <AnimatePresence>
      <motion.div
        key="splash-reveal"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, filter: "blur(20px)" }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
        className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-black overflow-hidden"
      >
        {/* Dynamic Canvas Particles */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-[5]"
        />

        {/* Stunning Toxic Green Swirl Fluid Artwork */}
        <motion.div 
          initial={{ scale: 1.02, opacity: 0.7 }}
          animate={{ scale: 1.15, opacity: 0.95 }}
          transition={{ duration: 4.5, ease: "linear" }}
          className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
        >
          <Image
            src="/images/aura_splash_bg.png"
            alt="Aura Fluid Art Background"
            fill
            priority
            className="object-cover select-none"
          />
        </motion.div>

        {/* Moody vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black pointer-events-none z-[2]" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/15 to-black/95 pointer-events-none z-[2]" />

        {/* Dynamic pulsing glow behind title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: [0.15, 0.45, 0.25], scale: [0.9, 1.1, 1.0] }}
          transition={{ duration: 3.5, ease: "easeInOut", repeat: 0 }}
          className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-primary/15 via-purple-600/5 to-secondary/20 blur-[130px] pointer-events-none z-[3]"
        />

        {/* Centered Grand Reveal Typography Container */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl select-none">
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
            <span className="text-[10px] font-mono tracking-widest text-white/50 leading-none font-bold uppercase">
              Tuning to your vibe
            </span>
          </motion.div>

          {/* AURA Distressed Title Reveal */}
          <h1 className="flex items-center justify-center gap-3 md:gap-6 overflow-hidden">
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
                className="font-bleeding text-white text-[8rem] sm:text-[11rem] md:text-[15rem] font-bold leading-none select-none tracking-normal drop-shadow-[0_15px_40px_rgba(0,0,0,0.95)]"
                style={{
                  textShadow: "0 10px 30px rgba(0,0,0,0.7), 0 0 80px rgba(255,45,120,0.18)"
                }}
              >
                {letter}
              </motion.span>
            ))}
          </h1>

          {/* Subtext Reveal: "Cooked by Pinkesh" */}
          <div className="mt-8 overflow-hidden py-2">
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 0.85 }}
              transition={{ 
                type: "spring", 
                stiffness: 80, 
                damping: 18, 
                delay: 1.2
              }}
              className="font-mono text-xs md:text-sm tracking-widest text-white/70 leading-none"
            >
              Cooked by <span className="text-secondary font-black drop-shadow-[0_0_10px_rgba(0,245,255,0.45)]">Pinkesh</span>
            </motion.p>
          </div>

          {/* Glowing neon alignment beam */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "240px", opacity: 0.55 }}
            transition={{ delay: 1.5, duration: 1.2, ease: "easeOut" }}
            className="h-[1px] bg-gradient-to-r from-transparent via-secondary to-transparent mt-5"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
