import BaseComponent from './../base-component.js';
import { $, window } from './../globals.js';
import { generateId } from './../helpers.js';
import Popper from './../popper/index.js';

/**
 * Tooltip Class
 * @class
 */
export default class Tooltip extends BaseComponent {
    #arrow;
    #enabled;
    #hideModalEvent;
    #modal;
    #popper;
    #tooltip;
    #tooltipInner;
    #triggers;

    /**
     * New Tooltip constructor.
     * @param {HTMLElement} node The input node.
     * @param {object} [options] The options to create the Tooltip with.
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
     * Disable the Tooltip.
     */
    disable() {
        this.#enabled = false;
    }

    /**
     * Dispose the Tooltip.
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

        $.remove(this.#tooltip);

        if (this.#triggers.includes('hover')) {
            $.removeEvent(this.node, 'mouseover.ui.tooltip');
            $.removeEvent(this.node, 'mouseout.ui.tooltip');
        }

        if (this.#triggers.includes('focus')) {
            $.removeEvent(this.node, 'focus.ui.tooltip');
            $.removeEvent(this.node, 'blur.ui.tooltip');
        }

        if (this.#triggers.includes('click')) {
            $.removeEvent(this.node, 'click.ui.tooltip');
        }

        if (this.#modal) {
            $.removeEvent(this.#modal, 'hide.ui.modal', this.#hideModalEvent);
        }

        this.#modal = null;
        this.#triggers = null;
        this.#tooltip = null;
        this.#tooltipInner = null;
        this.#arrow = null;
        this.#hideModalEvent = null;

        super.dispose();
    }

    /**
     * Enable the Tooltip.
     */
    enable() {
        this.#enabled = true;
    }

    /**
     * Hide the Tooltip.
     * @param {object} [options] The hide options.
     * @param {boolean} [options.force=true] Whether to force hiding when disabled.
     */
    hide({ force = true } = {}) {
        if (
            (!force && !this.#enabled) ||
            $.getDataset(this.#tooltip, 'uiAnimating') ||
            !$.isConnected(this.#tooltip) ||
            !$.triggerOne(this.node, 'hide.ui.tooltip')
        ) {
            return;
        }

        $.setDataset(this.#tooltip, { uiAnimating: 'out' });

        $.fadeOut(this.#tooltip, {
            duration: this.options.duration,
        }).then((_) => {
            this.#popper.dispose();
            this.#popper = null;

            $.removeClass(this.#tooltip, 'show');
            $.detach(this.#tooltip);
            $.removeDataset(this.#tooltip, 'uiAnimating');
            $.removeAttribute(this.node, 'aria-described-by');
            $.triggerEvent(this.node, 'hidden.ui.tooltip');
        }).catch((_) => {
            if ($.getDataset(this.#tooltip, 'uiAnimating') === 'out') {
                $.removeDataset(this.#tooltip, 'uiAnimating');
            }
        });
    }

    /**
     * Refresh the Tooltip.
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

        const method = this.options.html ? 'setHTML' : 'setText';

        $[method](
            this.#tooltipInner,
            this.options.html && this.options.sanitize ?
                this.options.sanitize(title) :
                title,
        );

        this.update();
    }

    /**
     * Show the Tooltip.
     */
    show() {
        if (
            !this.#enabled ||
            $.getDataset(this.#tooltip, 'uiAnimating') ||
            $.isConnected(this.#tooltip) ||
            !$.triggerOne(this.node, 'show.ui.tooltip')
        ) {
            return;
        }

        $.setDataset(this.#tooltip, { uiAnimating: 'in' });
        $.addClass(this.#tooltip, 'show');
        this.refresh();
        this.#show();

        $.fadeIn(this.#tooltip, {
            duration: this.options.duration,
        }).then((_) => {
            $.removeDataset(this.#tooltip, 'uiAnimating');
            $.triggerEvent(this.node, 'shown.ui.tooltip');
        }).catch((_) => {
            if ($.getDataset(this.#tooltip, 'uiAnimating') === 'in') {
                $.removeDataset(this.#tooltip, 'uiAnimating');
            }
        });
    }

    /**
     * Toggle the Tooltip.
     * @param {object} [options] The toggle options.
     * @param {boolean} [options.force=true] Whether to force hiding when disabled.
     */
    toggle({ force = true } = {}) {
        if ($.isConnected(this.#tooltip)) {
            this.hide({ force });
        } else {
            this.show();
        }
    }

    /**
     * Update the Tooltip position.
     */
    update() {
        if (this.#popper) {
            this.#popper.update();
        }
    }

    /**
     * Attach events for the Tooltip.
     */
    #events() {
        if (this.#triggers.includes('hover')) {
            $.addEvent(this.node, 'mouseover.ui.tooltip', (_) => {
                this.#stop();
                this.show();
            });

            $.addEvent(this.node, 'mouseout.ui.tooltip', (_) => {
                this.#stop();
                this.hide({ force: false });
            });
        }

        if (this.#triggers.includes('focus')) {
            $.addEvent(this.node, 'focus.ui.tooltip', (_) => {
                this.#stop();
                this.show();
            });

            $.addEvent(this.node, 'blur.ui.tooltip', (_) => {
                this.#stop();
                this.hide({ force: false });
            });
        }

        if (this.#triggers.includes('click')) {
            $.addEvent(this.node, 'click.ui.tooltip', (e) => {
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
     * Render the Tooltip element.
     */
    #render() {
        this.#tooltip = $.parseHTML(this.options.template).shift();
        if (this.options.customClass) {
            $.addClass(this.#tooltip, this.options.customClass);
        }
        this.#arrow = $.findOne('.tooltip-arrow', this.#tooltip);
        this.#tooltipInner = $.findOne('.tooltip-inner', this.#tooltip);
    }

    /**
     * Update the Tooltip and append to the DOM.
     */
    #show() {
        if (this.options.appendTo) {
            $.append(this.options.appendTo, this.#tooltip);
        } else {
            $.after(this.node, this.#tooltip);
        }

        if (!this.options.noAttributes) {
            const id = generateId(this.constructor.DATA_KEY);
            $.setAttribute(this.#tooltip, { id });
            $.setAttribute(this.node, { 'aria-described-by': id });
        }

        this.#popper = new Popper(
            this.#tooltip,
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

        const animating = $.getDataset(this.#tooltip, 'uiAnimating');

        if (!animating) {
            return;
        }

        $.stop(this.#tooltip, { finish: false });
        $.removeDataset(this.#tooltip, 'uiAnimating');

        if (animating === 'out') {
            this.#popper.dispose();
            this.#popper = null;

            $.removeClass(this.#tooltip, 'show');
            $.detach(this.#tooltip);
        }
    }
}
