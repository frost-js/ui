import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'mocha';
import { exec, screenshot } from './../setup.js';

describe('popper tooltip (overflow/window)', function() {
    beforeEach(async function() {
        await exec((_) => {
            $.setHTML(
                document.body,
                '<div style="width: calc(100vw + 1800px); padding: 1300px 900px;">' +
                '<div id="scroll" style="position: relative; overflow: auto; width: 100vw; height: 100vh;">' +
                '<div class="text-center" style="padding: 1600px 1200px;">' +
                '<button class="btn btn-secondary" id="tooltipToggle" data-ui-title="This is a tooltip." type="button">Tooltip</button>' +
                '</div>' +
                '</div>' +
                '</div>',
            );
            $.setScroll(document, 900, 1300);
            $.setScroll('#scroll', 900, 1300);
        });
    });

    describe('placement flip', function() {
        it('works with top/center and top edge', async function() {
            await exec((_) => {
                $.setScrollY(document, 1570);
                const tooltipToggle = $.findOne('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'top',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
            });
            await screenshot('./screens/tooltip/overflow-window-placement-flip/top-center-top.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.tooltip', 'transform');
                }),
                'translate3d(1166px, 1636px, 0px)',
            );
        });

        it('works with right/center and right edge', async function() {
            await exec((_) => {
                $.setScrollX(document, 595);
                const tooltipToggle = $.findOne('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'right',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
            });
            await screenshot('./screens/tooltip/overflow-window-placement-flip/right-center-right.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.tooltip', 'transform');
                }),
                'translate3d(1060px, 1601px, 0px)',
            );
        });

        it('works with bottom/center and bottom edge', async function() {
            await exec((_) => {
                $.setScrollY(document, 1080);
                const tooltipToggle = $.findOne('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'bottom',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
            });
            await screenshot('./screens/tooltip/overflow-window-placement-flip/bottom-center-bottom.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.tooltip', 'transform');
                }),
                'translate3d(1166px, 1567px, 0px)',
            );
        });

        it('works with left/center and left edge', async function() {
            await exec((_) => {
                $.setScrollX(document, 1100);
                const tooltipToggle = $.findOne('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'left',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
                return $.getStyle('.tooltip', 'transform');
            });
            await screenshot('./screens/tooltip/overflow-window-placement-flip/left-center-left.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.tooltip', 'transform');
                }),
                'translate3d(1272px, 1601px, 0px)',
            );
        });
    });

    describe('position clamp', function() {
        it('works with top/start and right edge', async function() {
            await exec((_) => {
                $.setScrollX(document, 480);
                const tooltipToggle = $.findOne('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'top',
                    position: 'start',
                    duration: 0,
                });
                tooltip.show();
            });
            await screenshot('./screens/tooltip/overflow-window-position-clamp/top-start-right.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.tooltip', 'transform');
                }),
                'translate3d(1127px, 1567px, 0px)',
            );
        });

        it('works with top/center and right edge', async function() {
            await exec((_) => {
                $.setScrollX(document, 480);
                const tooltipToggle = $.findOne('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'top',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
            });
            await screenshot('./screens/tooltip/overflow-window-position-clamp/top-center-right.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.tooltip', 'transform');
                }),
                'translate3d(1127px, 1567px, 0px)',
            );
        });

        it('works with top/center and left edge', async function() {
            await exec((_) => {
                $.setScrollX(document, 1200);
                const tooltipToggle = $.findOne('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'top',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
                return $.getStyle('.tooltip', 'transform');
            });
            await screenshot('./screens/tooltip/overflow-window-position-clamp/top-center-left.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.tooltip', 'transform');
                }),
                'translate3d(1200px, 1567px, 0px)',
            );
        });

        it('works with top/end and left edge', async function() {
            await exec((_) => {
                $.setScrollX(document, 1200);
                const tooltipToggle = $.findOne('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'top',
                    position: 'end',
                    duration: 0,
                });
                tooltip.show();
            });
            await screenshot('./screens/tooltip/overflow-window-position-clamp/top-end-left.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.tooltip', 'transform');
                }),
                'translate3d(1200px, 1567px, 0px)',
            );
        });

        it('works with right/start and bottom edge', async function() {
            await exec((_) => {
                $.setScrollY(document, 1040);
                const tooltipToggle = $.findOne('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'right',
                    position: 'start',
                    duration: 0,
                });
                tooltip.show();
            });
            await screenshot('./screens/tooltip/overflow-window-position-clamp/right-start-bottom.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.tooltip', 'transform');
                }),
                'translate3d(1272px, 1594px, 0px)',
            );
        });

        it('works with right/center and top edge', async function() {
            await exec((_) => {
                $.setScrollY(document, 1610);
                const tooltipToggle = $.findOne('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'right',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
            });
            await screenshot('./screens/tooltip/overflow-window-position-clamp/right-center-top.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.tooltip', 'transform');
                }),
                'translate3d(1272px, 1610px, 0px)',
            );
        });

        it('works with right/center and bottom edge', async function() {
            await exec((_) => {
                $.setScrollY(document, 1040);
                const tooltipToggle = $.findOne('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'right',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
            });
            await screenshot('./screens/tooltip/overflow-window-position-clamp/right-center-bottom.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.tooltip', 'transform');
                }),
                'translate3d(1272px, 1594px, 0px)',
            );
        });

        it('works with right/end and top edge', async function() {
            await exec((_) => {
                $.setScrollY(document, 1610);
                const tooltipToggle = $.findOne('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'right',
                    position: 'end',
                    duration: 0,
                });
                tooltip.show();
            });
            await screenshot('./screens/tooltip/overflow-window-position-clamp/right-end-top.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.tooltip', 'transform');
                }),
                'translate3d(1272px, 1610px, 0px)',
            );
        });

        it('works with bottom/start and right edge', async function() {
            await exec((_) => {
                $.setScrollX(document, 480);
                const tooltipToggle = $.findOne('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'bottom',
                    position: 'start',
                    duration: 0,
                });
                tooltip.show();
            });
            await screenshot('./screens/tooltip/overflow-window-position-clamp/bottom-start-right.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.tooltip', 'transform');
                }),
                'translate3d(1127px, 1636px, 0px)',
            );
        });

        it('works with bottom/center and right edge', async function() {
            await exec((_) => {
                $.setScrollX(document, 480);
                const tooltipToggle = $.findOne('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'bottom',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
            });
            await screenshot('./screens/tooltip/overflow-window-position-clamp/bottom-center-right.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.tooltip', 'transform');
                }),
                'translate3d(1127px, 1636px, 0px)',
            );
        });

        it('works with bottom/center and left edge', async function() {
            await exec((_) => {
                $.setScrollX(document, 1200);
                const tooltipToggle = $.findOne('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'bottom',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
            });
            await screenshot('./screens/tooltip/overflow-window-position-clamp/bottom-center-left.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.tooltip', 'transform');
                }),
                'translate3d(1200px, 1636px, 0px)',
            );
        });

        it('works with bottom/end and left edge', async function() {
            await exec((_) => {
                $.setScrollX(document, 1200);
                const tooltipToggle = $.findOne('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'bottom',
                    position: 'end',
                    duration: 0,
                });
                tooltip.show();
            });
            await screenshot('./screens/tooltip/overflow-window-position-clamp/bottom-end-left.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.tooltip', 'transform');
                }),
                'translate3d(1200px, 1636px, 0px)',
            );
        });

        it('works with left/start and bottom edge', async function() {
            await exec((_) => {
                $.setScrollY(document, 1040);
                const tooltipToggle = $.findOne('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'left',
                    position: 'start',
                    duration: 0,
                });
                tooltip.show();
            });
            await screenshot('./screens/tooltip/overflow-window-position-clamp/left-start-bottom.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.tooltip', 'transform');
                }),
                'translate3d(1060px, 1594px, 0px)',
            );
        });

        it('works with left/center and top edge', async function() {
            await exec((_) => {
                $.setScrollY(document, 1610);
                const tooltipToggle = $.findOne('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'left',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
            });
            await screenshot('./screens/tooltip/overflow-window-position-clamp/left-center-top.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.tooltip', 'transform');
                }),
                'translate3d(1060px, 1610px, 0px)',
            );
        });

        it('works with left/center and bottom edge', async function() {
            await exec((_) => {
                $.setScrollY(document, 1040);
                const tooltipToggle = $.findOne('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'left',
                    position: 'center',
                    duration: 0,
                });
                tooltip.show();
            });
            await screenshot('./screens/tooltip/overflow-window-position-clamp/left-center-bottom.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.tooltip', 'transform');
                }),
                'translate3d(1060px, 1594px, 0px)',
            );
        });

        it('works with left/end and top edge', async function() {
            await exec((_) => {
                $.setScrollY(document, 1610);
                const tooltipToggle = $.findOne('#tooltipToggle');
                const tooltip = UI.Tooltip.init(tooltipToggle, {
                    placement: 'left',
                    position: 'end',
                    duration: 0,
                });
                tooltip.show();
            });
            await screenshot('./screens/tooltip/overflow-window-position-clamp/left-end-top.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.tooltip', 'transform');
                }),
                'translate3d(1060px, 1610px, 0px)',
            );
        });
    });
});
