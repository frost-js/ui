import { test } from '@playwright/test';
import { resetPage, waitForFrame } from '../../setup/browser.js';
import { expectStyles } from '../../support/assertions/styles.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('Popper Dropdown', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div class="text-center" style="padding: 1600px 1200px;">' +
                '<div class="dropdown">' +
                '<button class="btn btn-secondary dropdown-toggle" id="dropdownToggle" type="button">Dropdown</button>' +
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

    test.describe('#update', () => {
        test('updates the popper position', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle = document.querySelector('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'top',
                    position: 'center',
                    duration: 0,
                });
                dropdown.show();
                document.scrollingElement.scrollTop = 1500;
                dropdown.update();
            });

            await waitForFrame(page);
            + await expectStyles(page, [
                {
                    selectors: ['.dropdown-menu'],
                    styles: { transform: 'translate3d(1173px, 1637px, 0px)' },
                },
            ]);
        });

        test('updates the popper position (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#dropdownToggle').dropdown({
                    placement: 'top',
                    position: 'center',
                    duration: 0,
                }).show();
                document.scrollingElement.scrollTop = 1500;
                $('#dropdownToggle').dropdown('update');
            });

            await waitForFrame(page);
            + await expectStyles(page, [
                {
                    selectors: ['.dropdown-menu'],
                    styles: { transform: 'translate3d(1173px, 1637px, 0px)' },
                },
            ]);
        });
    });

    test.describe('placement/position options', () => {
        test('works with placement option', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle = document.querySelector('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'top',
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

        test('works with placement option (data-ui-placement)', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle = document.querySelector('#dropdownToggle');
                dropdownToggle.setAttribute('data-ui-placement', 'top');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
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

        test('works with placement option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#dropdownToggle').dropdown({
                    placement: 'top',
                    duration: 0,
                }).show();
            });

            await waitForFrame(page);
            + await expectStyles(page, [
                {
                    selectors: ['.dropdown-menu'],
                    styles: { transform: 'translate3d(1200px, 1483px, 0px)' },
                },
            ]);
        });

        test('works with position option', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle = document.querySelector('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
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

        test('works with position option (data-ui-position)', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle = document.querySelector('#dropdownToggle');
                dropdownToggle.setAttribute('data-ui-position', 'center');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
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

        test('works with position option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#dropdownToggle').dropdown({
                    position: 'center',
                    duration: 0,
                }).show();
            });

            await waitForFrame(page);
            + await expectStyles(page, [
                {
                    selectors: ['.dropdown-menu'],
                    styles: { transform: 'translate3d(1173px, 1637px, 0px)' },
                },
            ]);
        });

        test('works with auto placement (top)', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1115;
                const dropdownToggle = document.querySelector('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'auto',
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

        test('works with auto placement (right)', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 1050;
                const dropdownToggle = document.querySelector('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'auto',
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

        test('works with auto placement (bottom)', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1500;
                const dropdownToggle = document.querySelector('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'auto',
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

        test('works with auto placement (left)', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 665;
                const dropdownToggle = document.querySelector('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'auto',
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

    test.describe('placement flip', () => {
        test('works with top/center and top edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1500;
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
                    styles: { transform: 'translate3d(1173px, 1637px, 0px)' },
                },
            ]);
        });

        test('works with right/center and right edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 615;
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
                    styles: { transform: 'translate3d(1037px, 1560px, 0px)' },
                },
            ]);
        });

        test('works with bottom/center and bottom edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1150;
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
                    styles: { transform: 'translate3d(1173px, 1483px, 0px)' },
                },
            ]);
        });

        test('works with left/center and left edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 1100;
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
                    styles: { transform: 'translate3d(1306px, 1560px, 0px)' },
                },
            ]);
        });
    });

    test.describe('position clamp', () => {
        test('works with top/start and right edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 520;
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
                    styles: { transform: 'translate3d(1145px, 1483px, 0px)' },
                },
            ]);
        });

        test('works with top/center and right edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 520;
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
                    styles: { transform: 'translate3d(1145px, 1483px, 0px)' },
                },
            ]);
        });

        test('works with top/center and left edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 1200;
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
                    styles: { transform: 'translate3d(1200px, 1483px, 0px)' },
                },
            ]);
        });

        test('works with top/end and left edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 1200;
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
                    styles: { transform: 'translate3d(1200px, 1483px, 0px)' },
                },
            ]);
        });

        test('works with right/start and bottom edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1048;
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
                    styles: { transform: 'translate3d(1306px, 1519px, 0px)' },
                },
            ]);
        });

        test('works with right/center and top edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1600;
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
                    styles: { transform: 'translate3d(1306px, 1600px, 0px)' },
                },
            ]);
        });

        test('works with right/center and bottom edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1048;
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
                    styles: { transform: 'translate3d(1306px, 1519px, 0px)' },
                },
            ]);
        });

        test('works with right/end and top edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1600;
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
                    styles: { transform: 'translate3d(1306px, 1600px, 0px)' },
                },
            ]);
        });

        test('works with bottom/start and right edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 520;
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
                    styles: { transform: 'translate3d(1145px, 1637px, 0px)' },
                },
            ]);
        });

        test('works with bottom/center and right edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 520;
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
                    styles: { transform: 'translate3d(1145px, 1637px, 0px)' },
                },
            ]);
        });

        test('works with bottom/center and left edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 1200;
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
                    styles: { transform: 'translate3d(1200px, 1637px, 0px)' },
                },
            ]);
        });

        test('works with bottom/end and left edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 1200;
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
                    styles: { transform: 'translate3d(1200px, 1637px, 0px)' },
                },
            ]);
        });

        test('works with left/start and bottom edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1048;
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
                    styles: { transform: 'translate3d(1037px, 1519px, 0px)' },
                },
            ]);
        });

        test('works with left/center and top edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1600;
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
                    styles: { transform: 'translate3d(1037px, 1600px, 0px)' },
                },
            ]);
        });

        test('works with left/center and bottom edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1048;
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
                    styles: { transform: 'translate3d(1037px, 1519px, 0px)' },
                },
            ]);
        });

        test('works with left/end and top edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1600;
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
                    styles: { transform: 'translate3d(1037px, 1600px, 0px)' },
                },
            ]);
        });
    });

    test.describe('fixed option', () => {
        test('works with fixed option', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1135;
                const dropdownToggle = document.querySelector('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    fixed: true,
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

        test('works with fixed option (data-ui-fixed)', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1135;
                const dropdownToggle = document.querySelector('#dropdownToggle');
                dropdownToggle.setAttribute('data-ui-fixed', 'true');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
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

        test('works with fixed option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1135;
                $('#dropdownToggle').dropdown({
                    fixed: true,
                    duration: 0,
                }).show();
            });

            await waitForFrame(page);
            + await expectStyles(page, [
                {
                    selectors: ['.dropdown-menu'],
                    styles: { transform: 'translate3d(1200px, 1637px, 0px)' },
                },
            ]);
        });

        test('works with top edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1500;
                const dropdownToggle = document.querySelector('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'top',
                    position: 'center',
                    fixed: true,
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

        test('works with right edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 600;
                const dropdownToggle = document.querySelector('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'right',
                    position: 'center',
                    fixed: true,
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

        test('works with bottom edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1135;
                const dropdownToggle = document.querySelector('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'bottom',
                    position: 'center',
                    fixed: true,
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

        test('works with left edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 1100;
                const dropdownToggle = document.querySelector('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'left',
                    position: 'center',
                    fixed: true,
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
    });

    test.describe('spacing option', () => {
        test('works with spacing option', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle = document.querySelector('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    spacing: 50,
                    duration: 0,
                });
                dropdown.show();
            });

            await waitForFrame(page);
            + await expectStyles(page, [
                {
                    selectors: ['.dropdown-menu'],
                    styles: { transform: 'translate3d(1200px, 1684px, 0px)' },
                },
            ]);
        });

        test('works with spacing option (data-ui-spacing)', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle = document.querySelector('#dropdownToggle');
                dropdownToggle.setAttribute('data-ui-spacing', '50');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    duration: 0,
                });
                dropdown.show();
            });

            await waitForFrame(page);
            + await expectStyles(page, [
                {
                    selectors: ['.dropdown-menu'],
                    styles: { transform: 'translate3d(1200px, 1684px, 0px)' },
                },
            ]);
        });

        test('works with spacing option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#dropdownToggle').dropdown({
                    spacing: 50,
                    duration: 0,
                }).show();
            });

            await waitForFrame(page);
            + await expectStyles(page, [
                {
                    selectors: ['.dropdown-menu'],
                    styles: { transform: 'translate3d(1200px, 1684px, 0px)' },
                },
            ]);
        });

        test('works with spacing and top', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle = document.querySelector('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'top',
                    position: 'center',
                    spacing: 50,
                    duration: 0,
                });
                dropdown.show();
            });

            await waitForFrame(page);
            + await expectStyles(page, [
                {
                    selectors: ['.dropdown-menu'],
                    styles: { transform: 'translate3d(1173px, 1436px, 0px)' },
                },
            ]);
        });

        test('works with spacing and right', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle = document.querySelector('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'right',
                    position: 'center',
                    spacing: 50,
                    duration: 0,
                });
                dropdown.show();
            });

            await waitForFrame(page);
            + await expectStyles(page, [
                {
                    selectors: ['.dropdown-menu'],
                    styles: { transform: 'translate3d(1353px, 1560px, 0px)' },
                },
            ]);
        });

        test('works with spacing and bottom', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle = document.querySelector('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'bottom',
                    position: 'center',
                    spacing: 50,
                    duration: 0,
                });
                dropdown.show();
            });

            await waitForFrame(page);
            + await expectStyles(page, [
                {
                    selectors: ['.dropdown-menu'],
                    styles: { transform: 'translate3d(1173px, 1684px, 0px)' },
                },
            ]);
        });

        test('works with spacing and left', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle = document.querySelector('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'left',
                    position: 'center',
                    spacing: 50,
                    duration: 0,
                });
                dropdown.show();
            });

            await waitForFrame(page);
            + await expectStyles(page, [
                {
                    selectors: ['.dropdown-menu'],
                    styles: { transform: 'translate3d(990px, 1560px, 0px)' },
                },
            ]);
        });
    });

    test.describe('minContact option', () => {
        test('works with minContact option', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 1220;
                const dropdownToggle = document.querySelector('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    minContact: 10,
                    duration: 0,
                });
                dropdown.show();
            });

            await waitForFrame(page);
            + await expectStyles(page, [
                {
                    selectors: ['.dropdown-menu'],
                    styles: { transform: 'translate3d(1220px, 1637px, 0px)' },
                },
            ]);
        });

        test('works with minContact option (data-ui-min-contact)', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 1220;
                const dropdownToggle = document.querySelector('#dropdownToggle');
                dropdownToggle.setAttribute('data-ui-min-contact', '10');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    duration: 0,
                });
                dropdown.show();
            });

            await waitForFrame(page);
            + await expectStyles(page, [
                {
                    selectors: ['.dropdown-menu'],
                    styles: { transform: 'translate3d(1220px, 1637px, 0px)' },
                },
            ]);
        });

        test('works with minContact option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 1220;
                $('#dropdownToggle').dropdown({
                    minContact: 10,
                    duration: 0,
                }).show();
            });

            await waitForFrame(page);
            + await expectStyles(page, [
                {
                    selectors: ['.dropdown-menu'],
                    styles: { transform: 'translate3d(1220px, 1637px, 0px)' },
                },
            ]);
        });

        test('works with minContact and top edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1620;
                const dropdownToggle = document.querySelector('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'right',
                    position: 'center',
                    minContact: 10,
                    duration: 0,
                });
                dropdown.show();
            });

            await waitForFrame(page);
            + await expectStyles(page, [
                {
                    selectors: ['.dropdown-menu'],
                    styles: { transform: 'translate3d(1306px, 1620px, 0px)' },
                },
            ]);
        });

        test('works with minContact and right edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 495;
                const dropdownToggle = document.querySelector('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'top',
                    position: 'center',
                    minContact: 10,
                    duration: 0,
                });
                dropdown.show();
            });

            await waitForFrame(page);
            + await expectStyles(page, [
                {
                    selectors: ['.dropdown-menu'],
                    styles: { transform: 'translate3d(1120px, 1483px, 0px)' },
                },
            ]);
        });

        test('works with minContact and bottom edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollTop = 1030;
                const dropdownToggle = document.querySelector('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'left',
                    position: 'center',
                    minContact: 10,
                    duration: 0,
                });
                dropdown.show();
            });

            await waitForFrame(page);
            + await expectStyles(page, [
                {
                    selectors: ['.dropdown-menu'],
                    styles: { transform: 'translate3d(1037px, 1501px, 0px)' },
                },
            ]);
        });

        test('works with minContact and left edge', async ({ page }) => {
            await page.evaluate((_) => {
                document.scrollingElement.scrollLeft = 1220;
                const dropdownToggle = document.querySelector('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'bottom',
                    position: 'center',
                    minContact: 10,
                    duration: 0,
                });
                dropdown.show();
            });

            await waitForFrame(page);
            + await expectStyles(page, [
                {
                    selectors: ['.dropdown-menu'],
                    styles: { transform: 'translate3d(1220px, 1637px, 0px)' },
                },
            ]);
        });
    });
});
