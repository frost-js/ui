import BaseComponent from './../base-component.js';
import { $, window } from './../globals.js';
import { generateId } from './../helpers.js';
import Popper from './../popper/index.js';

/**
 * Tooltip Class
 * @class
 */
export default class Tooltip extends BaseComponent {
    /**
     * New Tooltip constructor.
     * @param {HTMLElement} node The input node.
     * @param {object} [options] The options to create the Tooltip with.
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
     * Attach events for the Tooltip.
     */
    _events() {
        if (this._triggers.includes('hover')) {
            $.addEvent(this._node, 'mouseover.ui.tooltip', (_) => {
                this._stop();
                this.show();
            });

            $.addEvent(this._node, 'mouseout.ui.tooltip', (_) => {
                this._stop();
                this.hide({ force: false });
            });
        }

        if (this._triggers.includes('focus')) {
            $.addEvent(this._node, 'focus.ui.tooltip', (_) => {
                this._stop();
                this.show();
            });

            $.addEvent(this._node, 'blur.ui.tooltip', (_) => {
                this._stop();
                this.hide({ force: false });
            });
        }

        if (this._triggers.includes('click')) {
            $.addEvent(this._node, 'click.ui.tooltip', (e) => {
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
     * Render the Tooltip element.
     */
    _render() {
        this._tooltip = $.parseHTML(this._options.template).shift();
        if (this._options.customClass) {
            $.addClass(this._tooltip, this._options.customClass);
        }
        this._arrow = $.findOne('.tooltip-arrow', this._tooltip);
        this._tooltipInner = $.findOne('.tooltip-inner', this._tooltip);
    }

    /**
     * Update the Tooltip and append to the DOM.
     */
    _show() {
        if (this._options.appendTo) {
            $.append(this._options.appendTo, this._tooltip);
        } else {
            $.after(this._node, this._tooltip);
        }

        if (!this._options.noAttributes) {
            const id = generateId(this.constructor.DATA_KEY);
            $.setAttribute(this._tooltip, { id });
            $.setAttribute(this._node, { 'aria-described-by': id });
        }

        this._popper = new Popper(
            this._tooltip,
            {
                reference: this._node,
                arrow: this._arrow,
                placement: this._options.placement,
                position: this._options.position,
                fixed: this._options.fixed,
                spacing: this._options.spacing,
                minContact: this._options.minContact,
                noAttributes: this._options.noAttributes,
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

        const animating = $.getDataset(this._tooltip, 'uiAnimating');

        if (!animating) {
            return;
        }

        $.stop(this._tooltip, { finish: false });
        $.removeDataset(this._tooltip, 'uiAnimating');

        if (animating === 'out') {
            this._popper.dispose();
            this._popper = null;

            $.removeClass(this._tooltip, 'show');
            $.detach(this._tooltip);
        }
    }

    /**
     * Disable the Tooltip.
     */
    disable() {
        this._enabled = false;
    }

    /**
     * Dispose the Tooltip.
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

        $.remove(this._tooltip);

        if (this._triggers.includes('hover')) {
            $.removeEvent(this._node, 'mouseover.ui.tooltip');
            $.removeEvent(this._node, 'mouseout.ui.tooltip');
        }

        if (this._triggers.includes('focus')) {
            $.removeEvent(this._node, 'focus.ui.tooltip');
            $.removeEvent(this._node, 'blur.ui.tooltip');
        }

        if (this._triggers.includes('click')) {
            $.removeEvent(this._node, 'click.ui.tooltip');
        }

        if (this._modal) {
            $.removeEvent(this._modal, 'hide.ui.modal', this._hideModalEvent);
        }

        this._modal = null;
        this._triggers = null;
        this._tooltip = null;
        this._tooltipInner = null;
        this._arrow = null;
        this._hideModalEvent = null;

        super.dispose();
    }

    /**
     * Enable the Tooltip.
     */
    enable() {
        this._enabled = true;
    }

    /**
     * Hide the Tooltip.
     * @param {object} [options] The hide options.
     * @param {boolean} [options.force=true] Whether to force hiding when disabled.
     */
    hide({ force = true } = {}) {
        if (
            (!force && !this._enabled) ||
            $.getDataset(this._tooltip, 'uiAnimating') ||
            !$.isConnected(this._tooltip) ||
            !$.triggerOne(this._node, 'hide.ui.tooltip')
        ) {
            return;
        }

        $.setDataset(this._tooltip, { uiAnimating: 'out' });

        $.fadeOut(this._tooltip, {
            duration: this._options.duration,
        }).then((_) => {
            this._popper.dispose();
            this._popper = null;

            $.removeClass(this._tooltip, 'show');
            $.detach(this._tooltip);
            $.removeDataset(this._tooltip, 'uiAnimating');
            $.removeAttribute(this._node, 'aria-described-by');
            $.triggerEvent(this._node, 'hidden.ui.tooltip');
        }).catch((_) => {
            if ($.getDataset(this._tooltip, 'uiAnimating') === 'out') {
                $.removeDataset(this._tooltip, 'uiAnimating');
            }
        });
    }

    /**
     * Refresh the Tooltip.
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

        const method = this._options.html ? 'setHTML' : 'setText';

        $[method](
            this._tooltipInner,
            this._options.html && this._options.sanitize ?
                this._options.sanitize(title) :
                title,
        );

        this.update();
    }

    /**
     * Show the Tooltip.
     */
    show() {
        if (
            !this._enabled ||
            $.getDataset(this._tooltip, 'uiAnimating') ||
            $.isConnected(this._tooltip) ||
            !$.triggerOne(this._node, 'show.ui.tooltip')
        ) {
            return;
        }

        $.setDataset(this._tooltip, { uiAnimating: 'in' });
        $.addClass(this._tooltip, 'show');
        this.refresh();
        this._show();

        $.fadeIn(this._tooltip, {
            duration: this._options.duration,
        }).then((_) => {
            $.removeDataset(this._tooltip, 'uiAnimating');
            $.triggerEvent(this._node, 'shown.ui.tooltip');
        }).catch((_) => {
            if ($.getDataset(this._tooltip, 'uiAnimating') === 'in') {
                $.removeDataset(this._tooltip, 'uiAnimating');
            }
        });
    }

    /**
     * Toggle the Tooltip.
     * @param {object} [options] The toggle options.
     * @param {boolean} [options.force=true] Whether to force hiding when disabled.
     */
    toggle({ force = true } = {}) {
        if ($.isConnected(this._tooltip)) {
            this.hide({ force });
        } else {
            this.show();
        }
    }

    /**
     * Update the Tooltip position.
     */
    update() {
        if (this._popper) {
            this._popper.update();
        }
    }
}
