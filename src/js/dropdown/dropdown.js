import BaseComponent from './../base-component.js';
import { $, window } from './../globals.js';
import Popper from './../popper/popper.js';

/**
 * Dropdown Class
 * @class
 */
export default class Dropdown extends BaseComponent {
    #display;
    #menuNode;
    #popper;
    #referenceNode;

    /**
     * New Dropdown constructor.
     * @param {HTMLElement} node The input node.
     * @param {object} [options] The options to create the Dropdown with.
     */
    constructor(node, options) {
        super(node, options);

        this.#display = this.options.display;
        this.#menuNode = $.next(this.node, '.dropdown-menu').shift();

        if (this.options.reference) {
            if (this.options.reference === 'parent') {
                this.#referenceNode = $.parent(this.node).shift();
            } else {
                this.#referenceNode = $.findOne(this.options.reference);
            }
        } else {
            this.#referenceNode = this.node;
        }

        // Attach popper
        if (this.#display !== 'static' && $.closest(this.node, '.navbar-nav').length) {
            this.#display = 'static';
        }
    }

    /**
     * Check whether the Dropdown menu contains a target.
     * @param {HTMLElement} target The target node.
     * @return {boolean} Whether the menu contains the target.
     */
    containsMenuTarget(target) {
        return $.hasDescendent(this.#menuNode, target);
    }

    /**
     * Dispose the Dropdown.
     */
    dispose() {
        if (this.#popper) {
            this.#popper.dispose();
            this.#popper = null;
        }

        this.#menuNode = null;
        this.#referenceNode = null;

        super.dispose();
    }

    /**
     * Focus the first Dropdown menu item.
     */
    focusFirstItem() {
        const focusNode = $.findOne('.dropdown-item:not([tabindex="-1"])', this.#menuNode);
        $.focus(focusNode);
    }

    /**
     * Hide the Dropdown.
     */
    hide() {
        if (
            $.getDataset(this.#menuNode, 'uiAnimating') ||
            !$.hasClass(this.#menuNode, 'show') ||
            !$.triggerOne(this.node, 'hide.ui.dropdown')
        ) {
            return;
        }

        $.setDataset(this.#menuNode, { uiAnimating: 'out' });

        $.fadeOut(this.#menuNode, {
            duration: this.options.duration,
        }).then((_) => {
            if (this.#popper) {
                this.#popper.dispose();
                this.#popper = null;
            }

            $.removeClass(this.#menuNode, 'show');
            $.setAttribute(this.node, { 'aria-expanded': false });
            $.removeDataset(this.#menuNode, 'uiAnimating');
            $.triggerEvent(this.node, 'hidden.ui.dropdown');
        }).catch((_) => {
            if ($.getDataset(this.#menuNode, 'uiAnimating') === 'out') {
                $.removeDataset(this.#menuNode, 'uiAnimating');
            }
        });
    }

    /**
     * Check whether the Dropdown should close for a target.
     * @param {HTMLElement} target The target node.
     * @return {boolean} Whether the Dropdown should close.
     */
    shouldClose(target) {
        const hasDescendent = this.containsMenuTarget(target);
        const autoClose = this.options.autoClose;

        return !(
            $.isSame(this.node, target) ||
            (
                hasDescendent &&
                (
                    $.is(target, 'form, input, textarea, select, option') ||
                    autoClose === 'outside' ||
                    autoClose === false
                )
            ) ||
            (
                !hasDescendent &&
                !$.isSame(this.#menuNode, target) &&
                (
                    autoClose === 'inside' ||
                    autoClose === false
                )
            )
        );
    }

    /**
     * Show the Dropdown.
     */
    show() {
        if (
            $.getDataset(this.#menuNode, 'uiAnimating') ||
            $.hasClass(this.#menuNode, 'show') ||
            !$.triggerOne(this.node, 'show.ui.dropdown')
        ) {
            return;
        }

        $.setDataset(this.#menuNode, { uiAnimating: 'in' });
        $.addClass(this.#menuNode, 'show');

        if (this.#display === 'dynamic') {
            this.#popper = new Popper(this.#menuNode, {
                reference: this.#referenceNode,
                placement: this.options.placement,
                position: this.options.position,
                fixed: this.options.fixed,
                spacing: this.options.spacing,
                minContact: this.options.minContact,
            });
        }

        window.requestAnimationFrame((_) => {
            this.update();
        });

        $.fadeIn(this.#menuNode, {
            duration: this.options.duration,
        }).then((_) => {
            $.setAttribute(this.node, { 'aria-expanded': true });
            $.removeDataset(this.#menuNode, 'uiAnimating');
            $.triggerEvent(this.node, 'shown.ui.dropdown');
        }).catch((_) => {
            if ($.getDataset(this.#menuNode, 'uiAnimating') === 'in') {
                $.removeDataset(this.#menuNode, 'uiAnimating');
            }
        });
    }

    /**
     * Toggle the Dropdown.
     */
    toggle() {
        if ($.hasClass(this.#menuNode, 'show')) {
            this.hide();
        } else {
            this.show();
        }
    }

    /**
     * Update the Dropdown position.
     */
    update() {
        if (this.#popper) {
            this.#popper.update();
        }
    }
}
