/**
 * MediMind AI Design Tokens
 * 
 * Single source of truth for all design values
 * Used by both MUI theme and Tailwind CSS
 */

export const colors = {
  // Primary palette
  primary: {
    main: '#176B67',
    light: '#4FA7A1',
    dark: '#0F4A47',
    contrastText: '#FFFFFF',
    50: '#E8F5F4',
    100: '#C5E8E6',
    200: '#8DD1CD',
    300: '#5BBAB5',
    400: '#3AA8A3',
    500: '#176B67',
    600: '#135C59',
    700: '#0F4A47',
    800: '#0B3835',
    900: '#072624',
  },
  
  // Secondary palette
  secondary: {
    main: '#4FA7A1',
    light: '#7FC4BF',
    dark: '#2F8A84',
    contrastText: '#FFFFFF',
  },
  
  // Background colors
  background: {
    default: '#F7F9F8',
    paper: '#FFFFFF',
    subtle: '#F0F4F3',
  },
  
  // Text colors
  text: {
    primary: '#18302F',
    secondary: '#60706F',
    disabled: '#9CA8A7',
    hint: '#60706F',
  },
  
  // Status colors
  success: {
    main: '#3D8B67',
    light: '#5FA882',
    dark: '#2A6B4E',
    contrastText: '#FFFFFF',
  },
  
  warning: {
    main: '#C58B32',
    light: '#D9A65C',
    dark: '#A06F24',
    contrastText: '#FFFFFF',
  },
  
  error: {
    main: '#C95757',
    light: '#E07A7A',
    dark: '#A84040',
    contrastText: '#FFFFFF',
  },
  
  info: {
    main: '#4F7FA3',
    light: '#7A9FBF',
    dark: '#3A6382',
    contrastText: '#FFFFFF',
  },
  
  // Neutral colors
  grey: {
    50: '#F7F9F8',
    100: '#F0F4F3',
    200: '#E4EBEA',
    300: '#D1DBDA',
    400: '#B8C5C4',
    500: '#9CA8A7',
    600: '#7A8887',
    700: '#60706F',
    800: '#4A5857',
    900: '#18302F',
  },
  
  // Border colors
  border: {
    main: '#DDE7E5',
    light: '#E8EFED',
    dark: '#C5D1CF',
  },
  
  // Severity colors
  severity: {
    low: '#3D8B67',
    moderate: '#C58B32',
    high: '#C95757',
    critical: '#A84040',
  },
} as const;

export const typography = {
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontFamilyUrdu: '"Noto Nastaliq Urdu", "Jameel Noori Nastaleeq", serif',
  
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },
  
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
    urdu: 2.2,
  },
} as const;

export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
} as const;

export const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  },
} as const;

export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px
  base: '0.5rem',   // 8px
  md: '0.625rem',   // 10px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  '3xl': '2rem',    // 32px
  full: '9999px',
} as const;

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
} as const;

export const transitions = {
  duration: {
    fastest: '150ms',
    fast: '200ms',
    normal: '300ms',
    slow: '500ms',
    slower: '700ms',
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
} as const;

export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  drawer: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

export const touchTargets = {
  minimum: '44px',
  comfortable: '48px',
  large: '56px',
} as const;

export default {
  colors,
  typography,
  spacing,
  breakpoints,
  borderRadius,
  shadows,
  transitions,
  zIndex,
  touchTargets,
};
