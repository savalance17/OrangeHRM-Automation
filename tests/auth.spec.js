import { test, expect } from '../support/orangehrm/fixtures/authFixture.js';
import '../support/allure-screenshots.js';
import { manualLogin } from '../support/orangehrm/utils/auth/authentication.js';
import { users } from '../support/orangehrm/fixtures/index.js';

const invalidCredentialsMessage = 'Invalid credentials';

test.describe('Авторизация', { tag: ['@smoke', '@auth'] }, () => {

    test('Успешный вход по логину и паролю', async ({ page, auth }) => {
        const expectedHeading = 'Dashboard';

        await test.step('Войти в систему по логину и паролю', async () => {
            await manualLogin(page, users.adminUserLogin, users.adminUserPassword);
        });

        await test.step('Проверить, что отображается главная страница (Dashboard)', async () => {
            const headingText = await auth.dashboardPage.getHeadingText();
            expect(headingText).toBe(expectedHeading);
        });
    });

    test('Неуспешный вход при неверном пароле', async ({ page, auth }) => {
        const wrongPassword = 'wrong-password';

        await test.step('Ввести неверный пароль и нажать Login', async () => {
            await auth.authorizationPage.openAndSubmitLogin(users.adminUserLogin, wrongPassword);
        });

        await test.step('Остаёмся на странице логина, отображается сообщение об ошибке', async () => {
            const errorText = await auth.authorizationPage.getErrorAlertText();
            expect(errorText).toContain(invalidCredentialsMessage);
            await expect(page).toHaveURL(/auth\/login/);
        });
    });

    test('Неуспешный вход при неверном логине', async ({ page, auth }) => {
        const wrongLogin = 'wrong-login';

        await test.step('Ввести неверный логин и нажать Login', async () => {
            await auth.authorizationPage.openAndSubmitLogin(wrongLogin, users.adminUserPassword);
        });

        await test.step('Остаёмся на странице логина, отображается сообщение об ошибке', async () => {
            const errorText = await auth.authorizationPage.getErrorAlertText();
            expect(errorText).toContain(invalidCredentialsMessage);
            await expect(page).toHaveURL(/auth\/login/);
        });
    });
});
