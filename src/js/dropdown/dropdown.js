/** @import { Placement, Position } from '../popper/popper.js'; */

import BaseComponent from './../base-component.js';
import { $, window } from './../globals.js';
import { waitForTransition } from './../helpers/transition.js';
import Popper from './../popper/popper.js';

/**
 * @typedef {object} DropdownOptions
 * @property {'dynamic'|'static'} [display='dynamic'] The positioning mode.
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
 * @augments {BaseComponent<DropdownOptions>}
 */
export default class Dropdown extends BaseComponent {
    /** @type {DropdownOptions} */
    static defaults = {
        display: 'dynamic',
        placement: 'bottom',
        position: 'start',
        fixed: false,
        spacing: 3,
        minContact: false,
    };

    #display;
    #menuNode;
    #popper;
    #referenceNode;
    #transitioning;

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
        const focusNode = $.findOne('.dropdown-item:not(:disabled, .disabled, [tabindex="-1"])', this.#menuNode);
        $.focus(focusNode);
    }

    /**
     * Hides the dropdown menu.
     */
    hide() {
        if (
            this.#transitioning ||
            !$.hasClass(this.#menuNode, 'show') ||
            !$.triggerOne(this.node, 'hide.ui.dropdown')
        ) {
            return;
        }

        this.#transitioning = true;

        // Keep the menu rendered until the opacity transition finishes.
        $.setStyle(this.#menuNode, { display: 'block' });
        $.removeClass(this.#menuNode, 'show');

        waitForTransition(this.#menuNode, ['opacity'], {
            toggle: this.node,
        }).then(({ node, toggle }) => {
            this.#transitioning = false;

            if (this.#popper) {
                this.#popper.dispose();
                this.#popper = null;
            }

            $.setStyle(node, { display: '' });
            $.setAttribute(toggle, { 'aria-expanded': false });
            $.triggerEvent(toggle, 'hidden.ui.dropdown');
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
            this.#transitioning ||
            $.hasClass(this.#menuNode, 'show') ||
            !$.triggerOne(this.node, 'show.ui.dropdown')
        ) {
            return;
        }

        this.#transitioning = true;

        // Render and commit the hidden menu before starting the transition.
        $.setStyle(this.#menuNode, { display: 'block' });
        $.css(this.#menuNode, 'opacity');
        $.addClass(this.#menuNode, 'show');

        // The show class now owns the menu's display state.
        $.setStyle(this.#menuNode, { display: '' });

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

        waitForTransition(this.#menuNode, ['opacity'], {
            toggle: this.node,
        }).then(({ toggle }) => {
            this.#transitioning = false;

            $.setAttribute(toggle, { 'aria-expanded': true });
            $.triggerEvent(toggle, 'shown.ui.dropdown');
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
