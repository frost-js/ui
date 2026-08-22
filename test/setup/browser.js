/**
 * Install Playwright's browser clock and pause it at a stable fixed time.
 * @param {import('@playwright/test').Page} page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export async function setupClock(page) {
    await page.clock.install({ time: 0 });
    await page.clock.pauseAt(60000);
}

/**
 * Deterministically advance the browser clock, including enough margin for a
 * queued start and a frame on the requested boundary to be processed.
 * @param {import('@playwright/test').Page} page The Playwright page.
 * @param {number} milliseconds The duration to advance.
 * @returns {Promise<void>} The promise.
 */
export async function advanceClock(page, milliseconds) {
    await page.clock.runFor(milliseconds + 2);
}

/**
 * Wait for callbacks queued for the next animation frame.
 * @param {import('@playwright/test').Page} page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export async function waitForFrame(page) {
    await page.evaluate((_) => new Promise((resolve) => {
        window.requestAnimationFrame(resolve);
    }));
}

/**
 * Reset the browser page and FrostUI defaults.
 * @param {import('@playwright/test').Page} page The Playwright page.
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
        UI.Collapse.defaults.duration = 100;
        UI.Popover.defaults.noAttributes = true;
        UI.Toast.defaults.delay = 200;
        UI.Tooltip.defaults.noAttributes = true;
        UI._clickTarget = null;

        document.body.replaceChildren();

        return window.$ === window.fQuery;
    });

    if (!stateReset) {
        throw new Error('Failed to restore FrostUI on the test page.');
    }

    await page.waitForFunction((_) => {
        const test = document.createElement('div');
        test.className = 'text-center';
        document.body.append(test);
        const ready = getComputedStyle(test).textAlign === 'center';
        test.remove();
        return ready;
    });
}
