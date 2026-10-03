import BaseComponent from '../base-component.js';
import { $ } from '../globals.js';
import { waitForTransition } from '../helpers/transition.js';

/**
 * @typedef {object} ToastOptions
 * @property {boolean} [autohide=true] Whether to hide the toast automatically.
 * @property {number} [delay=5000] The autohide delay in milliseconds.
 */

/**
 * Controls a transient toast notification.
 * @augments {BaseComponent<ToastOptions>}
 */
export default class Toast extends BaseComponent {
    /** @type {ToastOptions} */
    static defaults = {
        autohide: true,
        delay: 5000,
    };

    #releaseDisplay;
    #timer;
    #transitioning;

    /** @inheritdoc */
    dispose() {
        clearTimeout(this.#timer);
        this.#releaseDisplay?.();

        this.#releaseDisplay = null;
        this.#timer = null;
        this.#transitioning = false;

        super.dispose();
    }

    /**
     * Hides the toast.
     */
    hide() {
        if (
            this.#transitioning ||
            !$.hasClass(this.node, 'show') ||
            !$.triggerOne(this.node, 'hide.ui.toast')
        ) {
            return;
        }

        clearTimeout(this.#timer);

        this.#timer = null;
        this.#transitioning = true;

        // Commit the rendered visible state before starting the transition.
        $.css(this.node, 'opacity');

        $.removeClass(this.node, 'show');

        waitForTransition(this.node, ['opacity']).then(({ node }) => {
            if (!this.node) {
                return;
            }

            try {
                this.#setDisplay('none');
            } finally {
                this.#transitioning = false;
            }

            $.triggerEvent(node, 'hidden.ui.toast');
        });
    }

    /**
     * Shows the toast.
     */
    show() {
        if (
            this.#transitioning ||
            $.hasClass(this.node, 'show') ||
            !$.triggerOne(this.node, 'show.ui.toast')
        ) {
            return;
        }

        clearTimeout(this.#timer);
        this.#setDisplay('');

        this.#timer = null;
        this.#transitioning = true;

        // Commit the rendered hidden state before starting the transition.
        $.css(this.node, 'opacity');
        $.addClass(this.node, 'show');

        waitForTransition(this.node, ['opacity']).then(({ node }) => {
            if (!this.node) {
                return;
            }

            if (this.options.autohide) {
                this.#timer = setTimeout(
                    () => {
                        this.#timer = null;
                        this.hide();
                    },
                    this.options.delay,
                );
            }

            this.#transitioning = false;

            $.triggerEvent(node, 'shown.ui.toast');
        });
    }

    /**
     * Updates visibility while preserving the original display declaration until disposal.
     * @param {string} display The temporary display value.
     */
    #setDisplay(display) {
        if (this.#releaseDisplay) {
            $.setStyle(this.node, { display }, null, { important: true });
        } else {
            this.#releaseDisplay = $.setStyleLock(this.node, 'display', display, { important: true });
        }
    }
}
