import { expect, test } from '@playwright/test';
import { advanceClock, resetPage, setupClock } from '../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await setupClock(page);
    await resetPage(page);
});

test.describe('Modal FocusTrap', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<button class="btn btn-secondary" id="modalToggle" data-ui-toggle="modal" data-ui-target="#modal" type="button"></button>' +
                '<div class="modal" id="modal">' +
                '<div class="modal-dialog" id="modalDialog">' +
                '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                '<button id="button2" type="button"></button>' +
                '</div>' +
                '</div>';
        });
    });

    test.describe('focus trap', () => {
        test('prevents focus outside the modal', async ({ page }) => {
            await page.evaluate((_) => {
                const modal = $.findOne('#modal');
                UI.Modal.init(modal).show();
            });
            await advanceClock(page, 300);
            await page.locator('#modalToggle').focus();

            await expect(page.locator('#button1')).toBeFocused();
        });

        test('reverses focus if shift/tab key is pressed', async ({ page }) => {
            await page.evaluate((_) => {
                const modal = $.findOne('#modal');
                UI.Modal.init(modal).show();
            });
            await advanceClock(page, 300);
            await page.evaluate((_) => {
                document.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'Tab',
                    shiftKey: true,
                }));
                $.focus('#modalToggle');
            });

            await expect(page.locator('#button2')).toBeFocused();

            await page.evaluate((_) => {
                document.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'Tab',
                }));
            });
        });

        test('allows focus outside the modal with no focus', async ({ page }) => {
            await page.evaluate((_) => {
                const modal = $.findOne('#modal');
                UI.Modal.init(modal, { focus: false }).show();
            });
            await advanceClock(page, 300);
            await page.locator('#modalToggle').focus();

            await expect(page.locator('#modalToggle')).toBeFocused();
        });
    });
});
