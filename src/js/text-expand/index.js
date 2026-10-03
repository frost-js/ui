import { $, document } from '../globals.js';

// Resize expanding text areas as their content changes.
$.addEventDelegate(document, 'change.ui.expand input.ui.expand', '.text-expand', (event) => {
    const textArea = event.currentTarget;

    $.setStyle(textArea, { height: 'inherit' });

    let newHeight = $.height(textArea, { boxSize: $.SCROLL_BOX });
    newHeight += Number.parseInt($.css(textArea, 'borderTop'));
    newHeight += Number.parseInt($.css(textArea, 'borderBottom'));

    $.setStyle(textArea, { height: `${newHeight}px` });
});
