import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider as ReduxProvider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import Root from '.';
import store from '../../redux/store';
import commonEn from '../../translations/en/common.json';

i18next.init({
    interpolation: { escapeValue: false },
    lng: 'en',
    resources: { en: { common: commonEn } },
});

describe('Root', () => {
    test('render', () => {
        render(
            <I18nextProvider i18n={i18next}>
                <ReduxProvider store={store}>
                    <Root />
                </ReduxProvider>
            </I18nextProvider>,
        );
        expect(screen.getByText('sRNA Computation')).toBeInTheDocument();
        expect(screen.getByText('Settings')).toBeInTheDocument();
    });
});
