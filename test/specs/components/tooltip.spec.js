import { expect, test } from '@playwright/test';
import { advanceClock, resetPage, setupClock } from '../../setup/browser.js';
import { expectAnimationState } from '../../support/assertions/animation.js';

test.beforeEach(async ({ page }) => {
    await setupClock(page);
    await resetPage(page);
});

test.describe('Tooltip', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>';
        });
    });

    test.describe('#init', () => {
        test('creates a tooltip', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                return UI.Tooltip.init(tooltipToggle1) instanceof UI.Tooltip;
            })).toBe(true);
        });

        test('creates a tooltip (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('#tooltipToggle1').tooltip();
                return $.getData('#tooltipToggle1', 'tooltip') instanceof UI.Tooltip;
            })).toBe(true);
        });

        test('creates multiple tooltips (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('button').tooltip();
                return $.find('button').every((node) =>
                    $.getData(node, 'tooltip') instanceof UI.Tooltip,
                );
            })).toBe(true);
        });

        test('returns the tooltip (query)', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $('#tooltipToggle1').tooltip() instanceof UI.Tooltip)).toBe(true);
        });
    });

    test.describe('#dispose', () => {
        test('removes the tooltip', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1).dispose();
                return $.hasData(tooltipToggle1, 'tooltip');
            })).toBe(false);
        });

        test('removes the tooltip (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('#tooltipToggle1').tooltip('dispose');
                return $.hasData('#tooltipToggle1', 'tooltip');
            })).toBe(false);
        });

        test('removes multiple tooltips (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('button').tooltip('dispose');
                return $.find('button').some((node) =>
                    $.getData(node, 'tooltip') instanceof UI.Tooltip,
                );
            })).toBe(false);
        });

        test('removes only its modal hide event', async ({ page }) => {
            await page.evaluate((_) => {
                document.body.innerHTML =
                    '<div class="modal" id="modal">' +
                    '<button id="tooltipToggle1" type="button"></button>' +
                    '<button id="tooltipToggle2" type="button"></button>' +
                    '</div>';

                const modal = $.findOne('#modal');
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                const tooltipToggle2 = $.findOne('#tooltipToggle2');
                window.modalHideEventTriggered = false;

                $.addEvent(modal, 'hide.ui.modal', (_) => {
                    window.modalHideEventTriggered = true;
                });
                UI.Tooltip.init(tooltipToggle1);
                UI.Tooltip.init(tooltipToggle2).show();
            });
            await advanceClock(page, 150);

            await page.evaluate((_) => {
                UI.Tooltip.init($.findOne('#tooltipToggle1')).dispose();
                $.triggerEvent('#modal', 'hide.ui.modal');
            });

            expect(await page.evaluate((_) => window.modalHideEventTriggered)).toBe(true);
            await advanceClock(page, 150);
            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('clears tooltip memory', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                const tooltip = UI.Tooltip.init(tooltipToggle1);
                tooltip.dispose();

                for (const key in tooltip) {
                    if ($._isObject(tooltip[key]) && !$._isFunction(tooltip[key])) {
                        return false;
                    }
                }

                return true;
            })).toBe(true);
        });

        test('clears tooltip memory when node is removed', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                const tooltip = UI.Tooltip.init(tooltipToggle1);
                $.remove(tooltipToggle1);

                for (const key in tooltip) {
                    if ($._isObject(tooltip[key]) && !$._isFunction(tooltip[key])) {
                        return false;
                    }
                }

                return true;
            })).toBe(true);
        });

        test('restores the title attribute', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                $.setAttribute(tooltipToggle1, { title: 'Test' });
                UI.Tooltip.init(tooltipToggle1).dispose();
            });

            await expect(page.locator('#tooltipToggle1')).toHaveAttribute('title', 'Test');
            await expect(page.locator('#tooltipToggle1')).not.toHaveAttribute('data-ui-original-title');
        });
    });

    test.describe('#show', () => {
        test('shows the tooltip', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1).show();
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#tooltipToggle1 + .tooltip'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#tooltipToggle1 + .tooltip')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#tooltipToggle1 + .tooltip')).toBeVisible();
            await expect(page.locator('#tooltipToggle1 + .tooltip')).toHaveAttribute('role', 'tooltip');
            await expect(page.locator('#tooltipToggle1 + .tooltip')).toHaveAttribute('data-ui-placement', 'right');
            await expect(page.locator('#tooltipToggle1 + .tooltip')).toHaveCSS('position', 'absolute');
        });

        test('shows the tooltip (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tooltipToggle1').tooltip('show');
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#tooltipToggle1 + .tooltip'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#tooltipToggle1 + .tooltip')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#tooltipToggle1 + .tooltip')).toBeVisible();
            await expect(page.locator('#tooltipToggle1 + .tooltip')).toHaveAttribute('role', 'tooltip');
        });

        test('shows multiple tooltips (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('button').tooltip('show');
            });
            await advanceClock(page, 150);

            await expect(page.locator('.tooltip')).toHaveCount(2);
            await expect(page.locator('.tooltip').nth(0)).toHaveClass(/\bshow\b/);
            await expect(page.locator('.tooltip').nth(0)).toBeVisible();
            await expect(page.locator('.tooltip').nth(1)).toHaveClass(/\bshow\b/);
            await expect(page.locator('.tooltip').nth(1)).toBeVisible();
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                const tooltip = UI.Tooltip.init(tooltipToggle1);
                tooltip.show();
                tooltip.show();
                tooltip.show();
            });
            await advanceClock(page, 50);

            await expect(page.locator('.tooltip')).toHaveCount(1);
            await expectAnimationState(page, [
                {
                    selectors: ['.tooltip'],
                    active: true,
                },
            ]);
        });

        test('can be called on shown tooltip', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#tooltipToggle1 + .tooltip');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1).show();
            });

            await expect(page.locator('.tooltip')).toHaveCount(1);
            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
            await expectAnimationState(page, [
                {
                    selectors: ['.tooltip'],
                },
            ]);
        });
    });

    test.describe('#hide', () => {
        test('hides the tooltip', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#tooltipToggle1 + .tooltip');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1).hide();
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#tooltipToggle1 + .tooltip'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('hides the tooltip (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tooltipToggle1').tooltip('show');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#tooltipToggle1 + .tooltip');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $('#tooltipToggle1').tooltip('hide');
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#tooltipToggle1 + .tooltip'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('hides multiple tooltips (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('button').tooltip('show');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#tooltipToggle1 + .tooltip');
                $.stop('#tooltipToggle2 + .tooltip');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $('button').tooltip('hide');
            });
            await advanceClock(page, 150);

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('does not remove the tooltip after hiding', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#tooltipToggle1 + .tooltip');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1).hide();
            });
            await advanceClock(page, 150);

            expect(await page.evaluate((_) =>
                $.getData('#tooltipToggle1', 'tooltip') instanceof UI.Tooltip)).toBe(true);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#tooltipToggle1 + .tooltip');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                const tooltip = UI.Tooltip.init(tooltipToggle1);
                tooltip.hide();
                tooltip.hide();
                tooltip.hide();
            });
            await advanceClock(page, 50);

            await expect(page.locator('.tooltip')).toHaveCount(1);
            await expectAnimationState(page, [
                {
                    selectors: ['.tooltip'],
                    active: true,
                },
            ]);
        });

        test('can be called on hidden tooltip', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1).hide();
            });

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });
    });

    test.describe('#toggle (show)', () => {
        test('shows the tooltip', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1).toggle();
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#tooltipToggle1 + .tooltip'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#tooltipToggle1 + .tooltip')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#tooltipToggle1 + .tooltip')).toBeVisible();
        });

        test('shows the tooltip (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tooltipToggle1').tooltip('toggle');
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#tooltipToggle1 + .tooltip'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#tooltipToggle1 + .tooltip')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#tooltipToggle1 + .tooltip')).toBeVisible();
        });

        test('shows multiple tooltips (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('button').tooltip('toggle');
            });
            await advanceClock(page, 150);

            await expect(page.locator('.tooltip')).toHaveCount(2);
            await expect(page.locator('.tooltip').nth(0)).toHaveClass(/\bshow\b/);
            await expect(page.locator('.tooltip').nth(1)).toHaveClass(/\bshow\b/);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                const tooltip = UI.Tooltip.init(tooltipToggle1);
                tooltip.toggle();
                tooltip.toggle();
                tooltip.toggle();
            });
            await advanceClock(page, 50);

            await expect(page.locator('.tooltip')).toHaveCount(1);
            await expectAnimationState(page, [
                {
                    selectors: ['.tooltip'],
                    active: true,
                },
            ]);
        });
    });

    test.describe('#toggle (hide)', () => {
        test('hides the tooltip', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#tooltipToggle1 + .tooltip');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1).toggle();
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#tooltipToggle1 + .tooltip'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('hides the tooltip (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tooltipToggle1').tooltip('show');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#tooltipToggle1 + .tooltip');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $('#tooltipToggle1').tooltip('toggle');
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#tooltipToggle1 + .tooltip'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('hide multiple tooltips (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('button').tooltip('show');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#tooltipToggle1 + .tooltip');
                $.stop('#tooltipToggle2 + .tooltip');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $('button').tooltip('toggle');
            });
            await advanceClock(page, 150);

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#tooltipToggle1 + .tooltip');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                const tooltip = UI.Tooltip.init(tooltipToggle1);
                tooltip.toggle();
                tooltip.toggle();
                tooltip.toggle();
            });
            await advanceClock(page, 50);

            await expect(page.locator('.tooltip')).toHaveCount(1);
            await expectAnimationState(page, [
                {
                    selectors: ['.tooltip'],
                    active: true,
                },
            ]);
        });
    });

    test.describe('#disable', () => {
        test('disables the tooltip', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                const tooltip = UI.Tooltip.init(tooltipToggle1);
                tooltip.disable();
                tooltip.show();
            });
            await advanceClock(page, 100);

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('disables the tooltip (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tooltipToggle1').tooltip('disable');
                $('#tooltipToggle1').tooltip('show');
            });
            await advanceClock(page, 100);

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('disables multiple tooltips (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('button').tooltip('disable');
                $('button').tooltip('show');
            });
            await advanceClock(page, 100);

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('can be called on a disabled tooltip', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                const tooltip = UI.Tooltip.init(tooltipToggle1);
                tooltip.disable();
                tooltip.disable();
                tooltip.show();
            });
            await advanceClock(page, 100);

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });
    });

    test.describe('#enable', () => {
        test('enables the tooltip', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                const tooltip = UI.Tooltip.init(tooltipToggle1);
                tooltip.disable();
                tooltip.enable();
                tooltip.show();
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['.tooltip'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('.tooltip')).toHaveCount(1);
            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
        });

        test('enables the tooltip (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tooltipToggle1').tooltip('disable');
                $('#tooltipToggle1').tooltip('enable');
                $('#tooltipToggle1').tooltip('show');
            });
            await advanceClock(page, 150);

            await expect(page.locator('.tooltip')).toHaveCount(1);
            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
            await expect(page.locator('.tooltip')).toBeVisible();
        });

        test('enables multiple tooltips (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('button').tooltip('disable');
                $('button').tooltip('enable');
                $('button').tooltip('show');
            });
            await advanceClock(page, 150);

            await expect(page.locator('.tooltip')).toHaveCount(2);
            await expect(page.locator('.tooltip').nth(0)).toHaveClass(/\bshow\b/);
            await expect(page.locator('.tooltip').nth(1)).toHaveClass(/\bshow\b/);
        });

        test('can be called on an enabled tooltip', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                const tooltip = UI.Tooltip.init(tooltipToggle1);
                tooltip.enable();
                tooltip.enable();
                tooltip.show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.tooltip')).toHaveCount(1);
            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
        });
    });

    test.describe('#refresh', () => {
        test('refreshes the tooltip title', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#tooltipToggle1 + .tooltip');
            });
            await advanceClock(page, 100);
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                $.setDataset(tooltipToggle1, { uiTitle: 'Test' });
                UI.Tooltip.init(tooltipToggle1).refresh();
            });

            await expect(page.locator('#tooltipToggle1')).toHaveAttribute('data-ui-title', 'Test');
            await expect(page.locator('#tooltipToggle1 + .tooltip .tooltip-inner')).toHaveText('Test');
        });

        test('refreshes the tooltip title (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tooltipToggle1').tooltip('show');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#tooltipToggle1 + .tooltip');
            });
            await advanceClock(page, 100);
            await page.evaluate((_) => {
                $('#tooltipToggle1')
                    .setDataset({ uiTitle: 'Test' })
                    .tooltip('refresh');
            });

            await expect(page.locator('#tooltipToggle1 + .tooltip .tooltip-inner')).toHaveText('Test');
        });

        test('refreshes multiple tooltips titles (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('button').tooltip('show');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#tooltipToggle1 + .tooltip');
                $.stop('#tooltipToggle2 + .tooltip');
            });
            await advanceClock(page, 100);
            await page.evaluate((_) => {
                $('button')
                    .setDataset({ uiTitle: 'Test' })
                    .tooltip('refresh');
            });

            await expect(page.locator('.tooltip-inner')).toHaveText(['Test', 'Test']);
        });
    });

    test.describe('events', () => {
        test('triggers show event', async ({ page }) => {
            const eventTriggered = await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                let triggered = false;

                $.addEvent(tooltipToggle1, 'show.ui.tooltip', (_) => {
                    triggered = true;
                });
                UI.Tooltip.init(tooltipToggle1).show();

                return triggered;
            });

            expect(eventTriggered).toBe(true);
        });

        test('triggers shown event', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                window.tooltipShownEventTriggered = false;

                $.addEvent(tooltipToggle1, 'shown.ui.tooltip', (_) => {
                    window.tooltipShownEventTriggered = true;
                });
                UI.Tooltip.init(tooltipToggle1).show();
            });
            await advanceClock(page, 150);

            expect(await page.evaluate((_) => window.tooltipShownEventTriggered)).toBe(true);
            await expect(page.locator('.tooltip')).toHaveCount(1);
            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
        });

        test('triggers hide event', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#tooltipToggle1 + .tooltip');
            });
            await advanceClock(page, 50);
            const eventTriggered = await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                let triggered = false;

                $.addEvent(tooltipToggle1, 'hide.ui.tooltip', (_) => {
                    triggered = true;
                });
                UI.Tooltip.init(tooltipToggle1).hide();

                return triggered;
            });

            expect(eventTriggered).toBe(true);
        });

        test('triggers hidden event', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#tooltipToggle1 + .tooltip');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                window.tooltipHiddenEventTriggered = false;

                $.addEvent(tooltipToggle1, 'hidden.ui.tooltip', (_) => {
                    window.tooltipHiddenEventTriggered = true;
                });
                UI.Tooltip.init(tooltipToggle1).hide();
            });
            await advanceClock(page, 150);

            expect(await page.evaluate((_) => window.tooltipHiddenEventTriggered)).toBe(true);
            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('can be prevented from showing', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                $.addEvent(tooltipToggle1, 'show.ui.tooltip', (_) => false);
                UI.Tooltip.init(tooltipToggle1).show();
            });
            await advanceClock(page, 50);

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('can be prevented from showing (prevent default)', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                $.addEvent(tooltipToggle1, 'show.ui.tooltip', (event) => {
                    event.preventDefault();
                });
                UI.Tooltip.init(tooltipToggle1).show();
            });
            await advanceClock(page, 50);

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('can be prevented from hiding', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#tooltipToggle1 + .tooltip');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                $.addEvent(tooltipToggle1, 'hide.ui.tooltip', (_) => false);
                UI.Tooltip.init(tooltipToggle1).hide();
            });
            await advanceClock(page, 50);

            await expect(page.locator('.tooltip')).toHaveCount(1);
            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
            await expectAnimationState(page, [
                {
                    selectors: ['.tooltip'],
                },
            ]);
        });

        test('can be prevented from hiding (prevent default)', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#tooltipToggle1 + .tooltip');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                $.addEvent(tooltipToggle1, 'hide.ui.tooltip', (event) => {
                    event.preventDefault();
                });
                UI.Tooltip.init(tooltipToggle1).hide();
            });
            await advanceClock(page, 50);

            await expect(page.locator('.tooltip')).toHaveCount(1);
            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
            await expectAnimationState(page, [
                {
                    selectors: ['.tooltip'],
                },
            ]);
        });
    });

    test.describe('title option', () => {
        test('works with title option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { title: 'Test' }).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
            await expect(page.locator('.tooltip-inner')).toHaveText('Test');
        });

        test('works with title option (data-ui-title)', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                $.setDataset(tooltipToggle1, { uiTitle: 'Test' });
                UI.Tooltip.init(tooltipToggle1).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('#tooltipToggle1')).toHaveAttribute('data-ui-title', 'Test');
            await expect(page.locator('.tooltip-inner')).toHaveText('Test');
        });

        test('works with title option (title)', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                $.setAttribute(tooltipToggle1, { title: 'Test' });
                UI.Tooltip.init(tooltipToggle1).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('#tooltipToggle1')).not.toHaveAttribute('title');
            await expect(page.locator('#tooltipToggle1')).toHaveAttribute('data-ui-original-title', 'Test');
            await expect(page.locator('.tooltip-inner')).toHaveText('Test');
        });

        test('works with title option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tooltipToggle1')
                    .tooltip({ title: 'Test' })
                    .show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.tooltip-inner')).toHaveText('Test');
        });

        test('prioritizes dataset over setting', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                $.setDataset(tooltipToggle1, { uiTitle: 'Test' });
                UI.Tooltip.init(tooltipToggle1, { title: 'Test 2' }).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('#tooltipToggle1')).toHaveAttribute('data-ui-title', 'Test');
            await expect(page.locator('.tooltip-inner')).toHaveText('Test');
        });

        test('prioritizes setting over attribute', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                $.setAttribute(tooltipToggle1, { title: 'Test 2' });
                UI.Tooltip.init(tooltipToggle1, { title: 'Test' }).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('#tooltipToggle1')).toHaveAttribute('data-ui-original-title', 'Test 2');
            await expect(page.locator('.tooltip-inner')).toHaveText('Test');
        });
    });

    test.describe('template option', () => {
        test('works with template option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, {
                    template: '<div class="tooltip" role="tooltip" data-test="Test"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
                }).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.tooltip')).toHaveAttribute('data-test', 'Test');
            await expect(page.locator('.tooltip > .tooltip-arrow')).toHaveCount(1);
            await expect(page.locator('.tooltip > .tooltip-inner')).toHaveCount(1);
        });

        test('works with template option (data-ui-template)', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                $.setDataset(tooltipToggle1, {
                    uiTemplate: '<div class="tooltip" role="tooltip" data-test="Test"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
                });
                UI.Tooltip.init(tooltipToggle1).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('#tooltipToggle1')).toHaveAttribute(
                'data-ui-template',
                '<div class="tooltip" role="tooltip" data-test="Test"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
            );
            await expect(page.locator('.tooltip')).toHaveAttribute('data-test', 'Test');
        });

        test('works with template option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tooltipToggle1').tooltip({
                    template: '<div class="tooltip" role="tooltip" data-test="Test"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
                }).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.tooltip')).toHaveAttribute('data-test', 'Test');
            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
        });
    });

    test.describe('customClass option', () => {
        test('works with customClass option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { customClass: 'test' }).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.tooltip')).toHaveClass(/\btest\b/);
            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
        });

        test('works with customClass option (data-ui-custom-class)', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                $.setDataset(tooltipToggle1, { uiCustomClass: 'test' });
                UI.Tooltip.init(tooltipToggle1).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('#tooltipToggle1')).toHaveAttribute('data-ui-custom-class', 'test');
            await expect(page.locator('.tooltip')).toHaveClass(/\btest\b/);
        });

        test('works with customClass option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tooltipToggle1')
                    .tooltip({ customClass: 'test' })
                    .show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.tooltip')).toHaveClass(/\btest\b/);
            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
        });
    });

    test.describe('duration option', () => {
        test('works with duration option on show', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { duration: 200 }).show();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['.tooltip'],
                    progress: 0.875,
                },
            ]);
        });

        test('works with duration option on show (data-ui-duration)', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                $.setDataset(tooltipToggle1, { uiDuration: 200 });
                UI.Tooltip.init(tooltipToggle1).show();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['.tooltip'],
                    progress: 0.875,
                },
            ]);
        });

        test('works with duration option on show (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tooltipToggle1')
                    .tooltip({ duration: 200 })
                    .show();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['.tooltip'],
                    progress: 0.875,
                },
            ]);
        });

        test('works with duration option on hide', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { duration: 200 }).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('.tooltip');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1).hide();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['.tooltip'],
                    progress: 0.875,
                },
            ]);
        });

        test('works with duration option on hide (data-ui-duration)', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                $.setDataset(tooltipToggle1, { uiDuration: 200 });
                UI.Tooltip.init(tooltipToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('.tooltip');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1).hide();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['.tooltip'],
                    progress: 0.875,
                },
            ]);
        });

        test('works with duration option on hide (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tooltipToggle1')
                    .tooltip({ duration: 200 })
                    .show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('.tooltip');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $('#tooltipToggle1').tooltip('hide');
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['.tooltip'],
                    progress: 0.875,
                },
            ]);
        });
    });

    test.describe('html option', () => {
        test('escapes html tags', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { title: '<b>Test</b>' }).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.tooltip-inner')).toHaveText('<b>Test</b>');
            await expect(page.locator('.tooltip-inner b')).toHaveCount(0);
        });

        test('works with html option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { title: '<b>Test</b>', html: true }).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.tooltip-inner > b')).toHaveText('Test');
        });

        test('works with html option (data-ui-html)', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                $.setDataset(tooltipToggle1, { uiHtml: true });
                UI.Tooltip.init(tooltipToggle1, { title: '<b>Test</b>' }).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('#tooltipToggle1')).toHaveAttribute('data-ui-html', 'true');
            await expect(page.locator('.tooltip-inner > b')).toHaveText('Test');
        });

        test('works with html option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tooltipToggle1')
                    .tooltip({ title: '<b>Test</b>', html: true })
                    .show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.tooltip-inner > b')).toHaveText('Test');
        });
    });

    test.describe('trigger option', () => {
        test('shows on mouseover with hover trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { trigger: 'hover' });
            });
            await page.locator('#tooltipToggle1').hover();
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['.tooltip'],
                    active: true,
                },
            ]);
            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
        });

        test('shows on focus with focus trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { trigger: 'focus' });
            });
            await page.locator('#tooltipToggle1').focus();
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['.tooltip'],
                    active: true,
                },
            ]);
            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
        });

        test('shows on click with click trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { trigger: 'click' });
            });
            await page.locator('#tooltipToggle1').click();
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['.tooltip'],
                    active: true,
                },
            ]);
            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
        });

        test('hides on mouseout with hover trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { trigger: 'hover' }).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('.tooltip');
            });
            await advanceClock(page, 50);
            await page.locator('#tooltipToggle1').dispatchEvent('mouseout');
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['.tooltip'],
                    active: true,
                },
            ]);
        });

        test('hides on blur with focus trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { trigger: 'focus' }).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('.tooltip');
            });
            await advanceClock(page, 50);
            await page.locator('#tooltipToggle1').dispatchEvent('blur');
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['.tooltip'],
                    active: true,
                },
            ]);
        });

        test('hides on click with click trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { trigger: 'click' }).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('.tooltip');
            });
            await advanceClock(page, 50);
            await page.locator('#tooltipToggle1').click();
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['.tooltip'],
                    active: true,
                },
            ]);
        });

        test('does not show on mouseover without hover trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { trigger: '' });
            });
            await page.locator('#tooltipToggle1').hover();
            await advanceClock(page, 50);

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('does not show on focus without focus trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { trigger: '' });
            });
            await page.locator('#tooltipToggle1').focus();
            await advanceClock(page, 50);

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('does not show on click without click trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { trigger: '' });
            });
            await page.locator('#tooltipToggle1').click();
            await advanceClock(page, 50);

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('does not hide on mouseout without hover trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { trigger: '' }).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('.tooltip');
            });
            await advanceClock(page, 50);
            await page.locator('#tooltipToggle1').dispatchEvent('mouseout');
            await advanceClock(page, 50);

            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
            await expectAnimationState(page, [
                {
                    selectors: ['.tooltip'],
                },
            ]);
        });

        test('does not hide on blur without focus trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { trigger: '' }).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('.tooltip');
            });
            await advanceClock(page, 50);
            await page.locator('#tooltipToggle1').dispatchEvent('blur');
            await advanceClock(page, 50);

            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
            await expectAnimationState(page, [
                {
                    selectors: ['.tooltip'],
                },
            ]);
        });

        test('does not hide on click without click trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { trigger: '' }).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('.tooltip');
            });
            await advanceClock(page, 50);
            await page.locator('#tooltipToggle1').click();
            await advanceClock(page, 50);

            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
            await expectAnimationState(page, [
                {
                    selectors: ['.tooltip'],
                },
            ]);
        });

        test('works with trigger option (data-ui-trigger)', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                $.setDataset(tooltipToggle1, { uiTrigger: 'click' });
                UI.Tooltip.init(tooltipToggle1);
            });
            await page.locator('#tooltipToggle1').click();
            await advanceClock(page, 50);

            await expect(page.locator('#tooltipToggle1')).toHaveAttribute('data-ui-trigger', 'click');
            await expectAnimationState(page, [
                {
                    selectors: ['.tooltip'],
                    active: true,
                },
            ]);
        });

        test('works with trigger option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tooltipToggle1').tooltip({ trigger: 'click' });
            });
            await page.locator('#tooltipToggle1').click();
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['.tooltip'],
                    active: true,
                },
            ]);
        });

        test('works with multiple trigger options', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { trigger: 'hover focus' });
            });
            await page.locator('#tooltipToggle1').dispatchEvent('mouseover');
            await advanceClock(page, 150);
            await page.locator('#tooltipToggle1').dispatchEvent('blur');
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['.tooltip'],
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
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { appendTo: '.test' }).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.test > .tooltip')).toHaveCount(1);
            await expect(page.locator('.test > .tooltip')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#tooltipToggle1 + .tooltip')).toHaveCount(0);
        });

        test('works with appendTo option (data-ui-append-to)', async ({ page }) => {
            await page.evaluate((_) => {
                const testContainer = $.create('div', { class: 'test' });
                $.append(document.body, testContainer);
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                $.setDataset(tooltipToggle1, { uiAppendTo: '.test' });
                UI.Tooltip.init(tooltipToggle1).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('#tooltipToggle1')).toHaveAttribute('data-ui-append-to', '.test');
            await expect(page.locator('.test > .tooltip')).toHaveCount(1);
            await expect(page.locator('.test > .tooltip')).toHaveClass(/\bshow\b/);
        });

        test('works with appendTo option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                const testContainer = $.create('div', { class: 'test' });
                $.append(document.body, testContainer);
                $('#tooltipToggle1')
                    .tooltip({ appendTo: '.test' })
                    .show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.test > .tooltip')).toHaveCount(1);
            await expect(page.locator('.test > .tooltip')).toBeVisible();
        });
    });

    test.describe('sanitize option', () => {
        test('sanitizes html tags', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, {
                    title: '<b data-test="Test">Test</b>',
                    html: true,
                }).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.tooltip-inner > b')).toHaveText('Test');
            await expect(page.locator('.tooltip-inner > b')).not.toHaveAttribute('data-test');
        });

        test('works with sanitize option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, {
                    title: '<b data-test="Test">Test</b>',
                    html: true,
                    sanitize: false,
                }).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.tooltip-inner > b')).toHaveAttribute('data-test', 'Test');
            await expect(page.locator('.tooltip-inner > b')).toHaveText('Test');
        });

        test('works with sanitize option (data-ui-sanitize)', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                $.setDataset(tooltipToggle1, { uiSanitize: false });
                UI.Tooltip.init(tooltipToggle1, {
                    title: '<b data-test="Test">Test</b>',
                    html: true,
                }).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('#tooltipToggle1')).toHaveAttribute('data-ui-sanitize', 'false');
            await expect(page.locator('.tooltip-inner > b')).toHaveAttribute('data-test', 'Test');
        });

        test('works with sanitize option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tooltipToggle1')
                    .tooltip({
                        title: '<b data-test="Test">Test</b>',
                        html: true,
                        sanitize: false,
                    })
                    .show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('.tooltip-inner > b')).toHaveAttribute('data-test', 'Test');
            await expect(page.locator('.tooltip-inner > b')).toHaveText('Test');
        });
    });
});
