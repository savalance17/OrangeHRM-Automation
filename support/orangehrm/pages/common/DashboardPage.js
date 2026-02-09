/**
 * Страница Dashboard
 */
export default class DashboardPage {
    constructor(page) {
        this.heading = page.locator('h6:has-text("Dashboard")');
    }

    /**
     * Ждёт видимости заголовка Dashboard.
     */
    async waitForHeadingVisible() {
        await this.heading.waitFor({ state: 'visible' });
    }
}