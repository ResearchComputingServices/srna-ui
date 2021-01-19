import React from 'react';
import PropTypes from 'prop-types';
import { Box, makeStyles, Typography } from '@material-ui/core';
import { DropzoneDialog } from 'material-ui-dropzone';
import { useTranslation } from 'react-i18next';
import { Button } from '..';

export const useStyles = makeStyles(theme => ({
    error: { color: theme.palette.error.main },
    button: { marginRight: theme.spacing(2) },
}));

const FileUploader = ({
    className,
    style,
    onSave,
    error,
}) => {
    const classes = useStyles();
    const [filename, setFilename] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [t] = useTranslation('common');

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = files => {
        setOpen(false);
        setFilename(files[0].name);
        onSave(files);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const formatFilename = (str, limit) => (filename ? (str.length > limit ? `${str.slice(0, limit)}...` : str) : null);

    return (
        <Box
            alignItems='center'
            className={className}
            display='flex'
            flexDirection='row'
            style={style}
        >
            <Button
                className={classes.button}
                color='primary'
                onClick={handleOpen}
            >
                {filename == null ? t('fileUploader.chooseFile') : t('fileUploader.changeFile')}
            </Button>
            <DropzoneDialog
                filesLimit={1}
                onClose={handleClose}
                onSave={handleSave}
                open={open}
                showPreviews
            />
            {!error && formatFilename(filename, 80)}
            {error && <Typography className={classes.error}>{error.message}</Typography>}
        </Box>
    );
};

FileUploader.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    onSave: PropTypes.func.isRequired,
    error: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.bool,
    ]),
};

FileUploader.defaultProps = {
    className: '',
    style: {},
    error: undefined,
};

export default FileUploader;
