/** @import FocusTrap from './focus-trap.js'; */

import { $, document } from '../globals.js';

const focusTraps = new Set();

let focusinHandler = null;
let keydownHandler = null;
let running = false;
let reverse = false;

/**
 * Registers a focus trap and attaches shared focus handlers when needed.
 * @param {FocusTrap} focusTrap The focus trap to register.
 */
export function addFocusTrap(focusTrap) {
    focusTraps.add(focusTrap);

    if (running) {
        return;
    }

    focusinHandler = (event) => {
        const activeTarget = [...focusTraps].pop().node;

        if (
            $._isDocument(event.target) ||
            $.isSame(activeTarget, event.target) ||
            $.hasDescendent(activeTarget, event.target)
        ) {
            return;
        }

        const focusable = $.find('a, button, input, textarea, select, details, [tabindex], [contenteditable="true"]', activeTarget)
            .filter((node) => $.is(node, ':not(:disabled, .disabled)') && $.getAttribute(node, 'tabindex') >= 0 && $.isVisible(node));

        const focusTarget = reverse ?
            focusable.pop() :
            focusable.shift();

        $.focus(focusTarget || activeTarget);
    };

    $.addEvent(document, 'focusin.ui.focustrap', focusinHandler, {
        capture: true,
    });

    keydownHandler = (event) => {
        if (event.key !== 'Tab') {
            return;
        }

        reverse = event.shiftKey;
    };

    $.addEvent(document, 'keydown.ui.focustrap', keydownHandler, {
        capture: true,
    });

    running = true;
    reverse = false;
}

/**
 * Unregisters a focus trap and removes shared handlers when none remain.
 * @param {FocusTrap} focusTrap The focus trap to unregister.
 */
export function removeFocusTrap(focusTrap) {
    focusTraps.delete(focusTrap);

    if (focusTraps.size) {
        return;
    }

    if (focusinHandler) {
        $.removeEvent(document, 'focusin.ui.focustrap', focusinHandler);
    }

    if (keydownHandler) {
        $.removeEvent(document, 'keydown.ui.focustrap', keydownHandler);
    }

    focusinHandler = null;
    keydownHandler = null;
    running = false;
}
