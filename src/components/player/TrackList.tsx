"use client";

import { usePlayerStore } from "@/stores/playerStore";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TrackItem {
  id: string;
  name: string;
  artist: string;
  artists?: any[];
  duration: number;
  albumArt: string | null;
  uri?: string;
  previewUrl?: string | null;
}

interface TrackListProps {
  title?: string;
  tracks: TrackItem[];
}

import { useSession } from "next-auth/react";
import { useSpotifyPlayer } from "@/hooks/useSpotifyPlayer";

export function TrackList({ title, tracks }: TrackListProps) {
  const { data: session } = useSession();
  const { currentTrack, isPlaying, play, pause, deviceId } = usePlayerStore();
  const { playTrack } = useSpotifyPlayer(session?.accessToken as string);

  const handlePlay = async (track: TrackItem) => {
    const spotifyTrack = {
      id: track.id,
      name: track.name,
      uri: track.uri || `spotify:track:${track.id}`,
      duration_ms: track.duration,
      preview_url: track.previewUrl || null,
      artists: track.artists || [{ id: track.id, name: track.artist, uri: "" }],
      album: { 
        id: "a1", name: "Album", uri: "", release_date: "", 
        images: [{ url: track.albumArt || "", height: 300, width: 300 }],
        artists: [] 
      }
    };

    const spotifyContext = tracks.map(t => ({
      id: t.id,
      name: t.name,
      uri: t.uri || `spotify:track:${t.id}`,
      duration_ms: t.duration,
      preview_url: t.previewUrl || null,
      artists: t.artists || [{ id: t.id, name: t.artist, uri: "" }],
      album: { 
        id: "a1", name: "Album", uri: "", release_date: "", 
        images: [{ url: t.albumArt || "", height: 300, width: 300 }],
        artists: [] 
      }
    }));

    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        pause();
      } else {
        play(spotifyTrack, spotifyContext);
        if (deviceId) {
          const trackIdx = tracks.findIndex(t => t.id === track.id);
          const uris = trackIdx >= 0 ? spotifyContext.slice(trackIdx).map(t => t.uri) : [spotifyTrack.uri];
          await playTrack(uris, deviceId);
        }
      }
    } else {
      play(spotifyTrack, spotifyContext);
      if (deviceId) {
        const trackIdx = tracks.findIndex(t => t.id === track.id);
        const uris = trackIdx >= 0 ? spotifyContext.slice(trackIdx).map(t => t.uri) : [spotifyTrack.uri];
        await playTrack(uris, deviceId);
      }
    }
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-[10px] font-mono font-black tracking-[0.3em] text-[#b6ff00] mb-6 uppercase ml-2">
          {title}
        </h3>
      )}
      
      <div className="flex flex-col gap-2">
        {tracks.map((track, idx) => {
          const isCurrent = currentTrack?.id === track.id;
          
          return (
            <div 
              key={`${track.id}-${idx}`}
              onClick={() => handlePlay(track)}
              className={cn(
                "flex items-center gap-4 p-3.5 rounded-2xl cursor-pointer transition-all duration-300 group relative overflow-hidden border",
                isCurrent ? "glass-premium bloom-pink border-pink-300/25" : "border-transparent hover:bg-white/5 hover:border-cyan-300/14"
              )}
            >
              <span className={cn(
                "text-[10px] font-mono w-6 text-center transition-colors tracking-wider",
                isCurrent ? "text-[#b6ff00] font-black" : "text-text-tertiary group-hover:text-cyan-200"
              )}>
                {(idx + 1).toString().padStart(2, '0')}
              </span>
              
              <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0 bg-surface shadow-lg border border-white/10">
                {track.albumArt && <img src={track.albumArt} alt="" className="w-full h-full object-cover" />}
                <div className={cn(
                  "absolute inset-0 bg-pink-500/55 flex items-center justify-center transition-all duration-500",
                  isCurrent ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}>
                  {isCurrent && isPlaying ? (
                    <Pause className="w-5 h-5 text-white fill-current" />
                  ) : (
                    <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm font-display font-black truncate transition-colors uppercase tracking-normal",
                  isCurrent ? "text-[#b6ff00]" : "text-text-primary group-hover:text-cyan-100"
                )}>
                  {track.name}
                </p>
                <p className="text-[10px] text-cyan-100/48 font-mono uppercase tracking-widest truncate mt-0.5">
                  {track.artist}
                </p>
              </div>

              {isCurrent && (
                <div className="flex gap-0.5 items-end h-3">
                  <div className="w-0.5 h-full bg-[#b6ff00] animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-0.5 h-2 bg-[#00f5ff] animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-0.5 h-3 bg-[#ff2bd6] animate-bounce [animation-delay:-0.45s]" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
