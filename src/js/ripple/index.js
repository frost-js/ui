import { $, document } from '../globals.js';
import { waitForTransition } from '../helpers/transition.js';

// Render a click-centered ripple animation.
$.addEventDelegate(document, 'click.ui.ripple', '.ripple', (event) => {
    if (event.button !== 0) {
        return;
    }

    const target = event.currentTarget;
    const pos = $.position(target, { offset: true });

    const width = $.width(target);
    const height = $.height(target);
    const scaleMultiple = Math.max(width, height);

    const isFixed = $.isFixed(target);
    const mouseX = isFixed ? event.clientX : event.pageX;
    const mouseY = isFixed ? event.clientY : event.pageY;

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
    $.setStyle(ripple, { '--ui-ripple-scale': scaleMultiple });
    $.append(target, ripple);

    // Commit the initial scale before starting the transition.
    $.css(ripple, 'transform');
    $.addClass(ripple, 'show');

    waitForTransition(ripple, ['transform', 'opacity']).then(({ node }) => {
        $.detach(node);
    });
});
