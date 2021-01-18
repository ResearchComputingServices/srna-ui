import _ from 'lodash';
import { useState } from 'react';
import { useMountedState, useMount } from 'react-use';
import useEntityService from './useEntityService';

/*
    Given an entity returns an array of all the items that exists in the database for that entity,
    including their human readable primary key. if the array contains 25 items then nothing is returned.
*/
export default function useTypeahead(entity, defaultValue, options) {
    const itemLimit = 25;
    const isMounted = useMountedState();
    const [state, setState] = useState({
        loading: false,
        error: false,
        items: [],
    });
    const entityService = useEntityService(entity);
    const service = _.get(entityService, 'service');
    const identifierKey = _.get(entityService, 'identifierKey', 'name');
    const queryTransformer = _.get(entityService, 'queryTransformer');
    const disabled = _.get(options, 'disabled', false);
    const query = _.get(options, 'query', {});
    const onTypeahead = _.debounce(async data => {
        if (_.isEmpty(data)) return;
        if (_.isNil(service)) return;
        setState({
            ...state,
            loading: true,
        });
        if (_.isFunction(queryTransformer)) {
            data = queryTransformer(data);
        }
        let item = await service.get({
            [identifierKey]: data,
            ...query,
        });
        if (!_.isEmpty(item)) {
            if (_.isArray(item)) {
                [item] = item;
            }
            const itemInItems = _.some(state.items, stateItem => _.isEqual(item, stateItem));
            if (!itemInItems) {
                const newItems = [...state.items, item];
                return setState({
                    ...state,
                    items: newItems,
                    loading: false,
                });
            }
        }
        return setState({
            ...state,
            loading: false,
        });
    }, 500, {
        leading: false,
        trailing: true,
    });
    useMount(async () => {
        if (_.eq(disabled, true)) return;
        if (!_.isNil(service)) {
            if (isMounted()) {
                setState({
                    ...state,
                    loading: true,
                });
            }
            try {
                const { count } = await service.count({ ...query });
                let items = [];
                if (!_.isNil(defaultValue)) {
                    items = _.isArray(defaultValue) ? [..._.compact(defaultValue)] : [defaultValue];
                }
                if (count <= itemLimit) {
                    items = await service.get({ ...query });
                }
                if (isMounted()) {
                    return setState({
                        ...state,
                        loading: false,
                        items,
                    });
                }
            } catch (err) {
                if (isMounted()) {
                    return setState({
                        ...state,
                        loading: false,
                        error: true,
                    });
                }
            }
        }
    });
    return {
        ...state,
        identifierKey,
        onTypeahead,
    };
}
