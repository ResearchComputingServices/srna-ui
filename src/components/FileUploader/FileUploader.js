import React from 'react';
import PropTypes from 'prop-types';
import { Box, makeStyles } from '@material-ui/core';
import { DropzoneDialog } from 'material-ui-dropzone';
import { Button } from '..';

const useStyles = makeStyles(theme => ({ button: { marginRight: theme.spacing(2) } }));

const FileUploader = ({
    className,
    style,
    title, onSave,
}) => {
    const classes = useStyles();
    const [filename, setFilename] = React.useState(false);
    const [open, setOpen] = React.useState(false);

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

    const formatFilename = (str, limit) => (str.length > limit ? `${str.slice(0, limit)}...` : str);

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
                {title}
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
    title: PropTypes.string,
    onSave: PropTypes.func.isRequired,
};

FileUploader.defaultProps = {
    className: '',
    style: {},
    title: 'Add File',
};

export default FileUploader;
