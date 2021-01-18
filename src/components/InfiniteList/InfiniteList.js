import React, { useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Typography, IconButton, Tooltip, Box } from '@material-ui/core';
import clsx from 'clsx';
import RefreshIcon from '@material-ui/icons/Refresh';
import { makeStyles } from '@material-ui/core/styles';
import { useMount } from '../../hooks';
import { Ripple } from '..';

export const useStyles = makeStyles(theme => ({
    root: {
        height: 500,
        minWidth: 420,
        overflowY: 'scroll',
    },
    ripple: { margin: theme.spacing(3) },
    list: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: 500,
        width: '100%',
        overflow: 'auto',
    },
    center: { justifyContent: 'center' },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    // TODO use grey from themes
    textMuted: { color: '#6c757d' },
}));

function InfiniteList({
    title,
    noDataTitle,
    fetch,
    renderRow,
    className,
    style,
    pageSize: propsPageSize,
}) {
    const [pageSize] = useState(propsPageSize);
    const [listData, setListData] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [noMoreData, setNoMoreData] = useState(false);
    const classes = useStyles();

    const reset = () => {
        setListData([]);
        setPage(1);
        setLoading(false);
        setNoMoreData(false);
    };

    const fetchData = async reFetch => {
        try {
            if (reFetch) {
                reset();
                setLoading(true);
                const newListData = await fetch({
                    offset: 0,
                    limit: pageSize,
                    column: 'id',
                    order: 'desc',
                });
                setListData(newListData);
                setPage(2);
                setLoading(false);
                return;
            }
            setLoading(true);
            const newListData = await fetch({
                offset: (page - 1) * pageSize,
                limit: pageSize,
                column: 'id',
                order: 'desc',
            });
            if (_.isEmpty(newListData) || newListData.length < pageSize) {
                setNoMoreData(true);
            }
            setListData(!_.isEmpty(listData) ? listData.concat(newListData) : newListData);
            setPage(page + 1);
            setLoading(false);
        } catch (err) {
            setLoading(false);
        }
    };

    useMount(() => {
        if (_.isEmpty(listData)) {
            fetchData();
        }
    });

    const onScroll = event => {
        const { target } = event;
        const hasReachedBottom = target.scrollHeight - target.scrollTop === target.clientHeight;
        if (hasReachedBottom && !noMoreData) {
            fetchData();
        }
    };

    return (
        <Box
            className={className}
            p={2}
            style={style}
        >
            <Box
                className={classes.header}
                pl='2'
            >
                {title && <Typography variant='h6'>{title}</Typography>}
                <Tooltip title='Refresh List'>
                    <IconButton onClick={() => fetchData(true)}>
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            </Box>
            <Box
                className={classes.root}
                onScroll={onScroll}
            >
                <Box className={clsx(classes.list, { [classes.center]: _.isEmpty(listData) })}>
                    {listData.map(renderRow)}
                    {!loading && _.isEmpty(listData) && <p className={classes.textMuted}>{noDataTitle}</p>}
                    {loading && (
                        <Ripple className={classes.ripple} />
                    )}
                </Box>
            </Box>
        </Box>
    );
}

InfiniteList.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    fetch: PropTypes.func.isRequired,
    renderRow: PropTypes.func.isRequired,
    title: PropTypes.string,
    noDataTitle: PropTypes.string,
    pageSize: PropTypes.number,
};

InfiniteList.defaultProps = {
    className: undefined,
    style: undefined,
    title: undefined,
    noDataTitle: 'No data',
    pageSize: 5,
};

export default InfiniteList;
