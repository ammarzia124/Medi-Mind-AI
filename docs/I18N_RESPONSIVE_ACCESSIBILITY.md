# MediMind AI - Language, Responsive & Accessibility Guide

## 🌍 Internationalization (i18n)

### Supported Languages

| Language | Code | Direction | Native Name |
|----------|------|-----------|-------------|
| English | `en` | LTR | English |
| Urdu | `ur` | RTL | اردو |

### Adding a New Language

The architecture supports easy addition of new languages:

#### Step 1: Update Language Config

```typescript
// frontend/data/translations.ts
export const supportedLanguages: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr', flag: '🇬🇧' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', direction: 'rtl', flag: '🇵🇰' },
  // Add new language:
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl', flag: '🇸🇦' },
];
```

#### Step 2: Add Translations

```typescript
export const translations = {
  en: { /* ... */ },
  ur: { /* ... */ },
  ar: {
    appName: 'ميدي مايند',
    home: 'الرئيسية',
    // ... all other keys
  },
};
```

#### Step 3: Update Type

```typescript
export type Language = 'en' | 'ur' | 'ar';
```

The language switcher automatically cycles through all available languages.

### RTL Support

RTL languages are fully supported:

- **Automatic direction**: `dir="rtl"` is set on the root element
- **Text alignment**: Right-aligned for RTL, left-aligned for LTR
- **Icon mirroring**: Icons like arrows are mirrored in RTL
- **Typography**: Urdu uses Noto Nastaliq Urdu with proper line-height (2.2)
- **Layout**: Flexbox and grid automatically adjust for RTL

### Urdu Typography

Urdu text uses specialized typography:

```css
.urdu-text {
  font-family: 'Noto Nastaliq Urdu', serif;
  direction: rtl;
  text-align: right;
  line-height: 2.2;
}
```

Headings and paragraphs have increased line-height (2.4) for better readability.

---

## 📱 Responsive Design

### Breakpoints

| Name | Width | Device |
|------|-------|--------|
| `xs` | 320px | Small mobile |
| `sm` | 375px | Standard mobile |
| `md` | 768px | Tablet |
| `lg` | 1024px | Laptop |
| `xl` | 1440px | Desktop |
| `2xl` | 1920px | Large desktop |

### Mobile-First Approach

All components are designed mobile-first:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
  {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
</div>
```

### Touch Targets

**Minimum touch target: 44px** (WCAG 2.5.5)

All interactive elements meet this requirement:

```css
button, a, [role="button"] {
  min-height: 44px;
  min-width: 44px;
}
```

### Responsive Utilities

```typescript
import { 
  getTouchTargetClasses, 
  getResponsiveGrid, 
  isMobile 
} from '../lib/responsive';

// Touch-friendly sizing
<div className={getTouchTargetClasses('md')} />

// Responsive grid
<div className={getResponsiveGrid({ mobile: 1, tablet: 2, desktop: 3 })} />

// Device detection
if (isMobile()) {
  // Mobile-specific logic
}
```

### Fluid Typography

Font sizes scale with viewport:

```css
html { font-size: 16px; }

@media (max-width: 640px) {
  html { font-size: 15px; }
}

@media (min-width: 1920px) {
  html { font-size: 18px; }
}
```

### No Horizontal Scroll

The app prevents horizontal scrolling at all breakpoints:

```css
body, #root {
  overflow-x: hidden;
  max-width: 100vw;
}
```

---

## ♿ Accessibility (WCAG 2.1 AA)

### Keyboard Navigation

All interactive elements are keyboard accessible:

- **Tab**: Navigate between elements
- **Enter/Space**: Activate buttons
- **Escape**: Close modals/menus
- **Arrow keys**: Navigate within components

### Focus States

Visible focus indicators for keyboard users:

```css
*:focus-visible {
  outline: 3px solid #176B67;
  outline-offset: 2px;
}
```

### Skip to Main Content

A skip link allows keyboard users to bypass navigation:

```tsx
<a href="#main-content" className="skip-to-main">
  Skip to main content
</a>
```

### Semantic HTML

Proper semantic structure:

```tsx
<header role="banner">...</header>
<nav role="navigation" aria-label="Main navigation">...</nav>
<main id="main-content" role="main">...</main>
<footer role="contentinfo">...</footer>
```

### ARIA Labels

All icon-only buttons have aria-labels:

```tsx
<button aria-label="Switch language">
  <Globe aria-hidden="true" />
</button>
```

### Current Page Indicator

Navigation uses `aria-current="page"` for the active page:

```tsx
<button aria-current={isActive ? 'page' : undefined}>
  Home
