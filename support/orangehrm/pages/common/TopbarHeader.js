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
        await this.employeeListTab.click();
        await this.page.waitForLoadState('networkidle');
    }
}
export default TopbarHeader
