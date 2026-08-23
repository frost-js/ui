import { $, document } from './../globals.js';
import { getTarget, initComponent } from './../helpers.js';
import Carousel from './carousel.js';

// Carousel default options
Carousel.defaults = {
    interval: 5000,
    transition: 500,
    keyboard: true,
    ride: false,
    pause: true,
    wrap: true,
    swipe: true,
};

// Carousel init
initComponent('carousel', Carousel);

// Carousel events
$((_) => {
    const nodes = $.find('[data-ui-ride="carousel"]');

    for (const node of nodes) {
        Carousel.init(node);
    }
});

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

$.addEventDelegate(document, 'click.ui.carousel', '[data-ui-slide-to]', (e) => {
    e.preventDefault();

    const target = getTarget(e.currentTarget, '.carousel');
    const carousel = Carousel.init(target);
    const slideTo = $.getDataset(e.currentTarget, 'uiSlideTo');

    carousel.show(slideTo);
});

export default Carousel;
