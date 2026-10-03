/** @import { Page } from '@playwright/test'; */

/**
 * Measure the current browser's native scrollbar size.
 * @param {Page} page The Playwright page.
 * @returns {Promise<number>} The scrollbar size in pixels.
 */
export async function measureScrollbarSize(page) {
    return page.evaluate(() => {
        const node = $.create('div', {
            style: {
                height: '100px',
                overflow: 'scroll',
                position: 'absolute',
                top: '-9999px',
                width: '100px',
            },
        });
        $.append(document.body, node);

        const size = node.offsetWidth - node.clientWidth;

        $.remove(node);

        return size;
    });
}
