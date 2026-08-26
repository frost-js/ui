import BaseComponent from './../base-component.js';
import { $ } from './../globals.js';
import { waitForTransition } from './../helpers/transition.js';

/**
 * @typedef {object} ToastOptions
 * @property {boolean} [autohide=true] Whether to hide the toast automatically.
 * @property {number} [delay=5000] The autohide delay in milliseconds.
 */

/**
 * Controls a transient toast notification.
 * @extends {BaseComponent<ToastOptions>}
 */
export default class Toast extends BaseComponent {
    #timer;
    #transitioning;

    /** @inheritdoc */
    dispose() {
        clearTimeout(this.#timer);
        this.#timer = null;

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
            this.#transitioning = false;

            $.setStyle(node, { display: 'none' }, null, { important: true });
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
        this.#timer = null;

        this.#transitioning = true;

        $.setStyle(this.node, { display: '' });

        // Commit the rendered hidden state before starting the transition.
        $.css(this.node, 'opacity');
        $.addClass(this.node, 'show');

        waitForTransition(this.node, ['opacity']).then(({ node }) => {
            this.#transitioning = false;

            if (this.options?.autohide) {
                this.#timer = setTimeout(
                    (_) => {
                        this.#timer = null;
                        this.hide();
                    },
                    this.options.delay,
                );
            }

            $.triggerEvent(node, 'shown.ui.toast');
        });
    }
}
