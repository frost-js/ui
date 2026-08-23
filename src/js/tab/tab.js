import BaseComponent from './../base-component.js';
import { $ } from './../globals.js';
import { getTargetSelector } from './../helpers.js';

/**
 * Tab Class
 * @class
 */
export default class Tab extends BaseComponent {
    #siblings;
    #target;

    /**
     * New Tab constructor.
     * @param {HTMLElement} node The input node.
     * @param {object} [options] The options to create the Tab with.
     */
    constructor(node, options) {
        super(node, options);

        const selector = getTargetSelector(this.node);
        this.#target = $.findOne(selector);
        this.#siblings = $.siblings(this.node);
    }

    /**
     * Dispose the Tab.
     */
    dispose() {
        this.#target = null;
        this.#siblings = null;

        super.dispose();
    }

    /**
     * Hide the current Tab.
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
     * Hide any active Tabs, and show the current Tab.
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
     * Hide the current Tab (forcefully).
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
     * Show the current Tab (forcefully).
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
