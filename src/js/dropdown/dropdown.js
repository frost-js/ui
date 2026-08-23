import BaseComponent from './../base-component.js';
import { $, window } from './../globals.js';
import Popper from './../popper/popper.js';

/** @typedef {import('../popper/popper.js').Placement} Placement */
/** @typedef {import('../popper/popper.js').Position} Position */

/**
 * @typedef {object} DropdownOptions
 * @property {'dynamic'|'static'} [display='dynamic'] The positioning mode.
 * @property {number} [duration=100] The transition duration in milliseconds.
 * @property {Placement} [placement='bottom'] The preferred menu placement.
 * @property {Position} [position='start'] The menu alignment.
 * @property {boolean} [fixed=false] Whether to preserve the preferred placement.
 * @property {number} [spacing=3] The spacing between the toggle and menu.
 * @property {number|false} [minContact=false] The minimum contact with the toggle.
 * @property {'parent'|string|HTMLElement|null} [reference=null] The positioning reference.
 * @property {boolean|'inside'|'outside'} [autoClose=true] Where interactions close the menu.
 */

/**
 * Controls a dropdown menu.
 * @extends {BaseComponent<DropdownOptions>}
 */
export default class Dropdown extends BaseComponent {
    #display;
    #menuNode;
    #popper;
    #referenceNode;

    /**
     * Creates a Dropdown.
     * @param {HTMLElement} node The input node.
     * @param {DropdownOptions} [options] The dropdown options.
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

        // Navbar dropdowns use static positioning.
        if (this.#display !== 'static' && $.closest(this.node, '.navbar-nav').length) {
            this.#display = 'static';
        }
    }

    /**
     * Checks whether the dropdown menu contains a target.
     * @param {HTMLElement} target The target node.
     * @returns {boolean} Whether the target is inside the menu.
     */
    containsMenuTarget(target) {
        return $.hasDescendent(this.#menuNode, target);
    }

    /** @inheritdoc */
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
     * Focuses the first enabled dropdown item.
     */
    focusFirstItem() {
        const focusNode = $.findOne('.dropdown-item:not([tabindex="-1"])', this.#menuNode);
        $.focus(focusNode);
    }

    /**
     * Hides the dropdown menu.
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
     * Checks whether an interaction target should close the dropdown.
     * @param {HTMLElement} target The target node.
     * @returns {boolean} Whether the dropdown should close.
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
     * Shows the dropdown menu.
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
     * Toggles the dropdown menu.
     */
    toggle() {
        if ($.hasClass(this.#menuNode, 'show')) {
            this.hide();
        } else {
            this.show();
        }
    }

    /**
     * Updates the dropdown position.
     */
    update() {
        if (this.#popper) {
            this.#popper.update();
        }
    }
}
