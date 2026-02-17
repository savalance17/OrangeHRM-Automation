import { test as base, expect } from '@playwright/test';
import { PimFacade } from '../pages/pim/index.js';

/** @type {import('@playwright/test').TestType<{ pim: PimFacade }>} */
export const test = base.extend({
    pim: async ({ page }, use) => {
        const pim = new PimFacade(page);
        await use(pim);
    },
});

export { expect };
