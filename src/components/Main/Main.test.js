import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider as ReduxProvider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { Router } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Main from '.';
import store from '../../redux/store';
import commonEn from '../../translations/en/common.json';
import ToastProvider from '../ToastContext';
import { useStore, useService } from '../../hooks';

i18next.init({
    interpolation: { escapeValue: false },
    lng: 'en',
    resources: { en: { common: commonEn } },
});

function WrappedMain() {
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

describe('Main', () => {
    test('render', () => {
        render(
            <I18nextProvider i18n={i18next}>
                <ReduxProvider store={store}>
                    <WrappedMain />
                </ReduxProvider>
            </I18nextProvider>,
        );
        expect(screen.getByText('CAREN')).toBeInTheDocument();
        expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    test('settings menu', async () => {
        render(
            <I18nextProvider i18n={i18next}>
                <ReduxProvider store={store}>
                    <WrappedMain />
                </ReduxProvider>
            </I18nextProvider>,
        );
        const settingsButton = screen.getByText('Settings');
        expect(settingsButton).toBeInTheDocument();
        await waitFor(() => fireEvent.click(settingsButton));
        expect(screen.getByText('Dark Theme')).toBeInTheDocument();
        expect(screen.getByText('Clear Session')).toBeInTheDocument();
        expect(screen.getByText('More Information')).toBeInTheDocument();
        expect(screen.getByText('Search in Entrez')).toBeInTheDocument();
    });

    test('change theme', async () => {
        render(
            <I18nextProvider i18n={i18next}>
                <ReduxProvider store={store}>
                    <WrappedMain />
                </ReduxProvider>
            </I18nextProvider>,
        );
        const settingsButton = screen.getByText('Settings');
        expect(settingsButton).toBeInTheDocument();
        await waitFor(() => fireEvent.click(settingsButton));
        const themeChangeButton = screen.getByText('Dark Theme');
        expect(store.getState().theme.palette.type).toBe('light');
        await waitFor(() => fireEvent.click(themeChangeButton));
        expect(store.getState().theme.palette.type).toBe('dark');
        await waitFor(() => fireEvent.click(themeChangeButton));
        expect(store.getState().theme.palette.type).toBe('light');
    });

    test('clearing session', async () => {
        render(
            <I18nextProvider i18n={i18next}>
                <ReduxProvider store={store}>
                    <WrappedMain />
                </ReduxProvider>
            </I18nextProvider>,
        );
        const settingsButton = screen.getByText('Settings');
        expect(settingsButton).toBeInTheDocument();
        await waitFor(() => fireEvent.click(settingsButton));
        const clearSessionButton = screen.getByText('Clear Session');
        const currentSessionId = store.getState().userSession.sessionId;
        await waitFor(() => fireEvent.click(clearSessionButton));
        const confirmButton = screen.getByText('Ok');
        expect(confirmButton).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
        expect(screen.getByText('Clearing this session will delete your computation history permanently.')).toBeInTheDocument();
        await waitFor(() => fireEvent.click(confirmButton));
        const newSessionId = store.getState().userSession.sessionId;
        expect(currentSessionId !== newSessionId).toBeTruthy();
    });
});
