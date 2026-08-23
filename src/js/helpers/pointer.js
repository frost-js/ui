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
 * Gets page coordinates for every active touch.
 * @param {TouchEvent} e The touch event.
 * @returns {Coordinates[]} The active touch coordinates.
 */
export function getTouchPositions(e) {
    return Array.from(e.touches)
        .map((touch) => ({ x: touch.pageX, y: touch.pageY }));
};
