/** Barrel: единая точка входа для тестов OrangeHRM (фикстуры auth + pim, данные) */
import '../../allure-screenshots.js';

export { users, testUsers } from './users.js';
export { authMessages } from './messages.js';
export { createEmployeeDataFields } from './employeeData.js';
export { test, expect } from './orangehrmFixture.js';