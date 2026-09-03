import { $, document } from './../globals.js';
import { getClickTarget } from './../helpers/click-target.js';
import { initComponent } from './../helpers/component.js';
import { getTarget } from './../helpers/target.js';
import Offcanvas from './offcanvas.js';

initComponent('offcanvas', Offcanvas);

// Show the offcanvas panel targeted by a toggle control.
$.addEventDelegate(document, 'click.ui.offcanvas', '[data-ui-toggle="offcanvas"]', (e) => {
    e.preventDefault();

    const target = getTarget(e.currentTarget, '.offcanvas');
    const offcanvas = Offcanvas.init(target);
    offcanvas.show(e.currentTarget);
});

// Hide the offcanvas panel containing a dismiss control.
$.addEventDelegate(document, 'click.ui.offcanvas', '[data-ui-dismiss="offcanvas"]', (e) => {
    e.preventDefault();

    const target = getTarget(e.currentTarget, '.offcanvas');
    const offcanvas = Offcanvas.init(target);
    offcanvas.hide();
});

// Handle backdrop clicks when no modal is covering the offcanvas panel.
$.addEvent(document, 'click.ui.offcanvas', (e) => {
    const target = getClickTarget(e);

    if ($.is(target, '[data-ui-dismiss]') || $.findOne('.modal.show')) {
        return;
    }

    const nodes = $.find('.offcanvas.show');

    if (!nodes.length) {
        return;
    }

    for (const node of nodes) {
        const offcanvas = Offcanvas.init(node);
        offcanvas.handleBackdrop(target);
    }
});

// Send Escape to visible offcanvas panels when no modal is shown.
$.addEvent(document, 'keydown.ui.offcanvas', (e) => {
    if (e.code !== 'Escape' || $.findOne('.modal.show')) {
        return;
    }

    const nodes = $.find('.offcanvas.show');

    if (!nodes.length) {
        return;
    }

    for (const node of nodes) {
        const offcanvas = Offcanvas.init(node);
        offcanvas.handleEscape();
    }
});

export default Offcanvas;
