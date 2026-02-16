import { test as base, expect } from '@playwright/test';
import { AuthFacade } from '../pages/common/index.js';

/** @typedef {import('../pages/common/index.js').AuthFacade} AuthFacade */

/** @type {import('@playwright/test').TestType<{ auth: AuthFacade }>} */
export const test = base.extend({
    auth: async ({ page }, use) => {
        const auth = new AuthFacade(page);
        await use(auth);
    },
});

export { expect };
