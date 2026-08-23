import { $ } from './../globals.js';
import Modal from './modal.js';

/**
 * Gets the top modal.
 * @returns {Modal|null} The highest visible modal, or `null` if none is shown.
 */
export function getTopModal() {
    const nodes = $.find('.modal.show');

    if (!nodes.length) {
        return null;
    }

    // Select the modal with the highest stacking order.
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
