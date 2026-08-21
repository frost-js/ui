import { $, document } from './../globals.js';
import { getTargetSelector, initComponent } from './../helpers.js';
import Collapse from './collapse.js';

// Collapse default options
Collapse.defaults = {
    direction: 'bottom',
    duration: 250,
};

// Collapse init
initComponent('collapse', Collapse);

// Collapse events
$.addEventDelegate(document, 'click.ui.collapse', '[data-ui-toggle="collapse"]', (e) => {
    e.preventDefault();

    const selector = getTargetSelector(e.currentTarget);
    const targets = $.find(selector);

    for (const target of targets) {
        const collapse = Collapse.init(target);
        collapse.toggle();
    }
});

export default Collapse;
