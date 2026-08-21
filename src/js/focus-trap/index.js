import { initComponent } from './../helpers.js';
import FocusTrap from './focus-trap.js';

// FocusTrap default options
FocusTrap.defaults = {
    autoFocus: true,
};

// FocusTrap init
initComponent('focustrap', FocusTrap);

export default FocusTrap;
