import { chromium } from '@playwright/test';

async function capture() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log('Navigating to http://localhost:5177/...');
  await page.goto('http://localhost:5177/');
  await page.waitForTimeout(2000); // Wait for animations

  console.log('Capturing English Hero...');
  await page.screenshot({ path: 'en_hero.png' });

  // Switch to Arabic
  console.log('Switching to Arabic...');
  // The button has "AR" text when in English
  const langBtn = await page.locator('button:has-text("AR")');
  if (await langBtn.count() > 0) {
    await langBtn.click();
    await page.waitForTimeout(2000);
    console.log('Capturing Arabic Hero...');
    await page.screenshot({ path: 'ar_hero.png' });
  }

  // Scroll to Projects
  console.log('Capturing Projects...');
  await page.goto('http://localhost:5177/#projects');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'projects_view.png' });

  await browser.close();
  console.log('Done.');
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});
