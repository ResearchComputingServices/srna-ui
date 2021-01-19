import React from 'react';
import PropTypes from 'prop-types';
import { Box, makeStyles } from '@material-ui/core';
import { DropzoneDialog } from 'material-ui-dropzone';
import { useTranslation } from 'react-i18next';
import { Button } from '..';

const useStyles = makeStyles(theme => ({ button: { marginRight: theme.spacing(2) } }));

const FileUploader = ({
    className,
    style,
    onSave,
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
            {formatFilename(filename, 80)}
        </Box>
    );
};

FileUploader.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    onSave: PropTypes.func.isRequired,
};

FileUploader.defaultProps = {
    className: '',
    style: {},
};

export default FileUploader;
