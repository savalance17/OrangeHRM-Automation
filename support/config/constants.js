/** Пути и таймауты авторизации OrangeHRM */
export const AUTH_LOGIN_PATH = '/web/index.php/auth/login';
export const AUTH_VALIDATE_PATH = '/web/index.php/auth/validate';
export const AUTH_DASHBOARD_PATH = '/web/index.php/dashboard/index';
export const AUTH_TIMEOUT_MS = 10000;
export const AUTH_VERIFY_TIMEOUT_MS = 10000;

/** Селектор заголовка дашборда — признак успешной авторизации */
export const DASHBOARD_HEADING_SELECTOR = 'h6:has-text("Dashboard")';
