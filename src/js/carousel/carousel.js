import BaseComponent from './../base-component.js';
import { $, document } from './../globals.js';
import { getPosition } from './../helpers.js';
import { getDirOffset, getDirection, getIndex } from './helpers.js';

/**
 * Carousel Class
 * @class
 */
export default class Carousel extends BaseComponent {
    /**
     * New Carousel constructor.
     * @param {HTMLElement} node The input node.
     * @param {object} [options] The options to create the Carousel with.
     */
    constructor(node, options) {
        super(node, options);

        this._items = $.find('.carousel-item', this.node);

        this._index = this._items.findIndex((item) =>
            $.hasClass(item, 'active'),
        );

        this._events();

        if (this.options.ride === 'carousel') {
            this._setTimer();
        }
    }

    /**
     * Attach events for the Carousel.
     */
    _events() {
        if (this.options.keyboard) {
            $.addEvent(this.node, 'keydown.ui.carousel', (e) => {
                const target = e.target;
                if ($.is(target, 'input, select')) {
                    return;
                }

                switch (e.code) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.prev();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.next();
                        break;
                }
            });
        }

        if (this.options.pause) {
            $.addEvent(this.node, 'mouseenter.ui.carousel', (_) => {
                this._mousePaused = true;
                this.pause();
            });

            $.addEvent(this.node, 'mouseleave.ui.carousel', (_) => {
                this._mousePaused = false;
                this._paused = false;

                if (!$.getDataset(this.node, 'uiSliding')) {
                    this._setTimer();
                }
            });
        }

