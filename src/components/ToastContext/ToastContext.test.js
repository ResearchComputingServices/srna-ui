import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ToastProvider, { useToast } from '.';
import Button from '../Button';

// eslint-disable-next-line react/prop-types
const ShowToast = ({ type }) => {
    const actions = useToast();
    return (
        <Button
            color='primary'
            data-testid='button'
            onClick={() => {
                actions[type](`Showing ${type} toast`);
            }}
        >
            Show
        </Button>
    );
};

describe('ToastProvider', () => {
    test('render success', async () => {
        render(<ToastProvider><ShowToast type='success' /></ToastProvider>);
        const message = 'Showing success toast';
        const button = screen.getByText('Show');
        expect(button).toBeInTheDocument();
        expect(() => screen.getByText(message)).toThrow('Unable to find an element');
        await waitFor(() => {
            fireEvent.click(button);
        });
        expect(screen.getByText(message)).toBeInTheDocument();
    });

    test('render warning', async () => {
        render(<ToastProvider><ShowToast type='warning' /></ToastProvider>);
        const message = 'Showing warning toast';
        const button = screen.getByText('Show');
        expect(button).toBeInTheDocument();
        expect(() => screen.getByText(message)).toThrow('Unable to find an element');
        await waitFor(() => {
            fireEvent.click(button);
        });
        expect(screen.getByText(message)).toBeInTheDocument();
    });

    test('render info', async () => {
        render(<ToastProvider><ShowToast type='info' /></ToastProvider>);
        const message = 'Showing info toast';
        const button = screen.getByText('Show');
        expect(button).toBeInTheDocument();
        expect(() => screen.getByText(message)).toThrow('Unable to find an element');
        await waitFor(() => {
            fireEvent.click(button);
        });
        expect(screen.getByText(message)).toBeInTheDocument();
    });

    test('render error', async () => {
        render(<ToastProvider><ShowToast type='error' /></ToastProvider>);
        const message = 'Showing error toast';
        const button = screen.getByText('Show');
        expect(button).toBeInTheDocument();
        expect(() => screen.getByText(message)).toThrow('Unable to find an element');
        await waitFor(() => {
            fireEvent.click(button);
        });
        expect(screen.getByText(message)).toBeInTheDocument();
    });

    test('default duration', async () => {
        jest.useFakeTimers();
        render(<ToastProvider><ShowToast type='error' /></ToastProvider>);
        const message = 'Showing error toast';
        const button = screen.getByText('Show');
        expect(button).toBeInTheDocument();
        expect(() => screen.getByText(message)).toThrow('Unable to find an element');
        await waitFor(() => {
            fireEvent.click(button);
        });
        expect(screen.getByText(message)).toBeInTheDocument();
        await waitFor(() => {
            jest.advanceTimersByTime(1000);
        });
        expect(screen.getByText(message)).toBeInTheDocument();
        await waitFor(() => {
            jest.advanceTimersByTime(6000);
        });
        expect(() => screen.getByText(message)).toThrow('Unable to find an element');
    });

    test('custom duration', async () => {
        jest.useFakeTimers();
        render(<ToastProvider duration={3000}><ShowToast type='error' /></ToastProvider>);
        const message = 'Showing error toast';
        const button = screen.getByText('Show');
        expect(button).toBeInTheDocument();
        expect(() => screen.getByText(message)).toThrow('Unable to find an element');
        await waitFor(() => {
            fireEvent.click(button);
        });
        expect(screen.getByText(message)).toBeInTheDocument();
        await waitFor(() => {
            jest.advanceTimersByTime(1000);
        });
        expect(screen.getByText(message)).toBeInTheDocument();
        await waitFor(() => {
            jest.advanceTimersByTime(3000);
        });
        expect(() => screen.getByText(message)).toThrow('Unable to find an element');
    });
});
