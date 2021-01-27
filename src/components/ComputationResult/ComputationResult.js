import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
    Refresh as RefreshIcon,
    CheckCircle as CheckCircleIcon,
    GetApp as DownloadIcon,
    PausePresentation as PendingIcon,
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
    button: {
        marginTop: theme.spacing(3),
        textTransform: 'none',
    },
    buttonIcon: { fill: theme.palette.primary.main },
}));

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
            computationsActions.attemptComputationDownload(computation.taskId);
            // Get the task object and increments it's download counter to indicate that results were downloaded once.
        } catch (err) {
            if (err && err.response && err.response.data && err.response.data.message) {
                toastActions.error(err.response.data.message);
            } else {
                toastActions.error(t('error.unexpected'));
            }
        }
    };

    if (computation == null) return <NotFound />;

    if (computation.status === 'Success' && computation.downloadResultsCounter === 0) download();

    const getView = status => ({
        Pending: (
            <>
                <PendingIcon className={classes.pendingIcon} />
                <Box
                    alignItems='center'
                    display='flex'
                    flexDirection='row'
                >
                    <Typography variant='h6'>
                        {!computation.refreshForResultsCounter
                            ? t('computationPending.title1')
                            : t('computationPending.title2')}

                    </Typography>
                </Box>
                <Typography
                    className={classes.subtitle}
                    variant='subtitle2'
                >
                    {t('computationPending.subtitle')}
                </Typography>
                <Button
                    className={classes.button}
                    onClick={refresh}
                    startIcon={(<RefreshIcon className={classes.buttonIcon} />)}
                    variant='outlined'
                >
                    {t('computationPending.refresh')}
                </Button>
            </>
        ),
        Started: (
            <>
                <Ripple
                    color='warning'
                    height={45}
                    width={45}
                />
                <Box
                    alignItems='center'
                    display='flex'
                    flexDirection='row'
                >
                    <Typography variant='h6'>
                        {!computation.refreshForResultsCounter
                            ? t('computationStarted.title1')
                            : t('computationStarted.title2')}

                    </Typography>
                </Box>
                <Typography
                    className={classes.subtitle}
                    variant='subtitle2'
                >
                    {t('computationStarted.subtitle')}
                </Typography>

                <Button
                    className={classes.button}
                    onClick={refresh}
                    startIcon={(<RefreshIcon className={classes.buttonIcon} />)}
                    variant='outlined'
                >
                    {t('computationStarted.refresh')}
                </Button>
            </>
        ),
        Success: (
            <>
                <CheckCircleIcon className={classes.checkCircleIcon} />
                <Box
                    alignItems='center'
                    display='flex'
                    flexDirection='row'
                >
                    <Typography variant='h6'>
                        {t('computationResult.complete')}
                    </Typography>
                </Box>
                <Typography
                    className={classes.subtitle}
                    variant='subtitle2'
                >
                    {t('computationResult.downloadText')}
                </Typography>
                <Button
                    className={classes.button}
                    onClick={download}
                    startIcon={<DownloadIcon className={classes.buttonIcon} />}
                    variant='outlined'
                >
                    {t('computationResult.download')}
                </Button>
            </>
        ),
    }[status]);

    const viewToRender = getView(computation.status) || <NotFound />;

    return (
        <Layout>
            <Paper className={classes.root}>
                {viewToRender}
            </Paper>
        </Layout>
    );
}

ComputationResult.propTypes = { match: PropTypes.object.isRequired };

export default ComputationResult;
