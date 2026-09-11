# MediMind AI - Design System Documentation

## Overview

MediMind AI follows a comprehensive design system built on Material UI (MUI) with custom design tokens. The system is designed to be:

- **Simple enough for a 5-year-old** - Clear, intuitive interfaces
- **Professional enough for a hospital** - Trustworthy, clinical appearance
- **Beautiful enough for a premium startup** - Modern, polished aesthetics

## Design Principles

### Core Values
- **Calm** - Soothing colors, gentle animations
- **Human** - Approachable, empathetic design
- **Intelligent** - Smart defaults, clear hierarchy
- **Trustworthy** - Professional, reliable appearance
- **Modern** - Clean, contemporary aesthetics
- **Premium** - High-quality, polished feel
- **Approachable** - Friendly, welcoming design

### What to Avoid
- Excessive glassmorphism
- Excessive gradients
- Visual clutter
- Giant hero sections
- Unnecessary animations
- Tiny text
- Complex navigation

## Color System

### Primary Colors
```typescript
Primary: #176B67 (Deep Teal)
Secondary: #4FA7A1 (Soft Teal)
```

### Background Colors
```typescript
Background: #F7F9F8 (Warm Off-White)
Surface: #FFFFFF (Pure White)
```

### Text Colors
```typescript
Primary Text: #18302F (Dark Teal)
Secondary Text: #60706F (Gray)
```

### Status Colors
```typescript
Success: #3D8B67 (Green)
Warning: #C58B32 (Amber)
Critical: #C95757 (Red)
Info: #4F7FA3 (Blue)
Border: #DDE7E5 (Light Gray)
```

### Color Usage Rules
1. **Verify contrast ratios** before using colors (WCAG AA minimum)
2. **Use critical colors sparingly** - only for true emergencies
3. **Never create interfaces dominated by red** - use as accent only
4. **Status indicators must include**: Color + Text + Icon (never color alone)

## Typography

### Font Families
- **Primary**: Inter (Latin/English)
- **Urdu**: Noto Nastaliq Urdu (RTL support)

### Font Sizes
```typescript
xs: 0.75rem (12px)
sm: 0.875rem (14px)
base: 1rem (16px)
lg: 1.125rem (18px)
xl: 1.25rem (20px)
2xl: 1.5rem (24px)
3xl: 1.875rem (30px)
4xl: 2.25rem (36px)
5xl: 3rem (48px)
```

### Font Weights
```typescript
Light: 300
Regular: 400
Medium: 500
Semibold: 600
Bold: 700
```

### Line Heights
```typescript
Tight: 1.25
Snug: 1.375
Normal: 1.5
Relaxed: 1.625
Loose: 2
Urdu: 2.2 (special for Nastaliq script)
```

## Spacing System

Based on 8px grid:
```typescript
1: 0.25rem (4px)
2: 0.5rem (8px)
3: 0.75rem (12px)
4: 1rem (16px)
5: 1.25rem (20px)
6: 1.5rem (24px)
8: 2rem (32px)
10: 2.5rem (40px)
12: 3rem (48px)
16: 4rem (64px)
```

## Breakpoints

```typescript
xs: 0px (mobile)
sm: 600px (large mobile)
md: 900px (tablet)
lg: 1200px (laptop)
xl: 1536px (desktop)
```

## Component Specifications

### AppShell
Main application layout wrapper with:
- Fixed header with logo and navigation
- Responsive sidebar (desktop) / drawer (mobile)
- Main content area with proper spacing
- Mobile-first responsive design

### HealthActionCard
Interactive card for health actions:
- Icon container with primary color background
- Title and description
- Optional severity badge
- Optional notification badge
- Hover effects and transitions

### SeverityIndicator
Visual indicator for severity levels:
- Low (green) - CheckCircle icon
- Moderate (amber) - Warning icon
- High (red) - Error icon
- Numeric support (1-5 scale)
- Configurable size and label display

