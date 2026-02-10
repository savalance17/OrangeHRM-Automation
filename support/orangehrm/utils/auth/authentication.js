import { test } from '@playwright/test';
import AuthorizationPage from '../../pages/common/AuthorizationPage.js';
import DashboardPage from '../../pages/common/DashboardPage.js';
import { submitLoginViaFetch } from '../../api/authApi.js';

/**
 * Проверяет, что пользователь успешно авторизован: URL дашборда и видимый заголовок Dashboard.
 * Используется дефолтный таймаут Playwright.
 */
export async function expectLoggedIn(page) {
    const dashboardPage = new DashboardPage(page);

    await test.step('Проверка URL dashboard', async () => {
        await page.waitForURL(/\/dashboard\/?/);
    });
    await test.step('Проверка заголовка Dashboard', async () => {
        await dashboardPage.waitForHeadingVisible();
    });
}

/**
 * Логин через UI
 * После входа проверяет успешную авторизацию (expectLoggedIn).
 */
export async function manualLogin(page, login, password) {
    const authorizationPage = new AuthorizationPage(page);

    await test.step('Выполнить авторизацию (логин и пароль)', async () => {
        await authorizationPage.openAndSubmitLogin(login, password);
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
    const authValidatePath = '/web/index.php/auth/validate';
    let token;
    let baseURL;
    let validateUrl;
    let ok;

    await test.step('Открыть страницу логина', async () => {
        await page.goto('/');
    });
    await test.step('Получить CSRF token', async () => {
        await authPage.tokenInput.waitFor({ state: 'attached' });
        token = await authPage.tokenInput.inputValue();
        if (!token) {
            throw new Error('CSRF token (_token) not found on login page');
        }
    });
    await test.step('Подготовить URL для auth/validate', async () => {
        baseURL = new URL(page.url()).origin;
        validateUrl = baseURL + authValidatePath;
    });
    await test.step('Отправить запрос авторизации', async () => {
        ok = await submitLoginViaFetch(page, {
            validateUrl,
            token,
            username: login,
            password,
        });
    });
    if (!ok) {
        throw new Error('Login failed: auth/validate returned non-OK status');
    }

    await test.step('Перейти в приложение (сессия уже установлена)', async () => {
        await page.goto('/');
    });
    await test.step('Проверить успешность входа (URL + заголовок Dashboard)', async () => {
        await expectLoggedIn(page);
    });
}
