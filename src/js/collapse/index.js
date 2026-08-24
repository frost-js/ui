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

// Keep every collapse matched by a control in the same visible state.
$.addEventDelegate(document, 'click.ui.collapse', '[data-ui-toggle="collapse"]', (e) => {
    e.preventDefault();

    const selector = getTargetSelector(e.currentTarget);
    const targets = $.find(selector);
    const collapses = targets.map((target) => Collapse.init(target));
    const show = !collapses.some((collapse) => $.hasClass(collapse.node, 'show'));

    for (const collapse of collapses) {
        if (show) {
            collapse.show();
        } else {
            collapse.hide();
        }
    }
});

export default Collapse;
