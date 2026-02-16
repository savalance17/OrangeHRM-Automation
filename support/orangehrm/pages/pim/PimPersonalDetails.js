/**
 * Страница Personal Details (редактирование сотрудника)
 */
export default class PimPersonalDetails {
    constructor(page) {
        this.page = page;
        this.content = page.locator('.orangehrm-edit-employee-content');
        this.mainTitle = this.content.locator('.orangehrm-main-title').filter({ hasText: 'Personal Details' });
        this.employeeNameHeading = page.locator('.orangehrm-edit-employee-name h6');
        this.firstNameInput = this.content.locator('input[name="firstName"]');
        this.middleNameInput = this.content.locator('input[name="middleName"]');
        this.lastNameInput = this.content.locator('input[name="lastName"]');
        this.employeeIdInput = this.content.locator('.oxd-input-group').filter({ hasText: 'Employee Id' }).locator('input.oxd-input');
        this.formLoader = this.content.locator('.oxd-form-loader');
        this.saveButton = this.content.locator('form').filter({ hasText: 'Employee Full Name' }).getByRole('button', { name: 'Save' });
    }

    /**
     * Универсальное ожидание готовности страницы: лоадер скрыт → заголовок виден → поле формы видно.
     * Сначала ждём скрытия лоадера, затем контент (заголовок и поля) появляется.
     * @param {number} [timeout=40000] - таймаут на каждый шаг (мс)
     */
    async waitUntilReady(timeout = 60_000) {
        await this.formLoader.waitFor({ state: 'hidden', timeout });
        await this.mainTitle.waitFor({ state: 'visible', timeout });
        await this.firstNameInput.waitFor({ state: 'visible', timeout });
    }

    /**
     * Обновляет поля Personal Details. Заполняет только переданные поля.
     * @param {Object} data
     * @param {string} [data.firstName] - имя
     * @param {string} [data.middleName] - отчество
     * @param {string} [data.lastName] - фамилия
     */
    async updatePersonalDetails(data) {
        await this.waitUntilReady();
        if (data.firstName != null) await this.firstNameInput.fill(data.firstName);
        if (data.middleName != null) await this.middleNameInput.fill(data.middleName);
        if (data.lastName != null) await this.lastNameInput.fill(data.lastName);
    }

    /**
     * Нажимает кнопку Save для сохранения изменений Personal Details.
     */
    async clickSave() {
        await this.waitUntilReady();
        await this.saveButton.click();
    }

    /**
     * Возвращает значения основных полей Personal Details.
     * @returns {Promise<{ firstName: string, middleName: string, lastName: string, employeeId: string, employeeNameHeading: string }>}
     */
    async getPersonalDetailsValues() {
        await this.waitUntilReady();
        const employeeNameHeading = (await this.employeeNameHeading.textContent()) ?? '';
        return {
            employeeNameHeading,
            firstName: await this.firstNameInput.inputValue(),
            middleName: await this.middleNameInput.inputValue(),
            lastName: await this.lastNameInput.inputValue(),
            employeeId: await this.employeeIdInput.inputValue(),
        };
    }
}
