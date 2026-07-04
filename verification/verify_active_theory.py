import asyncio
from playwright.async_api import async_playwright
import os

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Go to the local dev server
        try:
            await page.goto("http://localhost:5173", wait_until="networkidle", timeout=60000)
            print("Page loaded successfully")
        except Exception as e:
            print(f"Failed to load page: {e}")
            await browser.close()
            return

        # 1. Verify Hero Title (Massive Typography)
        h1 = page.locator("h1")
        font_size = await h1.evaluate("el => window.getComputedStyle(el).fontSize")
        print(f"Hero Font Size: {font_size}")

        # 2. Verify Technical UI (Overlay)
        technical_ui = page.locator("div.fixed.inset-0.z-\\[100\\]")
        count = await technical_ui.count()
        print(f"Technical UI found: {count > 0}")

        # 3. Verify Canvas (3D Background)
        canvas = page.locator("canvas")
        canvas_count = await canvas.count()
        print(f"Canvas found: {canvas_count > 0}")

        # 4. Verify No forbidden scroll indicator (per DESIGN_TASTE.md)
        indicator_count = await page.get_by_text("Scroll", exact=False).count()
        print(f"Scroll indicator text found: {indicator_count}")

        # 5. Verify No section numbers in Skills
        # We'll check if '02' exists anywhere in the skills section
        skills_section = page.locator("#skills")
        skills_text = await skills_section.inner_text()
        print(f"Section number '02' in skills found: {'02' in skills_text}")

        # Take screenshots
        await page.screenshot(path="verification/active_theory_hero.png")
        await page.evaluate("window.scrollTo(0, 1500)")
        await asyncio.sleep(2)
        await page.screenshot(path="verification/active_theory_skills.png")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())
