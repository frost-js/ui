import { expect, test } from '#test';
import { expectStyles } from '../../support/assertions/styles.js';

test.describe('Popper', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate(() => {
            document.body.innerHTML =
                '<button class="btn btn-secondary" id="button" style="width: 80px; height: 34px;" type="button">Button</button>' +
                '<div class="badge" id="badge" style="width: 60px; height: 21px;">Badge</div>';
        });
    });

    test.describe('#init', () => {
        for (const { name, init } of [
            {
                name: 'class',
                init: () => UI.Popper.init(document.querySelector('#badge'), { reference: document.querySelector('#button') }),
            },
            {
                name: 'QuerySet',
                init: () => $('#badge').popper({ reference: document.querySelector('#button') }),
            },
        ]) {
            test(`creates a popper (${name})`, async ({ page }) => {
                const instance = await page.evaluateHandle(init);

                expect(await instance.evaluate((value) => value instanceof UI.Popper)).toBe(true);
                expect(await page.evaluate(() => $.getData('#badge', 'popper') instanceof UI.Popper)).toBe(true);
            });
        }

        for (const callback of ['beforeUpdate', 'afterUpdate']) {
            test(`restores state when ${callback} throws during initialization`, async ({ page }) => {
                await page.evaluate(() => {
                    const node = document.querySelector('#badge');
                    node.innerHTML = '<span id="arrow" style="position: relative; top: 3px !important;"></span>';
                    node.style.setProperty('position', 'fixed', 'important');
                    node.style.setProperty('transform', 'scale(.5)', 'important');
                    node.dataset.uiPlacement = 'original-popper';
                    document.querySelector('#button').dataset.uiPlacement = 'original-reference';
                });

                await expect(page.evaluate((callback) => UI.Popper.init(document.querySelector('#badge'), {
                    reference: document.querySelector('#button'),
                    arrow: document.querySelector('#arrow'),
                    [callback]: () => {
                        throw new Error('Cannot position popper');
                    },
                }), callback)).rejects.toThrow('Cannot position popper');

                await expectStyles(page, [
                    {
                        selectors: ['#badge'],
                        styles: {
                            position: 'fixed',
                            transform: 'scale(0.5)',
                        },
                    },
                    {
                        selectors: ['#arrow'],
                        styles: {
                            position: 'relative',
                            top: '3px',
                        },
                    },
                ]);
                await expect(page.locator('#badge')).toHaveAttribute('data-ui-placement', 'original-popper');
                await expect(page.locator('#button')).toHaveAttribute('data-ui-placement', 'original-reference');
                expect(await page.evaluate(() => $.hasData('#badge', 'popper'))).toBe(false);

                await page.evaluate(() => UI.Popper.init(document.querySelector('#badge'), {
                    reference: document.querySelector('#button'),
                    arrow: document.querySelector('#arrow'),
                }));

                expect(await page.evaluate(() => $.getData('#badge', 'popper') instanceof UI.Popper)).toBe(true);

                await page.evaluate(() => UI.Popper.init(document.querySelector('#badge')).dispose());

                await expectStyles(page, [
                    {
                        selectors: ['#badge'],
                        styles: {
                            position: 'fixed',
                            transform: 'scale(0.5)',
                        },
                    },
                    {
                        selectors: ['#arrow'],
                        styles: {
                            position: 'relative',
                            top: '3px',
                        },
                    },
                ]);
                expect(await page.locator('#badge').evaluate((node) => node.style.getPropertyPriority('position'))).toBe('important');
                expect(await page.locator('#arrow').evaluate((node) => node.style.getPropertyPriority('top'))).toBe('important');
            });
        }
    });

    test.describe('#dispose', () => {
        for (const { name, dispose } of [
            {
                name: 'class',
                dispose: () => {
                    const badge = $.findOne('#badge');
                    UI.Popper.init(badge, {
                        reference: $.findOne('#button'),
                    }).dispose();
                    return $.hasData(badge, 'popper');
                },
            },
            {
                name: 'QuerySet',
                dispose: () => {
                    $('#badge').popper({
                        reference: $.findOne('#button'),
                    });
                    $('#badge').popper('dispose');
                    return $.hasData('#badge', 'popper');
                },
            },
        ]) {
            test(`removes the popper (${name})`, async ({ page }) => {
                expect(await page.evaluate(dispose)).toBe(false);
            });
        }

        test('restores positioning styles', async ({ page }) => {
            await page.evaluate(() => {
                const badge = $.findOne('#badge');

                $.setStyle(badge, {
                    margin: '7px',
                    position: 'fixed',
                    top: '11px',
                    right: '12px',
                    bottom: '13px',
                    left: '14px',
                    transform: 'scale(.5)',
                });
                UI.Popper.init(badge, {
                    reference: $.findOne('#button'),
                });
            });

            await expectStyles(page, [
                {
                    selectors: ['#badge'],
                    styles: { margin: '7px' },
                },
            ]);

            await page.evaluate(() => {
                UI.Popper.init($.findOne('#badge')).dispose();
            });

            await expectStyles(page, [
                {
                    selectors: ['#badge'],
                    styles: {
                        margin: '7px',
                        position: 'fixed',
                        top: '11px',
                        right: '12px',
                        bottom: '13px',
                        left: '14px',
                        transform: 'scale(0.5)',
                    },
                },
            ]);
        });

        test('restores arrow positioning styles', async ({ page }) => {
            await page.evaluate(() => {
                const badge = $.findOne('#badge');
                const arrow = $.create('div', {
                    attributes: { id: 'arrow' },
                    style: {
                        position: 'fixed',
                        top: '11px',
                        right: '12px',
                        bottom: '13px',
                        left: '14px',
                    },
                });

                $.append(badge, arrow);
                UI.Popper.init(badge, {
                    reference: $.findOne('#button'),
                    arrow,
                }).dispose();
            });

            await expectStyles(page, [
                {
                    selectors: ['#arrow'],
                    styles: {
                        position: 'fixed',
                        top: '11px',
                        right: '12px',
                        bottom: '13px',
                        left: '14px',
                    },
                },
            ]);
        });

        test('can be disposed more than once', async ({ page }) => {
            await page.evaluate(() => {
                const node = document.querySelector('#badge');
                node.style.setProperty('position', 'relative', 'important');

                const popper = UI.Popper.init(node, { reference: document.querySelector('#button') });
                popper.dispose();
                popper.dispose();
            });

            expect(await page.evaluate(() => $.hasData('#badge', 'popper'))).toBe(false);
            await expect(page.locator('#badge')).toHaveJSProperty('style.position', 'relative');
            expect(await page.locator('#badge').evaluate((node) => node.style.getPropertyPriority('position'))).toBe('important');
        });
    });

    test.describe('#update', () => {
        for (const { name, update } of [
            {
                name: 'class',
                update: () => {
                    const badge = $.findOne('#badge');
                    const button = $.findOne('#button');
                    const popper = UI.Popper.init(badge, {
                        reference: button,
                    });

                    $.setStyle(button, { marginTop: '50px' });
                    popper.update();
                },
            },
            {
                name: 'QuerySet',
                update: () => {
                    const button = $.findOne('#button');
                    $('#badge').popper({
                        reference: button,
                    });
                    $.setStyle(button, { marginTop: '50px' });
                    $('#badge').popper('update');
                },
            },
        ]) {
            test(`updates the popper (${name})`, async ({ page }) => {
                await page.evaluate(update);

                await expectStyles(page, [
                    {
                        selectors: ['#badge'],
                        styles: { transform: 'translate3d(10px, 84px, 0px)' },
                    },
                ]);
            });
        }
    });

    test.describe('scroll updates', () => {
        test('updates when an ancestor of the popper scrolls', async ({ page }) => {
            expect(await page.evaluate(async () => {
                const badge = $.findOne('#badge');
                const scroll = $.create('div');
                $.before(badge, scroll);
                $.append(scroll, badge);

                let initialized = false;
                let updated = false;
                UI.Popper.init(badge, {
                    reference: $.findOne('#button'),
                    afterUpdate: () => {
                        if (initialized) {
                            updated = true;
                        }
                    },
                });
                initialized = true;

                $.triggerEvent(scroll, 'scroll');
                await Promise.resolve();

                return updated;
            })).toBe(true);
        });

        test('updates when an ancestor of the reference scrolls', async ({ page }) => {
            expect(await page.evaluate(async () => {
                const badge = $.findOne('#badge');
                const button = $.findOne('#button');
                const scroll = $.create('div');
                $.before(button, scroll);
                $.append(scroll, button);

                let initialized = false;
                let updated = false;
                UI.Popper.init(badge, {
                    reference: button,
                    afterUpdate: () => {
                        if (initialized) {
                            updated = true;
                        }
                    },
                });
                initialized = true;

                $.triggerEvent(scroll, 'scroll');
                await Promise.resolve();

                return updated;
            })).toBe(true);
        });

        test('does not update when an unrelated element scrolls', async ({ page }) => {
            expect(await page.evaluate(async () => {
                const badge = $.findOne('#badge');
                let initialized = false;
                let updated = false;
                UI.Popper.init(badge, {
                    reference: $.findOne('#button'),
                    afterUpdate: () => {
                        if (initialized) {
                            updated = true;
                        }
                    },
                });
                initialized = true;

                const scroll = $.create('div');
                $.append(document.body, scroll);
                $.triggerEvent(scroll, 'scroll');
                await Promise.resolve();

                return updated;
            })).toBe(false);
        });
    });

    test.describe('beforeUpdate option', () => {
        for (const { name, run } of [
            {
                name: 'class',
                run: () => {
                    let result;
                    const badge = $.findOne('#badge');
                    UI.Popper.init(badge, {
                        reference: $.findOne('#button'),
                        beforeUpdate: () => {
                            result = $.getStyle(badge, 'transform');
                        },
                    });
                    return result;
                },
            },
            {
                name: 'QuerySet',
                run: () => {
                    let result;
                    $('#badge').popper({
                        reference: $.findOne('#button'),
                        beforeUpdate: () => {
                            result = $.getStyle('#badge', 'transform');
                        },
                    });
                    return result;
                },
            },
        ]) {
            test(`executes a callback before updating the popper (${name})`, async ({ page }) => {
                const callbackTransform = await page.evaluate(run);

                expect(callbackTransform).toBe('');
            });
        }

        test('uses the node as the first argument', async ({ page }) => {
            expect(await page.evaluate(() => {
                let isBadge;
                const badge = $.findOne('#badge');
                UI.Popper.init(badge, {
                    reference: $.findOne('#button'),
                    beforeUpdate: (node) => {
                        isBadge = node === badge;
                    },
                });
                return isBadge;
            })).toBe(true);
        });

        test('uses the reference as the second argument', async ({ page }) => {
            expect(await page.evaluate(() => {
                let isButton;
                const badge = $.findOne('#badge');
                const button = $.findOne('#button');
                UI.Popper.init(badge, {
                    reference: button,
                    beforeUpdate: (node, referenceNode) => {
                        isButton = referenceNode === button;
                    },
                });
                return isButton;
            })).toBe(true);
        });

        test('executes every time the popper is updated', async ({ page }) => {
            expect(await page.evaluate(() => {
                let count = 0;
                const badge = $.findOne('#badge');
                const popper = UI.Popper.init(badge, {
                    reference: $.findOne('#button'),
                    beforeUpdate: () => count++,
                });
                popper.update();
                popper.update();
                popper.update();
                return count;
            })).toBe(4);
        });
    });

    test.describe('afterUpdate option', () => {
        for (const { name, run } of [
            {
                name: 'class',
                run: () => {
                    let result;
                    const badge = $.findOne('#badge');
                    UI.Popper.init(badge, {
                        reference: $.findOne('#button'),
                        afterUpdate: () => {
                            result = $.getStyle(badge, 'transform');
                        },
                    });
                    return result;
                },
            },
            {
                name: 'QuerySet',
                run: () => {
                    let result;
                    $('#badge').popper({
                        reference: $.findOne('#button'),
                        afterUpdate: () => {
                            result = $.getStyle('#badge', 'transform');
                        },
                    });
                    return result;
                },
            },
        ]) {
            test(`executes a callback after updating the popper (${name})`, async ({ page }) => {
                const callbackTransform = await page.evaluate(run);

                expect(callbackTransform).toBe('translate3d(10px, 34px, 0px)');
            });
        }

        test('uses the node as the first argument', async ({ page }) => {
            expect(await page.evaluate(() => {
                let isBadge;
                const badge = $.findOne('#badge');
                UI.Popper.init(badge, {
                    reference: $.findOne('#button'),
                    afterUpdate: (node) => {
                        isBadge = node === badge;
                    },
                });
                return isBadge;
            })).toBe(true);
        });

        test('uses the reference as the second argument', async ({ page }) => {
            expect(await page.evaluate(() => {
                let isButton;
                const badge = $.findOne('#badge');
                const button = $.findOne('#button');
                UI.Popper.init(badge, {
                    reference: button,
                    afterUpdate: (node, referenceNode) => {
                        isButton = referenceNode === button;
                    },
                });
                return isButton;
            })).toBe(true);
        });

        test('uses the placement as the third argument', async ({ page }) => {
            expect(await page.evaluate(() => {
                let callbackPlacement;
                const badge = $.findOne('#badge');
                UI.Popper.init(badge, {
                    reference: $.findOne('#button'),
                    afterUpdate: (node, referenceNode, placement) => {
                        callbackPlacement = placement;
                    },
                });
                return callbackPlacement;
            })).toBe('bottom');
        });

        test('uses the position as the fourth argument', async ({ page }) => {
            expect(await page.evaluate(() => {
                let callbackPosition;
                const badge = $.findOne('#badge');
                UI.Popper.init(badge, {
                    reference: $.findOne('#button'),
                    afterUpdate: (node, referenceNode, placement, position) => {
                        callbackPosition = position;
                    },
                });
                return callbackPosition;
            })).toBe('center');
        });

        test('executes every time the popper is updated', async ({ page }) => {
            expect(await page.evaluate(() => {
                let count = 0;
                const badge = $.findOne('#badge');
                const popper = UI.Popper.init(badge, {
                    reference: $.findOne('#button'),
                    afterUpdate: () => count++,
                });
                popper.update();
                popper.update();
                popper.update();
                return count;
            })).toBe(4);
        });
    });
});
