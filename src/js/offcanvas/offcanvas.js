import BaseComponent from './../base-component.js';
import FocusTrap from './../focus-trap/index.js';
import { $, document } from './../globals.js';
import { addScrollPadding, resetScrollPadding } from './../helpers.js';
import { getDirection } from './helpers.js';

/**
 * Offcanvas Class
 * @class
 */
export default class Offcanvas extends BaseComponent {
    #activeTarget;
    #focusTrap;
    #scrollNodes;

    /**
     * New Offcanvas constructor.
     * @param {HTMLElement} node The input node.
     * @param {object} [options] The options to create the Offcanvas with.
     */
    constructor(node, options) {
        super(node, options);

        if (!this.options.scroll || this.options.backdrop) {
            this.#focusTrap = FocusTrap.init(this.node);
        }
    }

    /**
     * Dispose the Offcanvas.
     */
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
     * Handle a backdrop interaction.
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
     * Handle an escape key interaction.
     */
    handleEscape() {
        if (this.options.keyboard) {
            this.hide();
        }
    }

    /**
     * Hide the Offcanvas.
     */
    hide() {
        if (
            $.getDataset(this.node, 'uiAnimating') ||
            !$.hasClass(this.node, 'show') ||
            !$.triggerOne(this.node, 'hide.ui.offcanvas')
        ) {
            return;
        }

        $.setDataset(this.node, { uiAnimating: 'out' });

        if (this.#focusTrap) {
            this.#focusTrap.deactivate();
        }

        Promise.all([
            $.fadeOut(this.node, {
                duration: this.options.duration,
            }),
            $.dropOut(this.node, {
                duration: this.options.duration,
                direction: getDirection(this.node),
            }),
        ]).then((_) => {
            $.setAttribute(this.node, {
                'aria-hidden': true,
                'aria-modal': false,
            });

            $.removeClass(this.node, 'show');

            if (this.options.backdrop) {
                $.removeClass(document.body, 'offcanvas-backdrop');
            }

            if (!this.options.scroll) {
                resetScrollPadding(this.#scrollNodes);
                this.#scrollNodes = [];

                $.setStyle(document.body, { overflow: '' });
            }

            if (this.#activeTarget) {
                $.focus(this.#activeTarget);
                this.#activeTarget = null;
            }

            $.removeDataset(this.node, 'uiAnimating');
            $.triggerEvent(this.node, 'hidden.ui.offcanvas');
        }).catch((_) => {
            if ($.getDataset(this.node, 'uiAnimating') === 'out') {
                $.removeDataset(this.node, 'uiAnimating');
            }
        });
    }

    /**
     * Show the Offcanvas.
     * @param {HTMLElement} [relatedTarget] The element that triggered the Offcanvas.
     */
    show(relatedTarget) {
        if (relatedTarget) {
            this.#activeTarget = relatedTarget;
        }

        if (
            $.getDataset(this.node, 'uiAnimating') ||
            $.hasClass(this.node, 'show') ||
            $.findOne('.offcanvas.show') ||
            !$.triggerOne(this.node, 'show.ui.offcanvas')
        ) {
            return;
        }

        $.setDataset(this.node, { uiAnimating: 'in' });
        $.addClass(this.node, 'show');

        if (this.options.backdrop) {
            $.addClass(document.body, 'offcanvas-backdrop');
        }

        this.#scrollNodes = [];

        if (!this.options.scroll) {
            this.#scrollNodes.push(document.body);
            this.#scrollNodes.push(...$.find('.fixed-top, .fixed-bottom, .sticky-top'));

            addScrollPadding(this.#scrollNodes);

            $.setStyle(document.body, { overflow: 'hidden' });
        }

        Promise.all([
            $.fadeIn(this.node, {
                duration: this.options.duration,
            }),
            $.dropIn(this.node, {
                duration: this.options.duration,
                direction: getDirection(this.node),
            }),
        ]).then((_) => {
            $.setAttribute(this.node, {
                'aria-hidden': false,
                'aria-modal': true,
            });

            if (this.#focusTrap) {
                this.#focusTrap.activate();
            }

            $.removeDataset(this.node, 'uiAnimating');
            $.triggerEvent(this.node, 'shown.ui.offcanvas');
        }).catch((_) => {
            if ($.getDataset(this.node, 'uiAnimating') === 'in') {
                $.removeDataset(this.node, 'uiAnimating');
            }
        });
    }

    /**
     * Toggle the Offcanvas.
     */
    toggle() {
        if ($.hasClass(this.node, 'show')) {
            this.hide();
        } else {
            this.show();
        }
    }
}
