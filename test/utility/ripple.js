import assert from 'node:assert/strict';
import { waitFor } from './../helpers.js';
import { exec } from './../setup.js';

describe('Ripple', function() {
    beforeEach(async function() {
        await exec((_) => {
            $.setHTML(
                document.body,
                '<button class="btn btn-secondary ripple" id="button"></button>',
            );
        });
    });

    describe('user events', function() {
        it('shows ripple effect on click', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const button = $.findOne('#button');

                    const upEvent = new MouseEvent('click', {
                        button: 0,
                        bubbles: true,
                    });
                    button.dispatchEvent(upEvent);

                    return $.hasAnimation('#button .ripple-effect');
                }),
                true,
            );
        });

        it('removes ripple effect after animation completes', async function() {
            await exec((_) => {
                const button = $.findOne('#button');

                const upEvent = new MouseEvent('click', {
                    button: 0,
                    bubbles: true,
                });
                button.dispatchEvent(upEvent);
            }).then(waitFor(800)).then(async function() {
                assert.strictEqual(
                    await exec((_) => {
                        return $.hasDescendent('#button', '.ripple-effect');
                    }),
                    false,
                );
            });
        });
    });
});
