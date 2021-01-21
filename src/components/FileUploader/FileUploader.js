import React from 'react';
import PropTypes from 'prop-types';
import { Box, makeStyles, Typography, Tooltip } from '@material-ui/core';
import { DropzoneDialog } from 'material-ui-dropzone';
import { useTranslation } from 'react-i18next';
import Button from '../Button';

export const useStyles = makeStyles(theme => ({
    error: { color: theme.palette.error.main },
    button: { marginRight: theme.spacing(2) },
}));

const FileUploader = ({
    className,
    style,
    onSave,
    error,
    acceptedFiles,
}) => {
    const classes = useStyles();
    const [filename, setFilename] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [t] = useTranslation('common');
    const characterLimit = 20;

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

    const formatFilename = (str, limit) => (str ? (str.length > limit ? `${str.slice(0, limit)}...` : str) : null);

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
                {filename === '' ? t('fileUploader.chooseFile') : t('fileUploader.changeFile')}
            </Button>
            <DropzoneDialog
                acceptedFiles={acceptedFiles}
                filesLimit={1}
                maxFileSize={Infinity}
                onClose={handleClose}
                onSave={handleSave}
                open={open}
                showPreviews
            />
            {
                !error && filename.length > characterLimit
                    ? <Tooltip title={filename || ''}><Typography>{formatFilename(filename, characterLimit)}</Typography></Tooltip>
                    : <Typography>{filename}</Typography>
            }
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
    acceptedFiles: PropTypes.array,
};

FileUploader.defaultProps = {
    className: '',
    style: {},
    error: undefined,
    acceptedFiles: [],
};

export default FileUploader;
