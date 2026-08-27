import BaseComponent from './../base-component.js';
import FocusTrap from './../focus-trap/index.js';
import { $, document } from './../globals.js';
import { addScrollPadding, resetScrollPadding } from './../helpers/scroll.js';
import { waitForTransition } from './../helpers/transition.js';

const modalStackOffset = 20;

/**
 * @typedef {object} ModalOptions
 * @property {boolean|'static'} [backdrop=true] Whether to show a dismissible or static backdrop.
 * @property {boolean} [focus=true] Whether to trap focus while shown.
 * @property {boolean} [show=false] Whether to show the modal immediately.
 * @property {boolean} [keyboard=true] Whether Escape hides the modal.
 */

/**
 * Controls a modal dialog and its backdrop.
 * @augments {BaseComponent<ModalOptions>}
 */
export default class Modal extends BaseComponent {
    #activeTarget;
    #backdrop;
    #dialog;
    #focusTrap;
    #scrollNodes;
    #transitioning;
    #zooming;

    /**
     * Reindexes visible modals and their backdrops.
     * @returns {Modal[]} The ordered modal instances.
     */
    static #updateStack() {
        const nodes = $.find('.modal.show');

        nodes.sort((nodeA, nodeB) =>
            parseInt($.css(nodeA, 'zIndex')) - parseInt($.css(nodeB, 'zIndex')),
        );

        const modals = [];

        for (const [index, node] of nodes.entries()) {
            const modal = Modal.init(node);

            modal.#setStackIndex(index);
            modals.push(modal);
        }

