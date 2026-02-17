import { test as base, expect } from '@playwright/test';
import ApiFacade from '../api/ApiFacade.js';

/** @type {import('@playwright/test').TestType<{ api: ApiFacade }>} */
export const test = base.extend({
  api: async ({ request }, use) => {
    const api = new ApiFacade(request);
    await use(api);
  },
});

export { expect };
