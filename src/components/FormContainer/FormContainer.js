import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Box, Typography, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
    root: { marginTop: theme.spacing(2) },
    title: {
        marginBottom: theme.spacing(3),
        paddingTop: theme.spacing(2),
        paddingLeft: theme.spacing(1),
    },
}));

function FormContainer({
    title,
    children,
    className,
}) {
    const classes = useStyles();

    return (
        <Paper
            className={clsx(className, classes.root)}
            elevation={3}
        >
            <Box
                display='flex'
                flexDirection='column'
                justifyContent='center'
                p={1}
            >
                {title && (
                    <Typography
                        className={classes.title}
                        variant='h4'
                    >
                        {title}
                    </Typography>
                )}
                {children}
            </Box>
        </Paper>
    );
}

FormContainer.propTypes = {
    title: PropTypes.string,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

FormContainer.defaultProps = {
    className: '',
    title: undefined,
};

export default FormContainer;
