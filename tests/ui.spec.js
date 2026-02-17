import { test, expect, users, EmployeeDataBuilder } from '../support/orangehrm/fixtures/index.js';
import '../support/allure-screenshots.js';
import { apiLogin } from '../support/orangehrm/utils/auth/authentication.js';
import {
    openPim,
    createEmployee,
    goToEmployeeListAndSearchById,
    openEmployeeCardForEdit,
    deleteEmployee,
} from '../support/orangehrm/utils/pim/pimHelpers.js';

/** @typedef {import('../support/orangehrm/pages/pim/index.js').PimFacade} PimFacade */
/** @typedef {import('@playwright/test').Page} Page */

test.describe('PIM', { tag: ['@smoke', '@pim'] }, () => {

    test.beforeEach(async (/** @type {{ page: Page }} */ { page }) => {
        await apiLogin(page, users.adminUserLogin, users.adminUserPassword);
        await openPim(page);
    });

    test('Добавление сотрудника в "Employee List"', async function (/** @type {{ pim: PimFacade }} */ { pim }) {
        const employeeData = new EmployeeDataBuilder().withRandomEmployeeId().build();

        await createEmployee(pim, employeeData);

        const formData = await pim.personalDetails.getPersonalDetailsValues();
        expect(formData).toMatchObject({
            firstName: employeeData.firstName,
            middleName: employeeData.middleName,
            lastName: employeeData.lastName,
            employeeId: employeeData.employeeId,
        });
    });

    test('Поиск добавленного сотрудника в Employee List по Employee Id', async function (/** @type {{ pim: PimFacade }} */ { pim }) {
        const employeeData = new EmployeeDataBuilder().withRandomEmployeeId().build();

        await createEmployee(pim, employeeData);
        await goToEmployeeListAndSearchById(pim, employeeData.employeeId);

        const rowCount = await pim.pimEmployeeList.getTableRowCount();
        expect(rowCount).toBeGreaterThan(0);
        const row = pim.pimEmployeeList.getRowByEmployeeId(employeeData.employeeId);
        await expect(row).toContainText(employeeData.firstName);
        await expect(row).toContainText(employeeData.lastName);
    });

    test('Поиск добавленного сотрудника в Employee List по Employee Name', async function (/** @type {{ pim: PimFacade }} */ { pim }) {
        const employeeData = new EmployeeDataBuilder().withRandomEmployeeId().build();

        await createEmployee(pim, employeeData);

        await pim.topbarHeader.openEmployeeListTab();
        await pim.pimEmployeeList.searchByFilters({
            employeeName: `${employeeData.firstName} ${employeeData.lastName}`
        });

        const rowCount = await pim.pimEmployeeList.getTableRowCount();
        expect(rowCount).toBeGreaterThan(0);
        const rowsByName = pim.pimEmployeeList.getRowsByEmployeeName(employeeData.firstName, employeeData.lastName);
        await expect(rowsByName).toContainText(employeeData.employeeId);
    });

    test('Редактирование сотрудника', async function (/** @type {{ pim: PimFacade }} */ { pim }) {
        const employeeData = new EmployeeDataBuilder().withRandomEmployeeId().build();
        const updatedData = new EmployeeDataBuilder().withoutEmployeeId().build();

        await createEmployee(pim, employeeData);

        await goToEmployeeListAndSearchById(pim, employeeData.employeeId);
        const rowCount = await pim.pimEmployeeList.getTableRowCount();
        expect(rowCount).toBeGreaterThan(0);
        const row = pim.pimEmployeeList.getRowByEmployeeId(employeeData.employeeId);
        await expect(row).toContainText(employeeData.firstName);
        await openEmployeeCardForEdit(pim, employeeData.employeeId);

        await pim.personalDetails.updatePersonalDetails(updatedData);
        await pim.personalDetails.clickSave();

        const formData = await pim.personalDetails.getPersonalDetailsValues();
        expect(formData).toMatchObject({
            firstName: updatedData.firstName,
            lastName: updatedData.lastName,
            middleName: updatedData.middleName,
        });

        await goToEmployeeListAndSearchById(pim, employeeData.employeeId);
        const rowCountAfter = await pim.pimEmployeeList.getTableRowCount();
        expect(rowCountAfter).toBeGreaterThan(0);

        const updatedRow = pim.pimEmployeeList.getRowByEmployeeId(employeeData.employeeId);
        await expect(updatedRow).toContainText(updatedData.firstName);
        await expect(updatedRow).toContainText(updatedData.lastName);
    });

    test('Удаление сотрудника', async function (/** @type {{ pim: PimFacade }} */ { pim }) {
        const employeeData = new EmployeeDataBuilder().withRandomEmployeeId().build();

        await createEmployee(pim, employeeData);

        await goToEmployeeListAndSearchById(pim, employeeData.employeeId);
        await pim.pimEmployeeList.waitForRowWithEmployeeIdVisible(employeeData.employeeId);
        const rowCount = await pim.pimEmployeeList.getTableRowCount();
        expect(rowCount).toBeGreaterThan(0);
        const row = pim.pimEmployeeList.getRowByEmployeeId(employeeData.employeeId);
        await expect(row).toContainText(employeeData.firstName);
        await expect(row).toContainText(employeeData.lastName);
        await deleteEmployee(pim, employeeData.employeeId);

        await pim.pimEmployeeList.searchByFilters({ employeeId: employeeData.employeeId });
        const rowCountAfter = await pim.pimEmployeeList.getTableRowCount();
        expect(rowCountAfter).toBe(0);
    });
});
