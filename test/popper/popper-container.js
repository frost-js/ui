import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'mocha';
import { exec } from './../setup.js';

describe('popper container', function() {
    beforeEach(async function() {
        await exec((_) => {
            $.setHTML(
                document.body,
                '<div id="container" style="width: 50px; height: 50px;">' +
                '<button class="btn btn-secondary" id="button" type="button">Button</button>' +
                '</div>' +
                '<div class="badge" id="badge">Badge</div>',
            );
        });
    });

    describe('container option', function() {
        it('constrains popper to container', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const badge = $.findOne('#badge');
                    UI.Popper.init(badge, {
                        reference: $.findOne('#button'),
                        container: $.findOne('#container'),
                        minContact: 0,
                    });
                    return $.getStyle(badge, 'transform');
                }),
                'translate3d(-14px, 34px, 0px)',
            );
        });

        it('constrains popper to container (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('#badge').popper({
                        reference: $.findOne('#button'),
                        container: $.findOne('#container'),
                        minContact: 0,
                    });
                    return $.getStyle('#badge', 'transform');
                }),
                'translate3d(-14px, 34px, 0px)',
            );
        });
    });
});
