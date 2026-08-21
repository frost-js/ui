import assert from 'node:assert/strict';
import { describe, it } from 'mocha';
import { exec } from './../setup.js';

describe('Clipboard', function() {
    describe('copy action', function() {
        it('works with copy action (data-ui-text)', async function() {
            await exec((_) => {
                $.setHTML(
                    document.body,
                    '<button class="btn btn-secondary" id="button" data-ui-toggle="clipboard" data-ui-text="Test 1"></button>',
                );
            }).then(async function() {
                assert.strictEqual(
                    await exec((_) => {
                        $.click('#button');
                        return navigator.clipboard.readText();
                    }),
                    'Test 1',
                );
            });
        });

        it('works with copy action (data-ui-target)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $.setHTML(
                        document.body,
                        '<button class="btn btn-secondary" id="button" data-ui-toggle="clipboard" data-ui-target="#test"></button>' +
                        '<div id="test">Test 2</div>',
                    );
                    $.click('#button');
                    return navigator.clipboard.readText();
                }),
                'Test 2',
            );
        });

        it('works with copy action (input)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $.setHTML(
                        document.body,
                        '<button class="btn btn-secondary" id="button" data-ui-toggle="clipboard" data-ui-target="#test"></button>' +
                        '<input class="input-filled" id="test" value="Test 3" />',
                    );
                    $.click('#button');
                    return navigator.clipboard.readText();
                }),
                'Test 3',
            );
            assert.strictEqual(
                await exec((_) => {
                    return $.getValue('#test');
                }),
                'Test 3',
            );
        });

        it('works with copy action (textarea)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $.setHTML(
                        document.body,
                        '<button class="btn btn-secondary" id="button" data-ui-toggle="clipboard" data-ui-target="#test"></button>' +
                        '<textarea class="input-filled" id="test">Test 4</textarea>',
                    );
                    $.click('#button');
                    return navigator.clipboard.readText();
                }),
                'Test 4',
            );
            assert.strictEqual(
                await exec((_) => {
                    return $.getValue('#test');
                }),
                'Test 4',
            );
        });
    });

    describe('cut action', function() {
        it('works with cut action (input)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $.setHTML(
                        document.body,
                        '<button class="btn btn-secondary" id="button" data-ui-toggle="clipboard" data-ui-action="cut" data-ui-target="#test"></button>' +
                        '<input class="input-filled" id="test" value="Test 5" />',
                    );
                    $.click('#button');
                    return navigator.clipboard.readText();
                }),
                'Test 5',
            );
            assert.strictEqual(
                await exec((_) => {
                    return $.getValue('#test');
                }),
                '',
            );
        });

        it('works with cut action (textarea)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $.setHTML(
                        document.body,
                        '<button class="btn btn-secondary" id="button" data-ui-toggle="clipboard" data-ui-action="cut" data-ui-target="#test"></button>' +
                        '<textarea class="input-filled" id="test">Test 6</textarea>',
                    );
                    $.click('#button');
                    return navigator.clipboard.readText();
                }),
                'Test 6',
            );
            assert.strictEqual(
                await exec((_) => {
                    return $.getValue('#test');
                }),
                '',
            );
        });

        it('does not remove text content for elements', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $.setHTML(
                        document.body,
                        '<button class="btn btn-secondary" id="button" data-ui-toggle="clipboard" data-ui-action="cut" data-ui-target="#test"></button>' +
                        '<div id="test">Test 7</div>',
                    );
                    $.click('#button');
                    return navigator.clipboard.readText();
                }),
                'Test 7',
            );
            assert.strictEqual(
                await exec((_) => {
                    return $.getText('#test');
                }),
                'Test 7',
            );
        });
    });

    describe('events', function() {
        it('triggers copied event', async function() {
            assert.strictEqual(
                await exec(async (_) => {
                    $.setHTML(
                        document.body,
                        '<button class="btn btn-secondary" id="button" data-ui-toggle="clipboard" data-ui-text="Test 8"></button>',
                    );
                    return new Promise((resolve) => {
                        $.addEvent('#button', 'copied.ui.clipboard', (_) => {
                            resolve(navigator.clipboard.readText());
                        });
                        $.click('#button');
                    });
                }),
                'Test 8',
            );
        });
    });
});
