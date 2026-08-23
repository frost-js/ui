import { expect, test } from '@playwright/test';
import { resetPage } from '../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('initComponent', () => {
    test('defines the query method as non-enumerable', async ({ page }) => {
        expect(await page.evaluate((_) => {
            class TestComponent {}

            UI.initComponent('testComponent', TestComponent);

            const descriptor = Object.getOwnPropertyDescriptor(
                $.QuerySet.prototype,
                'testComponent',
            );

            delete $.QuerySet.prototype.testComponent;

            return descriptor.enumerable;
        })).toBe(false);
    });
});
