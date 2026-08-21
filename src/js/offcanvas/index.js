import { getClickTarget } from './../click-target/index.js';
import { $, document } from './../globals.js';
import { getTarget, initComponent } from './../helpers.js';
import Offcanvas from './offcanvas.js';

// Offcanvas default options
Offcanvas.defaults = {
    duration: 250,
    backdrop: true,
    keyboard: true,
    scroll: false,
};

// Offcanvas init
initComponent('offcanvas', Offcanvas);

// Offcanvas events
$.addEventDelegate(document, 'click.ui.offcanvas', '[data-ui-toggle="offcanvas"]', (e) => {
    e.preventDefault();

    const target = getTarget(e.currentTarget, '.offcanvas');
    const offcanvas = Offcanvas.init(target);
    offcanvas._activeTarget = e.currentTarget;
    offcanvas.show();
});

$.addEventDelegate(document, 'click.ui.offcanvas', '[data-ui-dismiss="offcanvas"]', (e) => {
    e.preventDefault();

    const target = getTarget(e.currentTarget, '.offcanvas');
    const offcanvas = Offcanvas.init(target);
    offcanvas.hide();
});

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

        if (
            !offcanvas._options.backdrop ||
            offcanvas._options.backdrop === 'static' ||
            $.isSame(offcanvas._node, target) ||
            $.hasDescendent(offcanvas._node, target)
        ) {
            continue;
        }

        offcanvas.hide();
    }
});

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

        if (!offcanvas._options.keyboard) {
            return;
        }

        offcanvas.hide();
    }
});

export default Offcanvas;
