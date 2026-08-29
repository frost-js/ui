import { test } from '#test';
import { resetPage } from '../../setup/browser.js';
import { expectPopperPosition } from '../../support/assertions/popper.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('Popper positioning', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            $.setStyle(document.documentElement, { overflow: 'hidden' });
            $.setHTML(
                document.body,
                `
                    <div id="reference" style="position: absolute; left: 360px; top: 283px; width: 80px; height: 34px;"></div>
                    <div id="popper" style="width: 160px; height: 80px;"></div>
                `,
            );
        });
    });

    test.describe('placement/position options', () => {
        test('positions top/start', async ({ page }) => {
            await page.evaluate((_) => {
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'top',
                    position: 'start',
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'top',
                position: 'start',
            });
        });

        test('positions top/center', async ({ page }) => {
            await page.evaluate((_) => {
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

        test('positions top/end', async ({ page }) => {
            await page.evaluate((_) => {
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'top',
                    position: 'end',
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'top',
                position: 'end',
            });
        });

        test('positions inline-end/start', async ({ page }) => {
            await page.evaluate((_) => {
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'end',
                    position: 'start',
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'end',
                position: 'start',
            });
        });

        test('positions inline-end/center', async ({ page }) => {
            await page.evaluate((_) => {
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'end',
                    position: 'center',
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'end',
                position: 'center',
            });
        });

        test('positions inline-end/end', async ({ page }) => {
            await page.evaluate((_) => {
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'end',
                    position: 'end',
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'end',
                position: 'end',
            });
        });

        test('positions bottom/start', async ({ page }) => {
            await page.evaluate((_) => {
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'bottom',
                    position: 'start',
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'bottom',
                position: 'start',
            });
        });

        test('positions bottom/center', async ({ page }) => {
            await page.evaluate((_) => {
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'bottom',
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

        test('positions bottom/end', async ({ page }) => {
            await page.evaluate((_) => {
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'bottom',
                    position: 'end',
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'bottom',
                position: 'end',
            });
        });

        test('positions inline-start/start', async ({ page }) => {
            await page.evaluate((_) => {
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'start',
                    position: 'start',
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'start',
                position: 'start',
            });
        });

        test('positions inline-start/center', async ({ page }) => {
            await page.evaluate((_) => {
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'start',
                    position: 'center',
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'start',
                position: 'center',
            });
        });

        test('positions inline-start/end', async ({ page }) => {
            await page.evaluate((_) => {
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'start',
                    position: 'end',
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'start',
                position: 'end',
            });
        });

        test('reads placement and position from data attributes', async ({ page }) => {
            await page.evaluate((_) => {
                $.setAttribute('#popper', {
                    'data-ui-placement': 'top',
                    'data-ui-position': 'end',
                });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'top',
                position: 'end',
            });
        });

        test('works with query options', async ({ page }) => {
            await page.evaluate((_) => {
                $('#popper').popper({
                    reference: $.findOne('#reference'),
                    placement: 'start',
                    position: 'start',
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'start',
                position: 'start',
            });
        });
    });

    test.describe('RTL placement/position options', () => {
        test.beforeEach(async ({ page }) => {
            await page.evaluate((_) => {
                document.documentElement.dir = 'rtl';
            });
        });

        test('positions inline-start', async ({ page }) => {
            await page.evaluate((_) => {
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'start',
                    position: 'center',
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'start',
                position: 'center',
            });
        });

        test('positions inline-end', async ({ page }) => {
            await page.evaluate((_) => {
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'end',
                    position: 'center',
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'end',
                position: 'center',
            });
        });

        test('aligns top/inline-start', async ({ page }) => {
            await page.evaluate((_) => {
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'top',
                    position: 'start',
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'top',
                position: 'start',
            });
        });

        test('aligns bottom/inline-end', async ({ page }) => {
            await page.evaluate((_) => {
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'bottom',
                    position: 'end',
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'bottom',
                position: 'end',
            });
        });

        test('selects inline-start automatically', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', { left: '40px' });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'auto',
                    position: 'center',
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'start',
                position: 'center',
            });
        });

        test('flips inline-start to inline-end', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', { left: '720px' });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'start',
                    position: 'center',
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'end',
                position: 'center',
            });
        });
    });

    test.describe('auto placement', () => {
        test('selects top', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', {
                    left: '360px',
                    top: '500px',
                });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'auto',
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

        test('selects inline-end', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', {
                    left: '20px',
                    top: '283px',
                });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'auto',
                    position: 'center',
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'end',
                position: 'center',
            });
        });

        test('selects bottom', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', {
                    left: '360px',
                    top: '20px',
                });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'auto',
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

        test('selects inline-start', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', {
                    left: '700px',
                    top: '283px',
                });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'auto',
                    position: 'center',
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'start',
                position: 'center',
            });
        });
    });

    test.describe('placement flip', () => {
        test('flips top to bottom', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', {
                    left: '360px',
                    top: '10px',
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
                placement: 'bottom',
                position: 'center',
            });
        });

        test('flips inline-end to inline-start', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', {
                    left: '720px',
                    top: '283px',
                });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'end',
                    position: 'center',
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'start',
                position: 'center',
            });
        });

        test('flips bottom to top', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', {
                    left: '360px',
                    top: '556px',
                });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'bottom',
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

        test('flips inline-start to inline-end', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', {
                    left: '10px',
                    top: '283px',
                });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'start',
                    position: 'center',
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'end',
                position: 'center',
            });
        });
    });

    test.describe('position clamp', () => {
        test('clamps top/start to the right edge', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', {
                    left: '700px',
                    top: '283px',
                });
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
                boundaryEdge: 'right',
            });
        });

        test('clamps top/center to the right edge', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', {
                    left: '700px',
                    top: '283px',
                });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'top',
                    position: 'center',
                    fixed: true,
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'top',
                boundaryEdge: 'right',
            });
        });

        test('clamps top/center to the left edge', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', {
                    left: '0px',
                    top: '283px',
                });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'top',
                    position: 'center',
                    fixed: true,
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'top',
                boundaryEdge: 'left',
            });
        });

        test('clamps top/end to the left edge', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', {
                    left: '0px',
                    top: '283px',
                });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'top',
                    position: 'end',
                    fixed: true,
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'top',
                boundaryEdge: 'left',
            });
        });

        test('clamps inline-end/start to the bottom edge', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', {
                    left: '360px',
                    top: '540px',
                });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'end',
                    position: 'start',
                    fixed: true,
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'end',
                boundaryEdge: 'bottom',
            });
        });

        test('clamps inline-end/center to the bottom edge', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', {
                    left: '360px',
                    top: '550px',
                });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'end',
                    position: 'center',
                    fixed: true,
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'end',
                boundaryEdge: 'bottom',
            });
        });

        test('clamps inline-end/center to the top edge', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', {
                    left: '360px',
                    top: '0px',
                });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'end',
                    position: 'center',
                    fixed: true,
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'end',
                boundaryEdge: 'top',
            });
        });

        test('clamps inline-end/end to the top edge', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', {
                    left: '360px',
                    top: '0px',
                });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'end',
                    position: 'end',
                    fixed: true,
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'end',
                boundaryEdge: 'top',
            });
        });

        test('clamps bottom/start to the right edge', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', {
                    left: '700px',
                    top: '283px',
                });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'bottom',
                    position: 'start',
                    fixed: true,
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'bottom',
                boundaryEdge: 'right',
            });
        });

        test('clamps bottom/center to the right edge', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', {
                    left: '700px',
                    top: '283px',
                });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'bottom',
                    position: 'center',
                    fixed: true,
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'bottom',
                boundaryEdge: 'right',
            });
        });

        test('clamps bottom/center to the left edge', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', {
                    left: '0px',
                    top: '283px',
                });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'bottom',
                    position: 'center',
                    fixed: true,
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'bottom',
                boundaryEdge: 'left',
            });
        });

        test('clamps bottom/end to the left edge', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', {
                    left: '0px',
                    top: '283px',
                });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'bottom',
                    position: 'end',
                    fixed: true,
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'bottom',
                boundaryEdge: 'left',
            });
        });

        test('clamps inline-start/start to the bottom edge', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', {
                    left: '360px',
                    top: '540px',
                });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'start',
                    position: 'start',
                    fixed: true,
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'start',
                boundaryEdge: 'bottom',
            });
        });

        test('clamps inline-start/center to the bottom edge', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', {
                    left: '360px',
                    top: '550px',
                });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'start',
                    position: 'center',
                    fixed: true,
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'start',
                boundaryEdge: 'bottom',
            });
        });

        test('clamps inline-start/center to the top edge', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', {
                    left: '360px',
                    top: '0px',
                });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'start',
                    position: 'center',
                    fixed: true,
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'start',
                boundaryEdge: 'top',
            });
        });

        test('clamps inline-start/end to the top edge', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', {
                    left: '360px',
                    top: '0px',
                });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'start',
                    position: 'end',
                    fixed: true,
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'start',
                boundaryEdge: 'top',
            });
        });
    });

    test.describe('fixed option', () => {
        test('preserves top at the viewport edge', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', {
                    left: '360px',
                    top: '10px',
                });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'top',
                    position: 'center',
                    fixed: true,
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'top',
                position: 'center',
            });
        });

        test('preserves inline-end at the viewport edge', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', {
                    left: '720px',
                    top: '283px',
                });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'end',
                    position: 'center',
                    fixed: true,
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'end',
                position: 'center',
            });
        });

        test('preserves bottom at the viewport edge', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', {
                    left: '360px',
                    top: '556px',
                });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'bottom',
                    position: 'center',
                    fixed: true,
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'bottom',
                position: 'center',
            });
        });

        test('preserves inline-start at the viewport edge', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', {
                    left: '10px',
                    top: '283px',
                });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'start',
                    position: 'center',
                    fixed: true,
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'start',
                position: 'center',
            });
        });

        test('reads fixed from data attributes', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', { top: '10px' });
                $.setAttribute('#popper', {
                    'data-ui-fixed': true,
                    'data-ui-placement': 'top',
                });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'top',
                position: 'center',
            });
        });

        test('works with query options', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', { top: '10px' });
                $('#popper').popper({
                    reference: $.findOne('#reference'),
                    placement: 'top',
                    fixed: true,
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

    test.describe('spacing option', () => {
        test('adds spacing above the reference', async ({ page }) => {
            await page.evaluate((_) => {
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'top',
                    position: 'center',
                    fixed: true,
                    spacing: 50,
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'top',
                position: 'center',
                spacing: 50,
            });
        });

        test('adds spacing at the inline-end of the reference', async ({ page }) => {
            await page.evaluate((_) => {
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'end',
                    position: 'center',
                    fixed: true,
                    spacing: 50,
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'end',
                position: 'center',
                spacing: 50,
            });
        });

        test('adds spacing below the reference', async ({ page }) => {
            await page.evaluate((_) => {
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'bottom',
                    position: 'center',
                    fixed: true,
                    spacing: 50,
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'bottom',
                position: 'center',
                spacing: 50,
            });
        });

        test('adds spacing at the inline-start of the reference', async ({ page }) => {
            await page.evaluate((_) => {
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'start',
                    position: 'center',
                    fixed: true,
                    spacing: 50,
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'start',
                position: 'center',
                spacing: 50,
            });
        });

        test('reads spacing from data attributes', async ({ page }) => {
            await page.evaluate((_) => {
                $.setAttribute('#popper', {
                    'data-ui-fixed': true,
                    'data-ui-placement': 'end',
                    'data-ui-spacing': 50,
                });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'end',
                position: 'center',
                spacing: 50,
            });
        });

        test('works with query options', async ({ page }) => {
            await page.evaluate((_) => {
                $('#popper').popper({
                    reference: $.findOne('#reference'),
                    placement: 'end',
                    position: 'center',
                    fixed: true,
                    spacing: 50,
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'end',
                position: 'center',
                spacing: 50,
            });
        });
    });

    test.describe('minContact option', () => {
        test('preserves contact at the top edge', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', {
                    left: '360px',
                    top: '-29px',
                });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'end',
                    position: 'center',
                    fixed: true,
                    minContact: 10,
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'end',
                boundaryEdge: 'top',
                minContact: 10,
            });
        });

        test('preserves contact at the right edge', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', {
                    left: '795px',
                    top: '283px',
                });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'top',
                    position: 'center',
                    fixed: true,
                    minContact: 10,
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'top',
                boundaryEdge: 'right',
                minContact: 10,
            });
        });

        test('preserves contact at the bottom edge', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', {
                    left: '360px',
                    top: '595px',
                });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'start',
                    position: 'center',
                    fixed: true,
                    minContact: 10,
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'start',
                boundaryEdge: 'bottom',
                minContact: 10,
            });
        });

        test('preserves contact at the left edge', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', {
                    left: '-75px',
                    top: '283px',
                });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'bottom',
                    position: 'center',
                    fixed: true,
                    minContact: 10,
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'bottom',
                boundaryEdge: 'left',
                minContact: 10,
            });
        });

        test('reads minContact from data attributes', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', { left: '795px' });
                $.setAttribute('#popper', {
                    'data-ui-fixed': true,
                    'data-ui-min-contact': 10,
                    'data-ui-placement': 'top',
                });
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'top',
                boundaryEdge: 'right',
                minContact: 10,
            });
        });

        test('works with query options', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', { left: '795px' });
                $('#popper').popper({
                    reference: $.findOne('#reference'),
                    placement: 'top',
                    position: 'center',
                    fixed: true,
                    minContact: 10,
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'top',
                boundaryEdge: 'right',
                minContact: 10,
            });
        });
    });

    test.describe('fixed reference', () => {
        test.beforeEach(async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle('#reference', { position: 'fixed' });
            });
        });

        test('positions top', async ({ page }) => {
            await page.evaluate((_) => {
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'top',
                    position: 'center',
                    fixed: true,
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'top',
                position: 'center',
            });
        });

        test('positions inline-end', async ({ page }) => {
            await page.evaluate((_) => {
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'end',
                    position: 'center',
                    fixed: true,
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'end',
                position: 'center',
            });
        });

        test('positions bottom', async ({ page }) => {
            await page.evaluate((_) => {
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'bottom',
                    position: 'center',
                    fixed: true,
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'bottom',
                position: 'center',
            });
        });

        test('positions inline-start', async ({ page }) => {
            await page.evaluate((_) => {
                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'start',
                    position: 'center',
                    fixed: true,
                });
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'start',
                position: 'center',
            });
        });

        test('remains attached after document scroll', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle(document.body, { minHeight: '2000px' });
                $.setStyle(document.documentElement, { overflow: '' });
                $.setStyle('#reference', { position: 'fixed' });

                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    placement: 'bottom',
                    position: 'center',
                    fixed: true,
                });

                window.scrollTo(0, 400);
                UI.Popper.init($.findOne('#popper')).update();
            });

            await expectPopperPosition(page, {
                popper: '#popper',
                reference: '#reference',
                placement: 'bottom',
                position: 'center',
            });
        });
    });
});
