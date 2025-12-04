/**
 * Centralized color system
 * 
 * IMPORTANT: To change colors throughout the app, update the CSS variables in:
 * src/styles.css in the :root section
 * 
 * This file provides TypeScript access to the same colors for use in JS/TS code
 */

export const colors = {
  // Primary brand colors - These match the CSS variables in styles.css
  // Update both this file AND styles.css when changing colors
  orange: {
    DEFAULT: '#EF671D',
    light: '#F58A4A',
    medium: '#E6752F',
    dark: '#D85A1A',
  },
  
  // Neutral colors
  black: '#000000',
  white: '#FFFFFF',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
} as const

// Helper function to get color with opacity
export function colorWithOpacity(color: string, opacity: number): string {
  // Convert hex to rgb
  const hex = color.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

// CSS variable names for use in inline styles
export const cssVars = {
  orange: 'var(--color-orange)',
  orangeLight: 'var(--color-orange-light)',
  orangeMedium: 'var(--color-orange-medium)',
  orangeDark: 'var(--color-orange-dark)',
} as const

