import type { Metadata } from "next";
import { fontSans, fontDisplay, fontBody, fontMono, fontBleeding, fontPixel } from "@/lib/fonts";
import "./globals.css";
import { SplitDashboard } from "@/components/shell/SplitDashboard";
import { Providers } from "./providers";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Aura | No Cap Music fr",
  description: "It's giving main character energy. The only music app that understands your aura.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head />
      <body
        className={cn(
          fontSans.variable,
          fontDisplay.variable,
          fontBody.variable,
          fontMono.variable,
          fontBleeding.variable,
          fontPixel.variable,
          "font-sans antialiased bg-background text-text-primary"
        )}
      >
        {/* SVG Ink Bleed & Distressed Grunge Filter */}
        <svg xmlns="http://www.w3.org/2000/svg" style={{ display: 'none', position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <filter id="ink-bleed-filter">
              {/* Generate random fractal noise for organic texture */}
              <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="4" result="noise" />
              {/* Displace the text pixels using the noise map */}
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="7" xChannelSelector="R" yChannelSelector="G" result="displaced" />
              {/* Slightly blur to simulate ink bleeding into paper fibers */}
              <feGaussianBlur in="displaced" stdDeviation="0.75" result="blurred" />
              {/* Apply sharp component transfer (threshold) to get crisp, distressed ink boundaries */}
              <feComponentTransfer in="blurred">
                <feFuncA type="discrete" tableValues="0 1" />
              </feComponentTransfer>
            </filter>
          </defs>
        </svg>

        <Providers>
          <SplitDashboard>
            {children}
          </SplitDashboard>
        </Providers>
      </body>
    </html>
  );
}
