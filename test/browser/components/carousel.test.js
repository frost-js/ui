import { expect, test } from '#test';
import { advanceClock } from '../../setup/browser.js';
import { expectStyles } from '../../support/assertions/styles.js';

test.use({ reducedMotion: 'no-preference' });

test.use({ mockClock: true });

test.describe('Carousel', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate(() => {
            document.body.innerHTML =
                '<div class="carousel" id="carousel1">' +
                '<ol class="carousel-indicators">' +
                '<li class="active" id="carousel-1-slide-0" data-ui-slide-to="0"></li>' +
                '<li id="carousel-1-slide-1" data-ui-slide-to="1"></li>' +
                '<li id="carousel-1-slide-2" data-ui-slide-to="2"></li>' +
                '</ol>' +
                '<div class="carousel-inner">' +
                '<div class="carousel-item active" id="carousel-1-item-1"></div>' +
                '<div class="carousel-item" id="carousel-1-item-2"></div>' +
                '<div class="carousel-item" id="carousel-1-item-3"></div>' +
                '</div>' +
                '<button id="carousel-1-prev" data-ui-slide="prev" type="button"></button>' +
                '<button id="carousel-1-next" data-ui-slide="next" type="button"></button>' +
                '</div>' +
                '<div class="carousel" id="carousel2">' +
                '<ol class="carousel-indicators">' +
                '<li class="active" id="carousel-2-slide-0" data-ui-slide-to="0"></li>' +
                '<li id="carousel-2-slide-1" data-ui-slide-to="1"></li>' +
                '<li id="carousel-2-slide-2" data-ui-slide-to="2"></li>' +
                '</ol>' +
                '<div class="carousel-inner">' +
                '<div class="carousel-item active" id="carousel-2-item-1"></div>' +
                '<div class="carousel-item" id="carousel-2-item-2"></div>' +
                '<div class="carousel-item" id="carousel-2-item-3"></div>' +
                '</div>' +
                '<button id="carousel-2-prev" data-ui-slide="prev" type="button"></button>' +
                '<button id="carousel-2-next" data-ui-slide="next" type="button"></button>' +
                '</div>';
        });
    });

    test.describe('#init', () => {
        for (const { name, init } of [
            {
                name: 'class',
                init: (selector) => UI.Carousel.init(document.querySelector(selector)),
            },
            {
                name: 'QuerySet',
                init: (selector) => $(selector).carousel(),
            },
        ]) {
            test(`creates a carousel (${name})`, async ({ page }) => {
                const instance = await page.evaluateHandle(init, '#carousel1');

                expect(await instance.evaluate((value) => value instanceof UI.Carousel)).toBe(true);
                expect(await page.evaluate(() =>
                    $.getData('#carousel1', 'carousel') instanceof UI.Carousel)).toBe(true);
            });
        }
    });

    test.describe('#dispose', () => {
        for (const { name, dispose } of [
            {
                name: 'class',
                dispose: (selector) => {
                    UI.Carousel.init(document.querySelector(selector)).dispose();
                },
            },
            {
                name: 'QuerySet',
                dispose: (selector) => {
                    $(selector).carousel('dispose');
                },
            },
        ]) {
            test(`removes the carousel (${name})`, async ({ page }) => {
                await page.evaluate(dispose, '#carousel1');

                expect(await page.evaluate(() => $.hasData('#carousel1', 'carousel'))).toBe(false);
            });
        }

        test('removes the touch swipe event', async ({ page }) => {
            const defaultPrevented = await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).dispose();

                const event = new Event('touchstart', {
                    bubbles: true,
                    cancelable: true,
                });
                Object.defineProperty(event, 'touches', {
                    value: [{ pageX: 400, pageY: 0 }],
                });
                carousel1.dispatchEvent(event);

                return event.defaultPrevented;
            });

            expect(defaultPrevented).toBe(false);
        });

        test('settles the active slide on disposal without a late event', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                window.carouselSlidEventTriggered = false;

                $.addEvent(carousel1, 'slid.ui.carousel', (_) => {
                    window.carouselSlidEventTriggered = true;
                });

                const carousel = UI.Carousel.init(carousel1);
                carousel.show(1);
                carousel.dispose();
            });
            await advanceClock(page, 1000);

            await expect(page.locator('#carousel-1-item-2')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-1')).toHaveClass(/\bactive\b/);
            expect(await page.evaluate((_) => window.carouselSlidEventTriggered)).toBe(false);
            expect(await page.evaluate((_) => $.hasData('#carousel1', 'carousel'))).toBe(false);
        });
    });

    test.describe('#cycle', () => {
        for (const { name, cycle } of [
            {
                name: 'class',
                cycle: (selector) => {
                    UI.Carousel.init(document.querySelector(selector)).cycle();
                },
            },
            {
                name: 'QuerySet',
                cycle: (selector) => {
                    $(selector).carousel('cycle');
                },
            },
        ]) {
            test(`shows the next item (${name})`, async ({ page }) => {
                await page.evaluate(cycle, '#carousel1');

                await expect(page.locator('#carousel-1-item-1')).not.toHaveClass(/\bactive\b/);
                await expect(page.locator('#carousel-1-item-2')).toHaveClass(/\bactive\b/);
                await expect(page.locator('#carousel-1-slide-0')).not.toHaveClass(/\bactive\b/);
                await expect(page.locator('#carousel-1-slide-1')).toHaveClass(/\bactive\b/);
            });
        }

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                const carousel = UI.Carousel.init(carousel1);
                carousel.cycle();
                carousel.cycle();
                carousel.cycle();
            });

            await expect(page.locator('#carousel-1-item-2')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-1')).toHaveClass(/\bactive\b/);
        });

        test('wraps around to first item', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).show(2);
            });
            await expect(page.locator('#carousel-1-slide-2')).toHaveClass(/\bactive\b/);

            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).cycle();
            });

            await expect(page.locator('#carousel-1-item-1')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-item-3')).not.toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-0')).toHaveClass(/\bactive\b/);
        });
    });

    test.describe('#show', () => {
        for (const { name, show } of [
            {
                name: 'class',
                show: ([selector, ...args]) => {
                    UI.Carousel.init(document.querySelector(selector)).show(...args);
                },
            },
            {
                name: 'QuerySet',
                show: ([selector, ...args]) => {
                    $(selector).carousel('show', ...args);
                },
            },
        ]) {
            test(`shows a specified item (${name})`, async ({ page }) => {
                await page.evaluate(show, ['#carousel1', 2]);

                await expect(page.locator('#carousel-1-item-1')).not.toHaveClass(/\bactive\b/);
                await expect(page.locator('#carousel-1-item-3')).toHaveClass(/\bactive\b/);
                await expect(page.locator('#carousel-1-slide-0')).not.toHaveClass(/\bactive\b/);
                await expect(page.locator('#carousel-1-slide-2')).toHaveClass(/\bactive\b/);
            });
        }

        test('shows a specified item (data-ui-slide-to)', async ({ page }) => {
            await page.locator('#carousel-1-slide-2').click();

            await expect(page.locator('#carousel-1-item-3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-2')).toHaveClass(/\bactive\b/);
        });

        test('can be called on current item', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).show(0);
            });

            await expect(page.locator('#carousel-1-item-1')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-0')).toHaveClass(/\bactive\b/);
        });

        test('can be called with invalid item', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).show(3);
            });

            await expect(page.locator('#carousel-1-item-1')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-0')).toHaveClass(/\bactive\b/);
        });

        test('can be called with non-numeric item', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).show('invalid');
            });

            await expect(page.locator('#carousel-1-item-1')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-0')).toHaveClass(/\bactive\b/);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                const carousel = UI.Carousel.init(carousel1);
                carousel.show(1);
                carousel.show(1);
                carousel.show(1);
            });

            await expect(page.locator('#carousel-1-item-2')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-1')).toHaveClass(/\bactive\b/);
        });
    });

    test.describe('#slide', () => {
        for (const { name, slide } of [
            {
                name: 'class',
                slide: ([selector, ...args]) => {
                    UI.Carousel.init(document.querySelector(selector)).slide(...args);
                },
            },
            {
                name: 'QuerySet',
                slide: ([selector, ...args]) => {
                    $(selector).carousel('slide', ...args);
                },
            },
        ]) {
            test(`slides forwards (${name})`, async ({ page }) => {
                await page.evaluate(slide, ['#carousel1', 1]);

                await expect(page.locator('#carousel-1-item-2')).toHaveClass(/\bactive\b/);
                await expect(page.locator('#carousel-1-slide-1')).toHaveClass(/\bactive\b/);
            });

            test(`slides backwards (${name})`, async ({ page }) => {
                await page.evaluate(slide, ['#carousel1', -1]);

                await expect(page.locator('#carousel-1-item-3')).toHaveClass(/\bactive\b/);
                await expect(page.locator('#carousel-1-slide-2')).toHaveClass(/\bactive\b/);
            });
        }

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                const carousel = UI.Carousel.init(carousel1);
                carousel.slide(1);
                carousel.slide(1);
                carousel.slide(1);
            });

            await expect(page.locator('#carousel-1-item-2')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-1')).toHaveClass(/\bactive\b/);
        });

        test('wraps around to first item', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).show(2);
            });
            await expect(page.locator('#carousel-1-slide-2')).toHaveClass(/\bactive\b/);

            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).slide(1);
            });

            await expect(page.locator('#carousel-1-item-1')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-0')).toHaveClass(/\bactive\b/);
        });

        test('wraps around to last item', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).slide(-1);
            });

            await expect(page.locator('#carousel-1-item-3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-2')).toHaveClass(/\bactive\b/);
        });
    });

    test.describe('#next', () => {
        for (const { name, next } of [
            {
                name: 'class',
                next: (selector) => {
                    UI.Carousel.init(document.querySelector(selector)).next();
                },
            },
            {
                name: 'QuerySet',
                next: (selector) => {
                    $(selector).carousel('next');
                },
            },
        ]) {
            test(`shows the next item (${name})`, async ({ page }) => {
                await page.evaluate(next, '#carousel1');

                await expect(page.locator('#carousel-1-item-2')).toHaveClass(/\bactive\b/);
                await expect(page.locator('#carousel-1-slide-1')).toHaveClass(/\bactive\b/);
            });
        }

        test('shows the next item (data-ui-slide)', async ({ page }) => {
            await page.locator('#carousel-1-next').click();

            await expect(page.locator('#carousel-1-item-2')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-1')).toHaveClass(/\bactive\b/);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                const carousel = UI.Carousel.init(carousel1);
                carousel.next();
                carousel.next();
                carousel.next();
            });

            await expect(page.locator('#carousel-1-item-2')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-1')).toHaveClass(/\bactive\b/);
        });
    });

    test.describe('#prev', () => {
        for (const { name, prev } of [
            {
                name: 'class',
                prev: (selector) => {
                    UI.Carousel.init(document.querySelector(selector)).prev();
                },
            },
            {
                name: 'QuerySet',
                prev: (selector) => {
                    $(selector).carousel('prev');
                },
            },
        ]) {
            test(`shows the previous item (${name})`, async ({ page }) => {
                await page.evaluate(prev, '#carousel1');

                await expect(page.locator('#carousel-1-item-3')).toHaveClass(/\bactive\b/);
                await expect(page.locator('#carousel-1-slide-2')).toHaveClass(/\bactive\b/);
            });
        }

        test('shows the previous item (data-ui-slide)', async ({ page }) => {
            await page.locator('#carousel-1-prev').click();

            await expect(page.locator('#carousel-1-item-3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-2')).toHaveClass(/\bactive\b/);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                const carousel = UI.Carousel.init(carousel1);
                carousel.prev();
                carousel.prev();
                carousel.prev();
            });

            await expect(page.locator('#carousel-1-item-3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-2')).toHaveClass(/\bactive\b/);
        });
    });

    test.describe('events', () => {
        test('triggers slide event', async ({ page }) => {
            const eventTriggered = await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                let triggered = false;

                $.addEvent(carousel1, 'slide.ui.carousel', (_) => {
                    triggered = true;
                });
                UI.Carousel.init(carousel1).cycle();

                return triggered;
            });

            expect(eventTriggered).toBe(true);
        });

        test('uses the physical direction for slide events in RTL', async ({ page }) => {
            const direction = await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                carousel1.dir = 'rtl';
                let direction;

                $.addEvent(carousel1, 'slide.ui.carousel', (e) => {
                    direction = e.direction;
                });
                UI.Carousel.init(carousel1).next();

                return direction;
            });

            expect(direction).toBe('left');
        });

        test('triggers slid event', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                window.carouselSlidEventTriggered = false;

                $.addEvent(carousel1, 'slid.ui.carousel', (_) => {
                    window.carouselSlidEventTriggered = true;
                });
                UI.Carousel.init(carousel1).cycle();
            });

            await expect(page.locator('#carousel-1-slide-1')).toHaveClass(/\bactive\b/);
            expect(await page.evaluate((_) => window.carouselSlidEventTriggered)).toBe(true);
            await expect(page.locator('#carousel-1-item-2')).toHaveClass(/\bactive\b/);
        });

        test('can start another slide from the slid event', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                const carousel = UI.Carousel.init(carousel1);
                let firstSlide = true;

                window.carouselSecondSlidEventTriggered = false;

                $.addEvent(carousel1, 'slid.ui.carousel', (_) => {
                    if (firstSlide) {
                        firstSlide = false;
                        carousel.next();
                    } else {
                        window.carouselSecondSlidEventTriggered = true;
                    }
                });

                carousel.next();
            });

            await page.waitForFunction((_) => window.carouselSecondSlidEventTriggered);
            await expect(page.locator('#carousel-1-item-3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-2')).toHaveClass(/\bactive\b/);
        });

        test('triggers slide event (show)', async ({ page }) => {
            const eventTriggered = await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                let triggered = false;

                $.addEvent(carousel1, 'slide.ui.carousel', (_) => {
                    triggered = true;
                });
                UI.Carousel.init(carousel1).show(1);

                return triggered;
            });

            expect(eventTriggered).toBe(true);
        });

        test('triggers slid event (show)', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                window.carouselSlidEventTriggered = false;

                $.addEvent(carousel1, 'slid.ui.carousel', (_) => {
                    window.carouselSlidEventTriggered = true;
                });
                UI.Carousel.init(carousel1).show(1);
            });

            await expect(page.locator('#carousel-1-slide-1')).toHaveClass(/\bactive\b/);
            expect(await page.evaluate((_) => window.carouselSlidEventTriggered)).toBe(true);
            await expect(page.locator('#carousel-1-item-2')).toHaveClass(/\bactive\b/);
        });

        test('triggers slide event (slide)', async ({ page }) => {
            const eventTriggered = await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                let triggered = false;

                $.addEvent(carousel1, 'slide.ui.carousel', (_) => {
                    triggered = true;
                });
                UI.Carousel.init(carousel1).slide(1);

                return triggered;
            });

            expect(eventTriggered).toBe(true);
        });

        test('triggers slid event (slide)', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                window.carouselSlidEventTriggered = false;

                $.addEvent(carousel1, 'slid.ui.carousel', (_) => {
                    window.carouselSlidEventTriggered = true;
                });
                UI.Carousel.init(carousel1).slide(1);
            });

            await expect(page.locator('#carousel-1-slide-1')).toHaveClass(/\bactive\b/);
            expect(await page.evaluate((_) => window.carouselSlidEventTriggered)).toBe(true);
            await expect(page.locator('#carousel-1-item-2')).toHaveClass(/\bactive\b/);
        });

        test('triggers slide event (next)', async ({ page }) => {
            const eventTriggered = await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                let triggered = false;

                $.addEvent(carousel1, 'slide.ui.carousel', (_) => {
                    triggered = true;
                });
                UI.Carousel.init(carousel1).next();

                return triggered;
            });

            expect(eventTriggered).toBe(true);
        });

        test('triggers slid event (next)', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                window.carouselSlidEventTriggered = false;

                $.addEvent(carousel1, 'slid.ui.carousel', (_) => {
                    window.carouselSlidEventTriggered = true;
                });
                UI.Carousel.init(carousel1).next();
            });

            await expect(page.locator('#carousel-1-slide-1')).toHaveClass(/\bactive\b/);
            expect(await page.evaluate((_) => window.carouselSlidEventTriggered)).toBe(true);
            await expect(page.locator('#carousel-1-item-2')).toHaveClass(/\bactive\b/);
        });

        test('triggers slide event (prev)', async ({ page }) => {
            const eventTriggered = await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                let triggered = false;

                $.addEvent(carousel1, 'slide.ui.carousel', (_) => {
                    triggered = true;
                });
                UI.Carousel.init(carousel1).prev();

                return triggered;
            });

            expect(eventTriggered).toBe(true);
        });

        test('triggers slid event (prev)', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                window.carouselSlidEventTriggered = false;

                $.addEvent(carousel1, 'slid.ui.carousel', (_) => {
                    window.carouselSlidEventTriggered = true;
                });
                UI.Carousel.init(carousel1).prev();
            });

            await expect(page.locator('#carousel-1-slide-2')).toHaveClass(/\bactive\b/);
            expect(await page.evaluate((_) => window.carouselSlidEventTriggered)).toBe(true);
            await expect(page.locator('#carousel-1-item-3')).toHaveClass(/\bactive\b/);
        });

        test('can be prevented from sliding', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                $.addEvent(carousel1, 'slide.ui.carousel', (_) => false);
                UI.Carousel.init(carousel1).next();
            });

            await expect(page.locator('#carousel-1-item-1')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-item-2')).not.toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-0')).toHaveClass(/\bactive\b/);
        });

        test('can be prevented from sliding (prevent default)', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                $.addEvent(carousel1, 'slide.ui.carousel', (event) => {
                    event.preventDefault();
                });
                UI.Carousel.init(carousel1).next();
            });

            await expect(page.locator('#carousel-1-item-1')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-item-2')).not.toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-0')).toHaveClass(/\bactive\b/);
        });
    });

    test.describe('interval option', () => {
        for (const { name, run } of [
            {
                name: 'class',
                run: (_) => {
                    const carousel1 = $.findOne('#carousel1');
                    UI.Carousel.init(carousel1, { interval: 300 }).cycle();
                },
            },
            {
                name: 'QuerySet',
                run: (_) => {
                    $('#carousel1')
                        .carousel({ interval: 300 })
                        .cycle();
                },
            },
        ]) {
            test(`works with interval option (${name})`, async ({ page }) => {
                await page.evaluate(run);
                await expect(page.locator('#carousel-1-slide-1')).toHaveClass(/\bactive\b/);
                await advanceClock(page, 300);

                await expect(page.locator('#carousel-1-item-3')).toHaveClass(/\bactive\b/);
                await expect(page.locator('#carousel-1-slide-2')).toHaveClass(/\bactive\b/);
            });
        }

        test('works with interval option (data-ui-interval)', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                $.setDataset(carousel1, { uiInterval: 300 });
                UI.Carousel.init(carousel1).cycle();
            });
            await expect(page.locator('#carousel1')).toHaveAttribute('data-ui-interval', '300');
            await expect(page.locator('#carousel-1-slide-1')).toHaveClass(/\bactive\b/);
            await advanceClock(page, 300);

            await expect(page.locator('#carousel-1-item-3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-2')).toHaveClass(/\bactive\b/);
        });
    });

    test.describe('transition duration', () => {
        test('preserves a custom CSS transition duration', async ({ page }) => {
            await page.locator('#carousel1').evaluate((node) => {
                $.setStyle(node, { '--ui-carousel-transition-duration': '200ms' });
                UI.Carousel.init(node);
            });

            await expect(page.locator('#carousel-1-item-1')).toHaveCSS('transition-duration', '0.2s');
        });
    });

    test.describe('keyboard option', () => {
        test('shows the next item on right arrow', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1);
            });
            await page.locator('#carousel1').dispatchEvent('keydown', { code: 'ArrowRight' });

            await expect(page.locator('#carousel-1-item-2')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-1')).toHaveClass(/\bactive\b/);
        });

        test('shows the previous item on left arrow', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).show(2);
            });
            await expect(page.locator('#carousel-1-slide-2')).toHaveClass(/\bactive\b/);

            await page.locator('#carousel1').dispatchEvent('keydown', { code: 'ArrowLeft' });

            await expect(page.locator('#carousel-1-item-2')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-1')).toHaveClass(/\bactive\b/);
        });

        test('shows the next item on left arrow in RTL', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                carousel1.dir = 'rtl';
                UI.Carousel.init(carousel1);
            });
            await page.locator('#carousel1').dispatchEvent('keydown', { code: 'ArrowLeft' });

            await expect(page.locator('#carousel-1-item-2')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-1')).toHaveClass(/\bactive\b/);
        });

        test('shows the previous item on right arrow in RTL', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                carousel1.dir = 'rtl';
                UI.Carousel.init(carousel1);
            });
            await page.locator('#carousel1').dispatchEvent('keydown', { code: 'ArrowRight' });

            await expect(page.locator('#carousel-1-item-3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-2')).toHaveClass(/\bactive\b/);
        });

        for (const { name, run } of [
            {
                name: 'class',
                run: (_) => {
                    const carousel1 = $.findOne('#carousel1');
                    UI.Carousel.init(carousel1, { keyboard: false });
                },
            },
            {
                name: 'QuerySet',
                run: (_) => {
                    $('#carousel1').carousel({ keyboard: false });
                },
            },
        ]) {
            test(`works with keyboard option and next (${name})`, async ({ page }) => {
                await page.evaluate(run);
                await page.locator('#carousel1').dispatchEvent('keydown', { code: 'ArrowRight' });

                await expect(page.locator('#carousel-1-item-1')).toHaveClass(/\bactive\b/);
                await expect(page.locator('#carousel-1-slide-0')).toHaveClass(/\bactive\b/);
            });

            test(`works with keyboard option and prev (${name})`, async ({ page }) => {
                await page.evaluate(run);
                await page.locator('#carousel1').dispatchEvent('keydown', { code: 'ArrowLeft' });

                await expect(page.locator('#carousel-1-item-1')).toHaveClass(/\bactive\b/);
                await expect(page.locator('#carousel-1-slide-0')).toHaveClass(/\bactive\b/);
            });
        }

        test('works with keyboard option and next (data-ui-keyboard)', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                $.setDataset(carousel1, { uiKeyboard: false });
                UI.Carousel.init(carousel1);
            });
            await page.locator('#carousel1').dispatchEvent('keydown', { code: 'ArrowRight' });

            await expect(page.locator('#carousel1')).toHaveAttribute('data-ui-keyboard', 'false');
            await expect(page.locator('#carousel-1-item-1')).toHaveClass(/\bactive\b/);
        });

        test('works with keyboard option and prev (data-ui-keyboard)', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                $.setDataset(carousel1, { uiKeyboard: false });
                UI.Carousel.init(carousel1);
            });
            await page.locator('#carousel1').dispatchEvent('keydown', { code: 'ArrowLeft' });

            await expect(page.locator('#carousel1')).toHaveAttribute('data-ui-keyboard', 'false');
            await expect(page.locator('#carousel-1-item-1')).toHaveClass(/\bactive\b/);
        });
    });

    test.describe('pause option', () => {
        test('pauses on mouseenter', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).cycle();
            });
            await page.locator('#carousel1').dispatchEvent('mouseenter');

            await expect(page.locator('#carousel-1-item-2')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-item-3')).not.toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-1')).toHaveClass(/\bactive\b/);
        });

        test('resumes on mouseleave', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).cycle();
            });
            await page.locator('#carousel1').dispatchEvent('mouseenter');
            await expect(page.locator('#carousel-1-slide-1')).toHaveClass(/\bactive\b/);
            await page.locator('#carousel1').dispatchEvent('mouseleave');
            await advanceClock(page, 5000);

            await expect(page.locator('#carousel-1-item-3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-2')).toHaveClass(/\bactive\b/);
        });

        for (const { name, run } of [
            {
                name: 'class',
                run: (_) => {
                    const carousel1 = $.findOne('#carousel1');
                    UI.Carousel.init(carousel1, { pause: false }).cycle();
                },
            },
            {
                name: 'QuerySet',
                run: (_) => {
                    $('#carousel1')
                        .carousel({ pause: false })
                        .cycle();
                },
            },
        ]) {
            test(`works with pause option (${name})`, async ({ page }) => {
                await page.evaluate(run);
                await page.locator('#carousel1').dispatchEvent('mouseenter');
                await expect(page.locator('#carousel-1-slide-1')).toHaveClass(/\bactive\b/);
                await advanceClock(page, 5000);

                await expect(page.locator('#carousel-1-item-3')).toHaveClass(/\bactive\b/);
                await expect(page.locator('#carousel-1-slide-2')).toHaveClass(/\bactive\b/);
            });
        }

        test('works with pause option (data-ui-pause)', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                $.setDataset(carousel1, { uiPause: false });
                UI.Carousel.init(carousel1).cycle();
            });
            await page.locator('#carousel1').dispatchEvent('mouseenter');
            await expect(page.locator('#carousel1')).toHaveAttribute('data-ui-pause', 'false');
            await expect(page.locator('#carousel-1-slide-1')).toHaveClass(/\bactive\b/);
            await advanceClock(page, 5000);

            await expect(page.locator('#carousel-1-item-3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-2')).toHaveClass(/\bactive\b/);
        });
    });

    test.describe('wrap option', () => {
        test('wraps around to first item', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).show(2);
            });
            await expect(page.locator('#carousel-1-slide-2')).toHaveClass(/\bactive\b/);

            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).next();
            });

            await expect(page.locator('#carousel-1-item-1')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-0')).toHaveClass(/\bactive\b/);
        });

        test('wraps around to last item', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).prev();
            });

            await expect(page.locator('#carousel-1-item-3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-2')).toHaveClass(/\bactive\b/);
        });

        for (const { name, prepare, run } of [
            {
                name: 'class',
                prepare: (_) => {
                    const carousel1 = $.findOne('#carousel1');
                    UI.Carousel.init(carousel1, { wrap: false }).show(2);
                },
                run: (_) => {
                    const carousel1 = $.findOne('#carousel1');
                    UI.Carousel.init(carousel1).next();
                },
            },
            {
                name: 'QuerySet',
                prepare: (_) => {
                    $('#carousel1')
                        .carousel({ wrap: false })
                        .show(2);
                },
                run: (_) => {
                    $('#carousel1').carousel('next');
                },
            },
        ]) {
            test(`works with wrap option and next (${name})`, async ({ page }) => {
                await page.evaluate(prepare);
                await expect(page.locator('#carousel-1-slide-2')).toHaveClass(/\bactive\b/);

                await page.evaluate(run);

                await expect(page.locator('#carousel-1-item-3')).toHaveClass(/\bactive\b/);
                await expect(page.locator('#carousel-1-slide-2')).toHaveClass(/\bactive\b/);
            });
        }

        for (const { name, run } of [
            {
                name: 'class',
                run: (_) => {
                    const carousel1 = $.findOne('#carousel1');
                    UI.Carousel.init(carousel1, { wrap: false }).prev();
                },
            },
            {
                name: 'QuerySet',
                run: (_) => {
                    $('#carousel1')
                        .carousel({ wrap: false })
                        .prev();
                },
            },
        ]) {
            test(`works with wrap option and prev (${name})`, async ({ page }) => {
                await page.evaluate(run);

                await expect(page.locator('#carousel-1-item-1')).toHaveClass(/\bactive\b/);
                await expect(page.locator('#carousel-1-slide-0')).toHaveClass(/\bactive\b/);
            });
        }

        test('works with wrap option and next (data-ui-wrap)', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                $.setDataset(carousel1, { uiWrap: false });
                UI.Carousel.init(carousel1).show(2);
            });
            await expect(page.locator('#carousel-1-slide-2')).toHaveClass(/\bactive\b/);

            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).next();
            });

            await expect(page.locator('#carousel1')).toHaveAttribute('data-ui-wrap', 'false');
            await expect(page.locator('#carousel-1-item-3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-2')).toHaveClass(/\bactive\b/);
        });

        test('works with wrap option and prev (data-ui-wrap)', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                $.setDataset(carousel1, { uiWrap: false });
                UI.Carousel.init(carousel1).prev();
            });

            await expect(page.locator('#carousel1')).toHaveAttribute('data-ui-wrap', 'false');
            await expect(page.locator('#carousel-1-item-1')).toHaveClass(/\bactive\b/);
        });
    });

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

        test('works with swipe option (QuerySet)', async ({ page }) => {
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

    test.describe('cycle', () => {
        test('continues cycling after the document becomes visible', async ({ page }) => {
            await page.evaluate((_) => {
                Object.defineProperty(document, 'visibilityState', {
                    configurable: true,
                    value: 'hidden',
                });

                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).cycle();
            });
            await page.evaluate((_) => {
                Object.defineProperty(document, 'visibilityState', {
                    configurable: true,
                    value: 'visible',
                });
            });
            await advanceClock(page, 5000);

            await expect(page.locator('#carousel-1-item-2')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-item-1')).not.toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-0')).not.toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-1')).toHaveClass(/\bactive\b/);
        });

        test('starts cycling (cycle)', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).cycle();
            });
            await expect(page.locator('#carousel-1-slide-1')).toHaveClass(/\bactive\b/);
            await advanceClock(page, 5000);

            await expect(page.locator('#carousel-1-item-3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-2')).toHaveClass(/\bactive\b/);
        });

        test('starts cycling (show)', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).show(1);
            });
            await expect(page.locator('#carousel-1-slide-1')).toHaveClass(/\bactive\b/);
            await advanceClock(page, 5000);

            await expect(page.locator('#carousel-1-item-3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-2')).toHaveClass(/\bactive\b/);
        });

        test('starts cycling (slide)', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).slide(1);
            });
            await expect(page.locator('#carousel-1-slide-1')).toHaveClass(/\bactive\b/);
            await advanceClock(page, 5000);

            await expect(page.locator('#carousel-1-item-3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-2')).toHaveClass(/\bactive\b/);
        });

        test('starts cycling (next)', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).next();
            });
            await expect(page.locator('#carousel-1-slide-1')).toHaveClass(/\bactive\b/);
            await advanceClock(page, 5000);

            await expect(page.locator('#carousel-1-item-3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-2')).toHaveClass(/\bactive\b/);
        });

        test('starts cycling (prev)', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).prev();
            });
            await expect(page.locator('#carousel-1-slide-2')).toHaveClass(/\bactive\b/);
            await advanceClock(page, 5000);

            await expect(page.locator('#carousel-1-item-1')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-0')).toHaveClass(/\bactive\b/);
        });

        test('starts cycling (swipe)', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1);
                carousel1.dispatchEvent(new MouseEvent('mousedown', { clientX: 400 }));
                window.dispatchEvent(new MouseEvent('mousemove', { clientX: 250 }));
            });
            await page.evaluate((_) => {
                window.dispatchEvent(new MouseEvent('mouseup'));
                const carousel1 = $.findOne('#carousel1');
                carousel1.dispatchEvent(new MouseEvent('mouseleave'));
            });
            await expect(page.locator('#carousel-1-slide-1')).toHaveClass(/\bactive\b/);
            await advanceClock(page, 5000);

            await expect(page.locator('#carousel-1-item-3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel-1-slide-2')).toHaveClass(/\bactive\b/);
        });
    });

    test.describe('QuerySet', () => {
        test.describe('#init', () => {
            test('creates multiple carousels', async ({ page }) => {
                expect(await page.evaluate((_) => {
                    $('.carousel').carousel();
                    return $.find('.carousel').every((node) =>
                        $.getData(node, 'carousel') instanceof UI.Carousel,
                    );
                })).toBe(true);
            });
        });

        test.describe('#dispose', () => {
            test('removes multiple carousels', async ({ page }) => {
                expect(await page.evaluate((_) => {
                    $('.carousel').carousel('dispose');
                    return $.find('.carousel').some((node) => $.hasData(node, 'carousel'));
                })).toBe(false);
            });
        });

        test.describe('#cycle', () => {
            test('shows the next item for multiple carousels', async ({ page }) => {
                await page.evaluate((_) => {
                    $('.carousel').carousel('cycle');
                });

                await expect(page.locator('#carousel-1-item-2')).toHaveClass(/\bactive\b/);
                await expect(page.locator('#carousel-1-slide-1')).toHaveClass(/\bactive\b/);
                await expect(page.locator('#carousel-2-item-2')).toHaveClass(/\bactive\b/);
                await expect(page.locator('#carousel-2-slide-1')).toHaveClass(/\bactive\b/);
            });
        });

        test.describe('#show', () => {
            test('shows a specified item for multiple carousels', async ({ page }) => {
                await page.evaluate((_) => {
                    $('.carousel').carousel('show', 2);
                });

                await expect(page.locator('#carousel-1-item-3')).toHaveClass(/\bactive\b/);
                await expect(page.locator('#carousel-1-slide-2')).toHaveClass(/\bactive\b/);
                await expect(page.locator('#carousel-2-item-3')).toHaveClass(/\bactive\b/);
                await expect(page.locator('#carousel-2-slide-2')).toHaveClass(/\bactive\b/);
            });
        });

        test.describe('#slide', () => {
            test('slides forwards for multiple carousels', async ({ page }) => {
                await page.evaluate((_) => {
                    $('.carousel').carousel('slide', 1);
                });

                await expect(page.locator('#carousel-1-item-2')).toHaveClass(/\bactive\b/);
                await expect(page.locator('#carousel-2-item-2')).toHaveClass(/\bactive\b/);
                await expect(page.locator('#carousel-1-slide-1')).toHaveClass(/\bactive\b/);
                await expect(page.locator('#carousel-2-slide-1')).toHaveClass(/\bactive\b/);
            });

            test('slides backwards for multiple carousels', async ({ page }) => {
                await page.evaluate((_) => {
                    $('.carousel').carousel('slide', -1);
                });

                await expect(page.locator('#carousel-1-item-3')).toHaveClass(/\bactive\b/);
                await expect(page.locator('#carousel-2-item-3')).toHaveClass(/\bactive\b/);
                await expect(page.locator('#carousel-1-slide-2')).toHaveClass(/\bactive\b/);
                await expect(page.locator('#carousel-2-slide-2')).toHaveClass(/\bactive\b/);
            });
        });

        test.describe('#next', () => {
            test('shows the next item for multiple carousels', async ({ page }) => {
                await page.evaluate((_) => {
                    $('.carousel').carousel('next');
                });

                await expect(page.locator('#carousel-1-item-2')).toHaveClass(/\bactive\b/);
                await expect(page.locator('#carousel-2-item-2')).toHaveClass(/\bactive\b/);
                await expect(page.locator('#carousel-1-slide-1')).toHaveClass(/\bactive\b/);
                await expect(page.locator('#carousel-2-slide-1')).toHaveClass(/\bactive\b/);
            });
        });

        test.describe('#prev', () => {
            test('shows the previous item for multiple carousels', async ({ page }) => {
                await page.evaluate((_) => {
                    $('.carousel').carousel('prev');
                });

                await expect(page.locator('#carousel-1-item-3')).toHaveClass(/\bactive\b/);
                await expect(page.locator('#carousel-2-item-3')).toHaveClass(/\bactive\b/);
                await expect(page.locator('#carousel-1-slide-2')).toHaveClass(/\bactive\b/);
                await expect(page.locator('#carousel-2-slide-2')).toHaveClass(/\bactive\b/);
            });
        });
    });
});
