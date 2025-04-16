/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        'futura': ['Futura', 'sans-serif'],
        'jersey': ['"Jersey M54"', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 