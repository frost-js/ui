import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'mocha';
import { waitFor } from './../helpers.js';
import { exec } from './../setup.js';

describe('Carousel', function() {
    beforeEach(async function() {
        await exec((_) => {
            $.setHTML(
                document.body,
                '<div class="carousel" id="carousel1">' +
                '<ol class="carousel-indicators">' +
                '<li class="active" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                '</ol>' +
                '<div class="carousel-inner">' +
                '<div class="carousel-item active" id="carousel1Item1"></div>' +
                '<div class="carousel-item" id="carousel1Item2"></div>' +
                '<div class="carousel-item" id="carousel1Item3"></div>' +
                '</div>' +
                '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                '</div>' +
                '<div class="carousel" id="carousel2">' +
                '<ol class="carousel-indicators">' +
                '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                '</ol>' +
                '<div class="carousel-inner">' +
                '<div class="carousel-item active" id="carousel2Item1"></div>' +
                '<div class="carousel-item" id="carousel2Item2"></div>' +
                '<div class="carousel-item" id="carousel2Item3"></div>' +
                '</div>' +
                '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                '</div>',
            );
        });
    });

    describe('#init', function() {
        it('creates an carousel', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const carousel1 = $.findOne('#carousel1');
                    return UI.Carousel.init(carousel1) instanceof UI.Carousel;
                }),
                true,
            );
        });

        it('creates an carousel (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('#carousel1').carousel();
                    return $.getData('#carousel1', 'carousel') instanceof UI.Carousel;
                }),
                true,
            );
        });

        it('creates multiple carousels (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('.carousel').carousel();
                    return $.find('.carousel').every((node) =>
                        $.getData(node, 'carousel') instanceof UI.Carousel,
                    );
                }),
                true,
            );
        });

        it('returns the carousel (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    return $('#carousel1').carousel() instanceof UI.Carousel;
                }),
                true,
            );
        });
    });

    describe('#dispose', function() {
        it('removes the carousel', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const carousel1 = $.findOne('#carousel1');
                    UI.Carousel.init(carousel1).dispose();
                    return $.hasData(carousel1, 'carousel');
                }),
                false,
            );
        });

        it('removes the carousel (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('#carousel1').carousel('dispose');
                    return $.hasData('#carousel1', 'carousel');
                }),
                false,
            );
        });

        it('removes multiple carousels (query)', async function() {
            assert.strictEqual(
                await exec((_) => {
                    $('.carousel').carousel('dispose');
                    return $.find('.carousel').some((node) =>
                        $.hasData(node, 'carousel'),
                    );
                }),
                false,
            );
        });

        it('clears carousel memory', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const carousel1 = $.findOne('#carousel1');
                    const carousel = UI.Carousel.init(carousel1);
                    carousel.dispose();

                    for (const key in carousel) {
                        if ($._isObject(carousel[key]) && !$._isFunction(carousel[key])) {
                            return false;
                        }
                    }

                    return true;
                }),
                true,
            );
        });

        it('clears carousel memory when node is removed', async function() {
            assert.strictEqual(
                await exec((_) => {
                    const carousel1 = $.findOne('#carousel1');
                    const carousel = UI.Carousel.init(carousel1);
                    $.remove(carousel1);

                    for (const key in carousel) {
                        if ($._isObject(carousel[key]) && !$._isFunction(carousel[key])) {
                            return false;
                        }
                    }

                    return true;
                }),
                true,
            );
        });
    });

    describe('#cycle', function() {
        it('shows the next item', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).cycle();
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item2')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1" class="active"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item active" id="carousel1Item2" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item3"></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('shows the next item (query)', async function() {
            await exec((_) => {
                $('#carousel1').carousel('cycle');
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item2')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1" class="active"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item active" id="carousel1Item2" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item3"></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('shows the next item for multiple carousels (query)', async function() {
            await exec((_) => {
                $('.carousel').carousel('cycle');
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1" class="active"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item active" id="carousel1Item2" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item3"></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1" class="active"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel2Item1" style=""></div>' +
                    '<div class="carousel-item active" id="carousel2Item2" style=""></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('can be called multiple times', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                const carousel = UI.Carousel.init(carousel1);
                carousel.cycle();
                carousel.cycle();
                carousel.cycle();
            });
        });

        it('wraps around to first item', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).show(2);
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#carousel1Item3');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const carousel1 = $.findOne('#carousel1');
                    UI.Carousel.init(carousel1).cycle();
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2" class=""></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item2"></div>' +
                    '<div class="carousel-item" id="carousel1Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });
    });

    describe('#show', function() {
        it('shows a specified item', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).show(2);
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item3')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2" class="active"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item2"></div>' +
                    '<div class="carousel-item active" id="carousel1Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('shows a specified item (data-ui-slide-to)', async function() {
            await exec((_) => {
                $.click('#carousel1Slide2');
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item3')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2" class="active"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item2"></div>' +
                    '<div class="carousel-item active" id="carousel1Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('shows a specified item (query)', async function() {
            await exec((_) => {
                $('#carousel1').carousel('show', 2);
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item3')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2" class="active"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item2"></div>' +
                    '<div class="carousel-item active" id="carousel1Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('shows a specified item for multiple carousels (query)', async function() {
            await exec((_) => {
                $('.carousel').carousel('show', 2);
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2" class="active"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item2"></div>' +
                    '<div class="carousel-item active" id="carousel1Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2" class="active"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel2Item1" style=""></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item active" id="carousel2Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('can be called on current item', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).show(0);
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => !$.hasAnimation('#carousel1Item1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel1Item1"></div>' +
                    '<div class="carousel-item" id="carousel1Item2"></div>' +
                    '<div class="carousel-item" id="carousel1Item3"></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('can be called with invalid item', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).show(3);
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => !$.hasAnimation('#carousel1Item1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel1Item1"></div>' +
                    '<div class="carousel-item" id="carousel1Item2"></div>' +
                    '<div class="carousel-item" id="carousel1Item3"></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('can be called multiple times', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                const carousel = UI.Carousel.init(carousel1);
                carousel.show(1);
                carousel.show(1);
                carousel.show(1);
            });
        });
    });

    describe('#slide', function() {
        it('slides forwards', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).slide(1);
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item2')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1" class="active"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item active" id="carousel1Item2" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item3"></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('slides forwards (query)', async function() {
            await exec((_) => {
                $('#carousel1').carousel('slide', 1);
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item2')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1" class="active"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item active" id="carousel1Item2" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item3"></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('slides forwards for multiple carousels (query)', async function() {
            await exec((_) => {
                $('.carousel').carousel('slide', 1);
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1" class="active"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item active" id="carousel1Item2" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item3"></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1" class="active"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel2Item1" style=""></div>' +
                    '<div class="carousel-item active" id="carousel2Item2" style=""></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('slides backwards', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).show(2);
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#carousel1Item3');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const carousel1 = $.findOne('#carousel1');
                    UI.Carousel.init(carousel1).slide(-1);
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item2')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1" class="active"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2" class=""></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item active" id="carousel1Item2" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('slides backwards (query)', async function() {
            await exec((_) => {
                $('#carousel1').carousel('show', 2);
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#carousel1Item3');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $('#carousel1').carousel('slide', -1);
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item2')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1" class="active"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2" class=""></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item active" id="carousel1Item2" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('slides backwards for multiple carousels (query)', async function() {
            await exec((_) => {
                $('.carousel').carousel('show', 2);
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#carousel1Item3');
                    $.stop('#carousel2Item3');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $('.carousel').carousel('slide', -1);
                });
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1" class="active"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2" class=""></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item active" id="carousel1Item2" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1" class="active"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2" class=""></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel2Item1" style=""></div>' +
                    '<div class="carousel-item active" id="carousel2Item2" style=""></div>' +
                    '<div class="carousel-item" id="carousel2Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('can be called multiple times', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                const carousel = UI.Carousel.init(carousel1);
                carousel.slide(1);
                carousel.slide(1);
                carousel.slide(1);
            });
        });

        it('wraps around to first item', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).show(2);
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#carousel1Item3');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const carousel1 = $.findOne('#carousel1');
                    UI.Carousel.init(carousel1).slide(1);
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2" class=""></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item2"></div>' +
                    '<div class="carousel-item" id="carousel1Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('wraps around to last item', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).slide(-1);
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item3')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2" class="active"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item2"></div>' +
                    '<div class="carousel-item active" id="carousel1Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });
    });

    describe('#next', function() {
        it('shows the next item', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).next();
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item2')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1" class="active"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item active" id="carousel1Item2" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item3"></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('shows the next item (data-ui-slide)', async function() {
            await exec((_) => {
                $.click('#carousel1Next');
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item2')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1" class="active"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item active" id="carousel1Item2" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item3"></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('shows the next item (query)', async function() {
            await exec((_) => {
                $('#carousel1').carousel('next');
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item2')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1" class="active"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item active" id="carousel1Item2" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item3"></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('shows the next item for multiple carousels (query)', async function() {
            await exec((_) => {
                $('.carousel').carousel('next');
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1" class="active"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item active" id="carousel1Item2" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item3"></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1" class="active"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel2Item1" style=""></div>' +
                    '<div class="carousel-item active" id="carousel2Item2" style=""></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('can be called multiple times', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                const carousel = UI.Carousel.init(carousel1);
                carousel.next();
                carousel.next();
                carousel.next();
            });
        });
    });

    describe('#prev', function() {
        it('shows the previous item', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).show(2);
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#carousel1Item3');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const carousel1 = $.findOne('#carousel1');
                    UI.Carousel.init(carousel1).prev();
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item2')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1" class="active"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2" class=""></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item active" id="carousel1Item2" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('shows the previous item (data-ui-slide)', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).show(2);
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#carousel1Item3');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.click('#carousel1Prev');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item2')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1" class="active"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2" class=""></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item active" id="carousel1Item2" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('shows the previous item (query)', async function() {
            await exec((_) => {
                $('#carousel1').carousel('show', 2);
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#carousel1Item3');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $('#carousel1').carousel('prev');
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item2')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1" class="active"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2" class=""></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item active" id="carousel1Item2" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('shows the previous item for multiple carousels (query)', async function() {
            await exec((_) => {
                $('.carousel').carousel('show', 2);
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#carousel1Item3');
                    $.stop('#carousel2Item3');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $('.carousel').carousel('prev');
                });
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1" class="active"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2" class=""></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item active" id="carousel1Item2" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1" class="active"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2" class=""></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel2Item1" style=""></div>' +
                    '<div class="carousel-item active" id="carousel2Item2" style=""></div>' +
                    '<div class="carousel-item" id="carousel2Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('can be called multiple times', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                const carousel = UI.Carousel.init(carousel1);
                carousel.prev();
                carousel.prev();
                carousel.prev();
            });
        });
    });

    describe('events', function() {
        it('triggers slide event', async function() {
            assert.strictEqual(
                await exec(async (_) => {
                    return await new Promise((resolve) => {
                        const carousel1 = $.findOne('#carousel1');
                        $.addEvent(carousel1, 'slide.ui.carousel', (_) => {
                            resolve($.getHTML(document.body));
                        });
                        UI.Carousel.init(carousel1).cycle();
                    });
                }),
                '<div class="carousel" id="carousel1">' +
                '<ol class="carousel-indicators">' +
                '<li class="active" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                '</ol>' +
                '<div class="carousel-inner">' +
                '<div class="carousel-item active" id="carousel1Item1"></div>' +
                '<div class="carousel-item" id="carousel1Item2"></div>' +
                '<div class="carousel-item" id="carousel1Item3"></div>' +
                '</div>' +
                '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                '</div>' +
                '<div class="carousel" id="carousel2">' +
                '<ol class="carousel-indicators">' +
                '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                '</ol>' +
                '<div class="carousel-inner">' +
                '<div class="carousel-item active" id="carousel2Item1"></div>' +
                '<div class="carousel-item" id="carousel2Item2"></div>' +
                '<div class="carousel-item" id="carousel2Item3"></div>' +
                '</div>' +
                '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                '</div>',
            );
        });

        it('triggers slid event', async function() {
            assert.strictEqual(
                await exec(async (_) => {
                    return await new Promise((resolve) => {
                        const carousel1 = $.findOne('#carousel1');
                        $.addEvent(carousel1, 'slid.ui.carousel', (_) => {
                            resolve($.getHTML(document.body));
                        });
                        UI.Carousel.init(carousel1).cycle();
                    });
                }),
                '<div class="carousel" id="carousel1">' +
                '<ol class="carousel-indicators">' +
                '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                '<li id="carousel1Slide1" data-ui-slide-to="1" class="active"></li>' +
                '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                '</ol>' +
                '<div class="carousel-inner">' +
                '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                '<div class="carousel-item active" id="carousel1Item2" style=""></div>' +
                '<div class="carousel-item" id="carousel1Item3"></div>' +
                '</div>' +
                '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                '</div>' +
                '<div class="carousel" id="carousel2">' +
                '<ol class="carousel-indicators">' +
                '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                '</ol>' +
                '<div class="carousel-inner">' +
                '<div class="carousel-item active" id="carousel2Item1"></div>' +
                '<div class="carousel-item" id="carousel2Item2"></div>' +
                '<div class="carousel-item" id="carousel2Item3"></div>' +
                '</div>' +
                '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                '</div>',
            );
        });

        it('triggers slide event (show)', async function() {
            assert.strictEqual(
                await exec(async (_) => {
                    return await new Promise((resolve) => {
                        const carousel1 = $.findOne('#carousel1');
                        $.addEvent(carousel1, 'slide.ui.carousel', (_) => {
                            resolve($.getHTML(document.body));
                        });
                        UI.Carousel.init(carousel1).show(1);
                    });
                }),
                '<div class="carousel" id="carousel1">' +
                '<ol class="carousel-indicators">' +
                '<li class="active" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                '</ol>' +
                '<div class="carousel-inner">' +
                '<div class="carousel-item active" id="carousel1Item1"></div>' +
                '<div class="carousel-item" id="carousel1Item2"></div>' +
                '<div class="carousel-item" id="carousel1Item3"></div>' +
                '</div>' +
                '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                '</div>' +
                '<div class="carousel" id="carousel2">' +
                '<ol class="carousel-indicators">' +
                '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                '</ol>' +
                '<div class="carousel-inner">' +
                '<div class="carousel-item active" id="carousel2Item1"></div>' +
                '<div class="carousel-item" id="carousel2Item2"></div>' +
                '<div class="carousel-item" id="carousel2Item3"></div>' +
                '</div>' +
                '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                '</div>',
            );
        });

        it('triggers slid event (show)', async function() {
            assert.strictEqual(
                await exec(async (_) => {
                    return await new Promise((resolve) => {
                        const carousel1 = $.findOne('#carousel1');
                        $.addEvent(carousel1, 'slid.ui.carousel', (_) => {
                            resolve($.getHTML(document.body));
                        });
                        UI.Carousel.init(carousel1).show(1);
                    });
                }),
                '<div class="carousel" id="carousel1">' +
                '<ol class="carousel-indicators">' +
                '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                '<li id="carousel1Slide1" data-ui-slide-to="1" class="active"></li>' +
                '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                '</ol>' +
                '<div class="carousel-inner">' +
                '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                '<div class="carousel-item active" id="carousel1Item2" style=""></div>' +
                '<div class="carousel-item" id="carousel1Item3"></div>' +
                '</div>' +
                '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                '</div>' +
                '<div class="carousel" id="carousel2">' +
                '<ol class="carousel-indicators">' +
                '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                '</ol>' +
                '<div class="carousel-inner">' +
                '<div class="carousel-item active" id="carousel2Item1"></div>' +
                '<div class="carousel-item" id="carousel2Item2"></div>' +
                '<div class="carousel-item" id="carousel2Item3"></div>' +
                '</div>' +
                '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                '</div>',
            );
        });

        it('triggers slide event (slide)', async function() {
            assert.strictEqual(
                await exec(async (_) => {
                    return await new Promise((resolve) => {
                        const carousel1 = $.findOne('#carousel1');
                        $.addEvent(carousel1, 'slide.ui.carousel', (_) => {
                            resolve($.getHTML(document.body));
                        });
                        UI.Carousel.init(carousel1).slide(1);
                    });
                }),
                '<div class="carousel" id="carousel1">' +
                '<ol class="carousel-indicators">' +
                '<li class="active" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                '</ol>' +
                '<div class="carousel-inner">' +
                '<div class="carousel-item active" id="carousel1Item1"></div>' +
                '<div class="carousel-item" id="carousel1Item2"></div>' +
                '<div class="carousel-item" id="carousel1Item3"></div>' +
                '</div>' +
                '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                '</div>' +
                '<div class="carousel" id="carousel2">' +
                '<ol class="carousel-indicators">' +
                '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                '</ol>' +
                '<div class="carousel-inner">' +
                '<div class="carousel-item active" id="carousel2Item1"></div>' +
                '<div class="carousel-item" id="carousel2Item2"></div>' +
                '<div class="carousel-item" id="carousel2Item3"></div>' +
                '</div>' +
                '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                '</div>',
            );
        });

        it('triggers slid event (slide)', async function() {
            assert.strictEqual(
                await exec(async (_) => {
                    return await new Promise((resolve) => {
                        const carousel1 = $.findOne('#carousel1');
                        $.addEvent(carousel1, 'slid.ui.carousel', (_) => {
                            resolve($.getHTML(document.body));
                        });
                        UI.Carousel.init(carousel1).slide(1);
                    });
                }),
                '<div class="carousel" id="carousel1">' +
                '<ol class="carousel-indicators">' +
                '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                '<li id="carousel1Slide1" data-ui-slide-to="1" class="active"></li>' +
                '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                '</ol>' +
                '<div class="carousel-inner">' +
                '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                '<div class="carousel-item active" id="carousel1Item2" style=""></div>' +
                '<div class="carousel-item" id="carousel1Item3"></div>' +
                '</div>' +
                '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                '</div>' +
                '<div class="carousel" id="carousel2">' +
                '<ol class="carousel-indicators">' +
                '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                '</ol>' +
                '<div class="carousel-inner">' +
                '<div class="carousel-item active" id="carousel2Item1"></div>' +
                '<div class="carousel-item" id="carousel2Item2"></div>' +
                '<div class="carousel-item" id="carousel2Item3"></div>' +
                '</div>' +
                '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                '</div>',
            );
        });

        it('triggers slide event (next)', async function() {
            assert.strictEqual(
                await exec(async (_) => {
                    return await new Promise((resolve) => {
                        const carousel1 = $.findOne('#carousel1');
                        $.addEvent(carousel1, 'slide.ui.carousel', (_) => {
                            resolve($.getHTML(document.body));
                        });
                        UI.Carousel.init(carousel1).next();
                    });
                }),
                '<div class="carousel" id="carousel1">' +
                '<ol class="carousel-indicators">' +
                '<li class="active" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                '</ol>' +
                '<div class="carousel-inner">' +
                '<div class="carousel-item active" id="carousel1Item1"></div>' +
                '<div class="carousel-item" id="carousel1Item2"></div>' +
                '<div class="carousel-item" id="carousel1Item3"></div>' +
                '</div>' +
                '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                '</div>' +
                '<div class="carousel" id="carousel2">' +
                '<ol class="carousel-indicators">' +
                '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                '</ol>' +
                '<div class="carousel-inner">' +
                '<div class="carousel-item active" id="carousel2Item1"></div>' +
                '<div class="carousel-item" id="carousel2Item2"></div>' +
                '<div class="carousel-item" id="carousel2Item3"></div>' +
                '</div>' +
                '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                '</div>',
            );
        });

        it('triggers slid event (next)', async function() {
            assert.strictEqual(
                await exec(async (_) => {
                    return await new Promise((resolve) => {
                        const carousel1 = $.findOne('#carousel1');
                        $.addEvent(carousel1, 'slid.ui.carousel', (_) => {
                            resolve($.getHTML(document.body));
                        });
                        UI.Carousel.init(carousel1).next();
                    });
                }),
                '<div class="carousel" id="carousel1">' +
                '<ol class="carousel-indicators">' +
                '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                '<li id="carousel1Slide1" data-ui-slide-to="1" class="active"></li>' +
                '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                '</ol>' +
                '<div class="carousel-inner">' +
                '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                '<div class="carousel-item active" id="carousel1Item2" style=""></div>' +
                '<div class="carousel-item" id="carousel1Item3"></div>' +
                '</div>' +
                '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                '</div>' +
                '<div class="carousel" id="carousel2">' +
                '<ol class="carousel-indicators">' +
                '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                '</ol>' +
                '<div class="carousel-inner">' +
                '<div class="carousel-item active" id="carousel2Item1"></div>' +
                '<div class="carousel-item" id="carousel2Item2"></div>' +
                '<div class="carousel-item" id="carousel2Item3"></div>' +
                '</div>' +
                '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                '</div>',
            );
        });

        it('triggers slide event (prev)', async function() {
            assert.strictEqual(
                await exec(async (_) => {
                    return await new Promise((resolve) => {
                        const carousel1 = $.findOne('#carousel1');
                        $.addEvent(carousel1, 'slide.ui.carousel', (_) => {
                            resolve($.getHTML(document.body));
                        });
                        UI.Carousel.init(carousel1).prev();
                    });
                }),
                '<div class="carousel" id="carousel1">' +
                '<ol class="carousel-indicators">' +
                '<li class="active" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                '</ol>' +
                '<div class="carousel-inner">' +
                '<div class="carousel-item active" id="carousel1Item1"></div>' +
                '<div class="carousel-item" id="carousel1Item2"></div>' +
                '<div class="carousel-item" id="carousel1Item3"></div>' +
                '</div>' +
                '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                '</div>' +
                '<div class="carousel" id="carousel2">' +
                '<ol class="carousel-indicators">' +
                '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                '</ol>' +
                '<div class="carousel-inner">' +
                '<div class="carousel-item active" id="carousel2Item1"></div>' +
                '<div class="carousel-item" id="carousel2Item2"></div>' +
                '<div class="carousel-item" id="carousel2Item3"></div>' +
                '</div>' +
                '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                '</div>',
            );
        });

        it('triggers slid event (prev)', async function() {
            assert.strictEqual(
                await exec(async (_) => {
                    return await new Promise((resolve) => {
                        const carousel1 = $.findOne('#carousel1');
                        $.addEvent(carousel1, 'slid.ui.carousel', (_) => {
                            resolve($.getHTML(document.body));
                        });
                        UI.Carousel.init(carousel1).prev();
                    });
                }),
                '<div class="carousel" id="carousel1">' +
                '<ol class="carousel-indicators">' +
                '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                '<li id="carousel1Slide2" data-ui-slide-to="2" class="active"></li>' +
                '</ol>' +
                '<div class="carousel-inner">' +
                '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                '<div class="carousel-item" id="carousel1Item2"></div>' +
                '<div class="carousel-item active" id="carousel1Item3" style=""></div>' +
                '</div>' +
                '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                '</div>' +
                '<div class="carousel" id="carousel2">' +
                '<ol class="carousel-indicators">' +
                '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                '</ol>' +
                '<div class="carousel-inner">' +
                '<div class="carousel-item active" id="carousel2Item1"></div>' +
                '<div class="carousel-item" id="carousel2Item2"></div>' +
                '<div class="carousel-item" id="carousel2Item3"></div>' +
                '</div>' +
                '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                '</div>',
            );
        });

        it('can be prevented from sliding', async function() {
            await exec(async (_) => {
                const carousel1 = $.findOne('#carousel1');
                $.addEvent(carousel1, 'slide.ui.carousel', (_) => {
                    return false;
                });
                UI.Carousel.init(carousel1).cycle();
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel1Item1"></div>' +
                    '<div class="carousel-item" id="carousel1Item2"></div>' +
                    '<div class="carousel-item" id="carousel1Item3"></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('can be prevented from sliding (prevent default)', async function() {
            await exec(async (_) => {
                const carousel1 = $.findOne('#carousel1');
                $.addEvent(carousel1, 'slide.ui.carousel', (e) => {
                    e.preventDefault();
                });
                UI.Carousel.init(carousel1).cycle();
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel1Item1"></div>' +
                    '<div class="carousel-item" id="carousel1Item2"></div>' +
                    '<div class="carousel-item" id="carousel1Item3"></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });
    });

    describe('interval option', function() {
        it('works with interval option', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1, { interval: 300 }).cycle();
            }).then(waitFor(450)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item3')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1" class=""></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2" class="active"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item2" style=""></div>' +
                    '<div class="carousel-item active" id="carousel1Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('works with interval option (data-ui-interval)', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                $.setDataset(carousel1, { uiInterval: 300 });
                UI.Carousel.init(carousel1).cycle();
            }).then(waitFor(450)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item3')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1" data-ui-interval="300">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1" class=""></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2" class="active"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item2" style=""></div>' +
                    '<div class="carousel-item active" id="carousel1Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('works with interval option (query)', async function() {
            await exec((_) => {
                $('#carousel1')
                    .carousel({ interval: 300 })
                    .cycle();
            }).then(waitFor(450)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item3')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1" class=""></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2" class="active"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item2" style=""></div>' +
                    '<div class="carousel-item active" id="carousel1Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });
    });

    describe('transition option', function() {
        it('works with transition option', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1, { transition: 200 }).cycle();
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item2')),
                    true,
                );
            });
        });

        it('works with transition option (data-ui-transition)', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                $.setDataset(carousel1, { uiTransition: 200 });
                UI.Carousel.init(carousel1).cycle();
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item2')),
                    true,
                );
            });
        });

        it('works with transition option (query)', async function() {
            await exec((_) => {
                $('#carousel1')
                    .carousel({ transition: 200 })
                    .cycle();
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item2')),
                    true,
                );
            });
        });
    });

    describe('keyboard option', function() {
        it('shows the next item on right arrow', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1);
                const event = new KeyboardEvent('keydown', {
                    code: 'ArrowRight',
                });
                carousel1.dispatchEvent(event);
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item2')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1" class="active"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item active" id="carousel1Item2" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item3"></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('shows the previous item on left arrow', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).show(2);
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#carousel1Item3');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const carousel1 = $.findOne('#carousel1');
                    const event = new KeyboardEvent('keydown', {
                        code: 'ArrowLeft',
                    });
                    carousel1.dispatchEvent(event);
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item2')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1" class="active"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2" class=""></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item active" id="carousel1Item2" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('works with keyboard option and next', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1, { keyboard: false });
                const event = new KeyboardEvent('keydown', {
                    code: 'ArrowRight',
                });
                carousel1.dispatchEvent(event);
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel1Item1"></div>' +
                    '<div class="carousel-item" id="carousel1Item2"></div>' +
                    '<div class="carousel-item" id="carousel1Item3"></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('works with keyboard option and prev', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1, { keyboard: false });
                const event = new KeyboardEvent('keydown', {
                    code: 'ArrowLeft',
                });
                carousel1.dispatchEvent(event);
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel1Item1"></div>' +
                    '<div class="carousel-item" id="carousel1Item2"></div>' +
                    '<div class="carousel-item" id="carousel1Item3"></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('works with keyboard option and next (data-ui-keyboard)', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                $.setDataset(carousel1, { uiKeyboard: false });
                UI.Carousel.init(carousel1);
                const event = new KeyboardEvent('keydown', {
                    code: 'ArrowRight',
                });
                carousel1.dispatchEvent(event);
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1" data-ui-keyboard="false">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel1Item1"></div>' +
                    '<div class="carousel-item" id="carousel1Item2"></div>' +
                    '<div class="carousel-item" id="carousel1Item3"></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('works with keyboard option and prev (data-ui-keyboard)', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                $.setDataset(carousel1, { uiKeyboard: false });
                UI.Carousel.init(carousel1);
                const event = new KeyboardEvent('keydown', {
                    code: 'ArrowLeft',
                });
                carousel1.dispatchEvent(event);
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1" data-ui-keyboard="false">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel1Item1"></div>' +
                    '<div class="carousel-item" id="carousel1Item2"></div>' +
                    '<div class="carousel-item" id="carousel1Item3"></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('works with keyboard option and next (query)', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                $(carousel1).carousel({ keyboard: false });
                const event = new KeyboardEvent('keydown', {
                    code: 'ArrowRight',
                });
                carousel1.dispatchEvent(event);
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel1Item1"></div>' +
                    '<div class="carousel-item" id="carousel1Item2"></div>' +
                    '<div class="carousel-item" id="carousel1Item3"></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('works with keyboard option and prev (query)', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                $(carousel1).carousel({ keyboard: false });
                const event = new KeyboardEvent('keydown', {
                    code: 'ArrowLeft',
                });
                carousel1.dispatchEvent(event);
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel1Item1"></div>' +
                    '<div class="carousel-item" id="carousel1Item2"></div>' +
                    '<div class="carousel-item" id="carousel1Item3"></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });
    });

    describe('pause option', function() {
        it('pauses on mouseenter', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).cycle();
            }).then(waitFor(200)).then(async (_) => {
                await exec((_) => {
                    $.triggerEvent('#carousel1', 'mouseenter');
                });
            }).then(waitFor(500)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1" class="active"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item active" id="carousel1Item2" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item3"></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('resumes on mouseleave', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).cycle();
            }).then(waitFor(200)).then(async (_) => {
                await exec((_) => {
                    $.triggerEvent('#carousel1', 'mouseenter');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.triggerEvent('#carousel1', 'mouseleave');
                });
            }).then(waitFor(200)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item3')),
                    true,
                );
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1" class=""></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2" class="active"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item2" style=""></div>' +
                    '<div class="carousel-item active" id="carousel1Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('works with pause option', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1, { pause: false }).cycle();
            }).then(waitFor(200)).then(async (_) => {
                await exec((_) => {
                    $.triggerEvent('#carousel1', 'mouseenter');
                });
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item3')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1" class=""></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2" class="active"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item2" style=""></div>' +
                    '<div class="carousel-item active" id="carousel1Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('works with pause option (data-ui-pause)', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                $.setDataset(carousel1, { uiPause: false });
                UI.Carousel.init(carousel1).cycle();
            }).then(waitFor(200)).then(async (_) => {
                await exec((_) => {
                    $.triggerEvent('#carousel1', 'mouseenter');
                });
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item3')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1" data-ui-pause="false">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1" class=""></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2" class="active"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item2" style=""></div>' +
                    '<div class="carousel-item active" id="carousel1Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('works with pause option (query)', async function() {
            await exec((_) => {
                $('#carousel1')
                    .carousel({ pause: false })
                    .cycle();
            }).then(waitFor(200)).then(async (_) => {
                await exec((_) => {
                    $.triggerEvent('#carousel1', 'mouseenter');
                });
            }).then(waitFor(150)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item3')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1" class=""></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2" class="active"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item2" style=""></div>' +
                    '<div class="carousel-item active" id="carousel1Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });
    });

    describe('wrap option', function() {
        it('wraps around to first item', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).show(2);
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#carousel1Item3');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const carousel1 = $.findOne('#carousel1');
                    UI.Carousel.init(carousel1).next();
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2" class=""></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item2"></div>' +
                    '<div class="carousel-item" id="carousel1Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('wraps around to last item', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).prev();
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item3')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2" class="active"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item2"></div>' +
                    '<div class="carousel-item active" id="carousel1Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('works with wrap option and next', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1, { wrap: false }).show(2);
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#carousel1Item3');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const carousel1 = $.findOne('#carousel1');
                    UI.Carousel.init(carousel1).next();
                });
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2" class="active"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item2"></div>' +
                    '<div class="carousel-item active" id="carousel1Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('works with wrap option and prev', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1, { wrap: false }).prev();
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel1Item1"></div>' +
                    '<div class="carousel-item" id="carousel1Item2"></div>' +
                    '<div class="carousel-item" id="carousel1Item3"></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('works with wrap option and next (data-ui-wrap)', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                $.setDataset(carousel1, { uiWrap: false });
                UI.Carousel.init(carousel1).show(2);
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#carousel1Item3');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const carousel1 = $.findOne('#carousel1');
                    UI.Carousel.init(carousel1).next();
                });
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1" data-ui-wrap="false">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2" class="active"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item2"></div>' +
                    '<div class="carousel-item active" id="carousel1Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('works with wrap option and prev (data-ui-wrap)', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                $.setDataset(carousel1, { uiWrap: false });
                UI.Carousel.init(carousel1).prev();
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1" data-ui-wrap="false">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel1Item1"></div>' +
                    '<div class="carousel-item" id="carousel1Item2"></div>' +
                    '<div class="carousel-item" id="carousel1Item3"></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('works with wrap option and next (query)', async function() {
            await exec((_) => {
                $('#carousel1')
                    .carousel({ wrap: false })
                    .show(2);
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#carousel1Item3');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $('#carousel1').carousel('next');
                });
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2" class="active"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item2"></div>' +
                    '<div class="carousel-item active" id="carousel1Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('works with wrap option and prev (query)', async function() {
            await exec((_) => {
                $('#carousel1')
                    .carousel({ wrap: false })
                    .prev();
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel1Item1"></div>' +
                    '<div class="carousel-item" id="carousel1Item2"></div>' +
                    '<div class="carousel-item" id="carousel1Item3"></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });
    });

    describe('swipe option', function() {
        it('swipes to next item', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1);

                const downEvent = new MouseEvent('mousedown', {
                    clientX: 400,
                });
                carousel1.dispatchEvent(downEvent);

                const moveEvent = new MouseEvent('mousemove', {
                    clientX: 300,
                });
                window.dispatchEvent(moveEvent);
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1" data-ui-sliding="true">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel1Item1" style="transform: translateX(-25%);"></div>' +
                    '<div class="carousel-item" id="carousel1Item2" style="display: block; transform: translateX(75%);"></div>' +
                    '<div class="carousel-item" id="carousel1Item3"></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('swipes to previous item', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1);

                const downEvent = new MouseEvent('mousedown', {
                    clientX: 400,
                });
                carousel1.dispatchEvent(downEvent);

                const moveEvent = new MouseEvent('mousemove', {
                    clientX: 500,
                });
                window.dispatchEvent(moveEvent);
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1" data-ui-sliding="true">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel1Item1" style="transform: translateX(25%);"></div>' +
                    '<div class="carousel-item" id="carousel1Item2"></div>' +
                    '<div class="carousel-item" id="carousel1Item3" style="display: block; transform: translateX(-75%);"></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('works with swipe option', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1, { swipe: false });

                const downEvent = new MouseEvent('mousedown', {
                    clientX: 400,
                });
                carousel1.dispatchEvent(downEvent);

                const moveEvent = new MouseEvent('mousemove', {
                    clientX: 500,
                });
                window.dispatchEvent(moveEvent);
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel1Item1"></div>' +
                    '<div class="carousel-item" id="carousel1Item2"></div>' +
                    '<div class="carousel-item" id="carousel1Item3"></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('works with swipe option (data-ui-swipe)', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                $.setDataset(carousel1, { uiSwipe: false });
                UI.Carousel.init(carousel1);

                const downEvent = new MouseEvent('mousedown', {
                    clientX: 400,
                });
                carousel1.dispatchEvent(downEvent);

                const moveEvent = new MouseEvent('mousemove', {
                    clientX: 500,
                });
                window.dispatchEvent(moveEvent);
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1" data-ui-swipe="false">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel1Item1"></div>' +
                    '<div class="carousel-item" id="carousel1Item2"></div>' +
                    '<div class="carousel-item" id="carousel1Item3"></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('works with swipe option (query)', async function() {
            await exec((_) => {
                $('#carousel1').carousel({ swipe: false });
                const carousel1 = $.findOne('#carousel1');

                const downEvent = new MouseEvent('mousedown', {
                    clientX: 400,
                });
                carousel1.dispatchEvent(downEvent);

                const moveEvent = new MouseEvent('mousemove', {
                    clientX: 500,
                });
                window.dispatchEvent(moveEvent);
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel1Item1"></div>' +
                    '<div class="carousel-item" id="carousel1Item2"></div>' +
                    '<div class="carousel-item" id="carousel1Item3"></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('swipes with touch events', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1);

                const downEvent = new TouchEvent('touchstart', {
                    touches: [
                        new Touch({
                            identifier: Date.now(),
                            target: carousel1,
                            pageX: 400,
                        }),
                    ],
                });
                carousel1.dispatchEvent(downEvent);

                const moveEvent = new TouchEvent('touchmove', {
                    touches: [
                        new Touch({
                            identifier: Date.now(),
                            target: window,
                            pageX: 300,
                        }),
                    ],
                });
                window.dispatchEvent(moveEvent);
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1" data-ui-sliding="true">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel1Item1" style="transform: translateX(-25%);"></div>' +
                    '<div class="carousel-item" id="carousel1Item2" style="display: block; transform: translateX(75%);"></div>' +
                    '<div class="carousel-item" id="carousel1Item3"></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('does not swipe to next item with wrap option', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1, { wrap: false }).show(2);
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    $.stop('#carousel1Item3');
                });
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const carousel1 = $.findOne('#carousel1');
                    const downEvent = new MouseEvent('mousedown', {
                        clientX: 400,
                    });
                    carousel1.dispatchEvent(downEvent);

                    const moveEvent = new MouseEvent('mousemove', {
                        clientX: 300,
                    });
                    window.dispatchEvent(moveEvent);
                });
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1" data-ui-sliding="true">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2" class="active"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item2"></div>' +
                    '<div class="carousel-item active" id="carousel1Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('does not swipe to previous item with wrap option', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1, { wrap: false });

                const downEvent = new MouseEvent('mousedown', {
                    clientX: 400,
                });
                carousel1.dispatchEvent(downEvent);

                const moveEvent = new MouseEvent('mousemove', {
                    clientX: 500,
                });
                window.dispatchEvent(moveEvent);
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1" data-ui-sliding="true">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel1Item1"></div>' +
                    '<div class="carousel-item" id="carousel1Item2"></div>' +
                    '<div class="carousel-item" id="carousel1Item3"></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('animates to next item after swiping', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1);

                const downEvent = new MouseEvent('mousedown', {
                    clientX: 400,
                });
                carousel1.dispatchEvent(downEvent);

                const moveEvent = new MouseEvent('mousemove', {
                    clientX: 250,
                });
                window.dispatchEvent(moveEvent);
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const upEvent = new MouseEvent('mouseup');
                    window.dispatchEvent(upEvent);
                });
            }).then(waitFor(50)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item2')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1" class="active"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item active" id="carousel1Item2" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item3"></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('pauses while swiping', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1);

                const downEvent = new MouseEvent('mousedown', {
                    clientX: 400,
                });
                carousel1.dispatchEvent(downEvent);

                const moveEvent = new MouseEvent('mousemove', {
                    clientX: 300,
                });
                window.dispatchEvent(moveEvent);
            }).then(waitFor(500)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1" data-ui-sliding="true">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel1Item1" style="transform: translateX(-25%);"></div>' +
                    '<div class="carousel-item" id="carousel1Item2" style="display: block; transform: translateX(75%);"></div>' +
                    '<div class="carousel-item" id="carousel1Item3"></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });
    });

    describe('cycle', function() {
        it('starts cycling (cycle)', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).cycle();
            }).then(waitFor(350)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item3')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1" class=""></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2" class="active"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item2" style=""></div>' +
                    '<div class="carousel-item active" id="carousel1Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('starts cycling (show)', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).show(1);
            }).then(waitFor(350)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item3')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1" class=""></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2" class="active"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item2" style=""></div>' +
                    '<div class="carousel-item active" id="carousel1Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('starts cycling (slide)', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).slide(1);
            }).then(waitFor(350)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item3')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1" class=""></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2" class="active"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item2" style=""></div>' +
                    '<div class="carousel-item active" id="carousel1Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('starts cycling (next)', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).next();
            }).then(waitFor(350)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item3')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1" class=""></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2" class="active"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item2" style=""></div>' +
                    '<div class="carousel-item active" id="carousel1Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('starts cycling (prev)', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1).prev();
            }).then(waitFor(350)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item1')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2" class=""></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item2"></div>' +
                    '<div class="carousel-item" id="carousel1Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });

        it('starts cycling (swipe)', async function() {
            await exec((_) => {
                const carousel1 = $.findOne('#carousel1');
                UI.Carousel.init(carousel1);

                const downEvent = new MouseEvent('mousedown', {
                    clientX: 400,
                });
                carousel1.dispatchEvent(downEvent);

                const moveEvent = new MouseEvent('mousemove', {
                    clientX: 250,
                });
                window.dispatchEvent(moveEvent);
            }).then(waitFor(50)).then(async (_) => {
                await exec((_) => {
                    const upEvent = new MouseEvent('mouseup');
                    window.dispatchEvent(upEvent);

                    const carousel1 = $.findOne('#carousel1');
                    const leaveEvent = new MouseEvent('mouseleave');
                    carousel1.dispatchEvent(leaveEvent);
                });
            }).then(waitFor(350)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.hasAnimation('#carousel1Item3')),
                    true,
                );
            }).then(waitFor(100)).then(async (_) => {
                assert.strictEqual(
                    await exec((_) => $.getHTML(document.body)),
                    '<div class="carousel" id="carousel1">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="" id="carousel1Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel1Slide1" data-ui-slide-to="1" class=""></li>' +
                    '<li id="carousel1Slide2" data-ui-slide-to="2" class="active"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item" id="carousel1Item1" style=""></div>' +
                    '<div class="carousel-item" id="carousel1Item2" style=""></div>' +
                    '<div class="carousel-item active" id="carousel1Item3" style=""></div>' +
                    '</div>' +
                    '<button id="carousel1Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel1Next" data-ui-slide="next" type="button"></button>' +
                    '</div>' +
                    '<div class="carousel" id="carousel2">' +
                    '<ol class="carousel-indicators">' +
                    '<li class="active" id="carousel2Slide0" data-ui-slide-to="0"></li>' +
                    '<li id="carousel2Slide1" data-ui-slide-to="1"></li>' +
                    '<li id="carousel2Slide2" data-ui-slide-to="2"></li>' +
                    '</ol>' +
                    '<div class="carousel-inner">' +
                    '<div class="carousel-item active" id="carousel2Item1"></div>' +
                    '<div class="carousel-item" id="carousel2Item2"></div>' +
                    '<div class="carousel-item" id="carousel2Item3"></div>' +
                    '</div>' +
                    '<button id="carousel2Prev" data-ui-slide="prev" type="button"></button>' +
                    '<button id="carousel2Next" data-ui-slide="next" type="button"></button>' +
                    '</div>',
                );
            });
        });
    });
});
