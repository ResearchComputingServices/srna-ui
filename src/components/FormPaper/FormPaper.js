import React, { forwardRef } from 'react';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
    marginTop: { marginTop: theme.spacing(3) },
    root: {
        width: '97%',
        minWidth: 450,
    },
}));

const FormPaper = forwardRef((props, ref) => {
    const classes = useStyles();
    return (
        <Paper
            ref={ref}
            className={clsx(classes.root, classes.marginTop, props.className)}
            elevation={2}
            style={props.style}
        >
            {props.children}
        </Paper>
    );
});

FormPaper.propTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
    children: PropTypes.node,
};

FormPaper.defaultProps = {
    style: undefined,
    className: '',
    children: null,
};

export default FormPaper;
