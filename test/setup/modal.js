/** @import { Page } from '@playwright/test'; */

/**
 * Sets up modal fixtures.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await page.evaluate(() => {
        document.body.innerHTML = `
            <button class="btn btn-secondary" id="modal-toggle-1" data-ui-toggle="modal" data-ui-target="#modal1" type="button"></button>
            <button class="btn btn-secondary" id="modal-toggle-2" data-ui-toggle="modal" data-ui-target="#modal2" type="button"></button>
            <div class="modal" id="modal1">
                <div class="modal-dialog" id="modal-dialog-1">
                    <button class="btn-close" id="button1" data-ui-dismiss="modal" type="button"></button>
                </div>
            </div>
            <div class="modal" id="modal2">
                <div class="modal-dialog" id="modal-dialog-2">
                    <button class="btn-close" id="button2" data-ui-dismiss="modal" type="button"></button>
                </div>
            </div>
        `;
    });
};
