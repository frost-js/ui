import BaseComponent from './../base-component.js';
import { $ } from './../globals.js';
import { addFocusTrap, removeFocusTrap } from './helpers.js';

/**
 * FocusTrap Class
 * @class
 */
export default class FocusTrap extends BaseComponent {
    /**
     * Activate the FocusTrap.
     */
    activate() {
        if (this._active) {
            return;
        }

        addFocusTrap(this);

        if (this._options.autoFocus) {
            $.focus(this._node);
        }

        this._active = true;
    }

    /**
     * Deactivate the FocusTrap.
     */
    deactivate() {
        if (!this._active) {
            return;
        }

        removeFocusTrap(this);
        this._active = false;
    }

    /**
     * Dispose the FocusTrap.
     */
    dispose() {
        this.deactivate();

        super.dispose();
    }
}
