// lib/fonts.ts
// next/font/google self-hosts and optimizes these at build time (no
// render-blocking <link> tags, no layout shift). Import the `variable`
// classNames once in app/layout.tsx; components reference them via the
// `font-display` / `font-handwritten` Tailwind utilities (see
// tailwind.config.ts).

import { Anton, Permanent_Marker, Inter } from "next/font/google";

export const displayFont = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

export const handwrittenFont = Permanent_Marker({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-handwritten",
});

export const sansFont = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});