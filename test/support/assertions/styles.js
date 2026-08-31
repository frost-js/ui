/** @import { Page } from '@playwright/test'; */

import { expect } from '@playwright/test';

/**
 * @typedef {object} StyleExpectation
 * @property {string[]} selectors The selectors.
 * @property {Record<string, string>} styles The expected inline styles.
 */

/**
 * Expects inline styles on the matched nodes.
 * @param {Page} page The Playwright page.
 * @param {StyleExpectation[]} expectations The expected style states.
 * @returns {Promise<void>} The promise.
 */
export async function expectStyles(page, expectations) {
    for (const { selectors, styles } of expectations) {
        for (const selector of selectors) {
            const locator = page.locator(selector);

            await expect(locator).toHaveCount(1);

            for (const [property, value] of Object.entries(styles)) {
                await expect(locator).toHaveJSProperty(`style.${property}`, value);
            }
        }
    }
}
