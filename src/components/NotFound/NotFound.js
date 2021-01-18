import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';

function NotFound({ className, style }) {
    const Question = (
        <span
            aria-labelledby='question'
            role='img'
        >
            ❓
        </span>
    );
    return (
        <Box
            className={className}
            my={5}
            style={style}
            textAlign='center'
        >
            {Question}
            404 Page Not Found
            {Question}
        </Box>
    );
}

NotFound.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

NotFound.defaultProps = {
    className: '',
    style: undefined,
};

export default NotFound;
