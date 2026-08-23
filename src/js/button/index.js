import { $, document } from './../globals.js';
import { initComponent } from './../helpers/component.js';
import Button from './button.js';

initComponent('button', Button);

// Toggle a button from pointer or Space-key activation.
$.addEventDelegate(document, 'click.ui.button keydown.ui.button', '[data-ui-toggle="button"]', (e) => {
    if (e.code && e.code !== 'Space') {
        return;
    }

    e.preventDefault();

    const button = Button.init(e.currentTarget);
    button.toggle();
});

export default Button;
