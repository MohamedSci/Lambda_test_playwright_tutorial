import { test as setup, expect } from '@playwright/test';
import { STORAGE_STATE } from '../playwright.config';

setup('do login', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('User Name').fill('user');
  await page.getByLabel('Password').fill('password');
  await page.getByText('Sign in').click();

  // Wait until the page actually signs in.
  await expect(page.getByText('Hello, user!')).toBeVisible();

  await page.context().storageState({ path: STORAGE_STATE });
});


