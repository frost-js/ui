import { expect, test } from '#test';
import { setup } from '../../setup/carousel.js';
import { expectStyles } from '../../support/assertions/styles.js';

test.use({ reducedMotion: 'no-preference' });
test.use({ mockClock: true });

test.describe('Carousel', () => {
    test.beforeEach(setup);

    test.describe('swipe option', () => {
        test('swipes to next item', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1);
                carousel1.dispatchEvent(new MouseEvent('mousedown', { clientX: 400 }));
                window.dispatchEvent(new MouseEvent('mousemove', { clientX: 300 }));
            });

            await expect(page.locator('#carousel1')).toHaveClass(/\bcarousel-dragging\b/);
            await expect(page.locator('#carousel-1-item-1')).toHaveClass(/\bactive\b/);
            await expectStyles(page, [
                {
                    selectors: ['#carousel-1-item-1'],
                    styles: { transform: 'translateX(-25%)' },
                },
                {
                    selectors: ['#carousel-1-item-2'],
                    styles: {
                        display: 'block',
                        transform: 'translateX(75%)',
                    },
                },
            ]);
        });

        test('swipes to previous item', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1);
                carousel1.dispatchEvent(new MouseEvent('mousedown', { clientX: 400 }));
                window.dispatchEvent(new MouseEvent('mousemove', { clientX: 500 }));
            });

            await expect(page.locator('#carousel1')).toHaveClass(/\bcarousel-dragging\b/);
            await expect(page.locator('#carousel-1-item-1')).toHaveClass(/\bactive\b/);
            await expectStyles(page, [
                {
                    selectors: ['#carousel-1-item-1'],
                    styles: { transform: 'translateX(25%)' },
                },
                {
                    selectors: ['#carousel-1-item-3'],
                    styles: {
                        display: 'block',
                        transform: 'translateX(-75%)',
                    },
                },
            ]);
        });

        test('swipes to next item in RTL', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                carousel1.dir = 'rtl';
                UI.Carousel.init(carousel1);
                carousel1.dispatchEvent(new MouseEvent('mousedown', { clientX: 400 }));
                window.dispatchEvent(new MouseEvent('mousemove', { clientX: 550 }));
                window.dispatchEvent(new MouseEvent('mouseup'));
            });

            await expect(page.locator('#carousel-1-item-2')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-1')).toHaveClass(/\bactive\b/);
        });

        test('advances across complete items during a long drag', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                const width = $.width(carousel1);
                UI.Carousel.init(carousel1);

                carousel1.dispatchEvent(new MouseEvent('mousedown', {
                    clientX: width * 1.5,
                }));
                window.dispatchEvent(new MouseEvent('mousemove', {
                    clientX: width * .25,
                }));
            });

            await expect(page.locator('#carousel1')).toHaveClass(/\bcarousel-dragging\b/);
            await expect(page.locator('#carousel-1-item-3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-2')).toHaveClass(/\bactive\b/);
            await expectStyles(page, [
                {
                    selectors: [
                        '#carousel-1-item-1',
                        '#carousel-1-item-2',
                        '#carousel-1-item-3',
                    ],
                    styles: { transform: '' },
                },
            ]);
        });

        test('works with swipe option', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1, { swipe: false });
                carousel1.dispatchEvent(new MouseEvent('mousedown', { clientX: 400 }));
                window.dispatchEvent(new MouseEvent('mousemove', { clientX: 500 }));
            });
            await expect(page.locator('#carousel1')).not.toHaveClass(/\bcarousel-dragging\b/);
            await expect(page.locator('#carousel-1-item-1')).toHaveClass(/\bactive\b/);
            await expectStyles(page, [
                {
                    selectors: ['#carousel-1-item-1', '#carousel-1-item-3'],
                    styles: { transform: '' },
                },
            ]);
        });

        test('works with swipe option (data-ui-swipe)', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                $.setDataset(carousel1, { uiSwipe: false });
                UI.Carousel.init(carousel1);
                carousel1.dispatchEvent(new MouseEvent('mousedown', { clientX: 400 }));
                window.dispatchEvent(new MouseEvent('mousemove', { clientX: 500 }));
            });

            await expect(page.locator('#carousel1')).toHaveAttribute('data-ui-swipe', 'false');
            await expect(page.locator('#carousel1')).not.toHaveClass(/\bcarousel-dragging\b/);
            await expect(page.locator('#carousel-1-item-1')).toHaveClass(/\bactive\b/);
        });

        test('works with swipe option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#carousel1').carousel({ swipe: false });
                const carousel1 = $.findOne('#carousel1');
                carousel1.dispatchEvent(new MouseEvent('mousedown', { clientX: 400 }));
                window.dispatchEvent(new MouseEvent('mousemove', { clientX: 500 }));
            });
            await expect(page.locator('#carousel1')).not.toHaveClass(/\bcarousel-dragging\b/);
            await expect(page.locator('#carousel-1-item-1')).toHaveClass(/\bactive\b/);
        });

        test('swipes with touch events', async ({ page }) => {
            const hasTouch = await page.evaluate((_) => {
                if (typeof Touch !== 'function' || typeof TouchEvent !== 'function') {
                    return false;
                }

                try {
                    const touch = new Touch({
                        identifier: 1,
                        target: document.body,
                    });

                    new TouchEvent('touchstart', {
                        touches: [touch],
                    });

                    return true;
                } catch {
                    return false;
                }
            });

            test.skip(!hasTouch, 'Touch constructors are not usable in this browser.');

            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1);
                carousel1.dispatchEvent(new TouchEvent('touchstart', {
                    touches: [new Touch({
                        identifier: Date.now(),
                        target: carousel1,
                        pageX: 400,
                    })],
                }));
                window.dispatchEvent(new TouchEvent('touchmove', {
                    touches: [new Touch({
                        identifier: Date.now(),
                        target: window,
                        pageX: 300,
                    })],
                }));
            });

            await expect(page.locator('#carousel1')).toHaveClass(/\bcarousel-dragging\b/);
            await expectStyles(page, [
                {
                    selectors: ['#carousel-1-item-1'],
                    styles: { transform: 'translateX(-25%)' },
                },
                {
                    selectors: ['#carousel-1-item-2'],
                    styles: {
                        display: 'block',
                        transform: 'translateX(75%)',
                    },
                },
            ]);
        });

        test('does not swipe to next item with wrap option', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1, { wrap: false }).show(2);
            });
            await expect(page.locator('#carousel-1-slide-2')).toHaveClass(/\bactive\b/);

            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                carousel1.dispatchEvent(new MouseEvent('mousedown', { clientX: 400 }));
                window.dispatchEvent(new MouseEvent('mousemove', { clientX: 300 }));
            });

            await expect(page.locator('#carousel1')).toHaveClass(/\bcarousel-dragging\b/);
            await expect(page.locator('#carousel-1-item-3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-2')).toHaveClass(/\bactive\b/);
            await expectStyles(page, [
                {
                    selectors: ['#carousel-1-item-3'],
                    styles: { transform: '' },
                },
            ]);
        });

        test('does not swipe to previous item with wrap option', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1, { wrap: false });
                carousel1.dispatchEvent(new MouseEvent('mousedown', { clientX: 400 }));
                window.dispatchEvent(new MouseEvent('mousemove', { clientX: 500 }));
            });

            await expect(page.locator('#carousel1')).toHaveClass(/\bcarousel-dragging\b/);
            await expect(page.locator('#carousel-1-item-1')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-0')).toHaveClass(/\bactive\b/);
            await expectStyles(page, [
                {
                    selectors: ['#carousel-1-item-1'],
                    styles: { transform: '' },
                },
            ]);
        });

        test('animates to next item after swiping', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1);
                carousel1.dispatchEvent(new MouseEvent('mousedown', { clientX: 400 }));
                window.dispatchEvent(new MouseEvent('mousemove', { clientX: 250 }));
            });
            await page.evaluate((_) => {
                window.dispatchEvent(new MouseEvent('mouseup'));
            });
            await expect(page.locator('#carousel-1-item-2')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-1')).toHaveClass(/\bactive\b/);
        });

        test('pauses while swiping', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1);
                carousel1.dispatchEvent(new MouseEvent('mousedown', { clientX: 400 }));
                window.dispatchEvent(new MouseEvent('mousemove', { clientX: 300 }));
            });

            await expect(page.locator('#carousel1')).toHaveClass(/\bcarousel-dragging\b/);
            await expect(page.locator('#carousel-1-item-1')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-0')).toHaveClass(/\bactive\b/);
            await expectStyles(page, [
                {
                    selectors: ['#carousel-1-item-1'],
                    styles: { transform: 'translateX(-25%)' },
                },
                {
                    selectors: ['#carousel-1-item-2'],
                    styles: {
                        display: 'block',
                        transform: 'translateX(75%)',
                    },
                },
            ]);
        });
    });
});
