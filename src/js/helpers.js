import { $, document, window } from './globals.js';

let scrollbarSize;

/**
 * Add scrollbar padding to a node.
 * @param {array} nodes The nodes.
 */
export function addScrollPadding(nodes) {
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
};

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
};

/**
 * Generate a unique element ID.
 * @param {string} [prefix] The ID prefix.
 * @return {string} The unique ID.
 */
export function generateId(prefix) {
    const id = `${prefix}${$._randomInt(10000, 99999)}`;

    if ($.findOne(`#${id}`)) {
        return generateId(prefix);
    }

    return id;
};

/**
 * Get normalized UI data from a node.
 * @param {HTMLElement} node The input node.
 * @return {object} The normalized data.
 */
export function getDataset(node) {
    const dataset = $.getDataset(node);

    return Object.fromEntries(
        Object.entries(dataset)
            .map(([key, value]) => [key.slice(2, 3).toLowerCase() + key.slice(3), value]),
    );
};

/**
 * Get position from a mouse/touch event.
 * @param {Event} e The mouse/touch event.
 * @return {object} The position.
 */
export function getPosition(e) {
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
};

/**
 * Get the scrollbar size for a given axis.
 * @param {HTMLElement|Window} [node=window] The input node.
 * @param {HTMLElement|Document} [scrollNode=document] The scroll node.
 * @param {string} [axis] The axis to check.
 * @return {number} The scrollbar size.
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
 * Calculate the computed bounding rectangle of a node (minus scroll bars).
 * @param {HTMLElement|Window} node The input node.
 * @param {HTMLElement|Document} scrollNode The scroll node.
 * @return {object} The computed bounding rectangle of the node.
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
 * Get a target from a node.
 * @param {HTMLElement} node The input node.
 * @param {string} [closestSelector] The default closest selector.
 * @return {HTMLElement} The target node.
 */
export function getTarget(node, closestSelector) {
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
};

/**
 * Get the target selector from a node.
 * @param {HTMLElement} node The input node.
 * @return {string} The target selector.
 */
export function getTargetSelector(node) {
    return $.getDataset(node, 'uiTarget') || $.getAttribute(node, 'href');
};

/**
 * Get positions from a touch event.
 * @param {Event} e The touch event.
 * @return {array} The positions.
 */
export function getTouchPositions(e) {
    return Array.from(e.touches)
        .map((touch) => ({ x: touch.pageX, y: touch.pageY }));
};

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
};

/**
 * Initialize a UI component.
 * @param {string} key The component key.
 * @param {class} component The component class.
 */
export function initComponent(key, component) {
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
};

/**
 * Reset body scrollbar padding.
 * @param {array} nodes The nodes.
 */
export function resetScrollPadding(nodes) {
    for (const node of nodes) {
        $.setStyle(node, {
            paddingRight: $.getDataset(node, 'uiPaddingRight'),
        });
        $.removeDataset(node, 'uiPaddingRight');
    }
};
