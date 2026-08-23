(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.UI = {}));
})(this, (function (exports) { 'use strict';

    /**
     * Testing methods
     */

    const ELEMENT_NODE = 1;
    const TEXT_NODE = 3;
    const COMMENT_NODE = 8;
    const DOCUMENT_NODE = 9;
    const DOCUMENT_FRAGMENT_NODE = 11;

    /**
     * Checks whether a value is an array.
     * @param {*} value The value to test.
     * @returns {boolean} Whether the value is an array.
     */
    const isArray = Array.isArray;

    /**
     * Checks whether a value is array-like.
     * @param {*} value The value to test.
     * @returns {boolean} Whether the value is array-like.
     */
    const isArrayLike = (value) =>
        isArray(value) ||
        (
            isObject(value) &&
            !isFunction(value) &&
            !isWindow(value) &&
            !isElement(value) &&
            (
                (
                    Symbol.iterator in value &&
                    isFunction(value[Symbol.iterator])
                ) ||
                (
                    'length' in value &&
                    isNumeric(value.length) &&
                    (
                        !value.length ||
                        value.length - 1 in value
                    )
                )
            )
        );

    /**
     * Checks whether a value is a boolean.
     * @param {*} value The value to test.
     * @returns {boolean} Whether the value is a boolean.
     */
    const isBoolean = (value) =>
        value === !!value;

    /**
     * Checks whether a value is a Document.
     * @param {*} value The value to test.
     * @returns {boolean} Whether the value is a Document.
     */
    const isDocument = (value) =>
        !!value &&
        value.nodeType === DOCUMENT_NODE;

    /**
     * Checks whether a value is an Element.
     * @param {*} value The value to test.
     * @returns {boolean} Whether the value is an Element.
     */
    const isElement = (value) =>
        !!value &&
        value.nodeType === ELEMENT_NODE;

    /**
     * Checks whether a value is a DocumentFragment (and not a ShadowRoot).
     * @param {*} value The value to test.
     * @returns {boolean} Whether the value is a DocumentFragment.
     */
    const isFragment = (value) =>
        !!value &&
        value.nodeType === DOCUMENT_FRAGMENT_NODE &&
        !value.host;

    /**
     * Checks whether a value is a function.
     * @param {*} value The value to test.
     * @returns {boolean} Whether the value is a function.
     */
    const isFunction = (value) =>
        typeof value === 'function';

    /**
     * Checks whether a value is NaN.
     * @param {*} value The value to test.
     * @returns {boolean} Whether the value is NaN.
     */
    const isNaN = Number.isNaN;

    /**
     * Checks whether a value is an Element, Text node, or Comment node.
     * @param {*} value The value to test.
     * @returns {boolean} Whether the value is an Element, Text node, or Comment node.
     */
    const isNode = (value) =>
        !!value &&
        (
            value.nodeType === ELEMENT_NODE ||
            value.nodeType === TEXT_NODE ||
            value.nodeType === COMMENT_NODE
        );

    /**
     * Checks whether a value is null.
     * @param {*} value The value to test.
     * @returns {boolean} Whether the value is null.
     */
    const isNull = (value) =>
        value === null;

    /**
     * Checks whether a value is numeric.
     * @param {*} value The value to test.
     * @returns {boolean} Whether the value is numeric.
     */
    const isNumeric = (value) =>
        (() => {
            try {
                return (
                    !isNaN(parseFloat(value)) &&
                    isFinite(value)
                );
            } catch {
                return false;
            }
        })();

    /**
     * Checks whether a value is an object-like reference, including arrays and functions.
     * @param {*} value The value to test.
     * @returns {boolean} Whether the value is an object-like reference.
     */
    const isObject = (value) =>
        !!value &&
        value === Object(value);

    /**
     * Checks whether a value is a plain object.
     * @param {*} value The value to test.
     * @returns {boolean} Whether the value is a plain object.
     */
    const isPlainObject = (value) =>
        isObject(value) &&
        (
            Object.getPrototypeOf(value) === null ||
            Object.getPrototypeOf(value) === Object.prototype
        );

    /**
     * Checks whether a value is a ShadowRoot.
     * @param {*} value The value to test.
     * @returns {boolean} Whether the value is a ShadowRoot.
     */
    const isShadow = (value) =>
        !!value &&
        value.nodeType === DOCUMENT_FRAGMENT_NODE &&
        !!value.host;

    /**
     * Checks whether a value is a string.
     * @param {*} value The value to test.
     * @returns {boolean} Whether the value is a string.
     */
    const isString = (value) =>
        typeof value === 'string';

    /**
     * Checks whether a value is a text Node.
     * @param {*} value The value to test.
     * @returns {boolean} Whether the value is a text Node.
     */
    const isText = (value) =>
        !!value &&
        value.nodeType === TEXT_NODE;

    /**
     * Checks whether a value is undefined.
     * @param {*} value The value to test.
     * @returns {boolean} Whether the value is undefined.
     */
    const isUndefined = (value) =>
        value === undefined;

    /**
     * Checks whether a value is a Window.
     * @param {*} value The value to test.
     * @returns {boolean} Whether the value is a Window.
     */
    const isWindow = (value) =>
        !!value &&
        !!value.document &&
        value.document.defaultView === value;

    /**
     * Math methods
     */

    /**
     * Gets the decimal precision represented by a number.
     * @param {number} value The input number.
     * @returns {number} The decimal precision.
     */
    const getDecimalPlaces = (value) => {
        const [coefficient, exponent = 0] = `${value}`.toLowerCase().split('e');
        const decimals = (coefficient.split('.')[1] || '').length;
        return Math.max(0, decimals - Number(exponent));
    };

    /**
     * Clamps a value between a minimum and a maximum.
     * @param {number} value The value to clamp.
     * @param {number} [min=0] The minimum value of the clamped range.
     * @param {number} [max=1] The maximum value of the clamped range.
     * @returns {number} The clamped value.
     */
    const clamp = (value, min = 0, max = 1) =>
        Math.max(
            min,
            Math.min(
                max,
                value,
            ),
        );

    /**
     * Clamps a value between 0 and 100.
     * @param {number} value The value to clamp.
     * @returns {number} The clamped value.
     */
    const clampPercent = (value) =>
        clamp(value, 0, 100);

    /**
     * Calculates the distance between two vectors.
     * @param {number} x1 The first vector X co-ordinate.
     * @param {number} y1 The first vector Y co-ordinate.
     * @param {number} x2 The second vector X co-ordinate.
     * @param {number} y2 The second vector Y co-ordinate.
     * @returns {number} The distance between the vectors.
     */
    const dist = (x1, y1, x2, y2) =>
        len(
            x1 - x2,
            y1 - y2,
        );

    /**
     * Calculates the inverse linear interpolation amount from one value to another.
     * @param {number} v1 The starting value.
     * @param {number} v2 The ending value.
     * @param {number} value The value to inverse interpolate.
     * @returns {number} The interpolated amount.
     */
    const inverseLerp = (v1, v2, value) =>
        (value - v1) / (v2 - v1);

    /**
     * Calculates the length of an X,Y vector.
     * @param {number} x The X co-ordinate.
     * @param {number} y The Y co-ordinate.
     * @returns {number} The length of the vector.
     */
    const len = Math.hypot;

    /**
     * Calculates a linear interpolation from one value to another.
     * @param {number} v1 The starting value.
     * @param {number} v2 The ending value.
     * @param {number} amount The amount to interpolate.
     * @returns {number} The interpolated value.
     */
    const lerp = (v1, v2, amount) =>
        v1 *
        (1 - amount) +
        v2 *
        amount;

    /**
     * Maps a value from one range to another.
     * @param {number} value The value to map.
     * @param {number} fromMin The minimum value of the current range.
     * @param {number} fromMax The maximum value of the current range.
     * @param {number} toMin The minimum value of the target range.
     * @param {number} toMax The maximum value of the target range.
     * @returns {number} The mapped value.
     */
    const map = (value, fromMin, fromMax, toMin, toMax) =>
        (value - fromMin) *
        (toMax - toMin) /
        (fromMax - fromMin) +
        toMin;

    /**
     * Returns a random floating-point number.
     * @param {number} [a=1] The upper bound (exclusive) when `b` is omitted; otherwise the minimum bound (inclusive).
     * @param {number} [b] The maximum value (exclusive).
     * @returns {number} A random number.
     */
    const random = (a = 1, b = null) =>
        isNull(b) ?
            Math.random() * a :
            map(
                Math.random(),
                0,
                1,
                a,
                b,
            );

    /**
     * Returns a random integer.
     * @param {number} [a=1] The upper bound (exclusive) when `b` is omitted; otherwise the minimum bound (inclusive).
     * @param {number} [b] The maximum value (exclusive).
     * @returns {number} A random integer.
     * @throws {RangeError} If the bounds contain no integer.
     */
    const randomInt = (a = 1, b = null) => {
        const min = Math.ceil(
            Math.min(a, isNull(b) ? 0 : b),
        );
        const max = Math.ceil(
            Math.max(a, isNull(b) ? 0 : b),
        );

        if (min >= max) {
            throw new RangeError('The bounds do not contain an integer');
        }

        return Math.floor(random(min, max));
    };

    /**
     * Constrains a number to a specified step size.
     * @param {number} value The value to constrain.
     * @param {number} step The step size.
     * @returns {number} The constrained value.
     */
    const toStep = (value, step = 0.01) => {
        if (step === 0) {
            return value;
        }

        step = Math.abs(step);

        const result = Math.round(value / step) * step;
        const precision = getDecimalPlaces(step);

        if (precision > 100) {
            return result;
        }

        return parseFloat(
            result.toFixed(precision),
        );
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
    const diff = (array, ...arrays) => {
        const sets = arrays.map((other) => new Set(other));
        return array.filter(
            (value) => !sets
                .some((other) => other.has(value)),
        );
    };

    /**
     * Creates a new array containing the unique values that exist in all of the provided arrays.
     * @template T
     * @param {...T[]} arrays The input arrays.
     * @returns {T[]} The intersected array.
     */
    const intersect = (...arrays) => {
        if (!arrays.length) {
            return [];
        }

        const [array, ...others] = arrays;
        const sets = others.map((other) => new Set(other));
        return unique(array)
            .filter(
                (value) => sets.every((other) => other.has(value)),
            );
    };

    /**
     * Merges values from one or more arrays or array-like objects into an array.
     * @template T
     * @param {T[]} [array=[]] The array to merge into.
     * @param {...ArrayLike<T>} arrays The arrays or array-like objects to merge.
     * @returns {T[]} The merged array.
     * @throws {RangeError} If an array-like length is infinite.
     */
    const merge = (array = [], ...arrays) => {
        for (const other of arrays) {
            const length = Math.max(0, Math.floor(Number(other.length) || 0));
            if (!Number.isFinite(length)) {
                throw new RangeError('Array-like length must be finite');
            }

            for (let i = 0; i < length; i++) {
                array.push(other[i]);
            }
        }

        return array;
    };

    /**
     * Selects a random value from an array.
     * @template T
     * @param {T[]} array The input array.
     * @returns {T|null} A random value from the array, or null if the array is empty.
     */
    const randomValue = (array) =>
        array.length ?
            array[randomInt(array.length)] :
            null;

    /**
     * Creates an array containing a range of values.
     * @param {number} start The first value of the sequence.
     * @param {number} end The target value for the sequence. It is included only when the step lands on it exactly.
     * @param {number} [step=1] The increment between values in the sequence. Negative values are treated as positive, and `0` returns an empty array.
     * @returns {number[]} The array of values from start toward end.
     */
    const range = (start, end, step = 1) => {
        if (step === 0) {
            return [];
        }

        const sign = Math.sign(end - start);
        step = Math.abs(step);
        const ratio = Math.abs(end - start) / step;
        const nearest = Math.round(ratio);
        const landsOnEnd = Math.abs(ratio - nearest) <= Number.EPSILON * Math.max(1, ratio);
        const intervals = landsOnEnd ?
            nearest :
            Math.floor(ratio);

        return new Array(
            intervals + 1,
        )
            .fill()
            .map(
                (_, i) => i === intervals && landsOnEnd ?
                    end :
                    start + toStep(
                        (i * step * sign),
                        step,
                    ),
            );
    };

    /**
     * Removes duplicate elements from an array.
     * @template T
     * @param {T[]} array The input array.
     * @returns {T[]} The de-duplicated array.
     */
    const unique = (array) =>
        Array.from(
            new Set(array),
        );

    /**
     * Creates an array from a value, copying iterable and array-like objects.
     * @template T
     * @param {T|T[]|ArrayLike<T>|Iterable<T>|undefined} value The input value.
     * @returns {T[]} The wrapped array.
     */
    const wrap$2 = (value) => {
        if (isUndefined(value)) {
            return [];
        }

        if (isArray(value)) {
            return value;
        }

        if (
            isObject(value) &&
            isFunction(value[Symbol.iterator])
        ) {
            return Array.from(value);
        }

        return isArrayLike(value) ?
            merge([], value) :
            [value];
    };

    /**
     * Function methods
     */

    /**
     * A wrapped callback that exposes a `cancel()` method.
     * @template {(...args: any[]) => any} T
     * @typedef {((...args: Parameters<T>) => void) & { cancel: () => void }} CancelableWrapper
     */

    const isBrowser = typeof window !== 'undefined' && 'requestAnimationFrame' in window;

    /**
     * Schedules a callback on the next animation frame.
     * @param {Function} callback The callback to execute.
     * @returns {number} The request ID.
     */
    const _requestAnimationFrame = isBrowser ?
        (...args) => window.requestAnimationFrame(...args) :
        (callback) => setTimeout(callback, 1000 / 60);

    /**
     * Creates a wrapped version of a function that executes at most once per animation frame
     * (using the most recent arguments passed to it).
     * @template {(...args: any[]) => any} T
     * @param {T} callback The function to wrap.
     * @param {object} [options] Options for executing the function.
     * @param {boolean} [options.leading=false] Whether to execute on the leading edge of the animation frame.
     * @returns {CancelableWrapper<T>} The wrapped function.
     */
    const animation = (callback, { leading = false } = {}) => {
        let animationReference = null;
        let newArgs;
        let newThis;
        let running = false;

        const cancel = (_) => {
            if (animationReference !== null) {
                if (isBrowser) {
                    window.cancelAnimationFrame(animationReference);
                } else {
                    clearTimeout(animationReference);
                }
            }

            animationReference = null;
            newArgs = null;
            newThis = null;
            running = false;
        };

        const animation = function(...args) {
            newArgs = args;
            newThis = this;

            if (running) {
                return;
            }

            running = true;
            animationReference = _requestAnimationFrame((_) => {
                const args = newArgs;
                const thisArg = newThis;

                animationReference = null;
                newArgs = null;
                newThis = null;
                running = false;

                if (!leading) {
                    callback.apply(thisArg, args);
                }
            });

            if (leading) {
                try {
                    callback.apply(this, args);
                } catch (error) {
                    cancel();
                    throw error;
                }
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
    const compose = (...callbacks) =>
        function(arg) {
            return callbacks.reduceRight(
                (acc, callback) =>
                    callback.call(this, acc),
                arg,
            );
        };

    /**
     * Creates a wrapped version of a function that returns new functions
     * until the number of total arguments passed reaches the arguments length
     * of the original function (at which point the function will execute).
     * @template {(...args: any[]) => any} T
     * @param {T} callback The function to wrap.
     * @returns {Function} The wrapped function.
     */
    const curry = (callback) => {
        const curried = function(...args) {
            const thisArg = this;
            if (args.length >= callback.length) {
                return callback.apply(thisArg, args);
            }

            return (...newArgs) =>
                curried.apply(thisArg, args.concat(newArgs));
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
    const debounce$1 = (callback, wait = 0, { leading = false, trailing = true } = {}) => {
        let debounceReference = null;
        let newArgs;
        let newThis;
        let trailingPending = false;

        const cancel = (_) => {
            if (debounceReference !== null) {
                clearTimeout(debounceReference);
            }

            debounceReference = null;
            newArgs = null;
            newThis = null;
            trailingPending = false;
        };

        const debounced = function(...args) {
            if (!leading && !trailing) {
                return;
            }

            const callLeading = leading && debounceReference === null;
            if (debounceReference !== null) {
                clearTimeout(debounceReference);
                trailingPending = true;
            } else {
                trailingPending = false;
            }

            newArgs = args;
            newThis = this;

            debounceReference = setTimeout(
                (_) => {
                    const args = newArgs;
                    const thisArg = newThis;
                    const callTrailing = trailing && (!leading || trailingPending);

                    debounceReference = null;
                    newArgs = null;
                    newThis = null;
                    trailingPending = false;

                    if (callTrailing) {
                        callback.apply(thisArg, args);
                    }
                },
                wait,
            );

            if (callLeading) {
                try {
                    callback.apply(this, args);
                } catch (error) {
                    cancel();
                    throw error;
                }
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
    const evaluate = (value) =>
        isFunction(value) ?
            value() :
            value;

    /**
     * Creates a wrapped version of a function that only ever executes once.
     * Subsequent calls to the wrapped function will return the result of the first successful call.
     * @template {(...args: any[]) => any} T
     * @param {T} callback The function to wrap.
     * @returns {(...args: Parameters<T>) => ReturnType<T>} The wrapped function.
     */
    const once = (callback) => {
        let ran = false;
        let result;

        return function(...args) {
            if (ran) {
                return result;
            }

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
    const partial = (callback, ...defaultArgs) =>
        function(...args) {
            return callback.call(
                this,
                ...(defaultArgs
                    .slice()
                    .map((v) =>
                        isUndefined(v) ?
                            args.shift() :
                            v,
                    ).concat(args)
                ),
            );
        };

    /**
     * Creates a wrapped function that executes each callback in order,
     * passing the result from each function to the next.
     * @param {...((value: any) => any)} callbacks Callback functions to execute.
     * @returns {(arg: any) => any} The wrapped function.
     */
    const pipe = (...callbacks) =>
        function(arg) {
            return callbacks.reduce(
                (acc, callback) =>
                    callback.call(this, acc),
                arg,
            );
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
    const throttle = (callback, wait = 0, { leading = true, trailing = true } = {}) => {
        let throttleReference = null;
        let lastRan;
        let newArgs;
        let newThis;

        const cancel = (_) => {
            if (throttleReference !== null) {
                clearTimeout(throttleReference);
            }

            throttleReference = null;
            lastRan = undefined;
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
            const delta = lastRan === undefined ?
                null :
                now - lastRan;

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

            if (!trailing) {
                return;
            }

            newArgs = args;
            newThis = this;

            if (throttleReference !== null) {
                return;
            }

            throttleReference = setTimeout(
                runTrailing,
                delta === null || (!leading && delta >= wait) ?
                    wait :
                    Math.max(0, wait - delta),
            );
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
    const times = (callback, amount) => {
        while (amount-- > 0) {
            if (callback() === false) {
                break;
            }
        }
    };

    /**
     * Object methods
     */

    const hasOwn = (object, key) =>
        Object.prototype.hasOwnProperty.call(object, key);

    const assignOwn = (object, key, value) => {
        if (hasOwn(object, key)) {
            object[key] = value;
            return;
        }

        Object.defineProperty(
            object,
            key,
            {
                configurable: true,
                enumerable: true,
                value,
                writable: true,
            },
        );
    };

    const setDotSegments = (object, keys, value, overwrite) => {
        const [key, ...remainingKeys] = keys;
        if (!key) {
            return;
        }

        if (key === '*') {
            for (const childKey of Object.keys(object)) {
                if (!remainingKeys.length) {
                    if (overwrite) {
                        assignOwn(object, childKey, value);
                    }
                    continue;
                }

                let child = object[childKey];
                if (!isObject(child)) {
                    if (!overwrite) {
                        continue;
                    }

                    child = {};
                    assignOwn(object, childKey, child);
                }

                setDotSegments(child, remainingKeys, value, overwrite);
            }
            return;
        }

        if (remainingKeys.length) {
            let child = hasOwn(object, key) ?
                object[key] :
                undefined;

            if (!isObject(child)) {
                if (
                    hasOwn(object, key) &&
                    !overwrite
                ) {
                    return;
                }

                child = {};
                assignOwn(object, key, child);
            }

            setDotSegments(child, remainingKeys, value, overwrite);
        } else if (
            overwrite ||
            !hasOwn(object, key)
        ) {
            assignOwn(object, key, value);
        }
    };

    /**
     * Merges values from one or more objects into an object (recursively).
     * @param {object} object The input object.
     * @param {...object} objects The objects to merge.
     * @returns {object} The extended object.
     */
    const extend = (object, ...objects) =>
        objects.reduce(
            (acc, val) => {
                if (val == null) {
                    return acc;
                }

                for (const k of Object.keys(val)) {
                    const value = val[k];
                    const currentValue = hasOwn(acc, k) ?
                        acc[k] :
                        undefined;
                    if (isArray(value)) {
                        assignOwn(
                            acc,
                            k,
                            extend(
                                isArray(currentValue) ?
                                    currentValue :
                                    [],
                                value,
                            ),
                        );
                    } else if (isPlainObject(value)) {
                        assignOwn(
                            acc,
                            k,
                            extend(
                                isPlainObject(currentValue) ?
                                    currentValue :
                                    {},
                                value,
                            ),
                        );
                    } else {
                        assignOwn(acc, k, value);
                    }
                }
                return acc;
            },
            object,
        );

    /**
     * Flattens an object using dot notation while preserving empty plain objects.
     * @param {object} object The input object.
     * @param {string} [prefix] The key prefix.
     * @returns {object} The flattened object.
     */
    const flatten = (object, prefix = '') =>
        Object.keys(object).reduce((acc, key) => {
            const prefixedKey = `${prefix}${key}`;
            if (
                isPlainObject(object[key]) &&
                Object.keys(object[key]).length
            ) {
                const flattened = flatten(object[key], `${prefixedKey}.`);
                for (const flattenedKey of Object.keys(flattened)) {
                    assignOwn(acc, flattenedKey, flattened[flattenedKey]);
                }
            } else {
                assignOwn(acc, prefixedKey, object[key]);
            }

            return acc;
        }, {});

    /**
     * Removes a specified key from an object using dot notation.
     * @param {object} object The input object.
     * @param {string} key The key to remove from the object.
     * @returns {void} Nothing.
     */
    const forgetDot = (object, key) => {
        const keys = key.split('.');
        while ((key = keys.shift())) {
            if (
                !isObject(object) ||
                !hasOwn(object, key)
            ) {
                break;
            }

            if (keys.length) {
                object = object[key];
            } else {
                delete object[key];
            }
        }
    };

    /**
     * Retrieves an own value of a specified key from an object using dot notation.
     * @param {object} object The input object.
     * @param {string} key The key to retrieve from the object.
     * @param {*} [defaultValue] The default value if key does not exist.
     * @returns {*} The value retrieved from the object.
     */
    const getDot = (object, key, defaultValue) => {
        const keys = key.split('.');
        while ((key = keys.shift())) {
            if (
                !isObject(object) ||
                !hasOwn(object, key)
            ) {
                return defaultValue;
            }

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
    const hasDot = (object, key) => {
        const keys = key.split('.');
        while ((key = keys.shift())) {
            if (
                !isObject(object) ||
                !hasOwn(object, key)
            ) {
                return false;
            }

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
    const pluckDot = (objects, key, defaultValue) =>
        objects
            .map((pointer) =>
                getDot(pointer, key, defaultValue),
            );

    /**
     * Sets a specified value of a key for an object using dot notation, including wildcard segments.
     * @param {object} object The input object.
     * @param {string} key The key to set in the object.
     * @param {*} value The value to set.
     * @param {{overwrite?: boolean}} [options] Options for setting the value.
     * @param {boolean} [options.overwrite=true] Whether to overwrite the value if the key already exists.
     * @returns {void} Nothing.
     */
    const setDot = (object, key, value, { overwrite = true } = {}) =>
        setDotSegments(object, key.split('.'), value, overwrite);

    // HTML escape characters
    const escapeChars = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '\'': '&apos;',
    };

    const unescapeChars = {
        amp: '&',
        lt: '<',
        gt: '>',
        quot: '"',
        apos: '\'',
    };

    /**
     * String methods
     */

    /**
     * Splits a string into individual words.
     * @param {string} string The input string.
     * @returns {string[]} The split parts of the string.
     */
    const _splitString = (string) =>
        `${string}`
            .split(/[^a-zA-Z0-9']|(?=[A-Z])/)
            .reduce(
                (acc, word) => {
                    word = word.replace(/[^\w]/g, '').toLowerCase();
                    if (word) {
                        acc.push(word);
                    }
                    return acc;
                },
                [],
            );

    /**
     * Converts a string to camelCase.
     * @param {string} string The input string.
     * @returns {string} The camelCased string.
     */
    const camelCase = (string) =>
        _splitString(string)
            .map(
                (word, index) =>
                    index ?
                        capitalize(word) :
                        word,
            )
            .join('');

    /**
     * Converts the first character of a string to upper case and the remaining to lower case.
     * @param {string} string The input string.
     * @returns {string} The capitalized string.
     */
    const capitalize = (string) =>
        string.charAt(0).toUpperCase() +
        string.substring(1).toLowerCase();

    /**
     * Escapes HTML special characters in a string using HTML entities.
     * @param {string} string The input string.
     * @returns {string} The escaped string.
     */
    const escape = (string) =>
        string.replace(
            /[&<>"']/g,
            (match) =>
                escapeChars[match],
        );

    /**
     * Escapes RegExp special characters in a string.
     * @param {string} string The input string.
     * @returns {string} The escaped string.
     */
    const escapeRegExp = (string) =>
        string.replace(
            /[-/\\^$*+?.()|[\]{}]/g,
            (match) => match === '-' ?
                '\\x2d' :
                `\\${match}`,
        );

    /**
     * Converts a string to a humanized form.
     * @param {string} string The input string.
     * @returns {string} The humanized string.
     */
    const humanize = (string) =>
        capitalize(
            _splitString(string)
                .join(' '),
        );

    /**
     * Converts a string to kebab-case.
     * @param {string} string The input string.
     * @returns {string} The kebab-cased string.
     */
    const kebabCase = (string) =>
        _splitString(string)
            .join('-')
            .toLowerCase();

    /**
     * Converts a string to PascalCase.
     * @param {string} string The input string.
     * @returns {string} The PascalCased string.
     */
    const pascalCase = (string) =>
        _splitString(string)
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() +
                    word.substring(1),
            )
            .join('');

    /**
     * Creates a random string.
     * @param {number} [length=16] The number of characters in the output string.
     * @param {string} [chars=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789] The non-empty Unicode characters to generate the string from.
     * @throws {TypeError} If chars is empty.
     * @returns {string} The random string.
     */
    const randomString = (length = 16, chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') => {
        const characters = Array.from(chars);
        if (!characters.length) {
            throw new TypeError('chars must not be empty');
        }

        return new Array(length)
            .fill()
            .map(
                (_) =>
                    characters[randomInt(characters.length)],
            )
            .join('');
    };

    /**
     * Converts a string to snake_case.
     * @param {string} string The input string.
     * @returns {string} The snake_cased string.
     */
    const snakeCase = (string) =>
        _splitString(string)
            .join('_')
            .toLowerCase();

    /**
     * Unescapes HTML entities in a string into their corresponding characters.
     * @param {string} string The input string.
     * @returns {string} The unescaped string.
     */
    const unescape = (string) =>
        string.replace(
            /&(amp|lt|gt|quot|apos);/g,
            (_, code) =>
                unescapeChars[code],
        );

    var _ = /*#__PURE__*/Object.freeze({
        __proto__: null,
        animation: animation,
        camelCase: camelCase,
        capitalize: capitalize,
        clamp: clamp,
        clampPercent: clampPercent,
        compose: compose,
        curry: curry,
        debounce: debounce$1,
        diff: diff,
        dist: dist,
        escape: escape,
        escapeRegExp: escapeRegExp,
        evaluate: evaluate,
        extend: extend,
        flatten: flatten,
        forgetDot: forgetDot,
        getDot: getDot,
        hasDot: hasDot,
        humanize: humanize,
        intersect: intersect,
        inverseLerp: inverseLerp,
        isArray: isArray,
        isArrayLike: isArrayLike,
        isBoolean: isBoolean,
        isDocument: isDocument,
        isElement: isElement,
        isFragment: isFragment,
        isFunction: isFunction,
        isNaN: isNaN,
        isNode: isNode,
        isNull: isNull,
        isNumeric: isNumeric,
        isObject: isObject,
        isPlainObject: isPlainObject,
        isShadow: isShadow,
        isString: isString,
        isText: isText,
        isUndefined: isUndefined,
        isWindow: isWindow,
        kebabCase: kebabCase,
        len: len,
        lerp: lerp,
        map: map,
        merge: merge,
        once: once,
        partial: partial,
        pascalCase: pascalCase,
        pipe: pipe,
        pluckDot: pluckDot,
        random: random,
        randomInt: randomInt,
        randomString: randomString,
        randomValue: randomValue,
        range: range,
        setDot: setDot,
        snakeCase: snakeCase,
        throttle: throttle,
        times: times,
        toStep: toStep,
        unescape: unescape,
        unique: unique,
        wrap: wrap$2
    });

    /**
     * @typedef {import('./ajax/ajax-request.js').AjaxOptions} AjaxOptions
     * @typedef {import('./animation/animation.js').AnimationOptions} AnimationOptions
     */

    const ajaxDefaults = {
        afterSend: null,
        beforeSend: null,
        cache: true,
        contentType: 'application/x-www-form-urlencoded',
        data: null,
        headers: {},
        isLocal: null,
        method: 'GET',
        onProgress: null,
        onUploadProgress: null,
        processData: true,
        rejectOnCancel: true,
        responseType: null,
        url: null,
        xhr: (_) => {
            const { XMLHttpRequest } = getWindow();
            return new XMLHttpRequest;
        },
    };

    const animationDefaults = {
        duration: 1000,
        type: 'ease-in-out',
        infinite: false,
        debug: false,
    };

    const config = {
        context: null,
        useTimeout: false,
        window: null,
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
        if (!isDocument(context)) {
            throw new Error('fQuery requires a valid Document.');
        }

        config.context = context;
    }
    /**
     * Sets the window.
     * @param {Window} window The window.
     * @throws {Error} When window is not a Window.
     */
    function setWindow(window) {
        if (!isWindow(window)) {
            throw new Error('fQuery requires a valid Window.');
        }

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
        const baseHref = (location.origin + location.pathname).replace(/\/$/, '');

        return new URL(url, baseHref);
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

        const formData = new FormData;

        for (const [key, value] of values) {
            if (key.substring(key.length - 2) === '[]') {
                formData.append(key, value);
            } else {
                formData.set(key, value);
            }
        }

        return formData;
    }
    /**
     * Returns a URI-encoded attribute string from form entries or a data object.
     * @param {FormInput} data The input data.
     * @returns {string} The URI-encoded attribute string.
     */
    function parseParams(data) {
        const values = parseValues(data);

        const paramString = values
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&');

        return paramString;
    }
    /**
     * Returns flattened parameter entries for a key and value.
     * @param {string} key The input key.
     * @param {*} [value] The input value.
     * @returns {ParamEntry[]} The parsed parameter entries.
     */
    function parseValue(key, value) {
        if (value === null || isUndefined(value)) {
            return [];
        }

        if (isArray(value)) {
            if (key.substring(key.length - 2) !== '[]') {
                key += '[]';
            }

            return value.flatMap((val) => parseValue(key, val));
        }

        if (isObject(value)) {
            return Object.entries(value)
                .flatMap(([subKey, val]) => parseValue(`${key}[${subKey}]`, val));
        }

        return [[key, value]];
    }
    /**
     * Returns flattened parameter entries from form entries or a data object.
     * @param {FormInput} data The input data.
     * @returns {ParamEntry[]} The parsed parameter entries.
     */
    function parseValues(data) {
        if (isArray(data)) {
            return data.flatMap((value) => parseValue(value.name, value.value));
        }

        if (isObject(data)) {
            return Object.entries(data)
                .flatMap(([key, value]) => parseValue(key, value));
        }

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
    class AjaxRequest {
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

            this.#options = extend(
                {},
                getAjaxDefaults(),
                options,
            );
            this.#options.method = this.#options.method.toUpperCase();

            const isFormData = Object.prototype.toString.call(this.#options.data) === '[object FormData]';

            if (!this.#options.url) {
                this.#options.url = location.href;
            }

            if (!this.#options.cache) {
                this.#options.url = appendQueryString(this.#options.url, '_', Date.now());
            }

            if (!isFormData && !('Content-Type' in this.#options.headers) && this.#options.contentType) {
                this.#options.headers['Content-Type'] = this.#options.contentType;
            }

            if (this.#options.isLocal === null) {
                this.#options.isLocal = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(location.protocol);
            }

            if (!this.#options.isLocal && !('X-Requested-With' in this.#options.headers)) {
                this.#options.headers['X-Requested-With'] = 'XMLHttpRequest';
            }

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

            if (this.#options.data !== null && this.#options.data !== undefined) {
                if (!isFormData && this.#options.processData && isObject(this.#options.data)) {
                    if (this.#options.contentType === 'application/json') {
                        this.#options.data = JSON.stringify(this.#options.data);
                    } else if (this.#options.contentType === 'application/x-www-form-urlencoded') {
                        this.#options.data = parseParams(this.#options.data);
                    } else {
                        this.#options.data = parseFormData(this.#options.data);
                    }
                }

                if (this.#options.method === 'GET') {
                    const dataParams = createSearchParams(this.#options.data);

                    const searchParams = getSearchParams(this.#options.url);
                    for (const [key, value] of dataParams.entries()) {
                        searchParams.append(key, value);
                    }

                    this.#options.url = setSearchParams(this.#options.url, searchParams);
                    this.#options.data = null;
                }
            }

            this.xhr.open(this.#options.method, this.#options.url, true, this.#options.username, this.#options.password);

            for (const [key, value] of Object.entries(this.#options.headers)) {
                this.xhr.setRequestHeader(key, value);
            }

            if (this.#options.responseType) {
                this.xhr.responseType = this.#options.responseType;
            }

            if (this.#options.mimeType) {
                this.xhr.overrideMimeType(this.#options.mimeType);
            }

            if (this.#options.timeout) {
                this.xhr.timeout = this.#options.timeout;
            }

            this.xhr.onload = (e) => {
                if (this.xhr.status >= 400) {
                    this.#reject({
                        status: this.xhr.status,
                        xhr: this.xhr,
                        event: e,
                    });
                } else {
                    this.#resolve({
                        response: this.xhr.response,
                        xhr: this.xhr,
                        event: e,
                    });
                }
            };

            if (!this.#options.isLocal) {
                this.xhr.onerror = (e) =>
                    this.#reject({
                        status: this.xhr.status,
                        xhr: this.xhr,
                        event: e,
                    });
            }

            this.xhr.ontimeout = (e) =>
                this.#reject({
                    status: this.xhr.status,
                    xhr: this.xhr,
                    event: e,
                });

            if (this.#options.onProgress) {
                this.xhr.onprogress = (e) =>
                    this.#options.onProgress(e.loaded / e.total, this.xhr, e);
            }

            if (this.#options.onUploadProgress) {
                this.xhr.upload.onprogress = (e) =>
                    this.#options.onUploadProgress(e.loaded / e.total, this.xhr, e);
            }

            if (this.#options.beforeSend) {
                this.#options.beforeSend(this.xhr);
            }

            this.xhr.send(this.#options.data);

            if (this.#options.afterSend) {
                this.#options.afterSend(this.xhr);
            }
        }

        /**
         * Cancels a pending request.
         * @param {string} [reason='Request was cancelled'] The cancellation reason.
         */
        cancel(reason = 'Request was cancelled') {
            if (this.#isResolved || this.#isRejected || this.#isCancelled) {
                return;
            }

            this.xhr.abort();

            this.#isCancelled = true;

            if (this.#options.rejectOnCancel) {
                this.#reject({
                    status: this.xhr.status,
                    xhr: this.xhr,
                    reason,
                });
            }
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
    }

    Object.setPrototypeOf(AjaxRequest.prototype, Promise.prototype);

    /**
     * @typedef {import('./ajax-request.js').AjaxData} AjaxData
     * @typedef {import('./ajax-request.js').AjaxOptions} AjaxOptions
     */

    /**
     * Performs an XHR DELETE request.
     * @param {string|null} [url] The request URL.
     * @param {AjaxOptions} [options] The request options. The method defaults to `DELETE`.
     * @returns {AjaxRequest} A new AjaxRequest that resolves when the request is completed, or rejects on failure.
     */
    function _delete(url, options) {
        return new AjaxRequest({
            url,
            method: 'DELETE',
            ...options,
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
            ...options,
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
            method: 'PATCH',
            ...options,
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
            method: 'POST',
            ...options,
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
            method: 'PUT',
            ...options,
        });
    }

    /**
     * Represents an ordered, chainable collection of DOM nodes.
     */
    class QuerySet {
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
            this.#nodes.forEach(
                (v, i) => callback(v, i),
            );

            return this;
        }

        /**
         * Retrieves the DOM node(s) contained in the QuerySet.
         * @param {number} [index=null] The index of the node.
         * @returns {Array<Node|Window>|Node|Window|undefined} The nodes, or the node at the specified index.
         */
        get(index = null) {
            if (index === null) {
                return this.#nodes;
            }

            return index < 0 ?
                this.#nodes[index + this.#nodes.length] :
                this.#nodes[index];
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
    }

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
            if (running) {
                return;
            }

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
        return new RegExp(`^${escapeRegExp(event)}(?:\\.|$)`, 'i');
    }
    /**
     * Normalizes a CSS property value.
     * @param {string} style The CSS property name.
     * @param {string|number} value The CSS property value.
     * @returns {string|number} The normalized CSS property value.
     */
    function normalizeCssValue(style, value) {
        if (!value || !isNumeric(value)) {
            return value;
        }

        const { CSS } = getWindow();

        return !CSS.supports(style, value) ?
            `${value}px` :
            value;
    }
    /**
     * Returns a one-dimensional array of classes from nested arrays or space-separated strings.
     * @param {Array<string|string[]>} classList The classes to parse.
     * @returns {string[]} The parsed classes.
     */
    function parseClasses(classList) {
        return classList
            .flat()
            .flatMap((val) => val.split(' '))
            .filter((val) => !!val);
    }
    /**
     * Normalizes a key and value, or an existing data object, into a data object.
     * @param {string|Record<string, *>} key The data key, or an object containing data.
     * @param {*} [value] The data value.
     * @param {{json?: boolean}} [options] The options for parsing data.
     * @returns {Record<string, *>} The data object.
     */
    function parseData(key, value, { json = false } = {}) {
        const result = isString(key) ?
            { [key]: value } :
            key;

        if (!json) {
            return result;
        }

        return Object.fromEntries(
            Object.entries(result)
                .map(([key, value]) => [key, isObject(value) || isArray(value) ? JSON.stringify(value) : value]),
        );
    }
    /**
     * Parses a dataset string into a JavaScript value.
     * @param {string} value The input value.
     * @returns {boolean|number|Record<string, *>|Array<*>|string|null|undefined} The parsed value.
     */
    function parseDataset(value) {
        if (isUndefined(value)) {
            return value;
        }

        const lower = value.toLowerCase().trim();

        if (['true', 'on'].includes(lower)) {
            return true;
        }

        if (['false', 'off'].includes(lower)) {
            return false;
        }

        if (lower === 'null') {
            return null;
        }

        if (isNumeric(lower)) {
            return parseFloat(lower);
        }

        if (['{', '['].includes(lower.charAt(0))) {
            try {
                const result = JSON.parse(value);
                return result;
            } catch {
                // Ignore malformed JSON-like strings.
            }
        }

        return value;
    }
    /**
     * Returns the base event name from a namespaced event.
     * @param {string} event The namespaced event.
     * @returns {string} The real event.
     */
    function parseEvent(event) {
        return event.split('.')
            .shift();
    }
    /**
     * Returns an array of events from a space-separated string.
     * @param {string} events The events.
     * @returns {string[]} The parsed events.
     */
    function parseEvents(events) {
        return events.split(' ');
    }
    /**
     * Resolves a single node.
     * @param {QueryInput} nodes The input node(s), or a query selector or HTML string.
     * @param {((value: string) => (Node|Window|null|undefined))} stringCallback The callback used to resolve strings.
     * @param {NodeFilterCallback} nodeFilter The callback used to filter nodes.
     * @returns {Node|Window|null|undefined} The resolved node, or `undefined` if none matches.
     */
    function resolveNode(nodes, stringCallback, nodeFilter) {
        if (isString(nodes)) {
            return stringCallback(nodes);
        }

        if (nodeFilter(nodes)) {
            return nodes;
        }

        if (nodes instanceof QuerySet) {
            const node = nodes.get(0);

            return nodeFilter(node) ? node : undefined;
        }

        if (nodes && typeof nodes.item === 'function') {
            const node = nodes.item(0);

            return nodeFilter(node) ? node : undefined;
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
        if (isString(nodes)) {
            return stringCallback(nodes);
        }

        if (nodeFilter(nodes)) {
            return [nodes];
        }

        if (nodes instanceof QuerySet) {
            return nodes.get().filter(nodeFilter);
        }

        if (nodes && typeof nodes.item === 'function') {
            return merge([], nodes).filter(nodeFilter);
        }

        return [];
    }

    /**
     * Creates a Document object from a string.
     * @param {string} input The input string.
     * @param {{contentType?: DOMParserSupportedType}} [options] The parsing options.
     * @returns {Document} A new Document object.
     */
    function parseDocument(input, { contentType = 'text/html' } = {}) {
        const { DOMParser } = getWindow();
        const parser = new DOMParser;

        return parser.parseFromString(input, contentType);
    }
    /**
     * Creates an array containing elements parsed from an HTML string.
     * @param {string} html The HTML input string.
     * @returns {Element[]} The parsed elements.
     */
    function parseHTML(html) {
        const childNodes = getContext()
            .createRange()
            .createContextualFragment(html)
            .children;

        return merge([], childNodes);
    }

    /** @typedef {import('../query/query-set.js').default} QuerySet */

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

        if (!isArray(context)) {
            return resolveNodes(context, find$1, nodeFilter);
        }

        const results = context.flatMap((node) => resolveNodes(node, find$1, nodeFilter));

        return context.length > 1 && results.length > 1 ?
            unique(results) :
            results;
    }
    /**
     * Returns all nodes matching a selector.
     * @param {string} selector The query selector.
     * @param {QueryContextInput} [context=getContext()] The query context.
     * @returns {Element[]} The matching nodes.
     */
    function find$1(selector, context = getContext()) {
        if (!selector) {
            return [];
        }

        // fast selector
        const match = selector.match(/^([#.]?)([\w-]+)$/);

        if (match) {
            if (match[1] === '#') {
                return findById$1(match[2], context);
            }

            if (match[1] === '.') {
                return findByClass$1(match[2], context);
            }

            return findByTag$1(match[2], context);
        }

        if (isDocument(context) || isElement(context) || isFragment(context) || isShadow(context)) {
            return merge([], context.querySelectorAll(selector));
        }

        const nodes = resolveContexts(context);

        const results = [];

        for (const node of nodes) {
            const newNodes = node.querySelectorAll(selector);

            results.push(...newNodes);
        }

        return nodes.length > 1 && results.length > 1 ?
            unique(results) :
            results;
    }
    /**
     * Returns all nodes with a specific class.
     * @param {string} className The class name.
     * @param {QueryContextInput} [context=getContext()] The query context.
     * @returns {Element[]} The matching nodes.
     */
    function findByClass$1(className, context = getContext()) {
        if (isDocument(context) || isElement(context)) {
            return merge([], context.getElementsByClassName(className));
        }

        const selector = `.${escapeCSS(className)}`;

        if (isFragment(context) || isShadow(context)) {
            return merge([], context.querySelectorAll(selector));
        }

        const nodes = resolveContexts(context);

        const results = [];

        for (const node of nodes) {
            const newNodes = isFragment(node) || isShadow(node) ?
                node.querySelectorAll(selector) :
                node.getElementsByClassName(className);

            results.push(...newNodes);
        }

        return nodes.length > 1 && results.length > 1 ?
            unique(results) :
            results;
    }
    /**
     * Returns all nodes with a specific ID.
     * @param {string} id The id.
     * @param {QueryContextInput} [context=getContext()] The query context.
     * @returns {Element[]} The matching nodes.
     */
    function findById$1(id, context = getContext()) {
        const selector = `#${escapeCSS(id)}`;

        if (isDocument(context) || isElement(context) || isFragment(context) || isShadow(context)) {
            return merge([], context.querySelectorAll(selector));
        }

        const nodes = resolveContexts(context);

        const results = [];

        for (const node of nodes) {
            const newNodes = node.querySelectorAll(selector);

            results.push(...newNodes);
        }

        return nodes.length > 1 && results.length > 1 ?
            unique(results) :
            results;
    }
    /**
     * Returns all nodes with a specific tag.
     * @param {string} tagName The tag name.
     * @param {QueryContextInput} [context=getContext()] The query context.
     * @returns {Element[]} The matching nodes.
     */
    function findByTag$1(tagName, context = getContext()) {
        if (isDocument(context) || isElement(context)) {
            return merge([], context.getElementsByTagName(tagName));
        }

        if (isFragment(context) || isShadow(context)) {
            return merge([], context.querySelectorAll(tagName));
        }

        const nodes = resolveContexts(context);

        const results = [];

        for (const node of nodes) {
            const newNodes = isFragment(node) || isShadow(node) ?
                node.querySelectorAll(tagName) :
                node.getElementsByTagName(tagName);

            results.push(...newNodes);
        }

        return nodes.length > 1 && results.length > 1 ?
            unique(results) :
            results;
    }
    /**
     * Returns a single node matching a selector.
     * @param {string} selector The query selector.
     * @param {QueryContextInput} [context=getContext()] The query context.
     * @returns {Element|null|undefined} The matching element, or `undefined` if none matches.
     */
    function findOne$1(selector, context = getContext()) {
        if (!selector) {
            return null;
        }

        // fast selector
        const match = selector.match(/^([#.]?)([\w-]+)$/);

        if (match) {
            if (match[1] === '#') {
                return findOneById$1(match[2], context);
            }

            if (match[1] === '.') {
                return findOneByClass$1(match[2], context);
            }

            return findOneByTag$1(match[2], context);
        }

        if (isDocument(context) || isElement(context) || isFragment(context) || isShadow(context)) {
            return context.querySelector(selector);
        }

        const nodes = resolveContexts(context);

        if (!nodes.length) {
            return;
        }

        for (const node of nodes) {
            const result = node.querySelector(selector);

            if (result) {
                return result;
            }
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
        if (isDocument(context) || isElement(context)) {
            return context.getElementsByClassName(className).item(0);
        }

        const selector = `.${escapeCSS(className)}`;

        if (isFragment(context) || isShadow(context)) {
            return context.querySelector(selector);
        }

        const nodes = resolveContexts(context);

        if (!nodes.length) {
            return;
        }

        for (const node of nodes) {
            const result = isFragment(node) || isShadow(node) ?
                node.querySelector(selector) :
                node.getElementsByClassName(className).item(0);

            if (result) {
                return result;
            }
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
        if (isDocument(context)) {
            return context.getElementById(id);
        }

        const selector = `#${escapeCSS(id)}`;

        if (isElement(context) || isFragment(context) || isShadow(context)) {
            return context.querySelector(selector);
        }

        const nodes = resolveContexts(context);

        if (!nodes.length) {
            return;
        }

        for (const node of nodes) {
            const result = isDocument(node) ?
                node.getElementById(id) :
                node.querySelector(selector);

            if (result) {
                return result;
            }
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
        if (isDocument(context) || isElement(context)) {
            return context.getElementsByTagName(tagName).item(0);
        }

        if (isFragment(context) || isShadow(context)) {
            return context.querySelector(tagName);
        }

        const nodes = resolveContexts(context);

        if (!nodes.length) {
            return;
        }

        for (const node of nodes) {
            const result = isFragment(node) || isShadow(node) ?
                node.querySelector(tagName) :
                node.getElementsByTagName(tagName).item(0);

            if (result) {
                return result;
            }
        }

        return null;
    }

    /**
     * @typedef {import('./helpers.js').NodeFilterCallback} NodeFilterCallback
     * @typedef {import('./helpers.js').NodeInput} NodeInput
     * @typedef {import('./helpers.js').QueryInput} QueryInput
     * @typedef {import('./traversal/find.js').QueryContextInput} QueryContextInput
     */

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
        if (!filter) {
            return (_) => defaultValue;
        }

        if (isFunction(filter)) {
            return filter;
        }

        if (isString(filter)) {
            return (node) => isElement(node) && node.matches(filter);
        }

        if (isNode(filter) || isFragment(filter) || isShadow(filter)) {
            return (node) => node.isSameNode(filter);
        }

        filter = parseNodes(filter, {
            node: true,
            fragment: true,
            shadow: true,
        });

        if (filter.length) {
            return (node) => filter.includes(node);
        }

        return (_) => !defaultValue;
    }
    /**
     * Returns a node-containment filter callback.
     * @param {NodeFilterInput} filter The filter node(s), a query selector string or custom filter function.
     * @param {boolean} [defaultValue=true] The default return value.
     * @returns {NodeFilterCallback} The node contains filter callback.
     */
    function parseFilterContains(filter, defaultValue = true) {
        if (!filter) {
            return (_) => defaultValue;
        }

        if (isFunction(filter)) {
            return (node) => merge([], node.querySelectorAll('*')).some(filter);
        }

        if (isString(filter)) {
            return (node) => !!findOne$1(filter, node);
        }

        if (isNode(filter) || isFragment(filter) || isShadow(filter)) {
            return (node) => node.contains(filter);
        }

        filter = parseNodes(filter, {
            node: true,
            fragment: true,
            shadow: true,
        });

        if (filter.length) {
            return (node) => filter.some((other) => node.contains(other));
        }

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
        const stringCallback = (node) => options.html && node.trim().charAt(0) === '<' ?
            parseHTML(node).shift() :
            findOne$1(node, context);

        if (!isArray(nodes)) {
            return resolveNode(nodes, stringCallback, filter);
        }

        for (const node of nodes) {
            const result = resolveNode(node, stringCallback, filter);

            if (result) {
                return result;
            }
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
        const stringCallback = (node) => options.html && node.trim().charAt(0) === '<' ?
            parseHTML(node) :
            find$1(node, context);

        if (!isArray(nodes)) {
            return resolveNodes(nodes, stringCallback, filter);
        }

        const results = nodes.flatMap((node) => resolveNodes(node, stringCallback, filter));

        return nodes.length > 1 && results.length > 1 ?
            unique(results) :
            results;
    }
    /**
     * Returns a function for filtering nodes.
     * @param {NodeParseOptions} [options] The parsing options.
     * @returns {NodeFilterCallback} The node filter function.
     */
    function parseNodesFilter(options) {
        if (!options) {
            return isElement;
        }

        const callbacks = [];

        if (options.node) {
            callbacks.push(isNode);
        } else {
            callbacks.push(isElement);
        }

        if (options.document) {
            callbacks.push(isDocument);
        }

        if (options.window) {
            callbacks.push(isWindow);
        }

        if (options.fragment) {
            callbacks.push(isFragment);
        }

        if (options.shadow) {
            callbacks.push(isShadow);
        }

        return (node) => callbacks.some((callback) => callback(node));
    }

    const CONTENT_BOX = 0;
    const PADDING_BOX = 1;
    const BORDER_BOX = 2;
    const MARGIN_BOX = 3;
    const SCROLL_BOX = 4;

    const allowedTags = {
        '*': ['class', 'dir', 'id', 'lang', 'role', /^aria-[\w-]*$/i],
        'a': ['target', 'href', 'title', 'rel'],
        'area': [],
        'b': [],
        'br': [],
        'col': [],
        'code': [],
        'div': [],
        'dd': [],
        'dl': [],
        'dt': [],
        'em': [],
        'hr': [],
        'h1': [],
        'h2': [],
        'h3': [],
        'h4': [],
        'h5': [],
        'h6': [],
        'i': [],
        'img': ['src', 'alt', 'title', 'width', 'height'],
        'li': [],
        'ol': [],
        'p': [],
        'pre': [],
        's': [],
        'small': [],
        'span': [],
        'sub': [],
        'sup': [],
        'strong': [],
        'u': [],
        'ul': [],
    };

    const uriAttributes = new Set([
        'action',
        'background',
        'cite',
        'formaction',
        'href',
        'itemtype',
        'longdesc',
        'poster',
        'src',
        'xlink:href',
    ]);

    const eventLookup = {
        mousedown: ['mousemove', 'mouseup'],
        touchstart: ['touchmove', 'touchend'],
    };

    const animations = new Map();

    const data = new WeakMap();

    const events = new WeakMap();

    const queues = new WeakMap();

    const styles = new WeakMap();

    /**
     * @typedef {import('./animation.js').default} Animation
     * @typedef {import('./animation.js').StopAnimationOptions} StopAnimationOptions
     */

    /**
     * Represents a Promise-compatible collection of animations.
     */
    class AnimationSet {
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
            for (const animation of this.#animations) {
                animation.stop({ finish });
            }
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
    }

    Object.setPrototypeOf(AnimationSet.prototype, Promise.prototype);

    let animating = false;

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
        if (animating) {
            return;
        }

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

            if (!otherAnimations.length) {
                animations.delete(node);
            } else {
                animations.set(node, otherAnimations);
            }
        }

        if (!animations.size) {
            animating = false;
        } else if (config.useTimeout) {
            setTimeout(update, 1000 / 60);
        } else {
            requestAnimationFrame(update);
        }
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
    class Animation {
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
                ...options,
            };

            if (!('start' in this.#options)) {
                this.#options.start = getTime();
            }

            if (this.#options.debug) {
                this.#node.dataset.animationStart = this.#options.start;
            }

            this.#promise = new Promise((resolve, reject) => {
                this.#resolve = resolve;
                this.#reject = reject;
            });

            if (!animations.has(node)) {
                animations.set(node, []);
            }

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
            if (this.#isStopped || this.#isFinished) {
                return;
            }

            const otherAnimations = animations.get(this.#node)
                .filter((animation) => animation !== this);

            if (!otherAnimations.length) {
                animations.delete(this.#node);
            } else {
                animations.set(this.#node, otherAnimations);
            }

            if (finish) {
                this.update();
            }

            this.#isStopped = true;

            if (!finish) {
                this.#reject(this.#node);
            }
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
            if (this.#isStopped) {
                return true;
            }

            let progress;

            if (time === null) {
                progress = 1;
            } else {
                progress = (time - this.#options.start) / this.#options.duration;

                if (this.#options.infinite) {
                    progress %= 1;
                } else {
                    progress = clamp(progress);
                }

                if (this.#options.type === 'ease-in') {
                    progress = progress ** 2;
                } else if (this.#options.type === 'ease-out') {
                    progress = Math.sqrt(progress);
                } else if (this.#options.type === 'ease-in-out') {
                    if (progress <= 0.5) {
                        progress = progress ** 2 * 2;
                    } else {
                        progress = 1 - ((1 - progress) ** 2 * 2);
                    }
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

            if (progress < 1) {
                return false;
            }

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
    }

    Object.setPrototypeOf(Animation.prototype, Promise.prototype);

    /**
     * @typedef {import('../helpers.js').ElementInput} ElementInput
     * @typedef {import('./animation.js').AnimationCallback} AnimationCallback
     * @typedef {import('./animation.js').AnimationOptions} AnimationOptions
     * @typedef {import('./animation.js').StopAnimationOptions} StopAnimationOptions
     */

    /**
     * Adds an animation to each node.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @param {AnimationCallback} callback The animation callback.
     * @param {AnimationOptions} [options] The animation options.
     * @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
     */
    function animate$1(selector, callback, options) {
        const nodes = parseNodes(selector);

        const newAnimations = nodes.map((node) => new Animation(node, callback, options));

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
            if (!animations.has(node)) {
                continue;
            }

            const currentAnimations = animations.get(node);
            for (const animation of currentAnimations) {
                animation.stop({ finish });
            }
        }
    }

    /**
     * @typedef {import('../helpers.js').ElementInput} ElementInput
     * @typedef {import('./animation-set.js').default} AnimationSet
     * @typedef {import('./animation.js').AnimationOptions} AnimationOptions
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
        return slideIn$1(
            selector,
            {
                direction: 'top',
                ...options,
            },
        );
    }
    /**
     * Drops each node out of place.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @param {AnimationOptions} [options] The animation options.
     * @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
     */
    function dropOut$1(selector, options) {
        return slideOut$1(
            selector,
            {
                direction: 'top',
                ...options,
            },
        );
    }
    /**
     * Fades the opacity of each node in.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @param {AnimationOptions} [options] The animation options.
     * @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
     */
    function fadeIn$1(selector, options) {
        return animateEffect(
            selector,
            ['opacity'],
            (node, progress) =>
                node.style.setProperty(
                    'opacity',
                    progress.toFixed(2),
                ),
            options,
        );
    }
    /**
     * Fades the opacity of each node out.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @param {AnimationOptions} [options] The animation options.
     * @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
     */
    function fadeOut$1(selector, options) {
        return animateEffect(
            selector,
            ['opacity'],
            (node, progress) =>
                node.style.setProperty(
                    'opacity',
                    (1 - progress).toFixed(2),
                ),
            options,
        );
    }
    /**
     * Rotates each node in on an X, Y or Z.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @param {AnimationOptions} [options] The animation options.
     * @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
     */
    function rotateIn$1(selector, options) {
        return animateEffect(
            selector,
            ['transform'],
            (node, progress, options) => {
                const amount = ((90 - (progress * 90)) * (options.inverse ? -1 : 1)).toFixed(2);
                node.style.setProperty('transform', `rotate3d(${options.x}, ${options.y}, ${options.z}, ${amount}deg)`);
            },
            {
                x: 0,
                y: 1,
                z: 0,
                ...options,
            },
        );
    }
    /**
     * Rotates each node out on an X, Y or Z.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @param {AnimationOptions} [options] The animation options.
     * @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
     */
    function rotateOut$1(selector, options) {
        return animateEffect(
            selector,
            ['transform'],
            (node, progress, options) => {
                const amount = ((progress * 90) * (options.inverse ? -1 : 1)).toFixed(2);
                node.style.setProperty('transform', `rotate3d(${options.x}, ${options.y}, ${options.z}, ${amount}deg)`);
            },
            {
                x: 0,
                y: 1,
                z: 0,
                ...options,
            },
        );
    }
    /**
     * Slides each node in from a direction.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @param {AnimationOptions} [options] The animation options.
     * @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
     */
    function slideIn$1(selector, options) {
        options = {
            direction: 'bottom',
            useGpu: true,
            ...options,
        };

        return animateEffect(
            selector,
            options.useGpu ?
                ['transform'] :
                ['margin-left', 'margin-top'],
            (node, progress, options) => {
                const dir = evaluate(options.direction);

                let size; let translateStyle; let inverse;
                if (['top', 'bottom'].includes(dir)) {
                    size = node.clientHeight;
                    translateStyle = options.useGpu ?
                        'Y' :
                        'margin-top';
                    inverse = dir === 'top';
                } else {
                    size = node.clientWidth;
                    translateStyle = options.useGpu ?
                        'X' :
                        'margin-left';
                    inverse = dir === 'left';
                }

                const translateAmount = ((size - (size * progress)) * (inverse ? -1 : 1)).toFixed(2);
                if (options.useGpu) {
                    node.style.setProperty('transform', `translate${translateStyle}(${translateAmount}px)`);
                } else {
                    node.style.setProperty(translateStyle, `${translateAmount}px`);
                }
            },
            options,
        );
    }
    /**
     * Slides each node out from a direction.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @param {AnimationOptions} [options] The animation options.
     * @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
     */
    function slideOut$1(selector, options) {
        options = {
            direction: 'bottom',
            useGpu: true,
            ...options,
        };

        return animateEffect(
            selector,
            options.useGpu ?
                ['transform'] :
                ['margin-left', 'margin-top'],
            (node, progress, options) => {
                const dir = evaluate(options.direction);

                let size; let translateStyle; let inverse;
                if (['top', 'bottom'].includes(dir)) {
                    size = node.clientHeight;
                    translateStyle = options.useGpu ?
                        'Y' :
                        'margin-top';
                    inverse = dir === 'top';
                } else {
                    size = node.clientWidth;
                    translateStyle = options.useGpu ?
                        'X' :
                        'margin-left';
                    inverse = dir === 'left';
                }

                const translateAmount = (size * progress * (inverse ? -1 : 1)).toFixed(2);
                if (options.useGpu) {
                    node.style.setProperty('transform', `translate${translateStyle}(${translateAmount}px)`);
                } else {
                    node.style.setProperty(translateStyle, `${translateAmount}px`);
                }
            },
            options,
        );
    }
    /**
     * Squeezes each node in from a direction.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @param {AnimationOptions} [options] The animation options.
     * @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
     */
    function squeezeIn$1(selector, options) {
        options = {
            direction: 'bottom',
            useGpu: true,
            ...options,
        };

        return animateEffect(
            selector,
            options.useGpu ?
                ['height', 'overflow', 'transform', 'width'] :
                ['height', 'margin-left', 'margin-top', 'overflow', 'width'],
            (node, progress, options, initialStyles) => {
                node.style.setProperty('height', initialStyles.height.value);
                node.style.setProperty('width', initialStyles.width.value);
                node.style.setProperty('overflow', 'hidden');

                const dir = evaluate(options.direction);

                let size; let sizeStyle; let translateStyle;
                if (['top', 'bottom'].includes(dir)) {
                    size = node.clientHeight;
                    sizeStyle = 'height';
                    if (dir === 'top') {
                        translateStyle = options.useGpu ?
                            'Y' :
                            'margin-top';
                    }
                } else {
                    size = node.clientWidth;
                    sizeStyle = 'width';
                    if (dir === 'left') {
                        translateStyle = options.useGpu ?
                            'X' :
                            'margin-left';
                    }
                }

                const amount = (size * progress).toFixed(2);

                node.style.setProperty(sizeStyle, `${amount}px`);

                if (translateStyle) {
                    const translateAmount = (size - amount).toFixed(2);
                    if (options.useGpu) {
                        node.style.setProperty('transform', `translate${translateStyle}(${translateAmount}px)`);
                    } else {
                        node.style.setProperty(translateStyle, `${translateAmount}px`);
                    }
                }
            },
            options,
        );
    }
    /**
     * Squeezes each node out from a direction.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @param {AnimationOptions} [options] The animation options.
     * @returns {AnimationSet} A new AnimationSet that resolves when the animation has completed.
     */
    function squeezeOut$1(selector, options) {
        options = {
            direction: 'bottom',
            useGpu: true,
            ...options,
        };

        return animateEffect(
            selector,
            options.useGpu ?
                ['height', 'overflow', 'transform', 'width'] :
                ['height', 'margin-left', 'margin-top', 'overflow', 'width'],
            (node, progress, options, initialStyles) => {
                node.style.setProperty('height', initialStyles.height.value);
                node.style.setProperty('width', initialStyles.width.value);
                node.style.setProperty('overflow', 'hidden');

                const dir = evaluate(options.direction);

                let size; let sizeStyle; let translateStyle;
                if (['top', 'bottom'].includes(dir)) {
                    size = node.clientHeight;
                    sizeStyle = 'height';
                    if (dir === 'top') {
                        translateStyle = options.useGpu ?
                            'Y' :
                            'margin-top';
                    }
                } else {
                    size = node.clientWidth;
                    sizeStyle = 'width';
                    if (dir === 'left') {
                        translateStyle = options.useGpu ?
                            'X' :
                            'margin-left';
                    }
                }

                const amount = (size - (size * progress)).toFixed(2);

                node.style.setProperty(sizeStyle, `${amount}px`);

                if (translateStyle) {
                    const translateAmount = (size - amount).toFixed(2);
                    if (options.useGpu) {
                        node.style.setProperty('transform', `translate${translateStyle}(${translateAmount}px)`);
                    } else {
                        node.style.setProperty(translateStyle, `${translateAmount}px`);
                    }
                }
            },
            options,
        );
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
        const initialStyles = new WeakMap;

        return animate$1(selector, (node, progress, options) => {
            if (!initialStyles.has(node)) {
                initialStyles.set(
                    node,
                    Object.fromEntries(
                        properties.map((property) => [
                            property,
                            {
                                priority: node.style.getPropertyPriority(property),
                                value: node.style.getPropertyValue(property),
                            },
                        ]),
                    ),
                );
            }

            const styles = initialStyles.get(node);

            if (progress < 1) {
                callback(node, progress, options, styles);
                return;
            }

            for (const [property, { priority, value }] of Object.entries(styles)) {
                node.style.setProperty(property, value, priority);
            }
        }, options);
    }

    /** @typedef {import('../helpers.js').ElementInput} ElementInput */

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

        if (!node) {
            return;
        }

        return node.attachShadow({
            mode: open ?
                'open' :
                'closed',
        });
    }
    /**
     * Creates a new DOM element.
     * @param {string} [tagName='div'] The type of HTML element to create.
     * @param {CreateOptions} [options] The element options.
     * @returns {HTMLElement} The new HTMLElement.
     */
    function create(tagName = 'div', options = {}) {
        const node = getContext().createElement(tagName);

        if ('html' in options) {
            node.innerHTML = options.html;
        } else if ('text' in options) {
            node.textContent = options.text;
        }

        if ('class' in options) {
            const classes = parseClasses(wrap$2(options.class));

            node.classList.add(...classes);
        }

        if ('style' in options) {
            for (let [style, value] of Object.entries(options.style)) {
                style = kebabCase(style);
                value = normalizeCssValue(style, value);

                node.style.setProperty(style, value);
            }
        }

        if ('value' in options) {
            node.value = options.value;
        }

        if ('attributes' in options) {
            for (const [key, value] of Object.entries(options.attributes)) {
                node.setAttribute(key, value);
            }
        }

        if ('properties' in options) {
            for (const [key, value] of Object.entries(options.properties)) {
                node[key] = value;
            }
        }

        if ('dataset' in options) {
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

    /**
     * @typedef {import('../filters.js').NodeFilterInput} NodeFilterInput
     * @typedef {import('../helpers.js').ElementInput} ElementInput
     * @typedef {import('../helpers.js').NodeInput} NodeInput
     * @typedef {import('../helpers.js').QueryInput} QueryInput
     */

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
        const node = parseNode(selector, {
            node: true,
        });

        if (!node || !node.parentNode) {
            return;
        }

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
            shadow: true,
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
            document: true,
        });

        for (const node of nodes) {
            node.normalize();
        }
    }
    /**
     * Returns a serialized string containing names and values of all form nodes.
     * @param {NodeInput} selector The input node(s), or a query selector string.
     * @returns {string} The serialized string.
     */
    function serialize$1(selector) {
        return parseParams(
            serializeArray$1(selector),
        );
    }
    /**
     * Returns a serialized array containing names and values of all form nodes.
     * @param {NodeInput} selector The input node(s), or a query selector string.
     * @returns {Array<{name: string, value: string}>} The serialized entries.
     */
    function serializeArray$1(selector) {
        return parseNodes(selector, {
            fragment: true,
            shadow: true,
        }).reduce(
            (values, node) => {
                if (
                    (isElement(node) && node.matches('form')) ||
                    isFragment(node) ||
                    isShadow(node)
                ) {
                    return values.concat(
                        serializeArray$1(
                            node.querySelectorAll(
                                'input, select, textarea',
                            ),
                        ),
                    );
                }

                if (
                    isElement(node) &&
                    node.matches('[disabled], input[type=submit], input[type=reset], input[type=file], input[type=radio]:not(:checked), input[type=checkbox]:not(:checked)')
                ) {
                    return values;
                }

                const name = node.getAttribute('name');
                if (!name) {
                    return values;
                }

                if (
                    isElement(node) &&
                    node.matches('select[multiple]')
                ) {
                    for (const option of node.selectedOptions) {
                        values.push(
                            {
                                name,
                                value: option.value || '',
                            },
                        );
                    }
                } else {
                    values.push(
                        {
                            name,
                            value: node.value || '',
                        },
                    );
                }

                return values;
            },
            [],
        );
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
            window: true,
        }).sort((node, other) => {
            if (isWindow(node)) {
                return 1;
            }

            if (isWindow(other)) {
                return -1;
            }

            if (isDocument(node)) {
                return 1;
            }

            if (isDocument(other)) {
                return -1;
            }

            if (isFragment(other)) {
                return 1;
            }

            if (isFragment(node)) {
                return -1;
            }

            const isNodeShadow = isShadow(node);
            const isOtherShadow = isShadow(other);

            if (isNodeShadow) {
                node = node.host;
            }

            if (isOtherShadow) {
                other = other.host;
            }

            if (!node.isConnected || !other.isConnected) {
                if (node.isConnected !== other.isConnected) {
                    if (isNodeShadow && !node.isConnected) {
                        return 1;
                    }

                    if (isOtherShadow && !other.isConnected) {
                        return -1;
                    }

                    return node.isConnected ?
                        1 :
                        -1;
                }

                return 0;
            }

            if (node.isSameNode(other)) {
                return 0;
            }

            const pos = node.compareDocumentPosition(other);

            if (pos & Node.DOCUMENT_POSITION_FOLLOWING || pos & Node.DOCUMENT_POSITION_CONTAINED_BY) {
                return -1;
            }

            if (pos & Node.DOCUMENT_POSITION_PRECEDING || pos & Node.DOCUMENT_POSITION_CONTAINS) {
                return 1;
            }

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

        if (!node) {
            return;
        }

        return node.tagName.toLowerCase();
    }

    /**
     * @typedef {import('../filters.js').NodeFilterInput} NodeFilterInput
     * @typedef {import('../helpers.js').NodeInput} NodeInput
     */

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
            document: true,
        });

        const results = [];

        for (const node of nodes) {
            const childNodes = elementsOnly ?
                merge([], node.children) :
                merge([], node.childNodes);

            for (const child of childNodes) {
                if (!nodeFilter(child)) {
                    continue;
                }

                results.push(child);

                if (first) {
                    break;
                }
            }
        }

        return nodes.length > 1 && results.length > 1 ?
            unique(results) :
            results;
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

        if (!nodes.length) {
            return;
        }

        // Make sure all nodes have a parent
        if (nodes.some((node) => !node.parentNode)) {
            return;
        }

        const range = createRange();

        if (nodes.length === 1) {
            range.selectNode(nodes.shift());
        } else {
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

        if (!node) {
            return;
        }

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

        // DocumentFragment and ShadowRoot nodes can not have siblings
        const nodes = parseNodes(selector, {
            node: true,
        });

        const results = [];

        for (let node of nodes) {
            while (node = node.nextSibling) {
                if (!isElement(node)) {
                    continue;
                }

                if (nodeFilter(node)) {
                    results.push(node);
                }

                break;
            }
        }

        return nodes.length > 1 && results.length > 1 ?
            unique(results) :
            results;
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

        // DocumentFragment and ShadowRoot nodes can not have siblings
        const nodes = parseNodes(selector, {
            node: true,
        });

        const results = [];

        for (let node of nodes) {
            while (node = node.nextSibling) {
                if (!isElement(node)) {
                    continue;
                }

                if (limitFilter(node)) {
                    break;
                }

                if (!nodeFilter(node)) {
                    continue;
                }

                results.push(node);

                if (first) {
                    break;
                }
            }
        }

        return nodes.length > 1 && results.length > 1 ?
            unique(results) :
            results;
    }
    /**
     * Returns the offset parent (relatively positioned) of the first node.
     * @param {NodeInput} selector The input node(s), or a query selector string.
     * @returns {Element|null|undefined} The offset parent, or `undefined` if no node matches.
     */
    function offsetParent$1(selector) {
        const node = parseNode(selector);

        if (!node) {
            return;
        }

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

        // DocumentFragment and ShadowRoot nodes have no parent
        const nodes = parseNodes(selector, {
            node: true,
        });

        const results = [];

        for (let node of nodes) {
            node = node.parentNode;

            if (!node) {
                continue;
            }

            if (!nodeFilter(node)) {
                continue;
            }

            results.push(node);
        }

        return nodes.length > 1 && results.length > 1 ?
            unique(results) :
            results;
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

        // DocumentFragment and ShadowRoot nodes have no parent
        const nodes = parseNodes(selector, {
            node: true,
        });

        const results = [];

        for (let node of nodes) {
            const parents = [];
            while (node = node.parentNode) {
                if (isDocument(node)) {
                    break;
                }

                if (limitFilter(node)) {
                    break;
                }

                if (!nodeFilter(node)) {
                    continue;
                }

                parents.unshift(node);

                if (first) {
                    break;
                }
            }

            results.push(...parents);
        }

        return nodes.length > 1 && results.length > 1 ?
            unique(results) :
            results;
    }
    /**
     * Returns the previous sibling for each node (optionally matching a filter).
     * @param {NodeInput} selector The input node(s), or a query selector string.
     * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
     * @returns {Node[]} The matching nodes.
     */
    function prev$1(selector, nodeFilter) {
        nodeFilter = parseFilter(nodeFilter);

        // DocumentFragment and ShadowRoot nodes can not have siblings
        const nodes = parseNodes(selector, {
            node: true,
        });

        const results = [];

        for (let node of nodes) {
            while (node = node.previousSibling) {
                if (!isElement(node)) {
                    continue;
                }

                if (nodeFilter(node)) {
                    results.push(node);
                }

                break;
            }
        }

        return nodes.length > 1 && results.length > 1 ?
            unique(results) :
            results;
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

        // DocumentFragment and ShadowRoot nodes can not have siblings
        const nodes = parseNodes(selector, {
            node: true,
        });

        const results = [];

        for (let node of nodes) {
            const siblings = [];
            while (node = node.previousSibling) {
                if (!isElement(node)) {
                    continue;
                }

                if (limitFilter(node)) {
                    break;
                }

                if (!nodeFilter(node)) {
                    continue;
                }

                siblings.unshift(node);

                if (first) {
                    break;
                }
            }

            results.push(...siblings);
        }

        return nodes.length > 1 && results.length > 1 ?
            unique(results) :
            results;
    }
    /**
     * Returns the ShadowRoot of the first node.
     * @param {NodeInput} selector The input node(s), or a query selector string.
     * @returns {ShadowRoot|null|undefined} The ShadowRoot, or `undefined` if no node matches.
     */
    function shadow$1(selector) {
        const node = parseNode(selector);

        if (!node) {
            return;
        }

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

        // DocumentFragment and ShadowRoot nodes can not have siblings
        const nodes = parseNodes(selector, {
            node: true,
        });

        const results = [];

        for (const node of nodes) {
            const parent = node.parentNode;

            if (!parent) {
                continue;
            }

            const siblings = elementsOnly ?
                parent.children :
                parent.childNodes;

            let sibling;
            for (sibling of siblings) {
                if (node.isSameNode(sibling)) {
                    continue;
                }

                if (!nodeFilter(sibling)) {
                    continue;
                }

                results.push(sibling);
            }
        }

        return nodes.length > 1 && results.length > 1 ?
            unique(results) :
            results;
    }

    /** @typedef {import('./event-handlers.js').EventCallback} EventCallback */

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

            if (!matches.length) {
                return false;
            }

            if (matches.includes(target)) {
                return target;
            }

            return closest$1(
                target,
                (parent) => matches.includes(parent),
                (parent) => parent.isSameNode(node),
            ).shift();
        };
    }
    /**
     * Returns a function for matching a delegate target to a standard selector.
     * @param {Element|ShadowRoot|Document} node The input node.
     * @param {string} selector The delegate query selector.
     * @returns {DelegateCallback} The callback for finding the matching delegate.
     */
    function getDelegateMatchFactory(node, selector) {
        return (target) =>
            target.matches && target.matches(selector) ?
                target :
                closest$1(
                    target,
                    (parent) => parent.matches(selector),
                    (parent) => parent.isSameNode(node),
                ).shift();
    }
    /**
     * Returns a wrapped event callback that executes on a delegate selector.
     * @param {Element|ShadowRoot|Document} node The input node.
     * @param {string} selector The delegate query selector.
     * @param {EventCallback} callback The event callback.
     * @returns {EventCallback} The delegated event callback.
     */
    function delegateFactory(node, selector, callback) {
        const getDelegate = selector.match(/(?:^\s*:scope|,(?=(?:(?:[^"']*["']){2})*[^"']*$)\s*:scope)/) ?
            getDelegateContainsFactory(node, selector) :
            getDelegateMatchFactory(node, selector);

        return (event) => {
            if (node.isSameNode(event.target)) {
                return;
            }

            const delegate = getDelegate(event.target);

            if (!delegate) {
                return;
            }

            Object.defineProperty(event, 'currentTarget', {
                configurable: true,
                enumerable: true,
                value: delegate,
            });
            Object.defineProperty(event, 'delegateTarget', {
                configurable: true,
                enumerable: true,
                value: node,
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
            if (!event.delegateTarget) {
                return callback(event);
            }

            Object.defineProperty(event, 'currentTarget', {
                configurable: true,
                enumerable: true,
                value: node,
            });
            Object.defineProperty(event, 'delegateTarget', {
                writable: true,
            });

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
            if ('namespaceRegExp' in event && !event.namespaceRegExp.test(eventName)) {
                return;
            }

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
            if (callback(event) === false) {
                event.preventDefault();
            }
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

    /** @typedef {import('../query/query-set.js').default} QuerySet */

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
            window: true,
        });

        eventNames = parseEvents(eventNames);

        for (const eventName of eventNames) {
            const realEventName = parseEvent(eventName);

            const eventData = {
                callback,
                delegate,
                selfDestruct,
                capture,
                passive,
            };

            for (const node of nodes) {
                if (!events.has(node)) {
                    events.set(node, {});
                }

                const nodeEvents = events.get(node);

                let realCallback = callback;

                if (selfDestruct) {
                    realCallback = selfDestructCallbackFactory(
                        realCallback,
                        (_) => removeEvent$1(node, eventName, callback, { capture, delegate }),
                    );
                }

                realCallback = preventFactory(realCallback);

                if (delegate) {
                    realCallback = delegateFactory(node, delegate, realCallback);
                } else {
                    realCallback = delegateFactoryClean(node, realCallback);
                }

                realCallback = namespaceFactory(eventName, realCallback);

                eventData.realCallback = realCallback;
                eventData.eventName = eventName;
                eventData.realEventName = realEventName;

                if (!nodeEvents[realEventName]) {
                    nodeEvents[realEventName] = [];
                }

                nodeEvents[realEventName].push({ ...eventData });

                node.addEventListener(realEventName, realCallback, { capture, passive });
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
        addEvent$1(selector, events, callback, { capture, delegate, passive });
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
        addEvent$1(selector, events, callback, { capture, delegate, passive, selfDestruct: true });
    }
    /**
     * Adds self-destructing events to each node.
     * @param {EventTargetInput} selector The input node(s), or a query selector string.
     * @param {string} events The event names.
     * @param {EventCallback} callback The callback to execute.
     * @param {EventOptions} [options] The event options.
     */
    function addEventOnce$1(selector, events, callback, { capture = false, passive = false } = {}) {
        addEvent$1(selector, events, callback, { capture, passive, selfDestruct: true });
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
            window: true,
        });

        for (const node of nodes) {
            if (!events.has(node)) {
                continue;
            }

            const nodeEvents = events.get(node);

            for (const realEvents of Object.values(nodeEvents)) {
                for (const eventData of realEvents) {
                    addEvent$1(
                        otherSelector,
                        eventData.eventName,
                        eventData.callback,
                        {
                            capture: eventData.capture,
                            delegate: eventData.delegate,
                            passive: eventData.passive,
                            selfDestruct: eventData.selfDestruct,
                        },
                    );
                }
            }
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
            window: true,
        });

        let eventLookup;
        if (eventNames) {
            eventNames = parseEvents(eventNames);

            eventLookup = {};

            for (const eventName of eventNames) {
                const realEventName = parseEvent(eventName);

                if (!(realEventName in eventLookup)) {
                    eventLookup[realEventName] = [];
                }

                eventLookup[realEventName].push(eventName);
            }
        }

        for (const node of nodes) {
            if (!events.has(node)) {
                continue;
            }

            const nodeEvents = events.get(node);

            for (const [realEventName, realEvents] of Object.entries(nodeEvents)) {
                if (eventLookup && !(realEventName in eventLookup)) {
                    continue;
                }

                const otherEvents = realEvents.filter((eventData) => {
                    if (eventLookup && !eventLookup[realEventName].some((eventName) => {
                        if (eventName === realEventName) {
                            return true;
                        }

                        const regExp = eventNamespacedRegExp(eventName);

                        return eventData.eventName.match(regExp);
                    })) {
                        return true;
                    }

                    if (callback && callback !== eventData.callback) {
                        return true;
                    }

                    if (delegate && delegate !== eventData.delegate) {
                        return true;
                    }

                    if (capture !== null && capture !== eventData.capture) {
                        return true;
                    }

                    node.removeEventListener(realEventName, eventData.realCallback, eventData.capture);

                    return false;
                });

                if (!otherEvents.length) {
                    delete nodeEvents[realEventName];
                }
            }

            if (!Object.keys(nodeEvents).length) {
                events.delete(node);
            }
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
        removeEvent$1(selector, events, callback, { capture, delegate });
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
            window: true,
        });

        events = parseEvents(events);

        for (const event of events) {
            const realEvent = parseEvent(event);

            const eventData = createEvent(realEvent, {
                detail,
                bubbles,
                cancelable,
            });

            if (data) {
                Object.assign(eventData, data);
            }

            if (realEvent !== event) {
                eventData.namespace = event.substring(realEvent.length + 1);
                eventData.namespaceRegExp = eventNamespacedRegExp(event);
            }

            for (const node of nodes) {
                node.dispatchEvent(eventData);
            }
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
            window: true,
        });

        const realEvent = parseEvent(event);

        const eventData = createEvent(realEvent, {
            detail,
            bubbles,
            cancelable,
        });

        if (data) {
            Object.assign(eventData, data);
        }

        if (realEvent !== event) {
            eventData.namespace = event.substring(realEvent.length + 1);
            eventData.namespaceRegExp = eventNamespacedRegExp(event);
        }

        return node.dispatchEvent(eventData);
    }

    /**
     * @typedef {import('../helpers.js').NodeInput} NodeInput
     */

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
        // ShadowRoot nodes can not be cloned
        const nodes = parseNodes(selector, {
            node: true,
            fragment: true,
        });

        return nodes.map((node) => {
            const clone = node.cloneNode(deep);

            if (events || data || animations) {
                deepClone(node, clone, { deep, events, data, animations });
            }

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

            for (const realEvents of Object.values(nodeEvents)) {
                for (const eventData of realEvents) {
                    addEvent$1(
                        clone,
                        eventData.eventName,
                        eventData.callback,
                        {
                            capture: eventData.capture,
                            delegate: eventData.delegate,
                            passive: eventData.passive,
                            selfDestruct: eventData.selfDestruct,
                        },
                    );
                }
            }
        }

        if (data$1 && data.has(node)) {
            const nodeData = data.get(node);
            data.set(clone, { ...nodeData });
        }

        if (animations$1 && animations.has(node)) {
            const nodeAnimations = animations.get(node);

            for (const animation of nodeAnimations) {
                animation.clone(clone);
            }
        }

        if (deep) {
            for (const [i, child] of node.childNodes.entries()) {
                const childClone = clone.childNodes.item(i);
                deepClone(child, childClone, { deep, events: events$1, data: data$1, animations: animations$1 });
            }
        }
    }
    /**
     * Detaches each node from the DOM.
     * @param {NodeInput} selector The input node(s), or a query selector string.
     * @returns {Node[]} The detached nodes.
     */
    function detach$1(selector) {
        // DocumentFragment and ShadowRoot nodes can not be detached
        const nodes = parseNodes(selector, {
            node: true,
        });

        for (const node of nodes) {
            node.remove();
        }

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
            document: true,
        });

        for (const node of nodes) {
            const childNodes = merge([], node.childNodes);

            // Remove descendant elements
            for (const child of childNodes) {
                if (isElement(child) || isFragment(child) || isShadow(child)) {
                    removeNode(child);
                }

                child.remove();
            }

            // Remove ShadowRoot
            if (node.shadowRoot) {
                removeNode(node.shadowRoot);
            }

            // Remove DocumentFragment
            if (node.content) {
                removeNode(node.content);
            }
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
            shadow: true,
        });

        for (const node of nodes) {
            if (isElement(node) || isFragment(node) || isShadow(node)) {
                removeNode(node);
            }

            // DocumentFragment and ShadowRoot nodes can not be removed
            if (isNode(node)) {
                node.remove();
            }
        }
    }
    /**
     * Removes all data for a single node.
     * @param {Node} node The node.
     */
    function removeNode(node) {
        if (events.has(node)) {
            const nodeEvents = events.get(node);

            if ('remove' in nodeEvents) {
                const eventData = createEvent('remove', {
                    bubbles: false,
                    cancelable: false,
                });

                node.dispatchEvent(eventData);
            }

            for (const [realEventName, realEvents] of Object.entries(nodeEvents)) {
                for (const eventData of realEvents) {
                    node.removeEventListener(realEventName, eventData.realCallback, { capture: eventData.capture });
                }
            }

            events.delete(node);
        }

        if (queues.has(node)) {
            queues.delete(node);
        }

        if (animations.has(node)) {
            const nodeAnimations = animations.get(node);
            for (const animation of nodeAnimations) {
                animation.stop();
            }
        }

        if (styles.has(node)) {
            styles.delete(node);
        }

        if (data.has(node)) {
            data.delete(node);
        }

        // Remove descendant elements
        const childNodes = merge([], node.children);

        for (const child of childNodes) {
            removeNode(child);
        }

        // Remove ShadowRoot
        if (node.shadowRoot) {
            removeNode(node.shadowRoot);
        }

        // Remove DocumentFragment
        if (node.content) {
            removeNode(node.content);
        }
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
        // DocumentFragment and ShadowRoot nodes can not be removed
        let nodes = parseNodes(selector, {
            node: true,
        });

        // ShadowRoot nodes can not be cloned
        let others = parseNodes(otherSelector, {
            node: true,
            fragment: true,
            html: true,
        });

        // Move nodes to a fragment so they don't get removed
        const fragment = createFragment();

        for (const other of others) {
            fragment.insertBefore(other, null);
        }

        others = merge([], fragment.childNodes);

        nodes = nodes.filter((node) =>
            !others.includes(node) &&
            !nodes.some((other) =>
                !other.isSameNode(node) &&
                other.contains(node),
            ),
        );

        for (const [i, node] of nodes.entries()) {
            const parent = node.parentNode;

            if (!parent) {
                continue;
            }

            let clones;
            if (i === nodes.length - 1) {
                clones = others;
            } else {
                clones = clone$1(others, {
                    events: true,
                    data: true,
                    animations: true,
                });
            }

            for (const clone of clones) {
                parent.insertBefore(clone, node);
            }
        }

        remove$1(nodes);
    }

    /** @typedef {import('../helpers.js').ElementInput} ElementInput */

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

        if (!node) {
            return;
        }

        if (attribute) {
            return node.getAttribute(attribute);
        }

        return Object.fromEntries(
            merge([], node.attributes)
                .map((attribute) => [attribute.nodeName, attribute.nodeValue]),
        );
    }
    /**
     * Gets dataset value(s) for the first node.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @param {string} [key] The dataset key.
     * @returns {*|undefined} The dataset value, all dataset values, or `undefined` if no element matches.
     */
    function getDataset$2(selector, key) {
        const node = parseNode(selector);

        if (!node) {
            return;
        }

        if (key) {
            key = camelCase(key);

            return parseDataset(node.dataset[key]);
        }

        return Object.fromEntries(
            Object.entries(node.dataset)
                .map(([key, value]) => [key, parseDataset(value)]),
        );
    }
    /**
     * Gets the HTML contents of the first node.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @returns {string|undefined} The HTML contents, or `undefined` if no element matches.
     */
    function getHTML$1(selector) {
        return getProperty$1(selector, 'innerHTML');
    }
    /**
     * Gets a property value for the first node.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @param {string} property The property name.
     * @returns {*|undefined} The property value, or `undefined` if no element matches.
     */
    function getProperty$1(selector, property) {
        const node = parseNode(selector);

        if (!node) {
            return;
        }

        return node[property];
    }
    /**
     * Gets the text contents of the first node.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @returns {string|null|undefined} The text contents, or `undefined` if no element matches.
     */
    function getText$1(selector) {
        return getProperty$1(selector, 'textContent');
    }
    /**
     * Gets the value property of the first node.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @returns {*|undefined} The value, or `undefined` if no element matches.
     */
    function getValue$1(selector) {
        return getProperty$1(selector, 'value');
    }
    /**
     * Removes an attribute from each node.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @param {string} attribute The attribute name.
     */
    function removeAttribute$1(selector, attribute) {
        const nodes = parseNodes(selector);

        for (const node of nodes) {
            node.removeAttribute(attribute);
        }
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

        for (const node of nodes) {
            delete node[property];
        }
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

        for (const [key, value] of Object.entries(attributes)) {
            for (const node of nodes) {
                node.setAttribute(key, value);
            }
        }
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
            for (const node of nodes) {
                node.dataset[key] = value;
            }
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

            for (const child of childNodes) {
                removeNode(child);
            }

            // Remove ShadowRoot
            if (node.shadowRoot) {
                removeNode(node.shadowRoot);
            }

            // Remove DocumentFragment
            if (node.content) {
                removeNode(node.content);
            }

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

        for (const [key, value] of Object.entries(properties)) {
            for (const node of nodes) {
                node[key] = value;
            }
        }
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

            for (const child of childNodes) {
                removeNode(child);
            }

            // Remove ShadowRoot
            if (node.shadowRoot) {
                removeNode(node.shadowRoot);
            }

            // Remove DocumentFragment
            if (node.content) {
                removeNode(node.content);
            }

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

        for (const node of nodes) {
            node.value = value;
        }
    }

    /** @typedef {import('../helpers.js').QueryInput} QueryInput */

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
            window: true,
        });

        const others = parseNodes(otherSelector, {
            fragment: true,
            shadow: true,
            document: true,
            window: true,
        });

        for (const node of nodes) {
            if (!data.has(node)) {
                continue;
            }

            const nodeData = data.get(node);
            setData$1(others, { ...nodeData });
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
            window: true,
        });

        if (!node || !data.has(node)) {
            return;
        }

        const nodeData = data.get(node);

        return key ?
            nodeData[key] :
            nodeData;
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
            window: true,
        });

        for (const node of nodes) {
            if (!data.has(node)) {
                continue;
            }

            const nodeData = data.get(node);

            if (key) {
                delete nodeData[key];
            }

            if (!key || !Object.keys(nodeData).length) {
                data.delete(node);
            }
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
            window: true,
        });

        const newData = parseData(key, value);

        for (const node of nodes) {
            if (!data.has(node)) {
                data.set(node, {});
            }

            const nodeData = data.get(node);

            Object.assign(nodeData, newData);
        }
    }

    /** @typedef {import('../helpers.js').ElementInput} ElementInput */

    /** @typedef {Record<string, string|number>} StyleValues */

    /**
     * Adds classes to each node.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @param {...string|string[]} classes The classes.
     */
    function addClass$1(selector, ...classes) {
        const nodes = parseNodes(selector);

        classes = parseClasses(classes);

        if (!classes.length) {
            return;
        }

        for (const node of nodes) {
            node.classList.add(...classes);
        }
    }
    /**
     * Gets computed CSS style value(s) for the first node.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @param {string} [style] The CSS style name.
     * @returns {string|Record<string, string>|undefined} The CSS style value, all computed styles, or `undefined` if no element matches.
     */
    function css$1(selector, style) {
        const node = parseNode(selector);

        if (!node) {
            return;
        }

        if (!styles.has(node)) {
            styles.set(
                node,
                getWindow().getComputedStyle(node),
            );
        }

        const nodeStyles = styles.get(node);

        if (!style) {
            const result = {};

            for (const property of nodeStyles) {
                result[property] = nodeStyles.getPropertyValue(property);
            }

            return result;
        }

        style = kebabCase(style);

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

        if (!node) {
            return;
        }

        if (style) {
            style = kebabCase(style);

            return node.style[style];
        }

        const styles = {};

        for (const style of node.style) {
            styles[style] = node.style[style];
        }

        return styles;
    }
    /**
     * Hides each node from display.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     */
    function hide$1(selector) {
        const nodes = parseNodes(selector);

        for (const node of nodes) {
            node.style.setProperty('display', 'none');
        }
    }
    /**
     * Removes classes from each node.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @param {...string|string[]} classes The classes.
     */
    function removeClass$1(selector, ...classes) {
        const nodes = parseNodes(selector);

        classes = parseClasses(classes);

        if (!classes.length) {
            return;
        }

        for (const node of nodes) {
            node.classList.remove(...classes);
        }
    }
    /**
     * Removes a style property from each node.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @param {string} style The style name.
     */
    function removeStyle$1(selector, style) {
        const nodes = parseNodes(selector);

        style = kebabCase(style);

        for (const node of nodes) {
            node.style.removeProperty(style);
        }
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
            style = kebabCase(style);
            value = normalizeCssValue(style, value);

            for (const node of nodes) {
                node.style.setProperty(
                    style,
                    value,
                    important ?
                        'important' :
                        '',
                );
            }
        }
    }
    /**
     * Displays each hidden node.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     */
    function show$1(selector) {
        const nodes = parseNodes(selector);

        for (const node of nodes) {
            node.style.setProperty('display', '');
        }
    }
    /**
     * Toggles the visibility of each node.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     */
    function toggle$1(selector) {
        const nodes = parseNodes(selector);

        for (const node of nodes) {
            node.style.setProperty(
                'display',
                node.style.display === 'none' ?
                    '' :
                    'none',
            );
        }
    }
    /**
     * Toggles classes for each node.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @param {...string|string[]} classes The classes.
     */
    function toggleClass$1(selector, ...classes) {
        const nodes = parseNodes(selector);

        classes = parseClasses(classes);

        if (!classes.length) {
            return;
        }

        for (const node of nodes) {
            for (const className of classes) {
                node.classList.toggle(className);
            }
        }
    }

    /** @typedef {import('../helpers.js').ElementInput} ElementInput */

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

        if (!nodeBox) {
            return;
        }

        return {
            x: nodeBox.left + nodeBox.width / 2,
            y: nodeBox.top + nodeBox.height / 2,
        };
    }
    /**
     * Constrains each node to a container node.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @param {ElementInput} containerSelector The container node, or a query selector string.
     */
    function constrain$1(selector, containerSelector) {
        const containerBox = rect$1(containerSelector);

        if (!containerBox) {
            return;
        }

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
                node.style.setProperty('height', `${containerBox.height}px`);
                resized = true;
            }

            if (nodeBox.width > containerBox.width) {
                node.style.setProperty('width', `${containerBox.width}px`);
                resized = true;
            }

            if (resized) {
                nodeBox = rect$1(node);
            }

            let leftOffset;
            if (nodeBox.left - containerBox.left < 0) {
                leftOffset = nodeBox.left - containerBox.left;
            } else if (nodeBox.right - containerBox.right > 0) {
                leftOffset = nodeBox.right - containerBox.right;
            }

            if (leftOffset) {
                const oldLeft = css$1(node, 'left');
                const trueLeft = oldLeft && oldLeft !== 'auto' ? parseFloat(oldLeft) : 0;
                node.style.setProperty('left', `${trueLeft - leftOffset}px`);
            }

            let topOffset;
            if (nodeBox.top - containerBox.top < 0) {
                topOffset = nodeBox.top - containerBox.top;
            } else if (nodeBox.bottom - containerBox.bottom > 0) {
                topOffset = nodeBox.bottom - containerBox.bottom;
            }

            if (topOffset) {
                const oldTop = css$1(node, 'top');
                const trueTop = oldTop && oldTop !== 'auto' ? parseFloat(oldTop) : 0;
                node.style.setProperty('top', `${trueTop - topOffset}px`);
            }

            if (css$1(node, 'position') === 'static') {
                node.style.setProperty('position', 'relative');
            }
        }

        const postScrollX = getScrollX();
        const postScrollY = getScrollY();

        if (preScrollX !== postScrollX || preScrollY !== postScrollY) {
            constrain$1(nodes, containerSelector);
        }
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

        if (!nodeCenter) {
            return;
        }

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

        if (!otherCenter) {
            return;
        }

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

        if (!otherCenter) {
            return;
        }

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

        if (!nodeBox) {
            return;
        }

        const percent = (x - nodeBox.left) /
            nodeBox.width *
            100;

        return clamp ?
            clampPercent(percent) :
            percent;
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

        if (!nodeBox) {
            return;
        }

        const percent = (y - nodeBox.top) /
            nodeBox.height *
            100;

        return clamp ?
            clampPercent(percent) :
            percent;
    }
    /**
     * Gets the position of the first node relative to the Window or Document.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @param {OffsetOptions} [options] The positioning options.
     * @returns {Coordinates|undefined} The co-ordinates, or `undefined` if no element matches.
     */
    function position$1(selector, { offset = false } = {}) {
        const node = parseNode(selector);

        if (!node) {
            return;
        }

        const result = {
            x: node.offsetLeft,
            y: node.offsetTop,
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

        if (!node) {
            return;
        }

        const result = node.getBoundingClientRect();

        if (offset) {
            const window = getWindow();
            result.x += window.scrollX;
            result.y += window.scrollY;
        }

        return result;
    }

    /** @typedef {import('../helpers.js').QueryInput} QueryInput */

    /**
     * Gets the scroll X position of the first node.
     * @param {QueryInput} selector The input node(s), or a query selector string.
     * @returns {number|undefined} The scroll X position, or `undefined` if no node matches.
     */
    function getScrollX$1(selector) {
        const node = parseNode(selector, {
            document: true,
            window: true,
        });

        if (!node) {
            return;
        }

        if (isWindow(node)) {
            return node.scrollX;
        }

        if (isDocument(node)) {
            return node.scrollingElement.scrollLeft;
        }

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
            window: true,
        });

        if (!node) {
            return;
        }

        if (isWindow(node)) {
            return node.scrollY;
        }

        if (isDocument(node)) {
            return node.scrollingElement.scrollTop;
        }

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
            window: true,
        });

        for (const node of nodes) {
            if (isWindow(node)) {
                node.scroll(x, y);
            } else if (isDocument(node)) {
                node.scrollingElement.scrollLeft = x;
                node.scrollingElement.scrollTop = y;
            } else {
                node.scrollLeft = x;
                node.scrollTop = y;
            }
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
            window: true,
        });

        for (const node of nodes) {
            if (isWindow(node)) {
                node.scroll(x, node.scrollY);
            } else if (isDocument(node)) {
                node.scrollingElement.scrollLeft = x;
            } else {
                node.scrollLeft = x;
            }
        }
    }
    /**
     * Scrolls each node to a Y position.
     * @param {QueryInput} selector The input node(s), or a query selector string.
     * @param {number} y The scroll Y position.
     */
    function setScrollY$1(selector, y) {
        const nodes = parseNodes(selector, {
            document: true,
            window: true,
        });

        for (const node of nodes) {
            if (isWindow(node)) {
                node.scroll(node.scrollX, y);
            } else if (isDocument(node)) {
                node.scrollingElement.scrollTop = y;
            } else {
                node.scrollTop = y;
            }
        }
    }

    /** @typedef {import('../helpers.js').QueryInput} QueryInput */

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
    function height$1(selector, { boxSize = PADDING_BOX, outer = false } = {}) {
        let node = parseNode(selector, {
            document: true,
            window: true,
        });

        if (!node) {
            return;
        }

        if (isWindow(node)) {
            return outer ?
                node.outerHeight :
                node.innerHeight;
        }

        if (isDocument(node)) {
            node = node.documentElement;
        }

        if (boxSize >= SCROLL_BOX) {
            return node.scrollHeight;
        }

        let result = node.clientHeight;

        if (boxSize <= CONTENT_BOX) {
            result -= parseInt(css$1(node, 'padding-top'));
            result -= parseInt(css$1(node, 'padding-bottom'));
        }

        if (boxSize >= BORDER_BOX) {
            result += parseInt(css$1(node, 'border-top-width'));
            result += parseInt(css$1(node, 'border-bottom-width'));
        }

        if (boxSize >= MARGIN_BOX) {
            result += parseInt(css$1(node, 'margin-top'));
            result += parseInt(css$1(node, 'margin-bottom'));
        }

        return result;
    }
    /**
     * Gets the computed width of the first node.
     * @param {QueryInput} selector The input node(s), or a query selector string.
     * @param {SizeOptions} [options] The sizing options.
     * @returns {number|undefined} The width, or `undefined` if no node matches.
     */
    function width$1(selector, { boxSize = PADDING_BOX, outer = false } = {}) {
        let node = parseNode(selector, {
            document: true,
            window: true,
        });

        if (!node) {
            return;
        }

        if (isWindow(node)) {
            return outer ?
                node.outerWidth :
                node.innerWidth;
        }

        if (isDocument(node)) {
            node = node.documentElement;
        }

        if (boxSize >= SCROLL_BOX) {
            return node.scrollWidth;
        }

        let result = node.clientWidth;

        if (boxSize <= CONTENT_BOX) {
            result -= parseInt(css$1(node, 'padding-left'));
            result -= parseInt(css$1(node, 'padding-right'));
        }

        if (boxSize >= BORDER_BOX) {
            result += parseInt(css$1(node, 'border-left-width'));
            result += parseInt(css$1(node, 'border-right-width'));
        }

        if (boxSize >= MARGIN_BOX) {
            result += parseInt(css$1(node, 'margin-left'));
            result += parseInt(css$1(node, 'margin-right'));
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
        const cookie = getContext().cookie
            .split(';')
            .find((cookie) =>
                cookie
                    .trimStart()
                    .startsWith(prefix),
            );

        if (!cookie) {
            return null;
        }

        return decodeURIComponent(
            cookie.trimStart().substring(prefix.length),
        );
    }
    /**
     * Removes a cookie.
     * @param {string} name The cookie name.
     * @param {{path?: string, secure?: boolean}} [options] The cookie options.
     */
    function removeCookie(name, { path = null, secure = false } = {}) {
        if (!name) {
            return;
        }

        let cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC`;

        if (path) {
            cookie += `;path=${path}`;
        }

        if (secure) {
            cookie += ';secure';
        }

        getContext().cookie = cookie;
    }
    /**
     * Sets a cookie value.
     * @param {string} name The cookie name.
     * @param {*} value The cookie value.
     * @param {{expires?: number, path?: string, secure?: boolean}} [options] The cookie options.
     */
    function setCookie(name, value, { expires = null, path = null, secure = false } = {}) {
        if (!name) {
            return;
        }

        let cookie = `${name}=${encodeURIComponent(value)}`;

        if (expires) {
            const date = new Date;
            date.setTime(
                date.getTime() +
                expires * 1000,
            );
            cookie += `;expires=${date.toUTCString()}`;
        }

        if (path) {
            cookie += `;path=${path}`;
        }

        if (secure) {
            cookie += ';secure';
        }

        getContext().cookie = cookie;
    }

    /** @typedef {import('./event-handlers.js').EventCallback} EventCallback */

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

            // needed to make sure up callback executes after final move callback
            if (up) {
                up = debounce(up);
            }
        }

        return (event) => {
            const isTouch = event.type === 'touchstart';

            if (isTouch && event.touches.length !== touches) {
                return;
            }

            if (down && down(event) === false) {
                return;
            }

            if (preventDefault) {
                event.preventDefault();
            }

            if (!move && !up) {
                return;
            }

            const window = getWindow();

            const [moveEvent, upEvent] = event.type in eventLookup ?
                eventLookup[event.type] :
                eventLookup.mousedown;

            const realMove = (event) => {
                if (isTouch && event.touches.length !== touches) {
                    return;
                }

                if (preventDefault && !passive) {
                    event.preventDefault();
                }

                if (!move) {
                    return;
                }

                move(event);
            };

            const realUp = (event) => {
                if (isTouch && event.touches.length !== touches - 1) {
                    return;
                }

                if (up && up(event) === false) {
                    return;
                }

                if (preventDefault) {
                    event.preventDefault();
                }

                removeEvent$1(window, moveEvent, realMove);
                removeEvent$1(window, upEvent, realUp);
            };

            addEvent$1(window, moveEvent, realMove, { passive });
            addEvent$1(window, upEvent, realUp);
        };
    }

    /**
     * @typedef {import('../helpers.js').ElementInput} ElementInput
     * @typedef {import('./event-handlers.js').EventCallback} EventCallback
     */

    /**
     * Triggers a blur event on the first node.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     */
    function blur$1(selector) {
        const node = parseNode(selector);

        if (!node) {
            return;
        }

        node.blur();
    }
    /**
     * Triggers a click event on the first node.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     */
    function click$1(selector) {
        const node = parseNode(selector);

        if (!node) {
            return;
        }

        node.click();
    }
    /**
     * Triggers a focus event on the first node.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     */
    function focus$1(selector) {
        const node = parseNode(selector);

        if (!node) {
            return;
        }

        node.focus();
    }
    /**
     * Adds a function to the ready queue.
     * @param {EventCallback} callback The callback to execute.
     */
    function ready(callback) {
        if (getContext().readyState !== 'loading') {
            callback();
        } else {
            getWindow().addEventListener('DOMContentLoaded', callback, { once: true });
        }
    }

    let _$;
    let fQuery$1;

    /**
     * Resets the global $ variable.
     */
    function noConflict() {
        const window = getWindow();

        if (fQuery$1 && window.$ === fQuery$1) {
            window.$ = _$;
        }
    }
    /**
     * Registers the global variables.
     * @param {Window} window The window.
     * @param {Document} [document] The document.
     * @param {Function} query The fQuery function.
     * @returns {Function} The fQuery function.
     */
    function registerGlobals(window, document, query) {
        fQuery$1 = query;

        setWindow(window);
        setContext(document || window.document);

        _$ = window.$;
        window.$ = fQuery$1;

        return fQuery$1;
    }

    /** @typedef {import('../helpers.js').NodeInput} NodeInput */

    /**
     * Inserts each other node after each node.
     * @param {NodeInput} selector The input node(s), or a query selector string.
     * @param {NodeInput} otherSelector The other node(s), or a query selector or HTML string.
     */
    function after$1(selector, otherSelector) {
        // DocumentFragment and ShadowRoot nodes can not have siblings
        const nodes = parseNodes(selector, {
            node: true,
        });

        // ShadowRoot nodes can not be moved
        const others = parseNodes(otherSelector, {
            node: true,
            fragment: true,
            html: true,
        }).reverse();

        for (const [i, node] of nodes.entries()) {
            const parent = node.parentNode;

            if (!parent) {
                continue;
            }

            let clones;
            if (i === nodes.length - 1) {
                clones = others;
            } else {
                clones = clone$1(others, {
                    events: true,
                    data: true,
                    animations: true,
                });
            }

            for (const clone of clones) {
                parent.insertBefore(clone, node.nextSibling);
            }
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
            document: true,
        });

        // ShadowRoot nodes can not be moved
        const others = parseNodes(otherSelector, {
            node: true,
            fragment: true,
            html: true,
        });

        for (const [i, node] of nodes.entries()) {
            let clones;
            if (i === nodes.length - 1) {
                clones = others;
            } else {
                clones = clone$1(others, {
                    events: true,
                    data: true,
                    animations: true,
                });
            }

            for (const clone of clones) {
                node.insertBefore(clone, null);
            }
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
        // DocumentFragment and ShadowRoot nodes can not have siblings
        const nodes = parseNodes(selector, {
            node: true,
        });

        // ShadowRoot nodes can not be moved
        const others = parseNodes(otherSelector, {
            node: true,
            fragment: true,
            html: true,
        });

        for (const [i, node] of nodes.entries()) {
            const parent = node.parentNode;

            if (!parent) {
                continue;
            }

            let clones;
            if (i === nodes.length - 1) {
                clones = others;
            } else {
                clones = clone$1(others, {
                    events: true,
                    data: true,
                    animations: true,
                });
            }

            for (const clone of clones) {
                parent.insertBefore(clone, node);
            }
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
            document: true,
        });

        // ShadowRoot nodes can not be moved
        const others = parseNodes(otherSelector, {
            node: true,
            fragment: true,
            html: true,
        });

        for (const [i, node] of nodes.entries()) {
            const firstChild = node.firstChild;

            let clones;
            if (i === nodes.length - 1) {
                clones = others;
            } else {
                clones = clone$1(others, {
                    events: true,
                    data: true,
                    animations: true,
                });
            }

            for (const clone of clones) {
                node.insertBefore(clone, firstChild);
            }
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

    /**
     * @typedef {import('../filters.js').NodeFilterInput} NodeFilterInput
     * @typedef {import('../helpers.js').NodeInput} NodeInput
     */

    /**
     * Unwraps each node.
     * @param {NodeInput} selector The input node(s), or a query selector string.
     * @param {NodeFilterInput} [nodeFilter] The filter node(s), a query selector string or custom filter function.
     */
    function unwrap$1(selector, nodeFilter) {
        // DocumentFragment and ShadowRoot nodes can not be unwrapped
        const nodes = parseNodes(selector, {
            node: true,
        });

        nodeFilter = parseFilter(nodeFilter);

        const parents = [];

        for (const node of nodes) {
            const parent = node.parentNode;

            if (!parent) {
                continue;
            }

            if (parents.includes(parent)) {
                continue;
            }

            if (!nodeFilter(parent)) {
                continue;
            }

            parents.push(parent);
        }

        for (const parent of parents) {
            const outerParent = parent.parentNode;

            if (!outerParent) {
                continue;
            }

            const children = merge([], parent.childNodes);

            for (const child of children) {
                outerParent.insertBefore(child, parent);
            }
        }

        remove$1(parents);
    }
    /**
     * Wraps each nodes with other nodes.
     * @param {NodeInput} selector The input node(s), or a query selector string.
     * @param {NodeInput} otherSelector The other node(s), or a query selector or HTML string.
     */
    function wrap$1(selector, otherSelector) {
        // DocumentFragment and ShadowRoot nodes can not be wrapped
        const nodes = parseNodes(selector, {
            node: true,
        });

        // ShadowRoot nodes can not be cloned
        const others = parseNodes(otherSelector, {
            fragment: true,
            html: true,
        });

        for (const node of nodes) {
            const parent = node.parentNode;

            if (!parent) {
                continue;
            }

            const clones = clone$1(others, {
                events: true,
                data: true,
                animations: true,
            });

            const firstClone = clones.slice().shift();

            const firstCloneNode = isFragment(firstClone) ?
                firstClone.firstChild :
                firstClone;
            const deepest = merge([], firstCloneNode.querySelectorAll('*')).find((node) => !node.childElementCount) || firstCloneNode;

            for (const clone of clones) {
                parent.insertBefore(clone, node);
            }

            deepest.insertBefore(node, null);
        }
    }
    /**
     * Wraps all nodes with other nodes.
     * @param {NodeInput} selector The input node(s), or a query selector string.
     * @param {NodeInput} otherSelector The other node(s), or a query selector or HTML string.
     */
    function wrapAll$1(selector, otherSelector) {
        // DocumentFragment and ShadowRoot nodes can not be wrapped
        const nodes = parseNodes(selector, {
            node: true,
        });

        // ShadowRoot nodes can not be cloned
        const others = parseNodes(otherSelector, {
            fragment: true,
            html: true,
        });

        const clones = clone$1(others, {
            events: true,
            data: true,
            animations: true,
        });

        const firstNode = nodes[0];

        if (!firstNode) {
            return;
        }

        const parent = firstNode.parentNode;

        if (!parent) {
            return;
        }

        const firstClone = clones[0];

        const firstCloneNode = isFragment(firstClone) ?
            firstClone.firstChild :
            firstClone;
        const deepest = merge([], firstCloneNode.querySelectorAll('*')).find((node) => !node.childElementCount) || firstCloneNode;

        for (const clone of clones) {
            parent.insertBefore(clone, firstNode);
        }

        for (const node of nodes) {
            deepest.insertBefore(node, null);
        }
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
            shadow: true,
        });

        // ShadowRoot nodes can not be cloned
        const others = parseNodes(otherSelector, {
            fragment: true,
            html: true,
        });

        for (const node of nodes) {
            const children = merge([], node.childNodes);

            const clones = clone$1(others, {
                events: true,
                data: true,
                animations: true,
            });

            const firstClone = clones.slice().shift();

            const firstCloneNode = isFragment(firstClone) ?
                firstClone.firstChild :
                firstClone;
            const deepest = merge([], firstCloneNode.querySelectorAll('*')).find((node) => !node.childElementCount) || firstCloneNode;

            for (const clone of clones) {
                node.insertBefore(clone, null);
            }

            for (const child of children) {
                deepest.insertBefore(child, null);
            }
        }
    }

    /**
     * @typedef {import('../../animation/animation.js').AnimationCallback} AnimationCallback
     * @typedef {import('../../animation/animation.js').QueuedAnimationOptions} QueuedAnimationOptions
     * @typedef {import('../../animation/animation.js').StopAnimationOptions} StopAnimationOptions
     * @typedef {import('../query-set.js').default} QuerySet
     */

    /**
     * Adds an animation to the queue for each node.
     * @param {AnimationCallback} callback The animation callback.
     * @param {QueuedAnimationOptions} [options] The queued animation options.
     * @returns {QuerySet} The QuerySet object.
     */
    function animate(callback, { queueName = 'default', ...options } = {}) {
        return this.queue((node) =>
            animate$1(node, callback, options),
        { queueName },
        );
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

    /**
     * @typedef {import('../../animation/animation.js').QueuedAnimationOptions} QueuedAnimationOptions
     * @typedef {import('../query-set.js').default} QuerySet
     */

    /**
     * Adds a drop in animation to the queue for each node.
     * @param {QueuedAnimationOptions} [options] The queued animation options.
     * @returns {QuerySet} The QuerySet object.
     */
    function dropIn({ queueName = 'default', ...options } = {}) {
        return this.queue((node) =>
            dropIn$1(node, options),
        { queueName },
        );
    }
    /**
     * Adds a drop out animation to the queue for each node.
     * @param {QueuedAnimationOptions} [options] The queued animation options.
     * @returns {QuerySet} The QuerySet object.
     */
    function dropOut({ queueName = 'default', ...options } = {}) {
        return this.queue((node) =>
            dropOut$1(node, options),
        { queueName },
        );
    }
    /**
     * Adds a fade in animation to the queue for each node.
     * @param {QueuedAnimationOptions} [options] The queued animation options.
     * @returns {QuerySet} The QuerySet object.
     */
    function fadeIn({ queueName = 'default', ...options } = {}) {
        return this.queue((node) =>
            fadeIn$1(node, options),
        { queueName },
        );
    }
    /**
     * Adds a fade out animation to the queue for each node.
     * @param {QueuedAnimationOptions} [options] The queued animation options.
     * @returns {QuerySet} The QuerySet object.
     */
    function fadeOut({ queueName = 'default', ...options } = {}) {
        return this.queue((node) =>
            fadeOut$1(node, options),
        { queueName },
        );
    }
    /**
     * Adds a rotate in animation to the queue for each node.
     * @param {QueuedAnimationOptions} [options] The queued animation options.
     * @returns {QuerySet} The QuerySet object.
     */
    function rotateIn({ queueName = 'default', ...options } = {}) {
        return this.queue((node) =>
            rotateIn$1(node, options),
        { queueName },
        );
    }
    /**
     * Adds a rotate out animation to the queue for each node.
     * @param {QueuedAnimationOptions} [options] The queued animation options.
     * @returns {QuerySet} The QuerySet object.
     */
    function rotateOut({ queueName = 'default', ...options } = {}) {
        return this.queue((node) =>
            rotateOut$1(node, options),
        { queueName },
        );
    }
    /**
     * Adds a slide in animation to the queue for each node.
     * @param {QueuedAnimationOptions} [options] The queued animation options.
     * @returns {QuerySet} The QuerySet object.
     */
    function slideIn({ queueName = 'default', ...options } = {}) {
        return this.queue((node) =>
            slideIn$1(node, options),
        { queueName },
        );
    }
    /**
     * Adds a slide out animation to the queue for each node.
     * @param {QueuedAnimationOptions} [options] The queued animation options.
     * @returns {QuerySet} The QuerySet object.
     */
    function slideOut({ queueName = 'default', ...options } = {}) {
        return this.queue((node) =>
            slideOut$1(node, options),
        { queueName },
        );
    }
    /**
     * Adds a squeeze in animation to the queue for each node.
     * @param {QueuedAnimationOptions} [options] The queued animation options.
     * @returns {QuerySet} The QuerySet object.
     */
    function squeezeIn({ queueName = 'default', ...options } = {}) {
        return this.queue((node) =>
            squeezeIn$1(node, options),
        { queueName },
        );
    }
    /**
     * Adds a squeeze out animation to the queue for each node.
     * @param {QueuedAnimationOptions} [options] The queued animation options.
     * @returns {QuerySet} The QuerySet object.
     */
    function squeezeOut({ queueName = 'default', ...options } = {}) {
        return this.queue((node) =>
            squeezeOut$1(node, options),
        { queueName },
        );
    }

    /**
     * @typedef {import('../../attributes/attributes.js').AttributeValues} AttributeValues
     * @typedef {import('../query-set.js').default} QuerySet
     */

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
    function getDataset$1(key) {
        return getDataset$2(this, key);
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

    /**
     * @typedef {import('../../helpers.js').QueryInput} QueryInput
     * @typedef {import('../query-set.js').default} QuerySet
     */

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

    /**
     * @typedef {import('../../attributes/position.js').Coordinates} Coordinates
     * @typedef {import('../../attributes/position.js').OffsetOptions} OffsetOptions
     * @typedef {import('../../attributes/position.js').PercentOptions} PercentOptions
     * @typedef {import('../../helpers.js').ElementInput} ElementInput
     */

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
        return percentX$1(this, x, { offset, clamp });
    }
    /**
     * Gets the percentage of a Y co-ordinate relative to a node's height.
     * @param {number} y The Y co-ordinate.
     * @param {PercentOptions} [options] The percentage options.
     * @returns {number|undefined} The percentage, or `undefined` if no element matches.
     */
    function percentY(y, { offset = false, clamp = true } = {}) {
        return percentY$1(this, y, { offset, clamp });
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

    /** @typedef {import('../query-set.js').default} QuerySet */

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

    /** @typedef {import('../../attributes/size.js').SizeOptions} SizeOptions */

    /**
     * Gets the computed height of the first node.
     * @param {SizeOptions} [options] The sizing options.
     * @returns {number|undefined} The height, or `undefined` if no node matches.
     */
    function height({ boxSize = PADDING_BOX, outer = false } = {}) {
        return height$1(this, { boxSize, outer });
    }
    /**
     * Gets the computed width of the first node.
     * @param {SizeOptions} [options] The sizing options.
     * @returns {number|undefined} The width, or `undefined` if no node matches.
     */
    function width({ boxSize = PADDING_BOX, outer = false } = {}) {
        return width$1(this, { boxSize, outer });
    }

    /**
     * @typedef {import('../../attributes/styles.js').StyleValues} StyleValues
     * @typedef {import('../query-set.js').default} QuerySet
     */

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

    /**
     * @typedef {import('../../events/event-handlers.js').EventCallback} EventCallback
     * @typedef {import('../../events/event-handlers.js').EventOptions} EventOptions
     * @typedef {import('../../events/event-handlers.js').EventTargetInput} EventTargetInput
     * @typedef {import('../../events/event-handlers.js').RemoveEventOptions} RemoveEventOptions
     * @typedef {import('../../events/event-handlers.js').TriggerEventOptions} TriggerEventOptions
     * @typedef {import('../query-set.js').default} QuerySet
     */

    /**
     * Adds an event to each node.
     * @param {string} events The event names.
     * @param {EventCallback} callback The callback to execute.
     * @param {EventOptions} [options] The event options.
     * @returns {QuerySet} The QuerySet object.
     */
    function addEvent(events, callback, { capture = false, passive = false } = {}) {
        addEvent$1(this, events, callback, { capture, passive });

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
        addEventDelegate$1(this, events, delegate, callback, { capture, passive });

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
        addEventDelegateOnce$1(this, events, delegate, callback, { capture, passive });

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
        addEventOnce$1(this, events, callback, { capture, passive });

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
        triggerEvent$1(this, events, { data, detail, bubbles, cancelable });

        return this;
    }
    /**
     * Triggers an event for the first node.
     * @param {string} event The event name.
     * @param {TriggerEventOptions} [options] The event options.
     * @returns {boolean} Whether the event was dispatched without cancellation.
     */
    function triggerOne(event, { data = null, detail = null, bubbles = true, cancelable = true } = {}) {
        return triggerOne$1(this, event, { data, detail, bubbles, cancelable });
    }

    /** @typedef {import('../query-set.js').default} QuerySet */

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

    /**
     * @typedef {import('../../helpers.js').NodeInput} NodeInput
     * @typedef {import('../../manipulation/manipulation.js').CloneOptions} CloneOptions
     */

    /**
     * Clones each node.
     * @param {CloneOptions} [options] The cloning options.
     * @returns {QuerySet} A new QuerySet object.
     */
    function clone(options) {
        const clones = clone$1(this, options);

        return new QuerySet(clones);
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

    /**
     * @typedef {import('../../helpers.js').NodeInput} NodeInput
     * @typedef {import('../query-set.js').default} QuerySet
     */

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

    /**
     * @typedef {import('../../filters.js').NodeFilterInput} NodeFilterInput
     * @typedef {import('../../helpers.js').NodeInput} NodeInput
     * @typedef {import('../query-set.js').default} QuerySet
     */

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
    function wrap(otherSelector) {
        wrap$1(this, otherSelector);

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

    /** @typedef {import('../helpers.js').ElementInput} ElementInput */

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
    function clearQueue$1(selector, { queueName = 'default' } = {}) {
        const nodes = parseNodes(selector);

        for (const node of nodes) {
            if (!queues.has(node)) {
                continue;
            }

            const queue = queues.get(node);

            if (queueName !== null) {
                queue.delete(queueName);
            }

            if (queueName === null || !queue.size) {
                queues.delete(node);
            }
        }
    }
    /**
     * Runs the next callback for a single node.
     * @param {Element} node The input node.
     * @param {QueueOptions} [options] The queue options.
     */
    function dequeue(node, { queueName = 'default' } = {}) {
        const queue = queues.get(node);

        if (!queue || !queue.has(queueName)) {
            return;
        }

        const callbacks = queue.get(queueName);
        const next = callbacks.shift();

        if (!next) {
            queue.delete(queueName);

            if (!queue.size && queues.get(node) === queue) {
                queues.delete(node);
            }

            return;
        }

        Promise.resolve(next(node))
            .then((_) => {
                if (queues.get(node) === queue && queue.get(queueName) === callbacks) {
                    dequeue(node, { queueName });
                }
            }).catch((_) => {
                if (queues.get(node) === queue && queue.get(queueName) === callbacks) {
                    queue.delete(queueName);

                    if (!queue.size) {
                        queues.delete(node);
                    }
                }
            });
    }
    /**
     * Queues a callback on each node.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @param {QueueCallback} callback The callback to queue.
     * @param {QueueOptions} [options] The queue options.
     */
    function queue$1(selector, callback, { queueName = 'default' } = {}) {
        const { setTimeout } = getWindow();
        const nodes = parseNodes(selector);

        for (const node of nodes) {
            if (!queues.has(node)) {
                queues.set(node, new Map());
            }

            const queue = queues.get(node);
            const runningQueue = queue.has(queueName);

            if (!runningQueue) {
                queue.set(queueName, [
                    (_) => new Promise((resolve) => {
                        setTimeout(resolve, 1);
                    }),
                ]);
            }

            queue.get(queueName).push(callback);

            if (!runningQueue) {
                dequeue(node, { queueName });
            }
        }
    }

    /**
     * @typedef {import('../../queue/queue.js').QueueCallback} QueueCallback
     * @typedef {import('../../queue/queue.js').QueueOptions} QueueOptions
     * @typedef {import('../query-set.js').default} QuerySet
     */

    /**
     * Clears the queue of each node.
     * @param {QueueOptions} [options] The queue options.
     * @returns {QuerySet} The QuerySet object.
     */
    function clearQueue({ queueName = 'default' } = {}) {
        clearQueue$1(this, { queueName });

        return this;
    }
    /**
     * Delays execution of subsequent items in the queue for each node.
     * @param {number} duration The number of milliseconds to delay execution by.
     * @param {QueueOptions} [options] The queue options.
     * @returns {QuerySet} The QuerySet object.
     */
    function delay(duration, { queueName = 'default' } = {}) {
        const { setTimeout } = getWindow();

        return this.queue((_) =>
            new Promise((resolve) =>
                setTimeout(resolve, duration),
            ),
        { queueName },
        );
    }
    /**
     * Queues a callback on each node.
     * @param {QueueCallback} callback The callback to queue.
     * @param {QueueOptions} [options] The queue options.
     * @returns {QuerySet} The QuerySet object.
     */
    function queue(callback, { queueName = 'default' } = {}) {
        queue$1(this, callback, { queueName });

        return this;
    }

    /**
     * @typedef {import('../filters.js').NodeFilterInput} NodeFilterInput
     * @typedef {import('../helpers.js').ElementInput} ElementInput
     * @typedef {import('../helpers.js').NodeInput} NodeInput
     * @typedef {import('../helpers.js').QueryInput} QueryInput
     */

    /**
     * Returns all nodes connected to the DOM.
     * @param {NodeInput} selector The input node(s), or a query selector string.
     * @returns {Node[]} The filtered nodes.
     */
    function connected$1(selector) {
        return parseNodes(selector, {
            node: true,
            fragment: true,
            shadow: true,
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
            shadow: true,
        });

        return parseNodes(selector, {
            node: true,
            fragment: true,
            shadow: true,
        }).filter((node) =>
            others.some((other) =>
                node.isEqualNode(other),
            ),
        );
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
            shadow: true,
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
            shadow: true,
        }).find(nodeFilter) || null;
    }
    /**
     * Returns all "fixed" nodes.
     * @param {NodeInput} selector The input node(s), or a query selector string.
     * @returns {Node[]} The filtered nodes.
     */
    function fixed$1(selector) {
        return parseNodes(selector, {
            node: true,
        }).filter((node) =>
            (isElement(node) && css$1(node, 'position') === 'fixed') ||
            closest$1(
                node,
                (parent) => isElement(parent) && css$1(parent, 'position') === 'fixed',
            ).length,
        );
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
            window: true,
        }).filter((node) => {
            if (isWindow(node)) {
                return node.document.visibilityState !== 'visible';
            }

            if (isDocument(node)) {
                return node.visibilityState !== 'visible';
            }

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
            shadow: true,
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
            shadow: true,
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
            shadow: true,
        });

        return parseNodes(selector, {
            node: true,
            fragment: true,
            shadow: true,
        }).filter((node) =>
            others.some((other) =>
                node.isSameNode(other),
            ),
        );
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
            window: true,
        }).filter((node) => {
            if (isWindow(node)) {
                return node.document.visibilityState === 'visible';
            }

            if (isDocument(node)) {
                return node.visibilityState === 'visible';
            }

            return node.offsetParent;
        });
    }
    /**
     * Returns all nodes with an animation.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @returns {Node[]} The filtered nodes.
     */
    function withAnimation$1(selector) {
        return parseNodes(selector)
            .filter((node) =>
                animations.has(node),
            );
    }
    /**
     * Returns all nodes with a specified attribute.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @param {string} attribute The attribute name.
     * @returns {Node[]} The filtered nodes.
     */
    function withAttribute$1(selector, attribute) {
        return parseNodes(selector)
            .filter((node) =>
                node.hasAttribute(attribute),
            );
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
            document: true,
        }).filter((node) =>
            !!node.childElementCount,
        );
    }
    /**
     * Returns all nodes with any of the specified classes.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @param {...string|string[]} classes The classes.
     * @returns {Node[]} The filtered nodes.
     */
    function withClass$1(selector, ...classes) {
        classes = parseClasses(classes);

        return parseNodes(selector)
            .filter((node) =>
                classes.some((className) =>
                    node.classList.contains(className),
                ),
            );
    }
    /**
     * Returns all nodes with a CSS animation.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @returns {Node[]} The filtered nodes.
     */
    function withCSSAnimation$1(selector) {
        return parseNodes(selector)
            .filter((node) =>
                parseFloat(css$1(node, 'animation-duration')),
            );
    }
    /**
     * Returns all nodes with a CSS transition.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @returns {Node[]} The filtered nodes.
     */
    function withCSSTransition$1(selector) {
        return parseNodes(selector)
            .filter((node) =>
                parseFloat(css$1(node, 'transition-duration')),
            );
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
            window: true,
        }).filter((node) => {
            if (!data.has(node)) {
                return false;
            }

            if (!key) {
                return true;
            }

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
            document: true,
        }).filter(nodeFilter);
    }
    /**
     * Returns all nodes with a specified property.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @param {string} property The property name.
     * @returns {Node[]} The filtered nodes.
     */
    function withProperty$1(selector, property) {
        return parseNodes(selector)
            .filter((node) =>
                Object.hasOwn(node, property),
            );
    }

    /**
     * @typedef {import('../../filters.js').NodeFilterInput} NodeFilterInput
     * @typedef {import('../../helpers.js').NodeInput} NodeInput
     */

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

    /** @typedef {import('../../filters.js').NodeFilterInput} NodeFilterInput */

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

    /** @typedef {import('../helpers.js').NodeInput} NodeInput */

    /**
     * Inserts each node after the selection.
     * @param {NodeInput} selector The input node(s), or a query selector or HTML string.
     */
    function afterSelection$1(selector) {
        // ShadowRoot nodes can not be moved
        const nodes = parseNodes(selector, {
            node: true,
            fragment: true,
            html: true,
        }).reverse();

        const selection = getWindow().getSelection();

        if (!selection.rangeCount) {
            return;
        }

        const range = selection.getRangeAt(0);

        selection.removeAllRanges();
        range.collapse();

        for (const node of nodes) {
            range.insertNode(node);
        }
    }
    /**
     * Inserts each node before the selection.
     * @param {NodeInput} selector The input node(s), or a query selector or HTML string.
     */
    function beforeSelection$1(selector) {
        // ShadowRoot nodes can not be moved
        const nodes = parseNodes(selector, {
            node: true,
            fragment: true,
            html: true,
        }).reverse();

        const selection = getWindow().getSelection();

        if (!selection.rangeCount) {
            return;
        }

        const range = selection.getRangeAt(0);

        selection.removeAllRanges();

        for (const node of nodes) {
            range.insertNode(node);
        }
    }
    /**
     * Extracts selected nodes from the DOM.
     * @returns {Node[]} The selected nodes.
     */
    function extractSelection() {
        const selection = getWindow().getSelection();

        if (!selection.rangeCount) {
            return [];
        }

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

        if (!selection.rangeCount) {
            return [];
        }

        const range = selection.getRangeAt(0);
        const commonAncestor = range.commonAncestorContainer;

        if (typeof commonAncestor.querySelectorAll !== 'function') {
            return [commonAncestor];
        }

        const nodes = merge([], commonAncestor.querySelectorAll('*'));

        if (!nodes.length) {
            return [commonAncestor];
        }

        if (nodes.length === 1) {
            return nodes;
        }

        const startContainer = range.startContainer;
        const endContainer = range.endContainer;
        const start = isElement(startContainer) ?
            startContainer :
            startContainer.parentNode;
        const end = isElement(endContainer) ?
            endContainer :
            endContainer.parentNode;

        const selectedNodes = nodes.slice(
            nodes.indexOf(start),
            nodes.indexOf(end) + 1,
        );
        const results = [];

        let lastNode;
        for (const node of selectedNodes) {
            if (lastNode && lastNode.contains(node)) {
                continue;
            }

            lastNode = node;
            results.push(node);
        }

        return results.length > 1 ?
            unique(results) :
            results;
    }
    /**
     * Creates a selection on the first node.
     * @param {NodeInput} selector The input node(s), or a query selector string.
     */
    function select$1(selector) {
        const node = parseNode(selector, {
            node: true,
        });

        if (node && 'select' in node) {
            node.select();
            return;
        }

        const selection = getWindow().getSelection();

        if (selection.rangeCount > 0) {
            selection.removeAllRanges();
        }

        if (!node) {
            return;
        }

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

        if (selection.rangeCount) {
            selection.removeAllRanges();
        }

        if (!nodes.length) {
            return;
        }

        const range = createRange();

        if (nodes.length == 1) {
            range.selectNode(nodes.shift());
        } else {
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
        // ShadowRoot nodes can not be cloned
        const nodes = parseNodes(selector, {
            fragment: true,
            html: true,
        });

        const selection = getWindow().getSelection();

        if (!selection.rangeCount) {
            return;
        }

        const range = selection.getRangeAt(0);

        selection.removeAllRanges();

        const node = nodes.slice().shift();
        const deepest = merge([], node.querySelectorAll('*')).find((node) => !node.childElementCount) || node;

        const fragment = range.extractContents();

        const childNodes = merge([], fragment.childNodes);

        for (const child of childNodes) {
            deepest.insertBefore(child, null);
        }

        for (const node of nodes) {
            range.insertNode(node);
        }
    }

    /** @typedef {import('../query-set.js').default} QuerySet */

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

    /**
     * @typedef {import('../filters.js').NodeFilterInput} NodeFilterInput
     * @typedef {import('../helpers.js').ElementInput} ElementInput
     * @typedef {import('../helpers.js').NodeInput} NodeInput
     * @typedef {import('../helpers.js').QueryInput} QueryInput
     */

    /**
     * Checks whether any of the nodes has an animation.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @returns {boolean} Whether any of the nodes has an animation.
     */
    function hasAnimation$1(selector) {
        return parseNodes(selector)
            .some((node) => animations.has(node));
    }
    /**
     * Checks whether any of the nodes has a specified attribute.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @param {string} attribute The attribute name.
     * @returns {boolean} Whether any of the nodes has the attribute.
     */
    function hasAttribute$1(selector, attribute) {
        return parseNodes(selector)
            .some((node) => node.hasAttribute(attribute));
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
            document: true,
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

        return parseNodes(selector)
            .some((node) =>
                classes.some((className) => node.classList.contains(className)),
            );
    }
    /**
     * Checks whether any of the nodes has a CSS animation.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @returns {boolean} Whether any of the nodes has a CSS animation.
     */
    function hasCSSAnimation$1(selector) {
        return parseNodes(selector)
            .some((node) =>
                parseFloat(css$1(node, 'animation-duration')),
            );
    }
    /**
     * Checks whether any of the nodes has a CSS transition.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @returns {boolean} Whether any of the nodes has a CSS transition.
     */
    function hasCSSTransition$1(selector) {
        return parseNodes(selector)
            .some((node) =>
                parseFloat(css$1(node, 'transition-duration')),
            );
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
            window: true,
        }).some((node) => {
            if (!data.has(node)) {
                return false;
            }

            if (!key) {
                return true;
            }

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

        return parseNodes(selector)
            .some((node) => !!node.dataset[key]);
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
            document: true,
        }).some(nodeFilter);
    }
    /**
     * Checks whether any of the nodes has a DocumentFragment.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @returns {boolean} Whether any of the nodes has a DocumentFragment.
     */
    function hasFragment$1(selector) {
        return parseNodes(selector)
            .some((node) => node.content);
    }
    /**
     * Checks whether any of the nodes has a specified property.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @param {string} property The property name.
     * @returns {boolean} Whether any of the nodes has the property.
     */
    function hasProperty$1(selector, property) {
        return parseNodes(selector)
            .some((node) => Object.hasOwn(node, property));
    }
    /**
     * Checks whether any of the nodes has a ShadowRoot.
     * @param {ElementInput} selector The input node(s), or a query selector string.
     * @returns {boolean} Whether any of the nodes has a ShadowRoot.
     */
    function hasShadow$1(selector) {
        return parseNodes(selector)
            .some((node) => node.shadowRoot);
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
            shadow: true,
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
            shadow: true,
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
            shadow: true,
        });

        let others = parseNodes(otherSelector, {
            node: true,
            fragment: true,
            shadow: true,
        });

        if (shallow) {
            nodes = $.clone(nodes, { deep: false });
            others = $.clone(others, { deep: false });
        }

        return nodes.some((node) =>
            others.some((other) => node.isEqualNode(other)),
        );
    }
    /**
     * Checks whether any of the nodes or a parent of any of the nodes is "fixed".
     * @param {NodeInput} selector The input node(s), or a query selector string.
     * @returns {boolean} Whether any of the nodes is "fixed".
     */
    function isFixed$1(selector) {
        return parseNodes(selector, {
            node: true,
        }).some((node) =>
            (isElement(node) && css$1(node, 'position') === 'fixed') ||
            closest$1(
                node,
                (parent) => isElement(parent) && css$1(parent, 'position') === 'fixed',
            ).length,
        );
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
            window: true,
        }).some((node) => {
            if (isWindow(node)) {
                return node.document.visibilityState !== 'visible';
            }

            if (isDocument(node)) {
                return node.visibilityState !== 'visible';
            }

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
            shadow: true,
        });

        return parseNodes(selector, {
            node: true,
            fragment: true,
            shadow: true,
        }).some((node) =>
            others.some((other) => node.isSameNode(other)),
        );
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
            window: true,
        }).some((node) => {
            if (isWindow(node)) {
                return node.document.visibilityState === 'visible';
            }

            if (isDocument(node)) {
                return node.visibilityState === 'visible';
            }

            return node.offsetParent;
        });
    }

    /**
     * @typedef {import('../../filters.js').NodeFilterInput} NodeFilterInput
     * @typedef {import('../../helpers.js').NodeInput} NodeInput
     * @typedef {import('../query-set.js').default} QuerySet
     */

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

    /**
     * @typedef {import('../../filters.js').NodeFilterInput} NodeFilterInput
     * @typedef {import('../../helpers.js').QueryInput} QueryInput
     * @typedef {import('../../traversal/find.js').QueryContextInput} QueryContextInput
     */

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
            context: context || getContext(),
        });
        const nodes = sort$1(unique(merge([], this.get(), otherNodes)));

        return new QuerySet(nodes);
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

    const methods = {
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
        getDataset: getDataset$1,
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
        wrap,
        wrapAll,
        wrapInner,
        wrapSelection,
    };

    for (const [name, method] of Object.entries(methods)) {
        Object.defineProperty(QuerySet.prototype, name, {
            configurable: true,
            enumerable: false,
            value: method,
            writable: true,
        });
    }

    /**
     * @typedef {import('../helpers.js').QueryInput} QueryInput
     * @typedef {import('../traversal/find.js').QueryContextInput} QueryContextInput
     */

    /**
     * Adds a function to the ready queue or returns a QuerySet.
     * @param {(() => void)|QueryInput} selector The ready callback or input selector.
     * @param {QueryContextInput} [context] The context to search in.
     * @returns {QuerySet|undefined} A new QuerySet, or `undefined` when registering a ready callback.
     */
    function query(selector, context = null) {
        if (isFunction(selector)) {
            return ready(selector);
        }

        const nodes = parseNodes(selector, {
            node: true,
            fragment: true,
            shadow: true,
            document: true,
            window: true,
            html: true,
            context: context || getContext(),
        });

        return new QuerySet(nodes);
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
            context: context || getContext(),
        });

        return new QuerySet(node ? [node] : []);
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
        return value !== false && value !== null && typeof value !== 'undefined';
    }
    /**
     * Applies a script attribute if it should be serialized.
     * @param {HTMLScriptElement} script The script element.
     * @param {string} key The attribute key.
     * @param {*} value The attribute value.
     */
    function setScriptAttribute(script, key, value) {
        if (key === 'async' || !isEnabled(value)) {
            return;
        }

        script.setAttribute(key, value === true ? '' : value);
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
            type: 'text/javascript',
            ...attributes,
        };

        if (!cache) {
            attributes.src = appendQueryString(attributes.src, '_', Date.now());
        }

        const script = context.createElement('script');

        // Dynamically inserted scripts execute in insertion order only when async is disabled.
        script.async = 'async' in attributes ?
            isEnabled(attributes.async) :
            false;

        for (const [key, value] of Object.entries(attributes)) {
            setScriptAttribute(script, key, value);
        }

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
        return Promise.all(
            urls.map((url) =>
                isString(url) ?
                    loadScript(url, null, { cache, context }) :
                    loadScript(null, url, { cache, context }),
            ),
        );
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
            rel: 'stylesheet',
            ...attributes,
        };

        if (!cache) {
            attributes.href = appendQueryString(attributes.href, '_', Date.now());
        }

        const link = context.createElement('link');

        for (const [key, value] of Object.entries(attributes)) {
            link.setAttribute(key, value);
        }

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
        return Promise.all(
            urls.map((url) =>
                isString(url) ?
                    loadStyle(url, null, { cache, context }) :
                    loadStyle(null, url, { cache, context }),
            ),
        );
    }

    /** @typedef {Record<string, Array<string|RegExp>>} AllowedTags */

    /**
     * Sanitizes a HTML string.
     * @param {string} html The input HTML string.
     * @param {AllowedTags} [allowedTags] The allowed tags and attributes.
     * @returns {string} The sanitized HTML string.
     */
    function sanitize(html, allowedTags$1 = allowedTags) {
        const template = getContext().createElement('template');
        template.innerHTML = html;
        const fragment = template.content;
        const childNodes = merge([], fragment.children);

        for (const child of childNodes) {
            sanitizeNode(child, allowedTags$1);
        }

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
        const isAllowed = allowedAttributes.some((test) =>
            typeof test === 'string' ?
                test === name :
                test instanceof RegExp && test.test(name),
        );

        if (!isAllowed || !uriAttributes.has(name)) {
            return isAllowed;
        }

        try {
            const { URL } = getWindow();
            return new URL(attribute.nodeValue, getContext().baseURI).protocol !== 'javascript:';
        } catch {
            return false;
        }
    }
    /**
     * Sanitizes a single node.
     * @param {Element} node The input node.
     * @param {AllowedTags} [allowedTags] The allowed tags and attributes.
     */
    function sanitizeNode(node, allowedTags$1 = allowedTags) {
        // check node
        const name = node.tagName.toLowerCase();

        if (!Object.hasOwn(allowedTags$1, name)) {
            node.remove();
            return;
        }

        // check node attributes
        const allowedAttributes = [];

        if (Object.hasOwn(allowedTags$1, '*')) {
            allowedAttributes.push(...allowedTags$1['*']);
        }

        allowedAttributes.push(...allowedTags$1[name]);

        const attributes = merge([], node.attributes);

        for (const attribute of attributes) {
            if (!isAllowedAttribute(attribute, allowedAttributes)) {
                node.removeAttribute(attribute.nodeName);
            }
        }

        // check children
        const childNodes = merge([], node.children);
        for (const child of childNodes) {
            sanitizeNode(child, allowedTags$1);
        }
    }

    Object.assign(query, {
        BORDER_BOX,
        CONTENT_BOX,
        MARGIN_BOX,
        PADDING_BOX,
        SCROLL_BOX,
        Animation,
        AnimationSet,
        QuerySet,
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
        getDataset: getDataset$2,
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
        wrap: wrap$1,
        wrapAll: wrapAll$1,
        wrapInner: wrapInner$1,
        wrapSelection: wrapSelection$1,
    });

    for (const [key, value] of Object.entries(_)) {
        query[`_${key}`] = value;
    }

    const register = (window, document) => registerGlobals(window, document, query);

    var fQuery = isWindow(globalThis) ?
        register(globalThis) :
        register;

    let $$1;

    if (fQuery !== fQuery.query) {
        $$1 = fQuery(globalThis);
    } else {
        $$1 = fQuery;
    }

    if (!('fQuery' in globalThis)) {
        globalThis.fQuery = $$1;
    }

    const document = $$1.getContext();
    const window$1 = $$1.getWindow();

    let scrollbarSize;

    /**
     * Add scrollbar padding to a node.
     * @param {array} nodes The nodes.
     */
    function addScrollPadding(nodes) {
        const scrollSizeY = getScrollbarSize(window$1, document, 'y');

        if (!scrollSizeY) {
            return;
        }

        for (const node of nodes) {
            $$1.setDataset(node, {
                uiPaddingRight: $$1.getStyle(node, 'paddingRight'),
            });
            $$1.setStyle(node, {
                paddingRight: `${scrollSizeY + parseInt($$1.css(node, 'paddingRight'))}px`,
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

        const div = $$1.create('div', {
            style: {
                width: '100px',
                height: '100px',
                overflow: 'scroll',
                position: 'absolute',
                top: '-9999px',
            },
        });
        $$1.append(document.body, div);

        scrollbarSize = $$1.getProperty(div, 'offsetWidth') - $$1.width(div);

        $$1.detach(div);

        return scrollbarSize;
    }
    /**
     * Generate a unique element ID.
     * @param {string} [prefix] The ID prefix.
     * @return {string} The unique ID.
     */
    function generateId(prefix) {
        const id = `${prefix}${$$1._randomInt(10000, 99999)}`;

        if ($$1.findOne(`#${id}`)) {
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
        const dataset = $$1.getDataset(node);

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
    function getScrollbarSize(node = window$1, scrollNode = document, axis) {
        const method = axis === 'x' ? 'width' : 'height';
        const size = $$1[method](node);
        const scrollSize = $$1[method](scrollNode, { boxSize: $$1.SCROLL_BOX });

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
        const isWindow = $$1._isWindow(node);
        const rect = isWindow ?
            getWindowContainer(node) :
            $$1.rect(node, { offset: true });

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
            target = $$1.findOne(selector);
        } else if (closestSelector) {
            target = $$1.closest(node, closestSelector).shift();
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
        return $$1.getDataset(node, 'uiTarget') || $$1.getAttribute(node, 'href');
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

        $$1.QuerySet.prototype[key] = function(a, ...args) {
            let settings; let method; let firstResult;

            if ($$1._isObject(a)) {
                settings = a;
            } else if ($$1._isString(a)) {
                method = a;
            }

            for (const [index, node] of this.get().entries()) {
                if (!$$1._isElement(node)) {
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
        };
    }
    /**
     * Reset body scrollbar padding.
     * @param {array} nodes The nodes.
     */
    function resetScrollPadding(nodes) {
        for (const node of nodes) {
            $$1.setStyle(node, {
                paddingRight: $$1.getDataset(node, 'uiPaddingRight'),
            });
            $$1.removeDataset(node, 'uiPaddingRight');
        }
    }

    /**
     * BaseComponent Class
     * @class
     */
    class BaseComponent {
        /**
         * Initialize a BaseComponent.
         * @param {HTMLElement} node The input node.
         * @return {BaseComponent} A new BaseComponent object.
         */
        static init(node, ...args) {
            return $$1.hasData(node, this.DATA_KEY) ?
                $$1.getData(node, this.DATA_KEY) :
                new this(node, ...args);
        }

        /**
         * New BaseComponent constructor.
         * @param {HTMLElement} node The input node.
         * @param {object} [options] The options to create the BaseComponent with.
         */
        constructor(node, options) {
            this._node = node;

            this._options = $$1._extend(
                {},
                this.constructor.defaults,
                getDataset(this._node),
                options,
            );

            $$1.addEvent(this._node, this.constructor.REMOVE_EVENT, (_) => {
                this.dispose();
            });

            $$1.setData(this._node, { [this.constructor.DATA_KEY]: this });
        }

        /**
         * Dispose the BaseComponent.
         */
        dispose() {
            $$1.removeEvent(this._node, this.constructor.REMOVE_EVENT);
            $$1.removeData(this._node, this.constructor.DATA_KEY);
            this._node = null;
            this._options = null;
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
                $$1.getDataset(this._node, 'uiAnimating') ||
                !$$1.triggerOne(this._node, 'close.ui.alert')
            ) {
                return;
            }

            $$1.setDataset(this._node, { uiAnimating: 'out' });

            $$1.fadeOut(this._node, {
                duration: this._options.duration,
            }).then((_) => {
                $$1.detach(this._node);
                $$1.removeDataset(this._node, 'uiAnimating');
                $$1.triggerEvent(this._node, 'closed.ui.alert');
                $$1.remove(this._node);
            }).catch((_) => {
                if ($$1.getDataset(this._node, 'uiAnimating') === 'out') {
                    $$1.removeDataset(this._node, 'uiAnimating');
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
    $$1.addEventDelegate(document, 'click.ui.alert', '[data-ui-dismiss="alert"]', (e) => {
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
            $$1.toggleClass(this._node, 'active');

            const active = $$1.hasClass(this._node, 'active');
            $$1.setAttribute(this._node, { 'aria-pressed': active });
        }
    }

    // Button init
    initComponent('button', Button);

    // Button events
    $$1.addEventDelegate(document, 'click.ui.button keydown.ui.button', '[data-ui-toggle="button"]', (e) => {
        if (e.code && e.code !== 'Space') {
            return;
        }

        e.preventDefault();

        const button = Button.init(e.currentTarget);
        button.toggle();
    });

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

            this._items = $$1.find('.carousel-item', this._node);

            this._index = this._items.findIndex((item) =>
                $$1.hasClass(item, 'active'),
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
            if (!$$1.isHidden(document)) {
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
                $$1.removeEvent(this._node, 'keydown.ui.carousel');
            }

            if (this._options.pause) {
                $$1.removeEvent(this._node, 'mouseenter.ui.carousel');
                $$1.removeEvent(this._node, 'mouseleave.ui.carousel');
            }

            if (this._options.swipe) {
                $$1.removeEvent(this._node, 'mousedown.ui.carousel touchstart.ui.carousel');
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
     * Attach events for the Carousel.
     */
    function _events$2() {
        if (this._options.keyboard) {
            $$1.addEvent(this._node, 'keydown.ui.carousel', (e) => {
                const target = e.target;
                if ($$1.is(target, 'input, select')) {
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

        if (this._options.pause) {
            $$1.addEvent(this._node, 'mouseenter.ui.carousel', (_) => {
                this._mousePaused = true;
                this.pause();
            });

            $$1.addEvent(this._node, 'mouseleave.ui.carousel', (_) => {
                this._mousePaused = false;
                this._paused = false;

                if (!$$1.getDataset(this._node, 'uiSliding')) {
                    this._setTimer();
                }
            });
        }

        if (this._options.swipe) {
            let startX;
            let index = null;
            let progress;
            let direction;

            const downEvent = (e) => {
                if (
                    e.button ||
                    $$1.getDataset(this._node, 'uiSliding') ||
                    (
                        !$$1.is(e.target, ':disabled, .disabled') &&
                        (
                            $$1.is(e.target, '[data-ui-slide-to], [data-ui-slide], a, button, input, textarea, select') ||
                            $$1.closest(e.target, '[data-ui-slide], a, button', (parent) => $$1.isSame(parent, this._node) || $$1.is(parent, ':disabled, .disabled')).length
                        )
                    )
                ) {
                    return false;
                }

                this.pause();
                $$1.setDataset(this._node, { uiSliding: true });

                const pos = getPosition(e);
                startX = pos.x;
            };

            const moveEvent = (e) => {
                const pos = getPosition(e);
                const currentX = pos.x;
                const width = $$1.width(this._node);
                const scrollX = width / 2;

                let mouseDiffX = currentX - startX;
                if (!this._options.wrap) {
                    mouseDiffX = $$1._clamp(
                        mouseDiffX,
                        -(this._items.length - 1 - this._index) * scrollX,
                        this._index * scrollX,
                    );
                }

                progress = $$1._map(Math.abs(mouseDiffX), 0, scrollX, 0, 1);

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
                    $$1.removeDataset(this._node, 'uiSliding');
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

                $$1.animate(
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
                        duration: this._options.transition * progressRemaining,
                    },
                ).then((_) => {
                    this._updateIndicators();
                    $$1.removeDataset(this._node, 'uiSliding');

                    this._paused = false;
                    this._setTimer();
                }).catch((_) => {
                    $$1.removeDataset(this._node, 'uiSliding');
                });
            };

            const dragEvent = $$1.mouseDragFactory(downEvent, moveEvent, upEvent);

            $$1.addEvent(this._node, 'mousedown.ui.carousel touchstart.ui.carousel', dragEvent);
        }
    }

    /**
     * Reset styles of an item.
     * @param {number} index The item index.
     */
    function _resetStyles(index) {
        $$1.setStyle(this._items[index], {
            display: '',
            transform: '',
        });
    }
    /**
     * Set a new item index and update the items.
     * @param {number} index The new item index.
     * @return {number} The old item index.
     */
    function _setIndex(index) {
        const oldIndex = this._index;
        this._index = index;

        $$1.addClass(this._items[this._index], 'active');
        $$1.removeClass(this._items[oldIndex], 'active');

        return oldIndex;
    }
    /**
     * Set a timer for the next Carousel cycle.
     */
    function _setTimer() {
        if (this._timer || this._paused || this._mousePaused) {
            return;
        }

        const interval = $$1.getDataset(this._items[this._index], 'uiInterval');

        this._timer = setTimeout(
            (_) => {
                this._timer = null;
                this.cycle();
            },
            interval || this._options.interval,
        );
    }
    /**
     * Cycle to a specific Carousel item.
     * @param {number} index The item index to cycle to.
     */
    function _show$2(index) {
        if ($$1.getDataset(this._node, 'uiSliding')) {
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

        const direction = getDirection$1(offset, this._index, index);

        const eventData = {
            direction,
            relatedTarget: this._items[index],
            from: this._index,
            to: index,
        };

        if (!$$1.triggerOne(this._node, 'slide.ui.carousel', { data: eventData })) {
            return;
        }

        $$1.setDataset(this._node, { uiSliding: true });
        this.pause();

        const oldIndex = this._setIndex(index);

        $$1.animate(
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
            $$1.removeDataset(this._node, 'uiSliding');
            $$1.triggerEvent(this._node, 'slid.ui.carousel', { data: eventData });

            this._paused = false;
            this._setTimer();
        }).catch((_) => {
            $$1.removeDataset(this._node, 'uiSliding');
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
    function _update(nodeIn, nodeOut, progress, { direction, dragging = false } = {}) {
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

        $$1.setStyle(nodeIn, inStyles);
        $$1.setStyle(nodeOut, outStyles);
    }
    /**
     * Update the carousel indicators.
     */
    function _updateIndicators() {
        const oldIndicator = $$1.find('.active[data-ui-slide-to]', this._node);
        const newIndicator = $$1.find('[data-ui-slide-to="' + this._index + '"]', this._node);
        $$1.removeClass(oldIndicator, 'active');
        $$1.addClass(newIndicator, 'active');
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

    // Carousel prototype
    const proto$4 = Carousel.prototype;

    proto$4._events = _events$2;
    proto$4._resetStyles = _resetStyles;
    proto$4._setIndex = _setIndex;
    proto$4._setTimer = _setTimer;
    proto$4._show = _show$2;
    proto$4._update = _update;
    proto$4._updateIndicators = _updateIndicators;

    // Carousel init
    initComponent('carousel', Carousel);

    // Carousel events
    $$1((_) => {
        const nodes = $$1.find('[data-ui-ride="carousel"]');

        for (const node of nodes) {
            Carousel.init(node);
        }
    });

    $$1.addEventDelegate(document, 'click.ui.carousel', '[data-ui-slide]', (e) => {
        e.preventDefault();

        const target = getTarget(e.currentTarget, '.carousel');
        const carousel = Carousel.init(target);
        const slide = $$1.getDataset(e.currentTarget, 'uiSlide');

        if (slide === 'prev') {
            carousel.prev();
        } else {
            carousel.next();
        }
    });

    $$1.addEventDelegate(document, 'click.ui.carousel', '[data-ui-slide-to]', (e) => {
        e.preventDefault();

        const target = getTarget(e.currentTarget, '.carousel');
        const carousel = Carousel.init(target);
        const slideTo = $$1.getDataset(e.currentTarget, 'uiSlideTo');

        carousel.show(slideTo);
    });

    let clickTarget;

    // Track the target of mousedown events
    $$1.addEvent(window$1, 'mousedown.ui', (e) => {
        clickTarget = e.target;
    }, { capture: true });

    $$1.addEvent(window$1, 'mouseup.ui', (_) => {
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

            this._triggers = $$1.find('[data-ui-toggle="collapse"]')
                .filter((trigger) => {
                    const selector = getTargetSelector(trigger);
                    return selector && $$1.is(this._node, selector);
                });

            if (this._options.parent) {
                this._parent = $$1.closest(this._node, this._options.parent).shift();
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
                $$1.getDataset(this._node, 'uiAnimating') ||
                !$$1.hasClass(this._node, 'show') ||
                !$$1.triggerOne(this._node, 'hide.ui.collapse')
            ) {
                return;
            }

            $$1.setDataset(this._node, { uiAnimating: 'out' });
            $$1.addClass(this._triggers, 'collapsed');
            $$1.addClass(this._triggers, 'collapsing');

            $$1.squeezeOut(this._node, {
                direction: this._options.direction,
                duration: this._options.duration,
            }).then((_) => {
                $$1.removeClass(this._node, 'show');
                $$1.removeClass(this._triggers, 'collapsing');
                $$1.setAttribute(this._triggers, { 'aria-expanded': false });
                $$1.removeDataset(this._node, 'uiAnimating');
                $$1.triggerEvent(this._node, 'hidden.ui.collapse');
            }).catch((_) => {
                if ($$1.getDataset(this._node, 'uiAnimating') === 'out') {
                    $$1.removeDataset(this._node, 'uiAnimating');
                }
            });
        }

        /**
         * Show the element.
         */
        show() {
            if (
                $$1.getDataset(this._node, 'uiAnimating') ||
                $$1.hasClass(this._node, 'show')
            ) {
                return;
            }

            const collapses = [];
            if (this._parent) {
                const siblings = $$1.find('.collapse.show', this._parent);

                for (const sibling of siblings) {
                    const collapse = this.constructor.init(sibling);

                    if (!$$1.isSame(this._parent, collapse._parent)) {
                        continue;
                    }

                    collapses.push(collapse);
                }
            }

            if (!$$1.triggerOne(this._node, 'show.ui.collapse')) {
                return;
            }

            for (const collapse of collapses) {
                collapse.hide();
            }

            $$1.setDataset(this._node, { uiAnimating: 'in' });
            $$1.addClass(this._node, 'show');
            $$1.removeClass(this._triggers, 'collapsed');
            $$1.addClass(this._triggers, 'collapsing');

            $$1.squeezeIn(this._node, {
                direction: this._options.direction,
                duration: this._options.duration,
            }).then((_) => {
                $$1.removeClass(this._triggers, 'collapsing');
                $$1.setAttribute(this._triggers, { 'aria-expanded': true });
                $$1.removeDataset(this._node, 'uiAnimating');
                $$1.triggerEvent(this._node, 'shown.ui.collapse');
            }).catch((_) => {
                if ($$1.getDataset(this._node, 'uiAnimating') === 'in') {
                    $$1.removeDataset(this._node, 'uiAnimating');
                }
            });
        }

        /**
         * Toggle the element.
         */
        toggle() {
            if ($$1.hasClass(this._node, 'show')) {
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
    $$1.addEventDelegate(document, 'click.ui.collapse', '[data-ui-toggle="collapse"]', (e) => {
        e.preventDefault();

        const selector = getTargetSelector(e.currentTarget);
        const targets = $$1.find(selector);

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

        $$1.addEvent(
            window$1,
            'resize.ui.popper',
            $$1.debounce((_) => {
                for (const popper of poppers) {
                    popper.update();
                }
            }),
        );

        $$1.addEvent(
            document,
            'scroll.ui.popper',
            $$1.debounce((e) => {
                for (const popper of poppers) {
                    if (
                        !$$1._isDocument(e.target) &&
                        !$$1.hasDescendent(e.target, popper._node) &&
                        !$$1.hasDescendent(e.target, popper._options.reference)
                    ) {
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

        $$1.removeEvent(window$1, 'resize.ui.popper');
        $$1.removeEvent(document, 'scroll.ui.popper');

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

            this._placement = $$1.getDataset(this._node, 'uiPlacement');
            this._referencePlacement = $$1.getDataset(this._options.reference, 'uiPlacement');

            $$1.setStyle(this._node, {
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
         * Dispose the Popper.
         */
        dispose() {
            if (this._placement) {
                $$1.setDataset(this._node, { uiPlacement: this._placement });
            } else {
                $$1.removeDataset(this._node, 'uiPlacement');
            }

            if (!this._options.noAttributes) {
                if (this._referencePlacement) {
                    $$1.setDataset(this._options.reference, { uiPlacement: this._referencePlacement });
                } else {
                    $$1.removeDataset(this._options.reference, 'uiPlacement');
                }
            }

            removePopper(this);

            super.dispose();
        }

        /**
         * Update the Popper position.
         */
        update() {
            if (!$$1.isConnected(this._node) || !$$1.isVisible(this._node)) {
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

            $$1.setStyle(this._node, resetStyle);

            if (this._options.beforeUpdate) {
                this._options.beforeUpdate(this._node, this._options.reference);
            }

            // calculate boxes
            const nodeBox = $$1.rect(this._node, { offset: true });
            const referenceBox = $$1.rect(this._options.reference, { offset: true });
            const windowBox = getScrollContainer(window$1, document);

            const scrollParent = $$1.closest(
                this._node,
                (parent) =>
                    $$1.css(parent, 'position') === 'relative' &&
                    ['overflow', 'overflowX', 'overflowY'].some((overflow) =>
                        ['auto', 'scroll'].includes(
                            $$1.css(parent, overflow),
                        ),
                    ),
                document.body,
            ).shift();

            const scrollBox = scrollParent ?
                getScrollContainer(scrollParent, scrollParent) :
                null;

            const containerBox = this._options.container ?
                $$1.rect(this._options.container, { offset: true }) :
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
                $$1.setDataset(this._options.reference, { uiPlacement: placement });
            }

            $$1.setDataset(this._node, { uiPlacement: placement });

            // get auto position
            const position = this._options.position;

            // calculate actual offset
            const offset = {
                x: Math.round(referenceBox.x),
                y: Math.round(referenceBox.y),
            };

            // offset for relative parent
            const relativeParent = $$1.closest(
                this._node,
                (parent) =>
                    $$1.css(parent, 'position') === 'relative',
                document.body,
            ).shift();
            const relativeBox = relativeParent ?
                $$1.rect(relativeParent, { offset: true }) :
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
            offset.x -= parseInt($$1.css(this._node, 'marginLeft'));
            offset.y -= parseInt($$1.css(this._node, 'marginTop'));

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
                offset.x += $$1.getScrollX(scrollParent);
                offset.y += $$1.getScrollY(scrollParent);
            }

            // update position
            const style = {};
            if (this._options.useGpu) {
                style.transform = `translate3d(${offset.x}px , ${offset.y}px , 0)`;
            } else {
                style.marginLeft = `${offset.x}px`;
                style.marginTop = `${offset.y}px`;
            }

            $$1.setStyle(this._node, style);

            // update arrow
            if (this._options.arrow) {
                this._updateArrow(placement, position);
            }

            if (this._options.afterUpdate) {
                this._options.afterUpdate(this._node, this._options.reference, placement, position);
            }
        }
    }

    /**
     * Dropdown Class
     * @class
     */
    class Dropdown extends BaseComponent {
        /**
         * New Dropdown constructor.
         * @param {HTMLElement} node The input node.
         * @param {object} [options] The options to create the Dropdown with.
         */
        constructor(node, options) {
            super(node, options);

            this._menuNode = $$1.next(this._node, '.dropdown-menu').shift();

            if (this._options.reference) {
                if (this._options.reference === 'parent') {
                    this._referenceNode = $$1.parent(this._node).shift();
                } else {
                    this._referenceNode = $$1.findOne(this._options.reference);
                }
            } else {
                this._referenceNode = this._node;
            }

            // Attach popper
            if (this._options.display !== 'static' && $$1.closest(this._node, '.navbar-nav').length) {
                this._options.display = 'static';
            }
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
         * Hide the Dropdown.
         */
        hide() {
            if (
                $$1.getDataset(this._menuNode, 'uiAnimating') ||
                !$$1.hasClass(this._menuNode, 'show') ||
                !$$1.triggerOne(this._node, 'hide.ui.dropdown')
            ) {
                return;
            }

            $$1.setDataset(this._menuNode, { uiAnimating: 'out' });

            $$1.fadeOut(this._menuNode, {
                duration: this._options.duration,
            }).then((_) => {
                if (this._popper) {
                    this._popper.dispose();
                    this._popper = null;
                }

                $$1.removeClass(this._menuNode, 'show');
                $$1.setAttribute(this._node, { 'aria-expanded': false });
                $$1.removeDataset(this._menuNode, 'uiAnimating');
                $$1.triggerEvent(this._node, 'hidden.ui.dropdown');
            }).catch((_) => {
                if ($$1.getDataset(this._menuNode, 'uiAnimating') === 'out') {
                    $$1.removeDataset(this._menuNode, 'uiAnimating');
                }
            });
        }

        /**
         * Show the Dropdown.
         */
        show() {
            if (
                $$1.getDataset(this._menuNode, 'uiAnimating') ||
                $$1.hasClass(this._menuNode, 'show') ||
                !$$1.triggerOne(this._node, 'show.ui.dropdown')
            ) {
                return;
            }

            $$1.setDataset(this._menuNode, { uiAnimating: 'in' });
            $$1.addClass(this._menuNode, 'show');

            if (this._options.display === 'dynamic') {
                this._popper = new Popper(this._menuNode, {
                    reference: this._referenceNode,
                    placement: this._options.placement,
                    position: this._options.position,
                    fixed: this._options.fixed,
                    spacing: this._options.spacing,
                    minContact: this._options.minContact,
                });
            }

            window$1.requestAnimationFrame((_) => {
                this.update();
            });

            $$1.fadeIn(this._menuNode, {
                duration: this._options.duration,
            }).then((_) => {
                $$1.setAttribute(this._node, { 'aria-expanded': true });
                $$1.removeDataset(this._menuNode, 'uiAnimating');
                $$1.triggerEvent(this._node, 'shown.ui.dropdown');
            }).catch((_) => {
                if ($$1.getDataset(this._menuNode, 'uiAnimating') === 'in') {
                    $$1.removeDataset(this._menuNode, 'uiAnimating');
                }
            });
        }

        /**
         * Toggle the Dropdown.
         */
        toggle() {
            if ($$1.hasClass(this._menuNode, 'show')) {
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
    $$1.addEventDelegate(document, 'click.ui.dropdown keydown.ui.dropdown', '[data-ui-toggle="dropdown"]', (e) => {
        if (e.code && e.code !== 'Space') {
            return;
        }

        e.preventDefault();

        const dropdown = Dropdown.init(e.currentTarget);
        dropdown.toggle();
    });

    $$1.addEventDelegate(document, 'keydown.ui.dropdown', '[data-ui-toggle="dropdown"]', (e) => {
        switch (e.code) {
            case 'ArrowDown':
            case 'ArrowUp': {
                e.preventDefault();

                const node = e.currentTarget;
                const dropdown = Dropdown.init(node);

                if (!$$1.hasClass(dropdown._menuNode, 'show')) {
                    dropdown.show();
                }

                const focusNode = $$1.findOne('.dropdown-item:not([tabindex="-1"])', dropdown._menuNode);
                $$1.focus(focusNode);
                break;
            }
        }
    });

    $$1.addEventDelegate(document, 'keydown.ui.dropdown', '.dropdown-menu.show .dropdown-item', (e) => {
        let focusNode;

        switch (e.code) {
            case 'ArrowDown':
                focusNode = $$1.next(e.currentTarget, '.dropdown-item:not([tabindex="-1"])').shift();
                break;
            case 'ArrowUp':
                focusNode = $$1.prev(e.currentTarget, '.dropdown-item:not([tabindex="-1"])').pop();
                break;
            default:
                return;
        }

        e.preventDefault();

        $$1.focus(focusNode);
    });

    $$1.addEvent(document, 'click.ui.dropdown', (e) => {
        const target = getClickTarget(e);
        const nodes = $$1.find('.dropdown-menu.show');

        for (const node of nodes) {
            const toggle = $$1.siblings(node, '[data-ui-toggle="dropdown"]').shift();
            const dropdown = Dropdown.init(toggle);
            const hasDescendent = $$1.hasDescendent(dropdown._menuNode, target);
            const autoClose = dropdown._options.autoClose;

            if (
                $$1.isSame(dropdown._node, target) ||
                (
                    hasDescendent &&
                    (
                        $$1.is(target, 'form, input, textarea, select, option') ||
                        autoClose === 'outside' ||
                        autoClose === false
                    )
                ) ||
                (
                    !hasDescendent &&
                    !$$1.isSame(dropdown._menuNode, target) &&
                    (
                        autoClose === 'inside' ||
                        autoClose === false
                    )
                )
            ) {
                continue;
            }

            dropdown.hide();
        }
    }, { capture: true });

    $$1.addEvent(document, 'keydown.ui.dropdown', (e) => {
        if (e.code !== 'Escape') {
            return;
        }

        let stopped = false;
        const nodes = $$1.find('.dropdown-menu.show');

        for (const node of nodes) {
            const toggle = $$1.siblings(node, '[data-ui-toggle="dropdown"]').shift();
            const dropdown = Dropdown.init(toggle);

            if (!stopped) {
                stopped = true;
                e.stopPropagation();
            }

            dropdown.hide();
        }
    }, { capture: true });

    $$1.addEvent(document, 'keyup.ui.dropdown', (e) => {
        if (e.code !== 'Tab') {
            return;
        }

        let stopped = false;
        const nodes = $$1.find('.dropdown-menu.show');

        for (const node of nodes) {
            const toggle = $$1.siblings(node, '[data-ui-toggle="dropdown"]').shift();
            const dropdown = Dropdown.init(toggle);

            if ($$1.hasDescendent(dropdown._menuNode, e.target)) {
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

        $$1.addEvent(document, 'focusin.ui.focustrap', (e) => {
            const activeTarget = [...focusTraps].pop()._node;

            if (
                $$1._isDocument(e.target) ||
                $$1.isSame(activeTarget, e.target) ||
                $$1.hasDescendent(activeTarget, e.target)
            ) {
                return;
            }

            const focusable = $$1.find('a, button, input, textarea, select, details, [tabindex], [contenteditable="true"]', activeTarget)
                .filter((node) => $$1.is(node, ':not(:disabled, .disabled)') && $$1.getAttribute(node, 'tabindex') >= 0 && $$1.isVisible(node));

            const focusTarget = reverse ?
                focusable.pop() :
                focusable.shift();

            $$1.focus(focusTarget || activeTarget);
        }, {
            capture: true,
        });

        $$1.addEvent(document, 'keydown.ui.focustrap', (e) => {
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

        $$1.removeEvent(document, 'focusin.ui.focustrap');
        $$1.removeEvent(document, 'keydown.ui.focustrap');

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

            if (this._options.autoFocus) {
                $$1.focus(this._node);
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

            this._dialog = $$1.child(this._node, '.modal-dialog').shift();

            if (this._options.show) {
                this.show();
            }

            if (this._options.focus) {
                this._focusTrap = FocusTrap.init(this._node);
            }
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
         * Hide the Modal.
         */
        hide() {
            if (
                $$1.getDataset(this._dialog, 'uiAnimating') ||
                !$$1.hasClass(this._node, 'show') ||
                !$$1.triggerOne(this._node, 'hide.ui.modal')
            ) {
                return;
            }

            $$1.stop(this._dialog);
            $$1.setDataset(this._dialog, { uiAnimating: 'out' });

            if (this._focusTrap) {
                this._focusTrap.deactivate();
            }

            const stackSize = $$1.find('.modal.show').length - 1;

            Promise.all([
                $$1.fadeOut(this._dialog, {
                    duration: this._options.duration,
                }),
                $$1.dropOut(this._dialog, {
                    duration: this._options.duration,
                    direction: 'top',
                }),
                $$1.fadeOut(this._backdrop, {
                    duration: this._options.duration,
                }),
            ]).then((_) => {
                $$1.setAttribute(this._node, {
                    'aria-hidden': true,
                    'aria-modal': false,
                });

                resetScrollPadding(this._scrollNodes);
                this._scrollNodes = [];

                if (stackSize) {
                    $$1.setStyle(this._node, { zIndex: '' });
                } else {
                    $$1.removeClass(document.body, 'modal-open');
                }

                $$1.removeClass(this._node, 'show');

                if (this._options.backdrop) {
                    $$1.remove(this._backdrop);
                    this._backdrop = null;
                }

                if (this._activeTarget) {
                    $$1.focus(this._activeTarget);
                    this._activeTarget = null;
                }

                $$1.removeDataset(this._dialog, 'uiAnimating');
                $$1.triggerEvent(this._node, 'hidden.ui.modal');
            }).catch((_) => {
                if ($$1.getDataset(this._dialog, 'uiAnimating') === 'out') {
                    $$1.removeDataset(this._dialog, 'uiAnimating');
                }
            });
        }

        /**
         * Show the Modal.
         */
        show() {
            if (
                $$1.getDataset(this._dialog, 'uiAnimating') ||
                $$1.hasClass(this._node, 'show') ||
                !$$1.triggerOne(this._node, 'show.ui.modal', { data: { relatedTarget: this._activeTarget } })
            ) {
                return;
            }

            $$1.setDataset(this._dialog, { uiAnimating: 'in' });

            const stackSize = $$1.find('.modal.show').length;

            $$1.removeClass(document.body, 'modal-open');

            this._scrollNodes = [this._dialog];

            if (stackSize) {
                let zIndex = $$1.css(this._node, 'zIndex');
                zIndex = parseInt(zIndex);
                zIndex += stackSize * 20;

                $$1.setStyle(this._node, { zIndex });
            } else if (!$$1.findOne('.offcanvas.show')) {
                this._scrollNodes.push(document.body);
                this._scrollNodes.push(...$$1.find('.fixed-top, .fixed-bottom, .sticky-top'));
            }

            addScrollPadding(this._scrollNodes);

            $$1.addClass(document.body, 'modal-open');

            $$1.addClass(this._node, 'show');

            if (this._options.backdrop) {
                this._backdrop = $$1.create('div', {
                    class: 'modal-backdrop',
                });

                $$1.append(document.body, this._backdrop);

                if (stackSize) {
                    let zIndex = $$1.css(this._backdrop, 'zIndex');
                    zIndex = parseInt(zIndex);
                    zIndex += stackSize * 20;

                    $$1.setStyle(this._backdrop, { zIndex });
                }
            }

            Promise.all([
                $$1.fadeIn(this._dialog, {
                    duration: this._options.duration,
                }),
                $$1.dropIn(this._dialog, {
                    duration: this._options.duration,
                    direction: 'top',
                }),
                $$1.fadeIn(this._backdrop, {
                    duration: this._options.duration,
                }),
            ]).then((_) => {
                $$1.setAttribute(this._node, {
                    'aria-hidden': false,
                    'aria-modal': true,
                });

                if (this._focusTrap) {
                    this._focusTrap.activate();
                }

                $$1.removeDataset(this._dialog, 'uiAnimating');
                $$1.triggerEvent(this._node, 'shown.ui.modal');
            }).catch((_) => {
                if ($$1.getDataset(this._dialog, 'uiAnimating') === 'in') {
                    $$1.removeDataset(this._dialog, 'uiAnimating');
                }
            });
        }

        /**
         * Toggle the Modal.
         */
        toggle() {
            if ($$1.hasClass(this._node, 'show')) {
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
        const nodes = $$1.find('.modal.show');

        if (!nodes.length) {
            return null;
        }

        // find modal with highest zIndex
        let node = nodes.shift();
        let highestZIndex = $$1.getStyle(node, 'zIndex');

        for (const otherNode of nodes) {
            const newZIndex = $$1.getStyle(otherNode, 'zIndex');

            if (newZIndex <= highestZIndex) {
                continue;
            }

            node = otherNode;
            highestZIndex = newZIndex;
        }

        return Modal.init(node);
    }

    /**
     * Start a zoom in/out animation.
     */
    function _zoom() {
        if ($$1.getDataset(this._dialog, 'uiAnimating')) {
            return;
        }

        $$1.stop(this._dialog);

        $$1.animate(
            this._dialog,
            (node, progress) => {
                if (progress >= 1) {
                    $$1.setStyle(node, { transform: '' });
                    return;
                }

                const zoomOffset = (progress < .5 ? progress : (1 - progress)) / 20;
                $$1.setStyle(node, { transform: `scale(${1 + zoomOffset})` });
            },
            {
                duration: 200,
            },
        ).catch((_) => {
            //
        });
    }

    // Modal default options
    Modal.defaults = {
        duration: 250,
        backdrop: true,
        focus: true,
        show: false,
        keyboard: true,
    };

    // Modal prototype
    const proto$3 = Modal.prototype;

    proto$3._zoom = _zoom;

    // Modal init
    initComponent('modal', Modal);

    // Modal events
    $$1.addEventDelegate(document, 'click.ui.modal', '[data-ui-toggle="modal"]', (e) => {
        e.preventDefault();

        const target = getTarget(e.currentTarget, '.modal');
        const modal = Modal.init(target);
        modal._activeTarget = e.currentTarget;
        modal.show();
    });

    $$1.addEventDelegate(document, 'click.ui.modal', '[data-ui-dismiss="modal"]', (e) => {
        e.preventDefault();

        const target = getTarget(e.currentTarget, '.modal');
        const modal = Modal.init(target);
        modal.hide();
    });

    // Events must be attached to the window, so offcanvas events are triggered first
    $$1.addEvent(window$1, 'click.ui.modal', (e) => {
        const target = getClickTarget(e);

        if ($$1.is(target, '[data-ui-dismiss]')) {
            return;
        }

        const modal = getTopModal();

        if (
            !modal ||
            !modal._options.backdrop ||
            (modal._node !== target && $$1.hasDescendent(modal._node, target))
        ) {
            return;
        }

        if (modal._options.backdrop === 'static') {
            modal._zoom();
            return;
        }

        modal.hide();
    });

    $$1.addEvent(window$1, 'keydown.ui.modal', (e) => {
        if (e.code !== 'Escape') {
            return;
        }

        const modal = getTopModal();

        if (!modal || !modal._options.keyboard) {
            return;
        }

        if (modal._options.backdrop === 'static') {
            modal._zoom();
            return;
        }

        modal.hide();
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
        if ($$1.hasClass(node, 'offcanvas-end')) {
            return 'right';
        }

        if ($$1.hasClass(node, 'offcanvas-bottom')) {
            return 'bottom';
        }

        if ($$1.hasClass(node, 'offcanvas-start')) {
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

            if (!this._options.scroll || this._options.backdrop) {
                this._focusTrap = FocusTrap.init(this._node);
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
         * Hide the Offcanvas.
         */
        hide() {
            if (
                $$1.getDataset(this._node, 'uiAnimating') ||
                !$$1.hasClass(this._node, 'show') ||
                !$$1.triggerOne(this._node, 'hide.ui.offcanvas')
            ) {
                return;
            }

            $$1.setDataset(this._node, { uiAnimating: 'out' });

            if (this._focusTrap) {
                this._focusTrap.deactivate();
            }

            Promise.all([
                $$1.fadeOut(this._node, {
                    duration: this._options.duration,
                }),
                $$1.dropOut(this._node, {
                    duration: this._options.duration,
                    direction: getDirection(this._node),
                }),
            ]).then((_) => {
                $$1.setAttribute(this._node, {
                    'aria-hidden': true,
                    'aria-modal': false,
                });

                $$1.removeClass(this._node, 'show');

                if (this._options.backdrop) {
                    $$1.removeClass(document.body, 'offcanvas-backdrop');
                }

                if (!this._options.scroll) {
                    resetScrollPadding(this._scrollNodes);
                    this._scrollNodes = [];

                    $$1.setStyle(document.body, { overflow: '' });
                }

                if (this._activeTarget) {
                    $$1.focus(this._activeTarget);
                    this._activeTarget = null;
                }

                $$1.removeDataset(this._node, 'uiAnimating');
                $$1.triggerEvent(this._node, 'hidden.ui.offcanvas');
            }).catch((_) => {
                if ($$1.getDataset(this._node, 'uiAnimating') === 'out') {
                    $$1.removeDataset(this._node, 'uiAnimating');
                }
            });
        }

        /**
         * Show the Offcanvas.
         */
        show() {
            if (
                $$1.getDataset(this._node, 'uiAnimating') ||
                $$1.hasClass(this._node, 'show') ||
                $$1.findOne('.offcanvas.show') ||
                !$$1.triggerOne(this._node, 'show.ui.offcanvas')
            ) {
                return;
            }

            $$1.setDataset(this._node, { uiAnimating: 'in' });
            $$1.addClass(this._node, 'show');

            if (this._options.backdrop) {
                $$1.addClass(document.body, 'offcanvas-backdrop');
            }

            this._scrollNodes = [];

            if (!this._options.scroll) {
                this._scrollNodes.push(document.body);
                this._scrollNodes.push(...$$1.find('.fixed-top, .fixed-bottom, .sticky-top'));

                addScrollPadding(this._scrollNodes);

                $$1.setStyle(document.body, { overflow: 'hidden' });
            }

            Promise.all([
                $$1.fadeIn(this._node, {
                    duration: this._options.duration,
                }),
                $$1.dropIn(this._node, {
                    duration: this._options.duration,
                    direction: getDirection(this._node),
                }),
            ]).then((_) => {
                $$1.setAttribute(this._node, {
                    'aria-hidden': false,
                    'aria-modal': true,
                });

                if (this._focusTrap) {
                    this._focusTrap.activate();
                }

                $$1.removeDataset(this._node, 'uiAnimating');
                $$1.triggerEvent(this._node, 'shown.ui.offcanvas');
            }).catch((_) => {
                if ($$1.getDataset(this._node, 'uiAnimating') === 'in') {
                    $$1.removeDataset(this._node, 'uiAnimating');
                }
            });
        }

        /**
         * Toggle the Offcanvas.
         */
        toggle() {
            if ($$1.hasClass(this._node, 'show')) {
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
    $$1.addEventDelegate(document, 'click.ui.offcanvas', '[data-ui-toggle="offcanvas"]', (e) => {
        e.preventDefault();

        const target = getTarget(e.currentTarget, '.offcanvas');
        const offcanvas = Offcanvas.init(target);
        offcanvas._activeTarget = e.currentTarget;
        offcanvas.show();
    });

    $$1.addEventDelegate(document, 'click.ui.offcanvas', '[data-ui-dismiss="offcanvas"]', (e) => {
        e.preventDefault();

        const target = getTarget(e.currentTarget, '.offcanvas');
        const offcanvas = Offcanvas.init(target);
        offcanvas.hide();
    });

    $$1.addEvent(document, 'click.ui.offcanvas', (e) => {
        const target = getClickTarget(e);

        if ($$1.is(target, '[data-ui-dismiss]') || $$1.findOne('.modal.show')) {
            return;
        }

        const nodes = $$1.find('.offcanvas.show');

        if (!nodes.length) {
            return;
        }

        for (const node of nodes) {
            const offcanvas = Offcanvas.init(node);

            if (
                !offcanvas._options.backdrop ||
                offcanvas._options.backdrop === 'static' ||
                $$1.isSame(offcanvas._node, target) ||
                $$1.hasDescendent(offcanvas._node, target)
            ) {
                continue;
            }

            offcanvas.hide();
        }
    });

    $$1.addEvent(document, 'keydown.ui.offcanvas', (e) => {
        if (e.code !== 'Escape' || $$1.findOne('.modal.show')) {
            return;
        }

        const nodes = $$1.find('.offcanvas.show');

        if (!nodes.length) {
            return;
        }

        for (const node of nodes) {
            const offcanvas = Offcanvas.init(node);

            if (!offcanvas._options.keyboard) {
                return;
            }

            offcanvas.hide();
        }
    });

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

            this._modal = $$1.closest(this._node, '.modal').shift();

            this._triggers = this._options.trigger.split(' ');

            this._render();
            this._events();

            if (this._options.enable) {
                this.enable();
            }

            this.refresh();
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
            if ($$1.hasDataset(this._node, 'uiOriginalTitle')) {
                const title = $$1.getDataset(this._node, 'uiOriginalTitle');
                $$1.setAttribute(this._node, { title });
                $$1.removeDataset(this._node, 'uiOriginalTitle');
            }

            if (this._popper) {
                this._popper.dispose();
                this._popper = null;
            }

            $$1.remove(this._popover);

            if (this._triggers.includes('hover')) {
                $$1.removeEvent(this._node, 'mouseover.ui.popover');
                $$1.removeEvent(this._node, 'mouseout.ui.popover');
            }

            if (this._triggers.includes('focus')) {
                $$1.removeEvent(this._node, 'focus.ui.popover');
                $$1.removeEvent(this._node, 'blur.ui.popover');
            }

            if (this._triggers.includes('click')) {
                $$1.removeEvent(this._node, 'click.ui.popover');
            }

            if (this._modal) {
                $$1.removeEvent(this._modal, 'hide.ui.modal', this._hideModalEvent);
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
                $$1.getDataset(this._popover, 'uiAnimating') ||
                !$$1.isConnected(this._popover) ||
                !$$1.triggerOne(this._node, 'hide.ui.popover')
            ) {
                return;
            }

            $$1.setDataset(this._popover, { uiAnimating: 'out' });

            $$1.fadeOut(this._popover, {
                duration: this._options.duration,
            }).then((_) => {
                this._popper.dispose();
                this._popper = null;

                $$1.detach(this._popover);
                $$1.removeDataset(this._popover, 'uiAnimating');
                $$1.removeAttribute(this._node, 'aria-described-by');
                $$1.triggerEvent(this._node, 'hidden.ui.popover');
            }).catch((_) => {
                if ($$1.getDataset(this._popover, 'uiAnimating') === 'out') {
                    $$1.removeDataset(this._popover, 'uiAnimating');
                }
            });
        }

        /**
         * Refresh the Popover.
         */
        refresh() {
            if ($$1.hasAttribute(this._node, 'title')) {
                const originalTitle = $$1.getAttribute(this._node, 'title');
                $$1.setDataset(this._node, { uiOriginalTitle: originalTitle });
                $$1.removeAttribute(this._node, 'title');
            }

            let title = '';
            if ($$1.hasDataset(this._node, 'uiTitle')) {
                title = $$1.getDataset(this._node, 'uiTitle');
            } else if (this._options.title) {
                title = this._options.title;
            } else if ($$1.hasDataset(this._node, 'uiOriginalTitle')) {
                title = $$1.getDataset(this._node, 'uiOriginalTitle', title);
            }

            let content = '';
            if ($$1.hasDataset(this._node, 'uiContent')) {
                content = $$1.getDataset(this._node, 'uiContent');
            } else if (this._options.content) {
                content = this._options.content;
            }

            const method = this._options.html ? 'setHTML' : 'setText';

            $$1[method](
                this._popoverHeader,
                this._options.html && this._options.sanitize ?
                    this._options.sanitize(title) :
                    title,
            );

            if (!title) {
                $$1.hide(this._popoverHeader);
            } else {
                $$1.show(this._popoverHeader);
            }

            $$1[method](
                this._popoverBody,
                this._options.html && this._options.sanitize ?
                    this._options.sanitize(content) :
                    content,
            );
        }

        /**
         * Show the Popover.
         */
        show() {
            if (
                !this._enabled ||
                $$1.getDataset(this._popover, 'uiAnimating') ||
                $$1.isConnected(this._popover) ||
                !$$1.triggerOne(this._node, 'show.ui.popover')
            ) {
                return;
            }

            $$1.setDataset(this._popover, { uiAnimating: 'in' });
            this.refresh();
            this._show();

            $$1.fadeIn(this._popover, {
                duration: this._options.duration,
            }).then((_) => {
                $$1.removeDataset(this._popover, 'uiAnimating');
                $$1.triggerEvent(this._node, 'shown.ui.popover');
            }).catch((_) => {
                if ($$1.getDataset(this._popover, 'uiAnimating') === 'in') {
                    $$1.removeDataset(this._popover, 'uiAnimating');
                }
            });
        }

        /**
         * Toggle the Popover.
         * @param {object} [options] The toggle options.
         * @param {boolean} [options.force=true] Whether to force hiding when disabled.
         */
        toggle({ force = true } = {}) {
            if ($$1.isConnected(this._popover)) {
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

    /**
     * Attach events for the Popover.
     */
    function _events$1() {
        if (this._triggers.includes('hover')) {
            $$1.addEvent(this._node, 'mouseover.ui.popover', (_) => {
                this._stop();
                this.show();
            });

            $$1.addEvent(this._node, 'mouseout.ui.popover', (_) => {
                this._stop();
                this.hide({ force: false });
            });
        }

        if (this._triggers.includes('focus')) {
            $$1.addEvent(this._node, 'focus.ui.popover', (_) => {
                this._stop();
                this.show();
            });

            $$1.addEvent(this._node, 'blur.ui.popover', (_) => {
                this._stop();
                this.hide({ force: false });
            });
        }

        if (this._triggers.includes('click')) {
            $$1.addEvent(this._node, 'click.ui.popover', (e) => {
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
            $$1.addEvent(this._modal, 'hide.ui.modal', this._hideModalEvent);
        }
    }

    /**
     * Update the arrow.
     * @param {string} placement The placement of the Popper.
     * @param {string} position The position of the Popper.
     */
    function _updateArrow(placement, position) {
        const nodeBox = $$1.rect(this._node, { offset: true });
        const referenceBox = $$1.rect(this._options.reference, { offset: true });

        const arrowStyles = {
            position: 'absolute',
            top: '',
            right: '',
            bottom: '',
            left: '',
        };
        $$1.setStyle(this._options.arrow, arrowStyles);

        const arrowBox = $$1.rect(this._options.arrow, { offset: true });

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

            arrowStyles.left = $$1._clamp(offset, min, max);
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

            arrowStyles.top = $$1._clamp(offset, min, max);
        }

        $$1.setStyle(this._options.arrow, arrowStyles);
    }

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

    // Popper prototype
    const proto$2 = Popper.prototype;

    proto$2._updateArrow = _updateArrow;

    // Popper init
    initComponent('popper', Popper);

    /**
     * Update the Popover and append to the DOM.
     */
    function _show$1() {
        if (this._options.appendTo) {
            $$1.append(this._options.appendTo, this._popover);
        } else {
            $$1.after(this._node, this._popover);
        }

        if (!this._options.noAttributes) {
            const id = generateId(this.constructor.DATA_KEY);
            $$1.setAttribute(this._popover, { id });
            $$1.setAttribute(this._node, { 'aria-described-by': id });
        }

        this._popper = new Popper(
            this._popover,
            {
                reference: this._node,
                arrow: this._arrow,
                placement: this._options.placement,
                position: this._options.position,
                fixed: this._options.fixed,
                spacing: this._options.spacing,
                minContact: this._options.minContact,
                noAttributes: this._options.noAttributes,
            },
        );

        window.requestAnimationFrame((_) => {
            this.update();
        });
    }
    /**
     * Stop the animations.
     */
    function _stop$1() {
        if (!this._enabled) {
            return;
        }

        const animating = $$1.getDataset(this._popover, 'uiAnimating');

        if (!animating) {
            return;
        }

        $$1.stop(this._popover, { finish: false });
        $$1.removeDataset(this._popover, 'uiAnimating');

        if (animating === 'out') {
            this._popper.dispose();
            this._popper = null;

            $$1.detach(this._popover);
        }
    }

    /**
     * Render the Popover element.
     */
    function _render$1() {
        this._popover = $$1.parseHTML(this._options.template).shift();
        if (this._options.customClass) {
            $$1.addClass(this._popover, this._options.customClass);
        }
        this._arrow = $$1.findOne('.popover-arrow', this._popover);
        this._popoverHeader = $$1.findOne('.popover-header', this._popover);
        this._popoverBody = $$1.findOne('.popover-body', this._popover);
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
        sanitize: (input) => $$1.sanitize(input),
        trigger: 'click',
        placement: 'auto',
        position: 'center',
        fixed: false,
        spacing: 3,
        minContact: false,
        noAttributes: false,
    };

    // Popover prototype
    const proto$1 = Popover.prototype;

    proto$1._events = _events$1;
    proto$1._render = _render$1;
    proto$1._show = _show$1;
    proto$1._stop = _stop$1;

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

            const selector = getTargetSelector(this._node);
            this._target = $$1.findOne(selector);
            this._siblings = $$1.siblings(this._node);
        }

        /**
         * Hide the current Tab (forcefully).
         */
        _hide() {
            $$1.setDataset(this._target, { uiAnimating: 'out' });

            $$1.fadeOut(this._target, {
                duration: this._options.duration,
            }).then((_) => {
                $$1.removeClass(this._target, 'active');
                $$1.removeClass(this._node, 'active');
                $$1.removeDataset(this._target, 'uiAnimating');
                $$1.setAttribute(this._node, { 'aria-selected': false });
                $$1.triggerEvent(this._node, 'hidden.ui.tab');
            }).catch((_) => {
                if ($$1.getDataset(this._target, 'uiAnimating') === 'out') {
                    $$1.removeDataset(this._target, 'uiAnimating');
                }
            });
        }

        /**
         * Show the current Tab (forcefully).
         */
        _show() {
            $$1.setDataset(this._target, { uiAnimating: 'in' });

            $$1.addClass(this._target, 'active');
            $$1.addClass(this._node, 'active');

            $$1.fadeIn(this._target, {
                duration: this._options.duration,
            }).then((_) => {
                $$1.setAttribute(this._node, { 'aria-selected': true });
                $$1.removeDataset(this._target, 'uiAnimating');
                $$1.triggerEvent(this._node, 'shown.ui.tab');
            }).catch((_) => {
                if ($$1.getDataset(this._target, 'uiAnimating') === 'in') {
                    $$1.removeDataset(this._target, 'uiAnimating');
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
                $$1.getDataset(this._target, 'uiAnimating') ||
                !$$1.hasClass(this._target, 'active') ||
                !$$1.triggerOne(this._node, 'hide.ui.tab')
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
                $$1.getDataset(this._target, 'uiAnimating') ||
                $$1.hasClass(this._target, 'active') ||
                !$$1.triggerOne(this._node, 'show.ui.tab')
            ) {
                return;
            }

            const active = this._siblings.find((sibling) =>
                $$1.hasClass(sibling, 'active'),
            );

            if (!active) {
                this._show();
            } else {
                const activeTab = this.constructor.init(active);

                if ($$1.getDataset(activeTab._target, 'uiAnimating')) {
                    return;
                }

                if (!$$1.triggerOne(active, 'hide.ui.tab')) {
                    return;
                }

                $$1.addEventOnce(active, 'hidden.ui.tab', (_) => {
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
    $$1.addEventDelegate(document, 'click.ui.tab keydown.ui.tab', '[data-ui-toggle="tab"]', (e) => {
        if (e.code && e.code !== 'Space') {
            return;
        }

        e.preventDefault();

        const tab = Tab.init(e.currentTarget);
        tab.show();
    });

    $$1.addEventDelegate(document, 'keydown.ui.tab', '[data-ui-toggle="tab"]', (e) => {
        let newTarget;

        switch (e.code) {
            case 'ArrowDown':
            case 'ArrowRight':
                newTarget = $$1.next(e.currentTarget, '[data-ui-toggle="tab"]:not(.disabled)').shift();
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                newTarget = $$1.prev(e.currentTarget, '[data-ui-toggle="tab"]:not(.disabled)').pop();
                break;
            case 'Home':
                newTarget = $$1.prevAll(e.currentTarget, '[data-ui-toggle="tab"]:not(.disabled)').shift();
                break;
            case 'End':
                newTarget = $$1.nextAll(e.currentTarget, '[data-ui-toggle="tab"]:not(.disabled)').pop();
                break;
            default:
                return;
        }

        if (!newTarget) {
            return;
        }

        e.preventDefault();

        $$1.focus(newTarget);
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
                $$1.getDataset(this._node, 'uiAnimating') ||
                !$$1.isVisible(this._node) ||
                !$$1.triggerOne(this._node, 'hide.ui.toast')
            ) {
                return;
            }

            clearTimeout(this._timer);
            this._timer = null;

            $$1.setDataset(this._node, { uiAnimating: 'out' });

            $$1.fadeOut(this._node, {
                duration: this._options.duration,
            }).then((_) => {
                $$1.setStyle(this._node, { display: 'none' }, null, { important: true });
                $$1.removeClass(this._node, 'show');
                $$1.removeDataset(this._node, 'uiAnimating');
                $$1.triggerEvent(this._node, 'hidden.ui.toast');
            }).catch((_) => {
                if ($$1.getDataset(this._node, 'uiAnimating') === 'out') {
                    $$1.removeDataset(this._node, 'uiAnimating');
                }
            });
        }

        /**
         * Show the Toast.
         */
        show() {
            if (
                $$1.getDataset(this._node, 'uiAnimating') ||
                $$1.isVisible(this._node) ||
                !$$1.triggerOne(this._node, 'show.ui.toast')
            ) {
                return;
            }

            clearTimeout(this._timer);
            this._timer = null;

            $$1.setDataset(this._node, { uiAnimating: 'in' });
            $$1.setStyle(this._node, { display: '' });
            $$1.addClass(this._node, 'show');

            $$1.fadeIn(this._node, {
                duration: this._options.duration,
            }).then((_) => {
                $$1.removeDataset(this._node, 'uiAnimating');
                $$1.triggerEvent(this._node, 'shown.ui.toast');

                if (this._options.autohide) {
                    this._timer = setTimeout(
                        (_) => {
                            this._timer = null;
                            this.hide();
                        },
                        this._options.delay,
                    );
                }
            }).catch((_) => {
                if ($$1.getDataset(this._node, 'uiAnimating') === 'in') {
                    $$1.removeDataset(this._node, 'uiAnimating');
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
    $$1.addEventDelegate(document, 'click.ui.toast', '[data-ui-dismiss="toast"]', (e) => {
        e.preventDefault();

        const target = getTarget(e.currentTarget, '.toast');
        const toast = Toast.init(target, { autohide: false });
        toast.hide();
    });

    /**
     * Attach events for the Tooltip.
     */
    function _events() {
        if (this._triggers.includes('hover')) {
            $$1.addEvent(this._node, 'mouseover.ui.tooltip', (_) => {
                this._stop();
                this.show();
            });

            $$1.addEvent(this._node, 'mouseout.ui.tooltip', (_) => {
                this._stop();
                this.hide({ force: false });
            });
        }

        if (this._triggers.includes('focus')) {
            $$1.addEvent(this._node, 'focus.ui.tooltip', (_) => {
                this._stop();
                this.show();
            });

            $$1.addEvent(this._node, 'blur.ui.tooltip', (_) => {
                this._stop();
                this.hide({ force: false });
            });
        }

        if (this._triggers.includes('click')) {
            $$1.addEvent(this._node, 'click.ui.tooltip', (e) => {
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
            $$1.addEvent(this._modal, 'hide.ui.modal', this._hideModalEvent);
        }
    }

    /**
     * Update the Tooltip and append to the DOM.
     */
    function _show() {
        if (this._options.appendTo) {
            $$1.append(this._options.appendTo, this._tooltip);
        } else {
            $$1.after(this._node, this._tooltip);
        }

        if (!this._options.noAttributes) {
            const id = generateId(this.constructor.DATA_KEY);
            $$1.setAttribute(this._tooltip, { id });
            $$1.setAttribute(this._node, { 'aria-described-by': id });
        }

        this._popper = new Popper(
            this._tooltip,
            {
                reference: this._node,
                arrow: this._arrow,
                placement: this._options.placement,
                position: this._options.position,
                fixed: this._options.fixed,
                spacing: this._options.spacing,
                minContact: this._options.minContact,
                noAttributes: this._options.noAttributes,
            },
        );

        window.requestAnimationFrame((_) => {
            this.update();
        });
    }
    /**
     * Stop the animations.
     */
    function _stop() {
        if (!this._enabled) {
            return;
        }

        const animating = $$1.getDataset(this._tooltip, 'uiAnimating');

        if (!animating) {
            return;
        }

        $$1.stop(this._tooltip, { finish: false });
        $$1.removeDataset(this._tooltip, 'uiAnimating');

        if (animating === 'out') {
            this._popper.dispose();
            this._popper = null;

            $$1.removeClass(this._tooltip, 'show');
            $$1.detach(this._tooltip);
        }
    }

    /**
     * Render the Tooltip element.
     */
    function _render() {
        this._tooltip = $$1.parseHTML(this._options.template).shift();
        if (this._options.customClass) {
            $$1.addClass(this._tooltip, this._options.customClass);
        }
        this._arrow = $$1.findOne('.tooltip-arrow', this._tooltip);
        this._tooltipInner = $$1.findOne('.tooltip-inner', this._tooltip);
    }

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

            this._modal = $$1.closest(this._node, '.modal').shift();

            this._triggers = this._options.trigger.split(' ');

            this._render();
            this._events();

            if (this._options.enable) {
                this.enable();
            }

            this.refresh();
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
            if ($$1.hasDataset(this._node, 'uiOriginalTitle')) {
                const title = $$1.getDataset(this._node, 'uiOriginalTitle');
                $$1.setAttribute(this._node, { title });
                $$1.removeDataset(this._node, 'uiOriginalTitle');
            }

            if (this._popper) {
                this._popper.dispose();
                this._popper = null;
            }

            $$1.remove(this._tooltip);

            if (this._triggers.includes('hover')) {
                $$1.removeEvent(this._node, 'mouseover.ui.tooltip');
                $$1.removeEvent(this._node, 'mouseout.ui.tooltip');
            }

            if (this._triggers.includes('focus')) {
                $$1.removeEvent(this._node, 'focus.ui.tooltip');
                $$1.removeEvent(this._node, 'blur.ui.tooltip');
            }

            if (this._triggers.includes('click')) {
                $$1.removeEvent(this._node, 'click.ui.tooltip');
            }

            if (this._modal) {
                $$1.removeEvent(this._modal, 'hide.ui.modal', this._hideModalEvent);
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
                $$1.getDataset(this._tooltip, 'uiAnimating') ||
                !$$1.isConnected(this._tooltip) ||
                !$$1.triggerOne(this._node, 'hide.ui.tooltip')
            ) {
                return;
            }

            $$1.setDataset(this._tooltip, { uiAnimating: 'out' });

            $$1.fadeOut(this._tooltip, {
                duration: this._options.duration,
            }).then((_) => {
                this._popper.dispose();
                this._popper = null;

                $$1.removeClass(this._tooltip, 'show');
                $$1.detach(this._tooltip);
                $$1.removeDataset(this._tooltip, 'uiAnimating');
                $$1.removeAttribute(this._node, 'aria-described-by');
                $$1.triggerEvent(this._node, 'hidden.ui.tooltip');
            }).catch((_) => {
                if ($$1.getDataset(this._tooltip, 'uiAnimating') === 'out') {
                    $$1.removeDataset(this._tooltip, 'uiAnimating');
                }
            });
        }

        /**
         * Refresh the Tooltip.
         */
        refresh() {
            if ($$1.hasAttribute(this._node, 'title')) {
                const originalTitle = $$1.getAttribute(this._node, 'title');
                $$1.setDataset(this._node, { uiOriginalTitle: originalTitle });
                $$1.removeAttribute(this._node, 'title');
            }

            let title = '';
            if ($$1.hasDataset(this._node, 'uiTitle')) {
                title = $$1.getDataset(this._node, 'uiTitle');
            } else if (this._options.title) {
                title = this._options.title;
            } else if ($$1.hasDataset(this._node, 'uiOriginalTitle')) {
                title = $$1.getDataset(this._node, 'uiOriginalTitle', title);
            }

            const method = this._options.html ? 'setHTML' : 'setText';

            $$1[method](
                this._tooltipInner,
                this._options.html && this._options.sanitize ?
                    this._options.sanitize(title) :
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
                $$1.getDataset(this._tooltip, 'uiAnimating') ||
                $$1.isConnected(this._tooltip) ||
                !$$1.triggerOne(this._node, 'show.ui.tooltip')
            ) {
                return;
            }

            $$1.setDataset(this._tooltip, { uiAnimating: 'in' });
            $$1.addClass(this._tooltip, 'show');
            this.refresh();
            this._show();

            $$1.fadeIn(this._tooltip, {
                duration: this._options.duration,
            }).then((_) => {
                $$1.removeDataset(this._tooltip, 'uiAnimating');
                $$1.triggerEvent(this._node, 'shown.ui.tooltip');
            }).catch((_) => {
                if ($$1.getDataset(this._tooltip, 'uiAnimating') === 'in') {
                    $$1.removeDataset(this._tooltip, 'uiAnimating');
                }
            });
        }

        /**
         * Toggle the Tooltip.
         * @param {object} [options] The toggle options.
         * @param {boolean} [options.force=true] Whether to force hiding when disabled.
         */
        toggle({ force = true } = {}) {
            if ($$1.isConnected(this._tooltip)) {
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
        sanitize: (input) => $$1.sanitize(input),
        placement: 'auto',
        position: 'center',
        fixed: false,
        spacing: 2,
        minContact: false,
        noAttributes: false,
    };

    // Tooltip prototype
    const proto = Tooltip.prototype;

    proto._events = _events;
    proto._render = _render;
    proto._show = _show;
    proto._stop = _stop;

    // Tooltip init
    initComponent('tooltip', Tooltip);

    // Clipboard events
    $$1.addEventDelegate(document, 'click', '[data-ui-toggle="clipboard"]', (e) => {
        e.preventDefault();

        const node = e.currentTarget;
        let { action = 'copy', text = null } = getDataset(node);

        if (!['copy', 'cut'].includes(action)) {
            throw new Error('Invalid clipboard action');
        }

        let input;
        if (!text) {
            const target = getTarget(node);
            if ($$1.is(target, 'input, textarea')) {
                input = target;
                text = $$1.getValue(input);
            } else {
                text = $$1.getText(target);
            }
        }

        const customText = !input;
        if (customText) {
            input = $$1.create(
                'textarea',
                {
                    class: 'visually-hidden position-fixed',
                    value: text,
                },
            );

            $$1.append(document.body, input);
        }

        $$1.select(input);

        if ($$1.exec(action)) {
            $$1.triggerEvent(node, 'copied.ui.clipboard', {
                data: {
                    action: action,
                    text,
                },
            });
        }

        if (customText) {
            $$1.detach(input);
        }
    });

    // Ripple events
    $$1.addEventDelegate(document, 'click.ui.ripple', '.ripple', (e) => {
        if (e.button !== 0) {
            return;
        }

        const target = e.currentTarget;
        const pos = $$1.position(target, { offset: true });

        const width = $$1.width(target);
        const height = $$1.height(target);
        const scaleMultiple = Math.max(width, height);

        const isFixed = $$1.isFixed(target);
        const mouseX = isFixed ? e.clientX : e.pageX;
        const mouseY = isFixed ? e.clientY : e.pageY;

        const prevRipple = $$1.findOne(':scope > .ripple-effect', target);

        if (prevRipple) {
            $$1.remove(prevRipple);
        }

        const ripple = $$1.create('span', {
            class: 'ripple-effect',
            style: {
                left: mouseX - pos.x,
                top: mouseY - pos.y,
            },
        });
        $$1.append(target, ripple);

        $$1.animate(
            ripple,
            (node, progress) => {
                $$1.setStyle(node, {
                    transform: 'scale(' + Math.floor(progress * scaleMultiple) + ')',
                    opacity: 1 - Math.pow(progress, 2),
                });
            },
            {
                duration: 500,
            },
        ).finally((_) => {
            $$1.detach(ripple);
        });
    });

    // Text expand events
    $$1.addEventDelegate(document, 'change.ui.expand input.ui.expand', '.text-expand', (e) => {
        const textArea = e.currentTarget;

        $$1.setStyle(textArea, { height: 'inherit' });

        let newHeight = $$1.height(textArea, { boxSize: $$1.SCROLL_BOX });
        newHeight += parseInt($$1.css(textArea, 'borderTop'));
        newHeight += parseInt($$1.css(textArea, 'borderBottom'));

        $$1.setStyle(textArea, { height: `${newHeight}px` });
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
//# sourceMappingURL=frost-ui-bundle.js.map
