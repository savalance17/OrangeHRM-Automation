/**
 * Страница Personal Details (редактирование сотрудника).
 * Заголовок с именем, поля First/Middle/Last Name, Employee Id, Other Id, Driver's License, 
 * Nationality, Marital Status, Date of Birth, Gender, Custom Fields (Blood Type, Test_Field).
 * Лоадер формы — отдельный от лоадера на странице Add Employee (там свой .oxd-form-loader).
 */
export default class PimPersonalDetails {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.mainTitle = page.locator('.orangehrm-edit-employee-content .orangehrm-main-title').filter({ hasText: 'Personal Details' });
        this.employeeNameHeading = page.locator('.orangehrm-edit-employee-name h6');
        this.firstNameInput = page.locator('input[name="firstName"]');
        this.middleNameInput = page.locator('input[name="middleName"]');
        this.lastNameInput = page.locator('input[name="lastName"]');
        this.employeeIdInput = page.locator('.oxd-input-group').filter({ hasText: 'Employee Id' }).locator('input.oxd-input');
        this.otherIdInput = page.locator('.oxd-input-group').filter({ hasText: 'Other Id' }).locator('input.oxd-input');
        this.driverLicenseNumberInput = page.locator('.oxd-input-group').filter({ hasText: "Driver's License Number" }).locator('input.oxd-input');
        this.licenseExpiryDateInput = page.locator('.oxd-input-group').filter({ hasText: 'License Expiry Date' }).locator('.oxd-date-input input');
        this.nationalitySelect = page.locator('.oxd-input-group').filter({ hasText: 'Nationality' }).locator('.oxd-select-text');
        this.maritalStatusSelect = page.locator('.oxd-input-group').filter({ hasText: 'Marital Status' }).locator('.oxd-select-text');
        this.dateOfBirthInput = page.locator('.oxd-input-group').filter({ hasText: 'Date of Birth' }).locator('.oxd-date-input input');
        this.bloodTypeSelect = page.locator('.oxd-input-group').filter({ hasText: 'Blood Type' }).locator('.oxd-select-text');
        this.testFieldInput = page.locator('.oxd-input-group').filter({ hasText: 'Test_Field' }).locator('input.oxd-input');
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
     * Выбирает опцию в выпадающем списке Personal Details (Nationality, Marital Status, Blood Type).
     * Перед кликом ждёт исчезновения лоадера.
     * @param {import('@playwright/test').Locator} selectTrigger - локатор .oxd-select-text
     * @param {string} optionText - текст опции
     */
    async selectOption(selectTrigger, optionText) {
        await this.waitForLoaderHidden();
        await selectTrigger.click();
        await this.page.getByRole('option', { name: new RegExp(`^\\s*${optionText}\\s*$`, 'i') }).click();
    }

    /**
     * Обновляет поля Personal Details. Заполняет только переданные поля.
     * @param {Object} data
     * @param {string} [data.firstName] - имя
     * @param {string} [data.middleName] - отчество
     * @param {string} [data.lastName] - фамилия
     * @param {string} [data.otherId] - Other Id
     * @param {string} [data.driverLicenseNumber] - номер водительских прав
     * @param {string} [data.licenseExpiryDate] - срок действия прав (формат yyyy-dd-mm)
     * @param {string} [data.nationality] - национальность (например "Russian Federation")
     * @param {string} [data.maritalStatus] - семейное положение (например "Single", "Married")
     * @param {string} [data.dateOfBirth] - дата рождения (формат yyyy-dd-mm)
     * @param {'Male'|'Female'} [data.gender] - пол
     * @param {string} [data.bloodType] - группа крови (например "A+", "B-")
     * @param {string} [data.testField] - кастомное поле Test_Field
     */
    async updatePersonalDetails(data) {
        await this.waitForFormLoaded();

        // Имя First, Middle, Last Name
        if (data.firstName != null) await this.firstNameInput.fill(data.firstName);
        if (data.middleName != null) await this.middleNameInput.fill(data.middleName);
        if (data.lastName != null) await this.lastNameInput.fill(data.lastName);

        // Other Id и водительские права ———
        if (data.otherId != null) await this.otherIdInput.fill(data.otherId);
        if (data.driverLicenseNumber != null) await this.driverLicenseNumberInput.fill(data.driverLicenseNumber);
        if (data.licenseExpiryDate != null) await this.licenseExpiryDateInput.fill(data.licenseExpiryDate);

        // Выпадающие списки: национальность, семейное положение
        if (data.nationality != null) await this.selectOption(this.nationalitySelect, data.nationality);
        if (data.maritalStatus != null) await this.selectOption(this.maritalStatusSelect, data.maritalStatus);

        // Радиобаттон "Пол"
        if (data.gender != null) await this.selectGender(data.gender);

        // Дата рождения
        if (data.dateOfBirth != null) await this.dateOfBirthInput.fill(data.dateOfBirth);

        // Blood Type, Test_Field
        if (data.bloodType != null) await this.selectOption(this.bloodTypeSelect, data.bloodType);
        if (data.testField != null) await this.testFieldInput.fill(data.testField);
    }

    /**
     * Выбирает пол (Male / Female) по радиокнопке в форме Personal Details.
     * @param {'Male'|'Female'} gender
     */
    async selectGender(gender) {
        await this.waitForLoaderHidden();
        const container = this.page.locator('.orangehrm-edit-employee-content');
        await container.getByRole('radio', { name: gender, exact: true }).locator('xpath=ancestor::label[1]').click();
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

    /**
     * Возвращает значения полей, которые меняются при обновлении Personal Details (для проверки после редактирования).
     * @returns {Promise<{ firstName: string, middleName: string, lastName: string, otherId: string, driverLicenseNumber: string, nationality: string, maritalStatus: string, gender: string }>}
     */
    async getUpdatedFormValues() {
        await this.waitForFormLoaded();
        const container = this.page.locator('.orangehrm-edit-employee-content');
        const genderValue = await container.locator('input[type="radio"]:checked').getAttribute('value');
        const gender = genderValue === '1' ? 'Male' : genderValue === '2' ? 'Female' : '';
        return {
            firstName: await this.firstNameInput.inputValue(),
            middleName: await this.middleNameInput.inputValue(),
            lastName: await this.lastNameInput.inputValue(),
            otherId: await this.otherIdInput.inputValue(),
            driverLicenseNumber: await this.driverLicenseNumberInput.inputValue(),
            nationality: (await this.nationalitySelect.textContent())?.trim() ?? '',
            maritalStatus: (await this.maritalStatusSelect.textContent())?.trim() ?? '',
            gender,
        };
    }
}
