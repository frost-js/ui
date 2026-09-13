(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ?  factory(exports, require('@fr0st/query')) :
  typeof define === 'function' && define.amd ? define(['exports', '@fr0st/query'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.UI = {}), global.fQuery));
})(this, function(exports, _fr0st_query) {
Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
//#region \0rolldown/runtime.js
	var __create = Object.create;
	var __defProp = Object.defineProperty;
	var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
	var __getOwnPropNames = Object.getOwnPropertyNames;
	var __getProtoOf = Object.getPrototypeOf;
	var __hasOwnProp = Object.prototype.hasOwnProperty;
	var __copyProps = (to, from, except, desc) => {
		if (from && typeof from === "object" || typeof from === "function") {
			for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
				key = keys[i];
				if (!__hasOwnProp.call(to, key) && key !== except) {
					__defProp(to, key, {
						get: ((k) => from[k]).bind(null, key),
						enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
					});
				}
			}
		}
		return to;
	};
	var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule || !__hasOwnProp.call(mod, "default") ? __defProp(target, "default", {
		value: mod,
		enumerable: true
	}) : target, mod));

//#endregion
_fr0st_query = __toESM(_fr0st_query, 1);

//#region src/js/globals.js
	var $;
	if (_fr0st_query.default !== _fr0st_query.default.query) $ = (0, _fr0st_query.default)(globalThis);
	else $ = _fr0st_query.default;
	if (!("fQuery" in globalThis)) globalThis.fQuery = $;
	var document = $.getContext();
	var window = $.getWindow();

//#endregion
//#region src/js/helpers/component.js
/** @import BaseComponent from '../base-component.js'; */
	/**
	* Generates a unique component element ID.
	* @param {string} prefix The ID prefix.
	* @returns {string} The unique ID.
	*/
	function generateId(prefix) {
		while (true) {
			const id = `${prefix}-${$._randomString(5)}`;
			if ($.findOneById(id)) continue;
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
		return Object.fromEntries(Object.entries(dataset).map(([key, value]) => [key.slice(2, 3).toLowerCase() + key.slice(3), value]));
	}
	/**
	* Registers a UI component and its QuerySet method.
	* @param {string} key The component key.
	* @param {typeof BaseComponent} component The component class.
	*/
	function initComponent(key, component) {
		component.DATA_KEY = key;
		component.REMOVE_EVENT = `remove.ui.${key}`;
		Object.defineProperty($.QuerySet.prototype, key, {
			configurable: true,
			enumerable: false,
			value(a, ...args) {
				let settings;
				let method;
				let firstResult;
				if ($._isObject(a)) settings = a;
				else if ($._isString(a)) method = a;
				for (const [index, node] of this.get().entries()) {
					if (!$._isElement(node)) continue;
					let result = component.init(node, settings);
					if (method) result = result[method](...args);
					if (index === 0) firstResult = result;
				}
				return firstResult;
			},
			writable: true
		});
	}

//#endregion
//#region src/js/helpers/target.js
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
		if (selector && selector !== "#") target = $.findOne(selector);
		else if (closestSelector) target = $.closest(node, closestSelector).shift();
		if (!target) throw new Error("Target not found");
		return target;
	}
	/**
	* Gets the target selector declared by a control.
	* @param {HTMLElement} node The input node.
	* @returns {string|null} The target selector, or `null` if none is declared.
	*/
	function getTargetSelector(node) {
		return $.getDataset(node, "uiTarget") || $.getAttribute(node, "href");
	}

