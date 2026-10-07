import { expect, test } from '#test';

test.describe('BaseComponent', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate(() => {
            $.setHtml(document.body, '<div class="alert" id="alert1"></div>');
        });
    });

    test.describe('#init', () => {
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

        test.describe('failed initialization', () => {
            test('cleans up listeners registered before a constructor fails', async ({ page }) => {
                const events = await page.evaluate(() => {
                    const events = [];
                    $.addEvent(document, 'owned.ui.test', () => events.push('consumer'));

                    class Component extends UI.BaseComponent {
                        constructor(node) {
                            super(node);
                            try {
                                this.listen(document, 'owned.ui.test', () => events.push('component'), { capture: true });
                                throw new Error('Cannot initialize component');
                            } catch (error) {
                                this.dispose();
                                throw error;
                            }
                        }
                    }
                    UI.initComponent('testListeners', Component);

                    let message;
                    try {
                        Component.init($.findOne('#alert1'));
                    } catch (error) {
                        message = error.message;
                    }
                    $.triggerEvent(document, 'owned.ui.test');
                    return { events, message, registered: $.hasData('#alert1', 'testListeners') };
                });

                expect(events).toEqual({ events: ['consumer'], message: 'Cannot initialize component', registered: false });
            });
        });
    });

    test.describe('#dispose', () => {
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

        for (const target of ['element', 'form', 'document', 'window']) {
            test(`preserves other instances and consumers using the same callback on ${target}`, async ({ page }) => {
                const counts = await page.evaluate((target) => {
                    const node = $.findOne('#alert1');
                    const form = $.create('form');
                    $.append(document.body, form);
                    const shared = { element: node, form, document, window }[target];
                    let calls = 0;
                    const callback = () => calls++;
                    $.addEvent(shared, 'owned.ui.test', callback);
                    const first = UI.Alert.init(node);
                    const second = UI.Alert.init($.create('div'));
                    first.listen(shared, 'owned.ui.test', callback);
                    second.listen(shared, 'owned.ui.test', callback);
                    $.addEvent(shared, 'owned.ui.test', callback);

                    const counts = [];
                    for (const dispose of [() => {}, () => first.dispose(), () => second.dispose(), () => second.dispose()]) {
                        dispose();
                        calls = 0;
                        $.triggerEvent(shared, 'owned.ui.test');
                        counts.push(calls);
                    }
                    return counts;
                }, target);

                expect(counts).toEqual([4, 3, 2, 2]);
            });
        }

        test('ignores new registrations and repeated disposal after reinitialization', async ({ page }) => {
            const events = await page.evaluate(() => {
                const node = $.findOne('#alert1');
                const first = UI.Alert.init(node);
                first.dispose();
                const events = [];
                const second = UI.Alert.init(node);
                second.listen(node, 'owned.ui.test', () => events.push('second'));
                first.listen(node, 'owned.ui.test', () => events.push('first'));
                first.dispose();
                $.triggerEvent(node, 'owned.ui.test');
                return { events, registered: $.getData(node, 'alert') === second };
            });

            expect(events).toEqual({ events: ['second'], registered: true });
        });
    });

    test.describe('#listen', () => {
        test('supports delegated capture handlers and return-false cancellation', async ({ page }) => {
            const state = await page.evaluate(() => {
                const node = $.findOne('#alert1');
                const button = $.create('button', { text: 'Action' });
                $.append(node, button);
                const instance = UI.Alert.init(node);
                const options = { capture: true, delegate: 'button' };
                const events = [];

                instance.listen(node, 'click.ui.test', (event) => {
                    events.push({
                        delegated: event.currentTarget === button,
                        container: event.delegateTarget === node,
                        capture: event.eventPhase === Event.CAPTURING_PHASE,
                    });
                    return false;
                }, options);

                const accepted = $.triggerOne(button, 'click.ui.test');
                options.capture = false;
                options.delegate = '.other';
                instance.dispose();
                const acceptedAfterDisposal = $.triggerOne(button, 'click.ui.test');

                return { events, accepted, acceptedAfterDisposal };
            });

            expect(state).toEqual({
                events: [{ delegated: true, container: true, capture: true }],
                accepted: false,
                acceptedAfterDisposal: true,
            });
        });

        test('resolves selectors when registering and cleans up the original target', async ({ page }) => {
            const events = await page.evaluate(() => {
                const instance = UI.Alert.init($.findOne('#alert1'));
                const original = $.create('button', { attributes: { id: 'target' } });
                $.append(document.body, original);
                const events = [];
                const callback = (event) => events.push(event.target.id);
                instance.listen('#target', 'click.ui.test', callback);
                $.triggerEvent(original, 'click.ui.test');
                $.setAttribute(original, { id: 'old-target' });

                const replacement = $.create('button', { attributes: { id: 'target' } });
                $.append(document.body, replacement);
                $.addEvent(replacement, 'click.ui.test', callback);

                instance.dispose();
                $.triggerEvent([original, replacement], 'click.ui.test');
                return events;
            });

            expect(events).toEqual(['target', 'target']);
        });
    });
});
