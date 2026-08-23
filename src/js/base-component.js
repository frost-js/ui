import { $ } from './globals.js';
import { getDataset } from './helpers.js';

/**
 * BaseComponent Class
 * @class
 */
export default class BaseComponent {
    #node;
    #options;

    /**
     * Initialize a BaseComponent.
     * @param {HTMLElement} node The input node.
     * @return {BaseComponent} A new BaseComponent object.
     */
    static init(node, ...args) {
        return $.hasData(node, this.DATA_KEY) ?
            $.getData(node, this.DATA_KEY) :
            new this(node, ...args);
    }

    /**
     * New BaseComponent constructor.
     * @param {HTMLElement} node The input node.
     * @param {object} [options] The options to create the BaseComponent with.
     */
    constructor(node, options) {
        this.#node = node;

        this.#options = Object.freeze($._extend(
            {},
            this.constructor.defaults,
            getDataset(this.#node),
            options,
        ));

        $.addEvent(this.#node, this.constructor.REMOVE_EVENT, (_) => {
            this.dispose();
        });

        $.setData(this.#node, { [this.constructor.DATA_KEY]: this });
    }

    /**
     * Get the component node.
     * @return {HTMLElement} The component node.
     */
    get node() {
        return this.#node;
    }

    /**
     * Get the component options.
     * @return {object} The component options.
     */
    get options() {
        return this.#options;
    }

    /**
     * Dispose the BaseComponent.
     */
    dispose() {
        $.removeEvent(this.#node, this.constructor.REMOVE_EVENT);
        $.removeData(this.#node, this.constructor.DATA_KEY);
        this.#node = null;
        this.#options = null;
    }
}
