import React from 'react';
import { render, screen } from '@testing-library/react';
import NotFound from './NotFound';

describe('NotFound', () => {
    test('render', () => {
        render(<NotFound />);
        expect(screen.getAllByText('❓')).toHaveLength(2);
        expect(screen.getByText('404 Page Not Found')).toBeInTheDocument();
    });
});
