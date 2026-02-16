import { SidebarMenu, TopbarHeader } from '../../pages/common/index.js';

/**
 * Открывает раздел PIM (клик по пункту меню) и ждёт, пока отобразится страница PIM.
 * @param {import('@playwright/test').Page} page
 */
export async function openPim(page) {
    const sidebarMenu = new SidebarMenu(page);
    const topbarHeader = new TopbarHeader(page);

    await sidebarMenu.clickPim();
    await topbarHeader.breadcrumbModule.filter({ hasText: 'PIM' }).waitFor({ state: 'visible' });
}

/**
 * Подготовка тестовых данных: создаёт сотрудника по переданным данным.
 * @param {import('../../pages/pim/PimFacade.js').default} pim
 * @param {Object} employeeData - { firstName, middleName, lastName, employeeId } (из createEmployeeDataFields())
 */
export async function createEmployee(pim, employeeData) {
    await pim.pimEmployeeList.clickAdd();
    await pim.pimAddEmployee.mainTitle.waitFor({ state: 'visible', timeout: 15_000 });

    await pim.pimAddEmployee.fillForm(employeeData);
    await pim.pimAddEmployee.clickSave();

    await pim.personalDetails.waitUntilReady();
}

/**
 * Переход на вкладку Employee List и поиск сотрудника по Employee Id.
 * Ждёт загрузки таблицы, затем выполняет поиск. Проверку количества записей выполняет тест.
 * @param {import('../../pages/pim/PimFacade.js').default} pim
 * @param {string} employeeId - ID сотрудника
 */
export async function goToEmployeeListAndSearchById(pim, employeeId) {
    await pim.topbarHeader.openEmployeeListTab();
    await pim.pimEmployeeList.waitForTableReady();
    await pim.pimEmployeeList.searchByFilters({ employeeId });
}

/**
 * Открывает карточку сотрудника для редактирования (клик Edit по строке с employeeId)
 * и ждёт готовности страницы Personal Details.
 * @param {string} employeeId
 */
export async function openEmployeeCardForEdit(pim, employeeId) {
    await pim.pimEmployeeList.clickEditButton(employeeId);
    await pim.personalDetails.waitUntilReady();
}

/**
 * Удаляет сотрудника: нажатие Delete, подтверждение в модалке, ожидание обновления таблицы.
 * @param {string} employeeId
 */
export async function deleteEmployee(pim, employeeId) {
    await pim.pimEmployeeList.clickDeleteButton(employeeId);
    await pim.confirmDeleteModal.confirm();
    await pim.pimEmployeeList.waitForTableReady();
}
