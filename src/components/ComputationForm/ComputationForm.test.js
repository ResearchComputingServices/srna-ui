import React from 'react';
import { render, screen } from '@testing-library/react';
import i18next from 'i18next';
import { Provider as ReduxProvider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import ComputationForm from './ComputationForm';
import commonEn from '../../translations/en/common.json';
import store from '../../redux/store';

i18next.init({
    interpolation: { escapeValue: false },
    lng: 'en',
    resources: { en: { common: commonEn } },
});

describe('ComputationForm', () => {
    test('if screen is rendered correctly', () => {
        render((
            <I18nextProvider i18n={i18next}>
                <ReduxProvider store={store} >
                    <ComputationForm />
                </ReduxProvider>
            </I18nextProvider>
        ));
        expect(screen.getByText('Query Sequence:')).toBeInTheDocument();
        expect(screen.getByText('Format')).toBeInTheDocument();

        expect(screen.getByText('General Settings:')).toBeInTheDocument();
        expect(screen.getByText('Shift Position')).toBeInTheDocument();
        expect(screen.getByText('sRNA Length')).toBeInTheDocument();
        expect(screen.getByText('Compute sRNAs only for these tags')).toBeInTheDocument();
        expect(screen.getByText('Blast sRNAs against input genome')).toBeInTheDocument();

        expect(screen.getByText('Blast Settings:')).toBeInTheDocument();
        expect(screen.getByText('Expected cut off')).toBeInTheDocument();
        expect(screen.getByText('Identity (%)')).toBeInTheDocument();
        expect(screen.getByText('Re-compute sRNAS with hits in the genome')).toBeInTheDocument();
        expect(screen.getByText('Shift Position (for recomputing)')).toBeInTheDocument();

        expect(screen.getAllByText('Choose File')).toHaveLength(2);

        expect(screen.getByText('Run')).toBeInTheDocument();
    });
});
