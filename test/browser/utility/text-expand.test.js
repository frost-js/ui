import { expect, test } from '#test';
import { resetPage } from '../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('Text Expand', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            $.setHtml(
                document.body,
                '<textarea class="input-filled text-expand" id="input"></textarea>',
            );
        });
    });

    test.describe('user events', () => {
        test('expands on change', async ({ page }) => {
            await page.evaluate((_) => {
                $.setValue('#input', new Array(5).fill('').join('\r\n'));
                $.triggerEvent('#input', 'change');
            });

            expect(await page.evaluate((_) =>
                $.height('#input'))).toBe(136);
        });

        test('contracts on change', async ({ page }) => {
            await page.evaluate((_) => {
                $.setValue('#input', new Array(5).fill('').join('\r\n'));
                $.triggerEvent('#input', 'change');
                $.setValue('#input', '');
                $.triggerEvent('#input', 'change');
            });

            expect(await page.evaluate((_) =>
                $.height('#input'))).toBe(64);
        });

        test('expands on user input', async ({ page }) => {
            await page.evaluate((_) => {
                $.setValue('#input', new Array(5).fill('').join('\r\n'));
                $.triggerEvent('#input', 'input');
            });

            expect(await page.evaluate((_) =>
                $.height('#input'))).toBe(136);
        });

        test('contracts on user input', async ({ page }) => {
            await page.evaluate((_) => {
                $.setValue('#input', new Array(5).fill('').join('\r\n'));
                $.triggerEvent('#input', 'input');
                $.setValue('#input', '');
                $.triggerEvent('#input', 'input');
            });

            expect(await page.evaluate((_) =>
                $.height('#input'))).toBe(64);
        });
    });
});
