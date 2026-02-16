/**
 * Регистрирует afterEach: прикрепляет скриншот к отчёту (Playwright + Allure) для каждого UI-теста.
 * Нужно вызывать с тем же объектом test, который используют спеки (расширенный test).
 * Используется testInfo.attach(), чтобы allure-playwright подхватил вложение.
 */
/**
 * @param {import('@playwright/test').TestType} testObj — объект test (расширенный), на котором регистрировать хук
 */
export function registerAllureScreenshotHook(testObj) {
  testObj.afterEach(async ({ page }, testInfo) => {
    if (!page || testInfo.project.name === 'api-challenges') return;
    try {
      const screenshot = await page.screenshot();
      await testInfo.attach('Screenshot', { body: screenshot, contentType: 'image/png' });
    } catch {
      // Page may be closed; don't fail the test for a missing screenshot
    }
  });
}
