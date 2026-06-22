 // app/layout.tsx
import type { Metadata } from "next";
import { displayFont, handwrittenFont, sansFont } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Empire",
  description: "Other Western Tales",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${handwrittenFont.variable} ${sansFont.variable}`}
    >
      <body className="font-sans">{children}</body>
    </html>
  );
}