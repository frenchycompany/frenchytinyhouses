/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        gold: '#b8924a',
        'gold-light': '#d4b06a',
        dark: '#1a1a1a',
        ink: '#2b2b2b',
        paper: '#ffffff',
        soft: '#f4f1ec',
        line: '#d8cfbf',
        leaf: '#4a6b3a',
        'leaf-light': '#6d8c5a',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mono: ['"DM Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      letterSpacing: {
        widest: '0.2em',
      },
      maxWidth: {
        prose: '65ch',
        page: '72rem',
      },
    },
  },
  plugins: [],
};
