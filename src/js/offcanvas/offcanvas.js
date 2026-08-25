import BaseComponent from './../base-component.js';
import FocusTrap from './../focus-trap/index.js';
import { $, document } from './../globals.js';
import { addScrollPadding, resetScrollPadding } from './../helpers/scroll.js';
import { waitForTransition } from './../helpers/transition.js';

/**
 * @typedef {object} OffcanvasOptions
 * @property {boolean|'static'} [backdrop=true] Whether to show a dismissible or static backdrop.
 * @property {boolean} [keyboard=true] Whether Escape hides the offcanvas element.
 * @property {boolean} [scroll=false] Whether body scrolling remains enabled while shown.
 */

/**
 * Controls an offcanvas panel and its backdrop.
 * @extends {BaseComponent<OffcanvasOptions>}
 */
export default class Offcanvas extends BaseComponent {
    #activeTarget;
    #focusTrap;
    #scrollNodes;
    #transitioning;

    /**
     * Creates an Offcanvas.
     * @param {HTMLElement} node The input node.
     * @param {OffcanvasOptions} [options] The offcanvas options.
     */
    constructor(node, options) {
        super(node, options);

        if (!this.options.scroll || this.options.backdrop) {
            this.#focusTrap = FocusTrap.init(this.node);
        }
    }

    /** @inheritdoc */
    dispose() {
        if (this.#focusTrap) {
            this.#focusTrap.dispose();
            this.#focusTrap = null;
        }

        this.#activeTarget = null;
        this.#scrollNodes = null;

        super.dispose();
    }

    /**
     * Handles an interaction outside the offcanvas panel.
     * @param {HTMLElement} target The interaction target.
     */
    handleBackdrop(target) {
        if (
            !this.options.backdrop ||
            this.options.backdrop === 'static' ||
            $.isSame(this.node, target) ||
            $.hasDescendent(this.node, target)
        ) {
            return;
        }

        this.hide();
    }

    /**
     * Handles an Escape-key interaction.
     */
    handleEscape() {
        if (this.options.keyboard) {
            this.hide();
        }
    }

    /**
     * Hides the offcanvas panel.
     */
    hide() {
        if (
            this.#transitioning ||
            !$.hasClass(this.node, 'show') ||
            !$.triggerOne(this.node, 'hide.ui.offcanvas')
        ) {
            return;
        }

        this.#transitioning = true;

        if (this.#focusTrap) {
            this.#focusTrap.deactivate();
        }

        $.addClass(this.node, 'hiding');

        waitForTransition(this.node, ['opacity', 'transform'], {
            activeTarget: this.#activeTarget,
            backdrop: this.options.backdrop,
            scroll: this.options.scroll,
            scrollNodes: this.#scrollNodes,
        }).then(({
            activeTarget,
            backdrop,
            node,
            scroll,
            scrollNodes,
        }) => {
            this.#transitioning = false;

            $.removeClass(node, 'hiding show');
            $.setAttribute(node, {
                'aria-hidden': true,
                'aria-modal': false,
            });

            if (backdrop) {
                $.removeClass(document.body, 'offcanvas-backdrop');
            }

            if (!scroll) {
                resetScrollPadding(scrollNodes);
                this.#scrollNodes = [];

                $.setStyle(document.body, { overflow: '' });
            }

            if (activeTarget) {
                $.focus(activeTarget);
                this.#activeTarget = null;
            }

            $.triggerEvent(node, 'hidden.ui.offcanvas');
        });
    }

    /**
     * Shows the offcanvas panel.
     * @param {HTMLElement} [relatedTarget] The element that triggered the Offcanvas.
     */
    show(relatedTarget) {
        if (relatedTarget) {
            this.#activeTarget = relatedTarget;
        }

        if (
            this.#transitioning ||
            $.hasClass(this.node, 'show') ||
            $.findOne('.offcanvas.show') ||
            !$.triggerOne(this.node, 'show.ui.offcanvas')
        ) {
            return;
        }

        this.#transitioning = true;

        if (this.options.backdrop) {
            $.addClass(document.body, 'offcanvas-backdrop');
        }

        this.#scrollNodes = [];

        if (!this.options.scroll) {
            this.#scrollNodes.push(document.body);
            this.#scrollNodes.push(...$.find('.fixed-top, .fixed-bottom'));

            addScrollPadding(this.#scrollNodes);

            $.setStyle(document.body, { overflow: 'hidden' });
        }

        // Commit the rendered hidden state before starting the transition.
        $.css(this.node, 'opacity');
        $.addClass(this.node, 'show');

        waitForTransition(this.node, ['opacity', 'transform']).then(({ node }) => {
            this.#transitioning = false;

            $.setAttribute(node, {
                'aria-hidden': false,
                'aria-modal': true,
            });

            if (this.#focusTrap) {
                this.#focusTrap.activate();
            }

            $.triggerEvent(node, 'shown.ui.offcanvas');
        });
    }

    /**
     * Toggles the offcanvas panel.
     */
    toggle() {
        if ($.hasClass(this.node, 'show')) {
            this.hide();
        } else {
            this.show();
        }
    }
}
