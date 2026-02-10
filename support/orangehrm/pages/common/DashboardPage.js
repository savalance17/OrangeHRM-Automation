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
        await this.heading.waitFor({ state: 'visible' });
    }

    /**
     * Возвращает текст заголовка страницы в топбаре (Dashboard).
     * @returns {Promise<string>}
     */
    async getHeadingText() {
        await this.heading.waitFor({ state: 'visible' });
        return (await this.heading.textContent()).trim();
    }
}