import React from 'react';
import PropTypes from 'prop-types';
import { LinearProgress, CircularProgress as Spinner, Box } from '@material-ui/core';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Error } from '..';

export const useStyles = makeStyles(() => ({
    progressBar: {
        width: '50%',
        marginLeft: '25%',
        marginTop: '10%',
    },
    loading: { display: 'none' },
    spinner: {
        marginLeft: '50%',
        // TODO need to move this to theme
        marginTop: 64,
    },
}));

function Layout({
    children,
    style,
    className,
    loading,
    error,
    unmountOnLoad,
    linearProgress,
    ...props
}) {
    const classes = useStyles();
    return (
        <Box width='100%'>
            {loading && !error && (
                <Box className={clsx({
                    [classes.spinner]: !linearProgress,
                    [classes.progressBar]: linearProgress,
                })}
                >
                    {!linearProgress && <Spinner />}
                    {linearProgress && <LinearProgress />}
                </Box>
            )}
            <Box
                alignItems='center'
                className={clsx({
                    [className]: !loading && !error,
                    [classes.loading]: loading,
                })}
                display='flex'
                flexDirection='column'
                {...props}
                style={style}
            >
                {!error && (!unmountOnLoad ? children : !loading && children)}
                {error && <Error error={error} />}
            </Box>
        </Box>
    );
}

Layout.propTypes = {
    loading: PropTypes.bool,
    children: PropTypes.node,
    unmountOnLoad: PropTypes.bool,
    linearProgress: PropTypes.bool,
    className: PropTypes.string,
    error: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.number,
    ]),
    style: PropTypes.object,
};

Layout.defaultProps = {
    loading: false,
    children: null,
    unmountOnLoad: false,
    error: false,
    linearProgress: false,
    className: '',
    style: undefined,
};

export default Layout;
