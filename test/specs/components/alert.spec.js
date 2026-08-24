import { expect, test } from '@playwright/test';
import { advanceClock, resetPage, setupClock } from '../../setup/browser.js';
import { expectAnimationState } from '../../support/assertions/animation.js';

test.beforeEach(async ({ page }) => {
    await setupClock(page);
    await resetPage(page);
});

test.describe('Alert', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div class="alert alert-success" id="alert1">' +
                '<button class="btn-close" id="button1" data-ui-dismiss="alert" type="button"></button>' +
                '</div>' +
                '<div class="alert alert-success" id="alert2">' +
                '<button class="btn-close" id="button2" data-ui-dismiss="alert" type="button"></button>' +
                '</div>';
        });
    });

    test.describe('#init', () => {
        test('creates an alert', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const alert1 = $.findOne('#alert1');
                return UI.Alert.init(alert1) instanceof UI.Alert;
            })).toBe(true);
        });

        test('creates an alert (data-ui-toggle)', async ({ page }) => {
            await page.locator('#button1').click();

            expect(await page.evaluate((_) =>
                $.getData('#alert1', 'alert') instanceof UI.Alert)).toBe(true);
        });

        test('creates an alert (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('#alert1').alert();
                return $.getData('#alert1', 'alert') instanceof UI.Alert;
            })).toBe(true);
        });

        test('creates multiple alerts (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('.alert').alert();
                return $.find('.alert').every((node) =>
                    $.getData(node, 'alert') instanceof UI.Alert,
                );
            })).toBe(true);
        });

        test('returns the alert (query)', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $('#alert1').alert() instanceof UI.Alert)).toBe(true);
        });
    });

    test.describe('#dispose', () => {
        test('removes the alert', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const alert1 = $.findOne('#alert1');
                UI.Alert.init(alert1).dispose();
                return $.hasData(alert1, 'alert');
            })).toBe(false);
        });

        test('removes the alert (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('#alert1').alert('dispose');
                return $.hasData('#alert1', 'alert');
            })).toBe(false);
        });

        test('removes multiple alerts (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('.alert').alert('dispose');
                return $.find('.alert').some((node) =>
                    $.hasData(node, 'alert'),
                );
            })).toBe(false);
        });
    });

    test.describe('#close', () => {
        test('closes the alert', async ({ page }) => {
            await page.evaluate((_) => {
                const alert1 = $.findOne('#alert1');
                UI.Alert.init(alert1).close();
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#alert1'],
                    progress: 0.5,
                    styles: { opacity: '0.5' },
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#alert1')).toHaveCount(0);
            await expect(page.locator('#alert2')).toHaveCount(1);
        });

        test('closes the alert (data-ui-dismiss)', async ({ page }) => {
            await page.locator('#button1').click();
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#alert1'],
                    progress: 0.5,
                    styles: { opacity: '0.5' },
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#alert1')).toHaveCount(0);
            await expect(page.locator('#alert2')).toHaveCount(1);
        });

        test('closes the alert (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#alert1').alert('close');
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#alert1'],
                    progress: 0.5,
                    styles: { opacity: '0.5' },
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#alert1')).toHaveCount(0);
            await expect(page.locator('#alert2')).toHaveCount(1);
        });

        test('closes multiple alerts (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('.alert').alert('close');
            });
            await advanceClock(page, 150);

            await expect(page.locator('.alert')).toHaveCount(0);
        });

        test('removes the alert after closing', async ({ page }) => {
            await page.evaluate((_) => {
                const alert1 = $.findOne('#alert1');
                UI.Alert.init(alert1).close();
            });
            await advanceClock(page, 150);

            expect(await page.evaluate((_) =>
                $.hasData('#alert1', 'alert'))).toBe(false);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate((_) => {
                const alert1 = $.findOne('#alert1');
                const alert = UI.Alert.init(alert1);
                alert.close();
                alert.close();
                alert.close();
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#alert1'],
                    progress: 0.5,
                    styles: { opacity: '0.5' },
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#alert1')).toHaveCount(0);
            await expect(page.locator('#alert2')).toHaveCount(1);
        });
    });

    test.describe('events', () => {
        test('triggers close event', async ({ page }) => {
            const eventTriggered = await page.evaluate((_) => {
                const alert1 = $.findOne('#alert1');
                let triggered = false;

                $.addEvent(alert1, 'close.ui.alert', (_) => {
                    triggered = true;
                });
                UI.Alert.init(alert1).close();

                return triggered;
            });

            expect(eventTriggered).toBe(true);
            await expect(page.locator('#alert1')).toHaveCount(1);
            await expect(page.locator('#alert2')).toHaveCount(1);
        });

        test('triggers closed event', async ({ page }) => {
            await page.evaluate((_) => {
                const alert1 = $.findOne('#alert1');
                window.alertClosedEventTriggered = false;

                $.addEvent(alert1, 'closed.ui.alert', (_) => {
                    window.alertClosedEventTriggered = true;
                });
                UI.Alert.init(alert1).close();
            });
            await advanceClock(page, 150);

            expect(await page.evaluate((_) => window.alertClosedEventTriggered)).toBe(true);
            await expect(page.locator('#alert1')).toHaveCount(0);
            await expect(page.locator('#alert2')).toHaveCount(1);
        });

        test('can be prevented from closing', async ({ page }) => {
            await page.evaluate((_) => {
                const alert1 = $.findOne('#alert1');
                $.addEvent(alert1, 'close.ui.alert', (_) => false);
                UI.Alert.init(alert1).close();
            });
            await advanceClock(page, 100);

            await expect(page.locator('.alert')).toHaveCount(2);
            await expectAnimationState(page, [
                {
                    selectors: ['#alert1', '#alert2'],
                    styles: { opacity: '' },
                },
            ]);
        });

        test('can be prevented from closing (prevent default)', async ({ page }) => {
            await page.evaluate((_) => {
                const alert1 = $.findOne('#alert1');
                $.addEvent(alert1, 'close.ui.alert', (event) => {
                    event.preventDefault();
                });
                UI.Alert.init(alert1).close();
            });
            await advanceClock(page, 100);

            await expect(page.locator('.alert')).toHaveCount(2);
            await expectAnimationState(page, [
                {
                    selectors: ['#alert1', '#alert2'],
                    styles: { opacity: '' },
                },
            ]);
        });
    });

    test.describe('duration option', () => {
        test('works with duration option', async ({ page }) => {
            await page.evaluate((_) => {
                const alert1 = $.findOne('#alert1');
                UI.Alert.init(alert1, { duration: 200 }).close();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#alert1'],
                    progress: 0.875,
                    styles: {
                        opacity: '0.13',
                    },
                },
            ]);
        });

        test('works with duration option (data-ui-duration)', async ({ page }) => {
            await page.evaluate((_) => {
                const alert1 = $.findOne('#alert1');
                $.setDataset(alert1, { uiDuration: 200 });
                UI.Alert.init(alert1).close();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#alert1'],
                    progress: 0.875,
                    styles: {
                        opacity: '0.13',
                    },
                },
            ]);
        });

        test('works with duration option (query)', async ({ page }) => {
            await page.evaluate((_) => {
                $('#alert1')
                    .alert({ duration: 200 })
                    .close();
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#alert1'],
                    progress: 0.875,
                    styles: {
                        opacity: '0.13',
                    },
                },
            ]);
        });
    });
});
