import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider as ReduxProvider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import Computation from './Computation';
import store from '../../redux/store';
import commonEn from '../../translations/en/common.json';
import { actions } from '../../redux/slices';

i18next.init({
    interpolation: { escapeValue: false },
    lng: 'en',
    resources: { en: { common: commonEn } },
});

jest.mock('../ComputationForm', () => ({
    __esModule: true,
    default: () => <>ComputationForm</>,
}));

jest.mock('../ComputationResult', () => ({
    __esModule: true,
    default: () => <>ComputationResult</>,
}));

jest.mock('../ComputationPending', () => ({
    __esModule: true,
    default: () => <>ComputationPending</>,
}));

describe('Computation', () => {
    test('if ComputationForm is rendered by default', () => {
        render(
            <I18nextProvider i18n={i18next}>
                <ReduxProvider store={store}>
                    <Computation />
                </ReduxProvider>
            </I18nextProvider>,
        );
        expect(screen.getByText('ComputationForm')).toBeTruthy();
    });

    test('if ComputationPending is rendered when stage is 2', () => {
        store.dispatch(actions.computation.changeStage(2));
        render(
            <I18nextProvider i18n={i18next}>
                <ReduxProvider store={store}>
                    <Computation />
                </ReduxProvider>
            </I18nextProvider>,
        );
        expect(screen.getByText('ComputationPending')).toBeTruthy();
    });

    test('if ComputationResult is rendered when stage is 3', () => {
        store.dispatch(actions.computation.changeStage(3));
        render(
            <I18nextProvider i18n={i18next}>
                <ReduxProvider store={store}>
                    <Computation />
                </ReduxProvider>
            </I18nextProvider>,
        );
        expect(screen.getByText('ComputationResult')).toBeTruthy();
    });
});
