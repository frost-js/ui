import BaseComponent from './../base-component.js';
import { $ } from './../globals.js';
import { getTargetSelector } from './../helpers.js';

/**
 * Tab Class
 * @class
 */
export default class Tab extends BaseComponent {
    /**
     * New Tab constructor.
     * @param {HTMLElement} node The input node.
     * @param {object} [options] The options to create the Tab with.
     */
    constructor(node, options) {
        super(node, options);

        const selector = getTargetSelector(this.node);
        this._target = $.findOne(selector);
        this._siblings = $.siblings(this.node);
    }

    /**
     * Hide the current Tab (forcefully).
     */
    _hide() {
        $.setDataset(this._target, { uiAnimating: 'out' });

        $.fadeOut(this._target, {
            duration: this.options.duration,
        }).then((_) => {
            $.removeClass(this._target, 'active');
            $.removeClass(this.node, 'active');
            $.removeDataset(this._target, 'uiAnimating');
            $.setAttribute(this.node, { 'aria-selected': false });
            $.triggerEvent(this.node, 'hidden.ui.tab');
        }).catch((_) => {
            if ($.getDataset(this._target, 'uiAnimating') === 'out') {
                $.removeDataset(this._target, 'uiAnimating');
            }
        });
    }

    /**
     * Show the current Tab (forcefully).
     */
    _show() {
        $.setDataset(this._target, { uiAnimating: 'in' });

        $.addClass(this._target, 'active');
        $.addClass(this.node, 'active');

        $.fadeIn(this._target, {
            duration: this.options.duration,
        }).then((_) => {
            $.setAttribute(this.node, { 'aria-selected': true });
            $.removeDataset(this._target, 'uiAnimating');
            $.triggerEvent(this.node, 'shown.ui.tab');
        }).catch((_) => {
            if ($.getDataset(this._target, 'uiAnimating') === 'in') {
                $.removeDataset(this._target, 'uiAnimating');
            }
        });
    }

    /**
     * Dispose the Tab.
     */
    dispose() {
        this._target = null;
        this._siblings = null;

        super.dispose();
    }

    /**
     * Hide the current Tab.
     */
    hide() {
        if (
            $.getDataset(this._target, 'uiAnimating') ||
            !$.hasClass(this._target, 'active') ||
            !$.triggerOne(this.node, 'hide.ui.tab')
        ) {
            return;
        }

        this._hide();
    }

    /**
     * Hide any active Tabs, and show the current Tab.
     */
    show() {
        if (
            $.getDataset(this._target, 'uiAnimating') ||
            $.hasClass(this._target, 'active') ||
            !$.triggerOne(this.node, 'show.ui.tab')
        ) {
            return;
        }

        const active = this._siblings.find((sibling) =>
            $.hasClass(sibling, 'active'),
        );

        if (!active) {
            this._show();
        } else {
            const activeTab = this.constructor.init(active);

            if ($.getDataset(activeTab._target, 'uiAnimating')) {
                return;
            }

            if (!$.triggerOne(active, 'hide.ui.tab')) {
                return;
            }

            $.addEventOnce(active, 'hidden.ui.tab', (_) => {
                this._show();
            });

            activeTab._hide();
        }
    }
}
