"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlayerStore } from "@/stores/playerStore";
import { Sparkles, Loader2, X, Music, Info, Mic2 } from "lucide-react";

interface LoreData {
  funFact?: string;
  meaning?: string;
  productionNotes?: string;
  error?: string;
}

export function LorePanel() {
  const { isLorePanelOpen, toggleLorePanel, currentTrack } = usePlayerStore();
  const [lore, setLore] = useState<LoreData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!currentTrack || !isLorePanelOpen) return;

    const fetchLore = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          name: currentTrack.name,
          artist: currentTrack.artists?.[0]?.name || ''
        }).toString();
        
        const res = await fetch(`/api/lore/${currentTrack.id}?${queryParams}`);
        if (res.ok) {
          const data = await res.json();
          setLore(data);
        } else {
          setLore({ error: "Could not fetch lore for this track." });
        }
      } catch (err) {
        setLore({ error: "Failed to load artist lore." });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLore();
  }, [currentTrack?.id, isLorePanelOpen]);

  return (
    <AnimatePresence>
      {isLorePanelOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleLorePanel}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
          
          {/* Side Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-[450px] h-full bg-white/10 backdrop-blur-2xl border-l border-white/10 z-50 overflow-y-auto"
            style={{ boxShadow: "-10px 0 30px rgba(0,0,0,0.3)" }}
          >
            <div className="p-8 pb-32 h-full flex flex-col text-white">
              <div className="flex items-center justify-between mb-8 shrink-0">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h2 className="font-display font-bold text-xl tracking-wide">Artist Lore</h2>
                </div>
                <button 
                  onClick={toggleLorePanel}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 text-white/50">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                  <p className="text-sm font-medium animate-pulse">Analyzing sonic DNA with Gemini...</p>
                </div>
              ) : lore?.error ? (
                <div className="flex-1 flex items-center justify-center text-red-300/80">
                  {lore.error}
                </div>
              ) : lore ? (
                <div className="flex flex-col gap-8 flex-1">
                  
                  {/* Now Playing Header */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <img 
                        src={currentTrack?.album?.images?.[0]?.url || ""} 
                        alt="Album art" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate text-white">{currentTrack?.name}</p>
                      <p className="text-xs text-white/60 truncate">{currentTrack?.artists?.[0]?.name}</p>
                    </div>
                  </div>

                  {/* Fun Fact */}
                  {lore.funFact && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="w-4 h-4 text-amber-400" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-white/60">Fun Fact</h3>
                      </div>
                      <p className="text-sm text-white/90 leading-relaxed bg-amber-400/10 border border-amber-400/20 p-4 rounded-2xl">
                        {lore.funFact}
                      </p>
                    </motion.div>
                  )}

                  {/* Meaning */}
                  {lore.meaning && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Music className="w-4 h-4 text-blue-400" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-white/60">The Meaning</h3>
                      </div>
                      <p className="text-sm text-white/80 leading-relaxed">
                        {lore.meaning}
                      </p>
                    </motion.div>
                  )}

                  {/* Production Notes */}
                  {lore.productionNotes && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Mic2 className="w-4 h-4 text-emerald-400" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-white/60">Production Notes</h3>
                      </div>
                      <p className="text-sm text-white/80 leading-relaxed">
                        {lore.productionNotes}
                      </p>
                    </motion.div>
                  )}

                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-white/50 text-sm text-center">
                  Play a track to discover its lore.
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
