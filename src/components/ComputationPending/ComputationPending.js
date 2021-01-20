import React from 'react';
import { Paper, Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { Layout, Ripple, Button } from '..';

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

    const refresh = () => {
        console.log('Refresh results');
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
                    <Typography variant='h6'>{t('computationResult.pending')}</Typography>
                </Box>
                <Button
                    className={classes.button}
                    onClick={refresh}
                    variant='outlined'
                >
                    {t('computationResult.refresh')}
                </Button>
            </Paper>
        </Layout>
    );
}

export default ComputationResult;