        return modals;
    }

    /**
     * Creates a Modal.
     * @param {HTMLElement} node The input node.
     * @param {ModalOptions} [options] The modal options.
     */
    constructor(node, options) {
        super(node, options);

        this.#dialog = $.child(this.node, '.modal-dialog').shift();

        if (this.options.show) {
            this.show();
        }

        if (this.options.focus) {
            this.#focusTrap = FocusTrap.init(this.node);
        }
    }

    /** @inheritdoc */
    dispose() {
        if (this.#focusTrap) {
            this.#focusTrap.dispose();
            this.#focusTrap = null;
        }

        this.#dialog = null;
        this.#activeTarget = null;
        this.#backdrop = null;
        this.#scrollNodes = null;

        super.dispose();
    }

    /**
     * Handles an interaction outside the modal dialog.
     * @param {HTMLElement} target The interaction target.
     */
    handleBackdrop(target) {
        if (
            !this.options.backdrop ||
            (this.node !== target && $.hasDescendent(this.node, target))
        ) {
            return;
        }

        if (this.options.backdrop === 'static') {
            this.#zoom();
            return;
        }

        this.hide();
    }

    /**
     * Handles an Escape-key interaction.
     */
    handleEscape() {
        if (!this.options.keyboard) {
            return;
        }

        if (this.options.backdrop === 'static') {
            this.#zoom();
            return;
        }

        this.hide();
    }

    /**
     * Hides the modal.
     */
    hide() {
        if (
            this.#transitioning ||
            !$.hasClass(this.node, 'show') ||
            !$.triggerOne(this.node, 'hide.ui.modal')
        ) {
            return;
        }

        this.#transitioning = true;
        this.#zooming = false;

        $.removeClass(this.node, 'modal-static');

        if (this.#focusTrap) {
            this.#focusTrap.deactivate();
        }

        $.addClass(this.node, 'hiding');
        $.removeClass(this.node, 'show');

        if (this.#backdrop) {
            $.removeClass(this.#backdrop, 'show');
        }

        const transitions = [
            waitForTransition(this.#dialog, ['opacity', 'transform'], {
                activeTarget: this.#activeTarget,
                backdrop: this.#backdrop,
                modal: this.node,
                scrollNodes: this.#scrollNodes,
            }),
        ];

        if (this.#backdrop) {
            transitions.push(waitForTransition(this.#backdrop, ['opacity']));
        }

        Promise.all(transitions).then(([{
            activeTarget,
            backdrop,
            modal,
            scrollNodes,
        }]) => {
            this.#transitioning = false;

            $.removeClass(modal, 'hiding');
            $.setAttribute(modal, {
                'aria-hidden': true,
                'aria-modal': false,
            });

            const [dialog, ...sharedScrollNodes] = scrollNodes;

            resetScrollPadding([dialog]);
            this.#scrollNodes = [];

            if ($.getStyle(modal, 'zIndex')) {
                $.setStyle(modal, { zIndex: '' });
            }

            if (backdrop) {
                $.remove(backdrop);
                this.#backdrop = null;
            }

            const modals = Modal.#updateStack();

            if (modals.length) {
                modals[0].#scrollNodes.push(...sharedScrollNodes);
            } else {
                resetScrollPadding(sharedScrollNodes);
                $.removeClass(document.body, 'modal-open');
            }

            if (activeTarget) {
                $.focus(activeTarget);
                this.#activeTarget = null;
            }

            $.triggerEvent(modal, 'hidden.ui.modal');
        });
    }

    /**
     * Shows the modal.
     * @param {HTMLElement} [relatedTarget] The element that triggered the Modal.
     */
    show(relatedTarget) {
        if (relatedTarget) {
            this.#activeTarget = relatedTarget;
        }

        if (
            this.#transitioning ||
            $.hasClass(this.node, 'show') ||
            !$.triggerOne(this.node, 'show.ui.modal', { data: { relatedTarget: this.#activeTarget } })
        ) {
            return;
        }

        this.#transitioning = true;

        const stackSize = $.find('.modal:is(.show, .hiding)').length;

        $.removeClass(document.body, 'modal-open');

        this.#scrollNodes = [this.#dialog];

        if (!stackSize && !$.findOne('.offcanvas.show')) {
            this.#scrollNodes.push(document.body);
            this.#scrollNodes.push(...$.find('.fixed-top, .fixed-bottom'));
        }

        addScrollPadding(this.#scrollNodes);

        $.addClass(document.body, 'modal-open');

        if (this.options.backdrop) {
            this.#backdrop = $.create('div', {
                class: 'modal-backdrop',
            });

            $.append(document.body, this.#backdrop);
        }

        this.#setStackIndex(stackSize);

        // Commit the rendered hidden state before starting the transitions.
        $.css(this.#dialog, 'opacity');
        $.addClass(this.node, 'show');

        const transitions = [
            waitForTransition(this.#dialog, ['opacity', 'transform'], {
                modal: this.node,
            }),
        ];

        if (this.#backdrop) {
            $.addClass(this.#backdrop, 'show');
            transitions.push(waitForTransition(this.#backdrop, ['opacity']));
        }

        Promise.all(transitions).then(([{ modal }]) => {
            this.#transitioning = false;

            $.setAttribute(modal, {
                'aria-hidden': false,
                'aria-modal': true,
            });

            if (this.#focusTrap) {
                this.#focusTrap.activate();
            }

            $.triggerEvent(modal, 'shown.ui.modal');
        });
    }

    /**
     * Toggles the modal.
     */
    toggle() {
        if ($.hasClass(this.node, 'show')) {
            this.hide();
        } else {
            this.show();
        }
    }

    /**
     * Sets the modal and backdrop stacking level.
     * @param {number} index The zero-based stack index.
     */
    #setStackIndex(index) {
        $.setStyle(this.node, { zIndex: '' });

        if (this.#backdrop) {
            $.setStyle(this.#backdrop, { zIndex: '' });
        }

        if (!index) {
            return;
        }

        const modalZIndex = parseInt($.css(this.node, 'zIndex')) + (index * modalStackOffset);

        $.setStyle(this.node, { zIndex: modalZIndex });

        if (this.#backdrop) {
            const backdropZIndex = parseInt($.css(this.#backdrop, 'zIndex')) + (index * modalStackOffset);

            $.setStyle(this.#backdrop, { zIndex: backdropZIndex });
        }
    }

    /**
     * Runs the static-backdrop feedback animation.
     */
    #zoom() {
        if (this.#transitioning || this.#zooming) {
            return;
        }

        this.#zooming = true;

        $.addClass(this.node, 'modal-static');

        waitForTransition(this.#dialog, ['transform'], {
            modal: this.node,
        }).then(({ modal, node }) => {
            $.removeClass(modal, 'modal-static');

            return waitForTransition(node, ['transform']);
        }).then((_) => {
            this.#zooming = false;
        });
    }
}
