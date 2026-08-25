import BaseComponent from './../base-component.js';
import { $ } from './../globals.js';
import { waitForTransition } from './../helpers/transition.js';

/**
 * Controls a dismissible alert element.
 */
export default class Alert extends BaseComponent {
    #transitioning;

    /**
     * Closes the alert.
     */
    close() {
        if (
            this.#transitioning ||
            !$.triggerOne(this.node, 'close.ui.alert')
        ) {
            return;
        }

        this.#transitioning = true;

        $.removeClass(this.node, 'show');

        waitForTransition(this.node, ['opacity']).then(({ node }) => {
            $.detach(node);
            $.triggerEvent(node, 'closed.ui.alert');
            $.remove(node);

            this.#transitioning = false;
        });
    }
}
