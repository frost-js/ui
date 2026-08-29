import BaseComponent from './../base-component.js';
import { $, document } from './../globals.js';
import { getPosition } from './../helpers/pointer.js';
import { waitForTransition } from './../helpers/transition.js';
import { getDirection, getDirOffset, getIndex, getPhysicalDirection, getTransitionClasses } from './helpers.js';

/** @typedef {'prev'|'next'} CarouselDirection */
/** @typedef {'left'|'right'} PhysicalDirection */

/**
 * @typedef {object} CarouselOptions
 * @property {number} [interval=5000] The cycle interval in milliseconds.
 * @property {boolean} [keyboard=true] Whether to support keyboard navigation.
 * @property {false|'carousel'} [ride=false] Whether to cycle automatically.
 * @property {boolean} [pause=true] Whether to pause while hovered.
 * @property {boolean} [wrap=true] Whether navigation wraps at either end.
 * @property {boolean} [swipe=true] Whether to support pointer and touch swiping.
 */

/**
 * @typedef {object} CarouselUpdateOptions
 * @property {CarouselDirection} direction The transition direction.
 * @property {boolean} [dragging=false] Whether the position is being updated by a drag.
 */

/**
 * Controls an animated carousel.
 * @augments {BaseComponent<CarouselOptions>}
 */
export default class Carousel extends BaseComponent {
    #index;
    #items;
    #mousePaused;
    #paused;
    #rtl;
    #sliding;
    #timer;

    /**
     * Creates a Carousel.
     * @param {HTMLElement} node The input node.
     * @param {CarouselOptions} [options] The carousel options.
     */
    constructor(node, options) {
        super(node, options);

        this.#rtl = $.css(this.node, 'direction') === 'rtl';
        this.#items = $.find('.carousel-item', this.node);

        this.#index = this.#items.findIndex((item) =>
            $.hasClass(item, 'active'),
        );
        this.#sliding = false;

        this.#events();

