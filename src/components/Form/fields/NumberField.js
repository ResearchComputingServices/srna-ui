import _ from 'lodash';
import React from 'react';
import { Controller } from 'react-hook-form';
import PropTypes from 'prop-types';
import { TextField, Box } from '@material-ui/core';
import { useStyles } from '..';

function formatDefaultValue(field) {
    const defaultValue = _.get(field, 'defaultValue');
    if (_.isNil(defaultValue)) {
        return '';
    }
    return defaultValue;
}

function getRangeErrorMessage(label, min, max) {
    if (!_.isNil(max) && !_.isNil(min)) return `The field "${label}" exceeds maximum of "${max}" or is below minimum of "${min}"`;
    if (!_.isNil(max)) return `The field "${label}" exceeds maximum of "${max}"`;
    if (!_.isNil(min)) return `The field "${label}" is below minimum of "${min}"`;
}
function NumberField({ field, controls: { control, errors, getValues } }) {
    const classes = useStyles();
    const maxLength = 10;
    const min = _.get(field, 'range.min');
    const max = _.get(field, 'range.max');
    const onChange = _.get(field, 'onChange');
    return (
        <Box className={classes.field}>
            <Controller
                {..._.omit(field, ['restrictRangeInput', 'range', 'onChange'])}
                as={(
                    <TextField
                        onInput={e => _.isFunction(onChange) && onChange(_.get(e, 'target.value'))}
                        type='number'
                    />
                )}
                control={control}
                defaultValue={formatDefaultValue(field)}
                rules={{
                    required: field.required,
                    maxLength,
                    validate: () => {
                        const stringValue = getValues(field.name);
                        const value = _.parseInt(stringValue);
                        if (_.parseInt(min) && value < min) {
                            return false;
                        }
                        if (_.parseInt(max) && value > max) {
                            return false;
                        }
                    },
                }}
            />
            {field.field in errors && _.eq(errors[field.field].type, 'maxLength') && (
                <Box className={classes.error}>
                    {`Exceeded maximum digit limit of "${maxLength}"`}
                </Box>
            )}
            {field.field in errors && _.eq(errors[field.field].type, 'validate') && (
                <Box className={classes.error}>
                    {getRangeErrorMessage(field.label, min, max)}
                </Box>
            )}
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

NumberField.propTypes = {
    field: PropTypes.object.isRequired,
    controls: PropTypes.object.isRequired,
};

export default NumberField;
