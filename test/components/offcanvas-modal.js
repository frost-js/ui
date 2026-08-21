import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'mocha';
import { waitFor } from './../helpers.js';
import { exec } from './../setup.js';

describe('Offcanvas/Modal', function() {
    afterEach(async function() {
        await exec((_) => {
            $.removeClass(document.body, 'offcanvas-backdrop');
            $.removeClass(document.body, 'modal-open');
            $.removeAttribute(document.body, 'style');
        });
    });

    beforeEach(async function() {
        await exec((_) => {
            $.setHTML(
                document.body,
                '<button class="btn btn-secondary" id="offcanvasToggle" data-ui-toggle="offcanvas" data-ui-target="#offcanvas" type="button"></button>' +
                '<div class="offcanvas offcanvas-start" id="offcanvas">' +
                '<button class="btn-close" id="button" data-ui-dismiss="offcanvas" type="button"></button>' +
                '<button class="btn btn-secondary" id="modalToggle" data-ui-toggle="modal" data-ui-target="#modal" type="button"></button>' +
                '</div>' +
                '<div class="modal" id="modal">' +
                '<div class="modal-dialog" id="modalDialog">' +
                '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                '</div>' +
                '</div>',
            );
        });
    });

    describe('user events', function() {
        it('does not hide the offcanvas on document click when modal is open', async function() {
            await exec((_) => {
                const offcanvas = $.findOne('#offcanvas');
                UI.Offcanvas.init(offcanvas).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#offcanvas');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const modal = $.findOne('#modal');
                    UI.Modal.init(modal).show();
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.click(document.body);
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#modalDialog') && $.hasAnimation('.modal-backdrop')),
                    true,
                );
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#offcanvas')),
                    false,
                );
            });
        });

        it('does not hide the offcanvas on escape when modal is open', async function() {
            await exec((_) => {
                const offcanvas = $.findOne('#offcanvas');
                UI.Offcanvas.init(offcanvas).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#offcanvas');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const modal = $.findOne('#modal');
                    UI.Modal.init(modal).show();
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const event = new KeyboardEvent('keydown', {
                        bubbles: true,
                        code: 'Escape',
                    });
                    document.body.dispatchEvent(event);
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#modalDialog') && $.hasAnimation('.modal-backdrop')),
                    true,
                );
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#offcanvas')),
                    false,
                );
            });
        });
    });
});
