import * as fs from 'fs';
import assert from 'node:assert/strict';
import * as path from 'path';
import puppeteer from 'puppeteer';
import * as server from './../server/server.js';

const port = 3001;

let browser; let page;

before(async function() {
    this.timeout(30000);

    await server.start(port);

    browser = await puppeteer.launch({
        args: [
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--disable-setuid-sandbox',
            '--no-first-run',
            '--no-sandbox',
            '--no-zygote',
            '--single-process',
        ],
        ignoreDefaultArgs: [
            '--hide-scrollbars',
        ],
    });

    const context = browser.defaultBrowserContext();
    context.overridePermissions('http://localhost:3001', ['clipboard-read']);

    page = await browser.newPage();

    await page.goto('http://localhost:3001', {
        waitUntil: 'domcontentloaded',
    });

    await page.setViewport({
        width: 800,
        height: 600,
        deviceScaleFactor: 1,
        isMobile: false,
    });

    await page.emulateMediaFeatures([
        {
            name: 'prefers-reduced-motion',
            value: 'reduce',
        },
    ]);

    assert.strictEqual(
        await page.evaluate((_) => {
            return UI.Carousel.defaults.interval;
        }),
        5000,
    );

    assert.strictEqual(
        await page.evaluate((_) => {
            return UI.Carousel.defaults.transition;
        }),
        500,
    );

    assert.strictEqual(
        await page.evaluate((_) => {
            return UI.Collapse.defaults.duration;
        }),
        250,
    );

    assert.strictEqual(
        await page.evaluate((_) => {
            return UI.Popover.defaults.noAttributes;
        }),
        false,
    );

    assert.strictEqual(
        await page.evaluate((_) => {
            return UI.Toast.defaults.delay;
        }),
        5000,
    );

    assert.strictEqual(
        await page.evaluate((_) => {
            return UI.Tooltip.defaults.noAttributes;
        }),
        false,
    );

    await page.evaluate((_) => {
        Animation.useTimeout = true;
        UI.Carousel.defaults.interval = 200;
        UI.Carousel.defaults.transition = 100;
        UI.Collapse.defaults.duration = 100;
        UI.Popover.defaults.noAttributes = true;
        UI.Toast.defaults.delay = 200;
        UI.Tooltip.defaults.noAttributes = true;
    });
});

beforeEach(async function() {
    this.timeout(30000);

    await page.evaluate((_) => {
        $.empty(document.body);
        $.setHTML(
            document.head,
            '<link rel="stylesheet" href="assets/frost-ui.css">',
        );
        UI._clickTarget = null;
    });

    await page.waitForFunction((_) => {
        const test = $.create('div', { class: 'text-center' });
        $.append(document.body, test);
        const result = $.css(test, 'textAlign') === 'center';
        $.detach(test);
        return result;
    });
});

after(async function() {
    this.timeout(30000);

    await page.close();
    await browser.close();
    await server.close();
});

/**
 * Execute a callback in the document.
 * @param {function} callback The callback to execute.
 * @param {array} [data] The data to provide to the callback.
 * @return {Promise} The promise.
 */
export async function exec(callback, data) {
    return await page.evaluate(callback, data);
};

/**
 * Take a screenshot of the document.
 * @param {string} filePath
 * @param {string} [type=jpeg]
 * @param {string} [fullPage=false]
 */
export async function screenshot(filePath, type = 'jpeg', fullPage = false) {
    const dir = path.dirname(filePath);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    await page.screenshot({ path: filePath, type, fullPage });
};
