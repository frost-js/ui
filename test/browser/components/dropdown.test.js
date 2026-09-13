import { expect, test } from '#test';
import { resetPage } from '../../setup/browser.js';

test.use({ reducedMotion: 'no-preference' });

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('Dropdown', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            $.setHtml(
                document.body,
                `
                    <div>
                        <button class="btn btn-secondary" id="dropdown-toggle-1" data-ui-toggle="dropdown" type="button"></button>
                        <div class="dropdown-menu fade" id="dropdown1">
                            <button class="dropdown-item" id="dropdown-1-item-1"></button>
                            <button class="dropdown-item" id="dropdown-1-item-2"></button>
                            <button class="dropdown-item" id="dropdown-1-item-3"></button>
                        </div>
                    </div>
                    <div>
                        <button class="btn btn-secondary" id="dropdown-toggle-2" data-ui-toggle="dropdown" type="button"></button>
                        <div class="dropdown-menu fade" id="dropdown2">
                            <button class="dropdown-item" id="dropdown-2-item-1"></button>
                            <button class="dropdown-item" id="dropdown-2-item-2"></button>
                            <button class="dropdown-item" id="dropdown-2-item-3"></button>
                        </div>
                    </div>
                `,
            );
        });
    });

    test.describe('#init', () => {
        test('creates a dropdown', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                return UI.Dropdown.init(dropdownToggle1) instanceof UI.Dropdown;
            })).toBe(true);
        });

        test('creates a dropdown (data-ui-toggle)', async ({ page }) => {
            await page.locator('#dropdown-toggle-1').click();

            expect(await page.evaluate((_) =>
                $.getData('#dropdown-toggle-1', 'dropdown') instanceof UI.Dropdown)).toBe(true);
        });

        test('creates a dropdown (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('#dropdown-toggle-1').dropdown();
                return $.getData('#dropdown-toggle-1', 'dropdown') instanceof UI.Dropdown;
            })).toBe(true);
        });

        test('creates multiple dropdowns (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('[data-ui-toggle="dropdown"]').dropdown();
                return $.find('[data-ui-toggle="dropdown"]').every((node) =>
                    $.getData(node, 'dropdown') instanceof UI.Dropdown,
                );
            })).toBe(true);
        });

        test('returns the dropdown (query)', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $('#dropdown-toggle-1').dropdown() instanceof UI.Dropdown)).toBe(true);
        });
    });

    test.describe('#dispose', () => {
        test('removes the dropdown', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                UI.Dropdown.init(dropdownToggle1).dispose();
                return $.hasData(dropdownToggle1, 'dropdown');
            })).toBe(false);
        });

        test('removes the dropdown (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('#dropdown-toggle-1').dropdown('dispose');
                return $.hasData('#dropdown-toggle-1', 'dropdown');
            })).toBe(false);
        });

        test('removes multiple dropdowns (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('[data-ui-toggle="dropdown"]').dropdown('dispose');
                return $.find('[data-ui-toggle="dropdown"]').some((node) =>
                    $.hasData(node, 'dropdown'),
                );
            })).toBe(false);
        });

        test('completes showing after disposal', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                window.dropdownShownEventTriggered = false;

                $.addEvent(dropdownToggle1, 'shown.ui.dropdown', (_) => {
                    window.dropdownShownEventTriggered = true;
                });

                const dropdown = UI.Dropdown.init(dropdownToggle1);
                dropdown.show();
                dropdown.dispose();
            });

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdown1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeVisible();
            expect(await page.evaluate((_) => window.dropdownShownEventTriggered)).toBe(true);
            expect(await page.evaluate((_) => $.hasData('#dropdown-toggle-1', 'dropdown'))).toBe(false);
        });

        test('completes hiding after disposal', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');

            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                window.dropdownHiddenEventTriggered = false;

                $.addEvent(dropdownToggle1, 'hidden.ui.dropdown', (_) => {
                    window.dropdownHiddenEventTriggered = true;
                });

                const dropdown = UI.Dropdown.init(dropdownToggle1);
                dropdown.hide();
                dropdown.dispose();
            });

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#dropdown1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeHidden();
            expect(await page.evaluate((_) => window.dropdownHiddenEventTriggered)).toBe(true);
            expect(await page.evaluate((_) => $.hasData('#dropdown-toggle-1', 'dropdown'))).toBe(false);
        });
    });

    test.describe('#show', () => {
        test('shows the dropdown', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                UI.Dropdown.init(dropdownToggle1).show();
            });

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('data-ui-placement', 'bottom');
            await expect(page.locator('#dropdown1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeVisible();
            await expect(page.locator('#dropdown1')).toHaveAttribute('data-ui-placement', 'bottom');
            await expect(page.locator('#dropdown1')).toHaveCSS('position', 'absolute');
            await expect(page.locator('#dropdown2')).toBeHidden();
        });

        test('shows the dropdown (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#dropdown-toggle-1').dropdown('show');
            });

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdown1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeVisible();
        });

        test('shows multiple dropdowns (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('[data-ui-toggle="dropdown"]').dropdown('show');
            });

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdown-toggle-2')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdown1')).toBeVisible();
            await expect(page.locator('#dropdown2')).toBeVisible();
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                const dropdown = UI.Dropdown.init(dropdownToggle1);
                dropdown.show();
                dropdown.show();
                dropdown.show();
            });

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdown1')).toBeVisible();
        });

        test('can be called on a shown dropdown', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');

            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                UI.Dropdown.init(dropdownToggle1).show();
            });

            await expect(page.locator('#dropdown1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeVisible();
        });

        test('shows without a transition class', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdown1 = $.findOne('#dropdown1');
                $.removeClass(dropdown1, 'fade');
                UI.Dropdown.init($.findOne('#dropdown-toggle-1')).show();
            });

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdown1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeVisible();
        });

        test('shows when the transition is canceled', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                const dropdown1 = $.findOne('#dropdown1');
                UI.Dropdown.init(dropdownToggle1).show();
                const transition = dropdown1.getAnimations()
                    .find((animation) => animation instanceof CSSTransition);
                transition.cancel();
            });

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdown1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeVisible();
        });
    });

    test.describe('#hide', () => {
        test.beforeEach(async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');
        });

        test('hides the dropdown', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                UI.Dropdown.init(dropdownToggle1).hide();
            });

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#dropdown-toggle-1')).not.toHaveAttribute('data-ui-placement');
            await expect(page.locator('#dropdown1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeHidden();
            await expect(page.locator('#dropdown1')).not.toHaveAttribute('data-ui-placement');
        });

        test('hides the dropdown (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#dropdown-toggle-1').dropdown('hide');
            });

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#dropdown1')).toBeHidden();
        });

        test('hides multiple dropdowns (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#dropdown-toggle-2').dropdown('show');
            });
            await expect(page.locator('#dropdown-toggle-2')).toHaveAttribute('aria-expanded', 'true');

            await page.evaluate((_) => {
                $('[data-ui-toggle="dropdown"]').dropdown('hide');
            });

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#dropdown-toggle-2')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#dropdown1')).toBeHidden();
            await expect(page.locator('#dropdown2')).toBeHidden();
        });

        test('does not remove the dropdown after hiding', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                UI.Dropdown.init(dropdownToggle1).hide();
            });
            await expect(page.locator('#dropdown1')).toBeHidden();

            expect(await page.evaluate((_) =>
                $.getData('#dropdown-toggle-1', 'dropdown') instanceof UI.Dropdown)).toBe(true);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                const dropdown = UI.Dropdown.init(dropdownToggle1);
                dropdown.hide();
                dropdown.hide();
                dropdown.hide();
            });

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#dropdown1')).toBeHidden();
        });

        test('can be called on a hidden dropdown', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                UI.Dropdown.init(dropdownToggle1).hide();
            });
            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'false');

            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                UI.Dropdown.init(dropdownToggle1).hide();
            });

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#dropdown1')).toBeHidden();
        });

        test('hides without a transition class', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdown1 = $.findOne('#dropdown1');
                $.removeClass(dropdown1, 'fade');
                UI.Dropdown.init($.findOne('#dropdown-toggle-1')).hide();
            });

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#dropdown1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeHidden();
        });

        test('hides when the transition is canceled', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                const dropdown1 = $.findOne('#dropdown1');
                UI.Dropdown.init(dropdownToggle1).hide();
                const transition = dropdown1.getAnimations()
                    .find((animation) => animation instanceof CSSTransition);
                transition.cancel();
            });

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#dropdown1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeHidden();
        });
    });

    test.describe('#toggle', () => {
        test('shows the dropdown', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                UI.Dropdown.init(dropdownToggle1).toggle();
            });

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdown1')).toBeVisible();
        });

        test('shows and hides the dropdown (data-ui-toggle)', async ({ page }) => {
            await page.locator('#dropdown-toggle-1').click();
            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');

            await page.locator('#dropdown-toggle-1').click();

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#dropdown1')).toBeHidden();
        });

        test('shows and hides the dropdown (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#dropdown-toggle-1').dropdown('toggle');
            });
            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');

            await page.evaluate((_) => {
                $('#dropdown-toggle-1').dropdown('toggle');
            });

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#dropdown1')).toBeHidden();
        });

        test('shows and hides multiple dropdowns (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('[data-ui-toggle="dropdown"]').dropdown('toggle');
            });
            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdown-toggle-2')).toHaveAttribute('aria-expanded', 'true');

            await page.evaluate((_) => {
                $('[data-ui-toggle="dropdown"]').dropdown('toggle');
            });

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#dropdown-toggle-2')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#dropdown1')).toBeHidden();
            await expect(page.locator('#dropdown2')).toBeHidden();
        });

        test('ignores repeated calls while showing', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                const dropdown = UI.Dropdown.init(dropdownToggle1);
                dropdown.toggle();
                dropdown.toggle();
                dropdown.toggle();
            });

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdown1')).toBeVisible();
        });

        test('ignores repeated calls while hiding', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');

            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                const dropdown = UI.Dropdown.init(dropdownToggle1);
                dropdown.toggle();
                dropdown.toggle();
                dropdown.toggle();
            });

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#dropdown1')).toBeHidden();
        });
    });

    test.describe('events', () => {
        test('triggers show event', async ({ page }) => {
            const eventTriggered = await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                let triggered = false;

                $.addEvent(dropdownToggle1, 'show.ui.dropdown', (_) => {
                    triggered = true;
                });
                UI.Dropdown.init(dropdownToggle1).show();

                return triggered;
            });

            expect(eventTriggered).toBe(true);
        });

        test('triggers shown event', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                window.dropdownShownEventTriggered = false;

                $.addEvent(dropdownToggle1, 'shown.ui.dropdown', (_) => {
                    window.dropdownShownEventTriggered = true;
                });
                UI.Dropdown.init(dropdownToggle1).show();
            });

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            expect(await page.evaluate((_) => window.dropdownShownEventTriggered)).toBe(true);
        });

        test('triggers hide event', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');

            const eventTriggered = await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                let triggered = false;

                $.addEvent(dropdownToggle1, 'hide.ui.dropdown', (_) => {
                    triggered = true;
                });
                UI.Dropdown.init(dropdownToggle1).hide();

                return triggered;
            });

            expect(eventTriggered).toBe(true);
        });

        test('triggers hidden event', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');

            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                window.dropdownHiddenEventTriggered = false;

                $.addEvent(dropdownToggle1, 'hidden.ui.dropdown', (_) => {
                    window.dropdownHiddenEventTriggered = true;
                });
                UI.Dropdown.init(dropdownToggle1).hide();
            });

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'false');
            expect(await page.evaluate((_) => window.dropdownHiddenEventTriggered)).toBe(true);
        });

        test('triggers show events when toggled', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                window.dropdownShowEventTriggered = false;
                window.dropdownShownEventTriggered = false;

                $.addEvent(dropdownToggle1, 'show.ui.dropdown', (_) => {
                    window.dropdownShowEventTriggered = true;
                });
                $.addEvent(dropdownToggle1, 'shown.ui.dropdown', (_) => {
                    window.dropdownShownEventTriggered = true;
                });
                UI.Dropdown.init(dropdownToggle1).toggle();
            });

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            expect(await page.evaluate((_) => window.dropdownShowEventTriggered)).toBe(true);
            expect(await page.evaluate((_) => window.dropdownShownEventTriggered)).toBe(true);
        });

        test('triggers hide events when toggled', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');

            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                window.dropdownHideEventTriggered = false;
                window.dropdownHiddenEventTriggered = false;

                $.addEvent(dropdownToggle1, 'hide.ui.dropdown', (_) => {
                    window.dropdownHideEventTriggered = true;
                });
                $.addEvent(dropdownToggle1, 'hidden.ui.dropdown', (_) => {
                    window.dropdownHiddenEventTriggered = true;
                });
                UI.Dropdown.init(dropdownToggle1).toggle();
            });

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'false');
            expect(await page.evaluate((_) => window.dropdownHideEventTriggered)).toBe(true);
            expect(await page.evaluate((_) => window.dropdownHiddenEventTriggered)).toBe(true);
        });

        test('can be prevented from showing', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                $.addEvent(dropdownToggle1, 'show.ui.dropdown', (_) => false);
                UI.Dropdown.init(dropdownToggle1).show();
            });

            await expect(page.locator('#dropdown-toggle-1')).not.toHaveAttribute('aria-expanded');
            await expect(page.locator('#dropdown1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeHidden();
        });

        test('can be prevented from showing (prevent default)', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                $.addEvent(dropdownToggle1, 'show.ui.dropdown', (event) => {
                    event.preventDefault();
                });
                UI.Dropdown.init(dropdownToggle1).show();
            });

            await expect(page.locator('#dropdown-toggle-1')).not.toHaveAttribute('aria-expanded');
            await expect(page.locator('#dropdown1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeHidden();
        });

        test('can be prevented from hiding', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');

            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                $.addEvent(dropdownToggle1, 'hide.ui.dropdown', (_) => false);
                UI.Dropdown.init(dropdownToggle1).hide();
            });

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdown1')).toBeVisible();
        });

        test('can be prevented from hiding (prevent default)', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');

            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                $.addEvent(dropdownToggle1, 'hide.ui.dropdown', (event) => {
                    event.preventDefault();
                });
                UI.Dropdown.init(dropdownToggle1).hide();
            });

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdown1')).toBeVisible();
        });
    });

    test.describe('user events', () => {
        test('shows the dropdown on down arrow', async ({ page }) => {
            await page.locator('#dropdown-toggle-1').focus();
            await page.keyboard.press('ArrowDown');

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdown1')).toBeVisible();
        });

        test('shows the dropdown on up arrow', async ({ page }) => {
            await page.locator('#dropdown-toggle-1').focus();
            await page.keyboard.press('ArrowUp');

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdown1')).toBeVisible();
        });

        test('hides the dropdown on document click', async ({ page }) => {
            await page.locator('#dropdown-toggle-1').click();
            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');

            await page.locator('body').dispatchEvent('click');

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#dropdown1')).toBeHidden();
        });

        test('does not hide the dropdown on child form click', async ({ page }) => {
            await page.evaluate((_) => {
                const form = $.create('form', {
                    attributes: {
                        id: 'form1',
                    },
                });
                $.append('#dropdown1', form);
            });
            await page.locator('#dropdown-toggle-1').click();
            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');

            await page.locator('#form1').dispatchEvent('click');

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdown1')).toBeVisible();
        });

        test('hides the dropdown on escape', async ({ page }) => {
            await page.locator('#dropdown-toggle-1').click();
            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');

            await page.keyboard.press('Escape');

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#dropdown1')).toBeHidden();
        });

        test('hides the dropdown on tab', async ({ page }) => {
            await page.locator('#dropdown-toggle-1').click();
            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');

            await page.locator('body').dispatchEvent('keyup', { code: 'Tab' });

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#dropdown1')).toBeHidden();
        });

        test('focuses the first item on down arrow', async ({ page }) => {
            await page.locator('#dropdown-toggle-1').focus();
            await page.keyboard.press('ArrowDown');

            await expect(page.locator('#dropdown-1-item-1')).toBeFocused();
        });

        test('focuses the first item on up arrow', async ({ page }) => {
            await page.locator('#dropdown-toggle-1').focus();
            await page.keyboard.press('ArrowUp');

            await expect(page.locator('#dropdown-1-item-1')).toBeFocused();
        });

        test('focuses the first enabled item on arrow key', async ({ page }) => {
            await page.evaluate((_) => {
                const item1 = $.findOne('#dropdown-1-item-1');
                $.setAttribute(item1, { disabled: true });
            });
            await page.locator('#dropdown-toggle-1').focus();
            await page.keyboard.press('ArrowDown');

            await expect(page.locator('#dropdown-1-item-2')).toBeFocused();
        });

        test('focuses the next item on down arrow', async ({ page }) => {
            await page.locator('#dropdown-toggle-1').click();
            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            await page.locator('#dropdown-1-item-2').focus();

            await page.keyboard.press('ArrowDown');

            await expect(page.locator('#dropdown-1-item-3')).toBeFocused();
        });

        test('focuses the next item on up arrow', async ({ page }) => {
            await page.locator('#dropdown-toggle-1').click();
            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            await page.locator('#dropdown-1-item-2').focus();

            await page.keyboard.press('ArrowUp');

            await expect(page.locator('#dropdown-1-item-1')).toBeFocused();
        });

        test('skips dividers and disabled items with arrow keys', async ({ page }) => {
            await page.evaluate((_) => {
                const item2 = $.findOne('#dropdown-1-item-2');
                const divider = $.create('hr', { class: 'dropdown-divider' });

                $.addClass(item2, 'disabled');
                $.before(item2, divider);
            });
            await page.locator('#dropdown-toggle-1').click();
            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            await page.locator('#dropdown-1-item-1').focus();

            await page.keyboard.press('ArrowDown');

            await expect(page.locator('#dropdown-1-item-3')).toBeFocused();

            await page.keyboard.press('ArrowUp');

            await expect(page.locator('#dropdown-1-item-1')).toBeFocused();
        });

        test('maintains focus on last item on down arrow', async ({ page }) => {
            await page.locator('#dropdown-toggle-1').click();
            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            await page.locator('#dropdown-1-item-3').focus();

            await page.keyboard.press('ArrowDown');

            await expect(page.locator('#dropdown-1-item-3')).toBeFocused();
        });

        test('maintains focus on first item on up arrow', async ({ page }) => {
            await page.locator('#dropdown-toggle-1').click();
            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            await page.locator('#dropdown-1-item-1').focus();

            await page.keyboard.press('ArrowUp');

            await expect(page.locator('#dropdown-1-item-1')).toBeFocused();
        });
    });

    test.describe('autoClose option', () => {
        test('works with auto close option', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                UI.Dropdown.init(dropdownToggle1, { autoClose: false }).show();
            });
            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');

            await page.locator('body').dispatchEvent('click');

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdown1')).toBeVisible();
        });

        test('works with auto close option (data-ui-auto-close)', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                $.setDataset(dropdownToggle1, { uiAutoClose: false });
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');

            await page.locator('body').dispatchEvent('click');

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdown1')).toBeVisible();
        });

        test('works with auto close option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#dropdown-toggle-1')
                    .dropdown({ autoClose: false })
                    .show();
            });
            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');

            await page.locator('body').dispatchEvent('click');

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdown1')).toBeVisible();
        });

        test('hides on document click with auto close outside', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                UI.Dropdown.init(dropdownToggle1, { autoClose: 'outside' }).show();
            });
            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');

            await page.locator('body').dispatchEvent('click');

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#dropdown1')).toBeHidden();
        });

        test('does not hide on document click with auto close inside', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                UI.Dropdown.init(dropdownToggle1, { autoClose: 'inside' }).show();
            });
            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');

            await page.locator('body').dispatchEvent('click');

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdown1')).toBeVisible();
        });

        test('hides on menu click with auto close inside', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                UI.Dropdown.init(dropdownToggle1, { autoClose: 'inside' }).show();
            });
            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');

            await page.locator('#dropdown1').dispatchEvent('click');

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#dropdown1')).toBeHidden();
        });

        test('does not hide on menu click with auto close outside', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                UI.Dropdown.init(dropdownToggle1, { autoClose: 'outside' }).show();
            });
            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');

            await page.locator('#dropdown1').dispatchEvent('click');

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdown1')).toBeVisible();
        });
    });

    test.describe('display option', () => {
        test('works with static display option', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                UI.Dropdown.init(dropdownToggle1, { display: 'static' }).show();
            });

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdown-toggle-1')).not.toHaveAttribute('data-ui-placement');
            await expect(page.locator('#dropdown1')).toBeVisible();
            await expect(page.locator('#dropdown1')).not.toHaveAttribute('data-ui-placement');
            await expect(page.locator('#dropdown1')).toHaveAttribute('style', '');
        });

        test('works with static display option (data-ui-display)', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdown-toggle-1');
                $.setDataset(dropdownToggle1, { uiDisplay: 'static' });
                UI.Dropdown.init(dropdownToggle1).show();
            });

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('data-ui-display', 'static');
            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdown-toggle-1')).not.toHaveAttribute('data-ui-placement');
            await expect(page.locator('#dropdown1')).toBeVisible();
            await expect(page.locator('#dropdown1')).not.toHaveAttribute('data-ui-placement');
            await expect(page.locator('#dropdown1')).toHaveAttribute('style', '');
        });

        test('works with static display option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#dropdown-toggle-1')
                    .dropdown({ display: 'static' })
                    .show();
            });

            await expect(page.locator('#dropdown-toggle-1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdown-toggle-1')).not.toHaveAttribute('data-ui-placement');
            await expect(page.locator('#dropdown1')).toBeVisible();
            await expect(page.locator('#dropdown1')).not.toHaveAttribute('data-ui-placement');
            await expect(page.locator('#dropdown1')).toHaveAttribute('style', '');
        });
    });
});
