import _ from 'lodash';
import * as services from '../services';
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
        return _.map(names, name => services[pluralize.singular(name)]);
    }
    name = pluralize.singular(name);
    if (name in providers) {
        return providers[name]();
    }
    return services[name];
}
