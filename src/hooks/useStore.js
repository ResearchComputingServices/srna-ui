import { useSelector } from 'react-redux';
import _ from 'lodash';

export default function useStore(selector, equality) {
    const store = useSelector(
        _.isFunction(selector)
            ? selector
            : state => (!_.isArray(selector) ? state[selector] : _.pick(state, selector)),
        equality,
    );
    return store || {};
}
