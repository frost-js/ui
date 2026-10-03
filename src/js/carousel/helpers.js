/** @import { CarouselDirection, PhysicalDirection } from './carousel.js'; */

import { $ } from '../globals.js';

/**
 * Gets the boundary offset for an item index.
 * @param {number} index The index.
 * @param {number} totalItems The total number of items.
 * @returns {-1|0|1} The boundary offset.
 */
export function getDirOffset(index, totalItems) {
    if (index < 0) {
        return -1;
    }

    if (index > totalItems - 1) {
        return 1;
    }

    return 0;
}

/**
 * Gets the transition direction for an item change.
 * @param {number} offset The direction offset.
 * @param {number} oldIndex The old item index.
 * @param {number} newIndex The new item index.
 * @returns {CarouselDirection} The transition direction.
 */
export function getDirection(offset, oldIndex, newIndex) {
    if (offset === -1 || (offset === 0 && newIndex < oldIndex)) {
        return 'prev';
    }

    return 'next';
}

/**
 * Resolves a carousel direction to a physical direction.
 * @param {CarouselDirection} direction The carousel direction.
 * @param {boolean} rtl Whether the inline direction is right-to-left.
 * @returns {PhysicalDirection} The physical direction.
 */
export function getPhysicalDirection(direction, rtl) {
    if (direction === 'prev') {
        return rtl ? 'right' : 'left';
    }

    return rtl ? 'left' : 'right';
}

/**
 * Gets the entering and exiting classes for a slide direction.
 * @param {CarouselDirection} direction The slide direction.
 * @returns {{enter: string, exit: string}} The transition classes.
 */
export function getTransitionClasses(direction) {
    switch (direction) {
        case 'prev':
            return {
                enter: 'carousel-item-prev',
                exit: 'carousel-item-next',
            };
        case 'next':
            return {
                enter: 'carousel-item-next',
                exit: 'carousel-item-prev',
            };
    }
}

/**
 * Normalizes an item index to the available range.
 * @param {number} index The item index.
 * @param {number} totalItems The total number of items.
 * @returns {number} The normalized item index.
 */
export function getIndex(index, totalItems) {
    index %= totalItems;

    if (index < 0) {
        return totalItems + index;
    }

    return index;
}

/**
 * Updates the active carousel indicator.
 * @param {HTMLElement} carousel The carousel node.
 * @param {number} index The active item index.
 */
export function updateIndicators(carousel, index) {
    const oldIndicator = $.find('.active[data-ui-slide-to]', carousel);
    const newIndicator = $.find('[data-ui-slide-to="' + index + '"]', carousel);
    $.removeClass(oldIndicator, 'active');
    $.addClass(newIndicator, 'active');
}
