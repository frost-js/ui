import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'mocha';
import { waitFor } from './../helpers.js';
import { exec } from './../setup.js';

describe('Offcanvas', function() {
    afterEach(async function() {
        await exec((_) => {
            $.removeClass(document.body, 'offcanvas-backdrop');
            $.removeAttribute(document.body, 'style');
        });
    });

    beforeEach(async function() {
        await exec((_) => {
            $.setHTML(
                document.body,
                '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas1" type="button"></button>' +
                '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas2" type="button"></button>' +
                '<div class="offcanvas offcanvas-start" id="offcanvas1">' +
                '<button class="btn-close" id="button1" data-ui-dismiss="offcanvas" type="button"></button>' +
                '</div>' +
                '<div class="offcanvas offcanvas-start" id="offcanvas2">' +
                '<button class="btn-close" id="button2" data-ui-dismiss="offcanvas" type="button"></button>' +
                '</div>',
            );
        });
    });

    describe('#init', function() {
        it('creates an offcanvas', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const offcanvas1 = $.findOne('#offcanvas1');
                    return UI.Offcanvas.init(offcanvas1) instanceof UI.Offcanvas;
                }),
                true,
            );
        });

        it('creates an offcanvas (data-ui-toggle)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $.click('#offcanvasToggle1');
                    return $.getData('#offcanvas1', 'offcanvas') instanceof UI.Offcanvas;
                }),
                true,
            );
        });

        it('creates an offcanvas (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('#offcanvas1').offcanvas();
                    return $.getData('#offcanvas1', 'offcanvas') instanceof UI.Offcanvas;
                }),
                true,
            );
        });

        it('returns the offcanvas (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    return $('#offcanvas1').offcanvas() instanceof UI.Offcanvas;
                }),
                true,
            );
        });
    });

    describe('#dispose', function() {
        it('removes the offcanvas', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const offcanvas1 = $.findOne('#offcanvas1');
                    UI.Offcanvas.init(offcanvas1).dispose();
                    return $.hasData(offcanvas1, 'offcanvas');
                }),
                false,
            );
        });

        it('removes the offcanvas (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('#offcanvas1').offcanvas('dispose');
                    return $.hasData('#offcanvas1', 'offcanvas');
                }),
                false,
            );
        });

        it('clears offcanvas memory', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const offcanvas1 = $.findOne('#offcanvas1');
                    const offcanvas = UI.Offcanvas.init(offcanvas1);
                    offcanvas.dispose();

                    for (const key in offcanvas) {
                        if ($._isObject(offcanvas[key]) && !$._isFunction(offcanvas[key])) {
                            return false;
                        }
                    }

                    return true;
                }),
                true,
            );
        });

        it('clears offcanvas memory when node is removed', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const offcanvas1 = $.findOne('#offcanvas1');
                    const offcanvas = UI.Offcanvas.init(offcanvas1);
                    $.setHTML(document.body, '');
                    // $.remove(offcanvas1);

                    for (const key in offcanvas) {
                        if ($._isObject(offcanvas[key]) && !$._isFunction(offcanvas[key])) {
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
        it('shows the offcanvas', async function() {
            await exec((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#offcanvas1')),
                    true,
                );
            }).then(waitFor(175)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas2" type="button"></button>' +
                    '<div class="offcanvas offcanvas-start show" id="offcanvas1" aria-hidden="false" aria-modal="true" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('shows the offcanvas (data-ui-toggle)', async function() {
            await exec((_) => {
                $.click('#offcanvasToggle1');
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#offcanvas1')),
                    true,
                );
            }).then(waitFor(175)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas2" type="button"></button>' +
                    '<div class="offcanvas offcanvas-start show" id="offcanvas1" style="" aria-hidden="false" aria-modal="true">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('shows the offcanvas (query)', async function() {
            await exec((_) => {
                $('#offcanvas1').offcanvas('show');
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#offcanvas1')),
                    true,
                );
            }).then(waitFor(175)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas2" type="button"></button>' +
                    '<div class="offcanvas offcanvas-start show" id="offcanvas1" aria-hidden="false" aria-modal="true" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('can be called multiple times', async function() {
            await exec((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                const offcanvas = UI.Offcanvas.init(offcanvas1);
                offcanvas.show();
                offcanvas.show();
                offcanvas.show();
            });
        });

        it('can be called on shown modal', async function() {
            await exec(async (_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#offcanvas1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const offcanvas1 = $.findOne('#offcanvas1');
                    UI.Offcanvas.init(offcanvas1).show();
                });
            });
        });
    });

    describe('#hide', function() {
        it('hides the offcanvas', async function() {
            await exec((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#offcanvas1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const offcanvas1 = $.findOne('#offcanvas1');
                    UI.Offcanvas.init(offcanvas1).hide();
                });
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#offcanvas1')),
                    true,
                );
            }).then(waitFor(175)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas2" type="button"></button>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas1" aria-hidden="true" aria-modal="false" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('hides the offcanvas (data-ui-dismiss)', async function() {
            await exec((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#offcanvas1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.click('#button1');
                });
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#offcanvas1')),
                    true,
                );
            }).then(waitFor(175)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas2" type="button"></button>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas1" aria-hidden="true" aria-modal="false" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('hides the offcanvas (query)', async function() {
            await exec((_) => {
                $('#offcanvas1').offcanvas('show');
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#offcanvas1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $('#offcanvas1').offcanvas('hide');
                });
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#offcanvas1')),
                    true,
                );
            }).then(waitFor(175)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas2" type="button"></button>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas1" aria-hidden="true" aria-modal="false" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('does not remove the offcanvas after hiding', async function() {
            await exec((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#offcanvas1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const offcanvas1 = $.findOne('#offcanvas1');
                    UI.Offcanvas.init(offcanvas1).hide();
                });
            }).then(waitFor(250)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getData('#offcanvas1', 'offcanvas') instanceof UI.Offcanvas),
                    true,
                );
            });
        });

        it('can be called multiple times', async function() {
            await exec((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#offcanvas1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec(async (_) => {
                    const offcanvas1 = $.findOne('#offcanvas1');
                    const offcanvas = UI.Offcanvas.init(offcanvas1);
                    offcanvas.hide();
                    offcanvas.hide();
                    offcanvas.hide();
                });
            });
        });

        it('can be called on hidden offcanvas', async function() {
            await exec(async (_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).hide();
            });
        });
    });

    describe('#toggle (show)', function() {
        it('shows the offcanvas', async function() {
            await exec((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).toggle();
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#offcanvas1')),
                    true,
                );
            }).then(waitFor(175)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas2" type="button"></button>' +
                    '<div class="offcanvas offcanvas-start show" id="offcanvas1" aria-hidden="false" aria-modal="true" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('shows the offcanvas (query)', async function() {
            await exec((_) => {
                $('#offcanvas1').offcanvas('toggle');
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#offcanvas1')),
                    true,
                );
            }).then(waitFor(175)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas2" type="button"></button>' +
                    '<div class="offcanvas offcanvas-start show" id="offcanvas1" aria-hidden="false" aria-modal="true" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('can be called multiple times', async function() {
            await exec((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                const offcanvas = UI.Offcanvas.init(offcanvas1);
                offcanvas.toggle();
                offcanvas.toggle();
                offcanvas.toggle();
            });
        });
    });

    describe('#toggle (hide)', function() {
        it('hides the offcanvas', async function() {
            await exec((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#offcanvas1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const offcanvas1 = $.findOne('#offcanvas1');
                    UI.Offcanvas.init(offcanvas1).toggle();
                });
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#offcanvas1')),
                    true,
                );
            }).then(waitFor(175)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas2" type="button"></button>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas1" aria-hidden="true" aria-modal="false" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('hides the offcanvas (query)', async function() {
            await exec((_) => {
                $('#offcanvas1').offcanvas('show');
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#offcanvas1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $('#offcanvas1').offcanvas('toggle');
                });
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#offcanvas1')),
                    true,
                );
            }).then(waitFor(175)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas2" type="button"></button>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas1" aria-hidden="true" aria-modal="false" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('can be called multiple times', async function() {
            await exec((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#offcanvas1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec(async (_) => {
                    const offcanvas1 = $.findOne('#offcanvas1');
                    const offcanvas = UI.Offcanvas.init(offcanvas1);
                    offcanvas.toggle();
                    offcanvas.toggle();
                    offcanvas.toggle();
                });
            });
        });
    });

    describe('events', function() {
        it('triggers show event', async function() {
            assert.strictEqual(
                await exec(async (_) => {
                    return await new Promise((resolve) => {
                        const offcanvas1 = $.findOne('#offcanvas1');
                        $.addEvent(offcanvas1, 'show.ui.offcanvas', (_) => {
                            resolve($.getHTML(document.body));
                        });
                        UI.Offcanvas.init(offcanvas1).show();
                    });
                }),
                '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas1" type="button"></button>' +
                '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas2" type="button"></button>' +
                '<div class="offcanvas offcanvas-start" id="offcanvas1">' +
                '<button class="btn-close" id="button1" data-ui-dismiss="offcanvas" type="button"></button>' +
                '</div>' +
                '<div class="offcanvas offcanvas-start" id="offcanvas2">' +
                '<button class="btn-close" id="button2" data-ui-dismiss="offcanvas" type="button"></button>' +
                '</div>',
            );
        });

        it('triggers shown event', async function() {
            assert.strictEqual(
                await exec(async (_) => {
                    return await new Promise((resolve) => {
                        const offcanvas1 = $.findOne('#offcanvas1');
                        $.addEvent(offcanvas1, 'shown.ui.offcanvas', (_) => {
                            resolve($.getHTML(document.body));
                        });
                        UI.Offcanvas.init(offcanvas1).show();
                    });
                }),
                '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas1" type="button"></button>' +
                '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas2" type="button"></button>' +
                '<div class="offcanvas offcanvas-start show" id="offcanvas1" aria-hidden="false" aria-modal="true" style="">' +
                '<button class="btn-close" id="button1" data-ui-dismiss="offcanvas" type="button"></button>' +
                '</div>' +
                '<div class="offcanvas offcanvas-start" id="offcanvas2">' +
                '<button class="btn-close" id="button2" data-ui-dismiss="offcanvas" type="button"></button>' +
                '</div>',
            );
        });

        it('triggers hide event', async function() {
            await exec((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#offcanvas1');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec(async (_) => {
                        return await new Promise((resolve) => {
                            const offcanvas1 = $.findOne('#offcanvas1');
                            $.addEvent(offcanvas1, 'hide.ui.offcanvas', (_) => {
                                resolve($.getHTML(document.body));
                            });
                            UI.Offcanvas.init(offcanvas1).hide();
                        });
                    }),
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas2" type="button"></button>' +
                    '<div class="offcanvas offcanvas-start show" id="offcanvas1" aria-hidden="false" aria-modal="true" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('triggers hidden event', async function() {
            await exec((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#offcanvas1');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec(async (_) => {
                        return await new Promise((resolve) => {
                            const offcanvas1 = $.findOne('#offcanvas1');
                            $.addEvent(offcanvas1, 'hidden.ui.offcanvas', (_) => {
                                resolve($.getHTML(document.body));
                            });
                            UI.Offcanvas.init(offcanvas1).hide();
                        });
                    }),
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas2" type="button"></button>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas1" aria-hidden="true" aria-modal="false" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('triggers show event (toggle)', async function() {
            assert.strictEqual(
                await exec(async (_) => {
                    return await new Promise((resolve) => {
                        const offcanvas1 = $.findOne('#offcanvas1');
                        $.addEvent(offcanvas1, 'show.ui.offcanvas', (_) => {
                            resolve($.getHTML(document.body));
                        });
                        UI.Offcanvas.init(offcanvas1).toggle();
                    });
                }),
                '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas1" type="button"></button>' +
                '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas2" type="button"></button>' +
                '<div class="offcanvas offcanvas-start" id="offcanvas1">' +
                '<button class="btn-close" id="button1" data-ui-dismiss="offcanvas" type="button"></button>' +
                '</div>' +
                '<div class="offcanvas offcanvas-start" id="offcanvas2">' +
                '<button class="btn-close" id="button2" data-ui-dismiss="offcanvas" type="button"></button>' +
                '</div>',
            );
        });

        it('triggers shown event (toggle)', async function() {
            assert.strictEqual(
                await exec(async (_) => {
                    return await new Promise((resolve) => {
                        const offcanvas1 = $.findOne('#offcanvas1');
                        $.addEvent(offcanvas1, 'shown.ui.offcanvas', (_) => {
                            resolve($.getHTML(document.body));
                        });
                        UI.Offcanvas.init(offcanvas1).toggle();
                    });
                }),
                '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas1" type="button"></button>' +
                '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas2" type="button"></button>' +
                '<div class="offcanvas offcanvas-start show" id="offcanvas1" aria-hidden="false" aria-modal="true" style="">' +
                '<button class="btn-close" id="button1" data-ui-dismiss="offcanvas" type="button"></button>' +
                '</div>' +
                '<div class="offcanvas offcanvas-start" id="offcanvas2">' +
                '<button class="btn-close" id="button2" data-ui-dismiss="offcanvas" type="button"></button>' +
                '</div>',
            );
        });

        it('triggers hide event (toggle)', async function() {
            await exec((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#offcanvas1');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec(async (_) => {
                        return await new Promise((resolve) => {
                            const offcanvas1 = $.findOne('#offcanvas1');
                            $.addEvent(offcanvas1, 'hide.ui.offcanvas', (_) => {
                                resolve($.getHTML(document.body));
                            });
                            UI.Offcanvas.init(offcanvas1).toggle();
                        });
                    }),
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas2" type="button"></button>' +
                    '<div class="offcanvas offcanvas-start show" id="offcanvas1" aria-hidden="false" aria-modal="true" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('triggers hidden event (toggle)', async function() {
            await exec((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#offcanvas1');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec(async (_) => {
                        return await new Promise((resolve) => {
                            const offcanvas1 = $.findOne('#offcanvas1');
                            $.addEvent(offcanvas1, 'hidden.ui.offcanvas', (_) => {
                                resolve($.getHTML(document.body));
                            });
                            UI.Offcanvas.init(offcanvas1).toggle();
                        });
                    }),
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas2" type="button"></button>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas1" aria-hidden="true" aria-modal="false" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('can be prevented from showing', async function() {
            await exec((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                $.addEvent(offcanvas1, 'show.ui.offcanvas', (_) => {
                    return false;
                });
                UI.Offcanvas.init(offcanvas1).show();
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas2" type="button"></button>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas1">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('can be prevented from showing (prevent default)', async function() {
            await exec((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                $.addEvent(offcanvas1, 'show.ui.offcanvas', (e) => {
                    e.preventDefault();
                });
                UI.Offcanvas.init(offcanvas1).show();
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas2" type="button"></button>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas1">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('can be prevented from hiding', async function() {
            await exec((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#offcanvas1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec(async (_) => {
                    const offcanvas1 = $.findOne('#offcanvas1');
                    $.addEvent(offcanvas1, 'hide.ui.offcanvas', (_) => {
                        return false;
                    });
                    UI.Offcanvas.init(offcanvas1).hide();
                });
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas2" type="button"></button>' +
                    '<div class="offcanvas offcanvas-start show" id="offcanvas1" aria-hidden="false" aria-modal="true" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>',
                );
            });
        });
    });

    describe('duration option', function() {
        it('works with duration option on show', async function() {
            await exec((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1, { duration: 200 }).show();
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#offcanvas1')),
                    true,
                );
            });
        });

        it('works with duration option on show (data-ui-duration)', async function() {
            await exec((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                $.setDataset(offcanvas1, { uiDuration: 200 });
                UI.Offcanvas.init(offcanvas1).show();
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#offcanvas1')),
                    true,
                );
            });
        });

        it('works with duration option on show (query)', async function() {
            await exec((_) => {
                $('#offcanvas1')
                    .offcanvas({ duration: 200 })
                    .show();
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#offcanvas1')),
                    true,
                );
            });
        });

        it('works with duration option on hide', async function() {
            await exec((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1, { duration: 200 }).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#offcanvas1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const offcanvas1 = $.findOne('#offcanvas1');
                    UI.Offcanvas.init(offcanvas1).hide();
                });
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#offcanvas1')),
                    true,
                );
            });
        });

        it('works with duration option on hide (data-ui-duration)', async function() {
            await exec((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                $.setDataset(offcanvas1, { uiDuration: 200 });
                UI.Offcanvas.init(offcanvas1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#offcanvas1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const offcanvas1 = $.findOne('#offcanvas1');
                    UI.Offcanvas.init(offcanvas1).hide();
                });
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#offcanvas1')),
                    true,
                );
            });
        });

        it('works with duration option on hide (query)', async function() {
            await exec((_) => {
                $('#offcanvas1')
                    .offcanvas({ duration: 200 })
                    .show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#offcanvas1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $('#offcanvas1')
                        .offcanvas('hide');
                });
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#offcanvas1')),
                    true,
                );
            });
        });
    });

    describe('keyboard option', function() {
        it('hides the offcanvas on escape', async function() {
            await exec((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#offcanvas1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const event = new KeyboardEvent('keydown', {
                        bubbles: true,
                        code: 'Escape',
                    });
                    document.body.dispatchEvent(event);
                });
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#offcanvas1')),
                    true,
                );
            }).then(waitFor(175)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas2" type="button"></button>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas1" aria-hidden="true" aria-modal="false" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('works with keyboard option', async function() {
            await exec((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1, { keyboard: false }).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#offcanvas1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const event = new KeyboardEvent('keyup', {
                        bubbles: true,
                        code: 'Escape',
                    });
                    document.body.dispatchEvent(event);
                });
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas2" type="button"></button>' +
                    '<div class="offcanvas offcanvas-start show" id="offcanvas1" aria-hidden="false" aria-modal="true" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('works with keyboard option (data-ui-keyboard)', async function() {
            await exec((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                $.setDataset(offcanvas1, { uiKeyboard: false });
                UI.Offcanvas.init(offcanvas1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#offcanvas1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const event = new KeyboardEvent('keyup', {
                        bubbles: true,
                        code: 'Escape',
                    });
                    document.body.dispatchEvent(event);
                });
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas2" type="button"></button>' +
                    '<div class="offcanvas offcanvas-start show" id="offcanvas1" data-ui-keyboard="false" aria-hidden="false" aria-modal="true" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('works with keyboard option (query)', async function() {
            await exec((_) => {
                $('#offcanvas1')
                    .offcanvas({ keyboard: false })
                    .show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#offcanvas1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const event = new KeyboardEvent('keyup', {
                        bubbles: true,
                        code: 'Escape',
                    });
                    document.body.dispatchEvent(event);
                });
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas2" type="button"></button>' +
                    '<div class="offcanvas offcanvas-start show" id="offcanvas1" aria-hidden="false" aria-modal="true" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>',
                );
            });
        });
    });

    describe('backdrop option', function() {
        it('adds backdrop to document body', async function() {
            await exec((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasClass(document.body, 'offcanvas-backdrop')),
                    true,
                );
            });
        });

        it('works with backdrop option', async function() {
            await exec((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1, { backdrop: false }).show();
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasClass(document.body, 'offcanvas-backdrop')),
                    false,
                );
            });
        });

        it('works with backdrop option (data-ui-backdrop)', async function() {
            await exec((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                $.setDataset(offcanvas1, { uiBackdrop: false });
                UI.Offcanvas.init(offcanvas1).show();
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasClass(document.body, 'offcanvas-backdrop')),
                    false,
                );
            });
        });

        it('works with backdrop option (query)', async function() {
            await exec((_) => {
                $('#offcanvas1')
                    .offcanvas({ backdrop: false })
                    .show();
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasClass(document.body, 'offcanvas-backdrop')),
                    false,
                );
            });
        });

        it('hides the offcanvas on document click (with backdrop)', async function() {
            await exec((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#offcanvas1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.click(document.body);
                });
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#offcanvas1')),
                    true,
                );
            }).then(waitFor(175)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas2" type="button"></button>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas1" aria-hidden="true" aria-modal="false" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('does not hide the offcanvas on document click (without backdrop)', async function() {
            await exec((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1, { backdrop: false }).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#offcanvas1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.click(document.body);
                });
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas2" type="button"></button>' +
                    '<div class="offcanvas offcanvas-start show" id="offcanvas1" aria-hidden="false" aria-modal="true" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('does not hide the offcanvas on document click (mousedown on offcanvas)', async function() {
            await exec((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#offcanvas1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.triggerEvent('#offcanvas1', 'mousedown');
                    $.click(document.body);
                });
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas2" type="button"></button>' +
                    '<div class="offcanvas offcanvas-start show" id="offcanvas1" aria-hidden="false" aria-modal="true" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('hides the offcanvas on offcanvas click (mousedown on backdrop)', async function() {
            await exec((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.triggerEvent(document.body, 'mousedown');
                    $.stop('#offcanvas1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.click('#offcanvas1');
                });
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#offcanvas1')),
                    true,
                );
            }).then(waitFor(175)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="offcanvasToggle1" data-ui-toggle="offcanvas" data-ui-target="#offcanvas2" type="button"></button>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas1" aria-hidden="true" aria-modal="false" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>' +
                    '<div class="offcanvas offcanvas-start" id="offcanvas2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="offcanvas" type="button"></button>' +
                    '</div>',
                );
            });
        });
    });

    describe('scroll option', function() {
        it('prevents scroll on document body', async function() {
            await exec((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getStyle(document.body, 'overflow')),
                    'hidden',
                );
            });
        });

        it('works with scroll option', async function() {
            await exec((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1, { scroll: true }).show();
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getStyle(document.body, 'overflow')),
                    '',
                );
            });
        });

        it('works with scroll option (data-ui-scroll)', async function() {
            await exec((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                $.setDataset(offcanvas1, { uiScroll: true });
                UI.Offcanvas.init(offcanvas1).show();
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getStyle(document.body, 'overflow')),
                    '',
                );
            });
        });

        it('works with scroll option', async function() {
            await exec((_) => {
                $('#offcanvas1')
                    .offcanvas({ scroll: true })
                    .show();
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getStyle(document.body, 'overflow')),
                    '',
                );
            });
        });
    });

    describe('scroll padding', function() {
        it('adds scroll padding to document body', async function() {
            await exec((_) => {
                $.setStyle(document.body, { height: '2000px' });
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#offcanvas1');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => {
                        return $.getStyle(document.body, 'paddingRight');
                    }),
                    '15px',
                );
            });
        });

        it('does not add padding if scrollbars are hidden', async function() {
            await exec((_) => {
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#offcanvas1');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => {
                        return $.getStyle(document.body, 'paddingRight');
                    }),
                    '',
                );
            });
        });

        it('works with existing padding', async function() {
            await exec((_) => {
                $.setStyle(document.body, {
                    height: '2000px',
                    paddingRight: '10px',
                });
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#offcanvas1');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => {
                        return $.getStyle(document.body, 'paddingRight');
                    }),
                    '25px',
                );
            });
        });

        it('restores scroll padding to document body', async function() {
            await exec((_) => {
                $.setStyle(document.body, { height: '2000px' });
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#offcanvas1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const offcanvas1 = $.findOne('#offcanvas1');
                    UI.Offcanvas.init(offcanvas1).hide();
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#offcanvas1');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => {
                        return $.getStyle(document.body, 'paddingRight');
                    }),
                    '',
                );
            });
        });

        it('restores existing scroll padding to document body', async function() {
            await exec((_) => {
                $.setStyle(document.body, {
                    height: '2000px',
                    paddingRight: '10px',
                });
                const offcanvas1 = $.findOne('#offcanvas1');
                UI.Offcanvas.init(offcanvas1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#offcanvas1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const offcanvas1 = $.findOne('#offcanvas1');
                    UI.Offcanvas.init(offcanvas1).hide();
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#offcanvas1');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => {
                        return $.getStyle(document.body, 'paddingRight');
                    }),
                    '10px',
                );
            });
        });
    });
});
