import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./sanity/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta de marca Big Biker
        brand: {
          yellow: "#FDB92E",
          red: "#C52F33",
          black: "#201E1E",
        },
        // Escala neutra calibrada al negro de marca
        ink: {
          DEFAULT: "#201E1E",
          900: "#171515",
          800: "#201E1E",
          700: "#2C2A2A",
          600: "#3A3737",
          500: "#5A5656",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Impact", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(37, 211, 102, 0.7)" },
          "70%": { boxShadow: "0 0 0 12px rgba(37, 211, 102, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(37, 211, 102, 0)" },
        },
        "marquee": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 2s infinite",
        "marquee": "marquee 22s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
