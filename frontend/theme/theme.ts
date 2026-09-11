import { createTheme, ThemeOptions } from '@mui/material/styles';
import { colors, typography, spacing, borderRadius, shadows, transitions } from './designTokens';

/**
 * MediMind AI - Custom MUI Theme
 * 
 * A calm, trustworthy, premium healthcare design system
 * Simple enough for a 5-year-old, professional enough for a hospital
 */

const touchTargets = {
  minimum: '44px',
  comfortable: '48px',
  large: '56px',
};

const baseTheme: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary.main,
      light: colors.primary.light,
      dark: colors.primary.dark,
      contrastText: colors.primary.contrastText,
    },
    secondary: {
      main: colors.secondary.main,
      light: colors.secondary.light,
      dark: colors.secondary.dark,
      contrastText: colors.secondary.contrastText,
    },
    success: {
      main: colors.success.main,
      light: colors.success.light,
      dark: colors.success.dark,
    },
    warning: {
      main: colors.warning.main,
      light: colors.warning.light,
      dark: colors.warning.dark,
    },
    error: {
      main: colors.error.main,
      light: colors.error.light,
      dark: colors.error.dark,
    },
    info: {
      main: colors.info.main,
      light: colors.info.light,
      dark: colors.info.dark,
    },
    background: {
      default: colors.background.default,
      paper: colors.background.paper,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
      disabled: colors.text.disabled,
    },
    divider: colors.border.main,
    // Ensure critical colors are used sparingly
    action: {
      active: colors.primary.main,
      hover: colors.primary[50],
      selected: colors.primary[100],
      disabled: colors.text.disabled,
      disabledBackground: colors.grey[100],
      focus: colors.primary[50],
    },
  },
  
  typography: {
    fontFamily: typography.fontFamily,
    fontSize: 16,
    fontWeightLight: typography.fontWeight.light,
    fontWeightRegular: typography.fontWeight.regular,
    fontWeightMedium: typography.fontWeight.medium,
    fontWeightBold: typography.fontWeight.bold,
    
    h1: {
      fontSize: typography.fontSize['4xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.tight,
      letterSpacing: '-0.02em',
      color: colors.text.primary,
    },
    h2: {
      fontSize: typography.fontSize['3xl'],
      fontWeight: typography.fontWeight.bold,
      lineHeight: typography.lineHeight.tight,
      letterSpacing: '-0.01em',
      color: colors.text.primary,
    },
    h3: {
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.snug,
      color: colors.text.primary,
    },
    h4: {
      fontSize: typography.fontSize.xl,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.snug,
      color: colors.text.primary,
    },
    h5: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.normal,
      color: colors.text.primary,
    },
    h6: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.normal,
      color: colors.text.primary,
    },
    subtitle1: {
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.regular,
      lineHeight: typography.lineHeight.relaxed,
      color: colors.text.secondary,
    },
    subtitle2: {
      fontSize: typography.fontSize.base,
      fontWeight: typography.fontWeight.medium,
      lineHeight: typography.lineHeight.normal,
      color: colors.text.secondary,
    },
    body1: {
      fontSize: typography.fontSize.base,
      lineHeight: typography.lineHeight.relaxed,
      color: colors.text.primary,
    },
    body2: {
      fontSize: typography.fontSize.sm,
      lineHeight: typography.lineHeight.relaxed,
      color: colors.text.secondary,
    },
    button: {
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.normal,
      textTransform: 'none',
      letterSpacing: '0.02em',
    },
    caption: {
      fontSize: typography.fontSize.xs,
      lineHeight: typography.lineHeight.normal,
      color: colors.text.secondary,
    },
    overline: {
      fontSize: typography.fontSize.xs,
      fontWeight: typography.fontWeight.semibold,
      lineHeight: typography.lineHeight.normal,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: colors.text.secondary,
    },
  },
  
  spacing: 8,
  
  shape: {
    borderRadius: 8,
  },
  
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  
  shadows: [
    shadows.none,
    shadows.sm,
    shadows.base,
    shadows.md,
    shadows.lg,
    shadows.xl,
    shadows['2xl'],
    shadows.inner,
    ...Array(17).fill(shadows.none),
  ] as any,
  
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
  },
  
  zIndex: {
    mobileStepper: 1000,
    fab: 1050,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
  
  components: {
    // Button component
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.xl,
          padding: '12px 24px',
          minHeight: touchTargets.minimum,
          minWidth: touchTargets.minimum,
          fontWeight: typography.fontWeight.semibold,
          textTransform: 'none',
          transition: `all ${transitions.duration.fast} ${transitions.easing.easeInOut}`,
        },
        contained: {
          boxShadow: shadows.sm,
          '&:hover': {
            boxShadow: shadows.md,
          },
        },
        sizeSmall: {
          padding: '8px 16px',
          fontSize: typography.fontSize.sm,
        },
        sizeLarge: {
          padding: '16px 32px',
          fontSize: typography.fontSize.base,
        },
      },
      defaultProps: {
        disableElevation: false,
      },
    },
    
    // Card component
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius['2xl'],
          boxShadow: shadows.base,
          border: `1px solid ${colors.border.main}`,
          transition: `all ${transitions.duration.fast} ${transitions.easing.easeInOut}`,
          '&:hover': {
            boxShadow: shadows.md,
          },
        },
      },
    },
    
    // Input component
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.xl,
          minHeight: touchTargets.minimum,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.border.main,
            transition: `border-color ${transitions.duration.fast} ${transitions.easing.easeInOut}`,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.primary.light,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: colors.primary.main,
            borderWidth: 2,
          },
        },
        input: {
          padding: '12px 16px',
          fontSize: typography.fontSize.base,
        },
      },
    },
    
    // Alert component
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.xl,
          padding: '12px 16px',
        },
      },
    },
    
    // Dialog component
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: borderRadius['2xl'],
          boxShadow: shadows.xl,
        },
      },
    },
    
    // Chip component
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.full,
          fontWeight: typography.fontWeight.medium,
          minHeight: touchTargets.minimum,
        },
      },
    },
    
    // Tab component
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: touchTargets.minimum,
          textTransform: 'none',
          fontWeight: typography.fontWeight.medium,
        },
      },
    },
    
    // Linear Progress component
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: borderRadius.full,
          height: 8,
        },
      },
    },
    
    // AppBar component
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background.paper,
          color: colors.text.primary,
          boxShadow: shadows.sm,
          borderBottom: `1px solid ${colors.border.main}`,
        },
      },
    },
    
    // Drawer component
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${colors.border.main}`,
          backgroundColor: colors.background.paper,
        },
      },
    },
    
    // Tooltip component
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: colors.text.primary,
          borderRadius: borderRadius.base,
          fontSize: typography.fontSize.sm,
          padding: '8px 12px',
        },
      },
    },
    
    // Divider component
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: colors.border.main,
        },
      },
    },
  },
};

// Create the theme
const theme = createTheme(baseTheme);

// Create RTL theme for Urdu
const rtlTheme = createTheme({
  ...baseTheme,
  direction: 'rtl',
  typography: {
    ...baseTheme.typography,
    fontFamily: typography.fontFamilyUrdu,
  },
});

export { theme, rtlTheme };
export default theme;
