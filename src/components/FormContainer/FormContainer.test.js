import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import FormContainer from '.';

describe('FormContainer', () => {
    test('render with no title', () => {
        render(<FormContainer>Hello World</FormContainer>);
        expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    test('render with title', () => {
        render(<FormContainer title='Some Title'>Hello World</FormContainer>);
        expect(screen.getByText('Hello World')).toBeInTheDocument();
        expect(screen.getByText('Some Title')).toBeInTheDocument();
    });
});
