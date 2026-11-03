/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    borderRadius: { none: "0", DEFAULT: "0", sm: "0", md: "0", lg: "0", xl: "0", "2xl": "0", "3xl": "0", full: "0" },
    boxShadow: { none: "none" },
    extend: {
      colors: {
        soft: "#f8f9fa",
        graphite: "#1a1a1a",
        ink: "#1a1a1a",
        muted: "#5f6368",
        line: "#e5e7eb",
        brand: "#c62828",
      },
      fontFamily: {
        sans: ["Manrope", "Inter", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};