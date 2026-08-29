import { expect, test } from '#test';
import { resetPage } from '../../setup/browser.js';

test.use({ reducedMotion: 'no-preference' });

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('Tooltip', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            $.setHTML(
                document.body,
                `
                    <button class="btn btn-secondary" id="tooltip-toggle-1" type="button"></button>
                    <button class="btn btn-secondary" id="tooltip-toggle-2" type="button"></button>
                `,
            );
        });
    });

    test.describe('#init', () => {
        test('creates a tooltip', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                return UI.Tooltip.init(tooltipToggle1) instanceof UI.Tooltip;
            })).toBe(true);
        });

        test('creates a tooltip (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('#tooltip-toggle-1').tooltip();
                return $.getData('#tooltip-toggle-1', 'tooltip') instanceof UI.Tooltip;
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
                $('#tooltip-toggle-1').tooltip() instanceof UI.Tooltip)).toBe(true);
        });
    });

    test.describe('#dispose', () => {
        test('removes the tooltip', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1).dispose();
                return $.hasData(tooltipToggle1, 'tooltip');
            })).toBe(false);
        });

        test('removes the tooltip (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('#tooltip-toggle-1').tooltip('dispose');
                return $.hasData('#tooltip-toggle-1', 'tooltip');
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
                $.setHTML(
                    document.body,
                    `
                        <div class="modal" id="modal">
                            <button id="tooltip-toggle-1" type="button"></button>
                            <button id="tooltip-toggle-2" type="button"></button>
                        </div>
                    `,
                );

                const modal = $.findOne('#modal');
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                const tooltipToggle2 = $.findOne('#tooltip-toggle-2');
                window.modalHideEventTriggered = false;

                $.addEvent(modal, 'hide.ui.modal', (_) => {
                    window.modalHideEventTriggered = true;
                });
                UI.Tooltip.init(tooltipToggle1);
                UI.Tooltip.init(tooltipToggle2).show();
            });

            await page.evaluate((_) => {
                UI.Tooltip.init($.findOne('#tooltip-toggle-1')).dispose();
                $.triggerEvent('#modal', 'hide.ui.modal');
            });

            expect(await page.evaluate((_) => window.modalHideEventTriggered)).toBe(true);
            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('restores the title attribute', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.setAttribute(tooltipToggle1, { title: 'Test' });
                UI.Tooltip.init(tooltipToggle1).dispose();
            });

            await expect(page.locator('#tooltip-toggle-1')).toHaveAttribute('title', 'Test');
            await expect(page.locator('#tooltip-toggle-1')).not.toHaveAttribute('data-ui-original-title');
        });
    });

    test.describe('#show', () => {
        test('shows the tooltip', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1).show();
            });

            await expect(page.locator('#tooltip-toggle-1 + .tooltip')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#tooltip-toggle-1 + .tooltip')).toHaveClass(/\bfade\b/);
            await expect(page.locator('#tooltip-toggle-1 + .tooltip')).toHaveCSS('opacity', '1');
            await expect(page.locator('#tooltip-toggle-1 + .tooltip')).toBeVisible();
            await expect(page.locator('#tooltip-toggle-1 + .tooltip')).toHaveAttribute('role', 'tooltip');
            await expect(page.locator('#tooltip-toggle-1 + .tooltip')).toHaveAttribute('data-ui-placement', 'right');
            await expect(page.locator('#tooltip-toggle-1 + .tooltip')).toHaveCSS('position', 'absolute');
            await expect(page.locator('#tooltip-toggle-1')).toHaveAttribute('aria-describedby', /^tooltip/);
            await expect(page.locator('#tooltip-toggle-1')).toHaveAttribute('data-ui-placement', 'right');
        });

        test('shows the tooltip (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tooltip-toggle-1').tooltip('show');
            });

            await expect(page.locator('#tooltip-toggle-1 + .tooltip')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#tooltip-toggle-1 + .tooltip')).toHaveCSS('opacity', '1');
            await expect(page.locator('#tooltip-toggle-1 + .tooltip')).toBeVisible();
            await expect(page.locator('#tooltip-toggle-1 + .tooltip')).toHaveAttribute('role', 'tooltip');
        });

        test('shows multiple tooltips (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('button').tooltip('show');
            });

            await expect(page.locator('.tooltip')).toHaveCount(2);
            await expect(page.locator('.tooltip').nth(0)).toHaveClass(/\bshow\b/);
            await expect(page.locator('.tooltip').nth(0)).toBeVisible();
            await expect(page.locator('.tooltip').nth(1)).toHaveClass(/\bshow\b/);
            await expect(page.locator('.tooltip').nth(1)).toBeVisible();
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                const tooltip = UI.Tooltip.init(tooltipToggle1);
                tooltip.show();
                tooltip.show();
                tooltip.show();
            });

            await expect(page.locator('.tooltip')).toHaveCount(1);
        });

        test('can be called on shown tooltip', async ({ page }) => {
            await page.evaluate((_) => new Promise((resolve) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.addEventOnce(tooltipToggle1, 'shown.ui.tooltip', (_) => resolve());
                UI.Tooltip.init(tooltipToggle1).show();
            }));
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1).show();
            });

            await expect(page.locator('.tooltip')).toHaveCount(1);
            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
        });

        test('shows when the transition is canceled', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1).show();
                const transition = $.findOne('.tooltip').getAnimations()
                    .find((animation) => animation instanceof CSSTransition);
                transition.cancel();
            });

            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
            await expect(page.locator('.tooltip')).toHaveCSS('opacity', '1');
        });

        test('can be interrupted by hiding', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                window.tooltipShownEventTriggered = false;
                window.tooltipHiddenEventTriggered = false;

                $.addEvent(tooltipToggle1, 'shown.ui.tooltip', (_) => {
                    window.tooltipShownEventTriggered = true;
                });
                $.addEvent(tooltipToggle1, 'hidden.ui.tooltip', (_) => {
                    window.tooltipHiddenEventTriggered = true;
                });

                const tooltip = UI.Tooltip.init(tooltipToggle1);
                tooltip.show();
                tooltip.hide();
            });

            await expect(page.locator('.tooltip')).toHaveCount(0);
            expect(await page.evaluate((_) => window.tooltipShownEventTriggered)).toBe(false);
            expect(await page.evaluate((_) => window.tooltipHiddenEventTriggered)).toBe(true);
        });
    });

    test.describe('#hide', () => {
        test('hides the tooltip', async ({ page }) => {
            await page.evaluate((_) => new Promise((resolve) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.addEventOnce(tooltipToggle1, 'shown.ui.tooltip', (_) => resolve());
                UI.Tooltip.init(tooltipToggle1).show();
            }));

            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1).hide();
            });

            await expect(page.locator('.tooltip')).toHaveCount(0);
            await expect(page.locator('#tooltip-toggle-1')).not.toHaveAttribute('aria-describedby');
            await expect(page.locator('#tooltip-toggle-1')).not.toHaveAttribute('data-ui-placement');
        });

        test('hides the tooltip (query)', async ({ page }) => {
            await page.evaluate((_) => new Promise((resolve) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.addEventOnce(tooltipToggle1, 'shown.ui.tooltip', (_) => resolve());
                $('#tooltip-toggle-1').tooltip('show');
            }));

            await page.evaluate((_) => {
                $('#tooltip-toggle-1').tooltip('hide');
            });

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('hides multiple tooltips (query)', async ({ page }) => {
            await page.evaluate(async (_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                const tooltipToggle2 = $.findOne('#tooltip-toggle-2');
                const shown1 = new Promise((resolve) => {
                    $.addEventOnce(tooltipToggle1, 'shown.ui.tooltip', (_) => resolve());
                });
                const shown2 = new Promise((resolve) => {
                    $.addEventOnce(tooltipToggle2, 'shown.ui.tooltip', (_) => resolve());
                });

                $('button').tooltip('show');

                await Promise.all([shown1, shown2]);
            });

            await page.evaluate((_) => {
                $('button').tooltip('hide');
            });

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('does not remove the tooltip after hiding', async ({ page }) => {
            await page.evaluate((_) => new Promise((resolve) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.addEventOnce(tooltipToggle1, 'shown.ui.tooltip', (_) => resolve());
                UI.Tooltip.init(tooltipToggle1).show();
            }));

            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1).hide();
            });

            expect(await page.evaluate((_) =>
                $.getData('#tooltip-toggle-1', 'tooltip') instanceof UI.Tooltip)).toBe(true);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => new Promise((resolve) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.addEventOnce(tooltipToggle1, 'shown.ui.tooltip', (_) => resolve());
                UI.Tooltip.init(tooltipToggle1).show();
            }));

            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                const tooltip = UI.Tooltip.init(tooltipToggle1);
                tooltip.hide();
                tooltip.hide();
                tooltip.hide();
            });

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('can be called on hidden tooltip', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1).hide();
            });

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('hides without animation', async ({ page }) => {
            await page.evaluate((_) => new Promise((resolve) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.addEventOnce(tooltipToggle1, 'shown.ui.tooltip', (_) => resolve());
                UI.Tooltip.init(tooltipToggle1, {
                    animation: false,
                }).show();
            }));

            await page.evaluate((_) => {
                UI.Tooltip.init($.findOne('#tooltip-toggle-1')).hide();
            });

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('hides when the transition is canceled', async ({ page }) => {
            await page.evaluate((_) => new Promise((resolve) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.addEventOnce(tooltipToggle1, 'shown.ui.tooltip', (_) => resolve());
                UI.Tooltip.init(tooltipToggle1).show();
            }));

            await page.evaluate((_) => {
                UI.Tooltip.init($.findOne('#tooltip-toggle-1')).hide();
                const transition = $.findOne('.tooltip').getAnimations()
                    .find((animation) => animation instanceof CSSTransition);
                transition.cancel();
            });

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('can be interrupted by showing', async ({ page }) => {
            await page.evaluate((_) => new Promise((resolve) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.addEventOnce(tooltipToggle1, 'shown.ui.tooltip', (_) => resolve());
                UI.Tooltip.init(tooltipToggle1).show();
            }));

            const events = await page.evaluate((_) => new Promise((resolve) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                let hidden = false;

                $.addEvent(tooltipToggle1, 'hidden.ui.tooltip', (_) => {
                    hidden = true;
                });
                $.addEventOnce(tooltipToggle1, 'shown.ui.tooltip', (_) => {
                    resolve({ hidden, shown: true });
                });

                const tooltip = UI.Tooltip.init(tooltipToggle1);
                tooltip.hide();
                tooltip.show();
            }));

            expect(events.shown).toBe(true);
            expect(events.hidden).toBe(false);
            await expect(page.locator('.tooltip')).toHaveCSS('opacity', '1');
        });
    });

    test.describe('#toggle (show)', () => {
        test('shows the tooltip', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1).toggle();
            });

            await expect(page.locator('#tooltip-toggle-1 + .tooltip')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#tooltip-toggle-1 + .tooltip')).toBeVisible();
        });

        test('shows the tooltip (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tooltip-toggle-1').tooltip('toggle');
            });

            await expect(page.locator('#tooltip-toggle-1 + .tooltip')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#tooltip-toggle-1 + .tooltip')).toBeVisible();
        });

        test('shows multiple tooltips (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('button').tooltip('toggle');
            });

            await expect(page.locator('.tooltip')).toHaveCount(2);
            await expect(page.locator('.tooltip').nth(0)).toHaveClass(/\bshow\b/);
            await expect(page.locator('.tooltip').nth(1)).toHaveClass(/\bshow\b/);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                const tooltip = UI.Tooltip.init(tooltipToggle1);
                tooltip.toggle();
                tooltip.toggle();
                tooltip.toggle();
            });

            await expect(page.locator('.tooltip')).toHaveCount(1);
        });
    });

    test.describe('#toggle (hide)', () => {
        test('hides the tooltip', async ({ page }) => {
            await page.evaluate((_) => new Promise((resolve) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.addEventOnce(tooltipToggle1, 'shown.ui.tooltip', (_) => resolve());
                UI.Tooltip.init(tooltipToggle1).show();
            }));

            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1).toggle();
            });

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('hides the tooltip (query)', async ({ page }) => {
            await page.evaluate((_) => new Promise((resolve) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.addEventOnce(tooltipToggle1, 'shown.ui.tooltip', (_) => resolve());
                $('#tooltip-toggle-1').tooltip('show');
            }));

            await page.evaluate((_) => {
                $('#tooltip-toggle-1').tooltip('toggle');
            });

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('hide multiple tooltips (query)', async ({ page }) => {
            await page.evaluate(async (_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                const tooltipToggle2 = $.findOne('#tooltip-toggle-2');
                const shown1 = new Promise((resolve) => {
                    $.addEventOnce(tooltipToggle1, 'shown.ui.tooltip', (_) => resolve());
                });
                const shown2 = new Promise((resolve) => {
                    $.addEventOnce(tooltipToggle2, 'shown.ui.tooltip', (_) => resolve());
                });

                $('button').tooltip('show');

                await Promise.all([shown1, shown2]);
            });

            await page.evaluate((_) => {
                $('button').tooltip('toggle');
            });

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => new Promise((resolve) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.addEventOnce(tooltipToggle1, 'shown.ui.tooltip', (_) => resolve());
                UI.Tooltip.init(tooltipToggle1).show();
            }));

            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                const tooltip = UI.Tooltip.init(tooltipToggle1);
                tooltip.toggle();
                tooltip.toggle();
                tooltip.toggle();
            });

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });
    });

    test.describe('#disable', () => {
        test('disables the tooltip', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                const tooltip = UI.Tooltip.init(tooltipToggle1);
                tooltip.disable();
                tooltip.show();
            });

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('disables the tooltip (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tooltip-toggle-1').tooltip('disable');
                $('#tooltip-toggle-1').tooltip('show');
            });

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('disables multiple tooltips (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('button').tooltip('disable');
                $('button').tooltip('show');
            });

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('can be called on a disabled tooltip', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                const tooltip = UI.Tooltip.init(tooltipToggle1);
                tooltip.disable();
                tooltip.disable();
                tooltip.show();
            });

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('allows a visible tooltip to be hidden programmatically', async ({ page }) => {
            await page.evaluate((_) => new Promise((resolve) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.addEventOnce(tooltipToggle1, 'shown.ui.tooltip', (_) => resolve());
                UI.Tooltip.init(tooltipToggle1).show();
            }));

            await page.evaluate((_) => {
                const tooltip = UI.Tooltip.init($.findOne('#tooltip-toggle-1'));
                tooltip.disable();
                tooltip.hide();
            });

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('ignores hide trigger events when disabled', async ({ page }) => {
            await page.evaluate((_) => new Promise((resolve) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.addEventOnce(tooltipToggle1, 'shown.ui.tooltip', (_) => resolve());
                UI.Tooltip.init(tooltipToggle1, { trigger: 'hover focus click' }).show();
            }));

            await page.evaluate((_) => {
                UI.Tooltip.init($.findOne('#tooltip-toggle-1')).disable();
            });
            await page.locator('#tooltip-toggle-1').dispatchEvent('mouseout');
            await page.locator('#tooltip-toggle-1').dispatchEvent('blur');
            await page.locator('#tooltip-toggle-1').dispatchEvent('click');

            await expect(page.locator('.tooltip')).toHaveCount(1);
            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
            await expect(page.locator('.tooltip')).toBeVisible();
        });
    });

    test.describe('#enable', () => {
        test('enables the tooltip', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                const tooltip = UI.Tooltip.init(tooltipToggle1);
                tooltip.disable();
                tooltip.enable();
                tooltip.show();
            });

            await expect(page.locator('.tooltip')).toHaveCount(1);
            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
        });

        test('enables the tooltip (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tooltip-toggle-1').tooltip('disable');
                $('#tooltip-toggle-1').tooltip('enable');
                $('#tooltip-toggle-1').tooltip('show');
            });

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

            await expect(page.locator('.tooltip')).toHaveCount(2);
            await expect(page.locator('.tooltip').nth(0)).toHaveClass(/\bshow\b/);
            await expect(page.locator('.tooltip').nth(1)).toHaveClass(/\bshow\b/);
        });

        test('can be called on an enabled tooltip', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                const tooltip = UI.Tooltip.init(tooltipToggle1);
                tooltip.enable();
                tooltip.enable();
                tooltip.show();
            });

            await expect(page.locator('.tooltip')).toHaveCount(1);
            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
        });
    });

    test.describe('#refresh', () => {
        test('refreshes the tooltip title', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1).show();
            });
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.setDataset(tooltipToggle1, { uiTitle: 'Test' });
                UI.Tooltip.init(tooltipToggle1).refresh();
            });

            await expect(page.locator('#tooltip-toggle-1')).toHaveAttribute('data-ui-title', 'Test');
            await expect(page.locator('#tooltip-toggle-1 + .tooltip .tooltip-inner')).toHaveText('Test');
        });

        test('refreshes the tooltip title (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tooltip-toggle-1').tooltip('show');
            });
            await page.evaluate((_) => {
                $('#tooltip-toggle-1')
                    .setDataset({ uiTitle: 'Test' })
                    .tooltip('refresh');
            });

            await expect(page.locator('#tooltip-toggle-1 + .tooltip .tooltip-inner')).toHaveText('Test');
        });

        test('refreshes multiple tooltips titles (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('button').tooltip('show');
            });
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
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
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
            const eventTriggered = await page.evaluate((_) => new Promise((resolve) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');

                $.addEventOnce(tooltipToggle1, 'shown.ui.tooltip', (_) => resolve(true));
                UI.Tooltip.init(tooltipToggle1).show();
            }));

            expect(eventTriggered).toBe(true);
            await expect(page.locator('.tooltip')).toHaveCSS('opacity', '1');
            await expect(page.locator('.tooltip')).toHaveCount(1);
            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
        });

        test('triggers hide event', async ({ page }) => {
            await page.evaluate((_) => new Promise((resolve) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.addEventOnce(tooltipToggle1, 'shown.ui.tooltip', (_) => resolve());
                UI.Tooltip.init(tooltipToggle1).show();
            }));
            const eventTriggered = await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
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
            await page.evaluate((_) => new Promise((resolve) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.addEventOnce(tooltipToggle1, 'shown.ui.tooltip', (_) => resolve());
                UI.Tooltip.init(tooltipToggle1).show();
            }));
            const eventTriggered = await page.evaluate((_) => new Promise((resolve) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');

                $.addEventOnce(tooltipToggle1, 'hidden.ui.tooltip', (_) => resolve(true));
                UI.Tooltip.init(tooltipToggle1).hide();
            }));

            expect(eventTriggered).toBe(true);
            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('can be prevented from showing', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.addEvent(tooltipToggle1, 'show.ui.tooltip', (_) => false);
                UI.Tooltip.init(tooltipToggle1).show();
            });

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('can be prevented from showing (prevent default)', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.addEvent(tooltipToggle1, 'show.ui.tooltip', (event) => {
                    event.preventDefault();
                });
                UI.Tooltip.init(tooltipToggle1).show();
            });

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('can be prevented from hiding', async ({ page }) => {
            await page.evaluate((_) => new Promise((resolve) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.addEventOnce(tooltipToggle1, 'shown.ui.tooltip', (_) => resolve());
                UI.Tooltip.init(tooltipToggle1).show();
            }));
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.addEvent(tooltipToggle1, 'hide.ui.tooltip', (_) => false);
                UI.Tooltip.init(tooltipToggle1).hide();
            });

            await expect(page.locator('.tooltip')).toHaveCount(1);
            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
            await expect(page.locator('.tooltip')).toHaveCSS('opacity', '1');
        });

        test('can be prevented from hiding (prevent default)', async ({ page }) => {
            await page.evaluate((_) => new Promise((resolve) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.addEventOnce(tooltipToggle1, 'shown.ui.tooltip', (_) => resolve());
                UI.Tooltip.init(tooltipToggle1).show();
            }));
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.addEvent(tooltipToggle1, 'hide.ui.tooltip', (event) => {
                    event.preventDefault();
                });
                UI.Tooltip.init(tooltipToggle1).hide();
            });

            await expect(page.locator('.tooltip')).toHaveCount(1);
            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
            await expect(page.locator('.tooltip')).toHaveCSS('opacity', '1');
        });
    });

    test.describe('title option', () => {
        test('works with title option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1, { title: 'Test' }).show();
            });

            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
            await expect(page.locator('.tooltip-inner')).toHaveText('Test');
        });

        test('works with title option (data-ui-title)', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.setDataset(tooltipToggle1, { uiTitle: 'Test' });
                UI.Tooltip.init(tooltipToggle1).show();
            });

            await expect(page.locator('#tooltip-toggle-1')).toHaveAttribute('data-ui-title', 'Test');
            await expect(page.locator('.tooltip-inner')).toHaveText('Test');
        });

        test('works with title option (title)', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.setAttribute(tooltipToggle1, { title: 'Test' });
                UI.Tooltip.init(tooltipToggle1).show();
            });

            await expect(page.locator('#tooltip-toggle-1')).not.toHaveAttribute('title');
            await expect(page.locator('#tooltip-toggle-1')).toHaveAttribute('data-ui-original-title', 'Test');
            await expect(page.locator('.tooltip-inner')).toHaveText('Test');
        });

        test('works with title option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tooltip-toggle-1')
                    .tooltip({ title: 'Test' })
                    .show();
            });

            await expect(page.locator('.tooltip-inner')).toHaveText('Test');
        });

        test('prioritizes dataset over setting', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.setDataset(tooltipToggle1, { uiTitle: 'Test' });
                UI.Tooltip.init(tooltipToggle1, { title: 'Test 2' }).show();
            });

            await expect(page.locator('#tooltip-toggle-1')).toHaveAttribute('data-ui-title', 'Test');
            await expect(page.locator('.tooltip-inner')).toHaveText('Test');
        });

        test('prioritizes setting over attribute', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.setAttribute(tooltipToggle1, { title: 'Test 2' });
                UI.Tooltip.init(tooltipToggle1, { title: 'Test' }).show();
            });

            await expect(page.locator('#tooltip-toggle-1')).toHaveAttribute('data-ui-original-title', 'Test 2');
            await expect(page.locator('.tooltip-inner')).toHaveText('Test');
        });
    });

    test.describe('template option', () => {
        test('works with template option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1, {
                    template: '<div class="tooltip" role="tooltip" data-test="Test"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
                }).show();
            });

            await expect(page.locator('.tooltip')).toHaveAttribute('data-test', 'Test');
            await expect(page.locator('.tooltip > .tooltip-arrow')).toHaveCount(1);
            await expect(page.locator('.tooltip > .tooltip-inner')).toHaveCount(1);
        });

        test('works with template option (data-ui-template)', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.setDataset(tooltipToggle1, {
                    uiTemplate: '<div class="tooltip" role="tooltip" data-test="Test"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
                });
                UI.Tooltip.init(tooltipToggle1).show();
            });

            await expect(page.locator('#tooltip-toggle-1')).toHaveAttribute(
                'data-ui-template',
                '<div class="tooltip" role="tooltip" data-test="Test"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
            );
            await expect(page.locator('.tooltip')).toHaveAttribute('data-test', 'Test');
        });

        test('works with template option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tooltip-toggle-1').tooltip({
                    template: '<div class="tooltip" role="tooltip" data-test="Test"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
                }).show();
            });

            await expect(page.locator('.tooltip')).toHaveAttribute('data-test', 'Test');
            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
        });
    });

    test.describe('customClass option', () => {
        test('works with customClass option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1, { customClass: 'test' }).show();
            });

            await expect(page.locator('.tooltip')).toHaveClass(/\btest\b/);
            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
        });

        test('works with customClass option (data-ui-custom-class)', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.setDataset(tooltipToggle1, { uiCustomClass: 'test' });
                UI.Tooltip.init(tooltipToggle1).show();
            });

            await expect(page.locator('#tooltip-toggle-1')).toHaveAttribute('data-ui-custom-class', 'test');
            await expect(page.locator('.tooltip')).toHaveClass(/\btest\b/);
        });

        test('works with customClass option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tooltip-toggle-1')
                    .tooltip({ customClass: 'test' })
                    .show();
            });

            await expect(page.locator('.tooltip')).toHaveClass(/\btest\b/);
            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
        });
    });

    test.describe('animation option', () => {
        test('works with animation option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1, { animation: false }).show();
            });

            await expect(page.locator('.tooltip')).not.toHaveClass(/\bfade\b/);
            await expect(page.locator('.tooltip')).toHaveCSS('opacity', '1');
        });

        test('works with animation option (data-ui-animation)', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.setDataset(tooltipToggle1, { uiAnimation: false });
                UI.Tooltip.init(tooltipToggle1).show();
            });

            await expect(page.locator('#tooltip-toggle-1')).toHaveAttribute('data-ui-animation', 'false');
            await expect(page.locator('.tooltip')).not.toHaveClass(/\bfade\b/);
        });

        test('works with animation option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tooltip-toggle-1')
                    .tooltip({ animation: false })
                    .show();
            });

            await expect(page.locator('.tooltip')).not.toHaveClass(/\bfade\b/);
            await expect(page.locator('.tooltip')).toHaveCSS('opacity', '1');
        });
    });

    test.describe('html option', () => {
        test('escapes html tags', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1, { title: '<b>Test</b>' }).show();
            });

            await expect(page.locator('.tooltip-inner')).toHaveText('<b>Test</b>');
            await expect(page.locator('.tooltip-inner b')).toHaveCount(0);
        });

        test('works with html option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1, { title: '<b>Test</b>', html: true }).show();
            });

            await expect(page.locator('.tooltip-inner > b')).toHaveText('Test');
        });

        test('works with html option (data-ui-html)', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.setDataset(tooltipToggle1, { uiHtml: true });
                UI.Tooltip.init(tooltipToggle1, { title: '<b>Test</b>' }).show();
            });

            await expect(page.locator('#tooltip-toggle-1')).toHaveAttribute('data-ui-html', 'true');
            await expect(page.locator('.tooltip-inner > b')).toHaveText('Test');
        });

        test('works with html option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tooltip-toggle-1')
                    .tooltip({ title: '<b>Test</b>', html: true })
                    .show();
            });

            await expect(page.locator('.tooltip-inner > b')).toHaveText('Test');
        });
    });

    test.describe('trigger option', () => {
        test('shows on mouseover with hover trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1, { trigger: 'hover' });
            });
            await page.locator('#tooltip-toggle-1').hover();

            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
        });

        test('shows on focus with focus trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1, { trigger: 'focus' });
            });
            await page.locator('#tooltip-toggle-1').focus();

            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
        });

        test('shows on click with click trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1, { trigger: 'click' });
            });
            await page.locator('#tooltip-toggle-1').click();

            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
        });

        test('hides on mouseout with hover trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1, { trigger: 'hover' }).show();
            });
            await expect(page.locator('.tooltip')).toHaveCSS('opacity', '1');

            await page.locator('#tooltip-toggle-1').dispatchEvent('mouseout');

            await expect(page.locator('.tooltip')).toHaveCount(0);
            await expect(page.locator('#tooltip-toggle-1')).not.toHaveAttribute('aria-describedby');
        });

        test('hides on blur with focus trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1, { trigger: 'focus' }).show();
            });
            await expect(page.locator('.tooltip')).toHaveCSS('opacity', '1');

            await page.locator('#tooltip-toggle-1').dispatchEvent('blur');

            await expect(page.locator('.tooltip')).toHaveCount(0);
            await expect(page.locator('#tooltip-toggle-1')).not.toHaveAttribute('aria-describedby');
        });

        test('hides on click with click trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1, { trigger: 'click' }).show();
            });
            await expect(page.locator('.tooltip')).toHaveCSS('opacity', '1');

            await page.locator('#tooltip-toggle-1').click();

            await expect(page.locator('.tooltip')).toHaveCount(0);
            await expect(page.locator('#tooltip-toggle-1')).not.toHaveAttribute('aria-describedby');
        });

        test('does not show on mouseover without hover trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1, { trigger: '' });
            });
            await page.locator('#tooltip-toggle-1').hover();

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('does not show on focus without focus trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1, { trigger: '' });
            });
            await page.locator('#tooltip-toggle-1').focus();

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('does not show on click without click trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1, { trigger: '' });
            });
            await page.locator('#tooltip-toggle-1').click();

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('does not hide on mouseout without hover trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1, { trigger: '' }).show();
            });
            await page.locator('#tooltip-toggle-1').dispatchEvent('mouseout');

            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
        });

        test('does not hide on blur without focus trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1, { trigger: '' }).show();
            });
            await page.locator('#tooltip-toggle-1').dispatchEvent('blur');

            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
        });

        test('does not hide on click without click trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1, { trigger: '' }).show();
            });
            await page.locator('#tooltip-toggle-1').click();

            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
        });

        test('works with trigger option (data-ui-trigger)', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.setDataset(tooltipToggle1, { uiTrigger: 'click' });
                UI.Tooltip.init(tooltipToggle1);
            });
            await page.locator('#tooltip-toggle-1').click();

            await expect(page.locator('#tooltip-toggle-1')).toHaveAttribute('data-ui-trigger', 'click');
        });

        test('works with trigger option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tooltip-toggle-1').tooltip({ trigger: 'click' });
            });
            await page.locator('#tooltip-toggle-1').click();

            await expect(page.locator('.tooltip')).toHaveCSS('opacity', '1');
        });

        test('works with multiple trigger options', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1, { trigger: 'hover focus' });
            });
            await page.locator('#tooltip-toggle-1').dispatchEvent('mouseover');
            await page.locator('#tooltip-toggle-1').dispatchEvent('blur');

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });
    });

    test.describe('appendTo option', () => {
        test('works with appendTo option', async ({ page }) => {
            await page.evaluate((_) => {
                const testContainer = $.create('div', { class: 'test' });
                $.append(document.body, testContainer);
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1, { appendTo: '.test' }).show();
            });

            await expect(page.locator('.test > .tooltip')).toHaveCount(1);
            await expect(page.locator('.test > .tooltip')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#tooltip-toggle-1 + .tooltip')).toHaveCount(0);
        });

        test('works with appendTo option (data-ui-append-to)', async ({ page }) => {
            await page.evaluate((_) => {
                const testContainer = $.create('div', { class: 'test' });
                $.append(document.body, testContainer);
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.setDataset(tooltipToggle1, { uiAppendTo: '.test' });
                UI.Tooltip.init(tooltipToggle1).show();
            });

            await expect(page.locator('#tooltip-toggle-1')).toHaveAttribute('data-ui-append-to', '.test');
            await expect(page.locator('.test > .tooltip')).toHaveCount(1);
            await expect(page.locator('.test > .tooltip')).toHaveClass(/\bshow\b/);
        });

        test('works with appendTo option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                const testContainer = $.create('div', { class: 'test' });
                $.append(document.body, testContainer);
                $('#tooltip-toggle-1')
                    .tooltip({ appendTo: '.test' })
                    .show();
            });

            await expect(page.locator('.test > .tooltip')).toHaveCount(1);
            await expect(page.locator('.test > .tooltip')).toBeVisible();
        });
    });

    test.describe('sanitize option', () => {
        test('sanitizes html tags', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1, {
                    title: '<b data-test="Test">Test</b>',
                    html: true,
                }).show();
            });

            await expect(page.locator('.tooltip-inner > b')).toHaveText('Test');
            await expect(page.locator('.tooltip-inner > b')).not.toHaveAttribute('data-test');
        });

        test('works with sanitize option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1, {
                    title: '<b data-test="Test">Test</b>',
                    html: true,
                    sanitize: false,
                }).show();
            });

            await expect(page.locator('.tooltip-inner > b')).toHaveAttribute('data-test', 'Test');
            await expect(page.locator('.tooltip-inner > b')).toHaveText('Test');
        });

        test('works with sanitize option (data-ui-sanitize)', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.setDataset(tooltipToggle1, { uiSanitize: false });
                UI.Tooltip.init(tooltipToggle1, {
                    title: '<b data-test="Test">Test</b>',
                    html: true,
                }).show();
            });

            await expect(page.locator('#tooltip-toggle-1')).toHaveAttribute('data-ui-sanitize', 'false');
            await expect(page.locator('.tooltip-inner > b')).toHaveAttribute('data-test', 'Test');
        });

        test('works with sanitize option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tooltip-toggle-1')
                    .tooltip({
                        title: '<b data-test="Test">Test</b>',
                        html: true,
                        sanitize: false,
                    })
                    .show();
            });

            await expect(page.locator('.tooltip-inner > b')).toHaveAttribute('data-test', 'Test');
            await expect(page.locator('.tooltip-inner > b')).toHaveText('Test');
        });
    });
});
