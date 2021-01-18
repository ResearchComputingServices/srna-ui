import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';

function NotYetImplemented({ style, className }) {
    const Construction = (
        <span
            aria-labelledby='under-construction'
            role='img'
        >
            🚧
        </span>
    );
    return (
        <Box
            className={className}
            my={5}
            style={style}
            textAlign='center'
        >
            {Construction}
            Coming Soon, Implementation in progress
            {Construction}
        </Box>
    );
}

NotYetImplemented.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

NotYetImplemented.defaultProps = {
    className: '',
    style: undefined,
};

export default NotYetImplemented;
