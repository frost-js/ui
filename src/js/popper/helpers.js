import { $, document, window } from './../globals.js';

/**
 * Popper Helpers
 */

const poppers = new Set();

let running = false;

/**
 * Add a Popper to the set, and attach the Popper events.
 * @param {Popper} popper The Popper.
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
                if (
                    !$._isDocument(e.target) &&
                    !$.hasDescendent(e.target, popper._node) &&
                    !$.hasDescendent(e.target, popper._options.reference)
                ) {
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
 * Get the actual placement of the Popper.
 * @param {DOMRect} nodeBox The computed bounding rectangle of the node.
 * @param {DOMRect} referenceBox The computed bounding rectangle of the reference.
 * @param {object} minimumBox The computed minimum bounding rectangle of the container.
 * @param {string} placement The initial placement of the Popper.
 * @param {number} spacing The amount of spacing to use.
 * @return {string} The new placement of the Popper.
 */
export function getPopperPlacement(nodeBox, referenceBox, minimumBox, placement, spacing) {
    const spaceTop = referenceBox.top - minimumBox.top;
    const spaceRight = minimumBox.right - referenceBox.right;
    const spaceBottom = minimumBox.bottom - referenceBox.bottom;
    const spaceLeft = referenceBox.left - minimumBox.left;

    if (placement === 'top') {
        // if node is bigger than space top and there is more room on bottom
        if (spaceTop < nodeBox.height + spacing &&
            spaceBottom > spaceTop) {
            return 'bottom';
        }
    } else if (placement === 'right') {
        // if node is bigger than space right and there is more room on left
        if (spaceRight < nodeBox.width + spacing &&
            spaceLeft > spaceRight) {
            return 'left';
        }
    } else if (placement === 'bottom') {
        // if node is bigger than space bottom and there is more room on top
        if (spaceBottom < nodeBox.height + spacing &&
            spaceTop > spaceBottom) {
            return 'top';
        }
    } else if (placement === 'left') {
        // if node is bigger than space left and there is more room on right
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
 * Remove a Popper from the set, and detach the Popper events.
 * @param {Popper} popper The Popper.
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
