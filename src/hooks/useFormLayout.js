import _ from 'lodash';
import * as formLayouts from '../config/formLayouts';

export default function(name) {
    const layout = _.cloneDeep(formLayouts[name]);
    // Clone deep is necessary as we webpack import imports all the modules at the top, leaving objects to be mutable.
    return layout;
}
