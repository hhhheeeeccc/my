import { test, expect } from '@playwright/test';

test('Verify cinematic hero section', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Check for video background
  const video = page.locator('video');
  await expect(video).toBeVisible();
  const source = video.locator('source');
  await expect(source).toHaveAttribute('src', 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4');

  // Check for Instrument Serif font in H1
  const h1 = page.locator('h1');
  const fontFamily = await h1.evaluate(el => window.getComputedStyle(el).fontFamily);
  expect(fontFamily).toContain('Instrument Serif');

  // Check for liquid-glass effect on CTA
  const cta = page.locator('#hero .liquid-glass');
  await expect(cta).toBeVisible();

  // Take a screenshot
  await page.screenshot({ path: 'verification/cinematic_hero.png', fullPage: false });
});
