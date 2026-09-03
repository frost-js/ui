import { $, document } from './../globals.js';
import { initComponent } from './../helpers/component.js';
import { getTarget } from './../helpers/target.js';
import Carousel from './carousel.js';

initComponent('carousel', Carousel);

// Start ride-enabled carousels when the DOM is ready.
$((_) => {
    const nodes = $.find('[data-ui-ride="carousel"]');

    for (const node of nodes) {
        Carousel.init(node);
    }
});

// Move a carousel to its previous or next item.
$.addEventDelegate(document, 'click.ui.carousel', '[data-ui-slide]', (e) => {
    e.preventDefault();

    const target = getTarget(e.currentTarget, '.carousel');
    const carousel = Carousel.init(target);
    const slide = $.getDataset(e.currentTarget, 'uiSlide');

    if (slide === 'prev') {
        carousel.prev();
    } else {
        carousel.next();
    }
});

// Move a carousel directly to the requested item.
$.addEventDelegate(document, 'click.ui.carousel', '[data-ui-slide-to]', (e) => {
    e.preventDefault();

    const target = getTarget(e.currentTarget, '.carousel');
    const carousel = Carousel.init(target);
    const slideTo = $.getDataset(e.currentTarget, 'uiSlideTo');

    carousel.show(slideTo);
});

export default Carousel;
