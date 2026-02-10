import { test, expect } from '@playwright/test';
import '../support/allure-screenshots.js';
import { manualLogin } from '../support/orangehrm/utils/auth/authentication.js';
import AuthorizationPage from '../support/orangehrm/pages/common/AuthorizationPage.js';
import DashboardPage from '../support/orangehrm/pages/common/DashboardPage.js';
import { users } from '../support/orangehrm/fixtures/index.js';

const invalidCredentialsMessage = 'Invalid credentials';

test.describe('Авторизация', { tag: ['@smoke', '@auth'] }, () => {

    test('Успешный вход по логину и паролю', async ({ page }) => {
        const dashboardPage = new DashboardPage(page);
        const expectedHeading = 'Dashboard';

        await test.step('Войти в систему по логину и паролю', async () => {
            await manualLogin(page, users.adminUserLogin, users.adminUserPassword);
        });

        await test.step('Проверить, что отображается главная страница (Dashboard)', async () => {
            const headingText = await dashboardPage.getHeadingText();
            expect(headingText).toBe(expectedHeading);
        });
    });

    test('Неуспешный вход при неверном пароле', async ({ page }) => {
        const authPage = new AuthorizationPage(page);
        const wrongPassword = 'wrong-password';

        await test.step('Ввести неверный пароль и нажать Login', async () => {
            await authPage.openAndSubmitLogin(users.adminUserLogin, wrongPassword);
        });

        await test.step('Остаёмся на странице логина, отображается сообщение об ошибке', async () => {
            const errorText = await authPage.getErrorAlertText();
            expect(errorText).toContain(invalidCredentialsMessage);
            await expect(page).toHaveURL(/auth\/login/);
        });
    });

    test('Неуспешный вход при неверном логине', async ({ page }) => {
        const authPage = new AuthorizationPage(page);
        const wrongLogin = 'wrong-login';

        await test.step('Ввести неверный логин и нажать Login', async () => {
            await authPage.openAndSubmitLogin(wrongLogin, users.adminUserPassword);
        });

        await test.step('Остаёмся на странице логина, отображается сообщение об ошибке', async () => {
            const errorText = await authPage.getErrorAlertText();
            expect(errorText).toContain(invalidCredentialsMessage);
            await expect(page).toHaveURL(/auth\/login/);
        });
    });
});
