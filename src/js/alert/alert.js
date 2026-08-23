import BaseComponent from './../base-component.js';
import { $ } from './../globals.js';

/**
 * @typedef {object} AlertOptions
 * @property {number} [duration=100] The transition duration in milliseconds.
 */

/**
 * Controls a dismissible alert element.
 * @extends {BaseComponent<AlertOptions>}
 */
export default class Alert extends BaseComponent {
    /**
     * Closes the alert.
     */
    close() {
        if (
            $.getDataset(this.node, 'uiAnimating') ||
            !$.triggerOne(this.node, 'close.ui.alert')
        ) {
            return;
        }

        $.setDataset(this.node, { uiAnimating: 'out' });

        $.fadeOut(this.node, {
            duration: this.options.duration,
        }).then((_) => {
            $.detach(this.node);
            $.removeDataset(this.node, 'uiAnimating');
            $.triggerEvent(this.node, 'closed.ui.alert');
            $.remove(this.node);
        }).catch((_) => {
            if ($.getDataset(this.node, 'uiAnimating') === 'out') {
                $.removeDataset(this.node, 'uiAnimating');
            }
        });
    }
}
