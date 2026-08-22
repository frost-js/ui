import { test } from '@playwright/test';
import { resetPage } from '../../setup/browser.js';
import { expectPopperPosition } from '../../support/assertions/popper.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('Popper Popover (overflow)', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="scroll" style="position: relative; overflow: auto; width: 100vw; height: 100vh;">' +
                '<div class="text-center" style="padding: 1600px 1200px;">' +
                '<button class="btn btn-secondary" id="popoverToggle" data-ui-title="Title" data-ui-content="This is the popover content." type="button">Popover</button>' +
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
                document.querySelector('#scroll').scrollTop = 1130;
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'auto',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'top',
                position: 'center',
                spacing: 3,
                referencePlacement: false,
            });
        });

        test('works with auto placement (right)', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollLeft = 1050;
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'auto',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'right',
                position: 'center',
                spacing: 3,
                referencePlacement: false,
            });
        });

        test('works with auto placement (bottom)', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollTop = 1500;
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'auto',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'bottom',
                position: 'center',
                spacing: 3,
                referencePlacement: false,
            });
        });

        test('works with auto placement (left)', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollLeft = 665;
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'auto',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'left',
                position: 'center',
                spacing: 3,
                referencePlacement: false,
            });
        });

        test('works with top/start', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'top',
                    position: 'start',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'top',
                position: 'start',
                spacing: 3,
                referencePlacement: false,
            });
        });

        test('works with top/center', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'top',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'top',
                position: 'center',
                spacing: 3,
                referencePlacement: false,
            });
        });

        test('works with top/end', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'top',
                    position: 'end',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'top',
                position: 'end',
                spacing: 3,
                referencePlacement: false,
            });
        });

        test('works with right/start', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'right',
                    position: 'start',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'right',
                position: 'start',
                spacing: 3,
                referencePlacement: false,
            });
        });

        test('works with right/center', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'right',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'right',
                position: 'center',
                spacing: 3,
                referencePlacement: false,
            });
        });

        test('works with right/end', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'right',
                    position: 'end',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'right',
                position: 'end',
                spacing: 3,
                referencePlacement: false,
            });
        });

        test('works with bottom/start', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'bottom',
                    position: 'start',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'bottom',
                position: 'start',
                spacing: 3,
                referencePlacement: false,
            });
        });

        test('works with bottom/center', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'bottom',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'bottom',
                position: 'center',
                spacing: 3,
                referencePlacement: false,
            });
        });

        test('works with bottom/end', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'bottom',
                    position: 'end',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'bottom',
                position: 'end',
                spacing: 3,
                referencePlacement: false,
            });
        });

        test('works with left/start', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'left',
                    position: 'start',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'left',
                position: 'start',
                spacing: 3,
                referencePlacement: false,
            });
        });

        test('works with left/center', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'left',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'left',
                position: 'center',
                spacing: 3,
                referencePlacement: false,
            });
        });

        test('works with left/end', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'left',
                    position: 'end',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'left',
                position: 'end',
                spacing: 3,
                referencePlacement: false,
            });
        });
    });

    test.describe('placement flip', () => {
        test('works with top/center and top edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollTop = 1520;
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'top',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'bottom',
                position: 'center',
                spacing: 3,
                referencePlacement: false,
            });
        });

        test('works with right/center and right edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollLeft = 615;
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'right',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'left',
                position: 'center',
                spacing: 3,
                referencePlacement: false,
            });
        });

        test('works with bottom/center and bottom edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollTop = 1130;
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'bottom',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'top',
                position: 'center',
                spacing: 3,
                referencePlacement: false,
            });
        });

        test('works with left/center and left edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollLeft = 1100;
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'left',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'right',
                position: 'center',
                spacing: 3,
                referencePlacement: false,
            });
        });
    });

    test.describe('position clamp', () => {
        test('works with top/start and right edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollLeft = 490;
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'top',
                    position: 'start',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'top',
                spacing: 3,
                boundary: '#scroll',
                boundaryEdge: 'right',
                referencePlacement: false,
            });
        });

        test('works with top/center and right edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollLeft = 490;
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'top',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'top',
                spacing: 3,
                boundary: '#scroll',
                boundaryEdge: 'right',
                referencePlacement: false,
            });
        });

        test('works with top/center and left edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollLeft = 1200;
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'top',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'top',
                spacing: 3,
                boundary: '#scroll',
                boundaryEdge: 'left',
                referencePlacement: false,
            });
        });

        test('works with top/end and left edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollLeft = 1200;
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'top',
                    position: 'end',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'top',
                spacing: 3,
                boundary: '#scroll',
                boundaryEdge: 'left',
                referencePlacement: false,
            });
        });

        test('works with right/start and bottom edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollTop = 1048;
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'right',
                    position: 'start',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'right',
                spacing: 3,
                boundary: '#scroll',
                boundaryEdge: 'bottom',
                referencePlacement: false,
            });
        });

        test('works with right/center and top edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollTop = 1600;
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'right',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'right',
                spacing: 3,
                boundary: '#scroll',
                boundaryEdge: 'top',
                referencePlacement: false,
            });
        });

        test('works with right/center and bottom edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollTop = 1048;
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'right',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'right',
                spacing: 3,
                boundary: '#scroll',
                boundaryEdge: 'bottom',
                referencePlacement: false,
            });
        });

        test('works with right/end and top edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollTop = 1600;
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'right',
                    position: 'end',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'right',
                spacing: 3,
                boundary: '#scroll',
                boundaryEdge: 'top',
                referencePlacement: false,
            });
        });

        test('works with bottom/start and right edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollLeft = 490;
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'bottom',
                    position: 'start',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'bottom',
                spacing: 3,
                boundary: '#scroll',
                boundaryEdge: 'right',
                referencePlacement: false,
            });
        });

        test('works with bottom/center and right edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollLeft = 490;
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'bottom',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'bottom',
                spacing: 3,
                boundary: '#scroll',
                boundaryEdge: 'right',
                referencePlacement: false,
            });
        });

        test('works with bottom/center and left edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollLeft = 1200;
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'bottom',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'bottom',
                spacing: 3,
                boundary: '#scroll',
                boundaryEdge: 'left',
                referencePlacement: false,
            });
        });

        test('works with bottom/end and left edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollLeft = 1200;
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'bottom',
                    position: 'end',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'bottom',
                spacing: 3,
                boundary: '#scroll',
                boundaryEdge: 'left',
                referencePlacement: false,
            });
        });

        test('works with left/start and bottom edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollTop = 1048;
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'left',
                    position: 'start',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'left',
                spacing: 3,
                boundary: '#scroll',
                boundaryEdge: 'bottom',
                referencePlacement: false,
            });
        });

        test('works with left/center and top edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollTop = 1600;
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'left',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'left',
                spacing: 3,
                boundary: '#scroll',
                boundaryEdge: 'top',
                referencePlacement: false,
            });
        });

        test('works with left/center and bottom edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollTop = 1048;
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'left',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'left',
                spacing: 3,
                boundary: '#scroll',
                boundaryEdge: 'bottom',
                referencePlacement: false,
            });
        });

        test('works with left/end and top edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#scroll').scrollTop = 1600;
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'left',
                    position: 'end',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'left',
                spacing: 3,
                boundary: '#scroll',
                boundaryEdge: 'top',
                referencePlacement: false,
            });
        });
    });
});
