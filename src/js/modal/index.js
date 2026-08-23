import { getClickTarget } from './../click-target/index.js';
import { $, document, window } from './../globals.js';
import { initComponent } from './../helpers/component.js';
import { getTarget } from './../helpers/target.js';
import { getTopModal } from './helpers.js';
import Modal from './modal.js';

/** @type {import('./modal.js').ModalOptions} */
Modal.defaults = {
    duration: 250,
    backdrop: true,
    focus: true,
    show: false,
    keyboard: true,
};

initComponent('modal', Modal);

// Show the modal targeted by a toggle control.
$.addEventDelegate(document, 'click.ui.modal', '[data-ui-toggle="modal"]', (e) => {
    e.preventDefault();

    const target = getTarget(e.currentTarget, '.modal');
    const modal = Modal.init(target);
    modal.show(e.currentTarget);
});

// Hide the modal containing a dismiss control.
$.addEventDelegate(document, 'click.ui.modal', '[data-ui-dismiss="modal"]', (e) => {
    e.preventDefault();

    const target = getTarget(e.currentTarget, '.modal');
    const modal = Modal.init(target);
    modal.hide();
});

// Handle modal backdrops after offcanvas document listeners have run.
$.addEvent(window, 'click.ui.modal', (e) => {
    const target = getClickTarget(e);

    if ($.is(target, '[data-ui-dismiss]')) {
        return;
    }

    const modal = getTopModal();

    if (!modal) {
        return;
    }

    modal.handleBackdrop(target);
});

// Send Escape to the highest visible modal.
$.addEvent(window, 'keydown.ui.modal', (e) => {
    if (e.code !== 'Escape') {
        return;
    }

    const modal = getTopModal();

    if (!modal) {
        return;
    }

    modal.handleEscape();
});

export default Modal;
