import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'mocha';
import { waitFor } from './../helpers.js';
import { exec } from './../setup.js';

describe('Modal FocusTrap', function() {
    afterEach(async function() {
        await exec((_) => {
            $.removeClass(document.body, 'modal-open');
            $.removeAttribute(document.body, 'style');
        });
    });

    beforeEach(async function() {
        await exec((_) => {
            $.setHTML(
                document.body,
                '<button class="btn btn-secondary" id="modalToggle" data-ui-toggle="modal" data-ui-target="#modal" type="button"></button>' +
                '<div class="modal" id="modal">' +
                '<div class="modal-dialog" id="modalDialog">' +
                '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                '<button id="button2" type="button"></button>' +
                '</div>' +
                '</div>',
            );
        });
    });

    describe('focus trap', function() {
        it('prevents focus outside the modal', async function() {
            await exec((_) => {
                const modal = $.findOne('#modal');
                UI.Modal.init(modal).show();
            }).then(waitFor(300)).then(async (_) => {
                await exec((_) => {
                    const modalToggle = $.findOne('#modalToggle');
                    $.focus(modalToggle);
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
                const modal = $.findOne('#modal');
                UI.Modal.init(modal).show();
            }).then(waitFor(300)).then(async (_) => {
                await exec((_) => {
                    const event = new KeyboardEvent('keydown', {
                        key: 'Tab',
                        shiftKey: true,
                    });
                    document.dispatchEvent(event);

                    const modalToggle = $.findOne('#modalToggle');
                    $.focus(modalToggle);
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

        it('allows focus outside the modal with no focus', async function() {
            await exec((_) => {
                const modal = $.findOne('#modal');
                UI.Modal.init(modal, { focus: false }).show();
            }).then(waitFor(300)).then(async (_) => {
                await exec((_) => {
                    const modalToggle = $.findOne('#modalToggle');
                    $.focus(modalToggle);
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getAttribute(document.activeElement, 'id')),
                    'modalToggle',
                );
            });
        });
    });
});
