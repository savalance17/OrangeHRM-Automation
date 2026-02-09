import { expect } from '@playwright/test';
import SidebarMenu from '../../pages/common/SidebarMenu.js';
import TopbarHeader from '../../pages/common/TopbarHeader.js';

/**
 * Открывает раздел PIM и проверяет, что открылся модуль PIM и вкладка Employee List.
 * При падении проверки логирует, какая именно проверка не прошла.
 * @param {import('@playwright/test').Page} page
 */
export async function openPim(page) {
    const sidebarMenu = new SidebarMenu(page);
    const topbarHeader = new TopbarHeader(page);
    await page.goto('/web/index.php/pim/viewPimModule');

    const checks = [
        { name: 'PIM пункт меню активен', fn: () => expect(sidebarMenu.pimMenuItem).toHaveClass(/active/, { timeout: 15_000 }) },
        { name: 'Breadcrumb содержит PIM', fn: () => expect(topbarHeader.breadcrumbModule).toHaveText('PIM') },
        { name: 'Вкладка Employee List посещена', fn: () => expect(topbarHeader.employeeListTab).toHaveClass(/--visited/, { timeout: 15_000 }) },
    ];

    for (const { name, fn } of checks) {
        try {
            await fn();
        } catch (err) {
            console.error(`[openPimAndVerify] Не прошла проверка: "${name}".`, err.message);
            throw err;
        }
    }
}
