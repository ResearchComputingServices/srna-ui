import React from 'react';
import { noop } from 'lodash';
import PropTypes from 'prop-types';
import Toast from '../Toast';

const Context = React.createContext({
    error: noop,
    success: noop,
    warning: noop,
    info: noop,
});

const ToastContext = ({
    duration = 6000,
    orientation = 'bottom-right',
    children,
}) => {
    const orientationFragment = orientation.split('-');
    const initialState = {
        open: false,
        message: '',
        type: 'info',
        vertical: orientationFragment[0],
        horizontal: orientationFragment[1],
    };
    const [state, setState] = React.useState(initialState);
    const stateRef = React.useRef(initialState);
    stateRef.current = state;
    const handleClose = (_event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setState(s => ({
            ...s,
            open: false,
        }));
    };
    const success = (message, orientation) => {
        orientation = orientation || `${stateRef.current.vertical}-${stateRef.current.horizontal}`;
        const orientationFragment = orientation.split('-');
        setState(s => ({
            ...s,
            open: true,
            message,
            type: 'success',
            vertical: orientationFragment[0],
            horizontal: orientationFragment[1],
        }));
    };
    const warning = (message, orientation) => {
        orientation = orientation || `${stateRef.current.vertical}-${stateRef.current.horizontal}`;
        const orientationFragment = orientation.split('-');
        setState(s => ({
            ...s,
            open: true,
            message,
            type: 'warning',
            vertical: orientationFragment[0],
            horizontal: orientationFragment[1],
        }));
    };
    const error = (message, orientation) => {
        orientation = orientation || `${stateRef.current.vertical}-${stateRef.current.horizontal}`;
        const orientationFragment = orientation.split('-');
        setState(s => ({
            ...s,
            open: true,
            message,
            type: 'error',
            vertical: orientationFragment[0],
            horizontal: orientationFragment[1],
        }));
    };
    const info = (message, orientation) => {
        orientation = orientation || `${stateRef.current.vertical}-${stateRef.current.horizontal}`;
        const orientationFragment = orientation.split('-');
        setState(s => ({
            ...s,
            open: true,
            message,
            type: 'info',
            vertical: orientationFragment[0],
            horizontal: orientationFragment[1],
        }));
    };
    return (
        <Context.Provider
            value={{
                success,
                error,
                info,
                warning,
            }}
        >
            {children}
            <Toast
                duration={duration}
                horizontal={state.horizontal}
                onClose={handleClose}
                open={state.open}
                type={state.type}
                vertical={state.vertical}
            >
                {state.message}
            </Toast>
        </Context.Provider>
    );
};

export const useToast = () => React.useContext(Context);

ToastContext.propTypes = {
    duration: PropTypes.number,
    orientation: PropTypes.string,
    children: PropTypes.node.isRequired,
};

ToastContext.defaultProps = {
    duration: 6000,
    orientation: 'bottom-right',
};

export default ToastContext;
