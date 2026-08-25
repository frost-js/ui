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

        const node = this.node;
        this.#transitioning = true;
        $.removeClass(node, 'show');

        waitForTransition(node, ['opacity']).then((_) => {
            $.detach(node);
            $.triggerEvent(node, 'closed.ui.alert');
            $.remove(node);
        }).finally((_) => {
            this.#transitioning = false;
        });
    }
}
