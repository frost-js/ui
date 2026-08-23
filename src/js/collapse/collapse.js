import BaseComponent from './../base-component.js';
import { $ } from './../globals.js';
import { getTargetSelector } from './../helpers/target.js';

/** @typedef {import('../popper/popper.js').Direction} Direction */

/**
 * @typedef {object} CollapseOptions
 * @property {Direction} [direction='bottom'] The collapse direction.
 * @property {number} [duration=250] The transition duration in milliseconds.
 * @property {string|null} [parent=null] The selector for an accordion parent.
 */

/**
 * Controls a collapsible element and its triggers.
 * @extends {BaseComponent<CollapseOptions>}
 */
export default class Collapse extends BaseComponent {
    #parent;
    #triggers;

    /**
     * Creates a Collapse.
     * @param {HTMLElement} node The input node.
     * @param {CollapseOptions} [options] The collapse options.
     */
    constructor(node, options) {
        super(node, options);

        this.#triggers = $.find('[data-ui-toggle="collapse"]')
            .filter((trigger) => {
                const selector = getTargetSelector(trigger);
                return selector && $.is(this.node, selector);
            });

        if (this.options.parent) {
            this.#parent = $.closest(this.node, this.options.parent).shift();
        }
    }

    /** @inheritdoc */
    dispose() {
        this.#triggers = null;
        this.#parent = null;

        super.dispose();
    }

    /**
     * Hides the collapsible element.
     */
    hide() {
        if (
            $.getDataset(this.node, 'uiAnimating') ||
            !$.hasClass(this.node, 'show') ||
            !$.triggerOne(this.node, 'hide.ui.collapse')
        ) {
            return;
        }

        $.setDataset(this.node, { uiAnimating: 'out' });
        $.addClass(this.#triggers, 'collapsed');
        $.addClass(this.#triggers, 'collapsing');

        $.squeezeOut(this.node, {
            direction: this.options.direction,
            duration: this.options.duration,
        }).then((_) => {
            $.removeClass(this.node, 'show');
            $.removeClass(this.#triggers, 'collapsing');
            $.setAttribute(this.#triggers, { 'aria-expanded': false });
            $.removeDataset(this.node, 'uiAnimating');
            $.triggerEvent(this.node, 'hidden.ui.collapse');
        }).catch((_) => {
            if ($.getDataset(this.node, 'uiAnimating') === 'out') {
                $.removeDataset(this.node, 'uiAnimating');
            }
        });
    }

    /**
     * Shows the collapsible element.
     */
    show() {
        if (
            $.getDataset(this.node, 'uiAnimating') ||
            $.hasClass(this.node, 'show')
        ) {
            return;
        }

        const collapses = [];
        if (this.#parent) {
            const siblings = $.find('.collapse.show', this.#parent);

            for (const sibling of siblings) {
                const collapse = this.constructor.init(sibling);

                if (!$.isSame(this.#parent, collapse.#parent)) {
                    continue;
                }

                collapses.push(collapse);
            }
        }

        if (!$.triggerOne(this.node, 'show.ui.collapse')) {
            return;
        }

        for (const collapse of collapses) {
            collapse.hide();
        }

        $.setDataset(this.node, { uiAnimating: 'in' });
        $.addClass(this.node, 'show');
        $.removeClass(this.#triggers, 'collapsed');
        $.addClass(this.#triggers, 'collapsing');

        $.squeezeIn(this.node, {
            direction: this.options.direction,
            duration: this.options.duration,
        }).then((_) => {
            $.removeClass(this.#triggers, 'collapsing');
            $.setAttribute(this.#triggers, { 'aria-expanded': true });
            $.removeDataset(this.node, 'uiAnimating');
            $.triggerEvent(this.node, 'shown.ui.collapse');
        }).catch((_) => {
            if ($.getDataset(this.node, 'uiAnimating') === 'in') {
                $.removeDataset(this.node, 'uiAnimating');
            }
        });
    }

    /**
     * Toggles the collapsible element.
     */
    toggle() {
        if ($.hasClass(this.node, 'show')) {
            this.hide();
        } else {
            this.show();
        }
    }
}
