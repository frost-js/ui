import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'mocha';
import { waitFor } from './../helpers.js';
import { exec } from './../setup.js';

describe('Collapse', function() {
    beforeEach(async function() {
        await exec((_) => {
            $.setHTML(
                document.body,
                '<button class="btn btn-secondary collapsed" id="collapseToggle1" data-ui-toggle="collapse" data-ui-target="#collapse1" type="button"></button>' +
                '<button class="btn btn-secondary collapsed" id="collapseToggle2" data-ui-toggle="collapse" data-ui-target="#collapse2" type="button"></button>' +
                '<div class="collapse" id="collapse1"></div>' +
                '<div class="collapse" id="collapse2"></div>',
            );
        });
    });

    describe('#init', function() {
        it('creates a collapse', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const collapse1 = $.findOne('#collapse1');
                    return UI.Collapse.init(collapse1) instanceof UI.Collapse;
                }),
                true,
            );
        });

        it('creates a collapse (data-ui-toggle)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $.click('#collapseToggle1');
                    return $.getData('#collapse1', 'collapse') instanceof UI.Collapse;
                }),
                true,
            );
        });

        it('creates a collapse (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('#collapse1').collapse();
                    return $.getData('#collapse1', 'collapse') instanceof UI.Collapse;
                }),
                true,
            );
        });

        it('creates multiple collapses (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('div').collapse();
                    return $.find('div').every((node) =>
                        $.getData(node, 'collapse') instanceof UI.Collapse,
                    );
                }),
                true,
            );
        });

        it('returns the collapse (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    return $('#collapse1').collapse() instanceof UI.Collapse;
                }),
                true,
            );
        });
    });

    describe('#dispose', function() {
        it('removes the collapse', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const collapse1 = $.findOne('#collapse1');
                    UI.Collapse.init(collapse1).dispose();
                    return $.hasData(collapse1, 'collapse');
                }),
                false,
            );
        });

        it('removes the collapse (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('#collapse1').collapse('dispose');
                    return $.hasData('#collapse1', 'collapse');
                }),
                false,
            );
        });

        it('removes multiple collapses (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('div').collapse('dispose');
                    return $.find('div').some((node) =>
                        $.hasData(node, 'collapse'),
                    );
                }),
                false,
            );
        });

        it('clears collapse memory', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const collapse1 = $.findOne('#collapse1');
                    const collapse = UI.Collapse.init(collapse1);
                    collapse.dispose();

                    for (const key in collapse) {
                        if ($._isObject(collapse[key]) && !$._isFunction(collapse[key])) {
                            return false;
                        }
                    }

                    return true;
                }),
                true,
            );
        });

        it('clears collapse memory when node is removed', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const collapse1 = $.findOne('#collapse1');
                    const collapse = UI.Collapse.init(collapse1);
                    $.remove(collapse1);

                    for (const key in collapse) {
                        if ($._isObject(collapse[key]) && !$._isFunction(collapse[key])) {
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
        it('shows the collapse', async function() {
            await exec((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#collapse1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="collapseToggle1" data-ui-toggle="collapse" data-ui-target="#collapse1" type="button" aria-expanded="true"></button>' +
                    '<button class="btn btn-secondary collapsed" id="collapseToggle2" data-ui-toggle="collapse" data-ui-target="#collapse2" type="button"></button>' +
                    '<div class="collapse show" id="collapse1" style=""></div>' +
                    '<div class="collapse" id="collapse2"></div>',
                );
            });
        });

        it('shows the collapse (query)', async function() {
            await exec((_) => {
                $('#collapse1').collapse('show');
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#collapse1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="collapseToggle1" data-ui-toggle="collapse" data-ui-target="#collapse1" type="button" aria-expanded="true"></button>' +
                    '<button class="btn btn-secondary collapsed" id="collapseToggle2" data-ui-toggle="collapse" data-ui-target="#collapse2" type="button"></button>' +
                    '<div class="collapse show" id="collapse1" style=""></div>' +
                    '<div class="collapse" id="collapse2"></div>',
                );
            });
        });

        it('shows multiple collapses (query)', async function() {
            await exec((_) => {
                $('div').collapse('show');
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="collapseToggle1" data-ui-toggle="collapse" data-ui-target="#collapse1" type="button" aria-expanded="true"></button>' +
                    '<button class="btn btn-secondary" id="collapseToggle2" data-ui-toggle="collapse" data-ui-target="#collapse2" type="button" aria-expanded="true"></button>' +
                    '<div class="collapse show" id="collapse1" style=""></div>' +
                    '<div class="collapse show" id="collapse2" style=""></div>',
                );
            });
        });

        it('can be called multiple times', async function() {
            await exec(async (_) => {
                const collapse1 = $.findOne('#collapse1');
                const collapse = UI.Collapse.init(collapse1);
                collapse.show();
                collapse.show();
                collapse.show();
            });
        });

        it('can be called on shown collapse', async function() {
            await exec(async (_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#collapse1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const collapse1 = $.findOne('#collapse1');
                    UI.Collapse.init(collapse1).show();
                });
            });
        });
    });

    describe('#hide', function() {
        it('hides the collapse', async function() {
            await exec((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#collapse1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const collapse1 = $.findOne('#collapse1');
                    UI.Collapse.init(collapse1).hide();
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#collapse1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary collapsed" id="collapseToggle1" data-ui-toggle="collapse" data-ui-target="#collapse1" type="button" aria-expanded="false"></button>' +
                    '<button class="btn btn-secondary collapsed" id="collapseToggle2" data-ui-toggle="collapse" data-ui-target="#collapse2" type="button"></button>' +
                    '<div class="collapse" id="collapse1" style=""></div>' +
                    '<div class="collapse" id="collapse2"></div>',
                );
            });
        });

        it('hides the collapse (query)', async function() {
            await exec((_) => {
                $('#collapse1').collapse('show');
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#collapse1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $('#collapse1').collapse('hide');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#collapse1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary collapsed" id="collapseToggle1" data-ui-toggle="collapse" data-ui-target="#collapse1" type="button" aria-expanded="false"></button>' +
                    '<button class="btn btn-secondary collapsed" id="collapseToggle2" data-ui-toggle="collapse" data-ui-target="#collapse2" type="button"></button>' +
                    '<div class="collapse" id="collapse1" style=""></div>' +
                    '<div class="collapse" id="collapse2"></div>',
                );
            });
        });

        it('hides multiple collapses (query)', async function() {
            await exec((_) => {
                $('div').collapse('show');
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#collapse1');
                    $.stop('#collapse2');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $('div').collapse('hide');
                });
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary collapsed" id="collapseToggle1" data-ui-toggle="collapse" data-ui-target="#collapse1" type="button" aria-expanded="false"></button>' +
                    '<button class="btn btn-secondary collapsed" id="collapseToggle2" data-ui-toggle="collapse" data-ui-target="#collapse2" type="button" aria-expanded="false"></button>' +
                    '<div class="collapse" id="collapse1" style=""></div>' +
                    '<div class="collapse" id="collapse2" style=""></div>',
                );
            });
        });

        it('does not remove the collapse after hiding', async function() {
            await exec((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#collapse1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const collapse1 = $.findOne('#collapse1');
                    UI.Collapse.init(collapse1).hide();
                });
            }).then(waitFor(250)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getData('#collapse1', 'collapse') instanceof UI.Collapse),
                    true,
                );
            });
        });

        it('can be called multiple times', async function() {
            await exec((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#collapse1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec(async (_) => {
                    const collapse1 = $.findOne('#collapse1');
                    const collapse = UI.Collapse.init(collapse1);
                    collapse.hide();
                    collapse.hide();
                    collapse.hide();
                });
            });
        });

        it('can be called on hidden collapse', async function() {
            await exec(async (_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).hide();
            });
        });
    });

    describe('#toggle (show)', function() {
        it('shows the collapse', async function() {
            await exec((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).toggle();
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#collapse1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="collapseToggle1" data-ui-toggle="collapse" data-ui-target="#collapse1" type="button" aria-expanded="true"></button>' +
                    '<button class="btn btn-secondary collapsed" id="collapseToggle2" data-ui-toggle="collapse" data-ui-target="#collapse2" type="button"></button>' +
                    '<div class="collapse show" id="collapse1" style=""></div>' +
                    '<div class="collapse" id="collapse2"></div>',
                );
            });
        });

        it('shows the collapse (data-ui-toggle)', async function() {
            await exec((_) => {
                $.click('#collapseToggle1');
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#collapse1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="collapseToggle1" data-ui-toggle="collapse" data-ui-target="#collapse1" type="button" aria-expanded="true"></button>' +
                    '<button class="btn btn-secondary collapsed" id="collapseToggle2" data-ui-toggle="collapse" data-ui-target="#collapse2" type="button"></button>' +
                    '<div class="collapse show" id="collapse1" style=""></div>' +
                    '<div class="collapse" id="collapse2"></div>',
                );
            });
        });

        it('shows the collapse (query)', async function() {
            await exec((_) => {
                $('#collapse1').collapse('toggle');
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#collapse1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="collapseToggle1" data-ui-toggle="collapse" data-ui-target="#collapse1" type="button" aria-expanded="true"></button>' +
                    '<button class="btn btn-secondary collapsed" id="collapseToggle2" data-ui-toggle="collapse" data-ui-target="#collapse2" type="button"></button>' +
                    '<div class="collapse show" id="collapse1" style=""></div>' +
                    '<div class="collapse" id="collapse2"></div>',
                );
            });
        });

        it('shows multiple collapses (query)', async function() {
            await exec((_) => {
                $('div').collapse('toggle');
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="collapseToggle1" data-ui-toggle="collapse" data-ui-target="#collapse1" type="button" aria-expanded="true"></button>' +
                    '<button class="btn btn-secondary" id="collapseToggle2" data-ui-toggle="collapse" data-ui-target="#collapse2" type="button" aria-expanded="true"></button>' +
                    '<div class="collapse show" id="collapse1" style=""></div>' +
                    '<div class="collapse show" id="collapse2" style=""></div>',
                );
            });
        });

        it('can be called multiple times', async function() {
            await exec(async (_) => {
                const collapse1 = $.findOne('#collapse1');
                const collapse = UI.Collapse.init(collapse1);
                collapse.toggle();
                collapse.toggle();
                collapse.toggle();
            });
        });
    });

    describe('#toggle (hide)', function() {
        it('hides the collapse', async function() {
            await exec((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#collapse1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const collapse1 = $.findOne('#collapse1');
                    UI.Collapse.init(collapse1).toggle();
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#collapse1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary collapsed" id="collapseToggle1" data-ui-toggle="collapse" data-ui-target="#collapse1" type="button" aria-expanded="false"></button>' +
                    '<button class="btn btn-secondary collapsed" id="collapseToggle2" data-ui-toggle="collapse" data-ui-target="#collapse2" type="button"></button>' +
                    '<div class="collapse" id="collapse1" style=""></div>' +
                    '<div class="collapse" id="collapse2"></div>',
                );
            });
        });

        it('hides the collapse (data-ui-toggle)', async function() {
            await exec((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#collapse1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.click('#collapseToggle1');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#collapse1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary collapsed" id="collapseToggle1" data-ui-toggle="collapse" data-ui-target="#collapse1" type="button" aria-expanded="false"></button>' +
                    '<button class="btn btn-secondary collapsed" id="collapseToggle2" data-ui-toggle="collapse" data-ui-target="#collapse2" type="button"></button>' +
                    '<div class="collapse" id="collapse1" style=""></div>' +
                    '<div class="collapse" id="collapse2"></div>',
                );
            });
        });

        it('hides the collapse (query)', async function() {
            await exec((_) => {
                $('#collapse1').collapse('show');
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#collapse1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $('#collapse1').collapse('toggle');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#collapse1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary collapsed" id="collapseToggle1" data-ui-toggle="collapse" data-ui-target="#collapse1" type="button" aria-expanded="false"></button>' +
                    '<button class="btn btn-secondary collapsed" id="collapseToggle2" data-ui-toggle="collapse" data-ui-target="#collapse2" type="button"></button>' +
                    '<div class="collapse" id="collapse1" style=""></div>' +
                    '<div class="collapse" id="collapse2"></div>',
                );
            });
        });

        it('hides multiple collapses (query)', async function() {
            await exec((_) => {
                $('div').collapse('show');
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#collapse1');
                    $.stop('#collapse2');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $('div').collapse('toggle');
                });
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary collapsed" id="collapseToggle1" data-ui-toggle="collapse" data-ui-target="#collapse1" type="button" aria-expanded="false"></button>' +
                    '<button class="btn btn-secondary collapsed" id="collapseToggle2" data-ui-toggle="collapse" data-ui-target="#collapse2" type="button" aria-expanded="false"></button>' +
                    '<div class="collapse" id="collapse1" style=""></div>' +
                    '<div class="collapse" id="collapse2" style=""></div>',
                );
            });
        });

        it('can be called multiple times', async function() {
            await exec((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#collapse1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec(async (_) => {
                    const collapse1 = $.findOne('#collapse1');
                    const collapse = UI.Collapse.init(collapse1);
                    collapse.toggle();
                    collapse.toggle();
                    collapse.toggle();
                });
            });
        });
    });

    describe('events', function() {
        it('triggers show event', async function() {
            assert.strictEqual(
                await exec(async (_) => {
                    return await new Promise((resolve) => {
                        const collapse1 = $.findOne('#collapse1');
                        $.addEvent(collapse1, 'show.ui.collapse', (_) => {
                            resolve($.getHTML(document.body));
                        });
                        UI.Collapse.init(collapse1).show();
                    });
                }),
                '<button class="btn btn-secondary collapsed" id="collapseToggle1" data-ui-toggle="collapse" data-ui-target="#collapse1" type="button"></button>' +
                '<button class="btn btn-secondary collapsed" id="collapseToggle2" data-ui-toggle="collapse" data-ui-target="#collapse2" type="button"></button>' +
                '<div class="collapse" id="collapse1"></div>' +
                '<div class="collapse" id="collapse2"></div>',
            );
        });

        it('triggers shown event', async function() {
            assert.strictEqual(
                await exec(async (_) => {
                    return await new Promise((resolve) => {
                        const collapse1 = $.findOne('#collapse1');
                        $.addEvent(collapse1, 'shown.ui.collapse', (_) => {
                            resolve($.getHTML(document.body));
                        });
                        UI.Collapse.init(collapse1).show();
                    });
                }),
                '<button class="btn btn-secondary" id="collapseToggle1" data-ui-toggle="collapse" data-ui-target="#collapse1" type="button" aria-expanded="true"></button>' +
                '<button class="btn btn-secondary collapsed" id="collapseToggle2" data-ui-toggle="collapse" data-ui-target="#collapse2" type="button"></button>' +
                '<div class="collapse show" id="collapse1" style=""></div>' +
                '<div class="collapse" id="collapse2"></div>',
            );
        });

        it('triggers hide event', async function() {
            await exec((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#collapse1');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec(async (_) => {
                        return await new Promise((resolve) => {
                            const collapse1 = $.findOne('#collapse1');
                            $.addEvent(collapse1, 'hide.ui.collapse', (_) => {
                                resolve($.getHTML(document.body));
                            });
                            UI.Collapse.init(collapse1).hide();
                        });
                    }),
                    '<button class="btn btn-secondary" id="collapseToggle1" data-ui-toggle="collapse" data-ui-target="#collapse1" type="button" aria-expanded="true"></button>' +
                    '<button class="btn btn-secondary collapsed" id="collapseToggle2" data-ui-toggle="collapse" data-ui-target="#collapse2" type="button"></button>' +
                    '<div class="collapse show" id="collapse1" style=""></div>' +
                    '<div class="collapse" id="collapse2"></div>',
                );
            });
        });

        it('triggers hidden event', async function() {
            await exec((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#collapse1');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec(async (_) => {
                        return await new Promise((resolve) => {
                            const collapse1 = $.findOne('#collapse1');
                            $.addEvent(collapse1, 'hidden.ui.collapse', (_) => {
                                resolve($.getHTML(document.body));
                            });
                            UI.Collapse.init(collapse1).hide();
                        });
                    }),
                    '<button class="btn btn-secondary collapsed" id="collapseToggle1" data-ui-toggle="collapse" data-ui-target="#collapse1" type="button" aria-expanded="false"></button>' +
                    '<button class="btn btn-secondary collapsed" id="collapseToggle2" data-ui-toggle="collapse" data-ui-target="#collapse2" type="button"></button>' +
                    '<div class="collapse" id="collapse1" style=""></div>' +
                    '<div class="collapse" id="collapse2"></div>',
                );
            });
        });

        it('triggers show event (toggle)', async function() {
            assert.strictEqual(
                await exec(async (_) => {
                    return await new Promise((resolve) => {
                        const collapse1 = $.findOne('#collapse1');
                        $.addEvent(collapse1, 'show.ui.collapse', (_) => {
                            resolve($.getHTML(document.body));
                        });
                        UI.Collapse.init(collapse1).toggle();
                    });
                }),
                '<button class="btn btn-secondary collapsed" id="collapseToggle1" data-ui-toggle="collapse" data-ui-target="#collapse1" type="button"></button>' +
                '<button class="btn btn-secondary collapsed" id="collapseToggle2" data-ui-toggle="collapse" data-ui-target="#collapse2" type="button"></button>' +
                '<div class="collapse" id="collapse1"></div>' +
                '<div class="collapse" id="collapse2"></div>',
            );
        });

        it('triggers shown event (toggle)', async function() {
            assert.strictEqual(
                await exec(async (_) => {
                    return await new Promise((resolve) => {
                        const collapse1 = $.findOne('#collapse1');
                        $.addEvent(collapse1, 'shown.ui.collapse', (_) => {
                            resolve($.getHTML(document.body));
                        });
                        UI.Collapse.init(collapse1).toggle();
                    });
                }),
                '<button class="btn btn-secondary" id="collapseToggle1" data-ui-toggle="collapse" data-ui-target="#collapse1" type="button" aria-expanded="true"></button>' +
                '<button class="btn btn-secondary collapsed" id="collapseToggle2" data-ui-toggle="collapse" data-ui-target="#collapse2" type="button"></button>' +
                '<div class="collapse show" id="collapse1" style=""></div>' +
                '<div class="collapse" id="collapse2"></div>',
            );
        });

        it('triggers hide event (toggle)', async function() {
            await exec((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#collapse1');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec(async (_) => {
                        return await new Promise((resolve) => {
                            const collapse1 = $.findOne('#collapse1');
                            $.addEvent(collapse1, 'hide.ui.collapse', (_) => {
                                resolve($.getHTML(document.body));
                            });
                            UI.Collapse.init(collapse1).toggle();
                        });
                    }),
                    '<button class="btn btn-secondary" id="collapseToggle1" data-ui-toggle="collapse" data-ui-target="#collapse1" type="button" aria-expanded="true"></button>' +
                    '<button class="btn btn-secondary collapsed" id="collapseToggle2" data-ui-toggle="collapse" data-ui-target="#collapse2" type="button"></button>' +
                    '<div class="collapse show" id="collapse1" style=""></div>' +
                    '<div class="collapse" id="collapse2"></div>',
                );
            });
        });

        it('triggers hidden event (toggle)', async function() {
            await exec((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#collapse1');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec(async (_) => {
                        return await new Promise((resolve) => {
                            const collapse1 = $.findOne('#collapse1');
                            $.addEvent(collapse1, 'hidden.ui.collapse', (_) => {
                                resolve($.getHTML(document.body));
                            });
                            UI.Collapse.init(collapse1).toggle();
                        });
                    }),
                    '<button class="btn btn-secondary collapsed" id="collapseToggle1" data-ui-toggle="collapse" data-ui-target="#collapse1" type="button" aria-expanded="false"></button>' +
                    '<button class="btn btn-secondary collapsed" id="collapseToggle2" data-ui-toggle="collapse" data-ui-target="#collapse2" type="button"></button>' +
                    '<div class="collapse" id="collapse1" style=""></div>' +
                    '<div class="collapse" id="collapse2"></div>',
                );
            });
        });

        it('can be prevented from showing', async function() {
            await exec(async (_) => {
                const collapse1 = $.findOne('#collapse1');
                $.addEvent(collapse1, 'show.ui.collapse', (_) => {
                    return false;
                });
                UI.Collapse.init(collapse1).show();
            }).then(waitFor(250)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary collapsed" id="collapseToggle1" data-ui-toggle="collapse" data-ui-target="#collapse1" type="button"></button>' +
                    '<button class="btn btn-secondary collapsed" id="collapseToggle2" data-ui-toggle="collapse" data-ui-target="#collapse2" type="button"></button>' +
                    '<div class="collapse" id="collapse1"></div>' +
                    '<div class="collapse" id="collapse2"></div>',
                );
            });
        });

        it('can be prevented from showing (prevent default)', async function() {
            await exec(async (_) => {
                const collapse1 = $.findOne('#collapse1');
                $.addEvent(collapse1, 'show.ui.collapse', (e) => {
                    e.preventDefault();
                });
                UI.Collapse.init(collapse1).show();
            }).then(waitFor(250)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary collapsed" id="collapseToggle1" data-ui-toggle="collapse" data-ui-target="#collapse1" type="button"></button>' +
                    '<button class="btn btn-secondary collapsed" id="collapseToggle2" data-ui-toggle="collapse" data-ui-target="#collapse2" type="button"></button>' +
                    '<div class="collapse" id="collapse1"></div>' +
                    '<div class="collapse" id="collapse2"></div>',
                );
            });
        });

        it('can be prevented from hiding', async function() {
            await exec((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#collapse1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec(async (_) => {
                    const collapse1 = $.findOne('#collapse1');
                    $.addEvent(collapse1, 'hide.ui.collapse', (_) => {
                        return false;
                    });
                    UI.Collapse.init(collapse1).hide();
                });
            }).then(waitFor(250)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="collapseToggle1" data-ui-toggle="collapse" data-ui-target="#collapse1" type="button" aria-expanded="true"></button>' +
                    '<button class="btn btn-secondary collapsed" id="collapseToggle2" data-ui-toggle="collapse" data-ui-target="#collapse2" type="button"></button>' +
                    '<div class="collapse show" id="collapse1" style=""></div>' +
                    '<div class="collapse" id="collapse2"></div>',
                );
            });
        });

        it('can be prevented from hiding (prevent default)', async function() {
            await exec((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#collapse1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec(async (_) => {
                    const collapse1 = $.findOne('#collapse1');
                    $.addEvent(collapse1, 'hide.ui.collapse', (e) => {
                        e.preventDefault();
                    });
                    UI.Collapse.init(collapse1).hide();
                });
            }).then(waitFor(250)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="collapseToggle1" data-ui-toggle="collapse" data-ui-target="#collapse1" type="button" aria-expanded="true"></button>' +
                    '<button class="btn btn-secondary collapsed" id="collapseToggle2" data-ui-toggle="collapse" data-ui-target="#collapse2" type="button"></button>' +
                    '<div class="collapse show" id="collapse1" style=""></div>' +
                    '<div class="collapse" id="collapse2"></div>',
                );
            });
        });
    });

    describe('duration option', function() {
        it('works with duration option on show', async function() {
            await exec((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1, { duration: 200 }).show();
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#collapse1')),
                    true,
                );
            });
        });

        it('works with duration option on show (data-ui-duration)', async function() {
            await exec((_) => {
                const collapse1 = $.findOne('#collapse1');
                $.setDataset(collapse1, { uiDuration: 200 });
                UI.Collapse.init(collapse1).show();
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#collapse1')),
                    true,
                );
            });
        });

        it('works with duration option on show (query)', async function() {
            await exec((_) => {
                $('#collapse1')
                    .collapse({ duration: 200 })
                    .show();
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#collapse1')),
                    true,
                );
            });
        });

        it('works with duration option on hide', async function() {
            await exec((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1, { duration: 200 }).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#collapse1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const collapse1 = $.findOne('#collapse1');
                    UI.Collapse.init(collapse1).hide();
                });
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#collapse1')),
                    true,
                );
            });
        });

        it('works with duration option on hide (data-ui-duration)', async function() {
            await exec((_) => {
                const collapse1 = $.findOne('#collapse1');
                $.setDataset(collapse1, { uiDuration: 200 });
                UI.Collapse.init(collapse1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#collapse1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const collapse1 = $.findOne('#collapse1');
                    UI.Collapse.init(collapse1).hide();
                });
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#collapse1')),
                    true,
                );
            });
        });

        it('works with duration option on hide (query)', async function() {
            await exec((_) => {
                $('#collapse1')
                    .collapse({ duration: 200 })
                    .show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#collapse1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $('#collapse1').collapse('hide');
                });
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#collapse1')),
                    true,
                );
            });
        });
    });
});
