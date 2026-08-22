import { expect, test } from '@playwright/test';
import { advanceClock, resetPage, setupClock } from '../../setup/browser.js';
import { expectAnimationState } from '../../support/assertions/animation.js';
import { expectStyles } from '../../support/assertions/styles.js';

test.beforeEach(async ({ page }) => {
    await setupClock(page);
    await resetPage(page);
});

test.describe('Carousel', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div class="carousel" id="carousel1">' +
                '<ol class="carousel-indicators">' +
                '<li class="active" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                '</ol>' +
                '<div class="carousel-inner">' +
                '<div class="carousel-item active" id="carousel1Item1"></div>' +
                '<div class="carousel-item" id="carousel1Item2"></div>' +
                '<div class="carousel-item" id="carousel1Item3"></div>' +
                '</div>' +
                '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                '</div>' +
                '<div class="carousel" id="carousel2">' +
                '<ol class="carousel-indicators">' +
                '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                '</ol>' +
                '<div class="carousel-inner">' +
                '<div class="carousel-item active" id="carousel2Item1"></div>' +
                '<div class="carousel-item" id="carousel2Item2"></div>' +
                '<div class="carousel-item" id="carousel2Item3"></div>' +
                '</div>' +
                '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                '</div>';
        });
    });

    test.describe('#init', () => {
        test('creates a carousel', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                return UI.Carousel.init(carousel1) instanceof UI.Carousel;
            })).toBe(true);
        });

        test('creates a carousel (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('#carousel1').carousel();
                return $.getData('#carousel1', 'carousel') instanceof UI.Carousel;
            })).toBe(true);
        });

        test('creates multiple carousels (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('.carousel').carousel();
                return $.find('.carousel').every((node) =>
                    $.getData(node, 'carousel') instanceof UI.Carousel,
                );
            })).toBe(true);
        });

        test('returns the carousel (query)', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $('#carousel1').carousel() instanceof UI.Carousel)).toBe(true);
        });
    });

    test.describe('#dispose', () => {
        test('removes the carousel', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).dispose();
                return $.hasData(carousel1, 'carousel');
            })).toBe(false);
        });

        test('removes the carousel (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('#carousel1').carousel('dispose');
                return $.hasData('#carousel1', 'carousel');
            })).toBe(false);
        });

        test('removes multiple carousels (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('.carousel').carousel('dispose');
                return $.find('.carousel').some((node) => $.hasData(node, 'carousel'));
            })).toBe(false);
        });

        test('clears carousel memory', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                const carousel = UI.Carousel.init(carousel1);
                carousel.dispose();

                for (const key in carousel) {
                    if ($._isObject(carousel[key]) && !$._isFunction(carousel[key])) {
                        return false;
                    }
                }

                return true;
            })).toBe(true);
        });

        test('clears carousel memory when node is removed', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                const carousel = UI.Carousel.init(carousel1);
                $.remove(carousel1);

                for (const key in carousel) {
                    if ($._isObject(carousel[key]) && !$._isFunction(carousel[key])) {
                        return false;
                    }
                }

                return true;
            })).toBe(true);
        });
    });

    test.describe('#cycle', () => {
        test('shows the next item', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).cycle();
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item2'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1Item1')).not.toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Item2')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide0')).not.toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide1')).toHaveClass(/\bactive\b/);
        });

        test('shows the next item (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#carousel1').carousel('cycle');
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item2'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1Item2')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide1')).toHaveClass(/\bactive\b/);
        });

        test('shows the next item for multiple carousels (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('.carousel').carousel('cycle');
            });
            await advanceClock(page, 150);

            await expect(page.locator('#carousel1Item2')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide1')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel2Item2')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel2Slide1')).toHaveClass(/\bactive\b/);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                const carousel = UI.Carousel.init(carousel1);
                carousel.cycle();
                carousel.cycle();
                carousel.cycle();
            });
            await advanceClock(page, 50);

            await expect(page.locator('#carousel1Item2')).toHaveClass(/\bactive\b/);
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item2'],
                    active: true,
                },
            ]);
        });

        test('wraps around to first item', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).show(2);
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#carousel1Item3');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).cycle();
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item1'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1Item1')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Item3')).not.toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide0')).toHaveClass(/\bactive\b/);
        });
    });

    test.describe('#show', () => {
        test('shows a specified item', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).show(2);
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item3'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1Item1')).not.toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Item3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide0')).not.toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide2')).toHaveClass(/\bactive\b/);
        });

        test('shows a specified item (data-ui-slide-to)', async ({ page }) => {
            await page.locator('#carousel1Slide2').click();
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item3'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1Item3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide2')).toHaveClass(/\bactive\b/);
        });

        test('shows a specified item (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#carousel1').carousel('show', 2);
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item3'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1Item3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide2')).toHaveClass(/\bactive\b/);
        });

        test('shows a specified item for multiple carousels (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('.carousel').carousel('show', 2);
            });
            await advanceClock(page, 150);

            await expect(page.locator('#carousel1Item3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide2')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel2Item3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel2Slide2')).toHaveClass(/\bactive\b/);
        });

        test('can be called on current item', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).show(0);
            });
            await advanceClock(page, 50);

            await expect(page.locator('#carousel1Item1')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide0')).toHaveClass(/\bactive\b/);
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item1'],
                },
            ]);
        });

        test('can be called with invalid item', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).show(3);
            });
            await advanceClock(page, 50);

            await expect(page.locator('#carousel1Item1')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide0')).toHaveClass(/\bactive\b/);
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item1'],
                },
            ]);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                const carousel = UI.Carousel.init(carousel1);
                carousel.show(1);
                carousel.show(1);
                carousel.show(1);
            });
            await advanceClock(page, 50);

            await expect(page.locator('#carousel1Item2')).toHaveClass(/\bactive\b/);
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item2'],
                    active: true,
                },
            ]);
        });
    });

    test.describe('#slide', () => {
        test('slides forwards', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).slide(1);
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item2'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1Item2')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide1')).toHaveClass(/\bactive\b/);
        });

        test('slides forwards (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#carousel1').carousel('slide', 1);
            });
            await advanceClock(page, 150);

            await expect(page.locator('#carousel1Item2')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide1')).toHaveClass(/\bactive\b/);
        });

        test('slides forwards for multiple carousels (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('.carousel').carousel('slide', 1);
            });
            await advanceClock(page, 150);

            await expect(page.locator('#carousel1Item2')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel2Item2')).toHaveClass(/\bactive\b/);
        });

        test('slides backwards', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).slide(-1);
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item3'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1Item3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide2')).toHaveClass(/\bactive\b/);
        });

        test('slides backwards (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#carousel1').carousel('slide', -1);
            });
            await advanceClock(page, 150);

            await expect(page.locator('#carousel1Item3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide2')).toHaveClass(/\bactive\b/);
        });

        test('slides backwards for multiple carousels (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('.carousel').carousel('slide', -1);
            });
            await advanceClock(page, 150);

            await expect(page.locator('#carousel1Item3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel2Item3')).toHaveClass(/\bactive\b/);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                const carousel = UI.Carousel.init(carousel1);
                carousel.slide(1);
                carousel.slide(1);
                carousel.slide(1);
            });
            await advanceClock(page, 50);

            await expect(page.locator('#carousel1Item2')).toHaveClass(/\bactive\b/);
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item2'],
                    active: true,
                },
            ]);
        });

        test('wraps around to first item', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).show(2);
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#carousel1Item3');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).slide(1);
            });
            await advanceClock(page, 150);

            await expect(page.locator('#carousel1Item1')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide0')).toHaveClass(/\bactive\b/);
        });

        test('wraps around to last item', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).slide(-1);
            });
            await advanceClock(page, 150);

            await expect(page.locator('#carousel1Item3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide2')).toHaveClass(/\bactive\b/);
        });
    });

    test.describe('#next', () => {
        test('shows the next item', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).next();
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item2'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1Item2')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide1')).toHaveClass(/\bactive\b/);
        });

        test('shows the next item (data-ui-slide)', async ({ page }) => {
            await page.locator('#carousel1Next').click();
            await advanceClock(page, 150);

            await expect(page.locator('#carousel1Item2')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide1')).toHaveClass(/\bactive\b/);
        });

        test('shows the next item (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#carousel1').carousel('next');
            });
            await advanceClock(page, 150);

            await expect(page.locator('#carousel1Item2')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide1')).toHaveClass(/\bactive\b/);
        });

        test('shows the next item for multiple carousels (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('.carousel').carousel('next');
            });
            await advanceClock(page, 150);

            await expect(page.locator('#carousel1Item2')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel2Item2')).toHaveClass(/\bactive\b/);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                const carousel = UI.Carousel.init(carousel1);
                carousel.next();
                carousel.next();
                carousel.next();
            });
            await advanceClock(page, 50);

            await expect(page.locator('#carousel1Item2')).toHaveClass(/\bactive\b/);
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item2'],
                    active: true,
                },
            ]);
        });
    });

    test.describe('#prev', () => {
        test('shows the previous item', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).prev();
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item3'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1Item3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide2')).toHaveClass(/\bactive\b/);
        });

        test('shows the previous item (data-ui-slide)', async ({ page }) => {
            await page.locator('#carousel1Prev').click();
            await advanceClock(page, 150);

            await expect(page.locator('#carousel1Item3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide2')).toHaveClass(/\bactive\b/);
        });

        test('shows the previous item (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#carousel1').carousel('prev');
            });
            await advanceClock(page, 150);

            await expect(page.locator('#carousel1Item3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide2')).toHaveClass(/\bactive\b/);
        });

        test('shows the previous item for multiple carousels (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('.carousel').carousel('prev');
            });
            await advanceClock(page, 150);

            await expect(page.locator('#carousel1Item3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel2Item3')).toHaveClass(/\bactive\b/);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                const carousel = UI.Carousel.init(carousel1);
                carousel.prev();
                carousel.prev();
                carousel.prev();
            });
            await advanceClock(page, 50);

            await expect(page.locator('#carousel1Item3')).toHaveClass(/\bactive\b/);
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item3'],
                    active: true,
                },
            ]);
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

        test('triggers slid event', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                window.carouselSlidEventTriggered = false;

                $.addEvent(carousel1, 'slid.ui.carousel', (_) => {
                    window.carouselSlidEventTriggered = true;
                });
                UI.Carousel.init(carousel1).cycle();
            });
            await advanceClock(page, 150);

            expect(await page.evaluate((_) => window.carouselSlidEventTriggered)).toBe(true);
            await expect(page.locator('#carousel1Item2')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide1')).toHaveClass(/\bactive\b/);
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
            await advanceClock(page, 150);

            expect(await page.evaluate((_) => window.carouselSlidEventTriggered)).toBe(true);
            await expect(page.locator('#carousel1Item2')).toHaveClass(/\bactive\b/);
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
            await advanceClock(page, 150);

            expect(await page.evaluate((_) => window.carouselSlidEventTriggered)).toBe(true);
            await expect(page.locator('#carousel1Item2')).toHaveClass(/\bactive\b/);
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
            await advanceClock(page, 150);

            expect(await page.evaluate((_) => window.carouselSlidEventTriggered)).toBe(true);
            await expect(page.locator('#carousel1Item2')).toHaveClass(/\bactive\b/);
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
            await advanceClock(page, 150);

            expect(await page.evaluate((_) => window.carouselSlidEventTriggered)).toBe(true);
            await expect(page.locator('#carousel1Item3')).toHaveClass(/\bactive\b/);
        });

        test('can be prevented from sliding', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                $.addEvent(carousel1, 'slide.ui.carousel', (_) => false);
                UI.Carousel.init(carousel1).next();
            });
            await advanceClock(page, 150);

            await expect(page.locator('#carousel1Item1')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Item2')).not.toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide0')).toHaveClass(/\bactive\b/);
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item2'],
                },
            ]);
        });

        test('can be prevented from sliding (prevent default)', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                $.addEvent(carousel1, 'slide.ui.carousel', (event) => {
                    event.preventDefault();
                });
                UI.Carousel.init(carousel1).next();
            });
            await advanceClock(page, 150);

            await expect(page.locator('#carousel1Item1')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Item2')).not.toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide0')).toHaveClass(/\bactive\b/);
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item2'],
                },
            ]);
        });
    });

    test.describe('interval option', () => {
        test('works with interval option', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1, { interval: 300 }).cycle();
            });
            await advanceClock(page, 450);
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item3'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1Item3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide2')).toHaveClass(/\bactive\b/);
        });

        test('works with interval option (data-ui-interval)', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                $.setDataset(carousel1, { uiInterval: 300 });
                UI.Carousel.init(carousel1).cycle();
            });
            await advanceClock(page, 450);
            await expect(page.locator('#carousel1')).toHaveAttribute('data-ui-interval', '300');
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item3'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1Item3')).toHaveClass(/\bactive\b/);
        });

        test('works with interval option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#carousel1')
                    .carousel({ interval: 300 })
                    .cycle();
            });
            await advanceClock(page, 450);
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item3'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1Item3')).toHaveClass(/\bactive\b/);
        });
    });

    test.describe('transition option', () => {
        test('works with transition option', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1, { transition: 200 }).cycle();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item2'],
                    progress: 0.875,
                },
            ]);
        });

        test('works with transition option (data-ui-transition)', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                $.setDataset(carousel1, { uiTransition: 200 });
                UI.Carousel.init(carousel1).cycle();
            });
            await advanceClock(page, 150);

            await expect(page.locator('#carousel1')).toHaveAttribute('data-ui-transition', '200');
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item2'],
                    progress: 0.875,
                },
            ]);
        });

        test('works with transition option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#carousel1')
                    .carousel({ transition: 200 })
                    .cycle();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item2'],
                    progress: 0.875,
                },
            ]);
        });
    });

    test.describe('keyboard option', () => {
        test('shows the next item on right arrow', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1);
            });
            await page.locator('#carousel1').dispatchEvent('keydown', { code: 'ArrowRight' });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item2'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1Item2')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide1')).toHaveClass(/\bactive\b/);
        });

        test('shows the previous item on left arrow', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).show(2);
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#carousel1Item3');
            });
            await advanceClock(page, 50);
            await page.locator('#carousel1').dispatchEvent('keydown', { code: 'ArrowLeft' });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item2'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1Item2')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide1')).toHaveClass(/\bactive\b/);
        });

        test('works with keyboard option and next', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1, { keyboard: false });
            });
            await page.locator('#carousel1').dispatchEvent('keydown', { code: 'ArrowRight' });
            await advanceClock(page, 150);

            await expect(page.locator('#carousel1Item1')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide0')).toHaveClass(/\bactive\b/);
        });

        test('works with keyboard option and prev', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1, { keyboard: false });
            });
            await page.locator('#carousel1').dispatchEvent('keydown', { code: 'ArrowLeft' });
            await advanceClock(page, 150);

            await expect(page.locator('#carousel1Item1')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide0')).toHaveClass(/\bactive\b/);
        });

        test('works with keyboard option and next (data-ui-keyboard)', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                $.setDataset(carousel1, { uiKeyboard: false });
                UI.Carousel.init(carousel1);
            });
            await page.locator('#carousel1').dispatchEvent('keydown', { code: 'ArrowRight' });
            await advanceClock(page, 150);

            await expect(page.locator('#carousel1')).toHaveAttribute('data-ui-keyboard', 'false');
            await expect(page.locator('#carousel1Item1')).toHaveClass(/\bactive\b/);
        });

        test('works with keyboard option and prev (data-ui-keyboard)', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                $.setDataset(carousel1, { uiKeyboard: false });
                UI.Carousel.init(carousel1);
            });
            await page.locator('#carousel1').dispatchEvent('keydown', { code: 'ArrowLeft' });
            await advanceClock(page, 150);

            await expect(page.locator('#carousel1')).toHaveAttribute('data-ui-keyboard', 'false');
            await expect(page.locator('#carousel1Item1')).toHaveClass(/\bactive\b/);
        });

        test('works with keyboard option and next (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#carousel1').carousel({ keyboard: false });
            });
            await page.locator('#carousel1').dispatchEvent('keydown', { code: 'ArrowRight' });
            await advanceClock(page, 150);

            await expect(page.locator('#carousel1Item1')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide0')).toHaveClass(/\bactive\b/);
        });

        test('works with keyboard option and prev (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#carousel1').carousel({ keyboard: false });
            });
            await page.locator('#carousel1').dispatchEvent('keydown', { code: 'ArrowLeft' });
            await advanceClock(page, 150);

            await expect(page.locator('#carousel1Item1')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide0')).toHaveClass(/\bactive\b/);
        });
    });

    test.describe('pause option', () => {
        test('pauses on mouseenter', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).cycle();
            });
            await advanceClock(page, 200);
            await page.locator('#carousel1').dispatchEvent('mouseenter');
            await advanceClock(page, 500);

            await expect(page.locator('#carousel1Item2')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Item3')).not.toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide1')).toHaveClass(/\bactive\b/);
        });

        test('resumes on mouseleave', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).cycle();
            });
            await advanceClock(page, 200);
            await page.locator('#carousel1').dispatchEvent('mouseenter');
            await advanceClock(page, 50);
            await page.locator('#carousel1').dispatchEvent('mouseleave');
            await advanceClock(page, 200);
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item3'],
                    active: true,
                },
            ]);
            await advanceClock(page, 150);

            await expect(page.locator('#carousel1Item3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide2')).toHaveClass(/\bactive\b/);
        });

        test('works with pause option', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1, { pause: false }).cycle();
            });
            await advanceClock(page, 200);
            await page.locator('#carousel1').dispatchEvent('mouseenter');
            await advanceClock(page, 150);
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item3'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1Item3')).toHaveClass(/\bactive\b/);
        });

        test('works with pause option (data-ui-pause)', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                $.setDataset(carousel1, { uiPause: false });
                UI.Carousel.init(carousel1).cycle();
            });
            await advanceClock(page, 200);
            await page.locator('#carousel1').dispatchEvent('mouseenter');
            await advanceClock(page, 150);
            await expect(page.locator('#carousel1')).toHaveAttribute('data-ui-pause', 'false');
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item3'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1Item3')).toHaveClass(/\bactive\b/);
        });

        test('works with pause option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#carousel1')
                    .carousel({ pause: false })
                    .cycle();
            });
            await advanceClock(page, 200);
            await page.locator('#carousel1').dispatchEvent('mouseenter');
            await advanceClock(page, 150);
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item3'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1Item3')).toHaveClass(/\bactive\b/);
        });
    });

    test.describe('wrap option', () => {
        test('wraps around to first item', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).show(2);
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#carousel1Item3');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).next();
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item1'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1Item1')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide0')).toHaveClass(/\bactive\b/);
        });

        test('wraps around to last item', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).prev();
            });
            await advanceClock(page, 150);

            await expect(page.locator('#carousel1Item3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide2')).toHaveClass(/\bactive\b/);
        });

        test('works with wrap option and next', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1, { wrap: false }).show(2);
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#carousel1Item3');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).next();
            });
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1Item3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide2')).toHaveClass(/\bactive\b/);
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item3'],
                },
            ]);
        });

        test('works with wrap option and prev', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1, { wrap: false }).prev();
            });
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1Item1')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide0')).toHaveClass(/\bactive\b/);
        });

        test('works with wrap option and next (data-ui-wrap)', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                $.setDataset(carousel1, { uiWrap: false });
                UI.Carousel.init(carousel1).show(2);
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#carousel1Item3');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).next();
            });
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1')).toHaveAttribute('data-ui-wrap', 'false');
            await expect(page.locator('#carousel1Item3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide2')).toHaveClass(/\bactive\b/);
        });

        test('works with wrap option and prev (data-ui-wrap)', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                $.setDataset(carousel1, { uiWrap: false });
                UI.Carousel.init(carousel1).prev();
            });
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1')).toHaveAttribute('data-ui-wrap', 'false');
            await expect(page.locator('#carousel1Item1')).toHaveClass(/\bactive\b/);
        });

        test('works with wrap option and next (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#carousel1')
                    .carousel({ wrap: false })
                    .show(2);
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#carousel1Item3');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $('#carousel1').carousel('next');
            });
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1Item3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide2')).toHaveClass(/\bactive\b/);
        });

        test('works with wrap option and prev (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#carousel1')
                    .carousel({ wrap: false })
                    .prev();
            });
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1Item1')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide0')).toHaveClass(/\bactive\b/);
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
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1')).toHaveAttribute('data-ui-sliding', 'true');
            await expect(page.locator('#carousel1Item1')).toHaveClass(/\bactive\b/);
            await expectStyles(page, [
                {
                    selectors: ['#carousel1Item1'],
                    styles: { transform: 'translateX(-25%)' },
                },
                {
                    selectors: ['#carousel1Item2'],
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
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1')).toHaveAttribute('data-ui-sliding', 'true');
            await expect(page.locator('#carousel1Item1')).toHaveClass(/\bactive\b/);
            await expectStyles(page, [
                {
                    selectors: ['#carousel1Item1'],
                    styles: { transform: 'translateX(25%)' },
                },
                {
                    selectors: ['#carousel1Item3'],
                    styles: {
                        display: 'block',
                        transform: 'translateX(-75%)',
                    },
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
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1')).not.toHaveAttribute('data-ui-sliding');
            await expect(page.locator('#carousel1Item1')).toHaveClass(/\bactive\b/);
            await expectStyles(page, [
                {
                    selectors: ['#carousel1Item1', '#carousel1Item3'],
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
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1')).toHaveAttribute('data-ui-swipe', 'false');
            await expect(page.locator('#carousel1')).not.toHaveAttribute('data-ui-sliding');
            await expect(page.locator('#carousel1Item1')).toHaveClass(/\bactive\b/);
        });

        test('works with swipe option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#carousel1').carousel({ swipe: false });
                const carousel1 = $.findOne('#carousel1');
                carousel1.dispatchEvent(new MouseEvent('mousedown', { clientX: 400 }));
                window.dispatchEvent(new MouseEvent('mousemove', { clientX: 500 }));
            });
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1')).not.toHaveAttribute('data-ui-sliding');
            await expect(page.locator('#carousel1Item1')).toHaveClass(/\bactive\b/);
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
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1')).toHaveAttribute('data-ui-sliding', 'true');
            await expectStyles(page, [
                {
                    selectors: ['#carousel1Item1'],
                    styles: { transform: 'translateX(-25%)' },
                },
                {
                    selectors: ['#carousel1Item2'],
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
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#carousel1Item3');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                carousel1.dispatchEvent(new MouseEvent('mousedown', { clientX: 400 }));
                window.dispatchEvent(new MouseEvent('mousemove', { clientX: 300 }));
            });
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1')).toHaveAttribute('data-ui-sliding', 'true');
            await expect(page.locator('#carousel1Item3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide2')).toHaveClass(/\bactive\b/);
            await expectStyles(page, [
                {
                    selectors: ['#carousel1Item3'],
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
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1')).toHaveAttribute('data-ui-sliding', 'true');
            await expect(page.locator('#carousel1Item1')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide0')).toHaveClass(/\bactive\b/);
            await expectStyles(page, [
                {
                    selectors: ['#carousel1Item1'],
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
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                window.dispatchEvent(new MouseEvent('mouseup'));
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item2'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1')).not.toHaveAttribute('data-ui-sliding');
            await expect(page.locator('#carousel1Item2')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide1')).toHaveClass(/\bactive\b/);
        });

        test('pauses while swiping', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1);
                carousel1.dispatchEvent(new MouseEvent('mousedown', { clientX: 400 }));
                window.dispatchEvent(new MouseEvent('mousemove', { clientX: 300 }));
            });
            await advanceClock(page, 500);

            await expect(page.locator('#carousel1')).toHaveAttribute('data-ui-sliding', 'true');
            await expect(page.locator('#carousel1Item1')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide0')).toHaveClass(/\bactive\b/);
            await expectStyles(page, [
                {
                    selectors: ['#carousel1Item1'],
                    styles: { transform: 'translateX(-25%)' },
                },
                {
                    selectors: ['#carousel1Item2'],
                    styles: {
                        display: 'block',
                        transform: 'translateX(75%)',
                    },
                },
            ]);
        });
    });

    test.describe('cycle', () => {
        test('starts cycling (cycle)', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).cycle();
            });
            await advanceClock(page, 350);
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item3'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1Item3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide2')).toHaveClass(/\bactive\b/);
        });

        test('starts cycling (show)', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).show(1);
            });
            await advanceClock(page, 350);
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item3'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1Item3')).toHaveClass(/\bactive\b/);
        });

        test('starts cycling (slide)', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).slide(1);
            });
            await advanceClock(page, 350);
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item3'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1Item3')).toHaveClass(/\bactive\b/);
        });

        test('starts cycling (next)', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).next();
            });
            await advanceClock(page, 350);
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item3'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1Item3')).toHaveClass(/\bactive\b/);
        });

        test('starts cycling (prev)', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).prev();
            });
            await advanceClock(page, 350);
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item1'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1Item1')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide0')).toHaveClass(/\bactive\b/);
        });

        test('starts cycling (swipe)', async ({ page }) => {
            await page.evaluate((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1);
                carousel1.dispatchEvent(new MouseEvent('mousedown', { clientX: 400 }));
                window.dispatchEvent(new MouseEvent('mousemove', { clientX: 250 }));
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                window.dispatchEvent(new MouseEvent('mouseup'));
                const carousel1 = $.findOne('#carousel1');
                carousel1.dispatchEvent(new MouseEvent('mouseleave'));
            });
            await advanceClock(page, 350);
            await expectAnimationState(page, [
                {
                    selectors: ['#carousel1Item3'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#carousel1Item3')).toHaveClass(/\bactive\b/);
            await expect(page.locator('#carousel1Slide2')).toHaveClass(/\bactive\b/);
        });
    });
});