//#endregion
//#region src/js/base-component.js
/** @typedef {Record<string, *>} ComponentOptions */
	/**
	* Provides shared initialization, option handling, and disposal for UI components.
	* @template {ComponentOptions} [Options=ComponentOptions]
	*/
	var BaseComponent = class {
		#node;
		#options;
		/**
		* Initializes a BaseComponent.
		* @param {HTMLElement} node The input node.
		* @param {...*} args The constructor arguments.
		* @returns {BaseComponent} The existing or newly created component.
		*/
		static init(node, ...args) {
			return $.hasData(node, this.DATA_KEY) ? $.getData(node, this.DATA_KEY) : new this(node, ...args);
		}
		/**
		* Creates a BaseComponent.
		* @param {HTMLElement} node The input node.
		* @param {Options} [options] The component options.
		*/
		constructor(node, options) {
			this.#node = node;
			this.#options = Object.freeze($._extend({}, this.constructor.defaults, getDataset(this.#node), options));
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
	};

//#endregion
//#region src/js/helpers/transition.js
	var FALLBACK_PADDING = 50;
	/**
	* Waits for an element's CSS transitions to finish or be canceled.
	* @template {Record<string, *>} [Data=Record<string, *>]
	* @param {HTMLElement} node The transitioning node.
	* @param {string[]} [properties=[]] The transition properties to wait for.
	* @param {Data} [data={}] Additional data to include in the transition result.
	* @returns {Promise<Data & {completed: boolean, node: HTMLElement}>} The transition result.
	*/
	function waitForTransition(node, properties = [], data = {}) {
		const transitions = node.getAnimations().filter((animation) => animation instanceof window.CSSTransition && (!properties.length || properties.includes(animation.transitionProperty)));
		const result = (completed) => ({
			...data,
			completed,
			node
		});
		if (!transitions.length) return Promise.resolve(result(true));
		const endTime = Math.max(...transitions.map((transition) => {
			const transitionEndTime = transition.effect?.getComputedTiming().endTime;
			return Number.isFinite(transitionEndTime) ? transitionEndTime : 0;
		}));
		let fallback;
		const settled = Promise.allSettled(transitions.map((transition) => transition.finished)).then((results) => {
			window.clearTimeout(fallback);
			return results.every((transitionResult) => transitionResult.status === "fulfilled");
		});
		const timedOut = new Promise((resolve) => {
			fallback = window.setTimeout((_) => resolve(false), endTime + FALLBACK_PADDING);
		});
		return Promise.race([settled, timedOut]).then(result);
	}

//#endregion
//#region src/js/alert/alert.js
/**
	* Controls a dismissible alert element.
	*/
	var Alert = class extends BaseComponent {
		#transitioning;
		/**
		* Closes the alert.
		*/
		close() {
			if (this.#transitioning || !$.triggerOne(this.node, "close.ui.alert")) return;
			this.#transitioning = true;
			$.css(this.node, "opacity");
			$.removeClass(this.node, "show");
			waitForTransition(this.node, ["opacity"]).then(({ node }) => {
				$.detach(node);
				$.triggerEvent(node, "closed.ui.alert");
				$.remove(node);
				this.#transitioning = false;
			});
		}
	};

//#endregion
//#region src/js/alert/index.js
	initComponent("alert", Alert);
	$.addEventDelegate(document, "click.ui.alert", "[data-ui-dismiss=\"alert\"]", (e) => {
		e.preventDefault();
		const target = getTarget(e.currentTarget, ".alert");
		Alert.init(target).close();
	});
	var alert_default = Alert;

//#endregion
//#region src/js/button/button.js
/**
	* Controls the pressed state of a toggle button.
	*/
	var Button = class extends BaseComponent {
		/**
		* Toggles the button state.
		*/
		toggle() {
			$.toggleClass(this.node, "active");
			const active = $.hasClass(this.node, "active");
			$.setAttribute(this.node, { "aria-pressed": active });
		}
	};

//#endregion
//#region src/js/button/index.js
	initComponent("button", Button);
	$.addEventDelegate(document, "click.ui.button keydown.ui.button", "[data-ui-toggle=\"button\"]", (e) => {
		if (e.code && e.code !== "Space") return;
		e.preventDefault();
		Button.init(e.currentTarget).toggle();
	});
	var button_default = Button;

//#endregion
//#region src/js/helpers/pointer.js
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
		if ("touches" in e && e.touches.length) return {
			x: e.touches[0].pageX,
			y: e.touches[0].pageY
		};
		return {
			x: e.pageX,
			y: e.pageY
		};
	}
	/**
	* Gets page coordinates for every active touch.
	* @param {TouchEvent} e The touch event.
	* @returns {Coordinates[]} The active touch coordinates.
	*/
	function getTouchPositions(e) {
		return Array.from(e.touches).map((touch) => ({
			x: touch.pageX,
			y: touch.pageY
		}));
	}

//#endregion
//#region src/js/carousel/helpers.js
/** @import { CarouselDirection, PhysicalDirection } from './carousel.js'; */
	/**
	* Gets the boundary offset for an item index.
	* @param {number} index The index.
	* @param {number} totalItems The total number of items.
	* @returns {-1|0|1} The boundary offset.
	*/
	function getDirOffset(index, totalItems) {
		if (index < 0) return -1;
		if (index > totalItems - 1) return 1;
		return 0;
	}
	/**
	* Gets the transition direction for an item change.
	* @param {number} offset The direction offset.
	* @param {number} oldIndex The old item index.
	* @param {number} newIndex The new item index.
	* @returns {CarouselDirection} The transition direction.
	*/
	function getDirection(offset, oldIndex, newIndex) {
		if (offset == -1 || offset == 0 && newIndex < oldIndex) return "prev";
		return "next";
	}
	/**
	* Resolves a carousel direction to a physical direction.
	* @param {CarouselDirection} direction The carousel direction.
	* @param {boolean} rtl Whether the inline direction is right-to-left.
	* @returns {PhysicalDirection} The physical direction.
	*/
	function getPhysicalDirection(direction, rtl) {
		if (direction === "prev") return rtl ? "right" : "left";
		return rtl ? "left" : "right";
	}
	/**
	* Gets the entering and exiting classes for a slide direction.
	* @param {CarouselDirection} direction The slide direction.
	* @returns {{enter: string, exit: string}} The transition classes.
	*/
	function getTransitionClasses(direction) {
		switch (direction) {
			case "prev": return {
				enter: "carousel-item-prev",
				exit: "carousel-item-next"
			};
			case "next": return {
				enter: "carousel-item-next",
				exit: "carousel-item-prev"
			};
		}
	}
	/**
	* Normalizes an item index to the available range.
	* @param {number} index The item index.
	* @param {number} totalItems The total number of items.
	* @returns {number} The normalized item index.
	*/
	function getIndex(index, totalItems) {
		index %= totalItems;
		if (index < 0) return totalItems + index;
		return index;
	}
	/**
	* Resets the transition styles of a carousel item.
	* @param {HTMLElement} node The carousel item.
	*/
	function resetStyles(node) {
		$.setStyle(node, {
			display: "",
			transform: ""
		});
	}
	/**
	* Updates the active carousel indicator.
	* @param {HTMLElement} carousel The carousel node.
	* @param {number} index The active item index.
	*/
	function updateIndicators(carousel, index) {
		const oldIndicator = $.find(".active[data-ui-slide-to]", carousel);
		const newIndicator = $.find("[data-ui-slide-to=\"" + index + "\"]", carousel);
		$.removeClass(oldIndicator, "active");
		$.addClass(newIndicator, "active");
	}

//#endregion
//#region src/js/carousel/carousel.js
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
	var Carousel = class extends BaseComponent {
		/** @type {CarouselOptions} */
		static defaults = {
			interval: 5e3,
			keyboard: true,
			ride: false,
			pause: true,
			wrap: true,
			swipe: true
		};
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
			this.#rtl = $.css(this.node, "direction") === "rtl";
			this.#items = $.find(".carousel-item", this.node);
			this.#index = this.#items.findIndex((item) => $.hasClass(item, "active"));
			this.#sliding = false;
			this.#events();
			if (this.options.ride === "carousel") this.#setTimer();
		}
		/**
		* Advances the carousel automatically when the document is visible.
		*/
		cycle() {
			if (!$.isHidden(document)) this.slide(1);
			else {
				this.#paused = false;
				this.#setTimer();
			}
		}
		/** @inheritdoc */
		dispose() {
			$.setStyle(this.node, { "--ui-carousel-transition-scale": "" });
			if (this.#sliding) $.removeClass(this.node, "carousel-dragging");
			for (const item of this.#items) resetStyles(item);
			if (this.options.keyboard) $.removeEvent(this.node, "keydown.ui.carousel");
			if (this.options.pause) {
				$.removeEvent(this.node, "mouseenter.ui.carousel");
				$.removeEvent(this.node, "mouseleave.ui.carousel");
			}
			if (this.options.swipe) $.removeEvent(this.node, "mousedown.ui.carousel touchstart.ui.carousel");
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
				const previousKey = this.#rtl ? "ArrowRight" : "ArrowLeft";
				$.addEvent(this.node, "keydown.ui.carousel", (e) => {
					const target = e.target;
					if ($.is(target, "input, select")) return;
					if (!["ArrowLeft", "ArrowRight"].includes(e.code)) return;
					e.preventDefault();
					if (e.code === previousKey) this.prev();
					else this.next();
				});
			}
			if (this.options.pause) {
				$.addEvent(this.node, "mouseenter.ui.carousel", (_) => {
					this.#mousePaused = true;
					this.pause();
				});
				$.addEvent(this.node, "mouseleave.ui.carousel", (_) => {
					this.#mousePaused = false;
					this.#paused = false;
					if (!this.#sliding) this.#setTimer();
				});
			}
			if (this.options.swipe) {
				let startX;
				let index = null;
				let progress;
				let direction;
				const downEvent = (e) => {
					if (e.button || this.#sliding || !$.is(e.target, ":disabled, .disabled") && ($.is(e.target, "[data-ui-slide-to], [data-ui-slide], a, button, input, textarea, select") || $.closest(e.target, "[data-ui-slide], a, button", (parent) => $.isSame(parent, this.node) || $.is(parent, ":disabled, .disabled")).length)) return false;
					this.pause();
					this.#sliding = true;
					$.addClass(this.node, "carousel-dragging");
					startX = getPosition(e).x;
					index = null;
					progress = 0;
					direction = null;
				};
				const moveEvent = (e) => {
					if (!this.node) return;
					const currentX = getPosition(e).x;
					const scrollX = $.width(this.node) / 2;
					let inlineDiffX = currentX - startX;
					if (this.#rtl) inlineDiffX *= -1;
					if (!this.options.wrap) inlineDiffX = $._clamp(inlineDiffX, -(this.#items.length - 1 - this.#index) * scrollX, this.#index * scrollX);
					progress = $._map(Math.abs(inlineDiffX), 0, scrollX, 0, 1);
					do {
						const lastIndex = index;
						if (inlineDiffX < 0) index = this.#index + 1;
						else if (inlineDiffX > 0) index = this.#index - 1;
						else {
							resetStyles(this.#items[this.#index]);
							if (lastIndex !== null) resetStyles(this.#items[lastIndex]);
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
							updateIndicators(this.node, this.#index);
							if (lastIndex !== null && lastIndex !== this.#index) resetStyles(this.#items[lastIndex]);
							progress--;
						} else {
							this.#update(this.#items[index], this.#items[this.#index], progress, {
								direction,
								dragging: true
							});
							if (lastIndex !== null && lastIndex !== index) resetStyles(this.#items[lastIndex]);
						}
					} while (progress > 1);
				};
				const upEvent = (_) => {
					if (!this.node) return;
					if (index === null || index === this.#index) {
						$.removeClass(this.node, "carousel-dragging");
						this.#paused = false;
						this.#sliding = false;
						this.#setTimer();
						return;
					}
					const completed = progress > .25;
					let oldIndex;
					if (completed) oldIndex = this.#setIndex(index);
					else oldIndex = index;
					const nodeIn = this.#items[this.#index];
					const nodeOut = this.#items[oldIndex];
					const { enter, exit } = getTransitionClasses(direction);
					const transitionClass = completed ? exit : enter;
					const progressRemaining = completed ? 1 - progress : progress;
					index = null;
					$.addClass(nodeOut, transitionClass);
					$.setStyle(this.node, { "--ui-carousel-transition-scale": progressRemaining });
					$.removeClass(this.node, "carousel-dragging");
					$.css(nodeIn, "transform");
					$.setStyle([nodeIn, nodeOut], { transform: "" });
					Promise.all([waitForTransition(nodeIn, ["transform"], {
						carousel: this.node,
						index: this.#index,
						nodeOut,
						transitionClass
					}), waitForTransition(nodeOut, ["transform"])]).then(([{ carousel, index, node: nodeIn, transitionClass }, { node: nodeOut }]) => {
						this.#sliding = false;
						$.removeClass(nodeOut, transitionClass);
						resetStyles(nodeIn);
						resetStyles(nodeOut);
						updateIndicators(carousel, index);
						if (this.node) {
							this.#paused = false;
							this.#setTimer();
							$.setStyle(this.node, { "--ui-carousel-transition-scale": "" });
						}
					});
				};
				const dragEvent = $.mouseDragFactory(downEvent, moveEvent, upEvent);
				$.addEvent(this.node, "mousedown.ui.carousel touchstart.ui.carousel", dragEvent);
			}
		}
		/**
		* Sets the active item index and updates item state.
		* @param {number} index The new item index.
		* @returns {number} The old item index.
		*/
		#setIndex(index) {
			const oldIndex = this.#index;
			this.#index = index;
			$.addClass(this.#items[this.#index], "active");
			$.removeClass(this.#items[oldIndex], "active");
			return oldIndex;
		}
		/**
		* Schedules the next automatic cycle.
		*/
		#setTimer() {
			if (this.#timer || this.#paused || this.#mousePaused) return;
			const interval = $.getDataset(this.#items[this.#index], "uiInterval");
			this.#timer = setTimeout((_) => {
				this.#timer = null;
				this.cycle();
			}, interval || this.options.interval);
		}
		/**
		* Starts a transition to a carousel item.
		* @param {number|string} index The item index to show.
		*/
		#show(index) {
			if (this.#sliding) return;
			index = parseInt(index);
			if (Number.isNaN(index)) return;
			if (!this.options.wrap && (index < 0 || index > this.#items.length - 1)) return;
			const offset = getDirOffset(index, this.#items.length);
			index = getIndex(index, this.#items.length);
			if (index === this.#index) return;
			const direction = getDirection(offset, this.#index, index);
			const eventData = {
				direction: getPhysicalDirection(direction, this.#rtl),
				relatedTarget: this.#items[index],
				from: this.#index,
				to: index
			};
			if (!$.triggerOne(this.node, "slide.ui.carousel", { data: eventData })) return;
			this.#sliding = true;
			this.pause();
			const nodeIn = this.#items[index];
			const nodeOut = this.#items[this.#index];
			const { enter, exit } = getTransitionClasses(direction);
			$.addClass(nodeIn, enter);
			$.css(nodeIn, "transform");
			this.#setIndex(index);
			$.addClass(nodeOut, exit);
			$.removeClass(nodeIn, enter);
			Promise.all([waitForTransition(nodeIn, ["transform"], {
				carousel: this.node,
				index: this.#index,
				transitionClass: exit
			}), waitForTransition(nodeOut, ["transform"])]).then(([{ carousel, index, node: nodeIn, transitionClass }, { node: nodeOut }]) => {
				this.#sliding = false;
				$.removeClass(nodeOut, transitionClass);
				resetStyles(nodeIn);
				resetStyles(nodeOut);
				updateIndicators(carousel, index);
				if (this.node) {
					this.#paused = false;
					this.#setTimer();
				}
				$.triggerEvent(carousel, "slid.ui.carousel", { data: eventData });
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
				if (dragging) inStyles.display = "";
				else outStyles.display = "";
				inStyles.transform = "";
				outStyles.transform = "";
			} else {
				const inverse = getPhysicalDirection(direction, this.#rtl) === "right";
				if (dragging) inStyles.display = "block";
				else outStyles.display = "block";
				inStyles.transform = `translateX(${Math.round((1 - progress) * 100) * (inverse ? 1 : -1)}%)`;
				outStyles.transform = `translateX(${Math.round(progress * 100) * (inverse ? -1 : 1)}%)`;
			}
			$.setStyle(nodeIn, inStyles);
			$.setStyle(nodeOut, outStyles);
		}
	};

//#endregion
//#region src/js/carousel/index.js
	initComponent("carousel", Carousel);
	$((_) => {
		const nodes = $.find("[data-ui-ride=\"carousel\"]");
		for (const node of nodes) Carousel.init(node);
	});
	$.addEventDelegate(document, "click.ui.carousel", "[data-ui-slide]", (e) => {
		e.preventDefault();
		const target = getTarget(e.currentTarget, ".carousel");
		const carousel = Carousel.init(target);
		if ($.getDataset(e.currentTarget, "uiSlide") === "prev") carousel.prev();
		else carousel.next();
	});
	$.addEventDelegate(document, "click.ui.carousel", "[data-ui-slide-to]", (e) => {
		e.preventDefault();
		const target = getTarget(e.currentTarget, ".carousel");
		const carousel = Carousel.init(target);
		const slideTo = $.getDataset(e.currentTarget, "uiSlideTo");
		carousel.show(slideTo);
	});
	var carousel_default = Carousel;

//#endregion
//#region src/js/collapse/helpers.js
/**
	* Gets the dimension used for a collapse transition.
	* @param {HTMLElement} node The collapse node.
	* @returns {'height'|'width'} The dimension.
	*/
	function getDimension(node) {
		return $.hasClass(node, "collapse-horizontal") ? "width" : "height";
	}

//#endregion
//#region src/js/collapse/collapse.js
/**
	* @typedef {object} CollapseOptions
	* @property {string} [parent] The selector for an accordion parent.
	*/
	/**
	* Controls a collapsible element and its triggers.
	* @augments {BaseComponent<CollapseOptions>}
	*/
	var Collapse = class extends BaseComponent {
		#parent;
		#transitioning;
		#triggers;
		/**
		* Creates a Collapse.
		* @param {HTMLElement} node The input node.
		* @param {CollapseOptions} [options] The collapse options.
		*/
		constructor(node, options) {
			super(node, options);
			this.#triggers = $.find("[data-ui-toggle=\"collapse\"]").filter((trigger) => {
				const selector = getTargetSelector(trigger);
				return selector && $.is(this.node, selector);
			});
			if (this.options.parent) this.#parent = $.closest(this.node, this.options.parent).shift();
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
			if (this.#transitioning || !$.hasClass(this.node, "show") || !$.triggerOne(this.node, "hide.ui.collapse")) return;
			this.#transitioning = true;
			const dimension = getDimension(this.node);
			$.setStyle(this.node, { [dimension]: $.rect(this.node)[dimension] });
			$.css(this.node, dimension);
			$.addClass(this.node, "collapsing");
			$.removeClass(this.node, "collapse show");
			$.addClass(this.#triggers, "collapsed");
			$.setStyle(this.node, { [dimension]: 0 });
			waitForTransition(this.node, [dimension], { triggers: this.#triggers }).then(({ node, triggers }) => {
				this.#transitioning = false;
				$.removeClass(node, "collapsing");
				$.addClass(node, "collapse");
				$.setStyle(node, { [dimension]: "" });
				$.setAttribute(triggers, { "aria-expanded": false });
				$.triggerEvent(node, "hidden.ui.collapse");
			});
		}
		/**
		* Shows the collapsible element.
		*/
		show() {
			if (this.#transitioning || $.hasClass(this.node, "show")) return;
			const collapses = [];
			if (this.#parent) {
				const siblings = $.find(".collapse.show", this.#parent);
				for (const sibling of siblings) {
					const collapse = this.constructor.init(sibling);
					if (!$.isSame(this.#parent, collapse.#parent)) continue;
					collapses.push(collapse);
				}
			}
			if (!$.triggerOne(this.node, "show.ui.collapse")) return;
			for (const collapse of collapses) collapse.hide();
			this.#transitioning = true;
			const dimension = getDimension(this.node);
			$.removeClass(this.node, "collapse");
			$.addClass(this.node, "collapsing");
			$.setStyle(this.node, { [dimension]: 0 });
			$.removeClass(this.#triggers, "collapsed");
			const size = $[dimension](this.node, { boxSize: $.SCROLL_BOX });
			$.setStyle(this.node, { [dimension]: size });
			waitForTransition(this.node, [dimension], { triggers: this.#triggers }).then(({ node, triggers }) => {
				this.#transitioning = false;
				$.removeClass(node, "collapsing");
				$.addClass(node, "collapse show");
				$.setStyle(node, { [dimension]: "" });
				$.setAttribute(triggers, { "aria-expanded": true });
				$.triggerEvent(node, "shown.ui.collapse");
			});
		}
		/**
		* Toggles the collapsible element.
		*/
		toggle() {
			if ($.hasClass(this.node, "show")) this.hide();
			else this.show();
		}
	};

//#endregion
//#region src/js/collapse/index.js
	initComponent("collapse", Collapse);
	$.addEventDelegate(document, "click.ui.collapse", "[data-ui-toggle=\"collapse\"]", (e) => {
		e.preventDefault();
		const selector = getTargetSelector(e.currentTarget);
		const collapses = $.find(selector).map((target) => Collapse.init(target));
		const show = !collapses.some((collapse) => $.hasClass(collapse.node, "show"));
		for (const collapse of collapses) if (show) collapse.show();
		else collapse.hide();
	});
	var collapse_default = Collapse;

//#endregion
//#region src/js/helpers/click-target.js
/** @type {EventTarget|null|undefined} */
	var clickTarget;
	$.addEvent(window, "mousedown.ui", (e) => {
		clickTarget = e.target;
	}, { capture: true });
	$.addEvent(window, "mouseup.ui", (_) => {
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

//#endregion
//#region src/js/helpers/scroll.js
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
	var scrollbarSize;
	/**
	* Adds scrollbar compensation to a collection of elements.
	* @param {Iterable<HTMLElement>} nodes The elements to update.
	*/
	function addScrollPadding(nodes) {
		const scrollSizeY = getScrollbarSize(window, document, "y");
		if (!scrollSizeY) return;
		for (const node of nodes) {
			$.setDataset(node, { uiPaddingRight: $.getStyle(node, "paddingRight") });
			$.setStyle(node, { paddingRight: `${scrollSizeY + parseInt($.css(node, "paddingRight"))}px` });
		}
	}
	/**
	* Calculates the browser scrollbar size.
	* @returns {number} The scrollbar size.
	*/
	function calculateScrollbarSize() {
		if (scrollbarSize) return scrollbarSize;
		const div = $.create("div", { style: {
			width: "100px",
			height: "100px",
			overflow: "scroll",
			position: "absolute",
			top: "-9999px"
		} });
		$.append(document.body, div);
		scrollbarSize = $.getProperty(div, "offsetWidth") - $.width(div);
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
		const method = axis === "x" ? "width" : "height";
		const size = $[method](node);
		if ($[method](scrollNode, { boxSize: $.SCROLL_BOX }) > size) return calculateScrollbarSize();
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
		const rect = isWindow ? getWindowContainer(node) : $.rect(node, { offset: true });
		const scrollSizeX = getScrollbarSize(node, scrollNode, "x");
		const scrollSizeY = getScrollbarSize(node, scrollNode, "y");
		if (scrollSizeX) {
			rect.height -= scrollSizeX;
			if (isWindow) rect.bottom -= scrollSizeX;
		}
		if (scrollSizeY) {
			rect.width -= scrollSizeY;
			if (isWindow) rect.right -= scrollSizeY;
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
			left: scrollX
		};
	}
	/**
	* Restores scrollbar compensation on a collection of elements.
	* @param {Iterable<HTMLElement>} nodes The elements to restore.
	*/
	function resetScrollPadding(nodes) {
		for (const node of nodes) {
			$.setStyle(node, { paddingRight: $.getDataset(node, "uiPaddingRight") });
			$.removeDataset(node, "uiPaddingRight");
		}
	}

//#endregion
//#region src/js/popper/helpers.js
/** @import { BoundingRect } from '../helpers/scroll.js'; */
	/** @import Popper, { Direction, PhysicalDirection, Placement, Position } from './popper.js'; */
	var poppers = /* @__PURE__ */ new Set();
	var running$1 = false;
	/**
	* Registers a popper for viewport and ancestor-scroll updates.
	* @param {Popper} popper The popper to register.
	*/
	function addPopper(popper) {
		poppers.add(popper);
		if (running$1) return;
		$.addEvent(window, "resize.ui.popper", $.debounce((_) => {
			for (const popper of poppers) popper.update();
		}));
		$.addEvent(document, "scroll.ui.popper", $.debounce((e) => {
			for (const popper of poppers) {
				if (!popper.shouldUpdateForScroll(e.target)) continue;
				popper.update();
			}
		}), {
			capture: true,
			passive: true
		});
		running$1 = true;
	}
	/**
	* Resolves a logical placement to a physical direction.
	* @param {Direction} placement The logical placement.
	* @param {boolean} rtl Whether the inline direction is right-to-left.
	* @returns {PhysicalDirection} The physical placement.
	*/
	function getPhysicalPlacement(placement, rtl) {
		const [start, end] = rtl ? ["right", "left"] : ["left", "right"];
		switch (placement) {
			case "start": return start;
			case "end": return end;
			default: return placement;
		}
	}
	/**
	* Resolves the best available popper placement.
	* @param {DOMRect} nodeBox The computed bounding rectangle of the node.
	* @param {DOMRect} referenceBox The computed bounding rectangle of the reference.
	* @param {BoundingRect} minimumBox The available positioning boundary.
	* @param {Placement} placement The preferred placement.
	* @param {number} spacing The amount of spacing to use.
	* @param {boolean} rtl Whether the inline direction is right-to-left.
	* @returns {Direction} The resolved placement.
	*/
	function getPopperPlacement(nodeBox, referenceBox, minimumBox, placement, spacing, rtl) {
		const spaceTop = referenceBox.top - minimumBox.top;
		const spaceRight = minimumBox.right - referenceBox.right;
		const spaceBottom = minimumBox.bottom - referenceBox.bottom;
		const spaceLeft = referenceBox.left - minimumBox.left;
		const [spaceStart, spaceEnd] = rtl ? [spaceRight, spaceLeft] : [spaceLeft, spaceRight];
		if (placement === "top") {
			if (spaceTop < nodeBox.height + spacing && spaceBottom > spaceTop) return "bottom";
		} else if (placement === "end") {
			if (spaceEnd < nodeBox.width + spacing && spaceStart > spaceEnd) return "start";
		} else if (placement === "bottom") {
			if (spaceBottom < nodeBox.height + spacing && spaceTop > spaceBottom) return "top";
		} else if (placement === "start") {
			if (spaceStart < nodeBox.width + spacing && spaceEnd > spaceStart) return "end";
		} else if (placement === "auto") {
			const maxVSpace = Math.max(spaceTop, spaceBottom);
			const maxHSpace = Math.max(spaceRight, spaceLeft);
			const minVSpace = Math.min(spaceTop, spaceBottom);
			if (maxHSpace > maxVSpace && maxHSpace >= nodeBox.width + spacing && minVSpace + referenceBox.height >= nodeBox.height + spacing - Math.max(0, nodeBox.height - referenceBox.height)) return spaceStart > spaceEnd ? "start" : "end";
			const minHSpace = Math.min(spaceRight, spaceLeft);
			if (maxVSpace >= nodeBox.height + spacing && minHSpace + referenceBox.width >= nodeBox.width + spacing - Math.max(0, nodeBox.width - referenceBox.width)) return spaceBottom > spaceTop ? "bottom" : "top";
			const maxSpace = Math.max(maxVSpace, maxHSpace);
			if (spaceBottom === maxSpace && spaceBottom >= nodeBox.height + spacing) return "bottom";
			if (spaceTop === maxSpace && spaceTop >= nodeBox.height + spacing) return "top";
			if (spaceEnd === maxSpace && spaceEnd >= nodeBox.width + spacing) return "end";
			if (spaceStart === maxSpace && spaceStart >= nodeBox.width + spacing) return "start";
			return "bottom";
		}
		return placement;
	}
	/**
	* Unregisters a popper and removes shared listeners when no poppers remain.
	* @param {Popper} popper The popper to unregister.
	*/
	function removePopper(popper) {
		poppers.delete(popper);
		if (poppers.size) return;
		$.removeEvent(window, "resize.ui.popper");
		$.removeEvent(document, "scroll.ui.popper");
		running$1 = false;
	}
	/**
	* Updates a popper arrow position.
	* @param {Popper} popper The popper instance.
	* @param {Direction} placement The resolved placement.
	* @param {Position} position The resolved alignment.
	* @param {boolean} rtl Whether the inline direction is right-to-left.
	*/
	function updateArrow(popper, placement, position, rtl) {
		const physicalPlacement = getPhysicalPlacement(placement, rtl);
		const nodeBox = $.rect(popper.node, { offset: true });
		const referenceBox = $.rect(popper.options.reference, { offset: true });
		$.setStyle(popper.options.arrow, {
			position: "absolute",
			inset: ""
		});
		const arrowBox = $.rect(popper.options.arrow, { offset: true });
		const arrowStyles = {};
		if (["top", "bottom"].includes(physicalPlacement)) {
			const arrowPlacement = physicalPlacement === "top" ? "bottom" : "top";
			arrowStyles[arrowPlacement] = -Math.floor(arrowBox.height);
			const diff = (referenceBox.width - nodeBox.width) / 2;
			const [left, right] = rtl ? ["end", "start"] : ["start", "end"];
			let offset = nodeBox.width / 2 - arrowBox.width / 2;
			if (position === left) offset += diff;
			else if (position === right) offset -= diff;
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
			const arrowPlacement = physicalPlacement === "right" ? "left" : "right";
			arrowStyles[arrowPlacement] = -Math.floor(arrowBox.width);
			const diff = (referenceBox.height - nodeBox.height) / 2;
			let offset = nodeBox.height / 2 - arrowBox.height;
			if (position === "start") offset += diff;
			else if (position === "end") offset -= diff;
			let min = Math.max(referenceBox.top, nodeBox.top) - arrowBox.top;
			let max = Math.min(referenceBox.bottom, nodeBox.bottom) - arrowBox.top - arrowBox.height;
			if (referenceBox.height < arrowBox.height * 2) {
				min -= arrowBox.height - referenceBox.height / 2;
				max -= arrowBox.height - referenceBox.height / 2;
			} else max -= arrowBox.height;
			offset = Math.round(offset);
			min = Math.round(min);
			max = Math.round(max);
			arrowStyles.top = $._clamp(offset, min, max);
		}
		$.setStyle(popper.options.arrow, arrowStyles);
	}

//#endregion
//#region src/js/popper/popper.js
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
	var Popper = class extends BaseComponent {
		/** @type {PopperOptions} */
		static defaults = {
			reference: null,
			container: null,
			arrow: null,
			afterUpdate: null,
			beforeUpdate: null,
			placement: "bottom",
			position: "center",
			fixed: false,
			spacing: 0,
			minContact: null
		};
		#arrowStyles;
		#placement;
		#referencePlacement;
		#rtl;
		#styles;
		/**
		* Creates a Popper.
		* @param {HTMLElement} node The input node.
		* @param {PopperOptions} options The popper options.
		*/
		constructor(node, options) {
			super(node, options);
			this.#rtl = $.css(this.options.reference, "direction") === "rtl";
			this.#placement = $.getDataset(this.node, "uiPlacement");
			this.#referencePlacement = $.getDataset(this.options.reference, "uiPlacement");
			this.#styles = Object.fromEntries([
				"position",
				"top",
				"right",
				"bottom",
				"left",
				"transform"
			].map((style) => [style, $.getStyle(this.node, style)]));
			if (this.options.arrow) this.#arrowStyles = Object.fromEntries([
				"position",
				"top",
				"right",
				"bottom",
				"left"
			].map((style) => [style, $.getStyle(this.options.arrow, style)]));
			$.setStyle(this.node, {
				position: "absolute",
				inset: "0 auto auto 0"
			});
			addPopper(this);
			this.update();
		}
		/** @inheritdoc */
		dispose() {
			if (this.#placement) $.setDataset(this.node, { uiPlacement: this.#placement });
			else $.removeDataset(this.node, "uiPlacement");
			if (this.#referencePlacement) $.setDataset(this.options.reference, { uiPlacement: this.#referencePlacement });
			else $.removeDataset(this.options.reference, "uiPlacement");
			$.setStyle(this.node, this.#styles);
			if (this.#arrowStyles) $.setStyle(this.options.arrow, this.#arrowStyles);
			removePopper(this);
			this.#arrowStyles = null;
			this.#styles = null;
			super.dispose();
		}
		/**
		* Checks whether a scroll target affects the popper.
		* @param {HTMLElement|Document} target The scroll target.
		* @returns {boolean} Whether the popper should update.
		*/
		shouldUpdateForScroll(target) {
			return $._isDocument(target) || $.hasDescendent(target, this.node) || $.hasDescendent(target, this.options.reference);
		}
		/**
		* Updates the popper position.
		*/
		update() {
			if (!$.isConnected(this.node) || !$.isVisible(this.node)) return;
			$.setStyle(this.node, { transform: "" });
			if (this.options.beforeUpdate) this.options.beforeUpdate(this.node, this.options.reference);
			const nodeBox = $.rect(this.node, { offset: true });
			const referenceBox = $.rect(this.options.reference, { offset: true });
			const windowBox = getScrollContainer(window, document);
			const positionParent = $.offsetParent(this.node);
			const scrollParent = positionParent ? $.closest(this.node, (parent) => ($.isSame(parent, positionParent) || $.hasDescendent(parent, positionParent)) && [
				"overflow",
				"overflowX",
				"overflowY"
			].some((property) => ["auto", "scroll"].includes($.css(parent, property))), document.body).shift() : null;
			const scrollBox = scrollParent ? getScrollContainer(scrollParent, scrollParent) : null;
			const containerBox = this.options.container ? $.rect(this.options.container, { offset: true }) : null;
			const minimumBox = { ...windowBox };
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
			const placement = this.options.fixed && this.options.placement !== "auto" ? this.options.placement : getPopperPlacement(nodeBox, referenceBox, minimumBox, this.options.placement, this.options.spacing + 2, this.#rtl);
			const physicalPlacement = getPhysicalPlacement(placement, this.#rtl);
			$.setDataset(this.options.reference, { uiPlacement: placement });
			$.setDataset(this.node, { uiPlacement: placement });
			const position = this.options.position;
			const offset = {
				x: Math.round(referenceBox.x),
				y: Math.round(referenceBox.y)
			};
			const positionBox = positionParent && !$.isSame(positionParent, document.body) ? $.rect(positionParent, { offset: true }) : null;
			if (positionBox) {
				offset.x -= Math.round(positionBox.x);
				offset.y -= Math.round(positionBox.y);
			}
			if (physicalPlacement === "top") offset.y -= Math.round(nodeBox.height) + this.options.spacing;
			else if (physicalPlacement === "right") offset.x += Math.round(referenceBox.width) + this.options.spacing;
			else if (physicalPlacement === "bottom") offset.y += Math.round(referenceBox.height) + this.options.spacing;
			else if (physicalPlacement === "left") offset.x -= Math.round(nodeBox.width) + this.options.spacing;
			if (["top", "bottom"].includes(physicalPlacement)) {
				const deltaX = Math.round(nodeBox.width) - Math.round(referenceBox.width);
				if (position === "center") offset.x -= Math.round(deltaX / 2);
				else if (position === (this.#rtl ? "start" : "end")) offset.x -= deltaX;
			} else {
				const deltaY = Math.round(nodeBox.height) - Math.round(referenceBox.height);
				if (position === "center") offset.y -= Math.round(deltaY / 2);
				else if (position === "end") offset.y -= deltaY;
			}
			offset.x -= parseInt($.css(this.node, "marginLeft"));
			offset.y -= parseInt($.css(this.node, "marginTop"));
			if (["left", "right"].includes(physicalPlacement)) {
				let offsetY = offset.y;
				let refTop = referenceBox.top;
				if (positionBox) {
					offsetY += positionBox.top;
					refTop -= positionBox.top;
				}
				const minSize = this.options.minContact !== null ? this.options.minContact : Math.min(referenceBox.height, nodeBox.height);
				if (offsetY + nodeBox.height > minimumBox.bottom) {
					const diff = offsetY + nodeBox.height - minimumBox.bottom;
					offset.y = Math.max(refTop - nodeBox.height + minSize, offset.y - diff);
				}
				if (offsetY < minimumBox.top) {
					const diff = offsetY - minimumBox.top;
					offset.y = Math.min(refTop + referenceBox.height - minSize, offset.y - diff);
				}
			} else {
				let offsetX = offset.x;
				let refLeft = referenceBox.left;
				if (positionBox) {
					offsetX += positionBox.left;
					refLeft -= positionBox.left;
				}
				const minSize = this.options.minContact !== null ? this.options.minContact : Math.min(referenceBox.width, nodeBox.width);
				if (offsetX + nodeBox.width > minimumBox.right) {
					const diff = offsetX + nodeBox.width - minimumBox.right;
					offset.x = Math.max(refLeft - nodeBox.width + minSize, offset.x - diff);
				}
				if (offsetX < minimumBox.left) {
					const diff = offsetX - minimumBox.left;
					offset.x = Math.min(refLeft + referenceBox.width - minSize, offset.x - diff);
				}
			}
			offset.x = Math.round(offset.x);
			offset.y = Math.round(offset.y);
			if (positionBox) {
				offset.x += $.getScrollX(positionParent);
				offset.y += $.getScrollY(positionParent);
			}
			$.setStyle(this.node, { transform: `translate3d(${offset.x}px , ${offset.y}px , 0)` });
			if (this.options.arrow) updateArrow(this, placement, position, this.#rtl);
			if (this.options.afterUpdate) this.options.afterUpdate(this.node, this.options.reference, placement, position);
		}
	};

//#endregion
//#region src/js/dropdown/dropdown.js
/** @import { Placement, Position } from '../popper/popper.js'; */
	/**
	* @typedef {object} DropdownOptions
	* @property {'dynamic'|'static'} [display='dynamic'] The positioning mode.
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
	* @augments {BaseComponent<DropdownOptions>}
	*/
	var Dropdown = class extends BaseComponent {
		/** @type {DropdownOptions} */
		static defaults = {
			display: "dynamic",
			placement: "bottom",
			position: "start",
			fixed: false,
			spacing: 3,
			minContact: false
		};
		#display;
		#menuNode;
		#popper;
		#referenceNode;
		#transitioning;
		/**
		* Creates a Dropdown.
		* @param {HTMLElement} node The input node.
		* @param {DropdownOptions} [options] The dropdown options.
		*/
		constructor(node, options) {
			super(node, options);
			this.#display = this.options.display;
			this.#menuNode = $.next(this.node, ".dropdown-menu").shift();
			if (this.options.reference) {
				if (this.options.reference === "parent") this.#referenceNode = $.parent(this.node).shift();
				else this.#referenceNode = $.findOne(this.options.reference);
			} else this.#referenceNode = this.node;
			if (this.#display !== "static" && $.closest(this.node, ".navbar-nav").length) this.#display = "static";
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
			const focusNode = $.findOne(".dropdown-item:not(:disabled, .disabled, [tabindex=\"-1\"])", this.#menuNode);
			$.focus(focusNode);
		}
		/**
		* Hides the dropdown menu.
		*/
		hide() {
			if (this.#transitioning || !$.hasClass(this.#menuNode, "show") || !$.triggerOne(this.node, "hide.ui.dropdown")) return;
			this.#transitioning = true;
			$.setStyle(this.#menuNode, { display: "block" });
			$.removeClass(this.#menuNode, "show");
			waitForTransition(this.#menuNode, ["opacity"], { toggle: this.node }).then(({ node, toggle }) => {
				this.#transitioning = false;
				if (this.#popper) {
					this.#popper.dispose();
					this.#popper = null;
				}
				$.setStyle(node, { display: "" });
				$.setAttribute(toggle, { "aria-expanded": false });
				$.triggerEvent(toggle, "hidden.ui.dropdown");
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
			return !($.isSame(this.node, target) || hasDescendent && ($.is(target, "form, input, textarea, select, option") || autoClose === "outside" || autoClose === false) || !hasDescendent && !$.isSame(this.#menuNode, target) && (autoClose === "inside" || autoClose === false));
		}
		/**
		* Shows the dropdown menu.
		*/
		show() {
			if (this.#transitioning || $.hasClass(this.#menuNode, "show") || !$.triggerOne(this.node, "show.ui.dropdown")) return;
			this.#transitioning = true;
			$.setStyle(this.#menuNode, { display: "block" });
			$.css(this.#menuNode, "opacity");
			$.addClass(this.#menuNode, "show");
			$.setStyle(this.#menuNode, { display: "" });
			if (this.#display === "dynamic") this.#popper = new Popper(this.#menuNode, {
				reference: this.#referenceNode,
				placement: this.options.placement,
				position: this.options.position,
				fixed: this.options.fixed,
				spacing: this.options.spacing,
				minContact: this.options.minContact
			});
			window.requestAnimationFrame((_) => {
				this.update();
			});
			waitForTransition(this.#menuNode, ["opacity"], { toggle: this.node }).then(({ toggle }) => {
				this.#transitioning = false;
				$.setAttribute(toggle, { "aria-expanded": true });
				$.triggerEvent(toggle, "shown.ui.dropdown");
			});
		}
		/**
		* Toggles the dropdown menu.
		*/
		toggle() {
			if ($.hasClass(this.#menuNode, "show")) this.hide();
			else this.show();
		}
		/**
		* Updates the dropdown position.
		*/
		update() {
			if (this.#popper) this.#popper.update();
		}
	};

//#endregion
//#region src/js/dropdown/index.js
	initComponent("dropdown", Dropdown);
	$.addEventDelegate(document, "click.ui.dropdown keydown.ui.dropdown", "[data-ui-toggle=\"dropdown\"]", (e) => {
		if (e.code && e.code !== "Space") return;
		e.preventDefault();
		Dropdown.init(e.currentTarget).toggle();
	});
	$.addEventDelegate(document, "keydown.ui.dropdown", "[data-ui-toggle=\"dropdown\"]", (e) => {
		switch (e.code) {
			case "ArrowDown":
			case "ArrowUp": {
				e.preventDefault();
				const node = e.currentTarget;
				const dropdown = Dropdown.init(node);
				dropdown.show();
				dropdown.focusFirstItem();
				break;
			}
		}
	});
	$.addEventDelegate(document, "keydown.ui.dropdown", ".dropdown-menu.show .dropdown-item", (e) => {
		let focusNode;
		switch (e.code) {
			case "ArrowDown":
				focusNode = $.nextAll(e.currentTarget, ".dropdown-item:not(:disabled, .disabled, [tabindex=\"-1\"])").shift();
				break;
			case "ArrowUp":
				focusNode = $.prevAll(e.currentTarget, ".dropdown-item:not(:disabled, .disabled, [tabindex=\"-1\"])").pop();
				break;
			default: return;
		}
		e.preventDefault();
		$.focus(focusNode);
	});
	$.addEvent(document, "click.ui.dropdown", (e) => {
		const target = getClickTarget(e);
		const nodes = $.find(".dropdown-menu.show");
		for (const node of nodes) {
			const toggle = $.siblings(node, "[data-ui-toggle=\"dropdown\"]").shift();
			const dropdown = Dropdown.init(toggle);
			if (!dropdown.shouldClose(target)) continue;
			dropdown.hide();
		}
	}, { capture: true });
	$.addEvent(document, "keydown.ui.dropdown", (e) => {
		if (e.code !== "Escape") return;
		let stopped = false;
		const nodes = $.find(".dropdown-menu.show");
		for (const node of nodes) {
			const toggle = $.siblings(node, "[data-ui-toggle=\"dropdown\"]").shift();
			const dropdown = Dropdown.init(toggle);
			if (!stopped) {
				stopped = true;
				e.stopPropagation();
			}
			dropdown.hide();
		}
	}, { capture: true });
	$.addEvent(document, "keyup.ui.dropdown", (e) => {
		if (e.code !== "Tab") return;
		let stopped = false;
		const nodes = $.find(".dropdown-menu.show");
		for (const node of nodes) {
			const toggle = $.siblings(node, "[data-ui-toggle=\"dropdown\"]").shift();
			const dropdown = Dropdown.init(toggle);
			if (dropdown.containsMenuTarget(e.target)) continue;
			if (!stopped) {
				stopped = true;
				e.stopPropagation();
			}
			dropdown.hide();
		}
	}, { capture: true });
	var dropdown_default = Dropdown;

//#endregion
//#region src/js/focus-trap/helpers.js
/** @import FocusTrap from './focus-trap.js'; */
	var focusTraps = /* @__PURE__ */ new Set();
	var running = false;
	var reverse = false;
	/**
	* Registers a focus trap and attaches shared focus handlers when needed.
	* @param {FocusTrap} focusTrap The focus trap to register.
	*/
	function addFocusTrap(focusTrap) {
		focusTraps.add(focusTrap);
		if (running) return;
		$.addEvent(document, "focusin.ui.focustrap", (e) => {
			const activeTarget = [...focusTraps].pop().node;
			if ($._isDocument(e.target) || $.isSame(activeTarget, e.target) || $.hasDescendent(activeTarget, e.target)) return;
			const focusable = $.find("a, button, input, textarea, select, details, [tabindex], [contenteditable=\"true\"]", activeTarget).filter((node) => $.is(node, ":not(:disabled, .disabled)") && $.getAttribute(node, "tabindex") >= 0 && $.isVisible(node));
			const focusTarget = reverse ? focusable.pop() : focusable.shift();
			$.focus(focusTarget || activeTarget);
		}, { capture: true });
		$.addEvent(document, "keydown.ui.focustrap", (e) => {
			if (e.key !== "Tab") return;
			reverse = e.shiftKey;
		}, { capture: true });
		running = true;
		reverse = false;
	}
	/**
	* Unregisters a focus trap and removes shared handlers when none remain.
	* @param {FocusTrap} focusTrap The focus trap to unregister.
	*/
	function removeFocusTrap(focusTrap) {
		focusTraps.delete(focusTrap);
		if (focusTraps.size) return;
		$.removeEvent(document, "focusin.ui.focustrap");
		$.removeEvent(document, "keydown.ui.focustrap");
		running = false;
	}

//#endregion
//#region src/js/focus-trap/focus-trap.js
/**
	* @typedef {object} FocusTrapOptions
	* @property {boolean} [autoFocus=true] Whether to focus the trapped element when activated.
	*/
	/**
	* Keeps keyboard focus within an element while active.
	* @augments {BaseComponent<FocusTrapOptions>}
	*/
	var FocusTrap = class extends BaseComponent {
		/** @type {FocusTrapOptions} */
		static defaults = { autoFocus: true };
		#active;
		/**
		* Activates the focus trap.
		*/
		activate() {
			if (this.#active) return;
			addFocusTrap(this);
			if (this.options.autoFocus) $.focus(this.node);
			this.#active = true;
		}
		/**
		* Deactivates the focus trap.
		*/
		deactivate() {
			if (!this.#active) return;
			removeFocusTrap(this);
			this.#active = false;
		}
		/** @inheritdoc */
		dispose() {
			this.deactivate();
			super.dispose();
		}
	};

//#endregion
//#region src/js/focus-trap/index.js
	initComponent("focustrap", FocusTrap);
	var focus_trap_default = FocusTrap;

//#endregion
//#region src/js/modal/modal.js
/**
	* @typedef {object} ModalOptions
	* @property {boolean|'static'} [backdrop=true] Whether to show a dismissible or static backdrop.
	* @property {boolean} [focus=true] Whether to trap focus while shown.
	* @property {boolean} [show=false] Whether to show the modal immediately.
	* @property {boolean} [keyboard=true] Whether Escape hides the modal.
	*/
	/**
	* Controls a modal dialog and its backdrop.
	* @augments {BaseComponent<ModalOptions>}
	*/
	var Modal = class extends BaseComponent {
		/** @type {ModalOptions} */
		static defaults = {
			backdrop: true,
			focus: true,
			show: false,
			keyboard: true
		};
		#activeTarget;
		#backdrop;
		#dialog;
		#focusTrap;
		#scrollNodes;
		#transitioning;
		#zooming;
		/**
		* Creates a Modal.
		* @param {HTMLElement} node The input node.
		* @param {ModalOptions} [options] The modal options.
		*/
		constructor(node, options) {
			super(node, options);
			this.#dialog = $.child(this.node, ".modal-dialog").shift();
			if (this.options.show) this.show();
			if (this.options.focus) this.#focusTrap = focus_trap_default.init(this.node);
		}
		/**
		* Gets the modal backdrop.
		* @returns {HTMLElement|null|undefined} The backdrop element.
		*/
		get backdrop() {
			return this.#backdrop;
		}
		/** @inheritdoc */
		dispose() {
			if (this.#scrollNodes) this.#cleanup(false);
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
			if (!this.options.backdrop || this.node !== target && $.hasDescendent(this.node, target)) return;
			if (this.options.backdrop === "static") {
				this.#zoom();
				return;
			}
			this.hide();
		}
		/**
		* Handles an Escape-key interaction.
		*/
		handleEscape() {
			if (!this.options.keyboard) return;
			if (this.options.backdrop === "static") {
				this.#zoom();
				return;
			}
			this.hide();
		}
		/**
		* Hides the modal.
		*/
		hide() {
			if (this.#transitioning || !$.hasClass(this.node, "show") || !$.triggerOne(this.node, "hide.ui.modal")) return;
			this.#transitioning = true;
			this.#zooming = false;
			$.removeClass(this.node, "modal-static");
			if (this.#focusTrap) this.#focusTrap.deactivate();
			$.addClass(this.node, "hiding");
			$.removeClass(this.node, "show");
			if (this.#backdrop) $.removeClass(this.#backdrop, "show");
			const transitions = [waitForTransition(this.#dialog, ["opacity", "transform"])];
			if (this.#backdrop) transitions.push(waitForTransition(this.#backdrop, ["opacity"]));
			Promise.all(transitions).then((_) => {
				if (!this.node) return;
				const modal = this.node;
				this.#cleanup();
				$.triggerEvent(modal, "hidden.ui.modal");
			});
		}
		/**
		* Shows the modal.
		* @param {HTMLElement} [relatedTarget] The element that triggered the Modal.
		*/
		show(relatedTarget) {
			if (relatedTarget) this.#activeTarget = relatedTarget;
			if (this.#transitioning || $.hasClass(this.node, "show") || !$.triggerOne(this.node, "show.ui.modal", { data: { relatedTarget: this.#activeTarget } })) return;
			this.#transitioning = true;
			const stackSize = $.find(".modal:is(.show, .hiding)").length;
			$.removeClass(document.body, "modal-open");
			this.#scrollNodes = [this.#dialog];
			if (!stackSize && !$.findOne(".offcanvas.show")) {
				this.#scrollNodes.push(document.body);
				this.#scrollNodes.push(...$.find(".fixed-top, .fixed-bottom"));
			}
			addScrollPadding(this.#scrollNodes);
			$.addClass(document.body, "modal-open");
			if (this.options.backdrop) {
				this.#backdrop = $.create("div", { class: "modal-backdrop" });
				$.append(document.body, this.#backdrop);
			}
			setStackIndex(this, stackSize);
			$.css(this.#dialog, "opacity");
			$.addClass(this.node, "show");
			const transitions = [waitForTransition(this.#dialog, ["opacity", "transform"], { modal: this.node })];
			if (this.#backdrop) {
				$.addClass(this.#backdrop, "show");
				transitions.push(waitForTransition(this.#backdrop, ["opacity"]));
			}
			Promise.all(transitions).then(([{ modal }]) => {
				if (!this.node) return;
				this.#transitioning = false;
				$.setAttribute(modal, {
					"aria-hidden": false,
					"aria-modal": true
				});
				if (this.#focusTrap) this.#focusTrap.activate();
				$.triggerEvent(modal, "shown.ui.modal");
			});
		}
		/**
		* Toggles the modal.
		*/
		toggle() {
			if ($.hasClass(this.node, "show")) this.hide();
			else this.show();
		}
		/**
		* Restores the hidden modal state.
		* @param {boolean} [restoreFocus=true] Whether to restore focus to the active target.
		*/
		#cleanup(restoreFocus = true) {
			const [dialog, ...sharedScrollNodes] = this.#scrollNodes;
			$.removeClass(this.node, "hiding modal-static show");
			$.setAttribute(this.node, {
				"aria-hidden": true,
				"aria-modal": false
			});
			if (dialog) resetScrollPadding([dialog]);
			if ($.getStyle(this.node, "zIndex")) $.setStyle(this.node, { zIndex: "" });
			if (this.#backdrop) $.remove(this.#backdrop);
			const modals = updateStack();
			if (modals.length) modals[0].#scrollNodes.push(...sharedScrollNodes);
			else {
				resetScrollPadding(sharedScrollNodes);
				$.removeClass(document.body, "modal-open");
			}
			if (restoreFocus && this.#activeTarget) $.focus(this.#activeTarget);
			this.#activeTarget = null;
			this.#scrollNodes = null;
			this.#backdrop = null;
			this.#transitioning = false;
			this.#zooming = false;
		}
		/**
		* Runs the static-backdrop feedback animation.
		*/
		#zoom() {
			if (this.#transitioning || this.#zooming) return;
			this.#zooming = true;
			$.addClass(this.node, "modal-static");
			waitForTransition(this.#dialog, ["transform"], { modal: this.node }).then(({ modal, node }) => {
				if (!this.node) return;
				$.removeClass(modal, "modal-static");
				return waitForTransition(node, ["transform"]);
			}).then((_) => {
				if (this.node) this.#zooming = false;
			});
		}
	};

//#endregion
//#region src/js/modal/helpers.js
/**
	* Gets the top modal.
	* @returns {Modal|null} The highest visible modal, or `null` if none is shown.
	*/
	function getTopModal() {
		const nodes = $.find(".modal.show");
		if (!nodes.length) return null;
		let node = nodes.shift();
		let highestZIndex = $.getStyle(node, "zIndex");
		for (const otherNode of nodes) {
			const newZIndex = $.getStyle(otherNode, "zIndex");
			if (newZIndex <= highestZIndex) continue;
			node = otherNode;
			highestZIndex = newZIndex;
		}
		return Modal.init(node);
	}
	/**
	* Sets the stacking level for a modal and its backdrop.
	* @param {Modal} modal The modal instance.
	* @param {number} index The zero-based stack index.
	*/
	function setStackIndex(modal, index) {
		$.setStyle(modal.node, { zIndex: "" });
		if (modal.backdrop) $.setStyle(modal.backdrop, { zIndex: "" });
		if (!index) return;
		const stackOffset = index * 20;
		const modalZIndex = parseInt($.css(modal.node, "zIndex")) + stackOffset;
		$.setStyle(modal.node, { zIndex: modalZIndex });
		if (modal.backdrop) {
			const backdropZIndex = parseInt($.css(modal.backdrop, "zIndex")) + stackOffset;
			$.setStyle(modal.backdrop, { zIndex: backdropZIndex });
		}
	}
	/**
	* Reindexes visible modals and their backdrops.
	* @returns {Modal[]} The ordered modal instances.
	*/
	function updateStack() {
		const nodes = $.find(".modal.show");
		nodes.sort((nodeA, nodeB) => parseInt($.css(nodeA, "zIndex")) - parseInt($.css(nodeB, "zIndex")));
		const modals = [];
		for (const [index, node] of nodes.entries()) {
			const modal = Modal.init(node);
			setStackIndex(modal, index);
			modals.push(modal);
		}
		return modals;
	}

//#endregion
//#region src/js/modal/index.js
	initComponent("modal", Modal);
	$.addEventDelegate(document, "click.ui.modal", "[data-ui-toggle=\"modal\"]", (e) => {
		e.preventDefault();
		const target = getTarget(e.currentTarget, ".modal");
		Modal.init(target).show(e.currentTarget);
	});
	$.addEventDelegate(document, "click.ui.modal", "[data-ui-dismiss=\"modal\"]", (e) => {
		e.preventDefault();
		const target = getTarget(e.currentTarget, ".modal");
		Modal.init(target).hide();
	});
	$.addEvent(window, "click.ui.modal", (e) => {
		const target = getClickTarget(e);
		if ($.is(target, "[data-ui-dismiss]")) return;
		const modal = getTopModal();
		if (!modal) return;
		modal.handleBackdrop(target);
	});
	$.addEvent(window, "keydown.ui.modal", (e) => {
		if (e.code !== "Escape") return;
		const modal = getTopModal();
		if (!modal) return;
		modal.handleEscape();
	});
	var modal_default = Modal;

//#endregion
//#region src/js/offcanvas/offcanvas.js
/**
	* @typedef {object} OffcanvasOptions
	* @property {boolean|'static'} [backdrop=true] Whether to show a dismissible or static backdrop.
	* @property {boolean} [keyboard=true] Whether Escape hides the offcanvas element.
	* @property {boolean} [scroll=false] Whether body scrolling remains enabled while shown.
	*/
	/**
	* Controls an offcanvas panel and its backdrop.
	* @augments {BaseComponent<OffcanvasOptions>}
	*/
	var Offcanvas = class extends BaseComponent {
		/** @type {OffcanvasOptions} */
		static defaults = {
			backdrop: true,
			keyboard: true,
			scroll: false
		};
		#activeTarget;
		#focusTrap;
		#scrollNodes;
		#transitioning;
		/**
		* Creates an Offcanvas.
		* @param {HTMLElement} node The input node.
		* @param {OffcanvasOptions} [options] The offcanvas options.
		*/
		constructor(node, options) {
			super(node, options);
			if (!this.options.scroll || this.options.backdrop) this.#focusTrap = focus_trap_default.init(this.node);
		}
		/** @inheritdoc */
		dispose() {
			if (this.#scrollNodes) this.#cleanup(false);
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
			if (!this.options.backdrop || this.options.backdrop === "static" || $.isSame(this.node, target) || $.hasDescendent(this.node, target)) return;
			this.hide();
		}
		/**
		* Handles an Escape-key interaction.
		*/
		handleEscape() {
			if (this.options.keyboard) this.hide();
		}
		/**
		* Hides the offcanvas panel.
		*/
		hide() {
			if (this.#transitioning || !$.hasClass(this.node, "show") || !$.triggerOne(this.node, "hide.ui.offcanvas")) return;
			this.#transitioning = true;
			if (this.#focusTrap) this.#focusTrap.deactivate();
			$.addClass(this.node, "hiding");
			waitForTransition(this.node, ["opacity", "transform"]).then((_) => {
				if (!this.node) return;
				const offcanvas = this.node;
				this.#cleanup();
				$.triggerEvent(offcanvas, "hidden.ui.offcanvas");
			});
		}
		/**
		* Shows the offcanvas panel.
		* @param {HTMLElement} [relatedTarget] The element that triggered the Offcanvas.
		*/
		show(relatedTarget) {
			if (relatedTarget) this.#activeTarget = relatedTarget;
			if (this.#transitioning || $.hasClass(this.node, "show") || $.findOne(".offcanvas.show") || !$.triggerOne(this.node, "show.ui.offcanvas")) return;
			this.#transitioning = true;
			if (this.options.backdrop) $.addClass(document.body, "offcanvas-backdrop");
			this.#scrollNodes = [];
			if (!this.options.scroll) {
				this.#scrollNodes.push(document.body);
				this.#scrollNodes.push(...$.find(".fixed-top, .fixed-bottom"));
				addScrollPadding(this.#scrollNodes);
				$.setStyle(document.body, { overflow: "hidden" });
			}
			$.css(this.node, "opacity");
			$.addClass(this.node, "show");
			waitForTransition(this.node, ["opacity", "transform"]).then(({ node }) => {
				if (!this.node) return;
				this.#transitioning = false;
				$.setAttribute(node, {
					"aria-hidden": false,
					"aria-modal": true
				});
				if (this.#focusTrap) this.#focusTrap.activate();
				$.triggerEvent(node, "shown.ui.offcanvas");
			});
		}
		/**
		* Toggles the offcanvas panel.
		*/
		toggle() {
			if ($.hasClass(this.node, "show")) this.hide();
			else this.show();
		}
		/**
		* Restores the hidden offcanvas state.
		* @param {boolean} [restoreFocus=true] Whether to restore focus to the active target.
		*/
		#cleanup(restoreFocus = true) {
			$.removeClass(this.node, "hiding show");
			$.setAttribute(this.node, {
				"aria-hidden": true,
				"aria-modal": false
			});
			if (this.options.backdrop) $.removeClass(document.body, "offcanvas-backdrop");
			if (!this.options.scroll) {
				resetScrollPadding(this.#scrollNodes);
				$.setStyle(document.body, { overflow: "" });
			}
			if (restoreFocus && this.#activeTarget) $.focus(this.#activeTarget);
			this.#activeTarget = null;
			this.#scrollNodes = null;
			this.#transitioning = false;
		}
	};

//#endregion
//#region src/js/offcanvas/index.js
	initComponent("offcanvas", Offcanvas);
	$.addEventDelegate(document, "click.ui.offcanvas", "[data-ui-toggle=\"offcanvas\"]", (e) => {
		e.preventDefault();
		const target = getTarget(e.currentTarget, ".offcanvas");
		Offcanvas.init(target).show(e.currentTarget);
	});
	$.addEventDelegate(document, "click.ui.offcanvas", "[data-ui-dismiss=\"offcanvas\"]", (e) => {
		e.preventDefault();
		const target = getTarget(e.currentTarget, ".offcanvas");
		Offcanvas.init(target).hide();
	});
	$.addEvent(document, "click.ui.offcanvas", (e) => {
		const target = getClickTarget(e);
		if ($.is(target, "[data-ui-dismiss]") || $.findOne(".modal.show")) return;
		const nodes = $.find(".offcanvas.show");
		if (!nodes.length) return;
		for (const node of nodes) Offcanvas.init(node).handleBackdrop(target);
	});
	$.addEvent(document, "keydown.ui.offcanvas", (e) => {
		if (e.code !== "Escape" || $.findOne(".modal.show")) return;
		const nodes = $.find(".offcanvas.show");
		if (!nodes.length) return;
		for (const node of nodes) Offcanvas.init(node).handleEscape();
	});
	var offcanvas_default = Offcanvas;

//#endregion
//#region src/js/popper/index.js
	initComponent("popper", Popper);
	var popper_default = Popper;

//#endregion
//#region src/js/popover/popover.js
/** @import { Placement, Position } from '../popper/popper.js'; */
	/**
	* @typedef {object} PopoverOptions
	* @property {string} [template] The popover markup template.
	* @property {string|null} [customClass=null] An additional class for the popover.
	* @property {boolean} [animation=true] Whether to animate the popover.
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
	* @property {string} [title] The popover title.
	* @property {string} [content] The popover body content.
	*/
	/**
	* Controls a popover anchored to a reference element.
	* @augments {BaseComponent<PopoverOptions>}
	*/
	var Popover = class extends BaseComponent {
		/** @type {PopoverOptions} */
		static defaults = {
			template: "<div class=\"popover\" role=\"tooltip\"><div class=\"popover-arrow\"></div><h3 class=\"popover-header\"></h3><div class=\"popover-body\"></div></div>",
			customClass: null,
			animation: true,
			enable: true,
			html: false,
			appendTo: null,
			sanitize: (input) => $.sanitize(input),
			trigger: "click",
			placement: "auto",
			position: "center",
			fixed: false,
			spacing: 3,
			minContact: false
		};
		#arrow;
		#enabled;
		#hideModalEvent;
		#modal;
		#popover;
		#popoverBody;
		#popoverHeader;
		#popper;
		#transition;
		#triggers;
		/**
		* Creates a Popover.
		* @param {HTMLElement} node The input node.
		* @param {PopoverOptions} [options] The popover options.
		*/
		constructor(node, options) {
			super(node, options);
			this.#modal = $.closest(this.node, ".modal").shift();
			this.#triggers = this.options.trigger.split(" ");
			this.#render();
			this.#events();
			if (this.options.enable) this.enable();
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
			if ($.hasDataset(this.node, "uiOriginalTitle")) {
				const title = $.getDataset(this.node, "uiOriginalTitle");
				$.setAttribute(this.node, { title });
				$.removeDataset(this.node, "uiOriginalTitle");
			}
			if (this.#popper) {
				this.#popper.dispose();
				this.#popper = null;
			}
			$.remove(this.#popover);
			if (this.#triggers.includes("hover")) {
				$.removeEvent(this.node, "mouseover.ui.popover");
				$.removeEvent(this.node, "mouseout.ui.popover");
			}
			if (this.#triggers.includes("focus")) {
				$.removeEvent(this.node, "focus.ui.popover");
				$.removeEvent(this.node, "blur.ui.popover");
			}
			if (this.#triggers.includes("click")) $.removeEvent(this.node, "click.ui.popover");
			if (this.#modal) $.removeEvent(this.#modal, "hide.ui.modal", this.#hideModalEvent);
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
			if (!force && !this.#enabled || this.#transition?.direction === "out" || !$.isConnected(this.#popover) || !$.triggerOne(this.node, "hide.ui.popover")) return;
			const transition = { direction: "out" };
			this.#transition = transition;
			$.removeClass(this.#popover, "show");
			waitForTransition(this.#popover, ["opacity"], { toggle: this.node }).then(({ node, toggle }) => {
				if (this.#transition !== transition) return;
				this.#transition = null;
				if (this.#popper) {
					this.#popper.dispose();
					this.#popper = null;
				}
				$.detach(node);
				$.removeAttribute(toggle, "aria-describedby");
				$.triggerEvent(toggle, "hidden.ui.popover");
			});
		}
		/**
		* Refreshes the popover title and body content.
		*/
		refresh() {
			if ($.hasAttribute(this.node, "title")) {
				const originalTitle = $.getAttribute(this.node, "title");
				$.setDataset(this.node, { uiOriginalTitle: originalTitle });
				$.removeAttribute(this.node, "title");
			}
			let title = "";
			if ($.hasDataset(this.node, "uiTitle")) title = $.getDataset(this.node, "uiTitle");
			else if (this.options.title) title = this.options.title;
			else if ($.hasDataset(this.node, "uiOriginalTitle")) title = $.getDataset(this.node, "uiOriginalTitle", title);
			let content = "";
			if ($.hasDataset(this.node, "uiContent")) content = $.getDataset(this.node, "uiContent");
			else if (this.options.content) content = this.options.content;
			const method = this.options.html ? "setHtml" : "setText";
			$[method](this.#popoverHeader, this.options.html && this.options.sanitize ? this.options.sanitize(title) : title);
			if (!title) $.hide(this.#popoverHeader);
			else $.show(this.#popoverHeader);
			$[method](this.#popoverBody, this.options.html && this.options.sanitize ? this.options.sanitize(content) : content);
		}
		/**
		* Shows the popover.
		*/
		show() {
			const connected = $.isConnected(this.#popover);
			if (!this.#enabled || connected && this.#transition?.direction !== "out" || !$.triggerOne(this.node, "show.ui.popover")) return;
			this.refresh();
			if (!connected) {
				this.#show();
				$.css(this.#popover, "opacity");
			}
			const transition = { direction: "in" };
			this.#transition = transition;
			$.addClass(this.#popover, "show");
			waitForTransition(this.#popover, ["opacity"], { toggle: this.node }).then(({ toggle }) => {
				if (this.#transition !== transition) return;
				this.#transition = null;
				$.triggerEvent(toggle, "shown.ui.popover");
			});
		}
		/**
		* Toggles the popover.
		* @param {{force?: boolean}} [options] The toggle options. Force defaults to `true`.
		*/
		toggle({ force = true } = {}) {
			if ($.isConnected(this.#popover) && this.#transition?.direction !== "out") this.hide({ force });
			else this.show();
		}
		/**
		* Updates the popover position.
		*/
		update() {
			if (this.#popper) this.#popper.update();
		}
		/**
		* Attaches popover interaction handlers.
		*/
		#events() {
			if (this.#triggers.includes("hover")) {
				$.addEvent(this.node, "mouseover.ui.popover", (_) => {
					this.show();
				});
				$.addEvent(this.node, "mouseout.ui.popover", (_) => {
					this.hide({ force: false });
				});
			}
			if (this.#triggers.includes("focus")) {
				$.addEvent(this.node, "focus.ui.popover", (_) => {
					this.show();
				});
				$.addEvent(this.node, "blur.ui.popover", (_) => {
					this.hide({ force: false });
				});
			}
			if (this.#triggers.includes("click")) $.addEvent(this.node, "click.ui.popover", (e) => {
				e.preventDefault();
				this.toggle({ force: false });
			});
			if (this.#modal) {
				this.#hideModalEvent = (_) => {
					this.hide();
				};
				$.addEvent(this.#modal, "hide.ui.modal", this.#hideModalEvent);
			}
		}
		/**
		* Creates the popover element from its template.
		*/
		#render() {
			this.#popover = $.parseHtml(this.options.template).shift();
			if (this.options.animation) $.addClass(this.#popover, "fade");
			if (this.options.customClass) $.addClass(this.#popover, this.options.customClass);
			this.#arrow = $.findOne(".popover-arrow", this.#popover);
			this.#popoverHeader = $.findOne(".popover-header", this.#popover);
			this.#popoverBody = $.findOne(".popover-body", this.#popover);
		}
		/**
		* Appends and positions the popover element.
		*/
		#show() {
			if (this.options.appendTo) $.append(this.options.appendTo, this.#popover);
			else $.after(this.node, this.#popover);
			const id = generateId(this.constructor.DATA_KEY);
			$.setAttribute(this.#popover, { id });
			$.setAttribute(this.node, { "aria-describedby": id });
			this.#popper = new popper_default(this.#popover, {
				reference: this.node,
				arrow: this.#arrow,
				placement: this.options.placement,
				position: this.options.position,
				fixed: this.options.fixed,
				spacing: this.options.spacing,
				minContact: this.options.minContact
			});
			window.requestAnimationFrame((_) => {
				this.update();
			});
		}
	};

//#endregion
//#region src/js/popover/index.js
	initComponent("popover", Popover);
	var popover_default = Popover;

//#endregion
//#region src/js/tab/helpers.js
/**
	* Gets the tab controls in the same tab list as a control.
	* @param {HTMLElement} node The tab control.
	* @returns {HTMLElement[]} The tab controls.
	*/
	function getTabGroup(node) {
		const tabList = $.closest(node, ".nav, [role=\"tablist\"]").shift() || $.parent(node).shift();
		return tabList ? $.find("[data-ui-toggle=\"tab\"]", tabList) : [node];
	}

//#endregion
//#region src/js/tab/tab.js
/**
	* Controls a tab trigger and its associated panel.
	*/
	var Tab = class extends BaseComponent {
		#siblings;
		#target;
		#transition;
		/**
		* Creates a Tab.
		* @param {HTMLElement} node The input node.
		*/
		constructor(node) {
			super(node);
			const selector = getTargetSelector(this.node);
			this.#target = $.findOne(selector);
			this.#siblings = getTabGroup(this.node).filter((node) => !$.isSame(node, this.node));
		}
		/** @inheritdoc */
		dispose() {
			this.#siblings = null;
			this.#target = null;
			this.#transition = null;
			super.dispose();
		}
		/**
		* Hides the current tab.
		*/
		hide() {
			if (!$.hasClass(this.#target, "active") || !$.triggerOne(this.node, "hide.ui.tab")) return;
			this.#hide();
			$.triggerEvent(this.node, "hidden.ui.tab");
		}
		/**
		* Hides the active tab and shows the current tab.
		*/
		show() {
			if ($.hasClass(this.#target, "active")) return;
			const active = this.#siblings.find((sibling) => $.hasClass(sibling, "active"));
			const canHide = !active || $.triggerOne(active, "hide.ui.tab");
			const canShow = $.triggerOne(this.node, "show.ui.tab");
			if (!canHide || !canShow) return;
			if (active) this.constructor.init(active).#hide();
			this.#show();
			if (active) $.triggerEvent(active, "hidden.ui.tab");
		}
		/**
		* Hides the current tab without checking its state or events.
		*/
		#hide() {
			this.#transition = null;
			$.removeClass(this.#target, "active show");
			$.removeClass(this.node, "active");
			$.setAttribute(this.node, { "aria-selected": false });
		}
		/**
		* Shows the current tab without checking its state or events.
		*/
		#show() {
			const transition = {};
			this.#transition = transition;
			$.addClass(this.#target, "active");
			$.addClass(this.node, "active");
			$.setAttribute(this.node, { "aria-selected": true });
			$.css(this.#target, "opacity");
			$.addClass(this.#target, "show");
			waitForTransition(this.#target, ["opacity"], { toggle: this.node }).then(({ toggle }) => {
				if (this.#transition !== transition) return;
				this.#transition = null;
				$.triggerEvent(toggle, "shown.ui.tab");
			});
		}
	};

//#endregion
//#region src/js/tab/index.js
	initComponent("tab", Tab);
	$.addEventDelegate(document, "click.ui.tab keydown.ui.tab", "[data-ui-toggle=\"tab\"]", (e) => {
		if (e.code && e.code !== "Space") return;
		e.preventDefault();
		Tab.init(e.currentTarget).show();
	});
	$.addEventDelegate(document, "keydown.ui.tab", "[data-ui-toggle=\"tab\"]", (e) => {
		const tabs = getTabGroup(e.currentTarget).filter((node) => !$.is(node, ":disabled, .disabled"));
		const index = tabs.indexOf(e.currentTarget);
		if (index < 0) return;
		let newTarget;
		switch (e.code) {
			case "ArrowDown":
			case "ArrowRight":
				newTarget = tabs[index + 1];
				break;
			case "ArrowLeft":
			case "ArrowUp":
				newTarget = tabs[index - 1];
				break;
			case "Home":
				newTarget = tabs[0];
				break;
			case "End":
				newTarget = tabs[tabs.length - 1];
				break;
			default: return;
		}
		if (!newTarget || $.isSame(newTarget, e.currentTarget)) return;
		e.preventDefault();
		$.focus(newTarget);
		Tab.init(newTarget).show();
	});
	var tab_default = Tab;

//#endregion
//#region src/js/toast/toast.js
/**
	* @typedef {object} ToastOptions
	* @property {boolean} [autohide=true] Whether to hide the toast automatically.
	* @property {number} [delay=5000] The autohide delay in milliseconds.
	*/
	/**
	* Controls a transient toast notification.
	* @augments {BaseComponent<ToastOptions>}
	*/
	var Toast = class extends BaseComponent {
		/** @type {ToastOptions} */
		static defaults = {
			autohide: true,
			delay: 5e3
		};
		#timer;
		#transitioning;
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
			if (this.#transitioning || !$.hasClass(this.node, "show") || !$.triggerOne(this.node, "hide.ui.toast")) return;
			clearTimeout(this.#timer);
			this.#timer = null;
			this.#transitioning = true;
			$.css(this.node, "opacity");
			$.removeClass(this.node, "show");
			waitForTransition(this.node, ["opacity"]).then(({ node }) => {
				this.#transitioning = false;
				$.setStyle(node, { display: "none" }, null, { important: true });
				$.triggerEvent(node, "hidden.ui.toast");
			});
		}
		/**
		* Shows the toast.
		*/
		show() {
			if (this.#transitioning || $.hasClass(this.node, "show") || !$.triggerOne(this.node, "show.ui.toast")) return;
			clearTimeout(this.#timer);
			this.#timer = null;
			this.#transitioning = true;
			$.setStyle(this.node, { display: "" });
			$.css(this.node, "opacity");
			$.addClass(this.node, "show");
			waitForTransition(this.node, ["opacity"]).then(({ node }) => {
				this.#transitioning = false;
				if (this.options?.autohide) this.#timer = setTimeout((_) => {
					this.#timer = null;
					this.hide();
				}, this.options.delay);
				$.triggerEvent(node, "shown.ui.toast");
			});
		}
	};

//#endregion
//#region src/js/toast/index.js
	initComponent("toast", Toast);
	$.addEventDelegate(document, "click.ui.toast", "[data-ui-dismiss=\"toast\"]", (e) => {
		e.preventDefault();
		const target = getTarget(e.currentTarget, ".toast");
		Toast.init(target, { autohide: false }).hide();
	});
	var toast_default = Toast;

//#endregion
//#region src/js/tooltip/tooltip.js
/** @import { Placement, Position } from '../popper/popper.js'; */
	/**
	* @typedef {object} TooltipOptions
	* @property {string} [template] The tooltip markup template.
	* @property {string|null} [customClass=null] An additional class for the tooltip.
	* @property {boolean} [animation=true] Whether to animate the tooltip.
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
	* @property {string} [title] The tooltip title.
	*/
	/**
	* Controls a tooltip anchored to a reference element.
	* @augments {BaseComponent<TooltipOptions>}
	*/
	var Tooltip = class extends BaseComponent {
		/** @type {TooltipOptions} */
		static defaults = {
			template: "<div class=\"tooltip\" role=\"tooltip\"><div class=\"tooltip-arrow\"></div><div class=\"tooltip-inner\"></div></div>",
			customClass: null,
			animation: true,
			enable: true,
			html: false,
			trigger: "hover focus",
			appendTo: null,
			sanitize: (input) => $.sanitize(input),
			placement: "auto",
			position: "center",
			fixed: false,
			spacing: 2,
			minContact: false
		};
		#arrow;
		#enabled;
		#hideModalEvent;
		#modal;
		#popper;
		#tooltip;
		#tooltipInner;
		#transition;
		#triggers;
		/**
		* Creates a Tooltip.
		* @param {HTMLElement} node The input node.
		* @param {TooltipOptions} [options] The tooltip options.
		*/
		constructor(node, options) {
			super(node, options);
			this.#modal = $.closest(this.node, ".modal").shift();
			this.#triggers = this.options.trigger.split(" ");
			this.#render();
			this.#events();
			if (this.options.enable) this.enable();
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
			if ($.hasDataset(this.node, "uiOriginalTitle")) {
				const title = $.getDataset(this.node, "uiOriginalTitle");
				$.setAttribute(this.node, { title });
				$.removeDataset(this.node, "uiOriginalTitle");
			}
			if (this.#popper) {
				this.#popper.dispose();
				this.#popper = null;
			}
			$.remove(this.#tooltip);
			if (this.#triggers.includes("hover")) {
				$.removeEvent(this.node, "mouseover.ui.tooltip");
				$.removeEvent(this.node, "mouseout.ui.tooltip");
			}
			if (this.#triggers.includes("focus")) {
				$.removeEvent(this.node, "focus.ui.tooltip");
				$.removeEvent(this.node, "blur.ui.tooltip");
			}
			if (this.#triggers.includes("click")) $.removeEvent(this.node, "click.ui.tooltip");
			if (this.#modal) $.removeEvent(this.#modal, "hide.ui.modal", this.#hideModalEvent);
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
			if (!force && !this.#enabled || this.#transition?.direction === "out" || !$.isConnected(this.#tooltip) || !$.triggerOne(this.node, "hide.ui.tooltip")) return;
			const transition = { direction: "out" };
			this.#transition = transition;
			$.removeClass(this.#tooltip, "show");
			waitForTransition(this.#tooltip, ["opacity"], { toggle: this.node }).then(({ node, toggle }) => {
				if (this.#transition !== transition) return;
				this.#transition = null;
				if (this.#popper) {
					this.#popper.dispose();
					this.#popper = null;
				}
				$.detach(node);
				$.removeAttribute(toggle, "aria-describedby");
				$.triggerEvent(toggle, "hidden.ui.tooltip");
			});
		}
		/**
		* Refreshes the tooltip title.
		*/
		refresh() {
			if ($.hasAttribute(this.node, "title")) {
				const originalTitle = $.getAttribute(this.node, "title");
				$.setDataset(this.node, { uiOriginalTitle: originalTitle });
				$.removeAttribute(this.node, "title");
			}
			let title = "";
			if ($.hasDataset(this.node, "uiTitle")) title = $.getDataset(this.node, "uiTitle");
			else if (this.options.title) title = this.options.title;
			else if ($.hasDataset(this.node, "uiOriginalTitle")) title = $.getDataset(this.node, "uiOriginalTitle", title);
			const method = this.options.html ? "setHtml" : "setText";
			$[method](this.#tooltipInner, this.options.html && this.options.sanitize ? this.options.sanitize(title) : title);
			this.update();
		}
		/**
		* Shows the tooltip.
		*/
		show() {
			const connected = $.isConnected(this.#tooltip);
			if (!this.#enabled || connected && this.#transition?.direction !== "out" || !$.triggerOne(this.node, "show.ui.tooltip")) return;
			this.refresh();
			if (!connected) {
				this.#show();
				$.css(this.#tooltip, "opacity");
			}
			const transition = { direction: "in" };
			this.#transition = transition;
			$.addClass(this.#tooltip, "show");
			waitForTransition(this.#tooltip, ["opacity"], { toggle: this.node }).then(({ toggle }) => {
				if (this.#transition !== transition) return;
				this.#transition = null;
				$.triggerEvent(toggle, "shown.ui.tooltip");
			});
		}
		/**
		* Toggles the tooltip.
		* @param {{force?: boolean}} [options] The toggle options. Force defaults to `true`.
		*/
		toggle({ force = true } = {}) {
			if ($.isConnected(this.#tooltip) && this.#transition?.direction !== "out") this.hide({ force });
			else this.show();
		}
		/**
		* Updates the tooltip position.
		*/
		update() {
			if (this.#popper) this.#popper.update();
		}
		/**
		* Attaches tooltip interaction handlers.
		*/
		#events() {
			if (this.#triggers.includes("hover")) {
				$.addEvent(this.node, "mouseover.ui.tooltip", (_) => {
					this.show();
				});
				$.addEvent(this.node, "mouseout.ui.tooltip", (_) => {
					this.hide({ force: false });
				});
			}
			if (this.#triggers.includes("focus")) {
				$.addEvent(this.node, "focus.ui.tooltip", (_) => {
					this.show();
				});
				$.addEvent(this.node, "blur.ui.tooltip", (_) => {
					this.hide({ force: false });
				});
			}
			if (this.#triggers.includes("click")) $.addEvent(this.node, "click.ui.tooltip", (e) => {
				e.preventDefault();
				this.toggle({ force: false });
			});
			if (this.#modal) {
				this.#hideModalEvent = (_) => {
					this.hide();
				};
				$.addEvent(this.#modal, "hide.ui.modal", this.#hideModalEvent);
			}
		}
		/**
		* Creates the tooltip element from its template.
		*/
		#render() {
			this.#tooltip = $.parseHtml(this.options.template).shift();
			if (this.options.animation) $.addClass(this.#tooltip, "fade");
			if (this.options.customClass) $.addClass(this.#tooltip, this.options.customClass);
			this.#arrow = $.findOne(".tooltip-arrow", this.#tooltip);
			this.#tooltipInner = $.findOne(".tooltip-inner", this.#tooltip);
		}
		/**
		* Appends and positions the tooltip element.
		*/
		#show() {
			if (this.options.appendTo) $.append(this.options.appendTo, this.#tooltip);
			else $.after(this.node, this.#tooltip);
			const id = generateId(this.constructor.DATA_KEY);
			$.setAttribute(this.#tooltip, { id });
			$.setAttribute(this.node, { "aria-describedby": id });
			this.#popper = new popper_default(this.#tooltip, {
				reference: this.node,
				arrow: this.#arrow,
				placement: this.options.placement,
				position: this.options.position,
				fixed: this.options.fixed,
				spacing: this.options.spacing,
				minContact: this.options.minContact
			});
			window.requestAnimationFrame((_) => {
				this.update();
			});
		}
	};

//#endregion
//#region src/js/tooltip/index.js
	initComponent("tooltip", Tooltip);
	var tooltip_default = Tooltip;

//#endregion
//#region src/js/clipboard/index.js
	$.addEventDelegate(document, "click", "[data-ui-toggle=\"clipboard\"]", (e) => {
		e.preventDefault();
		const node = e.currentTarget;
		let { action = "copy", text = null } = getDataset(node);
		if (!["copy", "cut"].includes(action)) throw new Error("Invalid clipboard action");
		let input;
		if (!text) {
			const target = getTarget(node);
			if ($.is(target, "input, textarea")) {
				input = target;
				text = $.getValue(input);
			} else text = $.getText(target);
		}
		const customText = !input;
		if (customText) {
			input = $.create("textarea", {
				class: "visually-hidden position-fixed",
				value: text
			});
			$.append(document.body, input);
		}
		$.select(input);
		if ($.exec(action)) $.triggerEvent(node, "copied.ui.clipboard", { data: {
			action,
			text
		} });
		if (customText) $.detach(input);
	});

//#endregion
//#region src/js/ripple/index.js
	$.addEventDelegate(document, "click.ui.ripple", ".ripple", (e) => {
		if (e.button !== 0) return;
		const target = e.currentTarget;
		const pos = $.position(target, { offset: true });
		const width = $.width(target);
		const height = $.height(target);
		const scaleMultiple = Math.max(width, height);
		const isFixed = $.isFixed(target);
		const mouseX = isFixed ? e.clientX : e.pageX;
		const mouseY = isFixed ? e.clientY : e.pageY;
		const prevRipple = $.findOne(":scope > .ripple-effect", target);
		if (prevRipple) $.remove(prevRipple);
		const ripple = $.create("span", {
			class: "ripple-effect",
			style: {
				left: mouseX - pos.x,
				top: mouseY - pos.y
			}
		});
		$.setStyle(ripple, { "--ui-ripple-scale": scaleMultiple });
		$.append(target, ripple);
		$.css(ripple, "transform");
		$.addClass(ripple, "show");
		waitForTransition(ripple, ["transform", "opacity"]).then(({ node }) => {
			$.detach(node);
		});
	});

//#endregion
//#region src/js/text-expand/index.js
	$.addEventDelegate(document, "change.ui.expand input.ui.expand", ".text-expand", (e) => {
		const textArea = e.currentTarget;
		$.setStyle(textArea, { height: "inherit" });
		let newHeight = $.height(textArea, { boxSize: $.SCROLL_BOX });
		newHeight += parseInt($.css(textArea, "borderTop"));
		newHeight += parseInt($.css(textArea, "borderBottom"));
		$.setStyle(textArea, { height: `${newHeight}px` });
	});

//#endregion
exports.Alert = alert_default;
exports.BaseComponent = BaseComponent;
exports.Button = button_default;
exports.Carousel = carousel_default;
exports.Collapse = collapse_default;
exports.Dropdown = dropdown_default;
exports.FocusTrap = focus_trap_default;
exports.Modal = modal_default;
exports.Offcanvas = offcanvas_default;
exports.Popover = popover_default;
exports.Popper = popper_default;
exports.Tab = tab_default;
exports.Toast = toast_default;
exports.Tooltip = tooltip_default;
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
exports.waitForTransition = waitForTransition;
});
//# sourceMappingURL=frost-ui.js.map