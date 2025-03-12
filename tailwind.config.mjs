/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: 'rgb(var(--accent))',
          hover: 'rgb(var(--accent-hover, var(--accent)))',
          active: 'rgb(var(--accent-active, var(--accent)))'
        },
      },
    },
  },
  plugins: [],
}