import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'mocha';
import { exec } from './../setup.js';

describe('Text Expand', function() {
    beforeEach(async function() {
        await exec((_) => {
            $.setHTML(
                document.body,
                '<textarea class="input-filled text-expand" id="input"></textarea>',
            );
        });
    });

    describe('user events', function() {
        it('expands on change', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $.setValue('#input', new Array(5).fill('').join('\r\n'));
                    $.triggerEvent('#input', 'change');
                    return $.height('#input');
                }),
                136,
            );
        });

        it('contracts on change', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $.setValue('#input', new Array(5).fill('').join('\r\n'));
                    $.triggerEvent('#input', 'change');
                    $.setValue('#input', '');
                    $.triggerEvent('#input', 'change');
                    return $.height('#input');
                }),
                64,
            );
        });

        it('expands on user input', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $.setValue('#input', new Array(5).fill('').join('\r\n'));
                    $.triggerEvent('#input', 'input');
                    return $.height('#input');
                }),
                136,
            );
        });

        it('contracts on user input', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $.setValue('#input', new Array(5).fill('').join('\r\n'));
                    $.triggerEvent('#input', 'input');
                    $.setValue('#input', '');
                    $.triggerEvent('#input', 'input');
                    return $.height('#input');
                }),
                64,
            );
        });
    });
});
