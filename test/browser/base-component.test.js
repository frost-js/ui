import { expect, test } from '#test';

test.describe('BaseComponent', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate(() => {
            $.setHtml(document.body, '<div class="alert" id="alert1"></div>');
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
            const second = new Component($.create('div'));
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

    test('rejects non-element arguments without disturbing an existing instance', async ({ page }) => {
        const state = await page.evaluate(() => {
            const node = $.findOne('#alert1');
            const instance = UI.Alert.init(node);
            const html = $.getHtml(document.body);
            const errors = [];

            for (const [name, argument] of [
                ['null', null],
                ['undefined', undefined],
                ['selector', '#alert1'],
                ['malformed selector', '['],
                ['array', [node]],
                ['QuerySet', $('#alert1')],
                ['document', document],
                ['text node', document.createTextNode('text')],
            ]) {
                for (const [method, init] of [
                    ['constructor', (node) => new UI.Alert(node)],
                    ['init', (node) => UI.Alert.init(node)],
                ]) {
                    let message = null;

                    try {
                        init(argument);
                    } catch (error) {
                        message = `${error.name}: ${error.message}`;
                    }

                    errors.push({ name, method, message });
                }
            }

            return {
                errors,
                unchanged: $.getHtml(document.body) === html &&
                    $.getData(node, UI.Alert.DATA_KEY) === instance,
            };
        });

        for (const { name, method, message } of state.errors) {
            expect(message, `${name} (${method})`).toBe('TypeError: Component must be created on an element.');
        }
        expect(state.unchanged).toBe(true);
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
