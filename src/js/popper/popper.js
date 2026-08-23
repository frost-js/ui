import BaseComponent from './../base-component.js';
import { $, document, window } from './../globals.js';
import { getScrollContainer } from './../helpers.js';
import { addPopper, getPopperPlacement, removePopper } from './helpers.js';

/**
 * Popper Class
 * @class
 */
export default class Popper extends BaseComponent {
    /**
     * New Popper constructor.
     * @param {HTMLElement} node The input node.
     * @param {object} options The options to create the Popper with.
     */
    constructor(node, options) {
        super(node, options);

        this._placement = $.getDataset(this._node, 'uiPlacement');
        this._referencePlacement = $.getDataset(this._options.reference, 'uiPlacement');

        $.setStyle(this._node, {
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

    /**
     * Update the arrow.
     * @param {string} placement The placement of the Popper.
     * @param {string} position The position of the Popper.
     */
    _updateArrow(placement, position) {
        const nodeBox = $.rect(this._node, { offset: true });
        const referenceBox = $.rect(this._options.reference, { offset: true });

        const arrowStyles = {
            position: 'absolute',
            top: '',
            right: '',
            bottom: '',
            left: '',
        };
        $.setStyle(this._options.arrow, arrowStyles);

        const arrowBox = $.rect(this._options.arrow, { offset: true });

        if (['top', 'bottom'].includes(placement)) {
            arrowStyles[placement === 'top' ? 'bottom' : 'top'] = -Math.floor(arrowBox.height);
            const diff = (referenceBox.width - nodeBox.width) / 2;

            let offset = (nodeBox.width / 2) - (arrowBox.width / 2);
            if (position === 'start') {
                offset += diff;
            } else if (position === 'end') {
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
            arrowStyles[placement === 'right' ? 'left' : 'right'] = -Math.floor(arrowBox.width);

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

        $.setStyle(this._options.arrow, arrowStyles);
    }

    /**
     * Dispose the Popper.
     */
    dispose() {
        if (this._placement) {
            $.setDataset(this._node, { uiPlacement: this._placement });
        } else {
            $.removeDataset(this._node, 'uiPlacement');
        }

        if (!this._options.noAttributes) {
            if (this._referencePlacement) {
                $.setDataset(this._options.reference, { uiPlacement: this._referencePlacement });
            } else {
                $.removeDataset(this._options.reference, 'uiPlacement');
            }
        }

        removePopper(this);

        super.dispose();
    }

    /**
     * Update the Popper position.
     */
    update() {
        if (!$.isConnected(this._node) || !$.isVisible(this._node)) {
            return;
        }

        // reset position
        const resetStyle = {};

        if (this._options.useGpu) {
            resetStyle.transform = '';
        } else {
            resetStyle.marginLeft = 0;
            resetStyle.marginTop = 0;
        }

        $.setStyle(this._node, resetStyle);

        if (this._options.beforeUpdate) {
            this._options.beforeUpdate(this._node, this._options.reference);
        }

        // calculate boxes
        const nodeBox = $.rect(this._node, { offset: true });
        const referenceBox = $.rect(this._options.reference, { offset: true });
        const windowBox = getScrollContainer(window, document);

        const scrollParent = $.closest(
            this._node,
            (parent) =>
                $.css(parent, 'position') === 'relative' &&
                ['overflow', 'overflowX', 'overflowY'].some((overflow) =>
                    ['auto', 'scroll'].includes(
                        $.css(parent, overflow),
                    ),
                ),
            document.body,
        ).shift();

        const scrollBox = scrollParent ?
            getScrollContainer(scrollParent, scrollParent) :
            null;

        const containerBox = this._options.container ?
            $.rect(this._options.container, { offset: true }) :
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

        // get optimal placement
        const placement = this._options.fixed && this._options.placement !== 'auto' ?
            this._options.placement :
            getPopperPlacement(
                nodeBox,
                referenceBox,
                minimumBox,
                this._options.placement,
                this._options.spacing + 2,
            );

        if (!this._options.noAttributes) {
            $.setDataset(this._options.reference, { uiPlacement: placement });
        }

        $.setDataset(this._node, { uiPlacement: placement });

        // get auto position
        const position = this._options.position;

        // calculate actual offset
        const offset = {
            x: Math.round(referenceBox.x),
            y: Math.round(referenceBox.y),
        };

        // offset for relative parent
        const relativeParent = $.closest(
            this._node,
            (parent) =>
                $.css(parent, 'position') === 'relative',
            document.body,
        ).shift();
        const relativeBox = relativeParent ?
            $.rect(relativeParent, { offset: true }) :
            null;

        if (relativeBox) {
            offset.x -= Math.round(relativeBox.x);
            offset.y -= Math.round(relativeBox.y);
        }

        // offset for placement
        if (placement === 'top') {
            offset.y -= Math.round(nodeBox.height) + this._options.spacing;
        } else if (placement === 'right') {
            offset.x += Math.round(referenceBox.width) + this._options.spacing;
        } else if (placement === 'bottom') {
            offset.y += Math.round(referenceBox.height) + this._options.spacing;
        } else if (placement === 'left') {
            offset.x -= Math.round(nodeBox.width) + this._options.spacing;
        }

        // offset for position
        if (['top', 'bottom'].includes(placement)) {
            const deltaX = Math.round(nodeBox.width) - Math.round(referenceBox.width);

            if (position === 'center') {
                offset.x -= Math.round(deltaX / 2);
            } else if (position === 'end') {
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

        // compensate for margins
        offset.x -= parseInt($.css(this._node, 'marginLeft'));
        offset.y -= parseInt($.css(this._node, 'marginTop'));

        // corrective positioning
        if (['left', 'right'].includes(placement)) {
            let offsetY = offset.y;
            let refTop = referenceBox.top;

            if (relativeBox) {
                offsetY += relativeBox.top;
                refTop -= relativeBox.top;
            }

            const minSize = this._options.minContact !== null ?
                this._options.minContact :
                Math.min(referenceBox.height, nodeBox.height);

            if (offsetY + nodeBox.height > minimumBox.bottom) {
                // bottom of offset node is below the container
                const diff = offsetY + nodeBox.height - minimumBox.bottom;
                offset.y = Math.max(
                    refTop - nodeBox.height + minSize,
                    offset.y - diff,
                );
            }

            if (offsetY < minimumBox.top) {
                // top of offset node is above the container
                const diff = offsetY - minimumBox.top;
                offset.y = Math.min(
                    refTop + referenceBox.height - minSize,
                    offset.y - diff,
                );
            }
        } else {
            let offsetX = offset.x;
            let refLeft = referenceBox.left;

            if (relativeBox) {
                offsetX += relativeBox.left;
                refLeft -= relativeBox.left;
            }

            const minSize = this._options.minContact !== null ?
                this._options.minContact :
                Math.min(referenceBox.width, nodeBox.width);

            if (offsetX + nodeBox.width > minimumBox.right) {
                // right of offset node is to the right of the container
                const diff = offsetX + nodeBox.width - minimumBox.right;
                offset.x = Math.max(
                    refLeft - nodeBox.width + minSize,
                    offset.x - diff,
                );
            }

            if (offsetX < minimumBox.left) {
                // left of offset node is to the left of the container
                const diff = offsetX - minimumBox.left;
                offset.x = Math.min(
                    refLeft + referenceBox.width - minSize,
                    offset.x - diff,
                );
            }
        }

        offset.x = Math.round(offset.x);
        offset.y = Math.round(offset.y);

        // compensate for scroll parent
        if (scrollParent) {
            offset.x += $.getScrollX(scrollParent);
            offset.y += $.getScrollY(scrollParent);
        }

        // update position
        const style = {};
        if (this._options.useGpu) {
            style.transform = `translate3d(${offset.x}px , ${offset.y}px , 0)`;
        } else {
            style.marginLeft = `${offset.x}px`;
            style.marginTop = `${offset.y}px`;
        }

        $.setStyle(this._node, style);

        // update arrow
        if (this._options.arrow) {
            this._updateArrow(placement, position);
        }

        if (this._options.afterUpdate) {
            this._options.afterUpdate(this._node, this._options.reference, placement, position);
        }
    }
}
