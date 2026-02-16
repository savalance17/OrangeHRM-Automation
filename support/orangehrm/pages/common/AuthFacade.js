import { AuthorizationPage, DashboardPage } from './index.js';

/**
 * Фасад для сценариев авторизации: страница логина и Dashboard после входа.
 */
export default class AuthFacade {
    constructor(page) {
        this.authorizationPage = new AuthorizationPage(page);
        this.dashboardPage = new DashboardPage(page);
    }
}
