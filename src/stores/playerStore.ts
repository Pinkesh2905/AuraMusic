import { create } from 'zustand';
import { SpotifyTrack } from '@/types/spotify';

interface PlayerState {
  currentTrack: SpotifyTrack | null;
  queue: SpotifyTrack[];
  isPlaying: boolean;
  progress: number;        
  duration: number;        
  volume: number;          
  shuffle: boolean;
  repeat: 'off' | 'context' | 'track';
  deviceId: string | null;
  dominantColor: string;
  isLorePanelOpen: boolean;
  isMoodPromptOpen: boolean;
  isFullScreenPlayerOpen: boolean;
  isLoadingQueue: boolean;
  
  // Actions
  play: (track: SpotifyTrack, context?: SpotifyTrack[]) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  previous: () => void;
  seek: (ms: number) => void;
  setVolume: (vol: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  setDominantColor: (color: string) => void;
  setDeviceId: (id: string) => void;
  toggleLorePanel: () => void;
  setMoodPromptOpen: (open: boolean) => void;
  setFullScreenPlayerOpen: (open: boolean) => void;
  appendToQueue: (tracks: SpotifyTrack[]) => void;
  setLoadingQueue: (loading: boolean) => void;
  isQueueRunningLow: () => boolean;

  // SDK Actions (Set by the hook)
  sdk: {
    playTrack: (uri: string | string[]) => Promise<void>;
    pause: () => Promise<void>;
    resume: () => Promise<void>;
    next: () => Promise<void>;
    previous: () => Promise<void>;
    seek: (ms: number) => Promise<void>;
  } | null;
  setSdk: (sdk: any) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  queue: [],
  isPlaying: false,
  progress: 0,
  duration: 0,
  volume: 0.8,
  shuffle: false,
  repeat: 'off',
  deviceId: null,
  dominantColor: '#8B5CF6',
  isLorePanelOpen: false,
  isMoodPromptOpen: false,
  isFullScreenPlayerOpen: false,
  isLoadingQueue: false,

  play: (track, context = []) => {
    set({ 
      currentTrack: track, 
      queue: context,
      isPlaying: true,
      progress: 0,
      duration: track.duration_ms
    });
  },
  
  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),
  
  next: () => {
    const { queue, currentTrack, sdk } = get();
    if (!currentTrack || queue.length === 0) return;
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    if (currentIndex < queue.length - 1) {
      const nextTrack = queue[currentIndex + 1];
      set({ currentTrack: nextTrack, progress: 0, duration: nextTrack.duration_ms });
      if (sdk) {
        sdk.next().catch(err => console.warn("[Aura] SDK next failed:", err));
      }
    }
  },
  
  previous: () => {
    const { queue, currentTrack, progress, sdk } = get();
    if (!currentTrack || queue.length === 0) return;
    if (progress > 3000) {
      set({ progress: 0 });
      if (sdk) {
        sdk.seek(0).catch(err => console.warn("[Aura] SDK seek failed:", err));
      }
      return;
    }
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    if (currentIndex > 0) {
      const prevTrack = queue[currentIndex - 1];
      set({ currentTrack: prevTrack, progress: 0, duration: prevTrack.duration_ms });
      if (sdk) {
        sdk.previous().catch(err => console.warn("[Aura] SDK previous failed:", err));
      }
    }
  },
  
  seek: (ms) => {
    const { sdk } = get();
    if (sdk) {
      sdk.seek(ms);
    } else {
      set({ progress: ms });
    }
  },
  setVolume: (vol) => set({ volume: vol }),
  toggleShuffle: () => set(state => ({ shuffle: !state.shuffle })),
  
  cycleRepeat: () => set(state => {
    const modes: ('off' | 'context' | 'track')[] = ['off', 'context', 'track'];
    const nextIndex = (modes.indexOf(state.repeat) + 1) % modes.length;
    return { repeat: modes[nextIndex] };
  }),
  
  setDominantColor: (color) => set({ dominantColor: color }),
  setDeviceId: (id) => set({ deviceId: id }),
  toggleLorePanel: () => set(state => ({ isLorePanelOpen: !state.isLorePanelOpen })),
  setMoodPromptOpen: (open) => set({ isMoodPromptOpen: open }),
  setFullScreenPlayerOpen: (open) => set({ isFullScreenPlayerOpen: open }),

  appendToQueue: (tracks) => {
    const { queue } = get();
    const existingIds = new Set(queue.map(t => t.id));
    const newTracks = tracks.filter(t => !existingIds.has(t.id));
    set({ queue: [...queue, ...newTracks] });
  },
  setLoadingQueue: (loading) => set({ isLoadingQueue: loading }),
  isQueueRunningLow: () => {
    const { queue, currentTrack } = get();
    if (!currentTrack || queue.length === 0) return true;
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    return currentIndex >= queue.length - 3;
  },
  
  sdk: null,
  setSdk: (sdk) => set({ sdk })
}));
