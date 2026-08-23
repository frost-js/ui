import BaseComponent from './../base-component.js';
import { $, document } from './../globals.js';

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

        this._items = $.find('.carousel-item', this._node);

        this._index = this._items.findIndex((item) =>
            $.hasClass(item, 'active'),
        );

        this._events();

        if (this._options.ride === 'carousel') {
            this._setTimer();
        }
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

        if (this._options.keyboard) {
            $.removeEvent(this._node, 'keydown.ui.carousel');
        }

        if (this._options.pause) {
            $.removeEvent(this._node, 'mouseenter.ui.carousel');
            $.removeEvent(this._node, 'mouseleave.ui.carousel');
        }

        if (this._options.swipe) {
            $.removeEvent(this._node, 'mousedown.ui.carousel touchstart.ui.carousel');
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
