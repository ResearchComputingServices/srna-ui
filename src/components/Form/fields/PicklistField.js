import _ from 'lodash';
import React from 'react';
import { Controller } from 'react-hook-form';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import { useStyles } from '..';

function formatDefaultValue(field) {
    const defaultValue = _.get(field, 'defaultValue');
    const isArray = _.get(field, 'multiple');
    if (_.isNil(defaultValue) || (_.eq(defaultValue, ''))) {
        return isArray ? [] : null;
    }
    return defaultValue;
}

function PicklistField({ field, controls: { control, errors } }) {
    const classes = useStyles();
    const multiple = _.get(field, 'multiple');
    const defaultValue = formatDefaultValue(field);
    const options = _.isFunction(field.options) ? field.options() : field.options;
    return (
        <Box className={classes.field}>
            <Controller
                getOptionLabel={option => option}
                getOptionSelected={(option, value) => _.eq(option, value)}
                rules={{
                    required: field.required,
                    ...(multiple && field.required ? { validate: data => !_.isEmpty(data) || '' } : {}),
                }}
                {..._.omit(field, ['key', 'className', 'options'])}
                as={<Autocomplete />}
                control={control}
                defaultValue={defaultValue}
                name={field.name}
                onChange={([, data]) => {
                    _.isFunction(field.onChange) && field.onChange(data);
                    return data;
                }}
                options={options}
                renderInput={
                    params => (
                        <TextField
                            {...params}
                            disabled={field.disabled}
                            helperText={field.helperText}
                            label={field.label}
                            required={field.required}
                            variant={field.variant}
                        />
                    )
                }
            />
            {field.field in errors && (_.eq(_.get(errors, [field.field, 'type']), 'custom') ? (
                <Box className={classes.error}>
                    {errors[field.field].message}
                </Box>
            ) : (
                <Box className={classes.error}>
                    The field &quot;
                    {field.label}
                    &quot; is Mandatory for save
                </Box>
            ))}
        </Box>
    );
}

PicklistField.propTypes = {
    field: PropTypes.object.isRequired,
    controls: PropTypes.object.isRequired,
};

export default PicklistField;
