import BaseComponent from './../base-component.js';
import { $, window } from './../globals.js';
import { generateId } from './../helpers/component.js';
import Popper from './../popper/index.js';

/** @typedef {import('../popper/popper.js').Placement} Placement */
/** @typedef {import('../popper/popper.js').Position} Position */

/**
 * @typedef {object} TooltipOptions
 * @property {string} [template] The tooltip markup template.
 * @property {string|null} [customClass=null] An additional class for the tooltip.
 * @property {number} [duration=100] The transition duration in milliseconds.
 * @property {boolean} [enable=true] Whether the tooltip starts enabled.
 * @property {boolean} [html=false] Whether the title may contain HTML.
 * @property {string} [trigger='hover focus'] The space-separated interaction triggers.
 * @property {string|HTMLElement|null} [appendTo=null] The tooltip container.
 * @property {false|((input: string) => string)} [sanitize] The HTML sanitizer, or `false` to disable sanitization.
 * @property {Placement} [placement='auto'] The preferred tooltip placement.
 * @property {Position} [position='center'] The tooltip alignment.
 * @property {boolean} [fixed=false] Whether to preserve the preferred placement.
 * @property {number} [spacing=2] The spacing from the reference element.
 * @property {number|false} [minContact=false] The minimum contact with the reference element.
 * @property {boolean} [noAttributes=false] Whether to omit placement and accessibility attributes.
 * @property {string} [title] The tooltip title.
 */

/**
 * Controls a tooltip anchored to a reference element.
 * @extends {BaseComponent<TooltipOptions>}
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
     * Creates a Tooltip.
     * @param {HTMLElement} node The input node.
     * @param {TooltipOptions} [options] The tooltip options.
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
     * Disables interaction-triggered tooltip changes.
     */
    disable() {
        this.#enabled = false;
    }

    /** @inheritdoc */
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
     * Enables interaction-triggered tooltip changes.
     */
    enable() {
        this.#enabled = true;
    }

    /**
     * Hides the tooltip.
     * @param {{force?: boolean}} [options] The hide options. Force defaults to `true`.
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
     * Refreshes the tooltip title.
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
     * Shows the tooltip.
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
     * Toggles the tooltip.
     * @param {{force?: boolean}} [options] The toggle options. Force defaults to `true`.
     */
    toggle({ force = true } = {}) {
        if ($.isConnected(this.#tooltip)) {
            this.hide({ force });
        } else {
            this.show();
        }
    }

    /**
     * Updates the tooltip position.
     */
    update() {
        if (this.#popper) {
            this.#popper.update();
        }
    }

    /**
     * Attaches tooltip interaction handlers.
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
     * Creates the tooltip element from its template.
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
     * Appends and positions the tooltip element.
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
     * Stops the active tooltip transition.
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
