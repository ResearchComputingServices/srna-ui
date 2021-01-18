import React, { useState } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Layout } from '..';
import { useData, useService } from '../../hooks';

export const useStyles = makeStyles(() => ({
    scaleDown: {
        width: '100%',
        height: '100%',
        objectFit: 'scale-down',
    },
}));

function Image({ imageName, className, style }) {
    const fileService = useService('file');
    const [image, setImage] = useState(null);
    const classes = useStyles();

    const [loading] = useData(async () => {
        if (!_.isEmpty(imageName) && !_.isNil(imageName)) {
            const downloadedImage = await fileService.download(imageName);
            setImage(URL.createObjectURL(downloadedImage.data));
        }
    }, [imageName]);

    return (
        <Layout
            className={className}
            loading={loading}
            style={style}
        >
            <img
                alt={imageName}
                className={classes.scaleDown}
                src={image}
            />
        </Layout>
    );
}

Image.propTypes = {
    imageName: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
};

Image.defaultProps = {
    imageName: '',
    className: undefined,
    style: undefined,
};

export default Image;
