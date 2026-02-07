import AuthorizationPage from '../pageObjects/Pages/AuthorizationPage.js';
import { submitLoginViaFetch } from '../api/authApi.js';
import {
    AUTH_LOGIN_PATH,
    AUTH_VALIDATE_PATH,
    AUTH_DASHBOARD_PATH,
    AUTH_TIMEOUT_MS,
    AUTH_VERIFY_TIMEOUT_MS,
    DASHBOARD_HEADING_SELECTOR,
} from '../config/constants.js';

/**
 * Проверяет, что пользователь успешно авторизован: URL дашборда и видимый заголовок "Dashboard".
 * @param {{ timeout?: number }} options
 * @throws если за timeout не выполнились условия
 */
export async function expectLoggedIn(page, options = {}) {
    const timeout = options.timeout ?? AUTH_VERIFY_TIMEOUT_MS;
    await page.waitForURL(/\/dashboard\//, { timeout });
    await page.locator(DASHBOARD_HEADING_SELECTOR).waitFor({ state: 'visible', timeout });
}

/**
 * Логин через UI
 * После входа проверяет успешную авторизацию (expectLoggedIn).
 */
export async function manualLogin(page, login, password) {
    await page.goto(AUTH_LOGIN_PATH);

    const authorizationPage = new AuthorizationPage(page);
    await authorizationPage.fillLoginInput(login);
    await authorizationPage.fillPasswordInput(password);
    await authorizationPage.clickLoginButton();

    await expectLoggedIn(page);
}

/**
 * Логин через API
 * @param {object} options - redirectTo: путь после логина (по умолчанию dashboard), null — не переходить
 */
export async function apiLogin(page, login, password, options = {}) {
    const { redirectTo = AUTH_DASHBOARD_PATH } = options;

    await page.goto(AUTH_LOGIN_PATH);

    const authPage = new AuthorizationPage(page);
    await authPage.tokenInput.waitFor({ state: 'attached', timeout: AUTH_TIMEOUT_MS });
    const token = await authPage.tokenInput.inputValue();
    if (!token) {
        throw new Error('CSRF token (_token) not found on login page');
    }

    const baseURL = new URL(page.url()).origin;
    const validateUrl = baseURL + AUTH_VALIDATE_PATH;

    const ok = await submitLoginViaFetch(page, {
        validateUrl,
        token,
        username: login,
        password,
    });

    if (!ok) {
        throw new Error('Login failed: auth/validate returned non-OK status');
    }

    if (redirectTo != null && redirectTo !== false) {
        const path = redirectTo.startsWith('http') ? redirectTo : baseURL + redirectTo;
        await page.goto(path);
        await expectLoggedIn(page);
    }
}
