import { expect, test } from '#test';

test.describe('Modal/Dropdown', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate(() => {
            document.body.innerHTML =
                '<button class="btn btn-secondary" id="modal-toggle" data-ui-toggle="modal" data-ui-target="#modal" type="button"></button>' +
                '<div class="modal" id="modal">' +
                '<div class="modal-dialog" id="modal-dialog">' +
                '<button class="btn-close" id="button" data-ui-dismiss="modal" type="button"></button>' +
                '<div>' +
                '<button class="btn btn-secondary" id="dropdown-toggle" data-ui-toggle="dropdown" type="button"></button>' +
                '<div class="dropdown-menu" id="dropdown">' +
                '<button class="dropdown-item" id="dropdown-item-1"></button>' +
                '<button class="dropdown-item" id="dropdown-item-2"></button>' +
                '<button class="dropdown-item" id="dropdown-item-3"></button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        });
    });

    test.describe('user events', () => {
        test.beforeEach(async ({ page }) => {
            await page.evaluate(async () => {
                const modal = $.findOne('#modal');

                await new Promise((resolve) => {
                    $.addEventOnce(modal, 'shown.ui.modal', () => resolve());
                    UI.Modal.init(modal).show();
                });

                const dropdownToggle = $.findOne('#dropdown-toggle');

                await new Promise((resolve) => {
                    $.addEventOnce(dropdownToggle, 'shown.ui.dropdown', () => resolve());
                    UI.Dropdown.init(dropdownToggle).show();
                });
            });
        });

        test('hides the modal and dropdown on document click when dropdown is open', async ({ page }) => {
            await page.evaluate(() => {
                $.click(document.body);
            });

            await expect(page.locator('#dropdown-toggle')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#dropdown')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#modal')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#modal')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('.modal-backdrop')).toHaveCount(0);
        });

        test('does not hide the modal on escape when dropdown is open', async ({ page }) => {
            await page.evaluate(() => {
                document.body.dispatchEvent(new KeyboardEvent('keydown', {
                    bubbles: true,
                    code: 'Escape',
                }));
            });

            await expect(page.locator('#dropdown-toggle')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#dropdown')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#modal')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal')).toHaveClass(/\bshow\b/);
            await expect(page.locator('.modal-backdrop')).toHaveClass(/\bshow\b/);
        });
    });
});
