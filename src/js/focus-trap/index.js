import { initComponent } from './../helpers/component.js';
import FocusTrap from './focus-trap.js';

/** @type {import('./focus-trap.js').FocusTrapOptions} */
FocusTrap.defaults = {
    autoFocus: true,
};

initComponent('focustrap', FocusTrap);

export default FocusTrap;
