/** @import { Page } from '@playwright/test'; */

import { expect, test } from '#test';

/**
 * Sets up button fixtures.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await page.evaluate(() => {
        document.body.innerHTML = `
            <button class="btn btn-secondary" id="button1" data-ui-toggle="button" type="button"></button>
            <button class="btn btn-secondary" id="button2" data-ui-toggle="button" type="button"></button>
        `;
    });
};

/**
 * Registers shared button init tests.
 * @param {(selector: string) => object} init The browser callback for init.
 */
export function buttonInitTests(init) {
    test('creates a button', async ({ page }) => {
        const instance = await page.evaluateHandle(init, '#button1');

        expect(await instance.evaluate((value) => value instanceof UI.Button)).toBe(true);
        expect(await page.evaluate(() =>
            $.getData('#button1', 'button') instanceof UI.Button)).toBe(true);
    });
}

/**
 * Registers shared button dispose tests.
 * @param {(selector: string) => void} dispose The browser callback for dispose.
 */
export function buttonDisposeTests(dispose) {
    test('removes the button', async ({ page }) => {
        await page.evaluate(dispose, '#button1');

        expect(await page.evaluate(() => $.hasData('#button1', 'button'))).toBe(false);
    });
}

/**
 * Registers shared button toggle tests.
 * @param {(selector: string) => void} toggle The browser callback for toggle.
 */
export function buttonToggleTests(toggle) {
    test('toggles the button', async ({ page }) => {
        await page.evaluate(toggle, '#button1');

        await expect(page.locator('#button1')).toHaveClass(/\bactive\b/);
        await expect(page.locator('#button1')).toHaveAttribute('aria-pressed', 'true');
        await expect(page.locator('#button2')).not.toHaveClass(/\bactive\b/);
        await expect(page.locator('#button2')).not.toHaveAttribute('aria-pressed');
    });

    test('toggles the button off', async ({ page }) => {
        await page.evaluate(toggle, '#button1');
        await page.evaluate(toggle, '#button1');

        await expect(page.locator('#button1')).not.toHaveClass(/\bactive\b/);
        await expect(page.locator('#button1')).toHaveAttribute('aria-pressed', 'false');
    });
}
