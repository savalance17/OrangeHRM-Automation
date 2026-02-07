/**
 * Боковое меню приложения (Admin, PIM, Leave, Time и др.).
 */
export default class SidebarMenu {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.pimMenuItem = page.locator('a.oxd-main-menu-item[href="/web/index.php/pim/viewPimModule"]');
    }

    /** Открывает модуль PIM через пункт левого меню (переход на Employee List). */
    async openPim() {
        this.pimMenuItem.click();
    }
}
