import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Registration', () => {
    test('should navigate to registration page', async ({ page }) => {
      // Click on the sign up link
      await page.click('text=Sign up');
      
      // Verify we're on the registration page
      await expect(page).toHaveURL(/.*register/);
      await expect(page.locator('h1, h2').filter({ hasText: /sign up|register/i })).toBeVisible();
    });

    test('should show validation errors for empty form', async ({ page }) => {
      await page.goto('/auth/register');
      
      // Try to submit empty form
      await page.click('button[type="submit"]');
      
      // Check for validation messages (adjust selectors based on your implementation)
      await expect(page.locator('text=/required/i').first()).toBeVisible({ timeout: 5000 });
    });

    test('should show error for mismatched passwords', async ({ page }) => {
      await page.goto('/auth/register');
      
      // Fill in form with mismatched passwords
      await page.fill('input[name="fullName"], input[placeholder*="Full Name"]', 'John Doe');
      await page.fill('input[name="username"], input[placeholder*="Username"]', 'johndoe123');
      await page.fill('input[name="email"], input[type="email"]', 'john@example.com');
      await page.fill('input[name="password"], input[placeholder*="Password"]:not([placeholder*="Confirm"])', 'Password123!');
      await page.fill('input[name="confirmPassword"], input[placeholder*="Confirm Password"]', 'DifferentPassword123!');
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Should show password mismatch error
      await expect(page.locator('text=/password.*match/i')).toBeVisible({ timeout: 5000 });
    });

    test('should successfully register a new user', async ({ page }) => {
      await page.goto('/auth/register');
      
      const timestamp = Date.now();
      const testEmail = `testuser${timestamp}@example.com`;
      const testUsername = `testuser${timestamp}`;
      
      // Fill in the registration form
      await page.fill('input[name="fullName"], input[placeholder*="Full Name"]', 'Test User');
      await page.fill('input[name="username"], input[placeholder*="Username"]', testUsername);
      await page.fill('input[name="email"], input[type="email"]', testEmail);
      
      // Select role if applicable (adjust based on your UI)
      const roleSelector = await page.locator('[role="combobox"], select[name="role"]').first();
      if (await roleSelector.isVisible()) {
        await roleSelector.click();
        await page.click('text=/job seeker|candidate/i');
      }
      
      await page.fill('input[name="password"], input[placeholder*="Password"]:not([placeholder*="Confirm"])', 'TestPassword123!');
      await page.fill('input[name="confirmPassword"], input[placeholder*="Confirm Password"]', 'TestPassword123!');
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Wait for redirect or success message
      await expect(page).toHaveURL(/.*(?:login|dashboard|home)/, { timeout: 10000 });
    });
  });

  test.describe('Login', () => {
    test('should navigate to login page', async ({ page }) => {
      // Navigate to login
      await page.goto('/auth/login');
      
      // Verify we're on the login page
      await expect(page.locator('h1, h2').filter({ hasText: /sign in|log in/i })).toBeVisible();
    });

    test('should show validation errors for empty credentials', async ({ page }) => {
      await page.goto('/auth/login');
      
      // Try to submit empty form
      await page.click('button[type="submit"]');
      
      // Check for validation messages
      await expect(page.locator('text=/required/i').first()).toBeVisible({ timeout: 5000 });
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('/auth/login');
      
      // Fill in invalid credentials
      await page.fill('input[type="email"], input[name="email"]', 'invalid@example.com');
      await page.fill('input[type="password"], input[name="password"]', 'WrongPassword123!');
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Should show error message
      await expect(page.locator('text=/invalid.*credentials|incorrect.*password|user.*not.*found/i')).toBeVisible({ timeout: 5000 });
    });

    test('should successfully login with valid credentials', async ({ page }) => {
      await page.goto('/auth/login');
      
      // Use test credentials (adjust based on your test user)
      await page.fill('input[type="email"], input[name="email"]', 'test@example.com');
      await page.fill('input[type="password"], input[name="password"]', 'TestPassword123!');
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Wait for redirect to dashboard or home
      await expect(page).toHaveURL(/.*(?:dashboard|home|jobs)/, { timeout: 10000 });
      
      // Verify user is logged in (check for logout button or user menu)
      await expect(page.locator('text=/logout|sign out/i, [aria-label*="user menu"]')).toBeVisible({ timeout: 5000 });
    });

    test('should toggle password visibility', async ({ page }) => {
      await page.goto('/auth/login');
      
      const passwordInput = page.locator('input[type="password"], input[name="password"]').first();
      const toggleButton = page.locator('button[aria-label*="password"], button:has-text("Show"), button:has-text("Hide")').first();
      
      // Initially password should be hidden
      await expect(passwordInput).toHaveAttribute('type', 'password');
      
      // Click toggle button
      await toggleButton.click();
      
      // Password should now be visible
      await expect(passwordInput).toHaveAttribute('type', 'text');
      
      // Click again to hide
      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  test.describe('Logout', () => {
    test('should logout successfully', async ({ page }) => {
      // First login
      await page.goto('/auth/login');
      await page.fill('input[type="email"], input[name="email"]', 'test@example.com');
      await page.fill('input[type="password"], input[name="password"]', 'TestPassword123!');
      await page.click('button[type="submit"]');
      
      // Wait for redirect
      await page.waitForURL(/.*(?:dashboard|home|jobs)/, { timeout: 10000 });
      
      // Click logout
      await page.click('text=/logout|sign out/i');
      
      // Should redirect to login or home
      await expect(page).toHaveURL(/.*(?:login|^\/$)/, { timeout: 5000 });
      
      // Verify user is logged out (should see login link)
      await expect(page.locator('text=/log in|sign in/i')).toBeVisible();
    });
  });
});