</button>
```

### Screen Reader Support

#### Live Regions

Dynamic content uses aria-live:

```tsx
<div aria-live="polite" aria-atomic="true">
  {analysisResult}
</div>
```

#### Decorative vs Meaningful Icons

```tsx
// Decorative (hidden from screen readers)
<Heart aria-hidden="true" />

// Meaningful (announced to screen readers)
<Heart role="img" aria-label="Heart health" />
```

### Color & Contrast

**Never rely exclusively on color:**

Every status includes:
- ✅ Color (visual)
- ✅ Text label (e.g., "High", "Moderate")
- ✅ Icon/Emoji (e.g., 🔴, 🟡, 🟢)

Example:
```tsx
<span className="text-critical bg-critical/10 px-3 py-1 rounded-full">
  🔴 High
</span>
```

### Contrast Ratios

All text meets WCAG AA contrast requirements:

- **Normal text**: 4.5:1 minimum
- **Large text**: 3:1 minimum
- **UI components**: 3:1 minimum

### Reduced Motion

Respects user's motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### High Contrast Mode

Supports Windows High Contrast mode:

```css
@media (prefers-contrast: high) {
  :root {
    --color-border: #000000;
    --color-text-secondary: #000000;
  }
}
```

### Form Accessibility

All forms include:

- ✅ Labels for all inputs
- ✅ Error messages with `aria-describedby`
- ✅ Required field indicators
- ✅ Autocomplete attributes
- ✅ Proper input types

Example:
```tsx
<label htmlFor="symptom-input">Describe your symptoms</label>
<textarea 
  id="symptom-input"
  aria-describedby="symptom-help symptom-error"
  aria-required="true"
/>
<p id="symptom-help">Be as specific as possible</p>
<p id="symptom-error" role="alert">Please enter at least 3 characters</p>
```

### Error Messages

Errors are announced to screen readers:

```tsx
<div role="alert" aria-live="assertive" className="text-critical">
  {errorMessage}
</div>
```

### Accessibility Utilities

```typescript
import { 
  ariaLabels, 
  trapFocus, 
  announceToScreenReader,
  createAccessibleFieldProps 
} from '../lib/accessibility';

// Use predefined labels
<button aria-label={ariaLabels.goBack}>
  <ArrowLeft />
</button>

// Trap focus in modal
useEffect(() => {
  return trapFocus(modalRef.current);
}, []);

// Announce to screen readers
announceToScreenReader('Analysis complete', 'polite');

// Create accessible form fields
const fieldProps = createAccessibleFieldProps('Email');
```

---

## 🧪 Testing Checklist

### Language Testing

- [ ] English text displays correctly
- [ ] Urdu text displays with proper font
- [ ] RTL layout works correctly
- [ ] Language switcher cycles through all languages
- [ ] All UI text is translated
- [ ] Mixed LTR/RTL content displays correctly

### Responsive Testing

Test at all breakpoints:

- [ ] 320px (small mobile)
- [ ] 375px (standard mobile)
- [ ] 390px (large mobile)
- [ ] 768px (tablet)
- [ ] 1024px (laptop)
- [ ] 1440px (desktop)
- [ ] 1920px+ (large desktop)

Check:
- [ ] No horizontal scrolling
- [ ] Touch targets are 44px+
- [ ] Text is readable at all sizes
- [ ] Images scale properly
- [ ] Navigation works on all devices
- [ ] Forms are usable on mobile

### Accessibility Testing

- [ ] Keyboard navigation works throughout
- [ ] Focus states are visible
- [ ] Skip to main content link works
- [ ] Screen reader announces content correctly
- [ ] ARIA labels are present on icon buttons
- [ ] Color is not the only indicator
- [ ] Contrast ratios meet WCAG AA
- [ ] Reduced motion is respected
- [ ] High contrast mode works
- [ ] Form labels are associated
- [ ] Error messages are announced
- [ ] Heading hierarchy is correct
- [ ] Landmark regions are defined

### Tools for Testing

- **Lighthouse**: Run accessibility audit
- **axe DevTools**: Detailed accessibility testing
- **VoiceOver/TalkBack**: Screen reader testing
- **Keyboard**: Test full keyboard navigation
- **Browser DevTools**: Check contrast, focus states
- **Responsive Design Mode**: Test all breakpoints

---

## 📚 Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [RTL CSS Guide](https://rtlstyling.com/)

---

**Last Updated**: 2024-01-01  
**Version**: 1.0.0  
**WCAG Level**: AA
