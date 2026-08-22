import { expect, test } from '@playwright/test';
import { advanceClock, resetPage, setupClock } from '../../setup/browser.js';
import { expectAnimationState } from '../../support/assertions/animation.js';

test.beforeEach(async ({ page }) => {
    await setupClock(page);
    await resetPage(page);
});

test.describe('Collapse', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<button class="btn btn-secondary collapsed" id="collapseToggle1" data-ui-toggle="collapse" data-ui-target="#collapse1" type="button"></button>' +
                '<button class="btn btn-secondary collapsed" id="collapseToggle2" data-ui-toggle="collapse" data-ui-target="#collapse2" type="button"></button>' +
                '<div class="collapse" id="collapse1"></div>' +
                '<div class="collapse" id="collapse2"></div>';
        });
    });

    test.describe('#init', () => {
        test('creates a collapse', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                return UI.Collapse.init(collapse1) instanceof UI.Collapse;
            })).toBe(true);
        });

        test('creates a collapse (data-ui-toggle)', async ({ page }) => {
            await page.locator('#collapseToggle1').click();

            expect(await page.evaluate((_) =>
                $.getData('#collapse1', 'collapse') instanceof UI.Collapse)).toBe(true);
        });

        test('creates a collapse (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('#collapse1').collapse();
                return $.getData('#collapse1', 'collapse') instanceof UI.Collapse;
            })).toBe(true);
        });

        test('creates multiple collapses (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('div').collapse();
                return $.find('div').every((node) =>
                    $.getData(node, 'collapse') instanceof UI.Collapse,
                );
            })).toBe(true);
        });

        test('returns the collapse (query)', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $('#collapse1').collapse() instanceof UI.Collapse)).toBe(true);
        });
    });

    test.describe('#dispose', () => {
        test('removes the collapse', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).dispose();
                return $.hasData(collapse1, 'collapse');
            })).toBe(false);
        });

        test('removes the collapse (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('#collapse1').collapse('dispose');
                return $.hasData('#collapse1', 'collapse');
            })).toBe(false);
        });

        test('removes multiple collapses (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('div').collapse('dispose');
                return $.find('div').some((node) =>
                    $.hasData(node, 'collapse'),
                );
            })).toBe(false);
        });

        test('clears collapse memory', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                const collapse = UI.Collapse.init(collapse1);
                collapse.dispose();

                for (const key in collapse) {
                    if ($._isObject(collapse[key]) && !$._isFunction(collapse[key])) {
                        return false;
                    }
                }

                return true;
            })).toBe(true);
        });

        test('clears collapse memory when node is removed', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                const collapse = UI.Collapse.init(collapse1);
                $.remove(collapse1);

                for (const key in collapse) {
                    if ($._isObject(collapse[key]) && !$._isFunction(collapse[key])) {
                        return false;
                    }
                }

                return true;
            })).toBe(true);
        });
    });

    test.describe('#show', () => {
        test('shows the collapse', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#collapse1'],
                    progress: 0.5,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#collapseToggle1')).toHaveClass('btn btn-secondary');
            await expect(page.locator('#collapseToggle1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#collapse1')).toHaveClass('collapse show');
            await expect(page.locator('#collapse1')).toHaveAttribute('style', '');
            await expect(page.locator('#collapse2')).toHaveClass('collapse');
        });

        test('shows the collapse (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#collapse1').collapse('show');
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#collapse1'],
                    progress: 0.5,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#collapseToggle1')).toHaveClass('btn btn-secondary');
            await expect(page.locator('#collapseToggle1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#collapse1')).toHaveClass('collapse show');
            await expect(page.locator('#collapse1')).toHaveAttribute('style', '');
            await expect(page.locator('#collapse2')).toHaveClass('collapse');
        });

        test('shows multiple collapses (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('div').collapse('show');
            });
            await advanceClock(page, 150);

            await expect(page.locator('[data-ui-toggle="collapse"]')).toHaveClass([
                'btn btn-secondary',
                'btn btn-secondary',
            ]);
            await expect(page.locator('#collapseToggle1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#collapseToggle2')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('.collapse')).toHaveClass([
                'collapse show',
                'collapse show',
            ]);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                const collapse = UI.Collapse.init(collapse1);
                collapse.show();
                collapse.show();
                collapse.show();
            });
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['#collapse1'],
                    progress: 0.5,
                },
            ]);
        });

        test('can be called on shown collapse', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#collapse1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            });

            await expect(page.locator('#collapse1')).toHaveClass('collapse show');
            await expectAnimationState(page, [
                {
                    selectors: ['#collapse1'],
                },
            ]);
        });
    });

    test.describe('#hide', () => {
        test('hides the collapse', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#collapse1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).hide();
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#collapse1'],
                    progress: 0.5,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#collapseToggle1')).toHaveClass('btn btn-secondary collapsed');
            await expect(page.locator('#collapseToggle1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#collapse1')).toHaveClass('collapse');
            await expect(page.locator('#collapse1')).toHaveAttribute('style', '');
            await expect(page.locator('#collapse2')).toHaveClass('collapse');
        });

        test('hides the collapse (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#collapse1').collapse('show');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#collapse1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $('#collapse1').collapse('hide');
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#collapse1'],
                    progress: 0.5,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#collapseToggle1')).toHaveClass('btn btn-secondary collapsed');
            await expect(page.locator('#collapseToggle1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#collapse1')).toHaveClass('collapse');
            await expect(page.locator('#collapse1')).toHaveAttribute('style', '');
            await expect(page.locator('#collapse2')).toHaveClass('collapse');
        });

        test('hides multiple collapses (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('div').collapse('show');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#collapse1');
                $.stop('#collapse2');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $('div').collapse('hide');
            });
            await advanceClock(page, 150);

            await expect(page.locator('[data-ui-toggle="collapse"]')).toHaveClass([
                'btn btn-secondary collapsed',
                'btn btn-secondary collapsed',
            ]);
            await expect(page.locator('#collapseToggle1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#collapseToggle2')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('.collapse')).toHaveClass([
                'collapse',
                'collapse',
            ]);
            await expect(page.locator('#collapse1')).toHaveAttribute('style', '');
            await expect(page.locator('#collapse2')).toHaveAttribute('style', '');
        });

        test('does not remove the collapse after hiding', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#collapse1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).hide();
            });
            await advanceClock(page, 250);

            expect(await page.evaluate((_) =>
                $.getData('#collapse1', 'collapse') instanceof UI.Collapse)).toBe(true);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#collapse1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                const collapse = UI.Collapse.init(collapse1);
                collapse.hide();
                collapse.hide();
                collapse.hide();
            });
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['#collapse1'],
                    progress: 0.5,
                },
            ]);
        });

        test('can be called on hidden collapse', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).hide();
            });

            await expect(page.locator('#collapse1')).toHaveClass('collapse');
            await expectAnimationState(page, [
                {
                    selectors: ['#collapse1'],
                },
            ]);
        });
    });

    test.describe('#toggle (show)', () => {
        test('shows the collapse', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).toggle();
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#collapse1'],
                    progress: 0.5,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#collapseToggle1')).toHaveClass('btn btn-secondary');
            await expect(page.locator('#collapseToggle1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#collapse1')).toHaveClass('collapse show');
            await expect(page.locator('#collapse1')).toHaveAttribute('style', '');
        });

        test('shows the collapse (data-ui-toggle)', async ({ page }) => {
            await page.locator('#collapseToggle1').click();
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#collapse1'],
                    progress: 0.5,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#collapseToggle1')).toHaveClass('btn btn-secondary');
            await expect(page.locator('#collapseToggle1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#collapse1')).toHaveClass('collapse show');
            await expect(page.locator('#collapse1')).toHaveAttribute('style', '');
        });

        test('shows the collapse (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#collapse1').collapse('toggle');
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#collapse1'],
                    progress: 0.5,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#collapseToggle1')).toHaveClass('btn btn-secondary');
            await expect(page.locator('#collapseToggle1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#collapse1')).toHaveClass('collapse show');
            await expect(page.locator('#collapse1')).toHaveAttribute('style', '');
        });

        test('shows multiple collapses (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('div').collapse('toggle');
            });
            await advanceClock(page, 150);

            await expect(page.locator('[data-ui-toggle="collapse"]')).toHaveClass([
                'btn btn-secondary',
                'btn btn-secondary',
            ]);
            await expect(page.locator('#collapseToggle1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#collapseToggle2')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('.collapse')).toHaveClass([
                'collapse show',
                'collapse show',
            ]);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                const collapse = UI.Collapse.init(collapse1);
                collapse.toggle();
                collapse.toggle();
                collapse.toggle();
            });
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['#collapse1'],
                    progress: 0.5,
                },
            ]);
        });
    });

    test.describe('#toggle (hide)', () => {
        test('hides the collapse', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#collapse1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).toggle();
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#collapse1'],
                    progress: 0.5,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#collapseToggle1')).toHaveClass('btn btn-secondary collapsed');
            await expect(page.locator('#collapseToggle1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#collapse1')).toHaveClass('collapse');
            await expect(page.locator('#collapse1')).toHaveAttribute('style', '');
        });

        test('hides the collapse (data-ui-toggle)', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#collapse1');
            });
            await advanceClock(page, 50);
            await page.locator('#collapseToggle1').click();
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#collapse1'],
                    progress: 0.5,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#collapseToggle1')).toHaveClass('btn btn-secondary collapsed');
            await expect(page.locator('#collapseToggle1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#collapse1')).toHaveClass('collapse');
            await expect(page.locator('#collapse1')).toHaveAttribute('style', '');
        });

        test('hides the collapse (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#collapse1').collapse('show');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#collapse1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $('#collapse1').collapse('toggle');
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#collapse1'],
                    progress: 0.5,
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#collapseToggle1')).toHaveClass('btn btn-secondary collapsed');
            await expect(page.locator('#collapseToggle1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#collapse1')).toHaveClass('collapse');
            await expect(page.locator('#collapse1')).toHaveAttribute('style', '');
        });

        test('hides multiple collapses (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('div').collapse('show');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#collapse1');
                $.stop('#collapse2');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $('div').collapse('toggle');
            });
            await advanceClock(page, 150);

            await expect(page.locator('[data-ui-toggle="collapse"]')).toHaveClass([
                'btn btn-secondary collapsed',
                'btn btn-secondary collapsed',
            ]);
            await expect(page.locator('#collapseToggle1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#collapseToggle2')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('.collapse')).toHaveClass([
                'collapse',
                'collapse',
            ]);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#collapse1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                const collapse = UI.Collapse.init(collapse1);
                collapse.toggle();
                collapse.toggle();
                collapse.toggle();
            });
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['#collapse1'],
                    progress: 0.5,
                },
            ]);
        });
    });

    test.describe('events', () => {
        test('triggers show event', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                const collapseToggle1 = $.findOne('#collapseToggle1');
                $.addEvent(collapse1, 'show.ui.collapse', (_) => {
                    document.documentElement.dataset.collapseShowState = String(
                        collapse1.className === 'collapse' &&
                        collapseToggle1.classList.contains('collapsed') &&
                        !collapseToggle1.hasAttribute('aria-expanded'),
                    );
                });
                UI.Collapse.init(collapse1).show();
            });

            await expect(page.locator('html')).toHaveAttribute('data-collapse-show-state', 'true');
        });

        test('triggers shown event', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                $.addEvent(collapse1, 'shown.ui.collapse', (_) => {
                    document.documentElement.dataset.collapseShown = 'true';
                });
                UI.Collapse.init(collapse1).show();
            });
            await advanceClock(page, 150);

            await expect(page.locator('html')).toHaveAttribute('data-collapse-shown', 'true');
            await expect(page.locator('#collapseToggle1')).toHaveClass('btn btn-secondary');
            await expect(page.locator('#collapseToggle1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#collapse1')).toHaveClass('collapse show');
        });

        test('triggers hide event', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#collapse1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                const collapseToggle1 = $.findOne('#collapseToggle1');
                $.addEvent(collapse1, 'hide.ui.collapse', (_) => {
                    document.documentElement.dataset.collapseHideState = String(
                        collapse1.className === 'collapse show' &&
                        !collapseToggle1.classList.contains('collapsed') &&
                        collapseToggle1.getAttribute('aria-expanded') === 'true',
                    );
                });
                UI.Collapse.init(collapse1).hide();
            });

            await expect(page.locator('html')).toHaveAttribute('data-collapse-hide-state', 'true');
        });

        test('triggers hidden event', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#collapse1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                $.addEvent(collapse1, 'hidden.ui.collapse', (_) => {
                    document.documentElement.dataset.collapseHidden = 'true';
                });
                UI.Collapse.init(collapse1).hide();
            });
            await advanceClock(page, 150);

            await expect(page.locator('html')).toHaveAttribute('data-collapse-hidden', 'true');
            await expect(page.locator('#collapseToggle1')).toHaveClass('btn btn-secondary collapsed');
            await expect(page.locator('#collapseToggle1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#collapse1')).toHaveClass('collapse');
        });

        test('triggers show event (toggle)', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                const collapseToggle1 = $.findOne('#collapseToggle1');
                $.addEvent(collapse1, 'show.ui.collapse', (_) => {
                    document.documentElement.dataset.collapseShowState = String(
                        collapse1.className === 'collapse' &&
                        collapseToggle1.classList.contains('collapsed') &&
                        !collapseToggle1.hasAttribute('aria-expanded'),
                    );
                });
                UI.Collapse.init(collapse1).toggle();
            });

            await expect(page.locator('html')).toHaveAttribute('data-collapse-show-state', 'true');
        });

        test('triggers shown event (toggle)', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                $.addEvent(collapse1, 'shown.ui.collapse', (_) => {
                    document.documentElement.dataset.collapseShown = 'true';
                });
                UI.Collapse.init(collapse1).toggle();
            });
            await advanceClock(page, 150);

            await expect(page.locator('html')).toHaveAttribute('data-collapse-shown', 'true');
            await expect(page.locator('#collapseToggle1')).toHaveClass('btn btn-secondary');
            await expect(page.locator('#collapseToggle1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#collapse1')).toHaveClass('collapse show');
        });

        test('triggers hide event (toggle)', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#collapse1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                const collapseToggle1 = $.findOne('#collapseToggle1');
                $.addEvent(collapse1, 'hide.ui.collapse', (_) => {
                    document.documentElement.dataset.collapseHideState = String(
                        collapse1.className === 'collapse show' &&
                        !collapseToggle1.classList.contains('collapsed') &&
                        collapseToggle1.getAttribute('aria-expanded') === 'true',
                    );
                });
                UI.Collapse.init(collapse1).toggle();
            });

            await expect(page.locator('html')).toHaveAttribute('data-collapse-hide-state', 'true');
        });

        test('triggers hidden event (toggle)', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#collapse1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                $.addEvent(collapse1, 'hidden.ui.collapse', (_) => {
                    document.documentElement.dataset.collapseHidden = 'true';
                });
                UI.Collapse.init(collapse1).toggle();
            });
            await advanceClock(page, 150);

            await expect(page.locator('html')).toHaveAttribute('data-collapse-hidden', 'true');
            await expect(page.locator('#collapseToggle1')).toHaveClass('btn btn-secondary collapsed');
            await expect(page.locator('#collapseToggle1')).toHaveAttribute('aria-expanded', 'false');
            await expect(page.locator('#collapse1')).toHaveClass('collapse');
        });

        test('can be prevented from showing', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                $.addEvent(collapse1, 'show.ui.collapse', (_) => false);
                UI.Collapse.init(collapse1).show();
            });
            await advanceClock(page, 250);

            await expect(page.locator('#collapseToggle1')).toHaveClass('btn btn-secondary collapsed');
            expect(await page.locator('#collapseToggle1').getAttribute('aria-expanded')).toBeNull();
            await expect(page.locator('#collapse1')).toHaveClass('collapse');
            await expectAnimationState(page, [
                {
                    selectors: ['#collapse1'],
                },
            ]);
        });

        test('can be prevented from showing (prevent default)', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                $.addEvent(collapse1, 'show.ui.collapse', (event) => {
                    event.preventDefault();
                });
                UI.Collapse.init(collapse1).show();
            });
            await advanceClock(page, 250);

            await expect(page.locator('#collapseToggle1')).toHaveClass('btn btn-secondary collapsed');
            expect(await page.locator('#collapseToggle1').getAttribute('aria-expanded')).toBeNull();
            await expect(page.locator('#collapse1')).toHaveClass('collapse');
            await expectAnimationState(page, [
                {
                    selectors: ['#collapse1'],
                },
            ]);
        });

        test('can be prevented from hiding', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#collapse1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                $.addEvent(collapse1, 'hide.ui.collapse', (_) => false);
                UI.Collapse.init(collapse1).hide();
            });
            await advanceClock(page, 250);

            await expect(page.locator('#collapseToggle1')).toHaveClass('btn btn-secondary');
            await expect(page.locator('#collapseToggle1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#collapse1')).toHaveClass('collapse show');
            await expectAnimationState(page, [
                {
                    selectors: ['#collapse1'],
                },
            ]);
        });

        test('can be prevented from hiding (prevent default)', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#collapse1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                $.addEvent(collapse1, 'hide.ui.collapse', (event) => {
                    event.preventDefault();
                });
                UI.Collapse.init(collapse1).hide();
            });
            await advanceClock(page, 250);

            await expect(page.locator('#collapseToggle1')).toHaveClass('btn btn-secondary');
            await expect(page.locator('#collapseToggle1')).toHaveAttribute('aria-expanded', 'true');
            await expect(page.locator('#collapse1')).toHaveClass('collapse show');
            await expectAnimationState(page, [
                {
                    selectors: ['#collapse1'],
                },
            ]);
        });
    });

    test.describe('duration option', () => {
        test('works with duration option on show', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1, { duration: 200 }).show();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#collapse1'],
                    progress: 0.875,
                },
            ]);
        });

        test('works with duration option on show (data-ui-duration)', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                $.setDataset(collapse1, { uiDuration: 200 });
                UI.Collapse.init(collapse1).show();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#collapse1'],
                    progress: 0.875,
                },
            ]);
        });

        test('works with duration option on show (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#collapse1')
                    .collapse({ duration: 200 })
                    .show();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#collapse1'],
                    progress: 0.875,
                },
            ]);
        });

        test('works with duration option on hide', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1, { duration: 200 }).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#collapse1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).hide();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#collapse1'],
                    progress: 0.875,
                },
            ]);
        });

        test('works with duration option on hide (data-ui-duration)', async ({ page }) => {
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                $.setDataset(collapse1, { uiDuration: 200 });
                UI.Collapse.init(collapse1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#collapse1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const collapse1 = $.findOne('#collapse1');
                UI.Collapse.init(collapse1).hide();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#collapse1'],
                    progress: 0.875,
                },
            ]);
        });

        test('works with duration option on hide (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#collapse1')
                    .collapse({ duration: 200 })
                    .show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#collapse1');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $('#collapse1').collapse('hide');
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#collapse1'],
                    progress: 0.875,
                },
            ]);
        });
    });
});
