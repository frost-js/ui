import { test } from '@playwright/test';
import { advanceClock, resetPage, setupClock } from '../../setup/browser.js';
import { expectAnimationState } from '../../support/assertions/animation.js';

test.beforeEach(async ({ page }) => {
    await setupClock(page);
    await resetPage(page);
});

test.describe('Offcanvas/Dropdown', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<button class="btn btn-secondary" id="offcanvasToggle" data-ui-toggle="offcanvas" data-ui-target="#offcanvas" type="button"></button>' +
                '<div class="offcanvas offcanvas-start" id="offcanvas">' +
                '<button class="btn-close" id="button" data-ui-dismiss="offcanvas" type="button"></button>' +
                '<div>' +
                '<button class="btn btn-secondary" id="dropdownToggle" data-ui-toggle="dropdown" type="button"></button>' +
                '<div class="dropdown-menu" id="dropdown">' +
                '<button class="dropdown-item" id="dropdownItem1"></button>' +
                '<button class="dropdown-item" id="dropdownItem2"></button>' +
                '<button class="dropdown-item" id="dropdownItem3"></button>' +
                '</div>' +
                '</div>' +
                '</div>';
        });
    });

    test.describe('user events', () => {
        test('hides the offcanvas and dropdown on document click when dropdown is open', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas = $.findOne('#offcanvas');
                UI.Offcanvas.init(offcanvas).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#offcanvas');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const dropdownToggle = $.findOne('#dropdownToggle');
                UI.Dropdown.init(dropdownToggle).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.click(document.body);
            });
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown'],
                    active: true,
                },
                {
                    selectors: ['#offcanvas'],
                    active: true,
                },
            ]);
        });

        test('does not hide the offcanvas on escape when dropdown is open', async ({ page }) => {
            await page.evaluate((_) => {
                const offcanvas = $.findOne('#offcanvas');
                UI.Offcanvas.init(offcanvas).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#offcanvas');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const dropdownToggle = $.findOne('#dropdownToggle');
                UI.Dropdown.init(dropdownToggle).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                document.body.dispatchEvent(new KeyboardEvent('keydown', {
                    bubbles: true,
                    code: 'Escape',
                }));
            });
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown'],
                    active: true,
                },
                {
                    selectors: ['#offcanvas'],
                },
            ]);
        });
    });
});
