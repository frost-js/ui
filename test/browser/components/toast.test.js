import { expect, test } from '#test';
import { advanceClock, waitForFrame } from '../../setup/browser.js';

test.use({ reducedMotion: 'no-preference' });

test.describe('Toast', () => {
    const setupHidden = async ({ page }) => {
        await page.locator('.toast').evaluateAll((toasts) => {
            for (const toast of toasts) {
                toast.classList.remove('show');
                toast.style.setProperty('display', 'none', 'important');
            }
        });
        await waitForFrame(page);
    };

    const setupAutohide = async ({ page }) => {
        await page.locator('#toast1').evaluate((toast) => {
            toast.classList.remove('fade', 'show');
            toast.style.setProperty('display', 'none', 'important');
        });
    };

    test.beforeEach(async ({ page }) => {
        await page.evaluate(() => {
            document.body.innerHTML =
                '<div class="toast fade show" id="toast1">' +
                '<button class="btn-close" id="button1" data-ui-dismiss="toast" type="button"></button>' +
                '</div>' +
                '<div class="toast fade show" id="toast2">' +
                '<button class="btn-close" id="button2" data-ui-dismiss="toast" type="button"></button>' +
                '</div>';
        });
    });

    test.describe('#init', () => {
        for (const { name, init } of [
            {
                name: 'class',
                init: (selector) => UI.Toast.init(document.querySelector(selector)),
            },
            {
                name: 'QuerySet',
                init: (selector) => $(selector).toast(),
            },
        ]) {
            test(`creates a toast (${name})`, async ({ page }) => {
                const instance = await page.evaluateHandle(init, '#toast1');

                expect(await instance.evaluate((value) => value instanceof UI.Toast)).toBe(true);
                expect(await page.evaluate(() =>
                    $.getData('#toast1', 'toast') instanceof UI.Toast)).toBe(true);
            });
        }

        test('creates a toast (data-ui-dismiss)', async ({ page }) => {
            await page.locator('#button1').click();

            expect(await page.evaluate((_) =>
                $.getData('#toast1', 'toast') instanceof UI.Toast)).toBe(true);
        });
    });

    test.describe('#dispose', () => {
        test.use({ mockClock: true });

        for (const { name, dispose } of [
            {
                name: 'class',
                dispose: (selector) => {
                    UI.Toast.init(document.querySelector(selector)).dispose();
                },
            },
            {
                name: 'QuerySet',
                dispose: (selector) => {
                    $(selector).toast('dispose');
                },
            },
        ]) {
            test(`removes the toast (${name})`, async ({ page }) => {
                await page.evaluate(dispose, '#toast1');

                expect(await page.evaluate(() => $.hasData('#toast1', 'toast'))).toBe(false);
            });
        }

        test('clears the autohide timer', async ({ page }) => {
            await page.evaluate(async (_) => {
                const toast1 = $.findOne('#toast1');
                $.removeClass(toast1, 'fade show');
                $.setStyle(toast1, { display: 'none' }, null, { important: true });

                const shown = new Promise((resolve) => {
                    $.addEvent(toast1, 'shown.ui.toast', (_) => resolve());
                });
                UI.Toast.init(toast1).show();
                await shown;
            });

            expect(await page.evaluate((_) => {
                const toast = UI.Toast.init($.findOne('#toast1'));
                const originalClearTimeout = window.clearTimeout;
                let timerCleared = false;

                window.clearTimeout = (timer) => {
                    timerCleared = true;
                    originalClearTimeout(timer);
                };

                try {
                    toast.dispose();
                    return timerCleared;
                } finally {
                    window.clearTimeout = originalClearTimeout;
                }
            })).toBe(true);
        });

        test('restores display on disposal while showing without a late event', async ({ page }) => {
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                $.removeClass(toast1, 'show');
                $.setStyle(toast1, { display: 'none' }, null, { important: true });
                window.toastShownEventTriggered = false;

                $.addEvent(toast1, 'shown.ui.toast', (_) => {
                    window.toastShownEventTriggered = true;
                });

                const toast = UI.Toast.init(toast1);
                toast.show();
                toast.dispose();
            });
            await advanceClock(page, 1000);

            await expect(page.locator('#toast1')).toBeHidden();
            expect(await page.locator('#toast1').evaluate((node) => node.style.getPropertyPriority('display'))).toBe('important');
            expect(await page.evaluate((_) => window.toastShownEventTriggered)).toBe(false);
            expect(await page.evaluate((_) => $.hasData('#toast1', 'toast'))).toBe(false);
        });

        test('does not apply hidden styles or emit an event after disposal', async ({ page }) => {
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                window.toastHiddenEventTriggered = false;

                $.addEvent(toast1, 'hidden.ui.toast', (_) => {
                    window.toastHiddenEventTriggered = true;
                });

                const toast = UI.Toast.init(toast1);
                toast.hide();
                toast.dispose();
            });
            await advanceClock(page, 1000);

            await expect(page.locator('#toast1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toHaveCSS('opacity', '0');
            expect(await page.locator('#toast1').evaluate((node) => node.style.display)).toBe('');
            expect(await page.evaluate((_) => window.toastHiddenEventTriggered)).toBe(false);
            expect(await page.evaluate((_) => $.hasData('#toast1', 'toast'))).toBe(false);
        });

        for (const display of ['none', 'grid']) {
            test(`restores original display: ${display} !important after repeated visibility changes`, async ({ page }) => {
                const states = await page.evaluate(async (display) => {
                    const node = $.findOne('#toast1');
                    $.removeClass(node, 'fade show');
                    $.setStyle(node, { display }, null, { important: true });
                    const toast = UI.Toast.init(node, { autohide: false });
                    const states = [];

                    for (let index = 0; index < 2; index++) {
                        const shown = new Promise((resolve) => $.addEventOnce(node, 'shown.ui.toast', resolve));
                        toast.show();
                        await shown;
                        states.push($.css(node, 'display'));

                        const hidden = new Promise((resolve) => $.addEventOnce(node, 'hidden.ui.toast', resolve));
                        toast.hide();
                        await hidden;
                        states.push($.css(node, 'display'));
                    }

                    toast.dispose();
                    return { states, display: node.style.display, priority: node.style.getPropertyPriority('display') };
                }, display);

                expect(states.states).toEqual(['block', 'none', 'block', 'none']);
                expect(states.display).toBe(display);
                expect(states.priority).toBe('important');
            });
        }
    });

    test.describe('#show', () => {
        test.beforeEach(setupHidden);

        for (const { name, show } of [
            {
                name: 'class',
                show: (selector) => {
                    UI.Toast.init(document.querySelector(selector), { autohide: false }).show();
                },
            },
            {
                name: 'QuerySet',
                show: (selector) => {
                    $(selector).toast({ autohide: false });
                    $(selector).toast('show');
                },
            },
        ]) {
            test(`shows the toast (${name})`, async ({ page }) => {
                await page.evaluate(show, '#toast1');

                await expect(page.locator('#toast1')).toHaveClass(/\bshow\b/);
                await expect(page.locator('#toast1')).toBeVisible();
                await expect(page.locator('#toast1')).toHaveAttribute('style', '');
                await expect(page.locator('#toast2')).not.toHaveClass(/\bshow\b/);
                await expect(page.locator('#toast2')).toBeHidden();
            });
        }

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                const toast = UI.Toast.init(toast1, { autohide: false });
                toast.show();
                toast.show();
                toast.show();
            });

            await expect(page.locator('#toast1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeVisible();
        });

        test('can be called on a shown toast', async ({ page }) => {
            await page.evaluate(async (_) => {
                const toast1 = $.findOne('#toast1');
                const toast = UI.Toast.init(toast1, { autohide: false });
                const shown = new Promise((resolve) => {
                    $.addEvent(toast1, 'shown.ui.toast', (_) => resolve());
                });
                toast.show();
                await shown;
                toast.show();
            });

            await expect(page.locator('#toast1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeVisible();
        });

        test('shows without a transition class', async ({ page }) => {
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                $.removeClass(toast1, 'fade');
                UI.Toast.init(toast1, { autohide: false }).show();
            });

            await expect(page.locator('#toast1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeVisible();
        });

        test('shows when the transition is canceled', async ({ page }) => {
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1, { autohide: false }).show();
                const transition = toast1.getAnimations()
                    .find((animation) => animation instanceof CSSTransition);
                transition.cancel();
            });

            await expect(page.locator('#toast1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeVisible();
        });
    });

    test.describe('#hide', () => {
        for (const { name, hide } of [
            {
                name: 'class',
                hide: (selector) => {
                    UI.Toast.init(document.querySelector(selector)).hide();
                },
            },
            {
                name: 'QuerySet',
                hide: (selector) => {
                    $(selector).toast('hide');
                },
            },
        ]) {
            test(`hides the toast (${name})`, async ({ page }) => {
                await page.evaluate(hide, '#toast1');

                await expect(page.locator('#toast1')).not.toHaveClass(/\bshow\b/);
                await expect(page.locator('#toast1')).toBeHidden();
                await expect(page.locator('#toast2')).toHaveClass(/\bshow\b/);
                await expect(page.locator('#toast2')).toBeVisible();
            });
        }

        test('hides the toast (data-ui-dismiss)', async ({ page }) => {
            await page.locator('#button1').click();

            await expect(page.locator('#toast1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeHidden();
        });

        test('does not remove the toast after hiding', async ({ page }) => {
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1).hide();
            });

            await expect(page.locator('#toast1')).toBeHidden();
            expect(await page.evaluate((_) =>
                $.getData('#toast1', 'toast') instanceof UI.Toast)).toBe(true);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                const toast = UI.Toast.init(toast1);
                toast.hide();
                toast.hide();
                toast.hide();
            });

            await expect(page.locator('#toast1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeHidden();
            await expect(page.locator('#toast2')).toBeVisible();
        });

        test('can be called on a hidden toast', async ({ page }) => {
            await page.evaluate(async (_) => {
                const toast1 = $.findOne('#toast1');
                const toast = UI.Toast.init(toast1);
                const hidden = new Promise((resolve) => {
                    $.addEvent(toast1, 'hidden.ui.toast', (_) => resolve());
                });
                toast.hide();
                await hidden;
                toast.hide();
            });

            await expect(page.locator('#toast1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeHidden();
        });

        test('hides without a transition class', async ({ page }) => {
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                $.removeClass(toast1, 'fade');
                UI.Toast.init(toast1).hide();
            });

            await expect(page.locator('#toast1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeHidden();
        });

        test('hides when the transition is canceled', async ({ page }) => {
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1).hide();
                const transition = toast1.getAnimations()
                    .find((animation) => animation instanceof CSSTransition);
                transition.cancel();
            });

            await expect(page.locator('#toast1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeHidden();
        });
    });

    test.describe('events', () => {
        test('triggers show event', async ({ page }) => {
            const eventTriggered = await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                $.removeClass(toast1, 'show');
                $.setStyle(toast1, { display: 'none' }, null, { important: true });
                let triggered = false;

                $.addEvent(toast1, 'show.ui.toast', (_) => {
                    triggered = true;
                });
                UI.Toast.init(toast1, { autohide: false }).show();

                return triggered;
            });

            expect(eventTriggered).toBe(true);
        });

        test('triggers shown event', async ({ page }) => {
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                $.removeClass(toast1, 'show');
                $.setStyle(toast1, { display: 'none' }, null, { important: true });
                window.toastShownEventTriggered = false;

                $.addEvent(toast1, 'shown.ui.toast', (_) => {
                    window.toastShownEventTriggered = true;
                });
                UI.Toast.init(toast1, { autohide: false }).show();
            });

            await page.waitForFunction((_) => window.toastShownEventTriggered);
            expect(await page.evaluate((_) => window.toastShownEventTriggered)).toBe(true);
            await expect(page.locator('#toast1')).toBeVisible();
        });

        test('triggers hide event', async ({ page }) => {
            const eventTriggered = await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                let triggered = false;

                $.addEvent(toast1, 'hide.ui.toast', (_) => {
                    triggered = true;
                });
                UI.Toast.init(toast1).hide();

                return triggered;
            });

            expect(eventTriggered).toBe(true);
        });

        test('triggers hidden event', async ({ page }) => {
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                window.toastHiddenEventTriggered = false;

                $.addEvent(toast1, 'hidden.ui.toast', (_) => {
                    window.toastHiddenEventTriggered = true;
                });
                UI.Toast.init(toast1).hide();
            });

            await expect(page.locator('#toast1')).toBeHidden();
            expect(await page.evaluate((_) => window.toastHiddenEventTriggered)).toBe(true);
        });

        test('can be prevented from showing', async ({ page }) => {
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                $.removeClass(toast1, 'show');
                $.setStyle(toast1, { display: 'none' }, null, { important: true });
                $.addEvent(toast1, 'show.ui.toast', (_) => false);
                UI.Toast.init(toast1, { autohide: false }).show();
            });

            await expect(page.locator('#toast1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeHidden();
        });

        test('can be prevented from showing (prevent default)', async ({ page }) => {
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                $.removeClass(toast1, 'show');
                $.setStyle(toast1, { display: 'none' }, null, { important: true });
                $.addEvent(toast1, 'show.ui.toast', (event) => {
                    event.preventDefault();
                });
                UI.Toast.init(toast1, { autohide: false }).show();
            });

            await expect(page.locator('#toast1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeHidden();
        });

        test('can be prevented from hiding', async ({ page }) => {
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                $.addEvent(toast1, 'hide.ui.toast', (_) => false);
                UI.Toast.init(toast1).hide();
            });

            await expect(page.locator('#toast1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeVisible();
        });

        test('can be prevented from hiding (prevent default)', async ({ page }) => {
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                $.addEvent(toast1, 'hide.ui.toast', (event) => {
                    event.preventDefault();
                });
                UI.Toast.init(toast1).hide();
            });

            await expect(page.locator('#toast1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeVisible();
        });
    });

    test.describe('autohide option', () => {
        test.use({ mockClock: true });

        test.beforeEach(setupAutohide);

        test('autohides by default', async ({ page }) => {
            await page.evaluate(async (_) => {
                const toast1 = $.findOne('#toast1');
                const shown = new Promise((resolve) => {
                    $.addEvent(toast1, 'shown.ui.toast', (_) => resolve());
                });
                UI.Toast.init(toast1).show();
                await shown;
            });
            await advanceClock(page, 4950);

            await expect(page.locator('#toast1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeVisible();

            await advanceClock(page, 100);

            await expect(page.locator('#toast1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeHidden();
        });

        test('restarts the delay when shown again', async ({ page }) => {
            await page.evaluate(async (_) => {
                const toast1 = $.findOne('#toast1');
                const shown = new Promise((resolve) => {
                    $.addEvent(toast1, 'shown.ui.toast', (_) => resolve());
                });
                UI.Toast.init(toast1, { delay: 500 }).show();
                await shown;
            });
            await advanceClock(page, 300);
            await page.evaluate(async (_) => {
                const toast = UI.Toast.init($.findOne('#toast1'));
                const hidden = new Promise((resolve) => {
                    $.addEvent(toast.node, 'hidden.ui.toast', (_) => resolve());
                });
                toast.hide();
                await hidden;

                const shown = new Promise((resolve) => {
                    $.addEvent(toast.node, 'shown.ui.toast', (_) => resolve());
                });
                toast.show();
                await shown;
            });
            await advanceClock(page, 300);

            await expect(page.locator('#toast1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeVisible();

            await advanceClock(page, 250);

            await expect(page.locator('#toast1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeHidden();
        });

        for (const { name, run } of [
            {
                name: 'class',
                run: async (_) => {
                    const toast1 = $.findOne('#toast1');
                    const shown = new Promise((resolve) => {
                        $.addEvent(toast1, 'shown.ui.toast', (_) => resolve());
                    });
                    UI.Toast.init(toast1, { autohide: false }).show();
                    await shown;
                },
            },
            {
                name: 'QuerySet',
                run: async (_) => {
                    const toast1 = $.findOne('#toast1');
                    const shown = new Promise((resolve) => {
                        $.addEvent(toast1, 'shown.ui.toast', (_) => resolve());
                    });
                    $('#toast1')
                        .toast({ autohide: false })
                        .show();
                    await shown;
                },
            },
        ]) {
            test(`stays visible with autohide disabled (${name})`, async ({ page }) => {
                await page.evaluate(run);
                await advanceClock(page, 5100);

                await expect(page.locator('#toast1')).toHaveClass(/\bshow\b/);
                await expect(page.locator('#toast1')).toBeVisible();
            });
        }

        test('stays visible with autohide disabled (data-ui-autohide)', async ({ page }) => {
            await page.evaluate(async (_) => {
                const toast1 = $.findOne('#toast1');
                $.setDataset(toast1, { uiAutohide: false });
                const shown = new Promise((resolve) => {
                    $.addEvent(toast1, 'shown.ui.toast', (_) => resolve());
                });
                UI.Toast.init(toast1).show();
                await shown;
            });
            await advanceClock(page, 5100);

            await expect(page.locator('#toast1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toHaveAttribute('data-ui-autohide', 'false');
            await expect(page.locator('#toast1')).toBeVisible();
        });
    });

    test.describe('delay option', () => {
        test.use({ mockClock: true });

        test.beforeEach(setupAutohide);

        for (const { name, run } of [
            {
                name: 'class',
                run: async (_) => {
                    const toast1 = $.findOne('#toast1');
                    const shown = new Promise((resolve) => {
                        $.addEvent(toast1, 'shown.ui.toast', (_) => resolve());
                    });
                    UI.Toast.init(toast1, { delay: 300 }).show();
                    await shown;
                },
            },
            {
                name: 'QuerySet',
                run: async (_) => {
                    const toast1 = $.findOne('#toast1');
                    const shown = new Promise((resolve) => {
                        $.addEvent(toast1, 'shown.ui.toast', (_) => resolve());
                    });
                    $('#toast1')
                        .toast({ delay: 300 })
                        .show();
                    await shown;
                },
            },
        ]) {
            test(`works with delay option (${name})`, async ({ page }) => {
                await page.evaluate(run);
                await advanceClock(page, 250);

                await expect(page.locator('#toast1')).toHaveClass(/\bshow\b/);
                await expect(page.locator('#toast1')).toBeVisible();

                await advanceClock(page, 100);

                await expect(page.locator('#toast1')).not.toHaveClass(/\bshow\b/);
                await expect(page.locator('#toast1')).toBeHidden();
            });
        }

        test('works with delay option (data-ui-delay)', async ({ page }) => {
            await page.evaluate(async (_) => {
                const toast1 = $.findOne('#toast1');
                $.setDataset(toast1, { uiDelay: 300 });
                const shown = new Promise((resolve) => {
                    $.addEvent(toast1, 'shown.ui.toast', (_) => resolve());
                });
                UI.Toast.init(toast1).show();
                await shown;
            });
            await advanceClock(page, 250);

            await expect(page.locator('#toast1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toHaveAttribute('data-ui-delay', '300');
            await expect(page.locator('#toast1')).toBeVisible();

            await advanceClock(page, 100);

            await expect(page.locator('#toast1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeHidden();
        });
    });

    test.describe('QuerySet', () => {
        test.describe('#init', () => {
            test('creates multiple toasts', async ({ page }) => {
                expect(await page.evaluate((_) => {
                    $('.toast').toast();
                    return $.find('.toast').every((node) =>
                        $.getData(node, 'toast') instanceof UI.Toast,
                    );
                })).toBe(true);
            });
        });

        test.describe('#dispose', () => {
            test.use({ mockClock: true });

            test('removes multiple toasts', async ({ page }) => {
                expect(await page.evaluate((_) => {
                    $('.toast').toast('dispose');
                    return $.find('.toast').some((node) =>
                        $.hasData(node, 'toast'),
                    );
                })).toBe(false);
            });
        });

        test.describe('#show', () => {
            test.beforeEach(setupHidden);

            test('shows the toast through the returned instance', async ({ page }) => {
                await page.evaluate((_) => {
                    $('#toast1')
                        .toast({ autohide: false })
                        .show();
                });

                await expect(page.locator('#toast1')).toHaveClass(/\bshow\b/);
                await expect(page.locator('#toast1')).toBeVisible();
                await expect(page.locator('#toast1')).toHaveAttribute('style', '');
            });

            test('shows multiple toasts', async ({ page }) => {
                await page.evaluate((_) => {
                    $('.toast').toast({ autohide: false });
                    $('.toast').toast('show');
                });

                await expect(page.locator('#toast1')).toHaveClass(/\bshow\b/);
                await expect(page.locator('#toast1')).toBeVisible();
                await expect(page.locator('#toast1')).toHaveAttribute('style', '');
                await expect(page.locator('#toast2')).toHaveClass(/\bshow\b/);
                await expect(page.locator('#toast2')).toBeVisible();
                await expect(page.locator('#toast2')).toHaveAttribute('style', '');
            });
        });

        test.describe('#hide', () => {
            test('hides multiple toasts', async ({ page }) => {
                await page.evaluate((_) => {
                    $('.toast').toast('hide');
                });

                await expect(page.locator('#toast1')).not.toHaveClass(/\bshow\b/);
                await expect(page.locator('#toast1')).toBeHidden();
                await expect(page.locator('#toast2')).not.toHaveClass(/\bshow\b/);
                await expect(page.locator('#toast2')).toBeHidden();
            });
        });
    });
});
