import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import Confirmation from '.';
import commonEn from '../../translations/en/common.json';

i18next.init({
    interpolation: { escapeValue: false },
    lng: 'en',
    resources: { en: { common: commonEn } },
});

describe('Confirmation', () => {
    test('Check if content gets displayed accurately and buttons work accordingly', async () => {
        const onConfirm = jest.fn();
        const onClose = jest.fn();
        render(
            <I18nextProvider i18n={i18next}>
                <Confirmation
                    content='Testing'
                    onClose={onClose}
                    onConfirm={onConfirm}
                    open
                />
            </I18nextProvider>,
        );
        const confirmButton = screen.getByText('Ok');
        const cancelButton = screen.getByText('Cancel');
        expect(confirmButton).toBeInTheDocument();
        expect(cancelButton).toBeInTheDocument();
        expect(screen.getByText('Testing')).toBeInTheDocument();
        await waitFor(() => fireEvent.click(confirmButton));
        await waitFor(() => fireEvent.click(cancelButton));
        expect(onConfirm.mock.calls.length).toEqual(1);
        expect(onClose.mock.calls.length).toEqual(1);
    });

    test('If open is set as false Confirmation component should not show up', async () => {
        const onConfirm = jest.fn();
        const onClose = jest.fn();
        render(
            <I18nextProvider i18n={i18next}>
                <Confirmation
                    content='Testing'
                    onClose={onClose}
                    onConfirm={onConfirm}
                    open={false}
                />
            </I18nextProvider>,
        );
        const confirmButton = screen.queryByText('Ok');
        const cancelButton = screen.queryByText('Cancel');
        expect(confirmButton).toBeFalsy();
        expect(cancelButton).toBeFalsy();
        expect(screen.queryByText('Testing')).toBeFalsy();
    });
});
