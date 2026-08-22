import { expect, test } from '@playwright/test';
import { resetPage } from '../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('Clipboard', () => {
    test.describe('copy action', () => {
        test('works with copy action (data-ui-text)', async ({ page }) => {
            await page.evaluate((_) => {
                document.body.innerHTML =
                    '<button class="btn btn-secondary" id="button" data-ui-toggle="clipboard" data-ui-text="Test 1"></button>';
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

        test('works with copy action (input)', async ({ page }) => {
            await page.evaluate((_) => {
                document.body.innerHTML =
                    '<button class="btn btn-secondary" id="button" data-ui-toggle="clipboard" data-ui-target="#test"></button>' +
                    '<input class="input-filled" id="test" value="Test 3">';
            });
            await page.locator('#button').click();

            expect(await page.evaluate((_) =>
                navigator.clipboard.readText())).toBe('Test 3');
            await expect(page.locator('#test')).toHaveValue('Test 3');
        });

        test('works with copy action (textarea)', async ({ page }) => {
            await page.evaluate((_) => {
                document.body.innerHTML =
                    '<button class="btn btn-secondary" id="button" data-ui-toggle="clipboard" data-ui-target="#test"></button>' +
                    '<textarea class="input-filled" id="test">Test 4</textarea>';
            });
            await page.locator('#button').click();

            expect(await page.evaluate((_) =>
                navigator.clipboard.readText())).toBe('Test 4');
            await expect(page.locator('#test')).toHaveValue('Test 4');
        });
    });

    test.describe('cut action', () => {
        test('works with cut action (input)', async ({ page }) => {
            await page.evaluate((_) => {
                document.body.innerHTML =
                    '<button class="btn btn-secondary" id="button" data-ui-toggle="clipboard" data-ui-action="cut" data-ui-target="#test"></button>' +
                    '<input class="input-filled" id="test" value="Test 5">';
            });
            await page.locator('#button').click();

            expect(await page.evaluate((_) =>
                navigator.clipboard.readText())).toBe('Test 5');
            await expect(page.locator('#test')).toHaveValue('');
        });

        test('works with cut action (textarea)', async ({ page }) => {
            await page.evaluate((_) => {
                document.body.innerHTML =
                    '<button class="btn btn-secondary" id="button" data-ui-toggle="clipboard" data-ui-action="cut" data-ui-target="#test"></button>' +
                    '<textarea class="input-filled" id="test">Test 6</textarea>';
            });
            await page.locator('#button').click();

            expect(await page.evaluate((_) =>
                navigator.clipboard.readText())).toBe('Test 6');
            await expect(page.locator('#test')).toHaveValue('');
        });

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

    test.describe('events', () => {
        test('triggers copied event', async ({ page }) => {
            await page.evaluate((_) => {
                document.body.innerHTML =
                    '<button class="btn btn-secondary" id="button" data-ui-toggle="clipboard" data-ui-text="Test 8"></button>';
                window.clipboardCopiedEventTriggered = false;

                $.addEvent('#button', 'copied.ui.clipboard', (_) => {
                    window.clipboardCopiedEventTriggered = true;
                });
            });
            await page.locator('#button').click();

            expect(await page.evaluate((_) => window.clipboardCopiedEventTriggered)).toBe(true);
            expect(await page.evaluate((_) =>
                navigator.clipboard.readText())).toBe('Test 8');
        });
    });
});
