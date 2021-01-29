import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import { makeStyles, useTheme } from '@material-ui/core/styles';

export const useStyles = makeStyles(theme => ({
    root: {
        display: 'inline-block',
        position: 'relative',
        width: 60,
        height: 60,
    },
    children: {
        position: 'absolute',
        border: '4px solid #fff',
        opacity: 0,
        borderRadius: '60%',
        borderColor: theme.palette.primary.main,
        animation: '$Ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite',
        '&:nth-child(2)': { animationDelay: '0.5s' },
    },
    '@keyframes Ripple': {
        '0%': {
            top: '45%',
            left: '45%',
            width: 0,
            height: 0,
            opacity: 1,
        },
        '100%': {
            top: 0,
            left: 0,
            width: '90%',
            height: '90%',
            opacity: 0,
        },
    },
}));

export default function Ripple({ color, className, style, size, ...rest }) {
    const classes = useStyles();
    const theme = useTheme();
    const colorMap = {
        primary: theme.palette.primary.main,
        secondary: theme.palette.secondary.main,
        warning: theme.palette.warning.main,
        undefined: theme.palette.primary.main,
    };
    const circles = [0, 1].map(value => (
        <Box
            key={value}
            className={classes.children}
            data-testid={`ripple-children-${value}`}
            style={{
                ...color ? { borderColor: colorMap[color] } : {},
                borderWidth: size * 0.05,
            }}
        />
    ));

    return (
        <Box
            {...rest}
            className={clsx(classes.root, className)}
            style={{ width: size, height: size, ...style }}
        >
            {circles}
        </Box>
    );
}

Ripple.propTypes = {
    color: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    size: PropTypes.number,
};

Ripple.defaultProps = {
    color: 'primary',
    className: '',
    style: {},
    size: 80,
};
