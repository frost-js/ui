import { test } from '@playwright/test';
import { resetPage } from '../../setup/browser.js';
import { expectStyles } from '../../support/assertions/styles.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('Popper Popover (overflow/window)', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div style="width: calc(100vw + 1800px); padding: 1300px 900px;">' +
                '<div id="scroll" style="position: relative; overflow: auto; width: 100vw; height: 100vh;">' +
                '<div class="text-center" style="padding: 1600px 1200px;">' +
                '<button class="btn btn-secondary" id="popoverToggle" data-ui-title="Title" data-ui-content="This is the popover content." type="button">Popover</button>' +
                '</div>' +
                '</div>' +
                '</div>';
            document.documentElement.style.scrollBehavior = 'auto';
            document.scrollingElement.scrollLeft = 900;
            document.scrollingElement.scrollTop = 1300;
            document.querySelector('#scroll').scrollLeft = 900;
            document.querySelector('#scroll').scrollTop = 1300;
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

            await expectStyles(page, [
                {
                    selectors: ['.popover'],
                    styles: { transform: 'translate3d(1136px, 1637px, 0px)' },
                },
            ]);
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

            await expectStyles(page, [
                {
                    selectors: ['.popover'],
                    styles: { transform: 'translate3d(991px, 1578px, 0px)' },
                },
            ]);
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

            await expectStyles(page, [
                {
                    selectors: ['.popover'],
                    styles: { transform: 'translate3d(1136px, 1520px, 0px)' },
                },
            ]);
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

            await expectStyles(page, [
                {
                    selectors: ['.popover'],
                    styles: { transform: 'translate3d(1281px, 1578px, 0px)' },
                },
            ]);
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

            await expectStyles(page, [
                {
                    selectors: ['.popover'],
                    styles: { transform: 'translate3d(1069px, 1520px, 0px)' },
                },
            ]);
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

            await expectStyles(page, [
                {
                    selectors: ['.popover'],
                    styles: { transform: 'translate3d(1069px, 1520px, 0px)' },
                },
            ]);
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

            await expectStyles(page, [
                {
                    selectors: ['.popover'],
                    styles: { transform: 'translate3d(1200px, 1520px, 0px)' },
                },
            ]);
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

            await expectStyles(page, [
                {
                    selectors: ['.popover'],
                    styles: { transform: 'translate3d(1200px, 1520px, 0px)' },
                },
            ]);
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

            await expectStyles(page, [
                {
                    selectors: ['.popover'],
                    styles: { transform: 'translate3d(1281px, 1556px, 0px)' },
                },
            ]);
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

            await expectStyles(page, [
                {
                    selectors: ['.popover'],
                    styles: { transform: 'translate3d(1281px, 1600px, 0px)' },
                },
            ]);
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

            await expectStyles(page, [
                {
                    selectors: ['.popover'],
                    styles: { transform: 'translate3d(1281px, 1556px, 0px)' },
                },
            ]);
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

            await expectStyles(page, [
                {
                    selectors: ['.popover'],
                    styles: { transform: 'translate3d(1281px, 1600px, 0px)' },
                },
            ]);
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

            await expectStyles(page, [
                {
                    selectors: ['.popover'],
                    styles: { transform: 'translate3d(1069px, 1637px, 0px)' },
                },
            ]);
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

            await expectStyles(page, [
                {
                    selectors: ['.popover'],
                    styles: { transform: 'translate3d(1069px, 1637px, 0px)' },
                },
            ]);
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

            await expectStyles(page, [
                {
                    selectors: ['.popover'],
                    styles: { transform: 'translate3d(1200px, 1637px, 0px)' },
                },
            ]);
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

            await expectStyles(page, [
                {
                    selectors: ['.popover'],
                    styles: { transform: 'translate3d(1200px, 1637px, 0px)' },
                },
            ]);
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

            await expectStyles(page, [
                {
                    selectors: ['.popover'],
                    styles: { transform: 'translate3d(991px, 1556px, 0px)' },
                },
            ]);
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

            await expectStyles(page, [
                {
                    selectors: ['.popover'],
                    styles: { transform: 'translate3d(991px, 1600px, 0px)' },
                },
            ]);
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

            await expectStyles(page, [
                {
                    selectors: ['.popover'],
                    styles: { transform: 'translate3d(991px, 1556px, 0px)' },
                },
            ]);
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

            await expectStyles(page, [
                {
                    selectors: ['.popover'],
                    styles: { transform: 'translate3d(991px, 1600px, 0px)' },
                },
            ]);
        });
    });
});
