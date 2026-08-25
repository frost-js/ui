import BaseComponent from './../base-component.js';
import { $ } from './../globals.js';
import { getTargetSelector } from './../helpers/target.js';
import { waitForTransition } from './../helpers/transition.js';

/**
 * @typedef {object} CollapseOptions
 * @property {string} [parent] The selector for an accordion parent.
 */

/**
 * Controls a collapsible element and its triggers.
 * @extends {BaseComponent<CollapseOptions>}
 */
export default class Collapse extends BaseComponent {
    #parent;
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
        this.#triggers = null;
        this.#parent = null;

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

        this.#transitioning = true;

        const dimension = this.#getDimension();

        $.setStyle(this.node, { [dimension]: $.rect(this.node)[dimension] });

        // Commit the expanded starting dimension before collapsing the node.
        $.css(this.node, dimension);

        $.addClass(this.node, 'collapsing');
        $.removeClass(this.node, 'collapse show');
        $.addClass(this.#triggers, 'collapsed');
        $.setStyle(this.node, { [dimension]: 0 });

        waitForTransition(this.node, [dimension], {
            triggers: this.#triggers,
        }).then(({ node, triggers }) => {
            this.#transitioning = false;

            $.removeClass(node, 'collapsing');
            $.addClass(node, 'collapse');
            $.setStyle(node, { [dimension]: '' });
            $.setAttribute(triggers, { 'aria-expanded': false });
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

        this.#transitioning = true;

        const dimension = this.#getDimension();

        $.removeClass(this.node, 'collapse');
        $.addClass(this.node, 'collapsing');
        $.setStyle(this.node, { [dimension]: 0 });
        $.removeClass(this.#triggers, 'collapsed');

        // Reading the full size commits the collapsed starting dimension.
        const size = $[dimension](this.node, { boxSize: $.SCROLL_BOX });
        $.setStyle(this.node, { [dimension]: size });

        waitForTransition(this.node, [dimension], {
            triggers: this.#triggers,
        }).then(({ node, triggers }) => {
            this.#transitioning = false;

            $.removeClass(node, 'collapsing');
            $.addClass(node, 'collapse show');
            $.setStyle(node, { [dimension]: '' });
            $.setAttribute(triggers, { 'aria-expanded': true });
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

    /**
     * Gets the dimension used for the collapse transition.
     * @returns {'height'|'width'} The dimension.
     */
    #getDimension() {
        return $.hasClass(this.node, 'collapse-horizontal') ?
            'width' :
            'height';
    }
}
