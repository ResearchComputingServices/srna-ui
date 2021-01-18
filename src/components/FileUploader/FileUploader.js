import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';
import { DropzoneDialog } from 'material-ui-dropzone';
import { Button } from '..';

const FileUploader = ({
    className,
    style,
    title, onSave,
}) => {
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = files => {
        setOpen(false);
        onSave(files);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    return (
        <Box
            className={className}
            style={style}
        >
            <Button
                color='primary'
                onClick={handleOpen}
            >
                {title}
            </Button>
            <DropzoneDialog
                onClose={handleClose}
                onSave={handleSave}
                open={open}
                showPreviews
            />
        </Box>
    );
};

FileUploader.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    title: PropTypes.string,
    onSave: PropTypes.func.isRequired,
};

FileUploader.defaultProps = {
    className: '',
    style: {},
    title: 'Add File',
};

export default FileUploader;
