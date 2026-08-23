import { $, document } from './../globals.js';
import { initComponent } from './../helpers/component.js';
import { getTargetSelector } from './../helpers/target.js';
import Collapse from './collapse.js';

/** @type {import('./collapse.js').CollapseOptions} */
Collapse.defaults = {
    direction: 'bottom',
    duration: 250,
};

initComponent('collapse', Collapse);

// Toggle every collapse matched by a control.
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
