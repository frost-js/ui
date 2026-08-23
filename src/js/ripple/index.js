import { $, document } from './../globals.js';

// Render a click-centered ripple animation.
$.addEventDelegate(document, 'click.ui.ripple', '.ripple', (e) => {
    if (e.button !== 0) {
        return;
    }

    const target = e.currentTarget;
    const pos = $.position(target, { offset: true });

    const width = $.width(target);
    const height = $.height(target);
    const scaleMultiple = Math.max(width, height);

    const isFixed = $.isFixed(target);
    const mouseX = isFixed ? e.clientX : e.pageX;
    const mouseY = isFixed ? e.clientY : e.pageY;

    const prevRipple = $.findOne(':scope > .ripple-effect', target);

    if (prevRipple) {
        $.remove(prevRipple);
    }

    const ripple = $.create('span', {
        class: 'ripple-effect',
        style: {
            left: mouseX - pos.x,
            top: mouseY - pos.y,
        },
    });
    $.append(target, ripple);

    $.animate(
        ripple,
        (node, progress) => {
            $.setStyle(node, {
                transform: 'scale(' + Math.floor(progress * scaleMultiple) + ')',
                opacity: 1 - Math.pow(progress, 2),
            });
        },
        {
            duration: 500,
        },
    ).finally((_) => {
        $.detach(ripple);
    });
});
