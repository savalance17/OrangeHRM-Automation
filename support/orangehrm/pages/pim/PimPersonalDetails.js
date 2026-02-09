import { test } from '@playwright/test';

/**
 * Страница Personal Details (редактирование сотрудника)
 */
export default class PimPersonalDetails {
    constructor(page) {
        this.page = page;
        this.mainTitle = page.locator('.orangehrm-edit-employee-content .orangehrm-main-title').filter({ hasText: 'Personal Details' });
        this.employeeNameHeading = page.locator('.orangehrm-edit-employee-name h6');
        this.firstNameInput = page.locator('input[name="firstName"]');
        this.middleNameInput = page.locator('input[name="middleName"]');
        this.lastNameInput = page.locator('input[name="lastName"]');
        this.employeeIdInput = page.locator('.oxd-input-group').filter({ hasText: 'Employee Id' }).locator('input.oxd-input');
        this.formLoader = page.locator('.orangehrm-edit-employee-content .oxd-form-loader');
        this.saveButton = page.locator('.orangehrm-edit-employee-content form').filter({ hasText: 'Employee Full Name' }).getByRole('button', { name: 'Save' });
    }

    /**
     * Ждёт появления страницы Personal Details (заголовок виден). Использовать после перехода на эту страницу (например после Save в Add Employee).
     * @param {number} [timeout=90000] - таймаут ожидания (мс)
     */
    async waitForPageReady(timeout = 90_000) {
        await this.mainTitle.waitFor({ state: 'visible', timeout });
    }

    /**
     * Ждёт исчезновения лоадера формы. Если не исчезнет за timeout — тест падает.
     * @param {number} [timeout=45000] - таймаут ожидания
     */
    async waitForLoaderHidden(timeout = 45_000) {
        await this.formLoader.waitFor({ state: 'hidden', timeout });
    }

    /**
     * Ждёт окончания загрузки формы Personal Details: исчезновение лоадера и появление полей.
     * @param {number} [loaderTimeout=45000] - таймаут ожидания исчезновения лоадера
     * @param {number} [fieldsTimeout=10000] - таймаут ожидания появления полей после лоадера
     */
    async waitForFormLoaded(loaderTimeout = 45_000, fieldsTimeout = 10_000) {
        await this.formLoader.waitFor({ state: 'hidden', timeout: loaderTimeout });
        await this.firstNameInput.waitFor({ state: 'visible', timeout: fieldsTimeout });
    }

    /**
     * Обновляет поля Personal Details. Заполняет только переданные поля.
     * @param {Object} data
     * @param {string} [data.firstName] - имя
     * @param {string} [data.middleName] - отчество
     * @param {string} [data.lastName] - фамилия
     */
    async updatePersonalDetails(data) {
        await test.step('Ожидание формы Personal Details', async () => {
            await this.waitForFormLoaded();
        });

        await test.step('Заполнение полей Personal Details', async () => {
            if (data.firstName != null) await this.firstNameInput.fill(data.firstName);
            if (data.middleName != null) await this.middleNameInput.fill(data.middleName);
            if (data.lastName != null) await this.lastNameInput.fill(data.lastName);
        });
    }

    /**
     * Нажимает кнопку Save для сохранения изменений Personal Details.
     * Перед кликом ждёт исчезновения лоадера
     */
    async clickSave() {
        await this.waitForLoaderHidden();
        await this.saveButton.click();
    }

    /**
     * Возвращает значения основных полей Personal Details.
     * @returns {Promise<{ firstName: string, middleName: string, lastName: string, employeeId: string, employeeNameHeading: string }>}
     */
    async getPersonalDetailsValues() {
        await this.waitForFormLoaded();
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
