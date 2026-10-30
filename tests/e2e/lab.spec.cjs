const { test, expect } = require('@playwright/test');
const { createJpeg } = require('./fixtures.cjs');

for (const viewport of [{ width: 320, height: 568 }, { width: 390, height: 844 }, { width: 844, height: 390 }]) {
  test(`lab workspace remains usable at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await expect(page.locator('#mobileTabBar')).toBeVisible();
    await expect(page.locator('#fileInput')).toBeAttached();
    await expect(page.locator('.preview-empty-cta')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(viewport.width);
    await page.locator('#tabSettingsBtn').click();
    await expect(page.locator('#settingsPanel')).toBeVisible();
    await expect(page.locator('#bg-color')).toBeChecked();
    await page.locator('#tabPhotosBtn').click();
    await expect(page.locator('#mobileAddBtn')).toBeVisible();
    await page.locator('#mobileFileInput').setInputFiles({ name: 'lab.jpg', mimeType: 'image/jpeg', buffer: createJpeg() });
    await expect(page.locator('#livePreviewCanvas')).toBeVisible();
    await page.locator('#tabPhotosBtn').click();
    await expect(page.locator('#preview-1')).toBeVisible();
    const download = page.waitForEvent('download');
    await page.locator('#dl-btn-1').click();
    expect((await download).suggestedFilename()).toMatch(/lab_frame\.jpe?g$/i);
  });
}

test('lab identifies itself and links to the unchanged stable site', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('InstaFrame Lab');
  await expect(page.locator('.lab-stable-link')).toHaveAttribute('href', 'https://lingmulongtai.github.io/InstaFrame/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
