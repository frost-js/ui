import BaseComponent from './../base-component.js';
import { $ } from './../globals.js';
import { getTargetSelector } from './../helpers/target.js';
import { waitForTransition } from './../helpers/transition.js';

/**
 * Controls a tab trigger and its associated panel.
 */
export default class Tab extends BaseComponent {
    #siblings;
    #target;
    #transition;

    /**
     * Creates a Tab.
     * @param {HTMLElement} node The input node.
     */
    constructor(node) {
        super(node);

        const selector = getTargetSelector(this.node);
        this.#target = $.findOne(selector);
        this.#siblings = $.siblings(this.node);
    }

    /** @inheritdoc */
    dispose() {
        this.#siblings = null;
        this.#target = null;
        this.#transition = null;

        super.dispose();
    }

    /**
     * Hides the current tab.
     */
    hide() {
        if (
            !$.hasClass(this.#target, 'active') ||
            !$.triggerOne(this.node, 'hide.ui.tab')
        ) {
            return;
        }

        this.#hide();
        $.triggerEvent(this.node, 'hidden.ui.tab');
    }

    /**
     * Hides the active tab and shows the current tab.
     */
    show() {
        if ($.hasClass(this.#target, 'active')) {
            return;
        }

        const active = this.#siblings.find((sibling) =>
            $.hasClass(sibling, 'active'),
        );

        const canHide = !active || $.triggerOne(active, 'hide.ui.tab');
        const canShow = $.triggerOne(this.node, 'show.ui.tab');

        if (!canHide || !canShow) {
            return;
        }

        if (active) {
            this.constructor.init(active).#hide();
        }

        this.#show();

        if (active) {
            $.triggerEvent(active, 'hidden.ui.tab');
        }
    }

    /**
     * Hides the current tab without checking its state or events.
     */
    #hide() {
        this.#transition = null;

        $.removeClass(this.#target, 'active show');
        $.removeClass(this.node, 'active');
        $.setAttribute(this.node, { 'aria-selected': false });
    }

    /**
     * Shows the current tab without checking its state or events.
     */
    #show() {
        const transition = {};
        this.#transition = transition;

        $.addClass(this.#target, 'active');
        $.addClass(this.node, 'active');
        $.setAttribute(this.node, { 'aria-selected': true });

        // Commit the rendered hidden panel before starting the transition.
        $.css(this.#target, 'opacity');
        $.addClass(this.#target, 'show');

        const toggleNode = this.node;

        waitForTransition(this.#target, ['opacity']).then((_) => {
            if (this.#transition !== transition) {
                return;
            }

            this.#transition = null;

            $.triggerEvent(toggleNode, 'shown.ui.tab');
        }).finally((_) => {
            if (this.#transition === transition) {
                this.#transition = null;
            }
        });
    }
}
