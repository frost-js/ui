import { test } from '@playwright/test';
import { resetPage } from '../../setup/browser.js';
import { expectPopperPosition } from '../../support/assertions/popper.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('Popper Tooltip (overflow)', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="scroll" style="position: relative; overflow: auto; width: 100vw; height: 100vh;">' +
                '<div class="text-center" style="padding: 1600px 1200px;">' +
                '<button class="btn btn-secondary" id="tooltipToggle" data-ui-title="This is a tooltip." type="button">Tooltip</button>' +
                '</div>' +
                '</div>';
            document.documentElement.style.scrollBehavior = 'auto';
            document.querySelector('#scroll').scrollLeft = 900;
            document.querySelector('#scroll').scrollTop = 1300;
        });
    });

    test.describe('placement/position options', () => {
        test('works with auto placement (top)', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollTop = 1115;
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'auto',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'top',
                position: 'center',
                spacing: 2,
                referencePlacement: false,
            });
        });

        test('works with auto placement (right)', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollLeft = 1050;
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'auto',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'right',
                position: 'center',
                spacing: 2,
                referencePlacement: false,
            });
        });

        test('works with auto placement (bottom)', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollTop = 1500;
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'auto',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'bottom',
                position: 'center',
                spacing: 2,
                referencePlacement: false,
            });
        });

        test('works with auto placement (left)', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollLeft = 665;
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'auto',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'left',
                position: 'center',
                spacing: 2,
                referencePlacement: false,
            });
        });

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

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'top',
                position: 'start',
                spacing: 2,
                referencePlacement: false,
            });
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

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'top',
                position: 'center',
                spacing: 2,
                referencePlacement: false,
            });
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

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'top',
                position: 'end',
                spacing: 2,
                referencePlacement: false,
            });
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

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'right',
                position: 'start',
                spacing: 2,
                referencePlacement: false,
            });
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

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'right',
                position: 'center',
                spacing: 2,
                referencePlacement: false,
            });
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

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'right',
                position: 'end',
                spacing: 2,
                referencePlacement: false,
            });
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

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'bottom',
                position: 'start',
                spacing: 2,
                referencePlacement: false,
            });
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

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'bottom',
                position: 'center',
                spacing: 2,
                referencePlacement: false,
            });
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

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'bottom',
                position: 'end',
                spacing: 2,
                referencePlacement: false,
            });
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

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'left',
                position: 'start',
                spacing: 2,
                referencePlacement: false,
            });
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

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'left',
                position: 'center',
                spacing: 2,
                referencePlacement: false,
            });
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

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'left',
                position: 'end',
                spacing: 2,
                referencePlacement: false,
            });
        });
    });

    test.describe('placement flip', () => {
        test('works with top/center and top edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollTop = 1570;
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'top',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'bottom',
                position: 'center',
                spacing: 2,
                referencePlacement: false,
            });
        });

        test('works with right/center and right edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollLeft = 595;
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'right',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'left',
                position: 'center',
                spacing: 2,
                referencePlacement: false,
            });
        });

        test('works with bottom/center and bottom edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollTop = 1080;
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'bottom',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'top',
                position: 'center',
                spacing: 2,
                referencePlacement: false,
            });
        });

        test('works with left/center and left edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollLeft = 1100;
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'left',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'right',
                position: 'center',
                spacing: 2,
                referencePlacement: false,
            });
        });
    });

    test.describe('position clamp', () => {
        test('works with top/start and right edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollLeft = 480;
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'top',
                    position: 'start',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'top',
                spacing: 2,
                boundary: '#scroll',
                boundaryEdge: 'right',
                referencePlacement: false,
            });
        });

        test('works with top/center and right edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollLeft = 480;
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'top',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'top',
                spacing: 2,
                boundary: '#scroll',
                boundaryEdge: 'right',
                referencePlacement: false,
            });
        });

        test('works with top/center and left edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollLeft = 1200;
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'top',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'top',
                spacing: 2,
                boundary: '#scroll',
                boundaryEdge: 'left',
                referencePlacement: false,
            });
        });

        test('works with top/end and left edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollLeft = 1200;
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'top',
                    position: 'end',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'top',
                spacing: 2,
                boundary: '#scroll',
                boundaryEdge: 'left',
                referencePlacement: false,
            });
        });

        test('works with right/start and bottom edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollTop = 1040;
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'right',
                    position: 'start',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'right',
                spacing: 2,
                boundary: '#scroll',
                boundaryEdge: 'bottom',
                referencePlacement: false,
            });
        });

        test('works with right/center and top edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollTop = 1610;
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'right',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'right',
                spacing: 2,
                boundary: '#scroll',
                boundaryEdge: 'top',
                referencePlacement: false,
            });
        });

        test('works with right/center and bottom edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollTop = 1040;
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'right',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'right',
                spacing: 2,
                boundary: '#scroll',
                boundaryEdge: 'bottom',
                referencePlacement: false,
            });
        });

        test('works with right/end and top edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollTop = 1610;
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'right',
                    position: 'end',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'right',
                spacing: 2,
                boundary: '#scroll',
                boundaryEdge: 'top',
                referencePlacement: false,
            });
        });

        test('works with bottom/start and right edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollLeft = 480;
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'bottom',
                    position: 'start',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'bottom',
                spacing: 2,
                boundary: '#scroll',
                boundaryEdge: 'right',
                referencePlacement: false,
            });
        });

        test('works with bottom/center and right edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollLeft = 480;
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'bottom',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'bottom',
                spacing: 2,
                boundary: '#scroll',
                boundaryEdge: 'right',
                referencePlacement: false,
            });
        });

        test('works with bottom/center and left edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollLeft = 1200;
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'bottom',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'bottom',
                spacing: 2,
                boundary: '#scroll',
                boundaryEdge: 'left',
                referencePlacement: false,
            });
        });

        test('works with bottom/end and left edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollLeft = 1200;
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'bottom',
                    position: 'end',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'bottom',
                spacing: 2,
                boundary: '#scroll',
                boundaryEdge: 'left',
                referencePlacement: false,
            });
        });

        test('works with left/start and bottom edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollTop = 1040;
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'left',
                    position: 'start',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'left',
                spacing: 2,
                boundary: '#scroll',
                boundaryEdge: 'bottom',
                referencePlacement: false,
            });
        });

        test('works with left/center and top edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollTop = 1610;
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'left',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'left',
                spacing: 2,
                boundary: '#scroll',
                boundaryEdge: 'top',
                referencePlacement: false,
            });
        });

        test('works with left/center and bottom edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollTop = 1040;
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'left',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'left',
                spacing: 2,
                boundary: '#scroll',
                boundaryEdge: 'bottom',
                referencePlacement: false,
            });
        });

        test('works with left/end and top edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollTop = 1610;
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'left',
                    position: 'end',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'left',
                spacing: 2,
                boundary: '#scroll',
                boundaryEdge: 'top',
                referencePlacement: false,
            });
        });
    });
});
