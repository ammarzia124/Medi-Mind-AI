# MediMind AI - Development Behavior Guidelines

## Core Principle

**Never implement without understanding. Never ship without testing. Never compromise on quality.**

---

## Before Implementation

### 1. Understand the Requirement ✅

**Ask these questions:**
- What problem does this solve?
- Who is the user?
- What is the expected behavior?
- What are the edge cases?
- What could go wrong?
- Are there security implications?
- Are there accessibility requirements?
- Are there performance considerations?

**Actions:**
- [ ] Read the issue/ticket completely
- [ ] Ask clarifying questions if unclear
- [ ] Understand the user context
- [ ] Identify potential risks
- [ ] Review related features

### 2. Inspect Existing Project Structure ✅

**Check:**
- [ ] Does a similar component already exist?
- [ ] Are there reusable utilities?
- [ ] What patterns are used elsewhere?
- [ ] What's the file organization?
- [ ] Are there existing tests?

**Commands:**
```bash
# Find similar components
find src -name "*Component*" -type f

# Search for existing utilities
grep -r "functionName" src/

# Check file structure
tree src/ -L 2
```

### 3. Reuse Existing Components ✅

**Before creating new:**
- [ ] Check `frontend/components/` for reusable UI
- [ ] Check `frontend/lib/` for utilities
- [ ] Check `frontend/hooks/` for custom hooks
- [ ] Check `frontend/features/` for similar features

**Benefits:**
- Consistency across the app
- Less code to maintain
- Faster development
- Fewer bugs

### 4. Avoid Unnecessary Dependencies ✅

**Before adding a package:**
- [ ] Can it be done with existing dependencies?
- [ ] Is the package well-maintained?
- [ ] What's the bundle size impact?
- [ ] Are there security vulnerabilities?
- [ ] Is it worth the maintenance burden?

**Check package health:**
```bash
# Check bundle size
npm install -g bundlephobia
bundlephobia package-name

# Check for vulnerabilities
npm audit

# Check maintenance
npm view package-name time
```

### 5. Plan the Architecture ✅

**Create a plan:**
```markdown
## Feature: [Name]

### Components
- ComponentA: Purpose
- ComponentB: Purpose

### Data Flow
1. User action → ComponentA
2. ComponentA → API call
3. API response → State update
4. State → ComponentB re-render

### File Structure
- src/features/featureName/
  - FeatureName.tsx
  - components/
  - hooks/
  - utils/
  - types.ts

### Dependencies
- Existing: React, Zod
- New: None

### Testing Strategy
- Unit: Business logic
- Integration: API calls
- E2E: Critical user flows

### Performance Considerations
- Lazy loading: Yes/No
- Caching: Yes/No
- Optimization: [details]

### Security Considerations
- Input validation: [details]
- Authentication: [details]
- Data protection: [details]
```

---

## During Implementation

### 6. Implement Incrementally ✅

**Approach:**
1. Start with the core functionality
2. Add error handling
3. Add validation
4. Add loading states
5. Add edge cases
6. Add polish (animations, transitions)

**Example:**
```typescript
// Step 1: Core functionality
function analyzeSymptoms(input: string) {
  return performAnalysis(input);
}

// Step 2: Add validation
function analyzeSymptoms(input: string) {
  if (!input.trim()) {
    throw new Error('Input required');
  }
  return performAnalysis(input);
}

// Step 3: Add error handling
function analyzeSymptoms(input: string) {
  try {
    if (!input.trim()) {
      throw new ValidationError('Input required');
    }
    return performAnalysis(input);
  } catch (error) {
    logError(error);
    throw new UserFriendlyError('Analysis failed');
  }
}

// Step 4: Add types
function analyzeSymptoms(input: string): SymptomAnalysis {
  // ... implementation
}
```

### 7. Test the Feature ✅

**Testing pyramid:**
```
        /\
       /  \
      / E2E \         ← Few tests, critical flows
     /--------\
    / Integration\    ← API calls, component interactions
   /--------------\
  /    Unit Tests   \  ← Many tests, business logic
 /------------------\
```

**What to test:**
- [ ] Happy path (normal usage)
- [ ] Error paths (invalid input, network errors)
- [ ] Edge cases (empty, max values, special chars)
- [ ] Accessibility (keyboard, screen reader)
- [ ] Responsiveness (mobile, tablet, desktop)
- [ ] Performance (load time, interactions)

