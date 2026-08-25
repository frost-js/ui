import { expect, test } from '@playwright/test';
import { resetPage } from '../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('BaseComponent', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML = '<div class="alert" id="alert1"></div>';
        });
    });

    test('exposes the component node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const node = $.findOne('#alert1');
            const alert = UI.Alert.init(node);
            return alert.node === node;
        })).toBe(true);
    });

    test('exposes frozen merged options', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const node = $.findOne('#alert1');
            const toast = UI.Toast.init(node, { autohide: false });
            return {
                autohide: toast.options.autohide,
                frozen: Object.isFrozen(toast.options),
            };
        })).toEqual({
            autohide: false,
            frozen: true,
        });
    });

    test('clears the node and options when disposed', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const node = $.findOne('#alert1');
            const alert = UI.Alert.init(node);
            alert.dispose();
            return {
                node: alert.node,
                options: alert.options,
            };
        })).toEqual({
            node: null,
            options: null,
        });
    });

    test('clears the node and options when removed', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const node = $.findOne('#alert1');
            const alert = UI.Alert.init(node);
            $.remove(node);
            return {
                node: alert.node,
                options: alert.options,
            };
        })).toEqual({
            node: null,
            options: null,
        });
    });
});