### EmergencyAlert
Critical alert for medical emergencies:
- Red border and background
- Warning icon
- Clear emergency message
- Action button for immediate care
- Dismissible option

### EmptyState
Placeholder for empty content:
- Circular icon container
- Title and description
- Optional action button
- Centered layout

### LoadingSkeleton
Loading placeholder with variants:
- Card variant
- List variant
- Form variant
- Profile variant
- Configurable count

### ErrorState
Error display component:
- Error icon
- Title and message
- Optional retry button
- Optional expandable details

## Page Layouts

### Dashboard
```
┌─────────────────────────────────────┐
│ Header (Logo + Language Switcher)   │
├─────────────────────────────────────┤
│ Welcome Card (Gradient Background)  │
├─────────────────────────────────────┤
│ Quick Actions (3-4 Cards Grid)      │
├─────────────────────────────────────┤
│ Recent Activity (Timeline)          │
├─────────────────────────────────────┤
│ Health Summary (Stats Cards)        │
└─────────────────────────────────────┘
```

### Symptom Checker
```
┌─────────────────────────────────────┐
│ Back Button + Title                 │
├─────────────────────────────────────┤
│ Input Card (Textarea + Quick Tags)  │
├─────────────────────────────────────┤
│ Results (Conditional)               │
│ - Severity Indicator                │
│ - Care Navigation Banner            │
│ - Possible Explanations             │
│ - Warning Signs                     │
│ - Recommended Action                │
│ - Self-Care Options                 │
└─────────────────────────────────────┘
```

### Lab Report Analyzer
```
┌─────────────────────────────────────┐
│ Back Button + Title                 │
├─────────────────────────────────────┤
│ Upload Zone (Drag & Drop)           │
├─────────────────────────────────────┤
│ Input Card (Textarea + Quick Tests) │
├─────────────────────────────────────┤
│ Results (Conditional)               │
│ - Important Note Banner             │
│ - Summary                           │
│ - Individual Results (Cards)        │
│ - Warning Signs                     │
│ - Next Steps                        │
└─────────────────────────────────────┘
```

### Health Timeline
```
┌─────────────────────────────────────┐
│ Title + Add Entry Button            │
├─────────────────────────────────────┤
│ Timeline (Vertical List)            │
│ - Date Headers                      │
│ - Event Cards (Icon + Content)      │
│ - Severity Indicators               │
└─────────────────────────────────────┘
```

## Responsive Rules

### Mobile-First Approach
All designs start mobile-first, then enhance for larger screens.

### Breakpoint Behavior
- **xs (0-599px)**: Single column, stacked layout, bottom navigation
- **sm (600-899px)**: Single column, larger touch targets
- **md (900-1199px)**: Two columns, sidebar navigation
- **lg (1200-1535px)**: Multi-column, full sidebar
- **xl (1536px+)**: Maximum width container, centered

### Touch Targets
- **Minimum**: 44px × 44px (WCAG requirement)
- **Comfortable**: 48px × 48px
- **Large**: 56px × 56px

### Mobile-Specific Rules
1. Bottom navigation bar (fixed)
2. Larger touch targets
3. Simplified layouts
4. Swipe gestures where appropriate
5. No hover-dependent interactions

## Accessibility Rules

### WCAG 2.1 AA Compliance

#### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Tab order must be logical
- Focus indicators must be visible
- Escape key closes modals/dialogs

#### Focus States
```typescript
*:focus-visible {
  outline: 3px solid #176B67;
  outline-offset: 2px;
}
```

#### Screen Reader Support
- All images need alt text
- Icon buttons need aria-labels
- Form inputs need labels
- Error messages use aria-live
- Dynamic content uses aria-live regions

#### Color & Contrast
- **Normal text**: 4.5:1 minimum contrast ratio
- **Large text**: 3:1 minimum contrast ratio
- **UI components**: 3:1 minimum contrast ratio
- **Never rely on color alone** - always include text/icon

