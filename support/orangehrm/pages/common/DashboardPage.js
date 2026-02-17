import { test } from '@playwright/test';

/**
 * Страница Dashboard после входа.
 */
export default class DashboardPage {
    constructor(page) {
        this.heading = page.locator('h6.oxd-topbar-header-breadcrumb-module');
    }

    /**
     * Ждёт видимости заголовка Dashboard.
     */
    async waitForHeadingVisible() {
        await test.step('Ожидание заголовка Dashboard', async () => {
            await this.heading.waitFor({ state: 'visible' });
        });
    }

    /**
     * Возвращает текст заголовка страницы в топбаре (Dashboard).
     * @returns {Promise<string>}
     */
    async getHeadingText() {
        return await test.step('Получение текста заголовка Dashboard', async () => {
            await this.heading.waitFor({ state: 'visible' });
            return (await this.heading.textContent()).trim();
        });
    }
}