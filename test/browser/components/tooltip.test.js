import { floatingContentTests, setup } from '#cases/components/floating-content.js';
import { expect, test } from '#test';

test.use({ reducedMotion: 'no-preference' });

test.describe('Tooltip', () => {
    test.beforeEach(setup('tooltip'));

    floatingContentTests({ key: 'tooltip', component: 'Tooltip' });

    test.describe('#show', () => {
        for (const { name, show } of [
            {
                name: 'class',
                show: () => {
                    const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                    UI.Tooltip.init(tooltipToggle1).show();
                },
            },
            {
                name: 'QuerySet',
                show: () => {
                    $('#tooltip-toggle-1').tooltip('show');
                },
            },
        ]) {
            test(`shows the tooltip (${name})`, async ({ page }) => {
                await page.evaluate(show);

                await expect(page.locator('#tooltip-toggle-1 + .tooltip')).toHaveClass(/\bshow\b/);
                await expect(page.locator('#tooltip-toggle-1 + .tooltip')).toHaveClass(/\bfade\b/);
                await expect(page.locator('#tooltip-toggle-1 + .tooltip')).toHaveCSS('opacity', '1');
                await expect(page.locator('#tooltip-toggle-1 + .tooltip')).toBeVisible();
                await expect(page.locator('#tooltip-toggle-1 + .tooltip')).toHaveAttribute('role', 'tooltip');
                await expect(page.locator('#tooltip-toggle-1 + .tooltip')).toHaveAttribute('data-ui-placement', 'end');
                await expect(page.locator('#tooltip-toggle-1 + .tooltip')).toHaveCSS('position', 'absolute');
                await expect(page.locator('#tooltip-toggle-1')).toHaveAttribute('aria-describedby', /^tooltip-/);
                await expect(page.locator('#tooltip-toggle-1')).toHaveAttribute('data-ui-placement', 'end');
            });
        }

        test('shows multiple tooltips (QuerySet)', async ({ page }) => {
            await page.evaluate(() => {
                $('button').tooltip('show');
            });

            await expect(page.locator('.tooltip')).toHaveCount(2);
            await expect(page.locator('.tooltip').nth(0)).toHaveClass(/\bshow\b/);
            await expect(page.locator('.tooltip').nth(0)).toBeVisible();
            await expect(page.locator('.tooltip').nth(1)).toHaveClass(/\bshow\b/);
            await expect(page.locator('.tooltip').nth(1)).toBeVisible();
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate(() => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                const tooltip = UI.Tooltip.init(tooltipToggle1);
                tooltip.show();
                tooltip.show();
                tooltip.show();
            });

            await expect(page.locator('.tooltip')).toHaveCount(1);
        });

        test('can be called on shown tooltip', async ({ page }) => {
            await page.evaluate(() => new Promise((resolve) => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.addEventOnce(tooltipToggle1, 'shown.ui.tooltip', () => resolve());
                UI.Tooltip.init(tooltipToggle1).show();
            }));
            await page.evaluate(() => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1).show();
            });

            await expect(page.locator('.tooltip')).toHaveCount(1);
            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
        });

        test('shows the tooltip on inline-start in RTL', async ({ page }) => {
            await page.evaluate(() => {
                document.documentElement.dir = 'rtl';
                UI.Tooltip.init($.findOne('#tooltip-toggle-1'), {
                    fixed: true,
                    placement: 'start',
                }).show();
            });

            await expect(page.locator('#tooltip-toggle-1 + .tooltip')).toBeVisible();
            await expect(page.locator('#tooltip-toggle-1 + .tooltip')).toHaveAttribute('data-ui-placement', 'start');
            await expect(page.locator('#tooltip-toggle-1')).toHaveAttribute('data-ui-placement', 'start');
        });

        test('shows when the transition is canceled', async ({ page }) => {
            await page.evaluate(() => {
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
            await page.evaluate(() => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                window.tooltipShownEventTriggered = false;
                window.tooltipHiddenEventTriggered = false;

                $.addEvent(tooltipToggle1, 'shown.ui.tooltip', () => {
                    window.tooltipShownEventTriggered = true;
                });
                $.addEvent(tooltipToggle1, 'hidden.ui.tooltip', () => {
                    window.tooltipHiddenEventTriggered = true;
                });

                const tooltip = UI.Tooltip.init(tooltipToggle1);
                tooltip.show();
                tooltip.hide();
            });

            await expect(page.locator('.tooltip')).toHaveCount(0);
            expect(await page.evaluate(() => window.tooltipShownEventTriggered)).toBe(false);
            expect(await page.evaluate(() => window.tooltipHiddenEventTriggered)).toBe(true);
        });
    });

    test.describe('#refresh', () => {
        for (const { name, prepare, refresh } of [
            {
                name: 'class',
                prepare: () => {
                    const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                    UI.Tooltip.init(tooltipToggle1).show();
                },
                refresh: () => {
                    const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                    $.setDataset(tooltipToggle1, { uiTitle: 'Test' });
                    UI.Tooltip.init(tooltipToggle1).refresh();
                },
            },
            {
                name: 'QuerySet',
                prepare: () => {
                    $('#tooltip-toggle-1').tooltip('show');
                },
                refresh: () => {
                    $('#tooltip-toggle-1')
                        .setDataset({ uiTitle: 'Test' })
                        .tooltip('refresh');
                },
            },
        ]) {
            test(`refreshes the tooltip title (${name})`, async ({ page }) => {
                await page.evaluate(prepare);
                await page.evaluate(refresh);

                await expect(page.locator('#tooltip-toggle-1')).toHaveAttribute('data-ui-title', 'Test');
                await expect(page.locator('#tooltip-toggle-1 + .tooltip .tooltip-inner')).toHaveText('Test');
            });
        }

        test('refreshes multiple tooltips titles (QuerySet)', async ({ page }) => {
            await page.evaluate(() => {
                $('button').tooltip('show');
            });
            await page.evaluate(() => {
                $('button')
                    .setDataset({ uiTitle: 'Test' })
                    .tooltip('refresh');
            });

            await expect(page.locator('.tooltip-inner')).toHaveText(['Test', 'Test']);
        });
    });

    test.describe('title option', () => {
        for (const { name, run } of [
            {
                name: 'class',
                run: () => {
                    const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                    UI.Tooltip.init(tooltipToggle1, { title: 'Test' }).show();
                },
            },
            {
                name: 'QuerySet',
                run: () => {
                    $('#tooltip-toggle-1')
                        .tooltip({ title: 'Test' })
                        .show();
                },
            },
        ]) {
            test(`works with title option (${name})`, async ({ page }) => {
                await page.evaluate(run);

                await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
                await expect(page.locator('.tooltip-inner')).toHaveText('Test');
            });
        }

        test('works with title option (data-ui-title)', async ({ page }) => {
            await page.evaluate(() => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.setDataset(tooltipToggle1, { uiTitle: 'Test' });
                UI.Tooltip.init(tooltipToggle1).show();
            });

            await expect(page.locator('#tooltip-toggle-1')).toHaveAttribute('data-ui-title', 'Test');
            await expect(page.locator('.tooltip-inner')).toHaveText('Test');
        });

        test('works with title option (title)', async ({ page }) => {
            await page.evaluate(() => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.setAttribute(tooltipToggle1, { title: 'Test' });
                UI.Tooltip.init(tooltipToggle1).show();
            });

            await expect(page.locator('#tooltip-toggle-1')).not.toHaveAttribute('title');
            await expect(page.locator('#tooltip-toggle-1')).toHaveAttribute('data-ui-original-title', 'Test');
            await expect(page.locator('.tooltip-inner')).toHaveText('Test');
        });

        test('prioritizes dataset over setting', async ({ page }) => {
            await page.evaluate(() => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.setDataset(tooltipToggle1, { uiTitle: 'Test' });
                UI.Tooltip.init(tooltipToggle1, { title: 'Test 2' }).show();
            });

            await expect(page.locator('#tooltip-toggle-1')).toHaveAttribute('data-ui-title', 'Test');
            await expect(page.locator('.tooltip-inner')).toHaveText('Test');
        });

        test('prioritizes setting over attribute', async ({ page }) => {
            await page.evaluate(() => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.setAttribute(tooltipToggle1, { title: 'Test 2' });
                UI.Tooltip.init(tooltipToggle1, { title: 'Test' }).show();
            });

            await expect(page.locator('#tooltip-toggle-1')).toHaveAttribute('data-ui-original-title', 'Test 2');
            await expect(page.locator('.tooltip-inner')).toHaveText('Test');
        });
    });

    test.describe('template option', () => {
        for (const { name, run } of [
            {
                name: 'class',
                run: () => {
                    const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                    UI.Tooltip.init(tooltipToggle1, {
                        template: '<div class="tooltip" role="tooltip" data-test="Test"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
                    }).show();
                },
            },
            {
                name: 'QuerySet',
                run: () => {
                    $('#tooltip-toggle-1').tooltip({
                        template: '<div class="tooltip" role="tooltip" data-test="Test"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
                    }).show();
                },
            },
        ]) {
            test(`works with template option (${name})`, async ({ page }) => {
                await page.evaluate(run);

                await expect(page.locator('.tooltip')).toHaveAttribute('data-test', 'Test');
                await expect(page.locator('.tooltip > .tooltip-arrow')).toHaveCount(1);
                await expect(page.locator('.tooltip > .tooltip-inner')).toHaveCount(1);

                await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
            });
        }

        test('works with template option (data-ui-template)', async ({ page }) => {
            await page.evaluate(() => {
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
    });

    test.describe('html option', () => {
        test('escapes html tags', async ({ page }) => {
            await page.evaluate(() => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1, { title: '<b>Test</b>' }).show();
            });

            await expect(page.locator('.tooltip-inner')).toHaveText('<b>Test</b>');
            await expect(page.locator('.tooltip-inner b')).toHaveCount(0);
        });

        for (const { name, run } of [
            {
                name: 'class',
                run: () => {
                    const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                    UI.Tooltip.init(tooltipToggle1, { title: '<b>Test</b>', html: true }).show();
                },
            },
            {
                name: 'QuerySet',
                run: () => {
                    $('#tooltip-toggle-1')
                        .tooltip({ title: '<b>Test</b>', html: true })
                        .show();
                },
            },
        ]) {
            test(`works with html option (${name})`, async ({ page }) => {
                await page.evaluate(run);

                await expect(page.locator('.tooltip-inner > b')).toHaveText('Test');
            });
        }

        test('works with html option (data-ui-html)', async ({ page }) => {
            await page.evaluate(() => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.setDataset(tooltipToggle1, { uiHtml: true });
                UI.Tooltip.init(tooltipToggle1, { title: '<b>Test</b>' }).show();
            });

            await expect(page.locator('#tooltip-toggle-1')).toHaveAttribute('data-ui-html', 'true');
            await expect(page.locator('.tooltip-inner > b')).toHaveText('Test');
        });
    });

    test.describe('sanitize option', () => {
        test('sanitizes html tags', async ({ page }) => {
            await page.evaluate(() => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1, {
                    title: '<b data-test="Test">Test</b>',
                    html: true,
                }).show();
            });

            await expect(page.locator('.tooltip-inner > b')).toHaveText('Test');
            await expect(page.locator('.tooltip-inner > b')).not.toHaveAttribute('data-test');
        });

        for (const { name, run } of [
            {
                name: 'class',
                run: () => {
                    const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                    UI.Tooltip.init(tooltipToggle1, {
                        title: '<b data-test="Test">Test</b>',
                        html: true,
                        sanitize: false,
                    }).show();
                },
            },
            {
                name: 'QuerySet',
                run: () => {
                    $('#tooltip-toggle-1')
                        .tooltip({
                            title: '<b data-test="Test">Test</b>',
                            html: true,
                            sanitize: false,
                        })
                        .show();
                },
            },
        ]) {
            test(`works with sanitize option (${name})`, async ({ page }) => {
                await page.evaluate(run);

                await expect(page.locator('.tooltip-inner > b')).toHaveAttribute('data-test', 'Test');
                await expect(page.locator('.tooltip-inner > b')).toHaveText('Test');
            });
        }

        test('works with sanitize option (data-ui-sanitize)', async ({ page }) => {
            await page.evaluate(() => {
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
    });

    test.describe('trigger option', () => {
        test('shows on mouseover with hover trigger option', async ({ page }) => {
            await page.evaluate(() => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1, { trigger: 'hover' });
            });
            await page.locator('#tooltip-toggle-1').hover();

            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
        });

        test('shows on focus with focus trigger option', async ({ page }) => {
            await page.evaluate(() => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1, { trigger: 'focus' });
            });
            await page.locator('#tooltip-toggle-1').focus();

            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
        });

        for (const { name, run } of [
            {
                name: 'class',
                run: () => {
                    const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                    UI.Tooltip.init(tooltipToggle1, { trigger: 'click' });
                },
            },
            {
                name: 'QuerySet',
                run: () => {
                    $('#tooltip-toggle-1').tooltip({ trigger: 'click' });
                },
            },
        ]) {
            test(`shows on click with click trigger option (${name})`, async ({ page }) => {
                await page.evaluate(run);
                await page.locator('#tooltip-toggle-1').click();

                await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);

                await expect(page.locator('.tooltip')).toHaveCSS('opacity', '1');
            });
        }

        test('hides on mouseout with hover trigger option', async ({ page }) => {
            await page.evaluate(() => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1, { trigger: 'hover' }).show();
            });
            await expect(page.locator('.tooltip')).toHaveCSS('opacity', '1');

            await page.locator('#tooltip-toggle-1').dispatchEvent('mouseout');

            await expect(page.locator('.tooltip')).toHaveCount(0);
            await expect(page.locator('#tooltip-toggle-1')).not.toHaveAttribute('aria-describedby');
        });

        test('hides on blur with focus trigger option', async ({ page }) => {
            await page.evaluate(() => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1, { trigger: 'focus' }).show();
            });
            await expect(page.locator('.tooltip')).toHaveCSS('opacity', '1');

            await page.locator('#tooltip-toggle-1').dispatchEvent('blur');

            await expect(page.locator('.tooltip')).toHaveCount(0);
            await expect(page.locator('#tooltip-toggle-1')).not.toHaveAttribute('aria-describedby');
        });

        test('hides on click with click trigger option', async ({ page }) => {
            await page.evaluate(() => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1, { trigger: 'click' }).show();
            });
            await expect(page.locator('.tooltip')).toHaveCSS('opacity', '1');

            await page.locator('#tooltip-toggle-1').click();

            await expect(page.locator('.tooltip')).toHaveCount(0);
            await expect(page.locator('#tooltip-toggle-1')).not.toHaveAttribute('aria-describedby');
        });

        test('does not show on mouseover without hover trigger option', async ({ page }) => {
            await page.evaluate(() => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1, { trigger: '' });
            });
            await page.locator('#tooltip-toggle-1').hover();

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('does not show on focus without focus trigger option', async ({ page }) => {
            await page.evaluate(() => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1, { trigger: '' });
            });
            await page.locator('#tooltip-toggle-1').focus();

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('does not show on click without click trigger option', async ({ page }) => {
            await page.evaluate(() => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1, { trigger: '' });
            });
            await page.locator('#tooltip-toggle-1').click();

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });

        test('does not hide on mouseout without hover trigger option', async ({ page }) => {
            await page.evaluate(() => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1, { trigger: '' }).show();
            });
            await page.locator('#tooltip-toggle-1').dispatchEvent('mouseout');

            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
        });

        test('does not hide on blur without focus trigger option', async ({ page }) => {
            await page.evaluate(() => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1, { trigger: '' }).show();
            });
            await page.locator('#tooltip-toggle-1').dispatchEvent('blur');

            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
        });

        test('does not hide on click without click trigger option', async ({ page }) => {
            await page.evaluate(() => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1, { trigger: '' }).show();
            });
            await page.locator('#tooltip-toggle-1').click();

            await expect(page.locator('.tooltip')).toHaveClass(/\bshow\b/);
        });

        test('works with trigger option (data-ui-trigger)', async ({ page }) => {
            await page.evaluate(() => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                $.setDataset(tooltipToggle1, { uiTrigger: 'click' });
                UI.Tooltip.init(tooltipToggle1);
            });
            await page.locator('#tooltip-toggle-1').click();

            await expect(page.locator('#tooltip-toggle-1')).toHaveAttribute('data-ui-trigger', 'click');
        });

        test('works with multiple trigger options', async ({ page }) => {
            await page.evaluate(() => {
                const tooltipToggle1 = $.findOne('#tooltip-toggle-1');
                UI.Tooltip.init(tooltipToggle1, { trigger: 'hover focus' });
            });
            await page.locator('#tooltip-toggle-1').dispatchEvent('mouseover');
            await page.locator('#tooltip-toggle-1').dispatchEvent('blur');

            await expect(page.locator('.tooltip')).toHaveCount(0);
        });
    });
});
