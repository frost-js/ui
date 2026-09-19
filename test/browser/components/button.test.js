import { buttonDisposeTests, buttonInitTests, buttonToggleTests, setup } from '#cases/components/button.js';
import { expect, test } from '#test';

test.describe('Button', () => {
    test.beforeEach(setup);

    test.describe('#init', () => {
        buttonInitTests((selector) => UI.Button.init(document.querySelector(selector)));

        test('creates a button (data-toggle)', async ({ page }) => {
            await page.locator('#button1').click();

            expect(await page.evaluate((_) =>
                $.getData('#button1', 'button') instanceof UI.Button)).toBe(true);
        });
    });

    test.describe('#dispose', () => {
        buttonDisposeTests((selector) => {
            UI.Button.init(document.querySelector(selector)).dispose();
        });
    });

    test.describe('#toggle', () => {
        buttonToggleTests((selector) => {
            UI.Button.init(document.querySelector(selector)).toggle();
        });

        test('toggles the button (data-ui-toggle)', async ({ page }) => {
            await page.locator('#button1').click();

            await expect(page.locator('#button1')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#button1')).toHaveAttribute('aria-pressed', 'true');
        });

        test('toggles the button with the Space key', async ({ page }) => {
            await page.locator('#button1').press('Space');

            await expect(page.locator('#button1')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#button1')).toHaveAttribute('aria-pressed', 'true');
        });

        test('ignores other keys', async ({ page }) => {
            await page.locator('#button1').press('ArrowRight');

            await expect(page.locator('#button1')).not.toHaveClass(/\bactive\b/);
            await expect(page.locator('#button1')).not.toHaveAttribute('aria-pressed');
        });
    });

    test.describe('QuerySet', () => {
        test.describe('#init', () => {
            buttonInitTests((selector) => $(selector).button());

            test('creates multiple buttons', async ({ page }) => {
                expect(await page.evaluate((_) => {
                    $('button').button();
                    return $.find('button').every((node) =>
                        $.getData(node, 'button') instanceof UI.Button,
                    );
                })).toBe(true);
            });

            test('returns the button', async ({ page }) => {
                expect(await page.evaluate((_) =>
                    $('#button1').button() instanceof UI.Button)).toBe(true);
            });
        });

        test.describe('#dispose', () => {
            buttonDisposeTests((selector) => {
                $(selector).button('dispose');
            });

            test('removes multiple buttons', async ({ page }) => {
                expect(await page.evaluate((_) => {
                    $('button').button('dispose');
                    return $.find('button').some((node) =>
                        $.hasData(node, 'button'),
                    );
                })).toBe(false);
            });
        });

        test.describe('#toggle', () => {
            buttonToggleTests((selector) => {
                $(selector).button('toggle');
            });

            test('toggles multiple buttons', async ({ page }) => {
                await page.evaluate((_) => {
                    $('button').button('toggle');
                });

                await expect(page.locator('#button1')).toHaveClass(/\bactive\b/);
                await expect(page.locator('#button1')).toHaveAttribute('aria-pressed', 'true');
                await expect(page.locator('#button2')).toHaveClass(/\bactive\b/);
                await expect(page.locator('#button2')).toHaveAttribute('aria-pressed', 'true');
            });
        });
    });
});
