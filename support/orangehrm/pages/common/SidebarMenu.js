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

    /** Кликает по PIM в пункте бокового меню */
    async openPim() {
        this.pimMenuItem.click();
    }
}
