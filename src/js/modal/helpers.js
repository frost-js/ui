import { $ } from './../globals.js';
import Modal from './modal.js';

/**
 * Modal Helpers
 */

/**
 * Get the top modal.
 * @return {Modal} The Modal.
 */
export function getTopModal() {
    const nodes = $.find('.modal.show');

    if (!nodes.length) {
        return null;
    }

    // find modal with highest zIndex
    let node = nodes.shift();
    let highestZIndex = $.getStyle(node, 'zIndex');

    for (const otherNode of nodes) {
        const newZIndex = $.getStyle(otherNode, 'zIndex');

        if (newZIndex <= highestZIndex) {
            continue;
        }

        node = otherNode;
        highestZIndex = newZIndex;
    }

    return Modal.init(node);
};
