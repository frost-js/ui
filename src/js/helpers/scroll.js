import { $, document, window } from './../globals.js';

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

const scrollPaddingLocks = new WeakMap();

/**
 * Acquires scrollbar compensation for each distinct element, sharing existing locks.
 * @param {Iterable<HTMLElement>} nodes The elements to update.
 * @throws {Error} If a padding lock cannot be acquired. Earlier acquisitions are rolled back.
 */
export function addScrollPadding(nodes) {
    nodes = $._unique(nodes);
    const scrollSizeY = getScrollbarSize(window, document, 'y');
    const acquired = [];

    try {
        for (const node of nodes) {
            const lock = scrollPaddingLocks.get(node);

            if (lock) {
                lock.count++;
            } else if (scrollSizeY) {
                const release = $.setStyleLock(
                    node,
                    'padding-right',
                    `${scrollSizeY + parseInt($.css(node, 'paddingRight'))}px`,
                );
                scrollPaddingLocks.set(node, { release, count: 1 });
            } else {
                continue;
            }

            acquired.push(node);
        }
    } catch (error) {
        resetScrollPadding(acquired);
        throw error;
    }
};

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
};

/**
 * Gets the scrollbar size for an element and axis.
 * @param {HTMLElement|Window} [node=window] The viewport element or window.
 * @param {HTMLElement|Document} [scrollNode=document] The scrolling element or document.
 * @param {Axis} [axis='y'] The axis to measure.
 * @returns {number} The scrollbar size.
 */
export function getScrollbarSize(node = window, scrollNode = document, axis) {
    const method = axis === 'x' ? 'width' : 'height';
    const size = $[method](node);
    const scrollSize = $[method](scrollNode, { boxSize: $.SCROLL_BOX });

    if (scrollSize > size) {
        return calculateScrollbarSize();
    }

    return 0;
};

/**
 * Gets the visible bounding rectangle of an element or window, excluding scrollbars.
 * @param {HTMLElement|Window} node The viewport element or window.
 * @param {HTMLElement|Document} scrollNode The scrolling element or document.
 * @returns {BoundingRect} The visible bounding rectangle.
 */
export function getScrollContainer(node, scrollNode) {
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
};

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
};

/**
 * Releases one acquisition per distinct element, restoring padding after the last user.
 * @param {Iterable<HTMLElement>} nodes The elements to restore.
 */
export function resetScrollPadding(nodes) {
    nodes = $._unique(nodes);

    for (const node of nodes) {
        const lock = scrollPaddingLocks.get(node);

        if (!lock || --lock.count) {
            continue;
        }

        lock.release();
        scrollPaddingLocks.delete(node);
    }
};
