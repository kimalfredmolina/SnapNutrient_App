/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
  presets: [require("nativewind/preset")],
  darkMode: 'class', // Enable dark mode
  theme: {
    extend: {
      colors: {
        // Light Mode Colors 
        primary: {
          light: '#9ACD32', // Light green
          DEFAULT: '#6C63FF', // purple
          dark: '#228B22', // Dark green
        },
        secondary: {
          light: '#40E0D0', // Teal/cyan
          DEFAULT: '#4ade80', // green
          dark: '#008B8B', // Dark teal 
        },
        accent: {
          light: '#FF6B6B', // Red/coral
          DEFAULT: '#FF4500', // Orange red
          dark: '#DC143C', // Dark red
        },
        // Background colors for themes
        background: {
          light: '#FFFFFF', // White 
          dark: '#000000', // Black 
        },
        surface: {
          light: '#F8F9FA',
          dark: '#1A1A1A',
        },
        text: {
          light: '#000000',
          dark: '#FFFFFF',
        },
        border: {
          light: '#E5E7EB',
          dark: '#374151',
        }
      },
    },
  },
  plugins: [],
}