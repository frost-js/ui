import { expect, test } from '#test';
import { resetPage } from '../../setup/browser.js';
import { expectStyles } from '../../support/assertions/styles.js';
import { measureScrollbarSize } from '../../support/measurements/scrollbar.js';

test.use({ reducedMotion: 'no-preference' });

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('Modal', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            $.setHTML(
                document.body,
                `
                    <button class="btn btn-secondary" id="modal-toggle-1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>
                    <button class="btn btn-secondary" id="modal-toggle-2" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>
                    <div class="modal" id="modal1">
                        <div class="modal-dialog" id="modal-dialog-1">
                            <button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>
                        </div>
                    </div>
                    <div class="modal" id="modal2">
                        <div class="modal-dialog" id="modal-dialog-2">
                            <button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>
                        </div>
                    </div>
                `,
            );
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
            await page.locator('#modal-toggle-1').click();

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

        test('cleans up a shown modal', async ({ page }) => {
            await page.evaluate((_) => {
                $.setStyle(document.body, {
                    height: '2000px',
                    paddingRight: '10px',
                });

                const modal1 = $.findOne('#modal1');

                UI.Modal.init(modal1).show();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            const hiddenEventTriggered = await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                let triggered = false;

                $.addEvent(modal1, 'hidden.ui.modal', (_) => {
                    triggered = true;
                });
                UI.Modal.init(modal1).dispose();

                return triggered;
            });

            expect(hiddenEventTriggered).toBe(false);
            await expect(page.locator('#modal1')).toHaveClass('modal');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'false');
            await expect(page.locator('.modal-backdrop')).toHaveCount(0);
            await expect(page.locator('body')).not.toHaveClass(/\bmodal-open\b/);
            await expectStyles(page, [
                {
                    selectors: ['body'],
                    styles: { paddingRight: '10px' },
                },
                {
                    selectors: ['#modal-dialog-1'],
                    styles: { paddingRight: '' },
                },
            ]);
            expect(await page.evaluate((_) => $.hasData('#modal1', 'modal'))).toBe(false);
        });

        test('cleans up while showing', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');

                window.modalDisposeEvents = {
                    hidden: false,
                    shown: false,
                };
                $.addEvent(modal1, 'hidden.ui.modal', (_) => {
                    window.modalDisposeEvents.hidden = true;
                });
                $.addEvent(modal1, 'shown.ui.modal', (_) => {
                    window.modalDisposeEvents.shown = true;
                });

                const modal = UI.Modal.init(modal1);

                modal.show();
                modal.dispose();
            });

            await page.waitForTimeout(400);

            await expect(page.locator('#modal1')).toHaveClass('modal');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'false');
            await expect(page.locator('.modal-backdrop')).toHaveCount(0);
            await expect(page.locator('body')).not.toHaveClass(/\bmodal-open\b/);
            expect(await page.evaluate((_) => window.modalDisposeEvents)).toEqual({
                hidden: false,
                shown: false,
            });
        });
    });

    test.describe('#show', () => {
        test('shows the modal', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modal-dialog-1')).not.toHaveAttribute('style');
            await expect(page.locator('#modal2')).toHaveClass('modal');
            await expect(page.locator('.modal-backdrop')).toHaveCount(1);
            await expect(page.locator('.modal-backdrop')).not.toHaveAttribute('style');
            await expect(page.locator('body')).toHaveClass(/\bmodal-open\b/);
        });

        test('shows the modal (data-ui-toggle)', async ({ page }) => {
            await page.locator('#modal-toggle-1').click();

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modal-dialog-1')).not.toHaveAttribute('style');
            await expect(page.locator('#modal2')).toHaveClass('modal');
        });

        test('shows the modal (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#modal1').modal('show');
            });

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modal-dialog-1')).not.toHaveAttribute('style');
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

            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('.modal-backdrop')).toHaveCount(1);
        });

        test('can be called on shown modal', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });

            await expect(page.locator('#modal1')).toHaveClass('modal show');
        });

        test('allows modals to stack', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate((_) => {
                const modal2 = $.findOne('#modal2');
                UI.Modal.init(modal2).show();
            });

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modal-dialog-1')).not.toHaveAttribute('style');
            await expect(page.locator('#modal2')).toHaveClass('modal show');
            await expect(page.locator('#modal2')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal2')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modal2')).toHaveAttribute('style', 'z-index: 1080;');
            await expect(page.locator('#modal-dialog-2')).not.toHaveAttribute('style');
            await expect(page.locator('.modal-backdrop')).toHaveCount(2);
            await expect(page.locator('.modal-backdrop').nth(0)).not.toHaveAttribute('style');
            await expect(page.locator('.modal-backdrop').nth(1)).toHaveAttribute('style', 'z-index: 1070;');
        });
    });

    test.describe('#hide', () => {
        test('hides the modal', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).hide();
            });

            await expect(page.locator('#modal1')).toHaveClass('modal');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'false');
            await expect(page.locator('#modal-dialog-1')).not.toHaveAttribute('style');
            await expect(page.locator('#modal2')).toHaveClass('modal');
            await expect(page.locator('.modal-backdrop')).toHaveCount(0);
            await expect(page.locator('body')).not.toHaveClass(/\bmodal-open\b/);
        });

        test('reindexes remaining modals when an older modal is hidden', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate((_) => {
                const modal2 = $.findOne('#modal2');
                UI.Modal.init(modal2).show();
            });
            await expect(page.locator('#modal2')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).hide();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'true');

            await expect(page.locator('#modal2')).toHaveAttribute('style', '');
            await expect(page.locator('.modal-backdrop')).toHaveCount(1);
            await expect(page.locator('.modal-backdrop')).toHaveAttribute('style', '');

            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            await expect(page.locator('#modal1')).toHaveAttribute('style', 'z-index: 1080;');
            await expect(page.locator('.modal-backdrop').nth(1)).toHaveAttribute('style', 'z-index: 1070;');

            await page.keyboard.press('Escape');

            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#modal2')).toHaveAttribute('aria-hidden', 'false');
        });

        test('hides the modal (data-ui-dismiss)', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            await page.locator('#button1').dispatchEvent('click');

            await expect(page.locator('#modal1')).toHaveClass('modal');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'false');
            await expect(page.locator('#modal-dialog-1')).not.toHaveAttribute('style');
            await expect(page.locator('#modal2')).toHaveClass('modal');
        });

        test('hides the modal (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#modal1').modal('show');
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate((_) => {
                $('#modal1').modal('hide');
            });

            await expect(page.locator('#modal1')).toHaveClass('modal');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'false');
            await expect(page.locator('#modal-dialog-1')).not.toHaveAttribute('style');
            await expect(page.locator('#modal2')).toHaveClass('modal');
        });

        test('does not remove the modal after hiding', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).hide();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'true');

            expect(await page.evaluate((_) =>
                $.getData('#modal1', 'modal') instanceof UI.Modal)).toBe(true);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                const modal = UI.Modal.init(modal1);
                modal.hide();
                modal.hide();
                modal.hide();
            });

            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('.modal-backdrop')).toHaveCount(0);
        });

        test('can be called on hidden modal', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).hide();
            });

            await expect(page.locator('#modal1')).toHaveClass('modal');
            await expect(page.locator('.modal-backdrop')).toHaveCount(0);
        });

        test('does not close stacked modals (data-ui-dismiss)', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate((_) => {
                const modal2 = $.findOne('#modal2');
                UI.Modal.init(modal2).show();
            });
            await expect(page.locator('#modal2')).toHaveAttribute('aria-hidden', 'false');

            await page.locator('#button2').dispatchEvent('click');

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

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modal-dialog-1')).not.toHaveAttribute('style');
            await expect(page.locator('#modal2')).toHaveClass('modal');
        });

        test('shows the modal (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#modal1').modal('toggle');
            });

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modal-dialog-1')).not.toHaveAttribute('style');
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

            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('.modal-backdrop')).toHaveCount(1);
        });
    });

    test.describe('#toggle (hide)', () => {
        test('hides the modal', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).toggle();
            });

            await expect(page.locator('#modal1')).toHaveClass('modal');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'false');
            await expect(page.locator('#modal-dialog-1')).not.toHaveAttribute('style');
            await expect(page.locator('#modal2')).toHaveClass('modal');
        });

        test('hides the modal (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#modal1').modal('show');
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate((_) => {
                $('#modal1').modal('toggle');
            });

            await expect(page.locator('#modal1')).toHaveClass('modal');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'false');
            await expect(page.locator('#modal-dialog-1')).not.toHaveAttribute('style');
            await expect(page.locator('#modal2')).toHaveClass('modal');
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                const modal = UI.Modal.init(modal1);
                modal.toggle();
                modal.toggle();
                modal.toggle();
            });

            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('.modal-backdrop')).toHaveCount(0);
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

            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            expect(await page.evaluate((_) => window.modalShownEventTriggered)).toBe(true);
        });

        test('triggers hide event', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

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
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                window.modalHiddenEventTriggered = false;

                $.addEvent(modal1, 'hidden.ui.modal', (_) => {
                    window.modalHiddenEventTriggered = true;
                });
                UI.Modal.init(modal1).hide();
            });

            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'false');
            expect(await page.evaluate((_) => window.modalHiddenEventTriggered)).toBe(true);
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

            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            expect(await page.evaluate((_) => window.modalShownEventTriggered)).toBe(true);
        });

        test('triggers hide event (toggle)', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

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
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                window.modalHiddenEventTriggered = false;

                $.addEvent(modal1, 'hidden.ui.modal', (_) => {
                    window.modalHiddenEventTriggered = true;
                });
                UI.Modal.init(modal1).toggle();
            });

            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'false');
            expect(await page.evaluate((_) => window.modalHiddenEventTriggered)).toBe(true);
        });

        test('can be prevented from showing', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                $.addEvent(modal1, 'show.ui.modal', (_) => false);
                UI.Modal.init(modal1).show();
            });

            await expect(page.locator('#modal1')).toHaveClass('modal');
            await expect(page.locator('#modal1')).not.toHaveAttribute('aria-hidden');
            await expect(page.locator('#modal1')).not.toHaveAttribute('aria-modal');
            await expect(page.locator('body')).not.toHaveClass(/\bmodal-open\b/);
            await expect(page.locator('.modal-backdrop')).toHaveCount(0);
        });

        test('can be prevented from showing (prevent default)', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                $.addEvent(modal1, 'show.ui.modal', (event) => {
                    event.preventDefault();
                });
                UI.Modal.init(modal1).show();
            });

            await expect(page.locator('#modal1')).toHaveClass('modal');
            await expect(page.locator('#modal1')).not.toHaveAttribute('aria-hidden');
            await expect(page.locator('#modal1')).not.toHaveAttribute('aria-modal');
            await expect(page.locator('body')).not.toHaveClass(/\bmodal-open\b/);
            await expect(page.locator('.modal-backdrop')).toHaveCount(0);
        });

        test('can be prevented from hiding', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                $.addEvent(modal1, 'hide.ui.modal', (_) => false);
                UI.Modal.init(modal1).hide();
            });

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('body')).toHaveClass(/\bmodal-open\b/);
            await expect(page.locator('.modal-backdrop')).toHaveCount(1);
        });

        test('can be prevented from hiding (prevent default)', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                $.addEvent(modal1, 'hide.ui.modal', (event) => {
                    event.preventDefault();
                });
                UI.Modal.init(modal1).hide();
            });

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('body')).toHaveClass(/\bmodal-open\b/);
            await expect(page.locator('.modal-backdrop')).toHaveCount(1);
        });
    });

    test.describe('keyboard option', () => {
        test('hides the modal on escape', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            await page.keyboard.press('Escape');

            await expect(page.locator('#modal1')).toHaveClass('modal');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'false');
            await expect(page.locator('#modal-dialog-1')).not.toHaveAttribute('style');
            await expect(page.locator('#modal2')).toHaveClass('modal');
        });

        test('works with keyboard option', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1, { keyboard: false }).show();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            await page.keyboard.press('Escape');

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modal-dialog-1')).not.toHaveAttribute('style');
            await expect(page.locator('#modal2')).toHaveClass('modal');
        });

        test('works with keyboard option (data-ui-keyboard)', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                $.setDataset(modal1, { uiKeyboard: false });
                UI.Modal.init(modal1).show();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            await page.keyboard.press('Escape');

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('data-ui-keyboard', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modal-dialog-1')).not.toHaveAttribute('style');
            await expect(page.locator('#modal2')).toHaveClass('modal');
        });

        test('works with keyboard option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#modal1')
                    .modal({ keyboard: false })
                    .show();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            await page.keyboard.press('Escape');

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modal-dialog-1')).not.toHaveAttribute('style');
            await expect(page.locator('#modal2')).toHaveClass('modal');
        });
    });

    test.describe('show option', () => {
        test('works with show option', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1, { show: true });
            });

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modal-dialog-1')).not.toHaveAttribute('style');
            await expect(page.locator('.modal-backdrop')).toHaveCount(1);
        });

        test('works with show option (data-ui-show)', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                $.setDataset(modal1, { uiShow: true });
                UI.Modal.init(modal1);
            });

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('data-ui-show', 'true');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modal-dialog-1')).not.toHaveAttribute('style');
            await expect(page.locator('.modal-backdrop')).toHaveCount(1);
        });

        test('works with show option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#modal1').modal({ show: true });
            });

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modal-dialog-1')).not.toHaveAttribute('style');
            await expect(page.locator('.modal-backdrop')).toHaveCount(1);
        });

        test('works without show option', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1);
            });

            await expect(page.locator('#modal1')).toHaveClass('modal');
            await expect(page.locator('#modal1')).not.toHaveAttribute('aria-hidden');
            await expect(page.locator('#modal1')).not.toHaveAttribute('aria-modal');
            await expect(page.locator('.modal-backdrop')).toHaveCount(0);
        });
    });

    test.describe('backdrop option', () => {
        test('works with backdrop option', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1, { backdrop: false }).show();
            });

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modal-dialog-1')).not.toHaveAttribute('style');
            await expect(page.locator('.modal-backdrop')).toHaveCount(0);
        });

        test('works with backdrop option (data-ui-backdrop)', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                $.setDataset(modal1, { uiBackdrop: false });
                UI.Modal.init(modal1).show();
            });

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('data-ui-backdrop', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modal-dialog-1')).not.toHaveAttribute('style');
            await expect(page.locator('.modal-backdrop')).toHaveCount(0);
        });

        test('works with backdrop option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#modal1')
                    .modal({ backdrop: false })
                    .show();
            });

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('#modal-dialog-1')).not.toHaveAttribute('style');
            await expect(page.locator('.modal-backdrop')).toHaveCount(0);
        });

        test('hides the modal on document click (with backdrop)', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            await page.locator('body').dispatchEvent('click');

            await expect(page.locator('#modal1')).toHaveClass('modal');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'true');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'false');
            await expect(page.locator('#modal-dialog-1')).not.toHaveAttribute('style');
            await expect(page.locator('.modal-backdrop')).toHaveCount(0);
        });

        test('does not hide the modal on document click (without backdrop)', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1, { backdrop: false }).show();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            await page.locator('body').dispatchEvent('click');

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('.modal-backdrop')).toHaveCount(0);
        });

        test('does not hide the modal on document click (static backdrop)', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1, { backdrop: 'static' }).show();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            await page.locator('body').dispatchEvent('click');

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
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            await page.locator('#modal-dialog-1').dispatchEvent('mousedown');
            await page.locator('body').dispatchEvent('click');

            await expect(page.locator('#modal1')).toHaveClass('modal show');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');
            await expect(page.locator('#modal1')).toHaveAttribute('aria-modal', 'true');
            await expect(page.locator('.modal-backdrop')).toHaveCount(1);
        });

        test('hides the modal on dialog click (mousedown on backdrop)', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            await page.locator('.modal-backdrop').dispatchEvent('mousedown');
            await page.locator('#modal-dialog-1').dispatchEvent('click');

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
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate((_) => {
                const modal2 = $.findOne('#modal2');
                UI.Modal.init(modal2).show();
            });
            await expect(page.locator('#modal2')).toHaveAttribute('aria-hidden', 'false');

            await page.locator('body').dispatchEvent('click');

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

            await expectStyles(page, [
                {
                    selectors: ['body', '#modal-dialog-1'],
                    styles: { paddingRight },
                },
            ]);
        });

        test('does not add padding if scrollbars are hidden (vertical)', async ({ page }) => {
            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });

            await expectStyles(page, [
                {
                    selectors: ['body', '#modal-dialog-1'],
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
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).hide();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'true');

            await expectStyles(page, [
                {
                    selectors: ['body', '#modal-dialog-1'],
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
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).hide();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'true');

            await expectStyles(page, [
                {
                    selectors: ['body'],
                    styles: { paddingRight: '10px' },
                },
            ]);
        });

        test('retains scroll padding when an older modal is hidden', async ({ page }) => {
            const scrollbarSize = await measureScrollbarSize(page);

            await page.evaluate((_) => {
                $.setStyle(document.body, {
                    height: '2000px',
                    paddingRight: '10px',
                });
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).show();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate((_) => {
                const modal2 = $.findOne('#modal2');
                UI.Modal.init(modal2).show();
            });
            await expect(page.locator('#modal2')).toHaveAttribute('aria-hidden', 'false');

            await page.evaluate((_) => {
                const modal1 = $.findOne('#modal1');
                UI.Modal.init(modal1).hide();
            });
            await expect(page.locator('#modal1')).toHaveAttribute('aria-hidden', 'true');

            await expectStyles(page, [
                {
                    selectors: ['body'],
                    styles: { paddingRight: `${scrollbarSize + 10}px` },
                },
            ]);
        });
    });
});
