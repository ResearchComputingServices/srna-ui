import React from 'react';
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import commonEn from '../../translations/en/common.json';
import Layout from '.';

i18next.init({
    interpolation: { escapeValue: false },
    lng: 'en',
    resources: { en: { common: commonEn } },
});

describe('Layout', () => {
    test('component should be able to render html element as child', () => {
        const text = 'Hello World';
        const children = <div>Hello World</div>;
        render(
            <I18nextProvider i18n={i18next}>
                <Layout>{children}</Layout>
            </I18nextProvider>,
        );
        expect(screen.queryByText(text)).toBeTruthy();
    });

    test('component should be able to text element as child', () => {
        const text = 'Hello World';
        render(
            <I18nextProvider i18n={i18next}>
                <Layout>{text}</Layout>
            </I18nextProvider>,
        );
        expect(screen.queryByText(text)).toBeTruthy();
    });

    test('no content on error', () => {
        const text = 'Hello World';
        render(
            <I18nextProvider i18n={i18next}>
                <Layout error>{text}</Layout>
            </I18nextProvider>,
        );
        expect(screen.queryByText(text)).toBeFalsy();
        expect(screen.getByText('An unexpected error has occured.')).toBeInTheDocument();
    });

    test('content is hidden but not unmounted on loading', () => {
        const text = 'Hello World';
        render(
            <I18nextProvider i18n={i18next}>
                <Layout loading>{text}</Layout>
            </I18nextProvider>,
        );
        expect(screen.getByTestId('spinner')).toBeTruthy();
        expect(screen.getByTestId('layout-content')).toBeTruthy();
        expect(screen.queryByText(text)).toBeTruthy();
    });

    test('content is unmounted and hidden on loading on unMountOnLoad props', () => {
        const text = 'Hello World';
        render(
            <I18nextProvider i18n={i18next}>
                <Layout
                    loading
                    unmountOnLoad
                >
                    {text}
                </Layout>
            </I18nextProvider>,
        );
        expect(screen.getByTestId('spinner')).toBeTruthy();
        expect(screen.getByTestId('layout-content')).toBeTruthy();
        expect(screen.queryByText(text)).toBeFalsy();
    });
});
