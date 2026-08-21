import assert from 'node:assert/strict';
import { waitFor } from './../helpers.js';
import { exec } from './../setup.js';

describe('dropdown', function() {
    beforeEach(async function() {
        await exec((_) => {
            $.setHTML(
                document.body,
                '<div>' +
                '<button class="btn btn-secondary" id="dropdownToggle1" data-ui-toggle="dropdown" type="button"></button>' +
                '<div class="dropdown-menu" id="dropdown1">' +
                '<button class="dropdown-item" id="dropdown1Item1"></button>' +
                '<button class="dropdown-item" id="dropdown1Item2"></button>' +
                '<button class="dropdown-item" id="dropdown1Item3"></button>' +
                '</div>' +
                '</div>' +
                '<div>' +
                '<button class="btn btn-secondary" id="dropdownToggle2" data-ui-toggle="dropdown" type="button"></button>' +
                '<div class="dropdown-menu" id="dropdown2">' +
                '<button class="dropdown-item" id="dropdown2Item1"></button>' +
                '<button class="dropdown-item" id="dropdown2Item2"></button>' +
                '<button class="dropdown-item" id="dropdown2Item3"></button>' +
                '</div>' +
                '</div>',
            );
        });
    });

    describe('#init', function() {
        it('creates an dropdown', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const dropdownToggle1 = $.findOne('#dropdownToggle1');
                    return UI.Dropdown.init(dropdownToggle1) instanceof UI.Dropdown;
                }),
                true,
            );
        });

        it('creates an dropdown (data-ui-toggle)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $.click('#dropdownToggle1');
                    return $.getData('#dropdownToggle1', 'dropdown') instanceof UI.Dropdown;
                }),
                true,
            );
        });

        it('creates an dropdown (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('#dropdownToggle1').dropdown();
                    return $.getData('#dropdownToggle1', 'dropdown') instanceof UI.Dropdown;
                }),
                true,
            );
        });

        it('creates multiple dropdowns (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('[data-ui-toggle="dropdown"]').dropdown();
                    return $.find('[data-ui-toggle="dropdown"]').every((node) =>
                        $.getData(node, 'dropdown') instanceof UI.Dropdown,
                    );
                }),
                true,
            );
        });

        it('returns the dropdown (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    return $('#dropdownToggle1').dropdown() instanceof UI.Dropdown;
                }),
                true,
            );
        });
    });

    describe('#dispose', function() {
        it('removes the dropdown', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const dropdownToggle1 = $.findOne('#dropdownToggle1');
                    UI.Dropdown.init(dropdownToggle1).dispose();
                    return $.hasData(dropdownToggle1, 'dropdown');
                }),
                false,
            );
        });

        it('removes the dropdown (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('#dropdownToggle1').dropdown('dispose');
                    return $.hasData('#dropdownToggle1', 'dropdown');
                }),
                false,
            );
        });

        it('removes multiple dropdowns (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('[data-ui-toggle="dropdown"]').dropdown('dispose');
                    return $.find('[data-ui-toggle="dropdown"]').some((node) =>
                        $.hasData(node, 'dropdown'),
                    );
                }),
                false,
            );
        });

        it('clears dropdown memory', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const dropdownToggle1 = $.findOne('#dropdownToggle1');
                    const dropdown = UI.Dropdown.init(dropdownToggle1);
                    dropdown.dispose();

                    for (const key in dropdown) {
                        if ($._isObject(dropdown[key]) && !$._isFunction(dropdown[key])) {
                            return false;
                        }
                    }

                    return true;
                }),
                true,
            );
        });

        it('clears dropdown memory when node is removed', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const dropdownToggle1 = $.findOne('#dropdownToggle1');
                    const dropdown = UI.Dropdown.init(dropdownToggle1);
                    $.remove(dropdownToggle1);

                    for (const key in dropdown) {
                        if ($._isObject(dropdown[key]) && !$._isFunction(dropdown[key])) {
                            return false;
                        }
                    }

                    return true;
                }),
                true,
            );
        });
    });

    describe('#show', function() {
        it('shows the dropdown', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#dropdown1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle1" data-ui-toggle="dropdown" type="button" data-ui-placement="bottom" aria-expanded="true"></button>' +
                    '<div class="dropdown-menu show" id="dropdown1" data-ui-placement="bottom" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(0px, 13px, 0px);">' +
                    '<button class="dropdown-item" id="dropdown1Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item3"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle2" data-ui-toggle="dropdown" type="button"></button>' +
                    '<div class="dropdown-menu" id="dropdown2">' +
                    '<button class="dropdown-item" id="dropdown2Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item3"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('shows the dropdown (query)', async function() {
            await exec((_) => {
                $('#dropdownToggle1').dropdown('show');
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#dropdown1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle1" data-ui-toggle="dropdown" type="button" data-ui-placement="bottom" aria-expanded="true"></button>' +
                    '<div class="dropdown-menu show" id="dropdown1" data-ui-placement="bottom" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(0px, 13px, 0px);">' +
                    '<button class="dropdown-item" id="dropdown1Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item3"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle2" data-ui-toggle="dropdown" type="button"></button>' +
                    '<div class="dropdown-menu" id="dropdown2">' +
                    '<button class="dropdown-item" id="dropdown2Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item3"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('shows multiple dropdowns (query)', async function() {
            await exec((_) => {
                $('[data-ui-toggle="dropdown"]').dropdown('show');
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle1" data-ui-toggle="dropdown" type="button" data-ui-placement="bottom" aria-expanded="true"></button>' +
                    '<div class="dropdown-menu show" id="dropdown1" data-ui-placement="bottom" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(0px, 13px, 0px);">' +
                    '<button class="dropdown-item" id="dropdown1Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item3"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle2" data-ui-toggle="dropdown" type="button" data-ui-placement="bottom" aria-expanded="true"></button>' +
                    '<div class="dropdown-menu show" id="dropdown2" data-ui-placement="bottom" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(0px, 23px, 0px);">' +
                    '<button class="dropdown-item" id="dropdown2Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item3"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('can be called multiple times', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                const dropdown = UI.Dropdown.init(dropdownToggle1);
                dropdown.show();
                dropdown.show();
                dropdown.show();
            });
        });

        it('can be called on shown dropdown', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const dropdownToggle1 = $.findOne('#dropdownToggle1');
                    UI.Dropdown.init(dropdownToggle1).show();
                });
            });
        });
    });

    describe('#hide', function() {
        it('hides the dropdown', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const dropdownToggle1 = $.findOne('#dropdownToggle1');
                    UI.Dropdown.init(dropdownToggle1).hide();
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#dropdown1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle1" data-ui-toggle="dropdown" type="button" aria-expanded="false"></button>' +
                    '<div class="dropdown-menu" id="dropdown1" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(0px, 13px, 0px);">' +
                    '<button class="dropdown-item" id="dropdown1Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item3"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle2" data-ui-toggle="dropdown" type="button"></button>' +
                    '<div class="dropdown-menu" id="dropdown2">' +
                    '<button class="dropdown-item" id="dropdown2Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item3"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('hides the dropdown (query)', async function() {
            await exec((_) => {
                $('#dropdownToggle1').dropdown('show');
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $('#dropdownToggle1').dropdown('hide');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#dropdown1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle1" data-ui-toggle="dropdown" type="button" aria-expanded="false"></button>' +
                    '<div class="dropdown-menu" id="dropdown1" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(0px, 13px, 0px);">' +
                    '<button class="dropdown-item" id="dropdown1Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item3"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle2" data-ui-toggle="dropdown" type="button"></button>' +
                    '<div class="dropdown-menu" id="dropdown2">' +
                    '<button class="dropdown-item" id="dropdown2Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item3"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('hides multiple dropdowns (query)', async function() {
            await exec((_) => {
                $('[data-ui-toggle="dropdown"]').dropdown('show');
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown1');
                    $.stop('#dropdown2');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $('[data-ui-toggle="dropdown"]').dropdown('hide');
                });
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle1" data-ui-toggle="dropdown" type="button" aria-expanded="false"></button>' +
                    '<div class="dropdown-menu" id="dropdown1" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(0px, 13px, 0px);">' +
                    '<button class="dropdown-item" id="dropdown1Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item3"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle2" data-ui-toggle="dropdown" type="button" aria-expanded="false"></button>' +
                    '<div class="dropdown-menu" id="dropdown2" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(0px, 23px, 0px);">' +
                    '<button class="dropdown-item" id="dropdown2Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item3"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('does not remove the dropdown after hiding', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const dropdownToggle1 = $.findOne('#dropdownToggle1');
                    UI.Dropdown.init(dropdownToggle1).hide();
                });
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getData('#dropdownToggle1', 'dropdown') instanceof UI.Dropdown),
                    true,
                );
            });
        });

        it('can be called multiple times', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const dropdownToggle1 = $.findOne('#dropdownToggle1');
                    const dropdown = UI.Dropdown.init(dropdownToggle1);
                    dropdown.hide();
                    dropdown.hide();
                    dropdown.hide();
                });
            });
        });

        it('can be called on hidden dropdown', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).hide();
            });
        });
    });

    describe('#toggle (show)', function() {
        it('shows the dropdown', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).toggle();
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#dropdown1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle1" data-ui-toggle="dropdown" type="button" data-ui-placement="bottom" aria-expanded="true"></button>' +
                    '<div class="dropdown-menu show" id="dropdown1" data-ui-placement="bottom" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(0px, 13px, 0px);">' +
                    '<button class="dropdown-item" id="dropdown1Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item3"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle2" data-ui-toggle="dropdown" type="button"></button>' +
                    '<div class="dropdown-menu" id="dropdown2">' +
                    '<button class="dropdown-item" id="dropdown2Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item3"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('shows the dropdown (data-ui-toggle)', async function() {
            await exec((_) => {
                $.click('#dropdownToggle1');
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#dropdown1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle1" data-ui-toggle="dropdown" type="button" data-ui-placement="bottom" aria-expanded="true"></button>' +
                    '<div class="dropdown-menu show" id="dropdown1" data-ui-placement="bottom" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(0px, 13px, 0px);">' +
                    '<button class="dropdown-item" id="dropdown1Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item3"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle2" data-ui-toggle="dropdown" type="button"></button>' +
                    '<div class="dropdown-menu" id="dropdown2">' +
                    '<button class="dropdown-item" id="dropdown2Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item3"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('shows the dropdown (query)', async function() {
            await exec((_) => {
                $('#dropdownToggle1').dropdown('toggle');
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#dropdown1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle1" data-ui-toggle="dropdown" type="button" data-ui-placement="bottom" aria-expanded="true"></button>' +
                    '<div class="dropdown-menu show" id="dropdown1" data-ui-placement="bottom" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(0px, 13px, 0px);">' +
                    '<button class="dropdown-item" id="dropdown1Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item3"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle2" data-ui-toggle="dropdown" type="button"></button>' +
                    '<div class="dropdown-menu" id="dropdown2">' +
                    '<button class="dropdown-item" id="dropdown2Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item3"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('shows multiple dropdowns (query)', async function() {
            await exec((_) => {
                $('[data-ui-toggle="dropdown"]').dropdown('toggle');
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#dropdown1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle1" data-ui-toggle="dropdown" type="button" data-ui-placement="bottom" aria-expanded="true"></button>' +
                    '<div class="dropdown-menu show" id="dropdown1" data-ui-placement="bottom" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(0px, 13px, 0px);">' +
                    '<button class="dropdown-item" id="dropdown1Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item3"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle2" data-ui-toggle="dropdown" type="button" data-ui-placement="bottom" aria-expanded="true"></button>' +
                    '<div class="dropdown-menu show" id="dropdown2" data-ui-placement="bottom" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(0px, 23px, 0px);">' +
                    '<button class="dropdown-item" id="dropdown2Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item3"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('can be called multiple times', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                const dropdown = UI.Dropdown.init(dropdownToggle1);
                dropdown.toggle();
                dropdown.toggle();
                dropdown.toggle();
            });
        });
    });

    describe('#toggle (hide)', function() {
        it('hides the dropdown', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const dropdownToggle1 = $.findOne('#dropdownToggle1');
                    UI.Dropdown.init(dropdownToggle1).toggle();
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#dropdown1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle1" data-ui-toggle="dropdown" type="button" aria-expanded="false"></button>' +
                    '<div class="dropdown-menu" id="dropdown1" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(0px, 13px, 0px);">' +
                    '<button class="dropdown-item" id="dropdown1Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item3"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle2" data-ui-toggle="dropdown" type="button"></button>' +
                    '<div class="dropdown-menu" id="dropdown2">' +
                    '<button class="dropdown-item" id="dropdown2Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item3"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('hides the dropdown (data-ui-toggle)', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.click('#dropdownToggle1');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#dropdown1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle1" data-ui-toggle="dropdown" type="button" aria-expanded="false"></button>' +
                    '<div class="dropdown-menu" id="dropdown1" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(0px, 13px, 0px);">' +
                    '<button class="dropdown-item" id="dropdown1Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item3"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle2" data-ui-toggle="dropdown" type="button"></button>' +
                    '<div class="dropdown-menu" id="dropdown2">' +
                    '<button class="dropdown-item" id="dropdown2Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item3"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('hides the dropdown (query)', async function() {
            await exec((_) => {
                $('#dropdownToggle1').dropdown('show');
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $('#dropdownToggle1').dropdown('toggle');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#dropdown1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle1" data-ui-toggle="dropdown" type="button" aria-expanded="false"></button>' +
                    '<div class="dropdown-menu" id="dropdown1" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(0px, 13px, 0px);">' +
                    '<button class="dropdown-item" id="dropdown1Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item3"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle2" data-ui-toggle="dropdown" type="button"></button>' +
                    '<div class="dropdown-menu" id="dropdown2">' +
                    '<button class="dropdown-item" id="dropdown2Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item3"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('hides multiple dropdowns (query)', async function() {
            await exec((_) => {
                $('[data-ui-toggle="dropdown"]').dropdown('show');
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown1');
                    $.stop('#dropdown2');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $('[data-ui-toggle="dropdown"]').dropdown('toggle');
                });
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle1" data-ui-toggle="dropdown" type="button" aria-expanded="false"></button>' +
                    '<div class="dropdown-menu" id="dropdown1" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(0px, 13px, 0px);">' +
                    '<button class="dropdown-item" id="dropdown1Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item3"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle2" data-ui-toggle="dropdown" type="button" aria-expanded="false"></button>' +
                    '<div class="dropdown-menu" id="dropdown2" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(0px, 23px, 0px);">' +
                    '<button class="dropdown-item" id="dropdown2Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item3"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('can be called multiple times', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const dropdownToggle1 = $.findOne('#dropdownToggle1');
                    const dropdown = UI.Dropdown.init(dropdownToggle1);
                    dropdown.toggle();
                    dropdown.toggle();
                    dropdown.toggle();
                });
            });
        });
    });

    describe('events', function() {
        it('triggers show event', async function() {
            assert.strictEqual(
                await exec(async (_) => {
                    return await new Promise((resolve) => {
                        const dropdownToggle1 = $.findOne('#dropdownToggle1');
                        $.addEvent(dropdownToggle1, 'show.ui.dropdown', (_) => {
                            resolve($.getHTML(document.body));
                        });
                        UI.Dropdown.init(dropdownToggle1).show();
                    });
                }),
                '<div>' +
                '<button class="btn btn-secondary" id="dropdownToggle1" data-ui-toggle="dropdown" type="button"></button>' +
                '<div class="dropdown-menu" id="dropdown1">' +
                '<button class="dropdown-item" id="dropdown1Item1"></button>' +
                '<button class="dropdown-item" id="dropdown1Item2"></button>' +
                '<button class="dropdown-item" id="dropdown1Item3"></button>' +
                '</div>' +
                '</div>' +
                '<div>' +
                '<button class="btn btn-secondary" id="dropdownToggle2" data-ui-toggle="dropdown" type="button"></button>' +
                '<div class="dropdown-menu" id="dropdown2">' +
                '<button class="dropdown-item" id="dropdown2Item1"></button>' +
                '<button class="dropdown-item" id="dropdown2Item2"></button>' +
                '<button class="dropdown-item" id="dropdown2Item3"></button>' +
                '</div>' +
                '</div>',
            );
        });

        it('triggers shown event', async function() {
            assert.strictEqual(
                await exec(async (_) => {
                    return await new Promise((resolve) => {
                        const dropdownToggle1 = $.findOne('#dropdownToggle1');
                        $.addEvent(dropdownToggle1, 'shown.ui.dropdown', (_) => {
                            resolve($.getHTML(document.body));
                        });
                        UI.Dropdown.init(dropdownToggle1).show();
                    });
                }),
                '<div>' +
                '<button class="btn btn-secondary" id="dropdownToggle1" data-ui-toggle="dropdown" type="button" data-ui-placement="bottom" aria-expanded="true"></button>' +
                '<div class="dropdown-menu show" id="dropdown1" data-ui-placement="bottom" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(0px, 13px, 0px);">' +
                '<button class="dropdown-item" id="dropdown1Item1"></button>' +
                '<button class="dropdown-item" id="dropdown1Item2"></button>' +
                '<button class="dropdown-item" id="dropdown1Item3"></button>' +
                '</div>' +
                '</div>' +
                '<div>' +
                '<button class="btn btn-secondary" id="dropdownToggle2" data-ui-toggle="dropdown" type="button"></button>' +
                '<div class="dropdown-menu" id="dropdown2">' +
                '<button class="dropdown-item" id="dropdown2Item1"></button>' +
                '<button class="dropdown-item" id="dropdown2Item2"></button>' +
                '<button class="dropdown-item" id="dropdown2Item3"></button>' +
                '</div>' +
                '</div>',
            );
        });

        it('triggers hide event', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown1');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec(async (_) => {
                        return await new Promise((resolve) => {
                            const dropdownToggle1 = $.findOne('#dropdownToggle1');
                            $.addEvent(dropdownToggle1, 'hide.ui.dropdown', (_) => {
                                resolve($.getHTML(document.body));
                            });
                            UI.Dropdown.init(dropdownToggle1).hide();
                        });
                    }),
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle1" data-ui-toggle="dropdown" type="button" data-ui-placement="bottom" aria-expanded="true"></button>' +
                    '<div class="dropdown-menu show" id="dropdown1" data-ui-placement="bottom" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(0px, 13px, 0px);">' +
                    '<button class="dropdown-item" id="dropdown1Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item3"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle2" data-ui-toggle="dropdown" type="button"></button>' +
                    '<div class="dropdown-menu" id="dropdown2">' +
                    '<button class="dropdown-item" id="dropdown2Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item3"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('triggers hidden event', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown1');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec(async (_) => {
                        return await new Promise((resolve) => {
                            const dropdownToggle1 = $.findOne('#dropdownToggle1');
                            $.addEvent(dropdownToggle1, 'hidden.ui.dropdown', (_) => {
                                resolve($.getHTML(document.body));
                            });
                            UI.Dropdown.init(dropdownToggle1).hide();
                        });
                    }),
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle1" data-ui-toggle="dropdown" type="button" aria-expanded="false"></button>' +
                    '<div class="dropdown-menu" id="dropdown1" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(0px, 13px, 0px);">' +
                    '<button class="dropdown-item" id="dropdown1Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item3"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle2" data-ui-toggle="dropdown" type="button"></button>' +
                    '<div class="dropdown-menu" id="dropdown2">' +
                    '<button class="dropdown-item" id="dropdown2Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item3"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('triggers show event (toggle)', async function() {
            assert.strictEqual(
                await exec(async (_) => {
                    return await new Promise((resolve) => {
                        const dropdownToggle1 = $.findOne('#dropdownToggle1');
                        $.addEvent(dropdownToggle1, 'show.ui.dropdown', (_) => {
                            resolve($.getHTML(document.body));
                        });
                        UI.Dropdown.init(dropdownToggle1).toggle();
                    });
                }),
                '<div>' +
                '<button class="btn btn-secondary" id="dropdownToggle1" data-ui-toggle="dropdown" type="button"></button>' +
                '<div class="dropdown-menu" id="dropdown1">' +
                '<button class="dropdown-item" id="dropdown1Item1"></button>' +
                '<button class="dropdown-item" id="dropdown1Item2"></button>' +
                '<button class="dropdown-item" id="dropdown1Item3"></button>' +
                '</div>' +
                '</div>' +
                '<div>' +
                '<button class="btn btn-secondary" id="dropdownToggle2" data-ui-toggle="dropdown" type="button"></button>' +
                '<div class="dropdown-menu" id="dropdown2">' +
                '<button class="dropdown-item" id="dropdown2Item1"></button>' +
                '<button class="dropdown-item" id="dropdown2Item2"></button>' +
                '<button class="dropdown-item" id="dropdown2Item3"></button>' +
                '</div>' +
                '</div>',
            );
        });

        it('triggers shown event (toggle)', async function() {
            assert.strictEqual(
                await exec(async (_) => {
                    return await new Promise((resolve) => {
                        const dropdownToggle1 = $.findOne('#dropdownToggle1');
                        $.addEvent(dropdownToggle1, 'shown.ui.dropdown', (_) => {
                            resolve($.getHTML(document.body));
                        });
                        UI.Dropdown.init(dropdownToggle1).toggle();
                    });
                }),
                '<div>' +
                '<button class="btn btn-secondary" id="dropdownToggle1" data-ui-toggle="dropdown" type="button" data-ui-placement="bottom" aria-expanded="true"></button>' +
                '<div class="dropdown-menu show" id="dropdown1" data-ui-placement="bottom" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(0px, 13px, 0px);">' +
                '<button class="dropdown-item" id="dropdown1Item1"></button>' +
                '<button class="dropdown-item" id="dropdown1Item2"></button>' +
                '<button class="dropdown-item" id="dropdown1Item3"></button>' +
                '</div>' +
                '</div>' +
                '<div>' +
                '<button class="btn btn-secondary" id="dropdownToggle2" data-ui-toggle="dropdown" type="button"></button>' +
                '<div class="dropdown-menu" id="dropdown2">' +
                '<button class="dropdown-item" id="dropdown2Item1"></button>' +
                '<button class="dropdown-item" id="dropdown2Item2"></button>' +
                '<button class="dropdown-item" id="dropdown2Item3"></button>' +
                '</div>' +
                '</div>',
            );
        });

        it('triggers hide event (toggle)', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown1');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec(async (_) => {
                        return await new Promise((resolve) => {
                            const dropdownToggle1 = $.findOne('#dropdownToggle1');
                            $.addEvent(dropdownToggle1, 'hide.ui.dropdown', (_) => {
                                resolve($.getHTML(document.body));
                            });
                            UI.Dropdown.init(dropdownToggle1).toggle();
                        });
                    }),
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle1" data-ui-toggle="dropdown" type="button" data-ui-placement="bottom" aria-expanded="true"></button>' +
                    '<div class="dropdown-menu show" id="dropdown1" data-ui-placement="bottom" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(0px, 13px, 0px);">' +
                    '<button class="dropdown-item" id="dropdown1Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item3"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle2" data-ui-toggle="dropdown" type="button"></button>' +
                    '<div class="dropdown-menu" id="dropdown2">' +
                    '<button class="dropdown-item" id="dropdown2Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item3"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('triggers hidden event (toggle)', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown1');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec(async (_) => {
                        return await new Promise((resolve) => {
                            const dropdownToggle1 = $.findOne('#dropdownToggle1');
                            $.addEvent(dropdownToggle1, 'hidden.ui.dropdown', (_) => {
                                resolve($.getHTML(document.body));
                            });
                            UI.Dropdown.init(dropdownToggle1).toggle();
                        });
                    }),
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle1" data-ui-toggle="dropdown" type="button" aria-expanded="false"></button>' +
                    '<div class="dropdown-menu" id="dropdown1" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(0px, 13px, 0px);">' +
                    '<button class="dropdown-item" id="dropdown1Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item3"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle2" data-ui-toggle="dropdown" type="button"></button>' +
                    '<div class="dropdown-menu" id="dropdown2">' +
                    '<button class="dropdown-item" id="dropdown2Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item3"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('can be prevented from showing', async function() {
            await exec(async (_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                $.addEvent(dropdownToggle1, 'show.ui.dropdown', (_) => {
                    return false;
                });
                UI.Dropdown.init(dropdownToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle1" data-ui-toggle="dropdown" type="button"></button>' +
                    '<div class="dropdown-menu" id="dropdown1">' +
                    '<button class="dropdown-item" id="dropdown1Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item3"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle2" data-ui-toggle="dropdown" type="button"></button>' +
                    '<div class="dropdown-menu" id="dropdown2">' +
                    '<button class="dropdown-item" id="dropdown2Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item3"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('can be prevented from showing (prevent default)', async function() {
            await exec(async (_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                $.addEvent(dropdownToggle1, 'show.ui.dropdown', (e) => {
                    e.preventDefault();
                });
                UI.Dropdown.init(dropdownToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle1" data-ui-toggle="dropdown" type="button"></button>' +
                    '<div class="dropdown-menu" id="dropdown1">' +
                    '<button class="dropdown-item" id="dropdown1Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item3"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle2" data-ui-toggle="dropdown" type="button"></button>' +
                    '<div class="dropdown-menu" id="dropdown2">' +
                    '<button class="dropdown-item" id="dropdown2Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item3"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('can be prevented from hiding', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec(async (_) => {
                    const dropdownToggle1 = $.findOne('#dropdownToggle1');
                    $.addEvent(dropdownToggle1, 'hide.ui.dropdown', (_) => {
                        return false;
                    });
                    UI.Dropdown.init(dropdownToggle1).hide();
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle1" data-ui-toggle="dropdown" type="button" data-ui-placement="bottom" aria-expanded="true"></button>' +
                    '<div class="dropdown-menu show" id="dropdown1" data-ui-placement="bottom" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(0px, 13px, 0px);">' +
                    '<button class="dropdown-item" id="dropdown1Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item3"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle2" data-ui-toggle="dropdown" type="button"></button>' +
                    '<div class="dropdown-menu" id="dropdown2">' +
                    '<button class="dropdown-item" id="dropdown2Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item3"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('can be prevented from hiding (prevent default)', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec(async (_) => {
                    const dropdownToggle1 = $.findOne('#dropdownToggle1');
                    $.addEvent(dropdownToggle1, 'hide.ui.dropdown', (e) => {
                        e.preventDefault();
                    });
                    UI.Dropdown.init(dropdownToggle1).hide();
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle1" data-ui-toggle="dropdown" type="button" data-ui-placement="bottom" aria-expanded="true"></button>' +
                    '<div class="dropdown-menu show" id="dropdown1" data-ui-placement="bottom" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(0px, 13px, 0px);">' +
                    '<button class="dropdown-item" id="dropdown1Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item3"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle2" data-ui-toggle="dropdown" type="button"></button>' +
                    '<div class="dropdown-menu" id="dropdown2">' +
                    '<button class="dropdown-item" id="dropdown2Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item3"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });
    });

    describe('user events', function() {
        it('shows the dropdown on down arrow', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                const event = new KeyboardEvent('keydown', {
                    bubbles: true,
                    code: 'ArrowDown',
                });
                $.focus(dropdownToggle1);
                dropdownToggle1.dispatchEvent(event);
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#dropdown1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle1" data-ui-toggle="dropdown" type="button" data-ui-placement="bottom" aria-expanded="true"></button>' +
                    '<div class="dropdown-menu show" id="dropdown1" data-ui-placement="bottom" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(0px, 13px, 0px);">' +
                    '<button class="dropdown-item" id="dropdown1Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item3"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle2" data-ui-toggle="dropdown" type="button"></button>' +
                    '<div class="dropdown-menu" id="dropdown2">' +
                    '<button class="dropdown-item" id="dropdown2Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item3"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('shows the dropdown on up arrow', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                const event = new KeyboardEvent('keydown', {
                    bubbles: true,
                    code: 'ArrowUp',
                });
                $.focus(dropdownToggle1);
                dropdownToggle1.dispatchEvent(event);
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#dropdown1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle1" data-ui-toggle="dropdown" type="button" data-ui-placement="bottom" aria-expanded="true"></button>' +
                    '<div class="dropdown-menu show" id="dropdown1" data-ui-placement="bottom" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(0px, 13px, 0px);">' +
                    '<button class="dropdown-item" id="dropdown1Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item3"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle2" data-ui-toggle="dropdown" type="button"></button>' +
                    '<div class="dropdown-menu" id="dropdown2">' +
                    '<button class="dropdown-item" id="dropdown2Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item3"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('hides the dropdown on document click', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.click(document.body);
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#dropdown1')),
                    true,
                );
            });
        });

        it('does not hide the dropdown on child form click', async function() {
            await exec((_) => {
                const form = $.create('form', {
                    attributes: {
                        id: 'form1',
                    },
                });
                $.append('#dropdown1', form);
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.click('#form1');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#dropdown1')),
                    false,
                );
            });
        });

        it('hides the dropdown on escape', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown1');
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
                    await exec((_) => $.hasAnimation('#dropdown1')),
                    true,
                );
            });
        });

        it('hides the dropdown on tab', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const event = new KeyboardEvent('keyup', {
                        bubbles: true,
                        code: 'Tab',
                    });
                    document.body.dispatchEvent(event);
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#dropdown1')),
                    true,
                );
            });
        });

        it('focuses the first item on down arrow', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                const event = new KeyboardEvent('keydown', {
                    bubbles: true,
                    code: 'ArrowDown',
                });
                $.focus(dropdownToggle1);
                dropdownToggle1.dispatchEvent(event);
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getAttribute(document.activeElement, 'id')),
                    'dropdown1Item1',
                );
            });
        });

        it('focuses the first item on up arrow', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                const event = new KeyboardEvent('keydown', {
                    bubbles: true,
                    code: 'ArrowUp',
                });
                $.focus(dropdownToggle1);
                dropdownToggle1.dispatchEvent(event);
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getAttribute(document.activeElement, 'id')),
                    'dropdown1Item1',
                );
            });
        });

        it('focuses the next item on down arrow', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const dropdown1Item2 = $.findOne('#dropdown1Item2');
                    const event = new KeyboardEvent('keydown', {
                        bubbles: true,
                        code: 'ArrowDown',
                    });
                    $.focus(dropdown1Item2);
                    dropdown1Item2.dispatchEvent(event);
                });
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getAttribute(document.activeElement, 'id')),
                    'dropdown1Item3',
                );
            });
        });

        it('focuses the next item on up arrow', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const dropdown1Item2 = $.findOne('#dropdown1Item2');
                    const event = new KeyboardEvent('keydown', {
                        bubbles: true,
                        code: 'ArrowUp',
                    });
                    $.focus(dropdown1Item2);
                    dropdown1Item2.dispatchEvent(event);
                });
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getAttribute(document.activeElement, 'id')),
                    'dropdown1Item1',
                );
            });
        });

        it('maintains focus on last item on down arrow', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const dropdown1Item3 = $.findOne('#dropdown1Item2');
                    const event = new KeyboardEvent('keydown', {
                        bubbles: true,
                        code: 'ArrowDown',
                    });
                    $.focus(dropdown1Item3);
                    dropdown1Item3.dispatchEvent(event);
                });
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getAttribute(document.activeElement, 'id')),
                    'dropdown1Item3',
                );
            });
        });

        it('maintains focus on first item on up arrow', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const dropdown1Item1 = $.findOne('#dropdown1Item2');
                    const event = new KeyboardEvent('keydown', {
                        bubbles: true,
                        code: 'ArrowUp',
                    });
                    $.focus(dropdown1Item1);
                    dropdown1Item1.dispatchEvent(event);
                });
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getAttribute(document.activeElement, 'id')),
                    'dropdown1Item1',
                );
            });
        });
    });

    describe('autoClose option', function() {
        it('works with auto close option', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1, {
                    autoClose: false,
                }).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.click(document.body);
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#dropdown1')),
                    false,
                );
            });
        });

        it('works with auto close option (data-ui-auto-close)', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                $.setDataset(dropdownToggle1, { uiAutoClose: false });
                UI.Dropdown.init(dropdownToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.click(document.body);
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#dropdown1')),
                    false,
                );
            });
        });

        it('works with auto close option (query)', async function() {
            await exec((_) => {
                $('#dropdownToggle1')
                    .dropdown({ autoClose: false })
                    .show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.click(document.body);
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#dropdown1')),
                    false,
                );
            });
        });

        it('hides on document click with auto close outside', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1, {
                    autoClose: 'outside',
                }).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.click(document.body);
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#dropdown1')),
                    true,
                );
            });
        });

        it('does not hide on document click with auto close inside', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1, {
                    autoClose: 'inside',
                }).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.click(document.body);
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#dropdown1')),
                    false,
                );
            });
        });

        it('hides on menu click with auto close inside', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1, {
                    autoClose: 'inside',
                }).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.click('#dropdown1');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#dropdown1')),
                    true,
                );
            });
        });

        it('does not hide on menu click with auto close outside', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1, {
                    autoClose: 'outside',
                }).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.click('#dropdown1');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#dropdown1')),
                    false,
                );
            });
        });
    });

    describe('display option', function() {
        it('works with static display option', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1, {
                    display: 'static',
                }).show();
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#dropdown1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle1" data-ui-toggle="dropdown" type="button" aria-expanded="true"></button>' +
                    '<div class="dropdown-menu show" id="dropdown1" style="">' +
                    '<button class="dropdown-item" id="dropdown1Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item3"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle2" data-ui-toggle="dropdown" type="button"></button>' +
                    '<div class="dropdown-menu" id="dropdown2">' +
                    '<button class="dropdown-item" id="dropdown2Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item3"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('works with static display option (data-ui-display)', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                $.setDataset(dropdownToggle1, { uiDisplay: 'static' });
                UI.Dropdown.init(dropdownToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#dropdown1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle1" data-ui-toggle="dropdown" type="button" data-ui-display="static" aria-expanded="true"></button>' +
                    '<div class="dropdown-menu show" id="dropdown1" style="">' +
                    '<button class="dropdown-item" id="dropdown1Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item3"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle2" data-ui-toggle="dropdown" type="button"></button>' +
                    '<div class="dropdown-menu" id="dropdown2">' +
                    '<button class="dropdown-item" id="dropdown2Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item3"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('works with static display option (query)', async function() {
            await exec((_) => {
                $('#dropdownToggle1')
                    .dropdown({ display: 'static' })
                    .show();
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#dropdown1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle1" data-ui-toggle="dropdown" type="button" aria-expanded="true"></button>' +
                    '<div class="dropdown-menu show" id="dropdown1" style="">' +
                    '<button class="dropdown-item" id="dropdown1Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown1Item3"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<button class="btn btn-secondary" id="dropdownToggle2" data-ui-toggle="dropdown" type="button"></button>' +
                    '<div class="dropdown-menu" id="dropdown2">' +
                    '<button class="dropdown-item" id="dropdown2Item1"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item2"></button>' +
                    '<button class="dropdown-item" id="dropdown2Item3"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });
    });

    describe('duration option', function() {
        it('works with duration option on show', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1, { duration: 200 }).show();
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#dropdown1')),
                    true,
                );
            });
        });

        it('works with duration option on show (data-ui-duration)', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                $.setDataset(dropdownToggle1, { uiDuration: 200 });
                UI.Dropdown.init(dropdownToggle1).show();
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#dropdown1')),
                    true,
                );
            });
        });

        it('works with duration option on show (query)', async function() {
            await exec((_) => {
                $('#dropdownToggle1')
                    .dropdown({ duration: 200 })
                    .show();
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#dropdown1')),
                    true,
                );
            });
        });

        it('works with duration option on hide', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1, { duration: 200 }).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const dropdownToggle1 = $.findOne('#dropdownToggle1');
                    UI.Dropdown.init(dropdownToggle1).hide();
                });
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#dropdown1')),
                    true,
                );
            });
        });

        it('works with duration option on hide (data-ui-duration)', async function() {
            await exec((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                $.setDataset(dropdownToggle1, { uiDuration: 200 });
                UI.Dropdown.init(dropdownToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const dropdownToggle1 = $.findOne('#dropdownToggle1');
                    UI.Dropdown.init(dropdownToggle1).hide();
                });
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#dropdown1')),
                    true,
                );
            });
        });

        it('works with duration option on hide (query)', async function() {
            await exec((_) => {
                $('#dropdownToggle1')
                    .dropdown({ duration: 200 })
                    .show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#dropdown1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $('#dropdownToggle1').dropdown('hide');
                });
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#dropdown1')),
                    true,
                );
            });
        });
    });
});
