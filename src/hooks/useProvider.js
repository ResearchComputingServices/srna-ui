import _ from 'lodash';
import * as providers from '../providers';
import usePluralize from './usePluralize';

export default function useService(...args) {
    let name = null;
    if (args.length > 1) {
        name = args;
    } else {
        [name] = args;
    }
    const pluralize = usePluralize(name);
    if (_.isArray(name)) {
        const names = name;
        return _.map(names, name => providers[pluralize.singular(name)]);
    }
    name = pluralize.singular(name);
    return providers[name];
}
