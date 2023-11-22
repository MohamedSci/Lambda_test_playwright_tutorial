import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('menu', async ({ page }) => {
  // You are signed in!
});