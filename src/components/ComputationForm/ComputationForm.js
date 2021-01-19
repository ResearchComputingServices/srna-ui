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
import {
    FileUploader,
    Layout,
    FormContainer,
    Button,
} from '..';
import { useSchema } from '.';
import formatOptions from './formatOptions.json';

export const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        width: 750,
        paddingLeft: theme.spacing(5),
        '@media (max-width:780px)': { width: 650 },
        '@media (max-width:610px)': { width: 550 },
        '@media (max-width:554px)': { width: 500 },
        '@media (max-width:504px)': { width: 450 },
    },
    title: { paddingTop: theme.spacing(1) },
    field: { margin: theme.spacing(2) },
    button: {
        width: 100,
        marginBottom: theme.spacing(2),
    },
    largeField: {
        margin: theme.spacing(2),
        width: 400,
    },
    error: {
        marginLeft: theme.spacing(2),
        color: theme.palette.error.main,
    },
}));

function ComputationForm() {
    const schema = useSchema();
    const [t] = useTranslation('common');
    const classes = useStyles();
    const { register, handleSubmit, unregister, control, setValue, errors, watch } = useForm({
        defaultValues: {
            followHits: true,
            length: 21,
        },
        validationSchema: schema,
    });

    React.useState(() => {
        register({ name: 'fileSequence' });
        register({ name: 'fileTags' });
        return () => {
            unregister('fileSequence');
            unregister('fileTags');
        };
    }, []);

    const onSubmit = computation => {
        console.log(computation);
    };

    const watchedFollowHits = watch('followHits');

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
                        error={errors.fileSequence}
                        onSave={files => {
                            setValue('fileSequence', files[0]);
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
                        options={formatOptions}
                        renderInput={
                            params => (
                                <TextField
                                    {...params}
                                    error={!!errors.format}
                                    label={t('computationForm.format')}
                                    required
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
                            required
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
                            required
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
                            error={(!!errors.onlyTags).toString()}
                            label={t('computationForm.onlyTags')}
                            name='onlyTags'
                            variant='outlined'
                        />
                        <FileUploader
                            acceptedFiles={[
                                'application/vnd.ms-excel',
                                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            ]}
                            className={classes.field}
                            error={errors.fileTags}
                            onSave={files => {
                                setValue('fileTags', files[0]);
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
                            error={!!errors.eCutoff}
                            label={t('computationForm.eCutoff')}
                            name='eCutoff'
                            required
                            variant='outlined'
                        />
                        <Controller
                            as={<TextField />}
                            className={classes.field}
                            control={control}
                            defaultValue=''
                            error={!!errors.identityPerc}
                            label={t('computationForm.identityPerc')}
                            name='identityPerc'
                            required
                            type='number'
                            variant='outlined'
                        />
                    </Box>
                    <Controller
                        as={<FormControlLabel control={<Checkbox color='primary' />} />}
                        className={classes.field}
                        control={control}
                        defaultValue
                        error={(!!errors.followHits).toString()}
                        label={t('computationForm.followHits')}
                        name='followHits'
                        variant='outlined'
                    />
                    <Box display='flex'>
                        <Controller
                            as={<TextField />}
                            className={classes.largeField}
                            control={control}
                            defaultValue=''
                            error={!!errors.shitHits}
                            label={t('computationForm.shitHits')}
                            name='shitHits'
                            required={watchedFollowHits}
                            type='number'
                            variant='outlined'
                        />
                    </Box>
                </Box>
                <Box
                    className={classes.field}
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
