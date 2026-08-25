import BaseComponent from './../base-component.js';
import { $, window } from './../globals.js';
import { generateId } from './../helpers/component.js';
import { waitForTransition } from './../helpers/transition.js';
import Popper from './../popper/index.js';

/** @typedef {import('../popper/popper.js').Placement} Placement */
/** @typedef {import('../popper/popper.js').Position} Position */

/**
 * @typedef {object} PopoverOptions
 * @property {string} [template] The popover markup template.
 * @property {string|null} [customClass=null] An additional class for the popover.
 * @property {boolean} [animation=true] Whether to animate the popover.
 * @property {boolean} [enable=true] Whether the popover starts enabled.
 * @property {boolean} [html=false] Whether title and content may contain HTML.
 * @property {string|HTMLElement|null} [appendTo=null] The popover container.
 * @property {false|((input: string) => string)} [sanitize] The HTML sanitizer, or `false` to disable sanitization.
 * @property {string} [trigger='click'] The space-separated interaction triggers.
 * @property {Placement} [placement='auto'] The preferred popover placement.
 * @property {Position} [position='center'] The popover alignment.
 * @property {boolean} [fixed=false] Whether to preserve the preferred placement.
 * @property {number} [spacing=3] The spacing from the reference element.
 * @property {number|false} [minContact=false] The minimum contact with the reference element.
 * @property {boolean} [noAttributes=false] Whether to omit placement and accessibility attributes.
 * @property {string} [title] The popover title.
 * @property {string} [content] The popover body content.
 */

/**
 * Controls a popover anchored to a reference element.
 * @extends {BaseComponent<PopoverOptions>}
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
    #transition;
    #triggers;

    /**
     * Creates a Popover.
     * @param {HTMLElement} node The input node.
     * @param {PopoverOptions} [options] The popover options.
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
     * Disables interaction-triggered popover changes.
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
     * Enables interaction-triggered popover changes.
     */
    enable() {
        this.#enabled = true;
    }

    /**
     * Hides the popover.
     * @param {{force?: boolean}} [options] The hide options. Force defaults to `true`.
     */
    hide({ force = true } = {}) {
        if (
            (!force && !this.#enabled) ||
            this.#transition?.direction === 'out' ||
            !$.isConnected(this.#popover) ||
            !$.triggerOne(this.node, 'hide.ui.popover')
        ) {
            return;
        }

        // Reversing direction replaces this token and skips stale completion.
        const transition = { direction: 'out' };
        this.#transition = transition;

        $.removeClass(this.#popover, 'show');

        const toggleNode = this.node;

        waitForTransition(this.#popover, ['opacity']).then(({ node }) => {
            if (this.#transition !== transition) {
                return;
            }

            if (this.#popper) {
                this.#popper.dispose();
                this.#popper = null;
            }

            $.detach(node);
            $.removeAttribute(toggleNode, 'aria-describedby');
            $.triggerEvent(toggleNode, 'hidden.ui.popover');
        }).finally((_) => {
            if (this.#transition === transition) {
                this.#transition = null;
            }
        });
    }

    /**
     * Refreshes the popover title and body content.
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
     * Shows the popover.
     */
    show() {
        const connected = $.isConnected(this.#popover);

        if (
            !this.#enabled ||
            (connected && this.#transition?.direction !== 'out') ||
            !$.triggerOne(this.node, 'show.ui.popover')
        ) {
            return;
        }

        this.refresh();
        if (!connected) {
            this.#show();

            // Commit the rendered hidden state before starting the transition.
            $.css(this.#popover, 'opacity');
        }

        // Reversing direction replaces this token and skips stale completion.
        const transition = { direction: 'in' };
        this.#transition = transition;

        $.addClass(this.#popover, 'show');

        const toggleNode = this.node;

        waitForTransition(this.#popover, ['opacity']).then((_) => {
            if (this.#transition !== transition) {
                return;
            }

            $.triggerEvent(toggleNode, 'shown.ui.popover');
        }).finally((_) => {
            if (this.#transition === transition) {
                this.#transition = null;
            }
        });
    }

    /**
     * Toggles the popover.
     * @param {{force?: boolean}} [options] The toggle options. Force defaults to `true`.
     */
    toggle({ force = true } = {}) {
        if (
            $.isConnected(this.#popover) &&
            this.#transition?.direction !== 'out'
        ) {
            this.hide({ force });
        } else {
            this.show();
        }
    }

    /**
     * Updates the popover position.
     */
    update() {
        if (this.#popper) {
            this.#popper.update();
        }
    }

    /**
     * Attaches popover interaction handlers.
     */
    #events() {
        if (this.#triggers.includes('hover')) {
            $.addEvent(this.node, 'mouseover.ui.popover', (_) => {
                this.show();
            });

            $.addEvent(this.node, 'mouseout.ui.popover', (_) => {
                this.hide({ force: false });
            });
        }

        if (this.#triggers.includes('focus')) {
            $.addEvent(this.node, 'focus.ui.popover', (_) => {
                this.show();
            });

            $.addEvent(this.node, 'blur.ui.popover', (_) => {
                this.hide({ force: false });
            });
        }

        if (this.#triggers.includes('click')) {
            $.addEvent(this.node, 'click.ui.popover', (e) => {
                e.preventDefault();

                this.toggle({ force: false });
            });
        }

        if (this.#modal) {
            this.#hideModalEvent = (_) => {
                this.hide();
            };
            $.addEvent(this.#modal, 'hide.ui.modal', this.#hideModalEvent);
        }
    }

    /**
     * Creates the popover element from its template.
     */
    #render() {
        this.#popover = $.parseHTML(this.options.template).shift();
        if (this.options.animation) {
            $.addClass(this.#popover, 'fade');
        }
        if (this.options.customClass) {
            $.addClass(this.#popover, this.options.customClass);
        }
        this.#arrow = $.findOne('.popover-arrow', this.#popover);
        this.#popoverHeader = $.findOne('.popover-header', this.#popover);
        this.#popoverBody = $.findOne('.popover-body', this.#popover);
    }

    /**
     * Appends and positions the popover element.
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
            $.setAttribute(this.node, { 'aria-describedby': id });
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
}
