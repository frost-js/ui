import { test } from '@playwright/test';
import { resetPage } from '../../setup/browser.js';
import { expectPopperPosition } from '../../support/assertions/popper.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('Popper Tooltip', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div class="text-center" style="padding: 1600px 1200px;">' +
                '<button class="btn btn-secondary" id="tooltipToggle" data-ui-title="This is a tooltip." type="button">Tooltip</button>' +
                '</div>';
            document.documentElement.style.scrollBehavior = 'auto';
            document.scrollingElement.scrollLeft = 850;
            document.scrollingElement.scrollTop = 1300;
        });
    });

    test.describe('#update', () => {
        test('updates the popper position', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'top',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
                document.scrollingElement.scrollTop = 1570;
                tooltip.update();
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

        test('updates the popper position (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tooltipToggle').tooltip({
                    placement: 'top',
                    position: 'center',
                    duration: 0,
                }).show();
                document.scrollingElement.scrollTop = 1570;
                $('#tooltipToggle').tooltip('update');
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
    });

    test.describe('placement/position options', () => {
        test('works with placement option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'bottom',
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

        test('works with placement option (data-ui-placement)', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle = document.querySelector('#tooltipToggle');
                tooltipToggle.setAttribute('data-ui-placement', 'bottom');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
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

        test('works with placement option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tooltipToggle').tooltip({
                    placement: 'bottom',
                    duration: 0,
                }).show();
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

        test('works with position option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
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

        test('works with position option (data-ui-position)', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle = document.querySelector('#tooltipToggle');
                tooltipToggle.setAttribute('data-ui-position', 'start');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
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

        test('works with position option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tooltipToggle').tooltip({
                    position: 'start',
                    duration: 0,
                }).show();
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

        test('works with auto placement (top)', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1115;
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
                document.scrollingElement.scrollLeft = 1050;
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
                document.scrollingElement.scrollTop = 1500;
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
                document.scrollingElement.scrollLeft = 665;
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
                document.scrollingElement.scrollTop = 1570;
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
                document.scrollingElement.scrollLeft = 595;
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
                document.scrollingElement.scrollTop = 1080;
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
                document.scrollingElement.scrollLeft = 1100;
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
                document.scrollingElement.scrollLeft = 480;
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
                boundaryEdge: 'right',
                referencePlacement: false,
            });
        });

        test('works with top/center and right edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 480;
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
                boundaryEdge: 'right',
                referencePlacement: false,
            });
        });

        test('works with top/center and left edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 1200;
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
                boundaryEdge: 'left',
                referencePlacement: false,
            });
        });

        test('works with top/end and left edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 1200;
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
                boundaryEdge: 'left',
                referencePlacement: false,
            });
        });

        test('works with right/start and bottom edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1040;
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
                boundaryEdge: 'bottom',
                referencePlacement: false,
            });
        });

        test('works with right/center and top edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1610;
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
                boundaryEdge: 'top',
                referencePlacement: false,
            });
        });

        test('works with right/center and bottom edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1040;
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
                boundaryEdge: 'bottom',
                referencePlacement: false,
            });
        });

        test('works with right/end and top edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1610;
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
                boundaryEdge: 'top',
                referencePlacement: false,
            });
        });

        test('works with bottom/start and right edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 480;
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
                boundaryEdge: 'right',
                referencePlacement: false,
            });
        });

        test('works with bottom/center and right edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 480;
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
                boundaryEdge: 'right',
                referencePlacement: false,
            });
        });

        test('works with bottom/center and left edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 1200;
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
                boundaryEdge: 'left',
                referencePlacement: false,
            });
        });

        test('works with bottom/end and left edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 1200;
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
                boundaryEdge: 'left',
                referencePlacement: false,
            });
        });

        test('works with left/start and bottom edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1040;
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
                boundaryEdge: 'bottom',
                referencePlacement: false,
            });
        });

        test('works with left/center and top edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1610;
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
                boundaryEdge: 'top',
                referencePlacement: false,
            });
        });

        test('works with left/center and bottom edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1040;
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
                boundaryEdge: 'bottom',
                referencePlacement: false,
            });
        });

        test('works with left/end and top edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1610;
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
                boundaryEdge: 'top',
                referencePlacement: false,
            });
        });
    });

    test.describe('fixed option', () => {
        test('works with fixed option', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1570;
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'top',
                    fixed: true,
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

        test('works with fixed option (data-ui-fixed)', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1570;
                const tooltipToggle = document.querySelector('#tooltipToggle');
                tooltipToggle.setAttribute('data-ui-fixed', 'true');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'top',
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

        test('works with fixed option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1570;
                $('#tooltipToggle').tooltip({
                    placement: 'top',
                    fixed: true,
                    duration: 0,
                }).show();
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

        test('works with top edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1570;
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'top',
                    position: 'center',
                    fixed: true,
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

        test('works with right edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 595;
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'right',
                    position: 'center',
                    fixed: true,
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

        test('works with bottom edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1080;
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'bottom',
                    position: 'center',
                    fixed: true,
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

        test('works with left edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 1100;
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'left',
                    position: 'center',
                    fixed: true,
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
    });

    test.describe('spacing option', () => {
        test('works with spacing option', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    spacing: 50,
                    duration: 0,
                });
                tooltip.show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'right',
                position: 'center',
                spacing: 50,
                referencePlacement: false,
            });
        });

        test('works with spacing option (data-ui-spacing)', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle = document.querySelector('#tooltipToggle');
                tooltipToggle.setAttribute('data-ui-spacing', '50');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    duration: 0,
                });
                tooltip.show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'right',
                position: 'center',
                spacing: 50,
                referencePlacement: false,
            });
        });

        test('works with spacing option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#tooltipToggle').tooltip({
                    spacing: 50,
                    duration: 0,
                }).show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'right',
                position: 'center',
                spacing: 50,
                referencePlacement: false,
            });
        });

        test('works with spacing and top', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'top',
                    position: 'center',
                    spacing: 50,
                    duration: 0,
                });
                tooltip.show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'top',
                position: 'center',
                spacing: 50,
                referencePlacement: false,
            });
        });

        test('works with spacing and right', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'right',
                    position: 'center',
                    spacing: 50,
                    duration: 0,
                });
                tooltip.show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'right',
                position: 'center',
                spacing: 50,
                referencePlacement: false,
            });
        });

        test('works with spacing and bottom', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'bottom',
                    position: 'center',
                    spacing: 50,
                    duration: 0,
                });
                tooltip.show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'bottom',
                position: 'center',
                spacing: 50,
                referencePlacement: false,
            });
        });

        test('works with spacing and left', async ({ page }) => {
            await page.evaluate((_) => {
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'left',
                    position: 'center',
                    spacing: 50,
                    duration: 0,
                });
                tooltip.show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'left',
                position: 'center',
                spacing: 50,
                referencePlacement: false,
            });
        });
    });

    test.describe('minContact option', () => {
        test('works with minContact option', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 465;
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'top',
                    minContact: 10,
                    duration: 0,
                });
                tooltip.show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'top',
                spacing: 2,
                boundaryEdge: 'right',
                minContact: 10,
                referencePlacement: false,
            });
        });

        test('works with minContact option (data-ui-min-contact)', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 465;
                const tooltipToggle = document.querySelector('#tooltipToggle');
                tooltipToggle.setAttribute('data-ui-min-contact', '10');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'top',
                    duration: 0,
                });
                tooltip.show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'top',
                spacing: 2,
                boundaryEdge: 'right',
                minContact: 10,
                referencePlacement: false,
            });
        });

        test('works with minContact option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 465;
                $('#tooltipToggle').tooltip({
                    placement: 'top',
                    minContact: 10,
                    duration: 0,
                }).show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'top',
                spacing: 2,
                boundaryEdge: 'right',
                minContact: 10,
                referencePlacement: false,
            });
        });

        test('works with minContact and top edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1620;
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'right',
                    position: 'center',
                    minContact: 10,
                    duration: 0,
                });
                tooltip.show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'right',
                spacing: 2,
                boundaryEdge: 'top',
                minContact: 10,
                referencePlacement: false,
            });
        });

        test('works with minContact and right edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 465;
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'top',
                    position: 'center',
                    minContact: 10,
                    duration: 0,
                });
                tooltip.show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'top',
                spacing: 2,
                boundaryEdge: 'right',
                minContact: 10,
                referencePlacement: false,
            });
        });

        test('works with minContact and bottom edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1030;
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'left',
                    position: 'center',
                    minContact: 10,
                    duration: 0,
                });
                tooltip.show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'left',
                spacing: 2,
                boundaryEdge: 'bottom',
                minContact: 10,
                referencePlacement: false,
            });
        });

        test('works with minContact and left edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 1220;
                const tooltipToggle = document.querySelector('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'bottom',
                    position: 'center',
                    minContact: 10,
                    duration: 0,
                });
                tooltip.show();
            });

            await expectPopperPosition(page, {
                popper: '.tooltip',
                reference: '#tooltipToggle',
                placement: 'bottom',
                spacing: 2,
                boundaryEdge: 'left',
                minContact: 10,
                referencePlacement: false,
            });
        });
    });
});
