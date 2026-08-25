import { expect, test } from '@playwright/test';
import { resetPage } from '../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('Offcanvas FocusTrap', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<button class="btn btn-secondary" id="offcanvasToggle" data-ui-toggle="offcanvas" data-ui-target="#offcanvas" type="button"></button>' +
                '<div class="offcanvas offcanvas-start" id="offcanvas">' +
                '<button class="btn-close" id="button1" data-ui-dismiss="offcanvas" type="button"></button>' +
                '<button id="button2" type="button"></button>' +
                '</div>';
        });
    });

    test.describe('focus trap', () => {
        test('prevents focus outside the offcanvas', async ({ page }) => {
            await page.evaluate((_) => new Promise((resolve) => {
                const offcanvas = $.findOne('#offcanvas');

                $.addEventOnce(offcanvas, 'shown.ui.offcanvas', (_) => resolve());
                UI.Offcanvas.init(offcanvas).show();
            }));
            await page.locator('#offcanvasToggle').focus();

            await expect(page.locator('#button1')).toBeFocused();
        });

        test('reverses focus if shift/tab key is pressed', async ({ page }) => {
            await page.evaluate((_) => new Promise((resolve) => {
                const offcanvas = $.findOne('#offcanvas');

                $.addEventOnce(offcanvas, 'shown.ui.offcanvas', (_) => resolve());
                UI.Offcanvas.init(offcanvas).show();
            }));
            await page.evaluate((_) => {
                document.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'Tab',
                    shiftKey: true,
                }));
                $.focus('#offcanvasToggle');
            });

            await expect(page.locator('#button2')).toBeFocused();

            await page.evaluate((_) => {
                document.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'Tab',
                }));
            });
        });

        test('allows focus outside the offcanvas with scroll and no backdrop', async ({ page }) => {
            await page.evaluate((_) => new Promise((resolve) => {
                const offcanvas = $.findOne('#offcanvas');

                $.addEventOnce(offcanvas, 'shown.ui.offcanvas', (_) => resolve());
                UI.Offcanvas.init(offcanvas, {
                    backdrop: false,
                    scroll: true,
                }).show();
            }));
            await page.locator('#offcanvasToggle').focus();

            await expect(page.locator('#offcanvasToggle')).toBeFocused();
        });
    });
});
