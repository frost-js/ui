import { $, document, window } from '../globals.js';
import { getClickTarget } from '../helpers/click-target.js';
import { initComponent } from '../helpers/component.js';
import { getTarget } from '../helpers/target.js';
import { getTopModal } from './helpers.js';
import Modal from './modal.js';

initComponent('modal', Modal);

// Show the modal targeted by a toggle control.
$.addEventDelegate(document, 'click.ui.modal', '[data-ui-toggle="modal"]', (event) => {
    event.preventDefault();

    const target = getTarget(event.currentTarget, '.modal');
    const modal = Modal.init(target);
    modal.show(event.currentTarget);
});

// Hide the modal containing a dismiss control.
$.addEventDelegate(document, 'click.ui.modal', '[data-ui-dismiss="modal"]', (event) => {
    event.preventDefault();

    const target = getTarget(event.currentTarget, '.modal');
    const modal = Modal.init(target);
    modal.hide();
});

// Handle modal backdrops after offcanvas document listeners have run.
$.addEvent(window, 'click.ui.modal', (event) => {
    const target = getClickTarget(event);

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
$.addEvent(window, 'keydown.ui.modal', (event) => {
    if (event.code !== 'Escape') {
        return;
    }

    const modal = getTopModal();

    if (!modal) {
        return;
    }

    modal.handleEscape();
});

export default Modal;
