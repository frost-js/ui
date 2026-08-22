import { test } from '@playwright/test';
import { advanceClock, resetPage, setupClock } from '../../setup/browser.js';
import { expectAnimationState } from '../../support/assertions/animation.js';

test.beforeEach(async ({ page }) => {
    await setupClock(page);
    await resetPage(page);
});

test.describe('Modal/Dropdown', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<button class="btn btn-secondary" id="modalToggle" data-ui-toggle="modal" data-ui-target="#modal" type="button"></button>' +
                '<div class="modal" id="modal">' +
                '<div class="modal-dialog" id="modalDialog">' +
                '<button class="btn-close" id="button" data-ui-dismiss="modal" type="button"></button>' +
                '<div>' +
                '<button class="btn btn-secondary" id="dropdownToggle" data-ui-toggle="dropdown" type="button"></button>' +
                '<div class="dropdown-menu" id="dropdown">' +
                '<button class="dropdown-item" id="dropdownItem1"></button>' +
                '<button class="dropdown-item" id="dropdownItem2"></button>' +
                '<button class="dropdown-item" id="dropdownItem3"></button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        });
    });

    test.describe('user events', () => {
        test('hides the modal and dropdown on document click when dropdown is open', async ({ page }) => {
            await page.evaluate((_) => {
                const modal = $.findOne('#modal');
                UI.Modal.init(modal).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog');
                $.stop('.modal-backdrop');
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
                    selectors: ['#modalDialog', '.modal-backdrop'],
                    active: true,
                },
            ]);
        });

        test('does not hide the modal on escape when dropdown is open', async ({ page }) => {
            await page.evaluate((_) => {
                const modal = $.findOne('#modal');
                UI.Modal.init(modal).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog');
                $.stop('.modal-backdrop');
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
                    selectors: ['#modalDialog'],
                },
            ]);
        });
    });
});
