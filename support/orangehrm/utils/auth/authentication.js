import { AuthorizationPage, DashboardPage } from '../../pages/common/index.js';
import { submitLoginViaFetch } from '../../api/authApi.js';

/**
 * Проверяет, что пользователь успешно авторизован: URL дашборда и видимый заголовок Dashboard.
 * Используется дефолтный таймаут Playwright.
 */
export async function expectLoggedIn(page) {
    const dashboardPage = new DashboardPage(page);
    await page.waitForURL(/\/dashboard\/?/);
    await dashboardPage.waitForHeadingVisible();
}

/**
 * Логин через UI
 * После входа проверяет успешную авторизацию (expectLoggedIn).
 */
export async function manualLogin(page, login, password) {
    const authorizationPage = new AuthorizationPage(page);
    await authorizationPage.openAndSubmitLogin(login, password);
    await expectLoggedIn(page);
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

    await page.goto('/');
    await authPage.tokenInput.waitFor({ state: 'attached' });
    token = await authPage.tokenInput.inputValue();
    if (!token) {
        throw new Error('CSRF token (_token) not found on login page');
    }
    baseURL = new URL(page.url()).origin;
    validateUrl = baseURL + authValidatePath;
    ok = await submitLoginViaFetch(page, {
        validateUrl,
        token,
        username: login,
        password,
    });
    if (!ok) {
        throw new Error('Login failed: auth/validate returned non-OK status');
    }
    await page.goto('/');
    await expectLoggedIn(page);
}
