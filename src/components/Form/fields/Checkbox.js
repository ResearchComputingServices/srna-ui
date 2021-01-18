import React from 'react';
import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import { Box, FormControlLabel, Checkbox as Check } from '@material-ui/core';
import _ from 'lodash';
import { useStyles } from '..';

function formatDefaultValue(field) {
    const defaultValue = _.get(field, 'defaultValue');
    if (_.isNil(defaultValue)) {
        return false;
    }
    return defaultValue;
}

function Checkbox({ field, controls: { control, errors } }) {
    const classes = useStyles();
    return (
        <Box className={classes.field}>
            <Controller
                {..._.omit(field, ['key', 'className', 'fullWidth'])}
                as={(
                    <FormControlLabel control={<Check color='primary' />} />
                )}
                control={control}
                defaultValue={formatDefaultValue(field)}
                rules={{ required: field.required }}
            />
            {field.field in errors && (_.eq(_.get(errors, [field.field, 'type']), 'custom') ? (
                <Box className={classes.field}>
                    {errors[field.field].message}
                </Box>
            ) : (
                <Box className={classes.field}>
                    The field &quot;
                    {field.label}
                    &quot; is Mandatory for save
                </Box>
            ))}
        </Box>
    );
}

Checkbox.propTypes = {
    field: PropTypes.object.isRequired,
    controls: PropTypes.object.isRequired,
};

export default Checkbox;
