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
        this.tableLoader = this.employeeList.locator('.oxd-table-loader');
        this.rowActionButtonsSelector = '.oxd-table-cell-actions button';
    }

    /** Нажимает кнопку Add для добавления сотрудника */
    async clickAdd() {
        await this.addButton.click();
    }

    /**
     * Ждёт готовности таблицы: исчезновение спиннера и стабилизацию DOM.
     * Считаем таблицу готовой, когда её содержимое не меняется заданное время.
     * @param {number} [timeout=15000] - общий таймаут
     * @param {number} [stableForMs=500] - сколько ms контент должен быть неизменным
     */
    async waitForTableReady(timeout = 15_000, stableForMs = 500) {
        await this.tableLoader.waitFor({ state: 'hidden', timeout });
        await this.waitForTableStability({ timeout, stableForMs });
    }

    /**
     * Ждёт, пока текст таблицы не изменяется stableForMs.
     * @param {Object} options
     * @param {number} options.timeout
     * @param {number} options.stableForMs
     * @param {number} [options.pollIntervalMs=100]
     */
    async waitForTableStability({ timeout, stableForMs, pollIntervalMs = 100 }) {
        const deadline = Date.now() + timeout;
        let lastText = null;
        let stableSince = null;

        while (Date.now() < deadline) {
            const currentText = (await this.tableBody.textContent()) ?? '';

            if (currentText === lastText) {
                if (stableSince == null) {
                    stableSince = Date.now();
                }
                if (Date.now() - stableSince >= stableForMs) {
                    return;
                }
            } else {
                lastText = currentText;
                stableSince = Date.now();
            }

            await this.page.waitForTimeout(pollIntervalMs);
        }

        throw new Error('Таблица не стабилизировалась за отведённое время.');
    }

    /**
     * Заполняет форму Employee Information по переданным полям и нажимает Search; ждёт загрузки таблицы.
     * @param {Object} filters
     * @param {string} [filters.employeeName] - имя/фамилия для поиска (автокомплит)
     * @param {string} [filters.employeeId] - Employee Id
     */
    async searchByFilters(filters) {
        await this.filterArea.waitFor({ state: 'visible' });
        if (filters.employeeName != null) {
            await this.employeeNameSearchInput.fill(filters.employeeName);
        }
        if (filters.employeeId != null) {
            await this.employeeIdSearchInput.fill(filters.employeeId);
        }
        await this.searchButton.click();
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
