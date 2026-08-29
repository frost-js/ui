import { $ } from './../globals.js';

/**
 * Gets the tab controls in the same tab list as a control.
 * @param {HTMLElement} node The tab control.
 * @returns {HTMLElement[]} The tab controls.
 */
export function getTabGroup(node) {
    const tabList = $.closest(node, '.nav, [role="tablist"]').shift() ||
        $.parent(node).shift();

    return tabList ?
        $.find('[data-ui-toggle="tab"]', tabList) :
        [node];
};
