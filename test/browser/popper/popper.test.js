import { expect, test } from '#test';
import { resetPage } from '../../setup/browser.js';
import { expectStyles } from '../../support/assertions/styles.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('Popper', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            $.setHTML(
                document.body,
                `
                    <button class="btn btn-secondary" id="button" style="width: 80px; height: 34px;" type="button">Button</button>
                    <div class="badge" id="badge" style="width: 60px; height: 21px;">Badge</div>
                `,
            );
        });
    });

    test.describe('#init', () => {
        test('creates a popper', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const badge = $.findOne('#badge');
                return UI.Popper.init(badge, {
                    reference: $.findOne('#button'),
                }) instanceof UI.Popper;
            })).toBe(true);
        });

        test('creates a popper (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('#badge').popper({
                    reference: $.findOne('#button'),
                });
                return $.getData('#badge', 'popper') instanceof UI.Popper;
            })).toBe(true);
        });

        test('returns the popper (query)', async ({ page }) => {
            expect(await page.evaluate((_) =>
                $('#badge').popper({
                    reference: $.findOne('#button'),
                }) instanceof UI.Popper)).toBe(true);
        });
    });

    test.describe('#dispose', () => {
        test('removes the popper', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const badge = $.findOne('#badge');
                UI.Popper.init(badge, {
                    reference: $.findOne('#button'),
                }).dispose();
                return $.hasData(badge, 'popper');
            })).toBe(false);
        });

        test('removes the popper (query)', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $('#badge').popper({
                    reference: $.findOne('#button'),
                });
                $('#badge').popper('dispose');
                return $.hasData('#badge', 'popper');
            })).toBe(false);
        });
    });

    test.describe('#update', () => {
        test('updates the popper', async ({ page }) => {
            await page.evaluate((_) => {
                const badge = $.findOne('#badge');
                const button = $.findOne('#button');
                const popper = UI.Popper.init(badge, {
                    reference: button,
                });

                $.setStyle(button, { marginTop: '50px' });
                popper.update();
            });

            await expectStyles(page, [
                {
                    selectors: ['#badge'],
                    styles: { transform: 'translate3d(10px, 84px, 0px)' },
                },
            ]);
        });

        test('updates the popper (query)', async ({ page }) => {
            await page.evaluate((_) => {
                const button = $.findOne('#button');
                $('#badge').popper({
                    reference: button,
                });
                $.setStyle(button, { marginTop: '50px' });
                $('#badge').popper('update');
            });

            await expectStyles(page, [
                {
                    selectors: ['#badge'],
                    styles: { transform: 'translate3d(10px, 84px, 0px)' },
                },
            ]);
        });
    });

    test.describe('scroll updates', () => {
        test('updates when an ancestor of the popper scrolls', async ({ page }) => {
            expect(await page.evaluate(async (_) => {
                const badge = $.findOne('#badge');
                const scroll = $.create('div');
                $.before(badge, scroll);
                $.append(scroll, badge);

                let initialized = false;
                let updated = false;
                UI.Popper.init(badge, {
                    reference: $.findOne('#button'),
                    afterUpdate: (_) => {
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
            expect(await page.evaluate(async (_) => {
                const badge = $.findOne('#badge');
                const button = $.findOne('#button');
                const scroll = $.create('div');
                $.before(button, scroll);
                $.append(scroll, button);

                let initialized = false;
                let updated = false;
                UI.Popper.init(badge, {
                    reference: button,
                    afterUpdate: (_) => {
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
            expect(await page.evaluate(async (_) => {
                const badge = $.findOne('#badge');
                let initialized = false;
                let updated = false;
                UI.Popper.init(badge, {
                    reference: $.findOne('#button'),
                    afterUpdate: (_) => {
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
        test('executes a callback before updating the popper', async ({ page }) => {
            const callbackTransform = await page.evaluate((_) => {
                let result;
                const badge = $.findOne('#badge');
                UI.Popper.init(badge, {
                    reference: $.findOne('#button'),
                    beforeUpdate: (_) => {
                        result = $.getStyle(badge, 'transform');
                    },
                });
                return result;
            });

            expect(callbackTransform).toBe('');
        });

        test('executes a callback before updating the popper (query)', async ({ page }) => {
            const callbackTransform = await page.evaluate((_) => {
                let result;
                $('#badge').popper({
                    reference: $.findOne('#button'),
                    beforeUpdate: (_) => {
                        result = $.getStyle('#badge', 'transform');
                    },
                });
                return result;
            });

            expect(callbackTransform).toBe('');
        });

        test('uses the node as the first argument', async ({ page }) => {
            expect(await page.evaluate((_) => {
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
            expect(await page.evaluate((_) => {
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
            expect(await page.evaluate((_) => {
                let count = 0;
                const badge = $.findOne('#badge');
                const popper = UI.Popper.init(badge, {
                    reference: $.findOne('#button'),
                    beforeUpdate: (_) => count++,
                });
                popper.update();
                popper.update();
                popper.update();
                return count;
            })).toBe(4);
        });
    });

    test.describe('afterUpdate option', () => {
        test('executes a callback after updating the popper', async ({ page }) => {
            const callbackTransform = await page.evaluate((_) => {
                let result;
                const badge = $.findOne('#badge');
                UI.Popper.init(badge, {
                    reference: $.findOne('#button'),
                    afterUpdate: (_) => {
                        result = $.getStyle(badge, 'transform');
                    },
                });
                return result;
            });

            expect(callbackTransform).toBe('translate3d(10px, 34px, 0px)');
        });

        test('executes a callback after updating the popper (query)', async ({ page }) => {
            const callbackTransform = await page.evaluate((_) => {
                let result;
                $('#badge').popper({
                    reference: $.findOne('#button'),
                    afterUpdate: (_) => {
                        result = $.getStyle('#badge', 'transform');
                    },
                });
                return result;
            });

            expect(callbackTransform).toBe('translate3d(10px, 34px, 0px)');
        });

        test('uses the node as the first argument', async ({ page }) => {
            expect(await page.evaluate((_) => {
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
            expect(await page.evaluate((_) => {
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
            expect(await page.evaluate((_) => {
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
            expect(await page.evaluate((_) => {
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
            expect(await page.evaluate((_) => {
                let count = 0;
                const badge = $.findOne('#badge');
                const popper = UI.Popper.init(badge, {
                    reference: $.findOne('#button'),
                    afterUpdate: (_) => count++,
                });
                popper.update();
                popper.update();
                popper.update();
                return count;
            })).toBe(4);
        });
    });
});
