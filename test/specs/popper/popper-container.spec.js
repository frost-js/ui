import { test } from '@playwright/test';
import { resetPage } from '../../setup/browser.js';
import { expectStyles } from '../../support/assertions/styles.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('Popper container', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="container" style="width: 50px; height: 50px;">' +
                '<button class="btn btn-secondary" id="button" style="width: 80px; height: 34px;" type="button">Button</button>' +
                '</div>' +
                '<div class="badge" id="badge" style="width: 60px; height: 21px;">Badge</div>';
        });
    });

    test.describe('container option', () => {
        test('constrains popper to container', async ({ page }) => {
            await page.evaluate((_) => {
                const badge = $.findOne('#badge');
                UI.Popper.init(badge, {
                    reference: $.findOne('#button'),
                    container: $.findOne('#container'),
                    minContact: 0,
                });
            });

            await expectStyles(page, [
                {
                    selectors: ['#badge'],
                    styles: { transform: 'translate3d(-10px, 34px, 0px)' },
                },
            ]);
        });

        test('constrains popper to container (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#badge').popper({
                    reference: $.findOne('#button'),
                    container: $.findOne('#container'),
                    minContact: 0,
                });
            });

            await expectStyles(page, [
                {
                    selectors: ['#badge'],
                    styles: { transform: 'translate3d(-10px, 34px, 0px)' },
                },
            ]);
        });
    });
});
