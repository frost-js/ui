/** @import { TooltipOptions } from './tooltip.js'; */

import { $ } from './../globals.js';
import { initComponent } from './../helpers/component.js';
import Tooltip from './tooltip.js';

/** @type {TooltipOptions} */
Tooltip.defaults = {
    template: '<div class="tooltip" role="tooltip">' +
        '<div class="tooltip-arrow"></div>' +
        '<div class="tooltip-inner"></div>' +
        '</div>',
    customClass: null,
    animation: true,
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
};

initComponent('tooltip', Tooltip);

export default Tooltip;
