import { expect, test } from '@playwright/test';
import { advanceClock, resetPage, setupClock } from '../../setup/browser.js';
import { expectAnimationState } from '../../support/assertions/animation.js';

test.beforeEach(async ({ page }) => {
    await setupClock(page);
    await resetPage(page);
});

test.describe('Ripple', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<button class="btn btn-secondary ripple" id="button"></button>';
        });
    });

    test.describe('user events', () => {
        test('shows ripple effect on click', async ({ page }) => {
            await page.locator('#button').click();
            await advanceClock(page, 250);

            await expectAnimationState(page, [
                {
                    selectors: ['#button > .ripple-effect'],
                    progress: 0.5,
                },
            ]);
        });

        test('removes ripple effect after animation completes', async ({ page }) => {
            await page.locator('#button').click();
            await advanceClock(page, 550);

            await expect(page.locator('#button > .ripple-effect')).toHaveCount(0);
        });
    });
});
