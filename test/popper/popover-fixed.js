import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'mocha';
import { exec, screenshot } from './../setup.js';

describe('popper popover (fixed)', function() {
    beforeEach(async function() {
        await exec((_) => {
            $.setHTML(
                document.body,
                '<div class="text-center" style="padding: 1600px 1200px;">' +
                '<button class="btn btn-secondary" id="popoverToggle" data-ui-title="Title" data-ui-content="This is the popover content." type="button" style="position: fixed; top: 300px; left: 350px;">Popover</button>' +
                '</div>',
            );
            $.setScroll(document, 850, 1300);
        });
    });

    describe('placement/position options', function() {
        it('works with top/start', async function() {
            await exec((_) => {
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'top',
                    position: 'start',
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/position-fixed/top-start.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1200px, 1520px, 0px)',
            );
        });

        it('works with top/center', async function() {
            await exec((_) => {
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'top',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/position-fixed/top-center.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1126px, 1520px, 0px)',
            );
        });

        it('works with top/end', async function() {
            await exec((_) => {
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'top',
                    position: 'end',
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/position-fixed/top-end.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1053px, 1520px, 0px)',
            );
        });

        it('works with right/start', async function() {
            await exec((_) => {
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'right',
                    position: 'start',
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/position-fixed/right-start.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1286px, 1600px, 0px)',
            );
        });

        it('works with right/center', async function() {
            await exec((_) => {
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'right',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/position-fixed/right-center.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1286px, 1578px, 0px)',
            );
        });

        it('works with right/end', async function() {
            await exec((_) => {
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'right',
                    position: 'end',
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/position-fixed/right-end.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1286px, 1557px, 0px)',
            );
        });

        it('works with bottom/start', async function() {
            await exec((_) => {
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'bottom',
                    position: 'start',
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/position-fixed/bottom-start.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1200px, 1637px, 0px)',
            );
        });

        it('works with bottom/center', async function() {
            await exec((_) => {
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'bottom',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/position-fixed/bottom-center.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1126px, 1637px, 0px)',
            );
        });

        it('works with bottom/end', async function() {
            await exec((_) => {
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'bottom',
                    position: 'end',
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/position-fixed/bottom-end.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1053px, 1637px, 0px)',
            );
        });

        it('works with left/start', async function() {
            await exec((_) => {
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'left',
                    position: 'start',
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/position-fixed/left-start.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(967px, 1600px, 0px)',
            );
        });

        it('works with left/center', async function() {
            await exec((_) => {
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'left',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/position-fixed/left-center.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(967px, 1578px, 0px)',
            );
        });

        it('works with left/end', async function() {
            await exec((_) => {
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'left',
                    position: 'end',
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/position-fixed/left-end.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(967px, 1557px, 0px)',
            );
        });
    });
});
