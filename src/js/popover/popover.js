import BaseComponent from './../base-component.js';
import { $ } from './../globals.js';

/**
 * Popover Class
 * @class
 */
export default class Popover extends BaseComponent {
    /**
     * New Popover constructor.
     * @param {HTMLElement} node The input node.
     * @param {object} [options] The options to create the Popover with.
     */
    constructor(node, options) {
        super(node, options);

        this._modal = $.closest(this._node, '.modal').shift();

        this._triggers = this._options.trigger.split(' ');

        this._render();
        this._events();

        if (this._options.enable) {
            this.enable();
        }

        this.refresh();
    }

    /**
     * Disable the Popover.
     */
    disable() {
        this._enabled = false;
    }

    /**
     * Dispose the Popover.
     */
    dispose() {
        if ($.hasDataset(this._node, 'uiOriginalTitle')) {
            const title = $.getDataset(this._node, 'uiOriginalTitle');
            $.setAttribute(this._node, { title });
            $.removeDataset(this._node, 'uiOriginalTitle');
        }

        if (this._popper) {
            this._popper.dispose();
            this._popper = null;
        }

        $.remove(this._popover);

        if (this._triggers.includes('hover')) {
            $.removeEvent(this._node, 'mouseover.ui.popover');
            $.removeEvent(this._node, 'mouseout.ui.popover');
        }

        if (this._triggers.includes('focus')) {
            $.removeEvent(this._node, 'focus.ui.popover');
            $.removeEvent(this._node, 'blur.ui.popover');
        }

        if (this._triggers.includes('click')) {
            $.removeEvent(this._node, 'click.ui.popover');
        }

        if (this._modal) {
            $.removeEvent(this._modal, 'hide.ui.modal', this._hideModalEvent);
        }

        this._modal = null;
        this._triggers = null;
        this._popover = null;
        this._popoverHeader = null;
        this._popoverBody = null;
        this._arrow = null;
        this._hideModalEvent = null;

        super.dispose();
    }

    /**
     * Enable the Popover.
     */
    enable() {
        this._enabled = true;
    }

    /**
     * Hide the Popover.
     */
    hide() {
        if (
            !this._enabled ||
            $.getDataset(this._popover, 'uiAnimating') ||
            !$.isConnected(this._popover) ||
            !$.triggerOne(this._node, 'hide.ui.popover')
        ) {
            return;
        }

        $.setDataset(this._popover, { uiAnimating: 'out' });

        $.fadeOut(this._popover, {
            duration: this._options.duration,
        }).then((_) => {
            this._popper.dispose();
            this._popper = null;

            $.detach(this._popover);
            $.removeDataset(this._popover, 'uiAnimating');
            $.removeAttribute(this._node, 'aria-described-by');
            $.triggerEvent(this._node, 'hidden.ui.popover');
        }).catch((_) => {
            if ($.getDataset(this._popover, 'uiAnimating') === 'out') {
                $.removeDataset(this._popover, 'uiAnimating');
            }
        });
    }

    /**
     * Refresh the Popover.
     */
    refresh() {
        if ($.hasAttribute(this._node, 'title')) {
            const originalTitle = $.getAttribute(this._node, 'title');
            $.setDataset(this._node, { uiOriginalTitle: originalTitle });
            $.removeAttribute(this._node, 'title');
        }

        let title = '';
        if ($.hasDataset(this._node, 'uiTitle')) {
            title = $.getDataset(this._node, 'uiTitle');
        } else if (this._options.title) {
            title = this._options.title;
        } else if ($.hasDataset(this._node, 'uiOriginalTitle')) {
            title = $.getDataset(this._node, 'uiOriginalTitle', title);
        }

        let content = '';
        if ($.hasDataset(this._node, 'uiContent')) {
            content = $.getDataset(this._node, 'uiContent');
        } else if (this._options.content) {
            content = this._options.content;
        }

        const method = this._options.html ? 'setHTML' : 'setText';

        $[method](
            this._popoverHeader,
            this._options.html && this._options.sanitize ?
                this._options.sanitize(title) :
                title,
        );

        if (!title) {
            $.hide(this._popoverHeader);
        } else {
            $.show(this._popoverHeader);
        }

        $[method](
            this._popoverBody,
            this._options.html && this._options.sanitize ?
                this._options.sanitize(content) :
                content,
        );
    }

    /**
     * Show the Popover.
     */
    show() {
        if (
            !this._enabled ||
            $.getDataset(this._popover, 'uiAnimating') ||
            $.isConnected(this._popover) ||
            !$.triggerOne(this._node, 'show.ui.popover')
        ) {
            return;
        }

        $.setDataset(this._popover, { uiAnimating: 'in' });
        this.refresh();
        this._show();

        $.fadeIn(this._popover, {
            duration: this._options.duration,
        }).then((_) => {
            $.removeDataset(this._popover, 'uiAnimating');
            $.triggerEvent(this._node, 'shown.ui.popover');
        }).catch((_) => {
            if ($.getDataset(this._popover, 'uiAnimating') === 'in') {
                $.removeDataset(this._popover, 'uiAnimating');
            }
        });
    }

    /**
     * Toggle the Popover.
     */
    toggle() {
        if ($.isConnected(this._popover)) {
            this.hide();
        } else {
            this.show();
        }
    }

    /**
     * Update the Popover position.
     */
    update() {
        if (this._popper) {
            this._popper.update();
        }
    }
}
