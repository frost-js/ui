import { $, document } from '../globals.js';
import { getDataset } from '../helpers/component.js';
import { getTarget } from '../helpers/target.js';

// Copy or cut text requested by a clipboard control.
$.addEventDelegate(document, 'click', '[data-ui-toggle="clipboard"]', (event) => {
    event.preventDefault();

    const node = event.currentTarget;
    let { action = 'copy', text = null } = getDataset(node);

    if (!['copy', 'cut'].includes(action)) {
        throw new Error('Invalid clipboard action');
    }

    let input;
    if (!text) {
        const target = getTarget(node);
        if ($.is(target, 'input, textarea')) {
            input = target;
            text = $.getValue(input);
        } else {
            text = $.getText(target);
        }
    }

    const customText = !input;
    if (customText) {
        input = $.create(
            'textarea',
            {
                class: 'visually-hidden position-fixed',
                value: text,
            },
        );

        $.append(document.body, input);
    }

    $.select(input);

    if ($.exec(action)) {
        $.triggerEvent(node, 'copied.ui.clipboard', {
            data: {
                action,
                text,
            },
        });
    }

    if (customText) {
        $.detach(input);
    }
});
