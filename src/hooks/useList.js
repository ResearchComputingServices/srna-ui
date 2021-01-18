import { useState, useEffect } from 'react';
import _ from 'lodash';
import useService from './useService';

export default function useList(entity, options) {
    const format = _.get(options, 'format');
    const exclude = _.get(options, 'exclude');
    const [pageSize] = useState(5);
    const [page, setPage] = useState(1);
    const service = useService(entity);
    const additionalDependencies = _.get(options, 'dependencies', []);

    const getInitialState = () => ({
        loading: false,
        error: false,
        data: [],
        count: 1,
    });

    const [state, setState] = useState(getInitialState());

    const startFetch = () => setState(prevState => ({
        ...prevState,
        loading: true,
        error: false,
    }));

    const initialize = data => setState(() => data);

    const reset = () => setState(() => getInitialState());

    const setError = () => setState(prevState => ({
        ...prevState,
        error: true,
    }));

    const endFetch = () => setState(prevState => ({
        ...prevState,
        loading: false,
    }));

    const onPaginationChange = newPage => {
        if (!_.eq(page, newPage)) {
            setPage(newPage);
        }
    };

    const fetchData = async () => {
        startFetch();
        try {
            const customQuery = _.get(options, 'query', {});
            const { count } = await service.count(customQuery);
            // This case handles a case when we remove an element from the system when totalNumberOfRecords % pageSize === 1.
            if (page > Math.ceil(count / pageSize) && page !== 1) {
                return setPage(page - 1);
            }
            const data = await service.get({
                offset: (page - 1) * pageSize,
                limit: pageSize,
                ...customQuery,
            });
            const initialData = {
                data: _.map(data, datum => {
                    if (_.isFunction(format)) {
                        const formattedDatum = format(datum);
                        if (_.isObject(formattedDatum)) {
                            datum = formattedDatum;
                        }
                    }
                    return _.omit(datum, exclude);
                }),
                count: Math.ceil(count / pageSize) || 1,
            };
            initialize(initialData);
        } catch (err) {
            reset();
            setError(_.get(err, 'response.status', true) || true);
        } finally {
            endFetch();
        }
    };

    // We only fetch data if page changes or the entity changes.
    // Initially when this component mounts, there will always be a change in page.
    // Some components also provide support to change the entity after it has mounted, so when that happens we should fetch the data.
    useEffect(() => {
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entity, page, ...additionalDependencies]);

    return {
        ...state,
        service,
        onPaginationChange,
        pageSize,
        fetchData,
        page,
    };
}
