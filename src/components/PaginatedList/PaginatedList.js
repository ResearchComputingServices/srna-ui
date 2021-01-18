import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Pagination from '@material-ui/lab/Pagination';
import { Box, List, CircularProgress as Spinner } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    // TODO use grey from themes
    textMuted: { color: '#6c757d' },
    root: { overflowY: 'auto' },
    light: { alignSelf: 'flex-start' },
    right: { alignSelf: 'flex-end' },
    marginTop: { marginTop: theme.spacing(4) },
}));

function PaginatedList({
    className,
    style,
    data,
    onPaginationChange,
    count,
    page,
    loading,
    error,
    renderRow,
    emptyTitle,
    paginationAlignment,
}) {
    const [dataState, setDataState] = useState(data);
    const classes = useStyles();

    useEffect(() => {
        setDataState(data);
    }, [data]);

    const isEmpty = _.eq(count, 1) && _.isEmpty(data);

    return (
        <Box
            className={clsx(
                className, { [classes.loading]: loading || error || isEmpty },
            )}
            display='flex'
            flexDirection='column'
            height='100%'
            style={style}
            width='100%'
        >
            {loading && <Spinner />}
            {!loading && !error && isEmpty && <Box className={classes.textMuted}>{emptyTitle}</Box>}
            {!loading && !error && !(isEmpty) && (
                <>
                    <List className={classes.root}>
                        {_.map(dataState, (datum, index) => <React.Fragment key={index}>{renderRow(datum, index)}</React.Fragment>)}
                    </List>
                    <Pagination
                        className={clsx(
                            classes.marginTop,
                            {
                                [classes.light]: paginationAlignment === 'left',
                                [classes.right]: paginationAlignment === 'right',
                            },
                        )}
                        color='primary'
                        count={count}
                        onChange={(...args) => {
                            const [, pageNumber] = args;
                            if (_.isFunction(onPaginationChange)) {
                                onPaginationChange(pageNumber);
                            }
                        }}
                        page={page}
                    />
                </>
            )}
            {error && <Box className={classes.textMuted}>An error encountered. Please try again.</Box>}
        </Box>
    );
}

PaginatedList.propTypes = {
    data: PropTypes.array.isRequired,
    onPaginationChange: PropTypes.func.isRequired,
    count: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    style: PropTypes.object,
    loading: PropTypes.bool,
    error: PropTypes.bool,
    className: PropTypes.string,
    renderRow: PropTypes.func,
    emptyTitle: PropTypes.string,
    paginationAlignment: PropTypes.string,
};

PaginatedList.defaultProps = {
    loading: false,
    error: false,
    className: '',
    renderRow: _.noop,
    style: undefined,
    emptyTitle: 'List is Empty',
    paginationAlignment: 'left',
};

export default PaginatedList;
