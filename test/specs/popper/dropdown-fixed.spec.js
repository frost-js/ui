import { test } from '@playwright/test';
import { resetPage, waitForFrame } from '../../setup/browser.js';
import { expectStyles } from '../../support/assertions/styles.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('Popper Dropdown (fixed)', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div class="text-center" style="padding: 1600px 1200px;">' +
                '<div class="dropdown">' +
                '<button class="btn btn-secondary dropdown-toggle" id="dropdownToggle" type="button" style="position: fixed; top: 300px; left: 350px;">Dropdown</button>' +
                '<div class="dropdown-menu">' +
                '<button class="dropdown-item" type="button">Action</button>' +
                '<button class="dropdown-item" type="button">Action</button>' +
                '<button class="dropdown-item" type="button">Action</button>' +
                '</div>' +
                '</div>' +
                '</div>';
            document.documentElement.style.scrollBehavior = 'auto';
            document.scrollingElement.scrollLeft = 850;
            document.scrollingElement.scrollTop = 1300;
        });
    });

    test.describe('placement/position options', () => {
        test('works with top/start', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle = document.querySelector('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'top',
                    position: 'start',
                    duration: 0,
                });
                dropdown.show();
            });

            await waitForFrame(page);
            + await expectStyles(page, [
                {
                    selectors: ['.dropdown-menu'],
                    styles: { transform: 'translate3d(1200px, 1483px, 0px)' },
                },
            ]);
        });

        test('works with top/center', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle = document.querySelector('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'top',
                    position: 'center',
                    duration: 0,
                });
                dropdown.show();
            });

            await waitForFrame(page);
            + await expectStyles(page, [
                {
                    selectors: ['.dropdown-menu'],
                    styles: { transform: 'translate3d(1173px, 1483px, 0px)' },
                },
            ]);
        });

        test('works with top/end', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle = document.querySelector('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'top',
                    position: 'end',
                    duration: 0,
                });
                dropdown.show();
            });

            await waitForFrame(page);
            + await expectStyles(page, [
                {
                    selectors: ['.dropdown-menu'],
                    styles: { transform: 'translate3d(1147px, 1483px, 0px)' },
                },
            ]);
        });

        test('works with right/start', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle = document.querySelector('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'right',
                    position: 'start',
                    duration: 0,
                });
                dropdown.show();
            });

            await waitForFrame(page);
            + await expectStyles(page, [
                {
                    selectors: ['.dropdown-menu'],
                    styles: { transform: 'translate3d(1306px, 1600px, 0px)' },
                },
            ]);
        });

        test('works with right/center', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle = document.querySelector('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'right',
                    position: 'center',
                    duration: 0,
                });
                dropdown.show();
            });

            await waitForFrame(page);
            + await expectStyles(page, [
                {
                    selectors: ['.dropdown-menu'],
                    styles: { transform: 'translate3d(1306px, 1560px, 0px)' },
                },
            ]);
        });

        test('works with right/end', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle = document.querySelector('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'right',
                    position: 'end',
                    duration: 0,
                });
                dropdown.show();
            });

            await waitForFrame(page);
            + await expectStyles(page, [
                {
                    selectors: ['.dropdown-menu'],
                    styles: { transform: 'translate3d(1306px, 1520px, 0px)' },
                },
            ]);
        });

        test('works with bottom/start', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle = document.querySelector('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'bottom',
                    position: 'start',
                    duration: 0,
                });
                dropdown.show();
            });

            await waitForFrame(page);
            + await expectStyles(page, [
                {
                    selectors: ['.dropdown-menu'],
                    styles: { transform: 'translate3d(1200px, 1637px, 0px)' },
                },
            ]);
        });

        test('works with bottom/center', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle = document.querySelector('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'bottom',
                    position: 'center',
                    duration: 0,
                });
                dropdown.show();
            });

            await waitForFrame(page);
            + await expectStyles(page, [
                {
                    selectors: ['.dropdown-menu'],
                    styles: { transform: 'translate3d(1173px, 1637px, 0px)' },
                },
            ]);
        });

        test('works with bottom/end', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle = document.querySelector('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'bottom',
                    position: 'end',
                    duration: 0,
                });
                dropdown.show();
            });

            await waitForFrame(page);
            + await expectStyles(page, [
                {
                    selectors: ['.dropdown-menu'],
                    styles: { transform: 'translate3d(1147px, 1637px, 0px)' },
                },
            ]);
        });

        test('works with left/start', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle = document.querySelector('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'left',
                    position: 'start',
                    duration: 0,
                });
                dropdown.show();
            });

            await waitForFrame(page);
            + await expectStyles(page, [
                {
                    selectors: ['.dropdown-menu'],
                    styles: { transform: 'translate3d(1037px, 1600px, 0px)' },
                },
            ]);
        });

        test('works with left/center', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle = document.querySelector('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'left',
                    position: 'center',
                    duration: 0,
                });
                dropdown.show();
            });

            await waitForFrame(page);
            + await expectStyles(page, [
                {
                    selectors: ['.dropdown-menu'],
                    styles: { transform: 'translate3d(1037px, 1560px, 0px)' },
                },
            ]);
        });

        test('works with left/end', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle = document.querySelector('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'left',
                    position: 'end',
                    duration: 0,
                });
                dropdown.show();
            });

            await waitForFrame(page);
            + await expectStyles(page, [
                {
                    selectors: ['.dropdown-menu'],
                    styles: { transform: 'translate3d(1037px, 1520px, 0px)' },
                },
            ]);
        });
    });
});
