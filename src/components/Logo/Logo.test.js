import React from 'react';
import { render, screen } from '@testing-library/react';
import Logo from './Logo';

describe('Logo', () => {
    test('render', () => {
        render(<Logo />);
        const img = screen.getByAltText('Carleton University');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('height', '64');
        expect(img).toHaveAttribute('width', '250');
        expect(img).toHaveAttribute('src', 'carleton.svg');
    });
});
