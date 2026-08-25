import BaseComponent from './../base-component.js';
import FocusTrap from './../focus-trap/index.js';
import { $, document } from './../globals.js';
import { addScrollPadding, resetScrollPadding } from './../helpers/scroll.js';
import { waitForTransition } from './../helpers/transition.js';

/**
 * @typedef {object} ModalOptions
 * @property {boolean|'static'} [backdrop=true] Whether to show a dismissible or static backdrop.
 * @property {boolean} [focus=true] Whether to trap focus while shown.
 * @property {boolean} [show=false] Whether to show the modal immediately.
 * @property {boolean} [keyboard=true] Whether Escape hides the modal.
 */

/**
 * Controls a modal dialog and its backdrop.
 * @extends {BaseComponent<ModalOptions>}
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

        const stackSize = $.find('.modal.show').length - 1;

        $.addClass(this.node, 'hiding');
        $.removeClass(this.node, 'show');

        if (this.#backdrop) {
            $.removeClass(this.#backdrop, 'show');
        }

        const transitions = [
            waitForTransition(this.#dialog, ['opacity', 'transform'], {
                activeTarget: this.#activeTarget,
                backdrop: this.#backdrop,
                modalNode: this.node,
                scrollNodes: this.#scrollNodes,
            }),
        ];

        if (this.#backdrop) {
            transitions.push(waitForTransition(this.#backdrop, ['opacity']));
        }

        Promise.all(transitions).then(([{
            activeTarget,
            backdrop,
            modalNode,
            scrollNodes,
        }]) => {
            $.removeClass(modalNode, 'hiding');
            $.setAttribute(modalNode, {
                'aria-hidden': true,
                'aria-modal': false,
            });

            resetScrollPadding(scrollNodes);
            this.#scrollNodes = [];

            if (stackSize) {
                $.setStyle(modalNode, { zIndex: '' });
            } else {
                $.removeClass(document.body, 'modal-open');
            }

            if (backdrop) {
                $.remove(backdrop);
                this.#backdrop = null;
            }

            if (activeTarget) {
                $.focus(activeTarget);
                this.#activeTarget = null;
            }

            $.triggerEvent(modalNode, 'hidden.ui.modal');
        }).finally((_) => {
            this.#transitioning = false;
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

        const stackSize = $.find('.modal.show').length;

        $.removeClass(document.body, 'modal-open');

        this.#scrollNodes = [this.#dialog];

        if (stackSize) {
            let zIndex = $.css(this.node, 'zIndex');
            zIndex = parseInt(zIndex);
            zIndex += stackSize * 20;

            $.setStyle(this.node, { zIndex });
        } else if (!$.findOne('.offcanvas.show')) {
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

            if (stackSize) {
                let zIndex = $.css(this.#backdrop, 'zIndex');
                zIndex = parseInt(zIndex);
                zIndex += stackSize * 20;

                $.setStyle(this.#backdrop, { zIndex });
            }
        }

        // Commit the rendered hidden state before starting the transitions.
        $.css(this.#dialog, 'opacity');
        $.addClass(this.node, 'show');

        const transitions = [
            waitForTransition(this.#dialog, ['opacity', 'transform'], {
                modalNode: this.node,
            }),
        ];

        if (this.#backdrop) {
            $.addClass(this.#backdrop, 'show');
            transitions.push(waitForTransition(this.#backdrop, ['opacity']));
        }

        Promise.all(transitions).then(([{ modalNode }]) => {
            $.setAttribute(modalNode, {
                'aria-hidden': false,
                'aria-modal': true,
            });

            if (this.#focusTrap) {
                this.#focusTrap.activate();
            }

            $.triggerEvent(modalNode, 'shown.ui.modal');
        }).finally((_) => {
            this.#transitioning = false;
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
     * Runs the static-backdrop feedback animation.
     */
    #zoom() {
        if (this.#transitioning || this.#zooming) {
            return;
        }

        this.#zooming = true;

        $.addClass(this.node, 'modal-static');

        waitForTransition(this.#dialog, ['transform'], {
            modalNode: this.node,
        }).then(({ modalNode, node }) => {
            $.removeClass(modalNode, 'modal-static');

            return waitForTransition(node, ['transform']);
        }).finally((_) => {
            this.#zooming = false;
        });
    }
}
