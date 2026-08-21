import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'mocha';
import { exec, screenshot } from './../setup.js';

describe('popper dropdown (fixed)', function() {
    beforeEach(async function() {
        await exec((_) => {
            $.setHTML(
                document.body,
                '<div class="text-center" style="padding: 1600px 1200px;">' +
                '<div class="dropdown">' +
                '<button class="btn btn-secondary dropdown-toggle" id="dropdownToggle" type="button" style="position: fixed; top: 300px; left: 350px;">Dropdown</button>' +
                '<div class="dropdown-menu">' +
                '<button class="dropdown-item" type="button">Action</button>' +
                '<button class="dropdown-item" type="button">Action</button>' +
                '<button class="dropdown-item" type="button">Action</button>' +
                '</div>' +
                '</div>' +
                '</div>',
            );
            $.setScroll(window, 850, 1300);
        });
    });

    describe('placement/position options', function() {
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
            await screenshot('./screens/dropdown/position-fixed/top-start.jpeg');

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
            await screenshot('./screens/dropdown/position-fixed/top-center.jpeg');

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
            await screenshot('./screens/dropdown/position-fixed/top-end.jpeg');

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
            await screenshot('./screens/dropdown/position-fixed/right-start.jpeg');

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
            await screenshot('./screens/dropdown/position-fixed/right-center.jpeg');

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
            await screenshot('./screens/dropdown/position-fixed/right-end.jpeg');

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
            await screenshot('./screens/dropdown/position-fixed/bottom-start.jpeg');

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
            await screenshot('./screens/dropdown/position-fixed/bottom-center.jpeg');

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
            await screenshot('./screens/dropdown/position-fixed/bottom-end.jpeg');

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
            await screenshot('./screens/dropdown/position-fixed/left-start.jpeg');

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
            await screenshot('./screens/dropdown/position-fixed/left-center.jpeg');

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
            await screenshot('./screens/dropdown/position-fixed/left-end.jpeg');

            assert.strictEqual(
                await exec((_) => {
                    return $.getStyle('.dropdown-menu', 'transform');
                }),
                'translate3d(1037px, 1520px, 0px)',
            );
        });
    });
});
