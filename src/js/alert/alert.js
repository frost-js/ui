import BaseComponent from './../base-component.js';
import { $ } from './../globals.js';

/**
 * Alert Class
 * @class
 */
export default class Alert extends BaseComponent {
    /**
     * Close the Alert.
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
