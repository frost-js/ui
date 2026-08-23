import { $ } from './../globals.js';

/**
 * Resolves a target element from a control.
 * @param {HTMLElement} node The input node.
 * @param {string} [closestSelector] The fallback closest selector.
 * @returns {HTMLElement} The target node.
 * @throws {Error} If no target can be resolved.
 */
export function getTarget(node, closestSelector) {
    const selector = getTargetSelector(node);

    let target;

    if (selector && selector !== '#') {
        target = $.findOne(selector);
    } else if (closestSelector) {
        target = $.closest(node, closestSelector).shift();
    }

    if (!target) {
        throw new Error('Target not found');
    }

    return target;
};

/**
 * Gets the target selector declared by a control.
 * @param {HTMLElement} node The input node.
 * @returns {string|null} The target selector, or `null` if none is declared.
 */
export function getTargetSelector(node) {
    return $.getDataset(node, 'uiTarget') || $.getAttribute(node, 'href');
};
