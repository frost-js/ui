import BaseComponent from './../base-component.js';
import { $, window } from './../globals.js';
import { generateId } from './../helpers.js';
import Popper from './../popper/index.js';

/**
 * Popover Class
 * @class
 */
export default class Popover extends BaseComponent {
    #arrow;
    #enabled;
    #hideModalEvent;
    #modal;
    #popover;
    #popoverBody;
    #popoverHeader;
    #popper;
    #triggers;

    /**
     * New Popover constructor.
     * @param {HTMLElement} node The input node.
     * @param {object} [options] The options to create the Popover with.
     */
    constructor(node, options) {
        super(node, options);

        this.#modal = $.closest(this.node, '.modal').shift();

        this.#triggers = this.options.trigger.split(' ');

        this.#render();
        this.#events();

        if (this.options.enable) {
            this.enable();
        }

        this.refresh();
    }

    /**
     * Disable the Popover.
     */
    disable() {
        this.#enabled = false;
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

        if (this.#popper) {
            this.#popper.dispose();
            this.#popper = null;
        }

        $.remove(this.#popover);

        if (this.#triggers.includes('hover')) {
            $.removeEvent(this.node, 'mouseover.ui.popover');
            $.removeEvent(this.node, 'mouseout.ui.popover');
        }

        if (this.#triggers.includes('focus')) {
            $.removeEvent(this.node, 'focus.ui.popover');
            $.removeEvent(this.node, 'blur.ui.popover');
        }

        if (this.#triggers.includes('click')) {
            $.removeEvent(this.node, 'click.ui.popover');
        }

        if (this.#modal) {
            $.removeEvent(this.#modal, 'hide.ui.modal', this.#hideModalEvent);
        }

        this.#modal = null;
        this.#triggers = null;
        this.#popover = null;
        this.#popoverHeader = null;
        this.#popoverBody = null;
        this.#arrow = null;
        this.#hideModalEvent = null;

        super.dispose();
    }

    /**
     * Enable the Popover.
     */
    enable() {
        this.#enabled = true;
    }

    /**
     * Hide the Popover.
     * @param {object} [options] The hide options.
     * @param {boolean} [options.force=true] Whether to force hiding when disabled.
     */
    hide({ force = true } = {}) {
        if (
            (!force && !this.#enabled) ||
            $.getDataset(this.#popover, 'uiAnimating') ||
            !$.isConnected(this.#popover) ||
            !$.triggerOne(this.node, 'hide.ui.popover')
        ) {
            return;
        }

        $.setDataset(this.#popover, { uiAnimating: 'out' });

        $.fadeOut(this.#popover, {
            duration: this.options.duration,
        }).then((_) => {
            this.#popper.dispose();
            this.#popper = null;

            $.detach(this.#popover);
            $.removeDataset(this.#popover, 'uiAnimating');
            $.removeAttribute(this.node, 'aria-described-by');
            $.triggerEvent(this.node, 'hidden.ui.popover');
        }).catch((_) => {
            if ($.getDataset(this.#popover, 'uiAnimating') === 'out') {
                $.removeDataset(this.#popover, 'uiAnimating');
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
            this.#popoverHeader,
            this.options.html && this.options.sanitize ?
                this.options.sanitize(title) :
                title,
        );

        if (!title) {
            $.hide(this.#popoverHeader);
        } else {
            $.show(this.#popoverHeader);
        }

        $[method](
            this.#popoverBody,
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
            !this.#enabled ||
            $.getDataset(this.#popover, 'uiAnimating') ||
            $.isConnected(this.#popover) ||
            !$.triggerOne(this.node, 'show.ui.popover')
        ) {
            return;
        }

        $.setDataset(this.#popover, { uiAnimating: 'in' });
        this.refresh();
        this.#show();

        $.fadeIn(this.#popover, {
            duration: this.options.duration,
        }).then((_) => {
            $.removeDataset(this.#popover, 'uiAnimating');
            $.triggerEvent(this.node, 'shown.ui.popover');
        }).catch((_) => {
            if ($.getDataset(this.#popover, 'uiAnimating') === 'in') {
                $.removeDataset(this.#popover, 'uiAnimating');
            }
        });
    }

    /**
     * Toggle the Popover.
     * @param {object} [options] The toggle options.
     * @param {boolean} [options.force=true] Whether to force hiding when disabled.
     */
    toggle({ force = true } = {}) {
        if ($.isConnected(this.#popover)) {
            this.hide({ force });
        } else {
            this.show();
        }
    }

    /**
     * Update the Popover position.
     */
    update() {
        if (this.#popper) {
            this.#popper.update();
        }
    }

    /**
     * Attach events for the Popover.
     */
    #events() {
        if (this.#triggers.includes('hover')) {
            $.addEvent(this.node, 'mouseover.ui.popover', (_) => {
                this.#stop();
                this.show();
            });

            $.addEvent(this.node, 'mouseout.ui.popover', (_) => {
                this.#stop();
                this.hide({ force: false });
            });
        }

        if (this.#triggers.includes('focus')) {
            $.addEvent(this.node, 'focus.ui.popover', (_) => {
                this.#stop();
                this.show();
            });

            $.addEvent(this.node, 'blur.ui.popover', (_) => {
                this.#stop();
                this.hide({ force: false });
            });
        }

        if (this.#triggers.includes('click')) {
            $.addEvent(this.node, 'click.ui.popover', (e) => {
                e.preventDefault();

                this.#stop();
                this.toggle({ force: false });
            });
        }

        if (this.#modal) {
            this.#hideModalEvent = (_) => {
                this.#stop();
                this.hide();
            };
            $.addEvent(this.#modal, 'hide.ui.modal', this.#hideModalEvent);
        }
    }

    /**
     * Render the Popover element.
     */
    #render() {
        this.#popover = $.parseHTML(this.options.template).shift();
        if (this.options.customClass) {
            $.addClass(this.#popover, this.options.customClass);
        }
        this.#arrow = $.findOne('.popover-arrow', this.#popover);
        this.#popoverHeader = $.findOne('.popover-header', this.#popover);
        this.#popoverBody = $.findOne('.popover-body', this.#popover);
    }

    /**
     * Update the Popover and append to the DOM.
     */
    #show() {
        if (this.options.appendTo) {
            $.append(this.options.appendTo, this.#popover);
        } else {
            $.after(this.node, this.#popover);
        }

        if (!this.options.noAttributes) {
            const id = generateId(this.constructor.DATA_KEY);
            $.setAttribute(this.#popover, { id });
            $.setAttribute(this.node, { 'aria-described-by': id });
        }

        this.#popper = new Popper(
            this.#popover,
            {
                reference: this.node,
                arrow: this.#arrow,
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
    #stop() {
        if (!this.#enabled) {
            return;
        }

        const animating = $.getDataset(this.#popover, 'uiAnimating');

        if (!animating) {
            return;
        }

        $.stop(this.#popover, { finish: false });
        $.removeDataset(this.#popover, 'uiAnimating');

        if (animating === 'out') {
            this.#popper.dispose();
            this.#popper = null;

            $.detach(this.#popover);
        }
    }
}
