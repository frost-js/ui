import { $, document } from './../globals.js';
import { getTarget, initComponent } from './../helpers.js';
import Alert from './alert.js';

// Alert default options
Alert.defaults = {
    duration: 100,
};

// Alert init
initComponent('alert', Alert);

// Alert events
$.addEventDelegate(document, 'click.ui.alert', '[data-ui-dismiss="alert"]', (e) => {
    e.preventDefault();

    const target = getTarget(e.currentTarget, '.alert');
    const alert = Alert.init(target);
    alert.close();
});

export default Alert;
