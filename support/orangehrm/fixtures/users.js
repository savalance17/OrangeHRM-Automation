export const users = {
    adminUserLogin: process.env.ORANGEHRM_ADMIN_LOGIN || 'Admin',
    adminUserPassword: process.env.ORANGEHRM_ADMIN_PASSWORD || 'admin123',
}

export const testUsers = [
    { login: users.adminUserLogin, password: users.adminUserPassword },
]
