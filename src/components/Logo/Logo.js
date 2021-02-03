import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import logo from '../../assets/images/carleton.svg';

export const useStyles = makeStyles(theme => ({
    root: {
        background: 'white',
        padding: theme.spacing(1),
    },
}));

const Logo = ({ width, height, className, style }) => {
    const classes = useStyles();
    return (
        <img
            alt='Carleton University'
            className={clsx(className, classes.root)}
            height={height}
            src={logo}
            style={style}
            width={width}
        />
    );
};

Logo.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    className: PropTypes.string,
    style: PropTypes.object,
};

Logo.defaultProps = {
    height: 64,
    width: 250,
    className: '',
    style: undefined,
};

export default Logo;
