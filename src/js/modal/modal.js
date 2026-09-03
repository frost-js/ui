import BaseComponent from './../base-component.js';
import FocusTrap from './../focus-trap/index.js';
import { $, document } from './../globals.js';
import { addScrollPadding, resetScrollPadding } from './../helpers/scroll.js';
import { waitForTransition } from './../helpers/transition.js';
import { setStackIndex, updateStack } from './helpers.js';

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
    /** @type {ModalOptions} */
    static defaults = {
        backdrop: true,
        focus: true,
        show: false,
        keyboard: true,
    };

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

    /**
     * Gets the modal backdrop.
     * @returns {HTMLElement|null|undefined} The backdrop element.
     */
    get backdrop() {
        return this.#backdrop;
    }

    /** @inheritdoc */
    dispose() {
        if (this.#scrollNodes) {
            this.#cleanup(false);
        }

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
            waitForTransition(this.#dialog, ['opacity', 'transform']),
        ];

        if (this.#backdrop) {
            transitions.push(waitForTransition(this.#backdrop, ['opacity']));
        }

        Promise.all(transitions).then((_) => {
            if (!this.node) {
                return;
            }

            const modal = this.node;

            this.#cleanup();
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

        setStackIndex(this, stackSize);

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
            if (!this.node) {
                return;
            }

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
     * Restores the hidden modal state.
     * @param {boolean} [restoreFocus=true] Whether to restore focus to the active target.
     */
    #cleanup(restoreFocus = true) {
        const [dialog, ...sharedScrollNodes] = this.#scrollNodes;

        $.removeClass(this.node, 'hiding modal-static show');
        $.setAttribute(this.node, {
            'aria-hidden': true,
            'aria-modal': false,
        });

        if (dialog) {
            resetScrollPadding([dialog]);
        }

        if ($.getStyle(this.node, 'zIndex')) {
            $.setStyle(this.node, { zIndex: '' });
        }

        if (this.#backdrop) {
            $.remove(this.#backdrop);
        }

        const modals = updateStack();

        if (modals.length) {
            modals[0].#scrollNodes.push(...sharedScrollNodes);
        } else {
            resetScrollPadding(sharedScrollNodes);
            $.removeClass(document.body, 'modal-open');
        }

        if (restoreFocus && this.#activeTarget) {
            $.focus(this.#activeTarget);
        }

        this.#activeTarget = null;
        this.#scrollNodes = null;
        this.#backdrop = null;
        this.#transitioning = false;
        this.#zooming = false;
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
            if (!this.node) {
                return;
            }

            $.removeClass(modal, 'modal-static');

            return waitForTransition(node, ['transform']);
        }).then((_) => {
            if (this.node) {
                this.#zooming = false;
            }
        });
    }
}
