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
    const expectedStates = expectations.flatMap((expectation) =>
        expectation.selectors.map((selector) => ({
            selector,
            styles: expectation.styles,
        })),
    );
    const actualStates = await page.evaluate((expectedStates) => {
        return expectedStates.map(({ selector, styles }) => {
            const nodes = document.querySelectorAll(selector);
            const node = nodes.item(0);

            return {
                matches: nodes.length,
                styles: node ? Object.fromEntries(
                    Object.keys(styles).map((property) => [property, node.style[property]]),
                ) : null,
            };
        });
    }, expectedStates);

    for (const [index, expected] of expectedStates.entries()) {
        const actual = actualStates[index];
        const message = `Styles for ${expected.selector}`;

        expect(actual.matches, `${message}: selector match count`).toBe(1);
        expect(actual.styles, message).toEqual(expected.styles);
    }
}
