/**
 * Design Tokens
 *
 * Centralized design system tokens for the Meal Planner application.
 * These tokens define the foundational design values used throughout the app.
 *
 * Import these tokens in Tailwind config to extend the theme,
 * or use directly in components for programmatic styling.
 */

// ============================================================================
// COLORS
// ============================================================================

export const colors = {
  primary: {
    light: '#5EBFBF',
    DEFAULT: '#3F9BA6',
    dark: '#225C73',
  },
  accent: {
    DEFAULT: '#A66A5D',
    dark: '#8B5A4E',
  },
  success: {
    light: '#f0fdf4',
    DEFAULT: '#22c55e',
    dark: '#16a34a',
  },
  error: {
    light: '#fef2f2',
    DEFAULT: '#ef4444',
    dark: '#dc2626',
  },
  warning: {
    light: '#fefce8',
    DEFAULT: '#eab308',
    dark: '#ca8a04',
  },
  info: {
    light: '#eff6ff',
    DEFAULT: '#3b82f6',
    dark: '#2563eb',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  nutrition: {
    calories: '#3b82f6',
    protein: '#a855f7',
    carbs: '#eab308',
    fat: '#ef4444',
    fiber: '#22c55e',
  },
} as const;

// ============================================================================
// SPACING
// ============================================================================

export const spacing = {
  xs: '0.25rem',     // 4px
  sm: '0.5rem',      // 8px
  md: '0.75rem',     // 12px
  lg: '1rem',        // 16px
  xl: '1.5rem',      // 24px
  '2xl': '2rem',     // 32px
  '3xl': '3rem',     // 48px
  '4xl': '4rem',     // 64px
  '5xl': '6rem',     // 96px
  '6xl': '8rem',     // 128px
} as const;

export const gaps = {
  xs: '0.5rem',      // 8px - gap-2
  sm: '0.75rem',     // 12px - gap-3
  md: '1rem',        // 16px - gap-4
  lg: '1.5rem',      // 24px - gap-6
  xl: '2rem',        // 32px - gap-8
} as const;

export const spaceY = {
  xs: '1rem',        // space-y-4
  sm: '1.5rem',      // space-y-6
  md: '2rem',        // space-y-8
  lg: '3rem',        // space-y-12
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const typography = {
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const;

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
} as const;

// ============================================================================
// BORDERS
// ============================================================================

export const borders = {
  width: {
    DEFAULT: '1px',
    0: '0px',
    2: '2px',
    4: '4px',
    8: '8px',
  },
  radius: {
    none: '0',
    sm: '0.125rem',    // 2px
    DEFAULT: '0.25rem', // 4px
    md: '0.375rem',    // 6px
    lg: '0.5rem',      // 8px
    xl: '0.75rem',     // 12px
    '2xl': '1rem',     // 16px
    '3xl': '1.5rem',   // 24px
    full: '9999px',
  },
  colors: {
    gray: {
      light: '#e5e7eb',   // border-gray-200
      DEFAULT: '#d1d5db', // border-gray-300
      dark: '#9ca3af',    // border-gray-400
    },
    primary: {
      light: '#5EBFBF',
      DEFAULT: '#3F9BA6',
    },
    success: '#bbf7d0',   // border-green-200
    error: '#fecaca',     // border-red-200
    warning: '#fef08a',   // border-yellow-200
    info: '#bfdbfe',      // border-blue-200
  },
} as const;

// ============================================================================
// TRANSITIONS
// ============================================================================

export const transitions = {
  duration: {
    fast: '150ms',
    DEFAULT: '200ms',
    slow: '300ms',
  },
  timing: {
    DEFAULT: 'ease-in-out',
    in: 'ease-in',
    out: 'ease-out',
    linear: 'linear',
  },
} as const;

// ============================================================================
// OPACITIES
// ============================================================================

export const opacities = {
  0: '0',
  5: '0.05',
  10: '0.1',
  20: '0.2',
  25: '0.25',
  30: '0.3',
  40: '0.4',
  50: '0.5',
  60: '0.6',
  70: '0.7',
  75: '0.75',
  80: '0.8',
  90: '0.9',
  95: '0.95',
  100: '1',
} as const;

// ============================================================================
// Z-INDEX
// ============================================================================

export const zIndex = {
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  auto: 'auto',
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ============================================================================
// MAX WIDTHS
// ============================================================================

export const maxWidth = {
  xs: '20rem',       // 320px
  sm: '24rem',       // 384px
  md: '28rem',       // 448px
  lg: '32rem',       // 512px
  xl: '36rem',       // 576px
  '2xl': '42rem',    // 672px
  '3xl': '48rem',    // 768px
  '4xl': '56rem',    // 896px
  '5xl': '64rem',    // 1024px
  '6xl': '72rem',    // 1152px
  '7xl': '80rem',    // 1280px
  full: '100%',
  screen: '100vw',
} as const;
