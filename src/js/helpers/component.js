/** @import BaseComponent from '../base-component.js'; */

import { $ } from '../globals.js';

/**
 * Generates a unique component element ID.
 * @param {string} prefix The ID prefix.
 * @returns {string} The unique ID.
 */
export function generateId(prefix) {
    while (true) {
        const id = `${prefix}-${$._randomString(5)}`;

        if ($.findOneById(id)) {
            continue;
        }

        return id;
    }
}

/**
 * Gets normalized UI data attributes from an element.
 * @param {HTMLElement} node The input node.
 * @returns {Record<string, *>} The normalized data.
 */
export function getDataset(node) {
    const dataset = $.getDataset(node);

    return Object.fromEntries(
        Object.entries(dataset)
            .map(([key, value]) => [key.slice(2, 3).toLowerCase() + key.slice(3), value]),
    );
}

/**
 * Registers a UI component and its QuerySet method.
 * @param {string} key The component key.
 * @param {typeof BaseComponent} component The component class.
 */
export function initComponent(key, component) {
    component.DATA_KEY = key;
    component.REMOVE_EVENT = `remove.ui.${key}`;

    Object.defineProperty($.QuerySet.prototype, key, {
        configurable: true,
        enumerable: false,
        value(a, ...args) {
            let settings; let method; let firstResult;

            if ($._isObject(a)) {
                settings = a;
            } else if ($._isString(a)) {
                method = a;
            }

            for (const [index, node] of this.get().entries()) {
                if (!$._isElement(node)) {
                    continue;
                }

                let result = component.init(node, settings);

                if (method) {
                    result = result[method](...args);
                }

                if (index === 0) {
                    firstResult = result;
                }
            }

            return firstResult;
        },
        writable: true,
    });
}