        if (this.options.swipe) {
            let startX;
            let index = null;
            let progress;
            let direction;

            const downEvent = (e) => {
                if (
                    e.button ||
                    $.getDataset(this.node, 'uiSliding') ||
                    (
                        !$.is(e.target, ':disabled, .disabled') &&
                        (
                            $.is(e.target, '[data-ui-slide-to], [data-ui-slide], a, button, input, textarea, select') ||
                            $.closest(e.target, '[data-ui-slide], a, button', (parent) => $.isSame(parent, this.node) || $.is(parent, ':disabled, .disabled')).length
                        )
                    )
                ) {
                    return false;
                }

                this.pause();
                $.setDataset(this.node, { uiSliding: true });

                const pos = getPosition(e);
                startX = pos.x;
            };

            const moveEvent = (e) => {
                const pos = getPosition(e);
                const currentX = pos.x;
                const width = $.width(this.node);
                const scrollX = width / 2;

                let mouseDiffX = currentX - startX;
                if (!this.options.wrap) {
                    mouseDiffX = $._clamp(
                        mouseDiffX,
                        -(this._items.length - 1 - this._index) * scrollX,
                        this._index * scrollX,
                    );
                }

                progress = $._map(Math.abs(mouseDiffX), 0, scrollX, 0, 1);

                do {
                    const lastIndex = index;

                    if (mouseDiffX < 0) {
                        index = this._index + 1;
                    } else if (mouseDiffX > 0) {
                        index = this._index - 1;
                    } else {
                        index = this._index;
                        return;
                    }

                    const offset = getDirOffset(index, this._items.length);
                    index = getIndex(index, this._items.length);
                    direction = getDirection(offset, this._index, index);

                    if (progress >= 1) {
                        startX = currentX;

                        const oldIndex = this._setIndex(index);
                        this._update(this._items[this._index], this._items[oldIndex], progress, { direction });
                        this._updateIndicators();

                        if (lastIndex !== this._index) {
                            this._resetStyles(lastIndex);
                        }

                        progress--;
                    } else {
                        this._update(this._items[index], this._items[this._index], progress, { direction, dragging: true });

                        if (lastIndex !== index) {
                            this._resetStyles(lastIndex);
                        }
                    }
                } while (progress > 1);
            };

            const upEvent = (_) => {
                if (index === null || index === this._index) {
                    this._paused = false;
                    $.removeDataset(this.node, 'uiSliding');
                    this._setTimer();
                    return;
                }

                let oldIndex;
                let progressRemaining;
                if (progress > .25) {
                    oldIndex = this._setIndex(index);
                    progressRemaining = 1 - progress;
                } else {
                    oldIndex = index;
                    progressRemaining = progress;
                    direction = direction === 'right' ? 'left' : 'right';
                }

                this._resetStyles(this._index);

                index = null;

                $.animate(
                    this._items[this._index],
                    (node, newProgress) => {
                        if (!this._items) {
                            return;
                        }

                        if (progress > .25) {
                            this._update(node, this._items[oldIndex], progress + (newProgress * progressRemaining), { direction });
                        } else {
                            this._update(node, this._items[oldIndex], (1 - progress) + (newProgress * progressRemaining), { direction });
                        }
                    },
                    {
                        duration: this.options.transition * progressRemaining,
                    },
                ).then((_) => {
                    this._updateIndicators();
                    $.removeDataset(this.node, 'uiSliding');

                    this._paused = false;
                    this._setTimer();
                }).catch((_) => {
                    $.removeDataset(this.node, 'uiSliding');
                });
            };

            const dragEvent = $.mouseDragFactory(downEvent, moveEvent, upEvent);

            $.addEvent(this.node, 'mousedown.ui.carousel touchstart.ui.carousel', dragEvent);
        }
    }

    /**
     * Reset styles of an item.
     * @param {number} index The item index.
     */
    _resetStyles(index) {
        $.setStyle(this._items[index], {
            display: '',
            transform: '',
        });
    }

    /**
     * Set a new item index and update the items.
     * @param {number} index The new item index.
     * @return {number} The old item index.
     */
    _setIndex(index) {
        const oldIndex = this._index;
        this._index = index;

        $.addClass(this._items[this._index], 'active');
        $.removeClass(this._items[oldIndex], 'active');

        return oldIndex;
    }

    /**
     * Set a timer for the next Carousel cycle.
     */
    _setTimer() {
        if (this._timer || this._paused || this._mousePaused) {
            return;
        }

        const interval = $.getDataset(this._items[this._index], 'uiInterval');

        this._timer = setTimeout(
            (_) => {
                this._timer = null;
                this.cycle();
            },
            interval || this.options.interval,
        );
    }

    /**
     * Cycle to a specific Carousel item.
     * @param {number} index The item index to cycle to.
     */
    _show(index) {
        if ($.getDataset(this.node, 'uiSliding')) {
            return;
        }

        index = parseInt(index);

        if (!this.options.wrap &&
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

        if (!$.triggerOne(this.node, 'slide.ui.carousel', { data: eventData })) {
            return;
        }

        $.setDataset(this.node, { uiSliding: true });
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
                duration: this.options.transition,
            },
        ).then((_) => {
            this._updateIndicators();
            $.removeDataset(this.node, 'uiSliding');
            $.triggerEvent(this.node, 'slid.ui.carousel', { data: eventData });

            this._paused = false;
            this._setTimer();
        }).catch((_) => {
            $.removeDataset(this.node, 'uiSliding');
        });
    }

    /**
     * Update the position of the Carousel items.
     * @param {Node} nodeIn The new node.
     * @param {Node} nodeOut The old node.
     * @param {number} progress The progress of the cycle.
     * @param {object} options The options for updating the item positions.
     * @param {string} [options.direction] The direction to cycle to.
     * @param {Boolean} [options.dragging] Whether the item is being dragged.
     */
    _update(nodeIn, nodeOut, progress, { direction, dragging = false } = {}) {
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
    }

    /**
     * Update the carousel indicators.
     */
    _updateIndicators() {
        const oldIndicator = $.find('.active[data-ui-slide-to]', this.node);
        const newIndicator = $.find('[data-ui-slide-to="' + this._index + '"]', this.node);
        $.removeClass(oldIndicator, 'active');
        $.addClass(newIndicator, 'active');
    }

    /**
     * Cycle to the next carousel item.
     */
    cycle() {
        if (!$.isHidden(document)) {
            this.slide(1);
        } else {
            this._paused = false;
            this._setTimer();
        }
    }

    /**
     * Dispose the Carousel.
     */
    dispose() {
        clearTimeout(this._timer);
        this._timer = null;

        if (this.options.keyboard) {
            $.removeEvent(this.node, 'keydown.ui.carousel');
        }

        if (this.options.pause) {
            $.removeEvent(this.node, 'mouseenter.ui.carousel');
            $.removeEvent(this.node, 'mouseleave.ui.carousel');
        }

        if (this.options.swipe) {
            $.removeEvent(this.node, 'mousedown.ui.carousel touchstart.ui.carousel');
        }

        this._items = null;

        super.dispose();
    }

    /**
     * Cycle to the next Carousel item.
     */
    next() {
        this.slide();
    }

    /**
     * Stop the carousel from cycling through items.
     */
    pause() {
        clearTimeout(this._timer);
        this._timer = null;
        this._paused = true;
    }

    /**
     * Cycle to the previous Carousel item.
     */
    prev() {
        this.slide(-1);
    }

    /**
     * Cycle to a specific Carousel item.
     * @param {number} index The item index to cycle to.
     */
    show(index) {
        this._show(index);
    }

    /**
     * Slide the Carousel in a specific direction.
     * @param {number} [direction=1] The direction to slide to.
     */
    slide(direction = 1) {
        this.show(this._index + direction);
    }
}
