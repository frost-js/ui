import { expect, test } from '@playwright/test';
import { advanceClock, resetPage, setupClock } from '../../setup/browser.js';
import { expectAnimationState } from '../../support/assertions/animation.js';

test.beforeEach(async ({ page }) => {
    await setupClock(page);
    await resetPage(page);
});

test.describe('Tab', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div class="nav nav-tabs">' +
                '<a class="nav-link active" id="tabToggle1" href="#tab1" data-ui-toggle="tab"></a>' +
                '<a class="nav-link" id="tabToggle2" href="#tab2" data-ui-toggle="tab"></a>' +
                '</div>' +
                '<div class="tab-content">' +
                '<div class="tab-pane active" id="tab1"></div>' +
                '<div class="tab-pane" id="tab2"></div>' +
                '</div>' +
                '<div class="nav nav-tabs">' +
                '<a class="nav-link active" id="tabToggle3" href="#tab3" data-ui-toggle="tab"></a>' +
                '<a class="nav-link" id="tabToggle4" href="#tab4" data-ui-toggle="tab"></a>' +
                '</div>' +
                '<div class="tab-content">' +
                '<div class="tab-pane active" id="tab3"></div>' +
                '<div class="tab-pane" id="tab4"></div>' +
                '</div>';
        });
    });

    test.describe('#init', () => {
        test('creates a tab', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tabToggle1');
                return UI.Tab.init(tabToggle1) instanceof UI.Tab;
            })).toBe(true);
        });

        test('creates a tab (data-ui-toggle)', async ({ page }) => {
            await page.locator('#tabToggle1').click();

            expect(await page.evaluate((_) =>
                $.getData('#tabToggle1', 'tab') instanceof UI.Tab)).toBe(true);
        });

        test('creates a tab (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('#tabToggle1').tab();
                return $.getData('#tabToggle1', 'tab') instanceof UI.Tab;
            })).toBe(true);
        });

        test('creates multiple tabs (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('a').tab();
                return $.find('a').every((node) =>
                    $.getData(node, 'tab') instanceof UI.Tab,
                );
            })).toBe(true);
        });

        test('returns the tab (query)', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $('#tabToggle1').tab() instanceof UI.Tab)).toBe(true);
        });
    });

    test.describe('#dispose', () => {
        test('removes the tab', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tabToggle1');
                UI.Tab.init(tabToggle1).dispose();
                return $.hasData(tabToggle1, 'tab');
            })).toBe(false);
        });

        test('removes the tab (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('#tabToggle1').tab('dispose');
                return $.hasData('#tabToggle1', 'tab');
            })).toBe(false);
        });

        test('removes multiple tabs (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('a').tab('dispose');
                return $.find('a').some((node) =>
                    $.hasData(node, 'tab'),
                );
            })).toBe(false);
        });

        test('clears tab memory', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tabToggle1');
                const tab = UI.Tab.init(tabToggle1);
                tab.dispose();

                for (const key in tab) {
                    if ($._isObject(tab[key]) && !$._isFunction(tab[key])) {
                        return false;
                    }
                }

                return true;
            })).toBe(true);
        });

        test('clears tab memory when node is removed', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tabToggle1');
                const tab = UI.Tab.init(tabToggle1);
                $.remove(tabToggle1);

                for (const key in tab) {
                    if ($._isObject(tab[key]) && !$._isFunction(tab[key])) {
                        return false;
                    }
                }

                return true;
            })).toBe(true);
        });
    });

    test.describe('#hide', () => {
        test('hides the tab', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tabToggle1');
                UI.Tab.init(tabToggle1).hide();
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#tab1'],
                    progress: 0.5,
                    styles: { opacity: '0.5' },
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link');
            await expect(page.locator('#tabToggle1')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane');
            await expect(page.locator('#tab1')).toHaveAttribute('style', '');
            await expect(page.locator('#tab3')).toHaveClass('tab-pane active');
        });

        test('hides the tab (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tabToggle1').tab('hide');
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#tab1'],
                    progress: 0.5,
                    styles: { opacity: '0.5' },
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link');
            await expect(page.locator('#tabToggle1')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane');
            await expect(page.locator('#tab1')).toHaveAttribute('style', '');
            await expect(page.locator('#tab3')).toHaveClass('tab-pane active');
        });

        test('hides multiple tabs (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tabToggle1, #tabToggle3').tab('hide');
            });
            await advanceClock(page, 150);

            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link');
            await expect(page.locator('#tabToggle3')).toHaveClass('nav-link');
            await expect(page.locator('#tabToggle1')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tabToggle3')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane');
            await expect(page.locator('#tab3')).toHaveClass('tab-pane');
            await expect(page.locator('#tab1')).toHaveAttribute('style', '');
            await expect(page.locator('#tab3')).toHaveAttribute('style', '');
        });

        test('does not remove the tab after hiding', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tabToggle1');
                UI.Tab.init(tabToggle1).hide();
            });
            await advanceClock(page, 150);

            expect(await page.evaluate((_) =>
                $.getData('#tabToggle1', 'tab') instanceof UI.Tab)).toBe(true);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tabToggle1');
                const tab = UI.Tab.init(tabToggle1);
                tab.hide();
                tab.hide();
                tab.hide();
            });
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['#tab1'],
                    progress: 0.5,
                },
            ]);
        });

        test('can be called on hidden tab', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle2 = $.findOne('#tabToggle2');
                UI.Tab.init(tabToggle2).hide();
            });

            await expect(page.locator('#tabToggle2')).toHaveClass('nav-link');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane');
            await expectAnimationState(page, [
                {
                    selectors: ['#tab2'],
                },
            ]);
        });
    });

    test.describe('#show', () => {
        test('shows the tab', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle2 = $.findOne('#tabToggle2');
                UI.Tab.init(tabToggle2).show();
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#tab1'],
                    progress: 0.5,
                },
            ]);
            await advanceClock(page, 100);
            await expectAnimationState(page, [
                {
                    selectors: ['#tab2'],
                    progress: 0.5,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link');
            await expect(page.locator('#tabToggle1')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tabToggle2')).toHaveClass('nav-link active');
            await expect(page.locator('#tabToggle2')).toHaveAttribute('aria-selected', 'true');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane active');
        });

        test('shows the tab (data-ui-toggle)', async ({ page }) => {
            await page.locator('#tabToggle2').click();
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#tab1'],
                    progress: 0.5,
                },
            ]);
            await advanceClock(page, 100);
            await expectAnimationState(page, [
                {
                    selectors: ['#tab2'],
                    progress: 0.5,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link');
            await expect(page.locator('#tabToggle2')).toHaveClass('nav-link active');
            await expect(page.locator('#tabToggle2')).toHaveAttribute('aria-selected', 'true');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane active');
        });

        test('shows the tab (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tabToggle2').tab('show');
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#tab1'],
                    progress: 0.5,
                },
            ]);
            await advanceClock(page, 100);
            await expectAnimationState(page, [
                {
                    selectors: ['#tab2'],
                    progress: 0.5,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link');
            await expect(page.locator('#tabToggle2')).toHaveClass('nav-link active');
            await expect(page.locator('#tabToggle2')).toHaveAttribute('aria-selected', 'true');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane active');
        });

        test('shows multiple tabs (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tabToggle2, #tabToggle4').tab('show');
            });
            await advanceClock(page, 250);

            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link');
            await expect(page.locator('#tabToggle2')).toHaveClass('nav-link active');
            await expect(page.locator('#tabToggle3')).toHaveClass('nav-link');
            await expect(page.locator('#tabToggle4')).toHaveClass('nav-link active');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane active');
            await expect(page.locator('#tab3')).toHaveClass('tab-pane');
            await expect(page.locator('#tab4')).toHaveClass('tab-pane active');
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle2 = $.findOne('#tabToggle2');
                const tab = UI.Tab.init(tabToggle2);
                tab.show();
                tab.show();
                tab.show();
            });
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['#tab1'],
                    progress: 0.5,
                },
            ]);
        });

        test('can be called on shown tab', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tabToggle1');
                UI.Tab.init(tabToggle1).show();
            });

            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link active');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane active');
            await expectAnimationState(page, [
                {
                    selectors: ['#tab1'],
                },
            ]);
        });
    });

    test.describe('events', () => {
        test('triggers hide event', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tabToggle1');
                const tab1 = $.findOne('#tab1');
                $.addEvent(tabToggle1, 'hide.ui.tab', (_) => {
                    document.documentElement.dataset.tabHideState = String(
                        tabToggle1.className === 'nav-link active' &&
                        tab1.className === 'tab-pane active',
                    );
                });
                UI.Tab.init(tabToggle1).hide();
            });

            await expect(page.locator('html')).toHaveAttribute('data-tab-hide-state', 'true');
        });

        test('triggers hidden event', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tabToggle1');
                $.addEvent(tabToggle1, 'hidden.ui.tab', (_) => {
                    document.documentElement.dataset.tabHidden = 'true';
                });
                UI.Tab.init(tabToggle1).hide();
            });
            await advanceClock(page, 150);

            await expect(page.locator('html')).toHaveAttribute('data-tab-hidden', 'true');
            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link');
            await expect(page.locator('#tabToggle1')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane');
        });

        test('triggers show event', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle2 = $.findOne('#tabToggle2');
                const tab2 = $.findOne('#tab2');
                $.addEvent(tabToggle2, 'show.ui.tab', (_) => {
                    document.documentElement.dataset.tabShowState = String(
                        tabToggle2.className === 'nav-link' &&
                        tab2.className === 'tab-pane',
                    );
                });
                UI.Tab.init(tabToggle2).show();
            });

            await expect(page.locator('html')).toHaveAttribute('data-tab-show-state', 'true');
        });

        test('triggers shown event', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle2 = $.findOne('#tabToggle2');
                $.addEvent(tabToggle2, 'shown.ui.tab', (_) => {
                    document.documentElement.dataset.tabShown = 'true';
                });
                UI.Tab.init(tabToggle2).show();
            });
            await advanceClock(page, 250);

            await expect(page.locator('html')).toHaveAttribute('data-tab-shown', 'true');
            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link');
            await expect(page.locator('#tabToggle2')).toHaveClass('nav-link active');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane active');
        });

        test('triggers hide event on active tab', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tabToggle1');
                const tabToggle2 = $.findOne('#tabToggle2');
                const tab1 = $.findOne('#tab1');
                $.addEvent(tabToggle1, 'hide.ui.tab', (_) => {
                    document.documentElement.dataset.activeTabHideState = String(
                        tabToggle1.className === 'nav-link active' &&
                        tab1.className === 'tab-pane active',
                    );
                });
                UI.Tab.init(tabToggle2).show();
            });

            await expect(page.locator('html')).toHaveAttribute('data-active-tab-hide-state', 'true');
        });

        test('triggers hidden event on active tab', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tabToggle1');
                const tabToggle2 = $.findOne('#tabToggle2');
                const tab1 = $.findOne('#tab1');
                const tab2 = $.findOne('#tab2');
                $.addEvent(tabToggle1, 'hidden.ui.tab', (_) => {
                    document.documentElement.dataset.activeTabHiddenState = String(
                        tabToggle1.className === 'nav-link' &&
                        tabToggle2.className === 'nav-link' &&
                        tab1.className === 'tab-pane' &&
                        tab2.className === 'tab-pane',
                    );
                });
                UI.Tab.init(tabToggle2).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('html')).toHaveAttribute('data-active-tab-hidden-state', 'true');
        });

        test('can be prevented from hiding', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tabToggle1');
                $.addEvent(tabToggle1, 'hide.ui.tab', (_) => false);
                UI.Tab.init(tabToggle1).hide();
            });
            await advanceClock(page, 150);

            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link active');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane active');
            await expectAnimationState(page, [
                {
                    selectors: ['#tab1'],
                },
            ]);
        });

        test('can be prevented from hiding (prevent default)', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tabToggle1');
                $.addEvent(tabToggle1, 'hide.ui.tab', (event) => {
                    event.preventDefault();
                });
                UI.Tab.init(tabToggle1).hide();
            });
            await advanceClock(page, 150);

            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link active');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane active');
            await expectAnimationState(page, [
                {
                    selectors: ['#tab1'],
                },
            ]);
        });

        test('can be prevented from showing', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle2 = $.findOne('#tabToggle2');
                $.addEvent(tabToggle2, 'show.ui.tab', (_) => false);
                UI.Tab.init(tabToggle2).show();
            });
            await advanceClock(page, 100);

            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link active');
            await expect(page.locator('#tabToggle2')).toHaveClass('nav-link');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane active');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane');
        });

        test('can be prevented from showing (prevent default)', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle2 = $.findOne('#tabToggle2');
                $.addEvent(tabToggle2, 'show.ui.tab', (event) => {
                    event.preventDefault();
                });
                UI.Tab.init(tabToggle2).show();
            });
            await advanceClock(page, 100);

            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link active');
            await expect(page.locator('#tabToggle2')).toHaveClass('nav-link');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane active');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane');
        });

        test('can be prevented from hiding active tab', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tabToggle1');
                const tabToggle2 = $.findOne('#tabToggle2');
                $.addEvent(tabToggle1, 'hide.ui.tab', (_) => false);
                UI.Tab.init(tabToggle2).show();
            });
            await advanceClock(page, 250);

            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link active');
            await expect(page.locator('#tabToggle2')).toHaveClass('nav-link');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane active');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane');
        });

        test('can be prevented from hiding active tab (prevent default)', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tabToggle1');
                const tabToggle2 = $.findOne('#tabToggle2');
                $.addEvent(tabToggle1, 'hide.ui.tab', (event) => {
                    event.preventDefault();
                });
                UI.Tab.init(tabToggle2).hide();
            });
            await advanceClock(page, 250);

            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link active');
            await expect(page.locator('#tabToggle2')).toHaveClass('nav-link');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane active');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane');
        });
    });

    test.describe('duration option', () => {
        test('works with duration option on hide', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tabToggle1');
                UI.Tab.init(tabToggle1, { duration: 200 }).hide();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#tab1'],
                    progress: 0.875,
                    styles: { opacity: '0.13' },
                },
            ]);
        });

        test('works with duration option on hide (data-ui-duration)', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tabToggle1');
                $.setDataset(tabToggle1, { uiDuration: 200 });
                UI.Tab.init(tabToggle1).hide();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#tab1'],
                    progress: 0.875,
                    styles: { opacity: '0.13' },
                },
            ]);
        });

        test('works with duration option on hide (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tabToggle1')
                    .tab({ duration: 200 })
                    .hide();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#tab1'],
                    progress: 0.875,
                    styles: { opacity: '0.13' },
                },
            ]);
        });

        test('works with duration option on show', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle2 = $.findOne('#tabToggle2');
                UI.Tab.init(tabToggle2, { duration: 200 }).show();
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#tab1'],
                    progress: 0.5,
                },
            ]);
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#tab2'],
                    progress: 0.5,
                    styles: { opacity: '0.5' },
                },
            ]);
        });

        test('works with duration option on show (data-ui-duration)', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle2 = $.findOne('#tabToggle2');
                $.setDataset(tabToggle2, { uiDuration: 200 });
                UI.Tab.init(tabToggle2).show();
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#tab1'],
                    progress: 0.5,
                },
            ]);
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#tab2'],
                    progress: 0.5,
                    styles: { opacity: '0.5' },
                },
            ]);
        });

        test('works with duration option on show (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tabToggle2')
                    .tab({ duration: 200 })
                    .show();
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#tab1'],
                    progress: 0.5,
                },
            ]);
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#tab2'],
                    progress: 0.5,
                    styles: { opacity: '0.5' },
                },
            ]);
        });
    });

    test.describe('keyboard navigation', () => {
        test('focuses the next item on right arrow', async ({ page }) => {
            await page.locator('#tabToggle1').focus();
            await page.keyboard.press('ArrowRight');

            await expect(page.locator('#tabToggle2')).toBeFocused();
        });

        test('focuses the next item on down arrow', async ({ page }) => {
            await page.locator('#tabToggle1').focus();
            await page.keyboard.press('ArrowDown');

            await expect(page.locator('#tabToggle2')).toBeFocused();
        });

        test('focuses the previous item on left arrow', async ({ page }) => {
            await page.locator('#tabToggle2').focus();
            await page.keyboard.press('ArrowLeft');

            await expect(page.locator('#tabToggle1')).toBeFocused();
        });

        test('focuses the previous item on up arrow', async ({ page }) => {
            await page.locator('#tabToggle2').focus();
            await page.keyboard.press('ArrowUp');

            await expect(page.locator('#tabToggle1')).toBeFocused();
        });

        test('focuses the first item on home key', async ({ page }) => {
            await page.locator('#tabToggle2').focus();
            await page.keyboard.press('Home');

            await expect(page.locator('#tabToggle1')).toBeFocused();
        });

        test('focuses the last item on end key', async ({ page }) => {
            await page.locator('#tabToggle1').focus();
            await page.keyboard.press('End');

            await expect(page.locator('#tabToggle2')).toBeFocused();
        });
    });
});
