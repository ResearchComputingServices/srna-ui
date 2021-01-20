import React from 'react';
import { Paper, Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { Layout, Ripple, Button } from '..';
import { useStore, useActions } from '../../hooks';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 600,
        marginTop: theme.spacing(8),
        padding: theme.spacing(5),
        '@media (max-width:780px)': { width: 450 },
        '@media (max-width:610px)': { width: 350 },
        '@media (max-width:554px)': { width: 300 },
        '@media (max-width:504px)': { width: 350 },
    },
    button: {
        marginTop: theme.spacing(3),
        textTransform: 'none',
    },
}));

function ComputationResult() {
    const classes = useStyles();
    const [t] = useTranslation('common');
    const computation = useStore('computation');
    const computationActions = useActions('computation');

    const refresh = () => new Promise(resolve => {
        setTimeout(() => {
            console.log('Refresh results');
            computationActions.incrementRefreshForResultsCounter();
            resolve();
        }, 1000);
    });

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
                            ? t('computationResult.pending')
                            : t('computationResult.stillPending')}

                    </Typography>
                </Box>
                <Button
                    className={classes.button}
                    onClick={refresh}
                    variant='outlined'
                >
                    {!computation.refreshForResultsCounter
                        ? t('computationResult.refresh')
                        : t('computationResult.refreshAgain')}
                </Button>
            </Paper>
        </Layout>
    );
}

export default ComputationResult;
