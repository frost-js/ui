/** @import { PopoverOptions } from './popover.js'; */

import { $ } from './../globals.js';
import { initComponent } from './../helpers/component.js';
import Popover from './popover.js';

/** @type {PopoverOptions} */
Popover.defaults = {
    template: '<div class="popover" role="tooltip">' +
        '<div class="popover-arrow"></div>' +
        '<h3 class="popover-header"></h3>' +
        '<div class="popover-body"></div>' +
        '</div>',
    customClass: null,
    animation: true,
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
};

initComponent('popover', Popover);

export default Popover;
