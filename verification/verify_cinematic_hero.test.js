import { test, expect } from '@playwright/test';

test('verify cinematic hero section', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Wait for video to be present
  const video = page.locator('video');
  await expect(video).toBeVisible();

  // Verify heading with Instrument Serif
  const heading = page.locator('h1');
  await expect(heading).toBeVisible();
  await expect(heading).toHaveCSS('font-family', /Instrument Serif/);

  // Verify liquid-glass elements
  const nav = page.locator('nav .liquid-glass');
  await expect(nav).toBeVisible();

  const emailBar = page.locator('.liquid-glass input[type="email"]').parentElement();
  // Playwright parent locator is a bit different, checking by class
  const emailContainer = page.locator('.liquid-glass:has(input[type="email"])');
  await expect(emailContainer).toBeVisible();

  // Take screenshot
  await page.screenshot({ path: 'verification/cinematic_hero_verify.png', fullPage: true });
});
