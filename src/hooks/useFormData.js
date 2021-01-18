import { useState } from 'react';
import { useMount } from 'react-use';
import _ from 'lodash';
import useService from './useService';

export default function useExistingForm(formName, id, callback) {
    const service = useService(formName);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [data, setData] = useState({});

    const startFetch = () => {
        setError(false);
        setLoading(true);
    };

    const endFetch = () => {
        setLoading(false);
    };

    useMount(async () => {
        if (_.isNil(id)) {
            setLoading(true);
            try {
                if (_.isFunction(callback)) {
                    await callback();
                }
            } catch (err) {
                setError(_.get(err, 'response.status', true) || true);
            } finally {
                setLoading(false);
            }
            return;
        }
        startFetch();
        try {
            const data = await service.get({ id });
            if (_.isFunction(callback)) {
                const augmentedData = await callback(_.cloneDeep(data));
                if (!_.isNil(augmentedData)) {
                    return setData(augmentedData);
                }
            }
            setData(data);
        } catch (err) {
            setError(_.get(err, 'response.status', true) || true);
        } finally {
            endFetch();
        }
    });

    return {
        service,
        loading,
        error,
        data: _.isNil(id) ? {} : data,
        setData,
    };
}
