import { $, document } from './../globals.js';
import { getTarget, initComponent } from './../helpers.js';
import Carousel from './carousel.js';
import { _events } from './prototype/events.js';
import { _resetStyles, _setIndex, _setTimer, _show, _update, _updateIndicators } from './prototype/helpers.js';

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

// Carousel prototype
const proto = Carousel.prototype;

proto._events = _events;
proto._resetStyles = _resetStyles;
proto._setIndex = _setIndex;
proto._setTimer = _setTimer;
proto._show = _show;
proto._update = _update;
proto._updateIndicators = _updateIndicators;

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
