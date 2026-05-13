import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shalem | Digital Consciousness Portfolio",
  description:
    "An AI cinematic identity experience. Voice-driven portfolio for AI product engineering, full-stack systems, and interactive experiences.",
  keywords: [
    "AI developer",
    "freelance AI engineer",
    "full stack AI developer",
    "voice interface portfolio",
    "cinematic portfolio"
  ],
  openGraph: {
    title: "Shalem | Digital Consciousness Portfolio",
    description: "Interactive AI-driven cinematic portfolio.",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
