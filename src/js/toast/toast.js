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
            $.getDataset(this._node, 'uiAnimating') ||
            !$.isVisible(this._node) ||
            !$.triggerOne(this._node, 'hide.ui.toast')
        ) {
            return;
        }

        clearTimeout(this._timer);
        this._timer = null;

        $.setDataset(this._node, { uiAnimating: 'out' });

        $.fadeOut(this._node, {
            duration: this._options.duration,
        }).then((_) => {
            $.setStyle(this._node, { display: 'none' }, null, { important: true });
            $.removeClass(this._node, 'show');
            $.removeDataset(this._node, 'uiAnimating');
            $.triggerEvent(this._node, 'hidden.ui.toast');
        }).catch((_) => {
            if ($.getDataset(this._node, 'uiAnimating') === 'out') {
                $.removeDataset(this._node, 'uiAnimating');
            }
        });
    }

    /**
     * Show the Toast.
     */
    show() {
        if (
            $.getDataset(this._node, 'uiAnimating') ||
            $.isVisible(this._node) ||
            !$.triggerOne(this._node, 'show.ui.toast')
        ) {
            return;
        }

        clearTimeout(this._timer);
        this._timer = null;

        $.setDataset(this._node, { uiAnimating: 'in' });
        $.setStyle(this._node, { display: '' });
        $.addClass(this._node, 'show');

        $.fadeIn(this._node, {
            duration: this._options.duration,
        }).then((_) => {
            $.removeDataset(this._node, 'uiAnimating');
            $.triggerEvent(this._node, 'shown.ui.toast');

            if (this._options.autohide) {
                this._timer = setTimeout(
                    (_) => {
                        this._timer = null;
                        this.hide();
                    },
                    this._options.delay,
                );
            }
        }).catch((_) => {
            if ($.getDataset(this._node, 'uiAnimating') === 'in') {
                $.removeDataset(this._node, 'uiAnimating');
            }
        });
    }
}
