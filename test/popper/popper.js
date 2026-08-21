import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'mocha';
import { exec } from './../setup.js';

describe('Popper', function() {
    beforeEach(async function() {
        await exec((_) => {
            $.setHTML(
                document.body,
                '<button class="btn btn-secondary" id="button" type="button">Button</button>' +
                '<div class="badge" id="badge">Badge</div>',
            );
        });
    });

    describe('#init', function() {
        it('creates a popper', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const badge = $.findOne('#badge');
                    return UI.Popper.init(badge, {
                        reference: $.findOne('#button'),
                    }) instanceof UI.Popper;
                }),
                true,
            );
        });

        it('creates a popper (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('#badge').popper({
                        reference: $.findOne('#button'),
                    });
                    return $.getData('#badge', 'popper') instanceof UI.Popper;
                }),
                true,
            );
        });

        it('returns the popper (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    return $('#badge').popper({
                        reference: $.findOne('#button'),
                    }) instanceof UI.Popper;
                }),
                true,
            );
        });
    });

    describe('#dispose', function() {
        it('removes the alert', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const badge = $.findOne('#badge');
                    UI.Popper.init(badge, {
                        reference: $.findOne('#button'),
                    }).dispose();
                    return $.hasData(badge, 'popper');
                }),
                false,
            );
        });

        it('removes the alert (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('#badge').popper({
                        reference: $.findOne('#button'),
                    });
                    $('#badge').popper('dispose');
                    return $.hasData('#badge', 'popper');
                }),
                false,
            );
        });

        it('clears alert memory', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const badge = $.findOne('#badge');
                    const popper = UI.Popper.init(badge, {
                        reference: $.findOne('#button'),
                    });
                    popper.dispose();

                    for (const key in popper) {
                        if ($._isObject(popper[key]) && !$._isFunction(popper[key])) {
                            return false;
                        }
                    }

                    return true;
                }),
                true,
            );
        });

        it('clears alert memory when node is removed', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const badge = $.findOne('#badge');
                    const popper = UI.Popper.init(badge, {
                        reference: $.findOne('#button'),
                    });
                    $.remove(badge);

                    for (const key in popper) {
                        if ($._isObject(popper[key]) && !$._isFunction(popper[key])) {
                            return false;
                        }
                    }

                    return true;
                }),
                true,
            );
        });
    });

    describe('#update', function() {
        it('updates the popper', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const badge = $.findOne('#badge');
                    const button = $.findOne('#button');
                    const popper = UI.Popper.init(badge, {
                        reference: button,
                    });

                    $.setStyle(button, { marginTop: '50px' });
                    popper.update();

                    return $.getStyle(badge, 'transform');
                }),
                'translate3d(4px, 84px, 0px)',
            );
        });

        it('updates the popper (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const button = $.findOne('#button');
                    $('#badge').popper({
                        reference: button,
                    });
                    $.setStyle(button, { marginTop: '50px' });
                    $('#badge').popper('update');

                    const badge = $.findOne('#badge');
                    return $.getStyle(badge, 'transform');
                }),
                'translate3d(4px, 84px, 0px)',
            );
        });
    });

    describe('beforeUpdate option', function() {
        it('executes a callback before updating the popper', async function() {
            assert.strictEqual(
                await exec((_) => {
                    let result;
                    const badge = $.findOne('#badge');
                    UI.Popper.init(badge, {
                        reference: $.findOne('#button'),
                        beforeUpdate: (_) => {
                            result = $.getStyle(badge, 'transform');
                        },
                    });
                    return result;
                }),
                '',
            );
        });

        it('executes a callback after updating the popper (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    let result;
                    $('#badge').popper({
                        reference: $.findOne('#button'),
                        beforeUpdate: (_) => {
                            result = $.getStyle('#badge', 'transform');
                        },
                    });
                    return result;
                }),
                '',
            );
        });

        it('uses the node as the first argument', async function() {
            assert.strictEqual(
                await exec((_) => {
                    let result;
                    const badge = $.findOne('#badge');
                    UI.Popper.init(badge, {
                        reference: $.findOne('#button'),
                        beforeUpdate: (node) => {
                            result = $.getAttribute(node, 'id');
                        },
                    });
                    return result;
                }),
                'badge',
            );
        });

        it('uses the reference as the second argument', async function() {
            assert.strictEqual(
                await exec((_) => {
                    let result;
                    const badge = $.findOne('#badge');
                    UI.Popper.init(badge, {
                        reference: $.findOne('#button'),
                        beforeUpdate: (node, referenceNode) => {
                            result = $.getAttribute(referenceNode, 'id');
                        },
                    });
                    return result;
                }),
                'button',
            );
        });

        it('executes every time the popper is updated', async function() {
            assert.strictEqual(
                await exec((_) => {
                    let count = 0;
                    const badge = $.findOne('#badge');
                    const popper = UI.Popper.init(badge, {
                        reference: $.findOne('#button'),
                        beforeUpdate: (_) => count++,
                    });
                    popper.update();
                    popper.update();
                    popper.update();
                    return count;
                }),
                4,
            );
        });
    });

    describe('afterUpdate option', function() {
        it('executes a callback after updating the popper', async function() {
            assert.strictEqual(
                await exec((_) => {
                    let result;
                    const badge = $.findOne('#badge');
                    UI.Popper.init(badge, {
                        reference: $.findOne('#button'),
                        afterUpdate: (_) => {
                            result = $.getStyle(badge, 'transform');
                        },
                    });
                    return result;
                }),
                'translate3d(4px, 34px, 0px)',
            );
        });

        it('executes a callback after updating the popper (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    let result;
                    $('#badge').popper({
                        reference: $.findOne('#button'),
                        afterUpdate: (_) => {
                            result = $.getStyle('#badge', 'transform');
                        },
                    });
                    return result;
                }),
                'translate3d(4px, 34px, 0px)',
            );
        });

        it('uses the node as the first argument', async function() {
            assert.strictEqual(
                await exec((_) => {
                    let result;
                    const badge = $.findOne('#badge');
                    UI.Popper.init(badge, {
                        reference: $.findOne('#button'),
                        afterUpdate: (node) => {
                            result = $.getAttribute(node, 'id');
                        },
                    });
                    return result;
                }),
                'badge',
            );
        });

        it('uses the reference as the second argument', async function() {
            assert.strictEqual(
                await exec((_) => {
                    let result;
                    const badge = $.findOne('#badge');
                    UI.Popper.init(badge, {
                        reference: $.findOne('#button'),
                        afterUpdate: (node, referenceNode) => {
                            result = $.getAttribute(referenceNode, 'id');
                        },
                    });
                    return result;
                }),
                'button',
            );
        });

        it('uses the placement as the third argument', async function() {
            assert.strictEqual(
                await exec((_) => {
                    let result;
                    const badge = $.findOne('#badge');
                    UI.Popper.init(badge, {
                        reference: $.findOne('#button'),
                        afterUpdate: (node, referenceNode, placement) => {
                            result = placement;
                        },
                    });
                    return result;
                }),
                'bottom',
            );
        });

        it('uses the position as the third argument', async function() {
            assert.strictEqual(
                await exec((_) => {
                    let result;
                    const badge = $.findOne('#badge');
                    UI.Popper.init(badge, {
                        reference: $.findOne('#button'),
                        afterUpdate: (node, referenceNode, placement, position) => {
                            result = position;
                        },
                    });
                    return result;
                }),
                'center',
            );
        });

        it('executes every time the popper is updated', async function() {
            assert.strictEqual(
                await exec((_) => {
                    let count = 0;
                    const badge = $.findOne('#badge');
                    const popper = UI.Popper.init(badge, {
                        reference: $.findOne('#button'),
                        afterUpdate: (_) => count++,
                    });
                    popper.update();
                    popper.update();
                    popper.update();
                    return count;
                }),
                4,
            );
        });
    });

    describe('useGpu option', function() {
        it('uses margin offsets when not using gpu', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const badge = $.findOne('#badge');
                    UI.Popper.init(badge, {
                        reference: $.findOne('#button'),
                        useGpu: false,
                    });
                    return $.getStyle('#badge', 'margin');
                }),
                '34px 0px 0px 4px',
            );
        });

        it('uses margin offsets when not using gpu (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('#badge').popper({
                        reference: $.findOne('#button'),
                        useGpu: false,
                    });
                    return $.getStyle('#badge', 'margin');
                }),
                '34px 0px 0px 4px',
            );
        });
    });
});
