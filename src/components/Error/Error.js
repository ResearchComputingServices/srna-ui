import _ from 'lodash';
import React from 'react';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';

function PermissionDenied({ className, style }) {
    const Block = (
        <span
            aria-labelledby='block'
            role='img'
        >
            🚫
        </span>
    );
    return (
        <Box
            className={className}
            my={5}
            style={style}
            textAlign='center'
        >
            {Block}
            403 Permission Denied
            {Block}
        </Box>
    );
}

PermissionDenied.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
};

PermissionDenied.defaultProps = {
    className: '',
    style: undefined,
};
function BadRequest({ style, className }) {
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
            400 Bad Request
            {Question}
        </Box>
    );
}

BadRequest.propTypes = {
    style: PropTypes.object,
    className: PropTypes.string,
};

BadRequest.defaultProps = {
    style: {},
    className: '',
};

const ErrorComponent = ({ className, style, error, msg }) => {
    if (_.eq(error, 403)) {
        return <PermissionDenied />;
    }
    if (_.eq(error, 400)) {
        return <BadRequest />;
    }
    return (

        <Box
            className={className}
            my={5}
            style={style}
            textAlign='center'
        >
            {msg}
        </Box>
    );
};

ErrorComponent.propTypes = {
    msg: PropTypes.string,
    error: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.number,
    ]),
    className: PropTypes.string,
    style: PropTypes.object,
};

ErrorComponent.defaultProps = {
    msg: 'An unexpected error has occured.',
    error: false,
    className: '',
    style: undefined,
};

export default ErrorComponent;
