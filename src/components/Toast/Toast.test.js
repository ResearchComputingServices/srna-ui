import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Toast from '.';
import Button from '../Button';

// eslint-disable-next-line react/prop-types
const ShowToast = ({ type }) => {
    const [open, setOpen] = React.useState(false);
    return (
        <>
            <Button
                color='primary'
                data-testid='button'
                onClick={() => setOpen(true)}
            >
                Show
            </Button>
            <Toast
                duration={1000}
                horizontal='right'
                message={`Showing ${type} toast`}
                onClose={() => setOpen(false)}
                open={open}
                type={type}
                vertical='bottom'
            >
                It works
            </Toast>
        </>
    );
};

describe('Toast', () => {
    const message = 'It works';

    test('render success', async () => {
        render(<ShowToast type='success' />);
        const button = screen.getByText('Show');
        expect(button).toBeInTheDocument();
        expect(() => screen.getByText(message)).toThrow('Unable to find an element');
        await waitFor(() => {
            fireEvent.click(button);
        });
        expect(screen.getByText(message)).toBeInTheDocument();
    });

    test('render warning', async () => {
        render(<ShowToast type='warning' />);
        const button = screen.getByText('Show');
        expect(button).toBeInTheDocument();
        expect(() => screen.getByText(message)).toThrow('Unable to find an element');
        await waitFor(() => {
            fireEvent.click(button);
        });
        expect(screen.getByText(message)).toBeInTheDocument();
    });

    test('render info', async () => {
        render(<ShowToast type='info' />);
        const button = screen.getByText('Show');
        expect(button).toBeInTheDocument();
        expect(() => screen.getByText(message)).toThrow('Unable to find an element');
        await waitFor(() => {
            fireEvent.click(button);
        });
        expect(screen.getByText(message)).toBeInTheDocument();
    });

    test('render error', async () => {
        render(<ShowToast type='error' />);
        const button = screen.getByText('Show');
        expect(button).toBeInTheDocument();
        expect(() => screen.getByText(message)).toThrow('Unable to find an element');
        await waitFor(() => {
            fireEvent.click(button);
        });
        expect(screen.getByText(message)).toBeInTheDocument();
    });

    test('duration', async () => {
        jest.useFakeTimers();
        render(<ShowToast type='error' />);
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
