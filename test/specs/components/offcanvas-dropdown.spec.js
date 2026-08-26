import { expect, test } from '@playwright/test';
import { resetPage } from '../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('Offcanvas/Dropdown', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<button class="btn btn-secondary" id="offcanvas-toggle" data-ui-toggle="offcanvas" data-ui-target="#offcanvas" type="button"></button>' +
                '<div class="offcanvas offcanvas-start" id="offcanvas">' +
                '<button class="btn-close" id="button" data-ui-dismiss="offcanvas" type="button"></button>' +
                '<div>' +
                '<button class="btn btn-secondary" id="dropdown-toggle" data-ui-toggle="dropdown" type="button"></button>' +
                '<div class="dropdown-menu" id="dropdown">' +
                '<button class="dropdown-item" id="dropdown-item-1"></button>' +
                '<button class="dropdown-item" id="dropdown-item-2"></button>' +
                '<button class="dropdown-item" id="dropdown-item-3"></button>' +
                '</div>' +
                '</div>' +
                '</div>';
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

                const dropdownToggle = $.findOne('#dropdown-toggle');

                await new Promise((resolve) => {
                    $.addEventOnce(dropdownToggle, 'shown.ui.dropdown', (_) => resolve());
                    UI.Dropdown.init(dropdownToggle).show();
                });
            });
        });

        test('hides the offcanvas and dropdown on document click when dropdown is open', async ({ page }) => {
            await page.evaluate((_) => {
                $.click(document.body);
            });

            await expect(page.locator('#dropdown-toggle')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#dropdown')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#offcanvas')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#offcanvas')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('body')).not.toHaveClass(/\boffcanvas-backdrop\b/);
        });

        test('does not hide the offcanvas on escape when dropdown is open', async ({ page }) => {
            await page.evaluate((_) => {
                document.body.dispatchEvent(new KeyboardEvent('keydown', {
                    bubbles: true,
                    code: 'Escape',
                }));
            });

            await expect(page.locator('#dropdown-toggle')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#dropdown')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#offcanvas')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#offcanvas')).toHaveClass(/\bshow\b/);
            await expect(page.locator('body')).toHaveClass(/\boffcanvas-backdrop\b/);
        });
    });
});
