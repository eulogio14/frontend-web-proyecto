/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        prime: {
          dark: '#0a0d14',
          card: '#111726',
          border: '#1f293d',
          neon: '#10b981',      // Portal Gun green
          cyan: '#06b6d4',      // Energy glow
          accent: '#8b5cf6',    // Dimension rift purple
          crimson: '#ef4444',   // Red flag alert
        },
        whatsapp: {
          header: '#202c33',
          chatbg: '#0b141a',
          bubbleOut: '#005c4b',
          bubbleIn: '#202c33',
          accent: '#00a884',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
