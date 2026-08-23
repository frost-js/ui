import BaseComponent from './../base-component.js';
import { $ } from './../globals.js';
import { getTargetSelector } from './../helpers.js';

/**
 * Collapse Class
 * @class
 */
export default class Collapse extends BaseComponent {
    #parent;
    #triggers;

    /**
     * New Collapse constructor.
     * @param {HTMLElement} node The input node.
     * @param {object} [options] The options to create the Collapse with.
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

    /**
     * Dispose the Collapse.
     */
    dispose() {
        this.#triggers = null;
        this.#parent = null;

        super.dispose();
    }

    /**
     * Hide the element.
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
     * Show the element.
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
     * Toggle the element.
     */
    toggle() {
        if ($.hasClass(this.node, 'show')) {
            this.hide();
        } else {
            this.show();
        }
    }
}
