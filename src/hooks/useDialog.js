import _ from 'lodash';
import { useState, useEffect } from 'react';
import { v4 } from 'uuid';
import useActions from './useActions';
import useStore from './useStore';

export default function useDialog(options = {}) {
    const [key] = useState(v4());
    const dialog = useStore('dialog');
    const actions = useActions('dialog');
    const onConfirm = _.get(options, 'onConfirm');
    const onCancel = _.get(options, 'onCancel');
    const handleConfirm = async () => {
        if (dialog.confirmed && _.eq(dialog.key, key)) {
            if (_.isFunction(onConfirm)) {
                actions.toggleLoading();
                await onConfirm();
                actions.toggleLoading();
            }
            actions.hideDialog();
        }
    };
    const handleCancel = async () => {
        if (dialog.canceled && _.eq(dialog.key, key)) {
            if (_.isFunction(onCancel)) {
                actions.toggleLoading();
                await onCancel();
                actions.toggleLoading();
            }
            actions.hideDialog();
        }
    };
    useEffect(() => {
        handleConfirm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dialog.confirmed]);

    useEffect(() => {
        handleCancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dialog.canceled]);

    return title => {
        actions.showDialog({ title, key });
    };
}
