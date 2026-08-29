import BaseComponent from './../base-component.js';
import { $, document, window } from './../globals.js';
import { getScrollContainer } from './../helpers/scroll.js';
import {
    addPopper,
    getPhysicalPlacement,
    getPopperPlacement,
    removePopper,
} from './helpers.js';

/** @typedef {'top'|'end'|'bottom'|'start'} Direction */
/** @typedef {'top'|'right'|'bottom'|'left'} PhysicalDirection */
/** @typedef {'auto'|Direction} Placement */
/** @typedef {'start'|'center'|'end'} Position */
/** @typedef {string|HTMLElement} ElementInput */

/**
 * @callback PopperBeforeUpdateCallback
 * @param {HTMLElement} node The positioned element.
 * @param {ElementInput} reference The reference element.
 * @returns {void} Nothing.
 */

/**
 * @callback PopperAfterUpdateCallback
 * @param {HTMLElement} node The positioned element.
 * @param {ElementInput} reference The reference element.
 * @param {Direction} placement The resolved placement.
 * @param {Position} position The resolved alignment.
 * @returns {void} Nothing.
 */

/**
 * @typedef {object} PopperOptions
 * @property {ElementInput|null} [reference=null] The reference element.
 * @property {ElementInput|null} [container=null] The positioning boundary.
 * @property {ElementInput|null} [arrow=null] The arrow element.
 * @property {PopperAfterUpdateCallback|null} [afterUpdate=null] The callback after positioning.
 * @property {PopperBeforeUpdateCallback|null} [beforeUpdate=null] The callback before positioning.
 * @property {Placement} [placement='bottom'] The preferred placement.
 * @property {Position} [position='center'] The alignment along the placement edge.
 * @property {boolean} [fixed=false] Whether to preserve the preferred placement.
 * @property {number} [spacing=0] The spacing from the reference element.
 * @property {number|false|null} [minContact=null] The minimum contact with the reference element.
 */

/**
 * Positions an element relative to a reference element.
 * @augments {BaseComponent<PopperOptions>}
 */
export default class Popper extends BaseComponent {
    #placement;
    #referencePlacement;
    #rtl;

    /**
     * Creates a Popper.
     * @param {HTMLElement} node The input node.
     * @param {PopperOptions} options The popper options.
     */
    constructor(node, options) {
        super(node, options);

        this.#rtl = $.css(this.options.reference, 'direction') === 'rtl';
        this.#placement = $.getDataset(this.node, 'uiPlacement');
        this.#referencePlacement = $.getDataset(this.options.reference, 'uiPlacement');

        $.setStyle(this.node, {
            margin: 0,
            position: 'absolute',
            top: 0,
            right: 'initial',
            bottom: 'initial',
            left: 0,
        });

        addPopper(this);

        this.update();
    }

