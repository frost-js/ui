/** @import { Page } from '@playwright/test'; */

import { expect, test } from '#test';
import { waitForFrame } from '../../setup/browser.js';

/**
 * Sets up toast fixtures.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await page.evaluate(() => {
        document.body.innerHTML = `
            <div class="toast fade show" id="toast1">
                <button class="btn-close" id="button1" data-ui-dismiss="toast" type="button"></button>
            </div>
            <div class="toast fade show" id="toast2">
                <button class="btn-close" id="button2" data-ui-dismiss="toast" type="button"></button>
            </div>
        `;
    });
};

/**
 * Sets up hidden toast fixtures.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setupHidden = async ({ page }) => {
    await page.locator('.toast').evaluateAll((toasts) => {
        for (const toast of toasts) {
            toast.classList.remove('show');
            toast.style.setProperty('display', 'none', 'important');
        }
    });
    await waitForFrame(page);
};

/**
 * Sets up toast timer fixtures.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setupAutohide = async ({ page }) => {
    await page.locator('#toast1').evaluate((toast) => {
        toast.classList.remove('fade', 'show');
        toast.style.setProperty('display', 'none', 'important');
    });
};

/**
 * Registers shared toast init tests.
 * @param {(selector: string) => object} init The browser callback for init.
 */
export function toastInitTests(init) {
    test('creates a toast', async ({ page }) => {
        const instance = await page.evaluateHandle(init, '#toast1');

        expect(await instance.evaluate((value) => value instanceof UI.Toast)).toBe(true);
        expect(await page.evaluate(() =>
            $.getData('#toast1', 'toast') instanceof UI.Toast)).toBe(true);
    });
}

/**
 * Registers shared toast dispose tests.
 * @param {(selector: string) => void} dispose The browser callback for dispose.
 */
export function toastDisposeTests(dispose) {
    test('removes the toast', async ({ page }) => {
        await page.evaluate(dispose, '#toast1');

        expect(await page.evaluate(() => $.hasData('#toast1', 'toast'))).toBe(false);
    });
}

/**
 * Registers shared toast hide tests.
 * @param {(selector: string) => void} hide The browser callback for hide.
 */
export function toastHideTests(hide) {
    test('hides the toast', async ({ page }) => {
        await page.evaluate(hide, '#toast1');

        await expect(page.locator('#toast1')).not.toHaveClass(/\bshow\b/);
        await expect(page.locator('#toast1')).toBeHidden();
        await expect(page.locator('#toast2')).toHaveClass(/\bshow\b/);
        await expect(page.locator('#toast2')).toBeVisible();
    });
}

/**
 * Registers shared toast show tests.
 * @param {(selector: string) => void} show The browser callback for show.
 */
export function toastShowTests(show) {
    test('shows the toast', async ({ page }) => {
        await page.evaluate(show, '#toast1');

        await expect(page.locator('#toast1')).toHaveClass(/\bshow\b/);
        await expect(page.locator('#toast1')).toBeVisible();
        await expect(page.locator('#toast1')).toHaveAttribute('style', '');
        await expect(page.locator('#toast2')).not.toHaveClass(/\bshow\b/);
        await expect(page.locator('#toast2')).toBeHidden();
    });
}
