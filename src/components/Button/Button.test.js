import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Button from '.';

const onClick = async () => new Promise(resolve => setTimeout(() => resolve(), 10000));

describe('Button', () => {
    test('render block Button', () => {
        render(<Button onClick={onClick}>Default</Button>);
        expect(() => screen.getByTestId('button-default-spinner')).toThrow('Unable to find an element');
        expect(() => screen.getByTestId('button-inline-spinner')).toThrow('Unable to find an element');
        fireEvent.click(screen.getByText('Default'));
        expect(() => screen.getByTestId('button-inline-spinner')).toThrow('Unable to find an element');
        expect(screen.getByTestId('button-default-spinner')).toBeTruthy();
    });

    test('render inline Button', () => {
        render((
            <Button
                inline
                onClick={onClick}
            >
                Inline
            </Button>
        ));
        expect(() => screen.getByTestId('button-default-spinner')).toThrow('Unable to find an element');
        expect(() => screen.getByTestId('button-inline-spinner')).toThrow('Unable to find an element');
        fireEvent.click(screen.getByText('Inline'));
        expect(() => screen.getByTestId('button-default-spinner')).toThrow('Unable to find an element');
        expect(screen.getByTestId('button-inline-spinner')).toBeTruthy();
    });
});