**Example test structure:**
```typescript
describe('SymptomChecker', () => {
  describe('Functionality', () => {
    it('analyzes symptoms correctly', () => {
      // Test happy path
    });
    
    it('handles empty input', () => {
      // Test error path
    });
  });
  
  describe('Accessibility', () => {
    it('is keyboard navigable', () => {
      // Test keyboard navigation
    });
    
    it('has proper ARIA labels', () => {
      // Test screen reader support
    });
  });
  
  describe('Responsiveness', () => {
    it('works on mobile', () => {
      // Test mobile layout
    });
  });
  
  describe('Safety', () => {
    it('uses probabilistic language', () => {
      // Test medical safety
    });
  });
});
```

### 8. Check Responsive Behavior ✅

**Test at all breakpoints:**
```bash
# Using browser DevTools
# Or automated testing with Playwright/Cypress

Breakpoints to test:
- 320px (small mobile)
- 375px (standard mobile)
- 390px (large mobile)
- 768px (tablet portrait)
- 1024px (tablet landscape)
- 1440px (laptop)
- 1920px+ (desktop)
```

**Check:**
- [ ] No horizontal scrolling
- [ ] Touch targets are 44px+
- [ ] Text is readable
- [ ] Images scale properly
- [ ] Navigation works
- [ ] Forms are usable
- [ ] Modals work correctly

### 9. Check Accessibility ✅

**Automated testing:**
```bash
# Lighthouse
lighthouse https://medimind.ai --view

# axe-core
npm install -g @axe-core/cli
axe https://medimind.ai
```

**Manual testing:**
- [ ] Keyboard navigation (Tab, Enter, Escape, Arrow keys)
- [ ] Screen reader (VoiceOver, NVDA, TalkBack)
- [ ] Focus states are visible
- [ ] Color contrast is sufficient
- [ ] ARIA labels are correct
- [ ] Form labels are associated

### 10. Check Security ✅

**Security checklist:**
- [ ] Input validation (Zod schemas)
- [ ] No API keys in frontend code
- [ ] Rate limiting implemented
- [ ] Secure error handling (no stack traces)
- [ ] File validation (type, size, content)
- [ ] Prompt injection protection
- [ ] XSS prevention (sanitization)
- [ ] CSRF protection (if applicable)
- [ ] Authentication/authorization (if applicable)

**Tools:**
```bash
# Check for exposed secrets
grep -r "API_KEY" src/
grep -r "SECRET" src/

# Check for vulnerabilities
npm audit

# Static analysis
npm run lint
```

### 11. Check AI Safety ✅

**AI safety checklist:**
- [ ] Uses probabilistic language ("may be associated with")
- [ ] Never claims certainty about diagnoses
- [ ] Includes disclaimers
- [ ] Emergency situations handled correctly
- [ ] Warning signs clearly listed
- [ ] No harmful medical advice
- [ ] Output validated with Zod
- [ ] Fallback data is safe

**Test scenarios:**
```typescript
// Test emergency handling
test('handles chest pain as emergency', () => {
  const result = analyzeSymptoms('chest pain');
  expect(result.urgency).toBe('emergency');
  expect(result.severity).toBeGreaterThanOrEqual(4);
});

// Test probabilistic language
test('uses probabilistic language', () => {
  const result = analyzeSymptoms('headache');
  expect(result.possible_explanations[0]).toMatch(/may be associated with/i);
});

// Test disclaimer presence
test('includes disclaimer', () => {
  const result = analyzeSymptoms('fever');
  expect(result.disclaimer).toContain('not a medical diagnosis');
});
```

---

## After Implementation

### 12. Code Review ✅

**Before requesting review:**
- [ ] Code is clean and well-organized
- [ ] No console.log or debug code
- [ ] No TODO comments left behind
- [ ] All tests pass
- [ ] Linting passes
- [ ] Documentation updated

**Review checklist:**
- [ ] Functionality: Does it work?
- [ ] Usability: Is it intuitive?
- [ ] Accessibility: Is it accessible?
- [ ] Responsiveness: Does it work on all devices?
- [ ] Safety: Is it medically safe?
- [ ] Visual quality: Does it look good?
- [ ] Maintainability: Is it easy to understand?

### 13. Performance Optimization ✅

**Check performance:**
```bash
# Build analysis
npm run build -- --analyze

# Lighthouse audit
lighthouse https://medimind.ai --view
```

