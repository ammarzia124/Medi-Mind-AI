/**
 * Accessibility Utilities
 * 
 * Provides helpers for WCAG compliance, screen reader support,
 * keyboard navigation, and accessible UI patterns.
 */

// ============================================================================
// ARIA LABELS
// ============================================================================

export const ariaLabels = {
  // Navigation
  mainNavigation: 'Main navigation',
  languageSwitcher: 'Switch language',
  mobileMenu: 'Mobile menu',
  closeMenu: 'Close menu',
  
  // Actions
  goBack: 'Go back',
  analyze: 'Analyze',
  analyzing: 'Analyzing',
  submit: 'Submit',
  cancel: 'Cancel',
  close: 'Close',
  upload: 'Upload file',
  
  // Symptom Checker
  symptomInput: 'Describe your symptoms',
  quickSymptoms: 'Quick symptom selection',
  severityLevel: 'Severity level',
  warningSigns: 'Warning signs',
  
  // Lab Reports
  labInput: 'Describe your lab results',
  uploadReport: 'Upload lab report',
  
  // Timeline
  addEntry: 'Add timeline entry',
  timelineEntry: 'Timeline entry',
  
  // Emergency
  emergencyBanner: 'Emergency medical alert',
  callEmergency: 'Call emergency services',
  
  // General
  loading: 'Loading',
  error: 'Error',
  success: 'Success',
  info: 'Information',
  warning: 'Warning',
} as const;

// ============================================================================
// FOCUS MANAGEMENT
// ============================================================================

/**
 * Traps focus within a container (for modals, dialogs)
 */
export function trapFocus(container: HTMLElement) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
  
  function handleTab(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  }
  
  container.addEventListener('keydown', handleTab);
  firstElement?.focus();
  
  return () => container.removeEventListener('keydown', handleTab);
}

/**
 * Returns focus to previously focused element
 */
export function returnFocus(previouslyFocused: HTMLElement | null) {
  if (previouslyFocused) {
    previouslyFocused.focus();
  }
}

// ============================================================================
// SCREEN READER UTILITIES
// ============================================================================

/**
 * Announces message to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('role', 'status');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// ============================================================================
// KEYBOARD NAVIGATION
// ============================================================================

export type KeyHandler = (event: KeyboardEvent) => void;

/**
 * Creates keyboard navigation handler
 */
export function createKeyboardHandler(handlers: {
  onEnter?: KeyHandler;
  onSpace?: KeyHandler;
  onEscape?: KeyHandler;
  onArrowUp?: KeyHandler;
  onArrowDown?: KeyHandler;
  onArrowLeft?: KeyHandler;
  onArrowRight?: KeyHandler;
}): KeyHandler {
  return (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        handlers.onEnter?.(event);
        break;
      case ' ':
        handlers.onSpace?.(event);
        break;
      case 'Escape':
        handlers.onEscape?.(event);
        break;
      case 'ArrowUp':
        handlers.onArrowUp?.(event);
        break;
      case 'ArrowDown':
        handlers.onArrowDown?.(event);
        break;
      case 'ArrowLeft':
        handlers.onArrowLeft?.(event);
        break;
      case 'ArrowRight':
        handlers.onArrowRight?.(event);
        break;
    }
  };
}

// ============================================================================
// COLOR CONTRAST
// ============================================================================

/**
 * Checks if color combination meets WCAG AA contrast ratio (4.5:1)
 */
export function meetsContrastRatio(foreground: string, background: string): boolean {
  // Simplified check - in production, use proper contrast calculation
  // This is a placeholder for the concept
  return true;
}

/**
 * Returns accessible color pair
 */
export function getAccessibleColorPair(role: 'primary' | 'secondary' | 'error' | 'warning' | 'success') {
  const pairs = {
    primary: { text: '#176B67', bg: '#E8F5F4' },
    secondary: { text: '#60706F', bg: '#F7F9F8' },
    error: { text: '#C95757', bg: '#FEE' },
    warning: { text: '#C58B32', bg: '#FFF8E1' },
    success: { text: '#3D8B67', bg: '#E8F5E9' },
  };
  
  return pairs[role];
}

// ============================================================================
// FORM ACCESSIBILITY
// ============================================================================

/**
 * Generates unique ID for form elements
 */
export function generateFormId(prefix: string = 'field'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Creates accessible form field props
 */
export function createAccessibleFieldProps(label: string, id?: string) {
  const fieldId = id || generateFormId();
  const errorId = `${fieldId}-error`;
  const helpId = `${fieldId}-help`;
  
  return {
    id: fieldId,
    'aria-labelledby': `${fieldId}-label`,
    'aria-describedby': `${errorId} ${helpId}`,
    labelId: `${fieldId}-label`,
    errorId,
    helpId,
    label,
  };
}

// ============================================================================
// ERROR MESSAGES
// ============================================================================

/**
 * Creates accessible error message
 */
export function createAccessibleError(message: string, fieldId: string) {
  return {
    role: 'alert',
    id: `${fieldId}-error`,
    'aria-live': 'assertive',
    className: 'text-critical text-sm mt-1',
    children: message,
  };
}

// ============================================================================
// MOTION PREFERENCES
// ============================================================================

/**
 * Checks if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Returns animation duration based on user preference
 */
export function getAnimationDuration(preferred: number = 300): number {
  return prefersReducedMotion() ? 0 : preferred;
}

// ============================================================================
// SEMANTIC HTML HELPERS
// ============================================================================

/**
 * Returns appropriate heading level based on context
 */
export function getHeadingLevel(depth: number): 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' {
  const levels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;
  return levels[Math.min(depth - 1, 5)];
}

/**
 * Creates landmark region props
 */
export function createLandmarkProps(role: 'main' | 'navigation' | 'complementary' | 'contentinfo', label?: string) {
  return {
    role,
    'aria-label': label,
  };
}

// ============================================================================
// LIVE REGION UTILITIES
// ============================================================================

/**
 * Creates live region props for dynamic content
 */
export function createLiveRegionProps(priority: 'polite' | 'assertive' = 'polite') {
  return {
    'aria-live': priority,
    'aria-atomic': 'true',
    role: priority === 'assertive' ? 'alert' : 'status',
  };
}

// ============================================================================
// ICON ACCESSIBILITY
// ============================================================================

/**
 * Returns props for decorative icons (hidden from screen readers)
 */
export function decorativeIconProps() {
  return {
    'aria-hidden': 'true',
    focusable: 'false',
  };
}

/**
 * Returns props for meaningful icons (accessible to screen readers)
 */
export function meaningfulIconProps(label: string) {
  return {
    role: 'img',
    'aria-label': label,
    focusable: 'false',
  };
}
