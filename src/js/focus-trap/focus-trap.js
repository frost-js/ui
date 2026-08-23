import BaseComponent from './../base-component.js';
import { $ } from './../globals.js';
import { addFocusTrap, removeFocusTrap } from './helpers.js';

/**
 * FocusTrap Class
 * @class
 */
export default class FocusTrap extends BaseComponent {
    #active;

    /**
     * Activate the FocusTrap.
     */
    activate() {
        if (this.#active) {
            return;
        }

        addFocusTrap(this);

        if (this.options.autoFocus) {
            $.focus(this.node);
        }

        this.#active = true;
    }

    /**
     * Deactivate the FocusTrap.
     */
    deactivate() {
        if (!this.#active) {
            return;
        }

        removeFocusTrap(this);
        this.#active = false;
    }

    /**
     * Dispose the FocusTrap.
     */
    dispose() {
        this.deactivate();

        super.dispose();
    }
}
