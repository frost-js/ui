import { expect, test } from '@playwright/test';
import { advanceClock, resetPage, setupClock } from '../../setup/browser.js';
import { expectAnimationState } from '../../support/assertions/animation.js';

test.beforeEach(async ({ page }) => {
    await setupClock(page);
    await resetPage(page);
});

test.describe('Popover', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<button class="btn btn-secondary" id="popoverToggle1" type="button"></button>' +
                '<button class="btn btn-secondary" id="popoverToggle2" type="button"></button>';
        });
    });

    test.describe('#init', () => {
        test('creates a popover', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                return UI.Popover.init(popoverToggle1) instanceof UI.Popover;
            })).toBe(true);
        });

        test('creates a popover (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('#popoverToggle1').popover();
                return $.getData('#popoverToggle1', 'popover') instanceof UI.Popover;
            })).toBe(true);
        });

        test('creates multiple popovers (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('button').popover();
                return $.find('button').every((node) =>
                    $.getData(node, 'popover') instanceof UI.Popover,
                );
            })).toBe(true);
        });

        test('returns the popover (query)', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $('#popoverToggle1').popover() instanceof UI.Popover)).toBe(true);
        });
    });

    test.describe('#dispose', () => {
        test('removes the popover', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1).dispose();
                return $.hasData(popoverToggle1, 'popover');
            })).toBe(false);
        });

        test('removes the popover (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('#popoverToggle1').popover('dispose');
                return $.hasData('#popoverToggle1', 'popover');
            })).toBe(false);
        });

        test('removes multiple popovers (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('button').popover('dispose');
                return $.find('button').some((node) =>
                    $.getData(node, 'popover') instanceof UI.Popover,
                );
            })).toBe(false);
        });

        test('removes only its modal hide event', async ({ page }) => {
            await page.evaluate((_) => {
                document.body.innerHTML =
                    '<div class="modal" id="modal">' +
                    '<button id="popoverToggle1" type="button"></button>' +
                    '<button id="popoverToggle2" type="button"></button>' +
                    '</div>';

                const modal = $.findOne('#modal');
                const popoverToggle1 = $.findOne('#popoverToggle1');
                const popoverToggle2 = $.findOne('#popoverToggle2');
                window.modalHideEventTriggered = false;

                $.addEvent(modal, 'hide.ui.modal', (_) => {
                    window.modalHideEventTriggered = true;
                });
                UI.Popover.init(popoverToggle1);
                UI.Popover.init(popoverToggle2).show();
            });
            await advanceClock(page, 150);

            await page.evaluate((_) => {
                UI.Popover.init($.findOne('#popoverToggle1')).dispose();
                $.triggerEvent('#modal', 'hide.ui.modal');
            });

            expect(await page.evaluate((_) => window.modalHideEventTriggered)).toBe(true);
            await advanceClock(page, 150);
            await expect(page.locator('.popover')).toHaveCount(0);
        });

        test('clears popover memory', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                const popover = UI.Popover.init(popoverToggle1);
                popover.dispose();

                for (const key in popover) {
                    if ($._isObject(popover[key]) && !$._isFunction(popover[key])) {
                        return false;
                    }
                }

                return true;
            })).toBe(true);
        });

        test('clears popover memory when node is removed', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                const popover = UI.Popover.init(popoverToggle1);
                $.remove(popoverToggle1);

                for (const key in popover) {
                    if ($._isObject(popover[key]) && !$._isFunction(popover[key])) {
                        return false;
                    }
                }

                return true;
            })).toBe(true);
        });

        test('restores the title attribute', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                $.setAttribute(popoverToggle1, { title: 'Test' });
                UI.Popover.init(popoverToggle1).dispose();
            });

            await expect(page.locator('#popoverToggle1')).toHaveAttribute('title', 'Test');
            await expect(page.locator('#popoverToggle1')).not.toHaveAttribute('data-ui-original-title');
        });
    });

    test.describe('#show', () => {
        test('shows the popover', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1).show();
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#popoverToggle1 + .popover'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#popoverToggle1 + .popover')).toBeVisible();
            await expect(page.locator('#popoverToggle1 + .popover')).toHaveAttribute('role', 'tooltip');
            await expect(page.locator('#popoverToggle1 + .popover')).toHaveAttribute('data-ui-placement', 'right');
            await expect(page.locator('#popoverToggle1 + .popover')).toHaveCSS('position', 'absolute');
        });

        test('shows the popover (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#popoverToggle1').popover('show');
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#popoverToggle1 + .popover'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#popoverToggle1 + .popover')).toBeVisible();
            await expect(page.locator('#popoverToggle1 + .popover')).toHaveAttribute('role', 'tooltip');
        });

        test('shows multiple popovers (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('button').popover('show');
            });
            await advanceClock(page, 150);

            await expect(page.locator('.popover')).toHaveCount(2);
            await expect(page.locator('.popover').nth(0)).toBeVisible();
            await expect(page.locator('.popover').nth(1)).toBeVisible();
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                const popover = UI.Popover.init(popoverToggle1);
                popover.show();
                popover.show();
                popover.show();
            });
            await advanceClock(page, 50);

            await expect(page.locator('.popover')).toHaveCount(1);
            await expectAnimationState(page, [
                {
                    selectors: ['.popover'],
                    active: true,
                },
            ]);
        });

        test('can be called on shown popover', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#popoverToggle1 + .popover');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1).show();
            });

            await expect(page.locator('.popover')).toHaveCount(1);
            await expectAnimationState(page, [
                {
                    selectors: ['.popover'],
                },
            ]);
        });
    });

    test.describe('#hide', () => {
        test('hides the popover', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#popoverToggle1 + .popover');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1).hide();
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#popoverToggle1 + .popover'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('.popover')).toHaveCount(0);
        });

        test('hides the popover (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#popoverToggle1').popover('show');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#popoverToggle1 + .popover');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $('#popoverToggle1').popover('hide');
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#popoverToggle1 + .popover'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('.popover')).toHaveCount(0);
        });

        test('hides multiple popovers (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('button').popover('show');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#popoverToggle1 + .popover');
                $.stop('#popoverToggle2 + .popover');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $('button').popover('hide');
            });
            await advanceClock(page, 150);

            await expect(page.locator('.popover')).toHaveCount(0);
        });

        test('does not remove the popover after hiding', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#popoverToggle1 + .popover');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1).hide();
            });
            await advanceClock(page, 150);

            expect(await page.evaluate((_) =>
                $.getData('#popoverToggle1', 'popover') instanceof UI.Popover)).toBe(true);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#popoverToggle1 + .popover');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                const popover = UI.Popover.init(popoverToggle1);
                popover.hide();
                popover.hide();
                popover.hide();
            });
            await advanceClock(page, 50);

            await expect(page.locator('.popover')).toHaveCount(1);
            await expectAnimationState(page, [
                {
                    selectors: ['.popover'],
                    active: true,
                },
            ]);
        });

        test('can be called on hidden popover', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1).hide();
            });

            await expect(page.locator('.popover')).toHaveCount(0);
        });
    });

    test.describe('#toggle (show)', () => {
        test('shows the popover', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1).toggle();
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#popoverToggle1 + .popover'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#popoverToggle1 + .popover')).toBeVisible();
        });

        test('shows the popover (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#popoverToggle1').popover('toggle');
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#popoverToggle1 + .popover'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#popoverToggle1 + .popover')).toBeVisible();
        });

        test('shows multiple popovers (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('button').popover('toggle');
            });
            await advanceClock(page, 150);

            await expect(page.locator('.popover')).toHaveCount(2);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                const popover = UI.Popover.init(popoverToggle1);
                popover.toggle();
                popover.toggle();
                popover.toggle();
            });
            await advanceClock(page, 50);

            await expect(page.locator('.popover')).toHaveCount(1);
            await expectAnimationState(page, [
                {
                    selectors: ['.popover'],
                    active: true,
                },
            ]);
        });
    });

    test.describe('#toggle (hide)', () => {
        test('hides the popover', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#popoverToggle1 + .popover');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1).toggle();
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#popoverToggle1 + .popover'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('.popover')).toHaveCount(0);
        });

        test('hides the popover (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#popoverToggle1').popover('show');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#popoverToggle1 + .popover');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $('#popoverToggle1').popover('toggle');
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#popoverToggle1 + .popover'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('.popover')).toHaveCount(0);
        });

        test('hide multiple popovers (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('button').popover('show');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#popoverToggle1 + .popover');
                $.stop('#popoverToggle2 + .popover');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $('button').popover('toggle');
            });
            await advanceClock(page, 150);

            await expect(page.locator('.popover')).toHaveCount(0);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#popoverToggle1 + .popover');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                const popover = UI.Popover.init(popoverToggle1);
                popover.toggle();
                popover.toggle();
                popover.toggle();
            });
            await advanceClock(page, 50);

            await expect(page.locator('.popover')).toHaveCount(1);
            await expectAnimationState(page, [
                {
                    selectors: ['.popover'],
                    active: true,
                },
            ]);
        });
    });

    test.describe('#disable', () => {
        test('disables the popover', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                const popover = UI.Popover.init(popoverToggle1);
                popover.disable();
                popover.show();
            });
            await advanceClock(page, 100);

            await expect(page.locator('.popover')).toHaveCount(0);
        });

        test('disables the popover (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#popoverToggle1').popover('disable');
                $('#popoverToggle1').popover('show');
            });
            await advanceClock(page, 100);

            await expect(page.locator('.popover')).toHaveCount(0);
        });

        test('disables multiple popovers (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('button').popover('disable');
                $('button').popover('show');
            });
            await advanceClock(page, 100);

            await expect(page.locator('.popover')).toHaveCount(0);
        });

        test('can be called on a disabled popover', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                const popover = UI.Popover.init(popoverToggle1);
                popover.disable();
                popover.disable();
                popover.show();
            });
            await advanceClock(page, 100);

            await expect(page.locator('.popover')).toHaveCount(0);
        });

        test('allows a visible popover to be hidden programmatically', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1).show();
            });
            await advanceClock(page, 150);
            await page.evaluate((_) => {
                const popover = UI.Popover.init($.findOne('#popoverToggle1'));
                popover.disable();
                popover.hide();
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['.popover'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('.popover')).toHaveCount(0);
        });

        test('ignores hide trigger events when disabled', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1, { trigger: 'hover focus click' }).show();
            });
            await advanceClock(page, 150);
            await page.evaluate((_) => {
                UI.Popover.init($.findOne('#popoverToggle1')).disable();
            });
            await page.locator('#popoverToggle1').dispatchEvent('mouseout');
            await page.locator('#popoverToggle1').dispatchEvent('blur');
            await page.locator('#popoverToggle1').dispatchEvent('click');
            await advanceClock(page, 150);

            await expect(page.locator('.popover')).toHaveCount(1);
            await expect(page.locator('.popover')).toBeVisible();
            await expectAnimationState(page, [
                {
                    selectors: ['.popover'],
                },
            ]);
        });
    });

    test.describe('#enable', () => {
        test('enables the popover', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                const popover = UI.Popover.init(popoverToggle1);
                popover.disable();
                popover.enable();
                popover.show();
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['.popover'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('.popover')).toHaveCount(1);
        });

        test('enables the popover (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#popoverToggle1').popover('disable');
                $('#popoverToggle1').popover('enable');
                $('#popoverToggle1').popover('show');
            });
            await advanceClock(page, 150);

            await expect(page.locator('.popover')).toHaveCount(1);
            await expect(page.locator('.popover')).toBeVisible();
        });

        test('enables multiple popovers (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('button').popover('disable');
                $('button').popover('enable');
                $('button').popover('show');
            });
            await advanceClock(page, 150);

            await expect(page.locator('.popover')).toHaveCount(2);
        });

        test('can be called on an enabled popover', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                const popover = UI.Popover.init(popoverToggle1);
                popover.enable();
                popover.enable();
                popover.show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.popover')).toHaveCount(1);
        });
    });

    test.describe('#refresh', () => {
        test('refreshes the popover title', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#popoverToggle1 + .popover');
            });
            await advanceClock(page, 100);
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                $.setDataset(popoverToggle1, { uiTitle: 'Test' });
                UI.Popover.init(popoverToggle1).refresh();
            });

            await expect(page.locator('#popoverToggle1')).toHaveAttribute('data-ui-title', 'Test');
            await expect(page.locator('#popoverToggle1 + .popover .popover-header')).toHaveText('Test');
        });

        test('refreshes the popover title (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#popoverToggle1').popover('show');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#popoverToggle1 + .popover');
            });
            await advanceClock(page, 100);
            await page.evaluate((_) => {
                $('#popoverToggle1')
                    .setDataset({ uiTitle: 'Test' })
                    .popover('refresh');
            });

            await expect(page.locator('#popoverToggle1 + .popover .popover-header')).toHaveText('Test');
        });

        test('refreshes multiple popovers titles (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('button').popover('show');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#popoverToggle1 + .popover');
                $.stop('#popoverToggle2 + .popover');
            });
            await advanceClock(page, 100);
            await page.evaluate((_) => {
                $('button')
                    .setDataset({ uiTitle: 'Test' })
                    .popover('refresh');
            });

            await expect(page.locator('.popover-header')).toHaveText(['Test', 'Test']);
        });

        test('refreshes the popover content', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#popoverToggle1 + .popover');
            });
            await advanceClock(page, 100);
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                $.setDataset(popoverToggle1, { uiContent: 'Test' });
                UI.Popover.init(popoverToggle1).refresh();
            });

            await expect(page.locator('#popoverToggle1')).toHaveAttribute('data-ui-content', 'Test');
            await expect(page.locator('#popoverToggle1 + .popover .popover-body')).toHaveText('Test');
        });

        test('refreshes the popover content (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#popoverToggle1').popover('show');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#popoverToggle1 + .popover');
            });
            await advanceClock(page, 100);
            await page.evaluate((_) => {
                $('#popoverToggle1')
                    .setDataset({ uiContent: 'Test' })
                    .popover('refresh');
            });

            await expect(page.locator('#popoverToggle1 + .popover .popover-body')).toHaveText('Test');
        });

        test('refreshes multiple popovers content (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('button').popover('show');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#popoverToggle1 + .popover');
                $.stop('#popoverToggle2 + .popover');
            });
            await advanceClock(page, 100);
            await page.evaluate((_) => {
                $('button')
                    .setDataset({ uiContent: 'Test' })
                    .popover('refresh');
            });

            await expect(page.locator('.popover-body')).toHaveText(['Test', 'Test']);
        });
    });

    test.describe('events', () => {
        test('triggers show event', async ({ page }) => {
            const eventTriggered = await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                let triggered = false;

                $.addEvent(popoverToggle1, 'show.ui.popover', (_) => {
                    triggered = true;
                });
                UI.Popover.init(popoverToggle1).show();

                return triggered;
            });

            expect(eventTriggered).toBe(true);
        });

        test('triggers shown event', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                window.popoverShownEventTriggered = false;

                $.addEvent(popoverToggle1, 'shown.ui.popover', (_) => {
                    window.popoverShownEventTriggered = true;
                });
                UI.Popover.init(popoverToggle1).show();
            });
            await advanceClock(page, 150);

            expect(await page.evaluate((_) => window.popoverShownEventTriggered)).toBe(true);
            await expect(page.locator('.popover')).toHaveCount(1);
        });

        test('triggers hide event', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#popoverToggle1 + .popover');
            });
            await advanceClock(page, 50);
            const eventTriggered = await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                let triggered = false;

                $.addEvent(popoverToggle1, 'hide.ui.popover', (_) => {
                    triggered = true;
                });
                UI.Popover.init(popoverToggle1).hide();

                return triggered;
            });

            expect(eventTriggered).toBe(true);
        });

        test('triggers hidden event', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#popoverToggle1 + .popover');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                window.popoverHiddenEventTriggered = false;

                $.addEvent(popoverToggle1, 'hidden.ui.popover', (_) => {
                    window.popoverHiddenEventTriggered = true;
                });
                UI.Popover.init(popoverToggle1).hide();
            });
            await advanceClock(page, 150);

            expect(await page.evaluate((_) => window.popoverHiddenEventTriggered)).toBe(true);
            await expect(page.locator('.popover')).toHaveCount(0);
        });

        test('can be prevented from showing', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                $.addEvent(popoverToggle1, 'show.ui.popover', (_) => false);
                UI.Popover.init(popoverToggle1).show();
            });
            await advanceClock(page, 50);

            await expect(page.locator('.popover')).toHaveCount(0);
        });

        test('can be prevented from showing (prevent default)', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                $.addEvent(popoverToggle1, 'show.ui.popover', (event) => {
                    event.preventDefault();
                });
                UI.Popover.init(popoverToggle1).show();
            });
            await advanceClock(page, 50);

            await expect(page.locator('.popover')).toHaveCount(0);
        });

        test('can be prevented from hiding', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#popoverToggle1 + .popover');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                $.addEvent(popoverToggle1, 'hide.ui.popover', (_) => false);
                UI.Popover.init(popoverToggle1).hide();
            });
            await advanceClock(page, 50);

            await expect(page.locator('.popover')).toHaveCount(1);
            await expectAnimationState(page, [
                {
                    selectors: ['.popover'],
                },
            ]);
        });

        test('can be prevented from hiding (prevent default)', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#popoverToggle1 + .popover');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                $.addEvent(popoverToggle1, 'hide.ui.popover', (event) => {
                    event.preventDefault();
                });
                UI.Popover.init(popoverToggle1).hide();
            });
            await advanceClock(page, 50);

            await expect(page.locator('.popover')).toHaveCount(1);
            await expectAnimationState(page, [
                {
                    selectors: ['.popover'],
                },
            ]);
        });
    });

    test.describe('title option', () => {
        test('works with title option', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1, { title: 'Test' }).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.popover-header')).toHaveText('Test');
        });

        test('works with title option (data-ui-title)', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                $.setDataset(popoverToggle1, { uiTitle: 'Test' });
                UI.Popover.init(popoverToggle1).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('#popoverToggle1')).toHaveAttribute('data-ui-title', 'Test');
            await expect(page.locator('.popover-header')).toHaveText('Test');
        });

        test('works with title option (title)', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                $.setAttribute(popoverToggle1, { title: 'Test' });
                UI.Popover.init(popoverToggle1).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('#popoverToggle1')).not.toHaveAttribute('title');
            await expect(page.locator('#popoverToggle1')).toHaveAttribute('data-ui-original-title', 'Test');
            await expect(page.locator('.popover-header')).toHaveText('Test');
        });

        test('works with title option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#popoverToggle1')
                    .popover({ title: 'Test' })
                    .show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.popover-header')).toHaveText('Test');
        });

        test('prioritizes dataset over setting', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                $.setDataset(popoverToggle1, { uiTitle: 'Test' });
                UI.Popover.init(popoverToggle1, { title: 'Test 2' }).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('#popoverToggle1')).toHaveAttribute('data-ui-title', 'Test');
            await expect(page.locator('.popover-header')).toHaveText('Test');
        });

        test('prioritizes setting over attribute', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                $.setAttribute(popoverToggle1, { title: 'Test 2' });
                UI.Popover.init(popoverToggle1, { title: 'Test' }).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('#popoverToggle1')).toHaveAttribute('data-ui-original-title', 'Test 2');
            await expect(page.locator('.popover-header')).toHaveText('Test');
        });
    });

    test.describe('content option', () => {
        test('works with content option', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1, { content: 'Test' }).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.popover-header')).toBeHidden();
            await expect(page.locator('.popover-body')).toHaveText('Test');
        });

        test('works with content option (data-ui-content)', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                $.setDataset(popoverToggle1, { uiContent: 'Test' });
                UI.Popover.init(popoverToggle1).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('#popoverToggle1')).toHaveAttribute('data-ui-content', 'Test');
            await expect(page.locator('.popover-body')).toHaveText('Test');
        });

        test('works with content option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#popoverToggle1')
                    .popover({ content: 'Test' })
                    .show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.popover-body')).toHaveText('Test');
        });

        test('prioritizes dataset over setting', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                $.setDataset(popoverToggle1, { uiContent: 'Test' });
                UI.Popover.init(popoverToggle1, { content: 'Test 2' }).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('#popoverToggle1')).toHaveAttribute('data-ui-content', 'Test');
            await expect(page.locator('.popover-body')).toHaveText('Test');
        });
    });

    test.describe('template option', () => {
        test('works with template option', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1, {
                    template: '<div class="popover" role="tooltip" data-test="Test"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
                }).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.popover')).toHaveAttribute('data-test', 'Test');
            await expect(page.locator('.popover > .popover-arrow')).toHaveCount(1);
            await expect(page.locator('.popover > .popover-header')).toHaveCount(1);
            await expect(page.locator('.popover > .popover-body')).toHaveCount(1);
        });

        test('works with template option (data-ui-template)', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                $.setDataset(popoverToggle1, {
                    uiTemplate: '<div class="popover" role="tooltip" data-test="Test"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
                });
                UI.Popover.init(popoverToggle1).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('#popoverToggle1')).toHaveAttribute(
                'data-ui-template',
                '<div class="popover" role="tooltip" data-test="Test"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
            );
            await expect(page.locator('.popover')).toHaveAttribute('data-test', 'Test');
        });

        test('works with template option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#popoverToggle1').popover({
                    template: '<div class="popover" role="tooltip" data-test="Test"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
                }).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.popover')).toHaveAttribute('data-test', 'Test');
        });
    });

    test.describe('customClass option', () => {
        test('works with customClass option', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1, { customClass: 'test' }).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.popover')).toHaveClass(/\btest\b/);
        });

        test('works with customClass option (data-ui-custom-class)', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                $.setDataset(popoverToggle1, { uiCustomClass: 'test' });
                UI.Popover.init(popoverToggle1).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('#popoverToggle1')).toHaveAttribute('data-ui-custom-class', 'test');
            await expect(page.locator('.popover')).toHaveClass(/\btest\b/);
        });

        test('works with customClass option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#popoverToggle1')
                    .popover({ customClass: 'test' })
                    .show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.popover')).toHaveClass(/\btest\b/);
        });
    });

    test.describe('duration option', () => {
        test('works with duration option on', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1, { duration: 200 }).show();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['.popover'],
                    progress: 0.875,
                },
            ]);
        });

        test('works with duration option on (data-ui-duration)', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                $.setDataset(popoverToggle1, { uiDuration: 200 });
                UI.Popover.init(popoverToggle1).show();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['.popover'],
                    progress: 0.875,
                },
            ]);
        });

        test('works with duration option on (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#popoverToggle1')
                    .popover({ duration: 200 })
                    .show();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['.popover'],
                    progress: 0.875,
                },
            ]);
        });

        test('works with duration option on hide', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1, { duration: 200 }).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('.popover');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1).hide();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['.popover'],
                    progress: 0.875,
                },
            ]);
        });

        test('works with duration option on hide (data-ui-duration)', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                $.setDataset(popoverToggle1, { uiDuration: 200 });
                UI.Popover.init(popoverToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('.popover');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1).hide();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['.popover'],
                    progress: 0.875,
                },
            ]);
        });

        test('works with duration option on hide (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#popoverToggle1')
                    .popover({ duration: 200 })
                    .show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('.popover');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $('#popoverToggle1').popover('hide');
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['.popover'],
                    progress: 0.875,
                },
            ]);
        });
    });

    test.describe('html option', () => {
        test('escapes html tags in title', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1, { title: '<b>Test</b>' }).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.popover-header')).toHaveText('<b>Test</b>');
            await expect(page.locator('.popover-header b')).toHaveCount(0);
        });

        test('works with html option for title', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1, { title: '<b>Test</b>', html: true }).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.popover-header > b')).toHaveText('Test');
        });

        test('works with html option for title (data-ui-html)', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                $.setDataset(popoverToggle1, { uiHtml: true });
                UI.Popover.init(popoverToggle1, { title: '<b>Test</b>' }).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('#popoverToggle1')).toHaveAttribute('data-ui-html', 'true');
            await expect(page.locator('.popover-header > b')).toHaveText('Test');
        });

        test('works with html option for title (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#popoverToggle1')
                    .popover({ title: '<b>Test</b>', html: true })
                    .show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.popover-header > b')).toHaveText('Test');
        });

        test('escapes html tags in content', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1, { content: '<b>Test</b>' }).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.popover-body')).toHaveText('<b>Test</b>');
            await expect(page.locator('.popover-body b')).toHaveCount(0);
        });

        test('works with html option for content', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1, { content: '<b>Test</b>', html: true }).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.popover-body > b')).toHaveText('Test');
        });

        test('works with html option for content (data-ui-html)', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                $.setDataset(popoverToggle1, { uiHtml: true });
                UI.Popover.init(popoverToggle1, { content: '<b>Test</b>' }).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('#popoverToggle1')).toHaveAttribute('data-ui-html', 'true');
            await expect(page.locator('.popover-body > b')).toHaveText('Test');
        });

        test('works with html option for content (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#popoverToggle1')
                    .popover({ content: '<b>Test</b>', html: true })
                    .show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.popover-body > b')).toHaveText('Test');
        });
    });

    test.describe('trigger option', () => {
        test('shows on mouseover with hover trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1, { trigger: 'hover' });
            });
            await page.locator('#popoverToggle1').hover();
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['.popover'],
                    active: true,
                },
            ]);
        });

        test('shows on focus with focus trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1, { trigger: 'focus' });
            });
            await page.locator('#popoverToggle1').focus();
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['.popover'],
                    active: true,
                },
            ]);
        });

        test('shows on click with click trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1, { trigger: 'click' });
            });
            await page.locator('#popoverToggle1').click();
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['.popover'],
                    active: true,
                },
            ]);
        });

        test('hides on mouseout with hover trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1, { trigger: 'hover' }).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('.popover');
            });
            await advanceClock(page, 50);
            await page.locator('#popoverToggle1').dispatchEvent('mouseout');
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['.popover'],
                    active: true,
                },
            ]);
        });

        test('hides on blur with focus trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1, { trigger: 'focus' }).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('.popover');
            });
            await advanceClock(page, 50);
            await page.locator('#popoverToggle1').dispatchEvent('blur');
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['.popover'],
                    active: true,
                },
            ]);
        });

        test('hides on click with click trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1, { trigger: 'click' }).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('.popover');
            });
            await advanceClock(page, 50);
            await page.locator('#popoverToggle1').click();
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['.popover'],
                    active: true,
                },
            ]);
        });

        test('does not on mouseover without hover trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1, { trigger: '' });
            });
            await page.locator('#popoverToggle1').hover();
            await advanceClock(page, 50);

            await expect(page.locator('.popover')).toHaveCount(0);
        });

        test('does not on focus without focus trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1, { trigger: '' });
            });
            await page.locator('#popoverToggle1').focus();
            await advanceClock(page, 50);

            await expect(page.locator('.popover')).toHaveCount(0);
        });

        test('does not on click without click trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1, { trigger: '' });
            });
            await page.locator('#popoverToggle1').click();
            await advanceClock(page, 50);

            await expect(page.locator('.popover')).toHaveCount(0);
        });

        test('does not hide on mouseout without hover trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1, { trigger: '' }).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('.popover');
            });
            await advanceClock(page, 50);
            await page.locator('#popoverToggle1').dispatchEvent('mouseout');
            await advanceClock(page, 50);

            await expect(page.locator('.popover')).toHaveCount(1);
            await expect(page.locator('.popover')).toBeVisible();
            await expectAnimationState(page, [
                {
                    selectors: ['.popover'],
                },
            ]);
        });

        test('does not hide on blur without focus trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1, { trigger: '' }).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('.popover');
            });
            await advanceClock(page, 50);
            await page.locator('#popoverToggle1').dispatchEvent('blur');
            await advanceClock(page, 50);

            await expect(page.locator('.popover')).toHaveCount(1);
            await expect(page.locator('.popover')).toBeVisible();
            await expectAnimationState(page, [
                {
                    selectors: ['.popover'],
                },
            ]);
        });

        test('does not hide on click without click trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1, { trigger: '' }).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('.popover');
            });
            await advanceClock(page, 50);
            await page.locator('#popoverToggle1').click();
            await advanceClock(page, 50);

            await expect(page.locator('.popover')).toHaveCount(1);
            await expect(page.locator('.popover')).toBeVisible();
            await expectAnimationState(page, [
                {
                    selectors: ['.popover'],
                },
            ]);
        });

        test('works with trigger option (data-ui-trigger)', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                $.setDataset(popoverToggle1, { uiTrigger: 'click' });
                UI.Popover.init(popoverToggle1);
            });
            await page.locator('#popoverToggle1').click();
            await advanceClock(page, 50);

            await expect(page.locator('#popoverToggle1')).toHaveAttribute('data-ui-trigger', 'click');
            await expectAnimationState(page, [
                {
                    selectors: ['.popover'],
                    active: true,
                },
            ]);
        });

        test('works with trigger option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#popoverToggle1').popover({ trigger: 'click' });
            });
            await page.locator('#popoverToggle1').click();
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['.popover'],
                    active: true,
                },
            ]);
        });

        test('works with multiple trigger options', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1, { trigger: 'hover focus' });
            });
            await page.locator('#popoverToggle1').dispatchEvent('mouseover');
            await advanceClock(page, 150);
            await page.locator('#popoverToggle1').dispatchEvent('blur');
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['.popover'],
                    active: true,
                },
            ]);
        });
    });

    test.describe('appendTo option', () => {
        test('works with appendTo option', async ({ page }) => {
            await page.evaluate((_) => {
                const testContainer = $.create('div', { class: 'test' });
                $.append(document.body, testContainer);
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1, { appendTo: '.test' }).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.test > .popover')).toHaveCount(1);
            await expect(page.locator('#popoverToggle1 + .popover')).toHaveCount(0);
        });

        test('works with appendTo option (data-ui-append-to)', async ({ page }) => {
            await page.evaluate((_) => {
                const testContainer = $.create('div', { class: 'test' });
                $.append(document.body, testContainer);
                const popoverToggle1 = $.findOne('#popoverToggle1');
                $.setDataset(popoverToggle1, { uiAppendTo: '.test' });
                UI.Popover.init(popoverToggle1).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('#popoverToggle1')).toHaveAttribute('data-ui-append-to', '.test');
            await expect(page.locator('.test > .popover')).toHaveCount(1);
        });

        test('works with appendTo option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                const testContainer = $.create('div', { class: 'test' });
                $.append(document.body, testContainer);
                $('#popoverToggle1')
                    .popover({ appendTo: '.test' })
                    .show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.test > .popover')).toHaveCount(1);
            await expect(page.locator('.test > .popover')).toBeVisible();
        });
    });

    test.describe('sanitize option', () => {
        test('sanitizes html tags in title', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1, {
                    title: '<b data-test="test">Test</b>',
                    html: true,
                }).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.popover-header > b')).toHaveText('Test');
            await expect(page.locator('.popover-header > b')).not.toHaveAttribute('data-test');
        });

        test('works with sanitize option for title', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1, {
                    title: '<b data-test="test">Test</b>',
                    html: true,
                    sanitize: false,
                }).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.popover-header > b')).toHaveAttribute('data-test', 'test');
            await expect(page.locator('.popover-header > b')).toHaveText('Test');
        });

        test('works with sanitize option for title (data-ui-sanitize)', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                $.setDataset(popoverToggle1, { uiSanitize: false });
                UI.Popover.init(popoverToggle1, {
                    title: '<b data-test="test">Test</b>',
                    html: true,
                }).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('#popoverToggle1')).toHaveAttribute('data-ui-sanitize', 'false');
            await expect(page.locator('.popover-header > b')).toHaveAttribute('data-test', 'test');
        });

        test('works with sanitize option for title (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#popoverToggle1')
                    .popover({
                        title: '<b data-test="test">Test</b>',
                        html: true,
                        sanitize: false,
                    })
                    .show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.popover-header > b')).toHaveAttribute('data-test', 'test');
            await expect(page.locator('.popover-header > b')).toHaveText('Test');
        });

        test('sanitizes html tags in content', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1, {
                    content: '<b data-test="test">Test</b>',
                    html: true,
                }).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.popover-body > b')).toHaveText('Test');
            await expect(page.locator('.popover-body > b')).not.toHaveAttribute('data-test');
        });

        test('works with sanitize option for content', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                UI.Popover.init(popoverToggle1, {
                    content: '<b data-test="test">Test</b>',
                    html: true,
                    sanitize: false,
                }).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.popover-body > b')).toHaveAttribute('data-test', 'test');
            await expect(page.locator('.popover-body > b')).toHaveText('Test');
        });

        test('works with sanitize option for content (data-ui-sanitize)', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popoverToggle1');
                $.setDataset(popoverToggle1, { uiSanitize: false });
                UI.Popover.init(popoverToggle1, {
                    content: '<b data-test="test">Test</b>',
                    html: true,
                }).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('#popoverToggle1')).toHaveAttribute('data-ui-sanitize', 'false');
            await expect(page.locator('.popover-body > b')).toHaveAttribute('data-test', 'test');
        });

        test('works with sanitize option for content (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#popoverToggle1')
                    .popover({
                        content: '<b data-test="test">Test</b>',
                        html: true,
                        sanitize: false,
                    })
                    .show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.popover-body > b')).toHaveAttribute('data-test', 'test');
            await expect(page.locator('.popover-body > b')).toHaveText('Test');
        });
    });
});
