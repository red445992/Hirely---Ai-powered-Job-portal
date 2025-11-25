# Playwright E2E Testing Setup

## Overview
End-to-end tests using Playwright to test critical user flows in the application.

## Installation
Playwright is already installed. Browsers are automatically downloaded when running tests.

## Test Structure
```
e2e/
├── auth.spec.ts           # Authentication flow tests (login, register, logout)
├── example.spec.ts        # Example tests for homepage and responsiveness
└── [future tests]         # Job application, resume upload, etc.
```

## Running Tests

### Run all E2E tests (headless)
```bash
npm run test:e2e
```

### Run tests with UI mode (recommended for development)
```bash
npm run test:e2e:ui
```

### Run tests in headed mode (see the browser)
```bash
npm run test:e2e:headed
```

### Run tests in debug mode
```bash
npm run test:e2e:debug
```

### View last test report
```bash
npm run test:e2e:report
```

### Run specific test file
```bash
npx playwright test e2e/auth.spec.ts
```

### Run specific test by name
```bash
npx playwright test -g "should successfully login"
```

## Configuration

The Playwright configuration (`playwright.config.ts`) includes:
- **Test Directory**: `./e2e`
- **Base URL**: `http://localhost:3000`
- **Browsers**: Chromium, Firefox, WebKit (Safari)
- **Automatic dev server**: Starts Next.js dev server before running tests
- **Screenshots**: Captured on failure
- **Traces**: Captured on first retry

## Writing Tests

### Basic Test Structure
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    // Your test code
    await page.click('button');
    await expect(page.locator('h1')).toContainText('Expected Text');
  });
});
```

### Best Practices
1. **Use data-testid attributes** for stable selectors
2. **Group related tests** using `test.describe()`
3. **Use beforeEach** for common setup
4. **Wait for elements** properly using Playwright's auto-waiting
5. **Test user flows**, not implementation details

## Authentication Tests

The `e2e/auth.spec.ts` file includes comprehensive tests for:

### Registration Flow
- ✅ Navigate to registration page
- ✅ Show validation errors for empty form
- ✅ Show error for mismatched passwords
- ✅ Successfully register new user

### Login Flow
- ✅ Navigate to login page
- ✅ Show validation errors for empty credentials
- ✅ Show error for invalid credentials
- ✅ Successfully login with valid credentials
- ✅ Toggle password visibility

### Logout Flow
- ✅ Successfully logout

## Environment Requirements

Tests expect:
1. **Backend API running** at configured endpoint (or mocked)
2. **Next.js dev server** running on port 3000 (auto-started by Playwright)
3. **Test user credentials** available:
   - Email: `test@example.com`
   - Password: `TestPassword123!`

## CI/CD Integration

Playwright tests are CI-ready:
- Automatic browser installation
- Headless by default
- Retry logic on CI
- HTML report generation
- Screenshots and traces on failure

Example GitHub Actions workflow:
```yaml
- name: Install dependencies
  run: npm ci
  
- name: Install Playwright browsers
  run: npx playwright install --with-deps
  
- name: Run E2E tests
  run: npm run test:e2e
  
- name: Upload test results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## Debugging Tips

1. **Use UI Mode** for visual debugging:
   ```bash
   npm run test:e2e:ui
   ```

2. **Use Debug Mode** to pause execution:
   ```bash
   npm run test:e2e:debug
   ```

3. **Add console logs** in tests:
   ```typescript
   console.log(await page.title());
   ```

4. **Take screenshots** manually:
   ```typescript
   await page.screenshot({ path: 'debug.png' });
   ```

5. **Pause execution** at specific point:
   ```typescript
   await page.pause();
   ```

## Coverage Goals

Target E2E test coverage:
- ✅ Authentication (registration, login, logout)
- 🔲 Job search and filtering
- 🔲 Job application submission
- 🔲 Resume upload and parsing
- 🔲 Profile management
- 🔲 Protected route access

## Future Tests

Planned test files:
- `e2e/jobs.spec.ts` - Job search, filter, view details
- `e2e/applications.spec.ts` - Job application flow
- `e2e/resume.spec.ts` - Resume upload and management
- `e2e/profile.spec.ts` - User profile management
- `e2e/protected-routes.spec.ts` - Authorization checks

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Test Generator](https://playwright.dev/docs/codegen) - `npx playwright codegen http://localhost:3000`
