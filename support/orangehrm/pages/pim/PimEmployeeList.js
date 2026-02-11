import { test } from '@playwright/test';

/**
 * Страница списка сотрудников PIM (Employee List).
 * Форма Employee Information: Employee Name, Employee Id.
 */
export default class PimEmployeeList {
    constructor(page) {
        this.page = page;
        this.employeeList = page.locator('.orangehrm-employee-list');
        this.filterArea = page.locator('.oxd-table-filter-area');
        this.addButton = page.locator('.orangehrm-header-container button.oxd-button--secondary');
        this.employeeNameSearchInput = this.filterArea.locator('.oxd-input-group').filter({ hasText: 'Employee Name' }).locator('.oxd-autocomplete-wrapper input');
        this.employeeIdSearchInput = this.filterArea.locator('.oxd-input-group').filter({ hasText: 'Employee Id' }).locator('input.oxd-input');
        this.searchButton = this.filterArea.locator('button[type="submit"]');
        this.tableRows = this.employeeList.locator('.oxd-table-body .oxd-table-card');
        this.tableLoader = this.employeeList.locator('.oxd-table-loader');
        this.rowActionButtonsSelector = '.oxd-table-cell-actions button';
    }

    /** Нажимает кнопку Add для добавления сотрудника */
    async clickAdd() {
        await this.addButton.click();
    }

    /**
     * Ждёт готовности таблицы: исчезновение спиннера и появление индикатора результатов
     * @param {number} [timeout=15000] - таймаут
     */
    async waitForTableReady(timeout = 35_000) {
        await this.tableLoader.waitFor({ state: 'hidden', timeout });
        // TODO: OrangeHRM после скрытия лоадера сначала перерисовывает всю таблицу, затем через
        // несколько секунд подставляет результаты поиска. Поэтому используется фиксированная задержка
        await this.page.waitForTimeout(3000);
    }

    /**
     * Заполняет форму Employee Information по переданным полям и нажимает Search; ждёт загрузки таблицы.
     * @param {Object} filters
     * @param {string} [filters.employeeName] - имя/фамилия для поиска (автокомплит)
     * @param {string} [filters.employeeId] - Employee Id
     */
    async searchByFilters(filters) {
        await test.step('Ожидание блока фильтров Employee Information', async () => {
            await this.filterArea.waitFor({ state: 'visible' });
        });

        await test.step('Заполнение полей фильтра', async () => {
            if (filters.employeeName != null) {
                await this.employeeNameSearchInput.fill(filters.employeeName);
            }
            if (filters.employeeId != null) {
                await this.employeeIdSearchInput.fill(filters.employeeId);
            }
        });

        await test.step('Нажатие Search и ожидание загрузки таблицы', async () => {
            await this.searchButton.click();
            await this.waitForTableReady();
        });
    }

    /**
     * Получение всех строк в таблице сотрудников
     */
    getAllTableRows() {
        return this.tableRows;
    }

    /**
     * Возвращает количество строк в таблице сотрудников.
     * @returns {Promise<number>}
     */
    async getTableRowCount() {
        return this.tableRows.count();
    }

    /**
     * Локатор всех строк таблицы, в которых указан данный Employee Id
     * @param {string} employeeId - Employee Id
     */
    getRowsByEmployeeId(employeeId) {
        return this.tableRows.filter({ hasText: employeeId });
    }

    /**
     * Локатор первой строки таблицы, в которой указан данный Employee Id
     * @param {string} employeeId - Employee Id
     */
    getRowByEmployeeId(employeeId) {
        return this.getRowsByEmployeeId(employeeId).first();
    }

    /**
     * Ждёт появления в таблице строки с указанным Employee Id.
     * @param {string} employeeId - Employee Id
     * @param {number} [timeout=15000] - таймаут
     */
    async waitForRowWithEmployeeIdVisible(employeeId, timeout = 15_000) {
        await this.getRowByEmployeeId(employeeId).waitFor({ state: 'visible', timeout });
    }

    /**
     * Локатор всех строк таблицы, содержащих указанные имя и фамилию.
     * @param {string} firstName
     * @param {string} lastName
     */
    getRowsByEmployeeName(firstName, lastName) {
        return this.tableRows.filter({ hasText: firstName }).filter({ hasText: lastName });
    }

    /**
     * Нажимает кнопку Edit (карандаш) для строки с указанным Employee Id.
     * @param {string} employeeId - Employee Id сотрудника для редактирования
     */
    async clickEditButton(employeeId) {
        const row = this.getRowByEmployeeId(employeeId);
        await row.locator(this.rowActionButtonsSelector).first().click();
    }

    /**
     * Нажимает кнопку Delete (корзина) для строки с указанным Employee Id.
     * После клика открывается модалка подтверждения — используйте ConfirmDeleteModal.
     * @param {string} employeeId - Employee Id сотрудника для удаления
     */
    async clickDeleteButton(employeeId) {
        const row = this.getRowByEmployeeId(employeeId);
        await row.locator(this.rowActionButtonsSelector).last().click();
    }
}
