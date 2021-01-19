/* eslint-disable no-restricted-globals */
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
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import * as yup from 'yup';
import {
    FileUploader,
    Layout,
    FormContainer,
    Button,
} from '..';

export const useStyles = makeStyles(theme => ({
    title: { paddingTop: theme.spacing(1) },
    field: { margin: theme.spacing(2) },
    button: { width: 100 },
    largeField: {
        margin: theme.spacing(2),
        width: 400,
    },
}));

yup.addMethod(yup.number, 'formatEmptyNumber', function() {
    return this.transform(value => (isNaN(value) ? undefined : value));
});

yup.addMethod(yup.number, 'noZero', function() {
    return this.test('no-zero', 'value cannot be zero', value => value === undefined || value !== 0);
});

yup.addMethod(yup.number, 'betweenOne', function() {
    return this.test('between-one', 'value must be between 0 and 1', value => value === undefined || (value >= 0 && value <= 1));
});

export const computationSchema = yup.object().shape({
    shift: yup
        .number()
        .integer()
        .formatEmptyNumber()
        .noZero(),
    length: yup
        .number()
        .integer()
        .formatEmptyNumber()
        .positive(),
    cutOff: yup
        .number()
        .formatEmptyNumber()
        .positive(),
    identity: yup
        .number()
        .formatEmptyNumber()
        .betweenOne(),
    recomputingShift: yup
        .number()
        .integer()
        .formatEmptyNumber()
        .noZero()
        .when('reCompute', {
            is: true,
            then: yup
                .number()
                .integer()
                .formatEmptyNumber()
                .noZero()
                .required('value is required for computation'),
        }),
});

function ComputationForm() {
    const [t] = useTranslation('common');
    const classes = useStyles();
    const { handleSubmit, control, errors } = useForm({ validationSchema: computationSchema });

    const onSubmit = values => {
        console.log(values);
    };

    console.log(errors);

    return (
        <Layout>
            <FormContainer>
                <Box mb={2}>
                    <Typography
                        className={clsx(classes.title, classes.field)}
                        variant='h5'
                    >
                        {t('computationForm.querySequence')}
                        :
                    </Typography>
                    <FileUploader
                        className={classes.field}
                        onSave={files => {
                            console.log(files);
                        }}
                    />
                    <Controller
                        as={<Autocomplete />}
                        className={clsx(classes.field, classes.largeField)}
                        control={control}
                        defaultValue={null}
                        error={(!!errors.format).toString()}
                        getOptionLabel={option => option}
                        getOptionSelected={(option, value) => option === value}
                        name='format'
                        options={[]}
                        renderInput={
                            params => (
                                <TextField
                                    {...params}
                                    label={t('computationForm.format')}
                                    variant='outlined'
                                />
                            )
                        }
                    />
                </Box>
                <Box mb={2}>
                    <Typography
                        className={clsx(classes.title, classes.field)}
                        variant='h5'
                    >
                        {t('computationForm.generalSettings')}
                        :
                    </Typography>
                    <Box display='flex'>
                        <Controller
                            as={<TextField />}
                            className={classes.field}
                            control={control}
                            defaultValue=''
                            error={!!errors.shift}
                            label={t('computationForm.shift')}
                            name='shift'
                            type='number'
                            variant='outlined'
                        />
                        <Controller
                            as={<TextField />}
                            className={classes.field}
                            control={control}
                            defaultValue={21}
                            error={!!errors.length}
                            label={t('computationForm.length')}
                            name='length'
                            type='number'
                            variant='outlined'
                        />
                    </Box>
                    <Box display='flex'>
                        <Controller
                            as={<FormControlLabel control={<Checkbox color='primary' />} />}
                            className={classes.field}
                            control={control}
                            defaultValue={false}
                            error={(!!errors.computeOnlyTags).toString()}
                            label={t('computationForm.computeOnlyTags')}
                            name='computeOnlyTags'
                            variant='outlined'
                        />
                        <FileUploader
                            className={classes.field}
                            onSave={files => {
                                console.log(files);
                            }}
                        />
                    </Box>
                </Box>
                <Box mb={2}>
                    <Typography
                        className={clsx(classes.title, classes.field)}
                        variant='h5'
                    >
                        {t('computationForm.blastSettings')}
                        :
                    </Typography>
                    <Box display='flex'>
                        <Controller
                            as={<TextField />}
                            className={classes.field}
                            control={control}
                            defaultValue=''
                            error={!!errors.cutOff}
                            label={t('computationForm.cutOff')}
                            name='cutOff'
                            variant='outlined'
                        />
                        <Controller
                            as={<TextField />}
                            className={classes.field}
                            control={control}
                            defaultValue=''
                            error={!!errors.identity}
                            label={t('computationForm.identity')}
                            name='identity'
                            type='number'
                            variant='outlined'
                        />
                    </Box>
                    <Controller
                        as={<FormControlLabel control={<Checkbox color='primary' />} />}
                        className={classes.field}
                        control={control}
                        defaultValue
                        error={(!!errors.reCompute).toString()}
                        label={t('computationForm.reCompute')}
                        name='reCompute'
                        variant='outlined'
                    />
                    <Box display='flex'>
                        <Controller
                            as={<TextField />}
                            className={classes.largeField}
                            control={control}
                            defaultValue=''
                            error={!!errors.recomputingShift}
                            label={t('computationForm.recomputingShift')}
                            name='recomputingShift'
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
                        disabled={Object.keys(errors).length !== 0}
                        onClick={handleSubmit(onSubmit)}
                    >
                        {t('computationForm.run')}
                    </Button>
                </Box>
            </FormContainer>
        </Layout>
    );
}

export default ComputationForm;
