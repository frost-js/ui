import { expect, test } from '#test';

test.describe('FocusTrap', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate(() => {
            $.setHtml(document.body,
                '<div id="first"><button id="first-button" type="button">First</button></div>' +
                '<div id="second"><button id="second-button" type="button">Second</button></div>' +
                '<button id="outside" type="button">Outside</button>',
            );
        });
    });

    test.describe('#dispose', () => {
        test('preserves another active trap and consumer document listeners', async ({ page }) => {
            const state = await page.evaluate(() => {
                const events = [];
                $.addEvent(document, 'focusin.ui.focustrap keydown.ui.focustrap', (event) => events.push(event.type));

                const first = UI.FocusTrap.init($.findOne('#first'), { autoFocus: false });
                const second = UI.FocusTrap.init($.findOne('#second'), { autoFocus: false });
                first.activate();
                second.activate();
                first.dispose();

                $.focus('#outside');
                const trapped = document.activeElement.id;

                second.dispose();
                second.dispose();
                events.length = 0;
                $.triggerEvent(document, 'focusin.ui.focustrap keydown.ui.focustrap');
                const remainingEvents = [...events];
                $.focus('#outside');

                return { trapped, remainingEvents, focused: document.activeElement.id };
            });

            expect(state).toEqual({
                trapped: 'second-button',
                remainingEvents: ['focusin', 'keydown'],
                focused: 'outside',
            });
        });
    });
});
