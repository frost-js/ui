import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'mocha';
import { waitFor } from './../helpers.js';
import { exec } from './../setup.js';

describe('Offcanvas FocusTrap', function() {
    afterEach(async function() {
        await exec((_) => {
            $.removeClass(document.body, 'offcanvas-backdrop');
            $.removeAttribute(document.body, 'style');
        });
    });

    beforeEach(async function() {
        await exec((_) => {
            $.setHTML(
                document.body,
                '<button class="btn btn-secondary" id="offcanvasToggle" data-ui-toggle="offcanvas" data-ui-target="#offcanvas" type="button"></button>' +
                '<div class="offcanvas offcanvas-start" id="offcanvas">' +
                '<button class="btn-close" id="button1" data-ui-dismiss="offcanvas" type="button"></button>' +
                '<button id="button2" type="button"></button>' +
                '</div>',
            );
        });
    });

    describe('focus trap', function() {
        it('prevents focus outside the offcanvas', async function() {
            await exec((_) => {
                const offcanvas = $.findOne('#offcanvas');
                UI.Offcanvas.init(offcanvas).show();
            }).then(waitFor(300)).then(async (_) => {
                await exec((_) => {
                    const offcanvasToggle = $.findOne('#offcanvasToggle');
                    $.focus(offcanvasToggle);
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getAttribute(document.activeElement, 'id')),
                    'button1',
                );
            });
        });

        it('reverses focus if shift/tab key is pressed', async function() {
            await exec((_) => {
                const offcanvas = $.findOne('#offcanvas');
                UI.Offcanvas.init(offcanvas).show();
            }).then(waitFor(300)).then(async (_) => {
                await exec((_) => {
                    const event = new KeyboardEvent('keydown', {
                        key: 'Tab',
                        shiftKey: true,
                    });
                    document.dispatchEvent(event);

                    const offcanvasToggle = $.findOne('#offcanvasToggle');
                    $.focus(offcanvasToggle);
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getAttribute(document.activeElement, 'id')),
                    'button2',
                );
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const event = new KeyboardEvent('keydown', {
                        key: 'Tab',
                    });
                    document.dispatchEvent(event);
                });
            });
        });

        it('allows focus outside the offcanvas with scroll and no backdrop', async function() {
            await exec((_) => {
                const offcanvas = $.findOne('#offcanvas');
                UI.Offcanvas.init(offcanvas, { scroll: true, backdrop: false }).show();
            }).then(waitFor(300)).then(async (_) => {
                await exec((_) => {
                    const offcanvasToggle = $.findOne('#offcanvasToggle');
                    $.focus(offcanvasToggle);
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getAttribute(document.activeElement, 'id')),
                    'offcanvasToggle',
                );
            });
        });
    });
});
