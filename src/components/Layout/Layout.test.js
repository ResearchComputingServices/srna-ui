import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import Layout from '.';

describe('Layout', () => {
    test('component should be able to render html element as child', () => {
        const text = 'Hello World';
        const children = <div>Hello World</div>;
        render(<Layout>{children}</Layout>);
        expect(screen.queryByText(text)).toBeTruthy();
    });

    test('component should be able to text element as child', () => {
        const text = 'Hello World';
        render(<Layout>{text}</Layout>);
        expect(screen.queryByText(text)).toBeTruthy();
    });

    test('no content on error', () => {
        const text = 'Hello World';
        render(<Layout error>{text}</Layout>);
        expect(screen.queryByText(text)).toBeFalsy();
    });

    test('content is hidden but not unmounted on loading', () => {
        const text = 'Hello World';
        const { getByTestId } = render(<Layout loading>{text}</Layout>);
        expect(getByTestId('spinner')).toBeTruthy();
        expect(getByTestId('layout-content')).toBeTruthy();
        expect(screen.queryByText(text)).toBeTruthy();
    });

    test('content is unmounted and hidden on loading on unMountOnLoad props', () => {
        const text = 'Hello World';
        const { getByTestId } = render(
            <Layout
                loading
                unmountOnLoad
            >
                {text}
            </Layout>,
        );
        expect(getByTestId('spinner')).toBeTruthy();
        expect(getByTestId('layout-content')).toBeTruthy();
        expect(screen.queryByText(text)).toBeFalsy();
    });
});
