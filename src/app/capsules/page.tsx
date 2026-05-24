"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Clock, Sparkles, Plus, X, Loader2 } from "lucide-react";
import { usePlayerStore } from "@/stores/playerStore";

export default function CapsulesPage() {
  const [capsules, setCapsules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newCapsule, setNewCapsule] = useState({ name: "", lockedUntilDays: "7", seedType: "top_recent" });
  const [creatingStatus, setCreatingStatus] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  const fetchCapsules = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/capsules");
      const data = await res.json();
      if (data.capsules) setCapsules(data.capsules);
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCapsules();
  }, []);

  const handleCreate = async () => {
    setCreatingStatus("creating");
    try {
      const res = await fetch("/api/capsules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCapsule),
      });
      if (res.ok) {
        setIsCreating(false);
        setNewCapsule({ name: "", lockedUntilDays: "7", seedType: "top_recent" });
        fetchCapsules();
      }
    } catch (e) {
      console.error(e);
    }
    setCreatingStatus("");
  };

  const handleUnlock = async (id: string) => {
    try {
      const res = await fetch(`/api/capsules/${id}/unlock`, { method: "POST" });
      const data = await res.json();
      if (data.letter) {
        setActiveLetter(data.letter);
        fetchCapsules(); // Refresh to remove lock
      }
    } catch (e) {}
  };

  return (
    <main className="w-full max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-36 flex flex-col min-h-screen relative z-10 gap-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h4 className="text-[10px] font-mono font-black tracking-[0.3em] text-[#b6ff00] mb-2 uppercase flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#b6ff00]" />
            Time Capsule Vault
          </h4>
          <h1 className="text-4xl font-display font-black uppercase tracking-normal text-white mb-1 neon-text">Preserve the Moment</h1>
          <p className="text-sm text-white/50">Lock your current taste in a time capsule. Read a letter from your past self when it unlocks.</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 y2k-button text-white px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider hover:scale-[1.03] active:scale-[0.97] transition-all"
        >
          <Plus className="w-4 h-4" />
          Create Capsule
        </button>
      </div>

      {/* Grid of Capsules */}
      {isLoading ? (
        <div className="w-full flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-white/40" /></div>
      ) : capsules.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center py-20 text-white/40">
          <Lock className="w-12 h-12 mb-4 opacity-20" />
          <p>You have no Time Capsules yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {capsules.map((capsule) => {
            const isLocked = capsule.lockedUntil && new Date(capsule.lockedUntil) > new Date();
            const unlockDate = new Date(capsule.lockedUntil).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

            return (
              <motion.div
                key={capsule.id}
                whileHover={{ y: -4 }}
                className="relative y2k-panel crt-scanlines rounded-3xl p-6 overflow-hidden group hover:border-cyan-300/25 hover:scale-[1.01] transition-all duration-300"
              >
                {/* Background flair */}
                <div className={`absolute -right-10 -bottom-10 w-32 h-32 blur-3xl opacity-20 rounded-full transition-colors ${isLocked ? "bg-orange-500" : "bg-purple-500"}`} />

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{capsule.name}</h3>
                    <p className="text-xs text-white/40">{capsule.tracks.length} tracks</p>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center y2k-screen ${isLocked ? "text-orange-300" : "text-[#b6ff00]"}`}>
                    {isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                  </div>
                </div>

                {isLocked ? (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Unlocks On</p>
                    <p className="text-sm font-semibold text-orange-400">{unlockDate}</p>
                  </div>
                ) : (
                  <div className="mt-4 pt-4 border-t border-white/10 flex gap-2">
                    <button
                      onClick={() => handleUnlock(capsule.id)}
                      className="flex-1 y2k-button text-white text-xs font-semibold py-2 rounded-lg transition-colors flex justify-center gap-2 items-center"
                    >
                      <Sparkles className="w-3 h-3" /> Read Letter
                    </button>
                    {/* Add play button if needed */}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="glass-premium crt-scanlines rounded-[2rem] border border-cyan-300/20 bg-black/60 backdrop-blur-2xl p-8 md:p-10 w-full max-w-md relative overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.8)]"
            >
              <button onClick={() => setIsCreating(false)} className="absolute top-4 right-4 text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-2xl font-display font-bold text-white mb-2 neon-text">Create Time Capsule</h2>
              <p className="text-sm text-white/50 mb-6">Lock your current sonic vibe away for the future.</p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold tracking-wider text-white/50 uppercase mb-2 block">Capsule Name</label>
                  <input
                    type="text"
                    value={newCapsule.name}
                    onChange={(e) => setNewCapsule({ ...newCapsule, name: e.target.value })}
                    className="w-full y2k-screen rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                    placeholder="e.g. Summer Memories '26"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold tracking-wider text-white/50 uppercase mb-2 block">Content Seed</label>
                  <select
                    value={newCapsule.seedType}
                    onChange={(e) => setNewCapsule({ ...newCapsule, seedType: e.target.value })}
                    className="w-full y2k-screen rounded-xl px-4 py-3 text-white focus:outline-none appearance-none"
                  >
                    <option value="top_recent" className="bg-neutral-900 text-white">My Top Tracks (Past Month)</option>
                    <option value="recently_played" className="bg-neutral-900 text-white">My Recently Played</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold tracking-wider text-white/50 uppercase mb-2 block">Lock Duration</label>
                  <select
                    value={newCapsule.lockedUntilDays}
                    onChange={(e) => setNewCapsule({ ...newCapsule, lockedUntilDays: e.target.value })}
                    className="w-full y2k-screen rounded-xl px-4 py-3 text-white focus:outline-none appearance-none"
                  >
                    <option value="1" className="bg-neutral-900 text-white">1 Day (Demo)</option>
                    <option value="7" className="bg-neutral-900 text-white">1 Week</option>
                    <option value="30" className="bg-neutral-900 text-white">1 Month</option>
                    <option value="180" className="bg-neutral-900 text-white">6 Months</option>
                    <option value="365" className="bg-neutral-900 text-white">1 Year</option>
                  </select>
                </div>

                <button
                  onClick={handleCreate}
                  disabled={creatingStatus === "creating" || !newCapsule.name}
                  className="w-full y2k-button text-white font-bold py-3 rounded-xl mt-4 hover:opacity-90 transition-opacity disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {creatingStatus === "creating" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                  Lock Capsule
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Letter Modal */}
      <AnimatePresence>
        {activeLetter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-premium crt-scanlines rounded-[2rem] border border-cyan-300/20 bg-black/60 backdrop-blur-2xl p-10 md:p-12 w-full max-w-2xl relative overflow-hidden shadow-[0_30px_90px_rgba(0,0,0,0.8)]"
            >
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full" />
              
              <button onClick={() => setActiveLetter(null)} className="absolute top-6 right-6 text-white/50 hover:text-white z-10">
                <X className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-3 mb-6 relative z-10">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <h2 className="text-3xl font-display font-bold text-white neon-text">A Letter From The Past</h2>
              </div>
              
              <div className="relative z-10 space-y-6 text-white/80 leading-relaxed text-lg font-serif italic">
                {activeLetter.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
