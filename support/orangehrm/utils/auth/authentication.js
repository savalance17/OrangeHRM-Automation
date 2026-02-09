import { test } from '@playwright/test';
import AuthorizationPage from '../../pages/common/AuthorizationPage.js';
import DashboardPage from '../../pages/common/DashboardPage.js';
import { submitLoginViaFetch } from '../../api/authApi.js';
import {
    AUTH_VALIDATE_PATH,
    AUTH_TIMEOUT_MS,
    AUTH_VERIFY_TIMEOUT_MS,
} from '../../config/constants.js';

/**
 * Проверяет, что пользователь успешно авторизован: URL дашборда и видимый заголовок "Dashboard".
 * @param {{ timeout?: number }} options
 * @throws если за timeout не выполнились условия
 */
export async function expectLoggedIn(page, options = {}) {
    const dashboardPage = new DashboardPage(page);

    const timeout = options.timeout ?? AUTH_VERIFY_TIMEOUT_MS;
    await test.step('Проверка URL dashboard', async () => {
        await page.waitForURL(/\/dashboard\//, { timeout });
    });
    await test.step('Проверка заголовка Dashboard', async () => {
        await dashboardPage.waitForHeadingVisible(timeout);
    });
}

/**
 * Логин через UI
 * После входа проверяет успешную авторизацию (expectLoggedIn).
 */
export async function manualLogin(page, login, password) {
    const authorizationPage = new AuthorizationPage(page);

    await test.step('Открыть страницу логина', async () => {
        await page.goto('/');
    });
    await test.step('Заполнить логин и пароль', async () => {
        await authorizationPage.fillLoginInput(login);
        await authorizationPage.fillPasswordInput(password);
    });
    await test.step('Нажать Login', async () => {
        await authorizationPage.clickLoginButton();
    });
    await test.step('Проверить, что логин успешен', async () => {
        await expectLoggedIn(page);
    });
}

/**
 * Логин через API
 */
export async function apiLogin(page, login, password) {
    const authPage = new AuthorizationPage(page);
    let token;
    let baseURL;
    let validateUrl;
    let ok;

    await test.step('Открыть страницу логина', async () => {
        await page.goto('/');
    });
    await test.step('Получить CSRF token', async () => {
        await authPage.tokenInput.waitFor({ state: 'attached', timeout: AUTH_TIMEOUT_MS });
        token = await authPage.tokenInput.inputValue();
        if (!token) {
            throw new Error('CSRF token (_token) not found on login page');
        }
    });
    await test.step('Подготовить URL для auth/validate', async () => {
        baseURL = new URL(page.url()).origin;
        validateUrl = baseURL + AUTH_VALIDATE_PATH;
    });
    await test.step('Отправить запрос авторизации', async () => {
        ok = await submitLoginViaFetch(page, {
            validateUrl,
            token,
            username: login,
            password,
        });
    });
    await test.step('Проверить успешность авторизации', async () => {
        if (!ok) {
            throw new Error('Login failed: auth/validate returned non-OK status');
        }
    });
}
