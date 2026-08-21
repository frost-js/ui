import assert from 'node:assert/strict';
import { waitFor } from './../helpers.js';
import { exec } from './../setup.js';

describe('Tooltip', function() {
    beforeEach(async function() {
        await exec((_) => {
            $.setHTML(
                document.body,
                '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
            );
        });
    });

    describe('#init', function() {
        it('creates a tooltip', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const tooltipToggle1 = $.findOne('#tooltipToggle1');
                    return UI.Tooltip.init(tooltipToggle1) instanceof UI.Tooltip;
                }),
                true,
            );
        });

        it('creates a tooltip (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('#tooltipToggle1').tooltip();
                    return $.getData('#tooltipToggle1', 'tooltip') instanceof UI.Tooltip;
                }),
                true,
            );
        });

        it('creates multiple tooltips (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('button').tooltip();
                    return $.find('button').every((node) =>
                        $.getData(node, 'tooltip') instanceof UI.Tooltip,
                    );
                }),
                true,
            );
        });

        it('returns the tooltip (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    return $('#tooltipToggle1').tooltip() instanceof UI.Tooltip;
                }),
                true,
            );
        });
    });

    describe('#dispose', function() {
        it('removes the tooltip', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const tooltipToggle1 = $.findOne('#tooltipToggle1');
                    UI.Tooltip.init(tooltipToggle1).dispose();
                    return $.hasData(tooltipToggle1, 'tooltip');
                }),
                false,
            );
        });

        it('removes the tooltip (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('#tooltipToggle1').tooltip('dispose');
                    return $.hasData('#tooltipToggle1', 'tooltip');
                }),
                false,
            );
        });

        it('removes multiple tooltips (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('button').tooltip('dispose');
                    return $.find('button').some((node) =>
                        $.getData(node, 'tooltip') instanceof UI.Tooltip,
                    );
                }),
                false,
            );
        });

        it('clears tooltip memory', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const tooltipToggle1 = $.findOne('#tooltipToggle1');
                    const tooltip = UI.Tooltip.init(tooltipToggle1);
                    tooltip.dispose();

                    for (const key in tooltip) {
                        if ($._isObject(tooltip[key]) && !$._isFunction(tooltip[key])) {
                            return false;
                        }
                    }

                    return true;
                }),
                true,
            );
        });

        it('clears tooltip memory when node is removed', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const tooltipToggle1 = $.findOne('#tooltipToggle1');
                    const tooltip = UI.Tooltip.init(tooltipToggle1);
                    $.remove(tooltipToggle1);

                    for (const key in tooltip) {
                        if ($._isObject(tooltip[key]) && !$._isFunction(tooltip[key])) {
                            return false;
                        }
                    }

                    return true;
                }),
                true,
            );
        });

        it('restores the title attribute', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const tooltipToggle1 = $.findOne('#tooltipToggle1');
                    $.setAttribute(tooltipToggle1, { title: 'Test' });
                    const tooltip = UI.Tooltip.init(tooltipToggle1);
                    tooltip.dispose();

                    return $.getHTML(document.body);
                }),
                '<button class="btn btn-secondary" id="tooltipToggle1" type="button" title="Test"></button>' +
                '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
            );
        });
    });

    describe('#show', function() {
        it('shows the tooltip', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#tooltipToggle1 + .tooltip')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 1px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: -1px; left: -12px;"></div><div class="tooltip-inner"></div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('shows the tooltip (query)', async function() {
            await exec((_) => {
                $('#tooltipToggle1').tooltip('show');
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#tooltipToggle1 + .tooltip')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 1px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: -1px; left: -12px;"></div><div class="tooltip-inner"></div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('shows multiple tooltips (query)', async function() {
            await exec((_) => {
                $('button').tooltip('show');
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 1px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: -1px; left: -12px;"></div><div class="tooltip-inner"></div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="bottom" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(19px, 12px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: -6px; left: 2px;"></div><div class="tooltip-inner"></div></div>',
                );
            });
        });

        it('can be called multiple times', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                const tooltip = UI.Tooltip.init(tooltipToggle1);
                tooltip.show();
                tooltip.show();
                tooltip.show();
            });
        });

        it('can be called on shown tooltip', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const tooltipToggle1 = $.findOne('#tooltipToggle1');
                    UI.Tooltip.init(tooltipToggle1).show();
                });
            });
        });
    });

    describe('#hide', function() {
        it('hides the tooltip', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const tooltipToggle1 = $.findOne('#tooltipToggle1');
                    UI.Tooltip.init(tooltipToggle1).hide();
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#tooltipToggle1 + .tooltip')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('hides the tooltip (query)', async function() {
            await exec((_) => {
                $('#tooltipToggle1').tooltip('show');
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $('#tooltipToggle1').tooltip('hide');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#tooltipToggle1 + .tooltip')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('hides multiple tooltips (query)', async function() {
            await exec((_) => {
                $('button').tooltip('show');
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                    $.stop('#tooltipToggle2 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $('button').tooltip('hide');
                });
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('does not remove the tooltip after hiding', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const tooltipToggle1 = $.findOne('#tooltipToggle1');
                    UI.Tooltip.init(tooltipToggle1).hide();
                });
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getData('#tooltipToggle1', 'tooltip') instanceof UI.Tooltip),
                    true,
                );
            });
        });

        it('can be called multiple times', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const tooltipToggle1 = $.findOne('#tooltipToggle1');
                    const tooltip = UI.Tooltip.init(tooltipToggle1);
                    tooltip.hide();
                    tooltip.hide();
                    tooltip.hide();
                });
            });
        });

        it('can be called on hidden tooltip', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1).hide();
            });
        });
    });

    describe('#toggle (show)', function() {
        it('shows the tooltip', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1).toggle();
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#tooltipToggle1 + .tooltip')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 1px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: -1px; left: -12px;"></div><div class="tooltip-inner"></div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('shows the tooltip (query)', async function() {
            await exec((_) => {
                $('#tooltipToggle1').tooltip('toggle');
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#tooltipToggle1 + .tooltip')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 1px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: -1px; left: -12px;"></div><div class="tooltip-inner"></div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('shows multiple tooltips (query)', async function() {
            await exec((_) => {
                $('button').tooltip('toggle');
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 1px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: -1px; left: -12px;"></div><div class="tooltip-inner"></div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="bottom" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(19px, 12px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: -6px; left: 2px;"></div><div class="tooltip-inner"></div></div>',
                );
            });
        });

        it('can be called multiple times', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                const tooltip = UI.Tooltip.init(tooltipToggle1);
                tooltip.toggle();
                tooltip.toggle();
                tooltip.toggle();
            });
        });
    });

    describe('#toggle (hide)', function() {
        it('hides the tooltip', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const tooltipToggle1 = $.findOne('#tooltipToggle1');
                    UI.Tooltip.init(tooltipToggle1).toggle();
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#tooltipToggle1 + .tooltip')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('hides the tooltip (query)', async function() {
            await exec((_) => {
                $('#tooltipToggle1').tooltip('show');
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $('#tooltipToggle1').tooltip('toggle');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#tooltipToggle1 + .tooltip')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('hide multiple tooltips (query)', async function() {
            await exec((_) => {
                $('button').tooltip('show');
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                    $.stop('#tooltipToggle2 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $('button').tooltip('toggle');
                });
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('can be called multiple times', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const tooltipToggle1 = $.findOne('#tooltipToggle1');
                    const tootip = UI.Tooltip.init(tooltipToggle1);
                    tootip.toggle();
                    tootip.toggle();
                    tootip.toggle();
                });
            });
        });
    });

    describe('#disable', function() {
        it('disables the tooltip', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                const tooltip = UI.Tooltip.init(tooltipToggle1);
                tooltip.disable();
                tooltip.show();
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('disables the tooltip (query)', async function() {
            await exec((_) => {
                $('#tooltipToggle1').tooltip('disable');
                $('#tooltipToggle1').show();
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('disables multiple tooltips (query)', async function() {
            await exec((_) => {
                $('button').tooltip('disable');
                $('button').tooltip('show');
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('can be called on a disabled tooltip', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                const tooltip = UI.Tooltip.init(tooltipToggle1);
                tooltip.disable();
                tooltip.disable();
            });
        });
    });

    describe('#enable', function() {
        it('enables the tooltip', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                const tooltip = UI.Tooltip.init(tooltipToggle1);
                tooltip.disable();
                tooltip.enable();
                tooltip.show();
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#tooltipToggle1 + .tooltip')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 1px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: -1px; left: -12px;"></div><div class="tooltip-inner"></div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('enables the tooltip (query)', async function() {
            await exec((_) => {
                $('#tooltipToggle1').tooltip('disable');
                $('#tooltipToggle1').tooltip('enable');
                $('#tooltipToggle1').tooltip('show');
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#tooltipToggle1 + .tooltip')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 1px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: -1px; left: -12px;"></div><div class="tooltip-inner"></div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('enables multiple tooltips (query)', async function() {
            await exec((_) => {
                $('button').tooltip('disable');
                $('button').tooltip('enable');
                $('button').tooltip('show');
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 1px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: -1px; left: -12px;"></div><div class="tooltip-inner"></div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="bottom" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(19px, 12px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: -6px; left: 2px;"></div><div class="tooltip-inner"></div></div>',
                );
            });
        });

        it('can be called on an enabled tooltip', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1).enable();
            });
        });
    });

    describe('#refresh', function() {
        it('refreshes the tooltip title', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => {
                        const tooltipToggle1 = $.findOne('#tooltipToggle1');
                        $.setDataset(tooltipToggle1, { uiTitle: 'Test' });
                        UI.Tooltip.init(tooltipToggle1).refresh();
                        return $.getHTML(document.body);
                    }),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button" data-ui-title="Test"></button>' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 0px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: 2px; left: -12px;"></div><div class="tooltip-inner">Test</div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('refreshes the tooltip title (query)', async function() {
            await exec((_) => {
                $('#tooltipToggle1').tooltip('show');
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => {
                        $('#tooltipToggle1')
                            .setDataset({ uiTitle: 'Test' })
                            .tooltip('refresh');
                        return $.getHTML(document.body);
                    }),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button" data-ui-title="Test"></button>' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 0px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: 2px; left: -12px;"></div><div class="tooltip-inner">Test</div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('refreshes multiple tooltips titles (query)', async function() {
            await exec((_) => {
                $('button').tooltip('show');
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                    $.stop('#tooltipToggle2 + .tooltip');
                });
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => {
                        $('button')
                            .setDataset({ uiTitle: 'Test' })
                            .tooltip('refresh');
                        return $.getHTML(document.body);
                    }),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button" data-ui-title="Test"></button>' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 0px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: 2px; left: -12px;"></div><div class="tooltip-inner">Test</div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button" data-ui-title="Test"></button>' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="bottom" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(4px, 12px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: -6px; left: 17px;"></div><div class="tooltip-inner">Test</div></div>',
                );
            });
        });
    });

    describe('events', function() {
        it('triggers show event', async function() {
            assert.strictEqual(
                await exec(async (_) => {
                    return await new Promise((resolve) => {
                        const tooltipToggle1 = $.findOne('#tooltipToggle1');
                        $.addEvent(tooltipToggle1, 'show.ui.tooltip', (_) => {
                            resolve($.getHTML(document.body));
                        });
                        UI.Tooltip.init(tooltipToggle1).show();
                    });
                }),
                '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
            );
        });

        it('triggers shown event', async function() {
            assert.strictEqual(
                await exec(async (_) => {
                    return await new Promise((resolve) => {
                        const tooltipToggle1 = $.findOne('#tooltipToggle1');
                        $.addEvent(tooltipToggle1, 'shown.ui.tooltip', (_) => {
                            resolve($.getHTML(document.body));
                        });
                        UI.Tooltip.init(tooltipToggle1).show();
                    });
                }),
                '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                '<div class="tooltip show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 1px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: -1px; left: -12px;"></div><div class="tooltip-inner"></div></div>' +
                '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
            );
        });

        it('triggers hide event', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec(async (_) => {
                        return await new Promise((resolve) => {
                            const tooltipToggle1 = $.findOne('#tooltipToggle1');
                            $.addEvent(tooltipToggle1, 'hide.ui.tooltip', (_) => {
                                resolve($.getHTML(document.body));
                            });
                            UI.Tooltip.init(tooltipToggle1).hide();
                        });
                    }),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 1px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: -1px; left: -12px;"></div><div class="tooltip-inner"></div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('triggers hidden event', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec(async (_) => {
                        return await new Promise((resolve) => {
                            const tooltipToggle1 = $.findOne('#tooltipToggle1');
                            $.addEvent(tooltipToggle1, 'hidden.ui.tooltip', (_) => {
                                resolve($.getHTML(document.body));
                            });
                            UI.Tooltip.init(tooltipToggle1).hide();
                        });
                    }),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('can be prevented from showing', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                $.addEvent(tooltipToggle1, 'show.ui.tooltip', (_) => {
                    return false;
                });
                UI.Tooltip.init(tooltipToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('can be prevented from showing (prevent default)', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                $.addEvent(tooltipToggle1, 'show.ui.tooltip', (e) => {
                    e.preventDefault();
                });
                UI.Tooltip.init(tooltipToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('can be prevented from hiding', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec(async (_) => {
                    const tooltipToggle1 = $.findOne('#tooltipToggle1');
                    $.addEvent(tooltipToggle1, 'hide.ui.tooltip', (_) => {
                        return false;
                    });
                    UI.Tooltip.init(tooltipToggle1).hide();
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 1px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: -1px; left: -12px;"></div><div class="tooltip-inner"></div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('can be prevented from hiding (prevent default)', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec(async (_) => {
                    const tooltipToggle1 = $.findOne('#tooltipToggle1');
                    $.addEvent(tooltipToggle1, 'hide.ui.tooltip', (_) => {
                        return false;
                    });
                    UI.Tooltip.init(tooltipToggle1).hide();
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 1px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: -1px; left: -12px;"></div><div class="tooltip-inner"></div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });
    });

    describe('title option', function() {
        it('works with title option', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { title: 'Test' }).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 0px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: 2px; left: -12px;"></div><div class="tooltip-inner">Test</div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('works with title option (data-ui-title)', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                $.setDataset(tooltipToggle1, { uiTitle: 'Test' });
                UI.Tooltip.init(tooltipToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button" data-ui-title="Test"></button>' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 0px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: 2px; left: -12px;"></div><div class="tooltip-inner">Test</div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('works with title option (title)', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                $.setAttribute(tooltipToggle1, { title: 'Test' });
                UI.Tooltip.init(tooltipToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button" data-ui-original-title="Test"></button>' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 0px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: 2px; left: -12px;"></div><div class="tooltip-inner">Test</div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('works with title option (query)', async function() {
            await exec((_) => {
                $('#tooltipToggle1')
                    .tooltip({ title: 'Test' })
                    .show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 0px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: 2px; left: -12px;"></div><div class="tooltip-inner">Test</div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('prioritizes dataset over setting', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                $.setDataset(tooltipToggle1, { uiTitle: 'Test' });
                UI.Tooltip.init(tooltipToggle1, { title: 'Test 2' }).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button" data-ui-title="Test"></button>' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 0px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: 2px; left: -12px;"></div><div class="tooltip-inner">Test</div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('prioritizes setting over attribute', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                $.setAttribute(tooltipToggle1, { title: 'Test 2' });
                UI.Tooltip.init(tooltipToggle1, { title: 'Test' }).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button" data-ui-original-title="Test 2"></button>' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 0px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: 2px; left: -12px;"></div><div class="tooltip-inner">Test</div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });
    });

    describe('template option', function() {
        it('works with template option', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, {
                    template: '<div class="tooltip" role="tooltip" data-test="Test"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
                }).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<div class="tooltip show" role="tooltip" data-test="Test" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 1px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: -1px; left: -12px;"></div><div class="tooltip-inner"></div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('works with template option (data-ui-template)', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                $.setDataset(tooltipToggle1, { uiTemplate: '<div class="tooltip" role="tooltip" data-test="Test"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>' });
                UI.Tooltip.init(tooltipToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button" data-ui-template="&lt;div class=&quot;tooltip&quot; role=&quot;tooltip&quot; data-test=&quot;Test&quot;&gt;&lt;div class=&quot;tooltip-arrow&quot;&gt;&lt;/div&gt;&lt;div class=&quot;tooltip-inner&quot;&gt;&lt;/div&gt;&lt;/div&gt;"></button>' +
                    '<div class="tooltip show" role="tooltip" data-test="Test" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 1px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: -1px; left: -12px;"></div><div class="tooltip-inner"></div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('works with template option (query)', async function() {
            await exec((_) => {
                $('#tooltipToggle1').tooltip({
                    template: '<div class="tooltip" role="tooltip" data-test="Test"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
                }).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<div class="tooltip show" role="tooltip" data-test="Test" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 1px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: -1px; left: -12px;"></div><div class="tooltip-inner"></div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });
    });

    describe('customClass option', function() {
        it('works with customClass option', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { customClass: 'test' }).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<div class="tooltip test show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 1px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: -1px; left: -12px;"></div><div class="tooltip-inner"></div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('works with customClass option (data-ui-custom-class)', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                $.setDataset(tooltipToggle1, { uiCustomClass: 'test' });
                UI.Tooltip.init(tooltipToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button" data-ui-custom-class="test"></button>' +
                    '<div class="tooltip test show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 1px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: -1px; left: -12px;"></div><div class="tooltip-inner"></div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('works with customClass option (query)', async function() {
            await exec((_) => {
                $('#tooltipToggle1')
                    .tooltip({ customClass: 'test' })
                    .show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<div class="tooltip test show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 1px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: -1px; left: -12px;"></div><div class="tooltip-inner"></div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });
    });

    describe('duration option', function() {
        it('works with duration option on show', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { duration: 200 }).show();
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#tooltipToggle1 + .tooltip')),
                    true,
                );
            });
        });

        it('works with duration option on show (data-ui-duration)', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                $.setDataset(tooltipToggle1, { uiDuration: 200 });
                UI.Tooltip.init(tooltipToggle1).show();
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#tooltipToggle1 + .tooltip')),
                    true,
                );
            });
        });

        it('works with duration option on show (query)', async function() {
            await exec((_) => {
                $('#tooltipToggle1')
                    .tooltip({ duration: 200 })
                    .show();
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#tooltipToggle1 + .tooltip')),
                    true,
                );
            });
        });

        it('works with duration option on hide', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { duration: 200 }).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const tooltipToggle1 = $.findOne('#tooltipToggle1');
                    UI.Tooltip.init(tooltipToggle1).hide();
                });
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#tooltipToggle1 + .tooltip')),
                    true,
                );
            });
        });

        it('works with duration option on hide (data-ui-duration)', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                $.setDataset(tooltipToggle1, { uiDuration: 200 });
                UI.Tooltip.init(tooltipToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const tooltipToggle1 = $.findOne('#tooltipToggle1');
                    UI.Tooltip.init(tooltipToggle1).hide();
                });
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#tooltipToggle1 + .tooltip')),
                    true,
                );
            });
        });

        it('works with duration option on hide (query)', async function() {
            await exec((_) => {
                $('#tooltipToggle1')
                    .tooltip({ duration: 200 })
                    .show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $('#tooltipToggle1').tooltip('hide');
                });
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#tooltipToggle1 + .tooltip')),
                    true,
                );
            });
        });
    });

    describe('html option', function() {
        it('escapes html tags', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { title: '<b>Test</b>' }).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 0px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: 2px; left: -12px;"></div><div class="tooltip-inner">&lt;b&gt;Test&lt;/b&gt;</div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('works with html option', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { title: '<b>Test</b>', html: true }).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 0px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: 2px; left: -12px;"></div><div class="tooltip-inner"><b>Test</b></div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('works with html option (data-ui-html)', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                $.setDataset(tooltipToggle1, { uiHtml: true });
                UI.Tooltip.init(tooltipToggle1, { title: '<b>Test</b>' }).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button" data-ui-html="true"></button>' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 0px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: 2px; left: -12px;"></div><div class="tooltip-inner"><b>Test</b></div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('works with html option (query)', async function() {
            await exec((_) => {
                $('#tooltipToggle1')
                    .tooltip({ title: '<b>Test</b>', html: true })
                    .show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 0px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: 2px; left: -12px;"></div><div class="tooltip-inner"><b>Test</b></div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });
    });

    describe('trigger option', function() {
        it('shows on mouseover with hover trigger option', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { trigger: 'hover' });
                $.triggerEvent(tooltipToggle1, 'mouseover');
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#tooltipToggle1 + .tooltip')),
                    true,
                );
            });
        });

        it('shows on focus with focus trigger option', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { trigger: 'focus' });
                $.triggerEvent(tooltipToggle1, 'focus');
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#tooltipToggle1 + .tooltip')),
                    true,
                );
            });
        });

        it('shows on click with click trigger option', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { trigger: 'click' });
                $.triggerEvent(tooltipToggle1, 'click');
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#tooltipToggle1 + .tooltip')),
                    true,
                );
            });
        });

        it('hides on mouseout with hover trigger option', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { trigger: 'hover' }).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.triggerEvent('#tooltipToggle1', 'mouseout');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#tooltipToggle1 + .tooltip')),
                    true,
                );
            });
        });

        it('hides on blur with focus trigger option', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { trigger: 'focus' }).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.triggerEvent('#tooltipToggle1', 'blur');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#tooltipToggle1 + .tooltip')),
                    true,
                );
            });
        });

        it('hides on click with click trigger option', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { trigger: 'click' }).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.triggerEvent('#tooltipToggle1', 'click');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#tooltipToggle1 + .tooltip')),
                    true,
                );
            });
        });

        it('does not show on mouseover without hover trigger option', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { trigger: '' });
                $.triggerEvent(tooltipToggle1, 'mouseover');
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('does not show on focus without focus trigger option', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { trigger: '' });
                $.triggerEvent(tooltipToggle1, 'focus');
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('does not show on click without click trigger option', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { trigger: '' });
                $.triggerEvent(tooltipToggle1, 'click');
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('does not hide on mouseout without hover trigger option', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { trigger: '' }).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const tooltipToggle1 = $.findOne('#tooltipToggle1');
                    $.triggerEvent(tooltipToggle1, 'mouseout');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 1px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: -1px; left: -12px;"></div><div class="tooltip-inner"></div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('does not hide on blur without focus trigger option', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { trigger: '' }).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const tooltipToggle1 = $.findOne('#tooltipToggle1');
                    $.triggerEvent(tooltipToggle1, 'blur');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 1px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: -1px; left: -12px;"></div><div class="tooltip-inner"></div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('does not hide on click without click trigger option', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { trigger: '' }).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const tooltipToggle1 = $.findOne('#tooltipToggle1');
                    $.triggerEvent(tooltipToggle1, 'click');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 1px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: -1px; left: -12px;"></div><div class="tooltip-inner"></div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('works with trigger option (data-ui-trigger)', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                $.setDataset(tooltipToggle1, { uiTrigger: 'click' });
                UI.Tooltip.init(tooltipToggle1);
                $.triggerEvent(tooltipToggle1, 'click');
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#tooltipToggle1 + .tooltip')),
                    true,
                );
            });
        });

        it('works with trigger option (query)', async function() {
            await exec((_) => {
                $('#tooltipToggle1').tooltip({ trigger: 'click' });
                $.triggerEvent('#tooltipToggle1', 'click');
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#tooltipToggle1 + .tooltip')),
                    true,
                );
            });
        });

        it('works with multiple trigger options', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { trigger: 'hover focus' });
                $.triggerEvent(tooltipToggle1, 'mouseover');
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#tooltipToggle1 + .tooltip')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                await exec((_) => {
                    const tooltipToggle1 = $.findOne('#tooltipToggle1');
                    $.triggerEvent(tooltipToggle1, 'blur');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#tooltipToggle1 + .tooltip')),
                    true,
                );
            });
        });
    });

    describe('appendTo option', function() {
        it('works with appendTo option', async function() {
            await exec((_) => {
                const test = $.create('div', { class: 'test' });
                $.append(document.body, test);
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { appendTo: '.test' }).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('.test .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>' +
                    '<div class="test">' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 1px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: -1px; left: -12px;"></div><div class="tooltip-inner"></div></div>' +
                    '</div>',
                );
            });
        });

        it('works with appendTo option (data-ui-append-to)', async function() {
            await exec((_) => {
                const test = $.create('div', { class: 'test' });
                $.append(document.body, test);
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                $.setDataset(tooltipToggle1, { uiAppendTo: '.test' });
                UI.Tooltip.init(tooltipToggle1).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('.test .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button" data-ui-append-to=".test"></button>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>' +
                    '<div class="test">' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 1px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: -1px; left: -12px;"></div><div class="tooltip-inner"></div></div>' +
                    '</div>',
                );
            });
        });

        it('works with appendTo option (query)', async function() {
            await exec((_) => {
                const test = $.create('div', { class: 'test' });
                $.append(document.body, test);
                $('#tooltipToggle1')
                    .tooltip({ appendTo: '.test' })
                    .show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('.test .tooltip');
                });
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>' +
                    '<div class="test">' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 1px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: -1px; left: -12px;"></div><div class="tooltip-inner"></div></div>' +
                    '</div>',
                );
            });
        });
    });

    describe('sanitize option', function() {
        it('sanitizes html tags', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { title: '<b data-test="Test">Test</b>', html: true }).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 0px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: 2px; left: -12px;"></div><div class="tooltip-inner"><b>Test</b></div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('works with sanitize option', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                UI.Tooltip.init(tooltipToggle1, { title: '<b data-test="Test">Test</b>', html: true, sanitize: false }).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 0px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: 2px; left: -12px;"></div><div class="tooltip-inner"><b data-test="Test">Test</b></div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('works with sanitize option (data-ui-sanitize)', async function() {
            await exec((_) => {
                const tooltipToggle1 = $.findOne('#tooltipToggle1');
                $.setDataset(tooltipToggle1, { uiSanitize: false });
                UI.Tooltip.init(tooltipToggle1, { title: '<b data-test="Test">Test</b>', html: true }).show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button" data-ui-sanitize="false"></button>' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 0px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: 2px; left: -12px;"></div><div class="tooltip-inner"><b data-test="Test">Test</b></div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });

        it('works with sanitize option (query)', async function() {
            await exec((_) => {
                $('#tooltipToggle1')
                    .tooltip({ title: '<b data-test="Test">Test</b>', html: true, sanitize: false })
                    .show();
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#tooltipToggle1 + .tooltip');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<button class="btn btn-secondary" id="tooltipToggle1" type="button"></button>' +
                    '<div class="tooltip show" role="tooltip" data-ui-placement="right" style="margin: 0px; position: absolute; top: 0px; right: initial; bottom: initial; left: 0px; transform: translate3d(20px, 0px, 0px);"><div class="tooltip-arrow" style="position: absolute; top: 2px; left: -12px;"></div><div class="tooltip-inner"><b data-test="Test">Test</b></div></div>' +
                    '<button class="btn btn-secondary" id="tooltipToggle2" type="button"></button>',
                );
            });
        });
    });
});
