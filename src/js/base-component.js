import { $ } from './globals.js';
import { getDataset } from './helpers/component.js';

/** @typedef {Record<string, *>} ComponentOptions */

/**
 * Provides shared initialization, option handling, and disposal for UI components.
 * @template {ComponentOptions} [Options=ComponentOptions]
 */
export default class BaseComponent {
    #node;
    #options;

    /**
     * Initializes a BaseComponent.
     * @param {HTMLElement} node The input node.
     * @param {...*} args The constructor arguments.
     * @returns {BaseComponent} The existing or newly created component.
     */
    static init(node, ...args) {
        return $.hasData(node, this.DATA_KEY) ?
            $.getData(node, this.DATA_KEY) :
            new this(node, ...args);
    }

    /**
     * Creates a BaseComponent.
     * @param {HTMLElement} node The input node.
     * @param {Options} [options] The component options.
     */
    constructor(node, options) {
        this.#node = node;

        this.#options = Object.freeze($._extend(
            {},
            this.constructor.defaults,
            getDataset(this.#node),
            options,
        ));

        $.addEvent(this.#node, this.constructor.REMOVE_EVENT, () => {
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
        $.removeEvent(this.#node, this.constructor.REMOVE_EVENT);
        $.removeData(this.#node, this.constructor.DATA_KEY);

        this.#node = null;
        this.#options = null;
    }
}
