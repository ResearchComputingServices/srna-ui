import React from 'react';
import { Router } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Main from '../Main';
import ToastProvider from '../ToastContext';
import { useStore, useService } from '../../hooks';

function Root() {
    const theme = useStore('theme');
    const historyService = useService('history');

    return (
        <ThemeProvider theme={createMuiTheme(theme)}>
            <ToastProvider orientation='bottom-left'>
                <CssBaseline />
                <Router history={historyService.getHistory()}>
                    <Main />
                </Router>
            </ToastProvider>
        </ThemeProvider>

    );
}

export default Root;
