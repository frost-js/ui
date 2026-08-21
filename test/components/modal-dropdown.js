import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'mocha';
import { waitFor } from './../helpers.js';
import { exec } from './../setup.js';

describe('Modal/Dropdown', function() {
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
                '<button class="btn-close" id="button" data-ui-dismiss="modal" type="button"></button>' +
                '<div>' +
                '<button class="btn btn-secondary" id="dropdownToggle" data-ui-toggle="dropdown" type="button"></button>' +
                '<div class="dropdown-menu" id="dropdown">' +
                '<button class="dropdown-item" id="dropdownItem1"></button>' +
                '<button class="dropdown-item" id="dropdownItem2"></button>' +
                '<button class="dropdown-item" id="dropdownItem3"></button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>',
            );
        });
    });

    describe('user events', function() {
        it('hides the modal and dropdown on document click when dropdown is open', async function() {
            await exec((_) => {
                const modal = $.findOne('#modal');
                UI.Modal.init(modal).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const dropdownToggle = $.findOne('#dropdownToggle');
                    UI.Dropdown.init(dropdownToggle).show();
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.click(document.body);
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#dropdown') && $.hasAnimation('#modalDialog') && $.hasAnimation('.modal-backdrop')),
                    true,
                );
            });
        });

        it('does not hide the modal on escape when dropdown is open', async function() {
            await exec((_) => {
                const modal = $.findOne('#modal');
                UI.Modal.init(modal).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const dropdownToggle = $.findOne('#dropdownToggle');
                    UI.Dropdown.init(dropdownToggle).show();
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown');
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
                    await exec((_) => $.hasAnimation('#dropdown')),
                    true,
                );
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#modalDialog')),
                    false,
                );
            });
        });
    });
});
