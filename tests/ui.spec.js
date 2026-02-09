import { test, expect } from '@playwright/test';
import '../support/allure-screenshots.js';
import { apiLogin } from '../support/orangehrm/utils/auth/authentication.js';
import { users, createEmployeeDataFields } from '../support/orangehrm/fixtures/index.js';
import PimFacade from '../support/orangehrm/pages/pim/PimFacade.js';
import {
    openPim,
    createEmployee,
    goToEmployeeListAndSearchById,
    openEmployeeCardForEdit,
    deleteEmployee,
    expectEmployeeFoundInList
} from '../support/orangehrm/utils/pim/pimHelpers.js';

test.describe('PIM', { tag: ['@smoke','@pim' ]}, () => {

    test.beforeEach(async ({ page }) => {
        await apiLogin(page, users.adminUserLogin, users.adminUserPassword);
        await openPim(page);
    });

    test('Добавление сотрудника в "Employee List"', async function ({ page }) {
        const pim = new PimFacade(page);
        const employeeData = createEmployeeDataFields();

        await test.step('Подготовка тестовых данных: создание сотрудника', async () => {
            await createEmployee(pim, employeeData);
        });

        await test.step('Проверка данных на странице Personal Details', async () => {
            const formData = await pim.personalDetails.getPersonalDetailsValues();
            expect(formData).toMatchObject({
                firstName: employeeData.firstName,
                middleName: employeeData.middleName,
                lastName: employeeData.lastName,
                employeeId: employeeData.employeeId,
            });
        });
    })

    test('Поиск добавленного сотрудника в Employee List по Employee Id', async function ({ page }) {
        const pim = new PimFacade(page);
        const employeeData = createEmployeeDataFields();

        await test.step('Подготовка тестовых данных: создание сотрудника', async () => {
            await createEmployee(pim, employeeData);
        });

        await test.step('Переход в Employee List и поиск по Employee Id', async () => {
            await goToEmployeeListAndSearchById(pim, employeeData.employeeId);
        });

        await test.step('Проверка, что сотрудник найден в списке', async () => {
            await expectEmployeeFoundInList(pim, employeeData);
        });
    })

    test('Поиск добавленного сотрудника в Employee List по Employee Name', async function ({ page }) {
        const pim = new PimFacade(page);
        const employeeData = createEmployeeDataFields();

        await test.step('Подготовка тестовых данных: создание сотрудника', async () => {
            await createEmployee(pim, employeeData);
        });

        await test.step('Переход в Employee List и поиск по имени и фамилии', async () => {
            await pim.topbarHeader.openEmployeeListTab();
            await pim.pimEmployeeList.searchByFilters({
                employeeName: `${employeeData.firstName} ${employeeData.lastName}`
            });
        });

        await test.step('Проверка, что сотрудник найден в списке', async () => {
            await expect(pim.pimEmployeeList.getAllTableRows()).toHaveCount(1);
            const rowsByName = pim.pimEmployeeList.getRowsByEmployeeName(employeeData.firstName, employeeData.lastName);
            await expect(rowsByName).toContainText(employeeData.employeeId);
        });
    })

    test('Редактирование сотрудника', async function ({ page }) {
        const pim = new PimFacade(page);
        const employeeData = createEmployeeDataFields();
        const updatedData = createEmployeeDataFields({ includeEmployeeId: false });

        await test.step('Подготовка тестовых данных: создание сотрудника', async () => {
            await createEmployee(pim, employeeData);
        });

        await test.step('Переход в список, поиск сотрудника и открытие карточки', async () => {
            await goToEmployeeListAndSearchById(pim, employeeData.employeeId);
            await openEmployeeCardForEdit(pim, employeeData.employeeId);
        });

        await test.step('Обновление имени, фамилии и отчества и сохранение', async () => {
            await pim.personalDetails.updatePersonalDetails(updatedData);
            await pim.personalDetails.clickSave();
        });

        await test.step('Проверка обновлённых полей (имя, фамилия, отчество) на странице Personal Details', async () => {
            const formData = await pim.personalDetails.getPersonalDetailsValues();
            expect(formData).toMatchObject({
                firstName: updatedData.firstName,
                lastName: updatedData.lastName,
                middleName: updatedData.middleName,
            });
        });

        await test.step('Переход в список и поиск сотрудника', async () => {
            await goToEmployeeListAndSearchById(pim, employeeData.employeeId);
        });

        await test.step('Проверка отображения изменений в таблице', async () => {
            const updatedRow = pim.pimEmployeeList.getRowByEmployeeId(employeeData.employeeId);
            await expect(updatedRow).toContainText(updatedData.firstName);
            await expect(updatedRow).toContainText(updatedData.lastName);
        });
    })

    test('Удаление сотрудника', async function ({ page }) {
        const pim = new PimFacade(page);
        const employeeData = createEmployeeDataFields();

        await test.step('Подготовка тестовых данных: создание сотрудника', async () => {
            await createEmployee(pim, employeeData);
        });

        await test.step('Переход в Employee List, поиск сотрудника и удаление', async () => {
            await goToEmployeeListAndSearchById(pim, employeeData.employeeId);
            await deleteEmployee(pim, employeeData.employeeId);
        });

        await test.step('Ищем сотрудника в списке и проверяем, что ничего не найдено', async () => {
            await pim.pimEmployeeList.searchByFilters({ employeeId: employeeData.employeeId });
            await expect(pim.pimEmployeeList.getAllTableRows()).toHaveCount(0);
        });
    });
});