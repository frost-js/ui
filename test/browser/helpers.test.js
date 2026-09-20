import { expect, test } from '#test';
import { advanceClock } from '../setup/browser.js';
import { expectStyles } from '../support/assertions/styles.js';

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

test.describe('lockStyles', () => {
    test('restores earlier properties when a later lock fails', async ({ page }) => {
        await page.evaluate(() => {
            document.body.innerHTML = '<div id="target" style="overflow-x: scroll !important; overflow-y: auto;"></div>';
        });

        const held = await page.evaluateHandle(() => $.setStyleLock('#target', 'overflow-y', 'clip'));

        await expect(page.evaluate(() => UI.lockStyles('#target', {
            'overflow-x': 'hidden',
            'overflow-y': 'hidden',
        }))).rejects.toThrow('CSS property "overflow-y" is already locked.');

        await expectStyles(page, [
            {
                selectors: ['#target'],
                styles: {
                    overflowX: 'scroll',
                    overflowY: 'clip',
                },
            },
        ]);
        expect(await page.locator('#target').evaluate((node) => node.style.getPropertyPriority('overflow-x'))).toBe('important');

        await held.evaluate((release) => release());

        const release = await page.evaluateHandle(() => UI.lockStyles('#target', {
            'overflow-x': 'hidden',
            'overflow-y': 'hidden',
        }));

        await expectStyles(page, [
            {
                selectors: ['#target'],
                styles: {
                    overflowX: 'hidden',
                    overflowY: 'hidden',
                },
            },
        ]);

        await release.evaluate((release) => release());
        await release.evaluate((release) => release());

        await expectStyles(page, [
            {
                selectors: ['#target'],
                styles: {
                    overflowX: 'scroll',
                    overflowY: 'auto',
                },
            },
        ]);
        expect(await page.locator('#target').evaluate((node) => node.style.getPropertyPriority('overflow-x'))).toBe('important');
    });
});

test.describe('lockStylesCounterFactory', () => {
    test('rolls back a failed acquisition without releasing another holder', async ({ page }) => {
        await page.evaluate(() => {
            document.body.innerHTML =
                '<div id="first" style="overflow-x: scroll !important;"></div>' +
                '<div id="second" style="overflow-x: auto;"></div>';
        });

        const locker = await page.evaluateHandle(() => UI.lockStylesCounterFactory());
        const held = await locker.evaluateHandle((lock) => lock('#first', { 'overflow-x': 'hidden' }));

        await expect(locker.evaluate((lock) => lock('#first, #second', (node) => {
            if (node.id === 'second') {
                throw new Error('Cannot resolve styles');
            }
            return { 'overflow-x': 'clip' };
        }))).rejects.toThrow('Cannot resolve styles');

        await expectStyles(page, [
            {
                selectors: ['#first'],
                styles: { overflowX: 'hidden' },
            },
            {
                selectors: ['#second'],
                styles: { overflowX: 'auto' },
            },
        ]);

        await held.evaluate((release) => release());

        await expectStyles(page, [
            {
                selectors: ['#first'],
                styles: { overflowX: 'scroll' },
            },
        ]);

        const release = await locker.evaluateHandle((lock) => lock('#first, #second', { 'overflow-x': 'clip' }));

        await expectStyles(page, [
            {
                selectors: ['#first', '#second'],
                styles: { overflowX: 'clip' },
            },
        ]);

        await release.evaluate((release) => release());
        await release.evaluate((release) => release());

        await expectStyles(page, [
            {
                selectors: ['#first'],
                styles: { overflowX: 'scroll' },
            },
            {
                selectors: ['#second'],
                styles: { overflowX: 'auto' },
            },
        ]);
        expect(await page.locator('#first').evaluate((node) => node.style.getPropertyPriority('overflow-x'))).toBe('important');
    });
});

test.describe('waitForTransition', () => {
    test.use({ mockClock: true });

    test('returns completed results with the node and additional data', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const node = $.create('div');
            const transition = Object.create(CSSTransition.prototype);

            Object.defineProperties(transition, {
                effect: {
                    value: {
                        getComputedTiming: (_) => ({ endTime: 1000 }),
                    },
                },
                finished: { value: Promise.resolve() },
                transitionProperty: { value: 'opacity' },
            });
            node.getAnimations = (_) => [transition];

            const result = await UI.waitForTransition(node, ['opacity'], { value: 'test' });

            return {
                completed: result.completed,
                node: result.node === node,
                value: result.value,
            };
        })).toEqual({
            completed: true,
            node: true,
            value: 'test',
        });
    });

    test('reports canceled transitions as incomplete', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            const node = $.create('div');
            const transition = Object.create(CSSTransition.prototype);

            Object.defineProperties(transition, {
                effect: {
                    value: {
                        getComputedTiming: (_) => ({ endTime: 1000 }),
                    },
                },
                finished: { value: Promise.reject(new DOMException('Canceled', 'AbortError')) },
                transitionProperty: { value: 'opacity' },
            });
            node.getAnimations = (_) => [transition];

            return (await UI.waitForTransition(node, ['opacity'])).completed;
        })).toBe(false);
    });

    test('falls back after the transition timing when the finished promise stalls', async ({ page }) => {
        await page.evaluate((_) => {
            const node = $.create('div');
            const transition = Object.create(CSSTransition.prototype);

            Object.defineProperties(transition, {
                effect: {
                    value: {
                        getComputedTiming: (_) => ({ endTime: 20 }),
                    },
                },
                finished: { value: new Promise((_) => {}) },
                transitionProperty: { value: 'opacity' },
            });
            node.getAnimations = (_) => [transition];

            window.transitionResult = null;
            UI.waitForTransition(node, ['opacity']).then((result) => {
                window.transitionResult = result;
            });
        });
        await advanceClock(page, 20);

        expect(await page.evaluate((_) => window.transitionResult)).toBeNull();

        await advanceClock(page, 50);

        expect(await page.evaluate((_) => window.transitionResult.completed)).toBe(false);
    });

    test('falls back for stalled zero-duration transitions with reduced motion', async ({ page }) => {
        await page.emulateMedia({ reducedMotion: 'reduce' });

        expect(await page.evaluate((_) => {
            const styleNode = $.create('div', { class: 'fade' });
            $.append(document.body, styleNode);

            const node = $.create('div');
            const transition = Object.create(CSSTransition.prototype);

            Object.defineProperties(transition, {
                effect: {
                    value: {
                        getComputedTiming: (_) => ({ endTime: 0 }),
                    },
                },
                finished: { value: new Promise((_) => {}) },
                transitionProperty: { value: 'opacity' },
            });
            node.getAnimations = (_) => [transition];

            window.transitionResult = null;
            UI.waitForTransition(node, ['opacity']).then((result) => {
                window.transitionResult = result;
            });

            return {
                duration: $.css(styleNode, 'transitionDuration'),
                reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
            };
        })).toEqual({
            duration: '0s',
            reducedMotion: true,
        });

        await advanceClock(page, 50);

        expect(await page.evaluate((_) => window.transitionResult.completed)).toBe(false);
    });
});
