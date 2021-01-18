import _ from 'lodash';

function getButton(title, handler, options = {}) {
    if (_.isBoolean(handler) && !handler) {
        return {
            title,
            handler,
            ...options,
            disabled: true,
        };
    }
    if (!_.isFunction(handler)) {
        return null;
    }
    return {
        title,
        handler,
        ...options,
    };
}

export default function useFormButtons(
    id, handlers,
) {
    const { create, update, remove, download, cancel } = handlers;
    return [
        _.isNil(id) ? getButton('Create', create) : null,
        _.isNil(id) ? null : getButton('Update', update),
        _.isNil(id) ? null : getButton('Delete', remove),
        _.isNil(id) ? null : getButton('Export', download),
        getButton('Cancel', cancel, { type: 'utility' }),
    ];
}
