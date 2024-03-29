import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import Tutorial from '.';
import commonEn from '../../translations/en/common.json';

jest.mock('../../services/TutorialService', () => ({ getReadme: () => new Promise(resolve => setTimeout(() => resolve('Hello, world!'), 1000)) }));

i18next.init({
    interpolation: { escapeValue: false },
    lng: 'en',
    resources: { en: { common: commonEn } },
});

describe('Tutorial', () => {
    test('render', async () => {
        jest.useFakeTimers();
        render(
            <I18nextProvider i18n={i18next}>
                <Tutorial />
            </I18nextProvider>,
        );
        await waitFor(() => jest.advanceTimersByTime((100)));
        expect(screen.getByTestId('spinner')).toBeInTheDocument();
        expect(await screen.findByText(/Hello, world!/i)).toBeInTheDocument();
        expect(screen.queryByTestId('spinner')).toBeFalsy();
    });
});
