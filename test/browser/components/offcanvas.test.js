import { expect, test } from '#test';
import { advanceClock } from '../../setup/browser.js';
import { expectStyles } from '../../support/assertions/styles.js';
import { measureScrollbarSize } from '../../support/measurements/scrollbar.js';

test.use({ reducedMotion: 'no-preference' });

test.describe('Offcanvas', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate(() => {
            document.body.innerHTML =
                '<button class="btn btn-secondary" id="offcanvas-toggle-1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas1" type="button"></button>' +
                '<button class="btn btn-secondary" id="offcanvas-toggle-2" data-ui-toggle="offcanvas" data-ui-target="#offcanvas2" type="button"></button>' +
                '<div class="offcanvas offcanvas-start" id="offcanvas1">' +
                '<button class="btn-close" id="button1" data-ui-dismiss="offcanvas" type="button"></button>' +
                '</div>' +
                '<div class="offcanvas offcanvas-start" id="offcanvas2">' +
                '<button class="btn-close" id="button2" data-ui-dismiss="offcanvas" type="button"></button>' +
                '</div>';
        });
    });

    test.describe('#init', () => {
        for (const { name, init } of [
            {
                name: 'class',
                init: (selector) => UI.Offcanvas.init(document.querySelector(selector)),
            },
            {
                name: 'QuerySet',
                init: (selector) => $(selector).offcanvas(),
            },
        ]) {
            test(`creates an offcanvas (${name})`, async ({ page }) => {
                const instance = await page.evaluateHandle(init, '#offcanvas1');

                expect(await instance.evaluate((value) => value instanceof UI.Offcanvas)).toBe(true);
                expect(await page.evaluate(() =>
                    $.getData('#offcanvas1', 'offcanvas') instanceof UI.Offcanvas)).toBe(true);
            });
        }

        test('creates an offcanvas (data-ui-toggle)', async ({ page }) => {
            await page.locator('#offcanvas-toggle-1').click();

            expect(await page.evaluate(() =>
                $.getData('#offcanvas1', 'offcanvas') instanceof UI.Offcanvas)).toBe(true);
        });
    });

    test.describe('#dispose', () => {
        test.use({ mockClock: true });

        for (const { name, dispose } of [
            {
                name: 'class',
                dispose: (selector) => {
                    UI.Offcanvas.init(document.querySelector(selector)).dispose();
                },
            },
            {
                name: 'QuerySet',
                dispose: (selector) => {
                    $(selector).offcanvas('dispose');
                },
            },
        ]) {
            test(`removes the offcanvas (${name})`, async ({ page }) => {
                await page.evaluate(dispose, '#offcanvas1');

                expect(await page.evaluate(() => $.hasData('#offcanvas1', 'offcanvas'))).toBe(false);
            });
        }

        test('cleans up a shown offcanvas', async ({ page }) => {
            await page.evaluate(() => {
                $.setStyle(document.body, {
                    height: '2000px',
                    paddingRight: '10px',
                });

                const offcanvas1 = $.findOne('#offcanvas1');

                UI.Offcanvas.init(offcanvas1).show();
            });
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');

            const hiddenEventTriggered = await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                let triggered = false;

                $.addEvent(offcanvas1, 'hidden.ui.offcanvas', () => {
                    triggered = true;
                });
                UI.Offcanvas.init(offcanvas1).dispose();

                return triggered;
            });

            expect(hiddenEventTriggered).toBe(false);
            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'false');
            await expect(page.locator('body')).not.toHaveClass('offcanvas-backdrop');
            await expectStyles(page, [
                {
                    selectors: ['body'],
                    styles: {
                        overflow: '',
                        paddingRight: '10px',
                    },
                },
            ]);
            expect(await page.evaluate(() => $.hasData('#offcanvas1', 'offcanvas'))).toBe(false);
        });

        test('cleans up while showing', async ({ page }) => {
            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');

                window.offcanvasDisposeEvents = {
                    hidden: false,
                    shown: false,
                };
                $.addEvent(offcanvas1, 'hidden.ui.offcanvas', () => {
                    window.offcanvasDisposeEvents.hidden = true;
                });
                $.addEvent(offcanvas1, 'shown.ui.offcanvas', () => {
                    window.offcanvasDisposeEvents.shown = true;
                });

                const offcanvas = UI.Offcanvas.init(offcanvas1);

                offcanvas.show();
                offcanvas.dispose();
            });

            await advanceClock(page, 1000);

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'false');
            await expect(page.locator('body')).not.toHaveClass('offcanvas-backdrop');
            await expectStyles(page, [
                {
                    selectors: ['body'],
                    styles: { overflow: '' },
                },
            ]);
            expect(await page.evaluate(() => window.offcanvasDisposeEvents)).toEqual({
                hidden: false,
                shown: false,
            });
        });
    });

    test.describe('#show', () => {
        for (const { name, show } of [
            {
                name: 'class',
                show: (selector) => {
                    UI.Offcanvas.init(document.querySelector(selector)).show();
                },
            },
            {
                name: 'QuerySet',
                show: (selector) => {
                    $(selector).offcanvas('show');
                },
            },
        ]) {
            test(`shows the offcanvas (${name})`, async ({ page }) => {
                await page.evaluate(show, '#offcanvas1');

                await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start show');
                await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');
                await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'true');
                await expect(page.locator('#offcanvas1')).not.toHaveAttribute('style');
                await expect(page.locator('#offcanvas2')).toHaveClass('offcanvas offcanvas-start');
                await expect(page.locator('body')).toHaveClass('offcanvas-backdrop');
                await expectStyles(page, [
                    {
                        selectors: ['body'],
                        styles: { overflow: 'hidden' },
                    },
                ]);
            });
        }

        test('shows the offcanvas (data-ui-toggle)', async ({ page }) => {
            await page.locator('#offcanvas-toggle-1').click();

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start show');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#offcanvas1')).not.toHaveAttribute('style');
            await expect(page.locator('#offcanvas2')).toHaveClass('offcanvas offcanvas-start');
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                const offcanvas = UI.Offcanvas.init(offcanvas1);
                offcanvas.show();
                offcanvas.show();
                offcanvas.show();
            });

            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');
        });

        test('can be called on shown offcanvas', async ({ page }) => {
            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start show');
        });

        for (const property of ['overflow-x', 'overflow-y']) {
            test(`rolls back a failed ${property} lock and allows showing again`, async ({ page }) => {
                await page.evaluate(() => {
                    document.body.style.setProperty('overflow-x', 'clip', 'important');
                    document.body.style.setProperty('overflow-y', 'scroll', 'important');
                    document.body.style.setProperty('padding-right', '7px', 'important');
                    document.body.style.minHeight = '2000px';
                    document.querySelector('#offcanvas1').style.setProperty('z-index', '13', 'important');
                    UI.Offcanvas.init(document.querySelector('#offcanvas1'));
                });

                const held = await page.evaluateHandle((property) => $.setStyleLock(document.body, property, 'auto'), property);

                await expect(page.evaluate(() => UI.Offcanvas.init(document.querySelector('#offcanvas1')).show()))
                    .rejects.toThrow(`CSS property "${property}" is already locked.`);

                await expect(page.locator('#offcanvas1')).not.toHaveClass(/\bshow\b/);
                await expect(page.locator('body')).not.toHaveClass('offcanvas-backdrop');
                expect(await page.evaluate(() => $.hasData('#offcanvas1', 'offcanvas'))).toBe(true);

                await held.evaluate((release) => release());

                await expectStyles(page, [
                    {
                        selectors: ['body'],
                        styles: {
                            overflowX: 'clip',
                            overflowY: 'scroll',
                            paddingRight: '7px',
                        },
                    },
                    {
                        selectors: ['#offcanvas1'],
                        styles: { zIndex: '13' },
                    },
                ]);

                await page.evaluate(() => UI.Offcanvas.init(document.querySelector('#offcanvas1')).show());

                await expect(page.locator('#offcanvas1')).toBeVisible();
                await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');

                await page.evaluate(() => UI.Offcanvas.init(document.querySelector('#offcanvas1')).hide());

                await expect(page.locator('#offcanvas1')).toBeHidden();
                await expectStyles(page, [
                    {
                        selectors: ['body'],
                        styles: {
                            overflowX: 'clip',
                            overflowY: 'scroll',
                            paddingRight: '7px',
                        },
                    },
                    {
                        selectors: ['#offcanvas1'],
                        styles: { zIndex: '13' },
                    },
                ]);

                for (const name of ['overflow-x', 'overflow-y', 'padding-right']) {
                    expect(await page.locator('body').evaluate((node, name) => node.style.getPropertyPriority(name), name)).toBe('important');
                }

                expect(await page.locator('#offcanvas1').evaluate((node) => node.style.getPropertyPriority('z-index'))).toBe('important');
            });
        }
    });

    test.describe('#hide', () => {
        for (const { name, show, hide } of [
            {
                name: 'class',
                show: (selector) => {
                    UI.Offcanvas.init(document.querySelector(selector)).show();
                },
                hide: (selector) => {
                    UI.Offcanvas.init(document.querySelector(selector)).hide();
                },
            },
            {
                name: 'QuerySet',
                show: (selector) => {
                    $(selector).offcanvas('show');
                },
                hide: (selector) => {
                    $(selector).offcanvas('hide');
                },
            },
        ]) {
            test(`hides the offcanvas (${name})`, async ({ page }) => {
                await page.evaluate(show, '#offcanvas1');
                await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');

                await page.evaluate(hide, '#offcanvas1');

                await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start');
                await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'true');
                await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'false');
                await expect(page.locator('#offcanvas1')).not.toHaveAttribute('style');
                await expect(page.locator('#offcanvas2')).toHaveClass('offcanvas offcanvas-start');
                await expect(page.locator('body')).not.toHaveClass('offcanvas-backdrop');
                await expectStyles(page, [
                    {
                        selectors: ['body'],
                        styles: { overflow: '' },
                    },
                ]);
            });
        }

        test('hides the offcanvas (data-ui-dismiss)', async ({ page }) => {
            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');

            await page.locator('#button1').click();

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'false');
            await expect(page.locator('#offcanvas1')).not.toHaveAttribute('style');
            await expect(page.locator('#offcanvas2')).toHaveClass('offcanvas offcanvas-start');
        });

        test('does not remove the offcanvas after hiding', async ({ page }) => {
            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).hide();
            });
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'true');

            expect(await page.evaluate(() =>
                $.getData('#offcanvas1', 'offcanvas') instanceof UI.Offcanvas)).toBe(true);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                const offcanvas = UI.Offcanvas.init(offcanvas1);
                offcanvas.hide();
                offcanvas.hide();
                offcanvas.hide();
            });

            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'true');
        });

        test('can be called on hidden offcanvas', async ({ page }) => {
            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).hide();
            });

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start');
            await expect(page.locator('#offcanvas1')).not.toHaveAttribute('style');
        });
    });

    test.describe('#toggle (show)', () => {
        for (const { name, toggle } of [
            {
                name: 'class',
                toggle: (selector) => {
                    UI.Offcanvas.init(document.querySelector(selector)).toggle();
                },
            },
            {
                name: 'QuerySet',
                toggle: (selector) => {
                    $(selector).offcanvas('toggle');
                },
            },
        ]) {
            test(`shows the offcanvas (${name})`, async ({ page }) => {
                await page.evaluate(toggle, '#offcanvas1');

                await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start show');
                await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');
                await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'true');
                await expect(page.locator('#offcanvas1')).not.toHaveAttribute('style');
                await expect(page.locator('#offcanvas2')).toHaveClass('offcanvas offcanvas-start');
            });
        }

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                const offcanvas = UI.Offcanvas.init(offcanvas1);
                offcanvas.toggle();
                offcanvas.toggle();
                offcanvas.toggle();
            });

            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');
        });
    });

    test.describe('#toggle (hide)', () => {
        for (const { name, show, toggle } of [
            {
                name: 'class',
                show: (selector) => {
                    UI.Offcanvas.init(document.querySelector(selector)).show();
                },
                toggle: (selector) => {
                    UI.Offcanvas.init(document.querySelector(selector)).toggle();
                },
            },
            {
                name: 'QuerySet',
                show: (selector) => {
                    $(selector).offcanvas('show');
                },
                toggle: (selector) => {
                    $(selector).offcanvas('toggle');
                },
            },
        ]) {
            test(`hides the offcanvas (${name})`, async ({ page }) => {
                await page.evaluate(show, '#offcanvas1');
                await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');

                await page.evaluate(toggle, '#offcanvas1');

                await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start');
                await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'true');
                await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'false');
                await expect(page.locator('#offcanvas1')).not.toHaveAttribute('style');
                await expect(page.locator('#offcanvas2')).toHaveClass('offcanvas offcanvas-start');
            });
        }

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                const offcanvas = UI.Offcanvas.init(offcanvas1);
                offcanvas.toggle();
                offcanvas.toggle();
                offcanvas.toggle();
            });

            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'true');
        });
    });

    test.describe('events', () => {
        test('triggers show event', async ({ page }) => {
            const eventTriggered = await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                let triggered = false;

                $.addEvent(offcanvas1, 'show.ui.offcanvas', () => {
                    triggered = true;
                });
                UI.Offcanvas.init(offcanvas1).show();

                return triggered;
            });

            expect(eventTriggered).toBe(true);
        });

        test('triggers shown event', async ({ page }) => {
            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                window.offcanvasShownEventTriggered = false;

                $.addEvent(offcanvas1, 'shown.ui.offcanvas', () => {
                    window.offcanvasShownEventTriggered = true;
                });
                UI.Offcanvas.init(offcanvas1).show();
            });

            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'true');
            expect(await page.evaluate(() => window.offcanvasShownEventTriggered)).toBe(true);
        });

        test('triggers hide event', async ({ page }) => {
            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');

            const eventTriggered = await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                let triggered = false;

                $.addEvent(offcanvas1, 'hide.ui.offcanvas', () => {
                    triggered = true;
                });
                UI.Offcanvas.init(offcanvas1).hide();

                return triggered;
            });

            expect(eventTriggered).toBe(true);
        });

        test('triggers hidden event', async ({ page }) => {
            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                window.offcanvasHiddenEventTriggered = false;

                $.addEvent(offcanvas1, 'hidden.ui.offcanvas', () => {
                    window.offcanvasHiddenEventTriggered = true;
                });
                UI.Offcanvas.init(offcanvas1).hide();
            });

            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'false');
            expect(await page.evaluate(() => window.offcanvasHiddenEventTriggered)).toBe(true);
        });

        test('triggers show event (toggle)', async ({ page }) => {
            const eventTriggered = await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                let triggered = false;

                $.addEvent(offcanvas1, 'show.ui.offcanvas', () => {
                    triggered = true;
                });
                UI.Offcanvas.init(offcanvas1).toggle();

                return triggered;
            });

            expect(eventTriggered).toBe(true);
        });

        test('triggers shown event (toggle)', async ({ page }) => {
            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                window.offcanvasShownEventTriggered = false;

                $.addEvent(offcanvas1, 'shown.ui.offcanvas', () => {
                    window.offcanvasShownEventTriggered = true;
                });
                UI.Offcanvas.init(offcanvas1).toggle();
            });

            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'true');
            expect(await page.evaluate(() => window.offcanvasShownEventTriggered)).toBe(true);
        });

        test('triggers hide event (toggle)', async ({ page }) => {
            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');

            const eventTriggered = await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                let triggered = false;

                $.addEvent(offcanvas1, 'hide.ui.offcanvas', () => {
                    triggered = true;
                });
                UI.Offcanvas.init(offcanvas1).toggle();

                return triggered;
            });

            expect(eventTriggered).toBe(true);
        });

        test('triggers hidden event (toggle)', async ({ page }) => {
            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                window.offcanvasHiddenEventTriggered = false;

                $.addEvent(offcanvas1, 'hidden.ui.offcanvas', () => {
                    window.offcanvasHiddenEventTriggered = true;
                });
                UI.Offcanvas.init(offcanvas1).toggle();
            });

            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'false');
            expect(await page.evaluate(() => window.offcanvasHiddenEventTriggered)).toBe(true);
        });

        test('can be prevented from showing', async ({ page }) => {
            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                $.addEvent(offcanvas1, 'show.ui.offcanvas', () => false);
                UI.Offcanvas.init(offcanvas1).show();
            });

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start');
            await expect(page.locator('#offcanvas1')).not.toHaveAttribute('aria-hidden');
            await expect(page.locator('#offcanvas1')).not.toHaveAttribute('aria-modal');
            await expect(page.locator('body')).not.toHaveClass('offcanvas-backdrop');
        });

        test('can be prevented from showing (prevent default)', async ({ page }) => {
            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                $.addEvent(offcanvas1, 'show.ui.offcanvas', (event) => {
                    event.preventDefault();
                });
                UI.Offcanvas.init(offcanvas1).show();
            });

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start');
            await expect(page.locator('#offcanvas1')).not.toHaveAttribute('aria-hidden');
            await expect(page.locator('#offcanvas1')).not.toHaveAttribute('aria-modal');
            await expect(page.locator('body')).not.toHaveClass('offcanvas-backdrop');
        });

        test('can be prevented from hiding', async ({ page }) => {
            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                $.addEvent(offcanvas1, 'hide.ui.offcanvas', () => false);
                UI.Offcanvas.init(offcanvas1).hide();
            });

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start show');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('body')).toHaveClass('offcanvas-backdrop');
        });
    });

    test.describe('keyboard option', () => {
        test('hides the offcanvas on escape', async ({ page }) => {
            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');

            await page.keyboard.press('Escape');

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'false');
            await expect(page.locator('#offcanvas1')).not.toHaveAttribute('style');
            await expect(page.locator('#offcanvas2')).toHaveClass('offcanvas offcanvas-start');
        });

        for (const { name, run } of [
            {
                name: 'class',
                run: () => {
                    const offcanvas1 = $.findOne('#offcanvas1');
                    UI.Offcanvas.init(offcanvas1, { keyboard: false }).show();
                },
            },
            {
                name: 'QuerySet',
                run: () => {
                    $('#offcanvas1')
                        .offcanvas({ keyboard: false })
                        .show();
                },
            },
        ]) {
            test(`works with keyboard option (${name})`, async ({ page }) => {
                await page.evaluate(run);
                await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');

                await page.keyboard.press('Escape');

                await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start show');
                await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');
                await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'true');
                await expect(page.locator('#offcanvas1')).not.toHaveAttribute('style');
                await expect(page.locator('#offcanvas2')).toHaveClass('offcanvas offcanvas-start');
            });
        }

        test('works with keyboard option (data-ui-keyboard)', async ({ page }) => {
            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                $.setDataset(offcanvas1, { uiKeyboard: false });
                UI.Offcanvas.init(offcanvas1).show();
            });
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');

            await page.keyboard.press('Escape');

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start show');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('data-ui-keyboard', 'false');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#offcanvas1')).not.toHaveAttribute('style');
            await expect(page.locator('#offcanvas2')).toHaveClass('offcanvas offcanvas-start');
        });
    });

    test.describe('backdrop option', () => {
        test('adds backdrop to document body', async ({ page }) => {
            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });

            await expect(page.locator('body')).toHaveClass('offcanvas-backdrop');
        });

        for (const { name, run } of [
            {
                name: 'class',
                run: () => {
                    const offcanvas1 = $.findOne('#offcanvas1');
                    UI.Offcanvas.init(offcanvas1, { backdrop: false }).show();
                },
            },
            {
                name: 'QuerySet',
                run: () => {
                    $('#offcanvas1')
                        .offcanvas({ backdrop: false })
                        .show();
                },
            },
        ]) {
            test(`works with backdrop option (${name})`, async ({ page }) => {
                await page.evaluate(run);

                await expect(page.locator('body')).not.toHaveClass('offcanvas-backdrop');
            });
        }

        test('works with backdrop option (data-ui-backdrop)', async ({ page }) => {
            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                $.setDataset(offcanvas1, { uiBackdrop: false });
                UI.Offcanvas.init(offcanvas1).show();
            });

            await expect(page.locator('body')).not.toHaveClass('offcanvas-backdrop');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('data-ui-backdrop', 'false');
        });

        test('hides the offcanvas on document click (with backdrop)', async ({ page }) => {
            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate(() => {
                $.click(document.body);
            });

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'false');
            await expect(page.locator('#offcanvas1')).not.toHaveAttribute('style');
            await expect(page.locator('#offcanvas2')).toHaveClass('offcanvas offcanvas-start');
        });

        test('does not hide the offcanvas on document click (without backdrop)', async ({ page }) => {
            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1, { backdrop: false }).show();
            });
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate(() => {
                $.click(document.body);
            });

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start show');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#offcanvas1')).not.toHaveAttribute('style');
            await expect(page.locator('#offcanvas2')).toHaveClass('offcanvas offcanvas-start');
        });

        test('does not hide the offcanvas on document click (mousedown on offcanvas)', async ({ page }) => {
            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate(() => {
                $.triggerEvent('#offcanvas1', 'mousedown');
                $.click(document.body);
            });

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start show');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#offcanvas1')).not.toHaveAttribute('style');
            await expect(page.locator('#offcanvas2')).toHaveClass('offcanvas offcanvas-start');
        });

        test('hides the offcanvas on offcanvas click (mousedown on backdrop)', async ({ page }) => {
            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate(() => {
                $.triggerEvent(document.body, 'mousedown');
            });
            await page.evaluate(() => {
                $.click('#offcanvas1');
            });

            await expect(page.locator('#offcanvas1')).toHaveClass('offcanvas offcanvas-start');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-modal', 'false');
            await expect(page.locator('#offcanvas1')).not.toHaveAttribute('style');
            await expect(page.locator('#offcanvas2')).toHaveClass('offcanvas offcanvas-start');
        });
    });

    test.describe('scroll option', () => {
        test('prevents scroll on document body', async ({ page }) => {
            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });

            await expectStyles(page, [
                {
                    selectors: ['body'],
                    styles: { overflow: 'hidden' },
                },
            ]);
        });

        for (const { name, run } of [
            {
                name: 'class',
                run: () => {
                    const offcanvas1 = $.findOne('#offcanvas1');
                    UI.Offcanvas.init(offcanvas1, { scroll: true }).show();
                },
            },
            {
                name: 'QuerySet',
                run: () => {
                    $('#offcanvas1')
                        .offcanvas({ scroll: true })
                        .show();
                },
            },
        ]) {
            test(`works with scroll option (${name})`, async ({ page }) => {
                await page.evaluate(run);

                await expectStyles(page, [
                    {
                        selectors: ['body'],
                        styles: { overflow: '' },
                    },
                ]);
            });
        }

        test('works with scroll option (data-ui-scroll)', async ({ page }) => {
            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                $.setDataset(offcanvas1, { uiScroll: true });
                UI.Offcanvas.init(offcanvas1).show();
            });

            await expectStyles(page, [
                {
                    selectors: ['body'],
                    styles: { overflow: '' },
                },
            ]);
            await expect(page.locator('#offcanvas1')).toHaveAttribute('data-ui-scroll', 'true');
        });
    });

    test.describe('scroll padding', () => {
        test('adds scroll padding to document body', async ({ page }) => {
            const scrollbarSize = await measureScrollbarSize(page);
            const paddingRight = scrollbarSize ?
                `${scrollbarSize}px` :
                '';

            await page.evaluate(() => {
                $.setStyle(document.body, { height: '2000px' });
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });

            await expectStyles(page, [
                {
                    selectors: ['body'],
                    styles: { paddingRight },
                },
            ]);
        });

        test('does not add padding if scrollbars are hidden', async ({ page }) => {
            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });

            await expectStyles(page, [
                {
                    selectors: ['body'],
                    styles: { paddingRight: '' },
                },
            ]);
        });

        test('works with existing padding', async ({ page }) => {
            const scrollbarSize = await measureScrollbarSize(page);

            await page.evaluate(() => {
                $.setStyle(document.body, {
                    height: '2000px',
                    paddingRight: '10px',
                });
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });

            await expectStyles(page, [
                {
                    selectors: ['body'],
                    styles: { paddingRight: `${scrollbarSize + 10}px` },
                },
            ]);
        });

        test('restores scroll padding to document body', async ({ page }) => {
            await page.evaluate(() => {
                $.setStyle(document.body, { height: '2000px' });
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).hide();
            });
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'true');

            await expectStyles(page, [
                {
                    selectors: ['body'],
                    styles: { paddingRight: '' },
                },
            ]);
        });

        test('restores existing scroll padding to document body', async ({ page }) => {
            await page.evaluate(() => {
                $.setStyle(document.body, {
                    height: '2000px',
                    paddingRight: '10px',
                });
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            });
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate(() => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).hide();
            });
            await expect(page.locator('#offcanvas1')).toHaveAttribute('aria-hidden', 'true');

            await expectStyles(page, [
                {
                    selectors: ['body'],
                    styles: { paddingRight: '10px' },
                },
            ]);
        });
    });
});
