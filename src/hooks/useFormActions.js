import _ from 'lodash';
import { ToastsStore } from 'react-toasts';
import FileSaver from 'file-saver';
import { useRef } from 'react';
import useService from './useService';
import useNavigateHistoryByPattern from './useNavigateHistoryByPattern';
import useDialog from './useDialog';

export default function(entity, locale) {
    if (_.isNil(locale)) {
        locale = entity;
    }
    const dataRef = useRef(null);
    const service = useService(entity);
    const cancel = useNavigateHistoryByPattern();

    const getData = () => dataRef.current;

    const removeEntity = async () => {
        try {
            await service.remove(getData());
            ToastsStore.success(`Successfully deleted ${locale}`);
            cancel();
        } catch (err) {
            ToastsStore.error(`Failed to delete ${locale}`);
        }
    };

    const showDialog = useDialog({ onConfirm: removeEntity });

    const create = async data => {
        if (_.isEmpty(data)) return;
        dataRef.current = data;
        try {
            const result = await service.add(data);
            ToastsStore.success(`Successfully created ${locale}`);
            return result;
        } catch (err) {
            ToastsStore.error(`Failed to create ${locale}`);
        }
    };

    const update = async data => {
        if (_.isEmpty(data)) return;
        dataRef.current = data;
        try {
            const result = await service.update(data);
            ToastsStore.success(`Successfully updated ${locale}`);
            return result;
        } catch (err) {
            ToastsStore.error(`Failed to update ${locale}`);
        }
    };

    const remove = async data => {
        if (_.isEmpty(data)) return;
        dataRef.current = data;
        showDialog(`Are you sure you want to delete this ${locale}?`);
    };

    const download = async (data, type, extension) => {
        try {
            const { id } = data;
            type = !_.isNil(type) ? type : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            extension = !_.isNil(extension) ? extension : 'xlsx';
            const blob = new Blob(
                [await service.export(id)],
                { type },
            );
            FileSaver.saveAs(blob, `${_.kebabCase(locale)}-${id}.${extension}`);
        } catch (err) {
            ToastsStore.error(`Failed to export ${locale}`);
        }
    };

    return {
        create,
        update,
        remove,
        download,
        cancel,
    };
}
