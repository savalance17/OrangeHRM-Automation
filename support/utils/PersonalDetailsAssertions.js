import { expect } from '@playwright/test';

/**
 * Проверяет, что страница Personal Details открыта и поля содержат ожидаемые данные сотрудника.
 * @param {import('../pageObjects/Pages/PIM/PimFacade.js').default} pim - экземпляр PimFacade
 * @param {Object} employeeData - { firstName, lastName, middleName, employeeId }
 * @param {number} [timeout=20000] - таймаут проверок в мс (по умолчанию 20 сек)
 */
export async function verifyPersonalDetails(pim, employeeData, timeout = 20_000) {
    const personalDetails = pim.personalDetails;
    const opts = { timeout };
    await expect(personalDetails.employeeNameHeading).toBeVisible(opts);
    await expect(personalDetails.employeeNameHeading).toContainText(employeeData.firstName, opts);
    await expect(personalDetails.employeeNameHeading).toContainText(employeeData.lastName, opts);
    await expect(personalDetails.firstNameInput).toHaveValue(employeeData.firstName, opts);
    await expect(personalDetails.middleNameInput).toHaveValue(employeeData.middleName, opts);
    await expect(personalDetails.lastNameInput).toHaveValue(employeeData.lastName, opts);
    await expect(personalDetails.employeeIdInput).toHaveValue(employeeData.employeeId, opts);
}
/**
 * Проверяет, что обновлённые поля Personal Details содержат ожидаемые значения.
 * @param {import('../pageObjects/Pages/PIM/PimFacade.js').default} pim - экземпляр PimFacade
 * @param {Object} updatedData - { firstName, lastName, otherId, driverLicenseNumber }
 * @param {number} [timeout=20000] - таймаут проверок в мс
 */
export async function verifyPersonalDetailsUpdatedFields(pim, updatedData, timeout = 20_000) {
    const personalDetails = pim.personalDetails;
    const opts = { timeout };
    await expect(personalDetails.firstNameInput).toHaveValue(updatedData.firstName, opts);
    await expect(personalDetails.lastNameInput).toHaveValue(updatedData.lastName, opts);
    await expect(personalDetails.otherIdInput).toHaveValue(updatedData.otherId, opts);
    await expect(personalDetails.driverLicenseNumberInput).toHaveValue(updatedData.driverLicenseNumber, opts);
}