**Optimize:**
- [ ] Code splitting (React.lazy)
- [ ] Lazy loading (images, components)
- [ ] Image optimization (WebP, responsive)
- [ ] Caching (API responses, translations)
- [ ] Bundle size (tree shaking, code splitting)
- [ ] Load time (critical CSS, font loading)

**Targets:**
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3.5s

### 14. Final Testing ✅

**Complete testing checklist:**
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] All E2E tests pass
- [ ] Manual testing on all devices
- [ ] Accessibility audit passes
- [ ] Performance benchmarks met
- [ ] Security review passed
- [ ] Medical safety verified

---

## Common Mistakes to Avoid

### ❌ Never Do This

1. **Placeholder functionality**
```typescript
// ❌ BAD
function analyzeSymptoms(input: string) {
  // TODO: implement
  return null;
}
```

2. **Duplicate components**
```typescript
// ❌ BAD: Creating Button2 when Button exists
function Button2({ children }) {
  return <button>{children}</button>;
}
```

3. **Ignoring error handling**
```typescript
// ❌ BAD
async function fetchData() {
  const response = await fetch('/api/data');
  return response.json(); // What if fetch fails?
}
```

4. **Hardcoding values**
```typescript
// ❌ BAD
const MAX_RESULTS = 10; // Why 10?
```

5. **Exposing sensitive data**
```typescript
// ❌ BAD
const API_KEY = 'sk-1234567890'; // In frontend code!
```

6. **Definitive medical claims**
```typescript
// ❌ BAD
{
  diagnosis: "You have a migraine",
  treatment: "Take sumatriptan"
}
```

7. **Ignoring accessibility**
```tsx
// ❌ BAD
<button onClick={handleClick}>
  <Icon /> {/* No aria-label! */}
</button>
```

8. **Not testing edge cases**
```typescript
// ❌ BAD: Only tests happy path
it('works correctly', () => {
  expect(analyzeSymptoms('headache')).toBeDefined();
});
```

---

## Development Workflow

### Step-by-Step Process

```
1. Understand Requirement
   ↓
2. Inspect Existing Code
   ↓
3. Plan Architecture
   ↓
4. Implement Incrementally
   ↓
5. Write Tests
   ↓
6. Test Functionality
   ↓
7. Test Responsiveness
   ↓
8. Test Accessibility
   ↓
9. Test Security
   ↓
10. Test AI Safety
    ↓
11. Optimize Performance
    ↓
12. Code Review
    ↓
13. Merge to Main
    ↓
14. Deploy & Monitor
```

### Time Allocation

For a typical feature:
- **20%** - Understanding & planning
- **40%** - Implementation
- **20%** - Testing (all types)
- **10%** - Code review & fixes
- **10%** - Documentation & polish

---

## Tools & Resources

### Essential Tools
- **VS Code**: IDE with extensions
- **Git**: Version control
- **Chrome DevTools**: Debugging & testing
- **Lighthouse**: Performance & accessibility
- **axe DevTools**: Accessibility testing
- **Postman**: API testing

### VS Code Extensions
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "dsznajder.es7-react-js-snippets",
    "ms-vscode.vscode-typescript-next",
    "streetsidesoftware.code-spell-checker"
  ]
}
```

### Useful Commands
```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview production build

# Testing
npm test                 # Run tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report

# Quality
npm run lint             # ESLint
npm run lint:fix         # Auto-fix lint errors
npm run format           # Prettier format
npm run type-check       # TypeScript check

# Analysis
npm run build -- --analyze  # Bundle analysis
```

---

## Continuous Improvement

### Learn from Mistakes
- Document mistakes in team wiki
- Share learnings in code reviews
- Update guidelines based on experience
- Regular retrospectives

### Stay Updated
- Follow React best practices
- Keep up with accessibility standards
- Monitor security vulnerabilities
- Track performance metrics

### Mentor Others
- Review code thoroughly
- Explain decisions clearly
- Share knowledge generously
- Help teammates grow

---

## Summary

**The Golden Rules:**

1. ✅ **Understand before implementing**
2. ✅ **Reuse before creating**
3. ✅ **Test before shipping**
4. ✅ **Quality over speed**
5. ✅ **Safety over features**
6. ✅ **Users over ego**

**Remember:** 
- Never rewrite working code unnecessarily
- Never create duplicate components
- Never leave placeholder functionality
- Never ship without testing
- Never compromise on accessibility
- Never make definitive medical claims

**Your goal:** Build features that are functional, usable, accessible, responsive, safe, beautiful, and maintainable.

---

**Last Updated**: 2024-01-01  
**Version**: 1.0.0
