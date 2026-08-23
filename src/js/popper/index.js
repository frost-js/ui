import { initComponent } from './../helpers/component.js';
import Popper from './popper.js';

/** @type {import('./popper.js').PopperOptions} */
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

initComponent('popper', Popper);

export default Popper;
