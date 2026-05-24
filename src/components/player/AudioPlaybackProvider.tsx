"use client";

import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/stores/playerStore";
import { useSession } from "next-auth/react";

// Hash track name to get a consistent Pixabay/SoundHelix MP3 URL (1 to 16)
export function getFallbackAudioUrl(trackName: string): string {
  let hash = 0;
  const name = trackName || "Aura Silence";
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = (Math.abs(hash) % 12) + 1; // SoundHelix songs 1-12
  return `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${index}.mp3`;
}

export function AudioPlaybackProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastFetchedTrackIdRef = useRef<string | null>(null);
  const { data: session } = useSession();
  
  const { 
    currentTrack, 
    isPlaying, 
    volume, 
    progress,
    sdk,
    deviceId
  } = usePlayerStore();

  // ── Auto-generate 10 highly accurate similar songs when currently played song changes ──
  useEffect(() => {
    if (!currentTrack?.id) return;
    if (lastFetchedTrackIdRef.current === currentTrack.id) return;

    lastFetchedTrackIdRef.current = currentTrack.id;

    const autoGenerateQueue = async () => {
      const store = usePlayerStore.getState();
      
      // Skip queue generation if we still have at least 4 upcoming tracks, preventing bloating the playback queue!
      const currentIdx = store.queue.findIndex(t => t.id === currentTrack.id);
      if (currentIdx >= 0 && (store.queue.length - 1 - currentIdx) >= 4) {
        return;
      }

      store.setLoadingQueue(true);

      try {
        const res = await fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trackId: currentTrack.id }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.tracks && data.tracks.length > 0) {
            const formatted = data.tracks.map((t: any) => ({
              id: t.id,
              name: t.name,
              uri: t.uri,
              duration_ms: t.duration_ms,
              preview_url: t.preview_url || null,
              album: t.album,
              artists: t.artists,
            }));

            // Sync with local queue
            const currentQueue = store.queue;
            const currentIdx = currentQueue.findIndex(t => t.id === currentTrack.id);

            let newQueue;
            if (currentIdx >= 0) {
              const previousTracks = currentQueue.slice(0, currentIdx + 1);
              newQueue = [...previousTracks, ...formatted];
            } else {
              newQueue = [currentTrack, ...formatted];
            }

            usePlayerStore.setState({ queue: newQueue });

            // If Spotify SDK is active, natively push these tracks to the playback queue
            if (sdk && store.deviceId && session?.accessToken) {
              for (const track of formatted) {
                try {
                  await fetch(
                    `https://api.spotify.com/v1/me/player/queue?uri=${encodeURIComponent(
                      track.uri
                    )}&device_id=${store.deviceId}`,
                    {
                      method: "POST",
                      headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                      },
                    }
                  );
                } catch (err) {
                  console.error("[Aura] Failed to natively queue track:", track.name, err);
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("[Aura] Auto-generate smart queue error:", error);
      } finally {
        store.setLoadingQueue(false);
      }
    };

    autoGenerateQueue();
  }, [currentTrack?.id, session?.accessToken, sdk]);

  // Initialize Audio element on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const audio = new Audio();
      audio.volume = volume;
      audioRef.current = audio;
      
      // Update progress periodically
      const interval = setInterval(() => {
        const state = usePlayerStore.getState();
        if (state.sdk) return; // Do not update store progress from HTML5 audio if Spotify SDK is active

        if (audioRef.current && !audioRef.current.paused) {
          usePlayerStore.setState({ 
            progress: Math.floor(audioRef.current.currentTime * 1000),
            duration: Math.floor(audioRef.current.duration * 1000) || state.currentTrack?.duration_ms || 180000
          });
        }
      }, 500);

      // On track end, go to next
      audio.addEventListener("ended", () => {
        const state = usePlayerStore.getState();
        if (!state.sdk) {
          state.next();
        }
      });

      return () => {
        clearInterval(interval);
        audio.pause();
        audio.src = "";
      };
    }
  }, []);

  // Synchronize Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Synchronize Playback Source and State
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // If Spotify SDK is active, HTML5 audio MUST be paused and cleared to prevent double playback
    if (sdk) {
      audio.pause();
      if (audio.src) {
        audio.src = "";
      }
      return;
    }

    if (currentTrack) {
      const targetSrc = currentTrack.preview_url || getFallbackAudioUrl(currentTrack.name);
      
      // If the source has changed, update it
      if (audio.src !== targetSrc) {
        audio.src = targetSrc;
        audio.load();
        
        // Reset progress on new track
        usePlayerStore.setState({ progress: 0 });
      }

      if (isPlaying) {
        // If we are playing, attempt playback
        audio.play().catch((err) => {
          console.warn("[Aura] Audio auto-play prevented or failed:", err);
        });
      } else {
        audio.pause();
      }
    } else {
      audio.pause();
    }
  }, [currentTrack, isPlaying, sdk]);

  // Sync seek/progress if manually requested (e.g. from sliders)
  // We check if the difference between audio currentTime and store progress is large (> 2000ms)
  // to avoid infinite sync loops during normal play.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack || sdk) return; // Do not seek HTML5 audio if Spotify SDK is active
    
    const audioMs = Math.floor(audio.currentTime * 1000);
    if (Math.abs(audioMs - progress) > 2500) {
      audio.currentTime = progress / 1000;
    }
  }, [progress, currentTrack, sdk]);

  return <>{children}</>;
}
