import { expect, test } from '#test';

test.describe('BaseComponent', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate(() => {
            document.body.innerHTML = '<div class="alert" id="alert1"></div>';
        });
    });

    test('exposes the component node', async ({ page }) => {
        expect(await page.evaluate(() => {
            const node = $.findOne('#alert1');
            const alert = UI.Alert.init(node);
            return alert.node === node;
        })).toBe(true);
    });

    test('exposes frozen merged options', async ({ page }) => {
        expect(await page.evaluate(() => {
            const node = $.findOne('#alert1');
            const toast = UI.Toast.init(node, { autohide: false });
            return {
                autohide: toast.options.autohide,
                frozen: Object.isFrozen(toast.options),
            };
        })).toEqual({
            autohide: false,
            frozen: true,
        });
    });

    test('resolves only UI attributes between defaults and explicit options', async ({ page }) => {
        expect(await page.evaluate(() => {
            const node = $.findOne('#alert1');
            $.setAttribute(node, {
                'data-ui-autohide': 'false',
                'data-my-autohide': 'true',
            });
            const toast = UI.Toast.init(node);
            const fromDataset = toast.options.autohide;
            toast.dispose();

            return {
                fromDataset,
                explicit: UI.Toast.init(node, { autohide: true }).options.autohide,
            };
        })).toEqual({ fromDataset: false, explicit: true });
    });

    test('replaces arrays while merging nested objects in precedence order', async ({ page }) => {
        expect(await page.evaluate(() => {
            class Component extends UI.BaseComponent {
                static defaults = {
                    items: ['default', 'extra'],
                    settings: { enabled: true, items: [1, 2], label: 'default' },
                };
            }
            UI.initComponent('testOptions', Component);

            const node = $.findOne('#alert1');
            $.setAttribute(node, {
                'data-ui-items': '["attribute"]',
                'data-ui-settings': '{"items":[3],"label":"attribute"}',
            });
            const fromDataset = new Component(node);
            const datasetOptions = fromDataset.options;
            fromDataset.dispose();
            const explicit = new Component(node, { items: [], settings: { items: [], label: 'explicit' } });

            return { dataset: datasetOptions, explicit: explicit.options };
        })).toEqual({
            dataset: { items: ['attribute'], settings: { enabled: true, items: [3], label: 'attribute' } },
            explicit: { items: [], settings: { enabled: true, items: [], label: 'explicit' } },
        });
    });

    test('copies option arrays and objects without changing callbacks or DOM references', async ({ page }) => {
        expect(await page.evaluate(() => {
            class Component extends UI.BaseComponent {
                static defaults = { items: [{ values: [1, 2] }], settings: { enabled: true } };
            }
            UI.initComponent('testOptions', Component);

            const node = $.findOne('#alert1');
            const callback = () => {};
            const supplied = Object.freeze({
                items: Object.freeze([Object.freeze({ values: Object.freeze([3]) })]),
                settings: Object.freeze({ label: 'caller' }),
                callback,
                container: node,
            });
            const component = new Component(node, supplied);
            component.options.items[0].values.push(4);
            component.options.settings.label = 'instance';
            const second = new Component(document.createElement('div'));
            second.options.items[0].values.push(5);

            return {
                supplied: { items: supplied.items, settings: supplied.settings },
                defaults: Component.defaults,
                items: component.options.items,
                settings: component.options.settings,
                callback: component.options.callback === callback,
                container: component.options.container === node,
            };
        })).toEqual({
            supplied: { items: [{ values: [3] }], settings: { label: 'caller' } },
            defaults: { items: [{ values: [1, 2] }], settings: { enabled: true } },
            items: [{ values: [3, 4] }],
            settings: { enabled: true, label: 'instance' },
            callback: true,
            container: true,
        });
    });

    test('clears the node and options when disposed', async ({ page }) => {
        expect(await page.evaluate(() => {
            const node = $.findOne('#alert1');
            const alert = UI.Alert.init(node);
            alert.dispose();
            return {
                node: alert.node,
                options: alert.options,
            };
        })).toEqual({
            node: null,
            options: null,
        });
    });

    test('clears the node and options when removed', async ({ page }) => {
        expect(await page.evaluate(() => {
            const node = $.findOne('#alert1');
            const alert = UI.Alert.init(node);
            $.remove(node);
            return {
                node: alert.node,
                options: alert.options,
            };
        })).toEqual({
            node: null,
            options: null,
        });
    });
});
