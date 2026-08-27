import { expect, test } from '@playwright/test';
import { resetPage } from '../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('Offcanvas/Modal', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            $.setHTML(
                document.body,
                `
                    <button class="btn btn-secondary" id="offcanvas-toggle" data-ui-toggle="offcanvas" data-ui-target="#offcanvas" type="button"></button>
                    <div class="offcanvas offcanvas-start" id="offcanvas">
                        <button class="btn-close" id="button" data-ui-dismiss="offcanvas" type="button"></button>
                        <button class="btn btn-secondary" id="modal-toggle" data-ui-toggle="modal" data-ui-target="#modal" type="button"></button>
                    </div>
                    <div class="modal" id="modal">
                        <div class="modal-dialog" id="modal-dialog">
                            <button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>
                        </div>
                    </div>
                `,
            );
        });
    });

    test.describe('user events', () => {
        test.beforeEach(async ({ page }) => {
            await page.evaluate(async (_) => {
                const offcanvas = $.findOne('#offcanvas');

                await new Promise((resolve) => {
                    $.addEventOnce(offcanvas, 'shown.ui.offcanvas', (_) => resolve());
                    UI.Offcanvas.init(offcanvas).show();
                });

                const modal = $.findOne('#modal');

                await new Promise((resolve) => {
                    $.addEventOnce(modal, 'shown.ui.modal', (_) => resolve());
                    UI.Modal.init(modal).show();
                });
            });
        });

        test('does not hide the offcanvas on document click when modal is open', async ({ page }) => {
            await page.evaluate((_) => {
                $.click(document.body);
            });

            await expect(page.locator('#modal')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#modal')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('.modal-backdrop')).toHaveCount(0);
            await expect(page.locator('#offcanvas')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#offcanvas')).toHaveClass(/\bshow\b/);
        });

        test('does not hide the offcanvas on escape when modal is open', async ({ page }) => {
            await page.evaluate((_) => {
                document.body.dispatchEvent(new KeyboardEvent('keydown', {
                    bubbles: true,
                    code: 'Escape',
                }));
            });

            await expect(page.locator('#modal')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#modal')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('.modal-backdrop')).toHaveCount(0);
            await expect(page.locator('#offcanvas')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#offcanvas')).toHaveClass(/\bshow\b/);
        });
    });
});
