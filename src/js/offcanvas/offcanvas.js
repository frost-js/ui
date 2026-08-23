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
    /**
     * New Offcanvas constructor.
     * @param {HTMLElement} node The input node.
     * @param {object} [options] The options to create the Offcanvas with.
     */
    constructor(node, options) {
        super(node, options);

        if (!this._options.scroll || this._options.backdrop) {
            this._focusTrap = FocusTrap.init(this._node);
        }
    }

    /**
     * Dispose the Offcanvas.
     */
    dispose() {
        if (this._focusTrap) {
            this._focusTrap.dispose();
            this._focusTrap = null;
        }

        this._activeTarget = null;
        this._scrollNodes = null;

        super.dispose();
    }

    /**
     * Handle a backdrop interaction.
     * @param {HTMLElement} target The interaction target.
     */
    handleBackdrop(target) {
        if (
            !this._options.backdrop ||
            this._options.backdrop === 'static' ||
            $.isSame(this._node, target) ||
            $.hasDescendent(this._node, target)
        ) {
            return;
        }

        this.hide();
    }

    /**
     * Handle an escape key interaction.
     */
    handleEscape() {
        if (this._options.keyboard) {
            this.hide();
        }
    }

    /**
     * Hide the Offcanvas.
     */
    hide() {
        if (
            $.getDataset(this._node, 'uiAnimating') ||
            !$.hasClass(this._node, 'show') ||
            !$.triggerOne(this._node, 'hide.ui.offcanvas')
        ) {
            return;
        }

        $.setDataset(this._node, { uiAnimating: 'out' });

        if (this._focusTrap) {
            this._focusTrap.deactivate();
        }

        Promise.all([
            $.fadeOut(this._node, {
                duration: this._options.duration,
            }),
            $.dropOut(this._node, {
                duration: this._options.duration,
                direction: getDirection(this._node),
            }),
        ]).then((_) => {
            $.setAttribute(this._node, {
                'aria-hidden': true,
                'aria-modal': false,
            });

            $.removeClass(this._node, 'show');

            if (this._options.backdrop) {
                $.removeClass(document.body, 'offcanvas-backdrop');
            }

            if (!this._options.scroll) {
                resetScrollPadding(this._scrollNodes);
                this._scrollNodes = [];

                $.setStyle(document.body, { overflow: '' });
            }

            if (this._activeTarget) {
                $.focus(this._activeTarget);
                this._activeTarget = null;
            }

            $.removeDataset(this._node, 'uiAnimating');
            $.triggerEvent(this._node, 'hidden.ui.offcanvas');
        }).catch((_) => {
            if ($.getDataset(this._node, 'uiAnimating') === 'out') {
                $.removeDataset(this._node, 'uiAnimating');
            }
        });
    }

    /**
     * Show the Offcanvas.
     * @param {HTMLElement} [relatedTarget] The element that triggered the Offcanvas.
     */
    show(relatedTarget) {
        if (relatedTarget) {
            this._activeTarget = relatedTarget;
        }

        if (
            $.getDataset(this._node, 'uiAnimating') ||
            $.hasClass(this._node, 'show') ||
            $.findOne('.offcanvas.show') ||
            !$.triggerOne(this._node, 'show.ui.offcanvas')
        ) {
            return;
        }

        $.setDataset(this._node, { uiAnimating: 'in' });
        $.addClass(this._node, 'show');

        if (this._options.backdrop) {
            $.addClass(document.body, 'offcanvas-backdrop');
        }

        this._scrollNodes = [];

        if (!this._options.scroll) {
            this._scrollNodes.push(document.body);
            this._scrollNodes.push(...$.find('.fixed-top, .fixed-bottom, .sticky-top'));

            addScrollPadding(this._scrollNodes);

            $.setStyle(document.body, { overflow: 'hidden' });
        }

        Promise.all([
            $.fadeIn(this._node, {
                duration: this._options.duration,
            }),
            $.dropIn(this._node, {
                duration: this._options.duration,
                direction: getDirection(this._node),
            }),
        ]).then((_) => {
            $.setAttribute(this._node, {
                'aria-hidden': false,
                'aria-modal': true,
            });

            if (this._focusTrap) {
                this._focusTrap.activate();
            }

            $.removeDataset(this._node, 'uiAnimating');
            $.triggerEvent(this._node, 'shown.ui.offcanvas');
        }).catch((_) => {
            if ($.getDataset(this._node, 'uiAnimating') === 'in') {
                $.removeDataset(this._node, 'uiAnimating');
            }
        });
    }

    /**
     * Toggle the Offcanvas.
     */
    toggle() {
        if ($.hasClass(this._node, 'show')) {
            this.hide();
        } else {
            this.show();
        }
    }
}
