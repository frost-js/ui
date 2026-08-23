import BaseComponent from './../base-component.js';
import { $ } from './../globals.js';

/**
 * Button Class
 * @class
 */
export default class Button extends BaseComponent {
    /**
     * Toggle the Button.
     */
    toggle() {
        $.toggleClass(this.node, 'active');

        const active = $.hasClass(this.node, 'active');
        $.setAttribute(this.node, { 'aria-pressed': active });
    }
}
