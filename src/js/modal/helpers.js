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

/**
 * Sets the stacking level for a modal and its backdrop.
 * @param {Modal} modal The modal instance.
 * @param {number} index The zero-based stack index.
 */
export function setStackIndex(modal, index) {
    $.setStyle(modal.node, { zIndex: '' });

    if (modal.backdrop) {
        $.setStyle(modal.backdrop, { zIndex: '' });
    }

    if (!index) {
        return;
    }

    const stackOffset = index * 20;
    const modalZIndex = parseInt($.css(modal.node, 'zIndex')) + stackOffset;

    $.setStyle(modal.node, { zIndex: modalZIndex });

    if (modal.backdrop) {
        const backdropZIndex = parseInt($.css(modal.backdrop, 'zIndex')) + stackOffset;

        $.setStyle(modal.backdrop, { zIndex: backdropZIndex });
    }
};

/**
 * Reindexes visible modals and their backdrops.
 * @returns {Modal[]} The ordered modal instances.
 */
export function updateStack() {
    const nodes = $.find('.modal.show');

    nodes.sort((nodeA, nodeB) =>
        parseInt($.css(nodeA, 'zIndex')) - parseInt($.css(nodeB, 'zIndex')),
    );

    const modals = [];

    for (const [index, node] of nodes.entries()) {
        const modal = Modal.init(node);

        setStackIndex(modal, index);
        modals.push(modal);
    }

    return modals;
};
