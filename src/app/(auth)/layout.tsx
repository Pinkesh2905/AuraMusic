import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden relative">
      {children}
    </div>
  );
}
