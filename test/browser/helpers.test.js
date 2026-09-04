import { expect, test } from '#test';
import { advanceClock, resetPage, setupClock } from '../setup/browser.js';

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

test.describe('waitForTransition', () => {
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
        await setupClock(page);
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
        await setupClock(page);

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
