import { expect, test } from '@playwright/test';
import { advanceClock, resetPage, setupClock } from '../../setup/browser.js';
import { expectAnimationState } from '../../support/assertions/animation.js';

test.beforeEach(async ({ page }) => {
    await setupClock(page);
    await resetPage(page);
});

test.describe('Dropdown', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
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
                '</div>';
        });
    });

    test.describe('#init', () => {
        test('creates a dropdown', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                return UI.Dropdown.init(dropdownToggle1) instanceof UI.Dropdown;
            })).toBe(true);
        });

        test('creates a dropdown (data-ui-toggle)', async ({ page }) => {
            await page.locator('#dropdownToggle1').click();

            expect(await page.evaluate((_) =>
                $.getData('#dropdownToggle1', 'dropdown') instanceof UI.Dropdown)).toBe(true);
        });

        test('creates a dropdown (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('#dropdownToggle1').dropdown();
                return $.getData('#dropdownToggle1', 'dropdown') instanceof UI.Dropdown;
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
                $('#dropdownToggle1').dropdown() instanceof UI.Dropdown)).toBe(true);
        });
    });

    test.describe('#dispose', () => {
        test('removes the dropdown', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).dispose();
                return $.hasData(dropdownToggle1, 'dropdown');
            })).toBe(false);
        });

        test('removes the dropdown (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('#dropdownToggle1').dropdown('dispose');
                return $.hasData('#dropdownToggle1', 'dropdown');
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

        test('clears dropdown memory', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                const dropdown = UI.Dropdown.init(dropdownToggle1);
                dropdown.dispose();

                for (const key in dropdown) {
                    if ($._isObject(dropdown[key]) && !$._isFunction(dropdown[key])) {
                        return false;
                    }
                }

                return true;
            })).toBe(true);
        });

        test('clears dropdown memory when node is removed', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                const dropdown = UI.Dropdown.init(dropdownToggle1);
                $.remove(dropdownToggle1);

                for (const key in dropdown) {
                    if ($._isObject(dropdown[key]) && !$._isFunction(dropdown[key])) {
                        return false;
                    }
                }

                return true;
            })).toBe(true);
        });
    });

    test.describe('#show', () => {
        test('shows the dropdown', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#dropdownToggle1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdownToggle1')).toHaveAttribute('data-ui-placement', 'bottom');
            await expect(page.locator('#dropdown1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeVisible();
            await expect(page.locator('#dropdown1')).toHaveAttribute('data-ui-placement', 'bottom');
            await expect(page.locator('#dropdown1')).toHaveCSS('position', 'absolute');
            await expect(page.locator('#dropdown2')).not.toHaveClass(/\bshow\b/);
        });

        test('shows the dropdown (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#dropdownToggle1').dropdown('show');
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#dropdownToggle1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdown1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeVisible();
        });

        test('shows multiple dropdowns (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('[data-ui-toggle="dropdown"]').dropdown('show');
            });
            await advanceClock(page, 150);

            await expect(page.locator('#dropdownToggle1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdownToggle2')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdown1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeVisible();
            await expect(page.locator('#dropdown2')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown2')).toBeVisible();
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                const dropdown = UI.Dropdown.init(dropdownToggle1);
                dropdown.show();
                dropdown.show();
                dropdown.show();
            });
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                    active: true,
                },
            ]);
        });

        test('can be called on shown dropdown', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            });

            await expect(page.locator('#dropdown1')).toHaveClass(/\bshow\b/);
            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                },
            ]);
        });
    });

    test.describe('#hide', () => {
        test('hides the dropdown', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).hide();
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#dropdownToggle1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#dropdownToggle1')).not.toHaveAttribute('data-ui-placement');
            await expect(page.locator('#dropdown1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeHidden();
            await expect(page.locator('#dropdown1')).not.toHaveAttribute('data-ui-placement');
        });

        test('hides the dropdown (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#dropdownToggle1').dropdown('show');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $('#dropdownToggle1').dropdown('hide');
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#dropdownToggle1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#dropdown1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeHidden();
        });

        test('hides multiple dropdowns (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('[data-ui-toggle="dropdown"]').dropdown('show');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown1');
                $.stop('#dropdown2');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $('[data-ui-toggle="dropdown"]').dropdown('hide');
            });
            await advanceClock(page, 150);

            await expect(page.locator('#dropdownToggle1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#dropdownToggle2')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#dropdown1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeHidden();
            await expect(page.locator('#dropdown2')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown2')).toBeHidden();
        });

        test('does not remove the dropdown after hiding', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).hide();
            });
            await advanceClock(page, 150);

            expect(await page.evaluate((_) =>
                $.getData('#dropdownToggle1', 'dropdown') instanceof UI.Dropdown)).toBe(true);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                const dropdown = UI.Dropdown.init(dropdownToggle1);
                dropdown.hide();
                dropdown.hide();
                dropdown.hide();
            });
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                    active: true,
                },
            ]);
        });

        test('can be called on hidden dropdown', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).hide();
            });

            await expect(page.locator('#dropdown1')).not.toHaveClass(/\bshow\b/);
            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                },
            ]);
        });
    });

    test.describe('#toggle (show)', () => {
        test('shows the dropdown', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).toggle();
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#dropdownToggle1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdown1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeVisible();
        });

        test('shows the dropdown (data-ui-toggle)', async ({ page }) => {
            await page.locator('#dropdownToggle1').click();
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#dropdownToggle1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdown1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeVisible();
        });

        test('shows the dropdown (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#dropdownToggle1').dropdown('toggle');
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#dropdownToggle1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdown1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeVisible();
        });

        test('shows multiple dropdowns (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('[data-ui-toggle="dropdown"]').dropdown('toggle');
            });
            await advanceClock(page, 150);

            await expect(page.locator('#dropdownToggle1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdownToggle2')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdown1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeVisible();
            await expect(page.locator('#dropdown2')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown2')).toBeVisible();
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                const dropdown = UI.Dropdown.init(dropdownToggle1);
                dropdown.toggle();
                dropdown.toggle();
                dropdown.toggle();
            });
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                    active: true,
                },
            ]);
        });
    });

    test.describe('#toggle (hide)', () => {
        test('hides the dropdown', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).toggle();
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#dropdownToggle1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#dropdown1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeHidden();
        });

        test('hides the dropdown (data-ui-toggle)', async ({ page }) => {
            await page.locator('#dropdownToggle1').click();
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown1');
            });
            await advanceClock(page, 50);
            await page.locator('#dropdownToggle1').click();
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#dropdownToggle1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#dropdown1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeHidden();
        });

        test('hides the dropdown (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#dropdownToggle1').dropdown('show');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $('#dropdownToggle1').dropdown('toggle');
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#dropdownToggle1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#dropdown1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeHidden();
        });

        test('hides multiple dropdowns (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('[data-ui-toggle="dropdown"]').dropdown('show');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown1');
                $.stop('#dropdown2');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $('[data-ui-toggle="dropdown"]').dropdown('toggle');
            });
            await advanceClock(page, 150);

            await expect(page.locator('#dropdownToggle1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#dropdownToggle2')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#dropdown1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeHidden();
            await expect(page.locator('#dropdown2')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown2')).toBeHidden();
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                const dropdown = UI.Dropdown.init(dropdownToggle1);
                dropdown.toggle();
                dropdown.toggle();
                dropdown.toggle();
            });
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                    active: true,
                },
            ]);
        });
    });

    test.describe('events', () => {
        test('triggers show event', async ({ page }) => {
            const eventTriggered = await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
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
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                window.dropdownShownEventTriggered = false;

                $.addEvent(dropdownToggle1, 'shown.ui.dropdown', (_) => {
                    window.dropdownShownEventTriggered = true;
                });
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await advanceClock(page, 150);

            expect(await page.evaluate((_) => window.dropdownShownEventTriggered)).toBe(true);
            await expect(page.locator('#dropdownToggle1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdown1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeVisible();
        });

        test('triggers hide event', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown1');
            });
            await advanceClock(page, 50);
            const eventTriggered = await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
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
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                window.dropdownHiddenEventTriggered = false;

                $.addEvent(dropdownToggle1, 'hidden.ui.dropdown', (_) => {
                    window.dropdownHiddenEventTriggered = true;
                });
                UI.Dropdown.init(dropdownToggle1).hide();
            });
            await advanceClock(page, 150);

            expect(await page.evaluate((_) => window.dropdownHiddenEventTriggered)).toBe(true);
            await expect(page.locator('#dropdownToggle1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#dropdown1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeHidden();
        });

        test('triggers show event (toggle)', async ({ page }) => {
            const eventTriggered = await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                let triggered = false;

                $.addEvent(dropdownToggle1, 'show.ui.dropdown', (_) => {
                    triggered = true;
                });
                UI.Dropdown.init(dropdownToggle1).toggle();

                return triggered;
            });

            expect(eventTriggered).toBe(true);
        });

        test('triggers shown event (toggle)', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                window.dropdownShownEventTriggered = false;

                $.addEvent(dropdownToggle1, 'shown.ui.dropdown', (_) => {
                    window.dropdownShownEventTriggered = true;
                });
                UI.Dropdown.init(dropdownToggle1).toggle();
            });
            await advanceClock(page, 150);

            expect(await page.evaluate((_) => window.dropdownShownEventTriggered)).toBe(true);
            await expect(page.locator('#dropdownToggle1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdown1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeVisible();
        });

        test('triggers hide event (toggle)', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown1');
            });
            await advanceClock(page, 50);
            const eventTriggered = await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                let triggered = false;

                $.addEvent(dropdownToggle1, 'hide.ui.dropdown', (_) => {
                    triggered = true;
                });
                UI.Dropdown.init(dropdownToggle1).toggle();

                return triggered;
            });

            expect(eventTriggered).toBe(true);
        });

        test('triggers hidden event (toggle)', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                window.dropdownHiddenEventTriggered = false;

                $.addEvent(dropdownToggle1, 'hidden.ui.dropdown', (_) => {
                    window.dropdownHiddenEventTriggered = true;
                });
                UI.Dropdown.init(dropdownToggle1).toggle();
            });
            await advanceClock(page, 150);

            expect(await page.evaluate((_) => window.dropdownHiddenEventTriggered)).toBe(true);
            await expect(page.locator('#dropdownToggle1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#dropdown1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeHidden();
        });

        test('can be prevented from showing', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                $.addEvent(dropdownToggle1, 'show.ui.dropdown', (_) => false);
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await advanceClock(page, 50);

            await expect(page.locator('#dropdownToggle1')).not.toHaveAttribute('aria-expanded');
            await expect(page.locator('#dropdown1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeHidden();
            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                },
            ]);
        });

        test('can be prevented from showing (prevent default)', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                $.addEvent(dropdownToggle1, 'show.ui.dropdown', (event) => {
                    event.preventDefault();
                });
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await advanceClock(page, 50);

            await expect(page.locator('#dropdownToggle1')).not.toHaveAttribute('aria-expanded');
            await expect(page.locator('#dropdown1')).not.toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeHidden();
            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                },
            ]);
        });

        test('can be prevented from hiding', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                $.addEvent(dropdownToggle1, 'hide.ui.dropdown', (_) => false);
                UI.Dropdown.init(dropdownToggle1).hide();
            });
            await advanceClock(page, 50);

            await expect(page.locator('#dropdownToggle1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdown1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeVisible();
            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                },
            ]);
        });

        test('can be prevented from hiding (prevent default)', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                $.addEvent(dropdownToggle1, 'hide.ui.dropdown', (event) => {
                    event.preventDefault();
                });
                UI.Dropdown.init(dropdownToggle1).hide();
            });
            await advanceClock(page, 50);

            await expect(page.locator('#dropdownToggle1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdown1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeVisible();
            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                },
            ]);
        });
    });

    test.describe('user events', () => {
        test('shows the dropdown on down arrow', async ({ page }) => {
            await page.locator('#dropdownToggle1').focus();
            await page.keyboard.press('ArrowDown');
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#dropdownToggle1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdown1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeVisible();
        });

        test('shows the dropdown on up arrow', async ({ page }) => {
            await page.locator('#dropdownToggle1').focus();
            await page.keyboard.press('ArrowUp');
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#dropdownToggle1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdown1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeVisible();
        });

        test('hides the dropdown on document click', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown1');
            });
            await advanceClock(page, 50);
            await page.locator('body').dispatchEvent('click');
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                    active: true,
                },
            ]);
        });

        test('does not hide the dropdown on child form click', async ({ page }) => {
            await page.evaluate((_) => {
                const form = $.create('form', {
                    attributes: {
                        id: 'form1',
                    },
                });
                $.append('#dropdown1', form);
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown1');
            });
            await advanceClock(page, 50);
            await page.locator('#form1').dispatchEvent('click');

            await expect(page.locator('#dropdown1')).toHaveClass(/\bshow\b/);
            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                },
            ]);
        });

        test('hides the dropdown on escape', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown1');
            });
            await advanceClock(page, 50);
            await page.keyboard.press('Escape');
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                    active: true,
                },
            ]);
        });

        test('hides the dropdown on tab', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown1');
            });
            await advanceClock(page, 50);
            await page.locator('body').dispatchEvent('keyup', { code: 'Tab' });
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                    active: true,
                },
            ]);
        });

        test('focuses the first item on down arrow', async ({ page }) => {
            await page.locator('#dropdownToggle1').focus();
            await page.keyboard.press('ArrowDown');
            await advanceClock(page, 150);

            await expect(page.locator('#dropdown1Item1')).toBeFocused();
        });

        test('focuses the first item on up arrow', async ({ page }) => {
            await page.locator('#dropdownToggle1').focus();
            await page.keyboard.press('ArrowUp');
            await advanceClock(page, 150);

            await expect(page.locator('#dropdown1Item1')).toBeFocused();
        });

        test('focuses the next item on down arrow', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown1');
            });
            await advanceClock(page, 50);
            await page.locator('#dropdown1Item2').focus();
            await page.keyboard.press('ArrowDown');

            await expect(page.locator('#dropdown1Item3')).toBeFocused();
        });

        test('focuses the next item on up arrow', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown1');
            });
            await advanceClock(page, 50);
            await page.locator('#dropdown1Item2').focus();
            await page.keyboard.press('ArrowUp');

            await expect(page.locator('#dropdown1Item1')).toBeFocused();
        });

        test('maintains focus on last item on down arrow', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown1');
            });
            await advanceClock(page, 50);
            await page.locator('#dropdown1Item3').focus();
            await page.keyboard.press('ArrowDown');

            await expect(page.locator('#dropdown1Item3')).toBeFocused();
        });

        test('maintains focus on first item on up arrow', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown1');
            });
            await advanceClock(page, 50);
            await page.locator('#dropdown1Item1').focus();
            await page.keyboard.press('ArrowUp');

            await expect(page.locator('#dropdown1Item1')).toBeFocused();
        });
    });

    test.describe('autoClose option', () => {
        test('works with auto close option', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1, { autoClose: false }).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown1');
            });
            await advanceClock(page, 50);
            await page.locator('body').dispatchEvent('click');
            await advanceClock(page, 50);

            await expect(page.locator('#dropdown1')).toHaveClass(/\bshow\b/);
            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                },
            ]);
        });

        test('works with auto close option (data-ui-auto-close)', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                $.setDataset(dropdownToggle1, { uiAutoClose: false });
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown1');
            });
            await advanceClock(page, 50);
            await page.locator('body').dispatchEvent('click');
            await advanceClock(page, 50);

            await expect(page.locator('#dropdown1')).toHaveClass(/\bshow\b/);
            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                },
            ]);
        });

        test('works with auto close option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#dropdownToggle1')
                    .dropdown({ autoClose: false })
                    .show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown1');
            });
            await advanceClock(page, 50);
            await page.locator('body').dispatchEvent('click');
            await advanceClock(page, 50);

            await expect(page.locator('#dropdown1')).toHaveClass(/\bshow\b/);
            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                },
            ]);
        });

        test('hides on document click with auto close outside', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1, { autoClose: 'outside' }).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown1');
            });
            await advanceClock(page, 50);
            await page.locator('body').dispatchEvent('click');
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                    active: true,
                },
            ]);
        });

        test('does not hide on document click with auto close inside', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1, { autoClose: 'inside' }).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown1');
            });
            await advanceClock(page, 50);
            await page.locator('body').dispatchEvent('click');
            await advanceClock(page, 50);

            await expect(page.locator('#dropdown1')).toHaveClass(/\bshow\b/);
            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                },
            ]);
        });

        test('hides on menu click with auto close inside', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1, { autoClose: 'inside' }).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown1');
            });
            await advanceClock(page, 50);
            await page.locator('#dropdown1').dispatchEvent('click');
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                    active: true,
                },
            ]);
        });

        test('does not hide on menu click with auto close outside', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1, { autoClose: 'outside' }).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown1');
            });
            await advanceClock(page, 50);
            await page.locator('#dropdown1').dispatchEvent('click');
            await advanceClock(page, 50);

            await expect(page.locator('#dropdown1')).toHaveClass(/\bshow\b/);
            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                },
            ]);
        });
    });

    test.describe('display option', () => {
        test('works with static display option', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1, { display: 'static' }).show();
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#dropdownToggle1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdownToggle1')).not.toHaveAttribute('data-ui-placement');
            await expect(page.locator('#dropdown1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeVisible();
            await expect(page.locator('#dropdown1')).not.toHaveAttribute('data-ui-placement');
            await expect(page.locator('#dropdown1')).toHaveAttribute('style', '');
        });

        test('works with static display option (data-ui-display)', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                $.setDataset(dropdownToggle1, { uiDisplay: 'static' });
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#dropdownToggle1')).toHaveAttribute('data-ui-display', 'static');
            await expect(page.locator('#dropdownToggle1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdownToggle1')).not.toHaveAttribute('data-ui-placement');
            await expect(page.locator('#dropdown1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeVisible();
            await expect(page.locator('#dropdown1')).not.toHaveAttribute('data-ui-placement');
            await expect(page.locator('#dropdown1')).toHaveAttribute('style', '');
        });

        test('works with static display option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#dropdownToggle1')
                    .dropdown({ display: 'static' })
                    .show();
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                    active: true,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#dropdownToggle1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#dropdownToggle1')).not.toHaveAttribute('data-ui-placement');
            await expect(page.locator('#dropdown1')).toHaveClass(/\bshow\b/);
            await expect(page.locator('#dropdown1')).toBeVisible();
            await expect(page.locator('#dropdown1')).not.toHaveAttribute('data-ui-placement');
            await expect(page.locator('#dropdown1')).toHaveAttribute('style', '');
        });
    });

    test.describe('duration option', () => {
        test('works with duration option on show', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1, { duration: 200 }).show();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                    progress: 0.875,
                },
            ]);
        });

        test('works with duration option on show (data-ui-duration)', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                $.setDataset(dropdownToggle1, { uiDuration: 200 });
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                    progress: 0.875,
                },
            ]);
        });

        test('works with duration option on show (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#dropdownToggle1')
                    .dropdown({ duration: 200 })
                    .show();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                    progress: 0.875,
                },
            ]);
        });

        test('works with duration option on hide', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1, { duration: 200 }).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).hide();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                    progress: 0.875,
                },
            ]);
        });

        test('works with duration option on hide (data-ui-duration)', async ({ page }) => {
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                $.setDataset(dropdownToggle1, { uiDuration: 200 });
                UI.Dropdown.init(dropdownToggle1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const dropdownToggle1 = $.findOne('#dropdownToggle1');
                UI.Dropdown.init(dropdownToggle1).hide();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                    progress: 0.875,
                },
            ]);
        });

        test('works with duration option on hide (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#dropdownToggle1')
                    .dropdown({ duration: 200 })
                    .show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#dropdown1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $('#dropdownToggle1').dropdown('hide');
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#dropdown1'],
                    progress: 0.875,
                },
            ]);
        });
    });
});
