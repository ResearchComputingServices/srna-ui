import _ from 'lodash';
import React from 'react';
import MaterialTable from 'material-table';
import PropTypes from 'prop-types';
import { ToastsStore } from 'react-toasts';
import { useService, useGridColumns } from '../../hooks';

function Grid({
    className,
    style,
    tableRef,
    title,
    onRowClick,
    onRowAdd,
    onRowUpdate,
    onRowDelete,
    entity,
    options,
    fetch,
}) {
    const format = _.get(options, 'format');
    const exclude = _.get(options, 'exclude');
    const customQuery = _.get(options, 'query', {});
    const service = useService(entity);
    const columns = useGridColumns(entity);

    const fetchData = async query => {
        try {
            const { count } = await service.count(customQuery);
            const fetchQuery = {
                offset: (query.page) * query.pageSize,
                limit: query.pageSize,
                column: _.snakeCase(_.get(query, 'orderBy.field', 'id') || 'id'),
                order: _.get(query, 'orderDirection', 'asc') || 'asc',
                ...customQuery,
            };
            const data = _.isFunction(fetch) ? fetch(fetchQuery) : await service.get(fetchQuery);
            const mappedData = _.map(data, datum => {
                if (_.isFunction(format)) {
                    const formattedDatum = format(datum);
                    if (_.isObject(formattedDatum)) {
                        datum = formattedDatum;
                    }
                }
                return _.omit(datum, exclude);
            });
            return {
                data: mappedData,
                page: query.page,
                totalCount: count,
            };
        } catch (err) {
            ToastsStore.error(`Failed to retrieve ${title}`);
            return {
                data: [],
                page: 0,
                totalCount: 0,
            };
        }
    };

    return (
        <MaterialTable
            className={className}
            columns={columns}
            data={query => fetchData(query)}
            editable={{
                onRowAdd,
                onRowUpdate,
                onRowDelete,
            }}
            onRowClick={_.isFunction(onRowClick) ? onRowClick : undefined}
            options={{
                search: false,
                filtering: false,
                ..._.omit(options, ['format', 'exclude', 'query']),
            }}
            style={{
                ...style,
                ...{ padding: 20 },
            }}
            tableRef={tableRef}
            title={title}
        />
    );
}

Grid.propTypes = {
    title: PropTypes.string,
    onRowAdd: PropTypes.func,
    onRowUpdate: PropTypes.func,
    onRowDelete: PropTypes.func,
    onRowClick: PropTypes.func,
    options: PropTypes.object,
    entity: PropTypes.string.isRequired,
    tableRef: PropTypes.object,
    fetch: PropTypes.func,
    className: PropTypes.string,
    style: PropTypes.object,
};

Grid.defaultProps = {
    options: {},
    title: '',
    onRowClick: undefined,
    onRowAdd: undefined,
    onRowUpdate: undefined,
    onRowDelete: undefined,
    tableRef: undefined,
    fetch: undefined,
    className: undefined,
    style: undefined,
};

export default Grid;