    /** @inheritdoc */
    dispose() {
        if (this.#placement) {
            $.setDataset(this.node, { uiPlacement: this.#placement });
        } else {
            $.removeDataset(this.node, 'uiPlacement');
        }

        if (this.#referencePlacement) {
            $.setDataset(this.options.reference, { uiPlacement: this.#referencePlacement });
        } else {
            $.removeDataset(this.options.reference, 'uiPlacement');
        }

        removePopper(this);

        super.dispose();
    }

    /**
     * Checks whether a scroll target affects the popper.
     * @param {HTMLElement|Document} target The scroll target.
     * @returns {boolean} Whether the popper should update.
     */
    shouldUpdateForScroll(target) {
        return $._isDocument(target) ||
            $.hasDescendent(target, this.node) ||
            $.hasDescendent(target, this.options.reference);
    }

    /**
     * Updates the popper position.
     */
    update() {
        if (!$.isConnected(this.node) || !$.isVisible(this.node)) {
            return;
        }

        // Reset the previous position before measuring.
        $.setStyle(this.node, { transform: '' });

        if (this.options.beforeUpdate) {
            this.options.beforeUpdate(this.node, this.options.reference);
        }

        // Measure the element and its positioning boundaries.
        const nodeBox = $.rect(this.node, { offset: true });
        const referenceBox = $.rect(this.options.reference, { offset: true });
        const windowBox = getScrollContainer(window, document);
        const positionParent = $.offsetParent(this.node);

        // Overflow only clips an absolute child when it contains the child's positioning context.
        const scrollParent = positionParent ?
            $.closest(
                this.node,
                (parent) =>
                    (
                        $.isSame(parent, positionParent) ||
                        $.hasDescendent(parent, positionParent)
                    ) &&
                    ['overflow', 'overflowX', 'overflowY'].some((property) =>
                        ['auto', 'scroll'].includes($.css(parent, property)),
                    ),
                document.body,
            ).shift() :
            null;

        const scrollBox = scrollParent ?
            getScrollContainer(scrollParent, scrollParent) :
            null;

        const containerBox = this.options.container ?
            $.rect(this.options.container, { offset: true }) :
            null;

        const minimumBox = {
            ...windowBox,
        };

        if (scrollBox) {
            minimumBox.top = Math.max(minimumBox.top, scrollBox.top);
            minimumBox.right = Math.min(minimumBox.right, scrollBox.right);
            minimumBox.bottom = Math.min(minimumBox.bottom, scrollBox.bottom);
            minimumBox.left = Math.max(minimumBox.left, scrollBox.left);
        }

        if (containerBox) {
            minimumBox.top = Math.max(minimumBox.top, containerBox.top);
            minimumBox.right = Math.min(minimumBox.right, containerBox.right);
            minimumBox.bottom = Math.min(minimumBox.bottom, containerBox.bottom);
            minimumBox.left = Math.max(minimumBox.left, containerBox.left);
        }

        if (scrollBox || containerBox) {
            minimumBox.x = minimumBox.left;
            minimumBox.y = minimumBox.top;
            minimumBox.width = minimumBox.right - minimumBox.left;
            minimumBox.height = minimumBox.bottom - minimumBox.top;
        }

        // Resolve the best placement for the available space.
        const placement = this.options.fixed && this.options.placement !== 'auto' ?
            this.options.placement :
            getPopperPlacement(
                nodeBox,
                referenceBox,
                minimumBox,
                this.options.placement,
                this.options.spacing + 2,
                this.#rtl,
            );

        const physicalPlacement = getPhysicalPlacement(placement, this.#rtl);

        $.setDataset(this.options.reference, { uiPlacement: placement });
        $.setDataset(this.node, { uiPlacement: placement });

        const position = this.options.position;

        // Start from the reference element offset.
        const offset = {
            x: Math.round(referenceBox.x),
            y: Math.round(referenceBox.y),
        };

        // Adjust for the element's positioning context.
        const positionBox = positionParent && !$.isSame(positionParent, document.body) ?
            $.rect(positionParent, { offset: true }) :
            null;

        if (positionBox) {
            offset.x -= Math.round(positionBox.x);
            offset.y -= Math.round(positionBox.y);
        }

        // Move the element onto the resolved placement edge.
        if (physicalPlacement === 'top') {
            offset.y -= Math.round(nodeBox.height) + this.options.spacing;
        } else if (physicalPlacement === 'right') {
            offset.x += Math.round(referenceBox.width) + this.options.spacing;
        } else if (physicalPlacement === 'bottom') {
            offset.y += Math.round(referenceBox.height) + this.options.spacing;
        } else if (physicalPlacement === 'left') {
            offset.x -= Math.round(nodeBox.width) + this.options.spacing;
        }

        // Align the element along the placement edge.
        if (['top', 'bottom'].includes(physicalPlacement)) {
            const deltaX = Math.round(nodeBox.width) - Math.round(referenceBox.width);

            if (position === 'center') {
                offset.x -= Math.round(deltaX / 2);
            } else if (
                position === (this.#rtl ? 'start' : 'end')
            ) {
                offset.x -= deltaX;
            }
        } else {
            const deltaY = Math.round(nodeBox.height) - Math.round(referenceBox.height);

            if (position === 'center') {
                offset.y -= Math.round(deltaY / 2);
            } else if (position === 'end') {
                offset.y -= deltaY;
            }
        }

        // Compensate for element margins.
        offset.x -= parseInt($.css(this.node, 'marginLeft'));
        offset.y -= parseInt($.css(this.node, 'marginTop'));

        // Keep enough of the element in contact with its reference.
        if (['left', 'right'].includes(physicalPlacement)) {
            let offsetY = offset.y;
            let refTop = referenceBox.top;

            if (positionBox) {
                offsetY += positionBox.top;
                refTop -= positionBox.top;
            }

            const minSize = this.options.minContact !== null ?
                this.options.minContact :
                Math.min(referenceBox.height, nodeBox.height);

            if (offsetY + nodeBox.height > minimumBox.bottom) {
                // Move the element above the lower boundary.
                const diff = offsetY + nodeBox.height - minimumBox.bottom;
                offset.y = Math.max(
                    refTop - nodeBox.height + minSize,
                    offset.y - diff,
                );
            }

            if (offsetY < minimumBox.top) {
                // Move the element below the upper boundary.
                const diff = offsetY - minimumBox.top;
                offset.y = Math.min(
                    refTop + referenceBox.height - minSize,
                    offset.y - diff,
                );
            }
        } else {
            let offsetX = offset.x;
            let refLeft = referenceBox.left;

            if (positionBox) {
                offsetX += positionBox.left;
                refLeft -= positionBox.left;
            }

            const minSize = this.options.minContact !== null ?
                this.options.minContact :
                Math.min(referenceBox.width, nodeBox.width);

            if (offsetX + nodeBox.width > minimumBox.right) {
                // Move the element left of the right boundary.
                const diff = offsetX + nodeBox.width - minimumBox.right;
                offset.x = Math.max(
                    refLeft - nodeBox.width + minSize,
                    offset.x - diff,
                );
            }

            if (offsetX < minimumBox.left) {
                // Move the element right of the left boundary.
                const diff = offsetX - minimumBox.left;
                offset.x = Math.min(
                    refLeft + referenceBox.width - minSize,
                    offset.x - diff,
                );
            }
        }

        offset.x = Math.round(offset.x);
        offset.y = Math.round(offset.y);

        // Compensate for scrolling within the positioning context.
        if (positionBox) {
            offset.x += $.getScrollX(positionParent);
            offset.y += $.getScrollY(positionParent);
        }

        // Apply the final position.
        $.setStyle(this.node, {
            transform: `translate3d(${offset.x}px , ${offset.y}px , 0)`,
        });

        // Align the arrow with the reference element.
        if (this.options.arrow) {
            this.#updateArrow(placement, position);
        }

        if (this.options.afterUpdate) {
            this.options.afterUpdate(this.node, this.options.reference, placement, position);
        }
    }

    /**
     * Updates the popper arrow position.
     * @param {Direction} placement The resolved placement.
     * @param {Position} position The resolved alignment.
     */
    #updateArrow(placement, position) {
        const physicalPlacement = getPhysicalPlacement(placement, this.#rtl);
        const nodeBox = $.rect(this.node, { offset: true });
        const referenceBox = $.rect(this.options.reference, { offset: true });

        const arrowStyles = {
            position: 'absolute',
            top: '',
            right: '',
            bottom: '',
            left: '',
        };
        $.setStyle(this.options.arrow, arrowStyles);

        const arrowBox = $.rect(this.options.arrow, { offset: true });

        if (['top', 'bottom'].includes(physicalPlacement)) {
            const arrowPlacement = physicalPlacement === 'top' ? 'bottom' : 'top';
            arrowStyles[arrowPlacement] = -Math.floor(arrowBox.height);
            const diff = (referenceBox.width - nodeBox.width) / 2;
            const [left, right] = this.#rtl ? ['end', 'start'] : ['start', 'end'];

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

        $.setStyle(this.options.arrow, arrowStyles);
    }
}
