/** @import { Page } from '@playwright/test'; */

import { expect, test } from '#test';

/**
 * Creates the trigger markup for tooltip and popover tests.
 * @param {'tooltip'|'popover'} key The component's registration key.
 * @returns {(fixtures: {page: Page}) => Promise<void>} The setup hook.
 */
export function setup(key) {
    return async ({ page }) => {
        await page.evaluate((key) => {
            document.body.innerHTML = `<button class="btn btn-secondary" id="${key}-toggle-1" type="button"></button>
                <button class="btn btn-secondary" id="${key}-toggle-2" type="button"></button>`;
        }, key);
    };
}

/**
 * Registers the lifecycle and option behaviors shared by tooltips and popovers.
 * @param {object} options The component under test.
 * @param {'tooltip'|'popover'} options.key The QuerySet method and event namespace.
 * @param {'Tooltip'|'Popover'} options.component The exported component class name.
 */
export function floatingContentTests({ key, component }) {
    test.describe('#init', () => {
        test(`creates a ${key}`, async ({ page }) => {
            expect(await page.evaluate(({ key, component }) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                return UI[component].init(toggle1) instanceof UI[component];
            }, { key, component })).toBe(true);
        });

        test(`creates a ${key} (query)`, async ({ page }) => {
            expect(await page.evaluate(({ key, component }) => {
                $(`#${key}-toggle-1`)[key]();
                return $.getData(`#${key}-toggle-1`, key) instanceof UI[component];
            }, { key, component })).toBe(true);
        });

        test(`creates multiple ${key}s (query)`, async ({ page }) => {
            expect(await page.evaluate(({ key, component }) => {
                $('button')[key]();
                return $.find('button').every((node) =>
                    $.getData(node, key) instanceof UI[component],
                );
            }, { key, component })).toBe(true);
        });

        test(`returns the ${key} (query)`, async ({ page }) => {
            expect(await page.evaluate(({ key, component }) =>
                $(`#${key}-toggle-1`)[key]() instanceof UI[component], { key, component })).toBe(true);
        });
    });

    test.describe('#dispose', () => {
        test(`removes the ${key}`, async ({ page }) => {
            expect(await page.evaluate(({ key, component }) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                UI[component].init(toggle1).dispose();
                return $.hasData(toggle1, key);
            }, { key, component })).toBe(false);
        });

        test(`removes the ${key} (query)`, async ({ page }) => {
            expect(await page.evaluate(({ key }) => {
                $(`#${key}-toggle-1`)[key]('dispose');
                return $.hasData(`#${key}-toggle-1`, key);
            }, { key })).toBe(false);
        });

        test(`removes multiple ${key}s (query)`, async ({ page }) => {
            expect(await page.evaluate(({ key, component }) => {
                $('button')[key]('dispose');
                return $.find('button').some((node) =>
                    $.getData(node, key) instanceof UI[component],
                );
            }, { key, component })).toBe(false);
        });

        test('removes only its modal hide event', async ({ page }) => {
            await page.evaluate(({ key, component }) => {
                $.setHtml(
                    document.body,
                    `
                        <div class="modal" id="modal">
                            <button id="${key}-toggle-1" type="button"></button>
                            <button id="${key}-toggle-2" type="button"></button>
                        </div>
                    `,
                );

                const modal = $.findOne('#modal');
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                const toggle2 = $.findOne(`#${key}-toggle-2`);
                window.modalHideEventTriggered = false;

                $.addEvent(modal, 'hide.ui.modal', (_) => {
                    window.modalHideEventTriggered = true;
                });
                UI[component].init(toggle1);
                UI[component].init(toggle2).show();
            }, { key, component });

            await page.evaluate(({ key, component }) => {
                UI[component].init($.findOne(`#${key}-toggle-1`)).dispose();
                $.triggerEvent('#modal', 'hide.ui.modal');
            }, { key, component });

            expect(await page.evaluate((_) => window.modalHideEventTriggered)).toBe(true);
            await expect(page.locator(`.${key}`)).toHaveCount(0);
        });

        test('restores the title attribute', async ({ page }) => {
            await page.evaluate(({ key, component }) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                $.setAttribute(toggle1, { title: 'Test' });
                UI[component].init(toggle1).dispose();
            }, { key, component });

            await expect(page.locator(`#${key}-toggle-1`)).toHaveAttribute('title', 'Test');
            await expect(page.locator(`#${key}-toggle-1`)).not.toHaveAttribute('data-ui-original-title');
        });
    });

    test.describe('#hide', () => {
        test(`hides the ${key}`, async ({ page }) => {
            await page.evaluate(({ key, component }) => new Promise((resolve) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                $.addEventOnce(toggle1, `shown.ui.${key}`, (_) => resolve());
                UI[component].init(toggle1).show();
            }), { key, component });

            await page.evaluate(({ key, component }) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                UI[component].init(toggle1).hide();
            }, { key, component });

            await expect(page.locator(`.${key}`)).toHaveCount(0);
            await expect(page.locator(`#${key}-toggle-1`)).not.toHaveAttribute('aria-describedby');
            await expect(page.locator(`#${key}-toggle-1`)).not.toHaveAttribute('data-ui-placement');
        });

        test(`hides the ${key} (query)`, async ({ page }) => {
            await page.evaluate(({ key }) => new Promise((resolve) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                $.addEventOnce(toggle1, `shown.ui.${key}`, (_) => resolve());
                $(`#${key}-toggle-1`)[key]('show');
            }), { key });

            await page.evaluate(({ key }) => {
                $(`#${key}-toggle-1`)[key]('hide');
            }, { key });

            await expect(page.locator(`.${key}`)).toHaveCount(0);
        });

        test(`hides multiple ${key}s (query)`, async ({ page }) => {
            await page.evaluate(async ({ key }) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                const toggle2 = $.findOne(`#${key}-toggle-2`);
                const shown1 = new Promise((resolve) => {
                    $.addEventOnce(toggle1, `shown.ui.${key}`, (_) => resolve());
                });
                const shown2 = new Promise((resolve) => {
                    $.addEventOnce(toggle2, `shown.ui.${key}`, (_) => resolve());
                });

                $('button')[key]('show');

                await Promise.all([shown1, shown2]);
            }, { key });

            await page.evaluate(({ key }) => {
                $('button')[key]('hide');
            }, { key });

            await expect(page.locator(`.${key}`)).toHaveCount(0);
        });

        test(`does not remove the ${key} after hiding`, async ({ page }) => {
            await page.evaluate(({ key, component }) => new Promise((resolve) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                $.addEventOnce(toggle1, `shown.ui.${key}`, (_) => resolve());
                UI[component].init(toggle1).show();
            }), { key, component });

            await page.evaluate(({ key, component }) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                UI[component].init(toggle1).hide();
            }, { key, component });

            expect(await page.evaluate(({ key, component }) =>
                $.getData(`#${key}-toggle-1`, key) instanceof UI[component], { key, component })).toBe(true);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate(({ key, component }) => new Promise((resolve) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                $.addEventOnce(toggle1, `shown.ui.${key}`, (_) => resolve());
                UI[component].init(toggle1).show();
            }), { key, component });

            await page.evaluate(({ key, component }) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                const instance = UI[component].init(toggle1);
                instance.hide();
                instance.hide();
                instance.hide();
            }, { key, component });

            await expect(page.locator(`.${key}`)).toHaveCount(0);
        });

        test(`can be called on hidden ${key}`, async ({ page }) => {
            await page.evaluate(({ key, component }) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                UI[component].init(toggle1).hide();
            }, { key, component });

            await expect(page.locator(`.${key}`)).toHaveCount(0);
        });

        test('hides without animation', async ({ page }) => {
            await page.evaluate(({ key, component }) => new Promise((resolve) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                $.addEventOnce(toggle1, `shown.ui.${key}`, (_) => resolve());
                UI[component].init(toggle1, {
                    animation: false,
                }).show();
            }), { key, component });

            await page.evaluate(({ key, component }) => {
                UI[component].init($.findOne(`#${key}-toggle-1`)).hide();
            }, { key, component });

            await expect(page.locator(`.${key}`)).toHaveCount(0);
        });

        test('hides when the transition is canceled', async ({ page }) => {
            await page.evaluate(({ key, component }) => new Promise((resolve) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                $.addEventOnce(toggle1, `shown.ui.${key}`, (_) => resolve());
                UI[component].init(toggle1).show();
            }), { key, component });

            await page.evaluate(({ key, component }) => {
                UI[component].init($.findOne(`#${key}-toggle-1`)).hide();
                const transition = $.findOne(`.${key}`).getAnimations()
                    .find((animation) => animation instanceof CSSTransition);
                transition.cancel();
            }, { key, component });

            await expect(page.locator(`.${key}`)).toHaveCount(0);
        });

        test('can be interrupted by showing', async ({ page }) => {
            await page.evaluate(({ key, component }) => new Promise((resolve) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                $.addEventOnce(toggle1, `shown.ui.${key}`, (_) => resolve());
                UI[component].init(toggle1).show();
            }), { key, component });

            const events = await page.evaluate(({ key, component }) => new Promise((resolve) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                let hidden = false;

                $.addEvent(toggle1, `hidden.ui.${key}`, (_) => {
                    hidden = true;
                });
                $.addEventOnce(toggle1, `shown.ui.${key}`, (_) => {
                    resolve({ hidden, shown: true });
                });

                const instance = UI[component].init(toggle1);
                instance.hide();
                instance.show();
            }), { key, component });

            expect(events.shown).toBe(true);
            expect(events.hidden).toBe(false);
            await expect(page.locator(`.${key}`)).toHaveCSS('opacity', '1');
        });
    });

    test.describe('#toggle (show)', () => {
        test(`shows the ${key}`, async ({ page }) => {
            await page.evaluate(({ key, component }) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                UI[component].init(toggle1).toggle();
            }, { key, component });

            await expect(page.locator(`#${key}-toggle-1 + .${key}`)).toHaveClass(/\bshow\b/);
            await expect(page.locator(`#${key}-toggle-1 + .${key}`)).toBeVisible();
        });

        test(`shows the ${key} (query)`, async ({ page }) => {
            await page.evaluate(({ key }) => {
                $(`#${key}-toggle-1`)[key]('toggle');
            }, { key });

            await expect(page.locator(`#${key}-toggle-1 + .${key}`)).toHaveClass(/\bshow\b/);
            await expect(page.locator(`#${key}-toggle-1 + .${key}`)).toBeVisible();
        });

        test(`shows multiple ${key}s (query)`, async ({ page }) => {
            await page.evaluate(({ key }) => {
                $('button')[key]('toggle');
            }, { key });

            await expect(page.locator(`.${key}`)).toHaveCount(2);
            await expect(page.locator(`.${key}`).nth(0)).toHaveClass(/\bshow\b/);
            await expect(page.locator(`.${key}`).nth(1)).toHaveClass(/\bshow\b/);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate(({ key, component }) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                const instance = UI[component].init(toggle1);
                instance.toggle();
                instance.toggle();
                instance.toggle();
            }, { key, component });

            await expect(page.locator(`.${key}`)).toHaveCount(1);
        });
    });

    test.describe('#toggle (hide)', () => {
        test(`hides the ${key}`, async ({ page }) => {
            await page.evaluate(({ key, component }) => new Promise((resolve) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                $.addEventOnce(toggle1, `shown.ui.${key}`, (_) => resolve());
                UI[component].init(toggle1).show();
            }), { key, component });

            await page.evaluate(({ key, component }) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                UI[component].init(toggle1).toggle();
            }, { key, component });

            await expect(page.locator(`.${key}`)).toHaveCount(0);
        });

        test(`hides the ${key} (query)`, async ({ page }) => {
            await page.evaluate(({ key }) => new Promise((resolve) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                $.addEventOnce(toggle1, `shown.ui.${key}`, (_) => resolve());
                $(`#${key}-toggle-1`)[key]('show');
            }), { key });

            await page.evaluate(({ key }) => {
                $(`#${key}-toggle-1`)[key]('toggle');
            }, { key });

            await expect(page.locator(`.${key}`)).toHaveCount(0);
        });

        test(`hide multiple ${key}s (query)`, async ({ page }) => {
            await page.evaluate(async ({ key }) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                const toggle2 = $.findOne(`#${key}-toggle-2`);
                const shown1 = new Promise((resolve) => {
                    $.addEventOnce(toggle1, `shown.ui.${key}`, (_) => resolve());
                });
                const shown2 = new Promise((resolve) => {
                    $.addEventOnce(toggle2, `shown.ui.${key}`, (_) => resolve());
                });

                $('button')[key]('show');

                await Promise.all([shown1, shown2]);
            }, { key });

            await page.evaluate(({ key }) => {
                $('button')[key]('toggle');
            }, { key });

            await expect(page.locator(`.${key}`)).toHaveCount(0);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate(({ key, component }) => new Promise((resolve) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                $.addEventOnce(toggle1, `shown.ui.${key}`, (_) => resolve());
                UI[component].init(toggle1).show();
            }), { key, component });

            await page.evaluate(({ key, component }) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                const instance = UI[component].init(toggle1);
                instance.toggle();
                instance.toggle();
                instance.toggle();
            }, { key, component });

            await expect(page.locator(`.${key}`)).toHaveCount(0);
        });
    });

    test.describe('#disable', () => {
        test(`disables the ${key}`, async ({ page }) => {
            await page.evaluate(({ key, component }) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                const instance = UI[component].init(toggle1);
                instance.disable();
                instance.show();
            }, { key, component });

            await expect(page.locator(`.${key}`)).toHaveCount(0);
        });

        test(`disables the ${key} (query)`, async ({ page }) => {
            await page.evaluate(({ key }) => {
                $(`#${key}-toggle-1`)[key]('disable');
                $(`#${key}-toggle-1`)[key]('show');
            }, { key });

            await expect(page.locator(`.${key}`)).toHaveCount(0);
        });

        test(`disables multiple ${key}s (query)`, async ({ page }) => {
            await page.evaluate(({ key }) => {
                $('button')[key]('disable');
                $('button')[key]('show');
            }, { key });

            await expect(page.locator(`.${key}`)).toHaveCount(0);
        });

        test(`can be called on a disabled ${key}`, async ({ page }) => {
            await page.evaluate(({ key, component }) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                const instance = UI[component].init(toggle1);
                instance.disable();
                instance.disable();
                instance.show();
            }, { key, component });

            await expect(page.locator(`.${key}`)).toHaveCount(0);
        });

        test(`allows a visible ${key} to be hidden programmatically`, async ({ page }) => {
            await page.evaluate(({ key, component }) => new Promise((resolve) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                $.addEventOnce(toggle1, `shown.ui.${key}`, (_) => resolve());
                UI[component].init(toggle1).show();
            }), { key, component });

            await page.evaluate(({ key, component }) => {
                const instance = UI[component].init($.findOne(`#${key}-toggle-1`));
                instance.disable();
                instance.hide();
            }, { key, component });

            await expect(page.locator(`.${key}`)).toHaveCount(0);
        });

        test('ignores hide trigger events when disabled', async ({ page }) => {
            await page.evaluate(({ key, component }) => new Promise((resolve) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                $.addEventOnce(toggle1, `shown.ui.${key}`, (_) => resolve());
                UI[component].init(toggle1, { trigger: 'hover focus click' }).show();
            }), { key, component });

            await page.evaluate(({ key, component }) => {
                UI[component].init($.findOne(`#${key}-toggle-1`)).disable();
            }, { key, component });
            await page.locator(`#${key}-toggle-1`).dispatchEvent('mouseout');
            await page.locator(`#${key}-toggle-1`).dispatchEvent('blur');
            await page.locator(`#${key}-toggle-1`).dispatchEvent('click');

            await expect(page.locator(`.${key}`)).toHaveCount(1);
            await expect(page.locator(`.${key}`)).toHaveClass(/\bshow\b/);
            await expect(page.locator(`.${key}`)).toBeVisible();
        });
    });

    test.describe('#enable', () => {
        test(`enables the ${key}`, async ({ page }) => {
            await page.evaluate(({ key, component }) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                const instance = UI[component].init(toggle1);
                instance.disable();
                instance.enable();
                instance.show();
            }, { key, component });

            await expect(page.locator(`.${key}`)).toHaveCount(1);
            await expect(page.locator(`.${key}`)).toHaveClass(/\bshow\b/);
        });

        test(`enables the ${key} (query)`, async ({ page }) => {
            await page.evaluate(({ key }) => {
                $(`#${key}-toggle-1`)[key]('disable');
                $(`#${key}-toggle-1`)[key]('enable');
                $(`#${key}-toggle-1`)[key]('show');
            }, { key });

            await expect(page.locator(`.${key}`)).toHaveCount(1);
            await expect(page.locator(`.${key}`)).toHaveClass(/\bshow\b/);
            await expect(page.locator(`.${key}`)).toBeVisible();
        });

        test(`enables multiple ${key}s (query)`, async ({ page }) => {
            await page.evaluate(({ key }) => {
                $('button')[key]('disable');
                $('button')[key]('enable');
                $('button')[key]('show');
            }, { key });

            await expect(page.locator(`.${key}`)).toHaveCount(2);
            await expect(page.locator(`.${key}`).nth(0)).toHaveClass(/\bshow\b/);
            await expect(page.locator(`.${key}`).nth(1)).toHaveClass(/\bshow\b/);
        });

        test(`can be called on an enabled ${key}`, async ({ page }) => {
            await page.evaluate(({ key, component }) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                const instance = UI[component].init(toggle1);
                instance.enable();
                instance.enable();
                instance.show();
            }, { key, component });

            await expect(page.locator(`.${key}`)).toHaveCount(1);
            await expect(page.locator(`.${key}`)).toHaveClass(/\bshow\b/);
        });
    });

    test.describe('events', () => {
        test('triggers show event', async ({ page }) => {
            const eventTriggered = await page.evaluate(({ key, component }) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                let triggered = false;

                $.addEvent(toggle1, `show.ui.${key}`, (_) => {
                    triggered = true;
                });
                UI[component].init(toggle1).show();

                return triggered;
            }, { key, component });

            expect(eventTriggered).toBe(true);
        });

        test('triggers shown event', async ({ page }) => {
            const eventTriggered = await page.evaluate(({ key, component }) => new Promise((resolve) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);

                $.addEventOnce(toggle1, `shown.ui.${key}`, (_) => resolve(true));
                UI[component].init(toggle1).show();
            }), { key, component });

            expect(eventTriggered).toBe(true);
            await expect(page.locator(`.${key}`)).toHaveCSS('opacity', '1');
            await expect(page.locator(`.${key}`)).toHaveCount(1);
            await expect(page.locator(`.${key}`)).toHaveClass(/\bshow\b/);
        });

        test('triggers hide event', async ({ page }) => {
            await page.evaluate(({ key, component }) => new Promise((resolve) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                $.addEventOnce(toggle1, `shown.ui.${key}`, (_) => resolve());
                UI[component].init(toggle1).show();
            }), { key, component });
            const eventTriggered = await page.evaluate(({ key, component }) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                let triggered = false;

                $.addEvent(toggle1, `hide.ui.${key}`, (_) => {
                    triggered = true;
                });
                UI[component].init(toggle1).hide();

                return triggered;
            }, { key, component });

            expect(eventTriggered).toBe(true);
        });

        test('triggers hidden event', async ({ page }) => {
            await page.evaluate(({ key, component }) => new Promise((resolve) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                $.addEventOnce(toggle1, `shown.ui.${key}`, (_) => resolve());
                UI[component].init(toggle1).show();
            }), { key, component });
            const eventTriggered = await page.evaluate(({ key, component }) => new Promise((resolve) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);

                $.addEventOnce(toggle1, `hidden.ui.${key}`, (_) => resolve(true));
                UI[component].init(toggle1).hide();
            }), { key, component });

            expect(eventTriggered).toBe(true);
            await expect(page.locator(`.${key}`)).toHaveCount(0);
        });

        test('can be prevented from showing', async ({ page }) => {
            await page.evaluate(({ key, component }) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                $.addEvent(toggle1, `show.ui.${key}`, (_) => false);
                UI[component].init(toggle1).show();
            }, { key, component });

            await expect(page.locator(`.${key}`)).toHaveCount(0);
        });

        test('can be prevented from showing (prevent default)', async ({ page }) => {
            await page.evaluate(({ key, component }) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                $.addEvent(toggle1, `show.ui.${key}`, (event) => {
                    event.preventDefault();
                });
                UI[component].init(toggle1).show();
            }, { key, component });

            await expect(page.locator(`.${key}`)).toHaveCount(0);
        });

        test('can be prevented from hiding', async ({ page }) => {
            await page.evaluate(({ key, component }) => new Promise((resolve) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                $.addEventOnce(toggle1, `shown.ui.${key}`, (_) => resolve());
                UI[component].init(toggle1).show();
            }), { key, component });
            await page.evaluate(({ key, component }) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                $.addEvent(toggle1, `hide.ui.${key}`, (_) => false);
                UI[component].init(toggle1).hide();
            }, { key, component });

            await expect(page.locator(`.${key}`)).toHaveCount(1);
            await expect(page.locator(`.${key}`)).toHaveClass(/\bshow\b/);
            await expect(page.locator(`.${key}`)).toHaveCSS('opacity', '1');
        });

        test('can be prevented from hiding (prevent default)', async ({ page }) => {
            await page.evaluate(({ key, component }) => new Promise((resolve) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                $.addEventOnce(toggle1, `shown.ui.${key}`, (_) => resolve());
                UI[component].init(toggle1).show();
            }), { key, component });
            await page.evaluate(({ key, component }) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                $.addEvent(toggle1, `hide.ui.${key}`, (event) => {
                    event.preventDefault();
                });
                UI[component].init(toggle1).hide();
            }, { key, component });

            await expect(page.locator(`.${key}`)).toHaveCount(1);
            await expect(page.locator(`.${key}`)).toHaveClass(/\bshow\b/);
            await expect(page.locator(`.${key}`)).toHaveCSS('opacity', '1');
        });
    });

    test.describe('customClass option', () => {
        test('works with customClass option', async ({ page }) => {
            await page.evaluate(({ key, component }) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                UI[component].init(toggle1, { customClass: 'test' }).show();
            }, { key, component });

            await expect(page.locator(`.${key}`)).toHaveClass(/\btest\b/);
            await expect(page.locator(`.${key}`)).toHaveClass(/\bshow\b/);
        });

        test('works with customClass option (data-ui-custom-class)', async ({ page }) => {
            await page.evaluate(({ key, component }) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                $.setDataset(toggle1, { uiCustomClass: 'test' });
                UI[component].init(toggle1).show();
            }, { key, component });

            await expect(page.locator(`#${key}-toggle-1`)).toHaveAttribute('data-ui-custom-class', 'test');
            await expect(page.locator(`.${key}`)).toHaveClass(/\btest\b/);
        });

        test('works with customClass option (query)', async ({ page }) => {
            await page.evaluate(({ key }) => {
                $(`#${key}-toggle-1`)[key]({ customClass: 'test' })
                    .show();
            }, { key });

            await expect(page.locator(`.${key}`)).toHaveClass(/\btest\b/);
            await expect(page.locator(`.${key}`)).toHaveClass(/\bshow\b/);
        });
    });

    test.describe('animation option', () => {
        test('works with animation option', async ({ page }) => {
            await page.evaluate(({ key, component }) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                UI[component].init(toggle1, { animation: false }).show();
            }, { key, component });

            await expect(page.locator(`.${key}`)).not.toHaveClass(/\bfade\b/);
            await expect(page.locator(`.${key}`)).toHaveCSS('opacity', '1');
        });

        test('works with animation option (data-ui-animation)', async ({ page }) => {
            await page.evaluate(({ key, component }) => {
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                $.setDataset(toggle1, { uiAnimation: false });
                UI[component].init(toggle1).show();
            }, { key, component });

            await expect(page.locator(`#${key}-toggle-1`)).toHaveAttribute('data-ui-animation', 'false');
            await expect(page.locator(`.${key}`)).not.toHaveClass(/\bfade\b/);
        });

        test('works with animation option (query)', async ({ page }) => {
            await page.evaluate(({ key }) => {
                $(`#${key}-toggle-1`)[key]({ animation: false })
                    .show();
            }, { key });

            await expect(page.locator(`.${key}`)).not.toHaveClass(/\bfade\b/);
            await expect(page.locator(`.${key}`)).toHaveCSS('opacity', '1');
        });
    });

    test.describe('appendTo option', () => {
        test('works with appendTo option', async ({ page }) => {
            await page.evaluate(({ key, component }) => {
                const testContainer = $.create('div', { class: 'test' });
                $.append(document.body, testContainer);
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                UI[component].init(toggle1, { appendTo: '.test' }).show();
            }, { key, component });

            await expect(page.locator(`.test > .${key}`)).toHaveCount(1);
            await expect(page.locator(`.test > .${key}`)).toHaveClass(/\bshow\b/);
            await expect(page.locator(`#${key}-toggle-1 + .${key}`)).toHaveCount(0);
        });

        test('works with appendTo option (data-ui-append-to)', async ({ page }) => {
            await page.evaluate(({ key, component }) => {
                const testContainer = $.create('div', { class: 'test' });
                $.append(document.body, testContainer);
                const toggle1 = $.findOne(`#${key}-toggle-1`);
                $.setDataset(toggle1, { uiAppendTo: '.test' });
                UI[component].init(toggle1).show();
            }, { key, component });

            await expect(page.locator(`#${key}-toggle-1`)).toHaveAttribute('data-ui-append-to', '.test');
            await expect(page.locator(`.test > .${key}`)).toHaveCount(1);
            await expect(page.locator(`.test > .${key}`)).toHaveClass(/\bshow\b/);
        });

        test('works with appendTo option (query)', async ({ page }) => {
            await page.evaluate(({ key }) => {
                const testContainer = $.create('div', { class: 'test' });
                $.append(document.body, testContainer);
                $(`#${key}-toggle-1`)[key]({ appendTo: '.test' })
                    .show();
            }, { key });

            await expect(page.locator(`.test > .${key}`)).toHaveCount(1);
            await expect(page.locator(`.test > .${key}`)).toBeVisible();
        });
    });
}
