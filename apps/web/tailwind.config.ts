import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#5EBFBF',
          DEFAULT: '#3F9BA6',
          dark: '#225C73',
        },
        accent: {
          DEFAULT: '#A66A5D',
          dark: '#8B5A4E',
        },
      },
    },
  },
  plugins: [],
}
export default config
