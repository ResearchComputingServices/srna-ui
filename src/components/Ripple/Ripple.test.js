import React from 'react';
import { render, screen } from '@testing-library/react';
import Ripple from '.';

describe('Ripple', () => {
    test('render default props', () => {
        render(<Ripple />);
        const child1 = screen.getByTestId('ripple-children-0');
        const child2 = screen.getByTestId('ripple-children-1');
        expect(child1).toHaveStyle('border-color: #3f51b5');
        expect(child1).not.toHaveStyle('border-color: red');
        expect(child2).toHaveStyle('border-color: #3f51b5');
        expect(child2).not.toHaveStyle('border-color: red');
        expect(child1).toHaveStyle(`border-width: ${80 * 0.05}px`);
        expect(child2).toHaveStyle(`border-width: ${80 * 0.05}px`);
    });

    test('render custom props', () => {
        render(<Ripple
            className='w-100'
            color='secondary'
            data-testid='ripple-root'
            size={120}
            style={{ backgroundColor: 'pink' }}
        />);
        const root = screen.getByTestId('ripple-root');
        const child1 = screen.getByTestId('ripple-children-0');
        const child2 = screen.getByTestId('ripple-children-1');
        expect(root).toHaveStyle('background-color: pink');
        expect(root).toHaveClass('w-100');
        expect(root).not.toHaveStyle('background-color: white');
        expect(child1).toHaveStyle('border-color: #f50057');
        expect(child1).not.toHaveStyle('border-color: #3f51b5');
        expect(child2).toHaveStyle('border-color: #f50057');
        expect(child2).not.toHaveStyle('border-color: #3f51b5');
        expect(child1).toHaveStyle(`border-width: ${120 * 0.05}px`);
        expect(child1).not.toHaveStyle(`border-width: ${80 * 0.05}px`);
        expect(child2).toHaveStyle(`border-width: ${120 * 0.05}px`);
        expect(child2).not.toHaveStyle(`border-width: ${80 * 0.05}px`);
    });
});
