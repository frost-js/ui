import { expect, test } from '#test';
import { expectPopperPosition } from '../../support/assertions/popper.js';

test.describe('Popper positioning', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            $.setStyle(document.documentElement, { overflow: 'hidden' });
            document.body.innerHTML =
                '<div id="reference" style="position: absolute; left: 360px; top: 283px; width: 80px; height: 34px;"></div>' +
                '<div id="popper" style="width: 160px; height: 80px;"></div>';
        });
    });

    test.describe('placement/position options', () => {
        const placements = [
            { name: 'positions top/start', placement: 'top', position: 'start' },
            { name: 'positions top/center', placement: 'top', position: 'center' },
            { name: 'positions top/end', placement: 'top', position: 'end' },
            { name: 'positions inline-end/start', placement: 'end', position: 'start' },
            { name: 'positions inline-end/center', placement: 'end', position: 'center' },
            { name: 'positions inline-end/end', placement: 'end', position: 'end' },
            { name: 'positions bottom/start', placement: 'bottom', position: 'start' },
            { name: 'positions bottom/center', placement: 'bottom', position: 'center' },
            { name: 'positions bottom/end', placement: 'bottom', position: 'end' },
            { name: 'positions inline-start/start', placement: 'start', position: 'start' },
            { name: 'positions inline-start/center', placement: 'start', position: 'center' },
            { name: 'positions inline-start/end', placement: 'start', position: 'end' },
        ];

        for (const { api, init, cases } of [
            {
                api: 'class',
                init: ({ placement, position }) => {
                    UI.Popper.init($.findOne('#popper'), {
                        reference: $.findOne('#reference'),
                        placement,
                        position,
                    });
                },
                cases: placements,
            },
            {
                api: 'QuerySet',
                init: ({ placement, position }) => {
                    $('#popper').popper({
                        reference: $.findOne('#reference'),
                        placement,
                        position,
                    });
                },
                cases: placements.filter(({ placement, position }) => placement === 'start' && position === 'start'),
            },
        ]) {
            for (const { name, placement, position } of cases) {
                test(`${name} (${api})`, async ({ page }) => {
                    await page.evaluate(init, { placement, position });

                    await expectPopperPosition(page, {
                        popper: '#popper',
                        reference: '#reference',
                        placement,
                        position,
                    });
                });
            }
        }

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
    });

    test.describe('RTL placement/position options', () => {
        test.beforeEach(async ({ page }) => {
            await page.evaluate((_) => {
                document.documentElement.dir = 'rtl';
            });
        });

        for (const { name, placement, position } of [
            { name: 'positions inline-start', placement: 'start', position: 'center' },
            { name: 'positions inline-end', placement: 'end', position: 'center' },
            { name: 'aligns top/inline-start', placement: 'top', position: 'start' },
            { name: 'aligns bottom/inline-end', placement: 'bottom', position: 'end' },
        ]) {
            test(name, async ({ page }) => {
                await page.evaluate(({ placement, position }) => {
                    UI.Popper.init($.findOne('#popper'), {
                        reference: $.findOne('#reference'),
                        placement,
                        position,
                    });
                }, { placement, position });

                await expectPopperPosition(page, {
                    popper: '#popper',
                    reference: '#reference',
                    placement,
                    position,
                });
            });
        }

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
        for (const { name, left, top, placement, expectedPlacement } of [
            { name: 'selects top', left: '360px', top: '500px', placement: 'auto', expectedPlacement: 'top' },
            { name: 'selects inline-end', left: '20px', top: '283px', placement: 'auto', expectedPlacement: 'end' },
            { name: 'selects bottom', left: '360px', top: '20px', placement: 'auto', expectedPlacement: 'bottom' },
            { name: 'selects inline-start', left: '700px', top: '283px', placement: 'auto', expectedPlacement: 'start' },
        ]) {
            test(name, async ({ page }) => {
                await page.evaluate(({ left, top, placement }) => {
                    $.setStyle('#reference', { left, top });
                    UI.Popper.init($.findOne('#popper'), {
                        reference: $.findOne('#reference'),
                        placement,
                        position: 'center',
                    });
                }, { left, top, placement });

                await expectPopperPosition(page, {
                    popper: '#popper',
                    reference: '#reference',
                    placement: expectedPlacement,
                    position: 'center',
                });
            });
        }
    });

    test.describe('placement flip', () => {
        for (const { name, left, top, placement, expectedPlacement } of [
            { name: 'flips top to bottom', left: '360px', top: '10px', placement: 'top', expectedPlacement: 'bottom' },
            { name: 'flips inline-end to inline-start', left: '720px', top: '283px', placement: 'end', expectedPlacement: 'start' },
            { name: 'flips bottom to top', left: '360px', top: '556px', placement: 'bottom', expectedPlacement: 'top' },
            { name: 'flips inline-start to inline-end', left: '10px', top: '283px', placement: 'start', expectedPlacement: 'end' },
        ]) {
            test(name, async ({ page }) => {
                await page.evaluate(({ left, top, placement }) => {
                    $.setStyle('#reference', { left, top });
                    UI.Popper.init($.findOne('#popper'), {
                        reference: $.findOne('#reference'),
                        placement,
                        position: 'center',
                    });
                }, { left, top, placement });

                await expectPopperPosition(page, {
                    popper: '#popper',
                    reference: '#reference',
                    placement: expectedPlacement,
                    position: 'center',
                });
            });
        }
    });

    test.describe('position clamp', () => {
        for (const { name, left, top, placement, position, boundaryEdge } of [
            { name: 'clamps top/start to the right edge', left: '700px', top: '283px', placement: 'top', position: 'start', boundaryEdge: 'right' },
            { name: 'clamps top/center to the right edge', left: '700px', top: '283px', placement: 'top', position: 'center', boundaryEdge: 'right' },
            { name: 'clamps top/center to the left edge', left: '0px', top: '283px', placement: 'top', position: 'center', boundaryEdge: 'left' },
            { name: 'clamps top/end to the left edge', left: '0px', top: '283px', placement: 'top', position: 'end', boundaryEdge: 'left' },
            { name: 'clamps inline-end/start to the bottom edge', left: '360px', top: '540px', placement: 'end', position: 'start', boundaryEdge: 'bottom' },
            { name: 'clamps inline-end/center to the bottom edge', left: '360px', top: '550px', placement: 'end', position: 'center', boundaryEdge: 'bottom' },
            { name: 'clamps inline-end/center to the top edge', left: '360px', top: '0px', placement: 'end', position: 'center', boundaryEdge: 'top' },
            { name: 'clamps inline-end/end to the top edge', left: '360px', top: '0px', placement: 'end', position: 'end', boundaryEdge: 'top' },
            { name: 'clamps bottom/start to the right edge', left: '700px', top: '283px', placement: 'bottom', position: 'start', boundaryEdge: 'right' },
            { name: 'clamps bottom/center to the right edge', left: '700px', top: '283px', placement: 'bottom', position: 'center', boundaryEdge: 'right' },
            { name: 'clamps bottom/center to the left edge', left: '0px', top: '283px', placement: 'bottom', position: 'center', boundaryEdge: 'left' },
            { name: 'clamps bottom/end to the left edge', left: '0px', top: '283px', placement: 'bottom', position: 'end', boundaryEdge: 'left' },
            { name: 'clamps inline-start/start to the bottom edge', left: '360px', top: '540px', placement: 'start', position: 'start', boundaryEdge: 'bottom' },
            { name: 'clamps inline-start/center to the bottom edge', left: '360px', top: '550px', placement: 'start', position: 'center', boundaryEdge: 'bottom' },
            { name: 'clamps inline-start/center to the top edge', left: '360px', top: '0px', placement: 'start', position: 'center', boundaryEdge: 'top' },
            { name: 'clamps inline-start/end to the top edge', left: '360px', top: '0px', placement: 'start', position: 'end', boundaryEdge: 'top' },
        ]) {
            test(name, async ({ page }) => {
                await page.evaluate(({ left, top, placement, position }) => {
                    $.setStyle('#reference', { left, top });
                    UI.Popper.init($.findOne('#popper'), {
                        reference: $.findOne('#reference'),
                        placement,
                        position,
                        fixed: true,
                    });
                }, { left, top, placement, position });

                await expectPopperPosition(page, {
                    popper: '#popper',
                    reference: '#reference',
                    placement,
                    boundaryEdge,
                });
            });
        }
    });

    test.describe('fixed option', () => {
        for (const { name, run } of [
            {
                name: 'class',
                run: (_) => {
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
                },
            },
            {
                name: 'QuerySet',
                run: (_) => {
                    $.setStyle('#reference', { top: '10px' });
                    $('#popper').popper({
                        reference: $.findOne('#reference'),
                        placement: 'top',
                        fixed: true,
                    });
                },
            },
        ]) {
            test(`preserves top at the viewport edge (${name})`, async ({ page }) => {
                await page.evaluate(run);

                await expectPopperPosition(page, {
                    popper: '#popper',
                    reference: '#reference',
                    placement: 'top',
                    position: 'center',
                });
            });
        }

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
    });

    test.describe('spacing option', () => {
        const placements = [
            { name: 'adds spacing above the reference', placement: 'top' },
            { name: 'adds spacing at the inline-end of the reference', placement: 'end' },
            { name: 'adds spacing below the reference', placement: 'bottom' },
            { name: 'adds spacing at the inline-start of the reference', placement: 'start' },
        ];

        for (const { api, init, cases } of [
            {
                api: 'class',
                init: (placement) => {
                    UI.Popper.init($.findOne('#popper'), {
                        reference: $.findOne('#reference'),
                        placement,
                        position: 'center',
                        fixed: true,
                        spacing: 50,
                    });
                },
                cases: placements,
            },
            {
                api: 'QuerySet',
                init: (placement) => {
                    $('#popper').popper({
                        reference: $.findOne('#reference'),
                        placement,
                        position: 'center',
                        fixed: true,
                        spacing: 50,
                    });
                },
                cases: placements.filter(({ placement }) => placement === 'end'),
            },
        ]) {
            for (const { name, placement } of cases) {
                test(`${name} (${api})`, async ({ page }) => {
                    await page.evaluate(init, placement);

                    await expectPopperPosition(page, {
                        popper: '#popper',
                        reference: '#reference',
                        placement,
                        position: 'center',
                        spacing: 50,
                    });
                });
            }
        }

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

        for (const { name, run } of [
            {
                name: 'class',
                run: (_) => {
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
                },
            },
            {
                name: 'QuerySet',
                run: (_) => {
                    $.setStyle('#reference', { left: '795px' });
                    $('#popper').popper({
                        reference: $.findOne('#reference'),
                        placement: 'top',
                        position: 'center',
                        fixed: true,
                        minContact: 10,
                    });
                },
            },
        ]) {
            test(`preserves contact at the right edge (${name})`, async ({ page }) => {
                await page.evaluate(run);

                await expectPopperPosition(page, {
                    popper: '#popper',
                    reference: '#reference',
                    placement: 'top',
                    boundaryEdge: 'right',
                    minContact: 10,
                });
            });
        }

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
    });

    test.describe('arrow option', () => {
        test('aligns the arrow below a top/start popper', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#popper').innerHTML = '<div id="arrow" style="width: 16px; height: 8px;"></div>';
                const arrow = $.findOne('#arrow');

                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    arrow,
                    placement: 'top',
                    position: 'start',
                    fixed: true,
                });
            });

            const arrow = page.locator('#arrow');

            await expect(arrow).toHaveCSS('position', 'absolute');
            await expect(arrow).toHaveCSS('bottom', '-8px');
            await expect(arrow).toHaveCSS('left', '32px');
        });

        test('aligns the arrow above a bottom/end popper', async ({ page }) => {
            await page.evaluate((_) => {
                document.querySelector('#popper').innerHTML = '<div id="arrow" style="width: 16px; height: 8px;"></div>';
                const arrow = $.findOne('#arrow');

                UI.Popper.init($.findOne('#popper'), {
                    reference: $.findOne('#reference'),
                    arrow,
                    placement: 'bottom',
                    position: 'end',
                    fixed: true,
                });
            });

            const arrow = page.locator('#arrow');

            await expect(arrow).toHaveCSS('position', 'absolute');
            await expect(arrow).toHaveCSS('top', '-8px');
            await expect(arrow).toHaveCSS('left', '112px');
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
