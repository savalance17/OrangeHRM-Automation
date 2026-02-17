import { test } from '@playwright/test';

/**
 * Страница авторизации OrangeHRM
 */
export default class AuthorizationPage {
    constructor(page) {
        this.page = page;
        this.usernameInput = page.locator('input[name="username"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.loginButton = page.locator('button[type="submit"].orangehrm-login-button');
        this.tokenInput = page.locator('input[name="_token"]');
        this.errorAlert = page.getByRole('alert');
    }

    /**
     * Заполняет поле Username.
     * @param {string} login
     */
    async fillLoginInput(login) {
        await test.step('Заполнение логина', async () => {
            await this.usernameInput.waitFor({ state: 'visible' });
            await this.usernameInput.fill(login);
        });
    }

    /**
     * Заполняет поле Password.
     * @param {string} password
     */
    async fillPasswordInput(password) {
        await test.step('Заполнение пароля', async () => {
            await this.passwordInput.fill(password);
        });
    }

    /** Нажимает кнопку Login. */
    async clickLoginButton() {
        await test.step('Клик по Login', async () => {
            await this.loginButton.click();
        });
    }

    /**
     * Открывает страницу логина, заполняет логин и пароль, нажимает Login.
     * @param {string} login
     * @param {string} password
     */
    async openAndSubmitLogin(login, password) {
        await test.step('Открытие страницы логина', async () => {
            await this.page.goto('/');
        });
        await this.fillLoginInput(login);
        await this.fillPasswordInput(password);
        await this.clickLoginButton();
    }

    /**
     * Возвращает текст сообщения об ошибке логина (алерт).
     * @returns {Promise<string>}
     */
    async getErrorAlertText() {
        return await test.step('Получение текста ошибки авторизации', async () => {
            await this.errorAlert.waitFor({ state: 'visible' });
            return this.errorAlert.textContent();
        });
    }
}