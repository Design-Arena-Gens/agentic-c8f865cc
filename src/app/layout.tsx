import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "StoryVid Storyboard Creator",
  description:
    "Transform scripts into vibrant storyboards with AI-assisted scenes, SVG illustrations, and real-time previews."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-slate-50 text-slate-900`}>{children}</body>
    </html>
  );
}
