import { $, document, window } from './../globals.js';

/** @typedef {import('./popper.js').default} Popper */
/** @typedef {import('../helpers/scroll.js').BoundingRect} BoundingRect */
/** @typedef {import('./popper.js').Direction} Direction */
/** @typedef {import('./popper.js').Placement} Placement */

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
        $.debounce((_) => {
            for (const popper of poppers) {
                popper.update();
            }
        }),
    );

    $.addEvent(
        document,
        'scroll.ui.popper',
        $.debounce((e) => {
            for (const popper of poppers) {
                if (!popper.shouldUpdateForScroll(e.target)) {
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
};

/**
 * Resolves the best available popper placement.
 * @param {DOMRect} nodeBox The computed bounding rectangle of the node.
 * @param {DOMRect} referenceBox The computed bounding rectangle of the reference.
 * @param {BoundingRect} minimumBox The available positioning boundary.
 * @param {Placement} placement The preferred placement.
 * @param {number} spacing The amount of spacing to use.
 * @returns {Direction} The resolved placement.
 */
export function getPopperPlacement(nodeBox, referenceBox, minimumBox, placement, spacing) {
    const spaceTop = referenceBox.top - minimumBox.top;
    const spaceRight = minimumBox.right - referenceBox.right;
    const spaceBottom = minimumBox.bottom - referenceBox.bottom;
    const spaceLeft = referenceBox.left - minimumBox.left;

    if (placement === 'top') {
        // Flip below when it offers more vertical space.
        if (spaceTop < nodeBox.height + spacing &&
            spaceBottom > spaceTop) {
            return 'bottom';
        }
    } else if (placement === 'right') {
        // Flip left when it offers more horizontal space.
        if (spaceRight < nodeBox.width + spacing &&
            spaceLeft > spaceRight) {
            return 'left';
        }
    } else if (placement === 'bottom') {
        // Flip above when it offers more vertical space.
        if (spaceBottom < nodeBox.height + spacing &&
            spaceTop > spaceBottom) {
            return 'top';
        }
    } else if (placement === 'left') {
        // Flip right when it offers more horizontal space.
        if (spaceLeft < nodeBox.width + spacing &&
            spaceRight > spaceLeft) {
            return 'right';
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
            return spaceLeft > spaceRight ?
                'left' :
                'right';
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

        if (spaceRight === maxSpace && spaceRight >= nodeBox.width + spacing) {
            return 'right';
        }

        if (spaceLeft === maxSpace && spaceLeft >= nodeBox.width + spacing) {
            return 'left';
        }

        return 'bottom';
    }

    return placement;
};

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
};
