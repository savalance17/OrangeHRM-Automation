import { expect } from '@playwright/test';

/**
 * Подготовка тестовых данных: создаёт сотрудника по переданным данным.
 * @param {import('../../pages/pim/PimFacade.js').default} pim
 * @param {Object} employeeData - { firstName, middleName, lastName, employeeId } (из createEmployeeDataFields())
 */
export async function createEmployee(pim, employeeData) {
    await pim.pimEmployeeList.clickAdd();
    await pim.pimAddEmployee.mainTitle.waitFor({ state: 'visible', timeout: 15_000 });
    await expect(pim.pimAddEmployee.mainTitle).toHaveText('Add Employee');

    await pim.pimAddEmployee.fillForm(employeeData);
    await pim.pimAddEmployee.clickSave();

    await pim.personalDetails.waitForPageReady();
}

/**
 * Переход на вкладку Employee List и поиск сотрудника по Employee Id.
 * Ждёт исчезновения лоадера таблицы после перехода, затем поиск; проверяет, что найдена ровно одна запись.
 * @param {string} employeeId
 */
export async function goToEmployeeListAndSearchById(pim, employeeId) {
    await pim.topbarHeader.openEmployeeListTab();
    await pim.pimEmployeeList.waitForTableLoaded();
    await pim.pimEmployeeList.searchByFilters({ employeeId });
    await expect(pim.pimEmployeeList.getAllTableRows()).toHaveCount(1);
}

/**
 * Проверяет, что в списке найден ровно один сотрудник с указанными данными.
 * @param {Object} employeeData - { firstName, lastName, employeeId }
 */
export async function expectEmployeeFoundInList(pim, employeeData) {
    await expect(pim.pimEmployeeList.getAllTableRows()).toHaveCount(1);
    const row = pim.pimEmployeeList.getRowByEmployeeId(employeeData.employeeId);
    await expect(row).toContainText(employeeData.firstName);
    await expect(row).toContainText(employeeData.lastName);
}

/**
 * Открывает карточку сотрудника для редактирования (клик Edit по строке с employeeId)
 * и ждёт готовности страницы Personal Details: заголовок, исчезновение лоадера, появление полей формы.
 * @param {string} employeeId
 */
export async function openEmployeeCardForEdit(pim, employeeId) {
    await pim.pimEmployeeList.clickEditButton(employeeId);
    await pim.personalDetails.waitForPageReady();
    await pim.personalDetails.waitForLoaderHidden();
    await pim.personalDetails.waitForFormLoaded();
}

/**
 * Удаляет сотрудника: нажатие Delete, подтверждение в модалке, ожидание обновления таблицы.
 * @param {string} employeeId
 */
export async function deleteEmployee(pim, employeeId) {
    await pim.pimEmployeeList.clickDeleteButton(employeeId);
    await pim.confirmDeleteModal.confirm();
    await pim.pimEmployeeList.waitForTableLoaded();
}
