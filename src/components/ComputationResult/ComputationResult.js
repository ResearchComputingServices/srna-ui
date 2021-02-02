import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
    Refresh as RefreshIcon,
    CheckCircle as CheckCircleIcon,
    GetApp as DownloadIcon,
    PausePresentation as PendingIcon,
    Cancel as FailureIcon,
    HourglassEmpty as RetryIcon,
} from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import FileSaver from 'file-saver';
import NotFound from '../NotFound';
import Ripple from '../Ripple';
import { useToast } from '../ToastContext';
import { useService, useStore, useActions } from '../../hooks';
import Layout from '../Layout';
import Button from '../Button';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 600,
        marginTop: theme.spacing(8),
        padding: theme.spacing(5),
        textAlign: 'center',
        '@media (max-width:780px)': { width: 450 },
        '@media (max-width:610px)': { width: 350 },
        '@media (max-width:554px)': { width: 300 },
        '@media (max-width:504px)': { width: 350 },
    },
    subtitle: { marginTop: theme.spacing(2) },
    checkCircleIcon: {
        fill: theme.palette.success.main,
        width: 50,
        height: 50,
        marginBottom: theme.spacing(2),
    },
    pendingIcon: {
        fill: theme.palette.warning.main,
        width: 50,
        height: 50,
        marginBottom: theme.spacing(2),
    },
    failedIcon: {
        fill: theme.palette.error.main,
        width: 50,
        height: 50,
        marginBottom: theme.spacing(2),
    },
    retryIcon: {
        fill: theme.palette.warning.main,
        width: 50,
        height: 50,
        marginBottom: theme.spacing(2),
    },
    button: {
        marginTop: theme.spacing(3),
        textTransform: 'none',
    },
    buttonIcon: { fill: theme.palette.primary.main },
}));

function Card({
    title,
    subtitle,
    buttonTitle,
    Icon,
    ButtonIcon,
    onClick,
}) {
    const classes = useStyles();
    return (
        <>
            {Icon}
            <Box
                alignItems='center'
                display='flex'
                flexDirection='row'
            >
                <Typography variant='h6'>
                    {title}
                </Typography>
            </Box>
            <Typography
                className={classes.subtitle}
                variant='subtitle2'
            >
                {subtitle}
            </Typography>
            {ButtonIcon && onClick && buttonTitle && (
                <Button
                    className={classes.button}
                    onClick={onClick}
                    startIcon={ButtonIcon}
                    variant='outlined'
                >
                    {buttonTitle}
                </Button>
            )}
        </>
    );
}

Card.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    Icon: PropTypes.node.isRequired,
    buttonTitle: PropTypes.string,
    ButtonIcon: PropTypes.node,
    onClick: PropTypes.func,
};

Card.defaultProps = {
    onClick: undefined,
    ButtonIcon: undefined,
    buttonTitle: undefined,
};

function ComputationResult({ match }) {
    const taskId = match.params.id;
    const computationService = useService('computation');
    const toastActions = useToast();
    const classes = useStyles();
    const computations = useStore('computations');
    const computationsActions = useActions('computations');
    const [t] = useTranslation('common');
    const computation = computations.data[taskId];

    const refresh = async () => {
        try {
            const response = await computationService.status(computation.taskId);
            if (response.taskStatus === 'SUCCESS') {
                computationsActions.completeComputation(computation.taskId);
            } else if (response.taskStatus === 'STARTED') {
                computationsActions.startComputation(computation.taskId);
            } else {
                computationsActions.attemptComputationRefresh(computation.taskId);
            }
        } catch (err) {
            if (err && err.response && err.response.data && err.response.data.message) {
                toastActions.error(err.response.data.message);
            } else {
                toastActions.error(t('error.unexpected'));
            }
        }
    };

    const saveFile = (computation, response) => {
        const extension = 'xlsx';
        const filename = 'sRNAComputation';
        FileSaver.saveAs(response, `${filename}-${computation.taskId}.${extension}`);
    };

    const download = async () => {
        try {
            const response = await computationService.outputFile(computation.taskId);
            saveFile(computation, response);
        } catch (err) {
            if (err && err.response && err.response.data && err.response.data.message) {
                toastActions.error(err.response.data.message);
            } else {
                toastActions.error(t('error.unexpected'));
            }
        }
    };

    if (computation == null) return <NotFound />;

    const getView = status => ({
        Pending: (
            <Card
                ButtonIcon={<RefreshIcon className={classes.buttonIcon} />}
                buttonTitle={t('computationPending.refresh')}
                Icon={<PendingIcon className={classes.pendingIcon} />}
                onClick={refresh}
                subtitle={t('computationPending.subtitle')}
                title={
                    !computation.refreshForResultsCounter
                        ? t('computationPending.title1')
                        : t('computationPending.title2')
                }
            />
        ),
        Started: (
            <Card
                ButtonIcon={<RefreshIcon className={classes.buttonIcon} />}
                buttonTitle={t('computationStarted.refresh')}
                Icon={(
                    <Ripple
                        color='warning'
                        height={45}
                        width={45}
                    />
                )}
                onClick={refresh}
                subtitle={t('computationStarted.subtitle')}
                title={
                    !computation.refreshForResultsCounter
                        ? t('computationStarted.title1')
                        : t('computationStarted.title2')
                }
            />
        ),
        Success: (
            <Card
                ButtonIcon={<DownloadIcon className={classes.buttonIcon} />}
                buttonTitle={t('computationResult.download')}
                Icon={<CheckCircleIcon className={classes.checkCircleIcon} />}
                onClick={download}
                subtitle={t('computationResult.subtitle')}
                title={t('computationResult.title')}
            />
        ),
        Failure: (
            <Card
                Icon={<FailureIcon className={classes.failedIcon} />}
                subtitle={t('computationFailure.subtitle')}
                title={t('computationFailure.title')}
            />
        ),
        Revoked: (
            <Card
                Icon={<FailureIcon className={classes.failedIcon} />}
                subtitle={t('computationFailure.subtitle')}
                title={t('computationFailure.title')}
            />
        ),
        Retry: (
            <Card
                Icon={<RetryIcon className={classes.retryIcon} />}
                subtitle={t('computationRetry.subtitle')}
                title={t('computationRetry.title')}
            />
        ),
    }[status]);

    const viewToRender = getView(computation.status) || <NotFound />;

    return <Layout><Paper className={classes.root}>{viewToRender}</Paper></Layout>;
}

ComputationResult.propTypes = { match: PropTypes.object.isRequired };

export default ComputationResult;
