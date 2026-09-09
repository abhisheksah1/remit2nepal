import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0A1628",
          50: "#F2F5F8",
          100: "#E4E9F0",
          200: "#C5D0DE",
          300: "#8FA3BC",
          400: "#5B7394",
          500: "#3A506B",
          600: "#243447",
          700: "#162233",
          800: "#0F1A2A",
          900: "#0A1628"
        },
        gold: {
          DEFAULT: "#C4A35A",
          50: "#FBF7EE",
          100: "#F4EBD4",
          200: "#E8D5A8",
          300: "#D8BC78",
          400: "#C4A35A",
          500: "#A8863D",
          600: "#866A2E",
          700: "#655023"
        },
        cream: {
          DEFAULT: "#F4F0E6",
          50: "#FBF9F4",
          100: "#F4F0E6",
          200: "#E8E0CC"
        },
        ink: {
          DEFAULT: "#1A2332",
          muted: "#4A5568"
        }
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Outfit", "system-ui", "sans-serif"]
      },
      boxShadow: {
        card: "0 18px 50px -24px rgba(10, 22, 40, 0.35)",
        gold: "0 0 0 1px rgba(196, 163, 90, 0.28)"
      },
      maxWidth: {
        site: "1180px"
      }
    }
  },
  plugins: []
} satisfies Config;
