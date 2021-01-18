import React, { useState } from 'react';
import { Box, Button, TextField, LinearProgress } from '@material-ui/core';
import { Controller } from 'react-hook-form';
import { DropzoneArea } from 'material-ui-dropzone';
import UploadIcon from '@material-ui/icons/Publish';
import _ from 'lodash';
import { v4 } from 'uuid';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { ModalInfo } from '..';
import { useStyles as useFormStyles } from '../Form';
import { useForm } from '../../hooks';

export const useStyles = makeStyles(theme => ({
    show: { display: 'visible' },
    hide: { display: 'none' },
    marginTop: { marginTop: theme.spacing(3) },
    marginRight: { marginRight: theme.spacing(3) },
}));

function FileUploader({
    onUpload,
    acceptedFiles,
    as: Component,
    style,
    className,
}) {
    const { handleSubmit, register, unregister, errors, control, setValue, clearError, getValues } = useForm();
    const [modalLoading, setModalLoading] = useState(false);
    const [show, setShow] = useState(false);
    const classes = useStyles();
    const formClasses = useFormStyles();

    const handleClose = () => {
        setShow(false);
        unregister('file');
    };

    const handleOpen = () => {
        register({ name: 'file' }, { required: true });
        setShow(true);
    };

    const handleFileChange = files => {
        clearError(['file', 'name']);
        if (!_.isEmpty(files)) {
            setValue('file', files);
            if (_.isEmpty(getValues('name'))) {
                setValue('name', v4());
            }
        } else {
            setValue('file', undefined);
            setValue('name', '');
        }
    };

    const uploadFile = async data => {
        setModalLoading(true);
        if (_.isFunction(onUpload)) {
            if (_.isFunction(onUpload)) {
                await onUpload(data);
            }
        }
        setModalLoading(false);
    };

    return (
        <Box
            className={className}
            style={style}
        >
            {!_.isNil(Component) && (
                <Component
                    handleClose={handleClose}
                    handleOpen={handleOpen}
                />
            )}
            {_.isNil(Component) && (
                <Button
                    color='primary'
                    onClick={handleOpen}
                    startIcon={<UploadIcon />}
                    variant='contained'
                >
                    Upload
                </Button>
            )}
            <ModalInfo
                buttons={[
                    {
                        props: {
                            className: classes.marginRight,
                            color: 'primary',
                            disabled: _.isEmpty(getValues('name')) || !_.isEmpty(errors) || modalLoading,
                            variant: 'contained',
                        },
                        name: 'uploadFile',
                        onClick: handleSubmit(uploadFile),
                        hideModal: true,
                        title: 'Upload File',
                    },
                    {
                        props: {
                            color: 'primary',
                            variant: 'contained',
                        },
                        name: 'cancel',
                        hideModal: true,
                        title: 'Cancel',
                    },
                ]}
                onHide={handleClose}
                show={show}
                title='Upload File'
            >
                <LinearProgress className={
                    clsx(classes.marginTop, {
                        [classes.show]: modalLoading,
                        [classes.hide]: !modalLoading,
                    })
                }
                />
                <Box className={formClasses.field}>
                    <Controller
                        as={TextField}
                        control={control}
                        defaultValue=''
                        disabled
                        fullWidth
                        label='Generated Filename'
                        name='name'
                        required
                        rules={{ required: true }}
                        variant='outlined'
                    />
                    {'name' in errors && <Box className={formClasses.error}>A filename is Mandatory for save</Box>}
                </Box>
                <Box className={formClasses.field}>
                    <DropzoneArea
                        acceptedFiles={acceptedFiles}
                        name='file'
                        onChange={handleFileChange}
                        showAlerts={false}
                    />
                    {'file' in errors && <Box className={formClasses.error}>A file is Mandatory for save</Box>}
                </Box>
            </ModalInfo>
        </Box>
    );
}

FileUploader.propTypes = {
    onUpload: PropTypes.func,
    acceptedFiles: PropTypes.array,
    as: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.string,
};

FileUploader.defaultProps = {
    onUpload: _.noop,
    acceptedFiles: undefined,
    as: undefined,
    style: undefined,
    className: undefined,
};

export default FileUploader;
