/* -----------------------------------------------------------------
File: frontend/tailwind.config.cjs
Purpose: Tailwind CSS configuration (JIT + Cognifer theme)
----------------------------------------------------------------- */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0B1E3F",   // Deep Tech Blue — trust & innovation
        secondary: "#4B5563", // Slate Grey — professional balance
        accent: "#2F81F7",    // Electric Sky Blue — data-driven highlight
        background: "#F9FAFB",// Clean background tone
        text: "#111827",      // Core text color for readability
        cognifer_blue: "#1B4DB1", // Brand-specific blue
        cognifer_gray: "#F3F4F6"  // Brand light gray
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 14px rgba(0, 0, 0, 0.05)",
      },
      borderRadius: {
        xl: "1rem",
      },
    },
  },
  plugins: [],
};
