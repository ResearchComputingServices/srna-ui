import { useDispatch } from 'react-redux';
import _ from 'lodash';
import { actions as storeActions } from '../redux/slices';

export default function useActions(storeName) {
    let actions = storeActions[storeName];
    const dispatch = useDispatch();
    actions = _.reduce(actions, (accumulator, functionDefinition, functionName) => {
        accumulator[functionName] = (...args) => dispatch(functionDefinition(...args));
        return accumulator;
    }, {});
    return actions || {};
}
