import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import PropTypes from 'prop-types';

const Toast = ({
    vertical,
    horizontal,
    duration,
    open,
    type,
    children,
    onClose,
}) => (
    <Snackbar
        anchorOrigin={{
            vertical,
            horizontal,
        }}
        autoHideDuration={duration}
        onClose={onClose}
        open={open}
    >
        <Alert
            onClose={onClose}
            severity={type}
        >
            {children}
        </Alert>
    </Snackbar>
);

Toast.propTypes = {
    vertical: PropTypes.oneOf(['top', 'bottom']).isRequired,
    horizontal: PropTypes.oneOf(['left', 'right', 'center']).isRequired,
    duration: PropTypes.number.isRequired,
    open: PropTypes.bool.isRequired,
    type: PropTypes.oneOf(['success', 'info', 'warning', 'error', undefined]).isRequired,
    children: PropTypes.node.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default Toast;
