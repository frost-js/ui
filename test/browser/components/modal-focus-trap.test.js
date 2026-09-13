import { expect, test } from '#test';
import { resetPage } from '../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('Modal FocusTrap', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            $.setHtml(
                document.body,
                `
                    <button class="btn btn-secondary" id="modal-toggle" data-ui-toggle="modal" data-ui-target="#modal" type="button"></button>
                    <div class="modal" id="modal">
                        <div class="modal-dialog" id="modal-dialog">
                            <button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>
                            <button id="button2" type="button"></button>
                        </div>
                    </div>
                `,
            );
        });
    });

    test.describe('focus trap', () => {
        test('prevents focus outside the modal', async ({ page }) => {
            await page.evaluate((_) => new Promise((resolve) => {
                const modal = $.findOne('#modal');

                $.addEventOnce(modal, 'shown.ui.modal', (_) => resolve());
                UI.Modal.init(modal).show();
            }));
            await page.locator('#modal-toggle').focus();

            await expect(page.locator('#button1')).toBeFocused();
        });

        test('reverses focus if shift/tab key is pressed', async ({ page }) => {
            await page.evaluate((_) => new Promise((resolve) => {
                const modal = $.findOne('#modal');

                $.addEventOnce(modal, 'shown.ui.modal', (_) => resolve());
                UI.Modal.init(modal).show();
            }));
            await page.evaluate((_) => {
                document.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'Tab',
                    shiftKey: true,
                }));
                $.focus('#modal-toggle');
            });

            await expect(page.locator('#button2')).toBeFocused();

            await page.evaluate((_) => {
                document.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'Tab',
                }));
            });
        });

        test('allows focus outside the modal with no focus', async ({ page }) => {
            await page.evaluate((_) => new Promise((resolve) => {
                const modal = $.findOne('#modal');

                $.addEventOnce(modal, 'shown.ui.modal', (_) => resolve());
                UI.Modal.init(modal, { focus: false }).show();
            }));
            await page.locator('#modal-toggle').focus();

            await expect(page.locator('#modal-toggle')).toBeFocused();
        });
    });
});
