import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center relative overflow-hidden">
      {/* Ambient animated gradient background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-glow blur-[150px] rounded-full opacity-20 pointer-events-none animate-glow" />
      
      <div className="relative z-10 w-full max-w-md p-6">
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent animate-pulse" />
            <span className="text-3xl font-display font-bold tracking-tight">Aura</span>
          </div>
        </div>
        
        {children}
      </div>
    </div>
  );
}
