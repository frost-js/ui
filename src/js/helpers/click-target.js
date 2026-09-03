import { $, window } from './../globals.js';

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
export function getClickTarget(e) {
    return clickTarget || e.target;
};
