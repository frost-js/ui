import { $ } from './../../globals.js';
import { getDirOffset, getDirection, getIndex } from './../helpers.js';

/**
 * Reset styles of an item.
 * @param {number} index The item index.
 */
export function _resetStyles(index) {
    $.setStyle(this._items[index], {
        display: '',
        transform: '',
    });
};

/**
 * Set a new item index and update the items.
 * @param {number} index The new item index.
 * @return {number} The old item index.
 */
export function _setIndex(index) {
    const oldIndex = this._index;
    this._index = index;

    $.addClass(this._items[this._index], 'active');
    $.removeClass(this._items[oldIndex], 'active');

    return oldIndex;
};

/**
 * Set a timer for the next Carousel cycle.
 */
export function _setTimer() {
    if (this._timer || this._paused || this._mousePaused) {
        return;
    }

    const interval = $.getDataset(this._items[this._index], 'uiInterval');

    this._timer = setTimeout(
        (_) => this.cycle(),
        interval || this._options.interval,
    );
};

/**
 * Cycle to a specific Carousel item.
 * @param {number} index The item index to cycle to.
 */
export function _show(index) {
    if ($.getDataset(this._node, 'uiSliding')) {
        return;
    }

    index = parseInt(index);

    if (!this._options.wrap &&
        (
            index < 0 ||
            index > this._items.length - 1
        )
    ) {
        return;
    }

    const offset = getDirOffset(index, this._items.length);
    index = getIndex(index, this._items.length);

    if (index === this._index) {
        return;
    }

    const direction = getDirection(offset, this._index, index);

    const eventData = {
        direction,
        relatedTarget: this._items[index],
        from: this._index,
        to: index,
    };

    if (!$.triggerOne(this._node, 'slide.ui.carousel', { data: eventData })) {
        return;
    }

    $.setDataset(this._node, { uiSliding: true });
    this.pause();

    const oldIndex = this._setIndex(index);

    $.animate(
        this._items[this._index],
        (node, progress) => {
            if (!this._items) {
                return;
            }

            this._update(node, this._items[oldIndex], progress, { direction });
        },
        {
            duration: this._options.transition,
        },
    ).then((_) => {
        this._updateIndicators();
        $.removeDataset(this._node, 'uiSliding');
        $.triggerEvent(this._node, 'slid.ui.carousel', { data: eventData });

        this._paused = false;
        this._setTimer();
    }).catch((_) => {
        $.removeDataset(this._node, 'uiSliding');
    });
};

/**
 * Update the position of the Carousel items.
 * @param {Node} nodeIn The new node.
 * @param {Node} nodeOut The old node.
 * @param {number} progress The progress of the cycle.
 * @param {object} options The options for updating the item positions.
 * @param {string} [options.direction] The direction to cycle to.
 * @param {Boolean} [options.dragging] Whether the item is being dragged.
 */
export function _update(nodeIn, nodeOut, progress, { direction, dragging = false } = {}) {
    const inStyles = {};
    const outStyles = {};

    if (progress >= 1) {
        if (dragging) {
            inStyles.display = '';
        } else {
            outStyles.display = '';
        }

        inStyles.transform = '';
        outStyles.transform = '';
    } else {
        const inverse = direction === 'right';

        if (dragging) {
            inStyles.display = 'block';
        } else {
            outStyles.display = 'block';
        }

        inStyles.transform = `translateX(${Math.round((1 - progress) * 100) * (inverse ? 1 : -1)}%)`;
        outStyles.transform = `translateX(${Math.round(progress * 100) * (inverse ? -1 : 1)}%)`;
    }

    $.setStyle(nodeIn, inStyles);
    $.setStyle(nodeOut, outStyles);
};

/**
 * Update the carousel indicators.
 */
export function _updateIndicators() {
    const oldIndicator = $.find('.active[data-ui-slide-to]', this._node);
    const newIndicator = $.find('[data-ui-slide-to="' + this._index + '"]', this._node);
    $.removeClass(oldIndicator, 'active');
    $.addClass(newIndicator, 'active');
};
