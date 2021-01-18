import React, { useState } from 'react';
import {
    Menu,
    MenuItem,
    Box,
    Typography,
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() => ({
    root: {
        marginBottom: 'auto',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        outlineStyle: 'none',
        cursor: 'pointer',
        width: 180,
        height: 64,
    },
}));

function UserMenu({ displayName, dropdowns }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const handleOpen = event => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const classes = useStyles();
    dropdowns = _.compact(dropdowns);

    return (
        <Box>
            <Box
                className={classes.root}
                onClick={handleOpen}
                onKeyDown={() => _.noop()}
                role='menuitem'
                tabIndex={0}
            >
                <Typography variant='h6'>{displayName}</Typography>
                {!_.isEmpty(dropdowns) && <ArrowDropDownIcon />}
            </Box>
            {!_.isEmpty(dropdowns)
                && (
                    <Menu
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                        elevation={2}
                        getContentAnchorEl={null}
                        keepMounted
                        onClose={handleClose}
                        open={Boolean(anchorEl)}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                    >
                        {_.map(dropdowns, (dropdown, index) => (
                            <MenuItem
                                key={index}
                                disabled={dropdown.disabled}
                                onClick={(...args) => {
                                    _.isFunction(dropdown.handler) && dropdown.handler(...args);
                                    handleClose();
                                }}
                            >
                                {dropdown.Icon}
                                <Box
                                    display='inline'
                                    pl={2}
                                >
                                    {dropdown.title}
                                </Box>
                            </MenuItem>
                        ))}
                    </Menu>
                )}
        </Box>
    );
}

UserMenu.propTypes = {
    dropdowns: PropTypes.array,
    displayName: PropTypes.string.isRequired,
};

UserMenu.defaultProps = { dropdowns: [] };

export default UserMenu;
