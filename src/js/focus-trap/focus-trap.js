import BaseComponent from './../base-component.js';
import { $ } from './../globals.js';
import { addFocusTrap, removeFocusTrap } from './helpers.js';

/**
 * @typedef {object} FocusTrapOptions
 * @property {boolean} [autoFocus=true] Whether to focus the trapped element when activated.
 */

/**
 * Keeps keyboard focus within an element while active.
 * @augments {BaseComponent<FocusTrapOptions>}
 */
export default class FocusTrap extends BaseComponent {
    #active;

    /**
     * Activates the focus trap.
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
     * Deactivates the focus trap.
     */
    deactivate() {
        if (!this.#active) {
            return;
        }

        removeFocusTrap(this);
        this.#active = false;
    }

    /** @inheritdoc */
    dispose() {
        this.deactivate();

        super.dispose();
    }
}
