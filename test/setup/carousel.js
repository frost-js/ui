/** @import { Page } from '@playwright/test'; */

/**
 * Sets up carousel fixtures.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await page.evaluate(() => {
        document.body.innerHTML = `
            <div class="carousel" id="carousel1">
                <ol class="carousel-indicators">
                    <li class="active" id="carousel-1-slide-0" data-ui-slide-to="0"></li>
                    <li id="carousel-1-slide-1" data-ui-slide-to="1"></li>
                    <li id="carousel-1-slide-2" data-ui-slide-to="2"></li>
                </ol>
                <div class="carousel-inner">
                    <div class="carousel-item active" id="carousel-1-item-1"></div>
                    <div class="carousel-item" id="carousel-1-item-2"></div>
                    <div class="carousel-item" id="carousel-1-item-3"></div>
                </div>
                <button id="carousel-1-prev" data-ui-slide="prev" type="button"></button>
                <button id="carousel-1-next" data-ui-slide="next" type="button"></button>
            </div>
            <div class="carousel" id="carousel2">
                <ol class="carousel-indicators">
                    <li class="active" id="carousel-2-slide-0" data-ui-slide-to="0"></li>
                    <li id="carousel-2-slide-1" data-ui-slide-to="1"></li>
                    <li id="carousel-2-slide-2" data-ui-slide-to="2"></li>
                </ol>
                <div class="carousel-inner">
                    <div class="carousel-item active" id="carousel-2-item-1"></div>
                    <div class="carousel-item" id="carousel-2-item-2"></div>
                    <div class="carousel-item" id="carousel-2-item-3"></div>
                </div>
                <button id="carousel-2-prev" data-ui-slide="prev" type="button"></button>
                <button id="carousel-2-next" data-ui-slide="next" type="button"></button>
            </div>
        `;
    });
};
