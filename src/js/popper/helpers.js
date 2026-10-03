/** @import { BoundingRect } from '../helpers/scroll.js'; */
/** @import Popper, { Direction, PhysicalDirection, Placement, Position } from './popper.js'; */

import { $, document, window } from '../globals.js';

const poppers = new Set();

let running = false;

/**
 * Registers a popper for viewport and ancestor-scroll updates.
 * @param {Popper} popper The popper to register.
 */
export function addPopper(popper) {
    poppers.add(popper);

    if (running) {
        return;
    }

    $.addEvent(
        window,
        'resize.ui.popper',
        $.debounce(() => {
            for (const popper of poppers) {
                popper.update();
            }
        }),
    );

    $.addEvent(
        document,
        'scroll.ui.popper',
        $.debounce((event) => {
            for (const popper of poppers) {
                if (!popper.shouldUpdateForScroll(event.target)) {
                    continue;
                }

                popper.update();
            }
        }),
        {
            capture: true,
            passive: true,
        },
    );

    running = true;
}

/**
 * Resolves a logical placement to a physical direction.
 * @param {Direction} placement The logical placement.
 * @param {boolean} rtl Whether the inline direction is right-to-left.
 * @returns {PhysicalDirection} The physical placement.
 */
export function getPhysicalPlacement(placement, rtl) {
    const [start, end] = rtl ?
        ['right', 'left'] :
        ['left', 'right'];

    switch (placement) {
        case 'start':
            return start;
        case 'end':
            return end;
        default:
            return placement;
    }
}

/**
 * Resolves the best available popper placement.
 * @param {DOMRect} nodeBox The computed bounding rectangle of the node.
 * @param {DOMRect} referenceBox The computed bounding rectangle of the reference.
 * @param {BoundingRect} minimumBox The available positioning boundary.
 * @param {Placement} placement The preferred placement.
 * @param {number} spacing The amount of spacing to use.
 * @param {boolean} rtl Whether the inline direction is right-to-left.
 * @returns {Direction} The resolved placement.
 */
export function getPopperPlacement(nodeBox, referenceBox, minimumBox, placement, spacing, rtl) {
    const spaceTop = referenceBox.top - minimumBox.top;
    const spaceRight = minimumBox.right - referenceBox.right;
    const spaceBottom = minimumBox.bottom - referenceBox.bottom;
    const spaceLeft = referenceBox.left - minimumBox.left;
    const [spaceStart, spaceEnd] = rtl ?
        [spaceRight, spaceLeft] :
        [spaceLeft, spaceRight];

    if (placement === 'top') {
        // Flip below when it offers more vertical space.
        if (
            spaceTop < nodeBox.height + spacing &&
            spaceBottom > spaceTop
        ) {
            return 'bottom';
        }
    } else if (placement === 'end') {
        // Flip to inline-start when it offers more horizontal space.
        if (
            spaceEnd < nodeBox.width + spacing &&
            spaceStart > spaceEnd
        ) {
            return 'start';
        }
    } else if (placement === 'bottom') {
        // Flip above when it offers more vertical space.
        if (
            spaceBottom < nodeBox.height + spacing &&
            spaceTop > spaceBottom
        ) {
            return 'top';
        }
    } else if (placement === 'start') {
        // Flip to inline-end when it offers more horizontal space.
        if (
            spaceStart < nodeBox.width + spacing &&
            spaceEnd > spaceStart
        ) {
            return 'end';
        }
    } else if (placement === 'auto') {
        const maxVSpace = Math.max(spaceTop, spaceBottom);
        const maxHSpace = Math.max(spaceRight, spaceLeft);
        const minVSpace = Math.min(spaceTop, spaceBottom);

        if (
            maxHSpace > maxVSpace &&
            maxHSpace >= nodeBox.width + spacing &&
            minVSpace + referenceBox.height >= nodeBox.height + spacing - Math.max(0, nodeBox.height - referenceBox.height)
        ) {
            return spaceStart > spaceEnd ?
                'start' :
                'end';
        }

        const minHSpace = Math.min(spaceRight, spaceLeft);

        if (
            maxVSpace >= nodeBox.height + spacing &&
            minHSpace + referenceBox.width >= nodeBox.width + spacing - Math.max(0, nodeBox.width - referenceBox.width)
        ) {
            return spaceBottom > spaceTop ?
                'bottom' :
                'top';
        }

        const maxSpace = Math.max(maxVSpace, maxHSpace);

        if (spaceBottom === maxSpace && spaceBottom >= nodeBox.height + spacing) {
            return 'bottom';
        }

        if (spaceTop === maxSpace && spaceTop >= nodeBox.height + spacing) {
            return 'top';
        }

        if (spaceEnd === maxSpace && spaceEnd >= nodeBox.width + spacing) {
            return 'end';
        }

        if (spaceStart === maxSpace && spaceStart >= nodeBox.width + spacing) {
            return 'start';
        }

        return 'bottom';
    }

    return placement;
}

