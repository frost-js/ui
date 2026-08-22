import { test } from '@playwright/test';
import { advanceClock, resetPage, setupClock } from '../../setup/browser.js';
import { expectAnimationState } from '../../support/assertions/animation.js';

test.beforeEach(async ({ page }) => {
    await setupClock(page);
    await resetPage(page);
});

test.describe('Offcanvas/Modal', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<button class="btn btn-secondary" id="offcanvasToggle" data-ui-toggle="offcanvas" data-ui-target="#offcanvas" type="button"></button>' +
                '<div class="offcanvas offcanvas-start" id="offcanvas">' +
                '<button class="btn-close" id="button" data-ui-dismiss="offcanvas" type="button"></button>' +
                '<button class="btn btn-secondary" id="modalToggle" data-ui-toggle="modal" data-ui-target="#modal" type="button"></button>' +
                '</div>' +
                '<div class="modal" id="modal">' +
                '<div class="modal-dialog" id="modalDialog">' +
                '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                '</div>' +
                '</div>';
        });
    });

    test.describe('user events', () => {
        test('does not hide the offcanvas on document click when modal is open', async ({ page }) => {
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
                $.click(document.body);
            });
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog', '.modal-backdrop'],
                    progress: 0.08,
                },
                {
                    selectors: ['#offcanvas'],
                },
            ]);
        });

        test('does not hide the offcanvas on escape when modal is open', async ({ page }) => {
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
                document.body.dispatchEvent(new KeyboardEvent('keydown', {
                    bubbles: true,
                    code: 'Escape',
                }));
            });
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog', '.modal-backdrop'],
                    progress: 0.08,
                },
                {
                    selectors: ['#offcanvas'],
                },
            ]);
        });
    });
});
