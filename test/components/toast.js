import assert from 'node:assert/strict';
import { waitFor } from './../helpers.js';
import { exec } from './../setup.js';

describe('Toast', function() {
    beforeEach(async function() {
        await exec((_) => {
            $.setHTML(
                document.body,
                '<div class="toast show" id="toast1">' +
                '<button class="btn-close" id="button1" data-ui-dismiss="toast" type="button"></button>' +
                '</div>' +
                '<div class="toast show" id="toast2">' +
                '<button class="btn-close" id="button2" data-ui-dismiss="toast" type="button"></button>' +
                '</div>',
            );
        });
    });

    describe('#init', function() {
        it('creates a toast', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const toast1 = $.findOne('#toast1');
                    return UI.Toast.init(toast1) instanceof UI.Toast;
                }),
                true,
            );
        });

        it('creates a toast (data-ui-toggle)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $.click('#button1');
                    return $.getData('#toast1', 'toast') instanceof UI.Toast;
                }),
                true,
            );
        });

        it('creates a toast (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('#toast1').toast();
                    return $.getData('#toast1', 'toast') instanceof UI.Toast;
                }),
                true,
            );
        });

        it('creates multiple toasts (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('.toast').toast();
                    return $.find('.toast').every((node) =>
                        $.getData(node, 'toast') instanceof UI.Toast,
                    );
                }),
                true,
            );
        });

        it('returns the toast (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    return $('#toast1').toast() instanceof UI.Toast;
                }),
                true,
            );
        });
    });

    describe('#dispose', function() {
        it('removes the toast', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const toast1 = $.findOne('#toast1');
                    UI.Toast.init(toast1).dispose();
                    return $.hasData(toast1, 'toast');
                }),
                false,
            );
        });

        it('removes the toast (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('#toast1').toast('dispose');
                    return $.hasData('#toast1', 'toast');
                }),
                false,
            );
        });

        it('removes multiple toasts (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('.toast').toast('dispose');
                    return $.find('.toast').some((node) =>
                        $.hasData(node, 'toast'),
                    );
                }),
                false,
            );
        });

        it('clears toast memory', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const toast1 = $.findOne('#toast1');
                    const toast = UI.Toast.init(toast1);
                    toast.dispose();

                    for (const key in toast) {
                        if ($._isObject(toast[key]) && !$._isFunction(toast[key])) {
                            return false;
                        }
                    }

                    return true;
                }),
                true,
            );
        });

        it('clears toast memory when node is removed', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const toast1 = $.findOne('#toast1');
                    const toast = UI.Toast.init(toast1);
                    $.remove(toast1);

                    for (const key in toast) {
                        if ($._isObject(toast[key]) && !$._isFunction(toast[key])) {
                            return false;
                        }
                    }

                    return true;
                }),
                true,
            );
        });
    });

    describe('#hide', function() {
        it('hides the toast', async function() {
            await exec((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1).hide();
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#toast1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="toast" id="toast1" style="display: none !important;">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>' +
                    '<div class="toast show" id="toast2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('hides the toast (data-ui-dismiss)', async function() {
            await exec((_) => {
                $.click('#button1');
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#toast1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="toast" id="toast1" style="display: none !important;">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>' +
                    '<div class="toast show" id="toast2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('hides the toast (query)', async function() {
            await exec((_) => {
                $('#toast1').toast('hide');
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#toast1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="toast" id="toast1" style="display: none !important;">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>' +
                    '<div class="toast show" id="toast2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('hides multiple toasts (query)', async function() {
            await exec((_) => {
                $('.toast').toast('hide');
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="toast" id="toast1" style="display: none !important;">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>' +
                    '<div class="toast" id="toast2" style="display: none !important;">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('does not remove the toast after hiding', async function() {
            await exec((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1).hide();
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getData('#toast1', 'toast') instanceof UI.Toast),
                    true,
                );
            });
        });

        it('can be called multiple times', async function() {
            await exec(async (_) => {
                const toast1 = $.findOne('#toast1');
                const toast = UI.Toast.init(toast1);
                toast.hide();
                toast.hide();
                toast.hide();
            });
        });

        it('can be called on hidden toast', async function() {
            await exec(async (_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1).hide();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#toast1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec(async (_) => {
                    const toast1 = $.findOne('#toast1');
                    UI.Toast.init(toast1).hide();
                });
            });
        });
    });

    describe('#show', function() {
        it('shows the toast', async function() {
            await exec((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1).hide();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#toast1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const toast1 = $.findOne('#toast1');
                    UI.Toast.init(toast1).show();
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#toast1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="toast show" id="toast1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>' +
                    '<div class="toast show" id="toast2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('shows the toast (query)', async function() {
            await exec((_) => {
                $('#toast1').toast('hide');
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#toast1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $('#toast1').toast('show');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#toast1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="toast show" id="toast1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>' +
                    '<div class="toast show" id="toast2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('shows multiple toasts (query)', async function() {
            await exec((_) => {
                $('.toast').toast('hide');
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#toast1');
                    $.stop('#toast2');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $('.toast').toast('show');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#toast1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="toast show" id="toast1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>' +
                    '<div class="toast show" id="toast2" style="">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('can be called multiple times', async function() {
            await exec((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1).hide();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#toast1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec(async (_) => {
                    const toast1 = $.findOne('#toast1');
                    const toast = UI.Toast.init(toast1);
                    toast.show();
                    toast.show();
                    toast.show();
                });
            });
        });

        it('can be called on shown toast', async function() {
            await exec(async (_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1).show();
            });
        });
    });

    describe('events', function() {
        it('triggers hide event', async function() {
            assert.strictEqual(
                await exec(async (_) => {
                    return await new Promise((resolve) => {
                        const toast1 = $.findOne('#toast1');
                        $.addEvent(toast1, 'hide.ui.toast', (_) => {
                            resolve($.getHTML(document.body));
                        });
                        UI.Toast.init(toast1).hide();
                    });
                }),
                '<div class="toast show" id="toast1">' +
                '<button class="btn-close" id="button1" data-ui-dismiss="toast" type="button"></button>' +
                '</div>' +
                '<div class="toast show" id="toast2">' +
                '<button class="btn-close" id="button2" data-ui-dismiss="toast" type="button"></button>' +
                '</div>',
            );
        });

        it('triggers hidden event', async function() {
            assert.strictEqual(
                await exec(async (_) => {
                    return await new Promise((resolve) => {
                        const toast1 = $.findOne('#toast1');
                        $.addEvent(toast1, 'hidden.ui.toast', (_) => {
                            resolve($.getHTML(document.body));
                        });
                        UI.Toast.init(toast1).hide();
                    });
                }),
                '<div class="toast" id="toast1" style="display: none !important;">' +
                '<button class="btn-close" id="button1" data-ui-dismiss="toast" type="button"></button>' +
                '</div>' +
                '<div class="toast show" id="toast2">' +
                '<button class="btn-close" id="button2" data-ui-dismiss="toast" type="button"></button>' +
                '</div>',
            );
        });

        it('triggers show event', async function() {
            await exec((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1).hide();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#toast1');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec(async (_) => {
                        return await new Promise((resolve) => {
                            const toast1 = $.findOne('#toast1');
                            $.addEvent(toast1, 'show.ui.toast', (_) => {
                                resolve($.getHTML(document.body));
                            });
                            UI.Toast.init(toast1).show();
                        });
                    }),
                    '<div class="toast" id="toast1" style="display: none !important;">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>' +
                    '<div class="toast show" id="toast2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('triggers shown event', async function() {
            await exec((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1).hide();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#toast1');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec(async (_) => {
                        return await new Promise((resolve) => {
                            const toast1 = $.findOne('#toast1');
                            $.addEvent(toast1, 'shown.ui.toast', (_) => {
                                resolve($.getHTML(document.body));
                            });
                            UI.Toast.init(toast1).show();
                        });
                    }),
                    '<div class="toast show" id="toast1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>' +
                    '<div class="toast show" id="toast2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('can be prevented from hiding', async function() {
            await exec(async (_) => {
                const toast1 = $.findOne('#toast1');
                $.addEvent(toast1, 'hide.ui.toast', (_) => {
                    return false;
                });
                UI.Toast.init(toast1).hide();
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="toast show" id="toast1">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>' +
                    '<div class="toast show" id="toast2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('can be prevented from hiding (prevent default)', async function() {
            await exec(async (_) => {
                const toast1 = $.findOne('#toast1');
                $.addEvent(toast1, 'hide.ui.toast', (e) => {
                    e.preventDefault();
                });
                UI.Toast.init(toast1).hide();
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="toast show" id="toast1">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>' +
                    '<div class="toast show" id="toast2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('can be prevented from showing', async function() {
            await exec((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1).hide();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#toast1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec(async (_) => {
                    const toast1 = $.findOne('#toast1');
                    $.addEvent(toast1, 'show.ui.toast', (_) => {
                        return false;
                    });
                    UI.Toast.init(toast1).show();
                });
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="toast" id="toast1" style="display: none !important;">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>' +
                    '<div class="toast show" id="toast2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('can be prevented from showing (prevent default)', async function() {
            await exec((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1).hide();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#toast1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec(async (_) => {
                    const toast1 = $.findOne('#toast1');
                    $.addEvent(toast1, 'show.ui.toast', (e) => {
                        e.preventDefault();
                    });
                    UI.Toast.init(toast1).show();
                });
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="toast" id="toast1" style="display: none !important;">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>' +
                    '<div class="toast show" id="toast2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>',
                );
            });
        });
    });

    describe('duration option', function() {
        it('works with duration option on hide', async function() {
            await exec((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1, { duration: 200 }).hide();
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#toast1')),
                    true,
                );
            });
        });

        it('works with duration option on hide (data-ui-duration)', async function() {
            await exec((_) => {
                const toast1 = $.findOne('#toast1');
                $.setDataset(toast1, { uiDuration: 200 });
                UI.Toast.init(toast1).hide();
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#toast1')),
                    true,
                );
            });
        });

        it('works with duration option on hide (query)', async function() {
            await exec((_) => {
                $('#toast1')
                    .toast({ duration: 200 })
                    .hide();
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#toast1')),
                    true,
                );
            });
        });

        it('works with duration option on show', async function() {
            await exec((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1, { duration: 200 }).hide();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#toast1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const toast1 = $.findOne('#toast1');
                    UI.Toast.init(toast1).show();
                });
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#toast1')),
                    true,
                );
            });
        });

        it('works with duration option on show (data-ui-duration)', async function() {
            await exec((_) => {
                const toast1 = $.findOne('#toast1');
                $.setDataset(toast1, { uiDuration: 200 });
                UI.Toast.init(toast1).hide();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#toast1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const toast1 = $.findOne('#toast1');
                    UI.Toast.init(toast1).show();
                });
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#toast1')),
                    true,
                );
            });
        });

        it('works with duration option on show (query)', async function() {
            await exec((_) => {
                $('#toast1')
                    .toast({ duration: 200 })
                    .hide();
                $.stop('#toast1');
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $('#toast1').toast('show');
                });
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#toast1')),
                    true,
                );
            });
        });
    });

    describe('autohide option', function() {
        it('autohides by default', async function() {
            await exec((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1).hide();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#toast1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const toast1 = $.findOne('#toast1');
                    UI.Toast.init(toast1).show();
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#toast1');
                });
            }).then(waitFor(250)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#toast1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="toast" id="toast1" style="display: none !important;">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>' +
                    '<div class="toast show" id="toast2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('works with autohide option', async function() {
            await exec((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1, { autohide: false });
            }).then(waitFor(350)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="toast show" id="toast1">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>' +
                    '<div class="toast show" id="toast2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('works with autohide option (data-ui-autohide)', async function() {
            await exec((_) => {
                const toast1 = $.findOne('#toast1');
                $.setDataset(toast1, { uiAutohide: false });
                UI.Toast.init(toast1);
            }).then(waitFor(350)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="toast show" id="toast1" data-ui-autohide="false">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>' +
                    '<div class="toast show" id="toast2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('works with autohide option (query)', async function() {
            await exec((_) => {
                $('#toast1').toast({ autohide: false });
            }).then(waitFor(350)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="toast show" id="toast1">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>' +
                    '<div class="toast show" id="toast2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>',
                );
            });
        });
    });

    describe('delay option', function() {
        it('works with delay option', async function() {
            await exec((_) => {
                const toast1 = $.findOne('#toast1');
                UI.Toast.init(toast1, { delay: 300 }).hide();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#toast1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const toast1 = $.findOne('#toast1');
                    UI.Toast.init(toast1).show();
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#toast1');
                });
            }).then(waitFor(350)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#toast1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="toast" id="toast1" style="display: none !important;">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>' +
                    '<div class="toast show" id="toast2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('works with delay option (data-ui-delay)', async function() {
            await exec((_) => {
                const toast1 = $.findOne('#toast1');
                $.setDataset(toast1, { uiDelay: 300 });
                UI.Toast.init(toast1).hide();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#toast1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const toast1 = $.findOne('#toast1');
                    UI.Toast.init(toast1).show();
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#toast1');
                });
            }).then(waitFor(350)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#toast1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="toast" id="toast1" data-ui-delay="300" style="display: none !important;">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>' +
                    '<div class="toast show" id="toast2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('works with delay option (query)', async function() {
            await exec((_) => {
                $('#toast1')
                    .toast({ delay: 300 })
                    .hide();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#toast1');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $('#toast1').toast('show');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#toast1');
                });
            }).then(waitFor(350)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#toast1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="toast" id="toast1" style="display: none !important;">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>' +
                    '<div class="toast show" id="toast2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="toast" type="button"></button>' +
                    '</div>',
                );
            });
        });
    });
});
