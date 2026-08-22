import { test } from '@playwright/test';
import { resetPage } from '../../setup/browser.js';
import { expectPopperPosition } from '../../support/assertions/popper.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('Popper Popover', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div class="text-center" style="padding: 1600px 1200px;">' +
                '<button class="btn btn-secondary" id="popoverToggle" data-ui-title="Title" data-ui-content="This is the popover content." type="button">Popover</button>' +
                '</div>';
            document.documentElement.style.scrollBehavior = 'auto';
            document.scrollingElement.scrollLeft = 850;
            document.scrollingElement.scrollTop = 1300;
        });
    });

    test.describe('#update', () => {
        test('updates the popper position', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'top',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
                document.scrollingElement.scrollTop = 1520;
                popover.update();
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

        test('updates the popper position (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#popoverToggle').popover({
                    placement: 'top',
                    position: 'center',
                    duration: 0,
                }).show();
                document.scrollingElement.scrollTop = 1520;
                $('#popoverToggle').popover('update');
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
    });

    test.describe('placement/position options', () => {
        test('works with placement option', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'bottom',
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

        test('works with placement option (data-ui-placement)', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle = document.querySelector('#popoverToggle');
                popoverToggle.setAttribute('data-ui-placement', 'bottom');
                const popover = UI.Popover.init(popoverToggle, {
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

        test('works with placement option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#popoverToggle').popover({
                    placement: 'bottom',
                    duration: 0,
                }).show();
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

        test('works with position option', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
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

        test('works with position option (data-ui-position)', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle = document.querySelector('#popoverToggle');
                popoverToggle.setAttribute('data-ui-position', 'start');
                const popover = UI.Popover.init(popoverToggle, {
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

        test('works with position option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#popoverToggle').popover({
                    position: 'start',
                    duration: 0,
                }).show();
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

        test('works with auto placement (top)', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1130;
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
                document.scrollingElement.scrollLeft = 1050;
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
                document.scrollingElement.scrollTop = 1500;
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
                document.scrollingElement.scrollLeft = 665;
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
                document.scrollingElement.scrollTop = 1520;
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
                document.scrollingElement.scrollLeft = 615;
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
                document.scrollingElement.scrollTop = 1130;
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
                document.scrollingElement.scrollLeft = 1100;
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
                document.scrollingElement.scrollLeft = 490;
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
                boundaryEdge: 'right',
                referencePlacement: false,
            });
        });

        test('works with top/center and right edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 490;
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
                boundaryEdge: 'right',
                referencePlacement: false,
            });
        });

        test('works with top/center and left edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 1200;
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
                boundaryEdge: 'left',
                referencePlacement: false,
            });
        });

        test('works with top/end and left edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 1200;
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
                boundaryEdge: 'left',
                referencePlacement: false,
            });
        });

        test('works with right/start and bottom edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1048;
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
                boundaryEdge: 'bottom',
                referencePlacement: false,
            });
        });

        test('works with right/center and top edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1600;
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
                boundaryEdge: 'top',
                referencePlacement: false,
            });
        });

        test('works with right/center and bottom edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1048;
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
                boundaryEdge: 'bottom',
                referencePlacement: false,
            });
        });

        test('works with right/end and top edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1600;
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
                boundaryEdge: 'top',
                referencePlacement: false,
            });
        });

        test('works with bottom/start and right edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 490;
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
                boundaryEdge: 'right',
                referencePlacement: false,
            });
        });

        test('works with bottom/center and right edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 490;
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
                boundaryEdge: 'right',
                referencePlacement: false,
            });
        });

        test('works with bottom/center and left edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 1200;
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
                boundaryEdge: 'left',
                referencePlacement: false,
            });
        });

        test('works with bottom/end and left edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 1200;
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
                boundaryEdge: 'left',
                referencePlacement: false,
            });
        });

        test('works with left/start and bottom edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1048;
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
                boundaryEdge: 'bottom',
                referencePlacement: false,
            });
        });

        test('works with left/center and top edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1600;
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
                boundaryEdge: 'top',
                referencePlacement: false,
            });
        });

        test('works with left/center and bottom edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1048;
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
                boundaryEdge: 'bottom',
                referencePlacement: false,
            });
        });

        test('works with left/end and top edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1600;
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
                boundaryEdge: 'top',
                referencePlacement: false,
            });
        });
    });

    test.describe('fixed option', () => {
        test('works with fixed option', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1520;
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'top',
                    fixed: true,
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

        test('works with fixed option (data-ui-fixed)', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1520;
                const popoverToggle = document.querySelector('#popoverToggle');
                popoverToggle.setAttribute('data-ui-fixed', 'true');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'top',
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

        test('works with fixed option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1520;
                $('#popoverToggle').popover({
                    placement: 'top',
                    fixed: true,
                    duration: 0,
                }).show();
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

        test('works with top edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1520;
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'top',
                    position: 'center',
                    fixed: true,
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

        test('works with right edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 615;
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'right',
                    position: 'center',
                    fixed: true,
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

        test('works with bottom edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1130;
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'bottom',
                    position: 'center',
                    fixed: true,
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

        test('works with left edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 1100;
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'left',
                    position: 'center',
                    fixed: true,
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
    });

    test.describe('spacing option', () => {
        test('works with spacing option', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    spacing: 50,
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'right',
                position: 'center',
                spacing: 50,
                referencePlacement: false,
            });
        });

        test('works with spacing option (data-ui-spacing)', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle = document.querySelector('#popoverToggle');
                popoverToggle.setAttribute('data-ui-spacing', '50');
                const popover = UI.Popover.init(popoverToggle, {
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'right',
                position: 'center',
                spacing: 50,
                referencePlacement: false,
            });
        });

        test('works with spacing option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#popoverToggle').popover({
                    spacing: 50,
                    duration: 0,
                }).show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'right',
                position: 'center',
                spacing: 50,
                referencePlacement: false,
            });
        });

        test('works with spacing and top', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'top',
                    position: 'center',
                    spacing: 50,
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'top',
                position: 'center',
                spacing: 50,
                referencePlacement: false,
            });
        });

        test('works with spacing and right', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'right',
                    position: 'center',
                    spacing: 50,
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'right',
                position: 'center',
                spacing: 50,
                referencePlacement: false,
            });
        });

        test('works with spacing and bottom', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'bottom',
                    position: 'center',
                    spacing: 50,
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'bottom',
                position: 'center',
                spacing: 50,
                referencePlacement: false,
            });
        });

        test('works with spacing and left', async ({ page }) => {
            await page.evaluate((_) => {
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'left',
                    position: 'center',
                    spacing: 50,
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
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
                document.scrollingElement.scrollLeft = 475;
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'top',
                    minContact: 10,
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'top',
                spacing: 3,
                boundaryEdge: 'right',
                minContact: 10,
                referencePlacement: false,
            });
        });

        test('works with minContact option (data-ui-min-contact)', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 475;
                const popoverToggle = document.querySelector('#popoverToggle');
                popoverToggle.setAttribute('data-ui-min-contact', '10');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'top',
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'top',
                spacing: 3,
                boundaryEdge: 'right',
                minContact: 10,
                referencePlacement: false,
            });
        });

        test('works with minContact option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 475;
                $('#popoverToggle').popover({
                    placement: 'top',
                    minContact: 10,
                    duration: 0,
                }).show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'top',
                spacing: 3,
                boundaryEdge: 'right',
                minContact: 10,
                referencePlacement: false,
            });
        });

        test('works with minContact and top edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1620;
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'right',
                    position: 'center',
                    minContact: 10,
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'right',
                spacing: 3,
                boundaryEdge: 'top',
                minContact: 10,
                referencePlacement: false,
            });
        });

        test('works with minContact and right edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 475;
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'top',
                    position: 'center',
                    minContact: 10,
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'top',
                spacing: 3,
                boundaryEdge: 'right',
                minContact: 10,
                referencePlacement: false,
            });
        });

        test('works with minContact and bottom edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1030;
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'left',
                    position: 'center',
                    minContact: 10,
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'left',
                spacing: 3,
                boundaryEdge: 'bottom',
                minContact: 10,
                referencePlacement: false,
            });
        });

        test('works with minContact and left edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 1220;
                const popoverToggle = document.querySelector('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'bottom',
                    position: 'center',
                    minContact: 10,
                    duration: 0,
                });
                popover.show();
            });

            await expectPopperPosition(page, {
                popper: '.popover',
                reference: '#popoverToggle',
                placement: 'bottom',
                spacing: 3,
                boundaryEdge: 'left',
                minContact: 10,
                referencePlacement: false,
            });
        });
    });
});
