import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider as ReduxProvider } from 'react-redux';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';
import configureMockStore from 'redux-mock-store';
import commonEn from '../../translations/en/common.json';
import ComputationResult from './ComputationResult';

const mockStore = configureMockStore([]);

i18next.init({
    interpolation: { escapeValue: false },
    lng: 'en',
    resources: { en: { common: commonEn } },
});

describe('ComputationResult', () => {
    let store = null;

    beforeAll(() => {
        store = mockStore({
            computations: {
                data: {
                    1: {
                        createdDate: '2021-02-03T14:54:57.499Z',
                        filename: 'JWGZ01.1.gbff',
                        refreshForResultsCounter: 0,
                        status: 'Pending',
                        taskId: '1',
                    },
                    2: {
                        createdDate: '2021-02-03T14:54:57.499Z',
                        filename: 'JWGZ01.1.gbff',
                        refreshForResultsCounter: 0,
                        status: 'Started',
                        taskId: '2',
                    },
                    3: {
                        createdDate: '2021-02-03T14:54:57.499Z',
                        filename: 'JWGZ01.1.gbff',
                        refreshForResultsCounter: 0,
                        status: 'Success',
                        taskId: '3',
                    },
                    4: {
                        createdDate: '2021-02-03T14:54:57.499Z',
                        filename: 'JWGZ01.1.gbff',
                        refreshForResultsCounter: 0,
                        status: 'Retry',
                        taskId: '4',
                    },
                    5: {
                        createdDate: '2021-02-03T14:54:57.499Z',
                        filename: 'JWGZ01.1.gbff',
                        refreshForResultsCounter: 0,
                        status: 'Revoked',
                        taskId: '5',
                    },
                    6: {
                        createdDate: '2021-02-03T14:54:57.499Z',
                        filename: 'JWGZ01.1.gbff',
                        refreshForResultsCounter: 0,
                        status: 'Failure',
                        taskId: '6',
                    },
                },
            },
        });
    });

    test('pending', () => {
        render((
            <I18nextProvider i18n={i18next}>
                <ReduxProvider store={store} >
                    <ComputationResult match={{ params: { id: '1' } }} />
                </ReduxProvider>
            </I18nextProvider>
        ));
        expect(screen.getByText('Please wait. Computation is pending.')).toBeInTheDocument();
        expect(screen.getByText('This will take a couple of minutes. Task will be started once other computations in the system are completed.')).toBeInTheDocument();
        expect(screen.getByText('Check if it has started')).toBeInTheDocument();
    });

    test('started', () => {
        render((
            <I18nextProvider i18n={i18next}>
                <ReduxProvider store={store} >
                    <ComputationResult match={{ params: { id: '2' } }} />
                </ReduxProvider>
            </I18nextProvider>
        ));
        expect(screen.getByText('Please wait. Computation in progress.')).toBeInTheDocument();
        expect(screen.getByText('This usually takes a couple of minutes.')).toBeInTheDocument();
        expect(screen.getByText("Check if it's done")).toBeInTheDocument();
    });

    test('success', () => {
        render((
            <I18nextProvider i18n={i18next}>
                <ReduxProvider store={store} >
                    <ComputationResult match={{ params: { id: '3' } }} />
                </ReduxProvider>
            </I18nextProvider>
        ));
        expect(screen.getByText('Computation complete!')).toBeInTheDocument();
        expect(screen.getByText('You can start the download by clicking the button below.')).toBeInTheDocument();
        expect(screen.getByText('Download Result')).toBeInTheDocument();
    });

    test('failure', () => {
        render((
            <I18nextProvider i18n={i18next}>
                <ReduxProvider store={store} >
                    <ComputationResult match={{ params: { id: '6' } }} />
                </ReduxProvider>
            </I18nextProvider>
        ));
        expect(screen.getByText('Computation Failure')).toBeInTheDocument();
        expect(screen.getByText('Please try again the computation and contact us if the problem persists.')).toBeInTheDocument();
    });

    test('retry', () => {
        render((
            <I18nextProvider i18n={i18next}>
                <ReduxProvider store={store} >
                    <ComputationResult match={{ params: { id: '4' } }} />
                </ReduxProvider>
            </I18nextProvider>
        ));
        expect(screen.getByText('Pending Computation')).toBeInTheDocument();
        expect(screen.getByText('Computation will be retried. Please check later for the results.')).toBeInTheDocument();
    });

    test('revoked', () => {
        render((
            <I18nextProvider i18n={i18next}>
                <ReduxProvider store={store} >
                    <ComputationResult match={{ params: { id: '5' } }} />
                </ReduxProvider>
            </I18nextProvider>
        ));
        expect(screen.getByText('Computation Failure')).toBeInTheDocument();
        expect(screen.getByText('Please try again the computation and contact us if the problem persists.')).toBeInTheDocument();
    });

    test('if 404 page is rendered when id is not found in data', () => {
        render((
            <I18nextProvider i18n={i18next}>
                <ReduxProvider store={store} >
                    <ComputationResult match={{ params: { id: '0' } }} />
                </ReduxProvider>
            </I18nextProvider>
        ));
        expect(screen.getByText('404 Page Not Found')).toBeInTheDocument();
    });
});
