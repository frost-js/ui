import { getClickTarget } from './../click-target/index.js';
import { $, document } from './../globals.js';
import { initComponent } from './../helpers/component.js';
import Dropdown from './dropdown.js';

initComponent('dropdown', Dropdown);

// Toggle a dropdown from pointer or Space-key activation.
$.addEventDelegate(document, 'click.ui.dropdown keydown.ui.dropdown', '[data-ui-toggle="dropdown"]', (e) => {
    if (e.code && e.code !== 'Space') {
        return;
    }

    e.preventDefault();

    const dropdown = Dropdown.init(e.currentTarget);
    dropdown.toggle();
});

// Open a dropdown and focus its first item with an arrow key.
$.addEventDelegate(document, 'keydown.ui.dropdown', '[data-ui-toggle="dropdown"]', (e) => {
    switch (e.code) {
        case 'ArrowDown':
        case 'ArrowUp': {
            e.preventDefault();

            const node = e.currentTarget;
            const dropdown = Dropdown.init(node);

            dropdown.show();
            dropdown.focusFirstItem();
            break;
        }
    }
});

// Move focus between dropdown items with the arrow keys.
$.addEventDelegate(document, 'keydown.ui.dropdown', '.dropdown-menu.show .dropdown-item', (e) => {
    let focusNode;

    switch (e.code) {
        case 'ArrowDown':
            focusNode = $.nextAll(e.currentTarget, '.dropdown-item:not(:disabled, .disabled, [tabindex="-1"])').shift();
            break;
        case 'ArrowUp':
            focusNode = $.prevAll(e.currentTarget, '.dropdown-item:not(:disabled, .disabled, [tabindex="-1"])').pop();
            break;
        default:
            return;
    }

    e.preventDefault();

    $.focus(focusNode);
});

// Close open dropdowns when an eligible target is clicked.
$.addEvent(document, 'click.ui.dropdown', (e) => {
    const target = getClickTarget(e);
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
$.addEvent(document, 'keydown.ui.dropdown', (e) => {
    if (e.code !== 'Escape') {
        return;
    }

    let stopped = false;
    const nodes = $.find('.dropdown-menu.show');

    for (const node of nodes) {
        const toggle = $.siblings(node, '[data-ui-toggle="dropdown"]').shift();
        const dropdown = Dropdown.init(toggle);

        if (!stopped) {
            stopped = true;
            e.stopPropagation();
        }

        dropdown.hide();
    }
}, { capture: true });

// Close a dropdown after focus leaves its menu with Tab.
$.addEvent(document, 'keyup.ui.dropdown', (e) => {
    if (e.code !== 'Tab') {
        return;
    }

    let stopped = false;
    const nodes = $.find('.dropdown-menu.show');

    for (const node of nodes) {
        const toggle = $.siblings(node, '[data-ui-toggle="dropdown"]').shift();
        const dropdown = Dropdown.init(toggle);

        if (dropdown.containsMenuTarget(e.target)) {
            continue;
        }

        if (!stopped) {
            stopped = true;
            e.stopPropagation();
        }

        dropdown.hide();
    }
}, { capture: true });

export default Dropdown;
