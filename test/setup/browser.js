/** @import { Page } from '@playwright/test'; */

/**
 * Install Playwright's browser clock and pause it at a stable fixed time.
 * @param {Page} page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export async function setupClock(page) {
    await page.clock.install({ time: 0 });
    await page.clock.pauseAt(60000);
}

/**
 * Deterministically advance the browser clock, including enough margin for a
 * queued start and a frame on the requested boundary to be processed.
 * @param {Page} page The Playwright page.
 * @param {number} milliseconds The duration to advance.
 * @returns {Promise<void>} The promise.
 */
export async function advanceClock(page, milliseconds) {
    await page.clock.runFor(milliseconds + 2);
}

/**
 * Wait for callbacks queued for the next animation frame.
 * @param {Page} page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export async function waitForFrame(page) {
    await page.evaluate((_) => new Promise((resolve) => {
        window.requestAnimationFrame(resolve);
    }));
}

/**
 * Reset the browser page and Frost UI defaults.
 * @param {Page} page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export async function resetPage(page) {
    await page.goto('/', {
        waitUntil: 'domcontentloaded',
    });

    const stateReset = await page.evaluate((_) => {
        if (!window.fQuery || !window.UI) {
            return false;
        }

        window.$ = window.fQuery;
        $.setAnimationDefaults({ debug: true });
        $.useTimeout();

        UI.Carousel.defaults.interval = 200;
        UI.Carousel.defaults.transition = 100;
        UI.Toast.defaults.delay = 200;
        UI._clickTarget = null;

        $.empty(document.body);

        return window.$ === window.fQuery;
    });

    if (!stateReset) {
        throw new Error('Failed to restore Frost UI on the test page.');
    }

    await page.waitForFunction((_) => {
        const test = $.create('div', { class: 'text-center' });
        $.append(document.body, test);
        const ready = $.css(test, 'text-align') === 'center';
        $.remove(test);
        return ready;
    });
}
