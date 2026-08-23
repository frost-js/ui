import { expect, test } from '@playwright/test';
import { advanceClock, resetPage, setupClock } from '../../setup/browser.js';
import { expectAnimationState } from '../../support/assertions/animation.js';
import { expectStyles } from '../../support/assertions/styles.js';
import { measureScrollbarSize } from '../../support/measurements/scrollbar.js';

test.beforeEach(async ({ page }) => {
    await setupClock(page);
    await resetPage(page);
});

test.describe('Modal', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<button class="btn btn-secondary" id="modalToggle1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>' +
                '<button class="btn btn-secondary" id="modalToggle2" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>' +
                '<div class="modal" id="modal1">' +
                '<div class="modal-dialog" id="modalDialog1">' +
                '<button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>' +
                '</div>' +
                '</div>' +
                '<div class="modal" id="modal2">' +
                '<div class="modal-dialog" id="modalDialog2">' +
                '<button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>' +
                '</div>' +
                '</div>';
        });
    });

    test.describe('#init', () => {
        test('creates a modal', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                return UI.Modal.init(modal1) instanceof UI.Modal;
            })).toBe(true);
        });

        test('creates a modal (data-ui-toggle)', async ({ page }) => {
            await page.locator('#modalToggle1').click();

            expect(await page.evaluate((_) =>
                $.getData('#modal1', 'modal') instanceof UI.Modal)).toBe(true);
        });

        test('creates a modal (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('#modal1').modal();
                return $.getData('#modal1', 'modal') instanceof UI.Modal;
            })).toBe(true);
        });

        test('returns the modal (query)', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $('#modal1').modal() instanceof UI.Modal)).toBe(true);
        });
    });

    test.describe('#dispose', () => {
        test('removes the modal', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).dispose();
                return $.hasData(modal1, 'modal');
            })).toBe(false);
        });

        test('removes the modal (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('#modal1').modal('dispose');
                return $.hasData('#modal1', 'modal');
            })).toBe(false);
        });

        test('clears modal memory', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                const modal = UI.Modal.init(modal1);
                modal.dispose();

                for (const key in modal) {
                    if ($._isObject(modal[key]) && !$._isFunction(modal[key])) {
                        return false;
                    }
                }

                return true;
            })).toBe(true);
        });

        test('clears modal memory when node is removed', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                const modal = UI.Modal.init(modal1);
                $.setHTML(document.body, '');

                for (const key in modal) {
                    if ($._isObject(modal[key]) && !$._isFunction(modal[key])) {
                        return false;
                    }
                }

                return true;
            })).toBe(true);
        });
    });

    test.describe('#show', () => {
        test('shows the modal', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await advanceClock(page, 125);
            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1', '.modal-backdrop'],
                    active: true,
                },
            ]);
            await advanceClock(page, 175);

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modalDialog1')).toHaveAttribute('style', '');
            await expect(page.locator('#modal2')).toHaveClass('modal');
            await expect(page.locator('.modal-backdrop')).toHaveCount(1);
            await expect(page.locator('.modal-backdrop')).toHaveAttribute('style', '');
            await expect(page.locator('body')).toHaveClass(/\bmodal-open\b/);
        });

        test('shows the modal (data-ui-toggle)', async ({ page }) => {
            await page.locator('#modalToggle1').click();
            await advanceClock(page, 125);
            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1', '.modal-backdrop'],
                    active: true,
                },
            ]);
            await advanceClock(page, 175);

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modalDialog1')).toHaveAttribute('style', '');
            await expect(page.locator('#modal2')).toHaveClass('modal');
        });

        test('shows the modal (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#modal1').modal('show');
            });
            await advanceClock(page, 125);
            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1', '.modal-backdrop'],
                    active: true,
                },
            ]);
            await advanceClock(page, 175);

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modalDialog1')).toHaveAttribute('style', '');
            await expect(page.locator('#modal2')).toHaveClass('modal');
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                const modal = UI.Modal.init(modal1);
                modal.show();
                modal.show();
                modal.show();
            });
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1', '.modal-backdrop'],
                    active: true,
                },
            ]);
        });

        test('clears animation state when showing is interrupted', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1', { finish: false });
                $.stop('.modal-backdrop', { finish: false });
            });
            await advanceClock(page, 0);

            await expect(page.locator('#modalDialog1')).not.toHaveAttribute('data-ui-animating');
        });

        test('can be called on shown modal', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1', '.modal-backdrop'],
                },
            ]);
        });

        test('allows modals to stack', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const modal2 = $.findOne('#modal2');
                UI.Modal.init(modal2).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog2');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modalDialog1')).toHaveAttribute('style', '');
            await expect(page.locator('#modal2')).toHaveClass('modal show');
            await expect(page.locator('#modal2')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal2')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modal2')).toHaveAttribute('style', 'z-index: 1080;');
            await expect(page.locator('#modalDialog2')).toHaveAttribute('style', '');
            await expect(page.locator('.modal-backdrop')).toHaveCount(2);
            await expect(page.locator('.modal-backdrop').nth(0)).toHaveAttribute('style', '');
            await expect(page.locator('.modal-backdrop').nth(1)).toHaveAttribute('style', 'z-index: 1070;');
        });
    });

    test.describe('#hide', () => {
        test('hides the modal', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).hide();
            });
            await advanceClock(page, 125);
            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1', '.modal-backdrop'],
                    active: true,
                },
            ]);
            await advanceClock(page, 175);

            await expect(page.locator('#modal1')).toHaveClass('modal');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'false');
            await expect(page.locator('#modalDialog1')).toHaveAttribute('style', '');
            await expect(page.locator('#modal2')).toHaveClass('modal');
            await expect(page.locator('.modal-backdrop')).toHaveCount(0);
            await expect(page.locator('body')).not.toHaveClass(/\bmodal-open\b/);
        });

        test('hides the modal (data-ui-dismiss)', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);
            await page.locator('#button1').dispatchEvent('click');
            await advanceClock(page, 125);
            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1', '.modal-backdrop'],
                    active: true,
                },
            ]);
            await advanceClock(page, 175);

            await expect(page.locator('#modal1')).toHaveClass('modal');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'false');
            await expect(page.locator('#modalDialog1')).toHaveAttribute('style', '');
            await expect(page.locator('#modal2')).toHaveClass('modal');
        });

        test('hides the modal (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#modal1').modal('show');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $('#modal1').modal('hide');
            });
            await advanceClock(page, 125);
            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1', '.modal-backdrop'],
                    active: true,
                },
            ]);
            await advanceClock(page, 175);

            await expect(page.locator('#modal1')).toHaveClass('modal');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'false');
            await expect(page.locator('#modalDialog1')).toHaveAttribute('style', '');
            await expect(page.locator('#modal2')).toHaveClass('modal');
        });

        test('does not remove the modal after hiding', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).hide();
            });
            await advanceClock(page, 300);

            expect(await page.evaluate((_) =>
                $.getData('#modal1', 'modal') instanceof UI.Modal)).toBe(true);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                const modal = UI.Modal.init(modal1);
                modal.hide();
                modal.hide();
                modal.hide();
            });
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1', '.modal-backdrop'],
                    active: true,
                },
            ]);
        });

        test('can be called on hidden modal', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).hide();
            });

            await expect(page.locator('#modal1')).toHaveClass('modal');
            await expect(page.locator('.modal-backdrop')).toHaveCount(0);
            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1'],
                },
            ]);
        });

        test('does not close stacked modals (data-ui-dismiss)', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const modal2 = $.findOne('#modal2');
                UI.Modal.init(modal2).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog2');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);
            await page.locator('#button2').dispatchEvent('click');
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog2');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modal2')).toHaveClass('modal');
            await expect(page.locator('#modal2')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#modal2')).toHaveAttribute('aria-modal', 'false');
            await expect(page.locator('#modal2')).toHaveAttribute('style', '');
            await expect(page.locator('.modal-backdrop')).toHaveCount(1);
        });
    });

    test.describe('#toggle (show)', () => {
        test('shows the modal', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).toggle();
            });
            await advanceClock(page, 125);
            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1', '.modal-backdrop'],
                    active: true,
                },
            ]);
            await advanceClock(page, 175);

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modalDialog1')).toHaveAttribute('style', '');
            await expect(page.locator('#modal2')).toHaveClass('modal');
        });

        test('shows the modal (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#modal1').modal('toggle');
            });
            await advanceClock(page, 125);
            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1', '.modal-backdrop'],
                    active: true,
                },
            ]);
            await advanceClock(page, 175);

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modalDialog1')).toHaveAttribute('style', '');
            await expect(page.locator('#modal2')).toHaveClass('modal');
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                const modal = UI.Modal.init(modal1);
                modal.toggle();
                modal.toggle();
                modal.toggle();
            });
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1', '.modal-backdrop'],
                    active: true,
                },
            ]);
        });
    });

    test.describe('#toggle (hide)', () => {
        test('hides the modal', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).toggle();
            });
            await advanceClock(page, 125);
            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1', '.modal-backdrop'],
                    active: true,
                },
            ]);
            await advanceClock(page, 175);

            await expect(page.locator('#modal1')).toHaveClass('modal');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'false');
            await expect(page.locator('#modalDialog1')).toHaveAttribute('style', '');
            await expect(page.locator('#modal2')).toHaveClass('modal');
        });

        test('hides the modal (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#modal1').modal('show');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $('#modal1').modal('toggle');
            });
            await advanceClock(page, 125);
            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1', '.modal-backdrop'],
                    active: true,
                },
            ]);
            await advanceClock(page, 175);

            await expect(page.locator('#modal1')).toHaveClass('modal');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'false');
            await expect(page.locator('#modalDialog1')).toHaveAttribute('style', '');
            await expect(page.locator('#modal2')).toHaveClass('modal');
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                const modal = UI.Modal.init(modal1);
                modal.toggle();
                modal.toggle();
                modal.toggle();
            });
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1', '.modal-backdrop'],
                    active: true,
                },
            ]);
        });
    });

    test.describe('events', () => {
        test('triggers show event', async ({ page }) => {
            const eventTriggered = await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                let triggered = false;

                $.addEvent(modal1, 'show.ui.modal', (_) => {
                    triggered = true;
                });
                UI.Modal.init(modal1).show();

                return triggered;
            });

            expect(eventTriggered).toBe(true);
        });

        test('triggers shown event', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                window.modalShownEventTriggered = false;

                $.addEvent(modal1, 'shown.ui.modal', (_) => {
                    window.modalShownEventTriggered = true;
                });
                UI.Modal.init(modal1).show();
            });
            await advanceClock(page, 300);

            expect(await page.evaluate((_) => window.modalShownEventTriggered)).toBe(true);
            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
        });

        test('triggers hide event', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);
            const eventTriggered = await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                let triggered = false;

                $.addEvent(modal1, 'hide.ui.modal', (_) => {
                    triggered = true;
                });
                UI.Modal.init(modal1).hide();

                return triggered;
            });

            expect(eventTriggered).toBe(true);
        });

        test('triggers hidden event', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                window.modalHiddenEventTriggered = false;

                $.addEvent(modal1, 'hidden.ui.modal', (_) => {
                    window.modalHiddenEventTriggered = true;
                });
                UI.Modal.init(modal1).hide();
            });
            await advanceClock(page, 300);

            expect(await page.evaluate((_) => window.modalHiddenEventTriggered)).toBe(true);
            await expect(page.locator('#modal1')).toHaveClass('modal');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'false');
        });

        test('triggers show event (toggle)', async ({ page }) => {
            const eventTriggered = await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                let triggered = false;

                $.addEvent(modal1, 'show.ui.modal', (_) => {
                    triggered = true;
                });
                UI.Modal.init(modal1).toggle();

                return triggered;
            });

            expect(eventTriggered).toBe(true);
        });

        test('triggers shown event (toggle)', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                window.modalShownEventTriggered = false;

                $.addEvent(modal1, 'shown.ui.modal', (_) => {
                    window.modalShownEventTriggered = true;
                });
                UI.Modal.init(modal1).toggle();
            });
            await advanceClock(page, 300);

            expect(await page.evaluate((_) => window.modalShownEventTriggered)).toBe(true);
            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
        });

        test('triggers hide event (toggle)', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);
            const eventTriggered = await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                let triggered = false;

                $.addEvent(modal1, 'hide.ui.modal', (_) => {
                    triggered = true;
                });
                UI.Modal.init(modal1).toggle();

                return triggered;
            });

            expect(eventTriggered).toBe(true);
        });

        test('triggers hidden event (toggle)', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                window.modalHiddenEventTriggered = false;

                $.addEvent(modal1, 'hidden.ui.modal', (_) => {
                    window.modalHiddenEventTriggered = true;
                });
                UI.Modal.init(modal1).toggle();
            });
            await advanceClock(page, 300);

            expect(await page.evaluate((_) => window.modalHiddenEventTriggered)).toBe(true);
            await expect(page.locator('#modal1')).toHaveClass('modal');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'false');
        });

        test('can be prevented from showing', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                $.addEvent(modal1, 'show.ui.modal', (_) => false);
                UI.Modal.init(modal1).show();
            });
            await advanceClock(page, 300);

            await expect(page.locator('#modal1')).toHaveClass('modal');
            await expect(page.locator('#modal1')).not.toHaveAttribute('aria-hidden');
            await expect(page.locator('#modal1')).not.toHaveAttribute('aria-modal');
            await expect(page.locator('body')).not.toHaveClass(/\bmodal-open\b/);
            await expect(page.locator('.modal-backdrop')).toHaveCount(0);
            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1'],
                },
            ]);
        });

        test('can be prevented from showing (prevent default)', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                $.addEvent(modal1, 'show.ui.modal', (event) => {
                    event.preventDefault();
                });
                UI.Modal.init(modal1).show();
            });
            await advanceClock(page, 300);

            await expect(page.locator('#modal1')).toHaveClass('modal');
            await expect(page.locator('#modal1')).not.toHaveAttribute('aria-hidden');
            await expect(page.locator('#modal1')).not.toHaveAttribute('aria-modal');
            await expect(page.locator('body')).not.toHaveClass(/\bmodal-open\b/);
            await expect(page.locator('.modal-backdrop')).toHaveCount(0);
            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1'],
                },
            ]);
        });

        test('can be prevented from hiding', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                $.addEvent(modal1, 'hide.ui.modal', (_) => false);
                UI.Modal.init(modal1).hide();
            });
            await advanceClock(page, 300);

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('body')).toHaveClass(/\bmodal-open\b/);
            await expect(page.locator('.modal-backdrop')).toHaveCount(1);
            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1', '.modal-backdrop'],
                },
            ]);
        });

        test('can be prevented from hiding (prevent default)', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                $.addEvent(modal1, 'hide.ui.modal', (event) => {
                    event.preventDefault();
                });
                UI.Modal.init(modal1).hide();
            });
            await advanceClock(page, 300);

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('body')).toHaveClass(/\bmodal-open\b/);
            await expect(page.locator('.modal-backdrop')).toHaveCount(1);
            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1', '.modal-backdrop'],
                },
            ]);
        });
    });

    test.describe('duration option', () => {
        test('works with duration option on show', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1, { duration: 200 }).show();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1', '.modal-backdrop'],
                    progress: 0.875,
                },
            ]);
        });

        test('works with duration option on show (data-ui-duration)', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                $.setDataset(modal1, { uiDuration: 200 });
                UI.Modal.init(modal1).show();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1', '.modal-backdrop'],
                    progress: 0.875,
                },
            ]);
        });

        test('works with duration option on show (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#modal1')
                    .modal({ duration: 200 })
                    .show();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1', '.modal-backdrop'],
                    progress: 0.875,
                },
            ]);
        });

        test('works with duration option on hide', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1, { duration: 200 }).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).hide();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1', '.modal-backdrop'],
                    progress: 0.875,
                },
            ]);
        });

        test('works with duration option on hide (data-ui-duration)', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                $.setDataset(modal1, { uiDuration: 200 });
                UI.Modal.init(modal1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).hide();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1', '.modal-backdrop'],
                    progress: 0.875,
                },
            ]);
        });

        test('works with duration option on hide (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#modal1')
                    .modal({ duration: 200 })
                    .show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $('#modal1').modal('hide');
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1', '.modal-backdrop'],
                    progress: 0.875,
                },
            ]);
        });
    });

    test.describe('keyboard option', () => {
        test('hides the modal on escape', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);
            await page.keyboard.press('Escape');
            await advanceClock(page, 125);
            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1', '.modal-backdrop'],
                    active: true,
                },
            ]);
            await advanceClock(page, 175);

            await expect(page.locator('#modal1')).toHaveClass('modal');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'false');
            await expect(page.locator('#modalDialog1')).toHaveAttribute('style', '');
            await expect(page.locator('#modal2')).toHaveClass('modal');
        });

        test('works with keyboard option', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1, { keyboard: false }).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);
            await page.keyboard.press('Escape');
            await advanceClock(page, 300);

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modalDialog1')).toHaveAttribute('style', '');
            await expect(page.locator('#modal2')).toHaveClass('modal');
            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1', '.modal-backdrop'],
                },
            ]);
        });

        test('works with keyboard option (data-ui-keyboard)', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                $.setDataset(modal1, { uiKeyboard: false });
                UI.Modal.init(modal1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);
            await page.keyboard.press('Escape');
            await advanceClock(page, 300);

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('data-ui-keyboard', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modalDialog1')).toHaveAttribute('style', '');
            await expect(page.locator('#modal2')).toHaveClass('modal');
            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1', '.modal-backdrop'],
                },
            ]);
        });

        test('works with keyboard option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#modal1')
                    .modal({ keyboard: false })
                    .show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);
            await page.keyboard.press('Escape');
            await advanceClock(page, 300);

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modalDialog1')).toHaveAttribute('style', '');
            await expect(page.locator('#modal2')).toHaveClass('modal');
            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1', '.modal-backdrop'],
                },
            ]);
        });
    });

    test.describe('show option', () => {
        test('works with show option', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1, { show: true });
            });
            await advanceClock(page, 125);
            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1', '.modal-backdrop'],
                    active: true,
                },
            ]);
            await advanceClock(page, 175);

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modalDialog1')).toHaveAttribute('style', '');
            await expect(page.locator('.modal-backdrop')).toHaveCount(1);
        });

        test('works with show option (data-ui-show)', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                $.setDataset(modal1, { uiShow: true });
                UI.Modal.init(modal1);
            });
            await advanceClock(page, 125);
            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1', '.modal-backdrop'],
                    active: true,
                },
            ]);
            await advanceClock(page, 175);

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('data-ui-show', 'true');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modalDialog1')).toHaveAttribute('style', '');
            await expect(page.locator('.modal-backdrop')).toHaveCount(1);
        });

        test('works with show option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#modal1').modal({ show: true });
            });
            await advanceClock(page, 125);
            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1', '.modal-backdrop'],
                    active: true,
                },
            ]);
            await advanceClock(page, 175);

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modalDialog1')).toHaveAttribute('style', '');
            await expect(page.locator('.modal-backdrop')).toHaveCount(1);
        });

        test('works without show option', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1);
            });
            await advanceClock(page, 125);

            await expect(page.locator('#modal1')).toHaveClass('modal');
            await expect(page.locator('#modal1')).not.toHaveAttribute('aria-hidden');
            await expect(page.locator('#modal1')).not.toHaveAttribute('aria-modal');
            await expect(page.locator('.modal-backdrop')).toHaveCount(0);
            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1'],
                },
            ]);
        });
    });

    test.describe('backdrop option', () => {
        test('works with backdrop option', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1, { backdrop: false }).show();
            });
            await advanceClock(page, 125);
            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1'],
                    active: true,
                },
            ]);
            await advanceClock(page, 175);

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modalDialog1')).toHaveAttribute('style', '');
            await expect(page.locator('.modal-backdrop')).toHaveCount(0);
        });

        test('works with backdrop option (data-ui-backdrop)', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                $.setDataset(modal1, { uiBackdrop: false });
                UI.Modal.init(modal1).show();
            });
            await advanceClock(page, 125);
            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1'],
                    active: true,
                },
            ]);
            await advanceClock(page, 175);

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('data-ui-backdrop', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modalDialog1')).toHaveAttribute('style', '');
            await expect(page.locator('.modal-backdrop')).toHaveCount(0);
        });

        test('works with backdrop option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#modal1')
                    .modal({ backdrop: false })
                    .show();
            });
            await advanceClock(page, 125);
            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1'],
                    active: true,
                },
            ]);
            await advanceClock(page, 175);

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modalDialog1')).toHaveAttribute('style', '');
            await expect(page.locator('.modal-backdrop')).toHaveCount(0);
        });

        test('hides the modal on document click (with backdrop)', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);
            await page.locator('body').dispatchEvent('click');
            await advanceClock(page, 125);
            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1', '.modal-backdrop'],
                    active: true,
                },
            ]);
            await advanceClock(page, 175);

            await expect(page.locator('#modal1')).toHaveClass('modal');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'false');
            await expect(page.locator('#modalDialog1')).toHaveAttribute('style', '');
            await expect(page.locator('.modal-backdrop')).toHaveCount(0);
        });

        test('does not hide the modal on document click (without backdrop)', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1, { backdrop: false }).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
            });
            await advanceClock(page, 50);
            await page.locator('body').dispatchEvent('click');

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('.modal-backdrop')).toHaveCount(0);
            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1'],
                },
            ]);
        });

        test('does not hide the modal on document click (static backdrop)', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1, { backdrop: 'static' }).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);
            await page.locator('body').dispatchEvent('click');
            await advanceClock(page, 250);

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('.modal-backdrop')).toHaveCount(1);
        });

        test('does not hide the modal on document click (mousedown on dialog)', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);
            await page.locator('#modalDialog1').dispatchEvent('mousedown');
            await page.locator('body').dispatchEvent('click');

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('.modal-backdrop')).toHaveCount(1);
            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1', '.modal-backdrop'],
                },
            ]);
        });

        test('hides the modal on dialog click (mousedown on backdrop)', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);
            await page.locator('.modal-backdrop').dispatchEvent('mousedown');
            await page.locator('#modalDialog1').dispatchEvent('click');
            await advanceClock(page, 125);
            await expectAnimationState(page, [
                {
                    selectors: ['#modalDialog1', '.modal-backdrop'],
                    active: true,
                },
            ]);
            await advanceClock(page, 175);

            await expect(page.locator('#modal1')).toHaveClass('modal');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'false');
            await expect(page.locator('.modal-backdrop')).toHaveCount(0);
        });

        test('does not close stacked modals on document click', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const modal2 = $.findOne('#modal2');
                UI.Modal.init(modal2).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog2');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);
            await page.locator('body').dispatchEvent('click');
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog2');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modal2')).toHaveClass('modal');
            await expect(page.locator('#modal2')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#modal2')).toHaveAttribute('aria-modal', 'false');
            await expect(page.locator('#modal2')).toHaveAttribute('style', '');
            await expect(page.locator('.modal-backdrop')).toHaveCount(1);
        });
    });

    test.describe('scroll padding', () => {
        test('adds scroll padding (vertical)', async ({ page }) => {
            const scrollbarSize = await measureScrollbarSize(page);
            const paddingRight = scrollbarSize ?
                `${scrollbarSize}px` :
                '';

            await page.evaluate((_) => {
                $.setStyle(document.body, { height: '2000px' });
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);

            await expectStyles(page, [
                {
                    selectors: ['body', '#modalDialog1'],
                    styles: { paddingRight },
                },
            ]);
        });

        test('does not add padding if scrollbars are hidden (vertical)', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);

            await expectStyles(page, [
                {
                    selectors: ['body', '#modalDialog1'],
                    styles: { paddingRight: '' },
                },
            ]);
        });

        test('works with existing padding (vertical)', async ({ page }) => {
            const scrollbarSize = await measureScrollbarSize(page);

            await page.evaluate((_) => {
                $.setStyle(document.body, {
                    height: '2000px',
                    paddingRight: '10px',
                });
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);

            await expectStyles(page, [
                {
                    selectors: ['body'],
                    styles: { paddingRight: `${scrollbarSize + 10}px` },
                },
            ]);
        });

        test('restores scroll padding (vertical)', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle(document.body, { height: '2000px' });
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).hide();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);

            await expectStyles(page, [
                {
                    selectors: ['body', '#modalDialog1'],
                    styles: { paddingRight: '' },
                },
            ]);
        });

        test('restores existing scroll padding to document body (vertical)', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle(document.body, {
                    height: '2000px',
                    paddingRight: '10px',
                });
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).hide();
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop('#modalDialog1');
                $.stop('.modal-backdrop');
            });
            await advanceClock(page, 50);

            await expectStyles(page, [
                {
                    selectors: ['body'],
                    styles: { paddingRight: '10px' },
                },
            ]);
        });
    });
});
