# MediMind AI Tests

Test files for the MediMind AI frontend.

## Test Structure

```
tests/
├── unit/           # Unit tests
├── integration/    # Integration tests
├── e2e/            # End-to-end tests
└── fixtures/       # Test data fixtures
```

## Running Tests

```bash
npm test           # Run all tests
npm run test:unit  # Run unit tests only
npm run test:e2e   # Run E2E tests
```

## Testing Framework

- Vitest for unit and integration tests
- Playwright for E2E tests
- React Testing Library for component tests
