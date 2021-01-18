import _ from 'lodash';
import { ToastsStore } from 'react-toasts';
import FileSaver from 'file-saver';
import usePluralize from './usePluralize';
import useService from './useService';

export default function useGridActions(entity, options = {}) {
    let { locale } = options;
    const { import: importCallback, export: exportCallback } = options;
    if (_.isNil(locale)) {
        locale = _.startCase(entity);
    }
    const [service, historyService] = useService(entity, 'history');
    const pluralize = usePluralize();

    const singular = _.kebabCase(pluralize.singular(entity));
    const plural = _.kebabCase(entity);

    const onCreate = () => historyService.go(`/${plural}/${singular}`);

    const onRowClick = (event, row) => historyService.go(`/${plural}/${singular}/${row.id}`);

    const onImport = async data => {
        try {
            const response = await service.import(data);
            if (_.isFunction(importCallback)) {
                return await importCallback(response);
            }
            ToastsStore.success(`Successfully imported ${locale}`);
        } catch (err) {
            ToastsStore.error(`Failed to import ${locale}`);
        }
    };

    const onExport = async (type, extension, query) => {
        try {
            const file = await service.export(null, { query });
            type = !_.isNil(type) ? type : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
            extension = !_.isNil(extension) ? extension : 'xlsx';
            if (_.isFunction(exportCallback)) {
                await exportCallback(file);
                return ToastsStore.success(`Successfully exported ${locale}`);
            }
            const blob = new Blob(
                [file],
                { type },
            );
            FileSaver.saveAs(blob, `${_.kebabCase(locale)}.${extension}`);
            ToastsStore.success(`Successfully exported ${locale}`);
        } catch (err) {
            ToastsStore.error(`Failed to export ${locale}`);
        }
    };

    return {
        onCreate,
        onRowClick,
        onImport,
        onExport,
    };
}
