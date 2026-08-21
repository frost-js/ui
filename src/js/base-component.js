import { $ } from './globals.js';
import { getDataset } from './helpers.js';

/**
 * BaseComponent Class
 * @class
 */
export default class BaseComponent {
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
        this._node = node;

        this._options = $._extend(
            {},
            this.constructor.defaults,
            getDataset(this._node),
            options,
        );

        $.addEvent(this._node, this.constructor.REMOVE_EVENT, (_) => {
            this.dispose();
        });

        $.setData(this._node, { [this.constructor.DATA_KEY]: this });
    }

    /**
     * Dispose the BaseComponent.
     */
    dispose() {
        $.removeEvent(this._node, this.constructor.REMOVE_EVENT);
        $.removeData(this._node, this.constructor.DATA_KEY);
        this._node = null;
        this._options = null;
    }
}
