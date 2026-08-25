(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@fr0st/query')) :
    typeof define === 'function' && define.amd ? define(['exports', '@fr0st/query'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.UI = {}, global.fQuery));
})(this, (function (exports, fQuery) { 'use strict';

    let $;

    if (fQuery !== fQuery.query) {
        $ = fQuery(globalThis);
    } else {
        $ = fQuery;
    }

    if (!('fQuery' in globalThis)) {
        globalThis.fQuery = $;
    }

    const document = $.getContext();
    const window = $.getWindow();

    /**
     * Generates a unique component element ID.
     * @param {string} prefix The ID prefix.
     * @returns {string} The unique ID.
     */
    function generateId(prefix) {
        while (true) {
            const id = `${prefix}${$._randomString(5)}`;

            if ($.findOneById(id)) {
                continue;
            }

            return id;
        }
    }
    /**
     * Gets normalized UI data attributes from an element.
     * @param {HTMLElement} node The input node.
     * @returns {Record<string, *>} The normalized data.
     */
    function getDataset(node) {
        const dataset = $.getDataset(node);

        return Object.fromEntries(
            Object.entries(dataset)
                .map(([key, value]) => [key.slice(2, 3).toLowerCase() + key.slice(3), value]),
        );
    }
    /**
     * Registers a UI component and its QuerySet method.
     * @param {string} key The component key.
     * @param {typeof import('../base-component.js').default} component The component class.
     */
    function initComponent(key, component) {
        component.DATA_KEY = key;
        component.REMOVE_EVENT = `remove.ui.${key}`;

        Object.defineProperty($.QuerySet.prototype, key, {
            configurable: true,
            enumerable: false,
            value(a, ...args) {
                let settings; let method; let firstResult;

                if ($._isObject(a)) {
                    settings = a;
                } else if ($._isString(a)) {
                    method = a;
                }

                for (const [index, node] of this.get().entries()) {
                    if (!$._isElement(node)) {
                        continue;
                    }

                    let result = component.init(node, settings);

                    if (method) {
                        result = result[method](...args);
                    }

                    if (index === 0) {
                        firstResult = result;
                    }
                }

                return firstResult;
            },
            writable: true,
        });
    }

    /**
     * Resolves a target element from a control.
     * @param {HTMLElement} node The input node.
     * @param {string} [closestSelector] The fallback closest selector.
     * @returns {HTMLElement} The target node.
     * @throws {Error} If no target can be resolved.
     */
    function getTarget(node, closestSelector) {
        const selector = getTargetSelector(node);

        let target;

        if (selector && selector !== '#') {
            target = $.findOne(selector);
        } else if (closestSelector) {
            target = $.closest(node, closestSelector).shift();
        }

        if (!target) {
            throw new Error('Target not found');
        }

        return target;
    }
    /**
     * Gets the target selector declared by a control.
     * @param {HTMLElement} node The input node.
     * @returns {string|null} The target selector, or `null` if none is declared.
     */
    function getTargetSelector(node) {
        return $.getDataset(node, 'uiTarget') || $.getAttribute(node, 'href');
    }

    /** @typedef {Record<string, *>} ComponentOptions */

    /**
     * Provides shared initialization, option handling, and disposal for UI components.
     * @template {ComponentOptions} [Options=ComponentOptions]
     */
    class BaseComponent {
        #node;
        #options;

        /**
         * Initializes a BaseComponent.
         * @param {HTMLElement} node The input node.
         * @param {...*} args The constructor arguments.
         * @returns {BaseComponent} The existing or newly created component.
         */
        static init(node, ...args) {
            return $.hasData(node, this.DATA_KEY) ?
                $.getData(node, this.DATA_KEY) :
                new this(node, ...args);
        }

        /**
         * Creates a BaseComponent.
         * @param {HTMLElement} node The input node.
         * @param {Options} [options] The component options.
         */
        constructor(node, options) {
            this.#node = node;

            this.#options = Object.freeze($._extend(
                {},
                this.constructor.defaults,
                getDataset(this.#node),
                options,
            ));

            $.addEvent(this.#node, this.constructor.REMOVE_EVENT, (_) => {
                this.dispose();
            });

            $.setData(this.#node, { [this.constructor.DATA_KEY]: this });
        }

        /**
         * Gets the component node.
         * @returns {HTMLElement|null} The component node, or `null` after disposal.
         */
        get node() {
            return this.#node;
        }

        /**
         * Gets the component options.
         * @returns {Readonly<Options>|null} The component options, or `null` after disposal.
         */
        get options() {
            return this.#options;
        }

        /**
         * Releases the resources owned by the component.
         */
        dispose() {
            $.removeEvent(this.#node, this.constructor.REMOVE_EVENT);
            $.removeData(this.#node, this.constructor.DATA_KEY);
            this.#node = null;
            this.#options = null;
        }
    }

    /**
     * @typedef {object} AlertOptions
     * @property {number} [duration=100] The transition duration in milliseconds.
     */

    /**
     * Controls a dismissible alert element.
     * @extends {BaseComponent<AlertOptions>}
     */
    class Alert extends BaseComponent {
        /**
         * Closes the alert.
         */
        close() {
            if (
                $.getDataset(this.node, 'uiAnimating') ||
                !$.triggerOne(this.node, 'close.ui.alert')
            ) {
                return;
            }

            $.setDataset(this.node, { uiAnimating: 'out' });

            $.fadeOut(this.node, {
                duration: this.options.duration,
            }).then((_) => {
                $.detach(this.node);
                $.removeDataset(this.node, 'uiAnimating');
                $.triggerEvent(this.node, 'closed.ui.alert');
                $.remove(this.node);
            }).catch((_) => {
                if ($.getDataset(this.node, 'uiAnimating') === 'out') {
                    $.removeDataset(this.node, 'uiAnimating');
                }
            });
        }
    }

    /** @type {import('./alert.js').AlertOptions} */
    Alert.defaults = {
        duration: 100,
    };

    initComponent('alert', Alert);

    // Dismiss the alert targeted by a dismiss control.
    $.addEventDelegate(document, 'click.ui.alert', '[data-ui-dismiss="alert"]', (e) => {
        e.preventDefault();

        const target = getTarget(e.currentTarget, '.alert');
        const alert = Alert.init(target);
        alert.close();
    });

    /**
     * Controls the pressed state of a toggle button.
     */
    class Button extends BaseComponent {
        /**
         * Toggles the button state.
         */
        toggle() {
            $.toggleClass(this.node, 'active');

            const active = $.hasClass(this.node, 'active');
            $.setAttribute(this.node, { 'aria-pressed': active });
        }
    }

    initComponent('button', Button);

    // Toggle a button from pointer or Space-key activation.
    $.addEventDelegate(document, 'click.ui.button keydown.ui.button', '[data-ui-toggle="button"]', (e) => {
        if (e.code && e.code !== 'Space') {
            return;
        }

        e.preventDefault();

        const button = Button.init(e.currentTarget);
        button.toggle();
    });

    /**
     * @typedef {object} Coordinates
     * @property {number} x The X coordinate.
     * @property {number} y The Y coordinate.
     */

    /**
     * Gets page coordinates from a mouse or touch event.
     * @param {MouseEvent|TouchEvent} e The input event.
     * @returns {Coordinates} The page coordinates.
     */
    function getPosition(e) {
        if ('touches' in e && e.touches.length) {
            return {
                x: e.touches[0].pageX,
                y: e.touches[0].pageY,
            };
        }

        return {
            x: e.pageX,
            y: e.pageY,
        };
    }
    /**
     * Gets page coordinates for every active touch.
     * @param {TouchEvent} e The touch event.
     * @returns {Coordinates[]} The active touch coordinates.
     */
    function getTouchPositions(e) {
        return Array.from(e.touches)
            .map((touch) => ({ x: touch.pageX, y: touch.pageY }));
    }

    /** @typedef {import('../popper/popper.js').Direction} Direction */

    /**
     * Gets the boundary offset for an item index.
     * @param {number} index The index.
     * @param {number} totalItems The total number of items.
     * @returns {-1|0|1} The boundary offset.
     */
    function getDirOffset(index, totalItems) {
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
     * @returns {Direction} The transition direction.
     */
    function getDirection$1(offset, oldIndex, newIndex) {
        if (offset == -1 || (offset == 0 && newIndex < oldIndex)) {
            return 'left';
        }

        return 'right';
    }
    /**
     * Normalizes an item index to the available range.
     * @param {number} index The item index.
     * @param {number} totalItems The total number of items.
     * @returns {number} The normalized item index.
     */
    function getIndex(index, totalItems) {
        index %= totalItems;

        if (index < 0) {
            return totalItems + index;
        }

        return index;
    }

    /** @typedef {import('../popper/popper.js').Direction} Direction */

    /**
     * @typedef {object} CarouselOptions
     * @property {number} [interval=5000] The cycle interval in milliseconds.
     * @property {number} [transition=500] The transition duration in milliseconds.
     * @property {boolean} [keyboard=true] Whether to support keyboard navigation.
     * @property {false|'carousel'} [ride=false] Whether to cycle automatically.
     * @property {boolean} [pause=true] Whether to pause while hovered.
     * @property {boolean} [wrap=true] Whether navigation wraps at either end.
     * @property {boolean} [swipe=true] Whether to support pointer and touch swiping.
     */

    /**
     * @typedef {object} CarouselUpdateOptions
     * @property {Direction} [direction] The transition direction.
     * @property {boolean} [dragging=false] Whether the position is being updated by a drag.
     */

    /**
     * Controls an animated carousel.
     * @extends {BaseComponent<CarouselOptions>}
     */
    class Carousel extends BaseComponent {
        #index;
        #items;
        #mousePaused;
        #paused;
        #timer;

        /**
         * Creates a Carousel.
         * @param {HTMLElement} node The input node.
         * @param {CarouselOptions} [options] The carousel options.
         */
        constructor(node, options) {
            super(node, options);

            this.#items = $.find('.carousel-item', this.node);

            this.#index = this.#items.findIndex((item) =>
                $.hasClass(item, 'active'),
            );

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
            clearTimeout(this.#timer);
            this.#timer = null;

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
                    this.#mousePaused = true;
                    this.pause();
                });

                $.addEvent(this.node, 'mouseleave.ui.carousel', (_) => {
                    this.#mousePaused = false;
                    this.#paused = false;

                    if (!$.getDataset(this.node, 'uiSliding')) {
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
                            -(this.#items.length - 1 - this.#index) * scrollX,
                            this.#index * scrollX,
                        );
                    }

                    progress = $._map(Math.abs(mouseDiffX), 0, scrollX, 0, 1);

                    do {
                        const lastIndex = index;

                        if (mouseDiffX < 0) {
                            index = this.#index + 1;
                        } else if (mouseDiffX > 0) {
                            index = this.#index - 1;
                        } else {
                            index = this.#index;
                            return;
                        }

                        const offset = getDirOffset(index, this.#items.length);
                        index = getIndex(index, this.#items.length);
                        direction = getDirection$1(offset, this.#index, index);

                        if (progress >= 1) {
                            startX = currentX;

                            const oldIndex = this.#setIndex(index);
                            this.#update(this.#items[this.#index], this.#items[oldIndex], progress, { direction });
                            this.#updateIndicators();

                            if (lastIndex !== this.#index) {
                                this.#resetStyles(lastIndex);
                            }

                            progress--;
                        } else {
                            this.#update(this.#items[index], this.#items[this.#index], progress, { direction, dragging: true });

                            if (lastIndex !== index) {
                                this.#resetStyles(lastIndex);
                            }
                        }
                    } while (progress > 1);
                };

                const upEvent = (_) => {
                    if (index === null || index === this.#index) {
                        this.#paused = false;
                        $.removeDataset(this.node, 'uiSliding');
                        this.#setTimer();
                        return;
                    }

                    let oldIndex;
                    let progressRemaining;
                    if (progress > .25) {
                        oldIndex = this.#setIndex(index);
                        progressRemaining = 1 - progress;
                    } else {
                        oldIndex = index;
                        progressRemaining = progress;
                        direction = direction === 'right' ? 'left' : 'right';
                    }

                    this.#resetStyles(this.#index);

                    index = null;

                    $.animate(
                        this.#items[this.#index],
                        (node, newProgress) => {
                            if (!this.#items) {
                                return;
                            }

                            if (progress > .25) {
                                this.#update(node, this.#items[oldIndex], progress + (newProgress * progressRemaining), { direction });
                            } else {
                                this.#update(node, this.#items[oldIndex], (1 - progress) + (newProgress * progressRemaining), { direction });
                            }
                        },
                        {
                            duration: this.options.transition * progressRemaining,
                        },
                    ).then((_) => {
                        this.#updateIndicators();
                        $.removeDataset(this.node, 'uiSliding');

                        this.#paused = false;
                        this.#setTimer();
                    }).catch((_) => {
                        $.removeDataset(this.node, 'uiSliding');
                    });
                };

                const dragEvent = $.mouseDragFactory(downEvent, moveEvent, upEvent);

                $.addEvent(this.node, 'mousedown.ui.carousel touchstart.ui.carousel', dragEvent);
            }
        }

        /**
         * Resets the transition styles of an item.
         * @param {number} index The item index.
         */
        #resetStyles(index) {
            $.setStyle(this.#items[index], {
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
            if ($.getDataset(this.node, 'uiSliding')) {
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

            const direction = getDirection$1(offset, this.#index, index);

            const eventData = {
                direction,
                relatedTarget: this.#items[index],
                from: this.#index,
                to: index,
            };

            if (!$.triggerOne(this.node, 'slide.ui.carousel', { data: eventData })) {
                return;
            }

            $.setDataset(this.node, { uiSliding: true });
            this.pause();

            const oldIndex = this.#setIndex(index);

            $.animate(
                this.#items[this.#index],
                (node, progress) => {
                    if (!this.#items) {
                        return;
                    }

                    this.#update(node, this.#items[oldIndex], progress, { direction });
                },
                {
                    duration: this.options.transition,
                },
            ).then((_) => {
                this.#updateIndicators();
                $.removeDataset(this.node, 'uiSliding');
                $.triggerEvent(this.node, 'slid.ui.carousel', { data: eventData });

                this.#paused = false;
                this.#setTimer();
            }).catch((_) => {
                $.removeDataset(this.node, 'uiSliding');
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
         * Updates the active carousel indicator.
         */
        #updateIndicators() {
            const oldIndicator = $.find('.active[data-ui-slide-to]', this.node);
            const newIndicator = $.find('[data-ui-slide-to="' + this.#index + '"]', this.node);
            $.removeClass(oldIndicator, 'active');
            $.addClass(newIndicator, 'active');
        }
    }

    /** @type {import('./carousel.js').CarouselOptions} */
    Carousel.defaults = {
        interval: 5000,
        transition: 500,
        keyboard: true,
        ride: false,
        pause: true,
        wrap: true,
        swipe: true,
    };

    initComponent('carousel', Carousel);

    // Start ride-enabled carousels when the DOM is ready.
    $((_) => {
        const nodes = $.find('[data-ui-ride="carousel"]');

        for (const node of nodes) {
            Carousel.init(node);
        }
    });

    // Move a carousel to its previous or next item.
    $.addEventDelegate(document, 'click.ui.carousel', '[data-ui-slide]', (e) => {
        e.preventDefault();

        const target = getTarget(e.currentTarget, '.carousel');
        const carousel = Carousel.init(target);
        const slide = $.getDataset(e.currentTarget, 'uiSlide');

        if (slide === 'prev') {
            carousel.prev();
        } else {
            carousel.next();
        }
    });

    // Move a carousel directly to the requested item.
    $.addEventDelegate(document, 'click.ui.carousel', '[data-ui-slide-to]', (e) => {
        e.preventDefault();

        const target = getTarget(e.currentTarget, '.carousel');
        const carousel = Carousel.init(target);
        const slideTo = $.getDataset(e.currentTarget, 'uiSlideTo');

        carousel.show(slideTo);
    });

    /** @type {EventTarget|null|undefined} */
    let clickTarget;

    // Preserve the press target for click handlers that run after mouseup.
    $.addEvent(window, 'mousedown.ui', (e) => {
        clickTarget = e.target;
    }, { capture: true });

    // Clear the press target after the subsequent click has been dispatched.
    $.addEvent(window, 'mouseup.ui', (_) => {
        setTimeout((_) => {
            clickTarget = null;
        }, 0);
    }, { capture: true });

    /**
     * Gets the original press target for a click event.
     * @param {MouseEvent} e The click event.
     * @returns {EventTarget|null} The original press target, or the click target as a fallback.
     */
    function getClickTarget(e) {
        return clickTarget || e.target;
    }

    /** @typedef {import('../popper/popper.js').Direction} Direction */

    /**
     * @typedef {object} CollapseOptions
     * @property {Direction} [direction='bottom'] The collapse direction.
     * @property {number} [duration=250] The transition duration in milliseconds.
     * @property {string|null} [parent=null] The selector for an accordion parent.
     */

    /**
     * Controls a collapsible element and its triggers.
     * @extends {BaseComponent<CollapseOptions>}
     */
    class Collapse extends BaseComponent {
        #parent;
        #triggers;

        /**
         * Creates a Collapse.
         * @param {HTMLElement} node The input node.
         * @param {CollapseOptions} [options] The collapse options.
         */
        constructor(node, options) {
            super(node, options);

            this.#triggers = $.find('[data-ui-toggle="collapse"]')
                .filter((trigger) => {
                    const selector = getTargetSelector(trigger);
                    return selector && $.is(this.node, selector);
                });

            if (this.options.parent) {
                this.#parent = $.closest(this.node, this.options.parent).shift();
            }
        }

        /** @inheritdoc */
        dispose() {
            this.#triggers = null;
            this.#parent = null;

            super.dispose();
        }

        /**
         * Hides the collapsible element.
         */
        hide() {
            if (
                $.getDataset(this.node, 'uiAnimating') ||
                !$.hasClass(this.node, 'show') ||
                !$.triggerOne(this.node, 'hide.ui.collapse')
            ) {
                return;
            }

            $.setDataset(this.node, { uiAnimating: 'out' });
            $.addClass(this.#triggers, 'collapsed');
            $.addClass(this.#triggers, 'collapsing');

            $.squeezeOut(this.node, {
                direction: this.options.direction,
                duration: this.options.duration,
            }).then((_) => {
                $.removeClass(this.node, 'show');
                $.removeClass(this.#triggers, 'collapsing');
                $.setAttribute(this.#triggers, { 'aria-expanded': false });
                $.removeDataset(this.node, 'uiAnimating');
                $.triggerEvent(this.node, 'hidden.ui.collapse');
            }).catch((_) => {
                if ($.getDataset(this.node, 'uiAnimating') === 'out') {
                    $.removeDataset(this.node, 'uiAnimating');
                }
            });
        }

        /**
         * Shows the collapsible element.
         */
        show() {
            if (
                $.getDataset(this.node, 'uiAnimating') ||
                $.hasClass(this.node, 'show')
            ) {
                return;
            }

            const collapses = [];
            if (this.#parent) {
                const siblings = $.find('.collapse.show', this.#parent);

                for (const sibling of siblings) {
                    const collapse = this.constructor.init(sibling);

                    if (!$.isSame(this.#parent, collapse.#parent)) {
                        continue;
                    }

                    collapses.push(collapse);
                }
            }

            if (!$.triggerOne(this.node, 'show.ui.collapse')) {
                return;
            }

            for (const collapse of collapses) {
                collapse.hide();
            }

            $.setDataset(this.node, { uiAnimating: 'in' });
            $.addClass(this.node, 'show');
            $.removeClass(this.#triggers, 'collapsed');
            $.addClass(this.#triggers, 'collapsing');

            $.squeezeIn(this.node, {
                direction: this.options.direction,
                duration: this.options.duration,
            }).then((_) => {
                $.removeClass(this.#triggers, 'collapsing');
                $.setAttribute(this.#triggers, { 'aria-expanded': true });
                $.removeDataset(this.node, 'uiAnimating');
                $.triggerEvent(this.node, 'shown.ui.collapse');
            }).catch((_) => {
                if ($.getDataset(this.node, 'uiAnimating') === 'in') {
                    $.removeDataset(this.node, 'uiAnimating');
                }
            });
        }

        /**
         * Toggles the collapsible element.
         */
        toggle() {
            if ($.hasClass(this.node, 'show')) {
                this.hide();
            } else {
                this.show();
            }
        }
    }

    /** @type {import('./collapse.js').CollapseOptions} */
    Collapse.defaults = {
        direction: 'bottom',
        duration: 250,
    };

    initComponent('collapse', Collapse);

    // Keep every collapse matched by a control in the same visible state.
    $.addEventDelegate(document, 'click.ui.collapse', '[data-ui-toggle="collapse"]', (e) => {
        e.preventDefault();

        const selector = getTargetSelector(e.currentTarget);
        const targets = $.find(selector);
        const collapses = targets.map((target) => Collapse.init(target));
        const show = !collapses.some((collapse) => $.hasClass(collapse.node, 'show'));

        for (const collapse of collapses) {
            if (show) {
                collapse.show();
            } else {
                collapse.hide();
            }
        }
    });

    /** @typedef {'x'|'y'} Axis */

    /**
     * @typedef {object} BoundingRect
     * @property {number} x The horizontal offset.
     * @property {number} y The vertical offset.
     * @property {number} width The width.
     * @property {number} height The height.
     * @property {number} top The top edge.
     * @property {number} right The right edge.
     * @property {number} bottom The bottom edge.
     * @property {number} left The left edge.
     */

    /** @type {number|undefined} */
    let scrollbarSize;

    /**
     * Adds scrollbar compensation to a collection of elements.
     * @param {Iterable<HTMLElement>} nodes The elements to update.
     */
    function addScrollPadding(nodes) {
        const scrollSizeY = getScrollbarSize(window, document, 'y');

        if (!scrollSizeY) {
            return;
        }

        for (const node of nodes) {
            $.setDataset(node, {
                uiPaddingRight: $.getStyle(node, 'paddingRight'),
            });
            $.setStyle(node, {
                paddingRight: `${scrollSizeY + parseInt($.css(node, 'paddingRight'))}px`,
            });
        }
    }
    /**
     * Calculates the browser scrollbar size.
     * @returns {number} The scrollbar size.
     */
    function calculateScrollbarSize() {
        if (scrollbarSize) {
            return scrollbarSize;
        }

        const div = $.create('div', {
            style: {
                width: '100px',
                height: '100px',
                overflow: 'scroll',
                position: 'absolute',
                top: '-9999px',
            },
        });
        $.append(document.body, div);

        scrollbarSize = $.getProperty(div, 'offsetWidth') - $.width(div);

        $.detach(div);

        return scrollbarSize;
    }
    /**
     * Gets the scrollbar size for an element and axis.
     * @param {HTMLElement|Window} [node=window] The viewport element or window.
     * @param {HTMLElement|Document} [scrollNode=document] The scrolling element or document.
     * @param {Axis} [axis='y'] The axis to measure.
     * @returns {number} The scrollbar size.
     */
    function getScrollbarSize(node = window, scrollNode = document, axis) {
        const method = axis === 'x' ? 'width' : 'height';
        const size = $[method](node);
        const scrollSize = $[method](scrollNode, { boxSize: $.SCROLL_BOX });

        if (scrollSize > size) {
            return calculateScrollbarSize();
        }

        return 0;
    }
    /**
     * Gets the visible bounding rectangle of an element or window, excluding scrollbars.
     * @param {HTMLElement|Window} node The viewport element or window.
     * @param {HTMLElement|Document} scrollNode The scrolling element or document.
     * @returns {BoundingRect} The visible bounding rectangle.
     */
    function getScrollContainer(node, scrollNode) {
        const isWindow = $._isWindow(node);
        const rect = isWindow ?
            getWindowContainer(node) :
            $.rect(node, { offset: true });

        const scrollSizeX = getScrollbarSize(node, scrollNode, 'x');
        const scrollSizeY = getScrollbarSize(node, scrollNode, 'y');

        if (scrollSizeX) {
            rect.height -= scrollSizeX;

            if (isWindow) {
                rect.bottom -= scrollSizeX;
            }
        }

        if (scrollSizeY) {
            rect.width -= scrollSizeY;

            if (isWindow) {
                rect.right -= scrollSizeY;
            }
        }

        return rect;
    }
    /**
     * Calculates the bounding rectangle of a window.
     * @param {Window} node The window object.
     * @returns {BoundingRect} The window bounding rectangle.
     */
    function getWindowContainer(node) {
        const scrollX = $.getScrollX(node);
        const scrollY = $.getScrollY(node);
        const width = $.width(node);
        const height = $.height(node);

        return {
            x: scrollX,
            y: scrollY,
            width,
            height,
            top: scrollY,
            right: scrollX + width,
            bottom: scrollY + height,
            left: scrollX,
        };
    }
    /**
     * Restores scrollbar compensation on a collection of elements.
     * @param {Iterable<HTMLElement>} nodes The elements to restore.
     */
    function resetScrollPadding(nodes) {
        for (const node of nodes) {
            $.setStyle(node, {
                paddingRight: $.getDataset(node, 'uiPaddingRight'),
            });
            $.removeDataset(node, 'uiPaddingRight');
        }
    }

    /** @typedef {import('./popper.js').default} Popper */
    /** @typedef {import('../helpers/scroll.js').BoundingRect} BoundingRect */
    /** @typedef {import('./popper.js').Direction} Direction */
    /** @typedef {import('./popper.js').Placement} Placement */

    const poppers = new Set();

    let running$1 = false;

    /**
     * Registers a popper for viewport and ancestor-scroll updates.
     * @param {Popper} popper The popper to register.
     */
    function addPopper(popper) {
        poppers.add(popper);

        if (running$1) {
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

        running$1 = true;
    }
    /**
     * Resolves the best available popper placement.
     * @param {DOMRect} nodeBox The computed bounding rectangle of the node.
     * @param {DOMRect} referenceBox The computed bounding rectangle of the reference.
     * @param {BoundingRect} minimumBox The available positioning boundary.
     * @param {Placement} placement The preferred placement.
     * @param {number} spacing The amount of spacing to use.
     * @returns {Direction} The resolved placement.
     */
    function getPopperPlacement(nodeBox, referenceBox, minimumBox, placement, spacing) {
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
    }
    /**
     * Unregisters a popper and removes shared listeners when no poppers remain.
     * @param {Popper} popper The popper to unregister.
     */
    function removePopper(popper) {
        poppers.delete(popper);

        if (poppers.size) {
            return;
        }

        $.removeEvent(window, 'resize.ui.popper');
        $.removeEvent(document, 'scroll.ui.popper');

        running$1 = false;
    }

    /** @typedef {'top'|'right'|'bottom'|'left'} Direction */
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
     * @property {boolean} [useGpu=true] Whether to position using a transform.
     * @property {boolean} [noAttributes=false] Whether to omit placement attributes.
     */

    /**
     * Positions an element relative to a reference element.
     * @extends {BaseComponent<PopperOptions>}
     */
    class Popper extends BaseComponent {
        #placement;
        #referencePlacement;

        /**
         * Creates a Popper.
         * @param {HTMLElement} node The input node.
         * @param {PopperOptions} options The popper options.
         */
        constructor(node, options) {
            super(node, options);

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

            if (!this.options.noAttributes) {
                if (this.#referencePlacement) {
                    $.setDataset(this.options.reference, { uiPlacement: this.#referencePlacement });
                } else {
                    $.removeDataset(this.options.reference, 'uiPlacement');
                }
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
            const resetStyle = {};

            if (this.options.useGpu) {
                resetStyle.transform = '';
            } else {
                resetStyle.marginLeft = 0;
                resetStyle.marginTop = 0;
            }

            $.setStyle(this.node, resetStyle);

            if (this.options.beforeUpdate) {
                this.options.beforeUpdate(this.node, this.options.reference);
            }

            // Measure the element and its positioning boundaries.
            const nodeBox = $.rect(this.node, { offset: true });
            const referenceBox = $.rect(this.options.reference, { offset: true });
            const windowBox = getScrollContainer(window, document);

            const scrollParent = $.closest(
                this.node,
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
                );

            if (!this.options.noAttributes) {
                $.setDataset(this.options.reference, { uiPlacement: placement });
            }

            $.setDataset(this.node, { uiPlacement: placement });

            const position = this.options.position;

            // Start from the reference element offset.
            const offset = {
                x: Math.round(referenceBox.x),
                y: Math.round(referenceBox.y),
            };

            // Adjust for the nearest positioned ancestor.
            const relativeParent = $.closest(
                this.node,
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

            // Move the element onto the resolved placement edge.
            if (placement === 'top') {
                offset.y -= Math.round(nodeBox.height) + this.options.spacing;
            } else if (placement === 'right') {
                offset.x += Math.round(referenceBox.width) + this.options.spacing;
            } else if (placement === 'bottom') {
                offset.y += Math.round(referenceBox.height) + this.options.spacing;
            } else if (placement === 'left') {
                offset.x -= Math.round(nodeBox.width) + this.options.spacing;
            }

            // Align the element along the placement edge.
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

            // Compensate for element margins.
            offset.x -= parseInt($.css(this.node, 'marginLeft'));
            offset.y -= parseInt($.css(this.node, 'marginTop'));

            // Keep enough of the element in contact with its reference.
            if (['left', 'right'].includes(placement)) {
                let offsetY = offset.y;
                let refTop = referenceBox.top;

                if (relativeBox) {
                    offsetY += relativeBox.top;
                    refTop -= relativeBox.top;
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

                if (relativeBox) {
                    offsetX += relativeBox.left;
                    refLeft -= relativeBox.left;
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

            // Compensate for the scrolling ancestor.
            if (scrollParent) {
                offset.x += $.getScrollX(scrollParent);
                offset.y += $.getScrollY(scrollParent);
            }

            // Apply the final position.
            const style = {};
            if (this.options.useGpu) {
                style.transform = `translate3d(${offset.x}px , ${offset.y}px , 0)`;
            } else {
                style.marginLeft = `${offset.x}px`;
                style.marginTop = `${offset.y}px`;
            }

            $.setStyle(this.node, style);

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

            $.setStyle(this.options.arrow, arrowStyles);
        }
    }

    /** @typedef {import('../popper/popper.js').Placement} Placement */
    /** @typedef {import('../popper/popper.js').Position} Position */

    /**
     * @typedef {object} DropdownOptions
     * @property {'dynamic'|'static'} [display='dynamic'] The positioning mode.
     * @property {number} [duration=100] The transition duration in milliseconds.
     * @property {Placement} [placement='bottom'] The preferred menu placement.
     * @property {Position} [position='start'] The menu alignment.
     * @property {boolean} [fixed=false] Whether to preserve the preferred placement.
     * @property {number} [spacing=3] The spacing between the toggle and menu.
     * @property {number|false} [minContact=false] The minimum contact with the toggle.
     * @property {'parent'|string|HTMLElement|null} [reference=null] The positioning reference.
     * @property {boolean|'inside'|'outside'} [autoClose=true] Where interactions close the menu.
     */

    /**
     * Controls a dropdown menu.
     * @extends {BaseComponent<DropdownOptions>}
     */
    class Dropdown extends BaseComponent {
        #display;
        #menuNode;
        #popper;
        #referenceNode;

        /**
         * Creates a Dropdown.
         * @param {HTMLElement} node The input node.
         * @param {DropdownOptions} [options] The dropdown options.
         */
        constructor(node, options) {
            super(node, options);

            this.#display = this.options.display;
            this.#menuNode = $.next(this.node, '.dropdown-menu').shift();

            if (this.options.reference) {
                if (this.options.reference === 'parent') {
                    this.#referenceNode = $.parent(this.node).shift();
                } else {
                    this.#referenceNode = $.findOne(this.options.reference);
                }
            } else {
                this.#referenceNode = this.node;
            }

            // Navbar dropdowns use static positioning.
            if (this.#display !== 'static' && $.closest(this.node, '.navbar-nav').length) {
                this.#display = 'static';
            }
        }

        /**
         * Checks whether the dropdown menu contains a target.
         * @param {HTMLElement} target The target node.
         * @returns {boolean} Whether the target is inside the menu.
         */
        containsMenuTarget(target) {
            return $.hasDescendent(this.#menuNode, target);
        }

        /** @inheritdoc */
        dispose() {
            if (this.#popper) {
                this.#popper.dispose();
                this.#popper = null;
            }

            this.#menuNode = null;
            this.#referenceNode = null;

            super.dispose();
        }

        /**
         * Focuses the first enabled dropdown item.
         */
        focusFirstItem() {
            const focusNode = $.findOne('.dropdown-item:not([tabindex="-1"])', this.#menuNode);
            $.focus(focusNode);
        }

        /**
         * Hides the dropdown menu.
         */
        hide() {
            if (
                $.getDataset(this.#menuNode, 'uiAnimating') ||
                !$.hasClass(this.#menuNode, 'show') ||
                !$.triggerOne(this.node, 'hide.ui.dropdown')
            ) {
                return;
            }

            $.setDataset(this.#menuNode, { uiAnimating: 'out' });

            $.fadeOut(this.#menuNode, {
                duration: this.options.duration,
            }).then((_) => {
                if (this.#popper) {
                    this.#popper.dispose();
                    this.#popper = null;
                }

                $.removeClass(this.#menuNode, 'show');
                $.setAttribute(this.node, { 'aria-expanded': false });
                $.removeDataset(this.#menuNode, 'uiAnimating');
                $.triggerEvent(this.node, 'hidden.ui.dropdown');
            }).catch((_) => {
                if ($.getDataset(this.#menuNode, 'uiAnimating') === 'out') {
                    $.removeDataset(this.#menuNode, 'uiAnimating');
                }
            });
        }

        /**
         * Checks whether an interaction target should close the dropdown.
         * @param {HTMLElement} target The target node.
         * @returns {boolean} Whether the dropdown should close.
         */
        shouldClose(target) {
            const hasDescendent = this.containsMenuTarget(target);
            const autoClose = this.options.autoClose;

            return !(
                $.isSame(this.node, target) ||
                (
                    hasDescendent &&
                    (
                        $.is(target, 'form, input, textarea, select, option') ||
                        autoClose === 'outside' ||
                        autoClose === false
                    )
                ) ||
                (
                    !hasDescendent &&
                    !$.isSame(this.#menuNode, target) &&
                    (
                        autoClose === 'inside' ||
                        autoClose === false
                    )
                )
            );
        }

        /**
         * Shows the dropdown menu.
         */
        show() {
            if (
                $.getDataset(this.#menuNode, 'uiAnimating') ||
                $.hasClass(this.#menuNode, 'show') ||
                !$.triggerOne(this.node, 'show.ui.dropdown')
            ) {
                return;
            }

            $.setDataset(this.#menuNode, { uiAnimating: 'in' });
            $.addClass(this.#menuNode, 'show');

            if (this.#display === 'dynamic') {
                this.#popper = new Popper(this.#menuNode, {
                    reference: this.#referenceNode,
                    placement: this.options.placement,
                    position: this.options.position,
                    fixed: this.options.fixed,
                    spacing: this.options.spacing,
                    minContact: this.options.minContact,
                });
            }

            window.requestAnimationFrame((_) => {
                this.update();
            });

            $.fadeIn(this.#menuNode, {
                duration: this.options.duration,
            }).then((_) => {
                $.setAttribute(this.node, { 'aria-expanded': true });
                $.removeDataset(this.#menuNode, 'uiAnimating');
                $.triggerEvent(this.node, 'shown.ui.dropdown');
            }).catch((_) => {
                if ($.getDataset(this.#menuNode, 'uiAnimating') === 'in') {
                    $.removeDataset(this.#menuNode, 'uiAnimating');
                }
            });
        }

        /**
         * Toggles the dropdown menu.
         */
        toggle() {
            if ($.hasClass(this.#menuNode, 'show')) {
                this.hide();
            } else {
                this.show();
            }
        }

        /**
         * Updates the dropdown position.
         */
        update() {
            if (this.#popper) {
                this.#popper.update();
            }
        }
    }

    /** @type {import('./dropdown.js').DropdownOptions} */
    Dropdown.defaults = {
        display: 'dynamic',
        duration: 100,
        placement: 'bottom',
        position: 'start',
        fixed: false,
        spacing: 3,
        minContact: false,
    };

    initComponent('dropdown', Dropdown);

    // Toggle a dropdown from pointer or Space-key activation.
    $.addEventDelegate(document, 'click.ui.dropdown keydown.ui.dropdown', '[data-ui-toggle="dropdown"]', (e) => {
        if (e.code && e.code !== 'Space') {
            return;
        }

        e.preventDefault();

        const dropdown = Dropdown.init(e.currentTarget);
        dropdown.toggle();
    });

    // Open a dropdown and focus its first item with an arrow key.
    $.addEventDelegate(document, 'keydown.ui.dropdown', '[data-ui-toggle="dropdown"]', (e) => {
        switch (e.code) {
            case 'ArrowDown':
            case 'ArrowUp': {
                e.preventDefault();

                const node = e.currentTarget;
                const dropdown = Dropdown.init(node);

                dropdown.show();
                dropdown.focusFirstItem();
                break;
            }
        }
    });

    // Move focus between dropdown items with the arrow keys.
    $.addEventDelegate(document, 'keydown.ui.dropdown', '.dropdown-menu.show .dropdown-item', (e) => {
        let focusNode;

        switch (e.code) {
            case 'ArrowDown':
                focusNode = $.next(e.currentTarget, '.dropdown-item:not([tabindex="-1"])').shift();
                break;
            case 'ArrowUp':
                focusNode = $.prev(e.currentTarget, '.dropdown-item:not([tabindex="-1"])').pop();
                break;
            default:
                return;
        }

        e.preventDefault();

        $.focus(focusNode);
    });

    // Close open dropdowns when an eligible target is clicked.
    $.addEvent(document, 'click.ui.dropdown', (e) => {
        const target = getClickTarget(e);
        const nodes = $.find('.dropdown-menu.show');

        for (const node of nodes) {
            const toggle = $.siblings(node, '[data-ui-toggle="dropdown"]').shift();
            const dropdown = Dropdown.init(toggle);

            if (!dropdown.shouldClose(target)) {
                continue;
            }

            dropdown.hide();
        }
    }, { capture: true });

    // Close open dropdowns when Escape is pressed.
    $.addEvent(document, 'keydown.ui.dropdown', (e) => {
        if (e.code !== 'Escape') {
            return;
        }

        let stopped = false;
        const nodes = $.find('.dropdown-menu.show');

        for (const node of nodes) {
            const toggle = $.siblings(node, '[data-ui-toggle="dropdown"]').shift();
            const dropdown = Dropdown.init(toggle);

            if (!stopped) {
                stopped = true;
                e.stopPropagation();
            }

            dropdown.hide();
        }
    }, { capture: true });

    // Close a dropdown after focus leaves its menu with Tab.
    $.addEvent(document, 'keyup.ui.dropdown', (e) => {
        if (e.code !== 'Tab') {
            return;
        }

        let stopped = false;
        const nodes = $.find('.dropdown-menu.show');

        for (const node of nodes) {
            const toggle = $.siblings(node, '[data-ui-toggle="dropdown"]').shift();
            const dropdown = Dropdown.init(toggle);

            if (dropdown.containsMenuTarget(e.target)) {
                continue;
            }

            if (!stopped) {
                stopped = true;
                e.stopPropagation();
            }

            dropdown.hide();
        }
    }, { capture: true });

    /** @typedef {import('./focus-trap.js').default} FocusTrap */

    const focusTraps = new Set();

    let running = false;
    let reverse = false;

    /**
     * Registers a focus trap and attaches shared focus handlers when needed.
     * @param {FocusTrap} focusTrap The focus trap to register.
     */
    function addFocusTrap(focusTrap) {
        focusTraps.add(focusTrap);

        if (running) {
            return;
        }

        $.addEvent(document, 'focusin.ui.focustrap', (e) => {
            const activeTarget = [...focusTraps].pop().node;

            if (
                $._isDocument(e.target) ||
                $.isSame(activeTarget, e.target) ||
                $.hasDescendent(activeTarget, e.target)
            ) {
                return;
            }

            const focusable = $.find('a, button, input, textarea, select, details, [tabindex], [contenteditable="true"]', activeTarget)
                .filter((node) => $.is(node, ':not(:disabled, .disabled)') && $.getAttribute(node, 'tabindex') >= 0 && $.isVisible(node));

            const focusTarget = reverse ?
                focusable.pop() :
                focusable.shift();

            $.focus(focusTarget || activeTarget);
        }, {
            capture: true,
        });

        $.addEvent(document, 'keydown.ui.focustrap', (e) => {
            if (e.key !== 'Tab') {
                return;
            }

            reverse = e.shiftKey;
        }, {
            capture: true,
        });

        running = true;
        reverse = false;
    }
    /**
     * Unregisters a focus trap and removes shared handlers when none remain.
     * @param {FocusTrap} focusTrap The focus trap to unregister.
     */
    function removeFocusTrap(focusTrap) {
        focusTraps.delete(focusTrap);

        if (focusTraps.size) {
            return;
        }

        $.removeEvent(document, 'focusin.ui.focustrap');
        $.removeEvent(document, 'keydown.ui.focustrap');

        running = false;
    }

    /**
     * @typedef {object} FocusTrapOptions
     * @property {boolean} [autoFocus=true] Whether to focus the trapped element when activated.
     */

    /**
     * Keeps keyboard focus within an element while active.
     * @extends {BaseComponent<FocusTrapOptions>}
     */
    class FocusTrap extends BaseComponent {
        #active;

        /**
         * Activates the focus trap.
         */
        activate() {
            if (this.#active) {
                return;
            }

            addFocusTrap(this);

            if (this.options.autoFocus) {
                $.focus(this.node);
            }

            this.#active = true;
        }

        /**
         * Deactivates the focus trap.
         */
        deactivate() {
            if (!this.#active) {
                return;
            }

            removeFocusTrap(this);
            this.#active = false;
        }

        /** @inheritdoc */
        dispose() {
            this.deactivate();

            super.dispose();
        }
    }

    /** @type {import('./focus-trap.js').FocusTrapOptions} */
    FocusTrap.defaults = {
        autoFocus: true,
    };

    initComponent('focustrap', FocusTrap);

    /**
     * @typedef {object} ModalOptions
     * @property {number} [duration=250] The transition duration in milliseconds.
     * @property {boolean|'static'} [backdrop=true] Whether to show a dismissible or static backdrop.
     * @property {boolean} [focus=true] Whether to trap focus while shown.
     * @property {boolean} [show=false] Whether to show the modal immediately.
     * @property {boolean} [keyboard=true] Whether Escape hides the modal.
     */

    /**
     * Controls a modal dialog and its backdrop.
     * @extends {BaseComponent<ModalOptions>}
     */
    class Modal extends BaseComponent {
        #activeTarget;
        #backdrop;
        #dialog;
        #focusTrap;
        #scrollNodes;

        /**
         * Creates a Modal.
         * @param {HTMLElement} node The input node.
         * @param {ModalOptions} [options] The modal options.
         */
        constructor(node, options) {
            super(node, options);

            this.#dialog = $.child(this.node, '.modal-dialog').shift();

            if (this.options.show) {
                this.show();
            }

            if (this.options.focus) {
                this.#focusTrap = FocusTrap.init(this.node);
            }
        }

        /** @inheritdoc */
        dispose() {
            if (this.#focusTrap) {
                this.#focusTrap.dispose();
                this.#focusTrap = null;
            }

            this.#dialog = null;
            this.#activeTarget = null;
            this.#backdrop = null;
            this.#scrollNodes = null;

            super.dispose();
        }

        /**
         * Handles an interaction outside the modal dialog.
         * @param {HTMLElement} target The interaction target.
         */
        handleBackdrop(target) {
            if (
                !this.options.backdrop ||
                (this.node !== target && $.hasDescendent(this.node, target))
            ) {
                return;
            }

            if (this.options.backdrop === 'static') {
                this.#zoom();
                return;
            }

            this.hide();
        }

        /**
         * Handles an Escape-key interaction.
         */
        handleEscape() {
            if (!this.options.keyboard) {
                return;
            }

            if (this.options.backdrop === 'static') {
                this.#zoom();
                return;
            }

            this.hide();
        }

        /**
         * Hides the modal.
         */
        hide() {
            if (
                $.getDataset(this.#dialog, 'uiAnimating') ||
                !$.hasClass(this.node, 'show') ||
                !$.triggerOne(this.node, 'hide.ui.modal')
            ) {
                return;
            }

            $.stop(this.#dialog);
            $.setDataset(this.#dialog, { uiAnimating: 'out' });

            if (this.#focusTrap) {
                this.#focusTrap.deactivate();
            }

            const stackSize = $.find('.modal.show').length - 1;

            Promise.all([
                $.fadeOut(this.#dialog, {
                    duration: this.options.duration,
                }),
                $.dropOut(this.#dialog, {
                    duration: this.options.duration,
                    direction: 'top',
                }),
                $.fadeOut(this.#backdrop, {
                    duration: this.options.duration,
                }),
            ]).then((_) => {
                $.setAttribute(this.node, {
                    'aria-hidden': true,
                    'aria-modal': false,
                });

                resetScrollPadding(this.#scrollNodes);
                this.#scrollNodes = [];

                if (stackSize) {
                    $.setStyle(this.node, { zIndex: '' });
                } else {
                    $.removeClass(document.body, 'modal-open');
                }

                $.removeClass(this.node, 'show');

                if (this.options.backdrop) {
                    $.remove(this.#backdrop);
                    this.#backdrop = null;
                }

                if (this.#activeTarget) {
                    $.focus(this.#activeTarget);
                    this.#activeTarget = null;
                }

                $.removeDataset(this.#dialog, 'uiAnimating');
                $.triggerEvent(this.node, 'hidden.ui.modal');
            }).catch((_) => {
                if ($.getDataset(this.#dialog, 'uiAnimating') === 'out') {
                    $.removeDataset(this.#dialog, 'uiAnimating');
                }
            });
        }

        /**
         * Shows the modal.
         * @param {HTMLElement} [relatedTarget] The element that triggered the Modal.
         */
        show(relatedTarget) {
            if (relatedTarget) {
                this.#activeTarget = relatedTarget;
            }

            if (
                $.getDataset(this.#dialog, 'uiAnimating') ||
                $.hasClass(this.node, 'show') ||
                !$.triggerOne(this.node, 'show.ui.modal', { data: { relatedTarget: this.#activeTarget } })
            ) {
                return;
            }

            $.setDataset(this.#dialog, { uiAnimating: 'in' });

            const stackSize = $.find('.modal.show').length;

            $.removeClass(document.body, 'modal-open');

            this.#scrollNodes = [this.#dialog];

            if (stackSize) {
                let zIndex = $.css(this.node, 'zIndex');
                zIndex = parseInt(zIndex);
                zIndex += stackSize * 20;

                $.setStyle(this.node, { zIndex });
            } else if (!$.findOne('.offcanvas.show')) {
                this.#scrollNodes.push(document.body);
                this.#scrollNodes.push(...$.find('.fixed-top, .fixed-bottom'));
            }

            addScrollPadding(this.#scrollNodes);

            $.addClass(document.body, 'modal-open');

            $.addClass(this.node, 'show');

            if (this.options.backdrop) {
                this.#backdrop = $.create('div', {
                    class: 'modal-backdrop',
                });

                $.append(document.body, this.#backdrop);

                if (stackSize) {
                    let zIndex = $.css(this.#backdrop, 'zIndex');
                    zIndex = parseInt(zIndex);
                    zIndex += stackSize * 20;

                    $.setStyle(this.#backdrop, { zIndex });
                }
            }

            Promise.all([
                $.fadeIn(this.#dialog, {
                    duration: this.options.duration,
                }),
                $.dropIn(this.#dialog, {
                    duration: this.options.duration,
                    direction: 'top',
                }),
                $.fadeIn(this.#backdrop, {
                    duration: this.options.duration,
                }),
            ]).then((_) => {
                $.setAttribute(this.node, {
                    'aria-hidden': false,
                    'aria-modal': true,
                });

                if (this.#focusTrap) {
                    this.#focusTrap.activate();
                }

                $.removeDataset(this.#dialog, 'uiAnimating');
                $.triggerEvent(this.node, 'shown.ui.modal');
            }).catch((_) => {
                if ($.getDataset(this.#dialog, 'uiAnimating') === 'in') {
                    $.removeDataset(this.#dialog, 'uiAnimating');
                }
            });
        }

        /**
         * Toggles the modal.
         */
        toggle() {
            if ($.hasClass(this.node, 'show')) {
                this.hide();
            } else {
                this.show();
            }
        }

        /**
         * Runs the static-backdrop feedback animation.
         */
        #zoom() {
            if ($.getDataset(this.#dialog, 'uiAnimating')) {
                return;
            }

            $.stop(this.#dialog);

            $.animate(
                this.#dialog,
                (node, progress) => {
                    if (progress >= 1) {
                        $.setStyle(node, { transform: '' });
                        return;
                    }

                    const zoomOffset = (progress < .5 ? progress : (1 - progress)) / 20;
                    $.setStyle(node, { transform: `scale(${1 + zoomOffset})` });
                },
                {
                    duration: 200,
                },
            ).catch((_) => {
                //
            });
        }
    }

    /**
     * Gets the top modal.
     * @returns {Modal|null} The highest visible modal, or `null` if none is shown.
     */
    function getTopModal() {
        const nodes = $.find('.modal.show');

        if (!nodes.length) {
            return null;
        }

        // Select the modal with the highest stacking order.
        let node = nodes.shift();
        let highestZIndex = $.getStyle(node, 'zIndex');

        for (const otherNode of nodes) {
            const newZIndex = $.getStyle(otherNode, 'zIndex');

            if (newZIndex <= highestZIndex) {
                continue;
            }

            node = otherNode;
            highestZIndex = newZIndex;
        }

        return Modal.init(node);
    }

    /** @type {import('./modal.js').ModalOptions} */
    Modal.defaults = {
        duration: 250,
        backdrop: true,
        focus: true,
        show: false,
        keyboard: true,
    };

    initComponent('modal', Modal);

    // Show the modal targeted by a toggle control.
    $.addEventDelegate(document, 'click.ui.modal', '[data-ui-toggle="modal"]', (e) => {
        e.preventDefault();

        const target = getTarget(e.currentTarget, '.modal');
        const modal = Modal.init(target);
        modal.show(e.currentTarget);
    });

    // Hide the modal containing a dismiss control.
    $.addEventDelegate(document, 'click.ui.modal', '[data-ui-dismiss="modal"]', (e) => {
        e.preventDefault();

        const target = getTarget(e.currentTarget, '.modal');
        const modal = Modal.init(target);
        modal.hide();
    });

    // Handle modal backdrops after offcanvas document listeners have run.
    $.addEvent(window, 'click.ui.modal', (e) => {
        const target = getClickTarget(e);

        if ($.is(target, '[data-ui-dismiss]')) {
            return;
        }

        const modal = getTopModal();

        if (!modal) {
            return;
        }

        modal.handleBackdrop(target);
    });

    // Send Escape to the highest visible modal.
    $.addEvent(window, 'keydown.ui.modal', (e) => {
        if (e.code !== 'Escape') {
            return;
        }

        const modal = getTopModal();

        if (!modal) {
            return;
        }

        modal.handleEscape();
    });

    /** @typedef {import('../popper/popper.js').Direction} Direction */

    /**
     * Gets the slide animation direction.
     * @param {HTMLElement} node The offcanvas node.
     * @returns {Direction} The animation direction.
     */
    function getDirection(node) {
        if ($.hasClass(node, 'offcanvas-end')) {
            return 'right';
        }

        if ($.hasClass(node, 'offcanvas-bottom')) {
            return 'bottom';
        }

        if ($.hasClass(node, 'offcanvas-start')) {
            return 'left';
        }

        return 'top';
    }

    /**
     * @typedef {object} OffcanvasOptions
     * @property {number} [duration=250] The transition duration in milliseconds.
     * @property {boolean|'static'} [backdrop=true] Whether to show a dismissible or static backdrop.
     * @property {boolean} [keyboard=true] Whether Escape hides the offcanvas element.
     * @property {boolean} [scroll=false] Whether body scrolling remains enabled while shown.
     */

    /**
     * Controls an offcanvas panel and its backdrop.
     * @extends {BaseComponent<OffcanvasOptions>}
     */
    class Offcanvas extends BaseComponent {
        #activeTarget;
        #focusTrap;
        #scrollNodes;

        /**
         * Creates an Offcanvas.
         * @param {HTMLElement} node The input node.
         * @param {OffcanvasOptions} [options] The offcanvas options.
         */
        constructor(node, options) {
            super(node, options);

            if (!this.options.scroll || this.options.backdrop) {
                this.#focusTrap = FocusTrap.init(this.node);
            }
        }

        /** @inheritdoc */
        dispose() {
            if (this.#focusTrap) {
                this.#focusTrap.dispose();
                this.#focusTrap = null;
            }

            this.#activeTarget = null;
            this.#scrollNodes = null;

            super.dispose();
        }

        /**
         * Handles an interaction outside the offcanvas panel.
         * @param {HTMLElement} target The interaction target.
         */
        handleBackdrop(target) {
            if (
                !this.options.backdrop ||
                this.options.backdrop === 'static' ||
                $.isSame(this.node, target) ||
                $.hasDescendent(this.node, target)
            ) {
                return;
            }

            this.hide();
        }

        /**
         * Handles an Escape-key interaction.
         */
        handleEscape() {
            if (this.options.keyboard) {
                this.hide();
            }
        }

        /**
         * Hides the offcanvas panel.
         */
        hide() {
            if (
                $.getDataset(this.node, 'uiAnimating') ||
                !$.hasClass(this.node, 'show') ||
                !$.triggerOne(this.node, 'hide.ui.offcanvas')
            ) {
                return;
            }

            $.setDataset(this.node, { uiAnimating: 'out' });

            if (this.#focusTrap) {
                this.#focusTrap.deactivate();
            }

            Promise.all([
                $.fadeOut(this.node, {
                    duration: this.options.duration,
                }),
                $.dropOut(this.node, {
                    duration: this.options.duration,
                    direction: getDirection(this.node),
                }),
            ]).then((_) => {
                $.setAttribute(this.node, {
                    'aria-hidden': true,
                    'aria-modal': false,
                });

                $.removeClass(this.node, 'show');

                if (this.options.backdrop) {
                    $.removeClass(document.body, 'offcanvas-backdrop');
                }

                if (!this.options.scroll) {
                    resetScrollPadding(this.#scrollNodes);
                    this.#scrollNodes = [];

                    $.setStyle(document.body, { overflow: '' });
                }

                if (this.#activeTarget) {
                    $.focus(this.#activeTarget);
                    this.#activeTarget = null;
                }

                $.removeDataset(this.node, 'uiAnimating');
                $.triggerEvent(this.node, 'hidden.ui.offcanvas');
            }).catch((_) => {
                if ($.getDataset(this.node, 'uiAnimating') === 'out') {
                    $.removeDataset(this.node, 'uiAnimating');
                }
            });
        }

        /**
         * Shows the offcanvas panel.
         * @param {HTMLElement} [relatedTarget] The element that triggered the Offcanvas.
         */
        show(relatedTarget) {
            if (relatedTarget) {
                this.#activeTarget = relatedTarget;
            }

            if (
                $.getDataset(this.node, 'uiAnimating') ||
                $.hasClass(this.node, 'show') ||
                $.findOne('.offcanvas.show') ||
                !$.triggerOne(this.node, 'show.ui.offcanvas')
            ) {
                return;
            }

            $.setDataset(this.node, { uiAnimating: 'in' });
            $.addClass(this.node, 'show');

            if (this.options.backdrop) {
                $.addClass(document.body, 'offcanvas-backdrop');
            }

            this.#scrollNodes = [];

            if (!this.options.scroll) {
                this.#scrollNodes.push(document.body);
                this.#scrollNodes.push(...$.find('.fixed-top, .fixed-bottom'));

                addScrollPadding(this.#scrollNodes);

                $.setStyle(document.body, { overflow: 'hidden' });
            }

            Promise.all([
                $.fadeIn(this.node, {
                    duration: this.options.duration,
                }),
                $.dropIn(this.node, {
                    duration: this.options.duration,
                    direction: getDirection(this.node),
                }),
            ]).then((_) => {
                $.setAttribute(this.node, {
                    'aria-hidden': false,
                    'aria-modal': true,
                });

                if (this.#focusTrap) {
                    this.#focusTrap.activate();
                }

                $.removeDataset(this.node, 'uiAnimating');
                $.triggerEvent(this.node, 'shown.ui.offcanvas');
            }).catch((_) => {
                if ($.getDataset(this.node, 'uiAnimating') === 'in') {
                    $.removeDataset(this.node, 'uiAnimating');
                }
            });
        }

        /**
         * Toggles the offcanvas panel.
         */
        toggle() {
            if ($.hasClass(this.node, 'show')) {
                this.hide();
            } else {
                this.show();
            }
        }
    }

    /** @type {import('./offcanvas.js').OffcanvasOptions} */
    Offcanvas.defaults = {
        duration: 250,
        backdrop: true,
        keyboard: true,
        scroll: false,
    };

    initComponent('offcanvas', Offcanvas);

    // Show the offcanvas panel targeted by a toggle control.
    $.addEventDelegate(document, 'click.ui.offcanvas', '[data-ui-toggle="offcanvas"]', (e) => {
        e.preventDefault();

        const target = getTarget(e.currentTarget, '.offcanvas');
        const offcanvas = Offcanvas.init(target);
        offcanvas.show(e.currentTarget);
    });

    // Hide the offcanvas panel containing a dismiss control.
    $.addEventDelegate(document, 'click.ui.offcanvas', '[data-ui-dismiss="offcanvas"]', (e) => {
        e.preventDefault();

        const target = getTarget(e.currentTarget, '.offcanvas');
        const offcanvas = Offcanvas.init(target);
        offcanvas.hide();
    });

    // Handle backdrop clicks when no modal is covering the offcanvas panel.
    $.addEvent(document, 'click.ui.offcanvas', (e) => {
        const target = getClickTarget(e);

        if ($.is(target, '[data-ui-dismiss]') || $.findOne('.modal.show')) {
            return;
        }

        const nodes = $.find('.offcanvas.show');

        if (!nodes.length) {
            return;
        }

        for (const node of nodes) {
            const offcanvas = Offcanvas.init(node);
            offcanvas.handleBackdrop(target);
        }
    });

    // Send Escape to visible offcanvas panels when no modal is shown.
    $.addEvent(document, 'keydown.ui.offcanvas', (e) => {
        if (e.code !== 'Escape' || $.findOne('.modal.show')) {
            return;
        }

        const nodes = $.find('.offcanvas.show');

        if (!nodes.length) {
            return;
        }

        for (const node of nodes) {
            const offcanvas = Offcanvas.init(node);
            offcanvas.handleEscape();
        }
    });

    /** @type {import('./popper.js').PopperOptions} */
    Popper.defaults = {
        reference: null,
        container: null,
        arrow: null,
        afterUpdate: null,
        beforeUpdate: null,
        placement: 'bottom',
        position: 'center',
        fixed: false,
        spacing: 0,
        minContact: null,
        useGpu: true,
        noAttributes: false,
    };

    initComponent('popper', Popper);

    /** @typedef {import('../popper/popper.js').Placement} Placement */
    /** @typedef {import('../popper/popper.js').Position} Position */

    /**
     * @typedef {object} PopoverOptions
     * @property {string} [template] The popover markup template.
     * @property {string|null} [customClass=null] An additional class for the popover.
     * @property {number} [duration=100] The transition duration in milliseconds.
     * @property {boolean} [enable=true] Whether the popover starts enabled.
     * @property {boolean} [html=false] Whether title and content may contain HTML.
     * @property {string|HTMLElement|null} [appendTo=null] The popover container.
     * @property {false|((input: string) => string)} [sanitize] The HTML sanitizer, or `false` to disable sanitization.
     * @property {string} [trigger='click'] The space-separated interaction triggers.
     * @property {Placement} [placement='auto'] The preferred popover placement.
     * @property {Position} [position='center'] The popover alignment.
     * @property {boolean} [fixed=false] Whether to preserve the preferred placement.
     * @property {number} [spacing=3] The spacing from the reference element.
     * @property {number|false} [minContact=false] The minimum contact with the reference element.
     * @property {boolean} [noAttributes=false] Whether to omit placement and accessibility attributes.
     * @property {string} [title] The popover title.
     * @property {string} [content] The popover body content.
     */

    /**
     * Controls a popover anchored to a reference element.
     * @extends {BaseComponent<PopoverOptions>}
     */
    class Popover extends BaseComponent {
        #arrow;
        #enabled;
        #hideModalEvent;
        #modal;
        #popover;
        #popoverBody;
        #popoverHeader;
        #popper;
        #triggers;

        /**
         * Creates a Popover.
         * @param {HTMLElement} node The input node.
         * @param {PopoverOptions} [options] The popover options.
         */
        constructor(node, options) {
            super(node, options);

            this.#modal = $.closest(this.node, '.modal').shift();

            this.#triggers = this.options.trigger.split(' ');

            this.#render();
            this.#events();

            if (this.options.enable) {
                this.enable();
            }

            this.refresh();
        }

        /**
         * Disables interaction-triggered popover changes.
         */
        disable() {
            this.#enabled = false;
        }

        /** @inheritdoc */
        dispose() {
            if ($.hasDataset(this.node, 'uiOriginalTitle')) {
                const title = $.getDataset(this.node, 'uiOriginalTitle');
                $.setAttribute(this.node, { title });
                $.removeDataset(this.node, 'uiOriginalTitle');
            }

            if (this.#popper) {
                this.#popper.dispose();
                this.#popper = null;
            }

            $.remove(this.#popover);

            if (this.#triggers.includes('hover')) {
                $.removeEvent(this.node, 'mouseover.ui.popover');
                $.removeEvent(this.node, 'mouseout.ui.popover');
            }

            if (this.#triggers.includes('focus')) {
                $.removeEvent(this.node, 'focus.ui.popover');
                $.removeEvent(this.node, 'blur.ui.popover');
            }

            if (this.#triggers.includes('click')) {
                $.removeEvent(this.node, 'click.ui.popover');
            }

            if (this.#modal) {
                $.removeEvent(this.#modal, 'hide.ui.modal', this.#hideModalEvent);
            }

            this.#modal = null;
            this.#triggers = null;
            this.#popover = null;
            this.#popoverHeader = null;
            this.#popoverBody = null;
            this.#arrow = null;
            this.#hideModalEvent = null;

            super.dispose();
        }

        /**
         * Enables interaction-triggered popover changes.
         */
        enable() {
            this.#enabled = true;
        }

        /**
         * Hides the popover.
         * @param {{force?: boolean}} [options] The hide options. Force defaults to `true`.
         */
        hide({ force = true } = {}) {
            if (
                (!force && !this.#enabled) ||
                $.getDataset(this.#popover, 'uiAnimating') ||
                !$.isConnected(this.#popover) ||
                !$.triggerOne(this.node, 'hide.ui.popover')
            ) {
                return;
            }

            $.setDataset(this.#popover, { uiAnimating: 'out' });

            $.fadeOut(this.#popover, {
                duration: this.options.duration,
            }).then((_) => {
                this.#popper.dispose();
                this.#popper = null;

                $.detach(this.#popover);
                $.removeDataset(this.#popover, 'uiAnimating');
                $.removeAttribute(this.node, 'aria-describedby');
                $.triggerEvent(this.node, 'hidden.ui.popover');
            }).catch((_) => {
                if ($.getDataset(this.#popover, 'uiAnimating') === 'out') {
                    $.removeDataset(this.#popover, 'uiAnimating');
                }
            });
        }

        /**
         * Refreshes the popover title and body content.
         */
        refresh() {
            if ($.hasAttribute(this.node, 'title')) {
                const originalTitle = $.getAttribute(this.node, 'title');
                $.setDataset(this.node, { uiOriginalTitle: originalTitle });
                $.removeAttribute(this.node, 'title');
            }

            let title = '';
            if ($.hasDataset(this.node, 'uiTitle')) {
                title = $.getDataset(this.node, 'uiTitle');
            } else if (this.options.title) {
                title = this.options.title;
            } else if ($.hasDataset(this.node, 'uiOriginalTitle')) {
                title = $.getDataset(this.node, 'uiOriginalTitle', title);
            }

            let content = '';
            if ($.hasDataset(this.node, 'uiContent')) {
                content = $.getDataset(this.node, 'uiContent');
            } else if (this.options.content) {
                content = this.options.content;
            }

            const method = this.options.html ? 'setHTML' : 'setText';

            $[method](
                this.#popoverHeader,
                this.options.html && this.options.sanitize ?
                    this.options.sanitize(title) :
                    title,
            );

            if (!title) {
                $.hide(this.#popoverHeader);
            } else {
                $.show(this.#popoverHeader);
            }

            $[method](
                this.#popoverBody,
                this.options.html && this.options.sanitize ?
                    this.options.sanitize(content) :
                    content,
            );
        }

        /**
         * Shows the popover.
         */
        show() {
            if (
                !this.#enabled ||
                $.getDataset(this.#popover, 'uiAnimating') ||
                $.isConnected(this.#popover) ||
                !$.triggerOne(this.node, 'show.ui.popover')
            ) {
                return;
            }

            $.setDataset(this.#popover, { uiAnimating: 'in' });
            this.refresh();
            this.#show();

            $.fadeIn(this.#popover, {
                duration: this.options.duration,
            }).then((_) => {
                $.removeDataset(this.#popover, 'uiAnimating');
                $.triggerEvent(this.node, 'shown.ui.popover');
            }).catch((_) => {
                if ($.getDataset(this.#popover, 'uiAnimating') === 'in') {
                    $.removeDataset(this.#popover, 'uiAnimating');
                }
            });
        }

        /**
         * Toggles the popover.
         * @param {{force?: boolean}} [options] The toggle options. Force defaults to `true`.
         */
        toggle({ force = true } = {}) {
            if ($.isConnected(this.#popover)) {
                this.hide({ force });
            } else {
                this.show();
            }
        }

        /**
         * Updates the popover position.
         */
        update() {
            if (this.#popper) {
                this.#popper.update();
            }
        }

        /**
         * Attaches popover interaction handlers.
         */
        #events() {
            if (this.#triggers.includes('hover')) {
                $.addEvent(this.node, 'mouseover.ui.popover', (_) => {
                    this.#stop();
                    this.show();
                });

                $.addEvent(this.node, 'mouseout.ui.popover', (_) => {
                    this.#stop();
                    this.hide({ force: false });
                });
            }

            if (this.#triggers.includes('focus')) {
                $.addEvent(this.node, 'focus.ui.popover', (_) => {
                    this.#stop();
                    this.show();
                });

                $.addEvent(this.node, 'blur.ui.popover', (_) => {
                    this.#stop();
                    this.hide({ force: false });
                });
            }

            if (this.#triggers.includes('click')) {
                $.addEvent(this.node, 'click.ui.popover', (e) => {
                    e.preventDefault();

                    this.#stop();
                    this.toggle({ force: false });
                });
            }

            if (this.#modal) {
                this.#hideModalEvent = (_) => {
                    this.#stop();
                    this.hide();
                };
                $.addEvent(this.#modal, 'hide.ui.modal', this.#hideModalEvent);
            }
        }

        /**
         * Creates the popover element from its template.
         */
        #render() {
            this.#popover = $.parseHTML(this.options.template).shift();
            if (this.options.customClass) {
                $.addClass(this.#popover, this.options.customClass);
            }
            this.#arrow = $.findOne('.popover-arrow', this.#popover);
            this.#popoverHeader = $.findOne('.popover-header', this.#popover);
            this.#popoverBody = $.findOne('.popover-body', this.#popover);
        }

        /**
         * Appends and positions the popover element.
         */
        #show() {
            if (this.options.appendTo) {
                $.append(this.options.appendTo, this.#popover);
            } else {
                $.after(this.node, this.#popover);
            }

            if (!this.options.noAttributes) {
                const id = generateId(this.constructor.DATA_KEY);
                $.setAttribute(this.#popover, { id });
                $.setAttribute(this.node, { 'aria-describedby': id });
            }

            this.#popper = new Popper(
                this.#popover,
                {
                    reference: this.node,
                    arrow: this.#arrow,
                    placement: this.options.placement,
                    position: this.options.position,
                    fixed: this.options.fixed,
                    spacing: this.options.spacing,
                    minContact: this.options.minContact,
                    noAttributes: this.options.noAttributes,
                },
            );

            window.requestAnimationFrame((_) => {
                this.update();
            });
        }

        /**
         * Stops the active popover transition.
         */
        #stop() {
            if (!this.#enabled) {
                return;
            }

            const animating = $.getDataset(this.#popover, 'uiAnimating');

            if (!animating) {
                return;
            }

            $.stop(this.#popover, { finish: false });
            $.removeDataset(this.#popover, 'uiAnimating');

            if (animating === 'out') {
                this.#popper.dispose();
                this.#popper = null;

                $.detach(this.#popover);
            }
        }
    }

    /** @type {import('./popover.js').PopoverOptions} */
    Popover.defaults = {
        template: '<div class="popover" role="tooltip">' +
            '<div class="popover-arrow"></div>' +
            '<h3 class="popover-header"></h3>' +
            '<div class="popover-body"></div>' +
            '</div>',
        customClass: null,
        duration: 100,
        enable: true,
        html: false,
        appendTo: null,
        sanitize: (input) => $.sanitize(input),
        trigger: 'click',
        placement: 'auto',
        position: 'center',
        fixed: false,
        spacing: 3,
        minContact: false,
        noAttributes: false,
    };

    initComponent('popover', Popover);

    /**
     * @typedef {object} TabOptions
     * @property {number} [duration=100] The transition duration in milliseconds.
     */

    /**
     * Controls a tab trigger and its associated panel.
     * @extends {BaseComponent<TabOptions>}
     */
    class Tab extends BaseComponent {
        #siblings;
        #target;

        /**
         * Creates a Tab.
         * @param {HTMLElement} node The input node.
         * @param {TabOptions} [options] The tab options.
         */
        constructor(node, options) {
            super(node, options);

            const selector = getTargetSelector(this.node);
            this.#target = $.findOne(selector);
            this.#siblings = $.siblings(this.node);
        }

        /** @inheritdoc */
        dispose() {
            this.#target = null;
            this.#siblings = null;

            super.dispose();
        }

        /**
         * Hides the current tab.
         */
        hide() {
            if (
                $.getDataset(this.#target, 'uiAnimating') ||
                !$.hasClass(this.#target, 'active') ||
                !$.triggerOne(this.node, 'hide.ui.tab')
            ) {
                return;
            }

            this.#hide();
        }

        /**
         * Hides the active tab and shows the current tab.
         */
        show() {
            if (
                $.getDataset(this.#target, 'uiAnimating') ||
                $.hasClass(this.#target, 'active') ||
                !$.triggerOne(this.node, 'show.ui.tab')
            ) {
                return;
            }

            const active = this.#siblings.find((sibling) =>
                $.hasClass(sibling, 'active'),
            );

            if (!active) {
                this.#show();
            } else {
                const activeTab = this.constructor.init(active);

                if ($.getDataset(activeTab.#target, 'uiAnimating')) {
                    return;
                }

                if (!$.triggerOne(active, 'hide.ui.tab')) {
                    return;
                }

                $.addEventOnce(active, 'hidden.ui.tab', (_) => {
                    this.#show();
                });

                activeTab.#hide();
            }
        }

        /**
         * Hides the current tab without checking its state or events.
         */
        #hide() {
            $.setDataset(this.#target, { uiAnimating: 'out' });

            $.fadeOut(this.#target, {
                duration: this.options.duration,
            }).then((_) => {
                $.removeClass(this.#target, 'active');
                $.removeClass(this.node, 'active');
                $.removeDataset(this.#target, 'uiAnimating');
                $.setAttribute(this.node, { 'aria-selected': false });
                $.triggerEvent(this.node, 'hidden.ui.tab');
            }).catch((_) => {
                if ($.getDataset(this.#target, 'uiAnimating') === 'out') {
                    $.removeDataset(this.#target, 'uiAnimating');
                }
            });
        }

        /**
         * Shows the current tab without checking its state or events.
         */
        #show() {
            $.setDataset(this.#target, { uiAnimating: 'in' });

            $.addClass(this.#target, 'active');
            $.addClass(this.node, 'active');

            $.fadeIn(this.#target, {
                duration: this.options.duration,
            }).then((_) => {
                $.setAttribute(this.node, { 'aria-selected': true });
                $.removeDataset(this.#target, 'uiAnimating');
                $.triggerEvent(this.node, 'shown.ui.tab');
            }).catch((_) => {
                if ($.getDataset(this.#target, 'uiAnimating') === 'in') {
                    $.removeDataset(this.#target, 'uiAnimating');
                }
            });
        }
    }

    /** @type {import('./tab.js').TabOptions} */
    Tab.defaults = {
        duration: 100,
    };

    initComponent('tab', Tab);

    // Select a tab from pointer or Space-key activation.
    $.addEventDelegate(document, 'click.ui.tab keydown.ui.tab', '[data-ui-toggle="tab"]', (e) => {
        if (e.code && e.code !== 'Space') {
            return;
        }

        e.preventDefault();

        const tab = Tab.init(e.currentTarget);
        tab.show();
    });

    // Move focus between tab controls with navigation keys.
    $.addEventDelegate(document, 'keydown.ui.tab', '[data-ui-toggle="tab"]', (e) => {
        let newTarget;

        switch (e.code) {
            case 'ArrowDown':
            case 'ArrowRight':
                newTarget = $.next(e.currentTarget, '[data-ui-toggle="tab"]:not(.disabled)').shift();
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                newTarget = $.prev(e.currentTarget, '[data-ui-toggle="tab"]:not(.disabled)').pop();
                break;
            case 'Home':
                newTarget = $.prevAll(e.currentTarget, '[data-ui-toggle="tab"]:not(.disabled)').shift();
                break;
            case 'End':
                newTarget = $.nextAll(e.currentTarget, '[data-ui-toggle="tab"]:not(.disabled)').pop();
                break;
            default:
                return;
        }

        if (!newTarget) {
            return;
        }

        e.preventDefault();

        $.focus(newTarget);
    });

    /**
     * @typedef {object} ToastOptions
     * @property {boolean} [autohide=true] Whether to hide the toast automatically.
     * @property {number} [delay=5000] The autohide delay in milliseconds.
     * @property {number} [duration=100] The transition duration in milliseconds.
     */

    /**
     * Controls a transient toast notification.
     * @extends {BaseComponent<ToastOptions>}
     */
    class Toast extends BaseComponent {
        #timer;

        /** @inheritdoc */
        dispose() {
            clearTimeout(this.#timer);
            this.#timer = null;

            super.dispose();
        }

        /**
         * Hides the toast.
         */
        hide() {
            if (
                $.getDataset(this.node, 'uiAnimating') ||
                !$.isVisible(this.node) ||
                !$.triggerOne(this.node, 'hide.ui.toast')
            ) {
                return;
            }

            clearTimeout(this.#timer);
            this.#timer = null;

            $.setDataset(this.node, { uiAnimating: 'out' });

            $.fadeOut(this.node, {
                duration: this.options.duration,
            }).then((_) => {
                $.setStyle(this.node, { display: 'none' }, null, { important: true });
                $.removeClass(this.node, 'show');
                $.removeDataset(this.node, 'uiAnimating');
                $.triggerEvent(this.node, 'hidden.ui.toast');
            }).catch((_) => {
                if ($.getDataset(this.node, 'uiAnimating') === 'out') {
                    $.removeDataset(this.node, 'uiAnimating');
                }
            });
        }

        /**
         * Shows the toast.
         */
        show() {
            if (
                $.getDataset(this.node, 'uiAnimating') ||
                $.isVisible(this.node) ||
                !$.triggerOne(this.node, 'show.ui.toast')
            ) {
                return;
            }

            clearTimeout(this.#timer);
            this.#timer = null;

            $.setDataset(this.node, { uiAnimating: 'in' });
            $.setStyle(this.node, { display: '' });
            $.addClass(this.node, 'show');

            $.fadeIn(this.node, {
                duration: this.options.duration,
            }).then((_) => {
                $.removeDataset(this.node, 'uiAnimating');
                $.triggerEvent(this.node, 'shown.ui.toast');

                if (this.options.autohide) {
                    this.#timer = setTimeout(
                        (_) => {
                            this.#timer = null;
                            this.hide();
                        },
                        this.options.delay,
                    );
                }
            }).catch((_) => {
                if ($.getDataset(this.node, 'uiAnimating') === 'in') {
                    $.removeDataset(this.node, 'uiAnimating');
                }
            });
        }
    }

    /** @type {import('./toast.js').ToastOptions} */
    Toast.defaults = {
        autohide: true,
        delay: 5000,
        duration: 100,
    };

    initComponent('toast', Toast);

    // Hide the toast containing a dismiss control.
    $.addEventDelegate(document, 'click.ui.toast', '[data-ui-dismiss="toast"]', (e) => {
        e.preventDefault();

        const target = getTarget(e.currentTarget, '.toast');
        const toast = Toast.init(target, { autohide: false });
        toast.hide();
    });

    /** @typedef {import('../popper/popper.js').Placement} Placement */
    /** @typedef {import('../popper/popper.js').Position} Position */

    /**
     * @typedef {object} TooltipOptions
     * @property {string} [template] The tooltip markup template.
     * @property {string|null} [customClass=null] An additional class for the tooltip.
     * @property {number} [duration=100] The transition duration in milliseconds.
     * @property {boolean} [enable=true] Whether the tooltip starts enabled.
     * @property {boolean} [html=false] Whether the title may contain HTML.
     * @property {string} [trigger='hover focus'] The space-separated interaction triggers.
     * @property {string|HTMLElement|null} [appendTo=null] The tooltip container.
     * @property {false|((input: string) => string)} [sanitize] The HTML sanitizer, or `false` to disable sanitization.
     * @property {Placement} [placement='auto'] The preferred tooltip placement.
     * @property {Position} [position='center'] The tooltip alignment.
     * @property {boolean} [fixed=false] Whether to preserve the preferred placement.
     * @property {number} [spacing=2] The spacing from the reference element.
     * @property {number|false} [minContact=false] The minimum contact with the reference element.
     * @property {boolean} [noAttributes=false] Whether to omit placement and accessibility attributes.
     * @property {string} [title] The tooltip title.
     */

    /**
     * Controls a tooltip anchored to a reference element.
     * @extends {BaseComponent<TooltipOptions>}
     */
    class Tooltip extends BaseComponent {
        #arrow;
        #enabled;
        #hideModalEvent;
        #modal;
        #popper;
        #tooltip;
        #tooltipInner;
        #triggers;

        /**
         * Creates a Tooltip.
         * @param {HTMLElement} node The input node.
         * @param {TooltipOptions} [options] The tooltip options.
         */
        constructor(node, options) {
            super(node, options);

            this.#modal = $.closest(this.node, '.modal').shift();

            this.#triggers = this.options.trigger.split(' ');

            this.#render();
            this.#events();

            if (this.options.enable) {
                this.enable();
            }

            this.refresh();
        }

        /**
         * Disables interaction-triggered tooltip changes.
         */
        disable() {
            this.#enabled = false;
        }

        /** @inheritdoc */
        dispose() {
            if ($.hasDataset(this.node, 'uiOriginalTitle')) {
                const title = $.getDataset(this.node, 'uiOriginalTitle');
                $.setAttribute(this.node, { title });
                $.removeDataset(this.node, 'uiOriginalTitle');
            }

            if (this.#popper) {
                this.#popper.dispose();
                this.#popper = null;
            }

            $.remove(this.#tooltip);

            if (this.#triggers.includes('hover')) {
                $.removeEvent(this.node, 'mouseover.ui.tooltip');
                $.removeEvent(this.node, 'mouseout.ui.tooltip');
            }

            if (this.#triggers.includes('focus')) {
                $.removeEvent(this.node, 'focus.ui.tooltip');
                $.removeEvent(this.node, 'blur.ui.tooltip');
            }

            if (this.#triggers.includes('click')) {
                $.removeEvent(this.node, 'click.ui.tooltip');
            }

            if (this.#modal) {
                $.removeEvent(this.#modal, 'hide.ui.modal', this.#hideModalEvent);
            }

            this.#modal = null;
            this.#triggers = null;
            this.#tooltip = null;
            this.#tooltipInner = null;
            this.#arrow = null;
            this.#hideModalEvent = null;

            super.dispose();
        }

        /**
         * Enables interaction-triggered tooltip changes.
         */
        enable() {
            this.#enabled = true;
        }

        /**
         * Hides the tooltip.
         * @param {{force?: boolean}} [options] The hide options. Force defaults to `true`.
         */
        hide({ force = true } = {}) {
            if (
                (!force && !this.#enabled) ||
                $.getDataset(this.#tooltip, 'uiAnimating') ||
                !$.isConnected(this.#tooltip) ||
                !$.triggerOne(this.node, 'hide.ui.tooltip')
            ) {
                return;
            }

            $.setDataset(this.#tooltip, { uiAnimating: 'out' });

            $.fadeOut(this.#tooltip, {
                duration: this.options.duration,
            }).then((_) => {
                this.#popper.dispose();
                this.#popper = null;

                $.removeClass(this.#tooltip, 'show');
                $.detach(this.#tooltip);
                $.removeDataset(this.#tooltip, 'uiAnimating');
                $.removeAttribute(this.node, 'aria-describedby');
                $.triggerEvent(this.node, 'hidden.ui.tooltip');
            }).catch((_) => {
                if ($.getDataset(this.#tooltip, 'uiAnimating') === 'out') {
                    $.removeDataset(this.#tooltip, 'uiAnimating');
                }
            });
        }

        /**
         * Refreshes the tooltip title.
         */
        refresh() {
            if ($.hasAttribute(this.node, 'title')) {
                const originalTitle = $.getAttribute(this.node, 'title');
                $.setDataset(this.node, { uiOriginalTitle: originalTitle });
                $.removeAttribute(this.node, 'title');
            }

            let title = '';
            if ($.hasDataset(this.node, 'uiTitle')) {
                title = $.getDataset(this.node, 'uiTitle');
            } else if (this.options.title) {
                title = this.options.title;
            } else if ($.hasDataset(this.node, 'uiOriginalTitle')) {
                title = $.getDataset(this.node, 'uiOriginalTitle', title);
            }

            const method = this.options.html ? 'setHTML' : 'setText';

            $[method](
                this.#tooltipInner,
                this.options.html && this.options.sanitize ?
                    this.options.sanitize(title) :
                    title,
            );

            this.update();
        }

        /**
         * Shows the tooltip.
         */
        show() {
            if (
                !this.#enabled ||
                $.getDataset(this.#tooltip, 'uiAnimating') ||
                $.isConnected(this.#tooltip) ||
                !$.triggerOne(this.node, 'show.ui.tooltip')
            ) {
                return;
            }

            $.setDataset(this.#tooltip, { uiAnimating: 'in' });
            $.addClass(this.#tooltip, 'show');
            this.refresh();
            this.#show();

            $.fadeIn(this.#tooltip, {
                duration: this.options.duration,
            }).then((_) => {
                $.removeDataset(this.#tooltip, 'uiAnimating');
                $.triggerEvent(this.node, 'shown.ui.tooltip');
            }).catch((_) => {
                if ($.getDataset(this.#tooltip, 'uiAnimating') === 'in') {
                    $.removeDataset(this.#tooltip, 'uiAnimating');
                }
            });
        }

        /**
         * Toggles the tooltip.
         * @param {{force?: boolean}} [options] The toggle options. Force defaults to `true`.
         */
        toggle({ force = true } = {}) {
            if ($.isConnected(this.#tooltip)) {
                this.hide({ force });
            } else {
                this.show();
            }
        }

        /**
         * Updates the tooltip position.
         */
        update() {
            if (this.#popper) {
                this.#popper.update();
            }
        }

        /**
         * Attaches tooltip interaction handlers.
         */
        #events() {
            if (this.#triggers.includes('hover')) {
                $.addEvent(this.node, 'mouseover.ui.tooltip', (_) => {
                    this.#stop();
                    this.show();
                });

                $.addEvent(this.node, 'mouseout.ui.tooltip', (_) => {
                    this.#stop();
                    this.hide({ force: false });
                });
            }

            if (this.#triggers.includes('focus')) {
                $.addEvent(this.node, 'focus.ui.tooltip', (_) => {
                    this.#stop();
                    this.show();
                });

                $.addEvent(this.node, 'blur.ui.tooltip', (_) => {
                    this.#stop();
                    this.hide({ force: false });
                });
            }

            if (this.#triggers.includes('click')) {
                $.addEvent(this.node, 'click.ui.tooltip', (e) => {
                    e.preventDefault();

                    this.#stop();
                    this.toggle({ force: false });
                });
            }

            if (this.#modal) {
                this.#hideModalEvent = (_) => {
                    this.#stop();
                    this.hide();
                };
                $.addEvent(this.#modal, 'hide.ui.modal', this.#hideModalEvent);
            }
        }

        /**
         * Creates the tooltip element from its template.
         */
        #render() {
            this.#tooltip = $.parseHTML(this.options.template).shift();
            if (this.options.customClass) {
                $.addClass(this.#tooltip, this.options.customClass);
            }
            this.#arrow = $.findOne('.tooltip-arrow', this.#tooltip);
            this.#tooltipInner = $.findOne('.tooltip-inner', this.#tooltip);
        }

        /**
         * Appends and positions the tooltip element.
         */
        #show() {
            if (this.options.appendTo) {
                $.append(this.options.appendTo, this.#tooltip);
            } else {
                $.after(this.node, this.#tooltip);
            }

            if (!this.options.noAttributes) {
                const id = generateId(this.constructor.DATA_KEY);
                $.setAttribute(this.#tooltip, { id });
                $.setAttribute(this.node, { 'aria-describedby': id });
            }

            this.#popper = new Popper(
                this.#tooltip,
                {
                    reference: this.node,
                    arrow: this.#arrow,
                    placement: this.options.placement,
                    position: this.options.position,
                    fixed: this.options.fixed,
                    spacing: this.options.spacing,
                    minContact: this.options.minContact,
                    noAttributes: this.options.noAttributes,
                },
            );

            window.requestAnimationFrame((_) => {
                this.update();
            });
        }

        /**
         * Stops the active tooltip transition.
         */
        #stop() {
            if (!this.#enabled) {
                return;
            }

            const animating = $.getDataset(this.#tooltip, 'uiAnimating');

            if (!animating) {
                return;
            }

            $.stop(this.#tooltip, { finish: false });
            $.removeDataset(this.#tooltip, 'uiAnimating');

            if (animating === 'out') {
                this.#popper.dispose();
                this.#popper = null;

                $.removeClass(this.#tooltip, 'show');
                $.detach(this.#tooltip);
            }
        }
    }

    /** @type {import('./tooltip.js').TooltipOptions} */
    Tooltip.defaults = {
        template: '<div class="tooltip" role="tooltip">' +
            '<div class="tooltip-arrow"></div>' +
            '<div class="tooltip-inner"></div>' +
            '</div>',
        customClass: null,
        duration: 100,
        enable: true,
        html: false,
        trigger: 'hover focus',
        appendTo: null,
        sanitize: (input) => $.sanitize(input),
        placement: 'auto',
        position: 'center',
        fixed: false,
        spacing: 2,
        minContact: false,
        noAttributes: false,
    };

    initComponent('tooltip', Tooltip);

    // Copy or cut text requested by a clipboard control.
    $.addEventDelegate(document, 'click', '[data-ui-toggle="clipboard"]', (e) => {
        e.preventDefault();

        const node = e.currentTarget;
        let { action = 'copy', text = null } = getDataset(node);

        if (!['copy', 'cut'].includes(action)) {
            throw new Error('Invalid clipboard action');
        }

        let input;
        if (!text) {
            const target = getTarget(node);
            if ($.is(target, 'input, textarea')) {
                input = target;
                text = $.getValue(input);
            } else {
                text = $.getText(target);
            }
        }

        const customText = !input;
        if (customText) {
            input = $.create(
                'textarea',
                {
                    class: 'visually-hidden position-fixed',
                    value: text,
                },
            );

            $.append(document.body, input);
        }

        $.select(input);

        if ($.exec(action)) {
            $.triggerEvent(node, 'copied.ui.clipboard', {
                data: {
                    action: action,
                    text,
                },
            });
        }

        if (customText) {
            $.detach(input);
        }
    });

    // Render a click-centered ripple animation.
    $.addEventDelegate(document, 'click.ui.ripple', '.ripple', (e) => {
        if (e.button !== 0) {
            return;
        }

        const target = e.currentTarget;
        const pos = $.position(target, { offset: true });

        const width = $.width(target);
        const height = $.height(target);
        const scaleMultiple = Math.max(width, height);

        const isFixed = $.isFixed(target);
        const mouseX = isFixed ? e.clientX : e.pageX;
        const mouseY = isFixed ? e.clientY : e.pageY;

        const prevRipple = $.findOne(':scope > .ripple-effect', target);

        if (prevRipple) {
            $.remove(prevRipple);
        }

        const ripple = $.create('span', {
            class: 'ripple-effect',
            style: {
                left: mouseX - pos.x,
                top: mouseY - pos.y,
            },
        });
        $.append(target, ripple);

        $.animate(
            ripple,
            (node, progress) => {
                $.setStyle(node, {
                    transform: 'scale(' + Math.floor(progress * scaleMultiple) + ')',
                    opacity: 1 - Math.pow(progress, 2),
                });
            },
            {
                duration: 500,
            },
        ).finally((_) => {
            $.detach(ripple);
        });
    });

    // Resize expanding text areas as their content changes.
    $.addEventDelegate(document, 'change.ui.expand input.ui.expand', '.text-expand', (e) => {
        const textArea = e.currentTarget;

        $.setStyle(textArea, { height: 'inherit' });

        let newHeight = $.height(textArea, { boxSize: $.SCROLL_BOX });
        newHeight += parseInt($.css(textArea, 'borderTop'));
        newHeight += parseInt($.css(textArea, 'borderBottom'));

        $.setStyle(textArea, { height: `${newHeight}px` });
    });

    exports.Alert = Alert;
    exports.BaseComponent = BaseComponent;
    exports.Button = Button;
    exports.Carousel = Carousel;
    exports.Collapse = Collapse;
    exports.Dropdown = Dropdown;
    exports.FocusTrap = FocusTrap;
    exports.Modal = Modal;
    exports.Offcanvas = Offcanvas;
    exports.Popover = Popover;
    exports.Popper = Popper;
    exports.Tab = Tab;
    exports.Toast = Toast;
    exports.Tooltip = Tooltip;
    exports.addScrollPadding = addScrollPadding;
    exports.generateId = generateId;
    exports.getClickTarget = getClickTarget;
    exports.getDataset = getDataset;
    exports.getPosition = getPosition;
    exports.getScrollContainer = getScrollContainer;
    exports.getScrollbarSize = getScrollbarSize;
    exports.getTarget = getTarget;
    exports.getTargetSelector = getTargetSelector;
    exports.getTouchPositions = getTouchPositions;
    exports.initComponent = initComponent;
    exports.resetScrollPadding = resetScrollPadding;

}));
//# sourceMappingURL=frost-ui.js.map
