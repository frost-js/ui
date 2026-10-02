import { expect, test } from '#test';

test.describe('Clipboard', () => {
    test.describe('copy action', () => {
        test.beforeEach(async ({ browserName }) => {
            test.skip(browserName === 'webkit', 'WebKit does not support reading clipboard contents.');
        });

        test('works with copy action (data-ui-text)', async ({ page }) => {
            await page.evaluate((_) => {
                document.body.innerHTML = '<button class="btn btn-secondary" id="button" data-ui-toggle="clipboard" data-ui-text="Test 1"></button>';
            });
            await page.locator('#button').click();

            expect(await page.evaluate((_) =>
                navigator.clipboard.readText())).toBe('Test 1');
        });

        test('works with copy action (data-ui-target)', async ({ page }) => {
            await page.evaluate((_) => {
                document.body.innerHTML =
                    '<button class="btn btn-secondary" id="button" data-ui-toggle="clipboard" data-ui-target="#test"></button>' +
                    '<div id="test">Test 2</div>';
            });
            await page.locator('#button').click();

            expect(await page.evaluate((_) =>
                navigator.clipboard.readText())).toBe('Test 2');
        });

        for (const { name, text, markup } of [
            { name: 'input', text: 'Test 3', markup: '<input class="input-filled" id="test" value="Test 3">' },
            { name: 'textarea', text: 'Test 4', markup: '<textarea class="input-filled" id="test">Test 4</textarea>' },
        ]) {
            test(`works with copy action (${name})`, async ({ page }) => {
                await page.evaluate((markup) => {
                    document.body.innerHTML =
                        '<button class="btn btn-secondary" id="button" data-ui-toggle="clipboard" data-ui-target="#test"></button>' +
                        markup;
                }, markup);
                await page.locator('#button').click();

                expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(text);
                await expect(page.locator('#test')).toHaveValue(text);
            });
        }
    });

    test.describe('cut action', () => {
        test.beforeEach(async ({ browserName }) => {
            test.skip(browserName === 'webkit', 'WebKit does not support reading clipboard contents.');
        });

        for (const { name, text, markup } of [
            { name: 'input', text: 'Test 5', markup: '<input class="input-filled" id="test" value="Test 5">' },
            { name: 'textarea', text: 'Test 6', markup: '<textarea class="input-filled" id="test">Test 6</textarea>' },
        ]) {
            test(`works with cut action (${name})`, async ({ page }) => {
                await page.evaluate((markup) => {
                    document.body.innerHTML =
                        '<button class="btn btn-secondary" id="button" data-ui-toggle="clipboard" data-ui-action="cut" data-ui-target="#test"></button>' +
                        markup;
                }, markup);
                await page.locator('#button').click();

                expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(text);
                await expect(page.locator('#test')).toHaveValue('');
            });
        }

        test('does not remove text content for elements', async ({ page }) => {
            await page.evaluate((_) => {
                document.body.innerHTML =
                    '<button class="btn btn-secondary" id="button" data-ui-toggle="clipboard" data-ui-action="cut" data-ui-target="#test"></button>' +
                    '<div id="test">Test 7</div>';
            });
            await page.locator('#button').click();

            expect(await page.evaluate((_) =>
                navigator.clipboard.readText())).toBe('Test 7');
            await expect(page.locator('#test')).toHaveText('Test 7');
        });
    });

    test.describe('invalid action', () => {
        test.use({
            expectedBrowserErrors: ['Invalid clipboard action'],
        });

        test('throws for an invalid action', async ({ page }) => {
            await page.evaluate((_) => {
                document.body.innerHTML = '<button id="button" data-ui-toggle="clipboard" data-ui-action="paste"></button>';
            });

            const errorPromise = page.waitForEvent('pageerror');
            await page.locator('#button').click();

            await expect(errorPromise).resolves.toHaveProperty(
                'message',
                'Invalid clipboard action',
            );
        });
    });

    test.describe('events', () => {
        test('triggers copied event', async ({ page }) => {
            await page.evaluate((_) => {
                document.body.innerHTML = '<button class="btn btn-secondary" id="button" data-ui-toggle="clipboard" data-ui-text="Test 8"></button>';
                window.clipboardCopiedEventTriggered = false;

                $.addEvent('#button', 'copied.ui.clipboard', (_) => {
                    window.clipboardCopiedEventTriggered = true;
                });
            });
            await page.locator('#button').click();

            expect(await page.evaluate((_) => window.clipboardCopiedEventTriggered)).toBe(true);
        });
    });
});
