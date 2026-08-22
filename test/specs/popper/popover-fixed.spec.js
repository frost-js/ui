import { test } from '@playwright/test';
import { resetPage } from '../../setup/browser.js';
import { expectStyles } from '../../support/assertions/styles.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('Popper Popover (fixed)', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div class="text-center" style="padding: 1600px 1200px;">' +
                '<button class="btn btn-secondary" id="popoverToggle" data-ui-title="Title" data-ui-content="This is the popover content." type="button" style="position: fixed; top: 300px; left: 350px;">Popover</button>' +
                '</div>';
            document.documentElement.style.scrollBehavior = 'auto';
            document.scrollingElement.scrollLeft = 850;
            document.scrollingElement.scrollTop = 1300;
        });
    });

    test.describe('placement/position options', () => {
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

            await expectStyles(page, [
                {
                    selectors: ['.popover'],
                    styles: { transform: 'translate3d(1200px, 1520px, 0px)' },
                },
            ]);
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

            await expectStyles(page, [
                {
                    selectors: ['.popover'],
                    styles: { transform: 'translate3d(1136px, 1520px, 0px)' },
                },
            ]);
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

            await expectStyles(page, [
                {
                    selectors: ['.popover'],
                    styles: { transform: 'translate3d(1072px, 1520px, 0px)' },
                },
            ]);
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

            await expectStyles(page, [
                {
                    selectors: ['.popover'],
                    styles: { transform: 'translate3d(1281px, 1600px, 0px)' },
                },
            ]);
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

            await expectStyles(page, [
                {
                    selectors: ['.popover'],
                    styles: { transform: 'translate3d(1281px, 1578px, 0px)' },
                },
            ]);
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

            await expectStyles(page, [
                {
                    selectors: ['.popover'],
                    styles: { transform: 'translate3d(1281px, 1557px, 0px)' },
                },
            ]);
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

            await expectStyles(page, [
                {
                    selectors: ['.popover'],
                    styles: { transform: 'translate3d(1200px, 1637px, 0px)' },
                },
            ]);
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

            await expectStyles(page, [
                {
                    selectors: ['.popover'],
                    styles: { transform: 'translate3d(1136px, 1637px, 0px)' },
                },
            ]);
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

            await expectStyles(page, [
                {
                    selectors: ['.popover'],
                    styles: { transform: 'translate3d(1072px, 1637px, 0px)' },
                },
            ]);
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

            await expectStyles(page, [
                {
                    selectors: ['.popover'],
                    styles: { transform: 'translate3d(991px, 1600px, 0px)' },
                },
            ]);
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

            await expectStyles(page, [
                {
                    selectors: ['.popover'],
                    styles: { transform: 'translate3d(991px, 1578px, 0px)' },
                },
            ]);
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

            await expectStyles(page, [
                {
                    selectors: ['.popover'],
                    styles: { transform: 'translate3d(991px, 1557px, 0px)' },
                },
            ]);
        });
    });
});
