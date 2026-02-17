import { test } from '@playwright/test';

/**
 * Модальное окно подтверждения "Are you Sure?".
 */
export default class ConfirmDeleteModal {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.dialog = page.locator('.oxd-dialog-container-default--inner');
        this.title = this.dialog.locator('.orangehrm-modal-header .oxd-text--card-title');
        this.body = this.dialog.locator('.orangehrm-text-center-align .oxd-text--card-body');
        this.cancelButton = this.dialog.getByRole('button', { name: 'No, Cancel' });
        this.confirmButton = this.dialog.getByRole('button', { name: 'Yes, Delete' });
    }

    /**
     * Подтверждает — нажимает "Yes, Delete".
     */
    async confirm() {
        await test.step('Подтверждение удаления в модалке', async () => {
            await this.waitForVisible(true);
            await this.confirmButton.click();
            await this.waitForVisible(false);
        });
    }

    /**
     * Отменяет — нажимает "No, Cancel".
     */
    async cancel() {
        await test.step('Отмена удаления в модалке', async () => {
            await this.waitForVisible(true);
            await this.cancelButton.click();
            await this.waitForVisible(false);
        });
    }

    /**
     * Ждёт видимости или скрытия модалки.
     * При неудаче логирует причину и пробрасывает ошибку.
     * @param {boolean} visible - true: ждёт появления, false: ждёт исчезновения
     * @param {number} timeout - таймаут ожидания (мс)
     */
    async waitForVisible(visible = true, timeout = 2_000) {
        try {
            await this.dialog.waitFor({ state: visible ? 'visible' : 'hidden', timeout });
        } catch (err) {
            const expectation = visible ? 'появления' : 'исчезновения';
            console.error(`[ConfirmDeleteModal] Модалка не дождалась ${expectation} (timeout ${timeout}ms):`, err?.message ?? err);
            throw err;
        }
    }
}
