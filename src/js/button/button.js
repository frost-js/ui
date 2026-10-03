import BaseComponent from '../base-component.js';
import { $ } from '../globals.js';

/**
 * Controls the pressed state of a toggle button.
 */
export default class Button extends BaseComponent {
    /**
     * Toggles the button state.
     */
    toggle() {
        $.toggleClass(this.node, 'active');

        const active = $.hasClass(this.node, 'active');
        $.setAttribute(this.node, { 'aria-pressed': active });
    }
}
