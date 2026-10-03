import { test } from '#test';
import { expectPopperPosition } from '../../support/assertions/popper.js';

test.describe('Popper boundaries', () => {
    test.describe('container option', () => {
        test.beforeEach(async ({ page }) => {
            await page.evaluate(() => {
                document.body.innerHTML =
                    '<div id="container" style="position: absolute; left: 100px; top: 100px; width: 300px; height: 250px;"></div>' +
                    '<div id="reference" style="position: absolute; left: 320px; top: 200px; width: 80px; height: 34px;"></div>' +
                    '<div id="popper" style="width: 160px; height: 80px;"></div>';
            });
        });

        for (const { name, run } of [
            {
                name: 'class',
                run: () => {
                    UI.Popper.init($.findOne('#popper'), {
                        reference: $.findOne('#reference'),
                        container: $.findOne('#container'),
                        placement: 'top',
                        position: 'start',
                        fixed: true,
                    });
                },
            },
            {
                name: 'QuerySet',
                run: () => {
                    $('#popper').popper({
                        reference: $.findOne('#reference'),
                        container: $.findOne('#container'),
                        placement: 'top',
                        position: 'start',
                        fixed: true,
                    });
                },
            },
        ]) {
            test(`clamps to an element boundary (${name})`, async ({ page }) => {
                await page.evaluate(run);

                await expectPopperPosition(page, {
                    popper: '#popper',
                    reference: '#reference',
                    placement: 'top',
                    boundary: '#container',
                    boundaryEdge: 'right',
                });
            });
        }
    });

    test.describe('scroll container', () => {
        test.beforeEach(async ({ page }) => {
            await page.evaluate(() => {
                document.body.innerHTML =
                    '<div id="scroll" style="position: absolute; overflow: auto; left: 200px; top: 150px; width: 400px; height: 300px;">' +
                    '<div id="content" style="width: 1000px; height: 800px;">' +
                    '<div id="reference" style="position: absolute; left: 450px; top: 255px; width: 80px; height: 34px;"></div>' +
                    '<div id="popper" style="width: 160px; height: 80px;"></div>' +
                    '</div>' +
                    '</div>';

                const scroll = $.findOne('#scroll');
                $.setScroll(scroll, 300, 250);
            });
        });

        test('flips at the scroll container edge', async ({ page }) => {
            await page.evaluate(() => {
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'top',
                    position: 'center',
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'bottom',
                position: 'center',
            });
        });

        test('clamps to the scroll container edge', async ({ page }) => {
            await page.evaluate(() => {
                $.setStyle('#reference', { left: '600px', top: '380px' });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'top',
                    position: 'start',
                    fixed: true,
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'top',
                boundary: '#scroll',
                boundaryEdge: 'right',
            });
        });

        test('uses a static scroll container that contains the positioning context', async ({ page }) => {
            await page.evaluate(() => {
                $.setStyle('#scroll', {
                    position: 'static',
                    left: '',
                    top: '',
                    marginLeft: '200px',
                    marginTop: '150px',
                });
                $.setStyle('#content', { position: 'relative' });

                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'top',
                    position: 'center',
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'bottom',
                position: 'center',
            });
        });

        test('ignores a static scroll container that does not contain the positioning context', async ({ page }) => {
            await page.evaluate(() => {
                $.setStyle('#scroll', {
                    position: 'static',
                    left: '',
                    top: '',
                    marginLeft: '200px',
                    marginTop: '150px',
                });

                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'top',
                    position: 'center',
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'top',
                position: 'center',
            });
        });
    });

    test('uses the viewport when it is tighter than the scroll container', async ({ page }) => {
        await page.evaluate(() => {
            document.body.innerHTML =
                '<div id="scroll" style="position: absolute; overflow: auto; left: -200px; top: -200px; width: 1200px; height: 1000px;">' +
                '<div style="position: relative; width: 1600px; height: 1400px;">' +
                '<div id="reference" style="position: absolute; left: 560px; top: 210px; width: 80px; height: 34px;"></div>' +
                '<div id="popper" style="width: 160px; height: 80px;"></div>' +
                '</div>' +
                '</div>';

            UI.Popper.init($.findOne('#popper'), {
                reference: $.findOne('#reference'),
                placement: 'top',
                position: 'center',
            });
        });

        await expectPopperPosition(page, {
            popper: '#popper',
            reference: '#reference',
            placement: 'bottom',
            position: 'center',
        });
    });
});
