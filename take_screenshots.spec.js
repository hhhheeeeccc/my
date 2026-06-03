import { test, expect } from '@playwright/test';

test('capture current state', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(2000);

  // Hero
  await page.screenshot({ path: 'state_hero.png' });

  // Hero Tilt Simulation
  await page.mouse.move(100, 100);
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'state_hero_tilt.png' });

  // About
  await page.evaluate(() => document.getElementById('about').scrollIntoView());
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'state_about.png' });

  // Skills
  await page.evaluate(() => document.getElementById('skills').scrollIntoView());
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'state_skills.png' });

  // Projects
  await page.evaluate(() => document.getElementById('projects').scrollIntoView());
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'state_projects.png' });
});
