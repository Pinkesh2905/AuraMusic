import { useEffect, useState, useCallback, useRef } from "react";
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
  const [localDeviceId, setLocalDeviceId] = useState<string | null>(null);
  
  // Keep latest token in a ref so getOAuthToken always gets the fresh one
  const tokenRef = useRef(accessToken);
  useEffect(() => {
    tokenRef.current = accessToken;
  }, [accessToken]);

  const { setDeviceId, pause, resume, setSdk } = usePlayerStore();

  useEffect(() => {
    if (!accessToken || typeof window === "undefined") return;

    // Set up SDK if not already loaded
    if (!document.getElementById("spotify-sdk")) {
      const script = document.createElement("script");
      script.id = "spotify-sdk";
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);
    }

    const initPlayer = () => {
      if (!window.Spotify) return;

      const spotifyPlayer = new window.Spotify.Player({
        name: "Aura Web Player",
        getOAuthToken: (cb: (token: string) => void) => {
          cb(tokenRef.current || "");
        },
        volume: 0.8,
      });

      spotifyPlayer.addListener(
        "ready",
        ({ device_id }: { device_id: string }) => {
          console.log("[Aura] Spotify SDK ready. Device ID:", device_id);
          setDeviceId(device_id);
          setLocalDeviceId(device_id);
          setIsReady(true);
        }
      );

      spotifyPlayer.addListener(
        "not_ready",
        ({ device_id }: { device_id: string }) => {
          console.warn("[Aura] Device gone offline:", device_id);
          setIsReady(false);
        }
      );

      spotifyPlayer.addListener("player_state_changed", (state: any) => {
        if (!state) return;
        
        // Sync track info if changed
        const track = state.track_window.current_track;
        if (track) {
          usePlayerStore.setState({ 
            progress: state.position,
            duration: state.duration,
            isPlaying: !state.paused,
            currentTrack: {
              id: track.id,
              name: track.name,
              album: {
                images: track.album.images.map((img: any) => ({ url: img.url }))
              },
              artists: track.artists.map((art: any) => ({ name: art.name })),
              duration_ms: state.duration,
              uri: track.uri
            } as any
          });
        }
      });

      spotifyPlayer.addListener("initialization_error", ({ message }: any) => {
        console.error("[Aura] SDK init error:", message);
      });

      spotifyPlayer.addListener("authentication_error", ({ message }: any) => {
        console.error("[Aura] SDK auth error:", message);
        console.warn("[Aura] PRO TIP: This usually means your Spotify Premium subscription is required, or your token has expired. Try logging out and back in.");
      });

      spotifyPlayer.addListener("account_error", ({ message }: any) => {
        console.error("[Aura] SDK account error:", message);
        console.warn("[Aura] PRO TIP: Spotify Web Playback SDK REQUIRES a Spotify Premium account.");
      });

      spotifyPlayer.connect();
      setPlayer(spotifyPlayer);
    };

    if (window.Spotify) {
      initPlayer();
    } else {
      window.onSpotifyWebPlaybackSDKReady = initPlayer;
    }

    return () => {
      // No-op cleanup for player init
    };
  }, [accessToken, setDeviceId]);

  // Separate effect for the progress interval to avoid loops
  useEffect(() => {
    if (!player) return;

    const interval = setInterval(async () => {
      const state = await player.getCurrentState();
      if (state && !state.paused) {
        usePlayerStore.setState({ progress: state.position });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [player]);

  /** Seek to a specific position in milliseconds */
  const seekTo = useCallback(async (positionMs: number) => {
    if (!accessToken || !localDeviceId) return;
    try {
      await fetch(
        `https://api.spotify.com/v1/me/player/seek?position_ms=${positionMs}&device_id=${localDeviceId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      usePlayerStore.setState({ progress: positionMs });
    } catch (err) {
      console.error("[Aura] seekTo error:", err);
    }
  }, [accessToken, localDeviceId]);

  /** Play a specific Spotify track URI(s) on our registered device */
  const playTrack = useCallback(
    async (uri: string | string[], deviceId: string) => {
      if (!accessToken) return;
      try {
        const uris = Array.isArray(uri) ? uri : [uri];
        await fetch(
          `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ uris }),
          }
        );
      } catch (err) {
        console.error("[Aura] playTrack error:", err);
      }
    },
    [accessToken]
  );

  /** Pause playback on our device */
  const pausePlayback = useCallback(async () => {
    if (!accessToken || !localDeviceId) return;
    try {
      await fetch(
        `https://api.spotify.com/v1/me/player/pause?device_id=${localDeviceId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
    } catch (err) {
      console.error("[Aura] pausePlayback error:", err);
    }
  }, [accessToken, localDeviceId]);

  /** Resume playback on our device */
  const resumePlayback = useCallback(async () => {
    if (!accessToken || !localDeviceId) return;
    try {
      await fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${localDeviceId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
    } catch (err) {
      console.error("[Aura] resumePlayback error:", err);
    }
  }, [accessToken, localDeviceId]);

  /** Skip to next track */
  const skipNext = useCallback(async () => {
    if (!accessToken || !localDeviceId) return;
    try {
      await fetch(
        `https://api.spotify.com/v1/me/player/next?device_id=${localDeviceId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
    } catch (err) {
      console.error("[Aura] skipNext error:", err);
    }
  }, [accessToken, localDeviceId]);

  /** Skip to previous track */
  const skipPrevious = useCallback(async () => {
    if (!accessToken || !localDeviceId) return;
    try {
      await fetch(
        `https://api.spotify.com/v1/me/player/previous?device_id=${localDeviceId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
    } catch (err) {
      console.error("[Aura] skipPrevious error:", err);
    }
  }, [accessToken, localDeviceId]);

  useEffect(() => {
    if (isReady && localDeviceId) {
      setSdk({
        playTrack: (uri: string | string[]) => playTrack(uri, localDeviceId),
        pause: pausePlayback,
        resume: resumePlayback,
        next: skipNext,
        previous: skipPrevious,
        seek: seekTo
      });
    }
  }, [isReady, localDeviceId, playTrack, pausePlayback, resumePlayback, skipNext, skipPrevious, seekTo, setSdk]);

  return { player, isReady, localDeviceId, playTrack, pausePlayback, resumePlayback, skipNext, skipPrevious, seekTo };
}
