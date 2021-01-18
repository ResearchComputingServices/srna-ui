import React from 'react';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import {
    FileUploader,
    Layout,
    FormContainer,
    Button,
} from '..';

const useStyles = makeStyles(theme => ({
    title: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(3),
        '& u': {
            textDecoration: 'none',
            paddingBottom: theme.spacing(1),
            borderBottom: `2px solid ${theme.palette.primary.main}`,
        },
    },
    field: { margin: theme.spacing(1) },
    button: { width: 100 },
}));

function Form() {
    const classes = useStyles();
    return (
        <Layout>
            <FormContainer>
                <Box mb={2}>
                    <Typography
                        className={clsx(classes.title, classes.field)}
                        variant='h5'
                    >
                        <u>
                            Query Sequence:
                        </u>
                    </Typography>
                    <FileUploader
                        className={classes.field}
                        onSave={files => {
                            console.log(files);
                        }}
                        title='Choose File'
                    />
                </Box>
                <Box mb={2}>
                    <Typography
                        className={clsx(classes.title, classes.field)}
                        variant='h5'
                    >
                        <u>
                            General Settings:
                        </u>
                    </Typography>
                </Box>
                <Box mb={2}>
                    <Typography
                        className={clsx(classes.title, classes.field)}
                        variant='h5'
                    >
                        <u>
                            Blast Settings:
                        </u>
                    </Typography>
                </Box>
                <Box
                    className={classes.field}
                    mb={2}
                >
                    <Button
                        className={classes.button}
                        color='primary'
                    >
                        Run
                    </Button>
                </Box>
            </FormContainer>
        </Layout>
    );
}

Form.propTypes = {};

Form.defaultProps = { buttons: [] };

export default Form;
