import { test, expect } from '@playwright/test';

test("test alert -1 demo",async ({page})=>{
  await page.goto('https://www.lambdatest.com/selenium-playground/javascript-alert-box-demo');
  await page.locator('p').filter({ hasText: 'Confirm box:Click Me' }).getByRole('button').click();
  await page.on('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
     dialog.dismiss().catch(() => {});
  });
  await expect(page.locator('#confirm-demo')).toContainText('You pressed OK!');
  await expect(page.locator('#prompt-demo')).toContainText('You have entered \'coco\' !');
});