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

    let scrollbarSize;

    /**
     * Add scrollbar padding to a node.
     * @param {array} nodes The nodes.
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
     * Get the size of the scrollbar.
     * @return {number} The scrollbar size.
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
     * Generate a unique element ID.
     * @param {string} [prefix] The ID prefix.
     * @return {string} The unique ID.
     */
    function generateId(prefix) {
        const id = `${prefix}${$._randomInt(10000, 99999)}`;

        if ($.findOne(`#${id}`)) {
            return generateId(prefix);
        }

        return id;
    }
    /**
     * Get normalized UI data from a node.
     * @param {HTMLElement} node The input node.
     * @return {object} The normalized data.
     */
    function getDataset(node) {
        const dataset = $.getDataset(node);

        return Object.fromEntries(
            Object.entries(dataset)
                .map(([key, value]) => [key.slice(2, 3).toLowerCase() + key.slice(3), value]),
        );
    }
    /**
     * Get position from a mouse/touch event.
     * @param {Event} e The mouse/touch event.
     * @return {object} The position.
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
     * Get the scrollbar size for a given axis.
     * @param {HTMLElement|Window} [node=window] The input node.
     * @param {HTMLElement|Document} [scrollNode=document] The scroll node.
     * @param {string} [axis] The axis to check.
     * @return {number} The scrollbar size.
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
     * Calculate the computed bounding rectangle of a node (minus scroll bars).
     * @param {HTMLElement|Window} node The input node.
     * @param {HTMLElement|Document} scrollNode The scroll node.
     * @return {object} The computed bounding rectangle of the node.
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
     * Get a target from a node.
     * @param {HTMLElement} node The input node.
     * @param {string} [closestSelector] The default closest selector.
     * @return {HTMLElement} The target node.
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
     * Get the target selector from a node.
     * @param {HTMLElement} node The input node.
     * @return {string} The target selector.
     */
    function getTargetSelector(node) {
        return $.getDataset(node, 'uiTarget') || $.getAttribute(node, 'href');
    }
    /**
     * Get positions from a touch event.
     * @param {Event} e The touch event.
     * @return {array} The positions.
     */
    function getTouchPositions(e) {
        return Array.from(e.touches)
            .map((touch) => ({ x: touch.pageX, y: touch.pageY }));
    }
    /**
     * Calculate the computed bounding rectangle of a window.
     * @param {Window} node The window object.
     * @return {object} The computed bounding rectangle of the window.
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
     * Initialize a UI component.
     * @param {string} key The component key.
     * @param {class} component The component class.
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
     * Reset body scrollbar padding.
     * @param {array} nodes The nodes.
     */
    function resetScrollPadding(nodes) {
        for (const node of nodes) {
            $.setStyle(node, {
                paddingRight: $.getDataset(node, 'uiPaddingRight'),
            });
            $.removeDataset(node, 'uiPaddingRight');
        }
    }

    /**
     * BaseComponent Class
     * @class
     */
    class BaseComponent {
        #node;
        #options;

        /**
         * Initialize a BaseComponent.
         * @param {HTMLElement} node The input node.
         * @return {BaseComponent} A new BaseComponent object.
         */
        static init(node, ...args) {
            return $.hasData(node, this.DATA_KEY) ?
                $.getData(node, this.DATA_KEY) :
                new this(node, ...args);
        }

        /**
         * New BaseComponent constructor.
         * @param {HTMLElement} node The input node.
         * @param {object} [options] The options to create the BaseComponent with.
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
         * Get the component node.
         * @return {HTMLElement} The component node.
         */
        get node() {
            return this.#node;
        }

        /**
         * Get the component options.
         * @return {object} The component options.
         */
        get options() {
            return this.#options;
        }

        /**
         * Dispose the BaseComponent.
         */
        dispose() {
            $.removeEvent(this.#node, this.constructor.REMOVE_EVENT);
            $.removeData(this.#node, this.constructor.DATA_KEY);
            this.#node = null;
            this.#options = null;
        }
    }

    /**
     * Alert Class
     * @class
     */
    class Alert extends BaseComponent {
        /**
         * Close the Alert.
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

    // Alert default options
    Alert.defaults = {
        duration: 100,
    };

    // Alert init
    initComponent('alert', Alert);

    // Alert events
    $.addEventDelegate(document, 'click.ui.alert', '[data-ui-dismiss="alert"]', (e) => {
        e.preventDefault();

        const target = getTarget(e.currentTarget, '.alert');
        const alert = Alert.init(target);
        alert.close();
    });

    /**
     * Button Class
     * @class
     */
    class Button extends BaseComponent {
        /**
         * Toggle the Button.
         */
        toggle() {
            $.toggleClass(this.node, 'active');

            const active = $.hasClass(this.node, 'active');
            $.setAttribute(this.node, { 'aria-pressed': active });
        }
    }

    // Button init
    initComponent('button', Button);

    // Button events
    $.addEventDelegate(document, 'click.ui.button keydown.ui.button', '[data-ui-toggle="button"]', (e) => {
        if (e.code && e.code !== 'Space') {
            return;
        }

        e.preventDefault();

        const button = Button.init(e.currentTarget);
        button.toggle();
    });

    /**
     * Get the direction offset from an index.
     * @param {number} index The index.
     * @param {number} totalItems The total number of items.
     * @return {number} The direction.
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
     * Get the direction from an offset and index.
     * @param {number} offset The direction offset.
     * @param {number} oldIndex The old item index.
     * @param {number} newIndex The new item index.
     * @return {string} The direction.
     */
    function getDirection$1(offset, oldIndex, newIndex) {
        if (offset == -1 || (offset == 0 && newIndex < oldIndex)) {
            return 'left';
        }

        return 'right';
    }
    /**
     * Get the real index from an index.
     * @param {number} index The item index.
     * @param {number} totalItems The total number of items.
     * @return {number} The real item index.
     */
    function getIndex(index, totalItems) {
        index %= totalItems;

        if (index < 0) {
            return totalItems + index;
        }

        return index;
    }

    /**
     * Carousel Class
     * @class
     */
    class Carousel extends BaseComponent {
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
                        direction = getDirection$1(offset, this._index, index);

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

            const direction = getDirection$1(offset, this._index, index);

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

    // Carousel default options
    Carousel.defaults = {
        interval: 5000,
        transition: 500,
        keyboard: true,
        ride: false,
        pause: true,
        wrap: true,
        swipe: true,
    };

    // Carousel init
    initComponent('carousel', Carousel);

    // Carousel events
    $((_) => {
        const nodes = $.find('[data-ui-ride="carousel"]');

        for (const node of nodes) {
            Carousel.init(node);
        }
    });

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

    $.addEventDelegate(document, 'click.ui.carousel', '[data-ui-slide-to]', (e) => {
        e.preventDefault();

        const target = getTarget(e.currentTarget, '.carousel');
        const carousel = Carousel.init(target);
        const slideTo = $.getDataset(e.currentTarget, 'uiSlideTo');

        carousel.show(slideTo);
    });

    let clickTarget;

    // Track the target of mousedown events
    $.addEvent(window, 'mousedown.ui', (e) => {
        clickTarget = e.target;
    }, { capture: true });

    $.addEvent(window, 'mouseup.ui', (_) => {
        setTimeout((_) => {
            clickTarget = null;
        }, 0);
    }, { capture: true });

    /**
     * Get a click event target.
     * @param {Event} e The click event.
     * @return {HTMLElement} The click event target.
     */
    function getClickTarget(e) {
        return clickTarget || e.target;
    }

    /**
     * Collapse Class
     * @class
     */
    class Collapse extends BaseComponent {
        /**
         * New Collapse constructor.
         * @param {HTMLElement} node The input node.
         * @param {object} [options] The options to create the Collapse with.
         */
        constructor(node, options) {
            super(node, options);

            this._triggers = $.find('[data-ui-toggle="collapse"]')
                .filter((trigger) => {
                    const selector = getTargetSelector(trigger);
                    return selector && $.is(this.node, selector);
                });

            if (this.options.parent) {
                this._parent = $.closest(this.node, this.options.parent).shift();
            }
        }

        /**
         * Dispose the Collapse.
         */
        dispose() {
            this._triggers = null;
            this._parent = null;

            super.dispose();
        }

        /**
         * Hide the element.
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
            $.addClass(this._triggers, 'collapsed');
            $.addClass(this._triggers, 'collapsing');

            $.squeezeOut(this.node, {
                direction: this.options.direction,
                duration: this.options.duration,
            }).then((_) => {
                $.removeClass(this.node, 'show');
                $.removeClass(this._triggers, 'collapsing');
                $.setAttribute(this._triggers, { 'aria-expanded': false });
                $.removeDataset(this.node, 'uiAnimating');
                $.triggerEvent(this.node, 'hidden.ui.collapse');
            }).catch((_) => {
                if ($.getDataset(this.node, 'uiAnimating') === 'out') {
                    $.removeDataset(this.node, 'uiAnimating');
                }
            });
        }

        /**
         * Show the element.
         */
        show() {
            if (
                $.getDataset(this.node, 'uiAnimating') ||
                $.hasClass(this.node, 'show')
            ) {
                return;
            }

            const collapses = [];
            if (this._parent) {
                const siblings = $.find('.collapse.show', this._parent);

                for (const sibling of siblings) {
                    const collapse = this.constructor.init(sibling);

                    if (!$.isSame(this._parent, collapse._parent)) {
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
            $.removeClass(this._triggers, 'collapsed');
            $.addClass(this._triggers, 'collapsing');

            $.squeezeIn(this.node, {
                direction: this.options.direction,
                duration: this.options.duration,
            }).then((_) => {
                $.removeClass(this._triggers, 'collapsing');
                $.setAttribute(this._triggers, { 'aria-expanded': true });
                $.removeDataset(this.node, 'uiAnimating');
                $.triggerEvent(this.node, 'shown.ui.collapse');
            }).catch((_) => {
                if ($.getDataset(this.node, 'uiAnimating') === 'in') {
                    $.removeDataset(this.node, 'uiAnimating');
                }
            });
        }

        /**
         * Toggle the element.
         */
        toggle() {
            if ($.hasClass(this.node, 'show')) {
                this.hide();
            } else {
                this.show();
            }
        }
    }

    // Collapse default options
    Collapse.defaults = {
        direction: 'bottom',
        duration: 250,
    };

    // Collapse init
    initComponent('collapse', Collapse);

    // Collapse events
    $.addEventDelegate(document, 'click.ui.collapse', '[data-ui-toggle="collapse"]', (e) => {
        e.preventDefault();

        const selector = getTargetSelector(e.currentTarget);
        const targets = $.find(selector);

        for (const target of targets) {
            const collapse = Collapse.init(target);
            collapse.toggle();
        }
    });

    /**
     * Popper Helpers
     */

    const poppers = new Set();

    let running$1 = false;

    /**
     * Add a Popper to the set, and attach the Popper events.
     * @param {Popper} popper The Popper.
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
     * Get the actual placement of the Popper.
     * @param {DOMRect} nodeBox The computed bounding rectangle of the node.
     * @param {DOMRect} referenceBox The computed bounding rectangle of the reference.
     * @param {object} minimumBox The computed minimum bounding rectangle of the container.
     * @param {string} placement The initial placement of the Popper.
     * @param {number} spacing The amount of spacing to use.
     * @return {string} The new placement of the Popper.
     */
    function getPopperPlacement(nodeBox, referenceBox, minimumBox, placement, spacing) {
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
    }
    /**
     * Remove a Popper from the set, and detach the Popper events.
     * @param {Popper} popper The Popper.
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

    /**
     * Popper Class
     * @class
     */
    class Popper extends BaseComponent {
        /**
         * New Popper constructor.
         * @param {HTMLElement} node The input node.
         * @param {object} options The options to create the Popper with.
         */
        constructor(node, options) {
            super(node, options);

            this._placement = $.getDataset(this.node, 'uiPlacement');
            this._referencePlacement = $.getDataset(this.options.reference, 'uiPlacement');

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

        /**
         * Update the arrow.
         * @param {string} placement The placement of the Popper.
         * @param {string} position The position of the Popper.
         */
        _updateArrow(placement, position) {
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

        /**
         * Dispose the Popper.
         */
        dispose() {
            if (this._placement) {
                $.setDataset(this.node, { uiPlacement: this._placement });
            } else {
                $.removeDataset(this.node, 'uiPlacement');
            }

            if (!this.options.noAttributes) {
                if (this._referencePlacement) {
                    $.setDataset(this.options.reference, { uiPlacement: this._referencePlacement });
                } else {
                    $.removeDataset(this.options.reference, 'uiPlacement');
                }
            }

            removePopper(this);

            super.dispose();
        }

        /**
         * Check whether a scroll target affects the Popper.
         * @param {HTMLElement|Document} target The scroll target.
         * @return {boolean} Whether the Popper should update.
         */
        shouldUpdateForScroll(target) {
            return $._isDocument(target) ||
                $.hasDescendent(target, this.node) ||
                $.hasDescendent(target, this.options.reference);
        }

        /**
         * Update the Popper position.
         */
        update() {
            if (!$.isConnected(this.node) || !$.isVisible(this.node)) {
                return;
            }

            // reset position
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

            // calculate boxes
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

            // get optimal placement
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

            // get auto position
            const position = this.options.position;

            // calculate actual offset
            const offset = {
                x: Math.round(referenceBox.x),
                y: Math.round(referenceBox.y),
            };

            // offset for relative parent
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

            // offset for placement
            if (placement === 'top') {
                offset.y -= Math.round(nodeBox.height) + this.options.spacing;
            } else if (placement === 'right') {
                offset.x += Math.round(referenceBox.width) + this.options.spacing;
            } else if (placement === 'bottom') {
                offset.y += Math.round(referenceBox.height) + this.options.spacing;
            } else if (placement === 'left') {
                offset.x -= Math.round(nodeBox.width) + this.options.spacing;
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
            offset.x -= parseInt($.css(this.node, 'marginLeft'));
            offset.y -= parseInt($.css(this.node, 'marginTop'));

            // corrective positioning
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

                const minSize = this.options.minContact !== null ?
                    this.options.minContact :
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
            if (this.options.useGpu) {
                style.transform = `translate3d(${offset.x}px , ${offset.y}px , 0)`;
            } else {
                style.marginLeft = `${offset.x}px`;
                style.marginTop = `${offset.y}px`;
            }

            $.setStyle(this.node, style);

            // update arrow
            if (this.options.arrow) {
                this._updateArrow(placement, position);
            }

            if (this.options.afterUpdate) {
                this.options.afterUpdate(this.node, this.options.reference, placement, position);
            }
        }
    }

    /**
     * Dropdown Class
     * @class
     */
    class Dropdown extends BaseComponent {
        #display;

        /**
         * New Dropdown constructor.
         * @param {HTMLElement} node The input node.
         * @param {object} [options] The options to create the Dropdown with.
         */
        constructor(node, options) {
            super(node, options);

            this.#display = this.options.display;
            this._menuNode = $.next(this.node, '.dropdown-menu').shift();

            if (this.options.reference) {
                if (this.options.reference === 'parent') {
                    this._referenceNode = $.parent(this.node).shift();
                } else {
                    this._referenceNode = $.findOne(this.options.reference);
                }
            } else {
                this._referenceNode = this.node;
            }

            // Attach popper
            if (this.#display !== 'static' && $.closest(this.node, '.navbar-nav').length) {
                this.#display = 'static';
            }
        }

        /**
         * Check whether the Dropdown menu contains a target.
         * @param {HTMLElement} target The target node.
         * @return {boolean} Whether the menu contains the target.
         */
        containsMenuTarget(target) {
            return $.hasDescendent(this._menuNode, target);
        }

        /**
         * Dispose the Dropdown.
         */
        dispose() {
            if (this._popper) {
                this._popper.dispose();
                this._popper = null;
            }

            this._menuNode = null;
            this._referenceNode = null;

            super.dispose();
        }

        /**
         * Focus the first Dropdown menu item.
         */
        focusFirstItem() {
            const focusNode = $.findOne('.dropdown-item:not([tabindex="-1"])', this._menuNode);
            $.focus(focusNode);
        }

        /**
         * Hide the Dropdown.
         */
        hide() {
            if (
                $.getDataset(this._menuNode, 'uiAnimating') ||
                !$.hasClass(this._menuNode, 'show') ||
                !$.triggerOne(this.node, 'hide.ui.dropdown')
            ) {
                return;
            }

            $.setDataset(this._menuNode, { uiAnimating: 'out' });

            $.fadeOut(this._menuNode, {
                duration: this.options.duration,
            }).then((_) => {
                if (this._popper) {
                    this._popper.dispose();
                    this._popper = null;
                }

                $.removeClass(this._menuNode, 'show');
                $.setAttribute(this.node, { 'aria-expanded': false });
                $.removeDataset(this._menuNode, 'uiAnimating');
                $.triggerEvent(this.node, 'hidden.ui.dropdown');
            }).catch((_) => {
                if ($.getDataset(this._menuNode, 'uiAnimating') === 'out') {
                    $.removeDataset(this._menuNode, 'uiAnimating');
                }
            });
        }

        /**
         * Check whether the Dropdown should close for a target.
         * @param {HTMLElement} target The target node.
         * @return {boolean} Whether the Dropdown should close.
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
                    !$.isSame(this._menuNode, target) &&
                    (
                        autoClose === 'inside' ||
                        autoClose === false
                    )
                )
            );
        }

        /**
         * Show the Dropdown.
         */
        show() {
            if (
                $.getDataset(this._menuNode, 'uiAnimating') ||
                $.hasClass(this._menuNode, 'show') ||
                !$.triggerOne(this.node, 'show.ui.dropdown')
            ) {
                return;
            }

            $.setDataset(this._menuNode, { uiAnimating: 'in' });
            $.addClass(this._menuNode, 'show');

            if (this.#display === 'dynamic') {
                this._popper = new Popper(this._menuNode, {
                    reference: this._referenceNode,
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

            $.fadeIn(this._menuNode, {
                duration: this.options.duration,
            }).then((_) => {
                $.setAttribute(this.node, { 'aria-expanded': true });
                $.removeDataset(this._menuNode, 'uiAnimating');
                $.triggerEvent(this.node, 'shown.ui.dropdown');
            }).catch((_) => {
                if ($.getDataset(this._menuNode, 'uiAnimating') === 'in') {
                    $.removeDataset(this._menuNode, 'uiAnimating');
                }
            });
        }

        /**
         * Toggle the Dropdown.
         */
        toggle() {
            if ($.hasClass(this._menuNode, 'show')) {
                this.hide();
            } else {
                this.show();
            }
        }

        /**
         * Update the Dropdown position.
         */
        update() {
            if (this._popper) {
                this._popper.update();
            }
        }
    }

    // Dropdown default options
    Dropdown.defaults = {
        display: 'dynamic',
        duration: 100,
        placement: 'bottom',
        position: 'start',
        fixed: false,
        spacing: 3,
        minContact: false,
    };

    // Dropdown init
    initComponent('dropdown', Dropdown);

    // Dropdown events
    $.addEventDelegate(document, 'click.ui.dropdown keydown.ui.dropdown', '[data-ui-toggle="dropdown"]', (e) => {
        if (e.code && e.code !== 'Space') {
            return;
        }

        e.preventDefault();

        const dropdown = Dropdown.init(e.currentTarget);
        dropdown.toggle();
    });

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

    /**
     * FocusTrap Helpers
     */

    const focusTraps = new Set();

    let running = false;
    let reverse = false;

    /**
     * Add a FocusTrap to the set, and attach the FocusTrap events.
     * @param {FocusTrap} focusTrap The FocusTrap.
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
     * Remove a FocusTrap from the set, and detach the FocusTrap events.
     * @param {FocusTrap} focusTrap The FocusTrap.
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
     * FocusTrap Class
     * @class
     */
    class FocusTrap extends BaseComponent {
        /**
         * Activate the FocusTrap.
         */
        activate() {
            if (this._active) {
                return;
            }

            addFocusTrap(this);

            if (this.options.autoFocus) {
                $.focus(this.node);
            }

            this._active = true;
        }

        /**
         * Deactivate the FocusTrap.
         */
        deactivate() {
            if (!this._active) {
                return;
            }

            removeFocusTrap(this);
            this._active = false;
        }

        /**
         * Dispose the FocusTrap.
         */
        dispose() {
            this.deactivate();

            super.dispose();
        }
    }

    // FocusTrap default options
    FocusTrap.defaults = {
        autoFocus: true,
    };

    // FocusTrap init
    initComponent('focustrap', FocusTrap);

    /**
     * Modal Class
     * @class
     */
    class Modal extends BaseComponent {
        /**
         * New Modal constructor.
         * @param {HTMLElement} node The input node.
         * @param {object} [options] The options to create the Modal with.
         */
        constructor(node, options) {
            super(node, options);

            this._dialog = $.child(this.node, '.modal-dialog').shift();

            if (this.options.show) {
                this.show();
            }

            if (this.options.focus) {
                this._focusTrap = FocusTrap.init(this.node);
            }
        }

        /**
         * Start a zoom in/out animation.
         */
        _zoom() {
            if ($.getDataset(this._dialog, 'uiAnimating')) {
                return;
            }

            $.stop(this._dialog);

            $.animate(
                this._dialog,
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

        /**
         * Dispose the Modal.
         */
        dispose() {
            if (this._focusTrap) {
                this._focusTrap.dispose();
                this._focusTrap = null;
            }

            this._dialog = null;
            this._activeTarget = null;
            this._backdrop = null;
            this._scrollNodes = null;

            super.dispose();
        }

        /**
         * Handle a backdrop interaction.
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
                this._zoom();
                return;
            }

            this.hide();
        }

        /**
         * Handle an escape key interaction.
         */
        handleEscape() {
            if (!this.options.keyboard) {
                return;
            }

            if (this.options.backdrop === 'static') {
                this._zoom();
                return;
            }

            this.hide();
        }

        /**
         * Hide the Modal.
         */
        hide() {
            if (
                $.getDataset(this._dialog, 'uiAnimating') ||
                !$.hasClass(this.node, 'show') ||
                !$.triggerOne(this.node, 'hide.ui.modal')
            ) {
                return;
            }

            $.stop(this._dialog);
            $.setDataset(this._dialog, { uiAnimating: 'out' });

            if (this._focusTrap) {
                this._focusTrap.deactivate();
            }

            const stackSize = $.find('.modal.show').length - 1;

            Promise.all([
                $.fadeOut(this._dialog, {
                    duration: this.options.duration,
                }),
                $.dropOut(this._dialog, {
                    duration: this.options.duration,
                    direction: 'top',
                }),
                $.fadeOut(this._backdrop, {
                    duration: this.options.duration,
                }),
            ]).then((_) => {
                $.setAttribute(this.node, {
                    'aria-hidden': true,
                    'aria-modal': false,
                });

                resetScrollPadding(this._scrollNodes);
                this._scrollNodes = [];

                if (stackSize) {
                    $.setStyle(this.node, { zIndex: '' });
                } else {
                    $.removeClass(document.body, 'modal-open');
                }

                $.removeClass(this.node, 'show');

                if (this.options.backdrop) {
                    $.remove(this._backdrop);
                    this._backdrop = null;
                }

                if (this._activeTarget) {
                    $.focus(this._activeTarget);
                    this._activeTarget = null;
                }

                $.removeDataset(this._dialog, 'uiAnimating');
                $.triggerEvent(this.node, 'hidden.ui.modal');
            }).catch((_) => {
                if ($.getDataset(this._dialog, 'uiAnimating') === 'out') {
                    $.removeDataset(this._dialog, 'uiAnimating');
                }
            });
        }

        /**
         * Show the Modal.
         * @param {HTMLElement} [relatedTarget] The element that triggered the Modal.
         */
        show(relatedTarget) {
            if (relatedTarget) {
                this._activeTarget = relatedTarget;
            }

            if (
                $.getDataset(this._dialog, 'uiAnimating') ||
                $.hasClass(this.node, 'show') ||
                !$.triggerOne(this.node, 'show.ui.modal', { data: { relatedTarget: this._activeTarget } })
            ) {
                return;
            }

            $.setDataset(this._dialog, { uiAnimating: 'in' });

            const stackSize = $.find('.modal.show').length;

            $.removeClass(document.body, 'modal-open');

            this._scrollNodes = [this._dialog];

            if (stackSize) {
                let zIndex = $.css(this.node, 'zIndex');
                zIndex = parseInt(zIndex);
                zIndex += stackSize * 20;

                $.setStyle(this.node, { zIndex });
            } else if (!$.findOne('.offcanvas.show')) {
                this._scrollNodes.push(document.body);
                this._scrollNodes.push(...$.find('.fixed-top, .fixed-bottom, .sticky-top'));
            }

            addScrollPadding(this._scrollNodes);

            $.addClass(document.body, 'modal-open');

            $.addClass(this.node, 'show');

            if (this.options.backdrop) {
                this._backdrop = $.create('div', {
                    class: 'modal-backdrop',
                });

                $.append(document.body, this._backdrop);

                if (stackSize) {
                    let zIndex = $.css(this._backdrop, 'zIndex');
                    zIndex = parseInt(zIndex);
                    zIndex += stackSize * 20;

                    $.setStyle(this._backdrop, { zIndex });
                }
            }

            Promise.all([
                $.fadeIn(this._dialog, {
                    duration: this.options.duration,
                }),
                $.dropIn(this._dialog, {
                    duration: this.options.duration,
                    direction: 'top',
                }),
                $.fadeIn(this._backdrop, {
                    duration: this.options.duration,
                }),
            ]).then((_) => {
                $.setAttribute(this.node, {
                    'aria-hidden': false,
                    'aria-modal': true,
                });

                if (this._focusTrap) {
                    this._focusTrap.activate();
                }

                $.removeDataset(this._dialog, 'uiAnimating');
                $.triggerEvent(this.node, 'shown.ui.modal');
            }).catch((_) => {
                if ($.getDataset(this._dialog, 'uiAnimating') === 'in') {
                    $.removeDataset(this._dialog, 'uiAnimating');
                }
            });
        }

        /**
         * Toggle the Modal.
         */
        toggle() {
            if ($.hasClass(this.node, 'show')) {
                this.hide();
            } else {
                this.show();
            }
        }
    }

    /**
     * Modal Helpers
     */

    /**
     * Get the top modal.
     * @return {Modal} The Modal.
     */
    function getTopModal() {
        const nodes = $.find('.modal.show');

        if (!nodes.length) {
            return null;
        }

        // find modal with highest zIndex
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

    // Modal default options
    Modal.defaults = {
        duration: 250,
        backdrop: true,
        focus: true,
        show: false,
        keyboard: true,
    };

    // Modal init
    initComponent('modal', Modal);

    // Modal events
    $.addEventDelegate(document, 'click.ui.modal', '[data-ui-toggle="modal"]', (e) => {
        e.preventDefault();

        const target = getTarget(e.currentTarget, '.modal');
        const modal = Modal.init(target);
        modal.show(e.currentTarget);
    });

    $.addEventDelegate(document, 'click.ui.modal', '[data-ui-dismiss="modal"]', (e) => {
        e.preventDefault();

        const target = getTarget(e.currentTarget, '.modal');
        const modal = Modal.init(target);
        modal.hide();
    });

    // Events must be attached to the window, so offcanvas events are triggered first
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

    /**
     * Offcanvas Helpers
     */

    /**
     * Get the slide animation direction.
     * @param {HTMLElement} node The offcanvas node.
     * @return {string} The animation direction.
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
     * Offcanvas Class
     * @class
     */
    class Offcanvas extends BaseComponent {
        /**
         * New Offcanvas constructor.
         * @param {HTMLElement} node The input node.
         * @param {object} [options] The options to create the Offcanvas with.
         */
        constructor(node, options) {
            super(node, options);

            if (!this.options.scroll || this.options.backdrop) {
                this._focusTrap = FocusTrap.init(this.node);
            }
        }

        /**
         * Dispose the Offcanvas.
         */
        dispose() {
            if (this._focusTrap) {
                this._focusTrap.dispose();
                this._focusTrap = null;
            }

            this._activeTarget = null;
            this._scrollNodes = null;

            super.dispose();
        }

        /**
         * Handle a backdrop interaction.
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
         * Handle an escape key interaction.
         */
        handleEscape() {
            if (this.options.keyboard) {
                this.hide();
            }
        }

        /**
         * Hide the Offcanvas.
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

            if (this._focusTrap) {
                this._focusTrap.deactivate();
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
                    resetScrollPadding(this._scrollNodes);
                    this._scrollNodes = [];

                    $.setStyle(document.body, { overflow: '' });
                }

                if (this._activeTarget) {
                    $.focus(this._activeTarget);
                    this._activeTarget = null;
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
         * Show the Offcanvas.
         * @param {HTMLElement} [relatedTarget] The element that triggered the Offcanvas.
         */
        show(relatedTarget) {
            if (relatedTarget) {
                this._activeTarget = relatedTarget;
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

            this._scrollNodes = [];

            if (!this.options.scroll) {
                this._scrollNodes.push(document.body);
                this._scrollNodes.push(...$.find('.fixed-top, .fixed-bottom, .sticky-top'));

                addScrollPadding(this._scrollNodes);

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

                if (this._focusTrap) {
                    this._focusTrap.activate();
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
         * Toggle the Offcanvas.
         */
        toggle() {
            if ($.hasClass(this.node, 'show')) {
                this.hide();
            } else {
                this.show();
            }
        }
    }

    // Offcanvas default options
    Offcanvas.defaults = {
        duration: 250,
        backdrop: true,
        keyboard: true,
        scroll: false,
    };

    // Offcanvas init
    initComponent('offcanvas', Offcanvas);

    // Offcanvas events
    $.addEventDelegate(document, 'click.ui.offcanvas', '[data-ui-toggle="offcanvas"]', (e) => {
        e.preventDefault();

        const target = getTarget(e.currentTarget, '.offcanvas');
        const offcanvas = Offcanvas.init(target);
        offcanvas.show(e.currentTarget);
    });

    $.addEventDelegate(document, 'click.ui.offcanvas', '[data-ui-dismiss="offcanvas"]', (e) => {
        e.preventDefault();

        const target = getTarget(e.currentTarget, '.offcanvas');
        const offcanvas = Offcanvas.init(target);
        offcanvas.hide();
    });

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

    // Popper default options
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

    // Popper init
    initComponent('popper', Popper);

    /**
     * Popover Class
     * @class
     */
    class Popover extends BaseComponent {
        /**
         * New Popover constructor.
         * @param {HTMLElement} node The input node.
         * @param {object} [options] The options to create the Popover with.
         */
        constructor(node, options) {
            super(node, options);

            this._modal = $.closest(this.node, '.modal').shift();

            this._triggers = this.options.trigger.split(' ');

            this._render();
            this._events();

            if (this.options.enable) {
                this.enable();
            }

            this.refresh();
        }

        /**
         * Attach events for the Popover.
         */
        _events() {
            if (this._triggers.includes('hover')) {
                $.addEvent(this.node, 'mouseover.ui.popover', (_) => {
                    this._stop();
                    this.show();
                });

                $.addEvent(this.node, 'mouseout.ui.popover', (_) => {
                    this._stop();
                    this.hide({ force: false });
                });
            }

            if (this._triggers.includes('focus')) {
                $.addEvent(this.node, 'focus.ui.popover', (_) => {
                    this._stop();
                    this.show();
                });

                $.addEvent(this.node, 'blur.ui.popover', (_) => {
                    this._stop();
                    this.hide({ force: false });
                });
            }

            if (this._triggers.includes('click')) {
                $.addEvent(this.node, 'click.ui.popover', (e) => {
                    e.preventDefault();

                    this._stop();
                    this.toggle({ force: false });
                });
            }

            if (this._modal) {
                this._hideModalEvent = (_) => {
                    this._stop();
                    this.hide();
                };
                $.addEvent(this._modal, 'hide.ui.modal', this._hideModalEvent);
            }
        }

        /**
         * Render the Popover element.
         */
        _render() {
            this._popover = $.parseHTML(this.options.template).shift();
            if (this.options.customClass) {
                $.addClass(this._popover, this.options.customClass);
            }
            this._arrow = $.findOne('.popover-arrow', this._popover);
            this._popoverHeader = $.findOne('.popover-header', this._popover);
            this._popoverBody = $.findOne('.popover-body', this._popover);
        }

        /**
         * Update the Popover and append to the DOM.
         */
        _show() {
            if (this.options.appendTo) {
                $.append(this.options.appendTo, this._popover);
            } else {
                $.after(this.node, this._popover);
            }

            if (!this.options.noAttributes) {
                const id = generateId(this.constructor.DATA_KEY);
                $.setAttribute(this._popover, { id });
                $.setAttribute(this.node, { 'aria-described-by': id });
            }

            this._popper = new Popper(
                this._popover,
                {
                    reference: this.node,
                    arrow: this._arrow,
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
         * Stop the animations.
         */
        _stop() {
            if (!this._enabled) {
                return;
            }

            const animating = $.getDataset(this._popover, 'uiAnimating');

            if (!animating) {
                return;
            }

            $.stop(this._popover, { finish: false });
            $.removeDataset(this._popover, 'uiAnimating');

            if (animating === 'out') {
                this._popper.dispose();
                this._popper = null;

                $.detach(this._popover);
            }
        }

        /**
         * Disable the Popover.
         */
        disable() {
            this._enabled = false;
        }

        /**
         * Dispose the Popover.
         */
        dispose() {
            if ($.hasDataset(this.node, 'uiOriginalTitle')) {
                const title = $.getDataset(this.node, 'uiOriginalTitle');
                $.setAttribute(this.node, { title });
                $.removeDataset(this.node, 'uiOriginalTitle');
            }

            if (this._popper) {
                this._popper.dispose();
                this._popper = null;
            }

            $.remove(this._popover);

            if (this._triggers.includes('hover')) {
                $.removeEvent(this.node, 'mouseover.ui.popover');
                $.removeEvent(this.node, 'mouseout.ui.popover');
            }

            if (this._triggers.includes('focus')) {
                $.removeEvent(this.node, 'focus.ui.popover');
                $.removeEvent(this.node, 'blur.ui.popover');
            }

            if (this._triggers.includes('click')) {
                $.removeEvent(this.node, 'click.ui.popover');
            }

            if (this._modal) {
                $.removeEvent(this._modal, 'hide.ui.modal', this._hideModalEvent);
            }

            this._modal = null;
            this._triggers = null;
            this._popover = null;
            this._popoverHeader = null;
            this._popoverBody = null;
            this._arrow = null;
            this._hideModalEvent = null;

            super.dispose();
        }

        /**
         * Enable the Popover.
         */
        enable() {
            this._enabled = true;
        }

        /**
         * Hide the Popover.
         * @param {object} [options] The hide options.
         * @param {boolean} [options.force=true] Whether to force hiding when disabled.
         */
        hide({ force = true } = {}) {
            if (
                (!force && !this._enabled) ||
                $.getDataset(this._popover, 'uiAnimating') ||
                !$.isConnected(this._popover) ||
                !$.triggerOne(this.node, 'hide.ui.popover')
            ) {
                return;
            }

            $.setDataset(this._popover, { uiAnimating: 'out' });

            $.fadeOut(this._popover, {
                duration: this.options.duration,
            }).then((_) => {
                this._popper.dispose();
                this._popper = null;

                $.detach(this._popover);
                $.removeDataset(this._popover, 'uiAnimating');
                $.removeAttribute(this.node, 'aria-described-by');
                $.triggerEvent(this.node, 'hidden.ui.popover');
            }).catch((_) => {
                if ($.getDataset(this._popover, 'uiAnimating') === 'out') {
                    $.removeDataset(this._popover, 'uiAnimating');
                }
            });
        }

        /**
         * Refresh the Popover.
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
                this._popoverHeader,
                this.options.html && this.options.sanitize ?
                    this.options.sanitize(title) :
                    title,
            );

            if (!title) {
                $.hide(this._popoverHeader);
            } else {
                $.show(this._popoverHeader);
            }

            $[method](
                this._popoverBody,
                this.options.html && this.options.sanitize ?
                    this.options.sanitize(content) :
                    content,
            );
        }

        /**
         * Show the Popover.
         */
        show() {
            if (
                !this._enabled ||
                $.getDataset(this._popover, 'uiAnimating') ||
                $.isConnected(this._popover) ||
                !$.triggerOne(this.node, 'show.ui.popover')
            ) {
                return;
            }

            $.setDataset(this._popover, { uiAnimating: 'in' });
            this.refresh();
            this._show();

            $.fadeIn(this._popover, {
                duration: this.options.duration,
            }).then((_) => {
                $.removeDataset(this._popover, 'uiAnimating');
                $.triggerEvent(this.node, 'shown.ui.popover');
            }).catch((_) => {
                if ($.getDataset(this._popover, 'uiAnimating') === 'in') {
                    $.removeDataset(this._popover, 'uiAnimating');
                }
            });
        }

        /**
         * Toggle the Popover.
         * @param {object} [options] The toggle options.
         * @param {boolean} [options.force=true] Whether to force hiding when disabled.
         */
        toggle({ force = true } = {}) {
            if ($.isConnected(this._popover)) {
                this.hide({ force });
            } else {
                this.show();
            }
        }

        /**
         * Update the Popover position.
         */
        update() {
            if (this._popper) {
                this._popper.update();
            }
        }
    }

    // Popover default options
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

    // Popover init
    initComponent('popover', Popover);

    /**
     * Tab Class
     * @class
     */
    class Tab extends BaseComponent {
        /**
         * New Tab constructor.
         * @param {HTMLElement} node The input node.
         * @param {object} [options] The options to create the Tab with.
         */
        constructor(node, options) {
            super(node, options);

            const selector = getTargetSelector(this.node);
            this._target = $.findOne(selector);
            this._siblings = $.siblings(this.node);
        }

        /**
         * Hide the current Tab (forcefully).
         */
        _hide() {
            $.setDataset(this._target, { uiAnimating: 'out' });

            $.fadeOut(this._target, {
                duration: this.options.duration,
            }).then((_) => {
                $.removeClass(this._target, 'active');
                $.removeClass(this.node, 'active');
                $.removeDataset(this._target, 'uiAnimating');
                $.setAttribute(this.node, { 'aria-selected': false });
                $.triggerEvent(this.node, 'hidden.ui.tab');
            }).catch((_) => {
                if ($.getDataset(this._target, 'uiAnimating') === 'out') {
                    $.removeDataset(this._target, 'uiAnimating');
                }
            });
        }

        /**
         * Show the current Tab (forcefully).
         */
        _show() {
            $.setDataset(this._target, { uiAnimating: 'in' });

            $.addClass(this._target, 'active');
            $.addClass(this.node, 'active');

            $.fadeIn(this._target, {
                duration: this.options.duration,
            }).then((_) => {
                $.setAttribute(this.node, { 'aria-selected': true });
                $.removeDataset(this._target, 'uiAnimating');
                $.triggerEvent(this.node, 'shown.ui.tab');
            }).catch((_) => {
                if ($.getDataset(this._target, 'uiAnimating') === 'in') {
                    $.removeDataset(this._target, 'uiAnimating');
                }
            });
        }

        /**
         * Dispose the Tab.
         */
        dispose() {
            this._target = null;
            this._siblings = null;

            super.dispose();
        }

        /**
         * Hide the current Tab.
         */
        hide() {
            if (
                $.getDataset(this._target, 'uiAnimating') ||
                !$.hasClass(this._target, 'active') ||
                !$.triggerOne(this.node, 'hide.ui.tab')
            ) {
                return;
            }

            this._hide();
        }

        /**
         * Hide any active Tabs, and show the current Tab.
         */
        show() {
            if (
                $.getDataset(this._target, 'uiAnimating') ||
                $.hasClass(this._target, 'active') ||
                !$.triggerOne(this.node, 'show.ui.tab')
            ) {
                return;
            }

            const active = this._siblings.find((sibling) =>
                $.hasClass(sibling, 'active'),
            );

            if (!active) {
                this._show();
            } else {
                const activeTab = this.constructor.init(active);

                if ($.getDataset(activeTab._target, 'uiAnimating')) {
                    return;
                }

                if (!$.triggerOne(active, 'hide.ui.tab')) {
                    return;
                }

                $.addEventOnce(active, 'hidden.ui.tab', (_) => {
                    this._show();
                });

                activeTab._hide();
            }
        }
    }

    // Tab default options
    Tab.defaults = {
        duration: 100,
    };

    // Tab init
    initComponent('tab', Tab);

    // Tab events
    $.addEventDelegate(document, 'click.ui.tab keydown.ui.tab', '[data-ui-toggle="tab"]', (e) => {
        if (e.code && e.code !== 'Space') {
            return;
        }

        e.preventDefault();

        const tab = Tab.init(e.currentTarget);
        tab.show();
    });

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
     * Toast Class
     * @class
     */
    class Toast extends BaseComponent {
        /**
         * Dispose the Toast.
         */
        dispose() {
            clearTimeout(this._timer);
            this._timer = null;

            super.dispose();
        }

        /**
         * Hide the Toast.
         */
        hide() {
            if (
                $.getDataset(this.node, 'uiAnimating') ||
                !$.isVisible(this.node) ||
                !$.triggerOne(this.node, 'hide.ui.toast')
            ) {
                return;
            }

            clearTimeout(this._timer);
            this._timer = null;

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
         * Show the Toast.
         */
        show() {
            if (
                $.getDataset(this.node, 'uiAnimating') ||
                $.isVisible(this.node) ||
                !$.triggerOne(this.node, 'show.ui.toast')
            ) {
                return;
            }

            clearTimeout(this._timer);
            this._timer = null;

            $.setDataset(this.node, { uiAnimating: 'in' });
            $.setStyle(this.node, { display: '' });
            $.addClass(this.node, 'show');

            $.fadeIn(this.node, {
                duration: this.options.duration,
            }).then((_) => {
                $.removeDataset(this.node, 'uiAnimating');
                $.triggerEvent(this.node, 'shown.ui.toast');

                if (this.options.autohide) {
                    this._timer = setTimeout(
                        (_) => {
                            this._timer = null;
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

    // Toast default options
    Toast.defaults = {
        autohide: true,
        delay: 5000,
        duration: 100,
    };

    // Toast init
    initComponent('toast', Toast);

    // Toast events
    $.addEventDelegate(document, 'click.ui.toast', '[data-ui-dismiss="toast"]', (e) => {
        e.preventDefault();

        const target = getTarget(e.currentTarget, '.toast');
        const toast = Toast.init(target, { autohide: false });
        toast.hide();
    });

    /**
     * Tooltip Class
     * @class
     */
    class Tooltip extends BaseComponent {
        /**
         * New Tooltip constructor.
         * @param {HTMLElement} node The input node.
         * @param {object} [options] The options to create the Tooltip with.
         */
        constructor(node, options) {
            super(node, options);

            this._modal = $.closest(this.node, '.modal').shift();

            this._triggers = this.options.trigger.split(' ');

            this._render();
            this._events();

            if (this.options.enable) {
                this.enable();
            }

            this.refresh();
        }

        /**
         * Attach events for the Tooltip.
         */
        _events() {
            if (this._triggers.includes('hover')) {
                $.addEvent(this.node, 'mouseover.ui.tooltip', (_) => {
                    this._stop();
                    this.show();
                });

                $.addEvent(this.node, 'mouseout.ui.tooltip', (_) => {
                    this._stop();
                    this.hide({ force: false });
                });
            }

            if (this._triggers.includes('focus')) {
                $.addEvent(this.node, 'focus.ui.tooltip', (_) => {
                    this._stop();
                    this.show();
                });

                $.addEvent(this.node, 'blur.ui.tooltip', (_) => {
                    this._stop();
                    this.hide({ force: false });
                });
            }

            if (this._triggers.includes('click')) {
                $.addEvent(this.node, 'click.ui.tooltip', (e) => {
                    e.preventDefault();

                    this._stop();
                    this.toggle({ force: false });
                });
            }

            if (this._modal) {
                this._hideModalEvent = (_) => {
                    this._stop();
                    this.hide();
                };
                $.addEvent(this._modal, 'hide.ui.modal', this._hideModalEvent);
            }
        }

        /**
         * Render the Tooltip element.
         */
        _render() {
            this._tooltip = $.parseHTML(this.options.template).shift();
            if (this.options.customClass) {
                $.addClass(this._tooltip, this.options.customClass);
            }
            this._arrow = $.findOne('.tooltip-arrow', this._tooltip);
            this._tooltipInner = $.findOne('.tooltip-inner', this._tooltip);
        }

        /**
         * Update the Tooltip and append to the DOM.
         */
        _show() {
            if (this.options.appendTo) {
                $.append(this.options.appendTo, this._tooltip);
            } else {
                $.after(this.node, this._tooltip);
            }

            if (!this.options.noAttributes) {
                const id = generateId(this.constructor.DATA_KEY);
                $.setAttribute(this._tooltip, { id });
                $.setAttribute(this.node, { 'aria-described-by': id });
            }

            this._popper = new Popper(
                this._tooltip,
                {
                    reference: this.node,
                    arrow: this._arrow,
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
         * Stop the animations.
         */
        _stop() {
            if (!this._enabled) {
                return;
            }

            const animating = $.getDataset(this._tooltip, 'uiAnimating');

            if (!animating) {
                return;
            }

            $.stop(this._tooltip, { finish: false });
            $.removeDataset(this._tooltip, 'uiAnimating');

            if (animating === 'out') {
                this._popper.dispose();
                this._popper = null;

                $.removeClass(this._tooltip, 'show');
                $.detach(this._tooltip);
            }
        }

        /**
         * Disable the Tooltip.
         */
        disable() {
            this._enabled = false;
        }

        /**
         * Dispose the Tooltip.
         */
        dispose() {
            if ($.hasDataset(this.node, 'uiOriginalTitle')) {
                const title = $.getDataset(this.node, 'uiOriginalTitle');
                $.setAttribute(this.node, { title });
                $.removeDataset(this.node, 'uiOriginalTitle');
            }

            if (this._popper) {
                this._popper.dispose();
                this._popper = null;
            }

            $.remove(this._tooltip);

            if (this._triggers.includes('hover')) {
                $.removeEvent(this.node, 'mouseover.ui.tooltip');
                $.removeEvent(this.node, 'mouseout.ui.tooltip');
            }

            if (this._triggers.includes('focus')) {
                $.removeEvent(this.node, 'focus.ui.tooltip');
                $.removeEvent(this.node, 'blur.ui.tooltip');
            }

            if (this._triggers.includes('click')) {
                $.removeEvent(this.node, 'click.ui.tooltip');
            }

            if (this._modal) {
                $.removeEvent(this._modal, 'hide.ui.modal', this._hideModalEvent);
            }

            this._modal = null;
            this._triggers = null;
            this._tooltip = null;
            this._tooltipInner = null;
            this._arrow = null;
            this._hideModalEvent = null;

            super.dispose();
        }

        /**
         * Enable the Tooltip.
         */
        enable() {
            this._enabled = true;
        }

        /**
         * Hide the Tooltip.
         * @param {object} [options] The hide options.
         * @param {boolean} [options.force=true] Whether to force hiding when disabled.
         */
        hide({ force = true } = {}) {
            if (
                (!force && !this._enabled) ||
                $.getDataset(this._tooltip, 'uiAnimating') ||
                !$.isConnected(this._tooltip) ||
                !$.triggerOne(this.node, 'hide.ui.tooltip')
            ) {
                return;
            }

            $.setDataset(this._tooltip, { uiAnimating: 'out' });

            $.fadeOut(this._tooltip, {
                duration: this.options.duration,
            }).then((_) => {
                this._popper.dispose();
                this._popper = null;

                $.removeClass(this._tooltip, 'show');
                $.detach(this._tooltip);
                $.removeDataset(this._tooltip, 'uiAnimating');
                $.removeAttribute(this.node, 'aria-described-by');
                $.triggerEvent(this.node, 'hidden.ui.tooltip');
            }).catch((_) => {
                if ($.getDataset(this._tooltip, 'uiAnimating') === 'out') {
                    $.removeDataset(this._tooltip, 'uiAnimating');
                }
            });
        }

        /**
         * Refresh the Tooltip.
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
                this._tooltipInner,
                this.options.html && this.options.sanitize ?
                    this.options.sanitize(title) :
                    title,
            );

            this.update();
        }

        /**
         * Show the Tooltip.
         */
        show() {
            if (
                !this._enabled ||
                $.getDataset(this._tooltip, 'uiAnimating') ||
                $.isConnected(this._tooltip) ||
                !$.triggerOne(this.node, 'show.ui.tooltip')
            ) {
                return;
            }

            $.setDataset(this._tooltip, { uiAnimating: 'in' });
            $.addClass(this._tooltip, 'show');
            this.refresh();
            this._show();

            $.fadeIn(this._tooltip, {
                duration: this.options.duration,
            }).then((_) => {
                $.removeDataset(this._tooltip, 'uiAnimating');
                $.triggerEvent(this.node, 'shown.ui.tooltip');
            }).catch((_) => {
                if ($.getDataset(this._tooltip, 'uiAnimating') === 'in') {
                    $.removeDataset(this._tooltip, 'uiAnimating');
                }
            });
        }

        /**
         * Toggle the Tooltip.
         * @param {object} [options] The toggle options.
         * @param {boolean} [options.force=true] Whether to force hiding when disabled.
         */
        toggle({ force = true } = {}) {
            if ($.isConnected(this._tooltip)) {
                this.hide({ force });
            } else {
                this.show();
            }
        }

        /**
         * Update the Tooltip position.
         */
        update() {
            if (this._popper) {
                this._popper.update();
            }
        }
    }

    // Tooltip default options
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

    // Tooltip init
    initComponent('tooltip', Tooltip);

    // Clipboard events
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

    // Ripple events
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

    // Text expand events
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
