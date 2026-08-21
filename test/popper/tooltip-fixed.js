import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'mocha';
import { exec, screenshot } from './../setup.js';

describe('popper tooltip (fixed)', function() {
    beforeEach(async function() {
        await exec((_) => {
            $.setHTML(
                document.body,
                '<div class="text-center" style="padding: 1600px 1200px;">' +
                '<button class="btn btn-secondary" id="tooltipToggle" data-ui-title="This is a tooltip." type="button" style="position: fixed; top: 300px; left: 350px;">Tooltip</button>' +
                '</div>',
            );
            $.setScroll(document, 850, 1300);
        });
    });

    describe('placement/position options', function() {
        it('works with top/start', async function() {
            await exec((_) => {
                const tooltipToggle = $.findOne('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'top',
                    position: 'start',
                    duration: 0,
                });
                tooltip.show();
            });
            await screenshot('./screens/tooltip/position-fixed/top-start.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.tooltip', 'transform');
                }),
                'translate3d(1200px, 1567px, 0px)',
            );
        });

        it('works with top/center', async function() {
            await exec((_) => {
                const tooltipToggle = $.findOne('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'top',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
            });
            await screenshot('./screens/tooltip/position-fixed/top-center.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.tooltip', 'transform');
                }),
                'translate3d(1166px, 1567px, 0px)',
            );
        });

        it('works with top/end', async function() {
            await exec((_) => {
                const tooltipToggle = $.findOne('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'top',
                    position: 'end',
                    duration: 0,
                });
                tooltip.show();
            });
            await screenshot('./screens/tooltip/position-fixed/top-end.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.tooltip', 'transform');
                }),
                'translate3d(1132px, 1567px, 0px)',
            );
        });

        it('works with right/start', async function() {
            await exec((_) => {
                const tooltipToggle = $.findOne('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'right',
                    position: 'start',
                    duration: 0,
                });
                tooltip.show();
            });
            await screenshot('./screens/tooltip/position-fixed/right-start.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.tooltip', 'transform');
                }),
                'translate3d(1272px, 1600px, 0px)',
            );
        });

        it('works with right/center', async function() {
            await exec((_) => {
                const tooltipToggle = $.findOne('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'right',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
            });
            await screenshot('./screens/tooltip/position-fixed/right-center.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.tooltip', 'transform');
                }),
                'translate3d(1272px, 1601px, 0px)',
            );
        });

        it('works with right/end', async function() {
            await exec((_) => {
                const tooltipToggle = $.findOne('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'right',
                    position: 'end',
                    duration: 0,
                });
                tooltip.show();
            });
            await screenshot('./screens/tooltip/position-fixed/right-end.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.tooltip', 'transform');
                }),
                'translate3d(1272px, 1603px, 0px)',
            );
        });

        it('works with bottom/start', async function() {
            await exec((_) => {
                const tooltipToggle = $.findOne('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'bottom',
                    position: 'start',
                    duration: 0,
                });
                tooltip.show();
            });
            await screenshot('./screens/tooltip/position-fixed/bottom-start.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.tooltip', 'transform');
                }),
                'translate3d(1200px, 1636px, 0px)',
            );
        });

        it('works with bottom/center', async function() {
            await exec((_) => {
                const tooltipToggle = $.findOne('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'bottom',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
            });
            await screenshot('./screens/tooltip/position-fixed/bottom-center.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.tooltip', 'transform');
                }),
                'translate3d(1166px, 1636px, 0px)',
            );
        });

        it('works with bottom/end', async function() {
            await exec((_) => {
                const tooltipToggle = $.findOne('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'bottom',
                    position: 'end',
                    duration: 0,
                });
                tooltip.show();
            });
            await screenshot('./screens/tooltip/position-fixed/bottom-end.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.tooltip', 'transform');
                }),
                'translate3d(1132px, 1636px, 0px)',
            );
        });

        it('works with left/start', async function() {
            await exec((_) => {
                const tooltipToggle = $.findOne('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'left',
                    position: 'start',
                    duration: 0,
                });
                tooltip.show();
            });
            await screenshot('./screens/tooltip/position-fixed/left-start.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.tooltip', 'transform');
                }),
                'translate3d(1060px, 1600px, 0px)',
            );
        });

        it('works with left/center', async function() {
            await exec((_) => {
                const tooltipToggle = $.findOne('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'left',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
            });
            await screenshot('./screens/tooltip/position-fixed/left-center.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.tooltip', 'transform');
                }),
                'translate3d(1060px, 1601px, 0px)',
            );
        });

        it('works with left/end', async function() {
            await exec((_) => {
                const tooltipToggle = $.findOne('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'left',
                    position: 'end',
                    duration: 0,
                });
                tooltip.show();
            });
            await screenshot('./screens/tooltip/position-fixed/left-end.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.tooltip', 'transform');
                }),
                'translate3d(1060px, 1603px, 0px)',
            );
        });
    });
});
