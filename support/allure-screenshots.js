/**
 * Регистрирует afterEach: прикрепляет скриншот к Allure для каждого UI-теста.
 * Нужно вызывать с тем же объектом test, который используют спеки (расширенный test),
 * иначе хук не сработает.
 * @see https://allurereport.org/docs/playwright-reference/#attachments
 */
import * as allure from 'allure-js-commons';
import { ContentType } from 'allure-js-commons';

/**
 * @param {import('@playwright/test').TestType} testObj — объект test (базовый или расширенный), на котором регистрировать хук
 */
export function registerAllureScreenshotHook(testObj) {
  testObj.afterEach(async ({ page }, testInfo) => {
    if (!page || testInfo.project.name === 'api-challenges') return;
    try {
      const screenshot = await page.screenshot();
      await allure.attachment('Screenshot', screenshot, ContentType.PNG);
    } catch {
      // Page may be closed; don't fail the test for a missing screenshot
    }
  });
}
