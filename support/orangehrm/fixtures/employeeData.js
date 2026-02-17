import { faker } from '@faker-js/faker';

/**
 * Билдер тестовых данных сотрудника (Builder).
 * Позволяет собирать объект с полями firstName, middleName, lastName, employeeId через цепочку вызовов.
 */
export class EmployeeDataBuilder {
    constructor() {
        this.data = {};
        this.includeEmployeeId = true;
    }

    /**
     * Генерирует случайный Employee Id (8 символов, буквы/цифры, верхний регистр) и включает его в результат build().
     * @returns {EmployeeDataBuilder} this для цепочки вызовов
     */
    withRandomEmployeeId() {
        this.data.employeeId = faker.string.alphanumeric(8).toUpperCase();
        this.includeEmployeeId = true;
        return this;
    }

    /**
     * Исключает поле employeeId из результата build() (например, для данных только имени/фамилии при обновлении Personal Details).
     * @returns {EmployeeDataBuilder} this для цепочки вызовов
     */
    withoutEmployeeId() {
        this.includeEmployeeId = false;
        return this;
    }

    /**
     * Собирает объект тестовых данных. Неуказанные поля заполняются через faker.
     * @returns {{ firstName: string, middleName: string, lastName: string, [employeeId]: string }} объект данных сотрудника
     */
    build() {
        const data = {
            firstName: this.data.firstName ?? faker.person.firstName(),
            middleName: this.data.middleName ?? faker.person.firstName(),
            lastName: this.data.lastName ?? faker.person.lastName(),
        };

        if (this.includeEmployeeId) {
            data.employeeId = this.data.employeeId ?? faker.string.alphanumeric(8).toUpperCase();
        }

        return data;
    }
}
