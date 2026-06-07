import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome-stable' }); // Assuming Chrome is available
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/');
  const title = await page.title();
  console.log('Page Title:', title);
  await browser.close();
})();
