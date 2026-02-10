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
        await this.usernameInput.waitFor({ state: 'visible', timeout: 10000 });
        await this.usernameInput.fill(login);
    }

    /**
     * Заполняет поле Password.
     * @param {string} password
     */
    async fillPasswordInput(password) {
        await this.passwordInput.fill(password);
    }

    /** Нажимает кнопку Login. */
    async clickLoginButton() {
        await this.loginButton.click();
    }

    /**
     * Открывает страницу логина, заполняет логин и пароль, нажимает Login.
     * @param {string} login
     * @param {string} password
     */
    async openAndSubmitLogin(login, password) {
        await this.page.goto('/');
        await this.fillLoginInput(login);
        await this.fillPasswordInput(password);
        await this.clickLoginButton();
    }

    /**
     * Возвращает текст сообщения об ошибке логина (алерт).
     * @returns {Promise<string>}
     */
    async getErrorAlertText() {
        await this.errorAlert.waitFor({ state: 'visible' });
        return this.errorAlert.textContent();
    }
}