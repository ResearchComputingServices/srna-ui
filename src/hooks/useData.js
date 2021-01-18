import { useState, useEffect } from 'react';
import _ from 'lodash';

export default function useData(fetchData, dependencies = []) {
    const [state, setState] = useState({
        error: false,
        loading: false,
    });

    const load = async () => {
        setState({
            loading: true,
            error: false,
        });
        if (_.isFunction(fetchData)) {
            try {
                await fetchData();
            } catch (err) {
                setState({
                    loading: false,
                    error: true,
                });
            } finally {
                setState(prevState => ({
                    ...prevState,
                    loading: false,
                }));
            }
        }
    };
    useEffect(() => {
        load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...dependencies]);
    return [state.loading, state.error];
}
