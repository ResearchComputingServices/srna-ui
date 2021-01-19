import React from 'react';
import {
    Box,
    Typography,
    TextField,
    Checkbox,
    FormControlLabel,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { useForm, Controller } from 'react-hook-form';
import clsx from 'clsx';
import {
    FileUploader,
    Layout,
    FormContainer,
    Button,
} from '..';

const useStyles = makeStyles(theme => ({
    title: { paddingTop: theme.spacing(2) },
    field: { margin: theme.spacing(2) },
    button: { width: 100 },
    largeField: {
        margin: theme.spacing(2),
        width: 400,
    },
}));

function Form() {
    const classes = useStyles();
    const { handleSubmit, control } = useForm();

    const onSubmit = values => {
        console.log(values);
    };

    return (
        <Layout>
            <FormContainer>
                <form
                    className={classes.container}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Box mb={2}>
                        <Typography
                            className={clsx(classes.title, classes.field)}
                            variant='h5'
                        >
                            Query Sequence:
                        </Typography>
                        <FileUploader
                            className={classes.field}
                            onSave={files => {
                                console.log(files);
                            }}
                            title='Choose File'
                        />
                        <Controller
                            as={<Autocomplete />}
                            className={clsx(classes.field, classes.largeField)}
                            control={control}
                            defaultValue={null}
                            getOptionLabel={option => option}
                            getOptionSelected={(option, value) => option === value}
                            name='format'
                            options={[]}
                            renderInput={
                                params => (
                                    <TextField
                                        {...params}
                                        label='Format'
                                        variant='outlined'
                                    />
                                )
                            }
                            rules={{ required: true }}
                        />
                    </Box>
                    <Box mb={2}>
                        <Typography
                            className={clsx(classes.title, classes.field)}
                            variant='h5'
                        >
                            General Settings:
                        </Typography>
                        <Box display='flex'>
                            <Controller
                                as={<TextField />}
                                className={classes.field}
                                control={control}
                                label='Shift Position'
                                name='shift'
                                rules={{ required: true }}
                                variant='outlined'
                            />
                            <Controller
                                as={<TextField />}
                                className={classes.field}
                                control={control}
                                label='sRNA Length'
                                name='length'
                                rules={{ required: true }}
                                variant='outlined'
                            />
                        </Box>
                        <Box display='flex'>
                            <Controller
                                as={<FormControlLabel control={<Checkbox color='primary' />} />}
                                className={classes.field}
                                control={control}
                                label='Compute sRNAs only for these tags'
                                name='computeOnlyTags'
                                rules={{ required: true }}
                                variant='outlined'
                            />
                            <FileUploader
                                className={classes.field}
                                onSave={files => {
                                    console.log(files);
                                }}
                                title='Choose File'
                            />
                        </Box>
                    </Box>
                    <Box mb={2}>
                        <Typography
                            className={clsx(classes.title, classes.field)}
                            variant='h5'
                        >
                            Blast Settings:
                        </Typography>
                        <Box display='flex'>
                            <Controller
                                as={<TextField />}
                                className={classes.field}
                                control={control}
                                label='Expected cut off'
                                name='cutOff'
                                rules={{ required: true }}
                                variant='outlined'
                            />
                            <Controller
                                as={<TextField />}
                                className={classes.field}
                                control={control}
                                label='Identify (%)'
                                name='identify'
                                rules={{ required: true }}
                                variant='outlined'
                            />
                        </Box>
                        <Controller
                            as={<FormControlLabel control={<Checkbox color='primary' />} />}
                            className={classes.field}
                            control={control}
                            label='Compute sRNAs only for these tags'
                            name='computeOnlyTags'
                            rules={{ required: true }}
                            variant='outlined'
                        />
                        <Box display='flex'>
                            <Controller
                                as={<TextField />}
                                className={classes.largeField}
                                control={control}
                                label='Shift Position (for recomputing)'
                                name='shiftPositionRecomputing'
                                rules={{ required: true }}
                                variant='outlined'
                            />
                        </Box>
                    </Box>
                    <Box
                        className={classes.field}
                        mb={2}
                    >
                        <Button
                            className={classes.button}
                            color='primary'
                            type='submit'
                        >
                            Run
                        </Button>
                    </Box>
                </form>
            </FormContainer>
        </Layout>
    );
}

Form.propTypes = {};

Form.defaultProps = { buttons: [] };

export default Form;
