import process from 'node:process';
import { test as base, expect } from '@playwright/test';
import { addCoverageReport } from 'monocart-reporter';
import { setupClock } from '../setup/browser.js';

const collectCoverage = process.env.FROST_UI_COVERAGE === 'true';

const test = base.extend({
    mockClock: [false, { option: true }],
    uiPage: [
        async ({ page, mockClock }, use, testInfo) => {
            if (collectCoverage) {
                await page.coverage.startJSCoverage({
                    resetOnNavigation: false,
                });
            }

            if (mockClock) {
                await setupClock(page);
            }

            await page.goto('/', {
                waitUntil: 'domcontentloaded',
            });

            await page.evaluate((_) => {
                if (!window.fQuery || !window.UI) {
                    throw new Error('Failed to load Frost UI on the test page.');
                }

                // Keep the stylesheet in the head for component layout and transitions.
                document.body.replaceChildren();
            });

            await page.waitForFunction((_) => {
                const node = document.createElement('div');
                node.className = 'text-center';
                document.body.append(node);
                const ready = getComputedStyle(node).textAlign === 'center';
                node.remove();
                return ready;
            });

            await use();

            if (collectCoverage) {
                const coverage = await page.coverage.stopJSCoverage();
                await addCoverageReport(coverage, testInfo);
            }
        },
        { auto: true },
    ],
});

export { expect, test };
