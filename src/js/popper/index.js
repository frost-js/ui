import { initComponent } from './../helpers.js';
import Popper from './popper.js';

// Popper default options
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
    noAttributes: false,
};

// Popper init
initComponent('popper', Popper);

// Popper events
export default Popper;
