/**
 * Страница добавления сотрудника (Add Employee).
 */
export default class PimAddEmployee {
    constructor(page) {
        this.page = page;
        this.mainTitle = page.locator('.orangehrm-main-title');
        this.firstNameInput = page.locator('input[name="firstName"]');
        this.middleNameInput = page.locator('input[name="middleName"]');
        this.lastNameInput = page.locator('input[name="lastName"]');
        this.employeeIdInput = page.locator('.oxd-input-group').filter({ hasText: 'Employee Id' }).locator('input.oxd-input');
        this.saveButton = page.locator('button[type="submit"].oxd-button--secondary');
        this.formLoader = page.locator('.orangehrm-card-container .oxd-form-loader');
    }

    /**
     * Ждёт исчезновения лоадера формы. Если не исчезнет за timeout — тест падает.
     * @param {number} [timeout=90_000] - таймаут ожидания (мс)
     */
    async waitForLoaderHidden(timeout = 90_000) {
        await this.formLoader.waitFor({ state: 'hidden', timeout });
    }

    /**
     * Нажимает кнопку Save для сохранения сотрудника и перехода на Personal Details.
     * Перед кликом ждёт исчезновения лоадера, чтобы кнопка не была перекрыта оверлеем.
     */
    async clickSave() {
        await this.waitForLoaderHidden();
        await this.saveButton.click();
    }

    /**
     * Заполняет все поля формы добавления сотрудника.
     * Перед заполнением ждёт исчезновения лоадера, чтобы поля были доступны.
     * @param {{ firstName: string, middleName?: string, lastName: string, employeeId?: string }} data
     */
    async fillForm(data) {
        await this.waitForLoaderHidden();
        await this.firstNameInput.fill(data.firstName ?? '');
        await this.middleNameInput.fill(data.middleName ?? '');
        await this.lastNameInput.fill(data.lastName ?? '');
        if (data.employeeId != null) {
            await this.employeeIdInput.fill(data.employeeId);
        }
    }
}
