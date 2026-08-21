import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'mocha';
import { waitFor } from './../helpers.js';
import { exec } from './../setup.js';

describe('Modal', function() {
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
                '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                '<div class="modal" id="modal1">' +
                '<div class="modal-dialog" id="modalDialog1">' +
                '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                '</div>' +
                '</div>' +
                '<div class="modal" id="modal2">' +
                '<div class="modal-dialog" id="modalDialog2">' +
                '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                '</div>' +
                '</div>',
            );
        });
    });

    describe('#init', function() {
        it('creates a modal', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const modal1 = $.findOne('#modal1');
                    return UI.Modal.init(modal1) instanceof UI.Modal;
                }),
                true,
            );
        });

        it('creates a modal (data-ui-toggle)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $.click('#modalToggle1');
                    return $.getData('#modal1', 'modal') instanceof UI.Modal;
                }),
                true,
            );
        });

        it('creates a modal (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('#modal1').modal();
                    return $.getData('#modal1', 'modal') instanceof UI.Modal;
                }),
                true,
            );
        });

        it('returns the modal (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    return $('#modal1').modal() instanceof UI.Modal;
                }),
                true,
            );
        });
    });

    describe('#dispose', function() {
        it('removes the modal', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const modal1 = $.findOne('#modal1');
                    UI.Modal.init(modal1).dispose();
                    return $.hasData(modal1, 'modal');
                }),
                false,
            );
        });

        it('removes the modal (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('#modal1').modal('dispose');
                    return $.hasData('#modal1', 'modal');
                }),
                false,
            );
        });

        it('clears modal memory', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const modal1 = $.findOne('#modal1');
                    const modal = UI.Modal.init(modal1);
                    modal.dispose();

                    for (const key in modal) {
                        if ($._isObject(modal[key]) && !$._isFunction(modal[key])) {
                            return false;
                        }
                    }

                    return true;
                }),
                true,
            );
        });

        it('clears modal memory when node is removed', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const modal1 = $.findOne('#modal1');
                    const modal = UI.Modal.init(modal1);
                    $.setHTML(document.body, '');
                    // $.remove(modal1);

                    for (const key in modal) {
                        if ($._isObject(modal[key]) && !$._isFunction(modal[key])) {
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
        it('shows the modal', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#modalDialog1') && $.hasAnimation('.modal-backdrop')),
                    true,
                );
            }).then(waitFor(175)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal show" id="modal1" aria-hidden="false" aria-modal="true">' +
                    '<div class="modal-dialog" id="modalDialog1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal2">' +
                    '<div class="modal-dialog" id="modalDialog2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal-backdrop" style=""></div>',
                );
            });
        });

        it('shows the modal (data-ui-toggle)', async function() {
            await exec((_) => {
                $.click('#modalToggle1');
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#modalDialog1') && $.hasAnimation('.modal-backdrop')),
                    true,
                );
            }).then(waitFor(175)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal show" id="modal1" aria-hidden="false" aria-modal="true">' +
                    '<div class="modal-dialog" id="modalDialog1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal2">' +
                    '<div class="modal-dialog" id="modalDialog2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal-backdrop" style=""></div>',
                );
            });
        });

        it('shows the modal (query)', async function() {
            await exec((_) => {
                $('#modal1').modal('show');
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#modalDialog1') && $.hasAnimation('.modal-backdrop')),
                    true,
                );
            }).then(waitFor(175)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal show" id="modal1" aria-hidden="false" aria-modal="true">' +
                    '<div class="modal-dialog" id="modalDialog1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal2">' +
                    '<div class="modal-dialog" id="modalDialog2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal-backdrop" style=""></div>',
                );
            });
        });

        it('can be called multiple times', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                const modal = UI.Modal.init(modal1);
                modal.show();
                modal.show();
                modal.show();
            });
        });

        it('can be called on shown modal', async function() {
            await exec(async (_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const modal1 = $.findOne('#modal1');
                    UI.Modal.init(modal1).show();
                });
            });
        });

        it('allows modals to stack', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const modal2 = $.findOne('#modal2');
                    UI.Modal.init(modal2).show();
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog2');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => {
                        return $.getHTML(document.body);
                    }),
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal show" id="modal1" aria-hidden="false" aria-modal="true">' +
                    '<div class="modal-dialog" id="modalDialog1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal show" id="modal2" aria-hidden="false" aria-modal="true" style="z-index: 1080;">' +
                    '<div class="modal-dialog" id="modalDialog2" style="">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal-backdrop" style=""></div>' +
                    '<div class="modal-backdrop" style="z-index: 1070;"></div>',
                );
            });
        });
    });

    describe('#hide', function() {
        it('hides the modal', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const modal1 = $.findOne('#modal1');
                    UI.Modal.init(modal1).hide();
                });
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#modalDialog1') && $.hasAnimation('.modal-backdrop')),
                    true,
                );
            }).then(waitFor(175)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal" id="modal1" aria-hidden="true" aria-modal="false">' +
                    '<div class="modal-dialog" id="modalDialog1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal2">' +
                    '<div class="modal-dialog" id="modalDialog2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('hides the modal (data-ui-dismiss)', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.click('#button1');
                });
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#modalDialog1') && $.hasAnimation('.modal-backdrop')),
                    true,
                );
            }).then(waitFor(175)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal" id="modal1" aria-hidden="true" aria-modal="false">' +
                    '<div class="modal-dialog" id="modalDialog1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal2">' +
                    '<div class="modal-dialog" id="modalDialog2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('hides the modal (query)', async function() {
            await exec((_) => {
                $('#modal1').modal('show');
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $('#modal1').modal('hide');
                });
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#modalDialog1') && $.hasAnimation('.modal-backdrop')),
                    true,
                );
            }).then(waitFor(175)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal" id="modal1" aria-hidden="true" aria-modal="false">' +
                    '<div class="modal-dialog" id="modalDialog1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal2">' +
                    '<div class="modal-dialog" id="modalDialog2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('does not remove the modal after hiding', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const modal1 = $.findOne('#modal1');
                    UI.Modal.init(modal1).hide();
                });
            }).then(waitFor(250)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getData('#modal1', 'modal') instanceof UI.Modal),
                    true,
                );
            });
        });

        it('can be called multiple times', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec(async (_) => {
                    const modal1 = $.findOne('#modal1');
                    const modal = UI.Modal.init(modal1);
                    modal.hide();
                    modal.hide();
                    modal.hide();
                });
            });
        });

        it('can be called on hidden modal', async function() {
            await exec(async (_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).hide();
            });
        });

        it('does not close stacked modals (data-ui-dismiss)', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const modal2 = $.findOne('#modal2');
                    UI.Modal.init(modal2).show();
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog2');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.click('#button2');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog2');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => {
                        return $.getHTML(document.body);
                    }),
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal show" id="modal1" aria-hidden="false" aria-modal="true">' +
                    '<div class="modal-dialog" id="modalDialog1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal2" aria-hidden="true" aria-modal="false" style="">' +
                    '<div class="modal-dialog" id="modalDialog2" style="">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal-backdrop" style=""></div>',
                );
            });
        });
    });

    describe('#toggle (show)', function() {
        it('shows the modal', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).toggle();
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#modalDialog1') && $.hasAnimation('.modal-backdrop')),
                    true,
                );
            }).then(waitFor(175)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal show" id="modal1" aria-hidden="false" aria-modal="true">' +
                    '<div class="modal-dialog" id="modalDialog1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal2">' +
                    '<div class="modal-dialog" id="modalDialog2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal-backdrop" style=""></div>',
                );
            });
        });

        it('shows the modal (query)', async function() {
            await exec((_) => {
                $('#modal1').modal('toggle');
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#modalDialog1') && $.hasAnimation('.modal-backdrop')),
                    true,
                );
            }).then(waitFor(175)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal show" id="modal1" aria-hidden="false" aria-modal="true">' +
                    '<div class="modal-dialog" id="modalDialog1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal2">' +
                    '<div class="modal-dialog" id="modalDialog2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal-backdrop" style=""></div>',
                );
            });
        });

        it('can be called multiple times', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                const modal = UI.Modal.init(modal1);
                modal.toggle();
                modal.toggle();
                modal.toggle();
            });
        });
    });

    describe('#toggle (hide)', function() {
        it('hides the modal', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const modal1 = $.findOne('#modal1');
                    UI.Modal.init(modal1).toggle();
                });
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#modalDialog1') && $.hasAnimation('.modal-backdrop')),
                    true,
                );
            }).then(waitFor(175)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal" id="modal1" aria-hidden="true" aria-modal="false">' +
                    '<div class="modal-dialog" id="modalDialog1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal2">' +
                    '<div class="modal-dialog" id="modalDialog2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('hides the modal (query)', async function() {
            await exec((_) => {
                $('#modal1').modal('show');
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $('#modal1').modal('toggle');
                });
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#modalDialog1') && $.hasAnimation('.modal-backdrop')),
                    true,
                );
            }).then(waitFor(175)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal" id="modal1" aria-hidden="true" aria-modal="false">' +
                    '<div class="modal-dialog" id="modalDialog1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal2">' +
                    '<div class="modal-dialog" id="modalDialog2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('can be called multiple times', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec(async (_) => {
                    const modal1 = $.findOne('#modal1');
                    const modal = UI.Modal.init(modal1);
                    modal.toggle();
                    modal.toggle();
                    modal.toggle();
                });
            });
        });
    });

    describe('events', function() {
        it('triggers show event', async function() {
            assert.strictEqual(
                await exec(async (_) => {
                    return await new Promise((resolve) => {
                        const modal1 = $.findOne('#modal1');
                        $.addEvent(modal1, 'show.ui.modal', (_) => {
                            resolve($.getHTML(document.body));
                        });
                        UI.Modal.init(modal1).show();
                    });
                }),
                '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                '<div class="modal" id="modal1">' +
                '<div class="modal-dialog" id="modalDialog1">' +
                '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                '</div>' +
                '</div>' +
                '<div class="modal" id="modal2">' +
                '<div class="modal-dialog" id="modalDialog2">' +
                '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                '</div>' +
                '</div>',
            );
        });

        it('triggers shown event', async function() {
            assert.strictEqual(
                await exec(async (_) => {
                    return await new Promise((resolve) => {
                        const modal1 = $.findOne('#modal1');
                        $.addEvent(modal1, 'shown.ui.modal', (_) => {
                            resolve($.getHTML(document.body));
                        });
                        UI.Modal.init(modal1).show();
                    });
                }),
                '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                '<div class="modal show" id="modal1" aria-hidden="false" aria-modal="true">' +
                '<div class="modal-dialog" id="modalDialog1" style="">' +
                '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                '</div>' +
                '</div>' +
                '<div class="modal" id="modal2">' +
                '<div class="modal-dialog" id="modalDialog2">' +
                '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                '</div>' +
                '</div>' +
                '<div class="modal-backdrop" style=""></div>',
            );
        });

        it('triggers hide event', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec(async (_) => {
                        return await new Promise((resolve) => {
                            const modal1 = $.findOne('#modal1');
                            $.addEvent(modal1, 'hide.ui.modal', (_) => {
                                resolve($.getHTML(document.body));
                            });
                            UI.Modal.init(modal1).hide();
                        });
                    }),
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal show" id="modal1" aria-hidden="false" aria-modal="true">' +
                    '<div class="modal-dialog" id="modalDialog1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal2">' +
                    '<div class="modal-dialog" id="modalDialog2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal-backdrop" style=""></div>',
                );
            });
        });

        it('triggers hidden event', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec(async (_) => {
                        return await new Promise((resolve) => {
                            const modal1 = $.findOne('#modal1');
                            $.addEvent(modal1, 'hidden.ui.modal', (_) => {
                                resolve($.getHTML(document.body));
                            });
                            UI.Modal.init(modal1).hide();
                        });
                    }),
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal" id="modal1" aria-hidden="true" aria-modal="false">' +
                    '<div class="modal-dialog" id="modalDialog1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal2">' +
                    '<div class="modal-dialog" id="modalDialog2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('triggers show event (toggle)', async function() {
            assert.strictEqual(
                await exec(async (_) => {
                    return await new Promise((resolve) => {
                        const modal1 = $.findOne('#modal1');
                        $.addEvent(modal1, 'show.ui.modal', (_) => {
                            resolve($.getHTML(document.body));
                        });
                        UI.Modal.init(modal1).toggle();
                    });
                }),
                '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                '<div class="modal" id="modal1">' +
                '<div class="modal-dialog" id="modalDialog1">' +
                '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                '</div>' +
                '</div>' +
                '<div class="modal" id="modal2">' +
                '<div class="modal-dialog" id="modalDialog2">' +
                '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                '</div>' +
                '</div>',
            );
        });

        it('triggers shown event (toggle)', async function() {
            assert.strictEqual(
                await exec(async (_) => {
                    return await new Promise((resolve) => {
                        const modal1 = $.findOne('#modal1');
                        $.addEvent(modal1, 'shown.ui.modal', (_) => {
                            resolve($.getHTML(document.body));
                        });
                        UI.Modal.init(modal1).toggle();
                    });
                }),
                '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                '<div class="modal show" id="modal1" aria-hidden="false" aria-modal="true">' +
                '<div class="modal-dialog" id="modalDialog1" style="">' +
                '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                '</div>' +
                '</div>' +
                '<div class="modal" id="modal2">' +
                '<div class="modal-dialog" id="modalDialog2">' +
                '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                '</div>' +
                '</div>' +
                '<div class="modal-backdrop" style=""></div>',
            );
        });

        it('triggers hide event (toggle)', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec(async (_) => {
                        return await new Promise((resolve) => {
                            const modal1 = $.findOne('#modal1');
                            $.addEvent(modal1, 'hide.ui.modal', (_) => {
                                resolve($.getHTML(document.body));
                            });
                            UI.Modal.init(modal1).toggle();
                        });
                    }),
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal show" id="modal1" aria-hidden="false" aria-modal="true">' +
                    '<div class="modal-dialog" id="modalDialog1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal2">' +
                    '<div class="modal-dialog" id="modalDialog2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal-backdrop" style=""></div>',
                );
            });
        });

        it('triggers hidden event (toggle)', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec(async (_) => {
                        return await new Promise((resolve) => {
                            const modal1 = $.findOne('#modal1');
                            $.addEvent(modal1, 'hidden.ui.modal', (_) => {
                                resolve($.getHTML(document.body));
                            });
                            UI.Modal.init(modal1).toggle();
                        });
                    }),
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal" id="modal1" aria-hidden="true" aria-modal="false">' +
                    '<div class="modal-dialog" id="modalDialog1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal2">' +
                    '<div class="modal-dialog" id="modalDialog2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('can be prevented from showing', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                $.addEvent(modal1, 'show.ui.modal', (_) => {
                    return false;
                });
                UI.Modal.init(modal1).show();
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal" id="modal1">' +
                    '<div class="modal-dialog" id="modalDialog1">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal2">' +
                    '<div class="modal-dialog" id="modalDialog2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('can be prevented from showing (prevent default)', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                $.addEvent(modal1, 'show.ui.modal', (e) => {
                    e.preventDefault();
                });
                UI.Modal.init(modal1).show();
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal" id="modal1">' +
                    '<div class="modal-dialog" id="modalDialog1">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal2">' +
                    '<div class="modal-dialog" id="modalDialog2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('can be prevented from hiding', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec(async (_) => {
                    const modal1 = $.findOne('#modal1');
                    $.addEvent(modal1, 'hide.ui.modal', (_) => {
                        return false;
                    });
                    UI.Modal.init(modal1).hide();
                });
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal show" id="modal1" aria-hidden="false" aria-modal="true">' +
                    '<div class="modal-dialog" id="modalDialog1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal2">' +
                    '<div class="modal-dialog" id="modalDialog2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal-backdrop" style=""></div>',
                );
            });
        });

        it('can be prevented from hiding (prevent default)', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec(async (_) => {
                    const modal1 = $.findOne('#modal1');
                    $.addEvent(modal1, 'hide.ui.modal', (e) => {
                        e.preventDefault();
                    });
                    UI.Modal.init(modal1).hide();
                });
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal show" id="modal1" aria-hidden="false" aria-modal="true">' +
                    '<div class="modal-dialog" id="modalDialog1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal2">' +
                    '<div class="modal-dialog" id="modalDialog2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal-backdrop" style=""></div>',
                );
            });
        });
    });

    describe('duration option', function() {
        it('works with duration option on show', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1, { duration: 200 }).show();
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#modalDialog1') && $.hasAnimation('.modal-backdrop')),
                    true,
                );
            });
        });

        it('works with duration option on show (data-ui-duration)', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                $.setDataset(modal1, { uiDuration: 200 });
                UI.Modal.init(modal1).show();
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#modalDialog1') && $.hasAnimation('.modal-backdrop')),
                    true,
                );
            });
        });

        it('works with duration option on show (query)', async function() {
            await exec((_) => {
                $('#modal1')
                    .modal({ duration: 200 })
                    .show();
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#modalDialog1') && $.hasAnimation('.modal-backdrop')),
                    true,
                );
            });
        });

        it('works with duration option on hide', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1, { duration: 200 }).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const modal1 = $.findOne('#modal1');
                    UI.Modal.init(modal1).hide();
                });
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#modalDialog1') && $.hasAnimation('.modal-backdrop')),
                    true,
                );
            });
        });

        it('works with duration option on hide (data-ui-duration)', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                $.setDataset(modal1, { uiDuration: 200 });
                UI.Modal.init(modal1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const modal1 = $.findOne('#modal1');
                    UI.Modal.init(modal1).hide();
                });
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#modalDialog1') && $.hasAnimation('.modal-backdrop')),
                    true,
                );
            });
        });

        it('works with duration option on hide (query)', async function() {
            await exec((_) => {
                $('#modal1')
                    .modal({ duration: 200 })
                    .show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $('#modal1').modal('hide');
                });
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#modalDialog1') && $.hasAnimation('.modal-backdrop')),
                    true,
                );
            });
        });
    });

    describe('keyboard option', function() {
        it('hides the modal on escape', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
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
                    await exec((_) => $.hasAnimation('#modalDialog1') && $.hasAnimation('.modal-backdrop')),
                    true,
                );
            }).then(waitFor(175)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal" id="modal1" aria-hidden="true" aria-modal="false">' +
                    '<div class="modal-dialog" id="modalDialog1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal2">' +
                    '<div class="modal-dialog" id="modalDialog2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('works with keyboard option', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1, { keyboard: false }).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
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
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal show" id="modal1" aria-hidden="false" aria-modal="true">' +
                    '<div class="modal-dialog" id="modalDialog1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal2">' +
                    '<div class="modal-dialog" id="modalDialog2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal-backdrop" style=""></div>',
                );
            });
        });

        it('works with keyboard option (data-ui-keyboard)', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                $.setDataset(modal1, { uiKeyboard: false });
                UI.Modal.init(modal1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
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
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal show" id="modal1" data-ui-keyboard="false" aria-hidden="false" aria-modal="true">' +
                    '<div class="modal-dialog" id="modalDialog1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal2">' +
                    '<div class="modal-dialog" id="modalDialog2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal-backdrop" style=""></div>',
                );
            });
        });

        it('works with keyboard option (query)', async function() {
            await exec((_) => {
                $('#modal1')
                    .modal({ keyboard: false })
                    .show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
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
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal show" id="modal1" aria-hidden="false" aria-modal="true">' +
                    '<div class="modal-dialog" id="modalDialog1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal2">' +
                    '<div class="modal-dialog" id="modalDialog2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal-backdrop" style=""></div>',
                );
            });
        });
    });

    describe('show option', function() {
        it('works with show option', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1, { show: true });
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#modalDialog1') && $.hasAnimation('.modal-backdrop')),
                    true,
                );
            }).then(waitFor(175)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal show" id="modal1" aria-hidden="false" aria-modal="true">' +
                    '<div class="modal-dialog" id="modalDialog1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal2">' +
                    '<div class="modal-dialog" id="modalDialog2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal-backdrop" style=""></div>',
                );
            });
        });

        it('works with show option (data-ui-show))', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                $.setDataset(modal1, { uiShow: true });
                UI.Modal.init(modal1);
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#modalDialog1') && $.hasAnimation('.modal-backdrop')),
                    true,
                );
            }).then(waitFor(175)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal show" id="modal1" data-ui-show="true" aria-hidden="false" aria-modal="true">' +
                    '<div class="modal-dialog" id="modalDialog1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal2">' +
                    '<div class="modal-dialog" id="modalDialog2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal-backdrop" style=""></div>',
                );
            });
        });

        it('works with show option (query)', async function() {
            await exec((_) => {
                $('#modal1').modal({ show: true });
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#modalDialog1') && $.hasAnimation('.modal-backdrop')),
                    true,
                );
            }).then(waitFor(175)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal show" id="modal1" aria-hidden="false" aria-modal="true">' +
                    '<div class="modal-dialog" id="modalDialog1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal2">' +
                    '<div class="modal-dialog" id="modalDialog2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal-backdrop" style=""></div>',
                );
            });
        });

        it('works without show option', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1);
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal" id="modal1">' +
                    '<div class="modal-dialog" id="modalDialog1">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal2">' +
                    '<div class="modal-dialog" id="modalDialog2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });
    });

    describe('backdrop option', function() {
        it('works with backdrop option', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1, { backdrop: false }).show();
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#modalDialog1')),
                    true,
                );
            }).then(waitFor(175)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal show" id="modal1" aria-hidden="false" aria-modal="true">' +
                    '<div class="modal-dialog" id="modalDialog1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal2">' +
                    '<div class="modal-dialog" id="modalDialog2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('works with backdrop option (data-ui-backdrop))', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                $.setDataset(modal1, { uiBackdrop: false });
                UI.Modal.init(modal1).show();
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#modalDialog1')),
                    true,
                );
            }).then(waitFor(175)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal show" id="modal1" data-ui-backdrop="false" aria-hidden="false" aria-modal="true">' +
                    '<div class="modal-dialog" id="modalDialog1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal2">' +
                    '<div class="modal-dialog" id="modalDialog2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('works with backdrop option (query)', async function() {
            await exec((_) => {
                $('#modal1')
                    .modal({ backdrop: false })
                    .show();
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#modalDialog1')),
                    true,
                );
            }).then(waitFor(175)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal show" id="modal1" aria-hidden="false" aria-modal="true">' +
                    '<div class="modal-dialog" id="modalDialog1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal2">' +
                    '<div class="modal-dialog" id="modalDialog2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('hides the modal on document click (with backdrop)', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.click(document.body);
                });
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#modalDialog1') && $.hasAnimation('.modal-backdrop')),
                    true,
                );
            }).then(waitFor(175)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal" id="modal1" aria-hidden="true" aria-modal="false">' +
                    '<div class="modal-dialog" id="modalDialog1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal2">' +
                    '<div class="modal-dialog" id="modalDialog2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('does not hide the modal on document click (without backdrop)', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1, { backdrop: false }).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.click(document.body);
                });
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal show" id="modal1" aria-hidden="false" aria-modal="true">' +
                    '<div class="modal-dialog" id="modalDialog1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal2">' +
                    '<div class="modal-dialog" id="modalDialog2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('does not hide the modal on document click (static backdrop)', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1, { backdrop: 'static' }).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.click(document.body);
                });
            }).then(waitFor(250)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal show" id="modal1" aria-hidden="false" aria-modal="true">' +
                    '<div class="modal-dialog" id="modalDialog1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal2">' +
                    '<div class="modal-dialog" id="modalDialog2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal-backdrop" style=""></div>',
                );
            });
        });

        it('does not hide the modal on document click (mousedown on dialog)', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.triggerEvent('#modalDialog1', 'mousedown');
                    $.click(document.body);
                });
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal show" id="modal1" aria-hidden="false" aria-modal="true">' +
                    '<div class="modal-dialog" id="modalDialog1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal2">' +
                    '<div class="modal-dialog" id="modalDialog2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal-backdrop" style=""></div>',
                );
            });
        });

        it('hides the modal on dialog click (mousedown on backdrop)', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.triggerEvent('.modal-backdrop', 'mousedown');
                    $.click('#modalDialog1');
                });
            }).then(waitFor(125)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#modalDialog1') && $.hasAnimation('.modal-backdrop')),
                    true,
                );
            }).then(waitFor(175)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal" id="modal1" aria-hidden="true" aria-modal="false">' +
                    '<div class="modal-dialog" id="modalDialog1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal2">' +
                    '<div class="modal-dialog" id="modalDialog2">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>',
                );
            });
        });

        it('does not close stacked modals on document click', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const modal2 = $.findOne('#modal2');
                    UI.Modal.init(modal2).show();
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog2');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.click(document.body);
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog2');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => {
                        return $.getHTML(document.body);
                    }),
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                    '<div class="modal show" id="modal1" aria-hidden="false" aria-modal="true">' +
                    '<div class="modal-dialog" id="modalDialog1" style="">' +
                    '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal" id="modal2" aria-hidden="true" aria-modal="false" style="">' +
                    '<div class="modal-dialog" id="modalDialog2" style="">' +
                    '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                    '</div>' +
                    '</div>' +
                    '<div class="modal-backdrop" style=""></div>',
                );
            });
        });
    });

    describe('scroll padding', function() {
        it('adds scroll padding (vertical)', async function() {
            await exec((_) => {
                $.setStyle(document.body, { height: '2000px' });
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => {
                        return $.getStyle(document.body, 'padding-right');
                    }),
                    '15px',
                );
                assert.strictEqual(
                    await exec((_) => {
                        return $.getStyle('#modalDialog1', 'padding-right');
                    }),
                    '15px',
                );
            });
        });

        it('does not add padding if scrollbars are hidden (vertical)', async function() {
            await exec((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => {
                        return $.getStyle(document.body, 'padding-right');
                    }),
                    '',
                );
                assert.strictEqual(
                    await exec((_) => {
                        return $.getStyle('#modalDialog1', 'padding-right');
                    }),
                    '',
                );
            });
        });

        it('works with existing padding (vertical)', async function() {
            await exec((_) => {
                $.setStyle(document.body, {
                    height: '2000px',
                    paddingRight: '10px',
                });
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => {
                        return $.getStyle(document.body, 'padding-right');
                    }),
                    '25px',
                );
            });
        });

        it('restores scroll padding (vertical)', async function() {
            await exec((_) => {
                $.setStyle(document.body, { height: '2000px' });
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const modal1 = $.findOne('#modal1');
                    UI.Modal.init(modal1).hide();
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => {
                        return $.getStyle(document.body, 'padding-right');
                    }),
                    '',
                );
                assert.strictEqual(
                    await exec((_) => {
                        return $.getStyle('#modalDialog1', 'padding-right');
                    }),
                    '',
                );
            });
        });

        it('restores existing scroll padding to document body (vertical)', async function() {
            await exec((_) => {
                $.setStyle(document.body, {
                    height: '2000px',
                    paddingRight: '10px',
                });
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const modal1 = $.findOne('#modal1');
                    UI.Modal.init(modal1).hide();
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#modalDialog1');
                    $.stop('.modal-backdrop');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => {
                        return $.getStyle(document.body, 'padding-right');
                    }),
                    '10px',
                );
            });
        });
    });
});
