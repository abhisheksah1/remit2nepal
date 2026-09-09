import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#2E3192",
          50: "#F3F3FA",
          100: "#E4E5F5",
          200: "#C5C6EA",
          300: "#8F91D0",
          400: "#5B5DB8",
          500: "#3A3DA8",
          600: "#2E3192",
          700: "#25277A",
          800: "#1C1E5C",
          900: "#151746"
        },
        gold: {
          DEFAULT: "#E31E24",
          50: "#FDF2F2",
          100: "#F8D5D6",
          200: "#F0A8AB",
          300: "#E56B70",
          400: "#E53B40",
          500: "#E31E24",
          600: "#C4191F",
          700: "#9B1418"
        },
        cream: {
          DEFAULT: "#F5F7FB",
          50: "#FBFCFE",
          100: "#F5F7FB",
          200: "#E6EAF3"
        },
        ink: {
          DEFAULT: "#0B1736",
          muted: "#536078"
        }
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"]
      },
      boxShadow: {
        card: "0 18px 50px -24px rgba(46, 49, 146, 0.35)",
        gold: "0 0 0 1px rgba(227, 30, 36, 0.28)"
      },
      maxWidth: {
        site: "100%"
      }
    }
  },
  plugins: []
} satisfies Config;
