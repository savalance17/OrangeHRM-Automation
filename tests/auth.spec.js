import { test, expect, users, authMessages } from '../support/orangehrm/fixtures/index.js';
import { manualLogin } from '../support/orangehrm/utils/auth/authentication.js';

/** @typedef {import('@playwright/test').Page} Page */
/** @typedef {import('../support/orangehrm/pages/common/index.js').AuthFacade} AuthFacade */

test.describe('Авторизация', { tag: ['@smoke', '@auth'] }, () => {

    test('Успешный вход по логину и паролю', async (/** @type {{ page: Page, auth: AuthFacade }} */ { page, auth }) => {
        const expectedHeading = 'Dashboard';

        await manualLogin(page, users.adminUserLogin, users.adminUserPassword);

        const headingText = await auth.dashboardPage.getHeadingText();
        expect(headingText).toBe(expectedHeading);
    });

    test('Неуспешный вход при неверном пароле', async (/** @type {{ page: Page, auth: AuthFacade }} */ { page, auth }) => {
        const wrongPassword = 'wrong-password';

        await auth.authorizationPage.openAndSubmitLogin(users.adminUserLogin, wrongPassword);

        const errorText = await auth.authorizationPage.getErrorAlertText();
        expect(errorText).toContain(authMessages.invalidCredentials);
        await expect(page).toHaveURL(/auth\/login/);
    });

    test('Неуспешный вход при неверном логине', async (/** @type {{ page: Page, auth: AuthFacade }} */ { page, auth }) => {
        const wrongLogin = 'wrong-login';

        await auth.authorizationPage.openAndSubmitLogin(wrongLogin, users.adminUserPassword);

        const errorText = await auth.authorizationPage.getErrorAlertText();
        expect(errorText).toContain(authMessages.invalidCredentials);
        await expect(page).toHaveURL(/auth\/login/);
    });
});
