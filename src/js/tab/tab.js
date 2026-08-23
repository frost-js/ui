import BaseComponent from './../base-component.js';
import { $ } from './../globals.js';
import { getTargetSelector } from './../helpers/target.js';

/**
 * @typedef {object} TabOptions
 * @property {number} [duration=100] The transition duration in milliseconds.
 */

/**
 * Controls a tab trigger and its associated panel.
 * @extends {BaseComponent<TabOptions>}
 */
export default class Tab extends BaseComponent {
    #siblings;
    #target;

    /**
     * Creates a Tab.
     * @param {HTMLElement} node The input node.
     * @param {TabOptions} [options] The tab options.
     */
    constructor(node, options) {
        super(node, options);

        const selector = getTargetSelector(this.node);
        this.#target = $.findOne(selector);
        this.#siblings = $.siblings(this.node);
    }

    /** @inheritdoc */
    dispose() {
        this.#target = null;
        this.#siblings = null;

        super.dispose();
    }

    /**
     * Hides the current tab.
     */
    hide() {
        if (
            $.getDataset(this.#target, 'uiAnimating') ||
            !$.hasClass(this.#target, 'active') ||
            !$.triggerOne(this.node, 'hide.ui.tab')
        ) {
            return;
        }

        this.#hide();
    }

    /**
     * Hides the active tab and shows the current tab.
     */
    show() {
        if (
            $.getDataset(this.#target, 'uiAnimating') ||
            $.hasClass(this.#target, 'active') ||
            !$.triggerOne(this.node, 'show.ui.tab')
        ) {
            return;
        }

        const active = this.#siblings.find((sibling) =>
            $.hasClass(sibling, 'active'),
        );

        if (!active) {
            this.#show();
        } else {
            const activeTab = this.constructor.init(active);

            if ($.getDataset(activeTab.#target, 'uiAnimating')) {
                return;
            }

            if (!$.triggerOne(active, 'hide.ui.tab')) {
                return;
            }

            $.addEventOnce(active, 'hidden.ui.tab', (_) => {
                this.#show();
            });

            activeTab.#hide();
        }
    }

    /**
     * Hides the current tab without checking its state or events.
     */
    #hide() {
        $.setDataset(this.#target, { uiAnimating: 'out' });

        $.fadeOut(this.#target, {
            duration: this.options.duration,
        }).then((_) => {
            $.removeClass(this.#target, 'active');
            $.removeClass(this.node, 'active');
            $.removeDataset(this.#target, 'uiAnimating');
            $.setAttribute(this.node, { 'aria-selected': false });
            $.triggerEvent(this.node, 'hidden.ui.tab');
        }).catch((_) => {
            if ($.getDataset(this.#target, 'uiAnimating') === 'out') {
                $.removeDataset(this.#target, 'uiAnimating');
            }
        });
    }

    /**
     * Shows the current tab without checking its state or events.
     */
    #show() {
        $.setDataset(this.#target, { uiAnimating: 'in' });

        $.addClass(this.#target, 'active');
        $.addClass(this.node, 'active');

        $.fadeIn(this.#target, {
            duration: this.options.duration,
        }).then((_) => {
            $.setAttribute(this.node, { 'aria-selected': true });
            $.removeDataset(this.#target, 'uiAnimating');
            $.triggerEvent(this.node, 'shown.ui.tab');
        }).catch((_) => {
            if ($.getDataset(this.#target, 'uiAnimating') === 'in') {
                $.removeDataset(this.#target, 'uiAnimating');
            }
        });
    }
}
