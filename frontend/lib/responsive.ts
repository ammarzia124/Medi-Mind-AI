/**
 * Responsive Design Utilities
 * 
 * Provides helpers for mobile-first responsive design,
 * touch targets, and breakpoint management.
 */

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const breakpoints = {
  xs: 320,   // Small mobile
  sm: 375,   // Standard mobile
  md: 768,   // Tablet
  lg: 1024,  // Laptop
  xl: 1440,  // Desktop
  '2xl': 1920, // Large desktop
} as const;

export type Breakpoint = keyof typeof breakpoints;

// ============================================================================
// DEVICE DETECTION
// ============================================================================

/**
 * Detects current device type based on viewport width
 */
export function getDeviceType(): 'mobile' | 'tablet' | 'laptop' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  
  if (width < breakpoints.md) return 'mobile';
  if (width < breakpoints.lg) return 'tablet';
  if (width < breakpoints.xl) return 'laptop';
  return 'desktop';
}

/**
 * Checks if device is touch-enabled
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Checks if viewport is mobile-sized
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < breakpoints.md;
}

/**
 * Checks if viewport is tablet-sized
 */
export function isTablet(): boolean {
  if (typeof window === 'undefined') return false;
  const width = window.innerWidth;
  return width >= breakpoints.md && width < breakpoints.lg;
}

// ============================================================================
// TOUCH TARGET UTILITIES
// ============================================================================

/**
 * Minimum touch target size (WCAG 2.5.5)
 */
export const MIN_TOUCH_TARGET = 44; // pixels

/**
 * Returns CSS classes for touch-friendly sizing
 */
export function getTouchTargetClasses(size: 'sm' | 'md' | 'lg' = 'md') {
  const sizes = {
    sm: 'min-h-[44px] min-w-[44px]',
    md: 'min-h-[48px] min-w-[48px]',
    lg: 'min-h-[56px] min-w-[56px]',
  };
  
  return sizes[size];
}

/**
 * Returns touch-friendly padding classes
 */
export function getTouchPadding(size: 'sm' | 'md' | 'lg' = 'md') {
  const padding = {
    sm: 'px-4 py-3',
    md: 'px-6 py-4',
    lg: 'px-8 py-5',
  };
  
  return padding[size];
}

// ============================================================================
// RESPONSIVE SPACING
// ============================================================================

/**
 * Returns responsive spacing classes
 */
export function getResponsiveSpacing(type: 'gap' | 'padding' | 'margin') {
  const spacing = {
    gap: 'gap-4 sm:gap-6 lg:gap-8',
    padding: 'p-4 sm:p-6 lg:p-8',
    margin: 'm-4 sm:m-6 lg:m-8',
  };
  
  return spacing[type];
}

/**
 * Returns responsive container classes
 */
export function getResponsiveContainer() {
  return 'w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';
}

// ============================================================================
// RESPONSIVE TYPOGRAPHY
// ============================================================================

/**
 * Returns responsive font size classes
 */
export function getResponsiveFontSize(size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl') {
  const sizes = {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    base: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-xl sm:text-2xl',
    '2xl': 'text-2xl sm:text-3xl',
    '3xl': 'text-3xl sm:text-4xl',
    '4xl': 'text-4xl sm:text-5xl',
  };
  
  return sizes[size];
}

/**
 * Returns responsive line height classes
 */
export function getResponsiveLineHeight(tight: boolean = false) {
  return tight ? 'leading-tight sm:leading-snug' : 'leading-normal sm:leading-relaxed';
}

// ============================================================================
// RESPONSIVE GRID
// ============================================================================

/**
 * Returns responsive grid columns
 */
export function getResponsiveGrid(columns: { mobile: number; tablet?: number; desktop: number }) {
  const tablet = columns.tablet || Math.ceil((columns.mobile + columns.desktop) / 2);
  
  return `grid grid-cols-${columns.mobile} sm:grid-cols-${tablet} lg:grid-cols-${columns.desktop}`;
}

/**
 * Returns responsive grid template (more flexible)
 */
export function getResponsiveGridTemplate(
  mobileCols: number,
  tabletCols?: number,
  desktopCols?: number
) {
  const tablet = tabletCols || Math.ceil((mobileCols + (desktopCols || mobileCols * 2)) / 2);
  const desktop = desktopCols || mobileCols * 2;
  
  return {
    mobile: `grid-cols-${mobileCols}`,
    tablet: `sm:grid-cols-${tablet}`,
    desktop: `lg:grid-cols-${desktop}`,
    combined: `grid grid-cols-${mobileCols} sm:grid-cols-${tablet} lg:grid-cols-${desktop}`,
  };
}

