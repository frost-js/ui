import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'mocha';
import { exec, screenshot } from './../setup.js';

describe('popper dropdown (overflow)', function() {
    beforeEach(async function() {
        await exec((_) => {
            $.setHTML(
                document.body,
                '<div id="scroll" style="position: relative; overflow: auto; width: 100vw; height: 100vh;">' +
                '<div class="text-center" style="padding: 1600px 1200px;">' +
                '<div class="dropdown">' +
                '<button class="btn btn-secondary dropdown-toggle" id="dropdownToggle" type="button">Dropdown</button>' +
                '<div class="dropdown-menu">' +
                '<button class="dropdown-item" type="button">Action</button>' +
                '<button class="dropdown-item" type="button">Action</button>' +
                '<button class="dropdown-item" type="button">Action</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>',
            );
            $.setScroll('#scroll', 900, 1300);
        });
    });

    describe('placement/position options', function() {
        it('works with auto placement (top)', async function() {
            await exec((_) => {
                $.setScrollY('#scroll', 1115);
                const dropdownToggle = $.findOne('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'auto',
                    position: 'center',
                    duration: 0,
                });
                dropdown.show();
            });
            await screenshot('./screens/dropdown/overflow-placement-auto/top.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1178px, 1483px, 0px)',
            );
        });

        it('works with auto placement (right)', async function() {
            await exec((_) => {
                $.setScrollX('#scroll', 1050);
                const dropdownToggle = $.findOne('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'auto',
                    position: 'center',
                    duration: 0,
                });
                dropdown.show();
            });
            await screenshot('./screens/dropdown/overflow-placement-auto/right.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1315px, 1560px, 0px)',
            );
        });

        it('works with auto placement (bottom)', async function() {
            await exec((_) => {
                $.setScrollY('#scroll', 1500);
                const dropdownToggle = $.findOne('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'auto',
                    position: 'center',
                    duration: 0,
                });
                dropdown.show();
            });
            await screenshot('./screens/dropdown/overflow-placement-auto/bottom.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1178px, 1637px, 0px)',
            );
        });

        it('works with auto placement (left)', async function() {
            await exec((_) => {
                $.setScrollX('#scroll', 665);
                const dropdownToggle = $.findOne('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'auto',
                    position: 'center',
                    duration: 0,
                });
                dropdown.show();
            });
            await screenshot('./screens/dropdown/overflow-placement-auto/left.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1037px, 1560px, 0px)',
            );
        });

        it('works with top/start', async function() {
            await exec((_) => {
                const dropdownToggle = $.findOne('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'top',
                    position: 'start',
                    duration: 0,
                });
                dropdown.show();
            });
            await screenshot('./screens/dropdown/overflow-placement/top-start.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1200px, 1483px, 0px)',
            );
        });

        it('works with top/center', async function() {
            await exec((_) => {
                const dropdownToggle = $.findOne('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'top',
                    position: 'center',
                    duration: 0,
                });
                dropdown.show();
            });
            await screenshot('./screens/dropdown/overflow-placement/top-center.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1178px, 1483px, 0px)',
            );
        });

        it('works with top/end', async function() {
            await exec((_) => {
                const dropdownToggle = $.findOne('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'top',
                    position: 'end',
                    duration: 0,
                });
                dropdown.show();
            });
            await screenshot('./screens/dropdown/overflow-placement/top-end.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1156px, 1483px, 0px)',
            );
        });

        it('works with right/start', async function() {
            await exec((_) => {
                const dropdownToggle = $.findOne('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'right',
                    position: 'start',
                    duration: 0,
                });
                dropdown.show();
            });
            await screenshot('./screens/dropdown/overflow-placement/right-start.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1315px, 1600px, 0px)',
            );
        });

        it('works with right/center', async function() {
            await exec((_) => {
                const dropdownToggle = $.findOne('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'right',
                    position: 'center',
                    duration: 0,
                });
                dropdown.show();
            });
            await screenshot('./screens/dropdown/overflow-placement/right-center.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1315px, 1560px, 0px)',
            );
        });

        it('works with right/end', async function() {
            await exec((_) => {
                const dropdownToggle = $.findOne('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'right',
                    position: 'end',
                    duration: 0,
                });
                dropdown.show();
            });
            await screenshot('./screens/dropdown/overflow-placement/right-end.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1315px, 1520px, 0px)',
            );
        });

        it('works with bottom/start', async function() {
            await exec((_) => {
                const dropdownToggle = $.findOne('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'bottom',
                    position: 'start',
                    duration: 0,
                });
                dropdown.show();
            });
            await screenshot('./screens/dropdown/overflow-placement/bottom-start.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1200px, 1637px, 0px)',
            );
        });

        it('works with bottom/center', async function() {
            await exec((_) => {
                const dropdownToggle = $.findOne('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'bottom',
                    position: 'center',
                    duration: 0,
                });
                dropdown.show();
            });
            await screenshot('./screens/dropdown/overflow-placement/bottom-center.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1178px, 1637px, 0px)',
            );
        });

        it('works with bottom/end', async function() {
            await exec((_) => {
                const dropdownToggle = $.findOne('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'bottom',
                    position: 'end',
                    duration: 0,
                });
                dropdown.show();
            });
            await screenshot('./screens/dropdown/overflow-placement/bottom-end.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1156px, 1637px, 0px)',
            );
        });

        it('works with left/start', async function() {
            await exec((_) => {
                const dropdownToggle = $.findOne('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'left',
                    position: 'start',
                    duration: 0,
                });
                dropdown.show();
            });
            await screenshot('./screens/dropdown/overflow-placement/left-start.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1037px, 1600px, 0px)',
            );
        });

        it('works with left/center', async function() {
            await exec((_) => {
                const dropdownToggle = $.findOne('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'left',
                    position: 'center',
                    duration: 0,
                });
                dropdown.show();
            });
            await screenshot('./screens/dropdown/overflow-placement/left-center.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1037px, 1560px, 0px)',
            );
        });

        it('works with left/end', async function() {
            await exec((_) => {
                const dropdownToggle = $.findOne('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'left',
                    position: 'end',
                    duration: 0,
                });
                dropdown.show();
            });
            await screenshot('./screens/dropdown/overflow-placement/left-end.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1037px, 1520px, 0px)',
            );
        });
    });

    describe('placement flip', function() {
        it('works with top/center and top edge', async function() {
            await exec((_) => {
                $.setScrollY('#scroll', 1500);
                const dropdownToggle = $.findOne('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'top',
                    position: 'center',
                    duration: 0,
                });
                dropdown.show();
            });
            await screenshot('./screens/dropdown/overflow-placement-flip/top-center-top.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1178px, 1637px, 0px)',
            );
        });

        it('works with right/center and right edge', async function() {
            await exec((_) => {
                $.setScrollX('#scroll', 615);
                const dropdownToggle = $.findOne('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'right',
                    position: 'center',
                    duration: 0,
                });
                dropdown.show();
            });
            await screenshot('./screens/dropdown/overflow-placement-flip/right-center-right.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1037px, 1560px, 0px)',
            );
        });

        it('works with bottom/center and bottom edge', async function() {
            await exec((_) => {
                $.setScrollY('#scroll', 1150);
                const dropdownToggle = $.findOne('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'bottom',
                    position: 'center',
                    duration: 0,
                });
                dropdown.show();
            });
            await screenshot('./screens/dropdown/overflow-placement-flip/bottom-center-bottom.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1178px, 1483px, 0px)',
            );
        });

        it('works with left/center and left edge', async function() {
            await exec((_) => {
                $.setScrollX('#scroll', 1100);
                const dropdownToggle = $.findOne('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'left',
                    position: 'center',
                    duration: 0,
                });
                dropdown.show();
                return $.getStyle('.dropdown-menu', 'transform');
            });
            await screenshot('./screens/dropdown/overflow-placement-flip/left-center-left.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1315px, 1560px, 0px)',
            );
        });
    });

    describe('position clamp', function() {
        it('works with top/start and right edge', async function() {
            await exec((_) => {
                $.setScrollX('#scroll', 520);
                const dropdownToggle = $.findOne('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'top',
                    position: 'start',
                    duration: 0,
                });
                dropdown.show();
            });
            await screenshot('./screens/dropdown/overflow-position-clamp/top-start-right.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1145px, 1483px, 0px)',
            );
        });

        it('works with top/center and right edge', async function() {
            await exec((_) => {
                $.setScrollX('#scroll', 520);
                const dropdownToggle = $.findOne('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'top',
                    position: 'center',
                    duration: 0,
                });
                dropdown.show();
            });
            await screenshot('./screens/dropdown/overflow-position-clamp/top-center-right.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1145px, 1483px, 0px)',
            );
        });

        it('works with top/center and left edge', async function() {
            await exec((_) => {
                $.setScrollX('#scroll', 1200);
                const dropdownToggle = $.findOne('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'top',
                    position: 'center',
                    duration: 0,
                });
                dropdown.show();
                return $.getStyle('.dropdown-menu', 'transform');
            });
            await screenshot('./screens/dropdown/overflow-position-clamp/top-center-left.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1200px, 1483px, 0px)',
            );
        });

        it('works with top/end and left edge', async function() {
            await exec((_) => {
                $.setScrollX('#scroll', 1200);
                const dropdownToggle = $.findOne('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'top',
                    position: 'end',
                    duration: 0,
                });
                dropdown.show();
            });
            await screenshot('./screens/dropdown/overflow-position-clamp/top-end-left.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1200px, 1483px, 0px)',
            );
        });

        it('works with right/start and bottom edge', async function() {
            await exec((_) => {
                $.setScrollY('#scroll', 1048);
                const dropdownToggle = $.findOne('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'right',
                    position: 'start',
                    duration: 0,
                });
                dropdown.show();
            });
            await screenshot('./screens/dropdown/overflow-position-clamp/right-start-bottom.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1315px, 1519px, 0px)',
            );
        });

        it('works with right/center and top edge', async function() {
            await exec((_) => {
                $.setScrollY('#scroll', 1600);
                const dropdownToggle = $.findOne('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'right',
                    position: 'center',
                    duration: 0,
                });
                dropdown.show();
            });
            await screenshot('./screens/dropdown/overflow-position-clamp/right-center-top.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1315px, 1600px, 0px)',
            );
        });

        it('works with right/center and bottom edge', async function() {
            await exec((_) => {
                $.setScrollY('#scroll', 1048);
                const dropdownToggle = $.findOne('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'right',
                    position: 'center',
                    duration: 0,
                });
                dropdown.show();
            });
            await screenshot('./screens/dropdown/overflow-position-clamp/right-center-bottom.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1315px, 1519px, 0px)',
            );
        });

        it('works with right/end and top edge', async function() {
            await exec((_) => {
                $.setScrollY('#scroll', 1600);
                const dropdownToggle = $.findOne('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'right',
                    position: 'end',
                    duration: 0,
                });
                dropdown.show();
            });
            await screenshot('./screens/dropdown/overflow-position-clamp/right-end-top.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1315px, 1600px, 0px)',
            );
        });

        it('works with bottom/start and right edge', async function() {
            await exec((_) => {
                $.setScrollX('#scroll', 520);
                const dropdownToggle = $.findOne('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'bottom',
                    position: 'start',
                    duration: 0,
                });
                dropdown.show();
            });
            await screenshot('./screens/dropdown/overflow-position-clamp/bottom-start-right.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1145px, 1637px, 0px)',
            );
        });

        it('works with bottom/center and right edge', async function() {
            await exec((_) => {
                $.setScrollX('#scroll', 520);
                const dropdownToggle = $.findOne('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'bottom',
                    position: 'center',
                    duration: 0,
                });
                dropdown.show();
            });
            await screenshot('./screens/dropdown/overflow-position-clamp/bottom-center-right.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1145px, 1637px, 0px)',
            );
        });

        it('works with bottom/center and left edge', async function() {
            await exec((_) => {
                $.setScrollX('#scroll', 1200);
                const dropdownToggle = $.findOne('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'bottom',
                    position: 'center',
                    duration: 0,
                });
                dropdown.show();
            });
            await screenshot('./screens/dropdown/overflow-position-clamp/bottom-center-left.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1200px, 1637px, 0px)',
            );
        });

        it('works with bottom/end and left edge', async function() {
            await exec((_) => {
                $.setScrollX('#scroll', 1200);
                const dropdownToggle = $.findOne('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'bottom',
                    position: 'end',
                    duration: 0,
                });
                dropdown.show();
            });
            await screenshot('./screens/dropdown/overflow-position-clamp/bottom-end-left.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1200px, 1637px, 0px)',
            );
        });

        it('works with left/start and bottom edge', async function() {
            await exec((_) => {
                $.setScrollY('#scroll', 1048);
                const dropdownToggle = $.findOne('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'left',
                    position: 'start',
                    duration: 0,
                });
                dropdown.show();
            });
            await screenshot('./screens/dropdown/overflow-position-clamp/left-start-bottom.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1037px, 1519px, 0px)',
            );
        });

        it('works with left/center and top edge', async function() {
            await exec((_) => {
                $.setScrollY('#scroll', 1600);
                const dropdownToggle = $.findOne('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'left',
                    position: 'center',
                    duration: 0,
                });
                dropdown.show();
            });
            await screenshot('./screens/dropdown/overflow-position-clamp/left-center-top.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1037px, 1600px, 0px)',
            );
        });

        it('works with left/center and bottom edge', async function() {
            await exec((_) => {
                $.setScrollY('#scroll', 1048);
                const dropdownToggle = $.findOne('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'left',
                    position: 'center',
                    duration: 0,
                });
                dropdown.show();
            });
            await screenshot('./screens/dropdown/overflow-position-clamp/left-center-bottom.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1037px, 1519px, 0px)',
            );
        });

        it('works with left/end and top edge', async function() {
            await exec((_) => {
                $.setScrollY('#scroll', 1600);
                const dropdownToggle = $.findOne('#dropdownToggle');
                const dropdown = UI.Dropdown.init(dropdownToggle, {
                    placement: 'left',
                    position: 'end',
                    duration: 0,
                });
                dropdown.show();
            });
            await screenshot('./screens/dropdown/overflow-position-clamp/left-end-top.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1037px, 1600px, 0px)',
            );
        });
    });
});
