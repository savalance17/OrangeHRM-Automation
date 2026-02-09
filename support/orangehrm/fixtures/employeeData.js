import { faker } from '@faker-js/faker';

/**
 * Генерация тестовых данных: firstName, middleName, lastName; при опции includeEmployeeId добавляется employeeId.
 * Для создания сотрудника — createEmployeeDataFields() или createEmployeeDataFields({ includeEmployeeId: true }).
 * Для обновления полей имени в Personal Details — createEmployeeDataFields({ includeEmployeeId: false }).
 * @param {{ includeEmployeeId?: boolean }} [options] — по умолчанию { includeEmployeeId: true }
 * @returns {{ firstName: string, middleName: string, lastName: string, [employeeId]: string }}
 */
export function createEmployeeDataFields(options = {}) {
    const { includeEmployeeId = true } = options;
    const data = {
        firstName: faker.person.firstName(),
        middleName: faker.person.firstName(),
        lastName: faker.person.lastName(),
    };
    if (includeEmployeeId) {
        data.employeeId = faker.string.alphanumeric(8).toUpperCase();
    }
    return data;
}
