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
import FileUploader from '../FileUploader';
import Layout from '../Layout';
import Button from '../Button';
import FormContainer from '../FormContainer';
import useSchema from './useSchema';
import { useActions, useService } from '../../hooks';
import { useToast } from '../ToastContext';
import formatOptions from './formatOptions.json';
import { computation } from '../../services';

export const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        width: 750,
        paddingLeft: theme.spacing(3),
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
    const computationActions = useActions('computation');
    const [t] = useTranslation('common');
    const classes = useStyles();
    const [computationService, sseService] = useService('computation', 'sse');
    const toastActions = useToast();
    const {
        register,
        handleSubmit,
        unregister,
        control,
        setValue,
        errors,
        watch,
        triggerValidation,
    } = useForm({
        defaultValues: {
            followHits: true,
            length: 21,
            shift: -8,
            eCutoff: 0.01,
            shiftHits: 10,
        },
        validationSchema: schema,
    });

    React.useState(() => {
        register({ name: 'fileSequence' });
        register({ name: 'fileTags' });
        return () => {
            unregister('fileSequence');
            unregister('fileTags');
            if (computation.taskId) {
                sseService.unsubscribe(computation.taskId);
            }
        };
    }, []);

    const onSubmit = async computation => {
        try {
            const response = await computationService.compute(computation);
            const { taskId } = response;
            computationActions.setTaskId(taskId);
            computationActions.changeStage(2);
            sseService.subscribe(taskId, () => computationActions.changeStage(3));
        } catch (err) {
            if (err && err.response && err.response.data && err.response.data.message) {
                toastActions.error(err.response.data.message);
            } else {
                toastActions.error(t('error.unexpected'));
            }
        }
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
                            triggerValidation('fileSequence');
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
                            defaultValue={-8}
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
                                triggerValidation('fileTags');
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
                            defaultValue={0.01}
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
                            defaultValue={0.8}
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
                            defaultValue={10}
                            error={!!errors.shiftHits}
                            label={t('computationForm.shiftHits')}
                            name='shiftHits'
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
