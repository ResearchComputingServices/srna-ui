import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MuiButton from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import _ from 'lodash';
import clsx from 'clsx';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import { Ripple } from '..';
import { useMountedState } from '../../hooks';

export const useStyles = makeStyles(() => ({
    inline: {
        display: 'flex',
        alignItems: 'center',
    },
}));

function Button(props) {
    const classes = useStyles();
    const [loading, setLoading] = useState(false);
    const { className, children, onClick, disabled, inline } = props;
    const isMounted = useMountedState();
    return (
        <Box
            className={clsx({ [classes.inline]: inline })}
            display='inline'
        >
            <MuiButton
                className={className}
                disabled={loading || disabled}
                onClick={
                    _.isFunction(onClick)
                        ? async () => {
                            setLoading(true);
                            try {
                                await onClick();
                            } catch (err) {} finally {
                                if (isMounted()) {
                                    setLoading(false);
                                }
                            }
                        }
                        : undefined
                }
                variant={!inline ? 'contained' : undefined}
                {..._.omit(props, ['className', 'disabled', 'onClick', 'inline'])}
            >
                {!loading && !inline && children}
                {inline && children}
                {!inline && loading && (
                    <CircularProgress
                        height={25}
                        width={25}
                    />
                )}
            </MuiButton>
            {loading && inline && (
                <Ripple
                    size={35}
                />
            )}
        </Box>
    );
}

Button.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    inline: PropTypes.bool,
};

Button.defaultProps = {
    onClick: undefined,
    disabled: undefined,
    className: '',
    inline: false,
};

export default Button;
