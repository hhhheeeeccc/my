import { test, expect } from '@playwright/test';

test('verify 3d visual effects and layout', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Take screenshot of Hero
  await page.screenshot({ path: 'hero_3d.png' });

  // Scroll and verify section reveal triggers
  await page.evaluate(() => window.scrollTo(0, 1000));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'about_reveal.png' });

  await page.evaluate(() => window.scrollTo(0, 2000));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'skills_3d.png' });

  await page.evaluate(() => window.scrollTo(0, 3000));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'projects_3d.png' });

  // Verify Navbar presence
  const navbar = page.locator('nav');
  await expect(navbar).toBeVisible();
});
