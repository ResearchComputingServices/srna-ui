import React from 'react'; import {
    Box,
    Typography,
    TextField,
    Checkbox,
    FormControlLabel,
    IconButton,
    Paper,
    Tooltip,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import HistoryIcon from '@material-ui/icons/History';
import FileUploader from '../FileUploader';
import Layout from '../Layout';
import Button from '../Button';
import useSchema from './useSchema';
import { useActions, usePrevious, useService } from '../../hooks';
import { useToast } from '../ToastContext';
import formatOptions from './formatOptions.json';
import historyService from '../../services/HistoryService';

export const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        width: 750,
        marginTop: theme.spacing(2),
        paddingLeft: theme.spacing(3),
        '@media (max-width:780px)': { width: 650 },
        '@media (max-width:610px)': { width: 550 },
        '@media (max-width:554px)': { width: 500 },
        '@media (max-width:504px)': { width: 450 },
    },
    history: { marginRight: theme.spacing(2) },
    historyIcon: {
        height: 35,
        width: 35,
        fill: theme.palette.primary.main,
    },
    title: { paddingTop: theme.spacing(1) },
    field: { margin: theme.spacing(1.8) },
    button: {
        marginBottom: theme.spacing(1.5),
        marginTop: theme.spacing(1.5),
        width: 100,
    },
    largeField: {
        margin: theme.spacing(1.8),
        width: 400,
    },
    error: {
        marginLeft: theme.spacing(2),
        color: theme.palette.error.main,
    },
}));

function ComputationForm() {
    const schema = useSchema();
    const computationsActions = useActions('computations');
    const [t] = useTranslation('common');
    const classes = useStyles();
    const computationService = useService('computation');
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
        getValues,
    } = useForm({
        defaultValues: {
            length: 21,
            shift: -8,
            blast: true,
            eCutoff: 0.01,
            identityPerc: 0.8,
            followHits: true,
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
        };
    }, []);

    const onSubmit = async computation => {
        try {
            await computationService.queueLoad();
            const response = await computationService.compute(computation);
            const { taskId } = response;
            computationsActions.createComputation({
                taskId,
                filename: getValues('fileSequence').name,
            });
            historyService.go('/history');
        } catch (err) {
            if (err && err.response && err.response.data && err.response.data.message) {
                toastActions.error(err.response.data.message);
            } else {
                toastActions.error(t('error.unexpected'));
            }
        }
    };

    const watchedFollowHits = watch('followHits');
    const watchedBlast = watch('blast');
    const watchedShift = watch('shift');
    const watchedShiftHits = watch('shiftHits');
    const previousWatchedShift = usePrevious(watchedShift);
    const previousWatchedShiftHits = usePrevious(watchedShiftHits);

    React.useEffect(() => {
        if (watchedShift !== previousWatchedShift && previousWatchedShift != null) {
            triggerValidation();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchedShift]);

    React.useEffect(() => {
        if (watchedShiftHits !== previousWatchedShiftHits && previousWatchedShiftHits != null) {
            triggerValidation();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [watchedShiftHits]);

    return (
        <Layout>
            <Paper className={classes.root}>
                <Box>
                    <Box
                        alignItems='center'
                        display='flex'
                        flex-direction='row'
                        justifyContent='space-between'
                    >
                        <Typography
                            className={clsx(classes.title, classes.field)}
                            variant='h5'
                        >
                            {t('computationForm.querySequence')}
                            :
                        </Typography>
                        <Tooltip title={t('computationForm.history')}>
                            <IconButton
                                className={classes.history}
                                onClick={() => historyService.go('/history')}
                            >
                                <HistoryIcon className={classes.historyIcon} />
                            </IconButton>
                        </Tooltip>
                    </Box>
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
                <Box>
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
                    <Box display='flex'>
                        <Controller
                            as={<FormControlLabel control={<Checkbox color='primary' />} />}
                            className={classes.field}
                            control={control}
                            defaultValue
                            error={(!!errors.onlyTags).toString()}
                            label={t('computationForm.blast')}
                            name='blast'
                            variant='outlined'
                        />
                    </Box>
                </Box>
                {watchedBlast && (
                    <Box>
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
                )}
                <Box className={classes.field}>
                    <Button
                        className={classes.button}
                        color='primary'
                        disabled={Object.keys(errors).length !== 0}
                        onClick={handleSubmit(onSubmit)}
                    >
                        {t('computationForm.run')}
                    </Button>
                </Box>
            </Paper>
        </Layout>
    );
}

export default ComputationForm;
