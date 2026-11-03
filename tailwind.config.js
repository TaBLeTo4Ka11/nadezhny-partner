/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    borderRadius: { none: "0", DEFAULT: "0", sm: "0", md: "0", lg: "0", xl: "0", "2xl": "0", "3xl": "0", full: "0" },
    boxShadow: { none: "none" },
    extend: {
      colors: {
        soft: "#111416",
        graphite: "#080A0B",
        ink: "#F0F1EF",
        muted: "#92999D",
        line: "#2A2F33",
        brand: "#B7C0C4",
      },
      fontFamily: {
        sans: ["Manrope", "Inter", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
