"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export function AuraCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleIdRef = useRef(0);

  // Position of the mouse
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Springs for the trailing outer glow aura (physics-based damping)
  const trailX = useSpring(mouseX, { stiffness: 90, damping: 20 });
  const trailY = useSpring(mouseY, { stiffness: 90, damping: 20 });

  useEffect(() => {
    // Check if device supports touch input or coarse pointer (like mobile)
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return;

    // Show cursor when mouse enters the viewport
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Track mouse coordinates
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);

      // Check if hovering an interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = 
          target.closest("button") || 
          target.closest("a") || 
          target.closest(".cursor-pointer") || 
          target.closest("[role='button']") || 
          window.getComputedStyle(target).cursor === "pointer";
        
        setIsHovered(!!isClickable);
      }
    };

    // Emit ripple circles on click
    const handleMouseDown = (e: MouseEvent) => {
      const id = rippleIdRef.current++;
      setRipples((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
      
      // Clean up after 1 second
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 1000);
    };

    // Add className to document body to hide native cursor
    document.documentElement.classList.add("custom-cursor-active");

    window.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
      {/* Click Sonic Wave Ripples */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ position: "absolute", left: ripple.x, top: ripple.y, x: "-50%", y: "-50%", width: 0, height: 0, opacity: 0.8, borderRadius: "50%", border: "2px solid var(--color-primary, #FF2D78)" }}
            animate={{ width: 120, height: 120, opacity: 0, border: "1px solid var(--color-secondary, #00F5FF)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="blur-[1px]"
          />
        ))}
      </AnimatePresence>

      {/* Outer Floating Aura (Delayed physical trail) */}
      <motion.div
        style={{
          left: trailX,
          top: trailY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovered ? 1.8 : 1,
          backgroundColor: isHovered 
            ? "rgba(0, 245, 255, 0.08)" // cyan tint on hover
            : "rgba(255, 45, 120, 0.03)", // soft magenta tint normally
          borderColor: isHovered 
            ? "rgba(0, 245, 255, 0.5)" // bright cyan on hover
            : "rgba(255, 45, 120, 0.25)", // magenta glow normally
          width: isHovered ? 48 : 36,
          height: isHovered ? 48 : 36,
        }}
        transition={{
          scale: { type: "spring", stiffness: 120, damping: 15 },
          width: { type: "spring", stiffness: 120, damping: 15 },
          height: { type: "spring", stiffness: 120, damping: 15 },
        }}
        className="absolute rounded-full border border-primary/30 backdrop-blur-[2px] shadow-[0_0_20px_rgba(255,45,120,0.15)] flex items-center justify-center pointer-events-none"
      >
        {/* Subtle dynamic halo lines inside trail when hovered */}
        {isHovered && (
          <motion.div 
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [0.8, 1.2, 0.8], opacity: 0.4 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full border border-secondary/30"
          />
        )}
      </motion.div>

      {/* Inner Active Core (Exact coordinate, high precision) */}
      <motion.div
        style={{
          left: mouseX,
          top: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovered ? 0.4 : 1,
          backgroundColor: isHovered 
            ? "var(--color-secondary, #00F5FF)" // morph to cyan
            : "var(--color-primary, #FF2D78)", // core magenta
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 20,
        }}
        className="absolute w-2 h-2 rounded-full shadow-[0_0_10px_rgba(255,45,120,0.8)] pointer-events-none"
      />
    </div>
  );
}
