import BaseComponent from './../base-component.js';
import FocusTrap from './../focus-trap/index.js';
import { $, document } from './../globals.js';
import { addScrollPadding, resetScrollPadding } from './../helpers/scroll.js';

/**
 * @typedef {object} ModalOptions
 * @property {number} [duration=250] The transition duration in milliseconds.
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
            $.getDataset(this.#dialog, 'uiAnimating') ||
            !$.hasClass(this.node, 'show') ||
            !$.triggerOne(this.node, 'hide.ui.modal')
        ) {
            return;
        }

        $.stop(this.#dialog);
        $.setDataset(this.#dialog, { uiAnimating: 'out' });

        if (this.#focusTrap) {
            this.#focusTrap.deactivate();
        }

        const stackSize = $.find('.modal.show').length - 1;

        Promise.all([
            $.fadeOut(this.#dialog, {
                duration: this.options.duration,
            }),
            $.dropOut(this.#dialog, {
                duration: this.options.duration,
                direction: 'top',
            }),
            $.fadeOut(this.#backdrop, {
                duration: this.options.duration,
            }),
        ]).then((_) => {
            $.setAttribute(this.node, {
                'aria-hidden': true,
                'aria-modal': false,
            });

            resetScrollPadding(this.#scrollNodes);
            this.#scrollNodes = [];

            if (stackSize) {
                $.setStyle(this.node, { zIndex: '' });
            } else {
                $.removeClass(document.body, 'modal-open');
            }

            $.removeClass(this.node, 'show');

            if (this.options.backdrop) {
                $.remove(this.#backdrop);
                this.#backdrop = null;
            }

            if (this.#activeTarget) {
                $.focus(this.#activeTarget);
                this.#activeTarget = null;
            }

            $.removeDataset(this.#dialog, 'uiAnimating');
            $.triggerEvent(this.node, 'hidden.ui.modal');
        }).catch((_) => {
            if ($.getDataset(this.#dialog, 'uiAnimating') === 'out') {
                $.removeDataset(this.#dialog, 'uiAnimating');
            }
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
            $.getDataset(this.#dialog, 'uiAnimating') ||
            $.hasClass(this.node, 'show') ||
            !$.triggerOne(this.node, 'show.ui.modal', { data: { relatedTarget: this.#activeTarget } })
        ) {
            return;
        }

        $.setDataset(this.#dialog, { uiAnimating: 'in' });

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

        $.addClass(this.node, 'show');

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

        Promise.all([
            $.fadeIn(this.#dialog, {
                duration: this.options.duration,
            }),
            $.dropIn(this.#dialog, {
                duration: this.options.duration,
                direction: 'top',
            }),
            $.fadeIn(this.#backdrop, {
                duration: this.options.duration,
            }),
        ]).then((_) => {
            $.setAttribute(this.node, {
                'aria-hidden': false,
                'aria-modal': true,
            });

            if (this.#focusTrap) {
                this.#focusTrap.activate();
            }

            $.removeDataset(this.#dialog, 'uiAnimating');
            $.triggerEvent(this.node, 'shown.ui.modal');
        }).catch((_) => {
            if ($.getDataset(this.#dialog, 'uiAnimating') === 'in') {
                $.removeDataset(this.#dialog, 'uiAnimating');
            }
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
        if ($.getDataset(this.#dialog, 'uiAnimating')) {
            return;
        }

        $.stop(this.#dialog);

        $.animate(
            this.#dialog,
            (node, progress) => {
                if (progress >= 1) {
                    $.setStyle(node, { transform: '' });
                    return;
                }

                const zoomOffset = (progress < .5 ? progress : (1 - progress)) / 20;
                $.setStyle(node, { transform: `scale(${1 + zoomOffset})` });
            },
            {
                duration: 200,
            },
        ).catch((_) => {
            //
        });
    }
}
