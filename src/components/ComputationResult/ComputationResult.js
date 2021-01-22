import React from 'react';
import { Paper, Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { CheckCircle as CheckCircleIcon } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import FileSaver from 'file-saver';
import { useToast } from '../ToastContext';
import { useService, useStore, useActions, useMount } from '../../hooks';
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
    button: {
        marginTop: theme.spacing(3),
        textTransform: 'none',
    },
}));

function ComputationResult() {
    const computationService = useService('computation');
    const toastActions = useToast();
    const classes = useStyles();
    const computation = useStore('computation');
    const computationActions = useActions('computation');
    const [t] = useTranslation('common');

    const saveFile = response => {
        const extension = 'xlsx';
        FileSaver.saveAs(response, `output.${extension}`);
    };

    const download = async () => {
        try {
            const response = await computationService.outputFile(computation.taskId);
            saveFile(response);
            computationActions.incrementDownloadResultsCounter();
        } catch (err) {
            if (err && err.response && err.response.data && err.response.data.message) {
                toastActions.error(err.response.data.message);
            } else {
                console.log(err);
                toastActions.error(t('error.unexpected'));
            }
        }
    };

    useMount(() => {
        if (computation.downloadResultsCounter === 0) {
            download();
        }
    });

    return (
        <Layout>
            <Paper className={classes.root}>
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
                    variant='outlined'
                >
                    {t('computationResult.download')}
                </Button>
            </Paper>
        </Layout>
    );
}

export default ComputationResult;
