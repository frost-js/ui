import { $, document } from './../globals.js';
import { initComponent } from './../helpers.js';
import Button from './button.js';

// Button init
initComponent('button', Button);

// Button events
$.addEventDelegate(document, 'click.ui.button keydown.ui.button', '[data-ui-toggle="button"]', (e) => {
    if (e.code && e.code !== 'Space') {
        return;
    }

    e.preventDefault();

    const button = Button.init(e.currentTarget);
    button.toggle();
});

export default Button;
