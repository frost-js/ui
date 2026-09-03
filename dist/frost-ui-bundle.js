(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ?  factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global.UI = {})));
})(this, function(exports) {
Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
//#region \0rolldown/runtime.js
	var __defProp = Object.defineProperty;
	var __exportAll = (all, no_symbols) => {
		let target = {};
		for (var name in all) {
			__defProp(target, name, {
				get: all[name],
				enumerable: true
			});
		}
		if (!no_symbols) {
			__defProp(target, Symbol.toStringTag, { value: "Module" });
		}
		return target;
	};

//#endregion
//#region node_modules/@fr0st/core/dist/frost-core.esm.js
	var frost_core_esm_exports = /* @__PURE__ */ __exportAll({
		animation: () => animation,
		camelCase: () => camelCase,
		capitalize: () => capitalize,
		clamp: () => clamp,
		clampPercent: () => clampPercent,
		compose: () => compose,
		curry: () => curry,
		debounce: () => debounce$1,
		diff: () => diff,
		dist: () => dist,
		escape: () => escape,
		escapeRegExp: () => escapeRegExp,
		evaluate: () => evaluate,
		extend: () => extend,
		flatten: () => flatten,
		forgetDot: () => forgetDot,
		getDot: () => getDot,
		hasDot: () => hasDot,
		humanize: () => humanize,
		intersect: () => intersect,
		inverseLerp: () => inverseLerp,
		isArray: () => isArray,
		isArrayLike: () => isArrayLike,
		isBoolean: () => isBoolean,
		isDocument: () => isDocument,
		isElement: () => isElement,
		isFragment: () => isFragment,
		isFunction: () => isFunction,
		isNaN: () => isNaN,
		isNode: () => isNode,
		isNull: () => isNull,
		isNumeric: () => isNumeric,
		isObject: () => isObject,
		isPlainObject: () => isPlainObject,
		isShadow: () => isShadow,
		isString: () => isString,
		isText: () => isText,
		isUndefined: () => isUndefined,
		isWindow: () => isWindow,
		kebabCase: () => kebabCase,
		len: () => len,
		lerp: () => lerp,
		map: () => map,
		merge: () => merge,
		once: () => once,
		partial: () => partial,
		pascalCase: () => pascalCase,
		pipe: () => pipe,
		pluckDot: () => pluckDot,
		random: () => random,
		randomInt: () => randomInt,
		randomString: () => randomString,
		randomValue: () => randomValue,
		range: () => range,
		setDot: () => setDot,
		snakeCase: () => snakeCase,
		throttle: () => throttle,
		times: () => times,
		toStep: () => toStep,
		unescape: () => unescape,
		unique: () => unique,
		wrap: () => wrap
	});
	/**
	* Testing methods
	*/
	var ELEMENT_NODE = 1;
	var TEXT_NODE = 3;
	var COMMENT_NODE = 8;
	var DOCUMENT_NODE = 9;
	var DOCUMENT_FRAGMENT_NODE = 11;
	/**
	* Checks whether a value is an array.
	* @param {*} value The value to test.
	* @returns {boolean} Whether the value is an array.
	*/
	var isArray = Array.isArray;
	/**
	* Checks whether a value is array-like.
	* @param {*} value The value to test.
	* @returns {boolean} Whether the value is array-like.
	*/
	var isArrayLike = (value) => isArray(value) || isObject(value) && !isFunction(value) && !isWindow(value) && !isElement(value) && (Symbol.iterator in value && isFunction(value[Symbol.iterator]) || "length" in value && isNumeric(value.length) && (!value.length || value.length - 1 in value));
	/**
	* Checks whether a value is a boolean.
	* @param {*} value The value to test.
	* @returns {boolean} Whether the value is a boolean.
	*/
	var isBoolean = (value) => value === !!value;
	/**
	* Checks whether a value is a Document.
	* @param {*} value The value to test.
	* @returns {boolean} Whether the value is a Document.
	*/
	var isDocument = (value) => !!value && value.nodeType === DOCUMENT_NODE;
	/**
	* Checks whether a value is an Element.
	* @param {*} value The value to test.
	* @returns {boolean} Whether the value is an Element.
	*/
	var isElement = (value) => !!value && value.nodeType === ELEMENT_NODE;
	/**
	* Checks whether a value is a DocumentFragment (and not a ShadowRoot).
	* @param {*} value The value to test.
	* @returns {boolean} Whether the value is a DocumentFragment.
	*/
	var isFragment = (value) => !!value && value.nodeType === DOCUMENT_FRAGMENT_NODE && !value.host;
	/**
	* Checks whether a value is a function.
	* @param {*} value The value to test.
	* @returns {boolean} Whether the value is a function.
	*/
	var isFunction = (value) => typeof value === "function";
	/**
	* Checks whether a value is NaN.
	* @param {*} value The value to test.
	* @returns {boolean} Whether the value is NaN.
	*/
	var isNaN = Number.isNaN;
	/**
	* Checks whether a value is an Element, Text node, or Comment node.
	* @param {*} value The value to test.
	* @returns {boolean} Whether the value is an Element, Text node, or Comment node.
	*/
	var isNode = (value) => !!value && (value.nodeType === ELEMENT_NODE || value.nodeType === TEXT_NODE || value.nodeType === COMMENT_NODE);
	/**
	* Checks whether a value is null.
	* @param {*} value The value to test.
	* @returns {boolean} Whether the value is null.
	*/
	var isNull = (value) => value === null;
	/**
	* Checks whether a value is numeric.
	* @param {*} value The value to test.
	* @returns {boolean} Whether the value is numeric.
	*/
	var isNumeric = (value) => (() => {
		try {
			return !isNaN(parseFloat(value)) && isFinite(value);
		} catch {
			return false;
		}
	})();
	/**
	* Checks whether a value is an object-like reference, including arrays and functions.
	* @param {*} value The value to test.
	* @returns {boolean} Whether the value is an object-like reference.
	*/
	var isObject = (value) => !!value && value === Object(value);
	/**
	* Checks whether a value is a plain object.
	* @param {*} value The value to test.
	* @returns {boolean} Whether the value is a plain object.
	*/
	var isPlainObject = (value) => isObject(value) && (Object.getPrototypeOf(value) === null || Object.getPrototypeOf(value) === Object.prototype);
	/**
	* Checks whether a value is a ShadowRoot.
	* @param {*} value The value to test.
	* @returns {boolean} Whether the value is a ShadowRoot.
	*/
	var isShadow = (value) => !!value && value.nodeType === DOCUMENT_FRAGMENT_NODE && !!value.host;
	/**
	* Checks whether a value is a string.
	* @param {*} value The value to test.
	* @returns {boolean} Whether the value is a string.
	*/
	var isString = (value) => typeof value === "string";
	/**
	* Checks whether a value is a text Node.
	* @param {*} value The value to test.
	* @returns {boolean} Whether the value is a text Node.
	*/
	var isText = (value) => !!value && value.nodeType === TEXT_NODE;
	/**
	* Checks whether a value is undefined.
	* @param {*} value The value to test.
	* @returns {boolean} Whether the value is undefined.
	*/
	var isUndefined = (value) => value === void 0;
	/**
	* Checks whether a value is a Window.
	* @param {*} value The value to test.
	* @returns {boolean} Whether the value is a Window.
	*/
	var isWindow = (value) => !!value && !!value.document && value.document.defaultView === value;
	/**
	* Math methods
	*/
	/**
	* Gets the decimal precision represented by a number.
	* @param {number} value The input number.
	* @returns {number} The decimal precision.
	*/
	var getDecimalPlaces = (value) => {
		const [coefficient, exponent = 0] = `${value}`.toLowerCase().split("e");
		const decimals = (coefficient.split(".")[1] || "").length;
		return Math.max(0, decimals - Number(exponent));
	};
	/**
	* Clamps a value between a minimum and a maximum.
	* @param {number} value The value to clamp.
	* @param {number} [min=0] The minimum value of the clamped range.
	* @param {number} [max=1] The maximum value of the clamped range.
	* @returns {number} The clamped value.
	*/
	var clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
	/**
	* Clamps a value between 0 and 100.
	* @param {number} value The value to clamp.
	* @returns {number} The clamped value.
	*/
	var clampPercent = (value) => clamp(value, 0, 100);
	/**
	* Calculates the distance between two vectors.
	* @param {number} x1 The first vector X co-ordinate.
	* @param {number} y1 The first vector Y co-ordinate.
	* @param {number} x2 The second vector X co-ordinate.
	* @param {number} y2 The second vector Y co-ordinate.
	* @returns {number} The distance between the vectors.
	*/
	var dist = (x1, y1, x2, y2) => len(x1 - x2, y1 - y2);
	/**
	* Calculates the inverse linear interpolation amount from one value to another.
	* @param {number} v1 The starting value.
	* @param {number} v2 The ending value.
	* @param {number} value The value to inverse interpolate.
	* @returns {number} The interpolated amount.
	*/
	var inverseLerp = (v1, v2, value) => (value - v1) / (v2 - v1);
	/**
	* Calculates the length of an X,Y vector.
	* @param {number} x The X co-ordinate.
	* @param {number} y The Y co-ordinate.
	* @returns {number} The length of the vector.
	*/
	var len = Math.hypot;
	/**
	* Calculates a linear interpolation from one value to another.
	* @param {number} v1 The starting value.
	* @param {number} v2 The ending value.
	* @param {number} amount The amount to interpolate.
	* @returns {number} The interpolated value.
	*/
	var lerp = (v1, v2, amount) => v1 * (1 - amount) + v2 * amount;
	/**
	* Maps a value from one range to another.
	* @param {number} value The value to map.
	* @param {number} fromMin The minimum value of the current range.
	* @param {number} fromMax The maximum value of the current range.
	* @param {number} toMin The minimum value of the target range.
	* @param {number} toMax The maximum value of the target range.
	* @returns {number} The mapped value.
	*/
	var map = (value, fromMin, fromMax, toMin, toMax) => (value - fromMin) * (toMax - toMin) / (fromMax - fromMin) + toMin;
	/**
	* Returns a random floating-point number.
	* @param {number} [a=1] The upper bound (exclusive) when `b` is omitted; otherwise the minimum bound (inclusive).
	* @param {number} [b] The maximum value (exclusive).
	* @returns {number} A random number.
	*/
	var random = (a = 1, b = null) => isNull(b) ? Math.random() * a : map(Math.random(), 0, 1, a, b);
	/**
	* Returns a random integer.
	* @param {number} [a=1] The upper bound (exclusive) when `b` is omitted; otherwise the minimum bound (inclusive).
	* @param {number} [b] The maximum value (exclusive).
	* @returns {number} A random integer.
	* @throws {RangeError} If the bounds contain no integer.
	*/
	var randomInt = (a = 1, b = null) => {
		const min = Math.ceil(Math.min(a, isNull(b) ? 0 : b));
		const max = Math.ceil(Math.max(a, isNull(b) ? 0 : b));
		if (min >= max) throw new RangeError("The bounds do not contain an integer");
		return Math.floor(random(min, max));
	};
	/**
	* Constrains a number to a specified step size.
	* @param {number} value The value to constrain.
	* @param {number} step The step size.
	* @returns {number} The constrained value.
	*/
	var toStep = (value, step = .01) => {
		if (step === 0) return value;
		step = Math.abs(step);
		const result = Math.round(value / step) * step;
		const precision = getDecimalPlaces(step);
		if (precision > 100) return result;
		return parseFloat(result.toFixed(precision));
	};
	/**
	* Array methods
	*/
	/**
	* Creates a new array containing values from the first array that do not exist in any of the additional arrays.
	* @template T
	* @param {T[]} array The input array.
	* @param {...T[]} arrays The arrays to compare against.
	* @returns {T[]} The filtered array.
	*/
	var diff = (array, ...arrays) => {
		const sets = arrays.map((other) => new Set(other));
		return array.filter((value) => !sets.some((other) => other.has(value)));
	};
	/**
	* Creates a new array containing the unique values that exist in all of the provided arrays.
	* @template T
	* @param {...T[]} arrays The input arrays.
	* @returns {T[]} The intersected array.
	*/
	var intersect = (...arrays) => {
		if (!arrays.length) return [];
		const [array, ...others] = arrays;
		const sets = others.map((other) => new Set(other));
		return unique(array).filter((value) => sets.every((other) => other.has(value)));
	};
	/**
	* Merges values from one or more arrays or array-like objects into an array.
	* @template T
	* @param {T[]} [array=[]] The array to merge into.
	* @param {...ArrayLike<T>} arrays The arrays or array-like objects to merge.
	* @returns {T[]} The merged array.
	* @throws {RangeError} If an array-like length is infinite.
	*/
	var merge = (array = [], ...arrays) => {
		for (const other of arrays) {
			const length = Math.max(0, Math.floor(Number(other.length) || 0));
			if (!Number.isFinite(length)) throw new RangeError("Array-like length must be finite");
			for (let i = 0; i < length; i++) array.push(other[i]);
		}
		return array;
	};
	/**
	* Selects a random value from an array.
	* @template T
	* @param {T[]} array The input array.
	* @returns {T|null} A random value from the array, or null if the array is empty.
	*/
	var randomValue = (array) => array.length ? array[randomInt(array.length)] : null;
	/**
	* Creates an array containing a range of values.
	* @param {number} start The first value of the sequence.
	* @param {number} end The target value for the sequence. It is included only when the step lands on it exactly.
	* @param {number} [step=1] The increment between values in the sequence. Negative values are treated as positive, and `0` returns an empty array.
	* @returns {number[]} The array of values from start toward end.
	*/
	var range = (start, end, step = 1) => {
		if (step === 0) return [];
		const sign = Math.sign(end - start);
		step = Math.abs(step);
		const ratio = Math.abs(end - start) / step;
		const nearest = Math.round(ratio);
		const landsOnEnd = Math.abs(ratio - nearest) <= Number.EPSILON * Math.max(1, ratio);
		const intervals = landsOnEnd ? nearest : Math.floor(ratio);
		return new Array(intervals + 1).fill().map((_, i) => i === intervals && landsOnEnd ? end : start + toStep(i * step * sign, step));
	};
	/**
	* Removes duplicate elements from an array.
	* @template T
	* @param {T[]} array The input array.
	* @returns {T[]} The de-duplicated array.
	*/
	var unique = (array) => Array.from(new Set(array));
	/**
	* Creates an array from a value, copying iterable and array-like objects.
	* @template T
	* @param {T|T[]|ArrayLike<T>|Iterable<T>|undefined} value The input value.
	* @returns {T[]} The wrapped array.
	*/
	var wrap = (value) => {
		if (isUndefined(value)) return [];
		if (isArray(value)) return value;
		if (isObject(value) && isFunction(value[Symbol.iterator])) return Array.from(value);
		return isArrayLike(value) ? merge([], value) : [value];
	};
	/**
	* Function methods
	*/
	/**
	* A wrapped callback that exposes a `cancel()` method.
	* @template {(...args: any[]) => any} T
	* @typedef {((...args: Parameters<T>) => void) & { cancel: () => void }} CancelableWrapper
	*/
	var isBrowser = typeof window !== "undefined" && "requestAnimationFrame" in window;
	/**
	* Schedules a callback on the next animation frame.
	* @param {Function} callback The callback to execute.
	* @returns {number} The request ID.
	*/
	var _requestAnimationFrame = isBrowser ? (callback) => window.requestAnimationFrame(callback) : (callback) => setTimeout(callback, 1e3 / 60);
	/**
	* Creates a wrapped version of a function that executes at most once per animation frame
	* (using the most recent arguments passed to it).
	* @template {(...args: any[]) => any} T
	* @param {T} callback The function to wrap.
	* @param {object} [options] Options for executing the function.
	* @param {boolean} [options.leading=false] Whether to execute on the leading edge of the animation frame.
	* @returns {CancelableWrapper<T>} The wrapped function.
	*/
	var animation = (callback, { leading = false } = {}) => {
		let animationReference = null;
		let newArgs;
		let newThis;
		let running = false;
		const cancel = (_) => {
			if (animationReference !== null) {
				if (isBrowser) window.cancelAnimationFrame(animationReference);
				else clearTimeout(animationReference);
			}
			animationReference = null;
			newArgs = null;
			newThis = null;
			running = false;
		};
		const animation = function(...args) {
			newArgs = args;
			newThis = this;
			if (running) return;
			running = true;
			animationReference = _requestAnimationFrame((_) => {
				const args = newArgs;
				const thisArg = newThis;
				animationReference = null;
				newArgs = null;
				newThis = null;
				running = false;
				if (!leading) callback.apply(thisArg, args);
			});
			if (leading) try {
				callback.apply(this, args);
			} catch (error) {
				cancel();
				throw error;
			}
		};
		animation.cancel = cancel;
		return animation;
	};
	/**
	* Creates a wrapped function that executes each callback in reverse order,
	* passing the result from each function to the previous.
	* @param {...((value: any) => any)} callbacks Callback functions to execute.
	* @returns {(arg: any) => any} The wrapped function.
	*/
	var compose = (...callbacks) => function(arg) {
		return callbacks.reduceRight((acc, callback) => callback.call(this, acc), arg);
	};
	/**
	* Creates a wrapped version of a function that returns new functions
	* until the number of total arguments passed reaches the arguments length
	* of the original function (at which point the function will execute).
	* @template {(...args: any[]) => any} T
	* @param {T} callback The function to wrap.
	* @returns {Function} The wrapped function.
	*/
	var curry = (callback) => {
		const curried = function(...args) {
			const thisArg = this;
			if (args.length >= callback.length) return callback.apply(thisArg, args);
			return (...newArgs) => curried.apply(thisArg, args.concat(newArgs));
		};
		return curried;
	};
	/**
	* Creates a wrapped version of a function that executes once per wait period
	* (using the most recent arguments passed to it).
	* @template {(...args: any[]) => any} T
	* @param {T} callback The function to wrap.
	* @param {number} [wait=0] The number of milliseconds to wait until next execution.
	* @param {object} [options] Options for executing the function.
	* @param {boolean} [options.leading=false] Whether to execute on the leading edge of the wait period.
	* @param {boolean} [options.trailing=true] Whether to execute on the trailing edge of the wait period.
	* @returns {CancelableWrapper<T>} The wrapped function.
	*/
	var debounce$1 = (callback, wait = 0, { leading = false, trailing = true } = {}) => {
		let debounceReference = null;
		let newArgs;
		let newThis;
		let trailingPending = false;
		const cancel = (_) => {
			if (debounceReference !== null) clearTimeout(debounceReference);
			debounceReference = null;
			newArgs = null;
			newThis = null;
			trailingPending = false;
		};
		const debounced = function(...args) {
			if (!leading && !trailing) return;
			const callLeading = leading && debounceReference === null;
			if (debounceReference !== null) {
				clearTimeout(debounceReference);
				trailingPending = true;
			} else trailingPending = false;
			newArgs = args;
			newThis = this;
			debounceReference = setTimeout((_) => {
				const args = newArgs;
				const thisArg = newThis;
				const callTrailing = trailing && (!leading || trailingPending);
				debounceReference = null;
				newArgs = null;
				newThis = null;
				trailingPending = false;
				if (callTrailing) callback.apply(thisArg, args);
			}, wait);
			if (callLeading) try {
				callback.apply(this, args);
			} catch (error) {
				cancel();
				throw error;
			}
		};
		debounced.cancel = cancel;
		return debounced;
	};
	/**
	* Evaluates a value from a function or a value.
	* @template T
	* @param {T|(() => T)} value The value to evaluate.
	* @returns {T} The evaluated value.
	*/
	var evaluate = (value) => isFunction(value) ? value() : value;
	/**
	* Creates a wrapped version of a function that only ever executes once.
	* Subsequent calls to the wrapped function will return the result of the first successful call.
	* @template {(...args: any[]) => any} T
	* @param {T} callback The function to wrap.
	* @returns {(...args: Parameters<T>) => ReturnType<T>} The wrapped function.
	*/
	var once = (callback) => {
		let ran = false;
		let result;
		return function(...args) {
			if (ran) return result;
			ran = true;
			try {
				result = callback.apply(this, args);
				return result;
			} catch (error) {
				ran = false;
				throw error;
			}
		};
	};
	/**
	* Creates a wrapped version of a function with predefined arguments.
	* @template {(...args: any[]) => any} T
	* @param {T} callback The function to wrap.
	* @param {...*} [defaultArgs] Default arguments to pass to the function.
	* @returns {(...args: any[]) => ReturnType<T>} The wrapped function.
	*/
	var partial = (callback, ...defaultArgs) => function(...args) {
		return callback.call(this, ...defaultArgs.slice().map((v) => isUndefined(v) ? args.shift() : v).concat(args));
	};
	/**
	* Creates a wrapped function that executes each callback in order,
	* passing the result from each function to the next.
	* @param {...((value: any) => any)} callbacks Callback functions to execute.
	* @returns {(arg: any) => any} The wrapped function.
	*/
	var pipe = (...callbacks) => function(arg) {
		return callbacks.reduce((acc, callback) => callback.call(this, acc), arg);
	};
	/**
	* Creates a wrapped version of a function that executes at most once per wait period.
	* (using the most recent arguments passed to it).
	* @template {(...args: any[]) => any} T
	* @param {T} callback The function to wrap.
	* @param {number} [wait=0] The number of milliseconds to wait until next execution.
	* @param {object} [options] Options for executing the function.
	* @param {boolean} [options.leading=true] Whether to execute on the leading edge of the wait period.
	* @param {boolean} [options.trailing=true] Whether to execute on the trailing edge of the wait period.
	* @returns {CancelableWrapper<T>} The wrapped function.
	*/
	var throttle = (callback, wait = 0, { leading = true, trailing = true } = {}) => {
		let throttleReference = null;
		let lastRan;
		let newArgs;
		let newThis;
		const cancel = (_) => {
			if (throttleReference !== null) clearTimeout(throttleReference);
			throttleReference = null;
			lastRan = void 0;
			newArgs = null;
			newThis = null;
		};
		const runTrailing = (_) => {
			const args = newArgs;
			const thisArg = newThis;
			throttleReference = null;
			newArgs = null;
			newThis = null;
			lastRan = Date.now();
			callback.apply(thisArg, args);
		};
		const throttled = function(...args) {
			const now = Date.now();
			const delta = lastRan === void 0 ? null : now - lastRan;
			if (leading && (delta === null || delta >= wait)) {
				if (throttleReference !== null) {
					clearTimeout(throttleReference);
					throttleReference = null;
				}
				newArgs = null;
				newThis = null;
				lastRan = now;
				try {
					callback.apply(this, args);
				} catch (error) {
					cancel();
					throw error;
				}
				return;
			}
			if (!trailing) return;
			newArgs = args;
			newThis = this;
			if (throttleReference !== null) return;
			throttleReference = setTimeout(runTrailing, delta === null || !leading && delta >= wait ? wait : Math.max(0, wait - delta));
		};
		throttled.cancel = cancel;
		return throttled;
	};
	/**
	* Executes a function a specified number of times.
	* @param {() => (boolean|void)} callback The callback function to execute.
	* @param {number} amount The number of times to execute the callback.
	* @returns {void} Nothing.
	*/
	var times = (callback, amount) => {
		while (amount-- > 0) if (callback() === false) break;
	};
	/**
	* Object methods
	*/
	var hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
	var assignOwn = (object, key, value) => {
		if (hasOwn(object, key)) {
			object[key] = value;
			return;
		}
		Object.defineProperty(object, key, {
			configurable: true,
			enumerable: true,
			value,
			writable: true
		});
	};
	var setDotSegments = (object, keys, value, overwrite) => {
		const [key, ...remainingKeys] = keys;
		if (!key) return;
		if (key === "*") {
			for (const childKey of Object.keys(object)) {
				if (!remainingKeys.length) {
					if (overwrite) assignOwn(object, childKey, value);
					continue;
				}
				let child = object[childKey];
				if (!isObject(child)) {
					if (!overwrite) continue;
					child = {};
					assignOwn(object, childKey, child);
				}
				setDotSegments(child, remainingKeys, value, overwrite);
			}
			return;
		}
		if (remainingKeys.length) {
			let child = hasOwn(object, key) ? object[key] : void 0;
			if (!isObject(child)) {
				if (hasOwn(object, key) && !overwrite) return;
				child = {};
				assignOwn(object, key, child);
			}
			setDotSegments(child, remainingKeys, value, overwrite);
		} else if (overwrite || !hasOwn(object, key)) assignOwn(object, key, value);
	};
	/**
	* Merges values from one or more objects into an object (recursively).
	* @param {object} object The input object.
	* @param {...object} objects The objects to merge.
	* @returns {object} The extended object.
	*/
	var extend = (object, ...objects) => objects.reduce((acc, val) => {
		if (val == null) return acc;
		for (const k of Object.keys(val)) {
			const value = val[k];
			const currentValue = hasOwn(acc, k) ? acc[k] : void 0;
			if (isArray(value)) assignOwn(acc, k, extend(isArray(currentValue) ? currentValue : [], value));
			else if (isPlainObject(value)) assignOwn(acc, k, extend(isPlainObject(currentValue) ? currentValue : {}, value));
			else assignOwn(acc, k, value);
		}
		return acc;
	}, object);
	/**
	* Flattens an object using dot notation while preserving empty plain objects.
	* @param {object} object The input object.
	* @param {string} [prefix] The key prefix.
	* @returns {object} The flattened object.
	*/
	var flatten = (object, prefix = "") => Object.keys(object).reduce((acc, key) => {
		const prefixedKey = `${prefix}${key}`;
		if (isPlainObject(object[key]) && Object.keys(object[key]).length) {
			const flattened = flatten(object[key], `${prefixedKey}.`);
			for (const flattenedKey of Object.keys(flattened)) assignOwn(acc, flattenedKey, flattened[flattenedKey]);
		} else assignOwn(acc, prefixedKey, object[key]);
		return acc;
	}, {});
	/**
	* Removes a specified key from an object using dot notation.
	* @param {object} object The input object.
	* @param {string} key The key to remove from the object.
	* @returns {void} Nothing.
	*/
	var forgetDot = (object, key) => {
		const keys = key.split(".");
		while (key = keys.shift()) {
			if (!isObject(object) || !hasOwn(object, key)) break;
			if (keys.length) object = object[key];
			else delete object[key];
		}
	};
	/**
	* Retrieves an own value of a specified key from an object using dot notation.
	* @param {object} object The input object.
	* @param {string} key The key to retrieve from the object.
	* @param {*} [defaultValue] The default value if key does not exist.
	* @returns {*} The value retrieved from the object.
	*/
	var getDot = (object, key, defaultValue) => {
		const keys = key.split(".");
		while (key = keys.shift()) {
			if (!isObject(object) || !hasOwn(object, key)) return defaultValue;
			object = object[key];
		}
		return object;
	};
	/**
	* Checks whether a specified own key exists in an object using dot notation.
	* @param {object} object The input object.
	* @param {string} key The key to test for in the object.
	* @returns {boolean} Whether the key exists.
	*/
	var hasDot = (object, key) => {
		const keys = key.split(".");
		while (key = keys.shift()) {
			if (!isObject(object) || !hasOwn(object, key)) return false;
			object = object[key];
		}
		return true;
	};
	/**
	* Retrieves values of a specified key from an array of objects using dot notation.
	* @param {object[]} objects The input objects.
	* @param {string} key The key to retrieve from the objects.
	* @param {*} [defaultValue] The default value if key does not exist.
	* @returns {Array<*>} An array of values retrieved from the objects.
	*/
	var pluckDot = (objects, key, defaultValue) => objects.map((pointer) => getDot(pointer, key, defaultValue));
	/**
	* Sets a specified value of a key for an object using dot notation, including wildcard segments.
	* @param {object} object The input object.
	* @param {string} key The key to set in the object.
	* @param {*} value The value to set.
	* @param {{overwrite?: boolean}} [options] Options for setting the value.
	* @param {boolean} [options.overwrite=true] Whether to overwrite the value if the key already exists.
	* @returns {void} Nothing.
	*/
	var setDot = (object, key, value, { overwrite = true } = {}) => setDotSegments(object, key.split("."), value, overwrite);
	var escapeChars = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\"": "&quot;",
		"'": "&apos;"
	};
	var unescapeChars = {
		amp: "&",
		lt: "<",
		gt: ">",
		quot: "\"",
		apos: "'"
	};
	/**
	* String methods
	*/
	/**
	* Splits a string into individual words.
	* @param {string} string The input string.
	* @returns {string[]} The split parts of the string.
	*/
	var _splitString = (string) => `${string}`.split(/[^a-zA-Z0-9']|(?=[A-Z])/).reduce((acc, word) => {
		word = word.replace(/[^\w]/g, "").toLowerCase();
		if (word) acc.push(word);
		return acc;
	}, []);
	/**
	* Converts a string to camelCase.
	* @param {string} string The input string.
	* @returns {string} The camelCased string.
	*/
	var camelCase = (string) => _splitString(string).map((word, index) => index ? capitalize(word) : word).join("");
	/**
	* Converts the first character of a string to upper case and the remaining to lower case.
	* @param {string} string The input string.
	* @returns {string} The capitalized string.
	*/
	var capitalize = (string) => string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
	/**
	* Escapes HTML special characters in a string using HTML entities.
	* @param {string} string The input string.
	* @returns {string} The escaped string.
	*/
	var escape = (string) => string.replace(/[&<>"']/g, (match) => escapeChars[match]);
	/**
	* Escapes RegExp special characters in a string.
	* @param {string} string The input string.
	* @returns {string} The escaped string.
	*/
	var escapeRegExp = (string) => string.replace(/[-/\\^$*+?.()|[\]{}]/g, (match) => match === "-" ? "\\x2d" : `\\${match}`);
	/**
	* Converts a string to a humanized form.
	* @param {string} string The input string.
	* @returns {string} The humanized string.
	*/
	var humanize = (string) => capitalize(_splitString(string).join(" "));
	/**
	* Converts a string to kebab-case.
	* @param {string} string The input string.
	* @returns {string} The kebab-cased string.
	*/
	var kebabCase = (string) => _splitString(string).join("-").toLowerCase();
	/**
	* Converts a string to PascalCase.
	* @param {string} string The input string.
	* @returns {string} The PascalCased string.
	*/
	var pascalCase = (string) => _splitString(string).map((word) => word.charAt(0).toUpperCase() + word.substring(1)).join("");
	/**
	* Creates a random string.
	* @param {number} [length=16] The number of characters in the output string.
	* @param {string} [chars=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789] The non-empty Unicode characters to generate the string from.
	* @throws {TypeError} If chars is empty.
	* @returns {string} The random string.
	*/
	var randomString = (length = 16, chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789") => {
		const characters = Array.from(chars);
		if (!characters.length) throw new TypeError("chars must not be empty");
		return new Array(length).fill().map((_) => characters[randomInt(characters.length)]).join("");
	};
	/**
	* Converts a string to snake_case.
	* @param {string} string The input string.
	* @returns {string} The snake_cased string.
	*/
	var snakeCase = (string) => _splitString(string).join("_").toLowerCase();
	/**
	* Unescapes HTML entities in a string into their corresponding characters.
	* @param {string} string The input string.
	* @returns {string} The unescaped string.
	*/
	var unescape = (string) => string.replace(/&(amp|lt|gt|quot|apos);/g, (_, code) => unescapeChars[code]);

//#endregion
//#region node_modules/@fr0st/query/dist/fquery.esm.js
/** @import { AjaxOptions } from './ajax/ajax-request.js'; */
	/** @import { AnimationOptions } from './animation/animation.js'; */
	var ajaxDefaults = {
		afterSend: null,
		beforeSend: null,
		cache: true,
		contentType: "application/x-www-form-urlencoded",
		data: null,
		headers: {},
		isLocal: null,
		method: "GET",
		onProgress: null,
		onUploadProgress: null,
		processData: true,
		rejectOnCancel: true,
		responseType: null,
		url: null,
		xhr: (_) => {
			const { XMLHttpRequest } = getWindow();
			return new XMLHttpRequest();
		}
	};
	var animationDefaults = {
		duration: 1e3,
		type: "ease-in-out",
		infinite: false,
		debug: false
	};
	var config = {
		ajaxDefaults,
		animationDefaults,
		context: null,
		useTimeout: false,
		window: null
	};
	/**
	* Gets the AJAX defaults.
	* @returns {AjaxOptions} The AJAX defaults.
	*/
	function getAjaxDefaults() {
		return ajaxDefaults;
	}
	/**
	* Gets the animation defaults.
	* @returns {AnimationOptions} The animation defaults.
	*/
	function getAnimationDefaults() {
		return animationDefaults;
	}
	/**
	* Gets the document context.
	* @returns {Document} The document context.
	*/
	function getContext() {
		return config.context;
	}
	/**
	* Gets the window.
	* @returns {Window} The window.
	*/
	function getWindow() {
		return config.window;
	}
	/**
	* Sets the AJAX defaults.
	* @param {Partial<AjaxOptions>} options The AJAX default options.
	*/
	function setAjaxDefaults(options) {
		extend(ajaxDefaults, options);
	}
	/**
	* Sets the animation defaults.
	* @param {Partial<AnimationOptions>} options The animation default options.
	*/
	function setAnimationDefaults(options) {
		extend(animationDefaults, options);
	}
	/**
	* Sets the document context.
	* @param {Document} context The document context.
	* @throws {Error} When context is not a Document.
	*/
	function setContext(context) {
		if (!isDocument(context)) throw new Error("fQuery requires a valid Document.");
		config.context = context;
	}
	/**
	* Sets the window.
	* @param {Window} window The window.
	* @throws {Error} When window is not a Window.
	*/
	function setWindow(window) {
		if (!isWindow(window)) throw new Error("fQuery requires a valid Window.");
		config.window = window;
	}
	/**
	* Sets whether animations should use setTimeout.
	* @param {boolean} [enable=true] Whether animations should use setTimeout.
	*/
	function useTimeout(enable = true) {
		config.useTimeout = enable;
	}
	/** @typedef {{name: string, value: *}} FormEntry */
	/** @typedef {FormEntry[]|Record<string, *>} FormInput */
	/** @typedef {[string, *]} ParamEntry */
	/**
	* Appends a query string to a URL.
	* @param {string} url The input URL.
	* @param {string} key The query string key.
	* @param {string|number} value The query string value.
	* @returns {string} The new URL.
	*/
	function appendQueryString(url, key, value) {
		const searchParams = getSearchParams(url);
		searchParams.append(key, value);
		return setSearchParams(url, searchParams);
	}
	/**
	* Creates URLSearchParams from input data.
	* @param {*} data The input data.
	* @returns {URLSearchParams} The URLSearchParams.
	*/
	function createSearchParams(data) {
		const { URLSearchParams } = getWindow();
		return new URLSearchParams(data);
	}
	/**
	* Creates a URL from a URL string.
	* @param {string} url The URL.
	* @returns {URL} The URL.
	*/
	function createUrl(url) {
		const { location, URL } = getWindow();
		return new URL(url, (location.origin + location.pathname).replace(/\/$/, ""));
	}
	/**
	* Gets the URLSearchParams from a URL string.
	* @param {string} url The URL.
	* @returns {URLSearchParams} The URLSearchParams.
	*/
	function getSearchParams(url) {
		return createUrl(url).searchParams;
	}
	/**
	* Returns a FormData object from form entries or a data object.
	* @param {FormInput} data The input data.
	* @returns {FormData} The parsed FormData object.
	*/
	function parseFormData(data) {
		const { FormData } = getWindow();
		const values = parseValues(data);
		const formData = new FormData();
		for (const [key, value] of values) if (key.substring(key.length - 2) === "[]") formData.append(key, value);
		else formData.set(key, value);
		return formData;
	}
	/**
	* Returns a URI-encoded attribute string from form entries or a data object.
	* @param {FormInput} data The input data.
	* @returns {string} The URI-encoded attribute string.
	*/
	function parseParams(data) {
		return parseValues(data).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join("&");
	}
	/**
	* Returns flattened parameter entries for a key and value.
	* @param {string} key The input key.
	* @param {*} [value] The input value.
	* @returns {ParamEntry[]} The parsed parameter entries.
	*/
	function parseValue(key, value) {
		if (value === null || isUndefined(value)) return [];
		if (isArray(value)) {
			if (key.substring(key.length - 2) !== "[]") key += "[]";
			return value.flatMap((val) => parseValue(key, val));
		}
		if (isObject(value)) return Object.entries(value).flatMap(([subKey, val]) => parseValue(`${key}[${subKey}]`, val));
		return [[key, value]];
	}
	/**
	* Returns flattened parameter entries from form entries or a data object.
	* @param {FormInput} data The input data.
	* @returns {ParamEntry[]} The parsed parameter entries.
	*/
	function parseValues(data) {
		if (isArray(data)) return data.flatMap((value) => parseValue(value.name, value.value));
		if (isObject(data)) return Object.entries(data).flatMap(([key, value]) => parseValue(key, value));
		return data;
	}
	/**
	* Sets the URLSearchParams for a URL string.
	* @param {string} url The URL.
	* @param {URLSearchParams} searchParams The URLSearchParams.
	* @returns {string} The new URL string.
	*/
	function setSearchParams(url, searchParams) {
		const urlData = createUrl(url);
		urlData.search = searchParams.toString();
		const newUrl = urlData.toString();
		const pos = newUrl.indexOf(url);
		return newUrl.substring(pos);
	}
	/**
	* @typedef {boolean|string|Array<*>|Record<string, *>|FormData|null} AjaxData
	*/
	/**
	* @callback AjaxHook
	* @param {XMLHttpRequest} xhr The request object.
	* @returns {void} Nothing.
	*/
	/**
	* @callback AjaxProgressCallback
	* @param {number} progress The completion ratio from 0 to 1.
	* @param {XMLHttpRequest} xhr The request object.
	* @param {ProgressEvent} event The progress event.
	* @returns {void} Nothing.
	*/
	/**
	* @typedef {object} AjaxOptions
	* @property {string} [url] The request URL. Defaults to the current location.
	* @property {string} [method='GET'] The HTTP method.
	* @property {AjaxData} [data=null] The request data.
	* @property {string|false} [contentType='application/x-www-form-urlencoded'] The request content type, or false to omit it.
	* @property {XMLHttpRequestResponseType|null} [responseType=null] The response type.
	* @property {string} [mimeType] The MIME type override.
	* @property {string} [username] The authentication username.
	* @property {string} [password] The authentication password.
	* @property {number} [timeout=0] The timeout in milliseconds.
	* @property {boolean|null} [isLocal=null] Whether to treat the request as local. Null enables automatic detection.
	* @property {boolean} [cache=true] Whether to cache the request.
	* @property {boolean} [processData=true] Whether to encode the request data.
	* @property {boolean} [rejectOnCancel=true] Whether cancellation rejects the request promise.
	* @property {Record<string, string>} [headers={}] Additional request headers.
	* @property {AjaxHook|null} [afterSend=null] The callback invoked after sending.
	* @property {AjaxHook|null} [beforeSend=null] The callback invoked before sending.
	* @property {AjaxProgressCallback|null} [onProgress=null] The download progress callback.
	* @property {AjaxProgressCallback|null} [onUploadProgress=null] The upload progress callback.
	* @property {() => XMLHttpRequest} [xhr] The request factory.
	*/
	/**
	* @typedef {object} AjaxResult
	* @property {*} response The response value.
	* @property {XMLHttpRequest} xhr The request object.
	* @property {ProgressEvent} event The load event.
	*/
	/**
	* @typedef {object} AjaxError
	* @property {number} status The HTTP status.
	* @property {XMLHttpRequest} xhr The request object.
	* @property {ProgressEvent} [event] The failure event.
	* @property {string} [reason] The cancellation reason.
	*/
	/**
	* Represents a cancellable XMLHttpRequest with Promise-compatible methods.
	*/
	var AjaxRequest = class {
		#isCancelled;
		#isRejected;
		#isResolved;
		#options;
		#promise;
		#reject;
		#resolve;
		/**
		* Creates an AJAX request.
		* @param {AjaxOptions} [options] The request options.
		*/
		constructor(options) {
			const { location } = getWindow();
			this.#options = extend({}, getAjaxDefaults(), options);
			this.#options.method = this.#options.method.toUpperCase();
			const isFormData = Object.prototype.toString.call(this.#options.data) === "[object FormData]";
			if (!this.#options.url) this.#options.url = location.href;
			if (!this.#options.cache) this.#options.url = appendQueryString(this.#options.url, "_", Date.now());
			if (!isFormData && !("Content-Type" in this.#options.headers) && this.#options.contentType) this.#options.headers["Content-Type"] = this.#options.contentType;
			if (this.#options.isLocal === null) this.#options.isLocal = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(location.protocol);
			if (!this.#options.isLocal && !("X-Requested-With" in this.#options.headers)) this.#options.headers["X-Requested-With"] = "XMLHttpRequest";
			this.#promise = new Promise((resolve, reject) => {
				this.#resolve = (value) => {
					this.#isResolved = true;
					resolve(value);
				};
				this.#reject = (error) => {
					this.#isRejected = true;
					reject(error);
				};
			});
			this.xhr = this.#options.xhr();
			if (this.#options.data !== null && this.#options.data !== void 0) {
				if (!isFormData && this.#options.processData && isObject(this.#options.data)) {
					if (this.#options.contentType === "application/json") this.#options.data = JSON.stringify(this.#options.data);
					else if (this.#options.contentType === "application/x-www-form-urlencoded") this.#options.data = parseParams(this.#options.data);
					else this.#options.data = parseFormData(this.#options.data);
				}
				if (this.#options.method === "GET") {
					const dataParams = createSearchParams(this.#options.data);
					const searchParams = getSearchParams(this.#options.url);
					for (const [key, value] of dataParams.entries()) searchParams.append(key, value);
					this.#options.url = setSearchParams(this.#options.url, searchParams);
					this.#options.data = null;
				}
			}
			this.xhr.open(this.#options.method, this.#options.url, true, this.#options.username, this.#options.password);
			for (const [key, value] of Object.entries(this.#options.headers)) this.xhr.setRequestHeader(key, value);
			if (this.#options.responseType) this.xhr.responseType = this.#options.responseType;
			if (this.#options.mimeType) this.xhr.overrideMimeType(this.#options.mimeType);
			if (this.#options.timeout) this.xhr.timeout = this.#options.timeout;
			this.xhr.onload = (e) => {
				if (this.xhr.status >= 400) this.#reject({
					status: this.xhr.status,
					xhr: this.xhr,
					event: e
				});
				else this.#resolve({
					response: this.xhr.response,
					xhr: this.xhr,
					event: e
				});
			};
			if (!this.#options.isLocal) this.xhr.onerror = (e) => this.#reject({
				status: this.xhr.status,
				xhr: this.xhr,
				event: e
			});
			this.xhr.ontimeout = (e) => this.#reject({
				status: this.xhr.status,
				xhr: this.xhr,
				event: e
			});
			if (this.#options.onProgress) this.xhr.onprogress = (e) => this.#options.onProgress(e.loaded / e.total, this.xhr, e);
			if (this.#options.onUploadProgress) this.xhr.upload.onprogress = (e) => this.#options.onUploadProgress(e.loaded / e.total, this.xhr, e);
			if (this.#options.beforeSend) this.#options.beforeSend(this.xhr);
			this.xhr.send(this.#options.data);
			if (this.#options.afterSend) this.#options.afterSend(this.xhr);
		}
		/**
		* Cancels a pending request.
		* @param {string} [reason='Request was cancelled'] The cancellation reason.
		*/
		cancel(reason = "Request was cancelled") {
			if (this.#isResolved || this.#isRejected || this.#isCancelled) return;
			this.xhr.abort();
			this.#isCancelled = true;
			if (this.#options.rejectOnCancel) this.#reject({
				status: this.xhr.status,
				xhr: this.xhr,
				reason
			});
		}
		/**
		* Executes a callback if the request is rejected.
		* @param {((reason: AjaxError) => *)} [onRejected] The callback to execute if the request is rejected.
		* @returns {Promise<*>} The resulting promise.
		*/
		catch(onRejected) {
			return this.#promise.catch(onRejected);
		}
		/**
		* Executes a callback once the request is settled (resolved or rejected).
		* @param {(() => void)} [onFinally] The callback to execute once the request is settled.
		* @returns {Promise<AjaxResult>} The resulting promise.
		*/
		finally(onFinally) {
			return this.#promise.finally(onFinally);
		}
		/**
		* Executes a callback once the request is resolved (or optionally rejected).
		* @param {((value: AjaxResult) => *)} onFulfilled The callback to execute if the request is resolved.
		* @param {((reason: AjaxError) => *)} [onRejected] The callback to execute if the request is rejected.
		* @returns {Promise<*>} The resulting promise.
		*/
		then(onFulfilled, onRejected) {
			return this.#promise.then(onFulfilled, onRejected);
		}
	};
	Object.setPrototypeOf(AjaxRequest.prototype, Promise.prototype);
	/** @import { AjaxData } from './ajax-request.js'; */
	/** @import { AjaxOptions } from './ajax-request.js'; */
	/**
	* Performs an XHR DELETE request.
	* @param {string|null} [url] The request URL.
	* @param {AjaxOptions} [options] The request options. The method defaults to `DELETE`.
	* @returns {AjaxRequest} A new AjaxRequest that resolves when the request is completed, or rejects on failure.
	*/
	function _delete(url, options) {
		return new AjaxRequest({
			url,
			method: "DELETE",
			...options
		});
	}
	/**
	* Creates an AJAX request.
	* @param {AjaxOptions} [options] The request options.
	* @returns {AjaxRequest} A new AjaxRequest that resolves when the request is completed, or rejects on failure.
	*/
	function ajax(options) {
		return new AjaxRequest(options);
	}
	/**
	* Performs an XHR GET request.
	* @param {string|null} [url] The request URL.
	* @param {AjaxData} [data] The request data.
	* @param {AjaxOptions} [options] The request options.
	* @returns {AjaxRequest} A new AjaxRequest that resolves when the request is completed, or rejects on failure.
	*/
	function get(url, data, options) {
		return new AjaxRequest({
			url,
			data,
			...options
		});
	}
	/**
	* Performs an XHR PATCH request.
	* @param {string|null} [url] The request URL.
	* @param {AjaxData} [data] The request data.
	* @param {AjaxOptions} [options] The request options. The method defaults to `PATCH`.
	* @returns {AjaxRequest} A new AjaxRequest that resolves when the request is completed, or rejects on failure.
	*/
	function patch(url, data, options) {
		return new AjaxRequest({
			url,
			data,
			method: "PATCH",
			...options
		});
	}
	/**
	* Performs an XHR POST request.
	* @param {string|null} [url] The request URL.
	* @param {AjaxData} [data] The request data.
	* @param {AjaxOptions} [options] The request options. The method defaults to `POST`.
	* @returns {AjaxRequest} A new AjaxRequest that resolves when the request is completed, or rejects on failure.
	*/
	function post(url, data, options) {
		return new AjaxRequest({
			url,
			data,
			method: "POST",
			...options
		});
	}
	/**
	* Performs an XHR PUT request.
	* @param {string|null} [url] The request URL.
	* @param {AjaxData} [data] The request data.
	* @param {AjaxOptions} [options] The request options. The method defaults to `PUT`.
	* @returns {AjaxRequest} A new AjaxRequest that resolves when the request is completed, or rejects on failure.
	*/
	function put(url, data, options) {
		return new AjaxRequest({
			url,
			data,
			method: "PUT",
			...options
		});
	}
	/**
	* Represents an ordered, chainable collection of DOM nodes.
	*/
	var QuerySet = class QuerySet {
		#nodes;
		/**
		* Creates a QuerySet.
		* @param {Array<Node|Window>} [nodes=[]] The input nodes.
		*/
		constructor(nodes = []) {
			this.#nodes = nodes;
		}
		/**
		* Gets the number of nodes.
		* @returns {number} The number of nodes.
		*/
		get length() {
			return this.#nodes.length;
		}
		/**
		* Executes a function for each node in the set.
		* @param {((node: Node|Window, index: number) => void)} callback The callback to execute.
		* @returns {this} The current QuerySet.
		*/
		each(callback) {
			this.#nodes.forEach((v, i) => callback(v, i));
			return this;
		}
		/**
		* Retrieves the DOM node(s) contained in the QuerySet.
		* @param {number} [index=null] The index of the node.
		* @returns {Array<Node|Window>|Node|Window|undefined} The nodes, or the node at the specified index.
		*/
		get(index = null) {
			if (index === null) return this.#nodes;
			return index < 0 ? this.#nodes[index + this.#nodes.length] : this.#nodes[index];
		}
		/**
		* Executes a function for each node in the set.
		* @param {((node: Node|Window, index: number) => (Node|Window))} callback The callback to execute.
		* @returns {QuerySet} A new QuerySet object.
		*/
		map(callback) {
			const nodes = this.#nodes.map(callback);
			return new QuerySet(nodes);
		}
		/**
		* Reduces the set of matched nodes to a subset specified by a range of indices.
		* @param {number} [begin] The index to slice from.
		* @param {number} [end]  The index to slice to.
		* @returns {QuerySet} A new QuerySet object.
		*/
		slice(begin, end) {
			const nodes = this.#nodes.slice(begin, end);
			return new QuerySet(nodes);
		}
		/**
		* Returns an iterable from the nodes.
		* @returns {IterableIterator<Node|Window>} The node iterator.
		*/
		[Symbol.iterator]() {
			return this.#nodes.values();
		}
	};
	/**
	* @typedef {string|Element|Array<string|Element>|NodeList|HTMLCollection|QuerySet} ElementInput
	*/
	/**
	* @typedef {string|Node|Array<string|Node>|NodeList|HTMLCollection|QuerySet} NodeInput
	*/
	/**
	* @typedef {string|Node|Window|Array<string|Node|Window>|NodeList|HTMLCollection|QuerySet} QueryInput
	*/
	/**
	* @callback NodeFilterCallback
	* @param {Node|Window} node The node to test.
	* @returns {boolean} Whether the node matches.
	*/
	/**
	* Creates a custom event.
	* @param {string} type The event type.
	* @param {CustomEventInit} [options] The event options.
	* @returns {CustomEvent} The custom event.
	*/
	function createEvent(type, options) {
		const { CustomEvent } = getWindow();
		return new CustomEvent(type, options);
	}
	/**
	* Creates a wrapped version of a function that executes once per tick.
	* @template {(...args: any[]) => any} T
	* @param {T} callback The callback to debounce.
	* @returns {(...args: Parameters<T>) => void} The wrapped function.
	*/
	function debounce(callback) {
		let running;
		return (...args) => {
			if (running) return;
			running = true;
			Promise.resolve().then((_) => {
				try {
					callback(...args);
				} finally {
					running = false;
				}
			});
		};
	}
	/**
	* Escapes a string for use as a CSS identifier.
	* @param {string} value The value to escape.
	* @returns {string} The escaped value.
	*/
	function escapeCSS(value) {
		return getWindow().CSS.escape(value);
	}
	/**
	* Returns a RegExp for testing a namespaced event.
	* @param {string} event The namespaced event.
	* @returns {RegExp} The namespaced event RegExp.
	*/
	function eventNamespacedRegExp(event) {
		return new RegExp(`^${escapeRegExp(event)}(?:\\.|$)`, "i");
	}
	/**
	* Normalizes a CSS property name.
	* @param {string} style The CSS property name.
	* @returns {string} The normalized CSS property name.
	*/
	function normalizeCssProperty(style) {
		return style.startsWith("--") ? `--${kebabCase(style.slice(2))}` : kebabCase(style);
	}
	/**
	* Normalizes a CSS property value.
	* @param {string} style The CSS property name.
	* @param {string|number} value The CSS property value.
	* @returns {string|number} The normalized CSS property value.
	*/
	function normalizeCssValue(style, value) {
		if (style.startsWith("--") || !value || !isNumeric(value)) return value;
		const { CSS } = getWindow();
		return !CSS.supports(style, value) ? `${value}px` : value;
	}
	/**
	* Returns a one-dimensional array of classes from nested arrays or space-separated strings.
	* @param {Array<string|string[]>} classList The classes to parse.
	* @returns {string[]} The parsed classes.
	*/
	function parseClasses(classList) {
		return classList.flat().flatMap((val) => val.split(" ")).filter((val) => !!val);
	}
	/**
	* Normalizes a key and value, or an existing data object, into a data object.
	* @param {string|Record<string, *>} key The data key, or an object containing data.
	* @param {*} [value] The data value.
	* @param {{json?: boolean}} [options] The options for parsing data.
	* @returns {Record<string, *>} The data object.
	*/
	function parseData(key, value, { json = false } = {}) {
		const result = isString(key) ? { [key]: value } : key;
		if (!json) return result;
		return Object.fromEntries(Object.entries(result).map(([key, value]) => [key, isObject(value) || isArray(value) ? JSON.stringify(value) : value]));
	}
	/**
	* Parses a dataset string into a JavaScript value.
	* @param {string} value The input value.
	* @returns {boolean|number|Record<string, *>|Array<*>|string|null|undefined} The parsed value.
	*/
	function parseDataset(value) {
		if (isUndefined(value)) return value;
		const lower = value.toLowerCase().trim();
		if (["true", "on"].includes(lower)) return true;
		if (["false", "off"].includes(lower)) return false;
		if (lower === "null") return null;
		if (isNumeric(lower)) return parseFloat(lower);
		if (["{", "["].includes(lower.charAt(0))) try {
			return JSON.parse(value);
		} catch {}
		return value;
	}
	/**
	* Returns the base event name from a namespaced event.
	* @param {string} event The namespaced event.
	* @returns {string} The real event.
	*/
	function parseEvent(event) {
		return event.split(".").shift();
	}
	/**
	* Returns an array of events from a space-separated string.
	* @param {string} events The events.
	* @returns {string[]} The parsed events.
	*/
	function parseEvents(events) {
		return events.split(" ");
	}
	/**
	* Resolves a single node.
	* @param {QueryInput} nodes The input node(s), or a query selector or HTML string.
	* @param {((value: string) => (Node|Window|null|undefined))} stringCallback The callback used to resolve strings.
	* @param {NodeFilterCallback} nodeFilter The callback used to filter nodes.
	* @returns {Node|Window|null|undefined} The resolved node, or `undefined` if none matches.
	*/
	function resolveNode(nodes, stringCallback, nodeFilter) {
		if (isString(nodes)) return stringCallback(nodes);
		if (nodeFilter(nodes)) return nodes;
		if (nodes instanceof QuerySet) {
			const node = nodes.get(0);
			return nodeFilter(node) ? node : void 0;
		}
		if (nodes && typeof nodes.item === "function") {
			const node = nodes.item(0);
			return nodeFilter(node) ? node : void 0;
		}
	}
	/**
	* Resolves multiple nodes.
	* @param {QueryInput} nodes The input node(s), or a query selector or HTML string.
	* @param {((value: string) => Array<Node|Window>)} stringCallback The callback used to resolve strings.
	* @param {NodeFilterCallback} nodeFilter The callback used to filter nodes.
	* @returns {Array<Node|Window>} The resolved nodes.
	*/
	function resolveNodes(nodes, stringCallback, nodeFilter) {
		if (isString(nodes)) return stringCallback(nodes);
		if (nodeFilter(nodes)) return [nodes];
		if (nodes instanceof QuerySet) return nodes.get().filter(nodeFilter);
		if (nodes && typeof nodes.item === "function") return merge([], nodes).filter(nodeFilter);
		return [];
	}
	/**
	* Creates a Document object from a string.
	* @param {string} input The input string.
	* @param {{contentType?: DOMParserSupportedType}} [options] The parsing options.
	* @returns {Document} A new Document object.
	*/
	function parseDocument(input, { contentType = "text/html" } = {}) {
		const { DOMParser } = getWindow();
		return new DOMParser().parseFromString(input, contentType);
	}
	/**
	* Creates an array containing elements parsed from an HTML string.
	* @param {string} html The HTML input string.
	* @returns {Element[]} The parsed elements.
	*/
	function parseHTML(html) {
		const childNodes = getContext().createRange().createContextualFragment(html).children;
		return merge([], childNodes);
	}
	/** @import QuerySet from '../query/query-set.js'; */
	/**
	* @typedef {Element|Document|DocumentFragment|ShadowRoot} QueryContext
	*/
	/**
	* @typedef {string|QueryContext|Array<string|QueryContext>|NodeList|HTMLCollection|QuerySet} QueryContextInput
	* A query context, collection of query contexts, QuerySet, or selector string.
	*/
	/**
	* Resolves one or more find contexts without using the higher-level node parser.
	* @param {QueryContextInput} context The input context.
	* @returns {QueryContext[]} The resolved contexts.
	*/
	function resolveContexts(context) {
		const nodeFilter = (node) => isDocument(node) || isElement(node) || isFragment(node) || isShadow(node);
		if (!isArray(context)) return resolveNodes(context, find$1, nodeFilter);
		const results = context.flatMap((node) => resolveNodes(node, find$1, nodeFilter));
		return context.length > 1 && results.length > 1 ? unique(results) : results;
	}
	/**
	* Returns all nodes matching a selector.
	* @param {string} selector The query selector.
	* @param {QueryContextInput} [context=getContext()] The query context.
	* @returns {Element[]} The matching nodes.
	*/
	function find$1(selector, context = getContext()) {
		if (!selector) return [];
		const match = selector.match(/^([#.]?)([\w-]+)$/);
		if (match) {
			if (match[1] === "#") return findById$1(match[2], context);
			if (match[1] === ".") return findByClass$1(match[2], context);
			return findByTag$1(match[2], context);
		}
		if (isDocument(context) || isElement(context) || isFragment(context) || isShadow(context)) return merge([], context.querySelectorAll(selector));
		const nodes = resolveContexts(context);
		const results = [];
		for (const node of nodes) {
			const newNodes = node.querySelectorAll(selector);
			results.push(...newNodes);
		}
		return nodes.length > 1 && results.length > 1 ? unique(results) : results;
	}
	/**
	* Returns all nodes with a specific class.
	* @param {string} className The class name.
	* @param {QueryContextInput} [context=getContext()] The query context.
	* @returns {Element[]} The matching nodes.
	*/
	function findByClass$1(className, context = getContext()) {
		if (isDocument(context) || isElement(context)) return merge([], context.getElementsByClassName(className));
		const selector = `.${escapeCSS(className)}`;
		if (isFragment(context) || isShadow(context)) return merge([], context.querySelectorAll(selector));
		const nodes = resolveContexts(context);
		const results = [];
		for (const node of nodes) {
			const newNodes = isFragment(node) || isShadow(node) ? node.querySelectorAll(selector) : node.getElementsByClassName(className);
			results.push(...newNodes);
		}
		return nodes.length > 1 && results.length > 1 ? unique(results) : results;
	}
	/**
	* Returns all nodes with a specific ID.
	* @param {string} id The id.
	* @param {QueryContextInput} [context=getContext()] The query context.
	* @returns {Element[]} The matching nodes.
	*/
	function findById$1(id, context = getContext()) {
		const selector = `#${escapeCSS(id)}`;
		if (isDocument(context) || isElement(context) || isFragment(context) || isShadow(context)) return merge([], context.querySelectorAll(selector));
		const nodes = resolveContexts(context);
		const results = [];
		for (const node of nodes) {
			const newNodes = node.querySelectorAll(selector);
			results.push(...newNodes);
		}
		return nodes.length > 1 && results.length > 1 ? unique(results) : results;
	}
	/**
	* Returns all nodes with a specific tag.
	* @param {string} tagName The tag name.
	* @param {QueryContextInput} [context=getContext()] The query context.
	* @returns {Element[]} The matching nodes.
	*/
	function findByTag$1(tagName, context = getContext()) {
		if (isDocument(context) || isElement(context)) return merge([], context.getElementsByTagName(tagName));
		if (isFragment(context) || isShadow(context)) return merge([], context.querySelectorAll(tagName));
		const nodes = resolveContexts(context);
		const results = [];
		for (const node of nodes) {
			const newNodes = isFragment(node) || isShadow(node) ? node.querySelectorAll(tagName) : node.getElementsByTagName(tagName);
			results.push(...newNodes);
		}
		return nodes.length > 1 && results.length > 1 ? unique(results) : results;
	}
	/**
	* Returns a single node matching a selector.
	* @param {string} selector The query selector.
	* @param {QueryContextInput} [context=getContext()] The query context.
	* @returns {Element|null|undefined} The matching element, or `undefined` if none matches.
	*/
	function findOne$1(selector, context = getContext()) {
		if (!selector) return null;
		const match = selector.match(/^([#.]?)([\w-]+)$/);
		if (match) {
			if (match[1] === "#") return findOneById$1(match[2], context);
			if (match[1] === ".") return findOneByClass$1(match[2], context);
			return findOneByTag$1(match[2], context);
		}
		if (isDocument(context) || isElement(context) || isFragment(context) || isShadow(context)) return context.querySelector(selector);
		const nodes = resolveContexts(context);
		if (!nodes.length) return;
		for (const node of nodes) {
			const result = node.querySelector(selector);
			if (result) return result;
		}
		return null;
	}
	/**
	* Returns a single node with a specific class.
	* @param {string} className The class name.
	* @param {QueryContextInput} [context=getContext()] The query context.
	* @returns {Element|null|undefined} The matching element, or `undefined` if none matches.
	*/
	function findOneByClass$1(className, context = getContext()) {
		if (isDocument(context) || isElement(context)) return context.getElementsByClassName(className).item(0);
		const selector = `.${escapeCSS(className)}`;
		if (isFragment(context) || isShadow(context)) return context.querySelector(selector);
		const nodes = resolveContexts(context);
		if (!nodes.length) return;
		for (const node of nodes) {
			const result = isFragment(node) || isShadow(node) ? node.querySelector(selector) : node.getElementsByClassName(className).item(0);
			if (result) return result;
		}
		return null;
	}
	/**
	* Returns a single node with a specific ID.
	* @param {string} id The id.
	* @param {QueryContextInput} [context=getContext()] The query context.
	* @returns {Element|null|undefined} The matching element, or `undefined` if none matches.
	*/
	function findOneById$1(id, context = getContext()) {
		if (isDocument(context)) return context.getElementById(id);
		const selector = `#${escapeCSS(id)}`;
		if (isElement(context) || isFragment(context) || isShadow(context)) return context.querySelector(selector);
		const nodes = resolveContexts(context);
		if (!nodes.length) return;
		for (const node of nodes) {
			const result = isDocument(node) ? node.getElementById(id) : node.querySelector(selector);
			if (result) return result;
		}
		return null;
	}
	/**
	* Returns a single node with a specific tag.
	* @param {string} tagName The tag name.
	* @param {QueryContextInput} [context=getContext()] The query context.
	* @returns {Element|null|undefined} The matching element, or `undefined` if none matches.
	*/
	function findOneByTag$1(tagName, context = getContext()) {
		if (isDocument(context) || isElement(context)) return context.getElementsByTagName(tagName).item(0);
		if (isFragment(context) || isShadow(context)) return context.querySelector(tagName);
		const nodes = resolveContexts(context);
		if (!nodes.length) return;
		for (const node of nodes) {
			const result = isFragment(node) || isShadow(node) ? node.querySelector(tagName) : node.getElementsByTagName(tagName).item(0);
			if (result) return result;
		}
		return null;
	}
	/** @import { NodeFilterCallback } from './helpers.js'; */
	/** @import { NodeInput } from './helpers.js'; */
	/** @import { QueryContextInput } from './traversal/find.js'; */
	/** @import { QueryInput } from './helpers.js'; */
	/**
	* @typedef {NodeInput|NodeFilterCallback} NodeFilterInput
	*/
	/**
	* @typedef {object} NodeParseOptions
	* @property {boolean} [node=false] Whether to allow text and comment nodes.
	* @property {boolean} [fragment=false] Whether to allow DocumentFragment.
	* @property {boolean} [shadow=false] Whether to allow ShadowRoot.
	* @property {boolean} [document=false] Whether to allow Document.
	* @property {boolean} [window=false] Whether to allow Window.
	* @property {boolean} [html=false] Whether to allow HTML strings.
	* @property {QueryContextInput} [context] The query context.
	*/
	/**
	* Returns a node filter callback.
	* @param {NodeFilterInput} filter The filter node(s), a query selector string or custom filter function.
	* @param {boolean} [defaultValue=true] The default return value.
	* @returns {NodeFilterCallback} The node filter callback.
	*/
	function parseFilter(filter, defaultValue = true) {
		if (!filter) return (_) => defaultValue;
		if (isFunction(filter)) return filter;
		if (isString(filter)) return (node) => isElement(node) && node.matches(filter);
		if (isNode(filter) || isFragment(filter) || isShadow(filter)) return (node) => node.isSameNode(filter);
		filter = parseNodes(filter, {
			node: true,
			fragment: true,
			shadow: true
		});
		if (filter.length) return (node) => filter.includes(node);
		return (_) => !defaultValue;
	}
	/**
	* Returns a node-containment filter callback.
	* @param {NodeFilterInput} filter The filter node(s), a query selector string or custom filter function.
	* @param {boolean} [defaultValue=true] The default return value.
	* @returns {NodeFilterCallback} The node contains filter callback.
	*/
	function parseFilterContains(filter, defaultValue = true) {
		if (!filter) return (_) => defaultValue;
		if (isFunction(filter)) return (node) => merge([], node.querySelectorAll("*")).some(filter);
		if (isString(filter)) return (node) => !!findOne$1(filter, node);
		if (isNode(filter) || isFragment(filter) || isShadow(filter)) return (node) => node.contains(filter);
		filter = parseNodes(filter, {
			node: true,
			fragment: true,
			shadow: true
		});
		if (filter.length) return (node) => filter.some((other) => node.contains(other));
		return (_) => !defaultValue;
	}
	/**
	* Returns the first node matching a filter.
	* @param {QueryInput} nodes The input node(s), or a query selector or HTML string.
	* @param {NodeParseOptions} [options] The parsing options.
	* @returns {Node|Window|null|undefined} The matching node, or `undefined` if none matches.
	*/
	function parseNode(nodes, options = {}) {
		const filter = parseNodesFilter(options);
		const context = options.context || getContext();
		const stringCallback = (node) => options.html && node.trim().charAt(0) === "<" ? parseHTML(node).shift() : findOne$1(node, context);
		if (!isArray(nodes)) return resolveNode(nodes, stringCallback, filter);
		for (const node of nodes) {
			const result = resolveNode(node, stringCallback, filter);
			if (result) return result;
		}
	}
	/**
	* Returns a filtered array of nodes.
	* @param {QueryInput} nodes The input node(s), or a query selector or HTML string.
	* @param {NodeParseOptions} [options] The parsing options.
	* @returns {Array<Node|Window>} The filtered array of nodes.
	*/
	function parseNodes(nodes, options = {}) {
		const filter = parseNodesFilter(options);
		const context = options.context || getContext();
		const stringCallback = (node) => options.html && node.trim().charAt(0) === "<" ? parseHTML(node) : find$1(node, context);
		if (!isArray(nodes)) return resolveNodes(nodes, stringCallback, filter);
		const results = nodes.flatMap((node) => resolveNodes(node, stringCallback, filter));
		return nodes.length > 1 && results.length > 1 ? unique(results) : results;
	}
	/**
	* Returns a function for filtering nodes.
	* @param {NodeParseOptions} [options] The parsing options.
	* @returns {NodeFilterCallback} The node filter function.
	*/
	function parseNodesFilter(options) {
		if (!options) return isElement;
		const callbacks = [];
		if (options.node) callbacks.push(isNode);
		else callbacks.push(isElement);
		if (options.document) callbacks.push(isDocument);
		if (options.window) callbacks.push(isWindow);
		if (options.fragment) callbacks.push(isFragment);
		if (options.shadow) callbacks.push(isShadow);
		return (node) => callbacks.some((callback) => callback(node));
	}
	var allowedTags = {
		"*": [
			"class",
			"dir",
			"id",
			"lang",
			"role",
			/^aria-[\w-]*$/i
		],
		"a": [
			"target",
			"href",
			"title",
			"rel"
		],
		"area": [],
		"b": [],
		"br": [],
		"col": [],
		"code": [],
		"div": [],
		"dd": [],
		"dl": [],
		"dt": [],
		"em": [],
		"hr": [],
		"h1": [],
		"h2": [],
		"h3": [],
		"h4": [],
		"h5": [],
		"h6": [],
		"i": [],
		"img": [
			"src",
			"alt",
			"title",
			"width",
			"height"
		],
		"li": [],
		"ol": [],
		"p": [],
		"pre": [],
		"s": [],
		"small": [],
		"span": [],
		"sub": [],
		"sup": [],
		"strong": [],
		"u": [],
		"ul": []
	};
	var uriAttributes = /* @__PURE__ */ new Set([
		"action",
		"background",
		"cite",
		"formaction",
		"href",
		"itemtype",
		"longdesc",
		"poster",
		"src",
		"xlink:href"
	]);
	var eventLookup = {
		mousedown: ["mousemove", "mouseup"],
		touchstart: ["touchmove", "touchend"]
	};
	var animations = /* @__PURE__ */ new Map();
	var data = /* @__PURE__ */ new WeakMap();
	var events = /* @__PURE__ */ new WeakMap();
	var queues = /* @__PURE__ */ new WeakMap();
	var styles = /* @__PURE__ */ new WeakMap();
	/** @import Animation from './animation.js'; */
	/** @import { StopAnimationOptions } from './animation.js'; */
	/**
	* Represents a Promise-compatible collection of animations.
	*/
	var AnimationSet = class {
		#animations;
		#promise;
		/**
		* Creates an animation set.
		* @param {Animation[]} animations The animations.
		*/
		constructor(animations) {
			this.#animations = animations;
			this.#promise = Promise.all(animations);
		}
		/**
		* Executes a callback if any of the animations is rejected.
		* @param {((reason: *) => *)} [onRejected] The callback to execute if an animation is rejected.
		* @returns {Promise<*>} The resulting promise.
		*/
		catch(onRejected) {
			return this.#promise.catch(onRejected);
		}
		/**
		* Executes a callback once the animation is settled (resolved or rejected).
		* @param {(() => void)} [onFinally] The callback to execute once the animation set is settled.
		* @returns {Promise<Element[]>} The resulting promise.
		*/
		finally(onFinally) {
			return this.#promise.finally(onFinally);
		}
		/**
		* Stops the animations.
		* @param {StopAnimationOptions} [options] The stopping options.
		*/
		stop({ finish = true } = {}) {
			for (const animation of this.#animations) animation.stop({ finish });
		}
		/**
		* Executes a callback once the animation is resolved (or optionally rejected).
		* @param {((value: Element[]) => *)} onFulfilled The callback to execute if the animations resolve.
		* @param {((reason: *) => *)} [onRejected] The callback to execute if an animation is rejected.
		* @returns {Promise<*>} The resulting promise.
		*/
		then(onFulfilled, onRejected) {
			return this.#promise.then(onFulfilled, onRejected);
		}
	};
	Object.setPrototypeOf(AnimationSet.prototype, Promise.prototype);
	var animating = false;
	/**
	* Gets the current time.
	* @returns {number} The current time.
	*/
	function getTime() {
		const { performance } = getWindow();
		return performance.now();
	}
	/**
	* Starts the animation loop (if not already started).
	*/
	function start() {
		if (animating) return;
		animating = true;
		update();
	}
	/**
	* Runs a single frame of all animations, and then queue up the next frame.
	*/
	function update() {
		const { requestAnimationFrame, setTimeout } = getWindow();
		const time = getTime();
		for (const [node, currentAnimations] of animations) {
			const otherAnimations = currentAnimations.filter((animation) => !animation.update(time));
			if (!otherAnimations.length) animations.delete(node);
			else animations.set(node, otherAnimations);
		}
		if (!animations.size) animating = false;
		else if (config.useTimeout) setTimeout(update, 1e3 / 60);
		else requestAnimationFrame(update);
	}
	/**
	* @typedef {'linear'|'ease-in'|'ease-out'|'ease-in-out'} AnimationType
	*/
	/**
	* @typedef {'top'|'right'|'bottom'|'left'|(() => string)} AnimationDirection
	*/
	/**
	* @typedef {object} AnimationOptions
	* @property {number} [duration=1000] The duration in milliseconds.
	* @property {AnimationType} [type='ease-in-out'] The easing type.
	* @property {boolean} [infinite=false] Whether to repeat indefinitely.
	* @property {boolean} [debug=false] Whether to expose timing data on the element.
	* @property {AnimationDirection} [direction] The animation direction.
	* @property {boolean} [useGpu=true] Whether to use GPU-accelerated transforms.
	* @property {number} [x=0] The X-axis rotation component.
	* @property {number} [y=1] The Y-axis rotation component.
	* @property {number} [z=0] The Z-axis rotation component.
	* @property {boolean} [inverse=false] Whether to invert the rotation.
	* @property {number} [start] The animation start time.
	*/
	/**
	* @typedef {AnimationOptions & {queueName?: string}} QueuedAnimationOptions
	*/
	/**
	* @typedef {object} StopAnimationOptions
	* @property {boolean} [finish=true] Whether to finish the animation.
	*/
	/**
	* @callback AnimationCallback
	* @param {Element} node The animated element.
	* @param {number} progress The animation progress from 0 to 1.
	* @param {AnimationOptions} options The resolved animation options.
	* @returns {void} Nothing.
	*/
	/**
	* Represents a single Promise-compatible element animation.
	*/
	var Animation = class Animation {
		#callback;
		#isFinished;
		#isStopped;
		#node;
		#options;
		#promise;
		#reject;
		#resolve;
		/**
		* Creates an animation.
		* @param {Element} node The input node.
		* @param {AnimationCallback} callback The animation callback.
		* @param {AnimationOptions} [options] The animation options.
		*/
		constructor(node, callback, options) {
			this.#node = node;
			this.#callback = callback;
			this.#options = {
				...getAnimationDefaults(),
				...options
			};
			if (!("start" in this.#options)) this.#options.start = getTime();
			if (this.#options.debug) this.#node.dataset.animationStart = this.#options.start;
			this.#promise = new Promise((resolve, reject) => {
				this.#resolve = resolve;
				this.#reject = reject;
			});
			if (!animations.has(node)) animations.set(node, []);
			animations.get(node).push(this);
		}
		/**
		* Executes a callback if the animation is rejected.
		* @param {((reason: *) => *)} [onRejected] The callback to execute if the animation is rejected.
		* @returns {Promise<*>} The resulting promise.
		*/
		catch(onRejected) {
			return this.#promise.catch(onRejected);
		}
		/**
		* Clones the animation to a new node.
		* @param {Element} node The input node.
		* @returns {Animation} The cloned Animation.
		*/
		clone(node) {
			return new Animation(node, this.#callback, this.#options);
		}
		/**
		* Executes a callback once the animation is settled (resolved or rejected).
		* @param {(() => void)} [onFinally] The callback to execute once the animation is settled.
		* @returns {Promise<Element>} The resulting promise.
		*/
		finally(onFinally) {
			return this.#promise.finally(onFinally);
		}
		/**
		* Stops the animation.
		* @param {StopAnimationOptions} [options] The stopping options.
		*/
		stop({ finish = true } = {}) {
			if (this.#isStopped || this.#isFinished) return;
			const otherAnimations = animations.get(this.#node).filter((animation) => animation !== this);
			if (!otherAnimations.length) animations.delete(this.#node);
			else animations.set(this.#node, otherAnimations);
			if (finish) this.update();
			this.#isStopped = true;
			if (!finish) this.#reject(this.#node);
		}
		/**
		* Executes a callback once the animation is resolved (or optionally rejected).
		* @param {((value: Element) => *)} onFulfilled The callback to execute if the animation is resolved.
		* @param {((reason: *) => *)} [onRejected] The callback to execute if the animation is rejected.
		* @returns {Promise<*>} The resulting promise.
		*/
		then(onFulfilled, onRejected) {
			return this.#promise.then(onFulfilled, onRejected);
		}
		/**
		* Runs a single frame of the animation.
		* @param {number} [time] The current time.
		* @returns {boolean} Whether the animation is finished.
		*/
		update(time = null) {
			if (this.#isStopped) return true;
			let progress;
			if (time === null) progress = 1;
			else {
				progress = (time - this.#options.start) / this.#options.duration;
				if (this.#options.infinite) progress %= 1;
				else progress = clamp(progress);
				if (this.#options.type === "ease-in") progress = progress ** 2;
				else if (this.#options.type === "ease-out") progress = Math.sqrt(progress);
				else if (this.#options.type === "ease-in-out") {
					if (progress <= .5) progress = progress ** 2 * 2;
					else progress = 1 - (1 - progress) ** 2 * 2;
				}
			}
			if (this.#options.debug) {
				this.#node.dataset.animationTime = time;
				this.#node.dataset.animationProgress = progress;
			}
			try {
				this.#callback(this.#node, progress, this.#options);
			} catch (error) {
				if (this.#options.debug) {
					delete this.#node.dataset.animationStart;
					delete this.#node.dataset.animationTime;
					delete this.#node.dataset.animationProgress;
				}
				this.#isFinished = true;
				this.#reject(error);
				return true;
			}
			if (progress < 1) return false;
			if (this.#options.debug) {
				delete this.#node.dataset.animationStart;
				delete this.#node.dataset.animationTime;
				delete this.#node.dataset.animationProgress;
			}
			if (!this.#isFinished) {
				this.#isFinished = true;
				this.#resolve(this.#node);
			}
			return true;
		}
	};
	Object.setPrototypeOf(Animation.prototype, Promise.prototype);
	/** @import { AnimationCallback } from './animation.js'; */
	/** @import { AnimationOptions } from './animation.js'; */
	/** @import { ElementInput } from '../helpers.js'; */
	/** @import { StopAnimationOptions } from './animation.js'; */
	/**
	* Adds an animation to each node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {AnimationCallback} callback The animation callback.
	* @param {AnimationOptions} [options] The animation options.
	* @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
	*/
	function animate$1(selector, callback, options) {
		const newAnimations = parseNodes(selector).map((node) => new Animation(node, callback, options));
		start();
		return new AnimationSet(newAnimations);
	}
	/**
	* Stops all animations for each node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {StopAnimationOptions} [options] The stopping options.
	*/
	function stop$1(selector, { finish = true } = {}) {
		const nodes = parseNodes(selector);
		for (const node of nodes) {
			if (!animations.has(node)) continue;
			const currentAnimations = animations.get(node);
			for (const animation of currentAnimations) animation.stop({ finish });
		}
	}
	/** @import { AnimationOptions } from './animation.js'; */
	/** @import AnimationSet from './animation-set.js'; */
	/** @import { ElementInput } from '../helpers.js'; */
	/**
	* @typedef {Record<string, {priority: string, value: string}>} InlineStyles
	*/
	/**
	* @callback AnimationEffectCallback
	* @param {Element} node The animated element.
	* @param {number} progress The animation progress from 0 to 1.
	* @param {AnimationOptions} options The resolved animation options.
	* @param {InlineStyles} initialStyles The initial inline styles.
	* @returns {void} Nothing.
	*/
	/**
	* Drops each node into place.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {AnimationOptions} [options] The animation options.
	* @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
	*/
	function dropIn$1(selector, options) {
		return slideIn$1(selector, {
			direction: "top",
			...options
		});
	}
	/**
	* Drops each node out of place.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {AnimationOptions} [options] The animation options.
	* @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
	*/
	function dropOut$1(selector, options) {
		return slideOut$1(selector, {
			direction: "top",
			...options
		});
	}
	/**
	* Fades the opacity of each node in.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {AnimationOptions} [options] The animation options.
	* @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
	*/
	function fadeIn$1(selector, options) {
		return animateEffect(selector, ["opacity"], (node, progress) => node.style.setProperty("opacity", progress.toFixed(2)), options);
	}
	/**
	* Fades the opacity of each node out.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {AnimationOptions} [options] The animation options.
	* @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
	*/
	function fadeOut$1(selector, options) {
		return animateEffect(selector, ["opacity"], (node, progress) => node.style.setProperty("opacity", (1 - progress).toFixed(2)), options);
	}
	/**
	* Rotates each node in on an X, Y or Z.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {AnimationOptions} [options] The animation options.
	* @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
	*/
	function rotateIn$1(selector, options) {
		return animateEffect(selector, ["transform"], (node, progress, options) => {
			const amount = ((90 - progress * 90) * (options.inverse ? -1 : 1)).toFixed(2);
			node.style.setProperty("transform", `rotate3d(${options.x}, ${options.y}, ${options.z}, ${amount}deg)`);
		}, {
			x: 0,
			y: 1,
			z: 0,
			...options
		});
	}
	/**
	* Rotates each node out on an X, Y or Z.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {AnimationOptions} [options] The animation options.
	* @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
	*/
	function rotateOut$1(selector, options) {
		return animateEffect(selector, ["transform"], (node, progress, options) => {
			const amount = (progress * 90 * (options.inverse ? -1 : 1)).toFixed(2);
			node.style.setProperty("transform", `rotate3d(${options.x}, ${options.y}, ${options.z}, ${amount}deg)`);
		}, {
			x: 0,
			y: 1,
			z: 0,
			...options
		});
	}
	/**
	* Slides each node in from a direction.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {AnimationOptions} [options] The animation options.
	* @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
	*/
	function slideIn$1(selector, options) {
		options = {
			direction: "bottom",
			useGpu: true,
			...options
		};
		return animateEffect(selector, options.useGpu ? ["transform"] : ["margin-left", "margin-top"], (node, progress, options) => {
			const dir = evaluate(options.direction);
			let size;
			let translateStyle;
			let inverse;
			if (["top", "bottom"].includes(dir)) {
				size = node.clientHeight;
				translateStyle = options.useGpu ? "Y" : "margin-top";
				inverse = dir === "top";
			} else {
				size = node.clientWidth;
				translateStyle = options.useGpu ? "X" : "margin-left";
				inverse = dir === "left";
			}
			const translateAmount = ((size - size * progress) * (inverse ? -1 : 1)).toFixed(2);
			if (options.useGpu) node.style.setProperty("transform", `translate${translateStyle}(${translateAmount}px)`);
			else node.style.setProperty(translateStyle, `${translateAmount}px`);
		}, options);
	}
	/**
	* Slides each node out from a direction.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {AnimationOptions} [options] The animation options.
	* @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
	*/
	function slideOut$1(selector, options) {
		options = {
			direction: "bottom",
			useGpu: true,
			...options
		};
		return animateEffect(selector, options.useGpu ? ["transform"] : ["margin-left", "margin-top"], (node, progress, options) => {
			const dir = evaluate(options.direction);
			let size;
			let translateStyle;
			let inverse;
			if (["top", "bottom"].includes(dir)) {
				size = node.clientHeight;
				translateStyle = options.useGpu ? "Y" : "margin-top";
				inverse = dir === "top";
			} else {
				size = node.clientWidth;
				translateStyle = options.useGpu ? "X" : "margin-left";
				inverse = dir === "left";
			}
			const translateAmount = (size * progress * (inverse ? -1 : 1)).toFixed(2);
			if (options.useGpu) node.style.setProperty("transform", `translate${translateStyle}(${translateAmount}px)`);
			else node.style.setProperty(translateStyle, `${translateAmount}px`);
		}, options);
	}
	/**
	* Squeezes each node in from a direction.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {AnimationOptions} [options] The animation options.
	* @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
	*/
	function squeezeIn$1(selector, options) {
		options = {
			direction: "bottom",
			useGpu: true,
			...options
		};
		return animateEffect(selector, options.useGpu ? [
			"height",
			"overflow",
			"transform",
			"width"
		] : [
			"height",
			"margin-left",
			"margin-top",
			"overflow",
			"width"
		], (node, progress, options, initialStyles) => {
			node.style.setProperty("height", initialStyles.height.value);
			node.style.setProperty("width", initialStyles.width.value);
			node.style.setProperty("overflow", "hidden");
			const dir = evaluate(options.direction);
			let size;
			let sizeStyle;
			let translateStyle;
			if (["top", "bottom"].includes(dir)) {
				size = node.clientHeight;
				sizeStyle = "height";
				if (dir === "top") translateStyle = options.useGpu ? "Y" : "margin-top";
			} else {
				size = node.clientWidth;
				sizeStyle = "width";
				if (dir === "left") translateStyle = options.useGpu ? "X" : "margin-left";
			}
			const amount = (size * progress).toFixed(2);
			node.style.setProperty(sizeStyle, `${amount}px`);
			if (translateStyle) {
				const translateAmount = (size - amount).toFixed(2);
				if (options.useGpu) node.style.setProperty("transform", `translate${translateStyle}(${translateAmount}px)`);
				else node.style.setProperty(translateStyle, `${translateAmount}px`);
			}
		}, options);
	}
	/**
	* Squeezes each node out from a direction.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {AnimationOptions} [options] The animation options.
	* @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
	*/
	function squeezeOut$1(selector, options) {
		options = {
			direction: "bottom",
			useGpu: true,
			...options
		};
		return animateEffect(selector, options.useGpu ? [
			"height",
			"overflow",
			"transform",
			"width"
		] : [
			"height",
			"margin-left",
			"margin-top",
			"overflow",
			"width"
		], (node, progress, options, initialStyles) => {
			node.style.setProperty("height", initialStyles.height.value);
			node.style.setProperty("width", initialStyles.width.value);
			node.style.setProperty("overflow", "hidden");
			const dir = evaluate(options.direction);
			let size;
			let sizeStyle;
			let translateStyle;
			if (["top", "bottom"].includes(dir)) {
				size = node.clientHeight;
				sizeStyle = "height";
				if (dir === "top") translateStyle = options.useGpu ? "Y" : "margin-top";
			} else {
				size = node.clientWidth;
				sizeStyle = "width";
				if (dir === "left") translateStyle = options.useGpu ? "X" : "margin-left";
			}
			const amount = (size - size * progress).toFixed(2);
			node.style.setProperty(sizeStyle, `${amount}px`);
			if (translateStyle) {
				const translateAmount = (size - amount).toFixed(2);
				if (options.useGpu) node.style.setProperty("transform", `translate${translateStyle}(${translateAmount}px)`);
				else node.style.setProperty(translateStyle, `${translateAmount}px`);
			}
		}, options);
	}
	/**
	* Animates inline styles and restores their initial values on completion.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {string[]} properties The inline style properties changed by the animation.
	* @param {AnimationEffectCallback} callback The animation callback.
	* @param {AnimationOptions} [options] The animation options.
	* @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
	*/
	function animateEffect(selector, properties, callback, options) {
		const initialStyles = /* @__PURE__ */ new WeakMap();
		return animate$1(selector, (node, progress, options) => {
			if (!initialStyles.has(node)) initialStyles.set(node, Object.fromEntries(properties.map((property) => [property, {
				priority: node.style.getPropertyPriority(property),
				value: node.style.getPropertyValue(property)
			}])));
			const styles = initialStyles.get(node);
			if (progress < 1) {
				callback(node, progress, options, styles);
				return;
			}
			for (const [property, { priority, value }] of Object.entries(styles)) node.style.setProperty(property, value, priority);
		}, options);
	}
	/** @import { ElementInput } from '../helpers.js'; */
	/**
	* @typedef {object} CreateOptions
	* @property {string} [html] The HTML contents.
	* @property {string} [text] The text contents.
	* @property {string|string[]} [class] The classes.
	* @property {Record<string, string|number>} [style] The style properties.
	* @property {*} [value] The value.
	* @property {Record<string, *>} [attributes] The attributes.
	* @property {Record<string, *>} [properties] The properties.
	* @property {Record<string, *>} [dataset] The dataset values.
	*/
	/**
	* Attaches a shadow DOM tree to the first node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {{open?: boolean}} [options] The shadow DOM options.
	* @returns {ShadowRoot|undefined} The new ShadowRoot, or `undefined` if no element matches.
	*/
	function attachShadow$1(selector, { open = true } = {}) {
		const node = parseNode(selector);
		if (!node) return;
		return node.attachShadow({ mode: open ? "open" : "closed" });
	}
	/**
	* Creates a new DOM element.
	* @param {string} [tagName='div'] The type of HTML element to create.
	* @param {CreateOptions} [options] The element options.
	* @returns {HTMLElement} The new HTMLElement.
	*/
	function create(tagName = "div", options = {}) {
		const node = getContext().createElement(tagName);
		if ("html" in options) node.innerHTML = options.html;
		else if ("text" in options) node.textContent = options.text;
		if ("class" in options) {
			const classes = parseClasses(wrap(options.class));
			node.classList.add(...classes);
		}
		if ("style" in options) for (let [style, value] of Object.entries(options.style)) {
			style = normalizeCssProperty(style);
			value = normalizeCssValue(style, value);
			node.style.setProperty(style, value);
		}
		if ("value" in options) node.value = options.value;
		if ("attributes" in options) for (const [key, value] of Object.entries(options.attributes)) node.setAttribute(key, value);
		if ("properties" in options) for (const [key, value] of Object.entries(options.properties)) node[key] = value;
		if ("dataset" in options) {
			const dataset = parseData(options.dataset, null, { json: true });
			for (let [key, value] of Object.entries(dataset)) {
				key = camelCase(key);
				node.dataset[key] = value;
			}
		}
		return node;
	}
	/**
	* Creates a new comment node.
	* @param {string} comment The comment contents.
	* @returns {Node} The new comment node.
	*/
	function createComment(comment) {
		return getContext().createComment(comment);
	}
	/**
	* Creates a new document fragment.
	* @returns {DocumentFragment} The new DocumentFragment.
	*/
	function createFragment() {
		return getContext().createDocumentFragment();
	}
	/**
	* Creates a new range object.
	* @returns {Range} The new Range.
	*/
	function createRange() {
		return getContext().createRange();
	}
	/**
	* Creates a new text node.
	* @param {string} text The text contents.
	* @returns {Node} The new text node.
	*/
	function createText(text) {
		return getContext().createTextNode(text);
	}
	/** @import { ElementInput } from '../helpers.js'; */
	/** @import { NodeFilterInput } from '../filters.js'; */
	/** @import { NodeInput } from '../helpers.js'; */
	/** @import { QueryInput } from '../helpers.js'; */
	/**
	* Executes a command in the document context.
	* @param {string} command The command to execute.
	* @param {string} [value] The value to give the command.
	* @returns {boolean} Whether the command was executed.
	*/
	function exec(command, value = null) {
		return getContext().execCommand(command, false, value);
	}
	/**
	* Gets the index of the first node relative to its parent.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @returns {number|undefined} The index, or `undefined` if no node or parent matches.
	*/
	function index$1(selector) {
		const node = parseNode(selector, { node: true });
		if (!node || !node.parentNode) return;
		return merge([], node.parentNode.children).indexOf(node);
	}
	/**
	* Gets the index of the first node matching a filter.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @returns {number} The index.
	*/
	function indexOf$1(selector, nodeFilter) {
		nodeFilter = parseFilter(nodeFilter);
		return parseNodes(selector, {
			node: true,
			fragment: true,
			shadow: true
		}).findIndex(nodeFilter);
	}
	/**
	* Normalizes nodes (remove empty text nodes, and join adjacent text nodes).
	* @param {NodeInput} selector The input node(s), or a query selector string.
	*/
	function normalize$1(selector) {
		const nodes = parseNodes(selector, {
			node: true,
			fragment: true,
			shadow: true,
			document: true
		});
		for (const node of nodes) node.normalize();
	}
	/**
	* Returns a serialized string containing names and values of all form nodes.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @returns {string} The serialized string.
	*/
	function serialize$1(selector) {
		return parseParams(serializeArray$1(selector));
	}
	/**
	* Returns a serialized array containing names and values of all form nodes.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @returns {Array<{name: string, value: string}>} The serialized entries.
	*/
	function serializeArray$1(selector) {
		return parseNodes(selector, {
			fragment: true,
			shadow: true
		}).reduce((values, node) => {
			if (isElement(node) && node.matches("form") || isFragment(node) || isShadow(node)) return values.concat(serializeArray$1(node.querySelectorAll("input, select, textarea")));
			if (isElement(node) && node.matches("[disabled], input[type=submit], input[type=reset], input[type=file], input[type=radio]:not(:checked), input[type=checkbox]:not(:checked)")) return values;
			const name = node.getAttribute("name");
			if (!name) return values;
			if (isElement(node) && node.matches("select[multiple]")) for (const option of node.selectedOptions) values.push({
				name,
				value: option.value || ""
			});
			else values.push({
				name,
				value: node.value || ""
			});
			return values;
		}, []);
	}
	/**
	* Sorts nodes by their position in the document.
	* @param {QueryInput} selector The input node(s), or a query selector string.
	* @returns {Array<Node|Window>} The sorted nodes.
	*/
	function sort$1(selector) {
		const { Node } = getWindow();
		return parseNodes(selector, {
			node: true,
			fragment: true,
			shadow: true,
			document: true,
			window: true
		}).sort((node, other) => {
			if (isWindow(node)) return 1;
			if (isWindow(other)) return -1;
			if (isDocument(node)) return 1;
			if (isDocument(other)) return -1;
			if (isFragment(other)) return 1;
			if (isFragment(node)) return -1;
			const isNodeShadow = isShadow(node);
			const isOtherShadow = isShadow(other);
			if (isNodeShadow) node = node.host;
			if (isOtherShadow) other = other.host;
			if (!node.isConnected || !other.isConnected) {
				if (node.isConnected !== other.isConnected) {
					if (isNodeShadow && !node.isConnected) return 1;
					if (isOtherShadow && !other.isConnected) return -1;
					return node.isConnected ? 1 : -1;
				}
				return 0;
			}
			if (node.isSameNode(other)) return 0;
			const pos = node.compareDocumentPosition(other);
			if (pos & Node.DOCUMENT_POSITION_FOLLOWING || pos & Node.DOCUMENT_POSITION_CONTAINED_BY) return -1;
			if (pos & Node.DOCUMENT_POSITION_PRECEDING || pos & Node.DOCUMENT_POSITION_CONTAINS) return 1;
			return 0;
		});
	}
	/**
	* Returns the tag name (lowercase) of the first node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @returns {string|undefined} The node's lowercase tag name, or `undefined` if no element matches.
	*/
	function tagName$1(selector) {
		const node = parseNode(selector);
		if (!node) return;
		return node.tagName.toLowerCase();
	}
	/** @import { NodeFilterInput } from '../filters.js'; */
	/** @import { NodeInput } from '../helpers.js'; */
	/**
	* Returns the first child of each node (optionally matching a filter).
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @returns {Node[]} The matching nodes.
	*/
	function child$1(selector, nodeFilter) {
		return children$1(selector, nodeFilter, { first: true });
	}
	/**
	* Returns all children of each node (optionally matching a filter).
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @param {{first?: boolean, elementsOnly?: boolean}} [options] The filtering options.
	* @returns {Node[]} The matching nodes.
	*/
	function children$1(selector, nodeFilter, { first = false, elementsOnly = true } = {}) {
		nodeFilter = parseFilter(nodeFilter);
		const nodes = parseNodes(selector, {
			fragment: true,
			shadow: true,
			document: true
		});
		const results = [];
		for (const node of nodes) {
			const childNodes = elementsOnly ? merge([], node.children) : merge([], node.childNodes);
			for (const child of childNodes) {
				if (!nodeFilter(child)) continue;
				results.push(child);
				if (first) break;
			}
		}
		return nodes.length > 1 && results.length > 1 ? unique(results) : results;
	}
	/**
	* Returns the closest ancestor to each node (optionally matching a filter, and before a limit).
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @param {NodeFilterInput} [limitFilter] The limit node(s), a query selector string or custom filter function.
	* @returns {Node[]} The matching nodes.
	*/
	function closest$1(selector, nodeFilter, limitFilter) {
		return parents$1(selector, nodeFilter, limitFilter, { first: true });
	}
	/**
	* Returns the common ancestor of all nodes.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @returns {Node|undefined} The common ancestor, or `undefined` if it cannot be resolved.
	*/
	function commonAncestor$1(selector) {
		const nodes = sort$1(selector);
		if (!nodes.length) return;
		if (nodes.some((node) => !node.parentNode)) return;
		const range = createRange();
		if (nodes.length === 1) range.selectNode(nodes.shift());
		else {
			range.setStartBefore(nodes.shift());
			range.setEndAfter(nodes.pop());
		}
		return range.commonAncestorContainer;
	}
	/**
	* Returns all children of each node (including text and comment nodes).
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @returns {Node[]} The matching nodes.
	*/
	function contents$1(selector) {
		return children$1(selector, false, { elementsOnly: false });
	}
	/**
	* Returns the DocumentFragment of the first node.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @returns {DocumentFragment|undefined} The DocumentFragment, or `undefined` if none exists.
	*/
	function fragment$1(selector) {
		const node = parseNode(selector);
		if (!node) return;
		return node.content;
	}
	/**
	* Returns the next sibling for each node (optionally matching a filter).
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @returns {Node[]} The matching nodes.
	*/
	function next$1(selector, nodeFilter) {
		nodeFilter = parseFilter(nodeFilter);
		const nodes = parseNodes(selector, { node: true });
		const results = [];
		for (let node of nodes) while (node = node.nextSibling) {
			if (!isElement(node)) continue;
			if (nodeFilter(node)) results.push(node);
			break;
		}
		return nodes.length > 1 && results.length > 1 ? unique(results) : results;
	}
	/**
	* Returns all next siblings for each node (optionally matching a filter, and before a limit).
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @param {NodeFilterInput} [limitFilter] The limit node(s), a query selector string or custom filter function.
	* @param {{first?: boolean}} [options] The filtering options.
	* @returns {Node[]} The matching nodes.
	*/
	function nextAll$1(selector, nodeFilter, limitFilter, { first = false } = {}) {
		nodeFilter = parseFilter(nodeFilter);
		limitFilter = parseFilter(limitFilter, false);
		const nodes = parseNodes(selector, { node: true });
		const results = [];
		for (let node of nodes) while (node = node.nextSibling) {
			if (!isElement(node)) continue;
			if (limitFilter(node)) break;
			if (!nodeFilter(node)) continue;
			results.push(node);
			if (first) break;
		}
		return nodes.length > 1 && results.length > 1 ? unique(results) : results;
	}
	/**
	* Returns the offset parent (relatively positioned) of the first node.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @returns {Element|null|undefined} The offset parent, or `undefined` if no node matches.
	*/
	function offsetParent$1(selector) {
		const node = parseNode(selector);
		if (!node) return;
		return node.offsetParent;
	}
	/**
	* Returns the parent of each node (optionally matching a filter).
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @returns {Node[]} The matching nodes.
	*/
	function parent$1(selector, nodeFilter) {
		nodeFilter = parseFilter(nodeFilter);
		const nodes = parseNodes(selector, { node: true });
		const results = [];
		for (let node of nodes) {
			node = node.parentNode;
			if (!node) continue;
			if (!nodeFilter(node)) continue;
			results.push(node);
		}
		return nodes.length > 1 && results.length > 1 ? unique(results) : results;
	}
	/**
	* Returns all parents of each node (optionally matching a filter, and before a limit).
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @param {NodeFilterInput} [limitFilter] The limit node(s), a query selector string or custom filter function.
	* @param {{first?: boolean}} [options] The filtering options.
	* @returns {Node[]} The matching nodes.
	*/
	function parents$1(selector, nodeFilter, limitFilter, { first = false } = {}) {
		nodeFilter = parseFilter(nodeFilter);
		limitFilter = parseFilter(limitFilter, false);
		const nodes = parseNodes(selector, { node: true });
		const results = [];
		for (let node of nodes) {
			const parents = [];
			while (node = node.parentNode) {
				if (isDocument(node)) break;
				if (limitFilter(node)) break;
				if (!nodeFilter(node)) continue;
				parents.unshift(node);
				if (first) break;
			}
			results.push(...parents);
		}
		return nodes.length > 1 && results.length > 1 ? unique(results) : results;
	}
	/**
	* Returns the previous sibling for each node (optionally matching a filter).
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @returns {Node[]} The matching nodes.
	*/
	function prev$1(selector, nodeFilter) {
		nodeFilter = parseFilter(nodeFilter);
		const nodes = parseNodes(selector, { node: true });
		const results = [];
		for (let node of nodes) while (node = node.previousSibling) {
			if (!isElement(node)) continue;
			if (nodeFilter(node)) results.push(node);
			break;
		}
		return nodes.length > 1 && results.length > 1 ? unique(results) : results;
	}
	/**
	* Returns all previous siblings for each node (optionally matching a filter, and before a limit).
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @param {NodeFilterInput} [limitFilter] The limit node(s), a query selector string or custom filter function.
	* @param {{first?: boolean}} [options] The filtering options.
	* @returns {Node[]} The matching nodes.
	*/
	function prevAll$1(selector, nodeFilter, limitFilter, { first = false } = {}) {
		nodeFilter = parseFilter(nodeFilter);
		limitFilter = parseFilter(limitFilter, false);
		const nodes = parseNodes(selector, { node: true });
		const results = [];
		for (let node of nodes) {
			const siblings = [];
			while (node = node.previousSibling) {
				if (!isElement(node)) continue;
				if (limitFilter(node)) break;
				if (!nodeFilter(node)) continue;
				siblings.unshift(node);
				if (first) break;
			}
			results.push(...siblings);
		}
		return nodes.length > 1 && results.length > 1 ? unique(results) : results;
	}
	/**
	* Returns the ShadowRoot of the first node.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @returns {ShadowRoot|null|undefined} The ShadowRoot, or `undefined` if no node matches.
	*/
	function shadow$1(selector) {
		const node = parseNode(selector);
		if (!node) return;
		return node.shadowRoot;
	}
	/**
	* Returns all siblings for each node (optionally matching a filter).
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @param {{elementsOnly?: boolean}} [options] The filtering options.
	* @returns {Node[]} The matching nodes.
	*/
	function siblings$1(selector, nodeFilter, { elementsOnly = true } = {}) {
		nodeFilter = parseFilter(nodeFilter);
		const nodes = parseNodes(selector, { node: true });
		const results = [];
		for (const node of nodes) {
			const parent = node.parentNode;
			if (!parent) continue;
			const siblings = elementsOnly ? parent.children : parent.childNodes;
			let sibling;
			for (sibling of siblings) {
				if (node.isSameNode(sibling)) continue;
				if (!nodeFilter(sibling)) continue;
				results.push(sibling);
			}
		}
		return nodes.length > 1 && results.length > 1 ? unique(results) : results;
	}
	/** @import { EventCallback } from './event-handlers.js'; */
	/**
	* @callback DelegateCallback
	* @param {Element} target The event target to test.
	* @returns {Element|false|undefined} The matching delegate element, or no match.
	*/
	/**
	* Returns a function for matching a delegate target to a custom selector.
	* @param {Element|ShadowRoot|Document} node The input node.
	* @param {string} selector The delegate query selector.
	* @returns {DelegateCallback} The callback for finding the matching delegate.
	*/
	function getDelegateContainsFactory(node, selector) {
		return (target) => {
			const matches = merge([], node.querySelectorAll(selector));
			if (!matches.length) return false;
			if (matches.includes(target)) return target;
			return closest$1(target, (parent) => matches.includes(parent), (parent) => parent.isSameNode(node)).shift();
		};
	}
	/**
	* Returns a function for matching a delegate target to a standard selector.
	* @param {Element|ShadowRoot|Document} node The input node.
	* @param {string} selector The delegate query selector.
	* @returns {DelegateCallback} The callback for finding the matching delegate.
	*/
	function getDelegateMatchFactory(node, selector) {
		return (target) => target.matches && target.matches(selector) ? target : closest$1(target, (parent) => parent.matches(selector), (parent) => parent.isSameNode(node)).shift();
	}
	/**
	* Returns a wrapped event callback that executes on a delegate selector.
	* @param {Element|ShadowRoot|Document} node The input node.
	* @param {string} selector The delegate query selector.
	* @param {EventCallback} callback The event callback.
	* @returns {EventCallback} The delegated event callback.
	*/
	function delegateFactory(node, selector, callback) {
		const getDelegate = selector.match(/(?:^\s*:scope|,(?=(?:(?:[^"']*["']){2})*[^"']*$)\s*:scope)/) ? getDelegateContainsFactory(node, selector) : getDelegateMatchFactory(node, selector);
		return (event) => {
			if (node.isSameNode(event.target)) return;
			const delegate = getDelegate(event.target);
			if (!delegate) return;
			Object.defineProperty(event, "currentTarget", {
				configurable: true,
				enumerable: true,
				value: delegate
			});
			Object.defineProperty(event, "delegateTarget", {
				configurable: true,
				enumerable: true,
				value: node
			});
			return callback(event);
		};
	}
	/**
	* Returns a wrapped event callback that cleans up delegate events.
	* @param {Element|ShadowRoot|Document} node The input node.
	* @param {EventCallback} callback The event callback.
	* @returns {EventCallback} The cleaned event callback.
	*/
	function delegateFactoryClean(node, callback) {
		return (event) => {
			if (!event.delegateTarget) return callback(event);
			Object.defineProperty(event, "currentTarget", {
				configurable: true,
				enumerable: true,
				value: node
			});
			Object.defineProperty(event, "delegateTarget", { writable: true });
			delete event.delegateTarget;
			return callback(event);
		};
	}
	/**
	* Returns a wrapped event callback that checks for a namespace match.
	* @param {string} eventName The namespaced event name.
	* @param {EventCallback} callback The callback to execute.
	* @returns {EventCallback} The wrapped event callback.
	*/
	function namespaceFactory(eventName, callback) {
		return (event) => {
			if ("namespaceRegExp" in event && !event.namespaceRegExp.test(eventName)) return;
			return callback(event);
		};
	}
	/**
	* Returns a wrapped event callback that prevents the default action when the callback returns false.
	* @param {EventCallback} callback The callback to execute.
	* @returns {EventCallback} The wrapped event callback.
	*/
	function preventFactory(callback) {
		return (event) => {
			if (callback(event) === false) event.preventDefault();
		};
	}
	/**
	* Returns a wrapped callback that performs cleanup before its first execution.
	* @param {EventCallback} callback The callback to execute.
	* @param {() => void} cleanup The cleanup callback.
	* @returns {EventCallback} The wrapped event callback.
	*/
	function selfDestructCallbackFactory(callback, cleanup) {
		return (event) => {
			cleanup();
			return callback(event);
		};
	}
	/** @import QuerySet from '../query/query-set.js'; */
	/**
	* @typedef {Element|Document|ShadowRoot|Window} EventTargetNode
	*/
	/**
	* @typedef {string|EventTargetNode|Array<string|EventTargetNode>|NodeList|HTMLCollection|QuerySet} EventTargetInput
	*/
	/**
	* @callback EventCallback
	* @param {Event} event The event object.
	* @returns {*} The callback result.
	*/
	/**
	* @typedef {object} EventOptions
	* @property {boolean} [capture=false] Whether to use event capture.
	* @property {string|null} [delegate=null] The delegate selector.
	* @property {boolean} [passive=false] Whether to use a passive listener.
	* @property {boolean} [selfDestruct=false] Whether to remove the listener before its first execution.
	*/
	/**
	* @typedef {object} RemoveEventOptions
	* @property {boolean|null} [capture=null] Whether to match event capture. Null matches either mode.
	* @property {string|null} [delegate=null] The delegate selector.
	*/
	/**
	* @typedef {object} TriggerEventOptions
	* @property {Record<string, *>} [data={}] Additional data assigned to the event.
	* @property {*} [detail] Additional event details.
	* @property {boolean} [bubbles=true] Whether the event bubbles.
	* @property {boolean} [cancelable=true] Whether the event can be cancelled.
	*/
	/**
	* Adds events to each node.
	* @param {EventTargetInput} selector The input node(s), or a query selector string.
	* @param {string} eventNames The event names.
	* @param {EventCallback} callback The callback to execute.
	* @param {EventOptions} [options] The event options.
	*/
	function addEvent$1(selector, eventNames, callback, { capture = false, delegate = null, passive = false, selfDestruct = false } = {}) {
		const nodes = parseNodes(selector, {
			shadow: true,
			document: true,
			window: true
		});
		eventNames = parseEvents(eventNames);
		for (const eventName of eventNames) {
			const realEventName = parseEvent(eventName);
			const eventData = {
				callback,
				delegate,
				selfDestruct,
				capture,
				passive
			};
			for (const node of nodes) {
				if (!events.has(node)) events.set(node, {});
				const nodeEvents = events.get(node);
				let realCallback = callback;
				if (selfDestruct) realCallback = selfDestructCallbackFactory(realCallback, (_) => removeEvent$1(node, eventName, callback, {
					capture,
					delegate
				}));
				realCallback = preventFactory(realCallback);
				if (delegate) realCallback = delegateFactory(node, delegate, realCallback);
				else realCallback = delegateFactoryClean(node, realCallback);
				realCallback = namespaceFactory(eventName, realCallback);
				eventData.realCallback = realCallback;
				eventData.eventName = eventName;
				eventData.realEventName = realEventName;
				if (!nodeEvents[realEventName]) nodeEvents[realEventName] = [];
				nodeEvents[realEventName].push({ ...eventData });
				node.addEventListener(realEventName, realCallback, {
					capture,
					passive
				});
			}
		}
	}
	/**
	* Adds delegated events to each node.
	* @param {EventTargetInput} selector The input node(s), or a query selector string.
	* @param {string} events The event names.
	* @param {string} delegate The delegate selector.
	* @param {EventCallback} callback The callback to execute.
	* @param {EventOptions} [options] The event options.
	*/
	function addEventDelegate$1(selector, events, delegate, callback, { capture = false, passive = false } = {}) {
		addEvent$1(selector, events, callback, {
			capture,
			delegate,
			passive
		});
	}
	/**
	* Adds self-destructing delegated events to each node.
	* @param {EventTargetInput} selector The input node(s), or a query selector string.
	* @param {string} events The event names.
	* @param {string} delegate The delegate selector.
	* @param {EventCallback} callback The callback to execute.
	* @param {EventOptions} [options] The event options.
	*/
	function addEventDelegateOnce$1(selector, events, delegate, callback, { capture = false, passive = false } = {}) {
		addEvent$1(selector, events, callback, {
			capture,
			delegate,
			passive,
			selfDestruct: true
		});
	}
	/**
	* Adds self-destructing events to each node.
	* @param {EventTargetInput} selector The input node(s), or a query selector string.
	* @param {string} events The event names.
	* @param {EventCallback} callback The callback to execute.
	* @param {EventOptions} [options] The event options.
	*/
	function addEventOnce$1(selector, events, callback, { capture = false, passive = false } = {}) {
		addEvent$1(selector, events, callback, {
			capture,
			passive,
			selfDestruct: true
		});
	}
	/**
	* Clones all events from each node to other nodes.
	* @param {EventTargetInput} selector The input node(s), or a query selector string.
	* @param {EventTargetInput} otherSelector The other node(s), or a query selector string.
	*/
	function cloneEvents$1(selector, otherSelector) {
		const nodes = parseNodes(selector, {
			shadow: true,
			document: true,
			window: true
		});
		for (const node of nodes) {
			if (!events.has(node)) continue;
			const nodeEvents = events.get(node);
			for (const realEvents of Object.values(nodeEvents)) for (const eventData of realEvents) addEvent$1(otherSelector, eventData.eventName, eventData.callback, {
				capture: eventData.capture,
				delegate: eventData.delegate,
				passive: eventData.passive,
				selfDestruct: eventData.selfDestruct
			});
		}
	}
	/**
	* Removes events from each node.
	* @param {EventTargetInput} selector The input node(s), or a query selector string.
	* @param {string} [eventNames] The event names.
	* @param {EventCallback} [callback] The callback to remove.
	* @param {RemoveEventOptions} [options] The removal options.
	*/
	function removeEvent$1(selector, eventNames, callback, { capture = null, delegate = null } = {}) {
		const nodes = parseNodes(selector, {
			shadow: true,
			document: true,
			window: true
		});
		let eventLookup;
		if (eventNames) {
			eventNames = parseEvents(eventNames);
			eventLookup = {};
			for (const eventName of eventNames) {
				const realEventName = parseEvent(eventName);
				if (!(realEventName in eventLookup)) eventLookup[realEventName] = [];
				eventLookup[realEventName].push(eventName);
			}
		}
		for (const node of nodes) {
			if (!events.has(node)) continue;
			const nodeEvents = events.get(node);
			for (const [realEventName, realEvents] of Object.entries(nodeEvents)) {
				if (eventLookup && !(realEventName in eventLookup)) continue;
				if (!realEvents.filter((eventData) => {
					if (eventLookup && !eventLookup[realEventName].some((eventName) => {
						if (eventName === realEventName) return true;
						const regExp = eventNamespacedRegExp(eventName);
						return eventData.eventName.match(regExp);
					})) return true;
					if (callback && callback !== eventData.callback) return true;
					if (delegate && delegate !== eventData.delegate) return true;
					if (capture !== null && capture !== eventData.capture) return true;
					node.removeEventListener(realEventName, eventData.realCallback, eventData.capture);
					return false;
				}).length) delete nodeEvents[realEventName];
			}
			if (!Object.keys(nodeEvents).length) events.delete(node);
		}
	}
	/**
	* Removes delegated events from each node.
	* @param {EventTargetInput} selector The input node(s), or a query selector string.
	* @param {string} [events] The event names.
	* @param {string} [delegate] The delegate selector.
	* @param {EventCallback} [callback] The callback to remove.
	* @param {RemoveEventOptions} [options] The removal options.
	*/
	function removeEventDelegate$1(selector, events, delegate, callback, { capture = null } = {}) {
		removeEvent$1(selector, events, callback, {
			capture,
			delegate
		});
	}
	/**
	* Triggers events on each node.
	* @param {EventTargetInput} selector The input node(s), or a query selector string.
	* @param {string} events The event names.
	* @param {TriggerEventOptions} [options] The event options.
	*/
	function triggerEvent$1(selector, events, { data = null, detail = null, bubbles = true, cancelable = true } = {}) {
		const nodes = parseNodes(selector, {
			shadow: true,
			document: true,
			window: true
		});
		events = parseEvents(events);
		for (const event of events) {
			const realEvent = parseEvent(event);
			const eventData = createEvent(realEvent, {
				detail,
				bubbles,
				cancelable
			});
			if (data) Object.assign(eventData, data);
			if (realEvent !== event) {
				eventData.namespace = event.substring(realEvent.length + 1);
				eventData.namespaceRegExp = eventNamespacedRegExp(event);
			}
			for (const node of nodes) node.dispatchEvent(eventData);
		}
	}
	/**
	* Triggers an event for the first node.
	* @param {EventTargetInput} selector The input node(s), or a query selector string.
	* @param {string} event The event name.
	* @param {TriggerEventOptions} [options] The event options.
	* @returns {boolean} Whether the event was dispatched without cancellation.
	*/
	function triggerOne$1(selector, event, { data = null, detail = null, bubbles = true, cancelable = true } = {}) {
		const node = parseNode(selector, {
			shadow: true,
			document: true,
			window: true
		});
		const realEvent = parseEvent(event);
		const eventData = createEvent(realEvent, {
			detail,
			bubbles,
			cancelable
		});
		if (data) Object.assign(eventData, data);
		if (realEvent !== event) {
			eventData.namespace = event.substring(realEvent.length + 1);
			eventData.namespaceRegExp = eventNamespacedRegExp(event);
		}
		return node.dispatchEvent(eventData);
	}
	/** @import { NodeInput } from '../helpers.js'; */
	/**
	* @typedef {object} CloneOptions
	* @property {boolean} [deep=true] Whether to also clone all descendant nodes.
	* @property {boolean} [events=false] Whether to also clone events.
	* @property {boolean} [data=false] Whether to also clone custom data.
	* @property {boolean} [animations=false] Whether to also clone animations.
	*/
	/**
	* Clones each node.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @param {CloneOptions} [options] The cloning options.
	* @returns {Node[]} The cloned nodes.
	*/
	function clone$1(selector, { deep = true, events = false, data = false, animations = false } = {}) {
		return parseNodes(selector, {
			node: true,
			fragment: true
		}).map((node) => {
			const clone = node.cloneNode(deep);
			if (events || data || animations) deepClone(node, clone, {
				deep,
				events,
				data,
				animations
			});
			return clone;
		});
	}
	/**
	* Deep-clones a single node.
	* @param {Node|DocumentFragment} node The node.
	* @param {Node|DocumentFragment} clone The clone.
	* @param {CloneOptions} [options] The cloning options.
	*/
	function deepClone(node, clone, { deep = true, events: events$1 = false, data: data$1 = false, animations: animations$1 = false } = {}) {
		if (events$1 && events.has(node)) {
			const nodeEvents = events.get(node);
			for (const realEvents of Object.values(nodeEvents)) for (const eventData of realEvents) addEvent$1(clone, eventData.eventName, eventData.callback, {
				capture: eventData.capture,
				delegate: eventData.delegate,
				passive: eventData.passive,
				selfDestruct: eventData.selfDestruct
			});
		}
		if (data$1 && data.has(node)) {
			const nodeData = data.get(node);
			data.set(clone, { ...nodeData });
		}
		if (animations$1 && animations.has(node)) {
			const nodeAnimations = animations.get(node);
			for (const animation of nodeAnimations) animation.clone(clone);
		}
		if (deep) for (const [i, child] of node.childNodes.entries()) deepClone(child, clone.childNodes.item(i), {
			deep,
			events: events$1,
			data: data$1,
			animations: animations$1
		});
	}
	/**
	* Detaches each node from the DOM.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @returns {Node[]} The detached nodes.
	*/
	function detach$1(selector) {
		const nodes = parseNodes(selector, { node: true });
		for (const node of nodes) node.remove();
		return nodes;
	}
	/**
	* Removes all children of each node from the DOM.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	*/
	function empty$1(selector) {
		const nodes = parseNodes(selector, {
			fragment: true,
			shadow: true,
			document: true
		});
		for (const node of nodes) {
			const childNodes = merge([], node.childNodes);
			for (const child of childNodes) {
				if (isElement(child) || isFragment(child) || isShadow(child)) removeNode(child);
				child.remove();
			}
			if (node.shadowRoot) removeNode(node.shadowRoot);
			if (node.content) removeNode(node.content);
		}
	}
	/**
	* Removes each node from the DOM.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	*/
	function remove$1(selector) {
		const nodes = parseNodes(selector, {
			node: true,
			fragment: true,
			shadow: true
		});
		for (const node of nodes) {
			if (isElement(node) || isFragment(node) || isShadow(node)) removeNode(node);
			if (isNode(node)) node.remove();
		}
	}
	/**
	* Removes all data for a single node.
	* @param {Node} node The node.
	*/
	function removeNode(node) {
		if (events.has(node)) {
			const nodeEvents = events.get(node);
			if ("remove" in nodeEvents) {
				const eventData = createEvent("remove", {
					bubbles: false,
					cancelable: false
				});
				node.dispatchEvent(eventData);
			}
			for (const [realEventName, realEvents] of Object.entries(nodeEvents)) for (const eventData of realEvents) node.removeEventListener(realEventName, eventData.realCallback, { capture: eventData.capture });
			events.delete(node);
		}
		if (queues.has(node)) queues.delete(node);
		if (animations.has(node)) {
			const nodeAnimations = animations.get(node);
			for (const animation of nodeAnimations) animation.stop();
		}
		if (styles.has(node)) styles.delete(node);
		if (data.has(node)) data.delete(node);
		const childNodes = merge([], node.children);
		for (const child of childNodes) removeNode(child);
		if (node.shadowRoot) removeNode(node.shadowRoot);
		if (node.content) removeNode(node.content);
	}
	/**
	* Replaces each other node with nodes.
	* @param {NodeInput} selector The input node(s), or a query selector or HTML string.
	* @param {NodeInput} otherSelector The input node(s), or a query selector string.
	*/
	function replaceAll$1(selector, otherSelector) {
		replaceWith$1(otherSelector, selector);
	}
	/**
	* Replaces each node with other nodes.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @param {NodeInput} otherSelector The input node(s), or a query selector or HTML string.
	*/
	function replaceWith$1(selector, otherSelector) {
		let nodes = parseNodes(selector, { node: true });
		let others = parseNodes(otherSelector, {
			node: true,
			fragment: true,
			html: true
		});
		const fragment = createFragment();
		for (const other of others) fragment.insertBefore(other, null);
		others = merge([], fragment.childNodes);
		nodes = nodes.filter((node) => !others.includes(node) && !nodes.some((other) => !other.isSameNode(node) && other.contains(node)));
		for (const [i, node] of nodes.entries()) {
			const parent = node.parentNode;
			if (!parent) continue;
			let clones;
			if (i === nodes.length - 1) clones = others;
			else clones = clone$1(others, {
				events: true,
				data: true,
				animations: true
			});
			for (const clone of clones) parent.insertBefore(clone, node);
		}
		remove$1(nodes);
	}
	/** @import { ElementInput } from '../helpers.js'; */
	/**
	* @typedef {Record<string, *>} AttributeValues
	*/
	/**
	* Gets attribute value(s) for the first node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {string} [attribute] The attribute name.
	* @returns {string|null|Record<string, string|null>|undefined} The attribute value, all attributes, or `undefined` if no element matches.
	*/
	function getAttribute$1(selector, attribute) {
		const node = parseNode(selector);
		if (!node) return;
		if (attribute) return node.getAttribute(attribute);
		return Object.fromEntries(merge([], node.attributes).map((attribute) => [attribute.nodeName, attribute.nodeValue]));
	}
	/**
	* Gets dataset value(s) for the first node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {string} [key] The dataset key.
	* @returns {*|undefined} The dataset value, all dataset values, or `undefined` if no element matches.
	*/
	function getDataset$1(selector, key) {
		const node = parseNode(selector);
		if (!node) return;
		if (key) {
			key = camelCase(key);
			return parseDataset(node.dataset[key]);
		}
		return Object.fromEntries(Object.entries(node.dataset).map(([key, value]) => [key, parseDataset(value)]));
	}
	/**
	* Gets the HTML contents of the first node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @returns {string|undefined} The HTML contents, or `undefined` if no element matches.
	*/
	function getHTML$1(selector) {
		return getProperty$1(selector, "innerHTML");
	}
	/**
	* Gets a property value for the first node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {string} property The property name.
	* @returns {*|undefined} The property value, or `undefined` if no element matches.
	*/
	function getProperty$1(selector, property) {
		const node = parseNode(selector);
		if (!node) return;
		return node[property];
	}
	/**
	* Gets the text contents of the first node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @returns {string|null|undefined} The text contents, or `undefined` if no element matches.
	*/
	function getText$1(selector) {
		return getProperty$1(selector, "textContent");
	}
	/**
	* Gets the value property of the first node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @returns {*|undefined} The value, or `undefined` if no element matches.
	*/
	function getValue$1(selector) {
		return getProperty$1(selector, "value");
	}
	/**
	* Removes an attribute from each node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {string} attribute The attribute name.
	*/
	function removeAttribute$1(selector, attribute) {
		const nodes = parseNodes(selector);
		for (const node of nodes) node.removeAttribute(attribute);
	}
	/**
	* Removes a dataset value from each node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {string} key The dataset key.
	*/
	function removeDataset$1(selector, key) {
		const nodes = parseNodes(selector);
		for (const node of nodes) {
			key = camelCase(key);
			delete node.dataset[key];
		}
	}
	/**
	* Removes a property from each node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {string} property The property name.
	*/
	function removeProperty$1(selector, property) {
		const nodes = parseNodes(selector);
		for (const node of nodes) delete node[property];
	}
	/**
	* Sets an attribute value for each node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {string|AttributeValues} attribute The attribute name, or an object containing attributes.
	* @param {*} [value] The attribute value.
	*/
	function setAttribute$1(selector, attribute, value) {
		const nodes = parseNodes(selector);
		const attributes = parseData(attribute, value);
		for (const [key, value] of Object.entries(attributes)) for (const node of nodes) node.setAttribute(key, value);
	}
	/**
	* Sets a dataset value for each node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {string|Record<string, *>} key The dataset key, or an object containing dataset values.
	* @param {*} [value] The dataset value.
	*/
	function setDataset$1(selector, key, value) {
		const nodes = parseNodes(selector);
		const dataset = parseData(key, value, { json: true });
		for (let [key, value] of Object.entries(dataset)) {
			key = camelCase(key);
			for (const node of nodes) node.dataset[key] = value;
		}
	}
	/**
	* Sets the HTML contents of each node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {string} html The HTML contents.
	*/
	function setHTML$1(selector, html) {
		const nodes = parseNodes(selector);
		for (const node of nodes) {
			const childNodes = merge([], node.children);
			for (const child of childNodes) removeNode(child);
			if (node.shadowRoot) removeNode(node.shadowRoot);
			if (node.content) removeNode(node.content);
			node.innerHTML = html;
		}
	}
	/**
	* Sets a property value for each node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {string|Record<string, *>} property The property name, or an object containing properties.
	* @param {*} [value] The property value.
	*/
	function setProperty$1(selector, property, value) {
		const nodes = parseNodes(selector);
		const properties = parseData(property, value);
		for (const [key, value] of Object.entries(properties)) for (const node of nodes) node[key] = value;
	}
	/**
	* Sets the text contents of each node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {string} text The text contents.
	*/
	function setText$1(selector, text) {
		const nodes = parseNodes(selector);
		for (const node of nodes) {
			const childNodes = merge([], node.children);
			for (const child of childNodes) removeNode(child);
			if (node.shadowRoot) removeNode(node.shadowRoot);
			if (node.content) removeNode(node.content);
			node.textContent = text;
		}
	}
	/**
	* Sets the value property of each node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {string} value The value.
	*/
	function setValue$1(selector, value) {
		const nodes = parseNodes(selector);
		for (const node of nodes) node.value = value;
	}
	/** @import { QueryInput } from '../helpers.js'; */
	/**
	* Clones custom data from each node to each other node.
	* @param {QueryInput} selector The input node(s), or a query selector string.
	* @param {QueryInput} otherSelector The other node(s), or a query selector string.
	*/
	function cloneData$1(selector, otherSelector) {
		const nodes = parseNodes(selector, {
			fragment: true,
			shadow: true,
			document: true,
			window: true
		});
		const others = parseNodes(otherSelector, {
			fragment: true,
			shadow: true,
			document: true,
			window: true
		});
		for (const node of nodes) {
			if (!data.has(node)) continue;
			setData$1(others, { ...data.get(node) });
		}
	}
	/**
	* Gets custom data for the first node.
	* @param {QueryInput} selector The input node(s), or a query selector string.
	* @param {string} [key] The data key.
	* @returns {*|undefined} The data value, all custom data, or `undefined` if none exists.
	*/
	function getData$1(selector, key) {
		const node = parseNode(selector, {
			fragment: true,
			shadow: true,
			document: true,
			window: true
		});
		if (!node || !data.has(node)) return;
		const nodeData = data.get(node);
		return key ? nodeData[key] : nodeData;
	}
	/**
	* Removes custom data from each node.
	* @param {QueryInput} selector The input node(s), or a query selector string.
	* @param {string} [key] The data key.
	*/
	function removeData$1(selector, key) {
		const nodes = parseNodes(selector, {
			fragment: true,
			shadow: true,
			document: true,
			window: true
		});
		for (const node of nodes) {
			if (!data.has(node)) continue;
			const nodeData = data.get(node);
			if (key) delete nodeData[key];
			if (!key || !Object.keys(nodeData).length) data.delete(node);
		}
	}
	/**
	* Sets custom data for each node.
	* @param {QueryInput} selector The input node(s), or a query selector string.
	* @param {string|Record<string, *>} key The data key, or an object containing data.
	* @param {*} [value] The data value.
	*/
	function setData$1(selector, key, value) {
		const nodes = parseNodes(selector, {
			fragment: true,
			shadow: true,
			document: true,
			window: true
		});
		const newData = parseData(key, value);
		for (const node of nodes) {
			if (!data.has(node)) data.set(node, {});
			const nodeData = data.get(node);
			Object.assign(nodeData, newData);
		}
	}
	/** @import { ElementInput } from '../helpers.js'; */
	/** @typedef {Record<string, string|number>} StyleValues */
	/**
	* Adds classes to each node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {...string|string[]} classes The classes.
	*/
	function addClass$1(selector, ...classes) {
		const nodes = parseNodes(selector);
		classes = parseClasses(classes);
		if (!classes.length) return;
		for (const node of nodes) node.classList.add(...classes);
	}
	/**
	* Gets computed CSS style value(s) for the first node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {string} [style] The CSS style name.
	* @returns {string|Record<string, string>|undefined} The CSS style value, all computed styles, or `undefined` if no element matches.
	*/
	function css$1(selector, style) {
		const node = parseNode(selector);
		if (!node) return;
		if (!styles.has(node)) styles.set(node, getWindow().getComputedStyle(node));
		const nodeStyles = styles.get(node);
		if (!style) {
			const result = {};
			for (const property of nodeStyles) result[property] = nodeStyles.getPropertyValue(property);
			return result;
		}
		style = normalizeCssProperty(style);
		return nodeStyles.getPropertyValue(style);
	}
	/**
	* Gets style properties for the first node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {string} [style] The style name.
	* @returns {string|Record<string, string>|undefined} The style value, all inline styles, or `undefined` if no element matches.
	*/
	function getStyle$1(selector, style) {
		const node = parseNode(selector);
		if (!node) return;
		if (style) {
			style = normalizeCssProperty(style);
			return node.style.getPropertyValue(style);
		}
		const styles = {};
		for (const style of node.style) styles[style] = node.style.getPropertyValue(style);
		return styles;
	}
	/**
	* Hides each node from display.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	*/
	function hide$1(selector) {
		const nodes = parseNodes(selector);
		for (const node of nodes) node.style.setProperty("display", "none");
	}
	/**
	* Removes classes from each node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {...string|string[]} classes The classes.
	*/
	function removeClass$1(selector, ...classes) {
		const nodes = parseNodes(selector);
		classes = parseClasses(classes);
		if (!classes.length) return;
		for (const node of nodes) node.classList.remove(...classes);
	}
	/**
	* Removes a style property from each node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {string} style The style name.
	*/
	function removeStyle$1(selector, style) {
		const nodes = parseNodes(selector);
		style = normalizeCssProperty(style);
		for (const node of nodes) node.style.removeProperty(style);
	}
	/**
	* Sets style properties for each node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {string|StyleValues} style The style name, or an object containing styles.
	* @param {string|number} [value] The style value.
	* @param {{important?: boolean}} [options] The style options.
	*/
	function setStyle$1(selector, style, value, { important = false } = {}) {
		const nodes = parseNodes(selector);
		const styles = parseData(style, value);
		for (let [style, value] of Object.entries(styles)) {
			style = normalizeCssProperty(style);
			value = normalizeCssValue(style, value);
			for (const node of nodes) node.style.setProperty(style, value, important ? "important" : "");
		}
	}
	/**
	* Displays each hidden node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	*/
	function show$1(selector) {
		const nodes = parseNodes(selector);
		for (const node of nodes) node.style.setProperty("display", "");
	}
	/**
	* Toggles the visibility of each node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	*/
	function toggle$1(selector) {
		const nodes = parseNodes(selector);
		for (const node of nodes) node.style.setProperty("display", node.style.display === "none" ? "" : "none");
	}
	/**
	* Toggles classes for each node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {...string|string[]} classes The classes.
	*/
	function toggleClass$1(selector, ...classes) {
		const nodes = parseNodes(selector);
		classes = parseClasses(classes);
		if (!classes.length) return;
		for (const node of nodes) for (const className of classes) node.classList.toggle(className);
	}
	/** @import { ElementInput } from '../helpers.js'; */
	/**
	* @typedef {object} Coordinates
	* @property {number} x The X co-ordinate.
	* @property {number} y The Y co-ordinate.
	*/
	/**
	* @typedef {object} OffsetOptions
	* @property {boolean} [offset=false] Whether to offset from the top-left of the Document.
	*/
	/**
	* @typedef {OffsetOptions & {clamp?: boolean}} PercentOptions
	*/
	/**
	* Gets the X,Y co-ordinates for the center of the first node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {OffsetOptions} [options] The positioning options.
	* @returns {Coordinates|undefined} The center co-ordinates, or `undefined` if no element matches.
	*/
	function center$1(selector, { offset = false } = {}) {
		const nodeBox = rect$1(selector, { offset });
		if (!nodeBox) return;
		return {
			x: nodeBox.left + nodeBox.width / 2,
			y: nodeBox.top + nodeBox.height / 2
		};
	}
	/**
	* Constrains each node to a container node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {ElementInput} containerSelector The container node, or a query selector string.
	*/
	function constrain$1(selector, containerSelector) {
		const containerBox = rect$1(containerSelector);
		if (!containerBox) return;
		const nodes = parseNodes(selector);
		const context = getContext();
		const window = getWindow();
		const getScrollX = (_) => context.documentElement.scrollHeight > window.outerHeight;
		const getScrollY = (_) => context.documentElement.scrollWidth > window.outerWidth;
		const preScrollX = getScrollX();
		const preScrollY = getScrollY();
		for (const node of nodes) {
			let nodeBox = rect$1(node);
			let resized = false;
			if (nodeBox.height > containerBox.height) {
				node.style.setProperty("height", `${containerBox.height}px`);
				resized = true;
			}
			if (nodeBox.width > containerBox.width) {
				node.style.setProperty("width", `${containerBox.width}px`);
				resized = true;
			}
			if (resized) nodeBox = rect$1(node);
			let leftOffset;
			if (nodeBox.left - containerBox.left < 0) leftOffset = nodeBox.left - containerBox.left;
			else if (nodeBox.right - containerBox.right > 0) leftOffset = nodeBox.right - containerBox.right;
			if (leftOffset) {
				const oldLeft = css$1(node, "left");
				const trueLeft = oldLeft && oldLeft !== "auto" ? parseFloat(oldLeft) : 0;
				node.style.setProperty("left", `${trueLeft - leftOffset}px`);
			}
			let topOffset;
			if (nodeBox.top - containerBox.top < 0) topOffset = nodeBox.top - containerBox.top;
			else if (nodeBox.bottom - containerBox.bottom > 0) topOffset = nodeBox.bottom - containerBox.bottom;
			if (topOffset) {
				const oldTop = css$1(node, "top");
				const trueTop = oldTop && oldTop !== "auto" ? parseFloat(oldTop) : 0;
				node.style.setProperty("top", `${trueTop - topOffset}px`);
			}
			if (css$1(node, "position") === "static") node.style.setProperty("position", "relative");
		}
		const postScrollX = getScrollX();
		const postScrollY = getScrollY();
		if (preScrollX !== postScrollX || preScrollY !== postScrollY) constrain$1(nodes, containerSelector);
	}
	/**
	* Gets the distance of a node to an X,Y position in the Window.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {number} x The X co-ordinate.
	* @param {number} y The Y co-ordinate.
	* @param {OffsetOptions} [options] The positioning options.
	* @returns {number|undefined} The distance to the element, or `undefined` if no element matches.
	*/
	function distTo$1(selector, x, y, { offset = false } = {}) {
		const nodeCenter = center$1(selector, { offset });
		if (!nodeCenter) return;
		return dist(nodeCenter.x, nodeCenter.y, x, y);
	}
	/**
	* Gets the distance between two nodes.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {ElementInput} otherSelector The node to compare, or a query selector string.
	* @returns {number|undefined} The distance between the nodes, or `undefined` if either element does not match.
	*/
	function distToNode$1(selector, otherSelector) {
		const otherCenter = center$1(otherSelector);
		if (!otherCenter) return;
		return distTo$1(selector, otherCenter.x, otherCenter.y);
	}
	/**
	* Gets the nearest node to an X,Y position in the Window.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {number} x The X co-ordinate.
	* @param {number} y The Y co-ordinate.
	* @param {OffsetOptions} [options] The positioning options.
	* @returns {Element|undefined} The nearest element, or `undefined` if none matches.
	*/
	function nearestTo$1(selector, x, y, { offset = false } = {}) {
		let closest;
		let closestDistance = Number.MAX_VALUE;
		const nodes = parseNodes(selector);
		for (const node of nodes) {
			const dist = distTo$1(node, x, y, { offset });
			if (dist < closestDistance) {
				closestDistance = dist;
				closest = node;
			}
		}
		return closest;
	}
	/**
	* Gets the nearest node to another node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {ElementInput} otherSelector The node to compare, or a query selector string.
	* @returns {Element|undefined} The nearest element, or `undefined` if none matches.
	*/
	function nearestToNode$1(selector, otherSelector) {
		const otherCenter = center$1(otherSelector);
		if (!otherCenter) return;
		return nearestTo$1(selector, otherCenter.x, otherCenter.y);
	}
	/**
	* Gets the percentage of an X co-ordinate relative to a node's width.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {number} x The X co-ordinate.
	* @param {PercentOptions} [options] The percentage options.
	* @returns {number|undefined} The percentage, or `undefined` if no element matches.
	*/
	function percentX$1(selector, x, { offset = false, clamp = true } = {}) {
		const nodeBox = rect$1(selector, { offset });
		if (!nodeBox) return;
		const percent = (x - nodeBox.left) / nodeBox.width * 100;
		return clamp ? clampPercent(percent) : percent;
	}
	/**
	* Gets the percentage of a Y co-ordinate relative to a node's height.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {number} y The Y co-ordinate.
	* @param {PercentOptions} [options] The percentage options.
	* @returns {number|undefined} The percentage, or `undefined` if no element matches.
	*/
	function percentY$1(selector, y, { offset = false, clamp = true } = {}) {
		const nodeBox = rect$1(selector, { offset });
		if (!nodeBox) return;
		const percent = (y - nodeBox.top) / nodeBox.height * 100;
		return clamp ? clampPercent(percent) : percent;
	}
	/**
	* Gets the position of the first node relative to the Window or Document.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {OffsetOptions} [options] The positioning options.
	* @returns {Coordinates|undefined} The co-ordinates, or `undefined` if no element matches.
	*/
	function position$1(selector, { offset = false } = {}) {
		const node = parseNode(selector);
		if (!node) return;
		const result = {
			x: node.offsetLeft,
			y: node.offsetTop
		};
		if (offset) {
			let offsetParent = node;
			while (offsetParent = offsetParent.offsetParent) {
				result.x += offsetParent.offsetLeft;
				result.y += offsetParent.offsetTop;
			}
		}
		return result;
	}
	/**
	* Gets the computed bounding rectangle of the first node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {OffsetOptions} [options] The positioning options.
	* @returns {DOMRect|undefined} The computed bounding rectangle, or `undefined` if no element matches.
	*/
	function rect$1(selector, { offset = false } = {}) {
		const node = parseNode(selector);
		if (!node) return;
		const result = node.getBoundingClientRect();
		if (offset) {
			const window = getWindow();
			result.x += window.scrollX;
			result.y += window.scrollY;
		}
		return result;
	}
	/** @import { QueryInput } from '../helpers.js'; */
	/**
	* Gets the scroll X position of the first node.
	* @param {QueryInput} selector The input node(s), or a query selector string.
	* @returns {number|undefined} The scroll X position, or `undefined` if no node matches.
	*/
	function getScrollX$1(selector) {
		const node = parseNode(selector, {
			document: true,
			window: true
		});
		if (!node) return;
		if (isWindow(node)) return node.scrollX;
		if (isDocument(node)) return node.scrollingElement.scrollLeft;
		return node.scrollLeft;
	}
	/**
	* Gets the scroll Y position of the first node.
	* @param {QueryInput} selector The input node(s), or a query selector string.
	* @returns {number|undefined} The scroll Y position, or `undefined` if no node matches.
	*/
	function getScrollY$1(selector) {
		const node = parseNode(selector, {
			document: true,
			window: true
		});
		if (!node) return;
		if (isWindow(node)) return node.scrollY;
		if (isDocument(node)) return node.scrollingElement.scrollTop;
		return node.scrollTop;
	}
	/**
	* Scrolls each node to an X,Y position.
	* @param {QueryInput} selector The input node(s), or a query selector string.
	* @param {number} x The scroll X position.
	* @param {number} y The scroll Y position.
	*/
	function setScroll$1(selector, x, y) {
		const nodes = parseNodes(selector, {
			document: true,
			window: true
		});
		for (const node of nodes) if (isWindow(node)) node.scroll(x, y);
		else if (isDocument(node)) {
			node.scrollingElement.scrollLeft = x;
			node.scrollingElement.scrollTop = y;
		} else {
			node.scrollLeft = x;
			node.scrollTop = y;
		}
	}
	/**
	* Scrolls each node to an X position.
	* @param {QueryInput} selector The input node(s), or a query selector string.
	* @param {number} x The scroll X position.
	*/
	function setScrollX$1(selector, x) {
		const nodes = parseNodes(selector, {
			document: true,
			window: true
		});
		for (const node of nodes) if (isWindow(node)) node.scroll(x, node.scrollY);
		else if (isDocument(node)) node.scrollingElement.scrollLeft = x;
		else node.scrollLeft = x;
	}
	/**
	* Scrolls each node to a Y position.
	* @param {QueryInput} selector The input node(s), or a query selector string.
	* @param {number} y The scroll Y position.
	*/
	function setScrollY$1(selector, y) {
		const nodes = parseNodes(selector, {
			document: true,
			window: true
		});
		for (const node of nodes) if (isWindow(node)) node.scroll(node.scrollX, y);
		else if (isDocument(node)) node.scrollingElement.scrollTop = y;
		else node.scrollTop = y;
	}
	/** @import { QueryInput } from '../helpers.js'; */
	/**
	* @typedef {object} SizeOptions
	* @property {number} [boxSize=PADDING_BOX] The box sizing to calculate.
	* @property {boolean} [outer=false] Whether to use the Window outer dimension.
	*/
	/**
	* Gets the computed height of the first node.
	* @param {QueryInput} selector The input node(s), or a query selector string.
	* @param {SizeOptions} [options] The sizing options.
	* @returns {number|undefined} The height, or `undefined` if no node matches.
	*/
	function height$1(selector, { boxSize = 1, outer = false } = {}) {
		let node = parseNode(selector, {
			document: true,
			window: true
		});
		if (!node) return;
		if (isWindow(node)) return outer ? node.outerHeight : node.innerHeight;
		if (isDocument(node)) node = node.documentElement;
		if (boxSize >= 4) return node.scrollHeight;
		let result = node.clientHeight;
		if (boxSize <= 0) {
			result -= parseInt(css$1(node, "padding-top"));
			result -= parseInt(css$1(node, "padding-bottom"));
		}
		if (boxSize >= 2) {
			result += parseInt(css$1(node, "border-top-width"));
			result += parseInt(css$1(node, "border-bottom-width"));
		}
		if (boxSize >= 3) {
			result += parseInt(css$1(node, "margin-top"));
			result += parseInt(css$1(node, "margin-bottom"));
		}
		return result;
	}
	/**
	* Gets the computed width of the first node.
	* @param {QueryInput} selector The input node(s), or a query selector string.
	* @param {SizeOptions} [options] The sizing options.
	* @returns {number|undefined} The width, or `undefined` if no node matches.
	*/
	function width$1(selector, { boxSize = 1, outer = false } = {}) {
		let node = parseNode(selector, {
			document: true,
			window: true
		});
		if (!node) return;
		if (isWindow(node)) return outer ? node.outerWidth : node.innerWidth;
		if (isDocument(node)) node = node.documentElement;
		if (boxSize >= 4) return node.scrollWidth;
		let result = node.clientWidth;
		if (boxSize <= 0) {
			result -= parseInt(css$1(node, "padding-left"));
			result -= parseInt(css$1(node, "padding-right"));
		}
		if (boxSize >= 2) {
			result += parseInt(css$1(node, "border-left-width"));
			result += parseInt(css$1(node, "border-right-width"));
		}
		if (boxSize >= 3) {
			result += parseInt(css$1(node, "margin-left"));
			result += parseInt(css$1(node, "margin-right"));
		}
		return result;
	}
	/**
	* Gets a cookie value.
	* @param {string} name The cookie name.
	* @returns {string|null} The cookie value, or `null` if it does not exist.
	*/
	function getCookie(name) {
		const prefix = `${name}=`;
		const cookie = getContext().cookie.split(";").find((cookie) => cookie.trimStart().startsWith(prefix));
		if (!cookie) return null;
		return decodeURIComponent(cookie.trimStart().substring(prefix.length));
	}
	/**
	* Removes a cookie.
	* @param {string} name The cookie name.
	* @param {{path?: string, secure?: boolean}} [options] The cookie options.
	*/
	function removeCookie(name, { path = null, secure = false } = {}) {
		if (!name) return;
		let cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC`;
		if (path) cookie += `;path=${path}`;
		if (secure) cookie += ";secure";
		getContext().cookie = cookie;
	}
	/**
	* Sets a cookie value.
	* @param {string} name The cookie name.
	* @param {*} value The cookie value.
	* @param {{expires?: number, path?: string, secure?: boolean}} [options] The cookie options.
	*/
	function setCookie(name, value, { expires = null, path = null, secure = false } = {}) {
		if (!name) return;
		let cookie = `${name}=${encodeURIComponent(value)}`;
		if (expires) {
			const date = /* @__PURE__ */ new Date();
			date.setTime(date.getTime() + expires * 1e3);
			cookie += `;expires=${date.toUTCString()}`;
		}
		if (path) cookie += `;path=${path}`;
		if (secure) cookie += ";secure";
		getContext().cookie = cookie;
	}
	/** @import { EventCallback } from './event-handlers.js'; */
	/**
	* Returns a wrapped mouse drag event (optionally debounced).
	* @param {EventCallback} down The callback to execute on mousedown.
	* @param {EventCallback} move The callback to execute on mousemove.
	* @param {EventCallback} up The callback to execute on mouseup.
	* @param {{debounce?: boolean, passive?: boolean, preventDefault?: boolean, touches?: number}} [options] The mouse drag options.
	* @returns {EventCallback} The mouse drag event callback.
	*/
	function mouseDragFactory(down, move, up, { debounce: debounce$1 = true, passive = true, preventDefault = true, touches = 1 } = {}) {
		if (move && debounce$1) {
			move = debounce(move);
			if (up) up = debounce(up);
		}
		return (event) => {
			const isTouch = event.type === "touchstart";
			if (isTouch && event.touches.length !== touches) return;
			if (down && down(event) === false) return;
			if (preventDefault) event.preventDefault();
			if (!move && !up) return;
			const window = getWindow();
			const [moveEvent, upEvent] = event.type in eventLookup ? eventLookup[event.type] : eventLookup.mousedown;
			const realMove = (event) => {
				if (isTouch && event.touches.length !== touches) return;
				if (preventDefault && !passive) event.preventDefault();
				if (!move) return;
				move(event);
			};
			const realUp = (event) => {
				if (isTouch && event.touches.length !== touches - 1) return;
				if (up && up(event) === false) return;
				if (preventDefault) event.preventDefault();
				removeEvent$1(window, moveEvent, realMove);
				removeEvent$1(window, upEvent, realUp);
			};
			addEvent$1(window, moveEvent, realMove, { passive });
			addEvent$1(window, upEvent, realUp);
		};
	}
	/** @import { ElementInput } from '../helpers.js'; */
	/** @import { EventCallback } from './event-handlers.js'; */
	/**
	* Triggers a blur event on the first node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	*/
	function blur$1(selector) {
		const node = parseNode(selector);
		if (!node) return;
		node.blur();
	}
	/**
	* Triggers a click event on the first node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	*/
	function click$1(selector) {
		const node = parseNode(selector);
		if (!node) return;
		node.click();
	}
	/**
	* Triggers a focus event on the first node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	*/
	function focus$1(selector) {
		const node = parseNode(selector);
		if (!node) return;
		node.focus();
	}
	/**
	* Adds a function to the ready queue.
	* @param {EventCallback} callback The callback to execute.
	*/
	function ready(callback) {
		if (getContext().readyState !== "loading") callback();
		else getWindow().addEventListener("DOMContentLoaded", callback, { once: true });
	}
	var _$;
	var fQuery;
	/**
	* Resets the global $ variable.
	*/
	function noConflict() {
		const window = getWindow();
		if (fQuery && window.$ === fQuery) window.$ = _$;
	}
	/**
	* Registers the global variables.
	* @param {Window} window The window.
	* @param {Document} [document] The document.
	* @param {Function} query The fQuery function.
	* @returns {Function} The fQuery function.
	*/
	function registerGlobals(window, document, query) {
		fQuery = query;
		setWindow(window);
		setContext(document || window.document);
		_$ = window.$;
		window.$ = fQuery;
		return fQuery;
	}
	/** @import { NodeInput } from '../helpers.js'; */
	/**
	* Inserts each other node after each node.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @param {NodeInput} otherSelector The other node(s), or a query selector or HTML string.
	*/
	function after$1(selector, otherSelector) {
		const nodes = parseNodes(selector, { node: true });
		const others = parseNodes(otherSelector, {
			node: true,
			fragment: true,
			html: true
		}).reverse();
		for (const [i, node] of nodes.entries()) {
			const parent = node.parentNode;
			if (!parent) continue;
			let clones;
			if (i === nodes.length - 1) clones = others;
			else clones = clone$1(others, {
				events: true,
				data: true,
				animations: true
			});
			for (const clone of clones) parent.insertBefore(clone, node.nextSibling);
		}
	}
	/**
	* Appends each other node to each node.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @param {NodeInput} otherSelector The other node(s), or a query selector or HTML string.
	*/
	function append$1(selector, otherSelector) {
		const nodes = parseNodes(selector, {
			fragment: true,
			shadow: true,
			document: true
		});
		const others = parseNodes(otherSelector, {
			node: true,
			fragment: true,
			html: true
		});
		for (const [i, node] of nodes.entries()) {
			let clones;
			if (i === nodes.length - 1) clones = others;
			else clones = clone$1(others, {
				events: true,
				data: true,
				animations: true
			});
			for (const clone of clones) node.insertBefore(clone, null);
		}
	}
	/**
	* Appends each node to each other node.
	* @param {NodeInput} selector The input node(s), or a query selector or HTML string.
	* @param {NodeInput} otherSelector The other node(s), or a query selector string.
	*/
	function appendTo$1(selector, otherSelector) {
		append$1(otherSelector, selector);
	}
	/**
	* Inserts each other node before each node.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @param {NodeInput} otherSelector The other node(s), or a query selector or HTML string.
	*/
	function before$1(selector, otherSelector) {
		const nodes = parseNodes(selector, { node: true });
		const others = parseNodes(otherSelector, {
			node: true,
			fragment: true,
			html: true
		});
		for (const [i, node] of nodes.entries()) {
			const parent = node.parentNode;
			if (!parent) continue;
			let clones;
			if (i === nodes.length - 1) clones = others;
			else clones = clone$1(others, {
				events: true,
				data: true,
				animations: true
			});
			for (const clone of clones) parent.insertBefore(clone, node);
		}
	}
	/**
	* Inserts each node after each other node.
	* @param {NodeInput} selector The input node(s), or a query selector or HTML string.
	* @param {NodeInput} otherSelector The other node(s), or a query selector string.
	*/
	function insertAfter$1(selector, otherSelector) {
		after$1(otherSelector, selector);
	}
	/**
	* Inserts each node before each other node.
	* @param {NodeInput} selector The input node(s), or a query selector or HTML string.
	* @param {NodeInput} otherSelector The other node(s), or a query selector string.
	*/
	function insertBefore$1(selector, otherSelector) {
		before$1(otherSelector, selector);
	}
	/**
	* Prepends each other node to each node.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @param {NodeInput} otherSelector The other node(s), or a query selector or HTML string.
	*/
	function prepend$1(selector, otherSelector) {
		const nodes = parseNodes(selector, {
			fragment: true,
			shadow: true,
			document: true
		});
		const others = parseNodes(otherSelector, {
			node: true,
			fragment: true,
			html: true
		});
		for (const [i, node] of nodes.entries()) {
			const firstChild = node.firstChild;
			let clones;
			if (i === nodes.length - 1) clones = others;
			else clones = clone$1(others, {
				events: true,
				data: true,
				animations: true
			});
			for (const clone of clones) node.insertBefore(clone, firstChild);
		}
	}
	/**
	* Prepends each node to each other node.
	* @param {NodeInput} selector The input node(s), or a query selector or HTML string.
	* @param {NodeInput} otherSelector The other node(s), or a query selector string.
	*/
	function prependTo$1(selector, otherSelector) {
		prepend$1(otherSelector, selector);
	}
	/** @import { NodeFilterInput } from '../filters.js'; */
	/** @import { NodeInput } from '../helpers.js'; */
	/**
	* Unwraps each node.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	*/
	function unwrap$1(selector, nodeFilter) {
		const nodes = parseNodes(selector, { node: true });
		nodeFilter = parseFilter(nodeFilter);
		const parents = [];
		for (const node of nodes) {
			const parent = node.parentNode;
			if (!parent) continue;
			if (parents.includes(parent)) continue;
			if (!nodeFilter(parent)) continue;
			parents.push(parent);
		}
		for (const parent of parents) {
			const outerParent = parent.parentNode;
			if (!outerParent) continue;
			const children = merge([], parent.childNodes);
			for (const child of children) outerParent.insertBefore(child, parent);
		}
		remove$1(parents);
	}
	/**
	* Wraps each nodes with other nodes.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @param {NodeInput} otherSelector The other node(s), or a query selector or HTML string.
	*/
	function wrap$2(selector, otherSelector) {
		const nodes = parseNodes(selector, { node: true });
		const others = parseNodes(otherSelector, {
			fragment: true,
			html: true
		});
		for (const node of nodes) {
			const parent = node.parentNode;
			if (!parent) continue;
			const clones = clone$1(others, {
				events: true,
				data: true,
				animations: true
			});
			const firstClone = clones.slice().shift();
			const firstCloneNode = isFragment(firstClone) ? firstClone.firstChild : firstClone;
			const deepest = merge([], firstCloneNode.querySelectorAll("*")).find((node) => !node.childElementCount) || firstCloneNode;
			for (const clone of clones) parent.insertBefore(clone, node);
			deepest.insertBefore(node, null);
		}
	}
	/**
	* Wraps all nodes with other nodes.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @param {NodeInput} otherSelector The other node(s), or a query selector or HTML string.
	*/
	function wrapAll$1(selector, otherSelector) {
		const nodes = parseNodes(selector, { node: true });
		const clones = clone$1(parseNodes(otherSelector, {
			fragment: true,
			html: true
		}), {
			events: true,
			data: true,
			animations: true
		});
		const firstNode = nodes[0];
		if (!firstNode) return;
		const parent = firstNode.parentNode;
		if (!parent) return;
		const firstClone = clones[0];
		const firstCloneNode = isFragment(firstClone) ? firstClone.firstChild : firstClone;
		const deepest = merge([], firstCloneNode.querySelectorAll("*")).find((node) => !node.childElementCount) || firstCloneNode;
		for (const clone of clones) parent.insertBefore(clone, firstNode);
		for (const node of nodes) deepest.insertBefore(node, null);
	}
	/**
	* Wraps the contents of each node with other nodes.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @param {NodeInput} otherSelector The other node(s), or a query selector or HTML string.
	*/
	function wrapInner$1(selector, otherSelector) {
		const nodes = parseNodes(selector, {
			node: true,
			fragment: true,
			shadow: true
		});
		const others = parseNodes(otherSelector, {
			fragment: true,
			html: true
		});
		for (const node of nodes) {
			const children = merge([], node.childNodes);
			const clones = clone$1(others, {
				events: true,
				data: true,
				animations: true
			});
			const firstClone = clones.slice().shift();
			const firstCloneNode = isFragment(firstClone) ? firstClone.firstChild : firstClone;
			const deepest = merge([], firstCloneNode.querySelectorAll("*")).find((node) => !node.childElementCount) || firstCloneNode;
			for (const clone of clones) node.insertBefore(clone, null);
			for (const child of children) deepest.insertBefore(child, null);
		}
	}
	/** @import { AnimationCallback } from '../../animation/animation.js'; */
	/** @import QuerySet from '../query-set.js'; */
	/** @import { QueuedAnimationOptions } from '../../animation/animation.js'; */
	/** @import { StopAnimationOptions } from '../../animation/animation.js'; */
	/**
	* Adds an animation to the queue for each node.
	* @param {AnimationCallback} callback The animation callback.
	* @param {QueuedAnimationOptions} [options] The queued animation options.
	* @returns {QuerySet} The QuerySet object.
	*/
	function animate(callback, { queueName = "default", ...options } = {}) {
		return this.queue((node) => animate$1(node, callback, options), { queueName });
	}
	/**
	* Stops all animations and clears the queue of each node.
	* @param {StopAnimationOptions} [options] The stopping options.
	* @returns {QuerySet} The QuerySet object.
	*/
	function stop({ finish = true } = {}) {
		this.clearQueue();
		stop$1(this, { finish });
		return this;
	}
	/** @import QuerySet from '../query-set.js'; */
	/** @import { QueuedAnimationOptions } from '../../animation/animation.js'; */
	/**
	* Adds a drop in animation to the queue for each node.
	* @param {QueuedAnimationOptions} [options] The queued animation options.
	* @returns {QuerySet} The QuerySet object.
	*/
	function dropIn({ queueName = "default", ...options } = {}) {
		return this.queue((node) => dropIn$1(node, options), { queueName });
	}
	/**
	* Adds a drop out animation to the queue for each node.
	* @param {QueuedAnimationOptions} [options] The queued animation options.
	* @returns {QuerySet} The QuerySet object.
	*/
	function dropOut({ queueName = "default", ...options } = {}) {
		return this.queue((node) => dropOut$1(node, options), { queueName });
	}
	/**
	* Adds a fade in animation to the queue for each node.
	* @param {QueuedAnimationOptions} [options] The queued animation options.
	* @returns {QuerySet} The QuerySet object.
	*/
	function fadeIn({ queueName = "default", ...options } = {}) {
		return this.queue((node) => fadeIn$1(node, options), { queueName });
	}
	/**
	* Adds a fade out animation to the queue for each node.
	* @param {QueuedAnimationOptions} [options] The queued animation options.
	* @returns {QuerySet} The QuerySet object.
	*/
	function fadeOut({ queueName = "default", ...options } = {}) {
		return this.queue((node) => fadeOut$1(node, options), { queueName });
	}
	/**
	* Adds a rotate in animation to the queue for each node.
	* @param {QueuedAnimationOptions} [options] The queued animation options.
	* @returns {QuerySet} The QuerySet object.
	*/
	function rotateIn({ queueName = "default", ...options } = {}) {
		return this.queue((node) => rotateIn$1(node, options), { queueName });
	}
	/**
	* Adds a rotate out animation to the queue for each node.
	* @param {QueuedAnimationOptions} [options] The queued animation options.
	* @returns {QuerySet} The QuerySet object.
	*/
	function rotateOut({ queueName = "default", ...options } = {}) {
		return this.queue((node) => rotateOut$1(node, options), { queueName });
	}
	/**
	* Adds a slide in animation to the queue for each node.
	* @param {QueuedAnimationOptions} [options] The queued animation options.
	* @returns {QuerySet} The QuerySet object.
	*/
	function slideIn({ queueName = "default", ...options } = {}) {
		return this.queue((node) => slideIn$1(node, options), { queueName });
	}
	/**
	* Adds a slide out animation to the queue for each node.
	* @param {QueuedAnimationOptions} [options] The queued animation options.
	* @returns {QuerySet} The QuerySet object.
	*/
	function slideOut({ queueName = "default", ...options } = {}) {
		return this.queue((node) => slideOut$1(node, options), { queueName });
	}
	/**
	* Adds a squeeze in animation to the queue for each node.
	* @param {QueuedAnimationOptions} [options] The queued animation options.
	* @returns {QuerySet} The QuerySet object.
	*/
	function squeezeIn({ queueName = "default", ...options } = {}) {
		return this.queue((node) => squeezeIn$1(node, options), { queueName });
	}
	/**
	* Adds a squeeze out animation to the queue for each node.
	* @param {QueuedAnimationOptions} [options] The queued animation options.
	* @returns {QuerySet} The QuerySet object.
	*/
	function squeezeOut({ queueName = "default", ...options } = {}) {
		return this.queue((node) => squeezeOut$1(node, options), { queueName });
	}
	/** @import { AttributeValues } from '../../attributes/attributes.js'; */
	/** @import QuerySet from '../query-set.js'; */
	/**
	* Gets attribute value(s) for the first node.
	* @param {string} [attribute] The attribute name.
	* @returns {string|null|Record<string, string|null>|undefined} The attribute value, all attributes, or `undefined` if no element matches.
	*/
	function getAttribute(attribute) {
		return getAttribute$1(this, attribute);
	}
	/**
	* Gets dataset value(s) for the first node.
	* @param {string} [key] The dataset key.
	* @returns {*|undefined} The dataset value, all dataset values, or `undefined` if no element matches.
	*/
	function getDataset$2(key) {
		return getDataset$1(this, key);
	}
	/**
	* Gets the HTML contents of the first node.
	* @returns {string|undefined} The HTML contents, or `undefined` if no element matches.
	*/
	function getHTML() {
		return getHTML$1(this);
	}
	/**
	* Gets a property value for the first node.
	* @param {string} property The property name.
	* @returns {*|undefined} The property value, or `undefined` if no element matches.
	*/
	function getProperty(property) {
		return getProperty$1(this, property);
	}
	/**
	* Gets the text contents of the first node.
	* @returns {string|null|undefined} The text contents, or `undefined` if no element matches.
	*/
	function getText() {
		return getText$1(this);
	}
	/**
	* Gets the value property of the first node.
	* @returns {*|undefined} The value, or `undefined` if no element matches.
	*/
	function getValue() {
		return getValue$1(this);
	}
	/**
	* Removes an attribute from each node.
	* @param {string} attribute The attribute name.
	* @returns {QuerySet} The QuerySet object.
	*/
	function removeAttribute(attribute) {
		removeAttribute$1(this, attribute);
		return this;
	}
	/**
	* Removes a dataset value from each node.
	* @param {string} key The dataset key.
	* @returns {QuerySet} The QuerySet object.
	*/
	function removeDataset(key) {
		removeDataset$1(this, key);
		return this;
	}
	/**
	* Removes a property from each node.
	* @param {string} property The property name.
	* @returns {QuerySet} The QuerySet object.
	*/
	function removeProperty(property) {
		removeProperty$1(this, property);
		return this;
	}
	/**
	* Sets an attribute value for each node.
	* @param {string|AttributeValues} attribute The attribute name, or an object containing attributes.
	* @param {*} [value] The attribute value.
	* @returns {QuerySet} The QuerySet object.
	*/
	function setAttribute(attribute, value) {
		setAttribute$1(this, attribute, value);
		return this;
	}
	/**
	* Sets a dataset value for each node.
	* @param {string|Record<string, *>} key The dataset key, or an object containing dataset values.
	* @param {*} [value] The dataset value.
	* @returns {QuerySet} The QuerySet object.
	*/
	function setDataset(key, value) {
		setDataset$1(this, key, value);
		return this;
	}
	/**
	* Sets the HTML contents of each node.
	* @param {string} html The HTML contents.
	* @returns {QuerySet} The QuerySet object.
	*/
	function setHTML(html) {
		setHTML$1(this, html);
		return this;
	}
	/**
	* Sets a property value for each node.
	* @param {string|Record<string, *>} property The property name, or an object containing properties.
	* @param {*} [value] The property value.
	* @returns {QuerySet} The QuerySet object.
	*/
	function setProperty(property, value) {
		setProperty$1(this, property, value);
		return this;
	}
	/**
	* Sets the text contents of each node.
	* @param {string} text The text contents.
	* @returns {QuerySet} The QuerySet object.
	*/
	function setText(text) {
		setText$1(this, text);
		return this;
	}
	/**
	* Sets the value property of each node.
	* @param {string} value The value.
	* @returns {QuerySet} The QuerySet object.
	*/
	function setValue(value) {
		setValue$1(this, value);
		return this;
	}
	/** @import { QueryInput } from '../../helpers.js'; */
	/** @import QuerySet from '../query-set.js'; */
	/**
	* Clones custom data from each node to each other node.
	* @param {QueryInput} otherSelector The other node(s), or a query selector string.
	* @returns {QuerySet} The QuerySet object.
	*/
	function cloneData(otherSelector) {
		cloneData$1(this, otherSelector);
		return this;
	}
	/**
	* Gets custom data for the first node.
	* @param {string} [key] The data key.
	* @returns {*|undefined} The data value, all custom data, or `undefined` if none exists.
	*/
	function getData(key) {
		return getData$1(this, key);
	}
	/**
	* Removes custom data from each node.
	* @param {string} [key] The data key.
	* @returns {QuerySet} The QuerySet object.
	*/
	function removeData(key) {
		removeData$1(this, key);
		return this;
	}
	/**
	* Sets custom data for each node.
	* @param {string|Record<string, *>} key The data key, or an object containing data.
	* @param {*} [value] The data value.
	* @returns {QuerySet} The QuerySet object.
	*/
	function setData(key, value) {
		setData$1(this, key, value);
		return this;
	}
	/** @import { Coordinates } from '../../attributes/position.js'; */
	/** @import { ElementInput } from '../../helpers.js'; */
	/** @import { OffsetOptions } from '../../attributes/position.js'; */
	/** @import { PercentOptions } from '../../attributes/position.js'; */
	/**
	* Gets the X,Y co-ordinates for the center of the first node.
	* @param {OffsetOptions} [options] The positioning options.
	* @returns {Coordinates|undefined} The center co-ordinates, or `undefined` if no element matches.
	*/
	function center({ offset = false } = {}) {
		return center$1(this, { offset });
	}
	/**
	* Constrains each node to a container node.
	* @param {ElementInput} container The container node, or a query selector string.
	* @returns {QuerySet} The QuerySet object.
	*/
	function constrain(container) {
		constrain$1(this, container);
		return this;
	}
	/**
	* Gets the distance of a node to an X,Y position in the Window.
	* @param {number} x The X co-ordinate.
	* @param {number} y The Y co-ordinate.
	* @param {OffsetOptions} [options] The positioning options.
	* @returns {number|undefined} The distance to the node, or `undefined` if no element matches.
	*/
	function distTo(x, y, { offset = false } = {}) {
		return distTo$1(this, x, y, { offset });
	}
	/**
	* Gets the distance between two nodes.
	* @param {ElementInput} otherSelector The node to compare, or a query selector string.
	* @returns {number|undefined} The distance between the nodes, or `undefined` if either element does not match.
	*/
	function distToNode(otherSelector) {
		return distToNode$1(this, otherSelector);
	}
	/**
	* Gets the nearest node to an X,Y position in the Window.
	* @param {number} x The X co-ordinate.
	* @param {number} y The Y co-ordinate.
	* @param {OffsetOptions} [options] The positioning options.
	* @returns {QuerySet} A new QuerySet object.
	*/
	function nearestTo(x, y, { offset = false } = {}) {
		const node = nearestTo$1(this, x, y, { offset });
		return new QuerySet(node ? [node] : []);
	}
	/**
	* Gets the nearest node to another node.
	* @param {ElementInput} otherSelector The node to compare, or a query selector string.
	* @returns {QuerySet} A new QuerySet object.
	*/
	function nearestToNode(otherSelector) {
		const node = nearestToNode$1(this, otherSelector);
		return new QuerySet(node ? [node] : []);
	}
	/**
	* Gets the percentage of an X co-ordinate relative to a node's width.
	* @param {number} x The X co-ordinate.
	* @param {PercentOptions} [options] The percentage options.
	* @returns {number|undefined} The percentage, or `undefined` if no element matches.
	*/
	function percentX(x, { offset = false, clamp = true } = {}) {
		return percentX$1(this, x, {
			offset,
			clamp
		});
	}
	/**
	* Gets the percentage of a Y co-ordinate relative to a node's height.
	* @param {number} y The Y co-ordinate.
	* @param {PercentOptions} [options] The percentage options.
	* @returns {number|undefined} The percentage, or `undefined` if no element matches.
	*/
	function percentY(y, { offset = false, clamp = true } = {}) {
		return percentY$1(this, y, {
			offset,
			clamp
		});
	}
	/**
	* Gets the position of the first node relative to the Window or Document.
	* @param {OffsetOptions} [options] The positioning options.
	* @returns {Coordinates|undefined} The co-ordinates, or `undefined` if no element matches.
	*/
	function position({ offset = false } = {}) {
		return position$1(this, { offset });
	}
	/**
	* Gets the computed bounding rectangle of the first node.
	* @param {OffsetOptions} [options] The positioning options.
	* @returns {DOMRect|undefined} The computed bounding rectangle, or `undefined` if no element matches.
	*/
	function rect({ offset = false } = {}) {
		return rect$1(this, { offset });
	}
	/** @import QuerySet from '../query-set.js'; */
	/**
	* Gets the scroll X position of the first node.
	* @returns {number|undefined} The scroll X position, or `undefined` if no node matches.
	*/
	function getScrollX() {
		return getScrollX$1(this);
	}
	/**
	* Gets the scroll Y position of the first node.
	* @returns {number|undefined} The scroll Y position, or `undefined` if no node matches.
	*/
	function getScrollY() {
		return getScrollY$1(this);
	}
	/**
	* Scrolls each node to an X,Y position.
	* @param {number} x The scroll X position.
	* @param {number} y The scroll Y position.
	* @returns {QuerySet} The QuerySet object.
	*/
	function setScroll(x, y) {
		setScroll$1(this, x, y);
		return this;
	}
	/**
	* Scrolls each node to an X position.
	* @param {number} x The scroll X position.
	* @returns {QuerySet} The QuerySet object.
	*/
	function setScrollX(x) {
		setScrollX$1(this, x);
		return this;
	}
	/**
	* Scrolls each node to a Y position.
	* @param {number} y The scroll Y position.
	* @returns {QuerySet} The QuerySet object.
	*/
	function setScrollY(y) {
		setScrollY$1(this, y);
		return this;
	}
	/** @import { SizeOptions } from '../../attributes/size.js'; */
	/**
	* Gets the computed height of the first node.
	* @param {SizeOptions} [options] The sizing options.
	* @returns {number|undefined} The height, or `undefined` if no node matches.
	*/
	function height({ boxSize = 1, outer = false } = {}) {
		return height$1(this, {
			boxSize,
			outer
		});
	}
	/**
	* Gets the computed width of the first node.
	* @param {SizeOptions} [options] The sizing options.
	* @returns {number|undefined} The width, or `undefined` if no node matches.
	*/
	function width({ boxSize = 1, outer = false } = {}) {
		return width$1(this, {
			boxSize,
			outer
		});
	}
	/** @import QuerySet from '../query-set.js'; */
	/** @import { StyleValues } from '../../attributes/styles.js'; */
	/**
	* Adds classes to each node.
	* @param {...string|string[]} classes The classes.
	* @returns {QuerySet} The QuerySet object.
	*/
	function addClass(...classes) {
		addClass$1(this, ...classes);
		return this;
	}
	/**
	* Gets computed CSS style values for the first node.
	* @param {string} [style] The CSS style name.
	* @returns {string|Record<string, string>|undefined} The CSS style value, all computed styles, or `undefined` if no element matches.
	*/
	function css(style) {
		return css$1(this, style);
	}
	/**
	* Gets style properties for the first node.
	* @param {string} [style] The style name.
	* @returns {string|Record<string, string>|undefined} The style value, all inline styles, or `undefined` if no element matches.
	*/
	function getStyle(style) {
		return getStyle$1(this, style);
	}
	/**
	* Hides each node from display.
	* @returns {QuerySet} The QuerySet object.
	*/
	function hide() {
		hide$1(this);
		return this;
	}
	/**
	* Removes classes from each node.
	* @param {...string|string[]} classes The classes.
	* @returns {QuerySet} The QuerySet object.
	*/
	function removeClass(...classes) {
		removeClass$1(this, ...classes);
		return this;
	}
	/**
	* Removes a style property from each node.
	* @param {string} style The style name.
	* @returns {QuerySet} The QuerySet object.
	*/
	function removeStyle(style) {
		removeStyle$1(this, style);
		return this;
	}
	/**
	* Sets style properties for each node.
	* @param {string|StyleValues} style The style name, or an object containing styles.
	* @param {string|number} [value] The style value.
	* @param {{important?: boolean}} [options] The style options.
	* @returns {QuerySet} The QuerySet object.
	*/
	function setStyle(style, value, { important = false } = {}) {
		setStyle$1(this, style, value, { important });
		return this;
	}
	/**
	* Displays each hidden node.
	* @returns {QuerySet} The QuerySet object.
	*/
	function show() {
		show$1(this);
		return this;
	}
	/**
	* Toggles the visibility of each node.
	* @returns {QuerySet} The QuerySet object.
	*/
	function toggle() {
		toggle$1(this);
		return this;
	}
	/**
	* Toggles classes for each node.
	* @param {...string|string[]} classes The classes.
	* @returns {QuerySet} The QuerySet object.
	*/
	function toggleClass(...classes) {
		toggleClass$1(this, ...classes);
		return this;
	}
	/** @import { EventCallback } from '../../events/event-handlers.js'; */
	/** @import { EventOptions } from '../../events/event-handlers.js'; */
	/** @import { EventTargetInput } from '../../events/event-handlers.js'; */
	/** @import QuerySet from '../query-set.js'; */
	/** @import { RemoveEventOptions } from '../../events/event-handlers.js'; */
	/** @import { TriggerEventOptions } from '../../events/event-handlers.js'; */
	/**
	* Adds an event to each node.
	* @param {string} events The event names.
	* @param {EventCallback} callback The callback to execute.
	* @param {EventOptions} [options] The event options.
	* @returns {QuerySet} The QuerySet object.
	*/
	function addEvent(events, callback, { capture = false, passive = false } = {}) {
		addEvent$1(this, events, callback, {
			capture,
			passive
		});
		return this;
	}
	/**
	* Adds a delegated event to each node.
	* @param {string} events The event names.
	* @param {string} delegate The delegate selector.
	* @param {EventCallback} callback The callback to execute.
	* @param {EventOptions} [options] The event options.
	* @returns {QuerySet} The QuerySet object.
	*/
	function addEventDelegate(events, delegate, callback, { capture = false, passive = false } = {}) {
		addEventDelegate$1(this, events, delegate, callback, {
			capture,
			passive
		});
		return this;
	}
	/**
	* Adds a self-destructing delegated event to each node.
	* @param {string} events The event names.
	* @param {string} delegate The delegate selector.
	* @param {EventCallback} callback The callback to execute.
	* @param {EventOptions} [options] The event options.
	* @returns {QuerySet} The QuerySet object.
	*/
	function addEventDelegateOnce(events, delegate, callback, { capture = false, passive = false } = {}) {
		addEventDelegateOnce$1(this, events, delegate, callback, {
			capture,
			passive
		});
		return this;
	}
	/**
	* Adds a self-destructing event to each node.
	* @param {string} events The event names.
	* @param {EventCallback} callback The callback to execute.
	* @param {EventOptions} [options] The event options.
	* @returns {QuerySet} The QuerySet object.
	*/
	function addEventOnce(events, callback, { capture = false, passive = false } = {}) {
		addEventOnce$1(this, events, callback, {
			capture,
			passive
		});
		return this;
	}
	/**
	* Clones all events from each node to other nodes.
	* @param {EventTargetInput} otherSelector The other node(s), or a query selector string.
	* @returns {QuerySet} The QuerySet object.
	*/
	function cloneEvents(otherSelector) {
		cloneEvents$1(this, otherSelector);
		return this;
	}
	/**
	* Removes events from each node.
	* @param {string} [events] The event names.
	* @param {EventCallback} [callback] The callback to remove.
	* @param {RemoveEventOptions} [options] The removal options.
	* @returns {QuerySet} The QuerySet object.
	*/
	function removeEvent(events, callback, { capture = null } = {}) {
		removeEvent$1(this, events, callback, { capture });
		return this;
	}
	/**
	* Removes delegated events from each node.
	* @param {string} [events] The event names.
	* @param {string} [delegate] The delegate selector.
	* @param {EventCallback} [callback] The callback to remove.
	* @param {RemoveEventOptions} [options] The removal options.
	* @returns {QuerySet} The QuerySet object.
	*/
	function removeEventDelegate(events, delegate, callback, { capture = null } = {}) {
		removeEventDelegate$1(this, events, delegate, callback, { capture });
		return this;
	}
	/**
	* Triggers events on each node.
	* @param {string} events The event names.
	* @param {TriggerEventOptions} [options] The event options.
	* @returns {QuerySet} The QuerySet object.
	*/
	function triggerEvent(events, { data = null, detail = null, bubbles = true, cancelable = true } = {}) {
		triggerEvent$1(this, events, {
			data,
			detail,
			bubbles,
			cancelable
		});
		return this;
	}
	/**
	* Triggers an event for the first node.
	* @param {string} event The event name.
	* @param {TriggerEventOptions} [options] The event options.
	* @returns {boolean} Whether the event was dispatched without cancellation.
	*/
	function triggerOne(event, { data = null, detail = null, bubbles = true, cancelable = true } = {}) {
		return triggerOne$1(this, event, {
			data,
			detail,
			bubbles,
			cancelable
		});
	}
	/** @import QuerySet from '../query-set.js'; */
	/**
	* Triggers a blur event on the first node.
	* @returns {QuerySet} The QuerySet object.
	*/
	function blur() {
		blur$1(this);
		return this;
	}
	/**
	* Triggers a click event on the first node.
	* @returns {QuerySet} The QuerySet object.
	*/
	function click() {
		click$1(this);
		return this;
	}
	/**
	* Triggers a focus event on the first node.
	* @returns {QuerySet} The QuerySet object.
	*/
	function focus() {
		focus$1(this);
		return this;
	}
	/**
	* Attaches a shadow DOM tree to the first node.
	* @param {{open?: boolean}} [options] The shadow DOM options.
	* @returns {QuerySet} A new QuerySet object.
	*/
	function attachShadow({ open = true } = {}) {
		const shadow = attachShadow$1(this, { open });
		return new QuerySet(shadow ? [shadow] : []);
	}
	/** @import { CloneOptions } from '../../manipulation/manipulation.js'; */
	/** @import { NodeInput } from '../../helpers.js'; */
	/**
	* Clones each node.
	* @param {CloneOptions} [options] The cloning options.
	* @returns {QuerySet} A new QuerySet object.
	*/
	function clone(options) {
		return new QuerySet(clone$1(this, options));
	}
	/**
	* Detaches each node from the DOM.
	* @returns {QuerySet} The QuerySet object.
	*/
	function detach() {
		detach$1(this);
		return this;
	}
	/**
	* Removes all children of each node from the DOM.
	* @returns {QuerySet} The QuerySet object.
	*/
	function empty() {
		empty$1(this);
		return this;
	}
	/**
	* Removes each node from the DOM.
	* @returns {QuerySet} The QuerySet object.
	*/
	function remove() {
		remove$1(this);
		return this;
	}
	/**
	* Replaces each other node with nodes.
	* @param {NodeInput} otherSelector The input node(s), or a query selector string.
	* @returns {QuerySet} The QuerySet object.
	*/
	function replaceAll(otherSelector) {
		replaceAll$1(this, otherSelector);
		return this;
	}
	/**
	* Replaces each node with other nodes.
	* @param {NodeInput} otherSelector The input node(s), or a query selector or HTML string.
	* @returns {QuerySet} The QuerySet object.
	*/
	function replaceWith(otherSelector) {
		replaceWith$1(this, otherSelector);
		return this;
	}
	/** @import { NodeInput } from '../../helpers.js'; */
	/** @import QuerySet from '../query-set.js'; */
	/**
	* Inserts each other node after the first node.
	* @param {NodeInput} otherSelector The other node(s), or a query selector or HTML string.
	* @returns {QuerySet} The QuerySet object.
	*/
	function after(otherSelector) {
		after$1(this, otherSelector);
		return this;
	}
	/**
	* Appends each other node to the first node.
	* @param {NodeInput} otherSelector The other node(s), or a query selector or HTML string.
	* @returns {QuerySet} The QuerySet object.
	*/
	function append(otherSelector) {
		append$1(this, otherSelector);
		return this;
	}
	/**
	* Appends each node to the first other node.
	* @param {NodeInput} otherSelector The other node(s), or a query selector string.
	* @returns {QuerySet} The QuerySet object.
	*/
	function appendTo(otherSelector) {
		appendTo$1(this, otherSelector);
		return this;
	}
	/**
	* Inserts each other node before the first node.
	* @param {NodeInput} otherSelector The other node(s), or a query selector or HTML string.
	* @returns {QuerySet} The QuerySet object.
	*/
	function before(otherSelector) {
		before$1(this, otherSelector);
		return this;
	}
	/**
	* Inserts each node after the first other node.
	* @param {NodeInput} otherSelector The other node(s), or a query selector string.
	* @returns {QuerySet} The QuerySet object.
	*/
	function insertAfter(otherSelector) {
		insertAfter$1(this, otherSelector);
		return this;
	}
	/**
	* Inserts each node before the first other node.
	* @param {NodeInput} otherSelector The other node(s), or a query selector string.
	* @returns {QuerySet} The QuerySet object.
	*/
	function insertBefore(otherSelector) {
		insertBefore$1(this, otherSelector);
		return this;
	}
	/**
	* Prepends each other node to the first node.
	* @param {NodeInput} otherSelector The other node(s), or a query selector or HTML string.
	* @returns {QuerySet} The QuerySet object.
	*/
	function prepend(otherSelector) {
		prepend$1(this, otherSelector);
		return this;
	}
	/**
	* Prepends each node to the first other node.
	* @param {NodeInput} otherSelector The other node(s), or a query selector string.
	* @returns {QuerySet} The QuerySet object.
	*/
	function prependTo(otherSelector) {
		prependTo$1(this, otherSelector);
		return this;
	}
	/** @import { NodeFilterInput } from '../../filters.js'; */
	/** @import { NodeInput } from '../../helpers.js'; */
	/** @import QuerySet from '../query-set.js'; */
	/**
	* Unwraps each node.
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @returns {QuerySet} The QuerySet object.
	*/
	function unwrap(nodeFilter) {
		unwrap$1(this, nodeFilter);
		return this;
	}
	/**
	* Wraps each nodes with other nodes.
	* @param {NodeInput} otherSelector The other node(s), or a query selector or HTML string.
	* @returns {QuerySet} The QuerySet object.
	*/
	function wrap$1(otherSelector) {
		wrap$2(this, otherSelector);
		return this;
	}
	/**
	* Wraps all nodes with other nodes.
	* @param {NodeInput} otherSelector The other node(s), or a query selector or HTML string.
	* @returns {QuerySet} The QuerySet object.
	*/
	function wrapAll(otherSelector) {
		wrapAll$1(this, otherSelector);
		return this;
	}
	/**
	* Wraps the contents of each node with other nodes.
	* @param {NodeInput} otherSelector The other node(s), or a query selector or HTML string.
	* @returns {QuerySet} The QuerySet object.
	*/
	function wrapInner(otherSelector) {
		wrapInner$1(this, otherSelector);
		return this;
	}
	/** @import { ElementInput } from '../helpers.js'; */
	/**
	* @callback QueueCallback
	* @param {Element} node The queued element.
	* @returns {*|Promise<*>} The callback result.
	*/
	/**
	* @typedef {object} QueueOptions
	* @property {string} [queueName='default'] The queue name.
	*/
	/**
	* @typedef {object} ClearQueueOptions
	* @property {string|null} [queueName='default'] The queue name. Null addresses every queue.
	*/
	/**
	* Clears the queue of each node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {ClearQueueOptions} [options] The queue clearing options.
	*/
	function clearQueue$1(selector, { queueName = "default" } = {}) {
		const nodes = parseNodes(selector);
		for (const node of nodes) {
			if (!queues.has(node)) continue;
			const queue = queues.get(node);
			if (queueName !== null) queue.delete(queueName);
			if (queueName === null || !queue.size) queues.delete(node);
		}
	}
	/**
	* Runs the next callback for a single node.
	* @param {Element} node The input node.
	* @param {QueueOptions} [options] The queue options.
	*/
	function dequeue(node, { queueName = "default" } = {}) {
		const queue = queues.get(node);
		if (!queue || !queue.has(queueName)) return;
		const callbacks = queue.get(queueName);
		const next = callbacks.shift();
		if (!next) {
			queue.delete(queueName);
			if (!queue.size && queues.get(node) === queue) queues.delete(node);
			return;
		}
		Promise.resolve(next(node)).then((_) => {
			if (queues.get(node) === queue && queue.get(queueName) === callbacks) dequeue(node, { queueName });
		}).catch((_) => {
			if (queues.get(node) === queue && queue.get(queueName) === callbacks) {
				queue.delete(queueName);
				if (!queue.size) queues.delete(node);
			}
		});
	}
	/**
	* Queues a callback on each node.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {QueueCallback} callback The callback to queue.
	* @param {QueueOptions} [options] The queue options.
	*/
	function queue$1(selector, callback, { queueName = "default" } = {}) {
		const { setTimeout } = getWindow();
		const nodes = parseNodes(selector);
		for (const node of nodes) {
			if (!queues.has(node)) queues.set(node, /* @__PURE__ */ new Map());
			const queue = queues.get(node);
			const runningQueue = queue.has(queueName);
			if (!runningQueue) queue.set(queueName, [(_) => new Promise((resolve) => {
				setTimeout(resolve, 1);
			})]);
			queue.get(queueName).push(callback);
			if (!runningQueue) dequeue(node, { queueName });
		}
	}
	/** @import QuerySet from '../query-set.js'; */
	/** @import { QueueCallback } from '../../queue/queue.js'; */
	/** @import { QueueOptions } from '../../queue/queue.js'; */
	/**
	* Clears the queue of each node.
	* @param {QueueOptions} [options] The queue options.
	* @returns {QuerySet} The QuerySet object.
	*/
	function clearQueue({ queueName = "default" } = {}) {
		clearQueue$1(this, { queueName });
		return this;
	}
	/**
	* Delays execution of subsequent items in the queue for each node.
	* @param {number} duration The number of milliseconds to delay execution by.
	* @param {QueueOptions} [options] The queue options.
	* @returns {QuerySet} The QuerySet object.
	*/
	function delay(duration, { queueName = "default" } = {}) {
		const { setTimeout } = getWindow();
		return this.queue((_) => new Promise((resolve) => setTimeout(resolve, duration)), { queueName });
	}
	/**
	* Queues a callback on each node.
	* @param {QueueCallback} callback The callback to queue.
	* @param {QueueOptions} [options] The queue options.
	* @returns {QuerySet} The QuerySet object.
	*/
	function queue(callback, { queueName = "default" } = {}) {
		queue$1(this, callback, { queueName });
		return this;
	}
	/** @import { ElementInput } from '../helpers.js'; */
	/** @import { NodeFilterInput } from '../filters.js'; */
	/** @import { NodeInput } from '../helpers.js'; */
	/** @import { QueryInput } from '../helpers.js'; */
	/**
	* Returns all nodes connected to the DOM.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @returns {Node[]} The filtered nodes.
	*/
	function connected$1(selector) {
		return parseNodes(selector, {
			node: true,
			fragment: true,
			shadow: true
		}).filter((node) => node.isConnected);
	}
	/**
	* Returns all nodes considered equal to any of the other nodes.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @param {NodeInput} otherSelector The other node(s), or a query selector string.
	* @returns {Node[]} The filtered nodes.
	*/
	function equal$1(selector, otherSelector) {
		const others = parseNodes(otherSelector, {
			node: true,
			fragment: true,
			shadow: true
		});
		return parseNodes(selector, {
			node: true,
			fragment: true,
			shadow: true
		}).filter((node) => others.some((other) => node.isEqualNode(other)));
	}
	/**
	* Returns all nodes matching a filter.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @returns {Node[]} The filtered nodes.
	*/
	function filter$1(selector, nodeFilter) {
		nodeFilter = parseFilter(nodeFilter);
		return parseNodes(selector, {
			node: true,
			fragment: true,
			shadow: true
		}).filter(nodeFilter);
	}
	/**
	* Returns the first node matching a filter.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @returns {Node|null} The matching node, or null when none matches.
	*/
	function filterOne$1(selector, nodeFilter) {
		nodeFilter = parseFilter(nodeFilter);
		return parseNodes(selector, {
			node: true,
			fragment: true,
			shadow: true
		}).find(nodeFilter) || null;
	}
	/**
	* Returns all "fixed" nodes.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @returns {Node[]} The filtered nodes.
	*/
	function fixed$1(selector) {
		return parseNodes(selector, { node: true }).filter((node) => isElement(node) && css$1(node, "position") === "fixed" || closest$1(node, (parent) => isElement(parent) && css$1(parent, "position") === "fixed").length);
	}
	/**
	* Returns all hidden nodes.
	* @param {QueryInput} selector The input node(s), or a query selector string.
	* @returns {Array<Node|Window>} The filtered nodes.
	*/
	function hidden$1(selector) {
		return parseNodes(selector, {
			node: true,
			document: true,
			window: true
		}).filter((node) => {
			if (isWindow(node)) return node.document.visibilityState !== "visible";
			if (isDocument(node)) return node.visibilityState !== "visible";
			return !node.offsetParent;
		});
	}
	/**
	* Returns all nodes not matching a filter.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @returns {Node[]} The filtered nodes.
	*/
	function not$1(selector, nodeFilter) {
		nodeFilter = parseFilter(nodeFilter);
		return parseNodes(selector, {
			node: true,
			fragment: true,
			shadow: true
		}).filter((node, index) => !nodeFilter(node, index));
	}
	/**
	* Returns the first node not matching a filter.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @returns {Node|null} The matching node, or null when none matches.
	*/
	function notOne$1(selector, nodeFilter) {
		nodeFilter = parseFilter(nodeFilter);
		return parseNodes(selector, {
			node: true,
			fragment: true,
			shadow: true
		}).find((node, index) => !nodeFilter(node, index)) || null;
	}
	/**
	* Returns all nodes considered identical to any of the other nodes.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @param {NodeInput} otherSelector The other node(s), or a query selector string.
	* @returns {Node[]} The filtered nodes.
	*/
	function same$1(selector, otherSelector) {
		const others = parseNodes(otherSelector, {
			node: true,
			fragment: true,
			shadow: true
		});
		return parseNodes(selector, {
			node: true,
			fragment: true,
			shadow: true
		}).filter((node) => others.some((other) => node.isSameNode(other)));
	}
	/**
	* Returns all visible nodes.
	* @param {QueryInput} selector The input node(s), or a query selector string.
	* @returns {Array<Node|Window>} The filtered nodes.
	*/
	function visible$1(selector) {
		return parseNodes(selector, {
			node: true,
			document: true,
			window: true
		}).filter((node) => {
			if (isWindow(node)) return node.document.visibilityState === "visible";
			if (isDocument(node)) return node.visibilityState === "visible";
			return node.offsetParent;
		});
	}
	/**
	* Returns all nodes with an animation.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @returns {Node[]} The filtered nodes.
	*/
	function withAnimation$1(selector) {
		return parseNodes(selector).filter((node) => animations.has(node));
	}
	/**
	* Returns all nodes with a specified attribute.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {string} attribute The attribute name.
	* @returns {Node[]} The filtered nodes.
	*/
	function withAttribute$1(selector, attribute) {
		return parseNodes(selector).filter((node) => node.hasAttribute(attribute));
	}
	/**
	* Returns all nodes with child elements.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @returns {Node[]} The filtered nodes.
	*/
	function withChildren$1(selector) {
		return parseNodes(selector, {
			fragment: true,
			shadow: true,
			document: true
		}).filter((node) => !!node.childElementCount);
	}
	/**
	* Returns all nodes with any of the specified classes.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {...string|string[]} classes The classes.
	* @returns {Node[]} The filtered nodes.
	*/
	function withClass$1(selector, ...classes) {
		classes = parseClasses(classes);
		return parseNodes(selector).filter((node) => classes.some((className) => node.classList.contains(className)));
	}
	/**
	* Returns all nodes with a CSS animation.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @returns {Node[]} The filtered nodes.
	*/
	function withCSSAnimation$1(selector) {
		return parseNodes(selector).filter((node) => parseFloat(css$1(node, "animation-duration")));
	}
	/**
	* Returns all nodes with a CSS transition.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @returns {Node[]} The filtered nodes.
	*/
	function withCSSTransition$1(selector) {
		return parseNodes(selector).filter((node) => parseFloat(css$1(node, "transition-duration")));
	}
	/**
	* Returns all nodes with custom data.
	* @param {QueryInput} selector The input node(s), or a query selector string.
	* @param {string} [key] The data key.
	* @returns {Array<Node|Window>} The filtered nodes.
	*/
	function withData$1(selector, key) {
		return parseNodes(selector, {
			node: true,
			fragment: true,
			shadow: true,
			document: true,
			window: true
		}).filter((node) => {
			if (!data.has(node)) return false;
			if (!key) return true;
			const nodeData = data.get(node);
			return Object.hasOwn(nodeData, key);
		});
	}
	/**
	* Returns all nodes with a descendant matching a filter.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @returns {Node[]} The filtered nodes.
	*/
	function withDescendent$1(selector, nodeFilter) {
		nodeFilter = parseFilterContains(nodeFilter);
		return parseNodes(selector, {
			fragment: true,
			shadow: true,
			document: true
		}).filter(nodeFilter);
	}
	/**
	* Returns all nodes with a specified property.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {string} property The property name.
	* @returns {Node[]} The filtered nodes.
	*/
	function withProperty$1(selector, property) {
		return parseNodes(selector).filter((node) => Object.hasOwn(node, property));
	}
	/** @import { NodeFilterInput } from '../../filters.js'; */
	/** @import { NodeInput } from '../../helpers.js'; */
	/**
	* Returns all nodes connected to the DOM.
	* @returns {QuerySet} The QuerySet object.
	*/
	function connected() {
		return new QuerySet(connected$1(this));
	}
	/**
	* Returns all nodes considered equal to any of the other nodes.
	* @param {NodeInput} otherSelector The other node(s), or a query selector string.
	* @returns {QuerySet} The QuerySet object.
	*/
	function equal(otherSelector) {
		return new QuerySet(equal$1(this, otherSelector));
	}
	/**
	* Returns all nodes matching a filter.
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @returns {QuerySet} The QuerySet object.
	*/
	function filter(nodeFilter) {
		return new QuerySet(filter$1(this, nodeFilter));
	}
	/**
	* Returns the first node matching a filter.
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @returns {QuerySet} The QuerySet object.
	*/
	function filterOne(nodeFilter) {
		const node = filterOne$1(this, nodeFilter);
		return new QuerySet(node ? [node] : []);
	}
	/**
	* Returns all "fixed" nodes.
	* @returns {QuerySet} The QuerySet object.
	*/
	function fixed() {
		return new QuerySet(fixed$1(this));
	}
	/**
	* Returns all hidden nodes.
	* @returns {QuerySet} The QuerySet object.
	*/
	function hidden() {
		return new QuerySet(hidden$1(this));
	}
	/**
	* Returns all nodes not matching a filter.
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @returns {QuerySet} The QuerySet object.
	*/
	function not(nodeFilter) {
		return new QuerySet(not$1(this, nodeFilter));
	}
	/**
	* Returns the first node not matching a filter.
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @returns {QuerySet} The QuerySet object.
	*/
	function notOne(nodeFilter) {
		const node = notOne$1(this, nodeFilter);
		return new QuerySet(node ? [node] : []);
	}
	/**
	* Returns all nodes considered identical to any of the other nodes.
	* @param {NodeInput} otherSelector The other node(s), or a query selector string.
	* @returns {QuerySet} The QuerySet object.
	*/
	function same(otherSelector) {
		return new QuerySet(same$1(this, otherSelector));
	}
	/**
	* Returns all visible nodes.
	* @returns {QuerySet} The QuerySet object.
	*/
	function visible() {
		return new QuerySet(visible$1(this));
	}
	/**
	* Returns all nodes with an animation.
	* @returns {QuerySet} The QuerySet object.
	*/
	function withAnimation() {
		return new QuerySet(withAnimation$1(this));
	}
	/**
	* Returns all nodes with a specified attribute.
	* @param {string} attribute The attribute name.
	* @returns {QuerySet} The QuerySet object.
	*/
	function withAttribute(attribute) {
		return new QuerySet(withAttribute$1(this, attribute));
	}
	/**
	* Returns all nodes with child elements.
	* @returns {QuerySet} The QuerySet object.
	*/
	function withChildren() {
		return new QuerySet(withChildren$1(this));
	}
	/**
	* Returns all nodes with any of the specified classes.
	* @param {...string|string[]} classes The classes.
	* @returns {QuerySet} The QuerySet object.
	*/
	function withClass(...classes) {
		return new QuerySet(withClass$1(this, ...classes));
	}
	/**
	* Returns all nodes with a CSS animation.
	* @returns {QuerySet} The QuerySet object.
	*/
	function withCSSAnimation() {
		return new QuerySet(withCSSAnimation$1(this));
	}
	/**
	* Returns all nodes with a CSS transition.
	* @returns {QuerySet} The QuerySet object.
	*/
	function withCSSTransition() {
		return new QuerySet(withCSSTransition$1(this));
	}
	/**
	* Returns all nodes with custom data.
	* @param {string} [key] The data key.
	* @returns {QuerySet} The QuerySet object.
	*/
	function withData(key) {
		return new QuerySet(withData$1(this, key));
	}
	/**
	* Returns all elements with a descendant matching a filter.
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @returns {QuerySet} The QuerySet object.
	*/
	function withDescendent(nodeFilter) {
		return new QuerySet(withDescendent$1(this, nodeFilter));
	}
	/**
	* Returns all nodes with a specified property.
	* @param {string} property The property name.
	* @returns {QuerySet} The QuerySet object.
	*/
	function withProperty(property) {
		return new QuerySet(withProperty$1(this, property));
	}
	/**
	* Returns all descendant nodes matching a selector.
	* @param {string} selector The query selector.
	* @returns {QuerySet} The QuerySet object.
	*/
	function find(selector) {
		return new QuerySet(find$1(selector, this));
	}
	/**
	* Returns all descendant nodes with a specific class.
	* @param {string} className The class name.
	* @returns {QuerySet} The QuerySet object.
	*/
	function findByClass(className) {
		return new QuerySet(findByClass$1(className, this));
	}
	/**
	* Returns all descendant nodes with a specific ID.
	* @param {string} id The id.
	* @returns {QuerySet} The QuerySet object.
	*/
	function findById(id) {
		return new QuerySet(findById$1(id, this));
	}
	/**
	* Returns all descendant nodes with a specific tag.
	* @param {string} tagName The tag name.
	* @returns {QuerySet} The QuerySet object.
	*/
	function findByTag(tagName) {
		return new QuerySet(findByTag$1(tagName, this));
	}
	/**
	* Returns a single descendant node matching a selector.
	* @param {string} selector The query selector.
	* @returns {QuerySet} The QuerySet object.
	*/
	function findOne(selector) {
		const node = findOne$1(selector, this);
		return new QuerySet(node ? [node] : []);
	}
	/**
	* Returns a single descendant node with a specific class.
	* @param {string} className The class name.
	* @returns {QuerySet} The QuerySet object.
	*/
	function findOneByClass(className) {
		const node = findOneByClass$1(className, this);
		return new QuerySet(node ? [node] : []);
	}
	/**
	* Returns a single descendant node with a specific ID.
	* @param {string} id The id.
	* @returns {QuerySet} The QuerySet object.
	*/
	function findOneById(id) {
		const node = findOneById$1(id, this);
		return new QuerySet(node ? [node] : []);
	}
	/**
	* Returns a single descendant node with a specific tag.
	* @param {string} tagName The tag name.
	* @returns {QuerySet} The QuerySet object.
	*/
	function findOneByTag(tagName) {
		const node = findOneByTag$1(tagName, this);
		return new QuerySet(node ? [node] : []);
	}
	/** @import { NodeFilterInput } from '../../filters.js'; */
	/**
	* Returns the first child of each node (optionally matching a filter).
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @returns {QuerySet} The QuerySet object.
	*/
	function child(nodeFilter) {
		return new QuerySet(child$1(this, nodeFilter));
	}
	/**
	* Returns all children of each node (optionally matching a filter).
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @param {{elementsOnly?: boolean}} [options] The filtering options.
	* @returns {QuerySet} The QuerySet object.
	*/
	function children(nodeFilter, { elementsOnly = true } = {}) {
		return new QuerySet(children$1(this, nodeFilter, { elementsOnly }));
	}
	/**
	* Returns the closest ancestor to each node (optionally matching a filter, and before a limit).
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @param {NodeFilterInput} [limitFilter] The limit node(s), a query selector string or custom filter function.
	* @returns {QuerySet} The QuerySet object.
	*/
	function closest(nodeFilter, limitFilter) {
		return new QuerySet(closest$1(this, nodeFilter, limitFilter));
	}
	/**
	* Returns the common ancestor of all nodes.
	* @returns {QuerySet} The QuerySet object.
	*/
	function commonAncestor() {
		const node = commonAncestor$1(this);
		return new QuerySet(node ? [node] : []);
	}
	/**
	* Returns all children of each node (including text and comment nodes).
	* @returns {QuerySet} The QuerySet object.
	*/
	function contents() {
		return new QuerySet(contents$1(this));
	}
	/**
	* Returns the DocumentFragment of the first node.
	* @returns {QuerySet} The QuerySet object.
	*/
	function fragment() {
		const node = fragment$1(this);
		return new QuerySet(node ? [node] : []);
	}
	/**
	* Returns the next sibling for each node (optionally matching a filter).
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @returns {QuerySet} The QuerySet object.
	*/
	function next(nodeFilter) {
		return new QuerySet(next$1(this, nodeFilter));
	}
	/**
	* Returns all next siblings for each node (optionally matching a filter, and before a limit).
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @param {NodeFilterInput} [limitFilter] The limit node(s), a query selector string or custom filter function.
	* @returns {QuerySet} The QuerySet object.
	*/
	function nextAll(nodeFilter, limitFilter) {
		return new QuerySet(nextAll$1(this, nodeFilter, limitFilter));
	}
	/**
	* Returns the offset parent (relatively positioned) of the first node.
	* @returns {QuerySet} The QuerySet object.
	*/
	function offsetParent() {
		const node = offsetParent$1(this);
		return new QuerySet(node ? [node] : []);
	}
	/**
	* Returns the parent of each node (optionally matching a filter).
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @returns {QuerySet} The QuerySet object.
	*/
	function parent(nodeFilter) {
		return new QuerySet(parent$1(this, nodeFilter));
	}
	/**
	* Returns all parents of each node (optionally matching a filter, and before a limit).
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @param {NodeFilterInput} [limitFilter] The limit node(s), a query selector string or custom filter function.
	* @returns {QuerySet} The QuerySet object.
	*/
	function parents(nodeFilter, limitFilter) {
		return new QuerySet(parents$1(this, nodeFilter, limitFilter));
	}
	/**
	* Returns the previous sibling for each node (optionally matching a filter).
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @returns {QuerySet} The QuerySet object.
	*/
	function prev(nodeFilter) {
		return new QuerySet(prev$1(this, nodeFilter));
	}
	/**
	* Returns all previous siblings for each node (optionally matching a filter, and before a limit).
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @param {NodeFilterInput} [limitFilter] The limit node(s), a query selector string or custom filter function.
	* @returns {QuerySet} The QuerySet object.
	*/
	function prevAll(nodeFilter, limitFilter) {
		return new QuerySet(prevAll$1(this, nodeFilter, limitFilter));
	}
	/**
	* Returns the ShadowRoot of the first node.
	* @returns {QuerySet} The QuerySet object.
	*/
	function shadow() {
		const node = shadow$1(this);
		return new QuerySet(node ? [node] : []);
	}
	/**
	* Returns all siblings for each node (optionally matching a filter).
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @param {{elementsOnly?: boolean}} [options] The filtering options.
	* @returns {QuerySet} The QuerySet object.
	*/
	function siblings(nodeFilter, { elementsOnly = true } = {}) {
		return new QuerySet(siblings$1(this, nodeFilter, { elementsOnly }));
	}
	/** @import { NodeInput } from '../helpers.js'; */
	/**
	* Inserts each node after the selection.
	* @param {NodeInput} selector The input node(s), or a query selector or HTML string.
	*/
	function afterSelection$1(selector) {
		const nodes = parseNodes(selector, {
			node: true,
			fragment: true,
			html: true
		}).reverse();
		const selection = getWindow().getSelection();
		if (!selection.rangeCount) return;
		const range = selection.getRangeAt(0);
		selection.removeAllRanges();
		range.collapse();
		for (const node of nodes) range.insertNode(node);
	}
	/**
	* Inserts each node before the selection.
	* @param {NodeInput} selector The input node(s), or a query selector or HTML string.
	*/
	function beforeSelection$1(selector) {
		const nodes = parseNodes(selector, {
			node: true,
			fragment: true,
			html: true
		}).reverse();
		const selection = getWindow().getSelection();
		if (!selection.rangeCount) return;
		const range = selection.getRangeAt(0);
		selection.removeAllRanges();
		for (const node of nodes) range.insertNode(node);
	}
	/**
	* Extracts selected nodes from the DOM.
	* @returns {Node[]} The selected nodes.
	*/
	function extractSelection() {
		const selection = getWindow().getSelection();
		if (!selection.rangeCount) return [];
		const range = selection.getRangeAt(0);
		selection.removeAllRanges();
		const fragment = range.extractContents();
		return merge([], fragment.childNodes);
	}
	/**
	* Returns all selected nodes.
	* @returns {Node[]} The selected nodes.
	*/
	function getSelection() {
		const selection = getWindow().getSelection();
		if (!selection.rangeCount) return [];
		const range = selection.getRangeAt(0);
		const commonAncestor = range.commonAncestorContainer;
		if (typeof commonAncestor.querySelectorAll !== "function") return [commonAncestor];
		const nodes = merge([], commonAncestor.querySelectorAll("*"));
		if (!nodes.length) return [commonAncestor];
		if (nodes.length === 1) return nodes;
		const startContainer = range.startContainer;
		const endContainer = range.endContainer;
		const start = isElement(startContainer) ? startContainer : startContainer.parentNode;
		const end = isElement(endContainer) ? endContainer : endContainer.parentNode;
		const selectedNodes = nodes.slice(nodes.indexOf(start), nodes.indexOf(end) + 1);
		const results = [];
		let lastNode;
		for (const node of selectedNodes) {
			if (lastNode && lastNode.contains(node)) continue;
			lastNode = node;
			results.push(node);
		}
		return results.length > 1 ? unique(results) : results;
	}
	/**
	* Creates a selection on the first node.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	*/
	function select$1(selector) {
		const node = parseNode(selector, { node: true });
		if (node && "select" in node) {
			node.select();
			return;
		}
		const selection = getWindow().getSelection();
		if (selection.rangeCount > 0) selection.removeAllRanges();
		if (!node) return;
		const range = createRange();
		range.selectNode(node);
		selection.addRange(range);
	}
	/**
	* Creates a selection containing all of the nodes.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	*/
	function selectAll$1(selector) {
		const nodes = sort$1(selector);
		const selection = getWindow().getSelection();
		if (selection.rangeCount) selection.removeAllRanges();
		if (!nodes.length) return;
		const range = createRange();
		if (nodes.length == 1) range.selectNode(nodes.shift());
		else {
			range.setStartBefore(nodes.shift());
			range.setEndAfter(nodes.pop());
		}
		selection.addRange(range);
	}
	/**
	* Wraps selected nodes with other nodes.
	* @param {NodeInput} selector The input node(s), or a query selector or HTML string.
	*/
	function wrapSelection$1(selector) {
		const nodes = parseNodes(selector, {
			fragment: true,
			html: true
		});
		const selection = getWindow().getSelection();
		if (!selection.rangeCount) return;
		const range = selection.getRangeAt(0);
		selection.removeAllRanges();
		const node = nodes.slice().shift();
		const deepest = merge([], node.querySelectorAll("*")).find((node) => !node.childElementCount) || node;
		const fragment = range.extractContents();
		const childNodes = merge([], fragment.childNodes);
		for (const child of childNodes) deepest.insertBefore(child, null);
		for (const node of nodes) range.insertNode(node);
	}
	/** @import QuerySet from '../query-set.js'; */
	/**
	* Inserts each node after the selection.
	* @returns {QuerySet} The QuerySet object.
	*/
	function afterSelection() {
		afterSelection$1(this);
		return this;
	}
	/**
	* Inserts each node before the selection.
	* @returns {QuerySet} The QuerySet object.
	*/
	function beforeSelection() {
		beforeSelection$1(this);
		return this;
	}
	/**
	* Creates a selection on the first node.
	* @returns {QuerySet} The QuerySet object.
	*/
	function select() {
		select$1(this);
		return this;
	}
	/**
	* Creates a selection containing all of the nodes.
	* @returns {QuerySet} The QuerySet object.
	*/
	function selectAll() {
		selectAll$1(this);
		return this;
	}
	/**
	* Wraps selected nodes with other nodes.
	* @returns {QuerySet} The QuerySet object.
	*/
	function wrapSelection() {
		wrapSelection$1(this);
		return this;
	}
	/** @import { ElementInput } from '../helpers.js'; */
	/** @import { NodeFilterInput } from '../filters.js'; */
	/** @import { NodeInput } from '../helpers.js'; */
	/** @import { QueryInput } from '../helpers.js'; */
	/**
	* Checks whether any of the nodes has an animation.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @returns {boolean} Whether any of the nodes has an animation.
	*/
	function hasAnimation$1(selector) {
		return parseNodes(selector).some((node) => animations.has(node));
	}
	/**
	* Checks whether any of the nodes has a specified attribute.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {string} attribute The attribute name.
	* @returns {boolean} Whether any of the nodes has the attribute.
	*/
	function hasAttribute$1(selector, attribute) {
		return parseNodes(selector).some((node) => node.hasAttribute(attribute));
	}
	/**
	* Checks whether any of the nodes has child nodes.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @returns {boolean} Whether any of the nodes has child nodes.
	*/
	function hasChildren$1(selector) {
		return parseNodes(selector, {
			fragment: true,
			shadow: true,
			document: true
		}).some((node) => node.childElementCount);
	}
	/**
	* Checks whether any of the nodes has any of the specified classes.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {...string|string[]} classes The classes.
	* @returns {boolean} Whether any of the nodes has any of the classes.
	*/
	function hasClass$1(selector, ...classes) {
		classes = parseClasses(classes);
		return parseNodes(selector).some((node) => classes.some((className) => node.classList.contains(className)));
	}
	/**
	* Checks whether any of the nodes has a CSS animation.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @returns {boolean} Whether any of the nodes has a CSS animation.
	*/
	function hasCSSAnimation$1(selector) {
		return parseNodes(selector).some((node) => parseFloat(css$1(node, "animation-duration")));
	}
	/**
	* Checks whether any of the nodes has a CSS transition.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @returns {boolean} Whether any of the nodes has a CSS transition.
	*/
	function hasCSSTransition$1(selector) {
		return parseNodes(selector).some((node) => parseFloat(css$1(node, "transition-duration")));
	}
	/**
	* Checks whether any of the nodes has custom data.
	* @param {QueryInput} selector The input node(s), or a query selector string.
	* @param {string} [key] The data key.
	* @returns {boolean} Whether any of the nodes has custom data.
	*/
	function hasData$1(selector, key) {
		return parseNodes(selector, {
			fragment: true,
			shadow: true,
			document: true,
			window: true
		}).some((node) => {
			if (!data.has(node)) return false;
			if (!key) return true;
			const nodeData = data.get(node);
			return Object.hasOwn(nodeData, key);
		});
	}
	/**
	* Checks whether any of the nodes has the specified dataset value.
	* @param {QueryInput} selector The input node(s), or a query selector string.
	* @param {string} [key] The dataset key.
	* @returns {boolean} Whether any of the nodes has the dataset value.
	*/
	function hasDataset$1(selector, key) {
		key = camelCase(key);
		return parseNodes(selector).some((node) => !!node.dataset[key]);
	}
	/**
	* Checks whether any of the nodes contains a descendant matching a filter.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @returns {boolean} Whether any of the nodes contains a descendant matching the filter.
	*/
	function hasDescendent$1(selector, nodeFilter) {
		nodeFilter = parseFilterContains(nodeFilter);
		return parseNodes(selector, {
			fragment: true,
			shadow: true,
			document: true
		}).some(nodeFilter);
	}
	/**
	* Checks whether any of the nodes has a DocumentFragment.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @returns {boolean} Whether any of the nodes has a DocumentFragment.
	*/
	function hasFragment$1(selector) {
		return parseNodes(selector).some((node) => node.content);
	}
	/**
	* Checks whether any of the nodes has a specified property.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @param {string} property The property name.
	* @returns {boolean} Whether any of the nodes has the property.
	*/
	function hasProperty$1(selector, property) {
		return parseNodes(selector).some((node) => Object.hasOwn(node, property));
	}
	/**
	* Checks whether any of the nodes has a ShadowRoot.
	* @param {ElementInput} selector The input node(s), or a query selector string.
	* @returns {boolean} Whether any of the nodes has a ShadowRoot.
	*/
	function hasShadow$1(selector) {
		return parseNodes(selector).some((node) => node.shadowRoot);
	}
	/**
	* Checks whether any of the nodes matches a filter.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @returns {boolean} Whether any of the nodes matches the filter.
	*/
	function is$1(selector, nodeFilter) {
		nodeFilter = parseFilter(nodeFilter);
		return parseNodes(selector, {
			node: true,
			fragment: true,
			shadow: true
		}).some(nodeFilter);
	}
	/**
	* Checks whether any of the nodes is connected to the DOM.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @returns {boolean} Whether any of the nodes is connected to the DOM.
	*/
	function isConnected$1(selector) {
		return parseNodes(selector, {
			node: true,
			fragment: true,
			shadow: true
		}).some((node) => node.isConnected);
	}
	/**
	* Checks whether any of the nodes is considered equal to any of the other nodes.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @param {NodeInput} otherSelector The other node(s), or a query selector string.
	* @param {{shallow?: boolean}} [options] The comparison options.
	* @returns {boolean} Whether any of the nodes is considered equal to any of the other nodes.
	*/
	function isEqual$1(selector, otherSelector, { shallow = false } = {}) {
		let nodes = parseNodes(selector, {
			node: true,
			fragment: true,
			shadow: true
		});
		let others = parseNodes(otherSelector, {
			node: true,
			fragment: true,
			shadow: true
		});
		if (shallow) {
			nodes = $.clone(nodes, { deep: false });
			others = $.clone(others, { deep: false });
		}
		return nodes.some((node) => others.some((other) => node.isEqualNode(other)));
	}
	/**
	* Checks whether any of the nodes or a parent of any of the nodes is "fixed".
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @returns {boolean} Whether any of the nodes is "fixed".
	*/
	function isFixed$1(selector) {
		return parseNodes(selector, { node: true }).some((node) => isElement(node) && css$1(node, "position") === "fixed" || closest$1(node, (parent) => isElement(parent) && css$1(parent, "position") === "fixed").length);
	}
	/**
	* Checks whether any of the nodes is hidden.
	* @param {QueryInput} selector The input node(s), or a query selector string.
	* @returns {boolean} Whether any of the nodes is hidden.
	*/
	function isHidden$1(selector) {
		return parseNodes(selector, {
			node: true,
			document: true,
			window: true
		}).some((node) => {
			if (isWindow(node)) return node.document.visibilityState !== "visible";
			if (isDocument(node)) return node.visibilityState !== "visible";
			return !node.offsetParent;
		});
	}
	/**
	* Checks whether any of the nodes is considered identical to any of the other nodes.
	* @param {NodeInput} selector The input node(s), or a query selector string.
	* @param {NodeInput} otherSelector The other node(s), or a query selector string.
	* @returns {boolean} Whether any of the nodes is considered identical to any of the other nodes.
	*/
	function isSame$1(selector, otherSelector) {
		const others = parseNodes(otherSelector, {
			node: true,
			fragment: true,
			shadow: true
		});
		return parseNodes(selector, {
			node: true,
			fragment: true,
			shadow: true
		}).some((node) => others.some((other) => node.isSameNode(other)));
	}
	/**
	* Checks whether any of the nodes is visible.
	* @param {QueryInput} selector The input node(s), or a query selector string.
	* @returns {boolean} Whether any of the nodes is visible.
	*/
	function isVisible$1(selector) {
		return parseNodes(selector, {
			node: true,
			document: true,
			window: true
		}).some((node) => {
			if (isWindow(node)) return node.document.visibilityState === "visible";
			if (isDocument(node)) return node.visibilityState === "visible";
			return node.offsetParent;
		});
	}
	/** @import { NodeFilterInput } from '../../filters.js'; */
	/** @import { NodeInput } from '../../helpers.js'; */
	/** @import QuerySet from '../query-set.js'; */
	/**
	* Checks whether any of the nodes has an animation.
	* @returns {boolean} Whether any of the nodes has an animation.
	*/
	function hasAnimation() {
		return hasAnimation$1(this);
	}
	/**
	* Checks whether any of the nodes has a specified attribute.
	* @param {string} attribute The attribute name.
	* @returns {boolean} Whether any of the nodes has the attribute.
	*/
	function hasAttribute(attribute) {
		return hasAttribute$1(this, attribute);
	}
	/**
	* Checks whether any of the nodes has child nodes.
	* @returns {boolean} Whether any of the nodes has child nodes.
	*/
	function hasChildren() {
		return hasChildren$1(this);
	}
	/**
	* Checks whether any of the nodes has any of the specified classes.
	* @param {...string|string[]} classes The classes.
	* @returns {boolean} Whether any of the nodes has any of the classes.
	*/
	function hasClass(...classes) {
		return hasClass$1(this, ...classes);
	}
	/**
	* Checks whether any of the nodes has a CSS animation.
	* @returns {boolean} Whether any of the nodes has a CSS animation.
	*/
	function hasCSSAnimation() {
		return hasCSSAnimation$1(this);
	}
	/**
	* Checks whether any of the nodes has a CSS transition.
	* @returns {boolean} Whether any of the nodes has a CSS transition.
	*/
	function hasCSSTransition() {
		return hasCSSTransition$1(this);
	}
	/**
	* Checks whether any of the nodes has custom data.
	* @param {string} [key] The data key.
	* @returns {boolean} Whether any of the nodes has custom data.
	*/
	function hasData(key) {
		return hasData$1(this, key);
	}
	/**
	* Checks whether any of the nodes has the specified dataset value.
	* @param {string} [key] The dataset key.
	* @returns {boolean} Whether any of the nodes has the dataset value.
	*/
	function hasDataset(key) {
		return hasDataset$1(this, key);
	}
	/**
	* Checks whether any of the nodes contains a descendant matching a filter.
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @returns {boolean} Whether any of the nodes contains a descendant matching the filter.
	*/
	function hasDescendent(nodeFilter) {
		return hasDescendent$1(this, nodeFilter);
	}
	/**
	* Checks whether any of the nodes has a DocumentFragment.
	* @returns {boolean} Whether any of the nodes has a DocumentFragment.
	*/
	function hasFragment() {
		return hasFragment$1(this);
	}
	/**
	* Checks whether any of the nodes has a specified property.
	* @param {string} property The property name.
	* @returns {boolean} Whether any of the nodes has the property.
	*/
	function hasProperty(property) {
		return hasProperty$1(this, property);
	}
	/**
	* Checks whether any of the nodes has a ShadowRoot.
	* @returns {boolean} Whether any of the nodes has a ShadowRoot.
	*/
	function hasShadow() {
		return hasShadow$1(this);
	}
	/**
	* Checks whether any of the nodes matches a filter.
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @returns {boolean} Whether any of the nodes matches the filter.
	*/
	function is(nodeFilter) {
		return is$1(this, nodeFilter);
	}
	/**
	* Checks whether any of the nodes is connected to the DOM.
	* @returns {boolean} Whether any of the nodes is connected to the DOM.
	*/
	function isConnected() {
		return isConnected$1(this);
	}
	/**
	* Checks whether any of the nodes is considered equal to any of the other nodes.
	* @param {NodeInput} otherSelector The other node(s), or a query selector string.
	* @param {{shallow?: boolean}} [options] The comparison options.
	* @returns {boolean} Whether any of the nodes is considered equal to any of the other nodes.
	*/
	function isEqual(otherSelector, { shallow = false } = {}) {
		return isEqual$1(this, otherSelector, { shallow });
	}
	/**
	* Checks whether any of the elements or a parent of any of the elements is "fixed".
	* @returns {boolean} Whether any of the nodes is "fixed".
	*/
	function isFixed() {
		return isFixed$1(this);
	}
	/**
	* Checks whether any of the nodes is hidden.
	* @returns {boolean} Whether any of the nodes is hidden.
	*/
	function isHidden() {
		return isHidden$1(this);
	}
	/**
	* Checks whether any of the nodes is considered identical to any of the other nodes.
	* @param {NodeInput} otherSelector The other node(s), or a query selector string.
	* @returns {boolean} Whether any of the nodes is considered identical to any of the other nodes.
	*/
	function isSame(otherSelector) {
		return isSame$1(this, otherSelector);
	}
	/**
	* Checks whether any of the nodes is visible.
	* @returns {boolean} Whether any of the nodes is visible.
	*/
	function isVisible() {
		return isVisible$1(this);
	}
	/** @import { NodeFilterInput } from '../../filters.js'; */
	/** @import { QueryContextInput } from '../../traversal/find.js'; */
	/** @import { QueryInput } from '../../helpers.js'; */
	/**
	* Merges with new nodes and sorts the results.
	* @param {QueryInput} selector The input selector.
	* @param {QueryContextInput} [context] The context to search in.
	* @returns {QuerySet} The QuerySet object.
	*/
	function add(selector, context = null) {
		const otherNodes = parseNodes(selector, {
			node: true,
			fragment: true,
			shadow: true,
			document: true,
			window: true,
			html: true,
			context: context || getContext()
		});
		return new QuerySet(sort$1(unique(merge([], this.get(), otherNodes))));
	}
	/**
	* Reduces the set of nodes to the one at the specified index.
	* @param {number} index The index of the node.
	* @returns {QuerySet} The QuerySet object.
	*/
	function eq(index) {
		const node = this.get(index);
		return new QuerySet(node ? [node] : []);
	}
	/**
	* Reduces the set of nodes to the first.
	* @returns {QuerySet} The QuerySet object.
	*/
	function first() {
		return this.eq(0);
	}
	/**
	* Gets the index of the first node relative to its parent node.
	* @returns {number|undefined} The index, or `undefined` if no node or parent matches.
	*/
	function index() {
		return index$1(this);
	}
	/**
	* Gets the index of the first node matching a filter.
	* @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
	* @returns {number} The index.
	*/
	function indexOf(nodeFilter) {
		return indexOf$1(this, nodeFilter);
	}
	/**
	* Reduces the set of nodes to the last.
	* @returns {QuerySet} The QuerySet object.
	*/
	function last() {
		return this.eq(-1);
	}
	/**
	* Normalizes nodes (remove empty text nodes, and join adjacent text nodes).
	* @returns {QuerySet} The QuerySet object.
	*/
	function normalize() {
		normalize$1(this);
		return this;
	}
	/**
	* Returns a serialized string containing names and values of all form nodes.
	* @returns {string} The serialized string.
	*/
	function serialize() {
		return serialize$1(this);
	}
	/**
	* Returns a serialized array containing names and values of all form nodes.
	* @returns {Array<{name: string, value: string}>} The serialized entries.
	*/
	function serializeArray() {
		return serializeArray$1(this);
	}
	/**
	* Sorts nodes by their position in the document.
	* @returns {QuerySet} The QuerySet object.
	*/
	function sort() {
		return new QuerySet(sort$1(this));
	}
	/**
	* Returns the tag name (lowercase) of the first node.
	* @returns {string|undefined} The node's lowercase tag name, or `undefined` if no element matches.
	*/
	function tagName() {
		return tagName$1(this);
	}
	var methods = {
		add,
		addClass,
		addEvent,
		addEventDelegate,
		addEventDelegateOnce,
		addEventOnce,
		after,
		afterSelection,
		animate,
		append,
		appendTo,
		attachShadow,
		before,
		beforeSelection,
		blur,
		center,
		child,
		children,
		clearQueue,
		click,
		clone,
		cloneData,
		cloneEvents,
		closest,
		commonAncestor,
		connected,
		constrain,
		contents,
		css,
		delay,
		detach,
		distTo,
		distToNode,
		dropIn,
		dropOut,
		empty,
		eq,
		equal,
		fadeIn,
		fadeOut,
		filter,
		filterOne,
		find,
		findByClass,
		findById,
		findByTag,
		findOne,
		findOneByClass,
		findOneById,
		findOneByTag,
		first,
		fixed,
		focus,
		fragment,
		getAttribute,
		getData,
		getDataset: getDataset$2,
		getHTML,
		getProperty,
		getScrollX,
		getScrollY,
		getStyle,
		getText,
		getValue,
		hasAnimation,
		hasAttribute,
		hasChildren,
		hasClass,
		hasCSSAnimation,
		hasCSSTransition,
		hasData,
		hasDataset,
		hasDescendent,
		hasFragment,
		hasProperty,
		hasShadow,
		height,
		hidden,
		hide,
		index,
		indexOf,
		insertAfter,
		insertBefore,
		is,
		isConnected,
		isEqual,
		isFixed,
		isHidden,
		isSame,
		isVisible,
		last,
		nearestTo,
		nearestToNode,
		next,
		nextAll,
		normalize,
		not,
		notOne,
		offsetParent,
		parent,
		parents,
		percentX,
		percentY,
		position,
		prepend,
		prependTo,
		prev,
		prevAll,
		queue,
		rect,
		remove,
		removeAttribute,
		removeClass,
		removeData,
		removeDataset,
		removeEvent,
		removeEventDelegate,
		removeProperty,
		removeStyle,
		replaceAll,
		replaceWith,
		rotateIn,
		rotateOut,
		same,
		select,
		selectAll,
		serialize,
		serializeArray,
		setAttribute,
		setData,
		setDataset,
		setHTML,
		setProperty,
		setScroll,
		setScrollX,
		setScrollY,
		setStyle,
		setText,
		setValue,
		shadow,
		show,
		siblings,
		slideIn,
		slideOut,
		sort,
		squeezeIn,
		squeezeOut,
		stop,
		tagName,
		toggle,
		toggleClass,
		triggerEvent,
		triggerOne,
		unwrap,
		visible,
		width,
		withAnimation,
		withAttribute,
		withChildren,
		withClass,
		withCSSAnimation,
		withCSSTransition,
		withData,
		withDescendent,
		withProperty,
		wrap: wrap$1,
		wrapAll,
		wrapInner,
		wrapSelection
	};
	for (const [name, method] of Object.entries(methods)) Object.defineProperty(QuerySet.prototype, name, {
		configurable: true,
		enumerable: false,
		value: method,
		writable: true
	});
	var query_set_default = QuerySet;
	/** @import { QueryContextInput } from '../traversal/find.js'; */
	/** @import { QueryInput } from '../helpers.js'; */
	/**
	* Adds a function to the ready queue or returns a QuerySet.
	* @param {(() => void)|QueryInput} selector The ready callback or input selector.
	* @param {QueryContextInput} [context] The context to search in.
	* @returns {QuerySet|undefined} A new QuerySet, or `undefined` when registering a ready callback.
	*/
	function query(selector, context = null) {
		if (isFunction(selector)) return ready(selector);
		return new query_set_default(parseNodes(selector, {
			node: true,
			fragment: true,
			shadow: true,
			document: true,
			window: true,
			html: true,
			context: context || getContext()
		}));
	}
	/**
	* Returns a QuerySet for the first node.
	* @param {QueryInput} selector The input selector.
	* @param {QueryContextInput} [context] The context to search in.
	* @returns {QuerySet} The new QuerySet object.
	*/
	function queryOne(selector, context = null) {
		const node = parseNode(selector, {
			node: true,
			fragment: true,
			shadow: true,
			document: true,
			window: true,
			html: true,
			context: context || getContext()
		});
		return new query_set_default(node ? [node] : []);
	}
	/** @typedef {Record<string, *>} ScriptAttributes */
	/** @typedef {string|ScriptAttributes} ScriptSource */
	/**
	* @typedef {object} ScriptLoadOptions
	* @property {boolean} [cache=true] Whether to cache the request.
	* @property {Document} [context] The document context. Defaults to the configured context.
	*/
	/**
	* Checks whether a boolean attribute should be enabled.
	* @param {*} value The attribute value.
	* @returns {boolean} True if the attribute should be enabled.
	*/
	function isEnabled(value) {
		return value !== false && value !== null && typeof value !== "undefined";
	}
	/**
	* Applies a script attribute if it should be serialized.
	* @param {HTMLScriptElement} script The script element.
	* @param {string} key The attribute key.
	* @param {*} value The attribute value.
	*/
	function setScriptAttribute(script, key, value) {
		if (key === "async" || !isEnabled(value)) return;
		script.setAttribute(key, value === true ? "" : value);
	}
	/**
	* Loads and executes a JavaScript file.
	* @param {string|null} url The URL of the script.
	* @param {ScriptAttributes} [attributes] Additional attributes to set on the script element.
	* @param {ScriptLoadOptions} [options] The loading options.
	* @returns {Promise<void>} A promise that resolves when the script loads, or rejects on failure.
	*/
	function loadScript(url, attributes, { cache = true, context = getContext() } = {}) {
		attributes = {
			src: url,
			type: "text/javascript",
			...attributes
		};
		if (!cache) attributes.src = appendQueryString(attributes.src, "_", Date.now());
		const script = context.createElement("script");
		script.async = "async" in attributes ? isEnabled(attributes.async) : false;
		for (const [key, value] of Object.entries(attributes)) setScriptAttribute(script, key, value);
		context.head.appendChild(script);
		return new Promise((resolve, reject) => {
			script.onload = (_) => resolve();
			script.onerror = (error) => reject(error);
		});
	}
	/**
	* Loads and executes multiple JavaScript files (in order).
	* @param {ScriptSource[]} urls The script URLs or attribute objects.
	* @param {ScriptLoadOptions} [options] The loading options.
	* @returns {Promise<void[]>} A promise that resolves when every script loads, or rejects on failure.
	*/
	function loadScripts(urls, { cache = true, context = getContext() } = {}) {
		return Promise.all(urls.map((url) => isString(url) ? loadScript(url, null, {
			cache,
			context
		}) : loadScript(null, url, {
			cache,
			context
		})));
	}
	/** @typedef {Record<string, *>} StyleAttributes */
	/** @typedef {string|StyleAttributes} StyleSource */
	/**
	* @typedef {object} StyleLoadOptions
	* @property {boolean} [cache=true] Whether to cache the request.
	* @property {Document} [context] The document context. Defaults to the configured context.
	*/
	/**
	* Imports a CSS stylesheet.
	* @param {string|null} url The URL of the stylesheet.
	* @param {StyleAttributes} [attributes] Additional attributes to set on the link element.
	* @param {StyleLoadOptions} [options] The loading options.
	* @returns {Promise<void>} A promise that resolves when the stylesheet loads, or rejects on failure.
	*/
	function loadStyle(url, attributes, { cache = true, context = getContext() } = {}) {
		attributes = {
			href: url,
			rel: "stylesheet",
			...attributes
		};
		if (!cache) attributes.href = appendQueryString(attributes.href, "_", Date.now());
		const link = context.createElement("link");
		for (const [key, value] of Object.entries(attributes)) link.setAttribute(key, value);
		context.head.appendChild(link);
		return new Promise((resolve, reject) => {
			link.onload = (_) => resolve();
			link.onerror = (error) => reject(error);
		});
	}
	/**
	* Imports multiple CSS stylesheets.
	* @param {StyleSource[]} urls The stylesheet URLs or attribute objects.
	* @param {StyleLoadOptions} [options] The loading options.
	* @returns {Promise<void[]>} A promise that resolves when every stylesheet loads, or rejects on failure.
	*/
	function loadStyles(urls, { cache = true, context = getContext() } = {}) {
		return Promise.all(urls.map((url) => isString(url) ? loadStyle(url, null, {
			cache,
			context
		}) : loadStyle(null, url, {
			cache,
			context
		})));
	}
	/** @typedef {Record<string, Array<string|RegExp>>} AllowedTags */
	/**
	* Sanitizes a HTML string.
	* @param {string} html The input HTML string.
	* @param {AllowedTags} [allowedTags] The allowed tags and attributes.
	* @returns {string} The sanitized HTML string.
	*/
	function sanitize(html, allowedTags$1 = allowedTags) {
		const template = getContext().createElement("template");
		template.innerHTML = html;
		const fragment = template.content;
		const childNodes = merge([], fragment.children);
		for (const child of childNodes) sanitizeNode(child, allowedTags$1);
		return template.innerHTML;
	}
	/**
	* Checks whether an attribute is allowed.
	* @param {Attr} attribute The input attribute.
	* @param {Array<string|RegExp>} allowedAttributes The allowed attributes.
	* @returns {boolean} Whether the attribute is allowed.
	*/
	function isAllowedAttribute(attribute, allowedAttributes) {
		const name = attribute.nodeName.toLowerCase();
		const isAllowed = allowedAttributes.some((test) => typeof test === "string" ? test === name : test instanceof RegExp && test.test(name));
		if (!isAllowed || !uriAttributes.has(name)) return isAllowed;
		try {
			const { URL } = getWindow();
			return new URL(attribute.nodeValue, getContext().baseURI).protocol !== "javascript:";
		} catch {
			return false;
		}
	}
	/**
	* Sanitizes a single node.
	* @param {Element} node The input node.
	* @param {AllowedTags} [allowedTags] The allowed tags and attributes.
	*/
	function sanitizeNode(node, allowedTags$2 = allowedTags) {
		const name = node.tagName.toLowerCase();
		if (!Object.hasOwn(allowedTags$2, name)) {
			node.remove();
			return;
		}
		const allowedAttributes = [];
		if (Object.hasOwn(allowedTags$2, "*")) allowedAttributes.push(...allowedTags$2["*"]);
		allowedAttributes.push(...allowedTags$2[name]);
		const attributes = merge([], node.attributes);
		for (const attribute of attributes) if (!isAllowedAttribute(attribute, allowedAttributes)) node.removeAttribute(attribute.nodeName);
		const childNodes = merge([], node.children);
		for (const child of childNodes) sanitizeNode(child, allowedTags$2);
	}
	Object.assign(query, {
		BORDER_BOX: 2,
		CONTENT_BOX: 0,
		MARGIN_BOX: 3,
		PADDING_BOX: 1,
		SCROLL_BOX: 4,
		Animation,
		AnimationSet,
		QuerySet: query_set_default,
		addClass: addClass$1,
		addEvent: addEvent$1,
		addEventDelegate: addEventDelegate$1,
		addEventDelegateOnce: addEventDelegateOnce$1,
		addEventOnce: addEventOnce$1,
		after: after$1,
		afterSelection: afterSelection$1,
		ajax,
		animate: animate$1,
		append: append$1,
		appendTo: appendTo$1,
		attachShadow: attachShadow$1,
		before: before$1,
		beforeSelection: beforeSelection$1,
		blur: blur$1,
		center: center$1,
		child: child$1,
		children: children$1,
		clearQueue: clearQueue$1,
		click: click$1,
		clone: clone$1,
		cloneData: cloneData$1,
		cloneEvents: cloneEvents$1,
		closest: closest$1,
		commonAncestor: commonAncestor$1,
		connected: connected$1,
		constrain: constrain$1,
		contents: contents$1,
		create,
		createComment,
		createFragment,
		createRange,
		createText,
		css: css$1,
		debounce,
		delete: _delete,
		detach: detach$1,
		distTo: distTo$1,
		distToNode: distToNode$1,
		dropIn: dropIn$1,
		dropOut: dropOut$1,
		empty: empty$1,
		equal: equal$1,
		exec,
		extractSelection,
		fadeIn: fadeIn$1,
		fadeOut: fadeOut$1,
		filter: filter$1,
		filterOne: filterOne$1,
		find: find$1,
		findByClass: findByClass$1,
		findById: findById$1,
		findByTag: findByTag$1,
		findOne: findOne$1,
		findOneByClass: findOneByClass$1,
		findOneById: findOneById$1,
		findOneByTag: findOneByTag$1,
		fixed: fixed$1,
		focus: focus$1,
		fragment: fragment$1,
		get,
		getAjaxDefaults,
		getAnimationDefaults,
		getAttribute: getAttribute$1,
		getContext,
		getCookie,
		getData: getData$1,
		getDataset: getDataset$1,
		getHTML: getHTML$1,
		getProperty: getProperty$1,
		getScrollX: getScrollX$1,
		getScrollY: getScrollY$1,
		getSelection,
		getStyle: getStyle$1,
		getText: getText$1,
		getValue: getValue$1,
		getWindow,
		hasAnimation: hasAnimation$1,
		hasAttribute: hasAttribute$1,
		hasCSSAnimation: hasCSSAnimation$1,
		hasCSSTransition: hasCSSTransition$1,
		hasChildren: hasChildren$1,
		hasClass: hasClass$1,
		hasData: hasData$1,
		hasDataset: hasDataset$1,
		hasDescendent: hasDescendent$1,
		hasFragment: hasFragment$1,
		hasProperty: hasProperty$1,
		hasShadow: hasShadow$1,
		height: height$1,
		hidden: hidden$1,
		hide: hide$1,
		index: index$1,
		indexOf: indexOf$1,
		insertAfter: insertAfter$1,
		insertBefore: insertBefore$1,
		is: is$1,
		isConnected: isConnected$1,
		isEqual: isEqual$1,
		isFixed: isFixed$1,
		isHidden: isHidden$1,
		isSame: isSame$1,
		isVisible: isVisible$1,
		loadScript,
		loadScripts,
		loadStyle,
		loadStyles,
		mouseDragFactory,
		nearestTo: nearestTo$1,
		nearestToNode: nearestToNode$1,
		next: next$1,
		nextAll: nextAll$1,
		noConflict,
		normalize: normalize$1,
		not: not$1,
		notOne: notOne$1,
		offsetParent: offsetParent$1,
		parent: parent$1,
		parents: parents$1,
		parseDocument,
		parseFormData,
		parseHTML,
		parseParams,
		patch,
		percentX: percentX$1,
		percentY: percentY$1,
		position: position$1,
		post,
		prepend: prepend$1,
		prependTo: prependTo$1,
		prev: prev$1,
		prevAll: prevAll$1,
		put,
		query,
		queryOne,
		queue: queue$1,
		ready,
		rect: rect$1,
		remove: remove$1,
		removeAttribute: removeAttribute$1,
		removeClass: removeClass$1,
		removeCookie,
		removeData: removeData$1,
		removeDataset: removeDataset$1,
		removeEvent: removeEvent$1,
		removeEventDelegate: removeEventDelegate$1,
		removeProperty: removeProperty$1,
		removeStyle: removeStyle$1,
		replaceAll: replaceAll$1,
		replaceWith: replaceWith$1,
		rotateIn: rotateIn$1,
		rotateOut: rotateOut$1,
		same: same$1,
		sanitize,
		select: select$1,
		selectAll: selectAll$1,
		serialize: serialize$1,
		serializeArray: serializeArray$1,
		setAjaxDefaults,
		setAnimationDefaults,
		setAttribute: setAttribute$1,
		setContext,
		setCookie,
		setData: setData$1,
		setDataset: setDataset$1,
		setHTML: setHTML$1,
		setProperty: setProperty$1,
		setScroll: setScroll$1,
		setScrollX: setScrollX$1,
		setScrollY: setScrollY$1,
		setStyle: setStyle$1,
		setText: setText$1,
		setValue: setValue$1,
		setWindow,
		shadow: shadow$1,
		show: show$1,
		siblings: siblings$1,
		slideIn: slideIn$1,
		slideOut: slideOut$1,
		sort: sort$1,
		squeezeIn: squeezeIn$1,
		squeezeOut: squeezeOut$1,
		stop: stop$1,
		tagName: tagName$1,
		toggle: toggle$1,
		toggleClass: toggleClass$1,
		triggerEvent: triggerEvent$1,
		triggerOne: triggerOne$1,
		unwrap: unwrap$1,
		useTimeout,
		visible: visible$1,
		width: width$1,
		withAnimation: withAnimation$1,
		withAttribute: withAttribute$1,
		withCSSAnimation: withCSSAnimation$1,
		withCSSTransition: withCSSTransition$1,
		withChildren: withChildren$1,
		withClass: withClass$1,
		withData: withData$1,
		withDescendent: withDescendent$1,
		withProperty: withProperty$1,
		wrap: wrap$2,
		wrapAll: wrapAll$1,
		wrapInner: wrapInner$1,
		wrapSelection: wrapSelection$1
	});
	for (const [key, value] of Object.entries(frost_core_esm_exports)) query[`_${key}`] = value;
	var fquery_default = query;
	var register = (window, document) => registerGlobals(window, document, fquery_default);
	var src_default = isWindow(globalThis) ? register(globalThis) : register;

//#endregion
//#region src/js/globals.js
	var $$1;
	if (src_default !== src_default.query) $$1 = src_default(globalThis);
	else $$1 = src_default;
	if (!("fQuery" in globalThis)) globalThis.fQuery = $$1;
	var document = $$1.getContext();
	var window$1 = $$1.getWindow();

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
			const id = `${prefix}${$$1._randomString(5)}`;
			if ($$1.findOneById(id)) continue;
			return id;
		}
	}
	/**
	* Gets normalized UI data attributes from an element.
	* @param {HTMLElement} node The input node.
	* @returns {Record<string, *>} The normalized data.
	*/
	function getDataset(node) {
		const dataset = $$1.getDataset(node);
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
		Object.defineProperty($$1.QuerySet.prototype, key, {
			configurable: true,
			enumerable: false,
			value(a, ...args) {
				let settings;
				let method;
				let firstResult;
				if ($$1._isObject(a)) settings = a;
				else if ($$1._isString(a)) method = a;
				for (const [index, node] of this.get().entries()) {
					if (!$$1._isElement(node)) continue;
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
		if (selector && selector !== "#") target = $$1.findOne(selector);
		else if (closestSelector) target = $$1.closest(node, closestSelector).shift();
		if (!target) throw new Error("Target not found");
		return target;
	}
	/**
	* Gets the target selector declared by a control.
	* @param {HTMLElement} node The input node.
	* @returns {string|null} The target selector, or `null` if none is declared.
	*/
	function getTargetSelector(node) {
		return $$1.getDataset(node, "uiTarget") || $$1.getAttribute(node, "href");
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
			return $$1.hasData(node, this.DATA_KEY) ? $$1.getData(node, this.DATA_KEY) : new this(node, ...args);
		}
		/**
		* Creates a BaseComponent.
		* @param {HTMLElement} node The input node.
		* @param {Options} [options] The component options.
		*/
		constructor(node, options) {
			this.#node = node;
			this.#options = Object.freeze($$1._extend({}, this.constructor.defaults, getDataset(this.#node), options));
			$$1.addEvent(this.#node, this.constructor.REMOVE_EVENT, (_) => {
				this.dispose();
			});
			$$1.setData(this.#node, { [this.constructor.DATA_KEY]: this });
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
			$$1.removeEvent(this.#node, this.constructor.REMOVE_EVENT);
			$$1.removeData(this.#node, this.constructor.DATA_KEY);
			this.#node = null;
			this.#options = null;
		}
	};

//#endregion
//#region src/js/helpers/transition.js
/**
	* Waits for an element's CSS transitions to finish or be canceled.
	* @template {Record<string, *>} [Data=Record<string, *>]
	* @param {HTMLElement} node The transitioning node.
	* @param {string[]} [properties=[]] The transition properties to wait for.
	* @param {Data} [data={}] Additional data to include in the transition result.
	* @returns {Promise<Data & {completed: boolean, node: HTMLElement}>} The transition result.
	*/
	function waitForTransition(node, properties = [], data = {}) {
		const transitions = node.getAnimations().filter((animation) => animation instanceof window$1.CSSTransition && (!properties.length || properties.includes(animation.transitionProperty)));
		return Promise.allSettled(transitions.map((transition) => transition.finished)).then((results) => ({
			...data,
			completed: results.every((result) => result.status === "fulfilled"),
			node
		}));
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
			if (this.#transitioning || !$$1.triggerOne(this.node, "close.ui.alert")) return;
			this.#transitioning = true;
			$$1.css(this.node, "opacity");
			$$1.removeClass(this.node, "show");
			waitForTransition(this.node, ["opacity"]).then(({ node }) => {
				$$1.detach(node);
				$$1.triggerEvent(node, "closed.ui.alert");
				$$1.remove(node);
				this.#transitioning = false;
			});
		}
	};

//#endregion
//#region src/js/alert/index.js
	initComponent("alert", Alert);
	$$1.addEventDelegate(document, "click.ui.alert", "[data-ui-dismiss=\"alert\"]", (e) => {
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
			$$1.toggleClass(this.node, "active");
			const active = $$1.hasClass(this.node, "active");
			$$1.setAttribute(this.node, { "aria-pressed": active });
		}
	};

//#endregion
//#region src/js/button/index.js
	initComponent("button", Button);
	$$1.addEventDelegate(document, "click.ui.button keydown.ui.button", "[data-ui-toggle=\"button\"]", (e) => {
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
			this.#rtl = $$1.css(this.node, "direction") === "rtl";
			this.#items = $$1.find(".carousel-item", this.node);
			this.#index = this.#items.findIndex((item) => $$1.hasClass(item, "active"));
			this.#sliding = false;
			this.#events();
			if (this.options.ride === "carousel") this.#setTimer();
		}
		/**
		* Advances the carousel automatically when the document is visible.
		*/
		cycle() {
			if (!$$1.isHidden(document)) this.slide(1);
			else {
				this.#paused = false;
				this.#setTimer();
			}
		}
		/** @inheritdoc */
		dispose() {
			$$1.setStyle(this.node, { "--ui-carousel-transition-scale": "" });
			if (this.#sliding) $$1.removeClass(this.node, "carousel-dragging");
			for (const item of this.#items) this.#resetStyles(item);
			if (this.options.keyboard) $$1.removeEvent(this.node, "keydown.ui.carousel");
			if (this.options.pause) {
				$$1.removeEvent(this.node, "mouseenter.ui.carousel");
				$$1.removeEvent(this.node, "mouseleave.ui.carousel");
			}
			if (this.options.swipe) $$1.removeEvent(this.node, "mousedown.ui.carousel touchstart.ui.carousel");
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
				$$1.addEvent(this.node, "keydown.ui.carousel", (e) => {
					const target = e.target;
					if ($$1.is(target, "input, select")) return;
					if (!["ArrowLeft", "ArrowRight"].includes(e.code)) return;
					e.preventDefault();
					if (e.code === previousKey) this.prev();
					else this.next();
				});
			}
			if (this.options.pause) {
				$$1.addEvent(this.node, "mouseenter.ui.carousel", (_) => {
					this.#mousePaused = true;
					this.pause();
				});
				$$1.addEvent(this.node, "mouseleave.ui.carousel", (_) => {
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
					if (e.button || this.#sliding || !$$1.is(e.target, ":disabled, .disabled") && ($$1.is(e.target, "[data-ui-slide-to], [data-ui-slide], a, button, input, textarea, select") || $$1.closest(e.target, "[data-ui-slide], a, button", (parent) => $$1.isSame(parent, this.node) || $$1.is(parent, ":disabled, .disabled")).length)) return false;
					this.pause();
					this.#sliding = true;
					$$1.addClass(this.node, "carousel-dragging");
					startX = getPosition(e).x;
					index = null;
					progress = 0;
					direction = null;
				};
				const moveEvent = (e) => {
					if (!this.node) return;
					const currentX = getPosition(e).x;
					const scrollX = $$1.width(this.node) / 2;
					let inlineDiffX = currentX - startX;
					if (this.#rtl) inlineDiffX *= -1;
					if (!this.options.wrap) inlineDiffX = $$1._clamp(inlineDiffX, -(this.#items.length - 1 - this.#index) * scrollX, this.#index * scrollX);
					progress = $$1._map(Math.abs(inlineDiffX), 0, scrollX, 0, 1);
					do {
						const lastIndex = index;
						if (inlineDiffX < 0) index = this.#index + 1;
						else if (inlineDiffX > 0) index = this.#index - 1;
						else {
							this.#resetStyles(this.#items[this.#index]);
							if (lastIndex !== null) this.#resetStyles(this.#items[lastIndex]);
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
							if (lastIndex !== null && lastIndex !== this.#index) this.#resetStyles(this.#items[lastIndex]);
							progress--;
						} else {
							this.#update(this.#items[index], this.#items[this.#index], progress, {
								direction,
								dragging: true
							});
							if (lastIndex !== null && lastIndex !== index) this.#resetStyles(this.#items[lastIndex]);
						}
					} while (progress > 1);
				};
				const upEvent = (_) => {
					if (!this.node) return;
					if (index === null || index === this.#index) {
						$$1.removeClass(this.node, "carousel-dragging");
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
					$$1.addClass(nodeOut, transitionClass);
					$$1.setStyle(this.node, { "--ui-carousel-transition-scale": progressRemaining });
					$$1.removeClass(this.node, "carousel-dragging");
					$$1.css(nodeIn, "transform");
					$$1.setStyle([nodeIn, nodeOut], { transform: "" });
					Promise.all([waitForTransition(nodeIn, ["transform"], {
						carousel: this.node,
						index: this.#index,
						nodeOut,
						transitionClass
					}), waitForTransition(nodeOut, ["transform"])]).then(([{ carousel, index, node: nodeIn, transitionClass }, { node: nodeOut }]) => {
						this.#sliding = false;
						$$1.removeClass(nodeOut, transitionClass);
						this.#resetStyles(nodeIn);
						this.#resetStyles(nodeOut);
						this.#updateIndicators(carousel, index);
						if (this.node) {
							this.#paused = false;
							this.#setTimer();
							$$1.setStyle(this.node, { "--ui-carousel-transition-scale": "" });
						}
					});
				};
				const dragEvent = $$1.mouseDragFactory(downEvent, moveEvent, upEvent);
				$$1.addEvent(this.node, "mousedown.ui.carousel touchstart.ui.carousel", dragEvent);
			}
		}
		/**
		* Resets the transition styles of an item.
		* @param {HTMLElement} node The carousel item.
		*/
		#resetStyles(node) {
			$$1.setStyle(node, {
				display: "",
				transform: ""
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
			$$1.addClass(this.#items[this.#index], "active");
			$$1.removeClass(this.#items[oldIndex], "active");
			return oldIndex;
		}
		/**
		* Schedules the next automatic cycle.
		*/
		#setTimer() {
			if (this.#timer || this.#paused || this.#mousePaused) return;
			const interval = $$1.getDataset(this.#items[this.#index], "uiInterval");
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
			if (!$$1.triggerOne(this.node, "slide.ui.carousel", { data: eventData })) return;
			this.#sliding = true;
			this.pause();
			const nodeIn = this.#items[index];
			const nodeOut = this.#items[this.#index];
			const { enter, exit } = getTransitionClasses(direction);
			$$1.addClass(nodeIn, enter);
			$$1.css(nodeIn, "transform");
			this.#setIndex(index);
			$$1.addClass(nodeOut, exit);
			$$1.removeClass(nodeIn, enter);
			Promise.all([waitForTransition(nodeIn, ["transform"], {
				carousel: this.node,
				index: this.#index,
				transitionClass: exit
			}), waitForTransition(nodeOut, ["transform"])]).then(([{ carousel, index, node: nodeIn, transitionClass }, { node: nodeOut }]) => {
				this.#sliding = false;
				$$1.removeClass(nodeOut, transitionClass);
				this.#resetStyles(nodeIn);
				this.#resetStyles(nodeOut);
				this.#updateIndicators(carousel, index);
				if (this.node) {
					this.#paused = false;
					this.#setTimer();
				}
				$$1.triggerEvent(carousel, "slid.ui.carousel", { data: eventData });
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
			$$1.setStyle(nodeIn, inStyles);
			$$1.setStyle(nodeOut, outStyles);
		}
		/**
		* Updates the active carousel indicator.
		* @param {HTMLElement} [carousel] The carousel node.
		* @param {number} [index] The active item index.
		*/
		#updateIndicators(carousel = this.node, index = this.#index) {
			const oldIndicator = $$1.find(".active[data-ui-slide-to]", carousel);
			const newIndicator = $$1.find("[data-ui-slide-to=\"" + index + "\"]", carousel);
			$$1.removeClass(oldIndicator, "active");
			$$1.addClass(newIndicator, "active");
		}
	};

//#endregion
//#region src/js/carousel/index.js
	initComponent("carousel", Carousel);
	$$1((_) => {
		const nodes = $$1.find("[data-ui-ride=\"carousel\"]");
		for (const node of nodes) Carousel.init(node);
	});
	$$1.addEventDelegate(document, "click.ui.carousel", "[data-ui-slide]", (e) => {
		e.preventDefault();
		const target = getTarget(e.currentTarget, ".carousel");
		const carousel = Carousel.init(target);
		if ($$1.getDataset(e.currentTarget, "uiSlide") === "prev") carousel.prev();
		else carousel.next();
	});
	$$1.addEventDelegate(document, "click.ui.carousel", "[data-ui-slide-to]", (e) => {
		e.preventDefault();
		const target = getTarget(e.currentTarget, ".carousel");
		const carousel = Carousel.init(target);
		const slideTo = $$1.getDataset(e.currentTarget, "uiSlideTo");
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
		return $$1.hasClass(node, "collapse-horizontal") ? "width" : "height";
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
			this.#triggers = $$1.find("[data-ui-toggle=\"collapse\"]").filter((trigger) => {
				const selector = getTargetSelector(trigger);
				return selector && $$1.is(this.node, selector);
			});
			if (this.options.parent) this.#parent = $$1.closest(this.node, this.options.parent).shift();
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
			if (this.#transitioning || !$$1.hasClass(this.node, "show") || !$$1.triggerOne(this.node, "hide.ui.collapse")) return;
			this.#transitioning = true;
			const dimension = getDimension(this.node);
			$$1.setStyle(this.node, { [dimension]: $$1.rect(this.node)[dimension] });
			$$1.css(this.node, dimension);
			$$1.addClass(this.node, "collapsing");
			$$1.removeClass(this.node, "collapse show");
			$$1.addClass(this.#triggers, "collapsed");
			$$1.setStyle(this.node, { [dimension]: 0 });
			waitForTransition(this.node, [dimension], { triggers: this.#triggers }).then(({ node, triggers }) => {
				this.#transitioning = false;
				$$1.removeClass(node, "collapsing");
				$$1.addClass(node, "collapse");
				$$1.setStyle(node, { [dimension]: "" });
				$$1.setAttribute(triggers, { "aria-expanded": false });
				$$1.triggerEvent(node, "hidden.ui.collapse");
			});
		}
		/**
		* Shows the collapsible element.
		*/
		show() {
			if (this.#transitioning || $$1.hasClass(this.node, "show")) return;
			const collapses = [];
			if (this.#parent) {
				const siblings = $$1.find(".collapse.show", this.#parent);
				for (const sibling of siblings) {
					const collapse = this.constructor.init(sibling);
					if (!$$1.isSame(this.#parent, collapse.#parent)) continue;
					collapses.push(collapse);
				}
			}
			if (!$$1.triggerOne(this.node, "show.ui.collapse")) return;
			for (const collapse of collapses) collapse.hide();
			this.#transitioning = true;
			const dimension = getDimension(this.node);
			$$1.removeClass(this.node, "collapse");
			$$1.addClass(this.node, "collapsing");
			$$1.setStyle(this.node, { [dimension]: 0 });
			$$1.removeClass(this.#triggers, "collapsed");
			const size = $$1[dimension](this.node, { boxSize: $$1.SCROLL_BOX });
			$$1.setStyle(this.node, { [dimension]: size });
			waitForTransition(this.node, [dimension], { triggers: this.#triggers }).then(({ node, triggers }) => {
				this.#transitioning = false;
				$$1.removeClass(node, "collapsing");
				$$1.addClass(node, "collapse show");
				$$1.setStyle(node, { [dimension]: "" });
				$$1.setAttribute(triggers, { "aria-expanded": true });
				$$1.triggerEvent(node, "shown.ui.collapse");
			});
		}
		/**
		* Toggles the collapsible element.
		*/
		toggle() {
			if ($$1.hasClass(this.node, "show")) this.hide();
			else this.show();
		}
	};

//#endregion
//#region src/js/collapse/index.js
	initComponent("collapse", Collapse);
	$$1.addEventDelegate(document, "click.ui.collapse", "[data-ui-toggle=\"collapse\"]", (e) => {
		e.preventDefault();
		const selector = getTargetSelector(e.currentTarget);
		const collapses = $$1.find(selector).map((target) => Collapse.init(target));
		const show = !collapses.some((collapse) => $$1.hasClass(collapse.node, "show"));
		for (const collapse of collapses) if (show) collapse.show();
		else collapse.hide();
	});
	var collapse_default = Collapse;

//#endregion
//#region src/js/helpers/click-target.js
/** @type {EventTarget|null|undefined} */
	var clickTarget;
	$$1.addEvent(window$1, "mousedown.ui", (e) => {
		clickTarget = e.target;
	}, { capture: true });
	$$1.addEvent(window$1, "mouseup.ui", (_) => {
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
		const scrollSizeY = getScrollbarSize(window$1, document, "y");
		if (!scrollSizeY) return;
		for (const node of nodes) {
			$$1.setDataset(node, { uiPaddingRight: $$1.getStyle(node, "paddingRight") });
			$$1.setStyle(node, { paddingRight: `${scrollSizeY + parseInt($$1.css(node, "paddingRight"))}px` });
		}
	}
	/**
	* Calculates the browser scrollbar size.
	* @returns {number} The scrollbar size.
	*/
	function calculateScrollbarSize() {
		if (scrollbarSize) return scrollbarSize;
		const div = $$1.create("div", { style: {
			width: "100px",
			height: "100px",
			overflow: "scroll",
			position: "absolute",
			top: "-9999px"
		} });
		$$1.append(document.body, div);
		scrollbarSize = $$1.getProperty(div, "offsetWidth") - $$1.width(div);
		$$1.detach(div);
		return scrollbarSize;
	}
	/**
	* Gets the scrollbar size for an element and axis.
	* @param {HTMLElement|Window} [node=window] The viewport element or window.
	* @param {HTMLElement|Document} [scrollNode=document] The scrolling element or document.
	* @param {Axis} [axis='y'] The axis to measure.
	* @returns {number} The scrollbar size.
	*/
	function getScrollbarSize(node = window$1, scrollNode = document, axis) {
		const method = axis === "x" ? "width" : "height";
		const size = $$1[method](node);
		if ($$1[method](scrollNode, { boxSize: $$1.SCROLL_BOX }) > size) return calculateScrollbarSize();
		return 0;
	}
	/**
	* Gets the visible bounding rectangle of an element or window, excluding scrollbars.
	* @param {HTMLElement|Window} node The viewport element or window.
	* @param {HTMLElement|Document} scrollNode The scrolling element or document.
	* @returns {BoundingRect} The visible bounding rectangle.
	*/
	function getScrollContainer(node, scrollNode) {
		const isWindow = $$1._isWindow(node);
		const rect = isWindow ? getWindowContainer(node) : $$1.rect(node, { offset: true });
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
		const scrollX = $$1.getScrollX(node);
		const scrollY = $$1.getScrollY(node);
		const width = $$1.width(node);
		const height = $$1.height(node);
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
			$$1.setStyle(node, { paddingRight: $$1.getDataset(node, "uiPaddingRight") });
			$$1.removeDataset(node, "uiPaddingRight");
		}
	}

//#endregion
//#region src/js/popper/helpers.js
/** @import { BoundingRect } from '../helpers/scroll.js'; */
	/** @import Popper, { Direction, PhysicalDirection, Placement } from './popper.js'; */
	var poppers = /* @__PURE__ */ new Set();
	var running$1 = false;
	/**
	* Registers a popper for viewport and ancestor-scroll updates.
	* @param {Popper} popper The popper to register.
	*/
	function addPopper(popper) {
		poppers.add(popper);
		if (running$1) return;
		$$1.addEvent(window$1, "resize.ui.popper", $$1.debounce((_) => {
			for (const popper of poppers) popper.update();
		}));
		$$1.addEvent(document, "scroll.ui.popper", $$1.debounce((e) => {
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
		$$1.removeEvent(window$1, "resize.ui.popper");
		$$1.removeEvent(document, "scroll.ui.popper");
		running$1 = false;
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
			this.#rtl = $$1.css(this.options.reference, "direction") === "rtl";
			this.#placement = $$1.getDataset(this.node, "uiPlacement");
			this.#referencePlacement = $$1.getDataset(this.options.reference, "uiPlacement");
			this.#styles = Object.fromEntries([
				"position",
				"top",
				"right",
				"bottom",
				"left",
				"transform"
			].map((style) => [style, $$1.getStyle(this.node, style)]));
			if (this.options.arrow) this.#arrowStyles = Object.fromEntries([
				"position",
				"top",
				"right",
				"bottom",
				"left"
			].map((style) => [style, $$1.getStyle(this.options.arrow, style)]));
			$$1.setStyle(this.node, {
				position: "absolute",
				inset: "0 auto auto 0"
			});
			addPopper(this);
			this.update();
		}
		/** @inheritdoc */
		dispose() {
			if (this.#placement) $$1.setDataset(this.node, { uiPlacement: this.#placement });
			else $$1.removeDataset(this.node, "uiPlacement");
			if (this.#referencePlacement) $$1.setDataset(this.options.reference, { uiPlacement: this.#referencePlacement });
			else $$1.removeDataset(this.options.reference, "uiPlacement");
			$$1.setStyle(this.node, this.#styles);
			if (this.#arrowStyles) $$1.setStyle(this.options.arrow, this.#arrowStyles);
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
			return $$1._isDocument(target) || $$1.hasDescendent(target, this.node) || $$1.hasDescendent(target, this.options.reference);
		}
		/**
		* Updates the popper position.
		*/
		update() {
			if (!$$1.isConnected(this.node) || !$$1.isVisible(this.node)) return;
			$$1.setStyle(this.node, { transform: "" });
			if (this.options.beforeUpdate) this.options.beforeUpdate(this.node, this.options.reference);
			const nodeBox = $$1.rect(this.node, { offset: true });
			const referenceBox = $$1.rect(this.options.reference, { offset: true });
			const windowBox = getScrollContainer(window$1, document);
			const positionParent = $$1.offsetParent(this.node);
			const scrollParent = positionParent ? $$1.closest(this.node, (parent) => ($$1.isSame(parent, positionParent) || $$1.hasDescendent(parent, positionParent)) && [
				"overflow",
				"overflowX",
				"overflowY"
			].some((property) => ["auto", "scroll"].includes($$1.css(parent, property))), document.body).shift() : null;
			const scrollBox = scrollParent ? getScrollContainer(scrollParent, scrollParent) : null;
			const containerBox = this.options.container ? $$1.rect(this.options.container, { offset: true }) : null;
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
			$$1.setDataset(this.options.reference, { uiPlacement: placement });
			$$1.setDataset(this.node, { uiPlacement: placement });
			const position = this.options.position;
			const offset = {
				x: Math.round(referenceBox.x),
				y: Math.round(referenceBox.y)
			};
			const positionBox = positionParent && !$$1.isSame(positionParent, document.body) ? $$1.rect(positionParent, { offset: true }) : null;
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
			offset.x -= parseInt($$1.css(this.node, "marginLeft"));
			offset.y -= parseInt($$1.css(this.node, "marginTop"));
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
				offset.x += $$1.getScrollX(positionParent);
				offset.y += $$1.getScrollY(positionParent);
			}
			$$1.setStyle(this.node, { transform: `translate3d(${offset.x}px , ${offset.y}px , 0)` });
			if (this.options.arrow) this.#updateArrow(placement, position);
			if (this.options.afterUpdate) this.options.afterUpdate(this.node, this.options.reference, placement, position);
		}
		/**
		* Updates the popper arrow position.
		* @param {Direction} placement The resolved placement.
		* @param {Position} position The resolved alignment.
		*/
		#updateArrow(placement, position) {
			const physicalPlacement = getPhysicalPlacement(placement, this.#rtl);
			const nodeBox = $$1.rect(this.node, { offset: true });
			const referenceBox = $$1.rect(this.options.reference, { offset: true });
			$$1.setStyle(this.options.arrow, {
				position: "absolute",
				inset: ""
			});
			const arrowBox = $$1.rect(this.options.arrow, { offset: true });
			const arrowStyles = {};
			if (["top", "bottom"].includes(physicalPlacement)) {
				const arrowPlacement = physicalPlacement === "top" ? "bottom" : "top";
				arrowStyles[arrowPlacement] = -Math.floor(arrowBox.height);
				const diff = (referenceBox.width - nodeBox.width) / 2;
				const [left, right] = this.#rtl ? ["end", "start"] : ["start", "end"];
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
				arrowStyles.left = $$1._clamp(offset, min, max);
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
				arrowStyles.top = $$1._clamp(offset, min, max);
			}
			$$1.setStyle(this.options.arrow, arrowStyles);
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
			this.#menuNode = $$1.next(this.node, ".dropdown-menu").shift();
			if (this.options.reference) {
				if (this.options.reference === "parent") this.#referenceNode = $$1.parent(this.node).shift();
				else this.#referenceNode = $$1.findOne(this.options.reference);
			} else this.#referenceNode = this.node;
			if (this.#display !== "static" && $$1.closest(this.node, ".navbar-nav").length) this.#display = "static";
		}
		/**
		* Checks whether the dropdown menu contains a target.
		* @param {HTMLElement} target The target node.
		* @returns {boolean} Whether the target is inside the menu.
		*/
		containsMenuTarget(target) {
			return $$1.hasDescendent(this.#menuNode, target);
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
			const focusNode = $$1.findOne(".dropdown-item:not(:disabled, .disabled, [tabindex=\"-1\"])", this.#menuNode);
			$$1.focus(focusNode);
		}
		/**
		* Hides the dropdown menu.
		*/
		hide() {
			if (this.#transitioning || !$$1.hasClass(this.#menuNode, "show") || !$$1.triggerOne(this.node, "hide.ui.dropdown")) return;
			this.#transitioning = true;
			$$1.setStyle(this.#menuNode, { display: "block" });
			$$1.removeClass(this.#menuNode, "show");
			waitForTransition(this.#menuNode, ["opacity"], { toggle: this.node }).then(({ node, toggle }) => {
				this.#transitioning = false;
				if (this.#popper) {
					this.#popper.dispose();
					this.#popper = null;
				}
				$$1.setStyle(node, { display: "" });
				$$1.setAttribute(toggle, { "aria-expanded": false });
				$$1.triggerEvent(toggle, "hidden.ui.dropdown");
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
			return !($$1.isSame(this.node, target) || hasDescendent && ($$1.is(target, "form, input, textarea, select, option") || autoClose === "outside" || autoClose === false) || !hasDescendent && !$$1.isSame(this.#menuNode, target) && (autoClose === "inside" || autoClose === false));
		}
		/**
		* Shows the dropdown menu.
		*/
		show() {
			if (this.#transitioning || $$1.hasClass(this.#menuNode, "show") || !$$1.triggerOne(this.node, "show.ui.dropdown")) return;
			this.#transitioning = true;
			$$1.setStyle(this.#menuNode, { display: "block" });
			$$1.css(this.#menuNode, "opacity");
			$$1.addClass(this.#menuNode, "show");
			$$1.setStyle(this.#menuNode, { display: "" });
			if (this.#display === "dynamic") this.#popper = new Popper(this.#menuNode, {
				reference: this.#referenceNode,
				placement: this.options.placement,
				position: this.options.position,
				fixed: this.options.fixed,
				spacing: this.options.spacing,
				minContact: this.options.minContact
			});
			window$1.requestAnimationFrame((_) => {
				this.update();
			});
			waitForTransition(this.#menuNode, ["opacity"], { toggle: this.node }).then(({ toggle }) => {
				this.#transitioning = false;
				$$1.setAttribute(toggle, { "aria-expanded": true });
				$$1.triggerEvent(toggle, "shown.ui.dropdown");
			});
		}
		/**
		* Toggles the dropdown menu.
		*/
		toggle() {
			if ($$1.hasClass(this.#menuNode, "show")) this.hide();
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
	$$1.addEventDelegate(document, "click.ui.dropdown keydown.ui.dropdown", "[data-ui-toggle=\"dropdown\"]", (e) => {
		if (e.code && e.code !== "Space") return;
		e.preventDefault();
		Dropdown.init(e.currentTarget).toggle();
	});
	$$1.addEventDelegate(document, "keydown.ui.dropdown", "[data-ui-toggle=\"dropdown\"]", (e) => {
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
	$$1.addEventDelegate(document, "keydown.ui.dropdown", ".dropdown-menu.show .dropdown-item", (e) => {
		let focusNode;
		switch (e.code) {
			case "ArrowDown":
				focusNode = $$1.nextAll(e.currentTarget, ".dropdown-item:not(:disabled, .disabled, [tabindex=\"-1\"])").shift();
				break;
			case "ArrowUp":
				focusNode = $$1.prevAll(e.currentTarget, ".dropdown-item:not(:disabled, .disabled, [tabindex=\"-1\"])").pop();
				break;
			default: return;
		}
		e.preventDefault();
		$$1.focus(focusNode);
	});
	$$1.addEvent(document, "click.ui.dropdown", (e) => {
		const target = getClickTarget(e);
		const nodes = $$1.find(".dropdown-menu.show");
		for (const node of nodes) {
			const toggle = $$1.siblings(node, "[data-ui-toggle=\"dropdown\"]").shift();
			const dropdown = Dropdown.init(toggle);
			if (!dropdown.shouldClose(target)) continue;
			dropdown.hide();
		}
	}, { capture: true });
	$$1.addEvent(document, "keydown.ui.dropdown", (e) => {
		if (e.code !== "Escape") return;
		let stopped = false;
		const nodes = $$1.find(".dropdown-menu.show");
		for (const node of nodes) {
			const toggle = $$1.siblings(node, "[data-ui-toggle=\"dropdown\"]").shift();
			const dropdown = Dropdown.init(toggle);
			if (!stopped) {
				stopped = true;
				e.stopPropagation();
			}
			dropdown.hide();
		}
	}, { capture: true });
	$$1.addEvent(document, "keyup.ui.dropdown", (e) => {
		if (e.code !== "Tab") return;
		let stopped = false;
		const nodes = $$1.find(".dropdown-menu.show");
		for (const node of nodes) {
			const toggle = $$1.siblings(node, "[data-ui-toggle=\"dropdown\"]").shift();
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
		$$1.addEvent(document, "focusin.ui.focustrap", (e) => {
			const activeTarget = [...focusTraps].pop().node;
			if ($$1._isDocument(e.target) || $$1.isSame(activeTarget, e.target) || $$1.hasDescendent(activeTarget, e.target)) return;
			const focusable = $$1.find("a, button, input, textarea, select, details, [tabindex], [contenteditable=\"true\"]", activeTarget).filter((node) => $$1.is(node, ":not(:disabled, .disabled)") && $$1.getAttribute(node, "tabindex") >= 0 && $$1.isVisible(node));
			const focusTarget = reverse ? focusable.pop() : focusable.shift();
			$$1.focus(focusTarget || activeTarget);
		}, { capture: true });
		$$1.addEvent(document, "keydown.ui.focustrap", (e) => {
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
		$$1.removeEvent(document, "focusin.ui.focustrap");
		$$1.removeEvent(document, "keydown.ui.focustrap");
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
			if (this.options.autoFocus) $$1.focus(this.node);
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
			this.#dialog = $$1.child(this.node, ".modal-dialog").shift();
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
			if (!this.options.backdrop || this.node !== target && $$1.hasDescendent(this.node, target)) return;
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
			if (this.#transitioning || !$$1.hasClass(this.node, "show") || !$$1.triggerOne(this.node, "hide.ui.modal")) return;
			this.#transitioning = true;
			this.#zooming = false;
			$$1.removeClass(this.node, "modal-static");
			if (this.#focusTrap) this.#focusTrap.deactivate();
			$$1.addClass(this.node, "hiding");
			$$1.removeClass(this.node, "show");
			if (this.#backdrop) $$1.removeClass(this.#backdrop, "show");
			const transitions = [waitForTransition(this.#dialog, ["opacity", "transform"])];
			if (this.#backdrop) transitions.push(waitForTransition(this.#backdrop, ["opacity"]));
			Promise.all(transitions).then((_) => {
				if (!this.node) return;
				const modal = this.node;
				this.#cleanup();
				$$1.triggerEvent(modal, "hidden.ui.modal");
			});
		}
		/**
		* Shows the modal.
		* @param {HTMLElement} [relatedTarget] The element that triggered the Modal.
		*/
		show(relatedTarget) {
			if (relatedTarget) this.#activeTarget = relatedTarget;
			if (this.#transitioning || $$1.hasClass(this.node, "show") || !$$1.triggerOne(this.node, "show.ui.modal", { data: { relatedTarget: this.#activeTarget } })) return;
			this.#transitioning = true;
			const stackSize = $$1.find(".modal:is(.show, .hiding)").length;
			$$1.removeClass(document.body, "modal-open");
			this.#scrollNodes = [this.#dialog];
			if (!stackSize && !$$1.findOne(".offcanvas.show")) {
				this.#scrollNodes.push(document.body);
				this.#scrollNodes.push(...$$1.find(".fixed-top, .fixed-bottom"));
			}
			addScrollPadding(this.#scrollNodes);
			$$1.addClass(document.body, "modal-open");
			if (this.options.backdrop) {
				this.#backdrop = $$1.create("div", { class: "modal-backdrop" });
				$$1.append(document.body, this.#backdrop);
			}
			setStackIndex(this, stackSize);
			$$1.css(this.#dialog, "opacity");
			$$1.addClass(this.node, "show");
			const transitions = [waitForTransition(this.#dialog, ["opacity", "transform"], { modal: this.node })];
			if (this.#backdrop) {
				$$1.addClass(this.#backdrop, "show");
				transitions.push(waitForTransition(this.#backdrop, ["opacity"]));
			}
			Promise.all(transitions).then(([{ modal }]) => {
				if (!this.node) return;
				this.#transitioning = false;
				$$1.setAttribute(modal, {
					"aria-hidden": false,
					"aria-modal": true
				});
				if (this.#focusTrap) this.#focusTrap.activate();
				$$1.triggerEvent(modal, "shown.ui.modal");
			});
		}
		/**
		* Toggles the modal.
		*/
		toggle() {
			if ($$1.hasClass(this.node, "show")) this.hide();
			else this.show();
		}
		/**
		* Restores the hidden modal state.
		* @param {boolean} [restoreFocus=true] Whether to restore focus to the active target.
		*/
		#cleanup(restoreFocus = true) {
			const [dialog, ...sharedScrollNodes] = this.#scrollNodes;
			$$1.removeClass(this.node, "hiding modal-static show");
			$$1.setAttribute(this.node, {
				"aria-hidden": true,
				"aria-modal": false
			});
			if (dialog) resetScrollPadding([dialog]);
			if ($$1.getStyle(this.node, "zIndex")) $$1.setStyle(this.node, { zIndex: "" });
			if (this.#backdrop) $$1.remove(this.#backdrop);
			const modals = updateStack();
			if (modals.length) modals[0].#scrollNodes.push(...sharedScrollNodes);
			else {
				resetScrollPadding(sharedScrollNodes);
				$$1.removeClass(document.body, "modal-open");
			}
			if (restoreFocus && this.#activeTarget) $$1.focus(this.#activeTarget);
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
			$$1.addClass(this.node, "modal-static");
			waitForTransition(this.#dialog, ["transform"], { modal: this.node }).then(({ modal, node }) => {
				if (!this.node) return;
				$$1.removeClass(modal, "modal-static");
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
		const nodes = $$1.find(".modal.show");
		if (!nodes.length) return null;
		let node = nodes.shift();
		let highestZIndex = $$1.getStyle(node, "zIndex");
		for (const otherNode of nodes) {
			const newZIndex = $$1.getStyle(otherNode, "zIndex");
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
		$$1.setStyle(modal.node, { zIndex: "" });
		if (modal.backdrop) $$1.setStyle(modal.backdrop, { zIndex: "" });
		if (!index) return;
		const stackOffset = index * 20;
		const modalZIndex = parseInt($$1.css(modal.node, "zIndex")) + stackOffset;
		$$1.setStyle(modal.node, { zIndex: modalZIndex });
		if (modal.backdrop) {
			const backdropZIndex = parseInt($$1.css(modal.backdrop, "zIndex")) + stackOffset;
			$$1.setStyle(modal.backdrop, { zIndex: backdropZIndex });
		}
	}
	/**
	* Reindexes visible modals and their backdrops.
	* @returns {Modal[]} The ordered modal instances.
	*/
	function updateStack() {
		const nodes = $$1.find(".modal.show");
		nodes.sort((nodeA, nodeB) => parseInt($$1.css(nodeA, "zIndex")) - parseInt($$1.css(nodeB, "zIndex")));
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
	$$1.addEventDelegate(document, "click.ui.modal", "[data-ui-toggle=\"modal\"]", (e) => {
		e.preventDefault();
		const target = getTarget(e.currentTarget, ".modal");
		Modal.init(target).show(e.currentTarget);
	});
	$$1.addEventDelegate(document, "click.ui.modal", "[data-ui-dismiss=\"modal\"]", (e) => {
		e.preventDefault();
		const target = getTarget(e.currentTarget, ".modal");
		Modal.init(target).hide();
	});
	$$1.addEvent(window$1, "click.ui.modal", (e) => {
		const target = getClickTarget(e);
		if ($$1.is(target, "[data-ui-dismiss]")) return;
		const modal = getTopModal();
		if (!modal) return;
		modal.handleBackdrop(target);
	});
	$$1.addEvent(window$1, "keydown.ui.modal", (e) => {
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
			if (!this.options.backdrop || this.options.backdrop === "static" || $$1.isSame(this.node, target) || $$1.hasDescendent(this.node, target)) return;
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
			if (this.#transitioning || !$$1.hasClass(this.node, "show") || !$$1.triggerOne(this.node, "hide.ui.offcanvas")) return;
			this.#transitioning = true;
			if (this.#focusTrap) this.#focusTrap.deactivate();
			$$1.addClass(this.node, "hiding");
			waitForTransition(this.node, ["opacity", "transform"]).then((_) => {
				if (!this.node) return;
				const offcanvas = this.node;
				this.#cleanup();
				$$1.triggerEvent(offcanvas, "hidden.ui.offcanvas");
			});
		}
		/**
		* Shows the offcanvas panel.
		* @param {HTMLElement} [relatedTarget] The element that triggered the Offcanvas.
		*/
		show(relatedTarget) {
			if (relatedTarget) this.#activeTarget = relatedTarget;
			if (this.#transitioning || $$1.hasClass(this.node, "show") || $$1.findOne(".offcanvas.show") || !$$1.triggerOne(this.node, "show.ui.offcanvas")) return;
			this.#transitioning = true;
			if (this.options.backdrop) $$1.addClass(document.body, "offcanvas-backdrop");
			this.#scrollNodes = [];
			if (!this.options.scroll) {
				this.#scrollNodes.push(document.body);
				this.#scrollNodes.push(...$$1.find(".fixed-top, .fixed-bottom"));
				addScrollPadding(this.#scrollNodes);
				$$1.setStyle(document.body, { overflow: "hidden" });
			}
			$$1.css(this.node, "opacity");
			$$1.addClass(this.node, "show");
			waitForTransition(this.node, ["opacity", "transform"]).then(({ node }) => {
				if (!this.node) return;
				this.#transitioning = false;
				$$1.setAttribute(node, {
					"aria-hidden": false,
					"aria-modal": true
				});
				if (this.#focusTrap) this.#focusTrap.activate();
				$$1.triggerEvent(node, "shown.ui.offcanvas");
			});
		}
		/**
		* Toggles the offcanvas panel.
		*/
		toggle() {
			if ($$1.hasClass(this.node, "show")) this.hide();
			else this.show();
		}
		/**
		* Restores the hidden offcanvas state.
		* @param {boolean} [restoreFocus=true] Whether to restore focus to the active target.
		*/
		#cleanup(restoreFocus = true) {
			$$1.removeClass(this.node, "hiding show");
			$$1.setAttribute(this.node, {
				"aria-hidden": true,
				"aria-modal": false
			});
			if (this.options.backdrop) $$1.removeClass(document.body, "offcanvas-backdrop");
			if (!this.options.scroll) {
				resetScrollPadding(this.#scrollNodes);
				$$1.setStyle(document.body, { overflow: "" });
			}
			if (restoreFocus && this.#activeTarget) $$1.focus(this.#activeTarget);
			this.#activeTarget = null;
			this.#scrollNodes = null;
			this.#transitioning = false;
		}
	};

//#endregion
//#region src/js/offcanvas/index.js
	initComponent("offcanvas", Offcanvas);
	$$1.addEventDelegate(document, "click.ui.offcanvas", "[data-ui-toggle=\"offcanvas\"]", (e) => {
		e.preventDefault();
		const target = getTarget(e.currentTarget, ".offcanvas");
		Offcanvas.init(target).show(e.currentTarget);
	});
	$$1.addEventDelegate(document, "click.ui.offcanvas", "[data-ui-dismiss=\"offcanvas\"]", (e) => {
		e.preventDefault();
		const target = getTarget(e.currentTarget, ".offcanvas");
		Offcanvas.init(target).hide();
	});
	$$1.addEvent(document, "click.ui.offcanvas", (e) => {
		const target = getClickTarget(e);
		if ($$1.is(target, "[data-ui-dismiss]") || $$1.findOne(".modal.show")) return;
		const nodes = $$1.find(".offcanvas.show");
		if (!nodes.length) return;
		for (const node of nodes) Offcanvas.init(node).handleBackdrop(target);
	});
	$$1.addEvent(document, "keydown.ui.offcanvas", (e) => {
		if (e.code !== "Escape" || $$1.findOne(".modal.show")) return;
		const nodes = $$1.find(".offcanvas.show");
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
			sanitize: (input) => $$1.sanitize(input),
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
			this.#modal = $$1.closest(this.node, ".modal").shift();
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
			if ($$1.hasDataset(this.node, "uiOriginalTitle")) {
				const title = $$1.getDataset(this.node, "uiOriginalTitle");
				$$1.setAttribute(this.node, { title });
				$$1.removeDataset(this.node, "uiOriginalTitle");
			}
			if (this.#popper) {
				this.#popper.dispose();
				this.#popper = null;
			}
			$$1.remove(this.#popover);
			if (this.#triggers.includes("hover")) {
				$$1.removeEvent(this.node, "mouseover.ui.popover");
				$$1.removeEvent(this.node, "mouseout.ui.popover");
			}
			if (this.#triggers.includes("focus")) {
				$$1.removeEvent(this.node, "focus.ui.popover");
				$$1.removeEvent(this.node, "blur.ui.popover");
			}
			if (this.#triggers.includes("click")) $$1.removeEvent(this.node, "click.ui.popover");
			if (this.#modal) $$1.removeEvent(this.#modal, "hide.ui.modal", this.#hideModalEvent);
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
			if (!force && !this.#enabled || this.#transition?.direction === "out" || !$$1.isConnected(this.#popover) || !$$1.triggerOne(this.node, "hide.ui.popover")) return;
			const transition = { direction: "out" };
			this.#transition = transition;
			$$1.removeClass(this.#popover, "show");
			waitForTransition(this.#popover, ["opacity"], { toggle: this.node }).then(({ node, toggle }) => {
				if (this.#transition !== transition) return;
				this.#transition = null;
				if (this.#popper) {
					this.#popper.dispose();
					this.#popper = null;
				}
				$$1.detach(node);
				$$1.removeAttribute(toggle, "aria-describedby");
				$$1.triggerEvent(toggle, "hidden.ui.popover");
			});
		}
		/**
		* Refreshes the popover title and body content.
		*/
		refresh() {
			if ($$1.hasAttribute(this.node, "title")) {
				const originalTitle = $$1.getAttribute(this.node, "title");
				$$1.setDataset(this.node, { uiOriginalTitle: originalTitle });
				$$1.removeAttribute(this.node, "title");
			}
			let title = "";
			if ($$1.hasDataset(this.node, "uiTitle")) title = $$1.getDataset(this.node, "uiTitle");
			else if (this.options.title) title = this.options.title;
			else if ($$1.hasDataset(this.node, "uiOriginalTitle")) title = $$1.getDataset(this.node, "uiOriginalTitle", title);
			let content = "";
			if ($$1.hasDataset(this.node, "uiContent")) content = $$1.getDataset(this.node, "uiContent");
			else if (this.options.content) content = this.options.content;
			const method = this.options.html ? "setHTML" : "setText";
			$$1[method](this.#popoverHeader, this.options.html && this.options.sanitize ? this.options.sanitize(title) : title);
			if (!title) $$1.hide(this.#popoverHeader);
			else $$1.show(this.#popoverHeader);
			$$1[method](this.#popoverBody, this.options.html && this.options.sanitize ? this.options.sanitize(content) : content);
		}
		/**
		* Shows the popover.
		*/
		show() {
			const connected = $$1.isConnected(this.#popover);
			if (!this.#enabled || connected && this.#transition?.direction !== "out" || !$$1.triggerOne(this.node, "show.ui.popover")) return;
			this.refresh();
			if (!connected) {
				this.#show();
				$$1.css(this.#popover, "opacity");
			}
			const transition = { direction: "in" };
			this.#transition = transition;
			$$1.addClass(this.#popover, "show");
			waitForTransition(this.#popover, ["opacity"], { toggle: this.node }).then(({ toggle }) => {
				if (this.#transition !== transition) return;
				this.#transition = null;
				$$1.triggerEvent(toggle, "shown.ui.popover");
			});
		}
		/**
		* Toggles the popover.
		* @param {{force?: boolean}} [options] The toggle options. Force defaults to `true`.
		*/
		toggle({ force = true } = {}) {
			if ($$1.isConnected(this.#popover) && this.#transition?.direction !== "out") this.hide({ force });
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
				$$1.addEvent(this.node, "mouseover.ui.popover", (_) => {
					this.show();
				});
				$$1.addEvent(this.node, "mouseout.ui.popover", (_) => {
					this.hide({ force: false });
				});
			}
			if (this.#triggers.includes("focus")) {
				$$1.addEvent(this.node, "focus.ui.popover", (_) => {
					this.show();
				});
				$$1.addEvent(this.node, "blur.ui.popover", (_) => {
					this.hide({ force: false });
				});
			}
			if (this.#triggers.includes("click")) $$1.addEvent(this.node, "click.ui.popover", (e) => {
				e.preventDefault();
				this.toggle({ force: false });
			});
			if (this.#modal) {
				this.#hideModalEvent = (_) => {
					this.hide();
				};
				$$1.addEvent(this.#modal, "hide.ui.modal", this.#hideModalEvent);
			}
		}
		/**
		* Creates the popover element from its template.
		*/
		#render() {
			this.#popover = $$1.parseHTML(this.options.template).shift();
			if (this.options.animation) $$1.addClass(this.#popover, "fade");
			if (this.options.customClass) $$1.addClass(this.#popover, this.options.customClass);
			this.#arrow = $$1.findOne(".popover-arrow", this.#popover);
			this.#popoverHeader = $$1.findOne(".popover-header", this.#popover);
			this.#popoverBody = $$1.findOne(".popover-body", this.#popover);
		}
		/**
		* Appends and positions the popover element.
		*/
		#show() {
			if (this.options.appendTo) $$1.append(this.options.appendTo, this.#popover);
			else $$1.after(this.node, this.#popover);
			const id = generateId(this.constructor.DATA_KEY);
			$$1.setAttribute(this.#popover, { id });
			$$1.setAttribute(this.node, { "aria-describedby": id });
			this.#popper = new popper_default(this.#popover, {
				reference: this.node,
				arrow: this.#arrow,
				placement: this.options.placement,
				position: this.options.position,
				fixed: this.options.fixed,
				spacing: this.options.spacing,
				minContact: this.options.minContact
			});
			window$1.requestAnimationFrame((_) => {
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
		const tabList = $$1.closest(node, ".nav, [role=\"tablist\"]").shift() || $$1.parent(node).shift();
		return tabList ? $$1.find("[data-ui-toggle=\"tab\"]", tabList) : [node];
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
			this.#target = $$1.findOne(selector);
			this.#siblings = getTabGroup(this.node).filter((node) => !$$1.isSame(node, this.node));
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
			if (!$$1.hasClass(this.#target, "active") || !$$1.triggerOne(this.node, "hide.ui.tab")) return;
			this.#hide();
			$$1.triggerEvent(this.node, "hidden.ui.tab");
		}
		/**
		* Hides the active tab and shows the current tab.
		*/
		show() {
			if ($$1.hasClass(this.#target, "active")) return;
			const active = this.#siblings.find((sibling) => $$1.hasClass(sibling, "active"));
			const canHide = !active || $$1.triggerOne(active, "hide.ui.tab");
			const canShow = $$1.triggerOne(this.node, "show.ui.tab");
			if (!canHide || !canShow) return;
			if (active) this.constructor.init(active).#hide();
			this.#show();
			if (active) $$1.triggerEvent(active, "hidden.ui.tab");
		}
		/**
		* Hides the current tab without checking its state or events.
		*/
		#hide() {
			this.#transition = null;
			$$1.removeClass(this.#target, "active show");
			$$1.removeClass(this.node, "active");
			$$1.setAttribute(this.node, { "aria-selected": false });
		}
		/**
		* Shows the current tab without checking its state or events.
		*/
		#show() {
			const transition = {};
			this.#transition = transition;
			$$1.addClass(this.#target, "active");
			$$1.addClass(this.node, "active");
			$$1.setAttribute(this.node, { "aria-selected": true });
			$$1.css(this.#target, "opacity");
			$$1.addClass(this.#target, "show");
			waitForTransition(this.#target, ["opacity"], { toggle: this.node }).then(({ toggle }) => {
				if (this.#transition !== transition) return;
				this.#transition = null;
				$$1.triggerEvent(toggle, "shown.ui.tab");
			});
		}
	};

//#endregion
//#region src/js/tab/index.js
	initComponent("tab", Tab);
	$$1.addEventDelegate(document, "click.ui.tab keydown.ui.tab", "[data-ui-toggle=\"tab\"]", (e) => {
		if (e.code && e.code !== "Space") return;
		e.preventDefault();
		Tab.init(e.currentTarget).show();
	});
	$$1.addEventDelegate(document, "keydown.ui.tab", "[data-ui-toggle=\"tab\"]", (e) => {
		const tabs = getTabGroup(e.currentTarget).filter((node) => !$$1.is(node, ":disabled, .disabled"));
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
		if (!newTarget || $$1.isSame(newTarget, e.currentTarget)) return;
		e.preventDefault();
		$$1.focus(newTarget);
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
			if (this.#transitioning || !$$1.hasClass(this.node, "show") || !$$1.triggerOne(this.node, "hide.ui.toast")) return;
			clearTimeout(this.#timer);
			this.#timer = null;
			this.#transitioning = true;
			$$1.css(this.node, "opacity");
			$$1.removeClass(this.node, "show");
			waitForTransition(this.node, ["opacity"]).then(({ node }) => {
				this.#transitioning = false;
				$$1.setStyle(node, { display: "none" }, null, { important: true });
				$$1.triggerEvent(node, "hidden.ui.toast");
			});
		}
		/**
		* Shows the toast.
		*/
		show() {
			if (this.#transitioning || $$1.hasClass(this.node, "show") || !$$1.triggerOne(this.node, "show.ui.toast")) return;
			clearTimeout(this.#timer);
			this.#timer = null;
			this.#transitioning = true;
			$$1.setStyle(this.node, { display: "" });
			$$1.css(this.node, "opacity");
			$$1.addClass(this.node, "show");
			waitForTransition(this.node, ["opacity"]).then(({ node }) => {
				this.#transitioning = false;
				if (this.options?.autohide) this.#timer = setTimeout((_) => {
					this.#timer = null;
					this.hide();
				}, this.options.delay);
				$$1.triggerEvent(node, "shown.ui.toast");
			});
		}
	};

//#endregion
//#region src/js/toast/index.js
	initComponent("toast", Toast);
	$$1.addEventDelegate(document, "click.ui.toast", "[data-ui-dismiss=\"toast\"]", (e) => {
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
			sanitize: (input) => $$1.sanitize(input),
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
			this.#modal = $$1.closest(this.node, ".modal").shift();
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
			if ($$1.hasDataset(this.node, "uiOriginalTitle")) {
				const title = $$1.getDataset(this.node, "uiOriginalTitle");
				$$1.setAttribute(this.node, { title });
				$$1.removeDataset(this.node, "uiOriginalTitle");
			}
			if (this.#popper) {
				this.#popper.dispose();
				this.#popper = null;
			}
			$$1.remove(this.#tooltip);
			if (this.#triggers.includes("hover")) {
				$$1.removeEvent(this.node, "mouseover.ui.tooltip");
				$$1.removeEvent(this.node, "mouseout.ui.tooltip");
			}
			if (this.#triggers.includes("focus")) {
				$$1.removeEvent(this.node, "focus.ui.tooltip");
				$$1.removeEvent(this.node, "blur.ui.tooltip");
			}
			if (this.#triggers.includes("click")) $$1.removeEvent(this.node, "click.ui.tooltip");
			if (this.#modal) $$1.removeEvent(this.#modal, "hide.ui.modal", this.#hideModalEvent);
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
			if (!force && !this.#enabled || this.#transition?.direction === "out" || !$$1.isConnected(this.#tooltip) || !$$1.triggerOne(this.node, "hide.ui.tooltip")) return;
			const transition = { direction: "out" };
			this.#transition = transition;
			$$1.removeClass(this.#tooltip, "show");
			waitForTransition(this.#tooltip, ["opacity"], { toggle: this.node }).then(({ node, toggle }) => {
				if (this.#transition !== transition) return;
				this.#transition = null;
				if (this.#popper) {
					this.#popper.dispose();
					this.#popper = null;
				}
				$$1.detach(node);
				$$1.removeAttribute(toggle, "aria-describedby");
				$$1.triggerEvent(toggle, "hidden.ui.tooltip");
			});
		}
		/**
		* Refreshes the tooltip title.
		*/
		refresh() {
			if ($$1.hasAttribute(this.node, "title")) {
				const originalTitle = $$1.getAttribute(this.node, "title");
				$$1.setDataset(this.node, { uiOriginalTitle: originalTitle });
				$$1.removeAttribute(this.node, "title");
			}
			let title = "";
			if ($$1.hasDataset(this.node, "uiTitle")) title = $$1.getDataset(this.node, "uiTitle");
			else if (this.options.title) title = this.options.title;
			else if ($$1.hasDataset(this.node, "uiOriginalTitle")) title = $$1.getDataset(this.node, "uiOriginalTitle", title);
			const method = this.options.html ? "setHTML" : "setText";
			$$1[method](this.#tooltipInner, this.options.html && this.options.sanitize ? this.options.sanitize(title) : title);
			this.update();
		}
		/**
		* Shows the tooltip.
		*/
		show() {
			const connected = $$1.isConnected(this.#tooltip);
			if (!this.#enabled || connected && this.#transition?.direction !== "out" || !$$1.triggerOne(this.node, "show.ui.tooltip")) return;
			this.refresh();
			if (!connected) {
				this.#show();
				$$1.css(this.#tooltip, "opacity");
			}
			const transition = { direction: "in" };
			this.#transition = transition;
			$$1.addClass(this.#tooltip, "show");
			waitForTransition(this.#tooltip, ["opacity"], { toggle: this.node }).then(({ toggle }) => {
				if (this.#transition !== transition) return;
				this.#transition = null;
				$$1.triggerEvent(toggle, "shown.ui.tooltip");
			});
		}
		/**
		* Toggles the tooltip.
		* @param {{force?: boolean}} [options] The toggle options. Force defaults to `true`.
		*/
		toggle({ force = true } = {}) {
			if ($$1.isConnected(this.#tooltip) && this.#transition?.direction !== "out") this.hide({ force });
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
				$$1.addEvent(this.node, "mouseover.ui.tooltip", (_) => {
					this.show();
				});
				$$1.addEvent(this.node, "mouseout.ui.tooltip", (_) => {
					this.hide({ force: false });
				});
			}
			if (this.#triggers.includes("focus")) {
				$$1.addEvent(this.node, "focus.ui.tooltip", (_) => {
					this.show();
				});
				$$1.addEvent(this.node, "blur.ui.tooltip", (_) => {
					this.hide({ force: false });
				});
			}
			if (this.#triggers.includes("click")) $$1.addEvent(this.node, "click.ui.tooltip", (e) => {
				e.preventDefault();
				this.toggle({ force: false });
			});
			if (this.#modal) {
				this.#hideModalEvent = (_) => {
					this.hide();
				};
				$$1.addEvent(this.#modal, "hide.ui.modal", this.#hideModalEvent);
			}
		}
		/**
		* Creates the tooltip element from its template.
		*/
		#render() {
			this.#tooltip = $$1.parseHTML(this.options.template).shift();
			if (this.options.animation) $$1.addClass(this.#tooltip, "fade");
			if (this.options.customClass) $$1.addClass(this.#tooltip, this.options.customClass);
			this.#arrow = $$1.findOne(".tooltip-arrow", this.#tooltip);
			this.#tooltipInner = $$1.findOne(".tooltip-inner", this.#tooltip);
		}
		/**
		* Appends and positions the tooltip element.
		*/
		#show() {
			if (this.options.appendTo) $$1.append(this.options.appendTo, this.#tooltip);
			else $$1.after(this.node, this.#tooltip);
			const id = generateId(this.constructor.DATA_KEY);
			$$1.setAttribute(this.#tooltip, { id });
			$$1.setAttribute(this.node, { "aria-describedby": id });
			this.#popper = new popper_default(this.#tooltip, {
				reference: this.node,
				arrow: this.#arrow,
				placement: this.options.placement,
				position: this.options.position,
				fixed: this.options.fixed,
				spacing: this.options.spacing,
				minContact: this.options.minContact
			});
			window$1.requestAnimationFrame((_) => {
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
	$$1.addEventDelegate(document, "click", "[data-ui-toggle=\"clipboard\"]", (e) => {
		e.preventDefault();
		const node = e.currentTarget;
		let { action = "copy", text = null } = getDataset(node);
		if (!["copy", "cut"].includes(action)) throw new Error("Invalid clipboard action");
		let input;
		if (!text) {
			const target = getTarget(node);
			if ($$1.is(target, "input, textarea")) {
				input = target;
				text = $$1.getValue(input);
			} else text = $$1.getText(target);
		}
		const customText = !input;
		if (customText) {
			input = $$1.create("textarea", {
				class: "visually-hidden position-fixed",
				value: text
			});
			$$1.append(document.body, input);
		}
		$$1.select(input);
		if ($$1.exec(action)) $$1.triggerEvent(node, "copied.ui.clipboard", { data: {
			action,
			text
		} });
		if (customText) $$1.detach(input);
	});

//#endregion
//#region src/js/ripple/index.js
	$$1.addEventDelegate(document, "click.ui.ripple", ".ripple", (e) => {
		if (e.button !== 0) return;
		const target = e.currentTarget;
		const pos = $$1.position(target, { offset: true });
		const width = $$1.width(target);
		const height = $$1.height(target);
		const scaleMultiple = Math.max(width, height);
		const isFixed = $$1.isFixed(target);
		const mouseX = isFixed ? e.clientX : e.pageX;
		const mouseY = isFixed ? e.clientY : e.pageY;
		const prevRipple = $$1.findOne(":scope > .ripple-effect", target);
		if (prevRipple) $$1.remove(prevRipple);
		const ripple = $$1.create("span", {
			class: "ripple-effect",
			style: {
				left: mouseX - pos.x,
				top: mouseY - pos.y
			}
		});
		$$1.setStyle(ripple, { "--ui-ripple-scale": scaleMultiple });
		$$1.append(target, ripple);
		$$1.css(ripple, "transform");
		$$1.addClass(ripple, "show");
		waitForTransition(ripple, ["transform", "opacity"]).then(({ node }) => {
			$$1.detach(node);
		});
	});

//#endregion
//#region src/js/text-expand/index.js
	$$1.addEventDelegate(document, "change.ui.expand input.ui.expand", ".text-expand", (e) => {
		const textArea = e.currentTarget;
		$$1.setStyle(textArea, { height: "inherit" });
		let newHeight = $$1.height(textArea, { boxSize: $$1.SCROLL_BOX });
		newHeight += parseInt($$1.css(textArea, "borderTop"));
		newHeight += parseInt($$1.css(textArea, "borderBottom"));
		$$1.setStyle(textArea, { height: `${newHeight}px` });
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
//# sourceMappingURL=frost-ui-bundle.js.map