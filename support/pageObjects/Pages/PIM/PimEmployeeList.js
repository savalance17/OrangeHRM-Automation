import { test } from '@playwright/test';

/**
 * Страница списка сотрудников PIM (Employee List).
 * Форма Employee Information: Employee Name, Employee Id, Employment Status, Job Title, Sub Unit.
 */
export default class PimEmployeeList {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.addButton = page.locator('.orangehrm-header-container button.oxd-button--secondary');
        this.employeeNameSearchInput = page.locator('.oxd-table-filter-area .oxd-input-group').filter({ hasText: 'Employee Name' }).locator('.oxd-autocomplete-wrapper input');
        this.employeeIdSearchInput = page.locator('.oxd-table-filter-area .oxd-input-group').filter({ hasText: 'Employee Id' }).locator('input.oxd-input');
        this.employmentStatusSelect = page.locator('.oxd-table-filter-area .oxd-input-group').filter({ hasText: 'Employment Status' }).locator('.oxd-select-text');
        this.jobTitleSelect = page.locator('.oxd-table-filter-area .oxd-input-group').filter({ hasText: 'Job Title' }).locator('.oxd-select-text');
        this.subUnitSelect = page.locator('.oxd-table-filter-area .oxd-input-group').filter({ hasText: 'Sub Unit' }).locator('.oxd-select-text');
        this.searchButton = page.locator('.oxd-table-filter-area button[type="submit"]');
        this.resetButton = page.locator('.oxd-table-filter-area button[type="reset"]');
        this.tableBody = page.locator('.orangehrm-employee-list .oxd-table-body');
    }

    /** Нажимает кнопку Add для добавления сотрудника */
    async clickAdd() {
        await this.addButton.click();
    }

    /**
     * Ждёт окончания загрузки таблицы (исчезновение спиннера).
     * @param {number} [timeout=15000] - таймаут
     */
    async waitForTableLoaded(timeout = 15_000) {
        await this.page.locator('.orangehrm-employee-list .oxd-table-loader').waitFor({ state: 'hidden', timeout });
    }

    /**
     * Выбирает опцию в выпадающем списке фильтра (Employment Status, Job Title, Sub Unit).
     * @param {import('@playwright/test').Locator} selectTrigger - локатор .oxd-select-text
     * @param {string} optionText - текст опции
     */
    async _selectFilterOption(selectTrigger, optionText) {
        await selectTrigger.click();
        await this.page.getByRole('option', { name: new RegExp(`^\\s*${optionText}\\s*$`, 'i') }).click();
    }

    /**
     * Заполняет форму Employee Information по переданным полям и нажимает Search; ждёт загрузки таблицы.
     * Шаги отображаются в отчёте Playwright (test.step).
     * @param {Object} filters
     * @param {string} [filters.employeeName] - имя/фамилия для поиска (автокомплит)
     * @param {string} [filters.employeeId] - Employee Id
     * @param {string} [filters.employmentStatus] - например "Full-Time Permanent"
     * @param {string} [filters.jobTitle] - например "HR Manager"
     * @param {string} [filters.subUnit] - например "Human Resources"
     */
    async searchByFilters(filters) {
        await test.step('Ожидание блока фильтров Employee Information', async () => {
            await this.page.locator('.oxd-table-filter-area').waitFor({ state: 'visible' });
        });

        await test.step('Заполнение полей фильтра', async () => {
            if (filters.employeeName != null) {
                await this.employeeNameSearchInput.fill(filters.employeeName);
            }
            if (filters.employeeId != null) {
                await this.employeeIdSearchInput.fill(filters.employeeId);
            }
            if (filters.employmentStatus != null) {
                await this._selectFilterOption(this.employmentStatusSelect, filters.employmentStatus);
            }
            if (filters.jobTitle != null) {
                await this._selectFilterOption(this.jobTitleSelect, filters.jobTitle);
            }
            if (filters.subUnit != null) {
                await this._selectFilterOption(this.subUnitSelect, filters.subUnit);
            }
        });

        await test.step('Нажатие Search и ожидание загрузки таблицы', async () => {
            await this.searchButton.click();
            await this.waitForTableLoaded();
        });
    }

    /**
     * Локатор всех строк таблицы (всего отображаемых записей).
     * @returns {import('@playwright/test').Locator}
     */
    getAllTableRows() {
        return this.page.locator('.orangehrm-employee-list .oxd-table-body .oxd-table-card');
    }

    /**
     * Локатор всех строк таблицы, в которых указан данный Employee Id.
     * @param {string} employeeId - Employee Id
     * @returns {import('@playwright/test').Locator}
     */
    getRowsByEmployeeId(employeeId) {
        return this.page.locator('.orangehrm-employee-list .oxd-table-body .oxd-table-card').filter({ hasText: employeeId });
    }

    /**
     * Локатор первой строки таблицы, в которой указан данный Employee Id.
     * @param {string} employeeId - Employee Id
     * @returns {import('@playwright/test').Locator}
     */
    getRowByEmployeeId(employeeId) {
        return this.getRowsByEmployeeId(employeeId).first();
    }

    /**
     * Локатор всех строк таблицы, содержащих указанные имя и фамилию.
     * @param {string} firstName
     * @param {string} lastName
     * @returns {import('@playwright/test').Locator}
     */
    getRowsByEmployeeName(firstName, lastName) {
        return this.page.locator('.orangehrm-employee-list .oxd-table-body .oxd-table-card').filter({ hasText: firstName }).filter({ hasText: lastName });
    }

    /**
     * Локатор первой строки таблицы, содержащей указанные имя и фамилию.
     * @param {string} firstName
     * @param {string} lastName
     * @returns {import('@playwright/test').Locator}
     */
    getRowByEmployeeName(firstName, lastName) {
        return this.getRowsByEmployeeName(firstName, lastName).first();
    }

    /**
     * Нажимает кнопку Edit (карандаш) для строки с указанным Employee Id.
     * @param {string} employeeId - Employee Id сотрудника для редактирования
     */
    async clickEditButton(employeeId) {
        const row = this.getRowByEmployeeId(employeeId);
        await row.locator('.oxd-table-cell-actions button').first().click();
    }

    /**
     * Нажимает кнопку Delete (корзина) для строки с указанным Employee Id.
     * После клика открывается модалка подтверждения — используйте ConfirmDeleteModal.
     * @param {string} employeeId - Employee Id сотрудника для удаления
     */
    async clickDeleteButton(employeeId) {
        const row = this.getRowByEmployeeId(employeeId);
        await row.locator('.oxd-table-cell-actions button').nth(1).click();
    }
}
