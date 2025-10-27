import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        deepPurple: "#5531A7",
        teal: "#2BB3B1",
        coral: "#FF6F61",
        amber: "#FFB74D",
        slate: {
          50: "#f8fafc",
          900: "#0f172a"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"]
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out",
        slideUp: "slideUp 0.45s ease-out",
        zoomIn: "zoomIn 0.45s ease-out",
        bounceIn: "bounceIn 0.7s ease"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        slideUp: {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        zoomIn: {
          "0%": { transform: "scale(0.85)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" }
        },
        bounceIn: {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "60%": { transform: "scale(1.05)", opacity: "1" },
          "100%": { transform: "scale(1)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
