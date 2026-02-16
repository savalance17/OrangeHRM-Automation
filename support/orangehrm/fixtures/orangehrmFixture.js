import { test as testWithAuth, expect } from './authFixture.js';
import PimFacade from '../pages/pim/PimFacade.js';

/** @typedef {import('../pages/common/index.js').AuthFacade} AuthFacade */

/** @type {import('@playwright/test').TestType<{ auth: AuthFacade, pim: PimFacade }>} */
export const test = testWithAuth.extend({
    pim: async ({ page }, use) => {
        const pim = new PimFacade(page);
        await use(pim);
    },
});

export { expect };
