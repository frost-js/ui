import BaseComponent from './../base-component.js';
import { $ } from './../globals.js';

/**
 * Toast Class
 * @class
 */
export default class Toast extends BaseComponent {
    /**
     * Dispose the Toast.
     */
    dispose() {
        clearTimeout(this._timer);
        this._timer = null;

        super.dispose();
    }

    /**
     * Hide the Toast.
     */
    hide() {
        if (
            $.getDataset(this.node, 'uiAnimating') ||
            !$.isVisible(this.node) ||
            !$.triggerOne(this.node, 'hide.ui.toast')
        ) {
            return;
        }

        clearTimeout(this._timer);
        this._timer = null;

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
     * Show the Toast.
     */
    show() {
        if (
            $.getDataset(this.node, 'uiAnimating') ||
            $.isVisible(this.node) ||
            !$.triggerOne(this.node, 'show.ui.toast')
        ) {
            return;
        }

        clearTimeout(this._timer);
        this._timer = null;

        $.setDataset(this.node, { uiAnimating: 'in' });
        $.setStyle(this.node, { display: '' });
        $.addClass(this.node, 'show');

        $.fadeIn(this.node, {
            duration: this.options.duration,
        }).then((_) => {
            $.removeDataset(this.node, 'uiAnimating');
            $.triggerEvent(this.node, 'shown.ui.toast');

            if (this.options.autohide) {
                this._timer = setTimeout(
                    (_) => {
                        this._timer = null;
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