        if (this.options.ride === 'carousel') {
            this.#setTimer();
        }
    }

    /**
     * Advances the carousel automatically when the document is visible.
     */
    cycle() {
        if (!$.isHidden(document)) {
            this.slide(1);
        } else {
            this.#paused = false;
            this.#setTimer();
        }
    }

    /** @inheritdoc */
    dispose() {
        $.setStyle(this.node, { '--ui-carousel-transition-scale': '' });

        if (this.#sliding) {
            $.removeClass(this.node, 'carousel-dragging');
        }

        for (const item of this.#items) {
            this.#resetStyles(item);
        }

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

        clearTimeout(this.#timer);
        this.#timer = null;

        this.#items = null;

        super.dispose();
    }

    /**
     * Shows the next carousel item.
     */
    next() {
        this.slide();
    }

    /**
     * Stops automatic carousel cycling.
     */
    pause() {
        clearTimeout(this.#timer);
        this.#timer = null;
        this.#paused = true;
    }

    /**
     * Shows the previous carousel item.
     */
    prev() {
        this.slide(-1);
    }

    /**
     * Shows a carousel item by index.
     * @param {number|string} index The item index to show.
     */
    show(index) {
        this.#show(index);
    }

    /**
     * Moves by a relative number of carousel items.
     * @param {number} [direction=1] The relative item offset.
     */
    slide(direction = 1) {
        this.show(this.#index + direction);
    }

    /**
     * Attaches carousel interaction handlers.
     */
    #events() {
        if (this.options.keyboard) {
            const previousKey = this.#rtl ? 'ArrowRight' : 'ArrowLeft';

            $.addEvent(this.node, 'keydown.ui.carousel', (e) => {
                const target = e.target;
                if ($.is(target, 'input, select')) {
                    return;
                }

                if (!['ArrowLeft', 'ArrowRight'].includes(e.code)) {
                    return;
                }

                e.preventDefault();

                if (e.code === previousKey) {
                    this.prev();
                } else {
                    this.next();
                }
            });
        }

        if (this.options.pause) {
            $.addEvent(this.node, 'mouseenter.ui.carousel', (_) => {
                this.#mousePaused = true;
                this.pause();
            });

            $.addEvent(this.node, 'mouseleave.ui.carousel', (_) => {
                this.#mousePaused = false;
                this.#paused = false;

                if (!this.#sliding) {
                    this.#setTimer();
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
                    this.#sliding ||
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
                this.#sliding = true;
                $.addClass(this.node, 'carousel-dragging');

                const pos = getPosition(e);
                startX = pos.x;
                index = null;
                progress = 0;
                direction = null;
            };

            const moveEvent = (e) => {
                if (!this.node) {
                    return;
                }

                const pos = getPosition(e);
                const currentX = pos.x;
                const width = $.width(this.node);
                const scrollX = width / 2;

                let inlineDiffX = currentX - startX;
                if (this.#rtl) {
                    inlineDiffX *= -1;
                }

                if (!this.options.wrap) {
                    inlineDiffX = $._clamp(
                        inlineDiffX,
                        -(this.#items.length - 1 - this.#index) * scrollX,
                        this.#index * scrollX,
                    );
                }

                progress = $._map(Math.abs(inlineDiffX), 0, scrollX, 0, 1);

                do {
                    const lastIndex = index;

                    if (inlineDiffX < 0) {
                        index = this.#index + 1;
                    } else if (inlineDiffX > 0) {
                        index = this.#index - 1;
                    } else {
                        this.#resetStyles(this.#items[this.#index]);

                        if (lastIndex !== null) {
                            this.#resetStyles(this.#items[lastIndex]);
                        }

                        index = this.#index;
                        return;
                    }

                    const offset = getDirOffset(index, this.#items.length);
                    index = getIndex(index, this.#items.length);
                    direction = getDirection(offset, this.#index, index);

                    if (progress >= 1) {
                        startX = currentX;

                        const oldIndex = this.#setIndex(index);
                        this.#update(this.#items[this.#index], this.#items[oldIndex], progress, { direction });
                        this.#updateIndicators();

                        if (lastIndex !== null && lastIndex !== this.#index) {
                            this.#resetStyles(this.#items[lastIndex]);
                        }

                        progress--;
                    } else {
                        this.#update(this.#items[index], this.#items[this.#index], progress, { direction, dragging: true });

                        if (lastIndex !== null && lastIndex !== index) {
                            this.#resetStyles(this.#items[lastIndex]);
                        }
                    }
                } while (progress > 1);
            };

            const upEvent = (_) => {
                if (!this.node) {
                    return;
                }

                if (index === null || index === this.#index) {
                    $.removeClass(this.node, 'carousel-dragging');
                    this.#paused = false;
                    this.#sliding = false;
                    this.#setTimer();
                    return;
                }

                const completed = progress > .25;
                let oldIndex;
                if (completed) {
                    oldIndex = this.#setIndex(index);
                } else {
                    oldIndex = index;
                }

                const nodeIn = this.#items[this.#index];
                const nodeOut = this.#items[oldIndex];
                const { enter, exit } = getTransitionClasses(direction);
                const transitionClass = completed ? exit : enter;
                const progressRemaining = completed ? 1 - progress : progress;

                index = null;

                $.addClass(nodeOut, transitionClass);

                // Shorten the transition to match the distance left after dragging.
                $.setStyle(this.node, { '--ui-carousel-transition-scale': progressRemaining });
                $.removeClass(this.node, 'carousel-dragging');

                // Commit the dragged position with transitions enabled before removing it.
                $.css(nodeIn, 'transform');
                $.setStyle([nodeIn, nodeOut], { transform: '' });

                Promise.all([
                    waitForTransition(nodeIn, ['transform'], {
                        carousel: this.node,
                        index: this.#index,
                        nodeOut,
                        transitionClass,
                    }),
                    waitForTransition(nodeOut, ['transform']),
                ]).then(([{
                    carousel,
                    index,
                    node: nodeIn,
                    transitionClass,
                }, {
                    node: nodeOut,
                }]) => {
                    this.#sliding = false;

                    $.removeClass(nodeOut, transitionClass);
                    this.#resetStyles(nodeIn);
                    this.#resetStyles(nodeOut);
                    this.#updateIndicators(carousel, index);

                    if (this.node) {
                        this.#paused = false;
                        this.#setTimer();

                        $.setStyle(this.node, { '--ui-carousel-transition-scale': '' });
                    }
                });
            };

            const dragEvent = $.mouseDragFactory(downEvent, moveEvent, upEvent);

            $.addEvent(this.node, 'mousedown.ui.carousel touchstart.ui.carousel', dragEvent);
        }
    }

    /**
     * Resets the transition styles of an item.
     * @param {HTMLElement} node The carousel item.
     */
    #resetStyles(node) {
        $.setStyle(node, {
            display: '',
            transform: '',
        });
    }

    /**
     * Sets the active item index and updates item state.
     * @param {number} index The new item index.
     * @returns {number} The old item index.
     */
    #setIndex(index) {
        const oldIndex = this.#index;
        this.#index = index;

        $.addClass(this.#items[this.#index], 'active');
        $.removeClass(this.#items[oldIndex], 'active');

        return oldIndex;
    }

    /**
     * Schedules the next automatic cycle.
     */
    #setTimer() {
        if (this.#timer || this.#paused || this.#mousePaused) {
            return;
        }

        const interval = $.getDataset(this.#items[this.#index], 'uiInterval');

        this.#timer = setTimeout(
            (_) => {
                this.#timer = null;
                this.cycle();
            },
            interval || this.options.interval,
        );
    }

    /**
     * Starts a transition to a carousel item.
     * @param {number|string} index The item index to show.
     */
    #show(index) {
        if (this.#sliding) {
            return;
        }

        index = parseInt(index);

        if (!this.options.wrap &&
            (
                index < 0 ||
                index > this.#items.length - 1
            )
        ) {
            return;
        }

        const offset = getDirOffset(index, this.#items.length);
        index = getIndex(index, this.#items.length);

        if (index === this.#index) {
            return;
        }

        const direction = getDirection(offset, this.#index, index);

        const eventData = {
            direction: getPhysicalDirection(direction, this.#rtl),
            relatedTarget: this.#items[index],
            from: this.#index,
            to: index,
        };

        if (!$.triggerOne(this.node, 'slide.ui.carousel', { data: eventData })) {
            return;
        }

        this.#sliding = true;
        this.pause();

        const nodeIn = this.#items[index];
        const nodeOut = this.#items[this.#index];
        const { enter, exit } = getTransitionClasses(direction);

        $.addClass(nodeIn, enter);

        // Commit the incoming item's initial position before starting the transition.
        $.css(nodeIn, 'transform');

        this.#setIndex(index);

        $.addClass(nodeOut, exit);
        $.removeClass(nodeIn, enter);

        Promise.all([
            waitForTransition(nodeIn, ['transform'], {
                carousel: this.node,
                index: this.#index,
                transitionClass: exit,
            }),
            waitForTransition(nodeOut, ['transform']),
        ]).then(([{
            carousel,
            index,
            node: nodeIn,
            transitionClass,
        }, {
            node: nodeOut,
        }]) => {
            this.#sliding = false;

            $.removeClass(nodeOut, transitionClass);
            this.#resetStyles(nodeIn);
            this.#resetStyles(nodeOut);
            this.#updateIndicators(carousel, index);

            if (this.node) {
                this.#paused = false;
                this.#setTimer();
            }

            $.triggerEvent(carousel, 'slid.ui.carousel', { data: eventData });
        });
    }

    /**
     * Updates carousel item positions for a transition frame.
     * @param {HTMLElement} nodeIn The incoming item.
     * @param {HTMLElement} nodeOut The outgoing item.
     * @param {number} progress The transition progress.
     * @param {CarouselUpdateOptions} [options] The update options.
     */
    #update(nodeIn, nodeOut, progress, { direction, dragging = false } = {}) {
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
            const physicalDirection = getPhysicalDirection(direction, this.#rtl);
            const inverse = physicalDirection === 'right';

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
     * Updates the active carousel indicator.
     * @param {HTMLElement} [carousel] The carousel node.
     * @param {number} [index] The active item index.
     */
    #updateIndicators(carousel = this.node, index = this.#index) {
        const oldIndicator = $.find('.active[data-ui-slide-to]', carousel);
        const newIndicator = $.find('[data-ui-slide-to="' + index + '"]', carousel);
        $.removeClass(oldIndicator, 'active');
        $.addClass(newIndicator, 'active');
    }
}
