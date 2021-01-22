import React from 'react';
import { Paper, Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import Layout from '../Layout';
import Ripple from '../Ripple';
import Button from '../Button';
import { useToast } from '../ToastContext';
import { useStore, useActions, useService } from '../../hooks';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        width: 650,
        marginTop: theme.spacing(8),
        padding: theme.spacing(5),
        '@media (max-width:780px)': { width: 500 },
        '@media (max-width:610px)': { width: 400 },
        '@media (max-width:554px)': { width: 350 },
    },
    subtitle: { marginTop: theme.spacing(2) },
    button: {
        marginTop: theme.spacing(3),
        textTransform: 'none',
    },
}));

function ComputationPending() {
    const classes = useStyles();
    const [t] = useTranslation('common');
    const computation = useStore('computation');
    const computationActions = useActions('computation');
    const computationService = useService('computation');
    const toastActions = useToast();

    const refresh = async () => {
        try {
            const response = await computationService.status(computation.taskId);
            if (response.taskStatus === 'SUCCESS') {
                computationActions.changeStage(3);
            } else {
                computationActions.incrementRefreshForResultsCounter();
            }
        } catch (err) {
            if (err && err.response && err.response.data && err.response.data.message) {
                toastActions.error(err.response.data.message);
            } else {
                toastActions.error(t('error.unexpected'));
            }
        }
    };

    return (
        <Layout>
            <Paper className={classes.root}>
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
                    variant='outlined'
                >
                    {t('computationPending.refresh')}
                </Button>
            </Paper>
        </Layout>
    );
}

export default ComputationPending;
