import { floatingContentTests, setup } from '#cases/components/floating-content.js';
import { expect, test } from '#test';

test.use({ reducedMotion: 'no-preference' });

test.describe('Popover', () => {
    test.beforeEach(setup('popover'));

    floatingContentTests({ key: 'popover', component: 'Popover' });

    test.describe('#show', () => {
        test('shows the popover', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                UI.Popover.init(popoverToggle1).show();
            });

            await expect(page.locator('#popover-toggle-1 + .popover')).toBeVisible();
            await expect(page.locator('#popover-toggle-1 + .popover')).toHaveClass(/\bfade\b/);
            await expect(page.locator('#popover-toggle-1 + .popover')).toHaveCSS('opacity', '1');
            await expect(page.locator('#popover-toggle-1 + .popover')).toHaveAttribute('role', 'tooltip');
            await expect(page.locator('#popover-toggle-1 + .popover')).toHaveAttribute('data-ui-placement', 'end');
            await expect(page.locator('#popover-toggle-1 + .popover')).toHaveCSS('position', 'absolute');
            await expect(page.locator('#popover-toggle-1')).toHaveAttribute('aria-describedby', /^popover-/);
            await expect(page.locator('#popover-toggle-1')).toHaveAttribute('data-ui-placement', 'end');
        });

        test('shows the popover on inline-start in RTL', async ({ page }) => {
            await page.evaluate((_) => {
                document.documentElement.dir = 'rtl';
                UI.Popover.init($.findOne('#popover-toggle-1'), {
                    fixed: true,
                    placement: 'start',
                }).show();
            });

            await expect(page.locator('#popover-toggle-1 + .popover')).toBeVisible();
            await expect(page.locator('#popover-toggle-1 + .popover')).toHaveAttribute('data-ui-placement', 'start');
            await expect(page.locator('#popover-toggle-1')).toHaveAttribute('data-ui-placement', 'start');
        });

        test('shows the popover (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#popover-toggle-1').popover('show');
            });

            await expect(page.locator('#popover-toggle-1 + .popover')).toBeVisible();
            await expect(page.locator('#popover-toggle-1 + .popover')).toHaveCSS('opacity', '1');
            await expect(page.locator('#popover-toggle-1 + .popover')).toHaveAttribute('role', 'tooltip');
        });

        test('shows multiple popovers (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('button').popover('show');
            });

            await expect(page.locator('.popover')).toHaveCount(2);
            await expect(page.locator('.popover').nth(0)).toBeVisible();
            await expect(page.locator('.popover').nth(1)).toBeVisible();
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                const popover = UI.Popover.init(popoverToggle1);
                popover.show();
                popover.show();
                popover.show();
            });

            await expect(page.locator('.popover')).toHaveCount(1);
        });

        test('shows when the transition is canceled', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                UI.Popover.init(popoverToggle1).show();
                const transition = $.findOne('.popover').getAnimations()
                    .find((animation) => animation instanceof CSSTransition);
                transition.cancel();
            });

            await expect(page.locator('.popover')).toHaveClass(/\bshow\b/);
            await expect(page.locator('.popover')).toHaveCSS('opacity', '1');
        });

        test('can be interrupted by hiding', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                window.popoverShownEventTriggered = false;
                window.popoverHiddenEventTriggered = false;

                $.addEvent(popoverToggle1, 'shown.ui.popover', (_) => {
                    window.popoverShownEventTriggered = true;
                });
                $.addEvent(popoverToggle1, 'hidden.ui.popover', (_) => {
                    window.popoverHiddenEventTriggered = true;
                });

                const popover = UI.Popover.init(popoverToggle1);
                popover.show();
                popover.hide();
            });

            await expect(page.locator('.popover')).toHaveCount(0);
            expect(await page.evaluate((_) => window.popoverShownEventTriggered)).toBe(false);
            expect(await page.evaluate((_) => window.popoverHiddenEventTriggered)).toBe(true);
        });

        test('can be called on shown popover', async ({ page }) => {
            await page.evaluate((_) => new Promise((resolve) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                $.addEventOnce(popoverToggle1, 'shown.ui.popover', (_) => resolve());
                UI.Popover.init(popoverToggle1).show();
            }));
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                UI.Popover.init(popoverToggle1).show();
            });

            await expect(page.locator('.popover')).toHaveCount(1);
            await expect(page.locator('.popover')).toHaveClass(/\bshow\b/);
        });
    });

    test.describe('#refresh', () => {
        test('refreshes the popover title', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                UI.Popover.init(popoverToggle1).show();
            });
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                $.setDataset(popoverToggle1, { uiTitle: 'Test' });
                UI.Popover.init(popoverToggle1).refresh();
            });

            await expect(page.locator('#popover-toggle-1')).toHaveAttribute('data-ui-title', 'Test');
            await expect(page.locator('#popover-toggle-1 + .popover .popover-header')).toHaveText('Test');
        });

        test('refreshes the popover title (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#popover-toggle-1').popover('show');
            });
            await page.evaluate((_) => {
                $('#popover-toggle-1')
                    .setDataset({ uiTitle: 'Test' })
                    .popover('refresh');
            });

            await expect(page.locator('#popover-toggle-1 + .popover .popover-header')).toHaveText('Test');
        });

        test('refreshes multiple popovers titles (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('button').popover('show');
            });
            await page.evaluate((_) => {
                $('button')
                    .setDataset({ uiTitle: 'Test' })
                    .popover('refresh');
            });

            await expect(page.locator('.popover-header')).toHaveText(['Test', 'Test']);
        });

        test('refreshes the popover content', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                UI.Popover.init(popoverToggle1).show();
            });
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                $.setDataset(popoverToggle1, { uiContent: 'Test' });
                UI.Popover.init(popoverToggle1).refresh();
            });

            await expect(page.locator('#popover-toggle-1')).toHaveAttribute('data-ui-content', 'Test');
            await expect(page.locator('#popover-toggle-1 + .popover .popover-body')).toHaveText('Test');
        });

        test('refreshes the popover content (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#popover-toggle-1').popover('show');
            });
            await page.evaluate((_) => {
                $('#popover-toggle-1')
                    .setDataset({ uiContent: 'Test' })
                    .popover('refresh');
            });

            await expect(page.locator('#popover-toggle-1 + .popover .popover-body')).toHaveText('Test');
        });

        test('refreshes multiple popovers content (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('button').popover('show');
            });
            await page.evaluate((_) => {
                $('button')
                    .setDataset({ uiContent: 'Test' })
                    .popover('refresh');
            });

            await expect(page.locator('.popover-body')).toHaveText(['Test', 'Test']);
        });
    });

    test.describe('title option', () => {
        test('works with title option', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                UI.Popover.init(popoverToggle1, { title: 'Test' }).show();
            });

            await expect(page.locator('.popover-header')).toHaveText('Test');
        });

        test('works with title option (data-ui-title)', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                $.setDataset(popoverToggle1, { uiTitle: 'Test' });
                UI.Popover.init(popoverToggle1).show();
            });

            await expect(page.locator('#popover-toggle-1')).toHaveAttribute('data-ui-title', 'Test');
            await expect(page.locator('.popover-header')).toHaveText('Test');
        });

        test('works with title option (title)', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                $.setAttribute(popoverToggle1, { title: 'Test' });
                UI.Popover.init(popoverToggle1).show();
            });

            await expect(page.locator('#popover-toggle-1')).not.toHaveAttribute('title');
            await expect(page.locator('#popover-toggle-1')).toHaveAttribute('data-ui-original-title', 'Test');
            await expect(page.locator('.popover-header')).toHaveText('Test');
        });

        test('works with title option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#popover-toggle-1')
                    .popover({ title: 'Test' })
                    .show();
            });

            await expect(page.locator('.popover-header')).toHaveText('Test');
        });

        test('prioritizes dataset over setting', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                $.setDataset(popoverToggle1, { uiTitle: 'Test' });
                UI.Popover.init(popoverToggle1, { title: 'Test 2' }).show();
            });

            await expect(page.locator('#popover-toggle-1')).toHaveAttribute('data-ui-title', 'Test');
            await expect(page.locator('.popover-header')).toHaveText('Test');
        });

        test('prioritizes setting over attribute', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                $.setAttribute(popoverToggle1, { title: 'Test 2' });
                UI.Popover.init(popoverToggle1, { title: 'Test' }).show();
            });

            await expect(page.locator('#popover-toggle-1')).toHaveAttribute('data-ui-original-title', 'Test 2');
            await expect(page.locator('.popover-header')).toHaveText('Test');
        });
    });

    test.describe('content option', () => {
        test('works with content option', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                UI.Popover.init(popoverToggle1, { content: 'Test' }).show();
            });

            await expect(page.locator('.popover-header')).toBeHidden();
            await expect(page.locator('.popover-body')).toHaveText('Test');
        });

        test('works with content option (data-ui-content)', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                $.setDataset(popoverToggle1, { uiContent: 'Test' });
                UI.Popover.init(popoverToggle1).show();
            });

            await expect(page.locator('#popover-toggle-1')).toHaveAttribute('data-ui-content', 'Test');
            await expect(page.locator('.popover-body')).toHaveText('Test');
        });

        test('works with content option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#popover-toggle-1')
                    .popover({ content: 'Test' })
                    .show();
            });

            await expect(page.locator('.popover-body')).toHaveText('Test');
        });

        test('prioritizes dataset over setting', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                $.setDataset(popoverToggle1, { uiContent: 'Test' });
                UI.Popover.init(popoverToggle1, { content: 'Test 2' }).show();
            });

            await expect(page.locator('#popover-toggle-1')).toHaveAttribute('data-ui-content', 'Test');
            await expect(page.locator('.popover-body')).toHaveText('Test');
        });
    });

    test.describe('template option', () => {
        test('works with template option', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                UI.Popover.init(popoverToggle1, {
                    template: '<div class="popover" role="tooltip" data-test="Test"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
                }).show();
            });

            await expect(page.locator('.popover')).toHaveAttribute('data-test', 'Test');
            await expect(page.locator('.popover > .popover-arrow')).toHaveCount(1);
            await expect(page.locator('.popover > .popover-header')).toHaveCount(1);
            await expect(page.locator('.popover > .popover-body')).toHaveCount(1);
        });

        test('works with template option (data-ui-template)', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                $.setDataset(popoverToggle1, {
                    uiTemplate: '<div class="popover" role="tooltip" data-test="Test"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
                });
                UI.Popover.init(popoverToggle1).show();
            });

            await expect(page.locator('#popover-toggle-1')).toHaveAttribute(
                'data-ui-template',
                '<div class="popover" role="tooltip" data-test="Test"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
            );
            await expect(page.locator('.popover')).toHaveAttribute('data-test', 'Test');
        });

        test('works with template option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#popover-toggle-1').popover({
                    template: '<div class="popover" role="tooltip" data-test="Test"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
                }).show();
            });

            await expect(page.locator('.popover')).toHaveAttribute('data-test', 'Test');
        });
    });

    test.describe('html option', () => {
        test('escapes html tags in title', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                UI.Popover.init(popoverToggle1, { title: '<b>Test</b>' }).show();
            });

            await expect(page.locator('.popover-header')).toHaveText('<b>Test</b>');
            await expect(page.locator('.popover-header b')).toHaveCount(0);
        });

        test('works with html option for title', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                UI.Popover.init(popoverToggle1, { title: '<b>Test</b>', html: true }).show();
            });

            await expect(page.locator('.popover-header > b')).toHaveText('Test');
        });

        test('works with html option for title (data-ui-html)', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                $.setDataset(popoverToggle1, { uiHtml: true });
                UI.Popover.init(popoverToggle1, { title: '<b>Test</b>' }).show();
            });

            await expect(page.locator('#popover-toggle-1')).toHaveAttribute('data-ui-html', 'true');
            await expect(page.locator('.popover-header > b')).toHaveText('Test');
        });

        test('works with html option for title (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#popover-toggle-1')
                    .popover({ title: '<b>Test</b>', html: true })
                    .show();
            });

            await expect(page.locator('.popover-header > b')).toHaveText('Test');
        });

        test('escapes html tags in content', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                UI.Popover.init(popoverToggle1, { content: '<b>Test</b>' }).show();
            });

            await expect(page.locator('.popover-body')).toHaveText('<b>Test</b>');
            await expect(page.locator('.popover-body b')).toHaveCount(0);
        });

        test('works with html option for content', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                UI.Popover.init(popoverToggle1, { content: '<b>Test</b>', html: true }).show();
            });

            await expect(page.locator('.popover-body > b')).toHaveText('Test');
        });

        test('works with html option for content (data-ui-html)', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                $.setDataset(popoverToggle1, { uiHtml: true });
                UI.Popover.init(popoverToggle1, { content: '<b>Test</b>' }).show();
            });

            await expect(page.locator('#popover-toggle-1')).toHaveAttribute('data-ui-html', 'true');
            await expect(page.locator('.popover-body > b')).toHaveText('Test');
        });

        test('works with html option for content (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#popover-toggle-1')
                    .popover({ content: '<b>Test</b>', html: true })
                    .show();
            });

            await expect(page.locator('.popover-body > b')).toHaveText('Test');
        });
    });

    test.describe('trigger option', () => {
        test('shows on mouseover with hover trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                UI.Popover.init(popoverToggle1, { trigger: 'hover' });
            });
            await page.locator('#popover-toggle-1').hover();

            await expect(page.locator('.popover')).toHaveCSS('opacity', '1');
        });

        test('shows on focus with focus trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                UI.Popover.init(popoverToggle1, { trigger: 'focus' });
            });
            await page.locator('#popover-toggle-1').focus();

            await expect(page.locator('.popover')).toHaveCSS('opacity', '1');
        });

        test('shows on click with click trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                UI.Popover.init(popoverToggle1, { trigger: 'click' });
            });
            await page.locator('#popover-toggle-1').click();

            await expect(page.locator('.popover')).toHaveCSS('opacity', '1');
        });

        test('hides on mouseout with hover trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                UI.Popover.init(popoverToggle1, { trigger: 'hover' }).show();
            });
            await expect(page.locator('.popover')).toHaveCSS('opacity', '1');

            await page.locator('#popover-toggle-1').dispatchEvent('mouseout');

            await expect(page.locator('.popover')).toHaveCount(0);
            await expect(page.locator('#popover-toggle-1')).not.toHaveAttribute('aria-describedby');
        });

        test('hides on blur with focus trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                UI.Popover.init(popoverToggle1, { trigger: 'focus' }).show();
            });
            await expect(page.locator('.popover')).toHaveCSS('opacity', '1');

            await page.locator('#popover-toggle-1').dispatchEvent('blur');

            await expect(page.locator('.popover')).toHaveCount(0);
            await expect(page.locator('#popover-toggle-1')).not.toHaveAttribute('aria-describedby');
        });

        test('hides on click with click trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                UI.Popover.init(popoverToggle1, { trigger: 'click' }).show();
            });
            await expect(page.locator('.popover')).toHaveCSS('opacity', '1');

            await page.locator('#popover-toggle-1').click();

            await expect(page.locator('.popover')).toHaveCount(0);
            await expect(page.locator('#popover-toggle-1')).not.toHaveAttribute('aria-describedby');
        });

        test('does not on mouseover without hover trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                UI.Popover.init(popoverToggle1, { trigger: '' });
            });
            await page.locator('#popover-toggle-1').hover();

            await expect(page.locator('.popover')).toHaveCount(0);
        });

        test('does not on focus without focus trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                UI.Popover.init(popoverToggle1, { trigger: '' });
            });
            await page.locator('#popover-toggle-1').focus();

            await expect(page.locator('.popover')).toHaveCount(0);
        });

        test('does not on click without click trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                UI.Popover.init(popoverToggle1, { trigger: '' });
            });
            await page.locator('#popover-toggle-1').click();

            await expect(page.locator('.popover')).toHaveCount(0);
        });

        test('does not hide on mouseout without hover trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                UI.Popover.init(popoverToggle1, { trigger: '' }).show();
            });
            await page.locator('#popover-toggle-1').dispatchEvent('mouseout');

            await expect(page.locator('.popover')).toHaveCount(1);
            await expect(page.locator('.popover')).toBeVisible();
        });

        test('does not hide on blur without focus trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                UI.Popover.init(popoverToggle1, { trigger: '' }).show();
            });
            await page.locator('#popover-toggle-1').dispatchEvent('blur');

            await expect(page.locator('.popover')).toHaveCount(1);
            await expect(page.locator('.popover')).toBeVisible();
        });

        test('does not hide on click without click trigger option', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                UI.Popover.init(popoverToggle1, { trigger: '' }).show();
            });
            await page.locator('#popover-toggle-1').click();

            await expect(page.locator('.popover')).toHaveCount(1);
            await expect(page.locator('.popover')).toBeVisible();
        });

        test('works with trigger option (data-ui-trigger)', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                $.setDataset(popoverToggle1, { uiTrigger: 'click' });
                UI.Popover.init(popoverToggle1);
            });
            await page.locator('#popover-toggle-1').click();

            await expect(page.locator('#popover-toggle-1')).toHaveAttribute('data-ui-trigger', 'click');
        });

        test('works with trigger option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#popover-toggle-1').popover({ trigger: 'click' });
            });
            await page.locator('#popover-toggle-1').click();

            await expect(page.locator('.popover')).toHaveCSS('opacity', '1');
        });

        test('works with multiple trigger options', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                UI.Popover.init(popoverToggle1, { trigger: 'hover focus' });
            });
            await page.locator('#popover-toggle-1').dispatchEvent('mouseover');
            await page.locator('#popover-toggle-1').dispatchEvent('blur');

            await expect(page.locator('.popover')).toHaveCount(0);
        });
    });

    test.describe('sanitize option', () => {
        test('sanitizes html tags in title', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                UI.Popover.init(popoverToggle1, {
                    title: '<b data-test="test">Test</b>',
                    html: true,
                }).show();
            });

            await expect(page.locator('.popover-header > b')).toHaveText('Test');
            await expect(page.locator('.popover-header > b')).not.toHaveAttribute('data-test');
        });

        test('works with sanitize option for title', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                UI.Popover.init(popoverToggle1, {
                    title: '<b data-test="test">Test</b>',
                    html: true,
                    sanitize: false,
                }).show();
            });

            await expect(page.locator('.popover-header > b')).toHaveAttribute('data-test', 'test');
            await expect(page.locator('.popover-header > b')).toHaveText('Test');
        });

        test('works with sanitize option for title (data-ui-sanitize)', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                $.setDataset(popoverToggle1, { uiSanitize: false });
                UI.Popover.init(popoverToggle1, {
                    title: '<b data-test="test">Test</b>',
                    html: true,
                }).show();
            });

            await expect(page.locator('#popover-toggle-1')).toHaveAttribute('data-ui-sanitize', 'false');
            await expect(page.locator('.popover-header > b')).toHaveAttribute('data-test', 'test');
        });

        test('works with sanitize option for title (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#popover-toggle-1')
                    .popover({
                        title: '<b data-test="test">Test</b>',
                        html: true,
                        sanitize: false,
                    })
                    .show();
            });

            await expect(page.locator('.popover-header > b')).toHaveAttribute('data-test', 'test');
            await expect(page.locator('.popover-header > b')).toHaveText('Test');
        });

        test('sanitizes html tags in content', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                UI.Popover.init(popoverToggle1, {
                    content: '<b data-test="test">Test</b>',
                    html: true,
                }).show();
            });

            await expect(page.locator('.popover-body > b')).toHaveText('Test');
            await expect(page.locator('.popover-body > b')).not.toHaveAttribute('data-test');
        });

        test('works with sanitize option for content', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                UI.Popover.init(popoverToggle1, {
                    content: '<b data-test="test">Test</b>',
                    html: true,
                    sanitize: false,
                }).show();
            });

            await expect(page.locator('.popover-body > b')).toHaveAttribute('data-test', 'test');
            await expect(page.locator('.popover-body > b')).toHaveText('Test');
        });

        test('works with sanitize option for content (data-ui-sanitize)', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle1 = $.findOne('#popover-toggle-1');
                $.setDataset(popoverToggle1, { uiSanitize: false });
                UI.Popover.init(popoverToggle1, {
                    content: '<b data-test="test">Test</b>',
                    html: true,
                }).show();
            });

            await expect(page.locator('#popover-toggle-1')).toHaveAttribute('data-ui-sanitize', 'false');
            await expect(page.locator('.popover-body > b')).toHaveAttribute('data-test', 'test');
        });

        test('works with sanitize option for content (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#popover-toggle-1')
                    .popover({
                        content: '<b data-test="test">Test</b>',
                        html: true,
                        sanitize: false,
                    })
                    .show();
            });

            await expect(page.locator('.popover-body > b')).toHaveAttribute('data-test', 'test');
            await expect(page.locator('.popover-body > b')).toHaveText('Test');
        });
    });
});
