/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds
        background: {
          DEFAULT: "#FAFAF7", // main app bg
          sidebar: "#F0F0EC", // sidebar bg
          card: "#FFFFFF",    // cards & elevated sections
        },
        // Accent
        accent: {
          DEFAULT: "#E5734A", // brand orange
          hover: "#D65A30",
        },
        // Neutral text
        text: {
          primary: "#2E2E2E",
          secondary: "#6D6D6D",
          muted: "#A1A1A1",
        },
        // State colors
        success: "#4CAF50",
        error: "#E53935",
      },
    },
  },
  plugins: [],
}
