import { expect, test } from '#test';
import { setup } from '../../setup/modal.js';
import { expectStyles } from '../../support/assertions/styles.js';
import { measureScrollbarSize } from '../../support/measurements/scrollbar.js';

test.use({ reducedMotion: 'no-preference' });

test.describe('Modal', () => {
    test.beforeEach(setup);

    test.describe('#show', () => {
        test('allows modals to stack', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate((_) => {
                const modal2 = $.findOne('#modal2');
                UI.Modal.init(modal2).show();
            });

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modal-dialog-1')).not.toHaveAttribute('style');
            await expect(page.locator('#modal2')).toHaveClass('modal show');
            await expect(page.locator('#modal2')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal2')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modal2')).toHaveAttribute('style', 'z-index: 1080;');
            await expect(page.locator('#modal-dialog-2')).not.toHaveAttribute('style');
            await expect(page.locator('.modal-backdrop')).toHaveCount(2);
            await expect(page.locator('.modal-backdrop').nth(0)).not.toHaveAttribute('style');
            await expect(page.locator('.modal-backdrop').nth(1)).toHaveAttribute('style', 'z-index: 1070;');
        });
    });

    test.describe('#hide', () => {
        test('reindexes remaining modals when an older modal is hidden', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate((_) => {
                const modal2 = $.findOne('#modal2');
                UI.Modal.init(modal2).show();
            });
            await expect(page.locator('#modal2')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).hide();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'true');

            await expect(page.locator('#modal2')).toHaveAttribute('style', '');
            await expect(page.locator('.modal-backdrop')).toHaveCount(1);
            await expect(page.locator('.modal-backdrop')).toHaveAttribute('style', '');

            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            await expect(page.locator('#modal1')).toHaveAttribute('style', 'z-index: 1080;');
            await expect(page.locator('.modal-backdrop').nth(1)).toHaveAttribute('style', 'z-index: 1070;');

            await page.keyboard.press('Escape');

            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#modal2')).toHaveAttribute('aria-hidden', 'false');
        });

        test('does not close stacked modals (data-ui-dismiss)', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate((_) => {
                const modal2 = $.findOne('#modal2');
                UI.Modal.init(modal2).show();
            });
            await expect(page.locator('#modal2')).toHaveAttribute('aria-hidden', 'false');

            await page.locator('#button2').dispatchEvent('click');

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modal2')).toHaveClass('modal');
            await expect(page.locator('#modal2')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#modal2')).toHaveAttribute('aria-modal', 'false');
            await expect(page.locator('#modal2')).toHaveAttribute('style', '');
            await expect(page.locator('.modal-backdrop')).toHaveCount(1);
        });
    });

    test.describe('backdrop option', () => {
        test('does not close stacked modals on document click', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate((_) => {
                const modal2 = $.findOne('#modal2');
                UI.Modal.init(modal2).show();
            });
            await expect(page.locator('#modal2')).toHaveAttribute('aria-hidden', 'false');

            await page.locator('body').dispatchEvent('click');

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modal2')).toHaveClass('modal');
            await expect(page.locator('#modal2')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#modal2')).toHaveAttribute('aria-modal', 'false');
            await expect(page.locator('#modal2')).toHaveAttribute('style', '');
            await expect(page.locator('.modal-backdrop')).toHaveCount(1);
        });
    });

    test.describe('scroll padding', () => {
        test('retains scroll padding when an older modal is hidden', async ({ page }) => {
            const scrollbarSize = await measureScrollbarSize(page);

            await page.evaluate((_) => {
                $.setStyle(document.body, {
                    height: '2000px',
                    paddingRight: '10px',
                });
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate((_) => {
                const modal2 = $.findOne('#modal2');
                UI.Modal.init(modal2).show();
            });
            await expect(page.locator('#modal2')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).hide();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'true');

            await expectStyles(page, [
                {
                    selectors: ['body'],
                    styles: { paddingRight: `${scrollbarSize + 10}px` },
                },
            ]);
        });
    });
});
