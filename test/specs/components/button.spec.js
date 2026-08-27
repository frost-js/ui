import { expect, test } from '@playwright/test';
import { resetPage } from '../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('Button', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            $.setHTML(
                document.body,
                `
                    <button class="btn btn-secondary" id="button1" data-ui-toggle="button" type="button"></button>
                    <button class="btn btn-secondary" id="button2" data-ui-toggle="button" type="button"></button>
                `,
            );
        });
    });

    test.describe('#init', () => {
        test('creates a button', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const button1 = $.findOne('#button1');
                return UI.Button.init(button1) instanceof UI.Button;
            })).toBe(true);
        });

        test('creates a button (data-toggle)', async ({ page }) => {
            await page.locator('#button1').click();

            expect(await page.evaluate((_) =>
                $.getData('#button1', 'button') instanceof UI.Button)).toBe(true);
        });

        test('creates a button (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('#button1').button();
                return $.getData('#button1', 'button') instanceof UI.Button;
            })).toBe(true);
        });

        test('creates multiple buttons (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('button').button();
                return $.find('button').every((node) =>
                    $.getData(node, 'button') instanceof UI.Button,
                );
            })).toBe(true);
        });

        test('returns the button (query)', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $('#button1').button() instanceof UI.Button)).toBe(true);
        });
    });

    test.describe('#dispose', () => {
        test('removes the button', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const button1 = $.findOne('#button1');
                UI.Button.init(button1).dispose();
                return $.hasData(button1, 'button');
            })).toBe(false);
        });

        test('removes the button (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('#button1').button('dispose');
                return $.hasData('#button1', 'button');
            })).toBe(false);
        });

        test('removes multiple buttons (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('button').button('dispose');
                return $.find('button').some((node) =>
                    $.hasData(node, 'button'),
                );
            })).toBe(false);
        });
    });

    test.describe('#toggle', () => {
        test('toggles the button', async ({ page }) => {
            await page.evaluate((_) => {
                const button1 = $.findOne('#button1');
                UI.Button.init(button1).toggle();
            });

            await expect(page.locator('#button1')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#button1')).toHaveAttribute('aria-pressed', 'true');
            await expect(page.locator('#button2')).not.toHaveClass(/\bactive\b/);
            await expect(page.locator('#button2')).not.toHaveAttribute('aria-pressed');
        });

        test('toggles the button (data-ui-toggle)', async ({ page }) => {
            await page.locator('#button1').click();

            await expect(page.locator('#button1')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#button1')).toHaveAttribute('aria-pressed', 'true');
        });

        test('toggles the button (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#button1').button('toggle');
            });

            await expect(page.locator('#button1')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#button1')).toHaveAttribute('aria-pressed', 'true');
        });

        test('toggles multiple buttons (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('button').button('toggle');
            });

            await expect(page.locator('#button1')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#button1')).toHaveAttribute('aria-pressed', 'true');
            await expect(page.locator('#button2')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#button2')).toHaveAttribute('aria-pressed', 'true');
        });

        test('toggles the button off', async ({ page }) => {
            await page.evaluate((_) => {
                const button1 = $.findOne('#button1');
                const button = UI.Button.init(button1);
                button.toggle();
                button.toggle();
            });

            await expect(page.locator('#button1')).not.toHaveClass(/\bactive\b/);
            await expect(page.locator('#button1')).toHaveAttribute('aria-pressed', 'false');
        });
    });
});
