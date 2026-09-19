/** @import { Page } from '@playwright/test'; */

import { expect, test } from '#test';

/**
 * Sets up collapse fixtures.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await page.evaluate(() => {
        document.body.innerHTML = `
            <button class="btn btn-secondary collapsed" id="collapse-toggle-1" data-ui-toggle="collapse" data-ui-target="#collapse1" type="button"></button>
            <button class="btn btn-secondary collapsed" id="collapse-toggle-2" data-ui-toggle="collapse" data-ui-target="#collapse2" type="button"></button>
            <div class="collapse" id="collapse1"><span style="display:block;width:120px;height:80px"></span></div>
            <div class="collapse" id="collapse2"><span style="display:block;width:120px;height:80px"></span></div>
        `;
    });
};

/**
 * Registers shared collapse init tests.
 * @param {(selector: string) => object} init The browser callback for init.
 */
export function collapseInitTests(init) {
    test('creates a collapse', async ({ page }) => {
        const instance = await page.evaluateHandle(init, '#collapse1');

        expect(await instance.evaluate((value) => value instanceof UI.Collapse)).toBe(true);
        expect(await page.evaluate(() =>
            $.getData('#collapse1', 'collapse') instanceof UI.Collapse)).toBe(true);
    });
}

/**
 * Registers shared collapse dispose tests.
 * @param {(selector: string) => void} dispose The browser callback for dispose.
 */
export function collapseDisposeTests(dispose) {
    test('removes the collapse', async ({ page }) => {
        await page.evaluate(dispose, '#collapse1');

        expect(await page.evaluate(() => $.hasData('#collapse1', 'collapse'))).toBe(false);
    });
}

/**
 * Registers shared collapse show tests.
 * @param {(selector: string) => void} show The browser callback for show.
 */
export function collapseShowTests(show) {
    test('shows the collapse', async ({ page }) => {
        await page.evaluate(show, '#collapse1');

        await expect(page.locator('#collapse-toggle-1')).toHaveClass('btn btn-secondary');
        await expect(page.locator('#collapse-toggle-1')).toHaveAttribute('aria-expanded', 'true');
        await expect(page.locator('#collapse1')).toHaveClass('collapse show');
        await expect(page.locator('#collapse1')).toHaveAttribute('style', '');
        await expect(page.locator('#collapse2')).toHaveClass('collapse');
    });
}

/**
 * Registers shared collapse hide tests.
 * @param {(selector: string) => void} show The browser callback for show.
 * @param {(selector: string) => void} hide The browser callback for hide.
 */
export function collapseHideTests(show, hide) {
    test('hides the collapse', async ({ page }) => {
        await page.evaluate(show, '#collapse1');
        await expect(page.locator('#collapse1')).toHaveClass('collapse show');

        await page.evaluate(hide, '#collapse1');

        await expect(page.locator('#collapse-toggle-1')).toHaveClass('btn btn-secondary collapsed');
        await expect(page.locator('#collapse-toggle-1')).toHaveAttribute('aria-expanded', 'false');
        await expect(page.locator('#collapse1')).toHaveClass('collapse');
        await expect(page.locator('#collapse1')).toHaveAttribute('style', '');
        await expect(page.locator('#collapse2')).toHaveClass('collapse');
    });
}

/**
 * Registers shared collapse toggle (show) tests.
 * @param {(selector: string) => void} toggle The browser callback for toggle.
 */
export function collapseToggleShowTests(toggle) {
    test('shows the collapse', async ({ page }) => {
        await page.evaluate(toggle, '#collapse1');

        await expect(page.locator('#collapse-toggle-1')).toHaveClass('btn btn-secondary');
        await expect(page.locator('#collapse-toggle-1')).toHaveAttribute('aria-expanded', 'true');
        await expect(page.locator('#collapse1')).toHaveClass('collapse show');
        await expect(page.locator('#collapse1')).toHaveAttribute('style', '');
    });
}

/**
 * Registers shared collapse toggle (hide) tests.
 * @param {(selector: string) => void} show The browser callback for show.
 * @param {(selector: string) => void} toggle The browser callback for toggle.
 */
export function collapseToggleHideTests(show, toggle) {
    test('hides the collapse', async ({ page }) => {
        await page.evaluate(show, '#collapse1');
        await expect(page.locator('#collapse1')).toHaveClass('collapse show');

        await page.evaluate(toggle, '#collapse1');

        await expect(page.locator('#collapse-toggle-1')).toHaveClass('btn btn-secondary collapsed');
        await expect(page.locator('#collapse-toggle-1')).toHaveAttribute('aria-expanded', 'false');
        await expect(page.locator('#collapse1')).toHaveClass('collapse');
        await expect(page.locator('#collapse1')).toHaveAttribute('style', '');
    });
}
