"use client";

import { useEffect, useState } from "react";
import { usePlayerStore } from "@/stores/playerStore";

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }
}

export function useSpotifyPlayer(accessToken: string | undefined) {
  const [player, setPlayer] = useState<any>(null);
  const [isReady, setIsReady] = useState(false);
  
  const { setDeviceId, pause, resume, currentTrack } = usePlayerStore();

  useEffect(() => {
    if (!accessToken || typeof window === 'undefined') return;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: "Aura Web Player",
        getOAuthToken: (cb: (token: string) => void) => { cb(accessToken); },
        volume: 0.8,
      });

      spotifyPlayer.addListener("ready", ({ device_id }: { device_id: string }) => {
        console.log("Ready with Device ID", device_id);
        setDeviceId(device_id);
        setIsReady(true);
      });

      spotifyPlayer.addListener("not_ready", ({ device_id }: { device_id: string }) => {
        console.log("Device ID has gone offline", device_id);
        setIsReady(false);
      });

      spotifyPlayer.addListener("player_state_changed", (state: any) => {
        if (!state) return;
        if (state.paused) {
          pause();
        } else {
          resume();
        }
        // In a full implementation, we'd sync the track info here if changed
      });

      spotifyPlayer.connect();
      setPlayer(spotifyPlayer);
    };

    return () => {
      if (player) player.disconnect();
    };
  }, [accessToken]);

  return { player, isReady };
}
