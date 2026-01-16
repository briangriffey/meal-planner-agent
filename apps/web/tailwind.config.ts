import type { Config } from 'tailwindcss'
import {
  colors,
  spacing,
  typography,
  shadows,
  borders,
  transitions,
  opacities,
  zIndex,
  breakpoints,
  maxWidth,
} from './lib/styles/tokens'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors,
      spacing,
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      lineHeight: typography.lineHeight,
      boxShadow: shadows,
      borderWidth: borders.width,
      borderRadius: borders.radius,
      borderColor: borders.colors,
      transitionDuration: transitions.duration,
      transitionTimingFunction: transitions.timing,
      opacity: opacities,
      zIndex,
      screens: breakpoints,
      maxWidth,
    },
  },
  plugins: [],
}
export default config
