import { test, expect } from '@playwright/test';

test.describe('Example Tests', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page loaded successfully
    await expect(page).toHaveTitle(/Hirely|Home/i);
  });

  test('should have navigation elements', async ({ page }) => {
    await page.goto('/');
    
    // Check for common navigation elements
    // Adjust selectors based on your actual navigation structure
    const nav = page.locator('nav, header');
    await expect(nav).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Verify page is still functional on mobile
    await expect(page).toHaveTitle(/Hirely|Home/i);
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page).toHaveTitle(/Hirely|Home/i);
  });
});
