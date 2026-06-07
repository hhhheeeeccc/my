import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  try {
    await page.goto('http://localhost:5173/');
    await page.waitForTimeout(2000); // Wait for animations

    await page.screenshot({ path: 'verification/jack_hero.png' });
    console.log('Hero screenshot captured');

    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'verification/jack_marquee_about.png' });
    console.log('Marquee/About screenshot captured');

    await page.evaluate(() => window.scrollTo(0, 3000));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'verification/jack_services.png' });
    console.log('Services screenshot captured');

    await page.evaluate(() => window.scrollTo(0, 5000));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'verification/jack_projects.png' });
    console.log('Projects screenshot captured');

  } catch (error) {
    console.error('Verification failed:', error);
  } finally {
    await browser.close();
  }
})();
