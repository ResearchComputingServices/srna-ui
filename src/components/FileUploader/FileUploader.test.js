import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider as ReduxProvider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import FileUploader from '.';
import store from '../../redux/store';
import commonEn from '../../translations/en/common.json';

i18next.init({
    interpolation: { escapeValue: false },
    lng: 'en',
    resources: { en: { common: commonEn } },
});

describe('FileUploader', () => {
    test('if Choose File button opens up dialog', async () => {
        const onSave = jest.fn();
        render(
            <I18nextProvider i18n={i18next}>
                <ReduxProvider store={store}>
                    <FileUploader onSave={onSave} />
                </ReduxProvider>
            </I18nextProvider>,
        );
        const button = screen.getByText('Choose File');
        expect(button).toBeInTheDocument();
        await waitFor(() => fireEvent.click(button));
        expect(screen.getByText('Upload file')).toBeInTheDocument();
        const fileInput = screen.getByText('Drag and drop a file here or click');
        expect(fileInput).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
        expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    test('if error shows up', async () => {
        const onSave = jest.fn();
        render(
            <I18nextProvider i18n={i18next}>
                <ReduxProvider store={store}>
                    <FileUploader
                        error={new Error('An error has occured')}
                        onSave={onSave}
                    />
                </ReduxProvider>
            </I18nextProvider>,
        );
        expect(screen.getByText('Choose File')).toBeInTheDocument();
        expect(screen.getByText('An error has occured')).toBeInTheDocument();
    });
});
