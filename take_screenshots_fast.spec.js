import { test, expect } from '@playwright/test';

test('capture quick state', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'final_hero.png' });

  await page.evaluate(() => window.scrollTo(0, 1500));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'final_sections.png' });
});
