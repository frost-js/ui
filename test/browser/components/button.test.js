import { expect, test } from '#test';

test.describe('Button', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate(() => {
            document.body.innerHTML =
                '<button class="btn btn-secondary" id="button1" data-ui-toggle="button" type="button"></button>' +
                '<button class="btn btn-secondary" id="button2" data-ui-toggle="button" type="button"></button>';
        });
    });

    test.describe('#init', () => {
        for (const { name, init } of [
            {
                name: 'class',
                init: (selector) => UI.Button.init(document.querySelector(selector)),
            },
            {
                name: 'QuerySet',
                init: (selector) => $(selector).button(),
            },
        ]) {
            test(`creates a button (${name})`, async ({ page }) => {
                const instance = await page.evaluateHandle(init, '#button1');

                expect(await instance.evaluate((value) => value instanceof UI.Button)).toBe(true);
                expect(await page.evaluate(() =>
                    $.getData('#button1', 'button') instanceof UI.Button)).toBe(true);
            });
        }

        test('creates a button (data-ui-toggle)', async ({ page }) => {
            await page.locator('#button1').click();

            expect(await page.evaluate((_) =>
                $.getData('#button1', 'button') instanceof UI.Button)).toBe(true);
        });
    });

    test.describe('#dispose', () => {
        for (const { name, dispose } of [
            {
                name: 'class',
                dispose: (selector) => {
                    UI.Button.init(document.querySelector(selector)).dispose();
                },
            },
            {
                name: 'QuerySet',
                dispose: (selector) => {
                    $(selector).button('dispose');
                },
            },
        ]) {
            test(`removes the button (${name})`, async ({ page }) => {
                await page.evaluate(dispose, '#button1');

                expect(await page.evaluate(() => $.hasData('#button1', 'button'))).toBe(false);
            });
        }
    });

    test.describe('#toggle', () => {
        for (const { name, toggle } of [
            {
                name: 'class',
                toggle: (selector) => {
                    UI.Button.init(document.querySelector(selector)).toggle();
                },
            },
            {
                name: 'QuerySet',
                toggle: (selector) => {
                    $(selector).button('toggle');
                },
            },
        ]) {
            test(`toggles the button (${name})`, async ({ page }) => {
                await page.evaluate(toggle, '#button1');

                await expect(page.locator('#button1')).toHaveClass(/\bactive\b/);
                await expect(page.locator('#button1')).toHaveAttribute('aria-pressed', 'true');
                await expect(page.locator('#button2')).not.toHaveClass(/\bactive\b/);
                await expect(page.locator('#button2')).not.toHaveAttribute('aria-pressed');
            });

            test(`toggles the button off (${name})`, async ({ page }) => {
                await page.evaluate(toggle, '#button1');
                await page.evaluate(toggle, '#button1');

                await expect(page.locator('#button1')).not.toHaveClass(/\bactive\b/);
                await expect(page.locator('#button1')).toHaveAttribute('aria-pressed', 'false');
            });
        }

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
