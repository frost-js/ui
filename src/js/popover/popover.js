import BaseComponent from './../base-component.js';
import { $, window } from './../globals.js';
import { generateId } from './../helpers.js';
import Popper from './../popper/index.js';

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

        this._modal = $.closest(this.node, '.modal').shift();

        this._triggers = this.options.trigger.split(' ');

        this._render();
        this._events();

        if (this.options.enable) {
            this.enable();
        }

        this.refresh();
    }

    /**
     * Attach events for the Popover.
     */
    _events() {
        if (this._triggers.includes('hover')) {
            $.addEvent(this.node, 'mouseover.ui.popover', (_) => {
                this._stop();
                this.show();
            });

            $.addEvent(this.node, 'mouseout.ui.popover', (_) => {
                this._stop();
                this.hide({ force: false });
            });
        }

        if (this._triggers.includes('focus')) {
            $.addEvent(this.node, 'focus.ui.popover', (_) => {
                this._stop();
                this.show();
            });

            $.addEvent(this.node, 'blur.ui.popover', (_) => {
                this._stop();
                this.hide({ force: false });
            });
        }

        if (this._triggers.includes('click')) {
            $.addEvent(this.node, 'click.ui.popover', (e) => {
                e.preventDefault();

                this._stop();
                this.toggle({ force: false });
            });
        }

        if (this._modal) {
            this._hideModalEvent = (_) => {
                this._stop();
                this.hide();
            };
            $.addEvent(this._modal, 'hide.ui.modal', this._hideModalEvent);
        }
    }

    /**
     * Render the Popover element.
     */
    _render() {
        this._popover = $.parseHTML(this.options.template).shift();
        if (this.options.customClass) {
            $.addClass(this._popover, this.options.customClass);
        }
        this._arrow = $.findOne('.popover-arrow', this._popover);
        this._popoverHeader = $.findOne('.popover-header', this._popover);
        this._popoverBody = $.findOne('.popover-body', this._popover);
    }

    /**
     * Update the Popover and append to the DOM.
     */
    _show() {
        if (this.options.appendTo) {
            $.append(this.options.appendTo, this._popover);
        } else {
            $.after(this.node, this._popover);
        }

        if (!this.options.noAttributes) {
            const id = generateId(this.constructor.DATA_KEY);
            $.setAttribute(this._popover, { id });
            $.setAttribute(this.node, { 'aria-described-by': id });
        }

        this._popper = new Popper(
            this._popover,
            {
                reference: this.node,
                arrow: this._arrow,
                placement: this.options.placement,
                position: this.options.position,
                fixed: this.options.fixed,
                spacing: this.options.spacing,
                minContact: this.options.minContact,
                noAttributes: this.options.noAttributes,
            },
        );

        window.requestAnimationFrame((_) => {
            this.update();
        });
    }

    /**
     * Stop the animations.
     */
    _stop() {
        if (!this._enabled) {
            return;
        }

        const animating = $.getDataset(this._popover, 'uiAnimating');

        if (!animating) {
            return;
        }

        $.stop(this._popover, { finish: false });
        $.removeDataset(this._popover, 'uiAnimating');

        if (animating === 'out') {
            this._popper.dispose();
            this._popper = null;

            $.detach(this._popover);
        }
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
        if ($.hasDataset(this.node, 'uiOriginalTitle')) {
            const title = $.getDataset(this.node, 'uiOriginalTitle');
            $.setAttribute(this.node, { title });
            $.removeDataset(this.node, 'uiOriginalTitle');
        }

        if (this._popper) {
            this._popper.dispose();
            this._popper = null;
        }

        $.remove(this._popover);

        if (this._triggers.includes('hover')) {
            $.removeEvent(this.node, 'mouseover.ui.popover');
            $.removeEvent(this.node, 'mouseout.ui.popover');
        }

        if (this._triggers.includes('focus')) {
            $.removeEvent(this.node, 'focus.ui.popover');
            $.removeEvent(this.node, 'blur.ui.popover');
        }

        if (this._triggers.includes('click')) {
            $.removeEvent(this.node, 'click.ui.popover');
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
     * @param {object} [options] The hide options.
     * @param {boolean} [options.force=true] Whether to force hiding when disabled.
     */
    hide({ force = true } = {}) {
        if (
            (!force && !this._enabled) ||
            $.getDataset(this._popover, 'uiAnimating') ||
            !$.isConnected(this._popover) ||
            !$.triggerOne(this.node, 'hide.ui.popover')
        ) {
            return;
        }

        $.setDataset(this._popover, { uiAnimating: 'out' });

        $.fadeOut(this._popover, {
            duration: this.options.duration,
        }).then((_) => {
            this._popper.dispose();
            this._popper = null;

            $.detach(this._popover);
            $.removeDataset(this._popover, 'uiAnimating');
            $.removeAttribute(this.node, 'aria-described-by');
            $.triggerEvent(this.node, 'hidden.ui.popover');
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
        if ($.hasAttribute(this.node, 'title')) {
            const originalTitle = $.getAttribute(this.node, 'title');
            $.setDataset(this.node, { uiOriginalTitle: originalTitle });
            $.removeAttribute(this.node, 'title');
        }

        let title = '';
        if ($.hasDataset(this.node, 'uiTitle')) {
            title = $.getDataset(this.node, 'uiTitle');
        } else if (this.options.title) {
            title = this.options.title;
        } else if ($.hasDataset(this.node, 'uiOriginalTitle')) {
            title = $.getDataset(this.node, 'uiOriginalTitle', title);
        }

        let content = '';
        if ($.hasDataset(this.node, 'uiContent')) {
            content = $.getDataset(this.node, 'uiContent');
        } else if (this.options.content) {
            content = this.options.content;
        }

        const method = this.options.html ? 'setHTML' : 'setText';

        $[method](
            this._popoverHeader,
            this.options.html && this.options.sanitize ?
                this.options.sanitize(title) :
                title,
        );

        if (!title) {
            $.hide(this._popoverHeader);
        } else {
            $.show(this._popoverHeader);
        }

        $[method](
            this._popoverBody,
            this.options.html && this.options.sanitize ?
                this.options.sanitize(content) :
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
            !$.triggerOne(this.node, 'show.ui.popover')
        ) {
            return;
        }

        $.setDataset(this._popover, { uiAnimating: 'in' });
        this.refresh();
        this._show();

        $.fadeIn(this._popover, {
            duration: this.options.duration,
        }).then((_) => {
            $.removeDataset(this._popover, 'uiAnimating');
            $.triggerEvent(this.node, 'shown.ui.popover');
        }).catch((_) => {
            if ($.getDataset(this._popover, 'uiAnimating') === 'in') {
                $.removeDataset(this._popover, 'uiAnimating');
            }
        });
    }

    /**
     * Toggle the Popover.
     * @param {object} [options] The toggle options.
     * @param {boolean} [options.force=true] Whether to force hiding when disabled.
     */
    toggle({ force = true } = {}) {
        if ($.isConnected(this._popover)) {
            this.hide({ force });
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
