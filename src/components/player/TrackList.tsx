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

export function TrackList({ title, tracks }: TrackListProps) {
  const { currentTrack, isPlaying, play, pause } = usePlayerStore();

  const handlePlay = (track: TrackItem) => {
    // Adapter to match SpotifyTrack interface roughly for mock data
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

    if (currentTrack?.id === track.id) {
      isPlaying ? pause() : play(spotifyTrack, []);
    } else {
      play(spotifyTrack, []);
    }
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-xs font-bold tracking-[0.2em] text-white/60 mb-4 uppercase ml-2">
          {title}
        </h3>
      )}
      
      <div className="flex flex-col gap-1">
        {tracks.map((track, idx) => {
          const isCurrent = currentTrack?.id === track.id;
          
          return (
            <div 
              key={`${track.id}-${idx}`}
              onClick={() => handlePlay(track)}
              className={cn(
                "flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-300 hover:bg-white/10 group",
                isCurrent ? "bg-white/10" : "bg-transparent"
              )}
            >
              <span className="text-xs font-medium text-white/40 w-6 text-center">
                {(idx + 1).toString().padStart(2, '0')}
              </span>
              
              <div className="w-10 h-10 rounded-lg overflow-hidden relative shrink-0 bg-white/10">
                {track.albumArt && <img src={track.albumArt} alt="" className="w-full h-full object-cover" />}
                <div className={cn(
                  "absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity",
                  isCurrent ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                )}>
                  {isCurrent && isPlaying ? (
                    <Pause className="w-4 h-4 text-white fill-current" />
                  ) : (
                    <Play className="w-4 h-4 text-white fill-current ml-0.5" />
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-sm font-semibold truncate transition-colors",
                  isCurrent ? "text-white" : "text-white/90 group-hover:text-white"
                )}>
                  {track.name}
                </p>
                <p className="text-xs text-white/50 truncate mt-0.5">
                  {track.artist}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
