import React from 'react';
import { Router } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Main from '../Main';
import { useStore, useService } from '../../hooks';

function Root() {
    const theme = useStore('theme');
    console.log(theme);
    const historyService = useService('history');

    return (
        <ThemeProvider theme={createMuiTheme(theme)}>
            <CssBaseline />
            <Router history={historyService.getHistory()}>
                <Main />
            </Router>
        </ThemeProvider>
    );
}

export default Root;
