import { $ } from './../../globals.js';

/**
 * Attach events for the Tooltip.
 */
export function _events() {
    if (this._triggers.includes('hover')) {
        $.addEvent(this._node, 'mouseover.ui.tooltip', (_) => {
            this._stop();
            this.show();
        });

        $.addEvent(this._node, 'mouseout.ui.tooltip', (_) => {
            this._stop();
            this.hide();
        });
    }

    if (this._triggers.includes('focus')) {
        $.addEvent(this._node, 'focus.ui.tooltip', (_) => {
            this._stop();
            this.show();
        });

        $.addEvent(this._node, 'blur.ui.tooltip', (_) => {
            this._stop();
            this.hide();
        });
    }

    if (this._triggers.includes('click')) {
        $.addEvent(this._node, 'click.ui.tooltip', (e) => {
            e.preventDefault();

            this._stop();
            this.toggle();
        });
    }

    if (this._modal) {
        this._hideModalEvent = (_) => {
            this._stop();
            this.hide();
        };
        $.addEvent(this._modal, 'hide.ui.modal', this._hideModalEvent);
    }
};
