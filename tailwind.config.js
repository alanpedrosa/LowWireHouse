/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wire: {
          dark: '#111827', // Gray 900
          light: '#F9FAFB', // Gray 50
          gray: '#9CA3AF', // Gray 400
          border: '#D1D5DB', // Gray 300
          hover: '#E5E7EB', // Gray 200
          blue: '#3B82F6', // Selection blue
          red: '#EF4444', // Danger/Guides
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', "Liberation Mono", "Courier New", 'monospace'],
      },
      borderWidth: {
        '1': '1px',
      }
    },
  },
  plugins: [],
}
