import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'mocha';
import { exec, screenshot } from './../setup.js';

describe('popper popover', function() {
    beforeEach(async function() {
        await exec((_) => {
            $.setHTML(
                document.body,
                '<div class="text-center" style="padding: 1600px 1200px;">' +
                '<button class="btn btn-secondary" id="popoverToggle" data-ui-title="Title" data-ui-content="This is the popover content." type="button">Popover</button>' +
                '</div>',
            );
            $.setScroll(document, 850, 1300);
        });
    });

    describe('#update', function() {
        it('updates the popper position', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const popoverToggle = $.findOne('#popoverToggle');
                    const popover = UI.Popover.init(popoverToggle, {
                        placement: 'top',
                        position: 'center',
                        duration: 0,
                    });
                    popover.show();
                    $.setScrollY(document, 1520);
                    popover.update();
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1126px, 1637px, 0px)',
            );
        });

        it('updates the popper position (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('#popoverToggle').popover({
                        placement: 'top',
                        position: 'center',
                        duration: 0,
                    }).show();
                    $.setScrollY(document, 1520);
                    $('#popoverToggle').popover('update');
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1126px, 1637px, 0px)',
            );
        });
    });

    describe('placement/position options', function() {
        it('works with placement option', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const popoverToggle = $.findOne('#popoverToggle');
                    const popover = UI.Popover.init(popoverToggle, {
                        placement: 'bottom',
                        duration: 0,
                    });
                    popover.show();
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1126px, 1637px, 0px)',
            );
        });

        it('works with placement option (data-ui-placement)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const popoverToggle = $.findOne('#popoverToggle');
                    $.setDataset(popoverToggle, { uiPlacement: 'bottom' });
                    const popover = UI.Popover.init(popoverToggle, {
                        duration: 0,
                    });
                    popover.show();
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1126px, 1637px, 0px)',
            );
        });

        it('works with placement option (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('#popoverToggle').popover({
                        placement: 'bottom',
                        duration: 0,
                    }).show();
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1126px, 1637px, 0px)',
            );
        });

        it('works with position option', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const popoverToggle = $.findOne('#popoverToggle');
                    const popover = UI.Popover.init(popoverToggle, {
                        position: 'start',
                        duration: 0,
                    });
                    popover.show();
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1286px, 1600px, 0px)',
            );
        });

        it('works with position option (data-ui-position)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const popoverToggle = $.findOne('#popoverToggle');
                    $.setDataset(popoverToggle, { uiPosition: 'start' });
                    const popover = UI.Popover.init(popoverToggle, {
                        duration: 0,
                    });
                    popover.show();
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1286px, 1600px, 0px)',
            );
        });

        it('works with position option (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('#popoverToggle').popover({
                        position: 'start',
                        duration: 0,
                    }).show();
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1286px, 1600px, 0px)',
            );
        });

        it('works with auto placement (top)', async function() {
            await exec((_) => {
                $.setScrollY(document, 1130);
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'auto',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/placement-auto/top.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1126px, 1520px, 0px)',
            );
        });

        it('works with auto placement (right)', async function() {
            await exec((_) => {
                $.setScrollX(document, 1050);
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'auto',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/placement-auto/right.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1286px, 1578px, 0px)',
            );
        });

        it('works with auto placement (bottom)', async function() {
            await exec((_) => {
                $.setScrollY(document, 1500);
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'auto',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/placement-auto/bottom.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1126px, 1637px, 0px)',
            );
        });

        it('works with auto placement (left)', async function() {
            await exec((_) => {
                $.setScrollX(document, 665);
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'auto',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/placement-auto/left.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(967px, 1578px, 0px)',
            );
        });

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
            await screenshot('./screens/popover/placement/top-start.jpeg');

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
            await screenshot('./screens/popover/placement/top-center.jpeg');

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
            await screenshot('./screens/popover/placement/top-end.jpeg');

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
            await screenshot('./screens/popover/placement/right-start.jpeg');

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
            await screenshot('./screens/popover/placement/right-center.jpeg');

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
            await screenshot('./screens/popover/placement/right-end.jpeg');

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
            await screenshot('./screens/popover/placement/bottom-start.jpeg');

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
            await screenshot('./screens/popover/placement/bottom-center.jpeg');

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
            await screenshot('./screens/popover/placement/bottom-end.jpeg');

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
            await screenshot('./screens/popover/placement/left-start.jpeg');

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
            await screenshot('./screens/popover/placement/left-center.jpeg');

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
            await screenshot('./screens/popover/placement/left-end.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(967px, 1557px, 0px)',
            );
        });
    });

    describe('placement flip', function() {
        it('works with top/center and top edge', async function() {
            await exec((_) => {
                $.setScrollY(document, 1520);
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'top',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/placement-flip/top-center-top.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1126px, 1637px, 0px)',
            );
        });

        it('works with right/center and right edge', async function() {
            await exec((_) => {
                $.setScrollX(document, 615);
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'right',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/placement-flip/right-center-right.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(967px, 1578px, 0px)',
            );
        });

        it('works with bottom/center and bottom edge', async function() {
            await exec((_) => {
                $.setScrollY(document, 1130);
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'bottom',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/placement-flip/bottom-center-bottom.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1126px, 1520px, 0px)',
            );
        });

        it('works with left/center and left edge', async function() {
            await exec((_) => {
                $.setScrollX(document, 1100);
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'left',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
                return $.getStyle('.popover', 'transform');
            });
            await screenshot('./screens/popover/placement-flip/left-center-left.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1286px, 1578px, 0px)',
            );
        });
    });

    describe('position clamp', function() {
        it('works with top/start and right edge', async function() {
            await exec((_) => {
                $.setScrollX(document, 490);
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'top',
                    position: 'start',
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/position-clamp/top-start-right.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1045px, 1520px, 0px)',
            );
        });

        it('works with top/center and right edge', async function() {
            await exec((_) => {
                $.setScrollX(document, 490);
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'top',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/position-clamp/top-center-right.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1045px, 1520px, 0px)',
            );
        });

        it('works with top/center and left edge', async function() {
            await exec((_) => {
                $.setScrollX(document, 1200);
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'top',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
                return $.getStyle('.popover', 'transform');
            });
            await screenshot('./screens/popover/position-clamp/top-center-left.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1200px, 1520px, 0px)',
            );
        });

        it('works with top/end and left edge', async function() {
            await exec((_) => {
                $.setScrollX(document, 1200);
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'top',
                    position: 'end',
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/position-clamp/top-end-left.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1200px, 1520px, 0px)',
            );
        });

        it('works with right/start and bottom edge', async function() {
            await exec((_) => {
                $.setScrollY(document, 1048);
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'right',
                    position: 'start',
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/position-clamp/right-start-bottom.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1286px, 1556px, 0px)',
            );
        });

        it('works with right/center and top edge', async function() {
            await exec((_) => {
                $.setScrollY(document, 1600);
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'right',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/position-clamp/right-center-top.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1286px, 1600px, 0px)',
            );
        });

        it('works with right/center and bottom edge', async function() {
            await exec((_) => {
                $.setScrollY(document, 1048);
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'right',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/position-clamp/right-center-bottom.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1286px, 1556px, 0px)',
            );
        });

        it('works with right/end and top edge', async function() {
            await exec((_) => {
                $.setScrollY(document, 1600);
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'right',
                    position: 'end',
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/position-clamp/right-end-top.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1286px, 1600px, 0px)',
            );
        });

        it('works with bottom/start and right edge', async function() {
            await exec((_) => {
                $.setScrollX(document, 490);
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'bottom',
                    position: 'start',
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/position-clamp/bottom-start-right.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1045px, 1637px, 0px)',
            );
        });

        it('works with bottom/center and right edge', async function() {
            await exec((_) => {
                $.setScrollX(document, 490);
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'bottom',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/position-clamp/bottom-center-right.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1045px, 1637px, 0px)',
            );
        });

        it('works with bottom/center and left edge', async function() {
            await exec((_) => {
                $.setScrollX(document, 1200);
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'bottom',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/position-clamp/bottom-center-left.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1200px, 1637px, 0px)',
            );
        });

        it('works with bottom/end and left edge', async function() {
            await exec((_) => {
                $.setScrollX(document, 1200);
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'bottom',
                    position: 'end',
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/position-clamp/bottom-end-left.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1200px, 1637px, 0px)',
            );
        });

        it('works with left/start and bottom edge', async function() {
            await exec((_) => {
                $.setScrollY(document, 1048);
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'left',
                    position: 'start',
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/position-clamp/left-start-bottom.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(967px, 1556px, 0px)',
            );
        });

        it('works with left/center and top edge', async function() {
            await exec((_) => {
                $.setScrollY(document, 1600);
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'left',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/position-clamp/left-center-top.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(967px, 1600px, 0px)',
            );
        });

        it('works with left/center and bottom edge', async function() {
            await exec((_) => {
                $.setScrollY(document, 1048);
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'left',
                    position: 'center',
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/position-clamp/left-center-bottom.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(967px, 1556px, 0px)',
            );
        });

        it('works with left/end and top edge', async function() {
            await exec((_) => {
                $.setScrollY(document, 1600);
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'left',
                    position: 'end',
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/position-clamp/left-end-top.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(967px, 1600px, 0px)',
            );
        });
    });

    describe('fixed option', function() {
        it('works with fixed option', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $.setScrollY(document, 1520);
                    const popoverToggle = $.findOne('#popoverToggle');
                    const popover = UI.Popover.init(popoverToggle, {
                        placement: 'top',
                        fixed: true,
                        duration: 0,
                    });
                    popover.show();
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1126px, 1520px, 0px)',
            );
        });

        it('works with fixed option (data-ui-fixed)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $.setScrollY(document, 1520);
                    const popoverToggle = $.findOne('#popoverToggle');
                    $.setDataset(popoverToggle, { uiFixed: true });
                    const popover = UI.Popover.init(popoverToggle, {
                        placement: 'top',
                        duration: 0,
                    });
                    popover.show();
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1126px, 1520px, 0px)',
            );
        });

        it('works with fixed option (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $.setScrollY(document, 1520);
                    $('#popoverToggle').popover({
                        placement: 'top',
                        fixed: true,
                        duration: 0,
                    }).show();
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1126px, 1520px, 0px)',
            );
        });

        it('works with top edge', async function() {
            await exec((_) => {
                $.setScrollY(document, 1520);
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'top',
                    position: 'center',
                    fixed: true,
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/fixed/top.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1126px, 1520px, 0px)',
            );
        });

        it('works with right edge', async function() {
            await exec((_) => {
                $.setScrollX(document, 615);
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'right',
                    position: 'center',
                    fixed: true,
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/fixed/right.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1286px, 1578px, 0px)',
            );
        });

        it('works with bottom edge', async function() {
            await exec((_) => {
                $.setScrollY(document, 1130);
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'bottom',
                    position: 'center',
                    fixed: true,
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/fixed/bottom.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1126px, 1637px, 0px)',
            );
        });

        it('works with left edge', async function() {
            await exec((_) => {
                $.setScrollX(document, 1100);
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'left',
                    position: 'center',
                    fixed: true,
                    duration: 0,
                });
                popover.show();
                return $.getStyle('.popover', 'transform');
            });
            await screenshot('./screens/popover/fixed/left.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(967px, 1578px, 0px)',
            );
        });
    });

    describe('spacing option', function() {
        it('works with spacing option', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const popoverToggle = $.findOne('#popoverToggle');
                    const popover = UI.Popover.init(popoverToggle, {
                        spacing: 50,
                        duration: 0,
                    });
                    popover.show();
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1333px, 1578px, 0px)',
            );
        });

        it('works with spacing option (data-ui-spacing)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const popoverToggle = $.findOne('#popoverToggle');
                    $.setDataset(popoverToggle, { uiSpacing: 50 });
                    const popover = UI.Popover.init(popoverToggle, {
                        duration: 0,
                    });
                    popover.show();
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1333px, 1578px, 0px)',
            );
        });

        it('works with spacing option (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('#popoverToggle').popover({
                        spacing: 50,
                        duration: 0,
                    }).show();
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1333px, 1578px, 0px)',
            );
        });

        it('works with spacing and top', async function() {
            await exec((_) => {
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'top',
                    position: 'center',
                    spacing: 50,
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/spacing/top.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1126px, 1473px, 0px)',
            );
        });

        it('works with spacing and right', async function() {
            await exec((_) => {
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'right',
                    position: 'center',
                    spacing: 50,
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/spacing/right.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1333px, 1578px, 0px)',
            );
        });

        it('works with spacing and bottom', async function() {
            await exec((_) => {
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'bottom',
                    position: 'center',
                    spacing: 50,
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/spacing/bottom.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1126px, 1684px, 0px)',
            );
        });

        it('works with spacing and left', async function() {
            await exec((_) => {
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'left',
                    position: 'center',
                    spacing: 50,
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/spacing/left.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(920px, 1578px, 0px)',
            );
        });
    });

    describe('minContact option', function() {
        it('works with minContact option', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $.setScrollX(document, 475);
                    const popoverToggle = $.findOne('#popoverToggle');
                    const popover = UI.Popover.init(popoverToggle, {
                        placement: 'top',
                        minContact: 10,
                        duration: 0,
                    });
                    popover.show();
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1030px, 1520px, 0px)',
            );
        });

        it('works with minContact option (data-ui-min-contact)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $.setScrollX(document, 475);
                    const popoverToggle = $.findOne('#popoverToggle');
                    $.setDataset(popoverToggle, { uiMinContact: 10 });
                    const popover = UI.Popover.init(popoverToggle, {
                        placement: 'top',
                        duration: 0,
                    });
                    popover.show();
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1030px, 1520px, 0px)',
            );
        });

        it('works with minContact option', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $.setScrollX(document, 475);
                    $('#popoverToggle').popover({
                        placement: 'top',
                        minContact: 10,
                        duration: 0,
                    }).show();
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1030px, 1520px, 0px)',
            );
        });

        it('works with minContact and top edge', async function() {
            await exec((_) => {
                $.setScrollY(document, 1620);
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'right',
                    position: 'center',
                    minContact: 10,
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/min-contact/top.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1286px, 1620px, 0px)',
            );
        });

        it('works with minContact and right edge', async function() {
            await exec((_) => {
                $.setScrollX(document, 475);
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'top',
                    position: 'center',
                    minContact: 10,
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/min-contact/right.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1030px, 1520px, 0px)',
            );
        });

        it('works with minContact and bottom edge', async function() {
            await exec((_) => {
                $.setScrollY(document, 1030);
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'left',
                    position: 'center',
                    minContact: 10,
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/min-contact/bottom.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(967px, 1538px, 0px)',
            );
        });

        it('works with minContact and left edge', async function() {
            await exec((_) => {
                $.setScrollX(document, 1220);
                const popoverToggle = $.findOne('#popoverToggle');
                const popover = UI.Popover.init(popoverToggle, {
                    placement: 'bottom',
                    position: 'center',
                    minContact: 10,
                    duration: 0,
                });
                popover.show();
            });
            await screenshot('./screens/popover/min-contact/left.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.popover', 'transform');
                }),
                'translate3d(1220px, 1637px, 0px)',
            );
        });
    });
});
