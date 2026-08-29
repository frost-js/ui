import { expect, test } from '#test';
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

test.describe('getTouchPositions', () => {
    test('returns the page position of each active touch', async ({ page }) => {
        expect(await page.evaluate((_) => UI.getTouchPositions({
            touches: [
                { pageX: 12, pageY: 34 },
                { pageX: 56, pageY: 78 },
            ],
        }))).toEqual([
            { x: 12, y: 34 },
            { x: 56, y: 78 },
        ]);
    });
});
