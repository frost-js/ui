import { expect, test } from '@playwright/test';
import { resetPage } from '../../setup/browser.js';

test.use({ reducedMotion: 'no-preference' });

test.beforeEach(async ({ page }) => {
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
                '<div class="tab-pane fade active show" id="tab1"></div>' +
                '<div class="tab-pane fade" id="tab2"></div>' +
                '</div>' +
                '<div class="nav nav-tabs">' +
                '<a class="nav-link active" id="tabToggle3" href="#tab3" data-ui-toggle="tab"></a>' +
                '<a class="nav-link" id="tabToggle4" href="#tab4" data-ui-toggle="tab"></a>' +
                '</div>' +
                '<div class="tab-content">' +
                '<div class="tab-pane fade active show" id="tab3"></div>' +
                '<div class="tab-pane fade" id="tab4"></div>' +
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
    });

    test.describe('#hide', () => {
        test('hides the tab', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tabToggle1');
                UI.Tab.init(tabToggle1).hide();
            });

            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link');
            await expect(page.locator('#tabToggle1')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade');
            await expect(page.locator('#tab1')).toBeHidden();
            await expect(page.locator('#tab1')).not.toHaveAttribute('style');
        });

        test('hides the tab (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tabToggle1').tab('hide');
            });

            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link');
            await expect(page.locator('#tabToggle1')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade');
            await expect(page.locator('#tab1')).toBeHidden();
        });

        test('hides multiple tabs (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tabToggle1, #tabToggle3').tab('hide');
            });

            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link');
            await expect(page.locator('#tabToggle3')).toHaveClass('nav-link');
            await expect(page.locator('#tabToggle1')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tabToggle3')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade');
            await expect(page.locator('#tab3')).toHaveClass('tab-pane fade');
        });

        test('does not remove the tab after hiding', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tabToggle1');
                UI.Tab.init(tabToggle1).hide();
            });
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade');

            expect(await page.evaluate((_) =>
                $.getData('#tabToggle1', 'tab') instanceof UI.Tab)).toBe(true);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tabToggle1');
                const tab = UI.Tab.init(tabToggle1);
                window.tabHiddenEvents = 0;

                $.addEvent(tabToggle1, 'hidden.ui.tab', (_) => {
                    window.tabHiddenEvents++;
                });
                tab.hide();
                tab.hide();
                tab.hide();
            });

            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade');
            expect(await page.evaluate((_) => window.tabHiddenEvents)).toBe(1);
        });

        test('can be called on hidden tab', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle2 = $.findOne('#tabToggle2');
                UI.Tab.init(tabToggle2).hide();
            });

            await expect(page.locator('#tabToggle2')).toHaveClass('nav-link');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade');
        });

        test('hides without a transition class', async ({ page }) => {
            await page.evaluate((_) => {
                const tab1 = $.findOne('#tab1');
                $.removeClass(tab1, 'fade');
                UI.Tab.init($.findOne('#tabToggle1')).hide();
            });

            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane');
        });

        test('hides while transitioning in', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle2 = $.findOne('#tabToggle2');
                const tab = UI.Tab.init(tabToggle2);
                tab.show();
                tab.hide();
            });

            await expect(page.locator('#tabToggle2')).toHaveClass('nav-link');
            await expect(page.locator('#tabToggle2')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade');
        });
    });

    test.describe('#show', () => {
        test('shows the tab', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle2 = $.findOne('#tabToggle2');
                UI.Tab.init(tabToggle2).show();
            });

            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link');
            await expect(page.locator('#tabToggle1')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tabToggle2')).toHaveClass('nav-link active');
            await expect(page.locator('#tabToggle2')).toHaveAttribute('aria-selected', 'true');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade active show');
            await expect(page.locator('#tab2')).toHaveCSS('opacity', '1');
            await expect(page.locator('#tab1')).not.toHaveAttribute('style');
            await expect(page.locator('#tab2')).not.toHaveAttribute('style');
        });

        test('shows the tab (data-ui-toggle)', async ({ page }) => {
            await page.locator('#tabToggle2').click();

            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link');
            await expect(page.locator('#tabToggle1')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tabToggle2')).toHaveClass('nav-link active');
            await expect(page.locator('#tabToggle2')).toHaveAttribute('aria-selected', 'true');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade active show');
        });

        test('shows the tab (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tabToggle2').tab('show');
            });

            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link');
            await expect(page.locator('#tabToggle1')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tabToggle2')).toHaveClass('nav-link active');
            await expect(page.locator('#tabToggle2')).toHaveAttribute('aria-selected', 'true');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade active show');
        });

        test('shows multiple tabs (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tabToggle2, #tabToggle4').tab('show');
            });

            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link');
            await expect(page.locator('#tabToggle2')).toHaveClass('nav-link active');
            await expect(page.locator('#tabToggle3')).toHaveClass('nav-link');
            await expect(page.locator('#tabToggle4')).toHaveClass('nav-link active');
            await expect(page.locator('#tabToggle1')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tabToggle2')).toHaveAttribute('aria-selected', 'true');
            await expect(page.locator('#tabToggle3')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tabToggle4')).toHaveAttribute('aria-selected', 'true');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade active show');
            await expect(page.locator('#tab3')).toHaveClass('tab-pane fade');
            await expect(page.locator('#tab4')).toHaveClass('tab-pane fade active show');
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle2 = $.findOne('#tabToggle2');
                const tab = UI.Tab.init(tabToggle2);
                window.tabShownEvents = 0;

                $.addEvent(tabToggle2, 'shown.ui.tab', (_) => {
                    window.tabShownEvents++;
                });
                tab.show();
                tab.show();
                tab.show();
            });

            await expect(page.locator('#tab2')).toHaveCSS('opacity', '1');
            expect(await page.evaluate((_) => window.tabShownEvents)).toBe(1);
            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link');
            await expect(page.locator('#tabToggle1')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tabToggle2')).toHaveClass('nav-link active');
            await expect(page.locator('#tabToggle2')).toHaveAttribute('aria-selected', 'true');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade active show');
        });

        test('uses the latest tab during rapid navigation', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tabToggle1');
                const tabToggle2 = $.findOne('#tabToggle2');
                const tab1 = UI.Tab.init(tabToggle1);
                const tab2 = UI.Tab.init(tabToggle2);
                window.tab1ShownEvents = 0;
                window.tab2ShownEvents = 0;

                $.addEvent(tabToggle1, 'shown.ui.tab', (_) => {
                    window.tab1ShownEvents++;
                });
                $.addEvent(tabToggle2, 'shown.ui.tab', (_) => {
                    window.tab2ShownEvents++;
                });

                tab2.show();
                tab1.show();
                tab2.show();
            });

            await expect(page.locator('#tab2')).toHaveCSS('opacity', '1');
            expect(await page.evaluate((_) => window.tab1ShownEvents)).toBe(0);
            expect(await page.evaluate((_) => window.tab2ShownEvents)).toBe(1);
            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link');
            await expect(page.locator('#tabToggle2')).toHaveClass('nav-link active');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade active show');
        });

        test('can be called on shown tab', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tabToggle1');
                UI.Tab.init(tabToggle1).show();
            });

            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link active');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade active show');
        });

        test('shows without transition classes', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tab1, #tab2').removeClass('fade');
                UI.Tab.init($.findOne('#tabToggle2')).show();
            });

            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link');
            await expect(page.locator('#tabToggle2')).toHaveClass('nav-link active');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane active show');
        });

        test('shows when the transition is canceled', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle2 = $.findOne('#tabToggle2');
                UI.Tab.init(tabToggle2).show();
                $.findOne('#tab2').getAnimations()
                    .find((animation) => animation instanceof CSSTransition)
                    .cancel();
            });

            await expect(page.locator('#tabToggle2')).toHaveAttribute('aria-selected', 'true');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade active show');
        });
    });

    test.describe('events', () => {
        test('triggers hide event', async ({ page }) => {
            const eventTriggered = await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tabToggle1');
                let triggered = false;

                $.addEvent(tabToggle1, 'hide.ui.tab', (_) => {
                    triggered = true;
                });
                UI.Tab.init(tabToggle1).hide();

                return triggered;
            });

            expect(eventTriggered).toBe(true);
        });

        test('triggers hidden event', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tabToggle1');
                window.tabHiddenEventTriggered = false;

                $.addEvent(tabToggle1, 'hidden.ui.tab', (_) => {
                    window.tabHiddenEventTriggered = true;
                });
                UI.Tab.init(tabToggle1).hide();
            });

            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade');
            expect(await page.evaluate((_) => window.tabHiddenEventTriggered)).toBe(true);
            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link');
            await expect(page.locator('#tabToggle1')).toHaveAttribute('aria-selected', 'false');
        });

        test('triggers show event', async ({ page }) => {
            const eventTriggered = await page.evaluate((_) => {
                const tabToggle2 = $.findOne('#tabToggle2');
                let triggered = false;

                $.addEvent(tabToggle2, 'show.ui.tab', (_) => {
                    triggered = true;
                });
                UI.Tab.init(tabToggle2).show();

                return triggered;
            });

            expect(eventTriggered).toBe(true);
        });

        test('triggers shown event', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle2 = $.findOne('#tabToggle2');
                window.tabShownEventTriggered = false;

                $.addEvent(tabToggle2, 'shown.ui.tab', (_) => {
                    window.tabShownEventTriggered = true;
                });
                UI.Tab.init(tabToggle2).show();
            });

            await expect(page.locator('#tab2')).toHaveCSS('opacity', '1');
            expect(await page.evaluate((_) => window.tabShownEventTriggered)).toBe(true);
            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link');
            await expect(page.locator('#tabToggle1')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tabToggle2')).toHaveClass('nav-link active');
            await expect(page.locator('#tabToggle2')).toHaveAttribute('aria-selected', 'true');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade active show');
        });

        test('triggers hide event on active tab', async ({ page }) => {
            const eventTriggered = await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tabToggle1');
                const tabToggle2 = $.findOne('#tabToggle2');
                let triggered = false;

                $.addEvent(tabToggle1, 'hide.ui.tab', (_) => {
                    triggered = true;
                });
                UI.Tab.init(tabToggle2).show();

                return triggered;
            });

            expect(eventTriggered).toBe(true);
        });

        test('triggers hidden event on active tab', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tabToggle1');
                const tabToggle2 = $.findOne('#tabToggle2');
                window.activeTabHiddenEventTriggered = false;

                $.addEvent(tabToggle1, 'hidden.ui.tab', (_) => {
                    window.activeTabHiddenEventTriggered = true;
                });
                UI.Tab.init(tabToggle2).show();
            });

            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade');
            expect(await page.evaluate((_) => window.activeTabHiddenEventTriggered)).toBe(true);
        });

        test('can show from the hidden event', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tabToggle1');
                const tab = UI.Tab.init(tabToggle1);

                $.addEventOnce(tabToggle1, 'hidden.ui.tab', (_) => {
                    tab.show();
                });
                tab.hide();
            });

            await expect(page.locator('#tabToggle1')).toHaveAttribute('aria-selected', 'true');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade active show');
            await expect(page.locator('#tab1')).toHaveCSS('opacity', '1');
        });

        test('can hide from the shown event', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle2 = $.findOne('#tabToggle2');
                const tab = UI.Tab.init(tabToggle2);

                $.addEventOnce(tabToggle2, 'shown.ui.tab', (_) => {
                    tab.hide();
                });
                tab.show();
            });

            await expect(page.locator('#tabToggle2')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade');
        });

        test('can be prevented from hiding', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tabToggle1');
                $.addEvent(tabToggle1, 'hide.ui.tab', (_) => false);
                UI.Tab.init(tabToggle1).hide();
            });

            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link active');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade active show');
            await expect(page.locator('#tab1')).toHaveCSS('opacity', '1');
        });

        test('can be prevented from hiding (prevent default)', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tabToggle1');
                $.addEvent(tabToggle1, 'hide.ui.tab', (event) => {
                    event.preventDefault();
                });
                UI.Tab.init(tabToggle1).hide();
            });

            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link active');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade active show');
            await expect(page.locator('#tab1')).toHaveCSS('opacity', '1');
        });

        test('can be prevented from showing', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle2 = $.findOne('#tabToggle2');
                $.addEvent(tabToggle2, 'show.ui.tab', (_) => false);
                UI.Tab.init(tabToggle2).show();
            });

            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link active');
            await expect(page.locator('#tabToggle2')).toHaveClass('nav-link');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade active show');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade');
        });

        test('can be prevented from showing (prevent default)', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle2 = $.findOne('#tabToggle2');
                $.addEvent(tabToggle2, 'show.ui.tab', (event) => {
                    event.preventDefault();
                });
                UI.Tab.init(tabToggle2).show();
            });

            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link active');
            await expect(page.locator('#tabToggle2')).toHaveClass('nav-link');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade active show');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade');
        });

        test('can be prevented from hiding active tab', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tabToggle1');
                const tabToggle2 = $.findOne('#tabToggle2');
                $.addEvent(tabToggle1, 'hide.ui.tab', (_) => false);
                UI.Tab.init(tabToggle2).show();
            });

            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link active');
            await expect(page.locator('#tabToggle2')).toHaveClass('nav-link');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade active show');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade');
        });

        test('can be prevented from hiding active tab (prevent default)', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tabToggle1');
                const tabToggle2 = $.findOne('#tabToggle2');
                $.addEvent(tabToggle1, 'hide.ui.tab', (event) => {
                    event.preventDefault();
                });
                UI.Tab.init(tabToggle2).show();
            });

            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link active');
            await expect(page.locator('#tabToggle2')).toHaveClass('nav-link');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade active show');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade');
        });
    });

    test.describe('keyboard navigation', () => {
        test('shows and focuses the next item on right arrow', async ({ page }) => {
            await page.locator('#tabToggle1').focus();
            await page.keyboard.press('ArrowRight');

            await expect(page.locator('#tabToggle2')).toBeFocused();
            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link');
            await expect(page.locator('#tabToggle2')).toHaveClass('nav-link active');
            await expect(page.locator('#tabToggle1')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tabToggle2')).toHaveAttribute('aria-selected', 'true');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade active show');
        });

        test('shows and focuses the next item on down arrow', async ({ page }) => {
            await page.locator('#tabToggle1').focus();
            await page.keyboard.press('ArrowDown');

            await expect(page.locator('#tabToggle2')).toBeFocused();
            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link');
            await expect(page.locator('#tabToggle2')).toHaveClass('nav-link active');
            await expect(page.locator('#tabToggle1')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tabToggle2')).toHaveAttribute('aria-selected', 'true');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade active show');
        });

        test('shows and focuses the previous item on left arrow', async ({ page }) => {
            await page.locator('#tabToggle2').click();
            await page.keyboard.press('ArrowLeft');

            await expect(page.locator('#tabToggle1')).toBeFocused();
            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link active');
            await expect(page.locator('#tabToggle2')).toHaveClass('nav-link');
            await expect(page.locator('#tabToggle1')).toHaveAttribute('aria-selected', 'true');
            await expect(page.locator('#tabToggle2')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade active show');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade');
        });

        test('shows and focuses the previous item on up arrow', async ({ page }) => {
            await page.locator('#tabToggle2').click();
            await page.keyboard.press('ArrowUp');

            await expect(page.locator('#tabToggle1')).toBeFocused();
            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link active');
            await expect(page.locator('#tabToggle2')).toHaveClass('nav-link');
            await expect(page.locator('#tabToggle1')).toHaveAttribute('aria-selected', 'true');
            await expect(page.locator('#tabToggle2')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade active show');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade');
        });

        test('shows and focuses the first item on home key', async ({ page }) => {
            await page.locator('#tabToggle2').click();
            await page.keyboard.press('Home');

            await expect(page.locator('#tabToggle1')).toBeFocused();
            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link active');
            await expect(page.locator('#tabToggle2')).toHaveClass('nav-link');
            await expect(page.locator('#tabToggle1')).toHaveAttribute('aria-selected', 'true');
            await expect(page.locator('#tabToggle2')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade active show');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade');
        });

        test('shows and focuses the last item on end key', async ({ page }) => {
            await page.locator('#tabToggle1').focus();
            await page.keyboard.press('End');

            await expect(page.locator('#tabToggle2')).toBeFocused();
            await expect(page.locator('#tabToggle1')).toHaveClass('nav-link');
            await expect(page.locator('#tabToggle2')).toHaveClass('nav-link active');
            await expect(page.locator('#tabToggle1')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tabToggle2')).toHaveAttribute('aria-selected', 'true');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade active show');
        });
    });
});
