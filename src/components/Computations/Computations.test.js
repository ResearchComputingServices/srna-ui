import React from 'react';
import moment from 'moment';
import { render, screen } from '@testing-library/react';
import { Provider as ReduxProvider } from 'react-redux';
import i18next from 'i18next';
import { I18nextProvider } from 'react-i18next';
import configureMockStore from 'redux-mock-store';
import commonEn from '../../translations/en/common.json';
import Computations from './Computations';

const mockStore = configureMockStore([]);

i18next.init({
    interpolation: { escapeValue: false },
    lng: 'en',
    resources: { en: { common: commonEn } },
});

describe('Computations', () => {
    let store = null;

    beforeAll(() => {
        store = mockStore({
            computations: {
                data: {
                    1: {
                        createdDate: '2021-02-01T14:54:57.499Z',
                        filename: 'JWGZ01.1.gbff',
                        refreshForResultsCounter: 0,
                        status: 'Pending',
                        taskId: 'Task Id - 1',
                    },
                    2: {
                        createdDate: '2021-02-02T14:54:57.499Z',
                        filename: 'JWGZ01.2.gbff',
                        refreshForResultsCounter: 0,
                        status: 'Started',
                        taskId: 'Task Id - 2',
                    },
                    3: {
                        createdDate: '2021-02-03T14:54:57.499Z',
                        filename: 'JWGZ01.3.gbff',
                        refreshForResultsCounter: 0,
                        status: 'Success',
                        taskId: 'Task Id - 3',
                    },
                    4: {
                        createdDate: '2021-02-04T14:54:57.499Z',
                        filename: 'JWGZ01.4.gbff',
                        refreshForResultsCounter: 0,
                        status: 'Retry',
                        taskId: 'Task Id - 4',
                    },
                    5: {
                        createdDate: '2021-02-05T14:54:57.499Z',
                        filename: 'JWGZ01.5.gbff',
                        refreshForResultsCounter: 0,
                        status: 'Revoked',
                        taskId: 'Task Id - 5',
                    },
                    6: {
                        createdDate: '2021-02-06T14:54:57.499Z',
                        filename: 'JWGZ01.6.gbff',
                        refreshForResultsCounter: 0,
                        status: 'Failure',
                        taskId: 'Task Id - 6',
                    },
                },
            },
        });
    });

    beforeEach(() => {
        render((
            <I18nextProvider i18n={i18next}>
                <ReduxProvider store={store} >
                    <Computations />
                </ReduxProvider>
            </I18nextProvider>
        ));
    });

    test('If basic functionalities are shown', () => {
        expect(screen.getByText('Computations')).toBeInTheDocument();
        expect(screen.getByText('Create Computation')).toBeInTheDocument();
        expect(screen.getByTitle('Search')).toBeInTheDocument();
    });

    test('If columns are shown', () => {
        expect(screen.getByText('Task Id')).toBeInTheDocument();
        expect(screen.getByText('Filename')).toBeInTheDocument();
        expect(screen.getByText('Status')).toBeInTheDocument();
        expect(screen.getByText('Created Date')).toBeInTheDocument();
        expect(screen.getByText('Download Result')).toBeInTheDocument();
    });

    test('If row data is shown', () => {
        Object.values(store.getState().computations.data).forEach(datum => {
            expect(screen.getByText(datum.taskId)).toBeInTheDocument();
            expect(screen.getByText(datum.filename)).toBeInTheDocument();
            expect(screen.getByText(datum.status)).toBeInTheDocument();
            expect(screen.getByText(moment(datum.createdDate).format('LLLL')));
        });
    });
});
