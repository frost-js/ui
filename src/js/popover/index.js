import { $ } from './../globals.js';
import { initComponent } from './../helpers.js';
import Popover from './popover.js';
import { _events } from './prototype/events.js';
import { _show, _stop } from './prototype/helpers.js';
import { _render } from './prototype/render.js';

// Popover default options
Popover.defaults = {
    template: '<div class="popover" role="tooltip">' +
        '<div class="popover-arrow"></div>' +
        '<h3 class="popover-header"></h3>' +
        '<div class="popover-body"></div>' +
        '</div>',
    customClass: null,
    duration: 100,
    enable: true,
    html: false,
    appendTo: null,
    sanitize: (input) => $.sanitize(input),
    trigger: 'click',
    placement: 'auto',
    position: 'center',
    fixed: false,
    spacing: 3,
    minContact: false,
    noAttributes: false,
};

// Popover prototype
const proto = Popover.prototype;

proto._events = _events;
proto._render = _render;
proto._show = _show;
proto._stop = _stop;

// Popover init
initComponent('popover', Popover);

export default Popover;
