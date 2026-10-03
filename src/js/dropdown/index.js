import { $, document } from '../globals.js';
import { getClickTarget } from '../helpers/click-target.js';
import { initComponent } from '../helpers/component.js';
import Dropdown from './dropdown.js';

initComponent('dropdown', Dropdown);

// Toggle a dropdown from pointer or Space-key activation.
$.addEventDelegate(document, 'click.ui.dropdown keydown.ui.dropdown', '[data-ui-toggle="dropdown"]', (event) => {
    if (event.code && event.code !== 'Space') {
        return;
    }

    event.preventDefault();

    const dropdown = Dropdown.init(event.currentTarget);
    dropdown.toggle();
});

// Open a dropdown and focus its first item with an arrow key.
$.addEventDelegate(document, 'keydown.ui.dropdown', '[data-ui-toggle="dropdown"]', (event) => {
    switch (event.code) {
        case 'ArrowDown':
        case 'ArrowUp': {
            event.preventDefault();

            const node = event.currentTarget;
            const dropdown = Dropdown.init(node);

            dropdown.show();
            dropdown.focusFirstItem();
            break;
        }
    }
});

// Move focus between dropdown items with the arrow keys.
$.addEventDelegate(document, 'keydown.ui.dropdown', '.dropdown-menu.show .dropdown-item', (event) => {
    let focusNode;

    switch (event.code) {
        case 'ArrowDown':
            focusNode = $.nextAll(event.currentTarget, '.dropdown-item:not(:disabled, .disabled, [tabindex="-1"])').shift();
            break;
        case 'ArrowUp':
            focusNode = $.prevAll(event.currentTarget, '.dropdown-item:not(:disabled, .disabled, [tabindex="-1"])').pop();
            break;
        default:
            return;
    }

    event.preventDefault();

    $.focus(focusNode);
});

// Close open dropdowns when an eligible target is clicked.
$.addEvent(document, 'click.ui.dropdown', (event) => {
    const target = getClickTarget(event);
    const nodes = $.find('.dropdown-menu.show');

    for (const node of nodes) {
        const toggle = $.siblings(node, '[data-ui-toggle="dropdown"]').shift();
        const dropdown = Dropdown.init(toggle);

        if (!dropdown.shouldClose(target)) {
            continue;
        }

        dropdown.hide();
    }
}, { capture: true });

// Close open dropdowns when Escape is pressed.
$.addEvent(document, 'keydown.ui.dropdown', (event) => {
    if (event.code !== 'Escape') {
        return;
    }

    let stopped = false;
    const nodes = $.find('.dropdown-menu.show');

    for (const node of nodes) {
        const toggle = $.siblings(node, '[data-ui-toggle="dropdown"]').shift();
        const dropdown = Dropdown.init(toggle);

        if (!stopped) {
            stopped = true;
            event.stopPropagation();
        }

        dropdown.hide();
    }
}, { capture: true });

// Close a dropdown after focus leaves its menu with Tab.
$.addEvent(document, 'keyup.ui.dropdown', (event) => {
    if (event.code !== 'Tab') {
        return;
    }

    let stopped = false;
    const nodes = $.find('.dropdown-menu.show');

    for (const node of nodes) {
        const toggle = $.siblings(node, '[data-ui-toggle="dropdown"]').shift();
        const dropdown = Dropdown.init(toggle);

        if (dropdown.containsMenuTarget(event.target)) {
            continue;
        }

        if (!stopped) {
            stopped = true;
            event.stopPropagation();
        }

        dropdown.hide();
    }
}, { capture: true });

export default Dropdown;
