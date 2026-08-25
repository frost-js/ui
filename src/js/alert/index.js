import { $, document } from './../globals.js';
import { initComponent } from './../helpers/component.js';
import { getTarget } from './../helpers/target.js';
import Alert from './alert.js';

initComponent('alert', Alert);

// Dismiss the alert targeted by a dismiss control.
$.addEventDelegate(document, 'click.ui.alert', '[data-ui-dismiss="alert"]', (e) => {
    e.preventDefault();

    const target = getTarget(e.currentTarget, '.alert');
    const alert = Alert.init(target);
    alert.close();
});

export default Alert;
