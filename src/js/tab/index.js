import { $, document } from '../globals.js';
import { initComponent } from '../helpers/component.js';
import { getTabGroup } from './helpers.js';
import Tab from './tab.js';

initComponent('tab', Tab);

// Select a tab from pointer or Space-key activation.
$.addEventDelegate(document, 'click.ui.tab keydown.ui.tab', '[data-ui-toggle="tab"]', (event) => {
    if (event.code && event.code !== 'Space') {
        return;
    }

    event.preventDefault();

    const tab = Tab.init(event.currentTarget);
    tab.show();
});

// Select and focus tab controls with navigation keys.
$.addEventDelegate(document, 'keydown.ui.tab', '[data-ui-toggle="tab"]', (event) => {
    const tabs = getTabGroup(event.currentTarget)
        .filter((node) => !$.is(node, ':disabled, .disabled'));
    const index = tabs.indexOf(event.currentTarget);

    if (index < 0) {
        return;
    }

    let newTarget;

    switch (event.code) {
        case 'ArrowDown':
        case 'ArrowRight':
            newTarget = tabs[index + 1];
            break;
        case 'ArrowLeft':
        case 'ArrowUp':
            newTarget = tabs[index - 1];
            break;
        case 'Home':
            newTarget = tabs[0];
            break;
        case 'End':
            newTarget = tabs[tabs.length - 1];
            break;
        default:
            return;
    }

    if (!newTarget || $.isSame(newTarget, event.currentTarget)) {
        return;
    }

    event.preventDefault();

    $.focus(newTarget);
    Tab.init(newTarget).show();
});

export default Tab;
