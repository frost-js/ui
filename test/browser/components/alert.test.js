import { expect, test } from '#test';

test.use({ reducedMotion: 'no-preference' });

test.describe('Alert', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate(() => {
            document.body.innerHTML =
                '<div class="alert alert-success fade show" id="alert1">' +
                '<button class="btn-close" id="button1" data-ui-dismiss="alert" type="button"></button>' +
                '</div>' +
                '<div class="alert alert-success fade show" id="alert2">' +
                '<button class="btn-close" id="button2" data-ui-dismiss="alert" type="button"></button>' +
                '</div>';
        });
    });

    test.describe('#init', () => {
        for (const { name, init } of [
            {
                name: 'class',
                init: (selector) => UI.Alert.init(document.querySelector(selector)),
            },
            {
                name: 'QuerySet',
                init: (selector) => $(selector).alert(),
            },
        ]) {
            test(`creates an alert (${name})`, async ({ page }) => {
                const instance = await page.evaluateHandle(init, '#alert1');

                expect(await instance.evaluate((value) => value instanceof UI.Alert)).toBe(true);
                expect(await page.evaluate(() =>
                    $.getData('#alert1', 'alert') instanceof UI.Alert)).toBe(true);
            });
        }

        test('creates an alert (data-ui-dismiss)', async ({ page }) => {
            await page.locator('#button1').click();

            expect(await page.evaluate(() =>
                $.getData('#alert1', 'alert') instanceof UI.Alert)).toBe(true);
        });
    });

    test.describe('#dispose', () => {
        for (const { name, dispose } of [
            {
                name: 'class',
                dispose: (selector) => {
                    UI.Alert.init(document.querySelector(selector)).dispose();
                },
            },
            {
                name: 'QuerySet',
                dispose: (selector) => {
                    $(selector).alert('dispose');
                },
            },
        ]) {
            test(`removes the alert (${name})`, async ({ page }) => {
                await page.evaluate(dispose, '#alert1');

                expect(await page.evaluate(() => $.hasData('#alert1', 'alert'))).toBe(false);
            });
        }

        test('completes closing after disposal', async ({ page }) => {
            const node = await page.evaluateHandle(() => document.querySelector('#alert1'));
            await node.evaluate((alert1) => {
                window.alertClosedEventTriggered = false;

                $.addEvent(alert1, 'closed.ui.alert', () => {
                    window.alertClosedEventTriggered = true;
                });

                const alert = UI.Alert.init(alert1);
                alert.close();
                alert.dispose();
            });

            await expect(page.locator('#alert1')).toHaveCount(0);
            expect(await page.evaluate(() => window.alertClosedEventTriggered)).toBe(true);
            expect(await node.evaluate((alert1) => $.hasData(alert1, 'alert'))).toBe(false);
        });
    });

    test.describe('#close', () => {
        for (const { name, close } of [
            {
                name: 'class',
                close: (node) => {
                    UI.Alert.init(node).close();

                    return {
                        connected: $.isConnected(node),
                        shown: $.hasClass(node, 'show'),
                    };
                },
            },
            {
                name: 'QuerySet',
                close: (node) => {
                    $(node).alert('close');

                    return {
                        connected: $.isConnected(node),
                        shown: $.hasClass(node, 'show'),
                    };
                },
            },
        ]) {
            test(`closes the alert (${name})`, async ({ page }) => {
                const alert = await page.evaluateHandle(() => document.querySelector('#alert1'));
                const state = await alert.evaluate(close);

                expect(state).toEqual({
                    connected: true,
                    shown: false,
                });
                await expect(page.locator('#alert1')).toHaveCount(0);
                await expect(page.locator('#alert2')).toHaveCount(1);
                expect(await alert.evaluate((node) => $.hasData(node, 'alert'))).toBe(false);
            });
        }

        test('closes the alert (data-ui-dismiss)', async ({ page }) => {
            await page.locator('#button1').click();

            await expect(page.locator('#alert1')).toHaveCount(0);
            await expect(page.locator('#alert2')).toHaveCount(1);
        });

        test('can be called multiple times', async ({ page }) => {
            await page.evaluate(() => {
                const alert1 = $.findOne('#alert1');
                const alert = UI.Alert.init(alert1);
                alert.close();
                alert.close();
                alert.close();
            });

            await expect(page.locator('#alert1')).toHaveCount(0);
            await expect(page.locator('#alert2')).toHaveCount(1);
        });

        test('closes without a transition class', async ({ page }) => {
            await page.evaluate(() => {
                const alert1 = $.findOne('#alert1');
                $.removeClass(alert1, 'fade show');
                UI.Alert.init(alert1).close();
            });

            await expect(page.locator('#alert1')).toHaveCount(0);
            await expect(page.locator('#alert2')).toHaveCount(1);
        });

        test('closes when the transition is canceled', async ({ page }) => {
            await page.evaluate(() => {
                const alert1 = $.findOne('#alert1');
                UI.Alert.init(alert1).close();
                const transition = alert1.getAnimations()
                .find((animation) => animation instanceof CSSTransition);
                transition.cancel();
            });

            await expect(page.locator('#alert1')).toHaveCount(0);
            await expect(page.locator('#alert2')).toHaveCount(1);
        });

        test('closes when no transition is generated', async ({ page }) => {
            await page.evaluate(() => {
                const alert1 = $.findOne('#alert1');
                $.setStyle(alert1, {
                    transitionDuration: '1ms',
                    transitionProperty: 'none',
                });
                UI.Alert.init(alert1).close();
            });

            await expect(page.locator('#alert1')).toHaveCount(0);
            await expect(page.locator('#alert2')).toHaveCount(1);
        });
    });

    test.describe('events', () => {
        test('triggers close event', async ({ page }) => {
            const eventTriggered = await page.evaluate(() => {
                const alert1 = $.findOne('#alert1');
                let triggered = false;

                $.addEvent(alert1, 'close.ui.alert', () => {
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
            await page.evaluate(() => {
                const alert1 = $.findOne('#alert1');
                window.alertClosedEventTriggered = false;

                $.addEvent(alert1, 'closed.ui.alert', () => {
                    window.alertClosedEventTriggered = true;
                });
                UI.Alert.init(alert1).close();
            });

            await expect(page.locator('#alert1')).toHaveCount(0);
            expect(await page.evaluate(() => window.alertClosedEventTriggered)).toBe(true);
            await expect(page.locator('#alert2')).toHaveCount(1);
        });

        test('can be prevented from closing', async ({ page }) => {
            await page.evaluate(() => {
                const alert1 = $.findOne('#alert1');
                $.addEvent(alert1, 'close.ui.alert', () => false);
                UI.Alert.init(alert1).close();
            });

            await expect(page.locator('.alert')).toHaveCount(2);
            await expect(page.locator('#alert1')).toHaveClass(/\bshow\b/);
        });

        test('can be prevented from closing (prevent default)', async ({ page }) => {
            await page.evaluate(() => {
                const alert1 = $.findOne('#alert1');
                $.addEvent(alert1, 'close.ui.alert', (event) => {
                    event.preventDefault();
                });
                UI.Alert.init(alert1).close();
            });

            await expect(page.locator('.alert')).toHaveCount(2);
            await expect(page.locator('#alert1')).toHaveClass(/\bshow\b/);
        });
    });

    test.describe('QuerySet', () => {
        test.describe('#init', () => {
            test('creates multiple alerts', async ({ page }) => {
                expect(await page.evaluate(() => {
                    $('.alert').alert();
                    return $.find('.alert').every((node) =>
                        $.getData(node, 'alert') instanceof UI.Alert,
                    );
                })).toBe(true);
            });
        });

        test.describe('#dispose', () => {
            test('removes multiple alerts', async ({ page }) => {
                expect(await page.evaluate(() => {
                    $('.alert').alert('dispose');
                    return $.find('.alert').some((node) =>
                        $.hasData(node, 'alert'),
                    );
                })).toBe(false);
            });
        });

        test.describe('#close', () => {
            test('closes multiple alerts', async ({ page }) => {
                await page.evaluate(() => {
                    $('.alert').alert('close');
                });

                await expect(page.locator('.alert')).toHaveCount(0);
            });
        });
    });
});
