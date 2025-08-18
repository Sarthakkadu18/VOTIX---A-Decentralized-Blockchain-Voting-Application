// --- tailwind.config.js ---
// This file configures Tailwind CSS for your project.
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scans all your React components for Tailwind classes
  ],
  theme: {
    extend: {
      // You can extend the default theme here if needed
    },
  },
  plugins: [],
}

