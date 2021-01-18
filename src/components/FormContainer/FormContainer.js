import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FormPaper } from '..';

export const useStyles = makeStyles(theme => ({
    title: {
        marginBottom: theme.spacing(3),
        paddingTop: theme.spacing(2),
        paddingLeft: theme.spacing(1),
    },
}));

function FormContainer({
    title,
    children,
}) {
    const classes = useStyles();

    return (
        <FormPaper>
            <Box
                display='flex'
                flexDirection='column'
                justifyContent='center'
                p={1}
            >
                <Typography
                    className={classes.title}
                    variant='h4'
                >
                    {title}
                </Typography>
                {children}
            </Box>
        </FormPaper>
    );
}

FormContainer.propTypes = {
    title: PropTypes.string,
    children: PropTypes.node.isRequired,
};

FormContainer.defaultProps = { title: undefined };

export default FormContainer;
