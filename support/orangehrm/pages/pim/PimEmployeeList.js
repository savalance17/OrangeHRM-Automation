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
        this.tableBody = this.employeeList.locator('.oxd-table-body');
        this.tableBodySelector = '.orangehrm-employee-list .oxd-table-body';
        this.tableLoader = this.employeeList.locator('.oxd-table-loader');
        this.rowActionButtonsSelector = '.oxd-table-cell-actions button';
    }

    /** Нажимает кнопку Add для добавления сотрудника */
    async clickAdd() {
        await test.step('Клик по Add в списке сотрудников', async () => {
            await this.addButton.click();
        });
    }

    /**
     * Ждёт готовности таблицы: исчезновение спиннера и стабилизацию DOM.
     * Считаем таблицу готовой, когда её содержимое не меняется заданное время.
     * @param {number} [timeout=15000] - общий таймаут
     * @param {number} [stableForMs=500] - сколько ms контент должен быть неизменным
     */
    async waitForTableReady(timeout = 15_000, stableForMs = 500) {
        await test.step('Ожидание скрытия лоадера таблицы сотрудников', async () => {
            await this.tableLoader.waitFor({ state: 'hidden', timeout });
        });
        await this.waitForTableStability({ timeout, stableForMs });
    }

    /**
     * Ждёт, пока текст таблицы не изменяется
     * @param {Object} options
     * @param {number} options.timeout
     * @param {number} options.stableForMs
     * @param {number} [options.pollIntervalMs=100] - интервал опроса (передаётся в waitForFunction)
     */
    async waitForTableStability({ timeout, stableForMs, pollIntervalMs = 100 }) {
        await test.step('Ожидание стабилизации таблицы сотрудников', async () => {
            await this.page.waitForFunction(
                ({ selector, stableForMs }) => {
                    const el = document.querySelector(selector);
                    if (!el) return false;
                    const text = el.textContent || '';
                    const now = Date.now();
                    if (!window.__pimTableStability) {
                        window.__pimTableStability = { lastText: '', stableSince: now };
                    }
                    const s = window.__pimTableStability;
                    if (text !== s.lastText) {
                        s.lastText = text;
                        s.stableSince = now;
                    }
                    return (now - s.stableSince) >= stableForMs;
                },
                { selector: this.tableBodySelector, stableForMs },
                { timeout, polling: pollIntervalMs }
            );
        });
    }

    /**
     * Заполняет форму Employee Information по переданным полям и нажимает Search; ждёт загрузки таблицы.
     * @param {Object} filters
     * @param {string} [filters.employeeName] - имя/фамилия для поиска (автокомплит)
     * @param {string} [filters.employeeId] - Employee Id
     */
    async searchByFilters(filters) {
        await test.step('Ожидание формы фильтров Employee Information', async () => {
            await this.filterArea.waitFor({ state: 'visible' });
        });
        if (filters.employeeName != null) {
            await test.step('Заполнение фильтра Employee Name', async () => {
                await this.employeeNameSearchInput.fill(filters.employeeName);
            });
        }
        if (filters.employeeId != null) {
            await test.step('Заполнение фильтра Employee Id', async () => {
                await this.employeeIdSearchInput.fill(filters.employeeId);
            });
        }
        await test.step('Клик по Search', async () => {
            await this.searchButton.click();
        });
        await this.waitForTableReady();
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
        return await test.step('Получение количества строк в таблице сотрудников', async () => {
            return this.tableRows.count();
        });
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
        await test.step('Ожидание строки сотрудника по Employee Id', async () => {
            await this.getRowByEmployeeId(employeeId).waitFor({ state: 'visible', timeout });
        });
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
        await test.step('Открытие редактирования сотрудника', async () => {
            const row = this.getRowByEmployeeId(employeeId);
            await row.locator(this.rowActionButtonsSelector).first().click();
        });
    }

    /**
     * Нажимает кнопку Delete (корзина) для строки с указанным Employee Id.
     * После клика открывается модалка подтверждения — используйте ConfirmDeleteModal.
     * @param {string} employeeId - Employee Id сотрудника для удаления
     */
    async clickDeleteButton(employeeId) {
        await test.step('Удаление сотрудника из списка', async () => {
            const row = this.getRowByEmployeeId(employeeId);
            await row.locator(this.rowActionButtonsSelector).last().click();
        });
    }
}
