import BaseComponent from './../base-component.js';
import FocusTrap from './../focus-trap/index.js';
import { $, document } from './../globals.js';
import { addScrollPadding, resetScrollPadding } from './../helpers.js';

/**
 * Modal Class
 * @class
 */
export default class Modal extends BaseComponent {
    /**
     * New Modal constructor.
     * @param {HTMLElement} node The input node.
     * @param {object} [options] The options to create the Modal with.
     */
    constructor(node, options) {
        super(node, options);

        this._dialog = $.child(this._node, '.modal-dialog').shift();

        if (this._options.show) {
            this.show();
        }

        if (this._options.focus) {
            this._focusTrap = FocusTrap.init(this._node);
        }
    }

    /**
     * Start a zoom in/out animation.
     */
    _zoom() {
        if ($.getDataset(this._dialog, 'uiAnimating')) {
            return;
        }

        $.stop(this._dialog);

        $.animate(
            this._dialog,
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

    /**
     * Dispose the Modal.
     */
    dispose() {
        if (this._focusTrap) {
            this._focusTrap.dispose();
            this._focusTrap = null;
        }

        this._dialog = null;
        this._activeTarget = null;
        this._backdrop = null;
        this._scrollNodes = null;

        super.dispose();
    }

    /**
     * Hide the Modal.
     */
    hide() {
        if (
            $.getDataset(this._dialog, 'uiAnimating') ||
            !$.hasClass(this._node, 'show') ||
            !$.triggerOne(this._node, 'hide.ui.modal')
        ) {
            return;
        }

        $.stop(this._dialog);
        $.setDataset(this._dialog, { uiAnimating: 'out' });

        if (this._focusTrap) {
            this._focusTrap.deactivate();
        }

        const stackSize = $.find('.modal.show').length - 1;

        Promise.all([
            $.fadeOut(this._dialog, {
                duration: this._options.duration,
            }),
            $.dropOut(this._dialog, {
                duration: this._options.duration,
                direction: 'top',
            }),
            $.fadeOut(this._backdrop, {
                duration: this._options.duration,
            }),
        ]).then((_) => {
            $.setAttribute(this._node, {
                'aria-hidden': true,
                'aria-modal': false,
            });

            resetScrollPadding(this._scrollNodes);
            this._scrollNodes = [];

            if (stackSize) {
                $.setStyle(this._node, { zIndex: '' });
            } else {
                $.removeClass(document.body, 'modal-open');
            }

            $.removeClass(this._node, 'show');

            if (this._options.backdrop) {
                $.remove(this._backdrop);
                this._backdrop = null;
            }

            if (this._activeTarget) {
                $.focus(this._activeTarget);
                this._activeTarget = null;
            }

            $.removeDataset(this._dialog, 'uiAnimating');
            $.triggerEvent(this._node, 'hidden.ui.modal');
        }).catch((_) => {
            if ($.getDataset(this._dialog, 'uiAnimating') === 'out') {
                $.removeDataset(this._dialog, 'uiAnimating');
            }
        });
    }

    /**
     * Show the Modal.
     */
    show() {
        if (
            $.getDataset(this._dialog, 'uiAnimating') ||
            $.hasClass(this._node, 'show') ||
            !$.triggerOne(this._node, 'show.ui.modal', { data: { relatedTarget: this._activeTarget } })
        ) {
            return;
        }

        $.setDataset(this._dialog, { uiAnimating: 'in' });

        const stackSize = $.find('.modal.show').length;

        $.removeClass(document.body, 'modal-open');

        this._scrollNodes = [this._dialog];

        if (stackSize) {
            let zIndex = $.css(this._node, 'zIndex');
            zIndex = parseInt(zIndex);
            zIndex += stackSize * 20;

            $.setStyle(this._node, { zIndex });
        } else if (!$.findOne('.offcanvas.show')) {
            this._scrollNodes.push(document.body);
            this._scrollNodes.push(...$.find('.fixed-top, .fixed-bottom, .sticky-top'));
        }

        addScrollPadding(this._scrollNodes);

        $.addClass(document.body, 'modal-open');

        $.addClass(this._node, 'show');

        if (this._options.backdrop) {
            this._backdrop = $.create('div', {
                class: 'modal-backdrop',
            });

            $.append(document.body, this._backdrop);

            if (stackSize) {
                let zIndex = $.css(this._backdrop, 'zIndex');
                zIndex = parseInt(zIndex);
                zIndex += stackSize * 20;

                $.setStyle(this._backdrop, { zIndex });
            }
        }

        Promise.all([
            $.fadeIn(this._dialog, {
                duration: this._options.duration,
            }),
            $.dropIn(this._dialog, {
                duration: this._options.duration,
                direction: 'top',
            }),
            $.fadeIn(this._backdrop, {
                duration: this._options.duration,
            }),
        ]).then((_) => {
            $.setAttribute(this._node, {
                'aria-hidden': false,
                'aria-modal': true,
            });

            if (this._focusTrap) {
                this._focusTrap.activate();
            }

            $.removeDataset(this._dialog, 'uiAnimating');
            $.triggerEvent(this._node, 'shown.ui.modal');
        }).catch((_) => {
            if ($.getDataset(this._dialog, 'uiAnimating') === 'in') {
                $.removeDataset(this._dialog, 'uiAnimating');
            }
        });
    }

    /**
     * Toggle the Modal.
     */
    toggle() {
        if ($.hasClass(this._node, 'show')) {
            this.hide();
        } else {
            this.show();
        }
    }
}
