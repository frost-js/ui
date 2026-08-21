import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'mocha';
import { exec } from './../setup.js';

describe('Button', function() {
    beforeEach(async function() {
        await exec((_) => {
            $.setHTML(
                document.body,
                '<button class="btn btn-secondary" id="button1" data-ui-toggle="button" type="button"></button>' +
                '<button class="btn btn-secondary" id="button2" data-ui-toggle="button" type="button"></button>',
            );
        });
    });

    describe('#init', function() {
        it('creates a button', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const button1 = $.findOne('#button1');
                    return UI.Button.init(button1) instanceof UI.Button;
                }),
                true,
            );
        });

        it('creates a button (data-toggle)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $.click('#button1');
                    return $.getData('#button1', 'button') instanceof UI.Button;
                }),
                true,
            );
        });

        it('creates a button (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('#button1').button();
                    return $.getData('#button1', 'button') instanceof UI.Button;
                }),
                true,
            );
        });

        it('creates multiple buttons (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('button').button();
                    return $.find('button').every((node) =>
                        $.getData(node, 'button') instanceof UI.Button,
                    );
                }),
                true,
            );
        });

        it('returns the button (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    return $('#button1').button() instanceof UI.Button;
                }),
                true,
            );
        });
    });

    describe('#dispose', function() {
        it('removes the button', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const button1 = $.findOne('#button1');
                    UI.Button.init(button1).dispose();
                    return $.hasData(button1, 'button');
                }),
                false,
            );
        });

        it('removes the button (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('#button1').button('dispose');
                    return $.hasData('#button1', 'button');
                }),
                false,
            );
        });

        it('removes multiple buttons (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('button').button('dispose');
                    return $.find('button').some((node) =>
                        $.hasData(node, 'button'),
                    );
                }),
                false,
            );
        });

        it('clears button memory', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const button1 = $.findOne('#button1');
                    const button = UI.Button.init(button1);
                    button.dispose();

                    for (const key in button) {
                        if ($._isObject(button[key]) && !$._isFunction(button[key])) {
                            return false;
                        }
                    }

                    return true;
                }),
                true,
            );
        });

        it('clears button memory when node is removed', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const button1 = $.findOne('#button1');
                    const button = UI.Button.init(button1);
                    $.remove(button1);

                    for (const key in button) {
                        if ($._isObject(button[key]) && !$._isFunction(button[key])) {
                            return false;
                        }
                    }

                    return true;
                }),
                true,
            );
        });
    });

    describe('#toggle', function() {
        it('toggles the button', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const button1 = $.findOne('#button1');
                    UI.Button.init(button1).toggle();
                    return $.getHTML(document.body);
                }),
                '<button class="btn btn-secondary active" id="button1" data-ui-toggle="button" type="button" aria-pressed="true"></button>' +
                '<button class="btn btn-secondary" id="button2" data-ui-toggle="button" type="button"></button>',
            );
        });

        it('toggles the button (data-ui-toggle)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const button1 = $.findOne('#button1');
                    $.click(button1);
                    return $.getHTML(document.body);
                }),
                '<button class="btn btn-secondary active" id="button1" data-ui-toggle="button" type="button" aria-pressed="true"></button>' +
                '<button class="btn btn-secondary" id="button2" data-ui-toggle="button" type="button"></button>',
            );
        });

        it('toggles the button (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('#button1').button('toggle');
                    return $.getHTML(document.body);
                }),
                '<button class="btn btn-secondary active" id="button1" data-ui-toggle="button" type="button" aria-pressed="true"></button>' +
                '<button class="btn btn-secondary" id="button2" data-ui-toggle="button" type="button"></button>',
            );
        });

        it('toggles multiple buttons (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('button').button('toggle');
                    return $.getHTML(document.body);
                }),
                '<button class="btn btn-secondary active" id="button1" data-ui-toggle="button" type="button" aria-pressed="true"></button>' +
                '<button class="btn btn-secondary active" id="button2" data-ui-toggle="button" type="button" aria-pressed="true"></button>',
            );
        });

        it('toggles the button off', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const button1 = $.findOne('#button1');
                    const button = UI.Button.init(button1);
                    button.toggle();
                    button.toggle();
                    return $.getHTML(document.body);
                }),
                '<button class="btn btn-secondary" id="button1" data-ui-toggle="button" type="button" aria-pressed="false"></button>' +
                '<button class="btn btn-secondary" id="button2" data-ui-toggle="button" type="button"></button>',
            );
        });
    });
});
