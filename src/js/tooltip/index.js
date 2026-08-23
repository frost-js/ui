import { $ } from './../globals.js';
import { initComponent } from './../helpers.js';
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

// Tooltip init
initComponent('tooltip', Tooltip);

export default Tooltip;
