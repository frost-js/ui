import { expect, test } from '#test';

test.describe('Text Expand', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML = '<textarea class="input-filled text-expand" id="input"></textarea>';
        });
    });

    test.describe('user events', () => {
        for (const { event, label } of [
            { event: 'change', label: 'change' },
            { event: 'input', label: 'user input' },
        ]) {
            test(`expands on ${label}`, async ({ page }) => {
                await page.evaluate((event) => {
                    $.setValue('#input', new Array(5).fill('').join('\r\n'));
                    $.triggerEvent('#input', event);
                }, event);

                expect(await page.evaluate((_) =>
                    $.height('#input'))).toBe(136);
            });

            test(`contracts on ${label}`, async ({ page }) => {
                await page.evaluate((event) => {
                    $.setValue('#input', new Array(5).fill('').join('\r\n'));
                    $.triggerEvent('#input', event);
                    $.setValue('#input', '');
                    $.triggerEvent('#input', event);
                }, event);

                expect(await page.evaluate((_) =>
                    $.height('#input'))).toBe(64);
            });
        }
    });
});
