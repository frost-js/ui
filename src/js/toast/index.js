import { $, document } from './../globals.js';
import { initComponent } from './../helpers/component.js';
import { getTarget } from './../helpers/target.js';
import Toast from './toast.js';

initComponent('toast', Toast);

// Hide the toast containing a dismiss control.
$.addEventDelegate(document, 'click.ui.toast', '[data-ui-dismiss="toast"]', (e) => {
    e.preventDefault();

    const target = getTarget(e.currentTarget, '.toast');
    const toast = Toast.init(target, { autohide: false });
    toast.hide();
});

export default Toast;
