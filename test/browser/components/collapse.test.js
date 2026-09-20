import { expect, test } from '#test';

test.use({ reducedMotion: 'no-preference' });

test.describe('Collapse', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate(() => {
            document.body.innerHTML =
                '<button class="btn btn-secondary collapsed" id="collapse-toggle-1" data-ui-toggle="collapse" data-ui-target="#collapse1" type="button"></button>' +
                '<button class="btn btn-secondary collapsed" id="collapse-toggle-2" data-ui-toggle="collapse" data-ui-target="#collapse2" type="button"></button>' +
                '<div class="collapse" id="collapse1"><span style="display:block;width:120px;height:80px"></span></div>' +
                '<div class="collapse" id="collapse2"><span style="display:block;width:120px;height:80px"></span></div>';
        });
    });

    test.describe('#init', () => {
        for (const { name, init } of [
            {
                name: 'class',
                init: (selector) => UI.Collapse.init(document.querySelector(selector)),
            },
            {
                name: 'QuerySet',
                init: (selector) => $(selector).collapse(),
            },
        ]) {
            test(`creates a collapse (${name})`, async ({ page }) => {
                const instance = await page.evaluateHandle(init, '#collapse1');

                expect(await instance.evaluate((value) => value instanceof UI.Collapse)).toBe(true);
                expect(await page.evaluate(() =>
                    $.getData('#collapse1', 'collapse') instanceof UI.Collapse)).toBe(true);
            });
        }

        test('creates a collapse (data-ui-toggle)', async ({ page }) => {
            await page.locator('#collapse-toggle-1').click();

            expect(await page.evaluate((_) =>
                $.getData('#collapse1', 'collapse') instanceof UI.Collapse)).toBe(true);
        });
    });

    test.describe('#dispose', () => {
        for (const { name, dispose } of [
            {
                name: 'class',
                dispose: (selector) => {
                    UI.Collapse.init(document.querySelector(selector)).dispose();
                },
            },
            {
                name: 'QuerySet',
                dispose: (selector) => {
                    $(selector).collapse('dispose');
                },
            },
        ]) {
            test(`removes the collapse (${name})`, async ({ page }) => {
                await page.evaluate(dispose, '#collapse1');

                expect(await page.evaluate(() => $.hasData('#collapse1', 'collapse'))).toBe(false);
            });
        }
    });

    test.describe('#show', () => {
        for (const { name, show } of [
            {
                name: 'class',
                show: (selector) => {
                    UI.Collapse.init(document.querySelector(selector)).show();
                },
            },
            {
                name: 'QuerySet',
                show: (selector) => {
                    $(selector).collapse('show');
                },
            },
        ]) {
            test(`shows the collapse (${name})`, async ({ page }) => {
                await page.evaluate(show, '#collapse1');

                await expect(page.locator('#collapse-toggle-1')).toHaveClass('btn btn-secondary');
                await expect(page.locator('#collapse-toggle-1')).toHaveAttribute('aria-expanded', 'true');
                await expect(page.locator('#collapse1')).toHaveClass('collapse show');
                await expect(page.locator('#collapse1')).toHaveAttribute('style', '');
                await expect(page.locator('#collapse2')).toHaveClass('collapse');
            });
        }

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                const collapse = UI.Collapse.init(collapse1);
                collapse.show();
                collapse.show();
                collapse.show();
            });

            await expect(page.locator('#collapse-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#collapse1')).toHaveClass('collapse show');
        });

        test('can be called on shown collapse', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            });
            await expect(page.locator('#collapse1')).toHaveClass('collapse show');

            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            });

            await expect(page.locator('#collapse1')).toHaveClass('collapse show');
        });
    });

    test.describe('#hide', () => {
        for (const { name, show, hide } of [
            {
                name: 'class',
                show: (selector) => {
                    UI.Collapse.init(document.querySelector(selector)).show();
                },
                hide: (selector) => {
                    UI.Collapse.init(document.querySelector(selector)).hide();
                },
            },
            {
                name: 'QuerySet',
                show: (selector) => {
                    $(selector).collapse('show');
                },
                hide: (selector) => {
                    $(selector).collapse('hide');
                },
            },
        ]) {
            test(`hides the collapse (${name})`, async ({ page }) => {
                await page.evaluate(show, '#collapse1');
                await expect(page.locator('#collapse1')).toHaveClass('collapse show');

                await page.evaluate(hide, '#collapse1');

                await expect(page.locator('#collapse-toggle-1')).toHaveClass('btn btn-secondary collapsed');
                await expect(page.locator('#collapse-toggle-1')).toHaveAttribute('aria-expanded', 'false');
                await expect(page.locator('#collapse1')).toHaveClass('collapse');
                await expect(page.locator('#collapse1')).toHaveAttribute('style', '');
                await expect(page.locator('#collapse2')).toHaveClass('collapse');
            });
        }

        test('does not remove the collapse after hiding', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            });
            await expect(page.locator('#collapse1')).toHaveClass('collapse show');

            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).hide();
            });

            expect(await page.evaluate((_) =>
                $.getData('#collapse1', 'collapse') instanceof UI.Collapse)).toBe(true);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            });
            await expect(page.locator('#collapse1')).toHaveClass('collapse show');

            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                const collapse = UI.Collapse.init(collapse1);
                collapse.hide();
                collapse.hide();
                collapse.hide();
            });

            await expect(page.locator('#collapse-toggle-1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#collapse1')).toHaveClass('collapse');
        });

        test('can be called on hidden collapse', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).hide();
            });

            await expect(page.locator('#collapse1')).toHaveClass('collapse');
        });
    });

    test.describe('#toggle (show)', () => {
        for (const { name, toggle } of [
            {
                name: 'class',
                toggle: (selector) => {
                    UI.Collapse.init(document.querySelector(selector)).toggle();
                },
            },
            {
                name: 'QuerySet',
                toggle: (selector) => {
                    $(selector).collapse('toggle');
                },
            },
        ]) {
            test(`shows the collapse (${name})`, async ({ page }) => {
                await page.evaluate(toggle, '#collapse1');

                await expect(page.locator('#collapse-toggle-1')).toHaveClass('btn btn-secondary');
                await expect(page.locator('#collapse-toggle-1')).toHaveAttribute('aria-expanded', 'true');
                await expect(page.locator('#collapse1')).toHaveClass('collapse show');
                await expect(page.locator('#collapse1')).toHaveAttribute('style', '');
            });
        }

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                const collapse = UI.Collapse.init(collapse1);
                collapse.toggle();
                collapse.toggle();
                collapse.toggle();
            });

            await expect(page.locator('#collapse-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#collapse1')).toHaveClass('collapse show');
        });

        test('shows the collapse (data-ui-toggle)', async ({ page }) => {
            await page.locator('#collapse-toggle-1').click();

            await expect(page.locator('#collapse-toggle-1')).toHaveClass('btn btn-secondary');
            await expect(page.locator('#collapse-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#collapse1')).toHaveClass('collapse show');
            await expect(page.locator('#collapse1')).toHaveAttribute('style', '');
        });
    });

    test.describe('#toggle (hide)', () => {
        for (const { name, show, toggle } of [
            {
                name: 'class',
                show: (selector) => {
                    UI.Collapse.init(document.querySelector(selector)).show();
                },
                toggle: (selector) => {
                    UI.Collapse.init(document.querySelector(selector)).toggle();
                },
            },
            {
                name: 'QuerySet',
                show: (selector) => {
                    $(selector).collapse('show');
                },
                toggle: (selector) => {
                    $(selector).collapse('toggle');
                },
            },
        ]) {
            test(`hides the collapse (${name})`, async ({ page }) => {
                await page.evaluate(show, '#collapse1');
                await expect(page.locator('#collapse1')).toHaveClass('collapse show');

                await page.evaluate(toggle, '#collapse1');

                await expect(page.locator('#collapse-toggle-1')).toHaveClass('btn btn-secondary collapsed');
                await expect(page.locator('#collapse-toggle-1')).toHaveAttribute('aria-expanded', 'false');
                await expect(page.locator('#collapse1')).toHaveClass('collapse');
                await expect(page.locator('#collapse1')).toHaveAttribute('style', '');
            });
        }

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            });
            await expect(page.locator('#collapse1')).toHaveClass('collapse show');

            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                const collapse = UI.Collapse.init(collapse1);
                collapse.toggle();
                collapse.toggle();
                collapse.toggle();
            });

            await expect(page.locator('#collapse-toggle-1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#collapse1')).toHaveClass('collapse');
        });

        test('hides the collapse (data-ui-toggle)', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            });
            await expect(page.locator('#collapse1')).toHaveClass('collapse show');

            await page.locator('#collapse-toggle-1').click();

            await expect(page.locator('#collapse-toggle-1')).toHaveClass('btn btn-secondary collapsed');
            await expect(page.locator('#collapse-toggle-1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#collapse1')).toHaveClass('collapse');
            await expect(page.locator('#collapse1')).toHaveAttribute('style', '');
        });
    });

    test.describe('events', () => {
        test('triggers show event', async ({ page }) => {
            const eventTriggered = await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                let triggered = false;

                $.addEvent(collapse1, 'show.ui.collapse', (_) => {
                    triggered = true;
                });
                UI.Collapse.init(collapse1).show();

                return triggered;
            });

            expect(eventTriggered).toBe(true);
        });

        test('triggers shown event', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                window.collapseShownEventTriggered = false;

                $.addEvent(collapse1, 'shown.ui.collapse', (_) => {
                    window.collapseShownEventTriggered = true;
                });
                UI.Collapse.init(collapse1).show();
            });

            await expect(page.locator('#collapse1')).toHaveClass('collapse show');
            await expect(page.locator('#collapse-toggle-1')).toHaveClass('btn btn-secondary');
            await expect(page.locator('#collapse-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            expect(await page.evaluate((_) => window.collapseShownEventTriggered)).toBe(true);
        });

        test('triggers hide event', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            });
            await expect(page.locator('#collapse1')).toHaveClass('collapse show');

            const eventTriggered = await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                let triggered = false;

                $.addEvent(collapse1, 'hide.ui.collapse', (_) => {
                    triggered = true;
                });
                UI.Collapse.init(collapse1).hide();

                return triggered;
            });

            expect(eventTriggered).toBe(true);
        });

        test('triggers hidden event', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            });
            await expect(page.locator('#collapse1')).toHaveClass('collapse show');

            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                window.collapseHiddenEventTriggered = false;

                $.addEvent(collapse1, 'hidden.ui.collapse', (_) => {
                    window.collapseHiddenEventTriggered = true;
                });
                UI.Collapse.init(collapse1).hide();
            });

            await expect(page.locator('#collapse1')).toHaveClass('collapse');
            await expect(page.locator('#collapse-toggle-1')).toHaveClass('btn btn-secondary collapsed');
            await expect(page.locator('#collapse-toggle-1')).toHaveAttribute('aria-expanded', 'false');
            expect(await page.evaluate((_) => window.collapseHiddenEventTriggered)).toBe(true);
        });

        test('triggers show event (toggle)', async ({ page }) => {
            const eventTriggered = await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                let triggered = false;

                $.addEvent(collapse1, 'show.ui.collapse', (_) => {
                    triggered = true;
                });
                UI.Collapse.init(collapse1).toggle();

                return triggered;
            });

            expect(eventTriggered).toBe(true);
        });

        test('triggers shown event (toggle)', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                window.collapseShownEventTriggered = false;

                $.addEvent(collapse1, 'shown.ui.collapse', (_) => {
                    window.collapseShownEventTriggered = true;
                });
                UI.Collapse.init(collapse1).toggle();
            });

            await expect(page.locator('#collapse1')).toHaveClass('collapse show');
            await expect(page.locator('#collapse-toggle-1')).toHaveClass('btn btn-secondary');
            await expect(page.locator('#collapse-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            expect(await page.evaluate((_) => window.collapseShownEventTriggered)).toBe(true);
        });

        test('triggers hide event (toggle)', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            });
            await expect(page.locator('#collapse1')).toHaveClass('collapse show');

            const eventTriggered = await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                let triggered = false;

                $.addEvent(collapse1, 'hide.ui.collapse', (_) => {
                    triggered = true;
                });
                UI.Collapse.init(collapse1).toggle();

                return triggered;
            });

            expect(eventTriggered).toBe(true);
        });

        test('triggers hidden event (toggle)', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            });
            await expect(page.locator('#collapse1')).toHaveClass('collapse show');

            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                window.collapseHiddenEventTriggered = false;

                $.addEvent(collapse1, 'hidden.ui.collapse', (_) => {
                    window.collapseHiddenEventTriggered = true;
                });
                UI.Collapse.init(collapse1).toggle();
            });

            await expect(page.locator('#collapse1')).toHaveClass('collapse');
            await expect(page.locator('#collapse-toggle-1')).toHaveClass('btn btn-secondary collapsed');
            await expect(page.locator('#collapse-toggle-1')).toHaveAttribute('aria-expanded', 'false');
            expect(await page.evaluate((_) => window.collapseHiddenEventTriggered)).toBe(true);
        });

        test('can be prevented from showing', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                $.addEvent(collapse1, 'show.ui.collapse', (_) => false);
                UI.Collapse.init(collapse1).show();
            });

            await expect(page.locator('#collapse-toggle-1')).toHaveClass('btn btn-secondary collapsed');
            await expect(page.locator('#collapse-toggle-1')).not.toHaveAttribute('aria-expanded');
            await expect(page.locator('#collapse1')).toHaveClass('collapse');
        });

        test('can be prevented from showing (prevent default)', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                $.addEvent(collapse1, 'show.ui.collapse', (event) => {
                    event.preventDefault();
                });
                UI.Collapse.init(collapse1).show();
            });

            await expect(page.locator('#collapse-toggle-1')).toHaveClass('btn btn-secondary collapsed');
            await expect(page.locator('#collapse-toggle-1')).not.toHaveAttribute('aria-expanded');
            await expect(page.locator('#collapse1')).toHaveClass('collapse');
        });

        test('can be prevented from hiding', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            });
            await expect(page.locator('#collapse1')).toHaveClass('collapse show');

            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                $.addEvent(collapse1, 'hide.ui.collapse', (_) => false);
                UI.Collapse.init(collapse1).hide();
            });

            await expect(page.locator('#collapse-toggle-1')).toHaveClass('btn btn-secondary');
            await expect(page.locator('#collapse-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#collapse1')).toHaveClass('collapse show');
        });

        test('can be prevented from hiding (prevent default)', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            });
            await expect(page.locator('#collapse1')).toHaveClass('collapse show');

            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                $.addEvent(collapse1, 'hide.ui.collapse', (event) => {
                    event.preventDefault();
                });
                UI.Collapse.init(collapse1).hide();
            });

            await expect(page.locator('#collapse-toggle-1')).toHaveClass('btn btn-secondary');
            await expect(page.locator('#collapse-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#collapse1')).toHaveClass('collapse show');
        });
    });

    test.describe('parent option', () => {
        test('only hides shown collapses in the same accordion', async ({ page }) => {
            await page.evaluate((_) => {
                document.body.innerHTML =
                    '<div class="accordion" id="outer-accordion">' +
                    '<div class="collapse show" id="outer-collapse-1">' +
                    '<div class="accordion" id="inner-accordion">' +
                    '<div class="collapse show" id="inner-collapse"></div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="collapse" id="outer-collapse-2"></div>' +
                    '</div>';

                const options = { parent: '.accordion' };
                UI.Collapse.init($.findOne('#outer-collapse-1'), options);
                UI.Collapse.init($.findOne('#inner-collapse'), options);
                UI.Collapse.init($.findOne('#outer-collapse-2'), options).show();
            });

            await expect(page.locator('#outer-collapse-1')).toHaveClass('collapse');
            await expect(page.locator('#outer-collapse-2')).toHaveClass('collapse show');
            await expect(page.locator('#inner-collapse')).toHaveClass('collapse show');
        });
    });

    test.describe('trigger selectors', () => {
        test('updates an href trigger', async ({ page }) => {
            await page.evaluate((_) => {
                document.body.innerHTML =
                    '<a class="btn btn-secondary collapsed" id="collapse-toggle" data-ui-toggle="collapse" href="#collapse"></a>' +
                    '<div class="collapse" id="collapse"></div>';
            });
            await page.locator('#collapse-toggle').click();

            await expect(page.locator('#collapse-toggle')).toHaveClass('btn btn-secondary');
            await expect(page.locator('#collapse-toggle')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#collapse')).toHaveClass('collapse show');

            await page.locator('#collapse-toggle').click();

            await expect(page.locator('#collapse-toggle')).toHaveClass('btn btn-secondary collapsed');
            await expect(page.locator('#collapse-toggle')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#collapse')).toHaveClass('collapse');
        });

        test('updates a class-based multi-collapse trigger', async ({ page }) => {
            await page.evaluate((_) => {
                document.body.innerHTML =
                    '<button class="btn btn-secondary collapsed" id="collapse-toggle" data-ui-toggle="collapse" data-ui-target=".multi-collapse" type="button"></button>' +
                    '<div class="collapse multi-collapse" id="collapse1"></div>' +
                    '<div class="collapse multi-collapse" id="collapse2"></div>';
            });
            await page.locator('#collapse-toggle').click();

            await expect(page.locator('#collapse-toggle')).toHaveClass('btn btn-secondary');
            await expect(page.locator('#collapse-toggle')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#collapse1')).toContainClass('collapse multi-collapse show');
            await expect(page.locator('#collapse2')).toContainClass('collapse multi-collapse show');

            await page.locator('#collapse-toggle').click();

            await expect(page.locator('#collapse-toggle')).toHaveClass('btn btn-secondary collapsed');
            await expect(page.locator('#collapse-toggle')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#collapse1')).toContainClass('collapse multi-collapse');
            await expect(page.locator('#collapse2')).toContainClass('collapse multi-collapse');
        });

        test('normalizes mixed multi-collapse targets', async ({ page }) => {
            await page.evaluate((_) => {
                document.body.innerHTML =
                    '<button class="btn btn-secondary" id="collapse-toggle" data-ui-toggle="collapse" data-ui-target=".multi-collapse" type="button" aria-expanded="true"></button>' +
                    '<div class="collapse multi-collapse show" id="collapse1"></div>' +
                    '<div class="collapse multi-collapse" id="collapse2"></div>';
            });
            await page.locator('#collapse-toggle').click();

            await expect(page.locator('#collapse-toggle')).toHaveClass('btn btn-secondary collapsed');
            await expect(page.locator('#collapse-toggle')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#collapse1')).toContainClass('collapse multi-collapse');
            await expect(page.locator('#collapse2')).toContainClass('collapse multi-collapse');

            await page.locator('#collapse-toggle').click();

            await expect(page.locator('#collapse-toggle')).toHaveClass('btn btn-secondary');
            await expect(page.locator('#collapse-toggle')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#collapse1')).toContainClass('collapse multi-collapse show');
            await expect(page.locator('#collapse2')).toContainClass('collapse multi-collapse show');
        });
    });

    test.describe('QuerySet', () => {
        test.describe('#init', () => {
            test('creates multiple collapses', async ({ page }) => {
                expect(await page.evaluate((_) => {
                    $('div').collapse();
                    return $.find('div').every((node) =>
                        $.getData(node, 'collapse') instanceof UI.Collapse,
                    );
                })).toBe(true);
            });
        });

        test.describe('#dispose', () => {
            test('removes multiple collapses', async ({ page }) => {
                expect(await page.evaluate((_) => {
                    $('div').collapse('dispose');
                    return $.find('div').some((node) =>
                        $.hasData(node, 'collapse'),
                    );
                })).toBe(false);
            });
        });

        test.describe('#show', () => {
            test('shows multiple collapses', async ({ page }) => {
                await page.evaluate((_) => {
                    $('div').collapse('show');
                });

                await expect(page.locator('#collapse-toggle-1')).not.toHaveClass(/\bcollapsed\b/);
                await expect(page.locator('#collapse-toggle-2')).not.toHaveClass(/\bcollapsed\b/);
                await expect(page.locator('#collapse-toggle-1')).toHaveAttribute('aria-expanded', 'true');
                await expect(page.locator('#collapse-toggle-2')).toHaveAttribute('aria-expanded', 'true');
                await expect(page.locator('#collapse1')).toHaveClass(/\bshow\b/);
                await expect(page.locator('#collapse2')).toHaveClass(/\bshow\b/);
            });
        });

        test.describe('#hide', () => {
            test('hides multiple collapses', async ({ page }) => {
                await page.evaluate((_) => {
                    $('div').collapse('show');
                });
                await expect(page.locator('#collapse1')).toHaveClass('collapse show');
                await expect(page.locator('#collapse2')).toHaveClass('collapse show');

                await page.evaluate((_) => {
                    $('div').collapse('hide');
                });

                await expect(page.locator('#collapse-toggle-1')).toHaveClass(/\bcollapsed\b/);
                await expect(page.locator('#collapse-toggle-2')).toHaveClass(/\bcollapsed\b/);
                await expect(page.locator('#collapse-toggle-1')).toHaveAttribute('aria-expanded', 'false');
                await expect(page.locator('#collapse-toggle-2')).toHaveAttribute('aria-expanded', 'false');
                await expect(page.locator('#collapse1')).not.toHaveClass(/\bshow\b/);
                await expect(page.locator('#collapse2')).not.toHaveClass(/\bshow\b/);
                await expect(page.locator('#collapse1')).toHaveAttribute('style', '');
                await expect(page.locator('#collapse2')).toHaveAttribute('style', '');
            });
        });

        test.describe('#toggle (show)', () => {
            test('shows multiple collapses', async ({ page }) => {
                await page.evaluate((_) => {
                    $('div').collapse('toggle');
                });

                await expect(page.locator('#collapse-toggle-1')).not.toHaveClass(/\bcollapsed\b/);
                await expect(page.locator('#collapse-toggle-2')).not.toHaveClass(/\bcollapsed\b/);
                await expect(page.locator('#collapse-toggle-1')).toHaveAttribute('aria-expanded', 'true');
                await expect(page.locator('#collapse-toggle-2')).toHaveAttribute('aria-expanded', 'true');
                await expect(page.locator('#collapse1')).toHaveClass(/\bshow\b/);
                await expect(page.locator('#collapse2')).toHaveClass(/\bshow\b/);
            });
        });

        test.describe('#toggle (hide)', () => {
            test('hides multiple collapses', async ({ page }) => {
                await page.evaluate((_) => {
                    $('div').collapse('show');
                });
                await expect(page.locator('#collapse1')).toHaveClass('collapse show');
                await expect(page.locator('#collapse2')).toHaveClass('collapse show');

                await page.evaluate((_) => {
                    $('div').collapse('toggle');
                });

                await expect(page.locator('#collapse-toggle-1')).toHaveClass(/\bcollapsed\b/);
                await expect(page.locator('#collapse-toggle-2')).toHaveClass(/\bcollapsed\b/);
                await expect(page.locator('#collapse-toggle-1')).toHaveAttribute('aria-expanded', 'false');
                await expect(page.locator('#collapse-toggle-2')).toHaveAttribute('aria-expanded', 'false');
                await expect(page.locator('#collapse1')).not.toHaveClass(/\bshow\b/);
                await expect(page.locator('#collapse2')).not.toHaveClass(/\bshow\b/);
            });
        });
    });
});
