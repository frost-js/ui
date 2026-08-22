import { expect, test } from '@playwright/test';
import { advanceClock, resetPage, setupClock } from '../../setup/browser.js';
import { expectAnimationState } from '../../support/assertions/animation.js';

test.beforeEach(async ({ page }) => {
    await setupClock(page);
    await resetPage(page);
});

test.describe('Toast', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div class="toast show" id="toast1">' +
                '<button class="btn-close" id="button1" data-ui-dismiss="toast" type="button"></button>' +
                '</div>' +
                '<div class="toast show" id="toast2">' +
                '<button class="btn-close" id="button2" data-ui-dismiss="toast" type="button"></button>' +
                '</div>';
        });
    });

    test.describe('#init', () => {
        test('creates a toast', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                return UI.Toast.init(toast1) instanceof UI.Toast;
            })).toBe(true);
        });

        test('creates a toast (data-ui-toggle)', async ({ page }) => {
            await page.locator('#button1').click();

            expect(await page.evaluate((_) =>
                $.getData('#toast1', 'toast') instanceof UI.Toast)).toBe(true);
        });

        test('creates a toast (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('#toast1').toast();
                return $.getData('#toast1', 'toast') instanceof UI.Toast;
            })).toBe(true);
        });

        test('creates multiple toasts (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('.toast').toast();
                return $.find('.toast').every((node) =>
                    $.getData(node, 'toast') instanceof UI.Toast,
                );
            })).toBe(true);
        });

        test('returns the toast (query)', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $('#toast1').toast() instanceof UI.Toast)).toBe(true);
        });
    });

    test.describe('#dispose', () => {
        test('removes the toast', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1).dispose();
                return $.hasData(toast1, 'toast');
            })).toBe(false);
        });

        test('removes the toast (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('#toast1').toast('dispose');
                return $.hasData('#toast1', 'toast');
            })).toBe(false);
        });

        test('removes multiple toasts (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('.toast').toast('dispose');
                return $.find('.toast').some((node) =>
                    $.hasData(node, 'toast'),
                );
            })).toBe(false);
        });

        test('clears toast memory', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                const toast = UI.Toast.init(toast1);
                toast.dispose();

                for (const key in toast) {
                    if ($._isObject(toast[key]) && !$._isFunction(toast[key])) {
                        return false;
                    }
                }

                return true;
            })).toBe(true);
        });

        test('clears toast memory when node is removed', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                const toast = UI.Toast.init(toast1);
                $.remove(toast1);

                for (const key in toast) {
                    if ($._isObject(toast[key]) && !$._isFunction(toast[key])) {
                        return false;
                    }
                }

                return true;
            })).toBe(true);
        });
    });

    test.describe('#hide', () => {
        test('hides the toast', async ({ page }) => {
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1).hide();
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#toast1'],
                    progress: 0.5,
                    styles: { opacity: '0.5' },
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#toast1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeHidden();
            await expect(page.locator('#toast2')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast2')).toBeVisible();
        });

        test('hides the toast (data-ui-dismiss)', async ({ page }) => {
            await page.locator('#button1').click();
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#toast1'],
                    progress: 0.5,
                    styles: { opacity: '0.5' },
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#toast1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeHidden();
        });

        test('hides the toast (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#toast1').toast('hide');
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#toast1'],
                    progress: 0.5,
                    styles: { opacity: '0.5' },
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#toast1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeHidden();
        });

        test('hides multiple toasts (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('.toast').toast('hide');
            });
            await advanceClock(page, 150);

            await expect(page.locator('#toast1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeHidden();
            await expect(page.locator('#toast2')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast2')).toBeHidden();
        });

        test('does not remove the toast after hiding', async ({ page }) => {
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1).hide();
            });
            await advanceClock(page, 100);

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
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['#toast1'],
                    progress: 0.5,
                },
            ]);
        });

        test('can be called on hidden toast', async ({ page }) => {
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1).hide();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#toast1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1).hide();
            });

            await expect(page.locator('#toast1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeHidden();
            await expectAnimationState(page, [
                {
                    selectors: ['#toast1'],
                },
            ]);
        });
    });

    test.describe('#show', () => {
        test('shows the toast', async ({ page }) => {
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1).hide();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#toast1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1).show();
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#toast1'],
                    progress: 0.5,
                    styles: { opacity: '0.5' },
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#toast1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeVisible();
            await expect(page.locator('#toast1')).toHaveAttribute('style', '');
            await expect(page.locator('#toast2')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast2')).toBeVisible();
        });

        test('shows the toast (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#toast1').toast('hide');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#toast1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $('#toast1').toast('show');
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#toast1'],
                    progress: 0.5,
                    styles: { opacity: '0.5' },
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#toast1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeVisible();
            await expect(page.locator('#toast1')).toHaveAttribute('style', '');
        });

        test('shows multiple toasts (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('.toast').toast('hide');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#toast1');
                $.stop('#toast2');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $('.toast').toast('show');
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#toast1', '#toast2'],
                    progress: 0.5,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#toast1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeVisible();
            await expect(page.locator('#toast2')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast2')).toBeVisible();
            await expect(page.locator('#toast1')).toHaveAttribute('style', '');
            await expect(page.locator('#toast2')).toHaveAttribute('style', '');
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1).hide();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#toast1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                const toast = UI.Toast.init(toast1);
                toast.show();
                toast.show();
                toast.show();
            });
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['#toast1'],
                    progress: 0.5,
                },
            ]);
        });

        test('can be called on shown toast', async ({ page }) => {
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1).show();
            });

            await expect(page.locator('#toast1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeVisible();
            await expectAnimationState(page, [
                {
                    selectors: ['#toast1'],
                },
            ]);
        });
    });

    test.describe('events', () => {
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
            await advanceClock(page, 150);

            expect(await page.evaluate((_) => window.toastHiddenEventTriggered)).toBe(true);
            await expect(page.locator('#toast1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeHidden();
        });

        test('triggers show event', async ({ page }) => {
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1).hide();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#toast1');
            });
            await advanceClock(page, 50);
            const eventTriggered = await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                let triggered = false;

                $.addEvent(toast1, 'show.ui.toast', (_) => {
                    triggered = true;
                });
                UI.Toast.init(toast1).show();

                return triggered;
            });

            expect(eventTriggered).toBe(true);
        });

        test('triggers shown event', async ({ page }) => {
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1).hide();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#toast1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                window.toastShownEventTriggered = false;

                $.addEvent(toast1, 'shown.ui.toast', (_) => {
                    window.toastShownEventTriggered = true;
                });
                UI.Toast.init(toast1).show();
            });
            await advanceClock(page, 150);

            expect(await page.evaluate((_) => window.toastShownEventTriggered)).toBe(true);
            await expect(page.locator('#toast1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeVisible();
            await expect(page.locator('#toast1')).toHaveAttribute('style', '');
        });

        test('can be prevented from hiding', async ({ page }) => {
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                $.addEvent(toast1, 'hide.ui.toast', (_) => false);
                UI.Toast.init(toast1).hide();
            });
            await advanceClock(page, 100);

            await expect(page.locator('#toast1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeVisible();
            await expectAnimationState(page, [
                {
                    selectors: ['#toast1'],
                },
            ]);
        });

        test('can be prevented from hiding (prevent default)', async ({ page }) => {
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                $.addEvent(toast1, 'hide.ui.toast', (event) => {
                    event.preventDefault();
                });
                UI.Toast.init(toast1).hide();
            });
            await advanceClock(page, 100);

            await expect(page.locator('#toast1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeVisible();
            await expectAnimationState(page, [
                {
                    selectors: ['#toast1'],
                },
            ]);
        });

        test('can be prevented from showing', async ({ page }) => {
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1).hide();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#toast1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                $.addEvent(toast1, 'show.ui.toast', (_) => false);
                UI.Toast.init(toast1).show();
            });
            await advanceClock(page, 100);

            await expect(page.locator('#toast1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeHidden();
            await expectAnimationState(page, [
                {
                    selectors: ['#toast1'],
                },
            ]);
        });

        test('can be prevented from showing (prevent default)', async ({ page }) => {
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1).hide();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#toast1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                $.addEvent(toast1, 'show.ui.toast', (event) => {
                    event.preventDefault();
                });
                UI.Toast.init(toast1).show();
            });
            await advanceClock(page, 100);

            await expect(page.locator('#toast1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeHidden();
            await expectAnimationState(page, [
                {
                    selectors: ['#toast1'],
                },
            ]);
        });
    });

    test.describe('duration option', () => {
        test('works with duration option on hide', async ({ page }) => {
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1, { duration: 200 }).hide();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#toast1'],
                    progress: 0.875,
                    styles: { opacity: '0.13' },
                },
            ]);
        });

        test('works with duration option on hide (data-ui-duration)', async ({ page }) => {
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                $.setDataset(toast1, { uiDuration: 200 });
                UI.Toast.init(toast1).hide();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#toast1'],
                    progress: 0.875,
                    styles: { opacity: '0.13' },
                },
            ]);
        });

        test('works with duration option on hide (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#toast1')
                    .toast({ duration: 200 })
                    .hide();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#toast1'],
                    progress: 0.875,
                    styles: { opacity: '0.13' },
                },
            ]);
        });

        test('works with duration option on show', async ({ page }) => {
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1, { duration: 200 }).hide();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#toast1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1).show();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#toast1'],
                    progress: 0.875,
                    styles: { opacity: '0.87' },
                },
            ]);
        });

        test('works with duration option on show (data-ui-duration)', async ({ page }) => {
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                $.setDataset(toast1, { uiDuration: 200 });
                UI.Toast.init(toast1).hide();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#toast1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1).show();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#toast1'],
                    progress: 0.875,
                    styles: { opacity: '0.87' },
                },
            ]);
        });

        test('works with duration option on show (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#toast1')
                    .toast({ duration: 200 })
                    .hide();
                $.stop('#toast1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $('#toast1').toast('show');
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#toast1'],
                    progress: 0.875,
                    styles: { opacity: '0.87' },
                },
            ]);
        });
    });

    test.describe('autohide option', () => {
        test('autohides by default', async ({ page }) => {
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1).hide();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#toast1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#toast1');
            });
            await advanceClock(page, 250);

            await expectAnimationState(page, [
                {
                    selectors: ['#toast1'],
                    progress: 0.5,
                    styles: { opacity: '0.5' },
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#toast1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeHidden();
        });

        test('works with autohide option', async ({ page }) => {
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1, { autohide: false });
            });
            await advanceClock(page, 350);

            await expect(page.locator('#toast1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeVisible();
        });

        test('works with autohide option (data-ui-autohide)', async ({ page }) => {
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                $.setDataset(toast1, { uiAutohide: false });
                UI.Toast.init(toast1);
            });
            await advanceClock(page, 350);

            await expect(page.locator('#toast1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toHaveAttribute('data-ui-autohide', 'false');
            await expect(page.locator('#toast1')).toBeVisible();
        });

        test('works with autohide option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#toast1').toast({ autohide: false });
            });
            await advanceClock(page, 350);

            await expect(page.locator('#toast1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeVisible();
        });
    });

    test.describe('delay option', () => {
        test('works with delay option', async ({ page }) => {
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1, { delay: 300 }).hide();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#toast1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#toast1');
            });
            await advanceClock(page, 350);

            await expectAnimationState(page, [
                {
                    selectors: ['#toast1'],
                    progress: 0.5,
                    styles: { opacity: '0.5' },
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#toast1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeHidden();
        });

        test('works with delay option (data-ui-delay)', async ({ page }) => {
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                $.setDataset(toast1, { uiDelay: 300 });
                UI.Toast.init(toast1).hide();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#toast1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#toast1');
            });
            await advanceClock(page, 350);

            await expectAnimationState(page, [
                {
                    selectors: ['#toast1'],
                    progress: 0.5,
                    styles: { opacity: '0.5' },
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#toast1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toHaveAttribute('data-ui-delay', '300');
            await expect(page.locator('#toast1')).toBeHidden();
        });

        test('works with delay option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#toast1')
                    .toast({ delay: 300 })
                    .hide();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#toast1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $('#toast1').toast('show');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#toast1');
            });
            await advanceClock(page, 350);

            await expectAnimationState(page, [
                {
                    selectors: ['#toast1'],
                    progress: 0.5,
                    styles: { opacity: '0.5' },
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#toast1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#toast1')).toBeHidden();
        });
    });
});
