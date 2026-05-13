import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./store/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        void: "#070b16",
        cyanGlow: "#2ef2ff",
        neonMint: "#78ffd9"
      },
      boxShadow: {
        glow: "0 0 40px rgba(46, 242, 255, 0.4)"
      }
    }
  },
  plugins: []
};

export default config;
