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

const MoreInformation = () => {
    const [t] = useTranslation('common');
    const classes = useStyles();
    const moreInformationService = useService('moreInformation');
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
                content: await moreInformationService.getReadme(),
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
        <Layout
            error={state.error}
            loading={state.loading}
        >
            <Paper className={classes.root}>
                <Typography variant='h5'>{t('moreInformation.desktopVersionToComputeSrnas')}</Typography>
                <Box my={1}>
                    <ul>
                        <li>
                            <Link
                                download
                                href='https://github.com/ResearchComputingServices/srna/archive/v1.0.0.zip'
                            >
                                <Typography>{t('moreInformation.sourceCodeZip')}</Typography>
                            </Link>
                        </li>
                        <li>
                            <Link
                                download
                                href='https://github.com/ResearchComputingServices/srna/archive/v1.0.0.tar.gz'
                            >
                                <Typography>{t('moreInformation.sourceCodeGzip')}</Typography>
                            </Link>
                        </li>
                    </ul>
                </Box>
                <ReactMarkdown>
                    {state.content}
                </ReactMarkdown>
            </Paper>
        </Layout>
    );
};

export default MoreInformation;
