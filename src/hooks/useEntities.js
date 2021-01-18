import _ from 'lodash';
import { useState } from 'react';
import { useMountedState, useMount } from 'react-use';
import useEntityService from './useEntityService';

/*
    Given an entity returns an array of all the items that exists in the
    database for that entity, including their human readable primary key.
*/
export default function useEntities(entity, disableFetch = false) {
    const isMounted = useMountedState();
    const [state, setState] = useState({
        loading: false,
        error: false,
        items: [],
    });
    const entityService = useEntityService(entity);
    const service = _.get(entityService, 'service');
    const identifierKey = _.get(entityService, 'identifierKey', '');
    useMount(async () => {
        if (_.eq(disableFetch, true)) return;
        if (!_.isNil(service)) {
            if (isMounted()) {
                setState({
                    ...state,
                    loading: true,
                });
            }
            try {
                const items = await service.get();
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
    };
}
