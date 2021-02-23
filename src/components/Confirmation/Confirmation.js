import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@material-ui/core';

function Confirmation({
    content,
    onConfirm,
    onClose,
    open,
}) {
    const [t] = useTranslation('common');
    return (
        <Dialog
            onClose={onClose}
            open={open}
        >
            <DialogTitle>{t('confirmation.title')}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    color='primary'
                    onClick={onConfirm}
                >
                    {t('confirmation.ok')}
                </Button>
                <Button
                    autoFocus
                    color='primary'
                    onClick={onClose}
                >
                    {t('confirmation.cancel')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

Confirmation.propTypes = {
    content: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.string,
    ]).isRequired,
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
};

export default Confirmation;
