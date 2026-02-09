/**
 * Global hook: attach a screenshot to Allure for every UI test.
 * Loaded via playwright.config.js so it runs for all projects;
 * screenshots are only taken when a page exists (e.g. chromium).
 * @see https://allurereport.org/docs/playwright-reference/#attachments
 */
import { test } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentType } from 'allure-js-commons';

test.afterEach(async ({ page }, testInfo) => {
  if (!page || testInfo.project.name === 'api-challenges') return;
  try {
    const screenshot = await page.screenshot();
    await allure.attachment('Screenshot', screenshot, ContentType.PNG);
  } catch {
    // Page may be closed; don't fail the test for a missing screenshot
  }
});
