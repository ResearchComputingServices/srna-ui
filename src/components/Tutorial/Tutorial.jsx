import React from 'react';
import {
    Link,
    Typography,
    Paper,
    Box,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
import Layout from '../Layout';
import { useMount, useService } from '../../hooks';

export const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        width: '75%',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        padding: theme.spacing(3),
        '@media (max-width:780px)': { width: 650 },
        '@media (max-width:610px)': { width: 550 },
        '@media (max-width:554px)': { width: 500 },
        '@media (max-width:504px)': { width: 450 },
    },
}));

const Tutorial = () => {
    const [t] = useTranslation('common');
    const classes = useStyles();
    const tutorialService = useService('tutorial');
    const [state, setState] = React.useState({
        content: '',
        loading: false,
        error: false,
    });

    useMount(async () => {
        try {
            setState({
                loading: true,
                error: false,
            });
            setState({
                content: await tutorialService.getReadme(),
                loading: false,
                error: false,
            });
        } catch (err) {
            setState({
                loading: false,
                error: true,
                content: '',
            });
        }
    });

    return (
        <Layout error={state.error} loading={state.loading}>
          <Paper className={classes.root}>
            <ReactMarkdown>
              {state.content}
            </ReactMarkdown>
          </Paper>
        </Layout>
    );
};

export default Tutorial;
