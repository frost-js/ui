import { expect, test } from '#test';
import { resetPage } from '../../setup/browser.js';

test.use({ reducedMotion: 'no-preference' });

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('Tab', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            $.setHtml(
                document.body,
                `
                    <div class="nav nav-tabs">
                        <a class="nav-link active" id="tab-toggle-1" href="#tab1" data-ui-toggle="tab"></a>
                        <a class="nav-link" id="tab-toggle-2" href="#tab2" data-ui-toggle="tab"></a>
                    </div>
                    <div class="tab-content">
                        <div class="tab-pane fade active show" id="tab1"></div>
                        <div class="tab-pane fade" id="tab2"></div>
                    </div>
                    <div class="nav nav-tabs">
                        <a class="nav-link active" id="tab-toggle-3" href="#tab3" data-ui-toggle="tab"></a>
                        <a class="nav-link" id="tab-toggle-4" href="#tab4" data-ui-toggle="tab"></a>
                    </div>
                    <div class="tab-content">
                        <div class="tab-pane fade active show" id="tab3"></div>
                        <div class="tab-pane fade" id="tab4"></div>
                    </div>
                `,
            );
        });
    });

    test.describe('#init', () => {
        test('creates a tab', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tab-toggle-1');
                return UI.Tab.init(tabToggle1) instanceof UI.Tab;
            })).toBe(true);
        });

        test('creates a tab (data-ui-toggle)', async ({ page }) => {
            await page.locator('#tab-toggle-1').click();

            expect(await page.evaluate((_) =>
                $.getData('#tab-toggle-1', 'tab') instanceof UI.Tab)).toBe(true);
        });

        test('creates a tab (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('#tab-toggle-1').tab();
                return $.getData('#tab-toggle-1', 'tab') instanceof UI.Tab;
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
                $('#tab-toggle-1').tab() instanceof UI.Tab)).toBe(true);
        });
    });

    test.describe('#dispose', () => {
        test('removes the tab', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tab-toggle-1');
                UI.Tab.init(tabToggle1).dispose();
                return $.hasData(tabToggle1, 'tab');
            })).toBe(false);
        });

        test('removes the tab (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('#tab-toggle-1').tab('dispose');
                return $.hasData('#tab-toggle-1', 'tab');
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
                const tabToggle1 = $.findOne('#tab-toggle-1');
                UI.Tab.init(tabToggle1).hide();
            });

            await expect(page.locator('#tab-toggle-1')).toHaveClass('nav-link');
            await expect(page.locator('#tab-toggle-1')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade');
            await expect(page.locator('#tab1')).toBeHidden();
            await expect(page.locator('#tab1')).not.toHaveAttribute('style');
        });

        test('hides the tab (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tab-toggle-1').tab('hide');
            });

            await expect(page.locator('#tab-toggle-1')).toHaveClass('nav-link');
            await expect(page.locator('#tab-toggle-1')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade');
            await expect(page.locator('#tab1')).toBeHidden();
        });

        test('hides multiple tabs (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tab-toggle-1, #tab-toggle-3').tab('hide');
            });

            await expect(page.locator('#tab-toggle-1')).toHaveClass('nav-link');
            await expect(page.locator('#tab-toggle-3')).toHaveClass('nav-link');
            await expect(page.locator('#tab-toggle-1')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tab-toggle-3')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade');
            await expect(page.locator('#tab3')).toHaveClass('tab-pane fade');
        });

        test('does not remove the tab after hiding', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tab-toggle-1');
                UI.Tab.init(tabToggle1).hide();
            });
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade');

            expect(await page.evaluate((_) =>
                $.getData('#tab-toggle-1', 'tab') instanceof UI.Tab)).toBe(true);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tab-toggle-1');
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
                const tabToggle2 = $.findOne('#tab-toggle-2');
                UI.Tab.init(tabToggle2).hide();
            });

            await expect(page.locator('#tab-toggle-2')).toHaveClass('nav-link');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade');
        });

        test('hides without a transition class', async ({ page }) => {
            await page.evaluate((_) => {
                const tab1 = $.findOne('#tab1');
                $.removeClass(tab1, 'fade');
                UI.Tab.init($.findOne('#tab-toggle-1')).hide();
            });

            await expect(page.locator('#tab-toggle-1')).toHaveClass('nav-link');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane');
        });

        test('hides while transitioning in', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle2 = $.findOne('#tab-toggle-2');
                const tab = UI.Tab.init(tabToggle2);
                tab.show();
                tab.hide();
            });

            await expect(page.locator('#tab-toggle-2')).toHaveClass('nav-link');
            await expect(page.locator('#tab-toggle-2')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade');
        });
    });

    test.describe('#show', () => {
        test('shows the tab', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle2 = $.findOne('#tab-toggle-2');
                UI.Tab.init(tabToggle2).show();
            });

            await expect(page.locator('#tab-toggle-1')).toHaveClass('nav-link');
            await expect(page.locator('#tab-toggle-1')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tab-toggle-2')).toHaveClass('nav-link active');
            await expect(page.locator('#tab-toggle-2')).toHaveAttribute('aria-selected', 'true');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade active show');
            await expect(page.locator('#tab2')).toHaveCSS('opacity', '1');
            await expect(page.locator('#tab1')).not.toHaveAttribute('style');
            await expect(page.locator('#tab2')).not.toHaveAttribute('style');
        });

        test('shows the tab (data-ui-toggle)', async ({ page }) => {
            await page.locator('#tab-toggle-2').click();

            await expect(page.locator('#tab-toggle-1')).toHaveClass('nav-link');
            await expect(page.locator('#tab-toggle-1')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tab-toggle-2')).toHaveClass('nav-link active');
            await expect(page.locator('#tab-toggle-2')).toHaveAttribute('aria-selected', 'true');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade active show');
        });

        test('shows the tab (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tab-toggle-2').tab('show');
            });

            await expect(page.locator('#tab-toggle-1')).toHaveClass('nav-link');
            await expect(page.locator('#tab-toggle-1')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tab-toggle-2')).toHaveClass('nav-link active');
            await expect(page.locator('#tab-toggle-2')).toHaveAttribute('aria-selected', 'true');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade active show');
        });

        test('shows multiple tabs (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tab-toggle-2, #tab-toggle-4').tab('show');
            });

            await expect(page.locator('#tab-toggle-1')).toHaveClass('nav-link');
            await expect(page.locator('#tab-toggle-2')).toHaveClass('nav-link active');
            await expect(page.locator('#tab-toggle-3')).toHaveClass('nav-link');
            await expect(page.locator('#tab-toggle-4')).toHaveClass('nav-link active');
            await expect(page.locator('#tab-toggle-1')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tab-toggle-2')).toHaveAttribute('aria-selected', 'true');
            await expect(page.locator('#tab-toggle-3')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tab-toggle-4')).toHaveAttribute('aria-selected', 'true');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade active show');
            await expect(page.locator('#tab3')).toHaveClass('tab-pane fade');
            await expect(page.locator('#tab4')).toHaveClass('tab-pane fade active show');
        });

        test('can be called multiple times', async ({ page }) => {
            const shownEvents = await page.evaluate(async (_) => {
                const tabToggle2 = $.findOne('#tab-toggle-2');
                const tab = UI.Tab.init(tabToggle2);
                let shownEvents = 0;

                const shown = new Promise((resolve) => {
                    $.addEvent(tabToggle2, 'shown.ui.tab', (_) => {
                        shownEvents++;
                        resolve();
                    });
                });
                tab.show();
                tab.show();
                tab.show();

                await shown;

                return shownEvents;
            });

            expect(shownEvents).toBe(1);
            await expect(page.locator('#tab2')).toHaveCSS('opacity', '1');
            await expect(page.locator('#tab-toggle-1')).toHaveClass('nav-link');
            await expect(page.locator('#tab-toggle-1')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tab-toggle-2')).toHaveClass('nav-link active');
            await expect(page.locator('#tab-toggle-2')).toHaveAttribute('aria-selected', 'true');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade active show');
        });

        test('uses the latest tab during rapid navigation', async ({ page }) => {
            const shownEvents = await page.evaluate(async (_) => {
                const tabToggle1 = $.findOne('#tab-toggle-1');
                const tabToggle2 = $.findOne('#tab-toggle-2');
                const tab1 = UI.Tab.init(tabToggle1);
                const tab2 = UI.Tab.init(tabToggle2);
                let tab1Events = 0;
                let tab2Events = 0;

                $.addEvent(tabToggle1, 'shown.ui.tab', (_) => {
                    tab1Events++;
                });
                const shown = new Promise((resolve) => {
                    $.addEvent(tabToggle2, 'shown.ui.tab', (_) => {
                        tab2Events++;
                        resolve();
                    });
                });

                tab2.show();
                tab1.show();
                tab2.show();

                await shown;

                return { tab1Events, tab2Events };
            });

            expect(shownEvents.tab1Events).toBe(0);
            expect(shownEvents.tab2Events).toBe(1);
            await expect(page.locator('#tab2')).toHaveCSS('opacity', '1');
            await expect(page.locator('#tab-toggle-1')).toHaveClass('nav-link');
            await expect(page.locator('#tab-toggle-2')).toHaveClass('nav-link active');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade active show');
        });

        test('can be called on shown tab', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tab-toggle-1');
                UI.Tab.init(tabToggle1).show();
            });

            await expect(page.locator('#tab-toggle-1')).toHaveClass('nav-link active');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade active show');
        });

        test('shows without transition classes', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tab1, #tab2').removeClass('fade');
                UI.Tab.init($.findOne('#tab-toggle-2')).show();
            });

            await expect(page.locator('#tab-toggle-1')).toHaveClass('nav-link');
            await expect(page.locator('#tab-toggle-2')).toHaveClass('nav-link active');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane active show');
        });

        test('shows when the transition is canceled', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle2 = $.findOne('#tab-toggle-2');
                UI.Tab.init(tabToggle2).show();
                $.findOne('#tab2').getAnimations()
                    .find((animation) => animation instanceof CSSTransition)
                    .cancel();
            });

            await expect(page.locator('#tab-toggle-2')).toHaveAttribute('aria-selected', 'true');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade active show');
        });
    });

    test.describe('events', () => {
        test('triggers hide event', async ({ page }) => {
            const eventTriggered = await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tab-toggle-1');
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
                const tabToggle1 = $.findOne('#tab-toggle-1');
                window.tabHiddenEventTriggered = false;

                $.addEvent(tabToggle1, 'hidden.ui.tab', (_) => {
                    window.tabHiddenEventTriggered = true;
                });
                UI.Tab.init(tabToggle1).hide();
            });

            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade');
            expect(await page.evaluate((_) => window.tabHiddenEventTriggered)).toBe(true);
            await expect(page.locator('#tab-toggle-1')).toHaveClass('nav-link');
            await expect(page.locator('#tab-toggle-1')).toHaveAttribute('aria-selected', 'false');
        });

        test('triggers show event', async ({ page }) => {
            const eventTriggered = await page.evaluate((_) => {
                const tabToggle2 = $.findOne('#tab-toggle-2');
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
            const eventTriggered = await page.evaluate((_) => new Promise((resolve) => {
                const tabToggle2 = $.findOne('#tab-toggle-2');

                $.addEventOnce(tabToggle2, 'shown.ui.tab', (_) => resolve(true));
                UI.Tab.init(tabToggle2).show();
            }));

            expect(eventTriggered).toBe(true);
            await expect(page.locator('#tab2')).toHaveCSS('opacity', '1');
            await expect(page.locator('#tab-toggle-1')).toHaveClass('nav-link');
            await expect(page.locator('#tab-toggle-1')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tab-toggle-2')).toHaveClass('nav-link active');
            await expect(page.locator('#tab-toggle-2')).toHaveAttribute('aria-selected', 'true');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade active show');
        });

        test('triggers hide event on active tab', async ({ page }) => {
            const eventTriggered = await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tab-toggle-1');
                const tabToggle2 = $.findOne('#tab-toggle-2');
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
                const tabToggle1 = $.findOne('#tab-toggle-1');
                const tabToggle2 = $.findOne('#tab-toggle-2');
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
                const tabToggle1 = $.findOne('#tab-toggle-1');
                const tab = UI.Tab.init(tabToggle1);

                $.addEventOnce(tabToggle1, 'hidden.ui.tab', (_) => {
                    tab.show();
                });
                tab.hide();
            });

            await expect(page.locator('#tab-toggle-1')).toHaveAttribute('aria-selected', 'true');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade active show');
            await expect(page.locator('#tab1')).toHaveCSS('opacity', '1');
        });

        test('can hide from the shown event', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle2 = $.findOne('#tab-toggle-2');
                const tab = UI.Tab.init(tabToggle2);

                $.addEventOnce(tabToggle2, 'shown.ui.tab', (_) => {
                    tab.hide();
                });
                tab.show();
            });

            await expect(page.locator('#tab-toggle-2')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade');
        });

        test('can be prevented from hiding', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tab-toggle-1');
                $.addEvent(tabToggle1, 'hide.ui.tab', (_) => false);
                UI.Tab.init(tabToggle1).hide();
            });

            await expect(page.locator('#tab-toggle-1')).toHaveClass('nav-link active');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade active show');
            await expect(page.locator('#tab1')).toHaveCSS('opacity', '1');
        });

        test('can be prevented from hiding (prevent default)', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tab-toggle-1');
                $.addEvent(tabToggle1, 'hide.ui.tab', (event) => {
                    event.preventDefault();
                });
                UI.Tab.init(tabToggle1).hide();
            });

            await expect(page.locator('#tab-toggle-1')).toHaveClass('nav-link active');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade active show');
            await expect(page.locator('#tab1')).toHaveCSS('opacity', '1');
        });

        test('can be prevented from showing', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle2 = $.findOne('#tab-toggle-2');
                $.addEvent(tabToggle2, 'show.ui.tab', (_) => false);
                UI.Tab.init(tabToggle2).show();
            });

            await expect(page.locator('#tab-toggle-1')).toHaveClass('nav-link active');
            await expect(page.locator('#tab-toggle-2')).toHaveClass('nav-link');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade active show');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade');
        });

        test('can be prevented from showing (prevent default)', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle2 = $.findOne('#tab-toggle-2');
                $.addEvent(tabToggle2, 'show.ui.tab', (event) => {
                    event.preventDefault();
                });
                UI.Tab.init(tabToggle2).show();
            });

            await expect(page.locator('#tab-toggle-1')).toHaveClass('nav-link active');
            await expect(page.locator('#tab-toggle-2')).toHaveClass('nav-link');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade active show');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade');
        });

        test('can be prevented from hiding active tab', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tab-toggle-1');
                const tabToggle2 = $.findOne('#tab-toggle-2');
                $.addEvent(tabToggle1, 'hide.ui.tab', (_) => false);
                UI.Tab.init(tabToggle2).show();
            });

            await expect(page.locator('#tab-toggle-1')).toHaveClass('nav-link active');
            await expect(page.locator('#tab-toggle-2')).toHaveClass('nav-link');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade active show');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade');
        });

        test('can be prevented from hiding active tab (prevent default)', async ({ page }) => {
            await page.evaluate((_) => {
                const tabToggle1 = $.findOne('#tab-toggle-1');
                const tabToggle2 = $.findOne('#tab-toggle-2');
                $.addEvent(tabToggle1, 'hide.ui.tab', (event) => {
                    event.preventDefault();
                });
                UI.Tab.init(tabToggle2).show();
            });

            await expect(page.locator('#tab-toggle-1')).toHaveClass('nav-link active');
            await expect(page.locator('#tab-toggle-2')).toHaveClass('nav-link');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade active show');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade');
        });
    });

    test.describe('nav item wrappers', () => {
        test('shows the tab', async ({ page }) => {
            await page.evaluate((_) => {
                $.setHtml(
                    document.body,
                    `
                        <ul class="nav nav-tabs" role="tablist">
                            <li class="nav-item">
                                <button class="nav-link active" id="wrapped-tab-toggle-1" data-ui-toggle="tab" data-ui-target="#wrapped-tab1" type="button"></button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link" id="wrapped-tab-toggle-2" data-ui-toggle="tab" data-ui-target="#wrapped-tab2" type="button"></button>
                            </li>
                        </ul>
                        <div class="tab-content">
                            <div class="tab-pane fade active show" id="wrapped-tab1"></div>
                            <div class="tab-pane fade" id="wrapped-tab2"></div>
                        </div>
                    `,
                );

                UI.Tab.init($.findOne('#wrapped-tab-toggle-2')).show();
            });

            await expect(page.locator('#wrapped-tab-toggle-1')).toHaveClass('nav-link');
            await expect(page.locator('#wrapped-tab-toggle-2')).toHaveClass('nav-link active');
            await expect(page.locator('#wrapped-tab1')).toHaveClass('tab-pane fade');
            await expect(page.locator('#wrapped-tab2')).toHaveClass('tab-pane fade active show');
        });

        test('skips disabled tabs during keyboard navigation', async ({ page }) => {
            await page.evaluate((_) => {
                $.setHtml(
                    document.body,
                    `
                        <ul class="nav nav-tabs" role="tablist">
                            <li class="nav-item">
                                <button class="nav-link active" id="wrapped-tab-toggle-1" data-ui-toggle="tab" data-ui-target="#wrapped-tab1" type="button"></button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link disabled" id="wrapped-tab-toggle-2" data-ui-toggle="tab" data-ui-target="#wrapped-tab2" type="button"></button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link" id="wrapped-tab-toggle-3" data-ui-toggle="tab" data-ui-target="#wrapped-tab3" type="button"></button>
                            </li>
                        </ul>
                        <div class="tab-content">
                            <div class="tab-pane fade active show" id="wrapped-tab1"></div>
                            <div class="tab-pane fade" id="wrapped-tab2"></div>
                            <div class="tab-pane fade" id="wrapped-tab3"></div>
                        </div>
                    `,
                );
            });

            await page.locator('#wrapped-tab-toggle-1').focus();
            await page.keyboard.press('ArrowRight');

            await expect(page.locator('#wrapped-tab-toggle-3')).toBeFocused();
            await expect(page.locator('#wrapped-tab-toggle-1')).toHaveClass('nav-link');
            await expect(page.locator('#wrapped-tab-toggle-2')).toHaveClass('nav-link disabled');
            await expect(page.locator('#wrapped-tab-toggle-3')).toHaveClass('nav-link active');
            await expect(page.locator('#wrapped-tab1')).toHaveClass('tab-pane fade');
            await expect(page.locator('#wrapped-tab2')).toHaveClass('tab-pane fade');
            await expect(page.locator('#wrapped-tab3')).toHaveClass('tab-pane fade active show');
        });
    });

    test.describe('keyboard navigation', () => {
        test('shows and focuses the next item on right arrow', async ({ page }) => {
            await page.locator('#tab-toggle-1').focus();
            await page.keyboard.press('ArrowRight');

            await expect(page.locator('#tab-toggle-2')).toBeFocused();
            await expect(page.locator('#tab-toggle-1')).toHaveClass('nav-link');
            await expect(page.locator('#tab-toggle-2')).toHaveClass('nav-link active');
            await expect(page.locator('#tab-toggle-1')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tab-toggle-2')).toHaveAttribute('aria-selected', 'true');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade active show');
        });

        test('shows and focuses the next item on down arrow', async ({ page }) => {
            await page.locator('#tab-toggle-1').focus();
            await page.keyboard.press('ArrowDown');

            await expect(page.locator('#tab-toggle-2')).toBeFocused();
            await expect(page.locator('#tab-toggle-1')).toHaveClass('nav-link');
            await expect(page.locator('#tab-toggle-2')).toHaveClass('nav-link active');
            await expect(page.locator('#tab-toggle-1')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tab-toggle-2')).toHaveAttribute('aria-selected', 'true');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade active show');
        });

        test('shows and focuses the previous item on left arrow', async ({ page }) => {
            await page.locator('#tab-toggle-2').click();
            await page.keyboard.press('ArrowLeft');

            await expect(page.locator('#tab-toggle-1')).toBeFocused();
            await expect(page.locator('#tab-toggle-1')).toHaveClass('nav-link active');
            await expect(page.locator('#tab-toggle-2')).toHaveClass('nav-link');
            await expect(page.locator('#tab-toggle-1')).toHaveAttribute('aria-selected', 'true');
            await expect(page.locator('#tab-toggle-2')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade active show');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade');
        });

        test('shows and focuses the previous item on up arrow', async ({ page }) => {
            await page.locator('#tab-toggle-2').click();
            await page.keyboard.press('ArrowUp');

            await expect(page.locator('#tab-toggle-1')).toBeFocused();
            await expect(page.locator('#tab-toggle-1')).toHaveClass('nav-link active');
            await expect(page.locator('#tab-toggle-2')).toHaveClass('nav-link');
            await expect(page.locator('#tab-toggle-1')).toHaveAttribute('aria-selected', 'true');
            await expect(page.locator('#tab-toggle-2')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade active show');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade');
        });

        test('shows and focuses the first item on home key', async ({ page }) => {
            await page.locator('#tab-toggle-2').click();
            await page.keyboard.press('Home');

            await expect(page.locator('#tab-toggle-1')).toBeFocused();
            await expect(page.locator('#tab-toggle-1')).toHaveClass('nav-link active');
            await expect(page.locator('#tab-toggle-2')).toHaveClass('nav-link');
            await expect(page.locator('#tab-toggle-1')).toHaveAttribute('aria-selected', 'true');
            await expect(page.locator('#tab-toggle-2')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade active show');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade');
        });

        test('shows and focuses the last item on end key', async ({ page }) => {
            await page.locator('#tab-toggle-1').focus();
            await page.keyboard.press('End');

            await expect(page.locator('#tab-toggle-2')).toBeFocused();
            await expect(page.locator('#tab-toggle-1')).toHaveClass('nav-link');
            await expect(page.locator('#tab-toggle-2')).toHaveClass('nav-link active');
            await expect(page.locator('#tab-toggle-1')).toHaveAttribute('aria-selected', 'false');
            await expect(page.locator('#tab-toggle-2')).toHaveAttribute('aria-selected', 'true');
            await expect(page.locator('#tab1')).toHaveClass('tab-pane fade');
            await expect(page.locator('#tab2')).toHaveClass('tab-pane fade active show');
        });
    });
});
