/** @type {import('tailwindcss').Config} */
import { nextui } from "@nextui-org/react";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        ink: {
          50: "#f7f8fa",
          100: "#eef1f4",
          200: "#dce3ea",
          300: "#c0cbd6",
          400: "#8fa0b0",
          500: "#6b7c8d",
          600: "#556575",
          700: "#455260",
          800: "#3a4550",
          900: "#323b44",
        },
        accent: {
          50: "#f0f7f6",
          100: "#d9ece9",
          200: "#b5d9d3",
          300: "#86bfb6",
          400: "#5aa39a",
          500: "#3f877f",
          600: "#326c66",
          700: "#2b5753",
          800: "#264744",
          900: "#223c3a",
        },
      },
      boxShadow: {
        soft: "0 1px 2px rgba(50, 59, 68, 0.04), 0 8px 24px rgba(50, 59, 68, 0.06)",
        lift: "0 2px 4px rgba(50, 59, 68, 0.04), 0 12px 32px rgba(50, 59, 68, 0.08)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.35s ease-out both",
        shimmer: "shimmer 2.4s linear infinite",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      defaultTheme: "light",
      themes: {
        light: {
          colors: {
            background: "#f4f6f8",
            foreground: "#323b44",
            primary: {
              DEFAULT: "#3f877f",
              foreground: "#ffffff",
            },
            focus: "#5aa39a",
            danger: {
              DEFAULT: "#c46b6b",
              foreground: "#ffffff",
            },
            default: {
              DEFAULT: "#eef1f4",
              foreground: "#455260",
            },
          },
        },
      },
    }),
  ],
};
