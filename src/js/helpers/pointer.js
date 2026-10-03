/**
 * @typedef {object} Coordinates
 * @property {number} x The X coordinate.
 * @property {number} y The Y coordinate.
 */

/**
 * Gets page coordinates from a mouse or touch event.
 * @param {MouseEvent|TouchEvent} event The input event.
 * @returns {Coordinates} The page coordinates.
 */
export function getPosition(event) {
    if ('touches' in event && event.touches.length) {
        return {
            x: event.touches[0].pageX,
            y: event.touches[0].pageY,
        };
    }

    return {
        x: event.pageX,
        y: event.pageY,
    };
}

/**
 * Gets page coordinates for every active touch.
 * @param {TouchEvent} event The touch event.
 * @returns {Coordinates[]} The active touch coordinates.
 */
export function getTouchPositions(event) {
    return Array.from(event.touches)
        .map((touch) => ({ x: touch.pageX, y: touch.pageY }));
}
