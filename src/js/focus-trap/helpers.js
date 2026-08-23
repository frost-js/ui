import { $, document } from './../globals.js';

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
export function addFocusTrap(focusTrap) {
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
};

/**
 * Remove a FocusTrap from the set, and detach the FocusTrap events.
 * @param {FocusTrap} focusTrap The FocusTrap.
 */
export function removeFocusTrap(focusTrap) {
    focusTraps.delete(focusTrap);

    if (focusTraps.size) {
        return;
    }

    $.removeEvent(document, 'focusin.ui.focustrap');
    $.removeEvent(document, 'keydown.ui.focustrap');

    running = false;
};