/**
 * Unregisters a popper and removes shared listeners when no poppers remain.
 * @param {Popper} popper The popper to unregister.
 */
export function removePopper(popper) {
    poppers.delete(popper);

    if (poppers.size) {
        return;
    }

    $.removeEvent(window, 'resize.ui.popper');
    $.removeEvent(document, 'scroll.ui.popper');

    running = false;
}

/**
 * Updates a popper arrow position.
 * @param {Popper} popper The popper instance.
 * @param {Direction} placement The resolved placement.
 * @param {Position} position The resolved alignment.
 * @param {boolean} rtl Whether the inline direction is right-to-left.
 */
export function updateArrow(popper, placement, position, rtl) {
    const physicalPlacement = getPhysicalPlacement(placement, rtl);
    const nodeBox = $.rect(popper.node, { offset: true });
    const referenceBox = $.rect(popper.options.reference, { offset: true });

    $.setStyle(popper.options.arrow, {
        position: 'absolute',
        top: '',
        right: '',
        bottom: '',
        left: '',
    });

    const arrowBox = $.rect(popper.options.arrow, { offset: true });
    const arrowStyles = {};

    if (['top', 'bottom'].includes(physicalPlacement)) {
        const arrowPlacement = physicalPlacement === 'top' ? 'bottom' : 'top';
        arrowStyles[arrowPlacement] = -Math.floor(arrowBox.height);
        const diff = (referenceBox.width - nodeBox.width) / 2;
        const [left, right] = rtl ? ['end', 'start'] : ['start', 'end'];

        let offset = (nodeBox.width / 2) - (arrowBox.width / 2);
        if (position === left) {
            offset += diff;
        } else if (position === right) {
            offset -= diff;
        }

        let min = Math.max(referenceBox.left, nodeBox.left) - arrowBox.left;
        let max = Math.min(referenceBox.right, nodeBox.right) - arrowBox.left - arrowBox.width;

        if (referenceBox.width < arrowBox.width) {
            min -= arrowBox.width / 2 - referenceBox.width / 2;
            max -= arrowBox.width / 2 - referenceBox.width / 2;
        }

        offset = Math.round(offset);
        min = Math.round(min);
        max = Math.round(max);

        arrowStyles.left = $._clamp(offset, min, max);
    } else {
        const arrowPlacement = physicalPlacement === 'right' ? 'left' : 'right';
        arrowStyles[arrowPlacement] = -Math.floor(arrowBox.width);
        const diff = (referenceBox.height - nodeBox.height) / 2;

        let offset = (nodeBox.height / 2) - arrowBox.height;
        if (position === 'start') {
            offset += diff;
        } else if (position === 'end') {
            offset -= diff;
        }

        let min = Math.max(referenceBox.top, nodeBox.top) - arrowBox.top;
        let max = Math.min(referenceBox.bottom, nodeBox.bottom) - arrowBox.top - arrowBox.height;

        if (referenceBox.height < arrowBox.height * 2) {
            min -= arrowBox.height - referenceBox.height / 2;
            max -= arrowBox.height - referenceBox.height / 2;
        } else {
            max -= arrowBox.height;
        }

        offset = Math.round(offset);
        min = Math.round(min);
        max = Math.round(max);

        arrowStyles.top = $._clamp(offset, min, max);
    }

    $.setStyle(popper.options.arrow, arrowStyles);
}
