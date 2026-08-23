import { expect, test } from '@playwright/test';
import { advanceClock, resetPage, setupClock } from '../../setup/browser.js';
import { expectAnimationState } from '../../support/assertions/animation.js';
import { expectStyles } from '../../support/assertions/styles.js';
import { measureScrollbarSize } from '../../support/measurements/scrollbar.js';

test.beforeEach(async ({ page }) => {
    await setupClock(page);
    await resetPage(page);
});

test.describe('Offcanvas', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas1" type="button"></button>' +
                '<button class="btn btn-secondary" id="offcanvasToggle2" data-ui-toggle="offcanvas" data-ui-target="#offcanvas2" type="button"></button>' +
                '<div class="offcanvas offcanvas-start" id="offcanvas1">' +
                '<button class="btn-close" id="button1" data-ui-dismiss="offcanvas" type="button"></button>' +
                '</div>' +
                '<div class="offcanvas offcanvas-start" id="offcanvas2">' +
                '<button class="btn-close" id="button2" data-ui-dismiss="offcanvas" type="button"></button>' +
                '</div>';
        });
    });

    test.describe('#init', () => {
        test('creates an offcanvas', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                return UI.Offcanvas.init(offcanvas1) instanceof UI.Offcanvas;
            })).toBe(true);
        });

        test('creates an offcanvas (data-ui-toggle)', async ({ page }) => {
            await page.locator('#offcanvasToggle1').click();

            expect(await page.evaluate((_) =>
                $.getData('#offcanvas1', 'offcanvas') instanceof UI.Offcanvas)).toBe(true);
        });

        test('creates an offcanvas (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('#offcanvas1').offcanvas();
                return $.getData('#offcanvas1', 'offcanvas') instanceof UI.Offcanvas;
            })).toBe(true);
        });

        test('returns the offcanvas (query)', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $('#offcanvas1').offcanvas() instanceof UI.Offcanvas)).toBe(true);
        });
    });

    test.describe('#dispose', () => {
        test('removes the offcanvas', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).dispose();
                return $.hasData(offcanvas1, 'offcanvas');
            })).toBe(false);
        });

        test('removes the offcanvas (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('#offcanvas1').offcanvas('dispose');
                return $.hasData('#offcanvas1', 'offcanvas');
            })).toBe(false);
        });
    });

    test.describe('#show', () => {
        test('shows the offcanvas', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await advanceClock(page, 125);
            await expectAnimationState(page, [
                {
                    selectors: ['#offcanvas1'],
                    active: true,
                },
            ]);
            await advanceClock(page, 175);

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start show');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('style', '');
            await expect(page.locator('#offcanvas2')).toHaveClass('offcanvas offcanvas-start');
            await expect(page.locator('body')).toHaveClass('offcanvas-backdrop');
            await expectStyles(page, [
                {
                    selectors: ['body'],
                    styles: { overflow: 'hidden' },
                },
            ]);
        });

        test('shows the offcanvas (data-ui-toggle)', async ({ page }) => {
            await page.locator('#offcanvasToggle1').click();
            await advanceClock(page, 125);
            await expectAnimationState(page, [
                {
                    selectors: ['#offcanvas1'],
                    active: true,
                },
            ]);
            await advanceClock(page, 175);

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start show');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('style', '');
            await expect(page.locator('#offcanvas2')).toHaveClass('offcanvas offcanvas-start');
        });

        test('shows the offcanvas (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#offcanvas1').offcanvas('show');
            });
            await advanceClock(page, 125);
            await expectAnimationState(page, [
                {
                    selectors: ['#offcanvas1'],
                    active: true,
                },
            ]);
            await advanceClock(page, 175);

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start show');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('style', '');
            await expect(page.locator('#offcanvas2')).toHaveClass('offcanvas offcanvas-start');
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                const offcanvas = UI.Offcanvas.init(offcanvas1);
                offcanvas.show();
                offcanvas.show();
                offcanvas.show();
            });
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['#offcanvas1'],
                    active: true,
                },
            ]);
        });

        test('can be called on shown offcanvas', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#offcanvas1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start show');
            await expectAnimationState(page, [
                {
                    selectors: ['#offcanvas1'],
                },
            ]);
        });
    });

    test.describe('#hide', () => {
        test('hides the offcanvas', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#offcanvas1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).hide();
            });
            await advanceClock(page, 125);
            await expectAnimationState(page, [
                {
                    selectors: ['#offcanvas1'],
                    active: true,
                },
            ]);
            await advanceClock(page, 175);

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'false');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('style', '');
            await expect(page.locator('#offcanvas2')).toHaveClass('offcanvas offcanvas-start');
            await expect(page.locator('body')).not.toHaveClass('offcanvas-backdrop');
            await expectStyles(page, [
                {
                    selectors: ['body'],
                    styles: { overflow: '' },
                },
            ]);
        });

        test('hides the offcanvas (data-ui-dismiss)', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#offcanvas1');
            });
            await advanceClock(page, 50);
            await page.locator('#button1').click();
            await advanceClock(page, 125);
            await expectAnimationState(page, [
                {
                    selectors: ['#offcanvas1'],
                    active: true,
                },
            ]);
            await advanceClock(page, 175);

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'false');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('style', '');
            await expect(page.locator('#offcanvas2')).toHaveClass('offcanvas offcanvas-start');
        });

        test('hides the offcanvas (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#offcanvas1').offcanvas('show');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#offcanvas1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $('#offcanvas1').offcanvas('hide');
            });
            await advanceClock(page, 125);
            await expectAnimationState(page, [
                {
                    selectors: ['#offcanvas1'],
                    active: true,
                },
            ]);
            await advanceClock(page, 175);

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'false');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('style', '');
            await expect(page.locator('#offcanvas2')).toHaveClass('offcanvas offcanvas-start');
        });

        test('does not remove the offcanvas after hiding', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#offcanvas1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).hide();
            });
            await advanceClock(page, 300);

            expect(await page.evaluate((_) =>
                $.getData('#offcanvas1', 'offcanvas') instanceof UI.Offcanvas)).toBe(true);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#offcanvas1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                const offcanvas = UI.Offcanvas.init(offcanvas1);
                offcanvas.hide();
                offcanvas.hide();
                offcanvas.hide();
            });
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['#offcanvas1'],
                    active: true,
                },
            ]);
        });

        test('can be called on hidden offcanvas', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).hide();
            });

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start');
            await expect(page.locator('#offcanvas1')).not.toHaveAttribute('style');
            await expectAnimationState(page, [
                {
                    selectors: ['#offcanvas1'],
                },
            ]);
        });
    });

    test.describe('#toggle (show)', () => {
        test('shows the offcanvas', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).toggle();
            });
            await advanceClock(page, 125);
            await expectAnimationState(page, [
                {
                    selectors: ['#offcanvas1'],
                    active: true,
                },
            ]);
            await advanceClock(page, 175);

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start show');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('style', '');
            await expect(page.locator('#offcanvas2')).toHaveClass('offcanvas offcanvas-start');
        });

        test('shows the offcanvas (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#offcanvas1').offcanvas('toggle');
            });
            await advanceClock(page, 125);
            await expectAnimationState(page, [
                {
                    selectors: ['#offcanvas1'],
                    active: true,
                },
            ]);
            await advanceClock(page, 175);

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start show');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('style', '');
            await expect(page.locator('#offcanvas2')).toHaveClass('offcanvas offcanvas-start');
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                const offcanvas = UI.Offcanvas.init(offcanvas1);
                offcanvas.toggle();
                offcanvas.toggle();
                offcanvas.toggle();
            });
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['#offcanvas1'],
                    active: true,
                },
            ]);
        });
    });

    test.describe('#toggle (hide)', () => {
        test('hides the offcanvas', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#offcanvas1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).toggle();
            });
            await advanceClock(page, 125);
            await expectAnimationState(page, [
                {
                    selectors: ['#offcanvas1'],
                    active: true,
                },
            ]);
            await advanceClock(page, 175);

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'false');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('style', '');
            await expect(page.locator('#offcanvas2')).toHaveClass('offcanvas offcanvas-start');
        });

        test('hides the offcanvas (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#offcanvas1').offcanvas('show');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#offcanvas1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $('#offcanvas1').offcanvas('toggle');
            });
            await advanceClock(page, 125);
            await expectAnimationState(page, [
                {
                    selectors: ['#offcanvas1'],
                    active: true,
                },
            ]);
            await advanceClock(page, 175);

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'false');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('style', '');
            await expect(page.locator('#offcanvas2')).toHaveClass('offcanvas offcanvas-start');
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#offcanvas1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                const offcanvas = UI.Offcanvas.init(offcanvas1);
                offcanvas.toggle();
                offcanvas.toggle();
                offcanvas.toggle();
            });
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['#offcanvas1'],
                    active: true,
                },
            ]);
        });
    });

    test.describe('events', () => {
        test('triggers show event', async ({ page }) => {
            const eventTriggered = await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                let triggered = false;

                $.addEvent(offcanvas1, 'show.ui.offcanvas', (_) => {
                    triggered = true;
                });
                UI.Offcanvas.init(offcanvas1).show();

                return triggered;
            });

            expect(eventTriggered).toBe(true);
        });

        test('triggers shown event', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                window.offcanvasShownEventTriggered = false;

                $.addEvent(offcanvas1, 'shown.ui.offcanvas', (_) => {
                    window.offcanvasShownEventTriggered = true;
                });
                UI.Offcanvas.init(offcanvas1).show();
            });
            await advanceClock(page, 300);

            expect(await page.evaluate((_) => window.offcanvasShownEventTriggered)).toBe(true);
            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start show');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'true');
        });

        test('triggers hide event', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#offcanvas1');
            });
            await advanceClock(page, 50);
            const eventTriggered = await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                let triggered = false;

                $.addEvent(offcanvas1, 'hide.ui.offcanvas', (_) => {
                    triggered = true;
                });
                UI.Offcanvas.init(offcanvas1).hide();

                return triggered;
            });

            expect(eventTriggered).toBe(true);
        });

        test('triggers hidden event', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#offcanvas1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                window.offcanvasHiddenEventTriggered = false;

                $.addEvent(offcanvas1, 'hidden.ui.offcanvas', (_) => {
                    window.offcanvasHiddenEventTriggered = true;
                });
                UI.Offcanvas.init(offcanvas1).hide();
            });
            await advanceClock(page, 300);

            expect(await page.evaluate((_) => window.offcanvasHiddenEventTriggered)).toBe(true);
            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'false');
        });

        test('triggers show event (toggle)', async ({ page }) => {
            const eventTriggered = await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                let triggered = false;

                $.addEvent(offcanvas1, 'show.ui.offcanvas', (_) => {
                    triggered = true;
                });
                UI.Offcanvas.init(offcanvas1).toggle();

                return triggered;
            });

            expect(eventTriggered).toBe(true);
        });

        test('triggers shown event (toggle)', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                window.offcanvasShownEventTriggered = false;

                $.addEvent(offcanvas1, 'shown.ui.offcanvas', (_) => {
                    window.offcanvasShownEventTriggered = true;
                });
                UI.Offcanvas.init(offcanvas1).toggle();
            });
            await advanceClock(page, 300);

            expect(await page.evaluate((_) => window.offcanvasShownEventTriggered)).toBe(true);
            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start show');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'true');
        });

        test('triggers hide event (toggle)', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#offcanvas1');
            });
            await advanceClock(page, 50);
            const eventTriggered = await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                let triggered = false;

                $.addEvent(offcanvas1, 'hide.ui.offcanvas', (_) => {
                    triggered = true;
                });
                UI.Offcanvas.init(offcanvas1).toggle();

                return triggered;
            });

            expect(eventTriggered).toBe(true);
        });

        test('triggers hidden event (toggle)', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#offcanvas1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                window.offcanvasHiddenEventTriggered = false;

                $.addEvent(offcanvas1, 'hidden.ui.offcanvas', (_) => {
                    window.offcanvasHiddenEventTriggered = true;
                });
                UI.Offcanvas.init(offcanvas1).toggle();
            });
            await advanceClock(page, 300);

            expect(await page.evaluate((_) => window.offcanvasHiddenEventTriggered)).toBe(true);
            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'false');
        });

        test('can be prevented from showing', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                $.addEvent(offcanvas1, 'show.ui.offcanvas', (_) => false);
                UI.Offcanvas.init(offcanvas1).show();
            });
            await advanceClock(page, 300);

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start');
            await expect(page.locator('#offcanvas1')).not.toHaveAttribute('aria-hidden');
            await expect(page.locator('#offcanvas1')).not.toHaveAttribute('aria-modal');
            await expect(page.locator('body')).not.toHaveClass('offcanvas-backdrop');
            await expectAnimationState(page, [
                {
                    selectors: ['#offcanvas1'],
                },
            ]);
        });

        test('can be prevented from showing (prevent default)', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                $.addEvent(offcanvas1, 'show.ui.offcanvas', (event) => {
                    event.preventDefault();
                });
                UI.Offcanvas.init(offcanvas1).show();
            });
            await advanceClock(page, 300);

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start');
            await expect(page.locator('#offcanvas1')).not.toHaveAttribute('aria-hidden');
            await expect(page.locator('#offcanvas1')).not.toHaveAttribute('aria-modal');
            await expect(page.locator('body')).not.toHaveClass('offcanvas-backdrop');
            await expectAnimationState(page, [
                {
                    selectors: ['#offcanvas1'],
                },
            ]);
        });

        test('can be prevented from hiding', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#offcanvas1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                $.addEvent(offcanvas1, 'hide.ui.offcanvas', (_) => false);
                UI.Offcanvas.init(offcanvas1).hide();
            });
            await advanceClock(page, 300);

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start show');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('body')).toHaveClass('offcanvas-backdrop');
            await expectAnimationState(page, [
                {
                    selectors: ['#offcanvas1'],
                },
            ]);
        });
    });

    test.describe('duration option', () => {
        test('works with duration option on show', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1, { duration: 200 }).show();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#offcanvas1'],
                    progress: 0.875,
                },
            ]);
        });

        test('works with duration option on show (data-ui-duration)', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                $.setDataset(offcanvas1, { uiDuration: 200 });
                UI.Offcanvas.init(offcanvas1).show();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#offcanvas1'],
                    progress: 0.875,
                },
            ]);
        });

        test('works with duration option on show (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#offcanvas1')
                    .offcanvas({ duration: 200 })
                    .show();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#offcanvas1'],
                    progress: 0.875,
                },
            ]);
        });

        test('works with duration option on hide', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1, { duration: 200 }).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#offcanvas1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).hide();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#offcanvas1'],
                    progress: 0.875,
                },
            ]);
        });

        test('works with duration option on hide (data-ui-duration)', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                $.setDataset(offcanvas1, { uiDuration: 200 });
                UI.Offcanvas.init(offcanvas1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#offcanvas1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).hide();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#offcanvas1'],
                    progress: 0.875,
                },
            ]);
        });

        test('works with duration option on hide (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#offcanvas1')
                    .offcanvas({ duration: 200 })
                    .show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#offcanvas1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $('#offcanvas1').offcanvas('hide');
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#offcanvas1'],
                    progress: 0.875,
                },
            ]);
        });
    });

    test.describe('keyboard option', () => {
        test('hides the offcanvas on escape', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#offcanvas1');
            });
            await advanceClock(page, 50);
            await page.keyboard.press('Escape');
            await advanceClock(page, 125);
            await expectAnimationState(page, [
                {
                    selectors: ['#offcanvas1'],
                    active: true,
                },
            ]);
            await advanceClock(page, 175);

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'false');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('style', '');
            await expect(page.locator('#offcanvas2')).toHaveClass('offcanvas offcanvas-start');
        });

        test('works with keyboard option', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1, { keyboard: false }).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#offcanvas1');
            });
            await advanceClock(page, 50);
            await page.keyboard.press('Escape');
            await advanceClock(page, 300);

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start show');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('style', '');
            await expect(page.locator('#offcanvas2')).toHaveClass('offcanvas offcanvas-start');
            await expectAnimationState(page, [
                {
                    selectors: ['#offcanvas1'],
                },
            ]);
        });

        test('works with keyboard option (data-ui-keyboard)', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                $.setDataset(offcanvas1, { uiKeyboard: false });
                UI.Offcanvas.init(offcanvas1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#offcanvas1');
            });
            await advanceClock(page, 50);
            await page.keyboard.press('Escape');
            await advanceClock(page, 300);

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start show');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('data-ui-keyboard', 'false');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('style', '');
            await expect(page.locator('#offcanvas2')).toHaveClass('offcanvas offcanvas-start');
            await expectAnimationState(page, [
                {
                    selectors: ['#offcanvas1'],
                },
            ]);
        });

        test('works with keyboard option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#offcanvas1')
                    .offcanvas({ keyboard: false })
                    .show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#offcanvas1');
            });
            await advanceClock(page, 50);
            await page.keyboard.press('Escape');
            await advanceClock(page, 300);

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start show');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('style', '');
            await expect(page.locator('#offcanvas2')).toHaveClass('offcanvas offcanvas-start');
            await expectAnimationState(page, [
                {
                    selectors: ['#offcanvas1'],
                },
            ]);
        });
    });

    test.describe('backdrop option', () => {
        test('adds backdrop to document body', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await advanceClock(page, 50);

            await expect(page.locator('body')).toHaveClass('offcanvas-backdrop');
        });

        test('works with backdrop option', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1, { backdrop: false }).show();
            });
            await advanceClock(page, 50);

            await expect(page.locator('body')).not.toHaveClass('offcanvas-backdrop');
        });

        test('works with backdrop option (data-ui-backdrop)', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                $.setDataset(offcanvas1, { uiBackdrop: false });
                UI.Offcanvas.init(offcanvas1).show();
            });
            await advanceClock(page, 50);

            await expect(page.locator('body')).not.toHaveClass('offcanvas-backdrop');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('data-ui-backdrop', 'false');
        });

        test('works with backdrop option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#offcanvas1')
                    .offcanvas({ backdrop: false })
                    .show();
            });
            await advanceClock(page, 50);

            await expect(page.locator('body')).not.toHaveClass('offcanvas-backdrop');
        });

        test('hides the offcanvas on document click (with backdrop)', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#offcanvas1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.click(document.body);
            });
            await advanceClock(page, 125);
            await expectAnimationState(page, [
                {
                    selectors: ['#offcanvas1'],
                    active: true,
                },
            ]);
            await advanceClock(page, 175);

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'false');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('style', '');
            await expect(page.locator('#offcanvas2')).toHaveClass('offcanvas offcanvas-start');
        });

        test('does not hide the offcanvas on document click (without backdrop)', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1, { backdrop: false }).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#offcanvas1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.click(document.body);
            });
            await advanceClock(page, 300);

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start show');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('style', '');
            await expect(page.locator('#offcanvas2')).toHaveClass('offcanvas offcanvas-start');
            await expectAnimationState(page, [
                {
                    selectors: ['#offcanvas1'],
                },
            ]);
        });

        test('does not hide the offcanvas on document click (mousedown on offcanvas)', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#offcanvas1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.triggerEvent('#offcanvas1', 'mousedown');
                $.click(document.body);
            });
            await advanceClock(page, 300);

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start show');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('style', '');
            await expect(page.locator('#offcanvas2')).toHaveClass('offcanvas offcanvas-start');
            await expectAnimationState(page, [
                {
                    selectors: ['#offcanvas1'],
                },
            ]);
        });

        test('hides the offcanvas on offcanvas click (mousedown on backdrop)', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.triggerEvent(document.body, 'mousedown');
                $.stop('#offcanvas1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.click('#offcanvas1');
            });
            await advanceClock(page, 125);
            await expectAnimationState(page, [
                {
                    selectors: ['#offcanvas1'],
                    active: true,
                },
            ]);
            await advanceClock(page, 175);

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'false');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('style', '');
            await expect(page.locator('#offcanvas2')).toHaveClass('offcanvas offcanvas-start');
        });
    });

    test.describe('scroll option', () => {
        test('prevents scroll on document body', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await advanceClock(page, 50);

            await expectStyles(page, [
                {
                    selectors: ['body'],
                    styles: { overflow: 'hidden' },
                },
            ]);
        });

        test('works with scroll option', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1, { scroll: true }).show();
            });
            await advanceClock(page, 50);

            await expectStyles(page, [
                {
                    selectors: ['body'],
                    styles: { overflow: '' },
                },
            ]);
        });

        test('works with scroll option (data-ui-scroll)', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                $.setDataset(offcanvas1, { uiScroll: true });
                UI.Offcanvas.init(offcanvas1).show();
            });
            await advanceClock(page, 50);

            await expectStyles(page, [
                {
                    selectors: ['body'],
                    styles: { overflow: '' },
                },
            ]);
            await expect(page.locator('#offcanvas1')).toHaveAttribute('data-ui-scroll', 'true');
        });

        test('works with scroll option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#offcanvas1')
                    .offcanvas({ scroll: true })
                    .show();
            });
            await advanceClock(page, 50);

            await expectStyles(page, [
                {
                    selectors: ['body'],
                    styles: { overflow: '' },
                },
            ]);
        });
    });

    test.describe('scroll padding', () => {
        test('adds scroll padding to document body', async ({ page }) => {
            const scrollbarSize = await measureScrollbarSize(page);
            const paddingRight = scrollbarSize ?
                `${scrollbarSize}px` :
                '';

            await page.evaluate((_) => {
                $.setStyle(document.body, { height: '2000px' });
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#offcanvas1');
            });
            await advanceClock(page, 50);

            await expectStyles(page, [
                {
                    selectors: ['body'],
                    styles: { paddingRight },
                },
            ]);
        });

        test('does not add padding if scrollbars are hidden', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#offcanvas1');
            });
            await advanceClock(page, 50);

            await expectStyles(page, [
                {
                    selectors: ['body'],
                    styles: { paddingRight: '' },
                },
            ]);
        });

        test('works with existing padding', async ({ page }) => {
            const scrollbarSize = await measureScrollbarSize(page);

            await page.evaluate((_) => {
                $.setStyle(document.body, {
                    height: '2000px',
                    paddingRight: '10px',
                });
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#offcanvas1');
            });
            await advanceClock(page, 50);

            await expectStyles(page, [
                {
                    selectors: ['body'],
                    styles: { paddingRight: `${scrollbarSize + 10}px` },
                },
            ]);
        });

        test('restores scroll padding to document body', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle(document.body, { height: '2000px' });
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#offcanvas1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).hide();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#offcanvas1');
            });
            await advanceClock(page, 50);

            await expectStyles(page, [
                {
                    selectors: ['body'],
                    styles: { paddingRight: '' },
                },
            ]);
        });

        test('restores existing scroll padding to document body', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle(document.body, {
                    height: '2000px',
                    paddingRight: '10px',
                });
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#offcanvas1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).hide();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#offcanvas1');
            });
            await advanceClock(page, 50);

            await expectStyles(page, [
                {
                    selectors: ['body'],
                    styles: { paddingRight: '10px' },
                },
            ]);
        });
    });
});
