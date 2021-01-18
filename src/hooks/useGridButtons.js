import _ from 'lodash';

function getButton(handler) {
    if (!_.isFunction(handler)) {
        return null;
    }
    return handler;
}

export default function useGridButtons(handlers) {
    const {
        onCreate,
        onExport,
        onImport,
        onRowClick,
    } = handlers;
    return {
        onCreate: getButton(onCreate),
        onExport: getButton(onExport),
        onImport: getButton(onImport),
        onRowClick: getButton(onRowClick),
    };
}
