const adminLogin = process.env.ORANGEHRM_ADMIN_LOGIN;
const adminPassword = process.env.ORANGEHRM_ADMIN_PASSWORD;

if (!adminLogin || !adminPassword) {
    throw new Error(
        'ORANGEHRM_ADMIN_LOGIN and ORANGEHRM_ADMIN_PASSWORD must be set (e.g. in .env or CI secrets). See README.'
    );
}

export const users = {
    adminUserLogin: adminLogin,
    adminUserPassword: adminPassword,
};

export const testUsers = [
    { login: users.adminUserLogin, password: users.adminUserPassword },
];
