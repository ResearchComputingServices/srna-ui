import _ from 'lodash';
import usePluralize from './usePluralize';
import * as gridColumns from '../config/gridColumns';

export default function(name) {
    const pluralize = usePluralize();
    // Clone deep is necessary as we webpack import imports all the modules at the top, leaving objects to be mutable.
    return _.cloneDeep(gridColumns[pluralize.plural(name)]);
}
