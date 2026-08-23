import BaseComponent from './../base-component.js';
import { $ } from './../globals.js';

/**
 * @typedef {object} ToastOptions
 * @property {boolean} [autohide=true] Whether to hide the toast automatically.
 * @property {number} [delay=5000] The autohide delay in milliseconds.
 * @property {number} [duration=100] The transition duration in milliseconds.
 */

/**
 * Controls a transient toast notification.
 * @extends {BaseComponent<ToastOptions>}
 */
export default class Toast extends BaseComponent {
    #timer;

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
            $.getDataset(this.node, 'uiAnimating') ||
            !$.isVisible(this.node) ||
            !$.triggerOne(this.node, 'hide.ui.toast')
        ) {
            return;
        }

        clearTimeout(this.#timer);
        this.#timer = null;

        $.setDataset(this.node, { uiAnimating: 'out' });

        $.fadeOut(this.node, {
            duration: this.options.duration,
        }).then((_) => {
            $.setStyle(this.node, { display: 'none' }, null, { important: true });
            $.removeClass(this.node, 'show');
            $.removeDataset(this.node, 'uiAnimating');
            $.triggerEvent(this.node, 'hidden.ui.toast');
        }).catch((_) => {
            if ($.getDataset(this.node, 'uiAnimating') === 'out') {
                $.removeDataset(this.node, 'uiAnimating');
            }
        });
    }

    /**
     * Shows the toast.
     */
    show() {
        if (
            $.getDataset(this.node, 'uiAnimating') ||
            $.isVisible(this.node) ||
            !$.triggerOne(this.node, 'show.ui.toast')
        ) {
            return;
        }

        clearTimeout(this.#timer);
        this.#timer = null;

        $.setDataset(this.node, { uiAnimating: 'in' });
        $.setStyle(this.node, { display: '' });
        $.addClass(this.node, 'show');

        $.fadeIn(this.node, {
            duration: this.options.duration,
        }).then((_) => {
            $.removeDataset(this.node, 'uiAnimating');
            $.triggerEvent(this.node, 'shown.ui.toast');

            if (this.options.autohide) {
                this.#timer = setTimeout(
                    (_) => {
                        this.#timer = null;
                        this.hide();
                    },
                    this.options.delay,
                );
            }
        }).catch((_) => {
            if ($.getDataset(this.node, 'uiAnimating') === 'in') {
                $.removeDataset(this.node, 'uiAnimating');
            }
        });
    }
}
