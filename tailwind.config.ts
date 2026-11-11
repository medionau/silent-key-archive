import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['EB Garamond', 'Georgia', 'serif'],
        sans: ['Source Sans 3', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: { DEFAULT: '#182B42', light: '#1e3a5f' },
        amber: { DEFAULT: '#7A4F0C', light: '#B45309' },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
