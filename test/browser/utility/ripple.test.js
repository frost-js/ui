import { expect, test } from '#test';
import { advanceClock } from '../../setup/browser.js';

test.use({ reducedMotion: 'no-preference' });

test.use({ mockClock: true });

test.describe('Ripple', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate(() => {
            document.body.innerHTML = '<button class="btn btn-secondary ripple" id="button"></button>';
        });
    });

    test.describe('user events', () => {
        test('shows ripple effect on click', async ({ page }) => {
            await page.locator('#button').click();
            await advanceClock(page, 250);

            await expect(page.locator('#button > .ripple-effect')).toHaveClass('ripple-effect show');
            await expect(page.locator('#button > .ripple-effect')).toHaveCSS('--ui-ripple-scale', /[1-9]\d*/);
        });

        test('removes ripple effect after animation completes', async ({ page }) => {
            await page.locator('#button').click();
            await advanceClock(page, 550);

            await expect(page.locator('#button > .ripple-effect')).toHaveCount(0);
        });

        test('replaces a previous ripple effect', async ({ page }) => {
            await page.locator('#button').click();
            await page.evaluate(() => {
                window.previousRipple = $.findOne('#button > .ripple-effect');
            });

            await page.locator('#button').click();

            expect(await page.evaluate(() => window.previousRipple.isConnected)).toBe(false);
            await expect(page.locator('#button > .ripple-effect')).toHaveCount(1);
            await expect(page.locator('#button > .ripple-effect')).toHaveClass('ripple-effect show');
        });
    });
});
