import { test } from '@playwright/test';

/**
 * Верхняя панель (топбар): хлебные крошки, вкладки Employee List / Add Employee / Reports.
 */
class TopbarHeader {
    constructor(page) {
        this.page = page;
        this.breadcrumbModule = page.locator('.oxd-topbar-header-breadcrumb-module');
        this.employeeListTab = page.locator('li.oxd-topbar-body-nav-tab').filter({ hasText: 'Employee List' });
    }

    /** Переход на вкладку Employee List */
    async openEmployeeListTab() {
        await test.step('Клик по вкладке Employee List', async () => {
            await this.employeeListTab.click();
        });
        await test.step('Ожидание загрузки Employee List', async () => {
            await this.page.waitForLoadState('networkidle');
        });
    }
}
export default TopbarHeader
