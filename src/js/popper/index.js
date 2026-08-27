/** @import { PopperOptions } from './popper.js'; */

import { initComponent } from './../helpers/component.js';
import Popper from './popper.js';

/** @type {PopperOptions} */
Popper.defaults = {
    reference: null,
    container: null,
    arrow: null,
    afterUpdate: null,
    beforeUpdate: null,
    placement: 'bottom',
    position: 'center',
    fixed: false,
    spacing: 0,
    minContact: null,
    useGpu: true,
};

initComponent('popper', Popper);

export default Popper;
