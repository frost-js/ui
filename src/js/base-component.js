/** @import { EventCallback, EventOptions, EventTargetInput } from '@fr0st/query/src/events/event-handlers.js'; */

import { $ } from './globals.js';
import { getDataset } from './helpers/component.js';

/** @typedef {Record<string, *>} ComponentOptions */

/**
 * Merges component options, cloning arrays instead of merging their entries.
 * @param {...ComponentOptions} sources The option sources in precedence order.
 * @returns {ComponentOptions} The merged options.
 */
function mergeOptions(...sources) {
    let options = {};

    for (const source of sources) {
        if (source == null) {
            continue;
        }

        options = {
            ...options,
            ...Object.fromEntries(Object.entries(source).map(([key, value]) => {
                if (Array.isArray(value)) {
                    value = $._extend([], value);
                } else if ($._isPlainObject(value)) {
                    value = mergeOptions($._isPlainObject(options[key]) ? options[key] : {}, value);
                }

                return [key, value];
            })),
        };
    }

    return options;
}

/**
 * Provides shared initialization, option handling, and disposal for UI components.
 * @template {ComponentOptions} [Options=ComponentOptions]
 */
export default class BaseComponent {
    #eventCleanups = [];
    #node = null;
    #options = null;

    /**
     * Initializes a BaseComponent.
     * @param {HTMLElement} node The input node.
     * @param {...*} args The constructor arguments.
     * @returns {BaseComponent} The existing or newly created component.
     */
    static init(node, ...args) {
        return $._isElement(node) && $.hasData(node, this.DATA_KEY) ?
            $.getData(node, this.DATA_KEY) :
            new this(node, ...args);
    }

    /**
     * Creates a BaseComponent.
     * @param {HTMLElement} node The input node.
     * @param {Options} [options] The component options.
     */
    constructor(node, options) {
        if (!$._isElement(node)) {
            throw new TypeError('Component must be created on an element.');
        }

        this.#node = node;

        this.#options = Object.freeze(mergeOptions(
            this.constructor.defaults,
            getDataset(this.#node),
            options,
        ));

        this.listen(this.#node, this.constructor.REMOVE_EVENT, () => {
            this.dispose();
        });

        $.setData(this.#node, { [this.constructor.DATA_KEY]: this });
    }

    /**
     * Gets the component node.
     * @returns {HTMLElement|null} The component node, or `null` after disposal.
     */
    get node() {
        return this.#node;
    }

    /**
     * Gets the component options.
     * @returns {Readonly<Options>|null} The component options, or `null` after disposal.
     */
    get options() {
        return this.#options;
    }

    /**
     * Releases the resources owned by the component.
     */
    dispose() {
        if (!this.#node) {
            return;
        }

        for (const cleanup of this.#eventCleanups) {
            cleanup();
        }

        this.#eventCleanups = [];

        $.removeData(this.#node, this.constructor.DATA_KEY);

        this.#node = null;
        this.#options = null;
    }

    /**
     * Adds listeners owned by the component and removed during disposal.
     * @param {EventTargetInput} selector The input node(s), or a query selector string.
     * @param {string} events The event names.
     * @param {EventCallback} callback The callback to execute.
     * @param {EventOptions} [options] The event options.
     */
    listen(selector, events, callback, options = {}) {
        if (!this.#node) {
            return;
        }

        const nodes = [...$(selector).get()];
        // Give each registration its own identity when callbacks are reused.
        const listener = (event) => callback(event);
        const { capture = false, delegate = null } = options;

        this.#eventCleanups.push(() => {
            $.removeEvent(nodes, events, listener, { capture, delegate });
        });

        $.addEvent(nodes, events, listener, options);
    }
}
