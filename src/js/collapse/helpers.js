import { $ } from './../globals.js';

/**
 * Gets the dimension used for a collapse transition.
 * @param {HTMLElement} node The collapse node.
 * @returns {'height'|'width'} The dimension.
 */
export function getDimension(node) {
    return $.hasClass(node, 'collapse-horizontal') ?
        'width' :
        'height';
};
