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
    root: {
        display: 'flex',
        justifyContent: 'center',
        width: 700,
        '@media (max-width:780px)': { width: 560 },
        '@media (max-width:610px)': { width: 550 },
        '@media (max-width:554px)': { width: 500 },
        '@media (max-width:504px)': { width: 450 },
    },
    title: { paddingTop: theme.spacing(1) },
    field: { margin: theme.spacing(2) },
    button: { width: 100, marginBottom: theme.spacing(1) },
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
    sequenceFile: yup
        .object()
        .required('file is required'),
    format: yup
        .string()
        .required(),
    shift: yup
        .number()
        .integer()
        .formatEmptyNumber()
        .noZero()
        .required(),
    length: yup
        .number()
        .integer()
        .formatEmptyNumber()
        .positive()
        .required(),
    cutOff: yup
        .number()
        .formatEmptyNumber()
        .positive()
        .required(),
    identity: yup
        .number()
        .formatEmptyNumber()
        .betweenOne()
        .required(),
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
                .required('value is required'),
        }),
    tagFile: yup
        .object()
        .when('computeOnlyTags', {
            is: true,
            then: yup
                .object()
                .required('file is required'),
        }),
});

function ComputationForm() {
    const [t] = useTranslation('common');
    const classes = useStyles();
    const { register, handleSubmit, unregister, control, setValue, errors } = useForm({ validationSchema: computationSchema });

    React.useState(() => {
        register({ name: 'sequenceFile' });
        register({ name: 'tagFile' });
        return () => {
            unregister('sequenceFile');
            unregister('tagFile');
        };
    }, []);

    const onSubmit = computation => {
        console.log(computation);
    };

    console.log(errors);

    return (
        <Layout>
            <FormContainer className={classes.root}>
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
                        error={errors.sequenceFile}
                        onSave={files => {
                            setValue('sequenceFile', files[0]);
                        }}
                    />
                    <Controller
                        as={<Autocomplete />}
                        className={clsx(classes.field, classes.largeField)}
                        control={control}
                        defaultValue={null}
                        getOptionLabel={option => option}
                        getOptionSelected={(option, value) => option === value}
                        name='format'
                        onChange={([, option]) => option}
                        options={[
                            'abi',
                            'abi-trim',
                            'ace',
                            'cif-atom',
                            'cif-seqres',
                            'clustal',
                            'embl',
                            'fasta',
                            'fasta-2line',
                            'fastq-sanger',
                            'fastq-solexa',
                            'fastq-illumina',
                            'gck',
                            'genbank',
                            'ig',
                            'imgt',
                            'nexus',
                            'pdb-seqres',
                            'pdb-atom',
                            'phd',
                            'phylip',
                            'pir',
                            'seqxml',
                            'sff',
                            'sff-trim',
                            'snapgene',
                            'stockholm',
                            'swiss',
                            'tab',
                            'qual',
                            'uniprot-xml',
                            'xdna',
                        ]}
                        renderInput={
                            params => (
                                <TextField
                                    {...params}
                                    error={!!errors.format}
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
                            error={errors.tagFile}
                            onSave={files => {
                                setValue('tagFile', files[0]);
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
                            type='number'
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
