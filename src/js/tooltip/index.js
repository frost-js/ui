import { $ } from './../globals.js';
import { initComponent } from './../helpers.js';
import { _events } from './prototype/events.js';
import { _show, _stop } from './prototype/helpers.js';
import { _render } from './prototype/render.js';
import Tooltip from './tooltip.js';

// Tooltip default options
Tooltip.defaults = {
    template: '<div class="tooltip" role="tooltip">' +
        '<div class="tooltip-arrow"></div>' +
        '<div class="tooltip-inner"></div>' +
        '</div>',
    customClass: null,
    duration: 100,
    enable: true,
    html: false,
    trigger: 'hover focus',
    appendTo: null,
    sanitize: (input) => $.sanitize(input),
    placement: 'auto',
    position: 'center',
    fixed: false,
    spacing: 2,
    minContact: false,
    noAttributes: false,
};

// Tooltip prototype
const proto = Tooltip.prototype;

proto._events = _events;
proto._render = _render;
proto._show = _show;
proto._stop = _stop;

// Tooltip init
initComponent('tooltip', Tooltip);

export default Tooltip;
