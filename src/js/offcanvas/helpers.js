import { $ } from './../globals.js';

/** @typedef {import('../popper/popper.js').Direction} Direction */

/**
 * Gets the slide animation direction.
 * @param {HTMLElement} node The offcanvas node.
 * @returns {Direction} The animation direction.
 */
export function getDirection(node) {
    if ($.hasClass(node, 'offcanvas-end')) {
        return 'right';
    }

    if ($.hasClass(node, 'offcanvas-bottom')) {
        return 'bottom';
    }

    if ($.hasClass(node, 'offcanvas-start')) {
        return 'left';
    }

    return 'top';
};
