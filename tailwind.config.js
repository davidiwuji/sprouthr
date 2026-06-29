/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: '#22c55e',
        'accent-dark': '#16a34a',
        'accent-light': '#4ade80',
        'bg-primary': '#f0f2f5',
        'bg-surface': '#ffffff',
        'bg-card': '#ffffff',
        'bg-border': '#e2e8f0',
        'text-primary': '#1f2937',
        'text-secondary': '#6b7280',
        'text-muted': '#9ca3af',
      },
      fontFamily: {
        space: ['Space Grotesk', 'sans-serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
