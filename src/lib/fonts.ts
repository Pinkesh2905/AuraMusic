import { Inter, Orbitron, Geist_Mono, Syne, VT323 } from "next/font/google";

export const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontDisplay = Orbitron({
  weight: ["500", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-display",
});

export const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const fontBleeding = Syne({
  weight: "800",
  subsets: ["latin"],
  variable: "--font-bleeding",
});

export const fontPixel = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});
