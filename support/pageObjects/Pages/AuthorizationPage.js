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
}