"use client";

import { SessionProvider } from "next-auth/react";
import { AudioPlaybackProvider } from "@/components/player/AudioPlaybackProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AudioPlaybackProvider>
        {children}
      </AudioPlaybackProvider>
    </SessionProvider>
  );
}
