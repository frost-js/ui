import { $, document } from './../globals.js';
import { initComponent } from './../helpers.js';
import Tab from './tab.js';

// Tab default options
Tab.defaults = {
    duration: 100,
};

// Tab init
initComponent('tab', Tab);

// Tab events
$.addEventDelegate(document, 'click.ui.tab keydown.ui.tab', '[data-ui-toggle="tab"]', (e) => {
    if (e.code && e.code !== 'Space') {
        return;
    }

    e.preventDefault();

    const tab = Tab.init(e.currentTarget);
    tab.show();
});

$.addEventDelegate(document, 'keydown.ui.tab', '[data-ui-toggle="tab"]', (e) => {
    let newTarget;

    switch (e.code) {
        case 'ArrowDown':
        case 'ArrowRight':
            newTarget = $.next(e.currentTarget, '[data-ui-toggle="tab"]:not(.disabled)').shift();
            break;
        case 'ArrowLeft':
        case 'ArrowUp':
            newTarget = $.prev(e.currentTarget, '[data-ui-toggle="tab"]:not(.disabled)').pop();
            break;
        case 'Home':
            newTarget = $.prevAll(e.currentTarget, '[data-ui-toggle="tab"]:not(.disabled)').shift();
            break;
        case 'End':
            newTarget = $.nextAll(e.currentTarget, '[data-ui-toggle="tab"]:not(.disabled)').pop();
            break;
        default:
            return;
    }

    if (!newTarget) {
        return;
    }

    e.preventDefault();

    $.focus(newTarget);
});

export default Tab;
