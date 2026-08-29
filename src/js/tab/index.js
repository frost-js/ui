import { $, document } from './../globals.js';
import { initComponent } from './../helpers/component.js';
import { getTabGroup } from './helpers.js';
import Tab from './tab.js';

initComponent('tab', Tab);

// Select a tab from pointer or Space-key activation.
$.addEventDelegate(document, 'click.ui.tab keydown.ui.tab', '[data-ui-toggle="tab"]', (e) => {
    if (e.code && e.code !== 'Space') {
        return;
    }

    e.preventDefault();

    const tab = Tab.init(e.currentTarget);
    tab.show();
});

// Select and focus tab controls with navigation keys.
$.addEventDelegate(document, 'keydown.ui.tab', '[data-ui-toggle="tab"]', (e) => {
    const tabs = getTabGroup(e.currentTarget)
        .filter((node) => !$.is(node, ':disabled, .disabled'));
    const index = tabs.indexOf(e.currentTarget);

    if (index < 0) {
        return;
    }

    let newTarget;

    switch (e.code) {
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

    if (!newTarget || $.isSame(newTarget, e.currentTarget)) {
        return;
    }

    e.preventDefault();

    $.focus(newTarget);
    Tab.init(newTarget).show();
});

export default Tab;