// ============================================================================
// RESPONSIVE VISIBILITY
// ============================================================================

/**
 * Returns classes to show only on mobile
 */
export function showOnMobileOnly() {
  return 'block lg:hidden';
}

/**
 * Returns classes to show only on tablet
 */
export function showOnTabletOnly() {
  return 'hidden sm:block lg:hidden';
}

/**
 * Returns classes to show only on desktop
 */
export function showOnDesktopOnly() {
  return 'hidden lg:block';
}

/**
 * Returns classes to hide on mobile
 */
export function hideOnMobile() {
  return 'hidden sm:block';
}

/**
 * Returns classes to hide on desktop
 */
export function hideOnDesktop() {
  return 'block lg:hidden';
}

// ============================================================================
// RESPONSIVE IMAGES
// ============================================================================

/**
 * Returns responsive image classes
 */
export function getResponsiveImageClasses() {
  return 'w-full h-auto max-w-full';
}

/**
 * Returns responsive aspect ratio classes
 */
export function getResponsiveAspectRatio(ratio: 'square' | 'video' | 'portrait' = 'video') {
  const ratios = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
  };
  
  return ratios[ratio];
}

// ============================================================================
// RESPONSIVE NAVIGATION
// ============================================================================

/**
 * Returns classes for responsive navigation
 */
export function getResponsiveNavClasses() {
  return {
    container: 'flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8',
    logo: 'flex items-center gap-2',
    desktopMenu: 'hidden lg:flex items-center gap-6',
    mobileMenu: 'lg:hidden',
    menuItem: 'min-h-[44px] px-4 py-2 flex items-center',
  };
}

// ============================================================================
// RESPONSIVE CARDS
// ============================================================================

/**
 * Returns responsive card classes
 */
export function getResponsiveCardClasses() {
  return 'rounded-2xl p-4 sm:p-6 lg:p-8';
}

/**
 * Returns responsive card grid
 */
export function getResponsiveCardGrid(maxCols: number = 3) {
  if (maxCols === 1) {
    return 'grid grid-cols-1 gap-4 sm:gap-6';
  }
  if (maxCols === 2) {
    return 'grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6';
  }
  return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6';
}

// ============================================================================
// RESPONSIVE BUTTONS
// ============================================================================

/**
 * Returns responsive button classes
 */
export function getResponsiveButtonClasses(variant: 'primary' | 'secondary' | 'ghost' = 'primary') {
  const base = 'min-h-[44px] px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-medium transition-all';
  
  const variants = {
    primary: `${base} bg-primary text-white hover:bg-primary-dark`,
    secondary: `${base} bg-surface border border-border text-text-primary hover:bg-background`,
    ghost: `${base} text-text-secondary hover:bg-background`,
  };
  
  return variants[variant];
}

// ============================================================================
// RESPONSIVE FORMS
// ============================================================================

/**
 * Returns responsive form input classes
 */
export function getResponsiveInputClasses() {
  return 'w-full min-h-[44px] px-4 py-3 rounded-xl border border-border bg-background text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary-light';
}

/**
 * Returns responsive form label classes
 */
export function getResponsiveLabelClasses() {
  return 'block text-sm sm:text-base font-medium text-text-primary mb-2';
}

// ============================================================================
// ORIENTATION DETECTION
// ============================================================================

/**
 * Checks if device is in landscape orientation
 */
export function isLandscape(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth > window.innerHeight;
}

/**
 * Checks if device is in portrait orientation
 */
export function isPortrait(): boolean {
  if (typeof window === 'undefined') return true;
  return window.innerHeight >= window.innerWidth;
}

// ============================================================================
// VIEWPORT UTILITIES
// ============================================================================

/**
 * Gets viewport dimensions
 */
export function getViewportDimensions() {
  if (typeof window === 'undefined') {
    return { width: 0, height: 0 };
  }
  
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

/**
 * Checks if viewport is below a certain width
 */
export function isBelowBreakpoint(breakpoint: Breakpoint): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < breakpoints[breakpoint];
}

/**
 * Checks if viewport is above a certain width
 */
export function isAboveBreakpoint(breakpoint: Breakpoint): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints[breakpoint];
}
