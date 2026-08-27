/** @import { FocusTrapOptions } from './focus-trap.js'; */

import { initComponent } from './../helpers/component.js';
import FocusTrap from './focus-trap.js';

/** @type {FocusTrapOptions} */
FocusTrap.defaults = {
    autoFocus: true,
};

initComponent('focustrap', FocusTrap);

export default FocusTrap;
