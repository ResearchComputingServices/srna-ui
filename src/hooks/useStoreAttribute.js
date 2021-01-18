import _ from 'lodash';
import { shallowEqual, useSelector } from 'react-redux';

// Makes a shallow comparison, which means using this hook will prevent component from re rendering when store attribute changes with the same value.
export default function useStoreData(store, attribute) {
    return useSelector(state => _.get(state, [store, attribute]), shallowEqual);
}
