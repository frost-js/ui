import { test } from '@playwright/test';
import { resetPage } from '../../setup/browser.js';
import { expectStyles } from '../../support/assertions/styles.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('Popper Tooltip (fixed)', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div class="text-center" style="padding: 1600px 1200px;">' +
                '<button class="btn btn-secondary" id="tooltipToggle" data-ui-title="This is a tooltip." type="button" style="position: fixed; top: 300px; left: 350px;">Tooltip</button>' +
                '</div>';
            document.documentElement.style.scrollBehavior = 'auto';
            document.scrollingElement.scrollLeft = 850;
            document.scrollingElement.scrollTop = 1300;
        });
    });

    test.describe('placement/position options', () => {
        test('works with top/start', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'top',
                    position: 'start',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectStyles(page, [
                {
                    selectors: ['.tooltip'],
                    styles: { transform: 'translate3d(1200px, 1567px, 0px)' },
                },
            ]);
        });

        test('works with top/center', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'top',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectStyles(page, [
                {
                    selectors: ['.tooltip'],
                    styles: { transform: 'translate3d(1170px, 1567px, 0px)' },
                },
            ]);
        });

        test('works with top/end', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'top',
                    position: 'end',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectStyles(page, [
                {
                    selectors: ['.tooltip'],
                    styles: { transform: 'translate3d(1141px, 1567px, 0px)' },
                },
            ]);
        });

        test('works with right/start', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'right',
                    position: 'start',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectStyles(page, [
                {
                    selectors: ['.tooltip'],
                    styles: { transform: 'translate3d(1266px, 1600px, 0px)' },
                },
            ]);
        });

        test('works with right/center', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'right',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectStyles(page, [
                {
                    selectors: ['.tooltip'],
                    styles: { transform: 'translate3d(1266px, 1601px, 0px)' },
                },
            ]);
        });

        test('works with right/end', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'right',
                    position: 'end',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectStyles(page, [
                {
                    selectors: ['.tooltip'],
                    styles: { transform: 'translate3d(1266px, 1603px, 0px)' },
                },
            ]);
        });

        test('works with bottom/start', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'bottom',
                    position: 'start',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectStyles(page, [
                {
                    selectors: ['.tooltip'],
                    styles: { transform: 'translate3d(1200px, 1636px, 0px)' },
                },
            ]);
        });

        test('works with bottom/center', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'bottom',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectStyles(page, [
                {
                    selectors: ['.tooltip'],
                    styles: { transform: 'translate3d(1170px, 1636px, 0px)' },
                },
            ]);
        });

        test('works with bottom/end', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'bottom',
                    position: 'end',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectStyles(page, [
                {
                    selectors: ['.tooltip'],
                    styles: { transform: 'translate3d(1141px, 1636px, 0px)' },
                },
            ]);
        });

        test('works with left/start', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'left',
                    position: 'start',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectStyles(page, [
                {
                    selectors: ['.tooltip'],
                    styles: { transform: 'translate3d(1075px, 1600px, 0px)' },
                },
            ]);
        });

        test('works with left/center', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'left',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectStyles(page, [
                {
                    selectors: ['.tooltip'],
                    styles: { transform: 'translate3d(1075px, 1601px, 0px)' },
                },
            ]);
        });

        test('works with left/end', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'left',
                    position: 'end',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectStyles(page, [
                {
                    selectors: ['.tooltip'],
                    styles: { transform: 'translate3d(1075px, 1603px, 0px)' },
                },
            ]);
        });
    });
});