#### Reduced Motion
```typescript
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

#### High Contrast Mode
```typescript
@media (prefers-contrast: high) {
  // Increase border widths
  // Use pure black/white
  // Remove subtle shadows
}
```

## Animation Rules

### Principles
1. **Purposeful** - Animations must serve a purpose
2. **Subtle** - Don't distract from content
3. **Fast** - Keep animations quick (150-300ms)
4. **Consistent** - Use same easing curves
5. **Respectful** - Honor reduced motion preferences

### Duration Guidelines
```typescript
Fastest: 150ms (micro-interactions)
Fast: 200ms (hover states)
Normal: 300ms (page transitions)
Slow: 500ms (complex animations)
```

### Easing Curves
```typescript
easeInOut: cubic-bezier(0.4, 0, 0.2, 1) // Default
easeOut: cubic-bezier(0.0, 0, 0.2, 1)   // Entering
easeIn: cubic-bezier(0.4, 0, 1, 1)      // Exiting
sharp: cubic-bezier(0.4, 0, 0.6, 1)     // Quick
```

### When to Animate
- ✅ Page transitions
- ✅ Modal open/close
- ✅ Hover states
- ✅ Loading states
- ✅ Success/error feedback
- ❌ Decorative elements
- ❌ Large content blocks
- ❌ Text content

## Urdu/RTL Rules

### Layout Direction
- `dir="rtl"` on root element
- Flexbox and Grid automatically adjust
- Margins and paddings mirror correctly

### Typography
```typescript
font-family: 'Noto Nastaliq Urdu', serif;
direction: rtl;
text-align: right;
line-height: 2.2; // Special for Nastaliq
```

### Icon Handling
- Directional icons (arrows) must mirror
- Use `rtl-mirror` class for icons
- Non-directional icons stay as-is

### Navigation
- Sidebar moves to right side
- Bottom navigation stays at bottom
- Back button points right (→)

### Spacing
- Natural spacing maintained
- No special RTL adjustments needed
- MUI handles most RTL automatically

## Implementation Guide

### Using Design Tokens
```typescript
import { colors, spacing, typography } from '../theme/designTokens';

const MyComponent = () => (
  <Box sx={{ 
    p: spacing[4], 
    color: colors.primary.main,
    fontSize: typography.fontSize.lg 
  }}>
    Content
  </Box>
);
```

### Using MUI Theme
```typescript
import { useTheme } from '@mui/material/styles';

const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <Box sx={{ 
      color: theme.palette.primary.main,
      p: theme.spacing(3)
    }}>
      Content
    </Box>
  );
};
```

### Creating Custom Components
```typescript
import { styled } from '@mui/material/styles';
import { colors, borderRadius } from '../theme/designTokens';

const CustomCard = styled(Card)({
  borderRadius: borderRadius['2xl'],
  backgroundColor: colors.background.paper,
  border: `1px solid ${colors.border.main}`,
  // ... more styles
});
```

## Best Practices

### Do
- ✅ Use design tokens for all values
- ✅ Follow mobile-first approach
- ✅ Test with keyboard navigation
- ✅ Test with screen readers
- ✅ Verify color contrast
- ✅ Use semantic HTML
- ✅ Provide loading states
- ✅ Handle error states gracefully
- ✅ Support both LTR and RTL

### Don't
- ❌ Use hardcoded colors/spacing
- ❌ Rely on color alone for meaning
- ❌ Skip accessibility testing
- ❌ Ignore mobile users
- ❌ Use tiny touch targets
- ❌ Create visual clutter
- ❌ Use excessive animations
- ❌ Forget error states
- ❌ Ignore RTL layout

## Resources

- [Material UI Documentation](https://mui.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design](https://material.io/design)
- [Accessibility Guide](https://www.a11yproject.com/)
- [RTL CSS Guide](https://rtlstyling.com/)

---

**Last Updated**: 2024-01-01  
**Version**: 1.0.0  
**Status**: Production Ready
