import BaseComponent from './../base-component.js';
import { $ } from './../globals.js';
import { getTargetSelector } from './../helpers/target.js';
import { waitForTransition } from './../helpers/transition.js';
import { getDimension } from './helpers.js';

/**
 * @typedef {object} CollapseOptions
 * @property {string} [parent] The selector for an accordion parent.
 */

/**
 * Controls a collapsible element and its triggers.
 * @augments {BaseComponent<CollapseOptions>}
 */
export default class Collapse extends BaseComponent {
    #parent;
    #releaseDimension;
    #transitioning;
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
        if (this.#transitioning) {
            $.removeClass(this.node, 'collapsing');
            $.addClass(this.node, 'collapse');
        }

        this.#releaseDimension?.();

        this.#parent = null;
        this.#releaseDimension = null;
        this.#transitioning = false;
        this.#triggers = null;

        super.dispose();
    }

    /**
     * Hides the collapsible element.
     */
    hide() {
        if (
            this.#transitioning ||
            !$.hasClass(this.node, 'show') ||
            !$.triggerOne(this.node, 'hide.ui.collapse')
        ) {
            return;
        }

        const dimension = getDimension(this.node);
        const releaseDimension = $.setStyleLock(this.node, dimension, $.rect(this.node)[dimension]);

        this.#releaseDimension = releaseDimension;
        this.#transitioning = true;

        // Commit the expanded starting dimension before collapsing the node.
        $.css(this.node, dimension);

        $.addClass(this.node, 'collapsing');
        $.removeClass(this.node, 'collapse show');
        $.addClass(this.#triggers, 'collapsed');
        $.setStyle(this.node, { [dimension]: 0 });

        waitForTransition(this.node, [dimension], {
            triggers: this.#triggers,
        }).then(({ node, triggers }) => {
            if (!this.node) {
                return;
            }

            $.removeClass(node, 'collapsing');
            $.addClass(node, 'collapse');
            this.#releaseDimension();
            $.setAttribute(triggers, { 'aria-expanded': false });

            this.#releaseDimension = null;
            this.#transitioning = false;

            $.triggerEvent(node, 'hidden.ui.collapse');
        });
    }

    /**
     * Shows the collapsible element.
     */
    show() {
        if (
            this.#transitioning ||
            $.hasClass(this.node, 'show')
        ) {
            return;
        }

        const collapses = [];
        if (this.#parent) {
            const siblings = $.find('.collapse.show, .collapsing', this.#parent);

            for (const sibling of siblings) {
                const collapse = this.constructor.init(sibling);

                if (!$.isSame(this.#parent, collapse.#parent)) {
                    continue;
                }

                if (collapse.#transitioning) {
                    return;
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

        const dimension = getDimension(this.node);
        const releaseDimension = $.setStyleLock(this.node, dimension, 0);

        this.#releaseDimension = releaseDimension;
        this.#transitioning = true;

        $.removeClass(this.node, 'collapse');
        $.addClass(this.node, 'collapsing');
        $.removeClass(this.#triggers, 'collapsed');

        // Reading the full size commits the collapsed starting dimension.
        const size = $[dimension](this.node, { boxSize: $.SCROLL_BOX });
        $.setStyle(this.node, { [dimension]: size });

        waitForTransition(this.node, [dimension], {
            triggers: this.#triggers,
        }).then(({ node, triggers }) => {
            if (!this.node) {
                return;
            }

            $.removeClass(node, 'collapsing');
            $.addClass(node, 'collapse show');
            this.#releaseDimension();
            $.setAttribute(triggers, { 'aria-expanded': true });

            this.#releaseDimension = null;
            this.#transitioning = false;

            $.triggerEvent(node, 'shown.ui.collapse');
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
