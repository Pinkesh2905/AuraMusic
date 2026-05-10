import type { Metadata } from "next";
import { fontSans, fontDisplay } from "@/lib/fonts";
import "./globals.css";
import { SplitDashboard } from "@/components/shell/SplitDashboard";
import { Providers } from "./providers";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Aura | Emotionally-aware music",
  description: "Music that moves with you — not just around you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          fontSans.variable,
          fontDisplay.variable,
          "font-sans antialiased"
        )}
      >
        <Providers>
          <SplitDashboard>
            {children}
          </SplitDashboard>
        </Providers>
      </body>
    </html>
  );
}
