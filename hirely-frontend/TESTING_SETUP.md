# Frontend Testing Infrastructure Setup

## ✅ Setup Complete

Successfully configured Vitest and React Testing Library for the Next.js 16 frontend application.

---

## Installation

### Dependencies Installed

```json
{
  "devDependencies": {
    "vitest": "^4.0.13",
    "@vitejs/plugin-react": "latest",
    "@testing-library/react": "latest",
    "@testing-library/jest-dom": "latest",
    "@testing-library/user-event": "latest",
    "jsdom": "latest"
  }
}
```

---

## Configuration Files

### 1. `vitest.config.ts`
- Vitest configuration with React plugin
- jsdom environment for DOM testing
- Path aliases matching Next.js config (`@/`, `@/components`, `@/lib`, `@/app`)
- Coverage configuration (v8 provider, HTML/JSON/text reports)
- Setup file integration

### 2. `tests/setup.ts`
- Global test setup and cleanup
- Mock implementations:
  - `next/navigation` (useRouter, usePathname, useSearchParams)
  - `next/image` (Image component)
  - `ResizeObserver` API
  - `window.matchMedia`

### 3. `tests/utils.tsx`
- Custom render function with userEvent setup
- Mock fetch utilities
- Testing Library re-exports

---

## Test Scripts

Added to `package.json`:

```json
{
  "scripts": {
    "test": "vitest",              // Run tests in watch mode
    "test:ui": "vitest --ui",      // Run with Vitest UI
    "test:run": "vitest run",      // Run once and exit
    "test:coverage": "vitest run --coverage"  // With coverage report
  }
}
```

---

## Test Results

### Initial Test Suite: ✅ 19/19 Tests Passing (100%)

#### UI Components Tested:

1. **Button Component** (8 tests)
   - ✅ Renders with text
   - ✅ Default variant styling
   - ✅ Secondary variant styling
   - ✅ Outline variant styling
   - ✅ Disabled state
   - ✅ Click event handling
   - ✅ Disabled click prevention
   - ✅ Different sizes (sm: h-8, lg: h-10)

2. **Input Component** (7 tests)
   - ✅ Renders input field
   - ✅ Accepts text input
   - ✅ Disabled state
   - ✅ Different input types (text, email, password)
   - ✅ Custom className application
   - ✅ onChange event handling
   - ✅ Default value support

3. **Card Component** (4 tests)
   - ✅ Renders with all sections (Header, Title, Description, Content, Footer)
   - ✅ Renders without header
   - ✅ Renders without footer
   - ✅ Custom className application

---

## Project Structure

```
hirely-frontend/
├── tests/
│   ├── setup.ts                    # Global test setup
│   ├── utils.tsx                   # Test utilities
│   └── components/
│       └── ui/
│           ├── button.test.tsx     # Button tests
│           ├── input.test.tsx      # Input tests
│           └── card.test.tsx       # Card tests
├── vitest.config.ts                # Vitest configuration
└── package.json                    # Updated with test scripts
```

---

## Usage Examples

### Running Tests

```bash
# Watch mode (development)
npm test

# Run once
npm run test:run

# With UI
npm run test:ui

# With coverage
npm run test:coverage
```

### Writing Tests

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '../../utils'
import { MyComponent } from '@/components/MyComponent'

describe('MyComponent', () => {
  it('renders successfully', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('handles user interaction', async () => {
    const { user } = render(<MyComponent />)
    const button = screen.getByRole('button')
    
    await user.click(button)
    expect(button).toHaveAttribute('aria-pressed', 'true')
  })
})
```

### Using Test Utilities

```tsx
import { render, mockSuccessResponse, vi } from '../../utils'

// Mock API calls
mockSuccessResponse({ data: 'test' })

// Mock functions
const handleClick = vi.fn()

// Render with user events
const { user } = render(<Button onClick={handleClick} />)
await user.click(screen.getByText('Click me'))
expect(handleClick).toHaveBeenCalled()
```

---

## Next Steps

### Immediate Priorities

1. **Auth Component Tests** (Critical)
   - Login form validation
   - Registration form validation
   - Protected route behavior
   - Token management

2. **Integration Tests**
   - API integration tests
   - Form submission flows
   - Navigation flows

3. **Coverage Goals**
   - Target: 75-80% code coverage
   - Focus on critical user flows
   - Business logic validation

### Future Enhancements

1. **Visual Regression Testing**
   - Setup Chromatic or Percy
   - Component screenshot testing

2. **E2E Testing**
   - Install Playwright
   - Critical user journey tests

3. **Performance Testing**
   - Component render performance
   - Bundle size monitoring

4. **Accessibility Testing**
   - @axe-core/react integration
   - ARIA compliance tests

---

## Testing Best Practices

### Do's ✅

- Test user behavior, not implementation details
- Use semantic queries (getByRole, getByLabelText)
- Mock external dependencies (APIs, routers)
- Write descriptive test names
- Use data-testid sparingly (prefer semantic queries)
- Test error states and edge cases

### Don'ts ❌

- Don't test internal component state
- Don't test third-party library functionality
- Don't use brittle selectors (CSS classes)
- Don't write tests that depend on test execution order
- Don't mock everything (test realistic scenarios)

---

## Troubleshooting

### Common Issues

1. **"Cannot find module" errors**
   - Check path aliases in `vitest.config.ts`
   - Ensure imports match Next.js structure

2. **"window is not defined" errors**
   - Add mocks in `tests/setup.ts`
   - Use `jsdom` environment

3. **Async test failures**
   - Use `await user.click()` for interactions
   - Use `waitFor` for async assertions

4. **CSS/Tailwind classes not recognized**
   - This is expected - test behavior, not styling
   - Use `toHaveClass()` for critical class checks

---

## Coverage Report

Run `npm run test:coverage` to generate:

- **Terminal**: Text summary
- **Browser**: `coverage/index.html` (detailed HTML report)
- **JSON**: `coverage/coverage-final.json` (CI integration)

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Frontend Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:run
      - run: npm run test:coverage
```

---

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Next.js Testing](https://nextjs.org/docs/testing)

---

## Summary

✅ **19 tests passing** (100% success rate)  
✅ **3 components tested** (Button, Input, Card)  
✅ **Production-ready setup** with proper mocking and utilities  
✅ **TypeScript support** fully configured  
✅ **Fast execution** (~2.5s for full suite)

Ready to expand with auth component tests and integration tests!
