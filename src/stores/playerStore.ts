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

  play: (track, context = []) => set({ 
    currentTrack: track, 
    queue: context,
    isPlaying: true,
    progress: 0,
    duration: track.duration_ms
  }),
  
  pause: () => set({ isPlaying: false }),
  resume: () => set({ isPlaying: true }),
  
  next: () => {
    // Basic queue logic
    const { queue, currentTrack } = get();
    if (!currentTrack || queue.length === 0) return;
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    if (currentIndex < queue.length - 1) {
      set({ currentTrack: queue[currentIndex + 1], progress: 0 });
    }
  },
  
  previous: () => {
    // Basic queue logic
    const { queue, currentTrack, progress } = get();
    if (!currentTrack || queue.length === 0) return;
    if (progress > 3000) {
      set({ progress: 0 });
      return;
    }
    const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
    if (currentIndex > 0) {
      set({ currentTrack: queue[currentIndex - 1], progress: 0 });
    }
  },
  
  seek: (ms) => set({ progress: ms }),
  setVolume: (vol) => set({ volume: vol }),
  toggleShuffle: () => set(state => ({ shuffle: !state.shuffle })),
  
  cycleRepeat: () => set(state => {
    const modes: ('off' | 'context' | 'track')[] = ['off', 'context', 'track'];
    const nextIndex = (modes.indexOf(state.repeat) + 1) % modes.length;
    return { repeat: modes[nextIndex] };
  }),
  
  setDominantColor: (color) => set({ dominantColor: color }),
  setDeviceId: (id) => set({ deviceId: id }),
  toggleLorePanel: () => set(state => ({ isLorePanelOpen: !state.isLorePanelOpen }))
}));
